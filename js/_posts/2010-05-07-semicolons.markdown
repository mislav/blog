---
title: Semicolons in JavaScript are optional
layout: post
description: Stop the FUD and relax. Semicolons in JavaScript are not needed.
---

JavaScript is a scripting language where semicolons as statement terminators are *optional*, as in:

> <strong>op·tion·al</strong> (<i>adjective</i>)  
> Available to be chosen but not obligatory

However, there is a lot of FUD (fear, uncertainty, and doubt) around this feature and, as a result, most developers in our community [will recommend always including semicolons][so], <q>just to be safe</q>.

Safe from *what?* I've been searching for reasons programmers have to force semicolons on themselves. Here's what I generally found:


## <q>Spec is cryptic and JavaScript implementations differ</q>

[Rules for automatic semicolon insertion][insertion] are right here and, while somewhat difficult to comprehend by a casual reader, are solidly laid out. As for common JavaScript implementations that differ on their interpretation of these rules, I haven't found any by searching the web, but would love to hear about them.

I write semicolon-less code and, in my experience, I've yet to find a JavaScript interpreter that can't handle this.


## <q>You can't minify JavaScript code without semicolons</q>

There are 3 levels of reducing size of JavaScript source files: *compression* (e.g. gzip), *minification* (i.e. removing unnecessary whitespace and comments) and *obfuscation* (shortening variable and function names).

Compression like gzip is the easiest; it only requires one-time server configuration, doesn't need extra effort by developers and *doesn't change* your code. There was a time when IE6 couldn't handle it, but if I remember correctly it was patched years ago and pushed as a Windows update, and today nobody really cares anymore.

Minification and obfuscation *change your code*. They are tools which you run on your source code saying "here are some JavaScript files, try to make them smaller, but **don't change functionality**". I'm reluctant to use these tools, because many developers report that if I don't use specific coding styles, like writing semicolons, they will break my code.

Suppose I have code that works in every JavaScript implementation that I target (major browsers and some server-side implementations). If I run it through your minification tool and that tools *breaks* my code, then I'm sad to report that your tool is *broken*. If the tool needs to edit JavaScript code, it'd better understand it as a real interpreter would.

Also, here's a fun minification exercise:

    var a=1
    var b=2
    var c=3

That's 24 bytes right there. Stamp semicolons everywhere and run it through a minifier:

    var a=1;var b=2;var c=3;

Still 24 bytes. So, adding semicolons and removing newlines saved us a whopping 0 bytes right there. Radical. Most size reduction after minification isn't gained by removing newline characters; it's thanks to removing code comments and leading indentation.

Also, some people recommend forcing yourself do use curly braces for blocks, even if they're only one line:

    // before
    if(condition) stuff()
    
    // after
    if(condition){
      stuff()
    }
    
    // after minification
    if(condition){stuff()}

Enforced curly braces add at least a byte to our expression, even after minification. I'm not sure what the benefit is here—it's not size and it's not readability, either.

Here are some other whitespace-sensitive languages that you might have heard about:

* Ruby — removing or adding extra spaces from certain expressions can change their meaning
* Python — duh.
* HTML — see notes about [Kangax's HTML minifier][html]
* [Haml templates][haml]

Whitespace can, and often is, part of the (markup) language. It's not necessarily a bad thing.


## <q>It's good coding style</q>

This reason is found it these variants, too:

* <q>It's good to have them for the sake of consistency</q>
* <q>[JSLint][] will complain</q>
* [Douglas Crockford says so.][crockford]

This is another way of expression the "everybody else is doing it" notion and is used by people during online discussion in the (rather common) case of a lack of arguments.

Also, I don't think you people are listening to Crockford all that much. He says "four spaces", and yet:

* jQuery: tabs
* Prototype.js: 2 spaces
* Mootools: tabs

Guess what? Communities around different projects are *different*. And that's just how it should be.


## <q>Semicolon insertion bites back in return statements</q>

When I searched for "JavaScript semicolon insertion", here is the problem most blog posts described:

    function add() {
      var a = 1, b = 2
      return
        a + b
    }

When you're done trying to wrap your brain around why would anyone *ever* want to write a return statement on a new line, we can continue and see how this statement is interpreted:

    return;
      a + b;

Alas, it didn't return the sum of `a` and `b`! But you know what? This problem isn't solved by adding a semicolon to the end of our wanted `return` expression (that is after `a + b`). It's solved by removing the newline after `return`:

    return a + b

Again, extra semicolons didn't help. We just needed to understand how the language is parsed.


## The only real pitfall when coding without semicolons

Here is the only thing you have to be aware if you choose to code semicolon-less:

    // careful: will break
    a = b + c
    (d + e).print()

This is actually evaluated as:

    a = b + c(d + e).print();

This example is taken from an [article about JavaScript 2.0 future compatibility][mozilla], but I've ran across this in my own programs several times while using [the module pattern][module].

Easy solution: when a line starts with parenthesis, prepend a semicolon to it.

    ;(d + e).print()

Definitely not beautiful, but does the job. This case doesn't come very often.

The above article about JavaScript 2.0 is an interesting read and also lists some reasons how the 2.0 version of the language might change what's considered legal syntax for expressions. The thing is, I couldn't care less about JavaScript 2.0; *especially* if it breaks existing scripts. If the 2.0 version really is incompatible, web browsers won't switch what they ship anytime soon; and as for server-side JavaScript, developers control what's running there anyway.


[crockford]: http://javascript.crockford.com/code.html "Code Conventions for the JavaScript Programming Language"
[so]: http://stackoverflow.com/questions/444080/do-you-recommend-using-semicolons-after-every-statement-in-javascript "Do you recommend using semicolons after every statement in JavaScript? on StackOverflow"
[mozilla]: http://www.mozilla.org/js/language/js20-2000-07/rationale/syntax.html "Semicolon Insertion future compatibility with JavaScript 2.0"
[insertion]: http://bclary.com/2004/11/07/#a-7.9 "Automatic Semicolon Insertion in ECMAScript Language Specification"
[html]: http://perfectionkills.com/experimenting-with-html-minifier/ "Experimenting with html minifier"
[haml]: http://haml-lang.com/
[jslint]: http://www.jslint.com/ "The JavaScript Code Quality Tool"
[module]: http://www.yuiblog.com/blog/2007/06/12/module-pattern/