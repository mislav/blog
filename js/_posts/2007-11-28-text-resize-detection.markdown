---
permalink: /js/text-resize-detection/
title: Text resize detection with Prototype
layout: post
categories: js Prototype.js
tags: dated
description: Easy text resize detection in JavaScript with Prototype library
---

Here [I have a neat script][1] ported from [A List Apart article by Lawrence Carvalho and Christian Heilmann][2] that allows you to do this:

    TextResizeDetector.init();
    
    document.observe("text:resized", function(e) {
      console.log(e.memo);
    });

When you resize the text, you should see output in Firebug such as:

    Object base=15 delta=3 size=19

Read the A List Apart article too see how this might be useful for the usability of your site.

The `init()` function accepts 2 optional parameters: the parent of the <i>span</i> element generated for detection (default is `document.body`) and the frequency of polling (default is 200 ms).

    TextResizeDetector.init('container', 100);

Full script source ([download it here][1]):

    /** 
     * Detects changes to font sizes when user changes browser settings
     * Fires the "text:resized" event with the following memo:
     * 
     *   base  : base font size    
     *   delta : difference in pixels from previous setting
     *   size  : size in pixel of text
     * 
     * Adapted from http://www.alistapart.com/articles/fontresizing
     * Requires Prototype library 1.6.0
     * 
     *   @author Lawrence Carvalho carvalho@uk.yahoo-inc.com
     *   @author Mislav Marohnić   mislav.marohnic@gmail.com
     */
    
    TextResizeDetector = function() { 
      var el, frequency = 200, interval = null, currentSize = -1, base = -1;
    
      function getSize() { return el.offsetHeight }
    
      function createControlElement(parent) {
        el = new Element('span', { id: 'textResizeControl' }).update('&nbsp;').setStyle({
          position: 'absolute',
          left: '-9999px'
        });
    
        $(parent || document.body).appendChild(el);
        base = currentSize = getSize();
      }
    
      function _stopDetector() {
        window.clearInterval(interval);
        interval = null;
      }
    
      function _startDetector() {
        if (!interval) interval = window.setInterval(detect, frequency);
      }
    
      function detect() {
        var newSize = getSize();
    
        if (newSize !== currentSize) {
         document.fire("text:resized", {
           base: base,
           delta: (currentSize != -1 ? newSize - currentSize : 0),
           size: currentSize = newSize
         });
        }
      }
    
      return {
        init: function(element, freq) {
          createControlElement(element);
          if (freq) frequency = freq;
          this.start();
        },
    
        stop: function() {
          return _stopDetector();
        },
    
        start: function() {
          return _startDetector();
        }
      }
    }();


[1]: /js/text-resize-detection/textresizedetector.js
[2]: http://www.alistapart.com/articles/fontresizing