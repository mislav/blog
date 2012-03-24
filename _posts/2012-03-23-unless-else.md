---
title: The controversy of "and or unless else"
description: >
  In which I give you permission to use `and` and `or` keywords in Ruby,
  as well as the `unless ... else` construct.
layout: post
categories: ruby
styles: |-
  table { width: 21em; border-collapse: collapse }
  @media only screen and (min-width: 481px) {
    table { margin: 1.5em 0 2em 1.5em }
  }
  table caption {
    font-style: italic; color: gray;
    border-bottom: 1px dotted silver;
    margin-bottom: .5em;
  }
  table th {
    text-align: left; font-size: .9em; font-weight: normal;
    padding: 0 .5em;
    width: 6em;
  }
  table .hl {
    background-color: lemonchiffon;
    color: black;
  }
  table .hl2 {
    background-color: #555;
    color: white;
    text-shadow: rgba(0,0,0,.8) 1px 1px 1px;
  }
---

There are two features of Ruby that are often frowned upon by experienced
Rubyists: the `and` and `or` keywords, and the `unless ... else` construct.

I want to argue that both are OK and, when used correctly, need not be
considered a code smell.


## Ruby's `and` and `or` are not voodoo

Every programmer learns at some point that `and` and `or` keywords are _not
synonyms_ for `&&` and `||` operators. Unfortunately, they usually learn it the
hard way, usually by trying to use them before assignment:

{% highlight ruby %}
# danger: will not work as expected
show_help = args.empty? or args[0] == '--help'
{% endhighlight %}

This code seemingly does what it was supposed to, but has a subtle bug: it does
not respect the `--help` flag.

Now the newbie programmer got burned, and asks "If `and` and `or` aren't
synonyms for operators, what _are_ they?" Seasoned programmers then, as an answer,
mumble something about "precedence", and they add "You must _never_ use them
again." From [GitHub's Ruby style guide][styleguide]:

> The `and` and `or` keywords are banned. It's just not worth it.

A hard rule like this is not very satisfying advice. (And yes, GitHub,
when you open-sourced your style guides, you turned them from internal documents
to advice for the community.)

The real answer is those keywords perform the same function as the operators,
but they have **different precedence**--therefore they have **different
use-cases**.

In fact, let's demystify them right away:

<table>
  <caption>A selection of
    <a href="http://phrogz.net/ProgrammingRuby/language.html#table_18.4">Ruby operators</a>,
    high to low precedence</caption>
  <tr>
  <th><code>!</code></th>
  <td>not</td>
  </tr>
  <tr>
  <th><code>&#42; / %</code></th>
  <td>multiply, divide, &amp; modulo</td>
  </tr>
  <tr>
  <th><code>+ -</code></th>
  <td>plus &amp; minus</td>
  </tr>
  <tr>
  <th><code>&lt;= &lt; &gt; &gt;=</code></th>
  <td>comparison</td>
  </tr>
  <tr>
  <th><code>&lt;=&gt; == !=</code></th>
  <td>equality</td>
  </tr>
  <tr class=hl>
  <th><code>&amp;&amp;</code></th>
  <td>logical 'and'</td>
  </tr>
  <tr class=hl>
  <th><code>||</code></th>
  <td>logical 'or'</td>
  </tr>
  <tr>
  <th><code>? :</code></th>
  <td>ternary</td>
  </tr>
  <tr class=hl2>
  <th><code>=</code></th>
  <td>assignment</td>
  </tr>
  <tr>
  <th><code>not</code></th>
  <td>logical negation</td>
  </tr>
  <tr class=hl>
  <th><code>or and</code></th>
  <td>logical composition</td>
  </tr>
</table>

They're right there in the bottom. If you are required to remember that
multiplication happens before addition in `a + b * f`, why not be aware that
assignment has higher precedence than `and`?

[Avdi Grimm argues][avdi] that those keywords, [originating from Perl][origin],
were intended to be **control flow operators**. I fully subscribe to this way of
thinking, and often use this and similar patterns in flow constructs:

{% highlight ruby %}
if name = params[:full_name] and !name.empty?
  # do something with name
end
{% endhighlight %}

Know your language well, and expect of others to know it, too. If beginner
programmers in your group stumble on this, help them out like you would help
with any other Ruby concept that isn't obvious (e.g. in `class << obj` syntax,
the `<<` operator is neither shift nor append). It's not such a big hurdle.

From [Programming Perl][]:

> The moral of the story is that you must still learn precedence (or use
> parentheses) no matter which variety of logical operator you use.


## The case of `unless ... else`

GitHub's style guide:

> Never use `unless` with `else`.

[Avdi Grimm in a twitter conversation][twitter]:

> in 10 years of Ruby I've never seen [an instance where `unless ... else` is fine].

[37signals blog][37s]:

> Never, ever, ever use an else clause with an unless statement.
> 
> [...] as with anything that gives you a little power, it can be abused.

Jamis from 37signals offers an intentionally convoluted example to prove their
point:

{% highlight ruby %}
unless !person.present? && !company.present?
  puts "do you even know what you're doing?"
else
  puts "and now we're really confused"
end
{% endhighlight %}

I'm sure Jamis is able to deliberately design horrible code that can make any
feature of Ruby look like an "abuse of power".

But as with `and` and `or`, `unless ... else` isn't some highly sophisticated,
magical voodoo construct that requires extreme concentration to wrap your head
around, and is best avoided to keep code clarity. It's just `if ... else`
reversed.

I'm using `unless ... else` when it fits, and I've got two simple criteria to
decide if that's the case:

1. The condition reads better in English under `unless` than with `if`;
2. I expect the `unless` code block to run more frequently than the `else` block.

{% highlight ruby %}
# some perfectly valid code, in my book
unless response.redirect?
  # process response.body (the more common case)
else
  # follow response['location']
end
{% endhighlight %}

However, [Konstantin Haase raises a valid argument][twitter]:

> if `unless ... else` would make sense, then `elsunless` would make sense, too.

It's true that `elsif` is only valid in `if` constructs, and there is no
counterpart for `unless`. However, I don't miss it, as I can't imagine how it
would ever read well in English.

<ins>**Update**: Avdi Grimm responds explaining [his thought process behind
improving the specific example above][response] by avoiding control flow blocks
altogether. I agree that careful refactoring can often reduce the amount of
control flow in favor of describing the logic in the language of the domain.</ins>


  [37s]: http://37signals.com/svn/posts/2699-making-sense-with-rubys-unless
    "37signals: Making sense with Ruby's 'unless'"
  [twitter]: http://twitter.theinfo.org/146617156161908737
  [styleguide]: https://github.com/styleguide/ruby
    "GitHub Ruby style guide"
  [avdi]: http://devblog.avdi.org/2010/08/02/using-and-and-or-in-ruby/
    "Avdi Grimm: Using 'and' and 'or' in Ruby"
  [programming perl]: http://www.amazon.com/Programming-Perl-ebook/dp/B0043D2DOQ/
    "Programming Perl, 3rd edition"
  [origin]: http://www.prestonlee.com/2010/08/04/ruby-on-the-perl-origins-of-and-versus-and-and-or/
    "Preston Lee on the Perl origins of 'and' and 'or' keywords in Ruby"
  [response]: http://devblog.avdi.org/2012/03/23/unless-readable-else-confused/
    "Avdi Grimm: Unless readable else confused"
