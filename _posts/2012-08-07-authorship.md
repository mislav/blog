---
title: "Your content's author"
updated: "2013-01-28T02:10:03+01:00"
description: >
  Take control of authorship information on content that you create.
layout: post
categories: HTML
styles: |
  figure img { display:block; border: 1px solid silver; padding: 1px; border-radius: 2px; max-width: 100% }
  @media only screen and (max-width : 480px) {
    figure { margin: 0; max-width: 100% }
  }
  @media only screen and (-webkit-min-device-pixel-ratio : 2) {
    figure { max-width: 327px; -webkit-box-sizing: border-box }
  }
---

I'm [reading content on the Web](/instapaper/) daily. I find it important to
know who the author of a specific article is and when was it published.

Many blogs and even news sites don't get this right. This is especially obvious
when using Instapaper or related apps which extract content from the site, thus
removing it from its usual context where you were able to hunt for that "about"
link if you had the time.

This is why I wanted to make authorship explicit on every post on my site by
putting this byline directly after the title of an article:

    By Mislav Marohnić on 17 January 2012

This makes it obvious to people, but what about machines? What is the proper
markup for authorship information?

My goal was to enable Instapaper, Readability and Google to pick up this
information. In Instapaper, I wanted my readers to experience this:

<div class=figwrapper><figure>
  <a href="/2012/01/special-chars/"><img
    src="https://img.skitch.com/20120807-p2bdg9g8ah76pt1acim4nxcrsp.png"></a>
</figure></div>

Here's how to achieve this.

## Markup formats

**Instapaper text parser** seems to support multiple different markup formats
for authorship information, although it was difficult to test reliably due to
its caching strategy. While it *might* support the [Person microdata
schema][person] and the `<meta name=author>` tag, it *definitely supports* the
`rel=author` attribute:

{% highlight html hl_lines=2 %}
<p>
  By <a href="/" rel=author lang=hr>Mislav Marohnić</a>
  on <time pubdate datetime="...">17 Jan 2012</time>
</p>
{% endhighlight %}

The `<time pubdate>` element holds machine-readable information about publish date.

[**Readability** advises][readability] marking up your content with hNews, which
basically falls down to combining [hAtom][] and [hCard][] microformats.

{% highlight html hl_lines=3 %}
<article class=hentry>
  <p class="author vcard">
    By <a href="/" class=fn lang=hr>Mislav Marohnić</a>
    on <time pubdate class=published datetime="...">17 Jan 2012</time>
  </p>
</article>
{% endhighlight %}

Notice the `class=published` addition to `<time>`. This is part of hAtom.

Readability will also extract and display the article summary if it finds one
marked up hNews ("entry-summary") or [Article microdata][article]
("description").

**Google** instructs to [link your content to your Google+ profile][author].
This results in a nice side-effect that is well-formatted snippet in Google
search results that includes your name and profile picture.

All of the above can be tested with Google's [rich snippets test tool][tool],
which recognizes many different microdata/RDFa schemas and microformats.

## Ignoring duplicate content

Now that I've fed authorship and published date information to Instapaper and
Readability text parsers, I don't want them to show this byline twice (once in
their own UI, and once in my content). Fortunately, they both allow means to
mark certain elements to be ignored by their text parsers.

Instapaper respects the "instapaper_ignore" classname, while Readability
defines the "entry-unrelated" extension to hAtom:

{% highlight html hl_lines=2 %}
<article class=hentry>
  <p class="instapaper_ignore entry-unrelated">
    By <a href="/" lang=hr>Mislav Marohnić</a>
  </p>
</article>
{% endhighlight %}

I doubt that other clients respect these class names, but that's fine since
we're not sure that other clients will present author & date in their own UI.
For those that don't, such as Safari Reader feature, it's best to keep having
this byline as part of your article content.


  [tool]: http://www.google.com/webmasters/tools/richsnippets

  [author]: http://support.google.com/webmasters/bin/answer.py?hl=en&answer=1408986
    "Author information in search results"

  [readability]: http://www.readability.com/developers/guidelines
    "Readability article publishing guidelines"

  [person]: http://schema.org/Person
  [article]: http://schema.org/Article
  [hAtom]: http://microformats.org/wiki/hatom
  [hCard]: http://microformats.org/wiki/hcard
