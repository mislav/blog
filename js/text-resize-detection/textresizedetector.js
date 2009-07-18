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