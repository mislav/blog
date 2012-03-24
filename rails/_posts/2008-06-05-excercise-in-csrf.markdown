---
permalink: /rails/excercise-in-csrf/
title: An excercise in cross-site request forgery
layout: post
categories: Rails
tags: dated
---

If you are reading this on my blog and are logged in the [Working With Rails][1] community site, you just recommended [me as a Rails developer][2]—without even knowing it. <ins><b>Update:</b> By now they have fixed it and the hack does no longer work. Or does it? Hop to the bottom of this article for more info.</ins>

Yes, this is a hack, and yes—it is pretty sneaky. This vulnerability in web applications is exploited by something called **cross-site request forgery** (_CSRF_ in short). In simple terms, one site (the attacker; me in this case) forges an HTTP request to another site to do a certain action in visitor’s behalf.

<h2 id="how">How it was done</h2>

For this hack, all that it took was putting this hidden iframe somewhere on my blog:

    <iframe
      src="http://workingwithrails.com/recommendation/create?recommendation[for_person_id]=2764&recommendation[have_read_blog]=1"
      width="1" height="1" frameborder="0"></iframe>

It’s pretty clear what this does. It loads an external page in the iframe, the page being exactly the one that accepts POST data from a recommendation form on the Working With Rails site. The security hole is, this page does exactly the same action for GET requests with parameters in the URL! Because of this, it was easy to forge the request in the iframe.

This hack is brought to you courtesy of [Pratik Naik][3], who entertained my idea of WWR being vulnerable to CSRF long enough to actually bother trying requesting the above URL. Instead of the site refusing the connection to him, it responded with HTTP 500 status, which clearly indicated that it accepts GET requests but that we have to pass in correct parameters. The result of our hacking is the iframe you see above.

Did the hack work? Well, in less than 24 hours I’ve got enough recommendations to boost my raking by 10 places up. See for yourself:

<img src="/page_attachments/0000/0043/mislav-popularity.jpg" style="display:block; margin:1em auto" />

<h2 id="prevention">Preventing CSRF in your application</h2>

It’s easy to prevent this when you’re using Rails 2. Make sure you have `protect_from_forgery` call in your ApplicationController:

    class ApplicationController < ActionController::Base
      protect_from_forgery
    end

This protects all POST, PUT and DELETE actions by checking for the presence of a specific token that’s dependent on the user’s session. The token is injected in all forms on your site if you’re using Rails’ form helpers like `form_for` and `form_tag`. If you’re manually doing an Ajax POST request, you’ll have to include the “authenticity_token” parameter which has the value of what `form_authenticity_token` method returns. This is how I put it in a global variable in the view:

    <%= javascript_tag "_token = '#{form_authenticity_token}'" %>

Now I can use the “_token” value in my scripts to make Ajax POST requests.

What about GET requests? They are not protected with this mechanism for a reason—GET requests shouldn’t change any state or data in your application. If you have some controller action that does something to your data, make sure it’s _not_ accessible with the GET method.

This is already taken care by Rails’ RESTful routing mechanism. The “create”, “update”, and “destroy” actions aren’t accessible over GET.

Now all is well. You can relax.

<h2 id="more">More</h2>

[Alex MacCaw][4] wrote [a follow-up on how he continued to hack their site][5] even after they prevented GET requests for creating recommendations. He uses JavaScript to submit a dynamic form in a hidden iframe.


[1]: http://workingwithrails.com/
[2]: http://workingwithrails.com/person/2764-mislav-marohni
[3]: http://m.onkey.org/
[4]: http://www.eribium.org/
[5]: http://www.eribium.org/blog/?p=189