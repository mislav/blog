---
title: "Rails 2.0: taking the plunge"
layout: post
category: rails
---

With the [Rails 2.0 “preview release”][1] out and all the buzz, you might be thinking of checking out what is it all about. If you were planning to upgrade to Rails 2.0, these notes will help you with switching your existing application to use the latest version of this fantastic framework.

_Before_ proceeding to the installation, **run unit tests** against your application. Take a note of if they all passed and, if you were less fortunate, which tests fail. You will compare these results with the ones after the switch.

## Installation

If your application is using Rails 1.2.3, you’re probably set up to use Rails gems. You’ll find out that you can easily install the “preview release” gem by specifying explicit source after the `gem install` command.

    gem install rails --source http://gems.rubyonrails.org

This isn’t the only way of updating, however. You can _freeze_ a particular application to 2.0 PR by using the `rails:freeze:edge` built-in Rake task.

    rake rails:freeze:edge TAG=rel_2-0-0_PR

This will copy the whole framework to `vendor/rails`. **There is a caveat with this approach if you’re switching from Rails 1.2.3.** A new framework called _Active Resource_ has been added to the Rails bundle, which older Rails releases know nothing about. So, in the first run, Rails will export all components except ActiveResource, which it will later search for and _fail miserably_ with these (misleading) messages:

    warning: already initialized constant OPTIONS
    undefined method `options' for []:Array (NoMethodError)
    ... [confusing stack trace] ...

This happens when you try to start Mongrel after freezing your app to 2.0 PR. A simple solution is to repeat the `rake rails:freeze:edge ...` command; ActiveResource will get downloaded then. Other solution might be to first upgrade to Rails 1.2.4 or higher.

The third solution might be for all you adventurous ones (_and_ me): checking out the actual trunk to a single location on your computer.

    svn co http://svn.rubyonrails.org/rails/trunk ~/projects/rails/edge

Now you have a working copy of edge Rails that you can update with Subversion at your convenience. Next, go to your application and _symlink_ that fresh checkout from `vendor/rails` (this obviously doesn’t work on Windows):

    ln -Tvsf ~/projects/rails/edge vendor/rails

Your application is now bound to Rails trunk at you can keep “riding the Edge” until 2.0 final release. It only takes this:

    svn up vendor/rails/

What can be harder than that?

## Rails 2.0 automatized checker

Now, your application is switched to Rails 2.0 and there is a big chance that it is probably broken all over the place. First, check if your tests still pass:

    rake test

If they pass, great. If they don’t, don’t sweat (yet). You’ll probably figure out what it is in a minute. In fact, I’ve built an [awesome Ruby script that can help you finding what changed in Rails 2.0][2] that you might have missed. Tips on how to run the script on your project are in the comments at the top; check it out. Here is some sample output:

    Your application doesn't seem ready to upgrade to Rails 2.0. Please take a
    moment to review the following:
    
    -- old render methods ----------------------------------------------------------
    
      The old `render_{something}` API has been removed.  (changeset 7403)
    
      Change `render_action` to `render :action`, `render_text` to `render :text`
      (and so on) in your controllers.
    
      files:
      app/controllers/admin/export_controller.rb:4:  render_text "hello world"
    
    -- acts_as_tree ----------------------------------------------------------------
    
      acts_as_tree has been extracted from Rails core.  (changeset 7454)
    
        script/plugin install acts_as_tree
    
      files:
      app/models/page.rb:11:  acts_as_tree :order => 'virtual DESC, title ASC'

Here is a list some other things that my script checks for:

* `with_scope`;
* pagination;
* `template_root`;
* `scaffold`;
* `in_place_editor_field`;
* `auto_complete_field`;
* `acts_as_list`;
* `acts_as_nested_set`.

There are other gotchas I have come across so far:

1. [Rick Olson’s][3] widely popular [restful_authentication generator][4] has generated a call to `redirect_to_url` in `lib/authenticated_system.rb`. You will not be able to log in until you change `redirect_to_url` to `redirect_to`, since the former was deprecated and is now removed.
2. Are you using [Haml][5] and your templates suddenly render as _plain text_? You probably have <i>Globalize</i> or <i>Simple Localization</i> plugin installed. They hack into Rails ActionView in a way that is incompatible with Rails 2.0. Find a list of extensions in plugin sources that looks like this: `/.(rjs|rhtml|rxml|erb)$/`. Then add `haml` to that regular expression and restart the server. Alternatively, update the plugin you’re using; its authors might have fixed the issue already.

## Resources

* [Ruby script for automatically checking your apps for compatibility][2];
* [Rails 2.0 release notes][6];
* [“Rails 2.0 deprecations”][7] by Jakob Skjerning;
* [“Preparing for Rails 2.0”][8] on Sitepoint;
* [“Rails 2 Upgrade Notes”][9] on Slashdotdashdotslashdotdash… :)


[1]: http://weblog.rubyonrails.com/2007/9/30/rails-2-0-0-preview-release
[2]: http://pastie.caboo.se/private/krcevozww61drdeza13e3a
[3]: http://techno-weenie.net/
[4]: http://projects.wh.techno-weenie.net/browser/plugins/restful_authentication
[5]: http://haml.hamptoncatlin.com/
[6]: http://weblog.rubyonrails.org/2007/9/30/rails-2-0-0-preview-release
[7]: http://mentalized.net/journal/2007/03/13/rails_20_deprecations/
[8]: http://www.sitepoint.com/blogs/2007/10/31/preparing-for-rails-20/
[9]: http://www.slashdotdash.net/articles/2007/12/03/rails-2-upgrade-notes