---
permalink: /rails/faster-ri-documentation/
title: FastRI for the win
layout: post
categories: Rails ruby
tags: dated
---

Ruby can be wicked cool from the console. A couple of its well known utilities are **irb** (the interactive Ruby shell) and **ri**, a documentation lookup tool.

Although the former is incredibly useful, I doubt that <b>ri</b> sees much usage among the professionals—the biggest reason being that it is awfully slow.

    $ ri Array#compact
    
    # ... tapping my fingers for several seconds ...

It is also bugged in certain obscure ways.

Well, looks like [Mauricio Fernandez][1] shares our pain. He has created [FastRI: faster, smarter RI docs for Ruby][2].

This isn’t new. It was released more than a year ago, actually—I just can’t figure out how it went under the radar for so long. Today a member of [Caboose][3] pointed it out to me. Let’s install it, shall we?

There are 2 installation methods: gem vs. tarball. I went with gem, but the author recommends the tarball for performance purposes.

Once it’s installed, we need to build the index first:

    $ fastri-server -b
    
    # ... takes some time and writes to ~/.fastri-index

When it’s done, we’re ready to use it the same way we used <b>ri</b>. I’m going to use the <b>qri</b> executable which defaults to _local_ mode (read the article carefully for more info on local/remote mode).

![qri compact](/page_attachments/0000/0017/qri-compact.png)

Fast … and with syntax coloring, too!

<h2 id="irb">Docs in the interactive shell</h2>

There is more; often you are in <b>irb</b> and want to look up documentation while experimenting with code. Mauricio has written a follow-up post in which he explains [how to get in-shell documentation with tab completion][4]. The code you need to drop in your <i>~/.irbrc</i> is located near the bottom of his post, but if you’re using <b>qri</b> (like me) you’ll want to change one line in the pasted code:

    desc = `fri '#{candidate}'`
    desc = `qri '#{candidate}'`

Then you can prepend “ri_” to any method and get its documentation, right there in the console! Try it out:

    >> {}.ri_inject

Tab completion, a life saver for long methods, should also work.

But can we look up, say, _ActiveRecord_ methods on a model in our Rails application?

    >> Message.ri_update_all
    ----------------------------------------- ActiveRecord::Base::update_all
         ActiveRecord::Base::update_all(updates, conditions = nil, options 
         = {})
    ------------------------------------------------------------------------
         Updates all records with details given if they match a set of 
         conditions supplied, limits and order can also be supplied.
         ...

This not only works, but works awesomely. It is the greatest addition to my <i>.irbrc</i> in a long time.


[1]: http://eigenclass.org/
[2]: http://eigenclass.org/hiki/fastri
[3]: http://faces.caboo.se/
[4]: http://eigenclass.org/hiki/irb+ri+completion