if ('addEventListener' in document) (function(){
  var root = 'http://' + location.host + '/'

  function isLink(elem) {
    return elem.nodeType == Node.ELEMENT_NODE &&
      elem.nodeName.toUpperCase() == 'A' &&
      typeof elem.getAttribute('href') == 'string'
  }

  function findLink(elem, limit) {
    if (limit > 0 && elem) {
      return isLink(elem) ? elem : findLink(elem.parentNode, limit - 1)
    }
  }

  document.addEventListener('click', function(e) {
    if (!window._gaq || e.which == 3) return // ignore right click
      var trackData, link = findLink(e.target, 3)
    if (link) {
      if (link.href.replace(/^https:/i, 'http:').indexOf(root) !== 0) {
        // track outbound links
        var domain = link.href.split('/', 3)[2]
        trackData = ['_trackEvent', 'Outbound links', domain]
      }
      else if (/.(\w{2,5})$/.test(link.href) && RegExp.$1.toLowerCase() != 'html') {
        // track file downloads
        var path = '/' + link.href.replace(root, '')
        trackData = ['_trackPageview', path]
      }

      if (trackData) {
        _gaq.push(trackData)
        if (e.which == 1 && !(e.ctrlKey || e.metaKey || e.shiftKey)) {
          // on regular left click, force a small delay before following the link
          setTimeout(function(){ document.location = link.href }, 100)
          e.preventDefault()
        }
      }
    }
  })
})()
