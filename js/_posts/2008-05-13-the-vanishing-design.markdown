---
permalink: /js/the-vanishing-design/
title: The vanishing design
layout: post
categories: js
tags: dated
---

One of the ideas I had for the past few months is writing some JavaScript that would access the stylesheets for the page (via the DOM) and toggle style rules one by one. I never got around to doing that, until I saw [Matthew Buchanan][1] beat me to it. With a help of his friend, he wrote [Timelapse CSS][2], a script that strips a document of its styles. He also links to a video he recorded of the reverse process: putting the styles back together (which is definitely more cool).

I haven’t looked at his code because I still wanted to write my own. Our end results turned out very much alike.

My result was the `decompose()` function, shown below. It also features a progress indicator in the upper right corner of the page.

**This was written for Firefox** and I still have to test it in Opera and Safari. Don’t even _try_ it in Internet Explorer because IE doesn’t support the standard DOM API (but you already _knew_ that).

<a href="#" onclick="decompose(50); return false">Click here to decompose this page</a> over the course of 30 seconds. This would usually last 60 seconds, but I’m telling the function to start at 50%, which skips processing some styles on my site that never got applied to this page in the first place.

After the script is done, this site’s design should be bare, black on white. Simply refresh the page to get my nice colors back.

The full script ([download][3]):

{% capture decompose_code %}    function decompose(start) {
      // reverse forEach for array-like collections
      function $(a,f) {
        for (var i=a.length-1; i>=0; i--) f(a.item(i))
      }
    
      // array to collect decomposing bits to
      var all = [];
    
      $(document.styleSheets, function(ss) {
        // decompose only screen stylesheets
        if(!ss.media.length || /\b(all|screen)\b/.test(ss.media.mediaText))
          $(ss.cssRules, function(r) {
            // ignore rules other than style rules
            if(r.type == CSSRule.STYLE_RULE)
              $(r.style, function(p) {
                all.push(function(){ r.style.removeProperty(p) })
              })
          })
      });
    
      var t, n = all.length, i = (start ? Math.round(n*start/100) : 0)
      if (!n) { alert('No style rules to decompose!'); return }
    
      // create progress meter
      var p = document.body.appendChild(document.createElement('div'));
      p.style.cssText = 'position:absolute;top:6px;right:8px;color:gray;font:bold 11px sans-serif;';
    
      // decompose over the course of 60 seconds
      t = setInterval(function(){
        if (i == n) clearInterval(t);
        else {
          all[i++]();
          p.innerHTML = Math.floor(i/n*100) + '%';
        }
      }, 60000/n)
    }
{% endcapture %}

{{ decompose_code }}

<h2 id="bookmarklet">Bookmarklet</h2>

After the script was working, I wrote a bookmarklet: [Fall apart!][4] Pull this link to your bookmarks bar and use whenever you want to watch a 60-second show of a website decomposing. I found [CSS Globe][5] to be a fun site for running it. **A word of warning, though:** this doesn’t seem to work with HTML documents written in XHTML _Strict_.

When you run the bookmarklet and think nothing is happening, pay attention to the progress meter in the upper right corner. If it’s not there, the script never started—you could try to find an error in your browser’s JavaScript console. If it’s a security exception, the document is probably XHTML Strict.

<script type="text/javascript" charset="utf-8">{{ decompose_code }}</script>


[1]: http://matthewbuchanan.name/
[2]: http://matthewbuchanan.name/post/33504871
[3]: /js/the-vanishing-design/decompose.js
[4]: javascript:void(function(){var%20s=document.createElement('script');s.src='http://mislav.uniqpath.com/js/the-vanishing-design/decompose-bookmarklet.js';document.body.appendChild(s)}())
[5]: http://cssglobe.com/