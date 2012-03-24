---
permalink: /js/upgrading-to-prototype-1-6-real-world-examples/
title: "Upgrade to Prototype 1.6: real world examples"
layout: post
categories: js Prototype.js
tags: dated
description: Noting down my progress as I upgrade Radiant CMS to Prototype 1.6.
---

Recently I have undertaken upgrading [Radiant CMS][1] JavaScripts to Prototype 1.6. Radiant depends on a fair amount of scripting in its administrative interface which was previously done with Prototype 1.5.0 (now almost a year old). Simply replacing the old <i>prototype.js</i> with the new one doesn’t immediately work – some APIs changed (most notably `Hash`) and I also wanted to slim down old code using some fresh features. I will now show you some examples of what I’ve done, how I did it and why; you might find this writeup useful when doing the same in _your_ application.

<img src="http://radiantcms.org/images/screenshot.jpg" alt="A screenshot of Radiant CMS interface" style="display:block; margin:1.5em auto" />

[The complete patch is viewable on Pastie][2]. [I have submitted it][3] to the developers of Radiant. <ins cite="http://dev.radiantcms.org/radiant/changeset/563" date="2007-10-23T10:00:00+02:00"><strong>Update</strong>: these changes are effective in Radiant CMS as of <a href="http://dev.radiantcms.org/radiant/changeset/563">changeset 563</a>. Thanks, Sean!</ins>

## Finding and manipulating DOM nodes

Find first element with the class `tabs` under a node referenced by `this.element`:

{% highlight js %}
// before:
this.tab_container = document.getElementsByClassName('tabs', this.element).first();

// after:
this.tab_container = this.element.down('.tabs');
{% endhighlight %}

Some drawbacks of the original approach:

1. It’s a bit verbose;
2. `getElementsByClassName` is deprecated;
3. It fetches _all_ the elements with the class `tabs`, but we only need the first one.

In the refactored approach I used the [`Element#down`][4] method which returns the first descendant that matches the CSS selector. If I, for instance, wanted to fetch _all_ the matching elements I would have used `Element#select`:

{% highlight js %}
// returns all elements under the current element matching the selector
this.element.select('.tabs')
{% endhighlight %}

OK, so this was easy. Let’s skip forward a bit, right to the next snippet:

{% highlight js %}
new Insertion.Bottom(
  this.tab_container,
  '<a class="tab" href="javascript:TabControl.controls[\''
  + this.control_id
  + '\'].select(\'' + tab_id + '\');">' + caption + '</a>');
{% endhighlight %}

Uh-oh: the `Insertion` module is a _deprecated API_. Its awesome functionality is still available–and even more improved!–but through the `Element#insert` method. There is also some ugly HTML string concatenation here; a recipe for disaster… We will use string interpolation provided by the [`Template` class][5] through `String#interpolate`:

{% highlight js %}
this.tab_container.insert(
  '<a class="tab" href="javascript:TabControl.controls[\'#{id}\'].select(\'#{tab_id}\');">#{caption}</a>'.interpolate({
    id: this.control_id, tab_id: tab_id, caption: caption
  })
);
{% endhighlight %}

Definitely much more readable. You’ll notice inline event handling (`href` attribute) that is in practice **bad**, but I didn’t remove it here so that this snippet remains a demonstration of string interpolation.

Let’s move forward. This change may be self-descriptive to most of you:

{% highlight js %}
// before:
divs = $$("div.tag-description");
$A(divs).each(function(div){ Element.show(div) });

// after:
$$("div.tag-description").invoke('show');
{% endhighlight %}

First of all, passing the result of `$$()` through `$A` isn’t at all necessary before iteration; why convert an Array to Array? Second, I shortened this further by recognizing a common pattern where we invoke a particular method on every item of the collection – that pattern is already encapsulated in [`Enumerable#invoke`][6]. The Enumerable mixin is truly a gem.

There were also a lot of cases of getting element siblings this way; the next sibling, in particular:

{% highlight js %}
var sibling = row.nextSibling;
{% endhighlight %}

This works, but the next sibling could be whitespace (a text node), and we’re interested only in HTML elements. Let’s use [`Element#next`][7] instead:

{% highlight js %}
var sibling = row.next();
{% endhighlight %}

There are 2 benefits: the returned node is guaranteed to be an element (whitespace is skipped), and you could pass a CSS selector if you wanted.

