---
title: How to do click hijack right
description: How to avoid hijacking clicks that would open new tabs or windows.
layout: post
categories: js frontend
---

Your task: make certain links perform their action via Ajax instead of letting the browser load another page.

Your solution with jQuery is usually something like this:

{% highlight js %}
// observe clicks on links matching a selector:
$(document).delegate('.items a', 'click', function(e) {
  // perform something asynchronously
  $.ajax(...)
  
  // prevent browser from following the link
  return false
})
{% endhighlight %}

This is a good start, but there's an important detail you're overlooking: *there's more than one kind of click*.

Various kinds of clicks are:

1. left click — normal
2. right click — contextual menu
3. middle click — open in new tab
4. key modifier + click — open in new tab/window

Key modifiers for left clicks are:

1. Ctrl — usually new tab on Windows, emulates right click on Mac
2. Shift — usually new window
3. Cmd, Cmd+Shift — new tab on Mac

**The bad news is:** behavior of all these combinations varies across browsers and platforms. Sometimes you are not able to even *prevent* the default browser behavior such as opening the contextual menu, new tab or new window. Browsers also differ in which of these conditions they actually *publish* the "click" event apart from the usual "mousedown" + "mouseup" combo (for instance, WebKit won't trigger the "click" event on right click).

**The good news is:** you only care about the normal left click. If your users choose to open links in new tabs or windows you shouldn't stand in their way. So, the only thing you need to fix in your code is to detect the normal left click.

## The solution

When hijacking links to replace them with Ajax functionality, make sure you handle only left clicks with no keyboard modifiers:

{% highlight js %}
// jQuery
function(e) {
  if (e.which == 1 && !e.metaKey && !e.shiftKey) {
    $.ajax(...)
    return false
  }
})

// Prototype.js
function(e) {
  if (e.isLeftClick() && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
    new Ajax.Request(...)
    e.stop()
  }
})
{% endhighlight %}

Any functionality you add like this will also work on touch devices, which trigger the left mouse "click" event when tapped.

It might be a good idea to turn this into a reusable helper function in your app.
