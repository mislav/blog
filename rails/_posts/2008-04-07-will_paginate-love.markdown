---
permalink: /rails/will_paginate-love/
title: will_paginate love
layout: post
description: Getting emotional with the new, 2.2.0 release of the will_paginate library
categories: Rails
tags: dated
styles: |
    div.tweet { margin: 1.5em 0 1em 0; }
    div.tweet a { display: block; width: 700px; border: 1px solid #ddd; margin: 0 auto; }
    div.tweet a:hover, div.tweet a:focus { border-color: #E83F59 }
    div.tweet img { display: block; }
---

Everyone loves [will_paginate][1], the super-simple, yet powerful library for pagination in Ruby on Rails. But, with the current [2.2.0 release][2], there are many reasons to love it even more.

Why, just look at what folks on Twitter had to say for older releases:

<div class="tweet">
  <a href="http://twitter.com/javan/statuses/771762293" style="width:556px">
    <img src="/page_attachments/0000/0037/javan-crop.gif" alt="Javan: will_paginate just made me real happy" />
  </a>
</div>

This has always been more than just code. It was beauty to write so that it can be beauty to use. Read on about what’s new in your favorite plugin.

<div class="tweet">
  <a href="http://twitter.com/kneath/statuses/777190644">
    <img src="/page_attachments/0000/0029/kneath.gif" alt="Kyle Neath cracking open a Stella and enjoying the beauty that is will_paginate." />
  </a>
</div>

Kyle Neath is a programmer with attitude; he knows that you can sit back in your chair while pagination just writes itself out like [poetry][3] underneath the inked feather of a great writer.

    # in PoemsController
    def index
      @poems = Poem.paginate :page => params[:page], :order => 'created_at DESC'
    end
    # in views/poems/index.html.erb
    <%= will_paginate %>

By the name of controller  
will_paginate shall know  
From where poems should flow.

<div class="tweet">
  <a href="http://twitter.com/hasmanyjosh/statuses/773017331">
    <img src="/page_attachments/0000/0025/hasmanyjosh.gif" alt="Josh Susser: yes, will_paginate really is as easy to use as it says. the gem is nice too. buh-bye plugin!" />
  </a>
</div>

[Josh Susser][4] discovered that the will_paginate gem is a real jewel to install. It is the same code like in the plugin, but it’s available anytime, anywhere!

    gem sources -a http://gems.github.com/
    gem install mislav-will_paginate

Hook it up in your app and you’ll be good to go:

    # in config/environment.rb
    gem 'mislav-will_paginate', '~> 2.2.0'
    require 'will_paginate'

To find out more, hop to [installation instructions][5] section on [our wiki][6].

What’s even better, there are news of even nicer [gem dependencies][7] for your application. Rails 2.1 is building up to be an awesome release.

<div class="tweet">
  <a href="http://twitter.com/cwsaylor/statuses/323835312">
    <img src="/page_attachments/0000/0023/cwsaylor.gif" alt="Chris Saylor: Loving Rails plugins will_paginate + scope_out for stupid easy pagination." />
  </a>
</div>

Chris Saylor, if you loved “scope out” you would have _adored_ [has_finder][8]. Then you would also dance with delight when it got [merged to Rails 2.1][9] as [`named_scope`][10]. But then you would become sad when you realize you have older apps and how they use Rails 1.2 or 2.0 where this is not available. :(

I’m here to cheer you up. I’ve actually done a sneaky thing: stolen `named_scope` from edge Rails and made it available if you install plugin or gem version 2.2.0 even on older versions of Rails. I’ve once told <abbr title="Josh Susser">Josh</abbr> that William Paginate and has_finder will have a love child some day—now it has happened.

    # in environment.rb
    WillPaginate.enable_named_scope
    
    # the Poem model
    class Poem << ActiveRecord::Base
      belongs_to :author
      named_scope :about_love, :conditions => ['poems.body LIKE ?', '%love%']
    end
    
    Poem.about_love.find(:first)
    # -> Oh, how quickly daft jumping zebras love!
    
    # this code reads out like English ... and is also poetry by itself
    Author.find_by_name('Nick Kallen').poems.about_love.paginate(:page => 1)

<div class="tweet">
  <a href="http://twitter.com/bbenzinger/statuses/219168702">
    <img src="/page_attachments/0000/0039/bbenzinger.gif" alt="Brian Benzinger: Wow, the Rails plugin will_paginate is amazing" />
  </a>
</div>

How amazing _is it_, <abbr title="Brian Benzinger">Brian</abbr>? But you don’t have to answer that—benchmarks show that will_paginate 2.2.0 is **almost 2x more amazing** than 2.1.0 when it comes to to speed of rendering in the views. I’ve optimized `WillPaginate::LinkRenderer` to do our bidding much more efficient than before.

<div class="tweet">
  <a href="http://twitter.com/topfunky/statuses/399223842">
    <img src="/page_attachments/0000/0035/topfunky.gif" alt="Geoffrey Grosenbach: God bless the lads who wrote will_paginate. Why is that thing not in the Rails core?" />
  </a>
</div>

I really can’t tell, [<abbr title="Geoffrey Grosenbach">Geoffrey</abbr>][11]. What probably happened is that they tried to roll it in, but when they actually looked at it they were so overwhelmed by the beauty of its code that they burst into tears of joy, which filled up their keyboards and quickly rendered their MacBooks unusable for some time.

And by the way, God bless the person from whom I learned to write plugins. Who was that? Why, it was you!

<div class="tweet">
  <a href="http://twitter.com/sandrot/statuses/767874889">
    <img src="/page_attachments/0000/0031/sandrot.gif" alt="Sandro Turriate: will_paginate just made my night" />
  </a>
</div>

<abbr title="Sandro Turriate">Sandro</abbr> obviously spent some quality nights with it. Did he dress accordingly? Unstyled, naked pagination links look as small twigs in the dirt. [With a dash of CSS they can blossom][12] into the princess worthy of a queen’s ballroom.

You may not notice it, but page links are much more semantic than in previous versions … and a little bit easier to style. Designers rejoice.

<div class="tweet">
  <a href="http://twitter.com/technoweenie/statuses/264746052">
    <img src="/page_attachments/0000/0033/technoweenie.gif" alt="Rick Olson: will_paginate continues to rock my world" />
  </a>
</div>

You are not alone, Rick. It continues to rock _everyone’s_ world. And, same as rocking out, it never ends.


[1]: http://github.com/mislav/will_paginate/tree/master
[2]: http://rubyforge.org/frs/shownotes.php?group_id=5698&release_id=20928
[3]: http://poetrywithmeaning.com/
[4]: http://blog.hasmanythrough.com/
[5]: http://github.com/mislav/will_paginate/wikis/installation
[6]: http://github.com/mislav/will_paginate/wikis
[7]: http://ryandaigle.com/articles/2008/4/1/what-s-new-in-edge-rails-gem-dependencies
[8]: http://pivots.pivotallabs.com/users/nick/blog/articles/284-hasfinder-it-s-now-easier-than-ever-to-create-complex-re-usable-sql-queries
[9]: http://dev.rubyonrails.org/changeset/9084
[10]: http://ryandaigle.com/articles/2008/3/24/what-s-new-in-edge-rails-has-finder-functionality
[11]: http://nubyonrails.com/
[12]: http://mislav.uniqpath.com/will_paginate/
