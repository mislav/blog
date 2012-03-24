---
permalink: /js/when-available-in-prototype/
title: A Prototype trick — “When available, do.”
layout: post
categories: js Prototype.js
tags: dated
description: A tiny helper that fits nicely in your code while doing unobtrusive scripting
---

Unobtrusive page initialization is great. You can set up a handler that gets executed on page load, check for various elements and then do operations ranging from simple things like hiding (and then be shown later) to complex setup or iteration over a collection of nodes.

I will share with you a little trick I’ve been using a lot in my page load handlers. It’s a tiny snippet of code that captures the described pattern quite nicely.

When I start a project, I usually have one file—<i>application.js</i>— included after <i>prototype.js</i> on all pages. In it I define the behavior of elements, set up event handling, etc. This is a skeleton of how it usually looks like:

    window.onload = function() {
      var form = $("edit_item")
      if (form) {
        // hide it initially; some other code will show it
        // based on user interaction:
        form.hide()
      }
    
      // check if there is a login form, also:
      var login = $$("form#login").first()
      if (login) {
        login.focusFirstElement()
      }
    }

You can already recognize the pattern: try to find a node by ID or CSS selector, check if the element is there and then do something with it. I like to write it like this:

    // observe the DOMContentLoaded event; it's better practice than onload
    document.observe("dom:loaded", function() {
      when("edit_item", function(form) {
        form.hide()
      })
    
      // check if there is a login form, also:
      when("form#login", function(login) {
        login.focusFirstElement()
      })
    })

I’m using [Prototype 1.6][1], but the trick is I’ve added the `when` function. It is in fact very short:

    // When object is available, do function fn.
    function when(obj, fn) {
      if (Object.isString(obj)) obj = /^[\w-]+$/.test(obj) ? $(obj) : $(document.body).down(obj)
      if (Object.isArray(obj) && !obj.length) return
      if (obj) fn(obj)
    }

This is how it behaves:

* if passed in a string that _looks_ like an ID (only letters, digits, underscore and dash), it calls `$()` with it;
* for other strings it assumes it’s a _CSS selector_ and will try to find the first element matching it in the document;
* if passed in an array, it checks that it is not empty;
* when passed anything else, it just has to evaluate to `true`;
* the given function will be called with the object as argument **if it is available**.

Let’s see how it can be useful with collections:

    // let's pretend we want to initialize a calendar select widget
    when($$("input[type=text].date"), function(dateInputs) {
      // this will happen only if there are any date inputs
      var format = "%Y-%m-%d", calendarIcon = "/images/icons/calendar.png"
    
      dateInputs.each(function(input) {
        // initialize each input ...
      })
    })

Wrapping the initialization specific to date inputs is nice because everything happens in a closure and doesn’t clutter up your main scope where you do most of the work. But of course, if you _don’t_ need initialization before iteration you can simply write it like this:

    // even if there are no matching elements, nothing will happen
    // (no errors will be raised)
    $$("input[type=text].date").each(function(input){ ... })

So, sometimes we need the `when` function and sometimes not. But only _you_ can decide about the right approach when presented with a particular problem. I’m sure this might inspire you to recognize and extract some of the patterns of your own.


[1]: http://prototypejs.org/2007/10/16/prototype-1-6-0-rc1-changes-to-the-class-and-event-apis-hash-rewrite-and-bug-fixes