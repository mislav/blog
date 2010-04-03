---
title: Detecting device size & orientation in CSS
description: CSS3 media queries allow us to target certain rules based on device screen size an orientation.
layout: post
categories: [ css, iphone ]
---

Gone are the days when we could safely assume that most our site visitors would have at least a 1024px-wide screen resolution. With smartphones and tablet computers on the rise, you visitors could also be browsing the web with screen widths ranging from 320px upwards. Does your site look good on a 768px-wide canvas? That's how people will see it using a portrait-oriented iPad.

Time to revisit that old stylesheet of yours and give it a face-lift. Let's jump straight into examples:

    @media only screen and (max-width: 999px) {
      /* rules that only apply for canvases narrower than 1000px */
    }
    
    @media only screen and (device-width: 768px) and (orientation: landscape) {
      /* rules for iPad in landscape orientation */
    }
    
    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      /* iPhone, Android rules here */
    }

While at first this looks like proprietary markup, these are in fact [CSS3 media queries][css3] implemented in Firefox, Safari (including Mobile) and Google Chrome. (I didn't test other browsers or mobile WebKits.) Mozilla has some nice [reference documentation][mdc] with this very important detail:

> As the user resizes the window, Firefox will switch style sheets as appropriate based on media queries using the `width` and `height` media features.

You can see this in effect on my ["iPhone vs. Droid ads"][ads] page which was originally designed as a gorgeous, whitespace-rich two-column layout comparing two companies' types of marketing. Obviously I couldn't preserve the multicolumn layout on narrower displays, so using media queries I made 3 different layouts:

1. widths up to 480px (iPhone, Android): tight spacing, single-column;
2. up to 980px (iPad in portrait): fluid columns only on top section, single-column elsewhere;
3. wider than 980px: fixed, two-column centered layout.

Try resizing your browser to see how the layout of that page changes at narrower sizes.

As an additional detail, I've bumped up font sizes for the iPad to improve readability on its high pixel density display. I've yet to test this on a real device to see if I did any good.

Once you've made sure your layout fits on smaller displays, you need this tag to satisfy mobile WebKits:

    <meta name="viewport" content="initial-scale=1.0">

See [full documentation for "viewport"][meta] directive. What Mobile Safari does by default (i.e. without this directive) is display a zoomed-out, wide version of the page even if the layout itself is narrower. As content authors, with this directive we're saying "trust me, zoom to natural scale and I'll make sure it fits". From the documentation:

> [...] if you set the scale to 1.0, Safari assumes the width is `device-width` in portrait and `device-height` in landscape orientation.

Finally, some tips from Apple's technical note about [preparing for the iPad][note]:

> Since touching and holding in Safari on iPhone OS will invoke the Cut/Copy/Paste dialog, you may also choose to disable selection on user interface elements such as menus and buttons using `-webkit-user-select: none`. It is important to only disable selection as needed on a per-element basis. Selection in webpages should never be globally disabled.

[css3]: http://www.w3.org/TR/css3-mediaqueries/ "CSS3 Media Queries"
[mdc]: http://developer.mozilla.org/En/CSS/Media_queries "Media Queries on Mozilla Developer Center"
[meta]: http://developer.apple.com/safari/library/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html "Apple-specific meta tags"
[note]: http://developer.apple.com/safari/library/technotes/tn2010/tn2262.html "Preparing Your Web Content for iPad"
[ads]: /iphone-droid-ads/ "Things I learned from iPhone & Droid ads"