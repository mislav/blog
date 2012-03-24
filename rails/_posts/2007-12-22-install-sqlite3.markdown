---
permalink: /rails/install-sqlite3/
title: How to install SQLite3
layout: post
categories: Rails
description: A couple of easy steps to install SQLite on Windows or Linux
---

The default database for development in Rails is [SQLite3][1], which I personally think is great. Any Ruby developer (using Windows or any other OS) should have SQLite installed on their development environments. It only takes a minute.

<h2 id="windows">Install SQLite3 on Windows</h2>

1. Go to [SQLite3 download page][3], “Precompiled Binaries For Windows” section;
2. Download “sqlite-shell” and “sqlite-dll” archive files;
3. Unpack them in `C:\WINDOWS\system32` folder (or any other that is in your PATH);
4. Install the <i>sqlite3</i> Ruby gem.

<h2 id="linux">Install SQLite3 on Ubuntu Linux</h2>

1. Install the <i>sqlite3</i> and <i>libsqlite3-dev</i> packages;
2. Install the <i>sqlite3</i> gem.

<h2 id="mac">Install SQLite3 on Mac OS X</h2>

On Mac OS Leopard or later, you don’t have to! It comes pre-installed. You can upgrade it, if you absolutely need to, with [Homebrew][].


[1]: http://www.sqlite.org/
[3]: http://www.sqlite.org/download.html
[homebrew]: http://mxcl.github.com/homebrew/