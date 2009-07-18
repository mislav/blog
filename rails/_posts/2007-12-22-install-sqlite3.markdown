---
title: How to install SQLite3
layout: post
category: rails
---

The new default database in Rails 2.0.2 is [SQLite3][1], which I personally think is a great default. Although there is [a discussion on Rails-core about reverting back to MySQL on Windows platforms if SQLite3 can’t be detected][2], I think the best choice for any Ruby developer (using Windows or any other OS) would be to simply have SQLite installed on every of her development environments. It only takes a minute.

<h2 id="windows">Install SQLite3 on Windows</h2>

1. Go to [SQLite3 download page][3], “Precompiled Binaries For Windows” section;
2. Download “sqlite-3xy.zip” and “sqlitedll-3xy.zip” archives;
3. Unpack them in “C:\WINDOWS\system32” directory (or any other that is in your PATH);
4. Install the <i>sqlite3-ruby</i> gem.

<h2 id="linux">Install SQLite3 on Ubuntu Linux</h2>

1. Install the <i>sqlite3</i> and <i>libsqlite3-dev</i> packages;
2. Install the <i>sqlite3-ruby</i> gem.

<h2 id="mac">Install SQLite3 on Mac OS X</h2>

On Leopard, you don’t have to! On Tiger, refer to [this guide by Scott Motte][4].


[1]: http://www.sqlite.org/
[2]: http://groups.google.com/group/rubyonrails-core/t/5e13088c604c7216
[3]: http://www.sqlite.org/download.html
[4]: http://scottmotte.com/archives/77