---
permalink: /rails/validations-in-any-class/
title: Validations in any class
layout: post
categories: Rails
tags: dated
---

Sometimes you don’t need database persistence for your models. Ryan Bates describes this as [the non-ActiveRecord model][1] in his screencasts.

What if you need _validations_? I’ve tried it, thinking that I only need to mix-in [ActiveRecord::Validations][2] module:

    class Person
      attr_accessor :name, :age
      include ActiveRecord::Validations
      validates_presence_of :name
    end

It turned out this doesn’t work. The Validations module expects our class to look like an ActiveRecord::Base subclass—at least to _some_ extent. But, with a few methods more, we can easily make this happen.

<h2 id="working-code">The working code</h2>

At `include` time, the Validations module of Rails 2.1 expects these methods to be defined:  
`save`, `save!`, `update_attribute` and `new_record?`.

Here is the code for a minimal model that uses validations:

    class Person
      attr_accessor :name, :age
    
      def initialize(attrs = {})
        for key, value in attrs
          update_attribute(key, value)
        end
        @new_record = true
      end
    
      def save
        # your saving logic goes here
        # ...
        @new_record = false
        return true # if saving was a success
      end
    
      alias :save! :save
    
      def update_attribute(key, value)
        send "#{key}=", value
      end
    
      def new_record?() @new_record; end
    
      # the fun part:
      include ActiveRecord::Validations
      validates_presence_of :name
    end

This class definition doesn’t raise errors. Let’s try it out:

    >> me = Person.new :age => 24
    => #<Person:0x212f5a0 @new_record=true, @age=23>
    >> me.save
    => false

Success! Validations refused to save the instance because the `name` attribute is missing:

    >> me.name = "Mislav"
    => "Mislav"
    >> me.save
    => true
    >> me.new_record?
    => false

Of course, we can inspect the validation error messages in a way identical to doing it in ActiveRecord. Your custom view helpers for displaying validation errors should continue working without modifications.


[1]: http://railscasts.com/episodes/121-non-active-record-model
[2]: http://api.rubyonrails.org/classes/ActiveRecord/Validations.html