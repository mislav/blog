---
title: "will_paginate v3.0: Rails 3, Sinatra and more"
description: "The long anticipated will_paginate 3.0 version is finally out."
layout: post
categories: ruby Rails
---

After more than a year in making, [will_paginate 3.0][wp] is finally out.

<a style="display:block;float:right;margin:0 0 1em 1.5em;border:1px solid silver;padding:1px" href="http://www.flickr.com/photos/ericmmartin/3274006362/" title="Book Heart Bokeh by Eric M Martin, on Flickr"><img src="http://farm4.static.flickr.com/3304/3274006362_4ecc2f67ac.jpg" width="400" style="display:block" alt="Book Heart Bokeh."></a> Notable new features are:

* Full **Rails 3.0 & 3.1 support**
* Active Record pagination powered **by Relations**
* **DataMapper and Sequel** integration
* **Sinatra and Merb** support
* **translating** with the i18n library
* *dropped support* for Rails versions 1.2 - 2.3 (keep using will_paginate 2.3 for that)


This release is *a complete rewrite* of will_paginate. It is backwards compatible for the most part, but you should read the [document listing all the changes since v2.3][changes] on the wiki.

Install it by adding to your Gemfile:

{% highlight ruby %}
# Gemfile
gem 'will_paginate', '~> 3.0'
{% endhighlight %}

Apart from the usual `paginate()` method, there is now a new, shorter `page()` method for pagination that feels more natural when working with Relations:

{% highlight ruby %}
@posts = Post.where(:published => true).page(1).order('created_at DESC')
{% endhighlight %}

## What took so goddamned long?

I'm very late in the game releasing a Rails 3 compatible version only now, I admit. The problem was burnout: I tried to make a compatible version when the first Rails 3.0 betas were out, but the codebase was so much in flux back then that the current development version of will_paginate was usually broken again only days after getting it working.

Also, will_paginate 2.3 *still* supports Rails versions 1.2, 2.0, 2.1, 2.2, and 2.3. So you can imagine the amount of work I did over the years to make the plugin work *and* fix the test suite every time between all of these Rails releases.

The test suite breakages were always the most depressing and difficult to fix. Over the course of time I grew wary of approaching will_paginate code because I always knew that tons of work awaits me just to make the test run again and then to fix will_paginate functionality to be *exactly like before*.

That's why, in this version, I decided to drop support for all old versions of Rails and throw out the complete test suite and start fresh with specs. It wasn't a small effort. But now it's done. The result is cleaner code and less hacks to beat Active Record into working.

## What's next for will_paginate

In the next releases I plan to cover the following:

* pagination without page links, only a "More" link for the next page
* pagination queries without offset, meaning faster execution in the database
* MongoDB pagination
* provide easier ways of customizing the HTML output

## My other projects

I wasn't slacking in the meantime. When I wasn't working on will_paginate, I maintained:

* [Faraday][] – a modern HTTP library
* [hub][] – command-line wrapper for git that's a must-have for GitHub
* [zepto.js][] – minimalistic, jQuery-compatible JavaScript library for modern browsers

So, check out the new will_paginate and these other projects, and happy paginating.

[wp]: https://github.com/mislav/will_paginate/wiki "will_paginate library"
[changes]: https://github.com/mislav/will_paginate/wiki/Backwards-incompatibility
[zepto.js]: http://zeptojs.com/
[hub]: http://defunkt.io/hub/ "hub command-line wrapper for git and GitHub"
[faraday]: http://mislav.uniqpath.com/2011/07/faraday-advanced-http/
