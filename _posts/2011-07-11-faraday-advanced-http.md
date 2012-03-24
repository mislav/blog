---
title: "Faraday: advanced HTTP requests made easy"
description: >
  If you use Ruby to perform any sort of HTTP requests, you
  might want to take a closer look at Faraday.
layout: post
categories: ruby
tags: API featured
---

[Faraday][] is a library for making HTTP requests and to serve as a
backbone for writing API wrapper libraries such as [twitter][].
It has an interesting philosophy, but to really appreciate it you must
first understand what problem it solves.

In the beginning, there was an ordinary HTTP request:

{% highlight ruby %}
require 'net/http'
data = Net::HTTP.get URI.parse('https://api.github.com/repos/technoweenie/faraday')
{% endhighlight %}

Here we're accessing [repository information from the GitHub
API][repoinfo]. This one line of code should suffice for your simplest
scripts, but it will never do for your production-ready apps. Just to
list several features that are missing here:

1. This request won't work. GitHub API v3 is only accessible over
   encrypted SSL and we need to explicitly configure Net::HTTP for this.
2. We don't check the HTTP response code. The server could respond with
   a 302&nbsp;(redirect), 401&nbsp;(unauthorized) or 500&nbsp;(server error).
4. We should always supply a User-Agent header with information about
   what's making these requests.
3. The response payload is JSON, so it needs to be parsed before use.

To handle all of the above, one line of code is now far from enough:

{% highlight ruby %}
require 'net/https'
require 'json'

url = URI.parse('https://api.github.com/repos/technoweenie/faraday')

response = Net::HTTP.start(url.host, use_ssl: true, verify_mode: OpenSSL::SSL::VERIFY_NONE) do |http|
  http.get url.request_uri, 'User-Agent' => 'MyLib v1.2'
end

case response
when Net::HTTPRedirection
  # repeat the request using response['Location']
when Net::HTTPSuccess
  repo_info = JSON.parse response.body
else
  # response code isn't a 200; raise an exception
  response.error!
end
{% endhighlight %}

This is closer to what I would consider to be a minimal boilerplate code for
proper requests.

But this still isn't enough. Sooner or later, you might also need to
to implement some of these more advanced concepts:

1. Limit following redirects to prevent infinite loops
1. Signing of requests with OAuth
2. Caching responses locally for a specific amount of time
3. HTTP caching with respect to Last-Modified and ETag header values
4. Fetching multiple resources in parallel
5. Parsing of response data with respect to Content-type
6. Logging performed requests and the time they took
7. Posting of JSON or XML payloads
8. Uploading files

Imagine implementing any of these features on top of existing code,
especially if it already shipped in form of an app or a reusable library.
The above code will get bloated and unmanegeable really fast.

Turns out, the Ruby community already solved this issue of bloat while
processing requests, only it happened in another field. The solution was
Rack middleware, and the field was request/response cycle of a web
application.

{% highlight ruby %}
# Rack middleware stack of a Rails app (simplified)
use ActionDispatch::Static
use Rack::Lock
use Rack::Runtime
use Rails::Rack::Logger
use ActionDispatch::ShowExceptions
use ActionDispatch::RemoteIp
use Rack::Sendfile
use ActionDispatch::Callbacks
use ActionDispatch::Cookies
use ActionDispatch::Flash
use ActionDispatch::ParamsParser
use Rack::MethodOverride
{% endhighlight %}

However, the amount of processing involved with the request/response
cycle isn't very much different when we switch sides in this exchange.
That's why the idea of middleware still works great if your app is the
one _making_ requests instead of receiving them.

## Faraday and the middleware paradigm

Faraday started out as an experiment by
<a href="http://techno-weenie.net/" rel="met colleague" title="technoweenie">Rick Olson</a>
to reuse the middleware paradigm of Rack, only this time for **performing**
requests instead of responding to them from a web app.

For example, this is how to setup a simple Faraday stack for basic use:

{% highlight ruby %}
require 'faraday'

conn = Faraday.new(:url => 'http://sushi.com') do |c|
  c.use Faraday::Request::UrlEncoded  # encode request params as "www-form-urlencoded"
  c.use Faraday::Response::Logger     # log request & response to STDOUT
  c.use Faraday::Adapter::NetHttp     # perform requests with Net::HTTP