I also made a couple of stylistic changes:

{% highlight js %}
// before:
Element.removeClassName(row, 'children-visible');
Element.addClassName(row, 'children-hidden');

// after:
row.removeClassName('children-visible');
row.addClassName('children-hidden');
{% endhighlight %}

The last lines are more readable and concise. We only have to make sure that `row` is [a DOM-extended element][8] in this context.

This was certainly an interesting find; apparently, these were faster than `addClassName` and `removeClassName`:

{% highlight js %}
onMouseOverRow: function(event) {
  this.className = this.className.replace(/\s*\bhighlight\b|$/, ' highlight');
},

onMouseOutRow: function(event) {
  this.className = this.className.replace(/\s*\bhighlight\b\s*/, ' ');
},
{% endhighlight %}

This was true in Prototype 1.5.0 where classname operations were slower, but now we don’t have to resort to such string hacks anymore. Simply:

{% highlight js %}
onMouseOverRow: function(event) {
  this.addClassName('highlight');
},

onMouseOutRow: function(event) {
  this.removeClassName('highlight');
},
{% endhighlight %}

Inspecting elements is not easy. This long line checks if the element is an image with a specific class name:

{% highlight js %}
isExpander: function(element) {
  return (element.tagName.strip().downcase() == 'img') && /\bexpander\b/i.test(element.className);
},
{% endhighlight %}

But, Prototype has great CSS selector support for some time now. Why don’t we just check if an element matches a selector?

{% highlight js %}
isExpander: function(element) {
  return element.match('img.expander');
},
{% endhighlight %}

Lastly, let’s observe a constructor method that performs some setup on every row of a given table:

{% highlight js %}
// before:
initialize: function(element_id) {
  var table = $(element_id);
  var rows = table.getElementsByTagName('tr');
  for (var i = 0; i < rows.length; i++) {
    this.setupRow(rows[i]);
  }
}

// after:
initialize: function(element_id) {
  $(element_id).select('tr').each(this.setupRow, this)
}
{% endhighlight %}

The change is pretty self-explanatory. One note, though: we’ve given `this` as the second argument to `each`. This is a feature new in Enumerable; it will bind the iterator function (`this.setupRow`) to that object. We call that a _context argument_. (It is an equivalent of `.each(this.setupRow.bind(this))`, in case you wondered.)

## Event handling

The Event module of Prototype 1.6.0 has become pretty strong. It works around quite a number of browser bugs; most notably, context of handler execution in Internet Explorer. Now you can be sure that `this` keyword inside an event handler refers to the observing element in _all_ browsers and you don’t have to explicitly bind it anymore:

{% highlight js %}
// before:
Event.observe(row, 'mouseover', this.onMouseOverRow.bindAsEventListener(row));
Event.observe(row, 'mouseout', this.onMouseOutRow.bindAsEventListener(row));

// after:
row.observe('mouseover', this.onMouseOverRow);
row.observe('mouseout', this.onMouseOutRow);
{% endhighlight %}

In this case when a mouseover/out event fires, the context of `onMouseOver/OutRow` execution will be `row`, just like in all standards-compliant browsers. Of course, you may always choose to [bind the listener to some object][9] other than `row`.

Prototype extends not only DOM elements with its useful methods, _it also extends event objects_. Observe this little fragment:

