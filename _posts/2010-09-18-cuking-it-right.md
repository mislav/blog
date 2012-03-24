---
title: You're cuking it right
description: Real-world lessons for writing better Cucumber stories
layout: post
categories: ruby Rails
tags: testing
---

<i>This post is inspired by ["You're cuking it wrong"][wrong] by Jonas Nicklas, and [Elisabeth Hendrickson's][testobsessed] talk on writing clear acceptance tests during [GoGaRuCo&nbsp;2010][gogaruco].</i>

Here are some quick lessons in real-world [Cucumber][] story writing.

## Avoid 'within' steps with CSS selectors

If you've read the aforementioned blog post by Jonas, you got a pretty good idea why this is wrong:

    Then I should see "Hello world" within "h1"

Acceptance tests should be readable by non-developers involved in the project. Try to express this step in a sentence which you would use while talking to a human:

    Then I should see "Hello world" in the title

Of course, this is a custom step. In order to reduce clutter while implementing custom steps under the hood (i.e. on the Ruby side), I've devised this scheme for mapping step sentence endings to CSS selectors:

{% highlight ruby %}
# within_steps.rb
{
  'in the title' => 'h1, h2, h3',
  'as a movie title in the results' => 'ol.movies h1',
  'in a button' => 'button, input[type=submit]',
  'in the navigation' => 'nav'
}.
each do |within, selector|
  Then /^(.+) #{within}$/ do |step|
    with_scope(selector) do
      Then step
    end
  end
end
{% endhighlight %}

This short snippet constructs a few regular expressions that allow you to write any of the existing steps and end them with "in the title", "in a button" or scope them to a certain selector.

## Dealing with multiple items on a page

When a web page lists multiple items on the same page—e.g. movies, books, search results—you need fine-grained control over which element your steps are interacting with, but you also need a way to express that in a natural way. I tackled this problem using a variation of the technique described previously.

Here is the HTML structure of movies returned by a search:

{% highlight html %}
<ol class="movies">
  <li class="movie">
    <a href="...">
      <img src="...">
      <h1>The Terminator</h1>
      <span class="year">(<time>1984</time>)</span>
    </a>
    <aside>...</aside>
  </li>
  
  <li class="movie">...</li>
  ...
</ol>
{% endhighlight %}

I scope to a specific movie by referencing its title:

    Then I should see "(1984)" for the movie "The Terminator"
    And I should see 'This movie is in your "to watch" list.' for that movie
    But I should not see a "Want to watch" button for that movie

    # implementation:
    When /^(.+) for the movie "([^"]+)"$/ do |step, title|
      @last_movie_title = title
      within ".movie:has(a h1:contains('#{title}'))" do
        When step
      end
    end

    When /^(.+) for that movie$/ do |step|
      raise "no last movie" if @last_movie_title.blank?
      When %(#{step} for the movie "#{@last_movie_title}")
    end

The "for the movie …" regular expression will match any step that ends with that expression, scope it to a movie that has the given string in the title, and execute the step normally. The movie title is stored in an instance variable that lets me use "for that movie" steps later on.

## Logging in without going trough the login form process

In a typical application, most of the steps depend on a certain user being logged in. Some of the stories need to describe the login process in detail, but most don't. Filling out the login form for every scenario across all your stories creates unnecessary overhead in runtime.

To skip the login process almost completely, I created a 'backdoor' route that logs any user by their username instantly:

    Given I am logged in as @mislav

{% highlight ruby %}
  # implementation
  Given /^I am logged in as @(\w+)$/ do |username|
    visit "/login/#{username}"
    @current_user = User.find_by_login(username)
  end

  # config/routes.rb
  if Rails.env.cucumber?
    map.login_backdoor '/login/:username',
      :controller => 'sessions', :action => 'backdoor'
  end

  # in the controller
  class SessionsController < ApplicationController

    # for cucumber testing only
    def backdoor
      logout_killing_session!
      self.current_user = User.find_by_login!(params[:username])
      head :ok
    end

  end
{% endhighlight %}

## Have your steps support multiple users doing the described action

If you find yourself repeating the same action for multiple users, or a single user doing the same action on multiple items, consider implementing your steps in a way in which they support these plural forms. An example, here is an overly verbose background section, refactored:

    # before (very bad):
    Background: 
      Given the following confirmed users exist
        | login  | locale   |
        | balint | it       |
        | pablo  | es       |
        | james  | en       |
      Given the following conversations exist in the project "Testing" owned by mislav
        | name     | body     |
        | Politics | Discuss! |
      Given "balint" is watching the conversation "Politics"
      Given "pablo" is watching the conversation "Politics"
      Given "james" is watching the conversation "Politics"

    # after (better):
    Background: 
      Given a project with users @balint, @pablo, @mislav and @james
      And @balint has his locale set to Italian
      And @pablo has his locale set to Spanish
      ...
      Given I started a conversation named "Politics"
      And the conversation "Politics" is watched by @balint, @pablo and @james

To support lists like "@balint, @pablo and @james", I implement the steps this way:

{% highlight ruby %}
Given(/^a project with users? (.+)$/) do |users|
  @current_project = Factory(:project)

  each_user(users, true) do |user|
    # make the user a member of the @current_project
  end
end
{% endhighlight %}

The `each_user` helper parses out any string in search of usernames, finds those users and yields the block for each one:

{% highlight ruby %}
# features/support/usernames.rb
module ManyUsernames
  def each_user(usernames, factory = false)
    usernames.scan(/(?:^|\W)@(\w+)/).flatten.each do |name|
      user = User.find_by_login(name)
  
      unless user
        if factory
          Factory.create(:user, :login => name)
        else
          raise "can't find user with login '#{name}'" unless user
        end
      end
  
      yield user
    end
  end
end

World(ManyUsernames)
{% endhighlight %}

If you take care while making the regular expression, you can easily have it also support the singular form. The project factory step supports the single member form:

    Given a project with user @mislav

## More reading

* ["Writing Maintainable Automated Acceptance Tests"][dale] by Dale Emery (PDF)

[wrong]: http://elabs.se/blog/15-you-re-cuking-it-wrong
[gogaruco]: http://gogaruco.com/ "Golden Gate Ruby Conference"
[testobsessed]: http://testobsessed.com/ "Elisabeth Hendrickson's thoughts on Agile, Testing, and Agile Testing."
[cucumber]: http://cukes.info/
[dale]: http://dhemery.com/pdf/writing_maintainable_automated_acceptance_tests.pdf
