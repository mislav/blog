---
permalink: /js/handling-events-on-elements/
title: Handling JavaScript events on multiple elements
layout: post
categories: js
tags: dated
description: >
  Do you have a loop in your code that attaches an event handler to each of the
  elements? This article shows how to make that simpler with event delegation — in
  other words, by leveraging event bubbling.
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

Are you looping over a set of elements to apply the same event handler to each one? In this article I am are going to discuss _event delegation_, i.e. how a single event handler in the right place can be more effective than many.

## A common need

Here is a simple table with nonsense data. Try to select some rows for processing. Thing to note here: you can click on whole rows, not just the checkboxes.

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

So you’ve played with it and saw it’s pretty much basic. But how to implement this? Many people will think <q>oh, I'll just go ahead and attach a click handler to each row</q>. That is a complex solution and generally should be avoided. The main flaw of this solution is that new, dynamically added rows (such as after Ajax requests) won't have the same handlers.

{% capture event_code %}// observe all clicks to table rows
$(document).delegate('#mytable tbody tr', 'click', function(e) {
  var row = $(this)
  // find the first input element in the row; that's our checkbox
  var checkbox = row.find('input:first')
  // toggle the checkbox unless the click event originated on it
  if (!$(e.target).is(':input')) checkbox.prop('checked', !checkbox.is(':checked'))
  // toggle the classname of the row
  row.toggleClass('selected')
})

// catch the submit on the form
$(document).delegate('form:has(table)', 'submit', function(e) {
  var values = [], data = $(this).serializeArray()
  $.each(data, function(){ values.push(this.value) })

  if (values.length) alert('Rows to submit: ' + values.join(', '))
  else alert('Nothing selected. Please select some rows')

  // prevent the real submit action taking place in the browser
  e.preventDefault()
})

$(function() {
  // add the "selected" class if some inputs are already selected
  $('#mytable tbody tr input').each(function() {
    var input = $(this)
    if (input.val()) input.parent('tr').addClass('selected')
  })
})
{% endcapture %}

Here is the complete jQuery code for the above example:

{% highlight js %}{{ event_code }}{% endhighlight %}

In the above script, the [`delegate`][2] method was used to capture 'click' and 'submit' events originating from specific groups of elements. This is possible because most events _bubble_ up the DOM tree, eventually reaching the `document` object. Attaching handlers to the document object also has the benefit that it's available at any time, even before the page DOM is ready.

Let's observe another real-world usage and reuse the same principle of unobtrusive click handling.

## Analytics example

If you are using Google Analytics on your site, you might have wondered how to track PDF or other file downloads, or even outbound (off-site) clicks. Analytics help suggests that you use the `onclick` attribute to invoke custom tracking functions:

{% highlight html %}
<!-- file downloads: -->
<a href="report.pdf" onclick="trackFile(...); return false">awesome report, has pie charts</a>
<!-- outgoing clicks: -->
<a href="http://another-site.com" onclick="trackOutboundLink(...); return false">visit my sponsor!</a>
{% endhighlight %}

This works but is pretty tedious and brittle (what happens if the custom functions are not defined?).

We're smarter than that. With event delegation we can make an unobtrusive, one-time solution that doesn't even require a JavaScript library like Prototype.js or jQuery:

{% highlight js %}
// outbound links and file downloads Analytics tracking
{% include extra_tracking_code.js %}
{% endhighlight %}

We observe mouse clicks on document level and then test if they originated from link elements; then we apply some simple rules to determine whether we are going to track the click or not. Outbound links are recognized by leading to another domain, while file downloads are detected by the file extension.


## Related reading

* [Event capture explained][4]—a primer on bubbling and event capture on [Opera Dev Community][5];
* [Event Delegation versus Event Handling][7].


<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
<script type="text/javascript">
{{ event_code }}
</script>


[2]: http://api.jquery.com/delegate/
[4]: http://dev.opera.com/articles/view/event-capture-explained/
[5]: http://dev.opera.com/
[7]: http://icant.co.uk/sandbox/eventdelegation/
