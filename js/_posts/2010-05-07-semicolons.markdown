---
title: Semicolons in JavaScript are optional
layout: post
categories: js frontend
tags: featured
description: >
  Relax. Your JavaScript doesn't need semicolons.
---

JavaScript is a scripting language where semicolons as statement terminators are *optional*, as in:

> <strong>op·tion·al</strong> (<i>adjective</i>)  
> Available to be chosen but not obligatory

However, there is a lot of FUD (fear, uncertainty, and doubt) around this feature and, as a result, most developers in our community [will recommend always including semicolons][so], <q>just to be safe</q>.

Safe from *what?* I've been searching for reasons programmers have to force semicolons on themselves. Here's what I generally found:


## <q>Spec is cryptic and JavaScript implementations differ</q>

[Rules for automatic semicolon insertion][insertion] are right here and are, while somewhat difficult to comprehend by a casual reader, quite explicitly laid out. As for JavaScript implementations where interpretation of these rules *differs*, well, I've yet to find one. When I ask developers about this, or find archived discussions, typically they are <q>yeah, there's this browser where this is utterly broken, I simply forgot which</q>. Of course, they never remember.

I write semicolon-less code and, in my experience, there isn't a JavaScript interpreter that can't handle it.


## <q>You can't minify JavaScript code without semicolons</q>

There are 3 levels of reducing size of JavaScript source files: *compression* (e.g. gzip), *minification* (i.e. removing unnecessary whitespace and comments) and *obfuscation* (changing code, shortening variable and function names).

Compression like gzip is the easiest; it only requires one-time server configuration, doesn't need extra effort by developers and *doesn't change* your code. There was a time when IE6 couldn't handle it, but if I remember correctly it was patched years ago and pushed as a Windows update, and today nobody really cares anymore.

Minification and obfuscation *change your code*. They are tools which you run on your source code saying "here are some JavaScript files, try to make them smaller, but **don't change functionality**". I'm reluctant to use these tools because many developers report that if I don't use specific coding styles, like writing semicolons, they will break my code. I'm OK with people (community) forcing certain coding styles on me, but not tools.

Suppose I have code that works in every JavaScript implementation that I target (major browsers and some server-side implementations). If I run it through your minification tool and that tools *breaks* my code, then I'm sad to report that your tool is *broken*. If this tool edits JavaScript code, it'd better understand it as a real interpreter would.

While on the topic of minification, let's do a reality check. I took the jQuery source and [removed all semicolons][removed], then ran it through [Google Closure Compiler][compiler]. Resulting size was 76,673 bytes. The size of original "jquery.min.js" was 76,674 (1 byte more). So you see, there was almost no change; and of course, its test suite passed as before.

How is that possible? Well, consider this code:

{% highlight js %}
var a=1
var b=2
var c=3
{% endhighlight %}

That's 24 bytes right there. Stamp semicolons everywhere and run it through a minifier:

{% highlight js %}
var a=1;var b=2;var c=3;
{% endhighlight %}

Still 24 bytes. So, adding semicolons and removing newlines saved us a whopping zero bytes right there. Radical. Most size reduction after minification isn't gained by removing newline characters — it's thanks to removing code comments and leading indentation.

<ins>**Update:** a lot of people have pointed out that their minifiers *rewrite*
this expression as `var a=1,b=2,c=3`. I know that some tools do this, but the
point of this article is just to explore how semicolons relate to whitespace. If
a minifier is capable of rewriting expressions (e.g. Closure Compiler) it means
that it can also insert semicolons automatically.</ins>

Also, some people recommend forcing yourself do use curly braces for blocks, even if they're only one line:

{% highlight js %}
// before
if(condition) stuff()

// after
if(condition){
  stuff()
}

// after minification
if(condition){stuff()}
{% endhighlight %}

Enforced curly braces add at least a byte to our expression, even after minification. I'm not sure what the benefit is here—it's not size and it's not readability, either.

Here are some other whitespace-sensitive languages that you might have heard about:

