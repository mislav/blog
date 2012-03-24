---
permalink: /rails/branching-the-database-along-with-your-code/
title: Branching the database along with the code
layout: post
categories: Rails git
tags: db
description: Simple Rails configuration to enable switching your database as you change branches.
---

<i><strong>Note:</strong> this article and supporting code have been heavily simplified since their initial publication.</i>

If you’re doing all your development on the “master” branch, you’re not using git. It’s fine to stick to master if you’re only learning git, but soon you’ll have to dive into non-linear development. However, although git makes it very easy to quickly switch between branches while hacking on your Rails app, your app still connects to the same database in development *no matter what branch you're on*.

**Why is this a problem?** Well, suppose you're developing a feature that required you to change the database schema. You're doing this in a separate branch which we'll call "feature". Of course, on this branch you've written a migration and changed the model code to compensate for the schema change. So far so good. But, if you for whatever reason quickly switch to master to check out something, your app will be broken; although the changes in code have been reverted—they're safely stashed in the "feature" branch—the database still contains the incompatible schema change.

I solve this problem **by "branching" my database along with the code**. Whenever I make a branch in git in which I plan to change the database schema, I make *a copy of the development database* and configure Rails to connect to this new database *only* while I'm working on the branch in question.

It's fairly simple to set this up in "database.yml". Here is how it might have looked like before the changes:

    ## database.yml (before)
    development:
      # ... adapter/auth config ...
      database: myapp

I make this configuration a little more dynamic with some inline ruby:

    ## database.yml (after)
    <%
      # http://mislav.uniqpath.com/rails/branching-the-database-along-with-your-code/
      branch = `git symbolic-ref HEAD 2>/dev/null`.chomp.sub('refs/heads/', '')
      suffix = `git config --bool branch.#{branch}.database`.chomp == 'true' ? "_#{branch}" : ""
    %>
    development:
      # ... adapter/auth config ...
      database: myapp<%= suffix %>

The supporting code for this is a little messy, but all this does is looks up the name of the current branch and checks the `"branch.<name>.database"` configuration (a key which I made up) to see if we wanted to connect to a different database for this branch.

This code enables you to opt-in if you want to have a database for a specific branch. To configure the "feature" branch to have its own database, use git config:

    $ git config --bool branch.feature.database true

And while on the "feature" branch, our app will connect to the "myapp_feature" database instead of "myapp". If you go back to master branch (or any other, for that matter) and your app will connect to "myapp", like before.

We still need to make a copy the development database. Rails makes it easy to create the new database:

    $ git checkout feature
    $ rake db:create
    # (created myapp_feature db)

To initialize its schema, you either have to run `rake db:schema:load`, or copy everything (including data) from the current development database (example for MySQL):

    mysqldump -u root myapp | mysql -u root myapp_feature

Finally, remember to restart the app server when switching branches to give Rails a chance to reconnect to a different database.
