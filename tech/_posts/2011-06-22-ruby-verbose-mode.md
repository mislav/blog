---
title: Ruby verbose mode and how it's broken
description: >
  The verbose mode in Ruby is both useful and distracting. It
  activates a mode where the interpreter is warning you about potentially
  dangerous syntax.
layout: post
category: ruby
---

The "verbose" mode of the ruby interpreter is activated by one of the
following command-line flags:

* `-v` – also prints the ruby version before running the program
* `-w` or `--verbose`
* `-W <level>` – the level can be one of 0, 1, and 2 (more info below)
* `-d` – turns on both verbose and debugging mode

From within ruby code, verbosity can be tested with the value of the
`$VERBOSE` global variable, which can have 3 states:

1. `nil` in case verbosity level was "0" (silence)
2. `false` for level "1" (medium); this is the default
3. `true` for level "2" (verbose); this is verbose mode.

Both `$VERBOSE` and `$DEBUG` variables have their shorter equivalents:
`$-v` and `$-w` for verbose mode and `$-d` for debug. You'll notice that
they are named to resemble command-line flags.

These values are meant to be used by developers to conditionally provide
extra output from their methods to STDOUT and STDERR. One built-in
example is the `Kernel#warn` method, which by default prints a message
to STDERR:

{% highlight ruby %}
if filename.empty?
  warn "Error: filename required"
  exit 1
end
{% endhighlight %}

However, `warn` won't print anything in case we silenced verbosity, i.e.
set the verbose level to "0":

    $ ruby -W0 my_script.rb

We can make similar decisions in our programs to output extra
information about non-critical errors in case the user chooses to see them:

{% highlight ruby %}
# in this script, `index` is an integer that shouldn't be negative
if index < 0 and $VERBOSE
  $stderr.puts "warning: index is a negative number"
  if $DEBUG
    $stderr.puts "index value: #{index.inspect}"
    $stderr.puts "array state: #{array.inspect}"
  end
end
{% endhighlight %}

By running the above script with `-w`, the user would get the first
message on standard error, but won't be swamped with values for
debugging. To see debugging info, they can use the `-d` flag.

## The undocumented feature of verbose mode

One thing about verbose mode that most of you might already be familiar with isn't
at all documented. I'm talking about the fact that verbose mode also
turns on ruby interpreter warnings, both syntax ones and those that
happen at runtime (e.g. method redefined).

Why are these modes mixed is not clear to me, but it definitely affects
how we developers treat the verbose mode. In short: we avoid it.

Depending on the size of your app and the number of dependencies, there's a
good chance that running your test suite will swamp you with a good few
hundred or even thousand syntax warnings that you might not care about:

    # run the tests
    $ RUBYOPT=-w rake

    # ... mayhem!

Some of these warnings are less useful than others.

### Undefined instance variable

Unlike local variables, you can use instance variables without
initializing them with a value. Their default value is nil.

So, Ruby lets us use ivars without initialization, but will punish us for
this at runtime in verbose mode:

    warning: instance variable @baloney not initialized

It isn't always trivial to initialize your ivars to nil, however. One
such example is when certain ivars are in use only in methods that come
from a module:

{% highlight ruby %}
module RoleSystem
  def role=(new_role)
    @role = new_role.to_s
  end

  def is_role?(role)
    @role == role.to_s
  end
end

Person.send :include, RoleSystem

Person.new('Mislav').is_role?('admin') #=> false
# warning: instance variable @role not initialized
{% endhighlight %}

What happened? We used `is_role?`, which reads from the ivar, before we
initialized that variable with the `role=` method. This is a valid use-case,
because we only want to use `role=` if there's a role to be set.

Ruby wants us to initialize the variable first, but how do we do it?
Since this is a variable only used by the module, we shouldn't
set it in `Person#initialize`; the Person class shouldn't know anyhing
of RoleSystem.

One option is to check whether the ivar is defined before using it:

{% highlight ruby %}
def is_role?(role)
  @role == role.to_s if defined? @role
end
{% endhighlight %}

This avoids the warning, but it forces us to make this check from every
method that accesses this variable. A better solution is to restrict ourselves
to define and use an accessor method `role` instead of accessing the
`@role` ivar directly:

{% highlight ruby %}
module RoleSystem
  def role
    return @role if defined? @role
  end
end
{% endhighlight %}

Turns out, this is exactly what `attr_reader :role` gives us, too, so
you can use that unless your accessor method requires more complexity.

### Method redefined warning

Ruby lets you overwrite an existing method. This can happen by accident
such as the example below, but usually happens intentionally as a
consequence of advanced metaprogramming.

