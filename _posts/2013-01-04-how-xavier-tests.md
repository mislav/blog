---
title: "Xavier Shay: How I test Rails applications"
link: http://rhnh.net/2012/12/20/how-i-test-rails-applications
description: >
  Xavier Shay shows a better way to organize tests in Rails applications.
layout: post
categories: Rails, testing
---

Xavier Shay:

> I use a different set of categories for my tests:
>
> * **Unit**. Do our objects do the right thing, and are they convenient to work with?
> * **Integration**. Does our code work against code we can’t change?
> * **Acceptance**. Does the whole system work?
>
> Note that these definitions of unit and integration are _radically different_ to
> how Rails defines them. [...] All of the typical Rails tests fall under the
> “integration” label.

Xavier then goes on to restate how <q>A test is not a unit test if it talks to
the database, communicates across a network, or touches the file system</q>, and
what constitutes an acceptance test.
