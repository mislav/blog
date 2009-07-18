function decompose(start) {
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