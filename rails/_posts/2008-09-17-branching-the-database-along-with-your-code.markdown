---
title: Branching the database along with your code
layout: post
category: rails
description: A sample Rails configuration to enable moving your database along with your real branches.
---

If you’re doing all your development on the “master” branch, you’re not using git. It’s fine to stick to master if you’re only learning git, but soon you’ll have to dive into non-linear development. Branches have many uses, depending on the engineering methodology your team practices, but the most common are:

1. Personal branches to develop a single feature or fix a bug before the changes are ready to be merged to master and pushed upstream;
2. Shared feature branches for experimental features so everybody can try them out and contribute;
3. Version branches for stable versions of the software, which later receive bug fixes picked from the mainline branch (master).

But, when your application uses a database, sometimes you’ll run into the problem of your code rapidly changing when you switch between branches while your database schema stays the same, thus breaking your application in development. Not fun at all.

Today I got tired of this and hacked up a way to remedy it.

<h2 id="problem">&#8220;Branch like a tree&#8221;</h2>

Here’s a simple demonstration of the problem. Imagine that your job today is to replace the old, plain-text way of storing passwords in the database with a new one that stores salted, encrypted passwords.

1. Start off a new branch: `git checkout -b authentication`.
2. Make a migration that replaces the old “password” field with “salt” and “crypted_password” and migrates existing passwords.
3. Adjust the User model code: make a callback that generates a random salt for new users, handle hashing of passwords on every password update.
4. Migrate the database.
5. Write tests for this new functionality.
6. After you’ve commited everything, get back to the mainstream branch (`git checkout master`) to pull and check on something your coworkers have been doing in the meantime.
7. **BOOM!** Discover that login is broken locally because of the changes to database schema you’ve just done.

It’s easy to forget that, when you switched back to master, the mainstream code still expects to query the database by the “password” field. Now you have to undo your migration in order to work on master for a while. When you get back to “authentication” branch, you have to migrate up again … and this quickly ruins your day.

<h2 id="solution">Take the database schema along for the ride</h2>

So what if we can “branch” the database together with our code?

    # start a new feature:
    $ git checkout -b authentication
    
    # mark that the branch should have its own database:
    $ git config branch.authentication.database true
    
    # branch the database (I'm using a Thor task for MySQL)
    $ thor git:db:clone
    
    # Now my app is switched to a new database called
    # "myapp_development_authentication". I can make changes
    # to its schema, because when I check out master I'm
    # magically back on "myapp_development" again.

I found all this trivial to implement by subclassing Rails::Configuration and adding a bit of logic to the method that retrieves database configuration from “config/database.yml”. Simply make this tweak to your “environment.rb”:

    # Bootstrap the Rails environment, frameworks, and default configuration
    require File.join(File.dirname(__FILE__), 'boot')
    require 'git_conf'
    
    Rails::Initializer.run(:process, GitConf.new) do |config|
      # ...
    end

_Note: this solution is not tested with Rails versions prior to **2.1.1** and therefore might not work._

You can find [full code for **GitConf** (and the Thor task for MySQL) on this gist][1]. Main functionality requires Grit (“mojombo-grit” gem from GitHub) to inspect the repository and Thor (“wycats-thor”) for the clone task.

<h2 id="rebasing">Rebasing and merging</h2>

The code above also allows for two concepts tightly related to branching: rebasing and merging. Turns out rebasing your branch is fairly easy:

    $ git checkout master
    $ git pull
    $ git checkout authentication
    $ git rebase master
    
    # clone "myapp_development" into "myapp_development_authentication" again:
    $ thor git:db:clone --force
    $ rake db:migrate

This destroys the data you may have entered while working on the “authentication” branch, but we’re in development anyway.

Now, when you’re ready to merge changes from “authentication” to “master” of course there is no way to merge “myapp_development_authentication” database into “myapp_development”, but you only need the schema changes, right?

Rails 2.1 features _timestamped migrations_ which are very convenient for non-linear development. Simply `git merge authentication` while on the master branch and run `rake db:migrate`. Rails will figure out what migrations have come from the merged branch and run them to bring you to the latest state of your database schema.


[1]: http://gist.github.com/11264