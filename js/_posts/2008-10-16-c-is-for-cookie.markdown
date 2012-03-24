---
permalink: /js/c-is-for-cookie/
title: C is for cookie
layout: post
categories: js
description: A tiny cookie library and a great video to go along.
---

Getting and setting cookies in JavaScript through the standard API (`document.cookie`) can be a pain to do manually, so I’m sharing a tiny, framework-independent script that provides both read and write methods with the simplest interface there can be.

    // setting a cookie:
    Cookie.set('SesameStreetCharacter', 'Cookie monster')
    
    // getting a value of the cookie:
    Cookie.get('SesameStreetCharacter')
    // -> 'Cookie monster'
    
    // Cookie.set() optional parameters
    var date = new Date()
    date.setTime(date.getTime() + (14*24*60*60*1000)) // 14 days from now
    
    Cookie.set('expiringCookie', 'I will expire', {
      expires: date, path: '/some/path', domain: 'example.com', secure: true
    })

Here’s the full code:

    // C IS FOR COOKIE
    var Cookie = {
      get: function(name) {
        var name = escape(name) + '='
        if (document.cookie.indexOf(name) >= 0) {
          var cookies = document.cookie.split(/\s*;\s*/)
          for (var i = 0; i < cookies.length; i++) {
            if (cookies[i].indexOf(name) == 0)
              return unescape(cookies[i].substring(name.length, cookies[i].length))
          }
        }
        return null
      },
    
      set: function(name, value, options) {
        var newcookie = [escape(name) + "=" + escape(value)]
        if (options) {
          if (options.expires) newcookie.push("expires=" + options.expires.toGMTString())
          if (options.path)    newcookie.push("path=" + options.path)
          if (options.domain)  newcookie.push("domain=" + options.domain)
          if (options.secure)  newcookie.push("secure")
        }
        document.cookie = newcookie.join('; ')
      }
    }

And a great video to go along:

<object height="349" width="425">
  <param name="movie" value="http://www.youtube.com/v/BovQyphS8kA&amp;hl=en&amp;fs=1&amp;rel=0&amp;border=1"></param>
  <param name="allowFullScreen" value="true"></param>
  <embed allowfullscreen="true" type="application/x-shockwave-flash" src="http://www.youtube.com/v/BovQyphS8kA&amp;hl=en&amp;fs=1&amp;rel=0&amp;border=1" height="349" width="425"></embed>
</object>

## Related reading

1. [JavaScript cookies on Quirksmode][1] – everything you wanted to know about browser cookies, by Peter-Paul Koch


[1]: http://www.quirksmode.org/js/cookies.html