{% highlight js %}
onMouseClickRow: function(event) {
  var element = Event.element(event);
  if (this.isExpander(element)) {
    var row = Event.findElement(event, 'tr');
    ...
{% endhighlight %}

`Event` instance methods like [`element`][10] and [`findElement`][11] are now available straight on the event instance:

{% highlight js %}
var element = event.element();
...
var row = event.findElement('tr');
{% endhighlight %}

This is true for all listeners set up through the [`observe()`][12] method, but **not** for _inline_ event handlers; have that in mind. There is no reason to use inline event handling anymore, anyway.

## Classes and inheritance

The following snippet is a signature of old class creation in Prototype:

{% highlight js %}
var SiteMap = Class.create();
// Inherit from RuledTable:
SiteMap.prototype = Object.extend({}, RuledTable.prototype);

Object.extend(SiteMap.prototype, {

  ruledTableInitialize: RuledTable.prototype.initialize,

  initialize: function(id, expanded) {
    this.ruledTableInitialize(id);
    this.expandedRows = expanded;
  },
  ...
});
{% endhighlight %}

This is long and tedious. First we define the `SiteMap` class, then we inherit instance methods from `RuledTable`, then define rest of the instance methods for `SiteMap` while preserving the reference to the original constructor. We can abandon those ways, however–Prototype has much better class support now:

{% highlight js %}
var SiteMap = Class.create(RuledTable, {
  initialize: function($super, id, expanded) {
    $super(id);
    this.expandedRows = expanded;
  },
  ...
});
{% endhighlight %}

Observe the call to the original `initialize` method through a special word `$super`. You can find documentation for this and much more in [“Defining classes and inheritance”][13], a Prototype tutorial.

## Hash API

All of the previous enhancements were purely optional–since Prototype is so much backwards-compatible, almost all of the old 1.5.0 code would work with Prototype 1.6.0 release. There is but one exception: [`Hash`][14].

Hash has been completely rewritten to use an internal store for all the key-value pairs. We are forcing the use of _getters and setters_ to avoid mixing hash data with its instance methods; the chance of keys colliding with Hash methods were just not acceptable anymore. This means that whenever you have to get or set a value for a key, you have to use `get()` and `set()` methods. This is how updating the `TabControl` code looked like:

{% highlight js %}
// new Hash instance:
this.tabs = $H();
// old style:
this.tabs[tab_id] = tab;
var object = this.tabs[something];
// new style:
this.tabs.set(tab_id, tab);
var object = this.tabs.get(something);
{% endhighlight %}

The job was simply finding all such places and redefining the code to use `get/set`. There was also some ill-written code to remove a key defined in `id` from `this.tabs` hash:

{% highlight js %}
new_tabs = $H();
this.tabs.each(function(pair) {
  if (pair.key != id) new_tabs[pair.key] = pair.value;
});
this.tabs = new_tabs;
{% endhighlight %}

This code was too complicated, because with the old Hash a simple `delete
this.tabs[id]` was enough. With the new Hash this isn’t possible anymore because of the internal store. Instead, you have to use `unset`:

{% highlight js %}
this.tabs.unset(id);
{% endhighlight %}

## Final notes

An experienced Prototype hacker can by examining old code find even _more_ places for enhancements. However, I’ve refrained from doing that to keep this first patch simple. When you are rewriting or refactoring, you don’t have to cover _every_ possibility in a single run. Instead, decide what you want to do in advance and make it happen through multiple iterations while using version control. When your JavaScript code doesn’t have unit tests, incremental micro-refactoring is probably the best methodology for big rewrites. <ins cite="http://dev.radiantcms.org/radiant/changeset/563" date="2007-10-25T17:00:00+02:00">
Now that this has been commited to Radiant trunk I will be making more incremental
enhancements, possibly reducing the amount of code significantly.</ins>

### Further reading

* [Prototype 1.6 <abbr title="release candidate">RC</abbr>0 release notes][15] covering Event, Function, Ajax and DOM enhancements and methods;
* [Prototype 1.6 <abbr title="release candidate">RC</abbr>1 release notes][16] covering Class, custom events and Hash changes;
* [Defining classes and inheritance][13] tutorial for Prototype 1.6;
* [“Refactoring with Prototype”][17] by [Kangax][18].


[1]: http://radiantcms.org/
[2]: http://pastie.caboo.se/109069
[3]: http://groups.google.com/group/radiantcms-dev/t/6a092c18b6a79e14
[4]: http://prototypejs.org/api/element/down
[5]: http://prototypejs.org/api/template
[6]: http://prototypejs.org/api/enumerable/invoke
[7]: http://prototypejs.org/api/element/next
[8]: http://prototypejs.org/learn/extensions
[9]: http://prototypejs.org/api/function/bindAsEventListener
[10]: http://prototypejs.org/api/event/element
[11]: http://prototypejs.org/api/event/findElement
[12]: http://prototypejs.org/api/event/observe
[13]: http://prototypejs.org/learn/class-inheritance
[14]: http://prototypejs.org/api/hash
[15]: http://prototypejs.org/2007/8/15/prototype-1-6-0-release-candidate
[16]: http://prototypejs.org/2007/10/16/prototype-1-6-0-rc1-changes-to-the-class-and-event-apis-hash-rewrite-and-bug-fixes
[17]: http://thinkweb2.com/projects/prototype/2007/10/05/refactoring-with-prototype/
[18]: http://thinkweb2.com/projects/prototype
