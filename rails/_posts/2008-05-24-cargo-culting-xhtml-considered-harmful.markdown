---
permalink: /rails/cargo-culting-xhtml-considered-harmful/
title: Use HTML 4 in your application
layout: post
description: Cargo-culting XHTML is bad. Use HTML 4 in your Rails apps.
categories: Rails frontend
tags: dated HTML
---

When you set up an application, Rails outputs XHTML by default.

[It is no secret][1] that [sending XHTML as text/html MIME type is bad][2]. XHTML output has been opposed numerous times on the [Rails core mailing list][3], but the complaints have been falling on deaf ears. Rails wants to be cool and that’s why they want to use technologies that seem most hip.

But, using XHTML in your app is as hip as sawing off the roof of your [1985 Yugo][4] and pretending it’s a Cadillac.

That’s why [Haml 2.0][5] supports HTML 4 output. Here is how you can enable it:

    Haml::Template::options[:format] = :html4
    
    module StandardistaHelper
      # override tag helper from Rails to disable self-closing tags
      # (there is no such thing in HTML)
      def tag(name, options = nil, open = false, escape = true)
        "<#{name}#{tag_options(options, escape) if options}>"
      end
    end
    
    ActionView::Base.send :include, StandardistaHelper

Now, instead of sticking this in your environment.rb, you can install the [Standardista plugin][6] I just released. You only need Haml 2 included in your app (I prefer using the gem). [View the source][7] to see what Standardista does (it’s simple).

Test it with a Haml layout like this one:

    !!! strict
    %html
      %head
        %title Standardista test
        %meta{ :content => "text/html; charset=utf-8", "http-equiv" => "Content-type" }
        = stylesheet_link_tag 'application'
      %body
        = yield

The result should:

* have HTML 4.01 Strict DOCTYPE;
* not render self-closing tags for META, LINK, IMG, BR (and such) elements.

In production, your HTML and CSS will also be smaller (have less whitespace) and therefore load quicker.


[1]: http://www.b-list.org/weblog/2008/jun/18/html/  "Why HTML"
[2]: http://hixie.ch/advocacy/xhtml
[3]: http://groups.google.com/group/rubyonrails-core  "Ruby on Rails core Google Group"
[4]: http://www.time.com/time/specials/2007/article/0,28804,1658545_1658533_1658529,00.html  "1985 Yugo GV among the worst 50 cars of all time"
[5]: http://nex-3.com/posts/76-haml-2-0
[6]: http://github.com/mislav/standardista/tree/master
[7]: http://github.com/mislav/standardista/tree/master/lib/standardista.rb