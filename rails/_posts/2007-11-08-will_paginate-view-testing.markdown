---
permalink: /rails/will_paginate-view-testing/
title: will_paginate and view testing
layout: post
categories: Rails
tags: dated testing
description: How to properly test your views without hitting the database while using will_paginate.
---

While maintaining the [<i>will_paginate</i>][3] Rails plugin, I often saw people ask in various forums or mailing lists about testing their paginated views. (Most of the users are probably still unaware that [we have a support Google group now][4].) Since <i>Will Paginate</i> is probably the most popular plugin for pagination in Rails, I feel obligated to speak about testing so that even the under-experienced can start off using good practices.

Let’s remind ourselves what are the two phases of pagination. First we have the `paginate` method on models and ActiveRecord associations; it wraps the `find` method by adding limit and offset to the query. It also converts the result array to a ‘paginated collection’, which is an extended Array object that holds the information about current page, total number of pages and so on.

    @posts = Post.paginate(:page => params[:page], :per_page => 8, :order => 'published_at DESC')


The second phase is pagination in the view—rendering page links in your template. This couldn’t be simpler with the `will_paginate` helper:

    <%= will_paginate @posts %>


It reads all the information it needs from the collection and renders “Digg-style” pagination.

![Screenshot of the output of will_paginate](/page_attachments/0000/0001/will_paginate-output.png)

## How to test this

<i><strong>Imporant:</strong> upgrade the will_paginate plugin in your application to the most recent version.</i>

This belongs to functional tests if you use standard <i>&#8220;test/unit&#8221;</i> framework, or controller and view _specs_ if you practice behavior-driven development (BDD) with [RSpec][5]. But not only will I tell you what to test, I’ll also tell you up-front what **not** to test for. You should _not_ test the outcome of paginating finders or the `will_paginate` helper. These are <i>will_paginate</i> features and are already tested in the plugin’s extensive test suite.

Trusting the plugin to do its job takes a big load off our back. What I recommend is that you skip setting fixtures entirely because we don’t even have to hit the database—remember, we’re only testing controllers and views here.

Here is what the index action of your controller might look like:

    def index
      @posts = Post.paginate :page => params[:page], :order => 'created_at DESC'
    end


And the view:

    <% for post in @posts %>
      ... render the individual post somehow
    <% end %>
    
    <%= will_paginate @posts %>


This is what all of you are familiar with. I want to test the following:

1. that `Post.paginate` is called when I hit the `index` action;
2. that the `:page` parameter is used;
3. that the `@posts` instance variable is assigned;
4. that the pagination is being rendered when there are multiple pages.

Now, this is the basic functional test generated when you create a new scaffold in Rails 2.0:

    def test_should_get_index
      get :index
      assert_response :success
      assert assigns(:posts)
    end


It’s pretty simple and already covers requirement <b>3</b> on our list.

To check if `Post.paginate` is being called and to prevent it from actually doing the work it would usually do (query the database), I will use a concept called _mocking_. If you don’t know what mocking or stubbing is or how to use it, now is the right time to start learning. Don’t think it’s something very advanced that you don’t need yet—mocking can help you write better, isolated tests, which in turn makes you a better programmer.

The <i>&#8220;test/unit&#8221;</i> framework doesn’t have support for mocking out of the box, so I’m going to use [Mocha][6], easy installable as a gem. Since I’m using it, I’m gonna put this near the top of the file that we’re currently writing tests in:

    require 'mocha'


We have Mocha support now, let’s finish our test.

    def test_should_get_index
      # set up an expectation
      Post.expects(:paginate).with(:page => "2").returns([].paginate)
    
      get :index, :page => 2
      assert_response :success
      assert assigns(:posts)
    end


What happened here? We’ve set up an _expectation_. In the scope of the current test, we’re expecting the `paginate` method to be called on `Post` with given parameters. We’re also returning an empty paginated collection from that expectation by calling the `paginate` method on an Array instance. This is what Mocha provides us: we can ‘override’ any method on any object (or class) and set it up to return a custom value. The original method is never called, thus we never hit the database. Also, if the `Post.paginate` method never gets called here, the current test will fail—this is why we call it an ‘expectation’.

