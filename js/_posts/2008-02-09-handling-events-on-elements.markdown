---
title: Handling JavaScript events on multiple elements
layout: post
category: js
description: Do you have a loop in your code that attaches an event handler to each of the elements? This article shows how to make that simpler with event delegation -- in other words, by leveraging event bubbling.
styles: |
    table { border: 2px solid #6D7D21; border-collapse: collapse; }
    table td, table th { border: 1px solid gray; padding: .4em .8em; }
    table tr.odd { background: #eee }
    table tbody tr { cursor: pointer }
    table tbody tr:hover { background-color: lemonchiffon }
    table tbody tr.selected { background-color: #FFa7aa; color: black }
    form { margin-bottom: 1em }
    form .actions { margin-top: .5em }
---

Implementing proper event handling on your site or application is a _design_ issue, meaning there are many ways of solving a problem and choosing the right way is a matter of skill and experience. Today I want to talk about handling events on multiple elements because a great deal of JavaScript developers are constantly struggling to get some overcomplicated code working—usually looping over a set of elements and attaching a handler to each one. When they need to identify which of the targets actually triggered the event, or when they inject new elements as a result of an Ajax request and find out they need to re-apply all the handlers again, they start pulling their hairs out. Let’s look at an approach where we don’t need loops; we’ll simply play with _bubbles_. Sometimes this is called _event delegation_.

## A common need

Here is a simple table with nonsense data. Try to select some orders (rows) for processing. Tip: click on whole rows, not just the checkboxes.

<div><form action=".">
  <table id="mytable" summary="nonsense data for JavaScript example">
    <thead>
      <tr><th></th><th>Date</th><th>Name</th><th>Surname</th><th>Price</th><th>IP Address</th></tr>
    </thead>
    <tbody>
      <tr><td><input name="order[]" type="checkbox" value="1" /></td><td>21/01/2006</td><td>Neil</td><td>Crosby</td><td class="numeric">$1.96</td><td>192.168.1.1</td></tr>
      <tr class="odd"><td><input name="order[]" type="checkbox" value="2" /></td><td>01/02/2006</td><td>Becca</td><td>Courtley</td><td class="numeric">$23.95</td><td>192.167.2.1</td></tr>
      <tr><td><input name="order[]" type="checkbox" value="3" /></td><td>17/11/2004</td><td>David</td><td>Freidman-Jones</td><td class="numeric">$14.00</td><td>192.168.2.1</td></tr>
      <tr class="odd"><td><input name="order[]" type="checkbox" value="4" /></td><td>17/10/2004</td><td>Annabel</td><td>Tyler</td><td class="numeric">$104.00</td><td>192.168.2.17</td></tr>
      <tr><td><input name="order[]" type="checkbox" value="5" /></td><td>17/11/2005</td><td>Carl</td><td>Conway</td><td class="numeric">$17.00</td><td>192.168.02.13</td></tr>
    </tbody>
  </table>
  
  <div class="actions">
    <input type="submit" value="Process orders" />
  </div>
</form></div>

So you’ve played with it and saw it’s pretty much basic. But how did we implement it? Many people will say <q>oh, if each row has to be clickable I&#8217;ll just go right ahead and attach a click handler to each of the rows</q>. That is a complex solution and generally should be avoided. Others will try to be smarter than that and use something like [Behaviour][1], but that’s just doing the same thing in a nicer way.

The key is simply intercepting all the click events on the table or `TBODY` elements themselves. Most of the events in JavaScript _bubble_, which means they propagate up the document tree from the node they originate from. You can handle such events on any element that contains the target of the event; you can also stop its default action, like following a link, or stop it from bubbling. These event methods are called `preventDefault()` and `stopPropagation()`, respectively. (With the Prototype library you also have the `stop()` method that is the combination of both.)

{% capture event_code %}document.observe('dom:loaded', function() {
  when('#mytable tbody', function(table) {
    // we only set one event handler, and that is on the table body
    table.observe('click', function(e) {
      // when an event is handled, descend to from where it's triggered to table row
      var checkbox, row = e.findElement('tr')
      if (row) {
        // find the first input element in the row; that's our checkbox
        var checkbox = row.down('input')
        // toggle the checkbox unless the click event originated on it
        if (e.target != checkbox) checkbox.checked = !checkbox.checked
        // toggle the classname of the row
        row.toggleClassName('selected')
      }
    }).select('input').each(function(input) {
      // add the "selected" class if some inputs are already slected
      if (input.getValue()) input.up(1).addClassName('selected')
    })

    // catch the submit on the form
    table.up('form').observe('submit', function(e) {
      var data = this.serialize(true), // serialize to object
          selected = data['order[]']

      if (selected) {
        var list = Object.isArray(selected) ? selected.join(', ') : selected
        alert('Orders to process: ' + list)
      } else {
        alert('No orders to process. Please select some')
      }

      // prevent the real submit action taking place in the browser
      e.stop()
    })
  })
})
{% endcapture %}

Here is the complete code for the above example:

<div>
<pre id="code"><code class="javascript">{{ event_code }}</code></pre>
</div>

Pay special attention to `e.findElement('tr')`. We don’t really care where exactly the event originated—it is most probably on some table cell or even the element inside a cell—we just want to know what row was it on. Prototype [`findElement()`][2] method is very helpful here because it traverses elements upwards from event origin and returns the first one that matches the CSS selector (`tr`, in this case).

When we get a reference to the row, rest is straightforward. We toggle the checkbox programmatically while adding/removing a CSS class on the row for visual feedback.

## Analytics example

If you are using Google Analytics on your site, at one point you probably wondered how to track PDF or archive file downloads, or even outgoing (off-site) clicks. There is a solution: Analytics help suggests that you use the `urchinTracker()` function with an absolute path as argument. (Note: the name of the method is `_trackPageview` if you’re using [the new tracking code][3] from December 2007.)

They suggest putting the code in an <i>onclick</i> attribute:

    <!-- file downloads: -->
    <a href="report.pdf" onclick="urchinTracker('/downloads/report.pdf')">awesome report, has pie charts</a>
    <!-- outgoing clicks: -->
    <a href="http://another-site.com" onclick="urchinTracker('/outgoing/another-site.com')">visit my sponsor!</a>

Hooray, it’s possible—but also pretty gross :( First of all, when you switch to the new Analytics tracking code you’ll have to manually replace each call to the old function. Seconds, if you decide to stop using Analytics and remove the Urchin script, all of these links will generate a JavaScript error on click. But, the worst drawback definitely is: you have to _manually add_ this to _each_ link you want tracked.

Don’t listen to Analytics help. We are smarter than that. The following script is an unobtrusive, one-time, drop-in solution when you’re using Prototype (but can also be ported to any other library, easily). Features include:

1. fail silently if tracker code isn’t available (like when Urchin script hasn’t yet loaded);
2. tracking all outgoing URLs;
3. tracking all local files with extensions other than ‘html’;
4. tracking middle-mouse clicks (that open links in a new tab in some browsers);
5. other, custom, rules can easily be added by hand.

Again, pay attention to the usage of `findElement()`:

    var root = 'http://' + window.location.host + '/'
    
    if (window.Prototype) document.observe('mouseup', function(e) {
      if (!urchinTracker) return
      var link = e.findElement('a[href]')
      if (link) {
        var url = null, leftOrMiddle = (e.isLeftClick() || e.isMiddleClick())
        // track outgoing clicks:
        if (!link.href.startsWith(root) && leftOrMiddle)
          url = '/outgoing/' + link.href.replace(/^http:\/\//, '')
        // track clicks to files with extensions other than ".html"
        else if (/.(\w{2,5})$/.test(link.href) && RegExp.$1.toLowerCase() != 'html' && leftOrMiddle)
          url = '/' + link.href.replace(root, '')
    
        if (url) urchinTracker(url)
      }
    })

We observe mouse clicks on document level and then test if they originated from link elements; then we apply some simple rules to determine whether we are going to track the click or not. Lastly, we call the tracker function. After executing all the code, default action for the click takes place: the browser follows the link.

This is how the report is going to look in Google Analytics:

<img src="/page_attachments/0000/0007/outgoing.png" alt="Outgoing links report" style="display: block; margin: 0 auto .5em auto">

## Related reading

* [Event capture explained][4]—a good primer on bubbling and event capture on [Opera Developer Community][5];
* [Event Delegation Made Easy In jQuery][6] by <a href="http://www.danwebb.net/" rel="acquaintance">Dan Webb</a>;
* [Event Delegation versus Event Handling][7].


<script type="text/javascript" src="/javascripts/all.js"></script>
<script type="text/javascript">
{{ event_code }}
</script>


[1]: http://www.bennolan.com/behaviour/
[2]: http://prototypejs.org/api/event/findElement
[3]: http://www.google.com/analytics/GATCmigrationguide.pdf
[4]: http://dev.opera.com/articles/view/event-capture-explained/
[5]: http://dev.opera.com/
[6]: http://www.danwebb.net/2008/2/8/event-delegation-made-easy-in-jquery
[7]: http://icant.co.uk/sandbox/eventdelegation/