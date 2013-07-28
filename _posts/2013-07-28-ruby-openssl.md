---
title: "SSLError and Rubyist, sitting in a tree"
description: >
  Helping you debug the dreaded SSLError.
layout: post
categories: ruby
---

We've all been there. The dreaded error:

    OpenSSL::SSL::SSLError: SSL_connect returned=1 errno=0 state=SSLv3
    read server certificate B: certificate verify failed

It's seemingly random, it mentions "SSL" five times, and happens mostly after
installing a new version of Ruby or deploying code to a new server. It bites at
the worst times and can make you feel small and powerless.

“But I'm not a crypto expert!“, you cry. There, there
<i>[Taps you on the back]</i>. Crypto is hard, but fortunately certificate
verification is based on a few simple concepts. Let me show you it.

<i>
**TL;DR;** [Run this script][4] from the Ruby environment where you're getting
the error to help you debug what's going on.
</i>

Basically, the SSLError jumped up at you because one of the following is true:

1. The remote server presented a **valid certificate**, but your system *lacks
   root certificates* ("CA certs") without which you can't even verify whether
   you've put on shoes this morning.

2. The remote server presented a certificate that is *distributed within your
   company/organization* and which you were supposed to trust, but you *haven't
   configured the client* properly.

3. You were subject to a **Man in the Middle attack** (somebody on the network
   pretending to be that server) and now you're glad that the error was raised.
   The attackers return home in shame.

To avoid the error, in desperation, many were guilty of this:

{% highlight ruby %}
# No! Bad! [slaps you on the fingers]
http.verify_mode = OpenSSL::SSL::VERIFY_NONE
{% endhighlight %}