end

response = conn.get '/nigiri/sake.json'     # GET http://sushi.com/nigiri/sake.json
response.body

conn.post '/nigiri', { :name => 'Maguro' }  # POST "name=maguro" to http://sushi.com/nigiri
{% endhighlight %}

Features of this stack is that it encodes POST/PUT parameters, logs what's
happening and performs requests with Net::HTTP (adapters for other HTTP
libraries are available).

Apart from logging, this basic stack doesn't give us much extra over
vanilla use of Net::HTTP. But the real beauty of Faraday is, even if you
already laid out `conn.get()`, `post()` or other requests in your codebase,
you can easily change how they are processed by adding or swapping
middleware of the stack.

Faraday middleware is written mostly the same way as Rack middleware.
Middleware is usually classes that define the `call(env)` method:

{% highlight ruby %}
class MyMiddleware
  def initialize(app, options = {})
    @app = app
    @options = options
  end

  def call(env)
    # information about the request is in the `env` hash
    $stderr.puts env[:url]
    # continue processing
    @app.call(env)
  end
end

# how to use it in a stack:
builder.use MyMiddleware, some_option: "value"
{% endhighlight %}

It's important to remember that, altough the middleware paradigm is
identical to Rack, the `env` hash is of another format. This is what
prevents us from using middleware original written for Rack in Faraday.

With a combination of built-in middleware, ones from 3rd-party libraries
and ones we write ourselves, we can easily create a stack that handles
all our present needs. For instance, to revisit our initial GitHub API use-case:

{% highlight ruby %}
require 'logger'
# we need a 3rd-party extension for some extra middleware:
require 'faraday_middleware'

conn = Faraday.new 'https://api.github.com/', ssl: {verify: false} do |c|
  c.use FaradayMiddleware::ParseJson,       content_type: 'application/json'
  c.use Faraday::Response::Logger,          Logger.new('faraday.log')
  c.use FaradayMiddleware::FollowRedirects, limit: 3
  c.use Faraday::Response::RaiseError       # raise exceptions on 40x, 50x responses
  c.use Faraday::Adapter::NetHttp
end

conn.headers[:user_agent] = 'MyLib v1.2'

response = conn.get '/repos/technoweenie/faraday'
response.body['issues_count']  #=> 8
{% endhighlight %}

As you can see, we consumed this API method in a much flexible way that
required much less code. Naturally, the custom middlewares still need to
be implemented, but they can reside in separate files, be reused and
get published as opensource.

With Faraday we can also easily switch from Net::HTTP to another HTTP library
such as Typhoeus that allows us to perform many requests in parallel if
that's our requirement. This requires little to no changes to our
existing code.

My favorite feature of Faraday is that if I'm using an opensource API
wrapper library that's implemented with Faraday, I can insert my own
middleware in its stack to add features that were not originally
present. For example, if I'm using a Twitter library I can add caching
to avoid hitting their API request limits.

A collection of Faraday middleware already exists on GitHub:
[faraday_middleware][]. It provides classes to parse JSON, XML, sign OAuth
requests, cache responses and more.

For the end, as an example of real-world Faraday use check out this simple
[Instagram client][instagram] I wrote to implement just a couple of endpoints
that I needed from the Instagram official API. Instagram already
provides an [official ruby library][instagram-ruby] that's also implemented
with Farady, but I created my own to see how minimal I can go so it can serve
as a good example of Faraday usage.

Consider Faraday next time when you find yourself consuming an API resource.
Even if you immediately won't have huge benefits in your particular
case, in the long run it will allow you to plug into that request/response
cycle later on and free you from significant code changes.


[faraday]: https://github.com/technoweenie/faraday
[twitter]: https://github.com/jnunemaker/twitter "Ruby library for Twitter API"
[repoinfo]: http://developer.github.com/v3/repos/ "GitHub API repository docs"
[instagram]: https://github.com/mislav/instagram/blob/fa63fb9/instagram.rb
[instagram-ruby]: https://github.com/instagram/instagram-ruby-gem "Instagram Ruby API library"
[rack]: http://rack.rubyforge.org/ "Rack: a Ruby Webserver Interface"
[faraday_middleware]: https://github.com/pengwynn/faraday_middleware
