---
title: Hack your Hashes in Prototype 1.6
category: js
description: Showing off a trick how to simulate old Hash behavior in Prototype 1.6
---

[Prototype 1.6.0 has been released][1] and changes to the Hash class have disappointed some people who wanted to continue using Hashes with normal JavaScript property lookup. I will show you how you can hack the Hash class to get the old behavior.

**A warning before you proceed**: this is an experimental proof-of-concept I put together in 5 minutes. Some things may not work as expected – for instance, `Hash#toObject` will not return a complete object with all the keys if you use this hack. Use this code _only if you don’t fear collisions_ between your keys and Hash instance methods or Enumerable.

## The hack

_Our goal_: to make `hash.key` and `hash.key = value` interchangeable with `hash.get('key')` and `hash.set('key', value)`, respectively. To illustrate:

    var hash = $H({ foo: 'bar' })
    
    hash.get('foo') //-> bar
    hash.foo        //-> bar
    
    hash.set('foo', 'baz')
    hash.get('foo') //-> baz
    hash.foo        //-> baz
    
    hash.foo = 'boo'
    hash.get('foo') //-> boo
    hash.foo        //-> boo

How to achieve this? Very simple; we just sprinkle a little `Function#wrap` magic in our user code:

    Hash.prototype.get = Hash.prototype.get.wrap(function(proceed, key) {
      return this[key] || proceed(key)
    })
    Hash.prototype.set = Hash.prototype.set.wrap(function(proceed, key, value) {
      this[key] = value
      return proceed(key, value)
    })
    Hash.prototype.initialize = Hash.prototype.initialize.wrap(function(proceed, object) {
      proceed(object)
      Object.extend(this, this._object)
    })
    Hash.prototype._each = Hash.prototype._each.wrap(function(proceed, iterator) {
      for (key in this) {
        if (key != '_object' && this[key] !== this._object[key] && this[key] !== Hash.prototype[key])
          this._object[key] = this[key];
      }
      proceed(iterator)
    })

So, it wasn’t so hard. Is it smart? Well, you are the end user, so you decide. I will certainly use only the new syntax to be safe from key-method collisions.

Monkeypatching the original Hash class this way may break the framework since it uses it internally. An alternative to monkeypatching is subclassing Hash:

    var MyHash = Class.create(Hash, {
      initialize: function($super, object) {
        $super(object)
        Object.extend(this, this._object)
      },
      get: function($super, key) {
        return this[key] || $super(key)
      },
      set: function($super, key, value) {
        this[key] = value
        return $super(key, value)
      },
      _each: function($super, iterator) {
        for (key in this) {
          if (key != '_object' && this[key] !== this._object[key] &&
              this[key] !== this.constructor.prototype[key])
            this._object[key] = this[key];
        }
        $super(iterator)
      }
    })

Now you have a new class that you can use in the way described above. If you don’t understand what I did in this last example, maybe it’s time you visit the [Classes and inheritance tutorial][2] I wrote on Prototype site.

Conclusion: you _gotta_ love the new `Function` methods and `Class` enhancements, they simply rock.


[1]: http://prototypejs.org/2007/10/16/prototype-1-6-0-rc1-changes-to-the-class-and-event-apis-hash-rewrite-and-bug-fixes
[2]: http://prototypejs.org/learn/class-inheritance