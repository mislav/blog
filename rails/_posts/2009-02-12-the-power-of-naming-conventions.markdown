---
permalink: /rails/the-power-of-naming-conventions/
title: The power of naming conventions
layout: post
categories: Rails
tags: dated
---

Ruby developers are very sensitive to naming things. There are strong conventions regarding class, variable, method and file names, and these are not just organizational or cosmetic – some have their semantics even during code execution. For instance: in Rails a model named “Person” is implicitly tied to the “people” table in the database just by name inspection.

In our recent project we’ve been building lots of our application logic around naming. Today I was editing some code and have been blown away realizing how deep we actually went with this over time.

Take a look at this single line of code from one of our main Haml templates:

    = thumbnails_box "Top contributors", :expires_in => 30.minutes, :link => true

This renders a generic “thumbnails box” view partial populated with avatars and names of several of our top contributors. What isn’t obvious here is just how much this single line knows:

1. the text of the **heading** for the box is set to “Top contributors”;
2. the **ID of the DIV** that represents this box is set to “top_contributors”;
3. “top_contributors” suffix is **used in caching** to differentiate between other fragment caches on this page;
4. the box title is also **a link** to `top_contributors_path` named route (triggered by `:link => true`);
5. the data to populate the box is found in the `@top_contributors` **instance variable**;
6. the `@top_contributors` variable is created in the controller by paginating the `top_contributors` **named scope** of our models;
7. thumbnails are **paginated** with the `top_contributors_page` parameter to differentiate between other paginated collections on this page;
8. Ajax pagination is done with **event delegation** that pays attention to the ID of the DIV it originated from (in this case “top_contributors”).

If you read the above carefully, you have noticed that a single string “Top contributors” – that started off as a HTML title – went full-stack: from models to controllers, view templates, caching logic and even JavaScript. All by the power of naming.

One line of Ruby code = one idea. Still, this proves there’s no limit on how sophisticated that idea might be.


