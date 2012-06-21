---
title: "Displaying line numbers"
description: >
  There's no reason for line numbers to be prominently displayed,
  neither in code snippets or your text editor.
layout: post
categories: Rails ruby
styles: |
  .figwrapper {
    display: inline-block;
  }
  figure {
    margin: 0 auto; padding: 0;
    position: relative;
    display: inline-block;
  }
  figure img {
    display: block;
    max-width: 100%;
    height: auto !important;
    margin: 0 auto;
  }
  figcaption {
    font-size: 90%;
    line-height: 1.5;
    display: block;
    position: absolute;
    left: 0; bottom: 0; right: 0;
    padding: .4em .6em;
    background-color: #333;
    background-color: rgba(0,0,0,.75);
    color: white;
    text-shadow: #000 1px 1px 1px;
  }
  @media only screen and (min-width : 768px) {
    .figwrapper { max-width: 400px; margin-right: 10px }
  }
  @media only screen and (-webkit-min-device-pixel-ratio : 2) {
    .figwrapper { max-width: 227px }
  }
  aside { font-style: italic }
---

Programming blogs have code, and that's great. But please don't configure your
blogging platform to auto-include line numbers with your code, because it looks
like crap when unstyled:

<div class=figwrapper><figure>
<img src="http://img.skitch.com/20120621-cssssshprkdibqmwc5g8fr5wxm.png" width="455" height="606" alt="Instapaper">
<figcaption>Instapaper</figcaption>
</figure></div>

<div class=figwrapper><figure>
<img src="http://img.skitch.com/20120621-1ysxc3r29cqfj1ihkc2q9jc8ca.png" width="455" height="606" alt="Reeder iOS">
<figcaption>Reeder for iOS</figcaption>
</figure></div>

<div><aside>
  Sidenote: because people will use these programs to view your content, you
  should embed the code directly in your post rather than pulling it in via
  JavaScript from an external service like Gist.
</aside></div>

Why would you need line numbers, anyway? They're only useful if you want to call
attention to a particular line. You can do that with syntax highlighting,
instead. With Jekyll and pygments, it's easy:

    { % highlight js hl_lines=4 % }
      ...
    { % endhighlight % }

_Note: I had to "escape" Liquid tags above by padding them with spaces._

Result:

{% highlight js hl_lines=4 %}
var target = { one: 'patridge' },
    source = { two: 'turtle doves' }

$.extend(target, source)
//=> { one: 'patridge',
//     two: 'turtle doves' }
{% endhighlight %}

While you're at it, you could configure your text editor to not display line
numbers while you code (in Vim: `:set nonumber`). It gives you a tiny bit of
extra horizontal space, you can still jump to a specific line number via
usual keyboard shortcuts, and you can read the current line number from your
editor's status bar.