* Ruby — messing with spaces in expressions with operators and method calls can break the code
* Python — duh.
* HTML — see notes about [Kangax's HTML minifier][html]
* [Haml templates][haml]

Of course, there's no need for minification on the server-side. I made this list for the sake of the following argument: Whitespace can, and often is, part of the (markup) language. It's not necessarily a bad thing.


## <q>It's good coding style</q>

Also heard as:

* <q>It's good to have them for the sake of consistency</q>
* <q>[JSLint][] will complain</q>
* <q>[Douglas Crockford says so.][crockford]</q>

This is another way of expressing the "everybody else is doing it" notion and is used by people during online discussion in the (rather common) case of a lack of arguments.

My advice on JSLint: don't use it. Why would you use it? If you believed that it helps you have less bugs in your code, here's a newsflash; only people can detect and solve software bugs, not tools. So instead of tools, get more people to look at your code.

Douglas Crockford also says "four spaces", and yet most popular JavaScript libraries are set in either tabs or two spaces. Communities around different projects are *different*, and that's just how it should be. As I've said before: let *people* and yourself shape your coding style, not some single person or tool.

You might notice that in this article I'm not telling you *should* be semicolon-free. I'm just laying out concrete evidence that you *can* be. The choice should always be yours.

As for *coding styles*, they exist so code is more readable and easier to understand for a group of people in charge of working on it. Think deeply if semicolons actually improve the readability of your code. What improves it the most is whitespace—indentation, empty lines to separate blocks, spaces to pad out expressions—and good variable and function naming. Look at some [obfuscated code][ugly]; there are semicolons in there. Does it help readability? No, but what would really help is a lot of whitespace and original variable names.


## <q>Semicolon insertion bites back in return statements</q>

When I searched for "JavaScript semicolon insertion", here is the problem most blog posts described:

{% highlight js %}
function add() {
  var a = 1, b = 2
  return
    a + b
}
{% endhighlight %}

When you're done trying to wrap your brain around why would anyone in their right mind want to write a return statement on a new line, we can continue and see how this statement is interpreted:

{% highlight js %}
return;
  a + b;
{% endhighlight %}

Alas, the function didn't return the sum we wanted! But you know what? This problem *isn't* solved by adding a semicolon to the end of our wanted `return` expression (that is, after `a + b`). It's solved by *removing* the newline after `return`:

{% highlight js %}
return a + b
{% endhighlight %}

Still, in an incredible display of ignorance these people actually *advise* their readers to avoid such issues by adding semicolons everywhere. Uh, alright, only it doesn't help this particular case at all. We just needed to understand better how the language is parsed.


## The only real pitfall when coding without semicolons

Here is the only thing you have to be aware if you choose to code semicolon-less:

{% highlight js %}
// careful: will break
a = b + c
(d + e).print()
{% endhighlight %}

This is actually evaluated as:

{% highlight js %}
a = b + c(d + e).print();
{% endhighlight %}

This example is taken from an [article about JavaScript 2.0 future compatibility][mozilla], but I've ran across this in my own programs several times while using [the module pattern][module].

Easy solution: when a line starts with parenthesis, prepend a semicolon to it.

{% highlight js %}
;(d + e).print()
{% endhighlight %}

This might not be elegant, but does the job. [Michaeljohn Clement elaborates on this][inimino] even further:

> If you choose to omit semicolons where possible, my advice is to insert them immediately before the opening parenthesis or square bracket in any statement that begins with one of those tokens, or any which begins with one of the arithmetic operator tokens `/`, `+`, or `-` if you should happen to write such a statement.

Adopt this advice as a rule and you'll be fine.

[crockford]: http://javascript.crockford.com/code.html "Code Conventions for the JavaScript Programming Language"
[so]: http://stackoverflow.com/questions/444080/do-you-recommend-using-semicolons-after-every-statement-in-javascript "Do you recommend using semicolons after every statement in JavaScript? on StackOverflow"
[mozilla]: http://www.mozilla.org/js/language/js20-2000-07/rationale/syntax.html "Semicolon Insertion future compatibility with JavaScript 2.0"
[insertion]: http://bclary.com/2004/11/07/#a-7.9 "Automatic Semicolon Insertion in ECMAScript Language Specification"
[html]: http://perfectionkills.com/experimenting-with-html-minifier/ "Experimenting with html minifier"
[haml]: http://haml-lang.com/
[jslint]: http://www.jslint.com/ "The JavaScript Code Quality Tool"
[module]: http://www.yuiblog.com/blog/2007/06/12/module-pattern/
[ugly]: http://img.skitch.com/20100509-qf8t69ad7cpmudwdksbw5hu6te.png
[compiler]: http://code.google.com/closure/compiler/
[removed]: http://github.com/mislav/jquery/commit/4a2faf8987fc3fcb8aefc99def5b5ed2b4de190c "jQuery without semicolons"
[inimino]: http://inimino.org/~inimino/blog/javascript_semicolons "JavaScript semicolon insertion: everything you need to know"