{% highlight ruby %}
class Person
  # defines the `name` getter and `name=` setter:
  attr_accessor :name

  def name
    @name.to_s.capitalize
  end
  # warning: method redefined; discarding old `name`
end
{% endhighlight %}

You can avoid this warning by renaming or undefining the old method
before the definition of the new method:

{% highlight ruby %}
undef :name
{% endhighlight %}

However, `undef` will raise an error if the method `name` never existed
in the first place. You should guard yourself against this by checking
for the method before undefining it:

{% highlight ruby %}
undef :name if method_defined? :name
{% endhighlight %}

### "Useless use of `==` in void context"

Fans of RSpec usually like how it redefines certain operators to set
expectations, for instance the equality operator:

{% highlight ruby %}
it "is equal to the other" do
  # warning: Useless use of `==` in void context
  obj.should == other
  obj.should_not == something_else
end
{% endhighlight %}

In verbose mode, ruby will complain that the `==` operator is being used
in the wrong context and that its result will be discarded. Ruby doesn't
know that RSpec redefined the operator in this context to set up and
save the expectation. The operator is not "useless", but ruby doesn't
know that.

The only solution is to use RSpec's equality methods instead of operators:

{% highlight ruby %}
obj.should eq(other)
{% endhighlight %}

### "`*` interpreted as argument prefix"

Ruby lets us invoke methods without parentheses:

{% highlight ruby %}
process order1, order2, order3
{% endhighlight %}

Ruby also has a wildly useful "splat" operator, which we can use on an
array to turn its elements to distinct arguments to the method:

{% highlight ruby %}
orders = [order1, order2]
orders << order3

process *orders
{% endhighlight %}

This works, but because there are no parentheses, ruby will complain:

    warning: `*` interpreted as argument prefix

Ruby does this because it thinks we could be trying to use `*` as
multiplication operator on `process` and `orders`. We're not, and we
know perfectly what we're doing, but ruby feels the need to lecture us
on operators and whitespace.

A case similar to this is with the symbol-to-proc pattern:

{% highlight ruby %}
%w[boom bang].map &:upcase
# warning: `&' interpreted as argument prefix
{% endhighlight %}

The solution is to start using parentheses again:

{% highlight ruby %}
process(*orders)
%w[boom bang].map(&:upcase)
{% endhighlight %}

This isn't such a huge deal, but I'd rather that verbose mode didn't
complain about this.

## The main problem of verbose mode

As I see it, the main problem is that verbose mode is also [code
linting][lint] mode where the interpreter warns you about suspicious
syntax or practices that may be harmful (in its opinion).

The verbose mode really **should** be a mode that developers can use to
conditionally output extra information and deprecation warnings so the
users can choose when to see such warnings. Ideally, we all should be
developing with the `-w` flag permanently on, but because this also
turns on code linting, most developers choose to avoid this.

## Your open source code shouldn't generate warnings

If you're a developer of open source code, however, you should regularly
check that your code doesn't generate ruby warnings. If you accomplish
this, you allow users of your code to use it in their projects with the
verbose mode on and not get warned by potential threats in your
codebase.

An easy way to setup your test suite to run in verbose mode is to
configure your test script to always run the test runner with the `-w`
ruby flag. One way to do that is with the RUBYOPT environment variable:

    RUBYOPT="-w $RUBYOPT"

Often there is a more elegant way, for instance an RSpec rake task:

{% highlight ruby %}
desc 'Run specs'
RSpec::Core::RakeTask.new(:spec) do |t|
  t.ruby_opts = '-w'
end
{% endhighlight %}

Now that you've set up your test suite to run in verbose mode, you can
start fixing warnings in your code. However, 3rd-party libraries that your
project depends on can still generate warnings, which you probably
aren't interested in. You'll want to run a block of ruby code with
warnings silenced for the duration of the block. Rails already provides
this method called `silence_warnings` and here's how to implement it if
you don't use Active Support:

{% highlight ruby %}
# these methods are already present in Active Support
module Kernel
  def silence_warnings
    with_warnings(nil) { yield }
  end

  def with_warnings(flag)
    old_verbose, $VERBOSE = $VERBOSE, flag
    yield
  ensure
    $VERBOSE = old_verbose
  end
end unless Kernel.respond_to? :silence_warnings
{% endhighlight %}

Now you can require other libraries without seeing their warnings:

{% highlight ruby %}
silence_warnings do
  require '...'
end
{% endhighlight %}


[lint]: http://en.wikipedia.org/wiki/Lint_(software)