Note how we’re expecting it to be called with the `{:page => "2"}` hash, where “2” is a string and not a numeric value. This is because the controller gets current page value from `params` hash where each of the values is always a string.

All this will trick the controller into thinking it got an empty result set. Nevertheless, it gets saved in the `@posts` variable and our view gets rendered. Let’s copy this test into another, rename it and change the expectation to actually return some records:

    def test_should_get_index_with_data
      # create 5 empty posts:
      data = (1..5).map { Post.new }
      # it will be like we fetched them from the database:
      Post.expects(:paginate).with(:page => "2").returns(data.paginate)
    
      get :index, :page => 2
      assert_response :success
      assert assigns(:posts)
    end


This is getting pretty solid right here. Only one thing remains: testing if we rendered pagination links in our view. Pagination links only render when there is more than one page (otherwise `will_paginate` helper returns nil), but right now our mocked data, `data.paginate`, is a `WillPaginate::Collection` that allows 30 items per page, and we have only 5. That means it has only 1 page. Let’s lower the `:per_page` limit to 4 entries and test if there was a DIV rendered with a class name of “pagination”:

    def test_should_get_index_with_data
      data = (1..5).map { Post.new }
      Post.expects(:paginate).with(:page => "2").returns(data.paginate(:per_page => 4))
    
      get :index, :page => 2
      assert_response :success
      assert assigns(:posts)
      # this is what will_paginate should render by default:
      assert_select 'div.pagination'
    end


… And we’re done. We have tested everything we wanted, but we can still make them better.

Those experienced with mocking/stubbing may want to use mock objects instead of Post instances returned by our expectation. Because I don’t care what methods get called on those objects, I sometimes use `stub_everything` which creates an object that responds to _any_ method any number of times with `nil`.

    def test_should_get_index_with_data
      data = (1..5).map { |i| stub_everything("post##{i}", :class => Post, :id => i) }
      Post.expects(:paginate).with(:page => "2").returns(data.paginate(:per_page => 4))
    
      get :index, :page => 2
      assert_response :success
      assert assigns(:posts)
      # this is what will_paginate should render by default:
      assert_select 'div.pagination'
    end


It’s pretty important to stub the `class` method to return Post, otherwise if the view tries to generate a URL for the fake record it will fail with the following error:

    ActionView::TemplateError: undefined method `mocha_mock_path' for #<ActionView::Base:0xb70dd7b8>


Stubbing the `class` method as shown above will trick Rails into thinking that our fake object is actually a Post instance. RSpec users can use `mock_model(Post)` here because that method is created exactly for this purpose: creating fake `ActiveRecord::Base` model instances.

Finally, let’s extract this in a helper:

    def test_should_get_index
      expect_pagination_on Post, :page => "2"
      get :index, :page => 2
      assert_response :success
      assert assigns(:posts)
      assert_select 'div.pagination'
    end
    
    private
      # requires Mocha
      def expect_pagination_on(model, params = {:page => nil}, method = :paginate)
        data = (1..5).map { |i|
          stub_everything("#{model.name.underscore}##{i}", :class => model, :id => i)
        }
        model.expects(method).with(params).returns(data.paginate(:per_page => 4))
      end


## In conclusion

The key to isolated testing here was really the `paginate` method on arrays that let us quickly create `WillPaginate::Collection` instances that look like they’ve been returned from a database query. `Array#paginate` supports the same API as `paginate` for ActiveRecord models, but parameters other than `:page`, `:per_page` and `:total_entries` will simply be ignored.

You can create [`WillPaginate::Collection`][7] objects manually, too. They can help you out when making isolated tests in your own way, or when rolling out custom pagination in your application if the `paginate` finder is, for some reason, limiting for your needs; or when you need to paginate data sets other than from your models. Run `rake rdoc` while in will_paginate directory and you’ll get the most fresh API documentation you can learn a lot from.

Remember to visit [will_paginate Google group][4] if you have questions or suggestions for testing. See you there!

[3]: http://github.com/mislav/will_paginate/tree/master
[4]: http://groups.google.com/group/will_paginate
[5]: http://rspec.info/
[6]: http://mocha.rubyforge.org/
[7]: http://gitrdoc.com/rdoc/mislav/will_paginate/b3b0f593ea9b1da13a64bc825dfe17b6bbc2828b/classes/WillPaginate/Collection.html
