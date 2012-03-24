---
permalink: /rails/specify-your-dependencies-with-capistrano/
title: Specify your dependencies with Capistrano
layout: post
categories: Rails
tags: dated
description: Explaining the "deploy:check" built-in task in Capistrano and how it can help preparing your deployment.
---

There is this one cool trick with [Capistrano][1]: the `deploy:check` task. I’ve known about it for a while; it does a great job at sanity-checking your deployment environment: existence of directories, write permissions etc. What I learned only recently is that you can specify your own, _custom dependencies_.

Straight from Capistrano docs:

    You can define your own dependencies, as well, using the `depend' method:
    
      depend :remote, :gem, "tzinfo", ">=0.3.3"
      depend :local,  :command, "svn"
      depend :remote, :directory, "/u/depot/files"

Let’s give it a shot, will we? I’ve got a number of dependencies on one of my apps:

    depend :remote, :gem, "slave", ">=1.2"            # because of BackgrounDRb
    depend :remote, :gem, "hpricot", ">=0.6"
    depend :remote, :gem, "feed-normalizer", ">=1.4"  # I'm fetching feeds
    depend :remote, :gem, "soap4r", ">=1.5"           # querying the Clearforest service

The above, of course, goes into your `config/deploy.rb`. Let’s check it out:

    ~/projects/myapp $ cap deploy:check

Seconds later, you might be presented with the following:

    The following dependencies failed. Please check them and try again:
    --> gem `slave' >=1.2 could not be found

_So awesome._ Now you can employ this little fella for the task :)

<img src="/page_attachments/0000/0019/500-fix-it.jpg" alt="Cat fixes it" style="display:block; margin-bottom:.5em">

It’s also useful to check presence of certain directories. I’m running apps on edge mostly, so naturally I have a single Rails checkout on each box that I symlink from `vendor/rails`. Let’s teach Capistrano how to do it:

    # (irrelevant parts of config/deploy.rb recipe excluded)
    set :deploy_to, "/home/mislav/rails/#{application}/"
    
    # the svn checkout of the framework (always kept fresh)
    set :framework_path, "/home/mislav/rails/edge/"
    
    # tell 'deploy:check' task to look for it
    depend :remote, :directory, framework_path
    
    after 'deploy:update_code' do
      run "ln -nfs #{framework_path} #{release_path}/vendor/rails" 
    end

Sweet. Now take it from here ;)


[1]: http://www.capify.org/
[2]: http://twitter.pbwiki.com/Cats