That turns off certificate (a.k.a "peer") verification completely, but beats the
point of SSL entirely. It also [makes animals extremely disappointed in you][1]
(except the corgi, who doesn't seem to care about security).

No, we'll turn verification back on, and fix our configuration instead.

{% highlight ruby %}
# Yes! Marry me!
http.verify_mode = OpenSSL::SSL::VERIFY_PEER
{% endhighlight %}

But first, let's explore how is SSL formed.

## It's like Chuck Norris facts, but about SSL

### SSL/TLS

They are the same protocols, except TLS is a newer specification of SSL. The
protocol takes effect at a specific layer of TCP/IP where it wraps application
data, but still takes advantage of the transport layer. It's like a cake where
the tastiest layer is the most mysterious one. What is it from? Who knows??

### HTTPS

Short for HTTP over SSL/TLS. Good ol' HTTP requests, headers, response bodies,
all encrypted. HTTPS traffic can even go through HTTP proxy servers, but proxies
can't eavesdrop on what's going on since the data is encrypted, so they just
forward it further. “Fine,“ say proxies, pretending they don't care about your
stupid messages anyway.

### OpenSSL

Ubiquitous open source implementation of SSL/TLS. Installing it won't provide
you with any root certificates, since it's not its job to tell you who to trust.
It just handles the nasty.

### Root certificates/CA bundle

Certificate Authority (CA) certificates is a bundle of certs identifying widely
trusted authorities. They are called "root certs" because they're at the end of
the validation chain, meaning they haven't been signed by anyone else.

They are usually installed system-wide in a shared location, although programs
can ship with their own bundle; e.g. Firefox. They can be contained in a single
file (see [SSL_CERT_FILE](#SSL_CERT_FILE)), individual files (see
[SSL_CERT_DIR](#SSL_CERT_DIR)), or be stored in a proprietary way such as in Mac
OS X Keychain.

The CA bundle can be provided and maintained by package managers on Linux
systems, or manually by system administrators.

### Certificate formats: PEM/DER

DER is a binary format, while PEM is simply the base64 encoding of the DER
format with "BEGIN" and "END" lines added. Because of these delimiters, multiple
certificates and keys can be stored together in a single file. This, combined by
the fact it's in plain text, makes PEM the more popular encoding.

The conventions for filename extensions aren't strong:

* `*.pem` is always PEM;
* `*.crt` is usually PEM, but can be DER;
* `*.cer` is usually DER, but can be PEM.

### Certificate validation chain

We arrive at the source of our woes. Most certificates are **signed with private
key** of some authority. Their certificates are in turn **also signed by some
higher authority**, until we reach a certificate which is self-signed, i.e. the
**root certificate**, which hopefully belongs to a CA who we trust. Because **we
have means of verifying each of those signatures**, we can be confident about
validity of a certificate if we already trust the entity that signed it.

E.g. a host named [Unerdwear][2] presents us with its certificate which is
signed by FutureCorp, which in turn is signed by Big Sugar Daddy. The Unerdwear
→ FutureCorp → Big&nbsp;Sugar&nbsp;Daddy relationship is what forms a chain. If Big
Sugar Daddy is a part of our CA bundle, we can trust that Unerdwear are who they
claim to be.

![GitHub cert chain as seen in Safari](http://f.cl.ly/items/2h1X2L3b1E3Y3815242z/GitHub%20cert%20chain.png)

## Meanwhile, in the Ruby world…

Ruby compiles with C bindings for OpenSSL. The locations where CA certs are
looked up depend on that OpenSSL's defaults. You can check that out with:

{% highlight ruby %}
require "openssl"
puts OpenSSL::OPENSSL_VERSION
puts "SSL_CERT_FILE: %s" % OpenSSL::X509::DEFAULT_CERT_FILE
puts "SSL_CERT_DIR: %s" % OpenSSL::X509::DEFAULT_CERT_DIR
{% endhighlight %}

You can change these locations with `SSL_CERT_FILE` and `SSL_CERT_DIR`
environment variables. An HTTP client library such as Net::HTTP will usually
provide you with additional means of configuring these values.

<h3 id=SSL_CERT_FILE>SSL_CERT_FILE</h3>

A bundle of multiple PEM certificates in a single file, usually containing the
CA bundle. If both this file and SSL_CERT_DIR are missing or empty, it's likely
that your system or at least this installation of OpenSSL doesn't yet have the
CA bundle installed.

On OS X, both locations are empty but system OpenSSL still manages to verify the
certificates. Is it magic?? No, it's [Apple patching OpenSSL][3] to look up
certificates in Keychain, where the system CA bundle is stored.

<h3 id=SSL_CERT_DIR>SSL_CERT_DIR</h3>

A directory to store individual certificates in, one certificate per file. But
it's not as simple as that. OpenSSL expects to find each certificate in a file
named by the certificate subject's hashed name, plus a number extension that
starts with 0. So if you inspect a non-empty SSL_CERT_DIR (on Ubuntu, for
example) you will see a bunch of files named `{HASH}.0`, where HASH is a short
hex string.

That means you can't just drop `My_Awesome_CA_Cert.pem` in the directory and
expect it to be picked up automatically. However, OpenSSL ships with a utility
called `c_rehash` which you can invoke on a directory to have all certificates
indexed with appropriately named symlinks. If you have multiple OpenSSL versions
installed (on OS X, you likely will), beware: the hashing algorithm changed
between OpenSSL 0.9.8 and 1.0.1, so you'd want to use `c_rehash` distributed by
the version which is actually going to *use* those certificates.

## Just tell me how to fix it already ಠ_ಠ

<i>I'm getting to that!!</i> Anyway, you were making an HTTP request that
failed. Fixing it depends on the context.

### It was a host that I expected that my system already trusts, like api.rubygems.org

You've got a case of the missing CA bundle and you need to either:

* Install the CA bundle from somewhere, e.g. via the "ca‑certificates" package
  ("curl‑ca‑bundle" for Homebrew), and symlink it from
  [SSL_CERT_FILE](#SSL_CERT_FILE) if necessary.

* If there's already a CA bundle on disk that you want to use, point
  `SSL_CERT_FILE` or `SSL_CERT_DIR` environment variables to it, or use the
  `ca_file=` or `ca_path=` properties in Net::HTTP.

### It was a custom certificate that we use internally in our organization that my program can't verify

Drop the certificate in [SSL_CERT_DIR](#SSL_CERT_DIR) and run `c_rehash` on the
directory before trying again. If that's not an option, configure your HTTP
client with an individual certificate:

{% highlight ruby %}
require 'https'

http = Net::HTTP.new('example.com', 443)
http.use_ssl = true
http.verify_mode = OpenSSL::SSL::VERIFY_PEER

http.cert_store = OpenSSL::X509::Store.new
http.cert_store.set_default_paths
http.cert_store.add_file('/path/to/cacert.pem')
# ...or:
cert = OpenSSL::X509::Certificate.new(File.read('mycert.pem'))
http.cert_store.add_cert(cert)
{% endhighlight %}

## Tools to help you debug things and stuff

Find them at [github.com/mislav/ssl-tools][5]


  [1]: http://www.buzzfeed.com/expresident/animals-who-are-extremely-disappointed-in-you
  [2]: http://unerdwear.com/
  [3]: http://opensource.apple.com/source/OpenSSL098/OpenSSL098-35.1/src/crypto/x509/x509_vfy_apple.c
  [4]: https://github.com/mislav/ssl-tools/blob/ea97ca1592523d8cf7bce91d5015c4442bd37846/doctor.rb
  [5]: https://github.com/mislav/ssl-tools
