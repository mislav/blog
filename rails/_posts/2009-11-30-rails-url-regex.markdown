---
permalink: /rails/rails-url-regex/
title: URL regex pattern in Rails
layout: post
categories: Rails
tags: dated regexp URL
description: Dissecting the URL regex pattern found in Rails view helpers
---

John Gruber writes about a [liberal regex for matching URLs][daring] and Alan Storm posts a [follow-up with explanation and improvement][explained].

I'd like to share an URL auto-link regex I wrote and which now resides in Rails core:

{% highlight ruby %}
%r{
  ( https?:// | www\. )  # URLs start with "http://" or "www."
  [^\s<]+                # allow all non-whitespace chars until an opening HTML tag
}x
{% endhighlight %}

Yes, the regex itself is simple. Too simple, because experienced programmers will notice that it doesn't handle punctuation in the end, Wikipedia-style bracket pairs and so on.

The truth is, [we handle these edge cases in Ruby code][auto_link].

Yes, that's a fair amount of Ruby code, but it handles all the cases we needed it to, including the one when the URL is already linked in the input text. It just shows how you don't have to try handle everything with a regex; use your language too.

A contributor posted [a patch][patch] for one last bit of functionality I've left out.

But I do understand that most regex patterns that people design for matching URLs are too large, often trying to whitelist characters. Gruber certainly proved a point when he showed that such patterns should be more liberal.

> Some people, when confronted with a problem, think “I know, I'll use regular expressions.”<br>Now they have two problems.
> 
> <a href="http://regex.info/blog/2006-09-15/247"><i>Jamie Zawinski</i></a>

[daring]: http://daringfireball.net/2009/11/liberal_regex_for_matching_urls
[explained]: http://alanstorm.com/url_regex_explained
[auto_link]: http://github.com/rails/rails/blob/d1202cfeb2cc7961c93a33ef3f5622d5393186f1/actionpack/lib/action_view/helpers/text_helper.rb#L534-568
[patch]: https://rails.lighthouseapp.com/projects/8994/tickets/3494-patch-autolinking-non-http-protocols-doesnt-work