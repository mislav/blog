---
permalink: /rails/haxor-backdoor-in-development/
title: Haxor backdoor in development
layout: post
categories: Rails git
tags: dated
description: Handy tip on installing a backdoor to skip authentication in development
---

I’m tired of logging in to my application in development mode. It’s on my local machine, so it doesn’t have to be secure, anyway. Wouldn’t it be great if the app would automatically authenticate me in when I click on “Sign in”?

    class SessionsController < ApplicationController
    
      before_filter :haxor_backdoor, :only => :new
    
      # ...
    
      protected
    
        def haxor_backdoor
          if Rails.env.development?
            email = `git config --global user.email`.chomp
            self.current_user = User.find_by_email(email)
            redirect_to(:back) if logged_in?
          end
        end
    
    end

This will work if you have git setup and if you’re using restful authentication, or any other authentication scheme that provides the `current_user` setter and a `logged_in?` helper.


