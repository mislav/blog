(function(start) {
  function $(a,f) { for (var i=a.length-1; i>=0; i--) f(a.item(i)) }
  var all = [];
  $(document.styleSheets, function(ss) {
    if(!ss.media.length || /\b(all|screen)\b/.test(ss.media.mediaText))
      $(ss.cssRules, function(r) {
        if(r.type == CSSRule.STYLE_RULE)
          $(r.style, function(p) { all.push(function(){ r.style.removeProperty(p) }) })
      })
  })
  var t, n = all.length, i = (start ? Math.round(n*start/100) : 0)
  if (!n) { alert('No style rules to decompose!'); return }
  var p = document.body.appendChild(document.createElement('div'));
  p.style.cssText = 'position:absolute;top:6px;right:8px;color:gray;font:bold 11px sans-serif;';
  t = setInterval(function(){
    if (i == n) clearInterval(t);
    else { all[i++](); p.innerHTML = Math.floor(i/n*100) + '%'; }
  }, 60000/n)
})(0)