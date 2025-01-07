---
title: "Speeding up Travis CI builds"
description: >
  Demonstrating a simple script that uses Amazon S3 to cache gem dependencies
  between Travis CI builds which greatly speeds up the build process.
layout: post
categories: ruby
tags: dated
---

[Travis CI added a feature to cache dependencies][1] between builds for their
paying customers. In projects where resolving and fetching dependencies is a
slow operation--e.g. in any Ruby project--this can _shave a significant
amount off total build time_, resulting in faster feedback from CI for the
developer. This post explores a DIY method of providing such a cache to _open
source projects as well_.

<ins>**Update:** Since this post was published, Travis CI [enabled caching
dependencies for open source projects][10] as well.</ins>

This is not a new idea. Michał Czyż famously posted a tip how to [Speed up
Travis-CI build preparation][2] on Coderwall. Two projects on GitHub,
[bundle_cache][3] and [travis_bundle_cache][4], implement the pattern of caching
the results of `bundle install` to Amazon S3. However, both projects depend on
the aws-sdk library, which in turn depends on Nokogiri and JSON libraries that
have native extensions to be compiled. As a result, installing the library that
is _supposed_ to speed up your build time is **still slow**, and this is
unnacceptable.

[WAD][5] by Manfred Stienstra is another Ruby solution, but it _doesn't_ depend
on aws-sdk and is a standalone script that you can vendor in your project.
This is great because it frees you from having to `gem install` anything.

However, I wanted to go a step further and explore whether we need Ruby at all,
or can the whole process be handled by a simple shell script and utilities
available on a stock Unix system.

The result is the `cached-bundle` script whose entire core logic can be seen
below. It delegates the Amazon S3 upload logic to a separate `s3-put` script:

{% highlight bash %}
cache_name="${TRAVIS_RUBY_VERSION}-${gemfile_hash}.tgz"
fetch_url="http://${AMAZON_S3_BUCKET}.s3.amazonaws.com/${TRAVIS_REPO_SLUG}/${cache_name}"

if download "$fetch_url" "$cache_name"; then
  tar xzf "$cache_name"
fi

bundle "$@"

if [ ! -f "$cache_name" ]; then
  tar czf "$cache_name" vendor/bundle
  script/s3-put "$cache_name" "${AMAZON_S3_BUCKET}:${TRAVIS_REPO_SLUG}/${cache_name}"
fi
{% endhighlight %}

The cache key is constructed from the Ruby version and MD5 sum of
`Gemfile.lock`. If any of these change, it's considered a cache miss and gem
dependencies will be fetched and installed normally.

You can fetch the [cached-bundle][6] and [s3-put][7] scripts, which combined
weigh less than 70 lines of code.

The dependencies of these scripts are:

* An Amazon S3 bucket in the default region
* Amazon access credentials via environment variables (see below)
* `Gemfile.lock` checked into version control
* `openssl`
* `curl`

To enable caching of Bundler dependencies, add the scripts to the `script/`
directory of your project and add this to `.travis.yml`:

{% highlight yaml %}
install: script/cached-bundle install --deployment
env:
  global:
  - AMAZON_S3_BUCKET=my-bucket
  - AMAZON_ACCESS_KEY_ID=MYACCESSKEY
  - secure: "..."
{% endhighlight %}

...where `secure:` value is obtained by means of the offical `travis` CLI tool:

    $ travis encrypt AMAZON_SECRET_ACCESS_KEY="..."

That's it! The caching of gem dependencies this way **resulted in a >1 minute
speedup per build** in a project with a [relatively small gem bundle][9].

`s3-put` is useful for _more than just caching dependencies_. ruby-build, for
instance, uses Travis CI and this script to keep its [Ruby download mirror][8]
up to date whenever someone adds a new version of Ruby to the project.


[1]: http://about.travis-ci.org/blog/2013-12-05-speed-up-your-builds-cache-your-dependencies/
[2]: https://coderwall.com/p/x8exja
  "Speed up Travis-CI build preparation time by 800%"
[3]: https://github.com/data-axle/bundle_cache
[4]: https://github.com/collectiveidea/travis_bundle_cache
[5]: https://github.com/Fingertips/WAD
[6]: https://github.com/github/hub/blob/aadc8418d9e5dd27172d5d67c3da0bd2fdcf759a/script/cached-bundle
[7]: https://github.com/github/hub/blob/aadc8418d9e5dd27172d5d67c3da0bd2fdcf759a/script/s3-put
[9]: https://github.com/github/hub/blob/aadc8418d9e5dd27172d5d67c3da0bd2fdcf759a/Gemfile.lock
[8]: https://github.com/sstephenson/ruby-build/blob/458d3331675f9f35517cfb095489496eff785aa3/script/mirror
[10]: http://docs.travis-ci.com/user/caching/

<script>
if (document.querySelectorAll) {
  var i, el, els = document.querySelectorAll('.highlight .l-Scalar-Plain')
  for (i = 0; i < els.length; i++) {
    el = els[i]
    if (el.nextSibling.textContent == ':')
      el.className = el.nextSibling.className = 'nv'
    else el.className = 's2'
  }
}
</script>
