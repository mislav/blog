---
title: "Understanding binstubs"
description: >
  Taking a closer look at the role of RubyGems, Bundler and other binstubs.
layout: post
categories: ruby, shell
---

<i>This is an excerpt from the [Understanding binstubs][] guide I wrote on the
[rbenv wiki][].</i>

## Project-specific binstubs

When you run `rspec` within your project's directory, rbenv can ensure that it
will get executed with the Ruby version configured for that project. However,
nothing will ensure that the right *version of RSpec* gets activated; in fact,
RubyGems will simply activate the latest RSpec version even if your project
depends on an older version. In the context of a project, this is unwanted
behavior.

This is why `bundle exec <command>` is so often needed. It ensures the right
versions of dependencies get activated, ensuring a consistent ruby runtime
environment. However, `bundle exec` is a pain to always have to write.

### Bundler-generated binstubs

Bundler can install binstubs in your project for all executables contained in
the current bundle.

    bundle install --binstubs

This creates, among others, `./bin/rspec` (simplified version shown):

{% highlight rb %}
#!/usr/bin/env ruby
require 'rubygems'
# Prepares the $LOAD_PATH by adding to it lib directories of all gems in the
# project's bundle:
require 'bundler/setup'
load Gem.bin_path('rspec-core', 'rspec')
{% endhighlight %}

RSpec can now be easily called with `bin/rspec`.

If you go one step further and prepend `./bin` to your $PATH, you can simply
call `rspec` instead of `bin/rspec`. This is recommended so that you are able to
launch RSpec the same way in a context of a project and outside of it.

### Manually created binstubs

Now that you know that binstubs are simple scripts written in any language and
understand their purpose, you should consider creating own binstubs for your
project or your local development environment.

For instance, in the context of a Rails application, a manually generated
binstub to run Unicorn could be in `./bin/unicorn`:

{% highlight rb %}
#!/usr/bin/env ruby
require_relative '../config/boot'
load Gem.bin_path('unicorn', 'unicorn')
{% endhighlight %}

Using `bin/unicorn` now ensures that Unicorn will run in the exact same
environment as the application: same Ruby version, same Gemfile dependencies.
This is true even if the binstub was called from outside the app, for instance
as `/path/to/app/current/bin/unicorn`.

## Further reading

* [Understanding binstubs][] - full article on rbenv wiki
* [Unix shell initialization][] - useful facts about shell config files and
  `$PATH`


  [Understanding binstubs]: https://github.com/sstephenson/rbenv/wiki/Understanding-binstubs
  [Unix shell initialization]: https://github.com/sstephenson/rbenv/wiki/Unix-shell-initialization
  [rbenv wiki]: https://github.com/sstephenson/rbenv/wiki
