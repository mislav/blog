---
title: "Typing typographically correct characters"
description: "How to find and easily use typographically correct characters on the Mac."
layout: post
categories: Apple
tags: iOS featured
styles: |
  #post img { max-width: 100% }
  kbd {
    border: 1px solid;
    border-bottom-width: 2px;
    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;
    background-color: #F9F9F9;
    padding: 1px 3px;
    font-family: inherit;
    font-size: 0.85em;
    white-space: nowrap;
    border-color: #DDD #BBB #BBB #DDD;
  }
  table {
    border-collapse: collapse;
  }
  th, td { padding: .3em .5em }
  tr { border-bottom: 1px solid #ddd }
  thead tr { border-bottom-width: 2px }
  td span { font-family: Helvetica, sans-serif; }

  /* http://dl.dropbox.com/u/921159/Keyboard/page.html */
  #keyboard {
    width: 806px;
    height: 342px;
    background:	#d5d9dc;
    -moz-border-radius-topleft: 7px 21px;
    -moz-border-radius-topright: 7px 21px;
    -moz-border-radius-bottomright: 10px;
    -moz-border-radius-bottomleft: 10px;
    border-top-left-radius: 7px 21px;
    border-top-right-radius: 7px 21px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    padding: 10px 0 0;
    -webkit-box-shadow:  
      inset 0 0 8px #bbb,
      0 1px 0 #aaa,
      0 4px 0 #bbb,
      0 10px 30px #ddd;
    -moz-box-shadow:  
      inset 0 0 8px #bbb,
      0 1px 0 #aaa,
      0 4px 0 #bbb,
      0 10px 30px #ddd;
    box-shadow:  
      inset 0 0 8px #bbb,
      0 1px 0 #aaa,
      0 4px 0 #bbb,
      0 10px 30px #ddd;}

  #keyboard p {
    text-align: right;
    font: 12px Helvetica, sans-serif;
    text-shadow: rgba(255,255,255,.8) 0 1px 0;
    color: #999;
    padding-right: 16px;
  }
  #keyboard p a { text-decoration: none; color: inherit }
  #keyboard p a:hover { text-decoration: underline; }
  #keyboard ul {list-style-type: none; width: 784px; margin: 0 auto;}
  #keyboard li {float: left; margin: 0 !important }
  #keyboard a { text-decoration: none; }

  .key{
    cursor: default;
    display: block;
    color: #aaa !important;
    font: bold 9pt arial;
    text-decoration: none;
    text-align: center;
    width: 44px;
    height: 41px;
    margin: 5px;
    background: #eff0f2;
    -moz-border-radius: 4px;
    border-radius: 4px;
    border-top: 1px solid #f5f5f5;
    -webkit-box-shadow: 
      inset 0 0 25px #e8e8e8,
      0 1px 0 #c3c3c3,
      0 2px 0 #c9c9c9,
      0 2px 3px #333;
    -moz-box-shadow: 
      inset 0 0 25px #e8e8e8,
      0 1px 0 #c3c3c3,
      0 2px 0 #c9c9c9,
      0 2px 3px #333;
    box-shadow: 
      inset 0 0 25px #e8e8e8,
      0 1px 0 #c3c3c3,
      0 2px 0 #c9c9c9,
      0 2px 3px #333;
    text-shadow: 0px 1px 0px #f5f5f5;}

  .key:active, .keydown {
    color: #888;
    background: #ebeced;
    margin: 7px 5px 3px;
    -webkit-box-shadow:
      inset 0 0 25px #ddd,
      0 0 3px #333;
    -moz-box-shadow: 
      inset 0 0 25px #ddd,
      0 0 3px #333;
    box-shadow: 
      inset 0 0 25px #ddd,
      0 0 3px #333;
    border-top: 1px solid #eee;}

  .fn span {
    display: block;
    margin: 14px 5px 0 0;
    text-align: right;
    font: bold 6pt arial;
    text-transform: uppercase;}
  #esc {
    margin: 6px 15px 0 0;
    font-size: 7.5pt;
    text-transform: lowercase;}
  #eject {
    margin: 6px 15px 0 0;
    font-size: 9pt;
  }

  #numbers li a span {
    display: block;}
  #numbers li a b {
    margin: 3px 0 3px;
    display: block;}
  #numbers li .alt b {display: block;margin: 0 0 3px;}
  #numbers li #delete span {
    text-align: right;
    margin: 23px 10px 0 0;
    font-size: 7.5pt;
    text-transform: lowercase;}
    
  #qwerty li a span {
    display: block;
    margin: 13px 0 0;
    text-transform: uppercase;}
    
  #qwerty li #tab span {
    text-align: left;
    margin: 23px 0 0 10px;
    font-size: 7.5pt;
    text-transform: lowercase;}	

  #qwerty li .alt b {display: block; margin: 3px 0 0;}
  #qwerty li .alt span {margin: 2px 0 0;}

  #asdfg li a span {
    display: block;
    margin: 13px 0 0;
    text-transform: uppercase;}

  #asdfg li .alt span {margin: 0; text-transform: lowercase;}
  #asdfg li .alt b {display: block; margin: 3px 0 0;}
  #asdfg li #caps b {
    display: block;
    background: #999;
    width: 4px;
    height: 4px;
    border-radius: 10px;
    margin: 9px 0 0 10px;
    -webkit-box-shadow: inset 0 1px 0 #666;
    -moz-box-shadow:inset 0 1px 0 #666;
    box-shadow:inset 0 1px 0 #666;}
  #asdfg li #caps span {
    text-align: left;
    margin: 10px 0 0 10px;
    font-size: 7.5pt;}
  #asdfg li #enter span {
    text-align: right;
    margin: 23px 10px 0 0;
    font-size: 7.5pt;}

  #zxcvb li a span {
    display: block;
    margin: 13px 0 0;
    text-transform: uppercase;}
  #zxcvb li .shiftleft span {
    text-align: left;
    margin: 23px 0 0 10px;
    font-size: 7.5pt;
    text-transform: lowercase;}
  #zxcvb li .shiftright span {
    text-align: right;
    margin: 23px 10px 0 0;
    font-size: 7.5pt;
    text-transform: lowercase;}
  #zxcvb li .alt b {display: block;margin: 4px 0 0;}
  #zxcvb li .alt span {margin: 0;}

  #bottomrow li #fn span, #bottomrow li #control span, #bottomrow li #optionleft span, #bottomrow li #commandleft span {
    display: block;
    text-align: left;
    margin: 31px 0 0 8px;
    font-size: 7.5pt;
    text-transform: lowercase;}

  #bottomrow li #optionright span, #bottomrow li #commandright span {
    display: block;
    text-align: right;
    margin: 31px 8px 0 0;
    font-size: 7.5pt;
    text-transform: lowercase;}

  #arrowkeys span {
    display: block;
    margin: 4px 0 0;}

  .fn {height: 26px; width: 46px;}
  #delete {width: 72px;}
  #tab {width: 72px;}
  #caps {width: 85px;}
  #enter {width: 85px;}
  .shiftleft, .shiftright {width: 112px;}
  #fn, #control, .option, .command, #spacebar {height: 49px;}

  #control {width: 56px;}
  .option {width: 46px;}
  .command {width: 67px;}
  #spacebar {width: 226px;}

  #keyboard ul ol {list-style-type: none;}
  #down {height: 23px;}
  #up, #left, #right {height: 24px;}
  #left, #up { font-size: 11pt }
  #left, #right {margin: 30px 5px 5px;}
  #left:active, #right:active {margin: 32px 5px 3px;}
  #up {margin: 5px 5px 1px; border-bottom-right-radius: 0px; border-bottom-left-radius: 0px;}
  #up:active {margin: 8px 5px -2px;}
  #down {margin: 0 5px 5px; border-top-left-radius: 0px; border-top-right-radius: 0px;}
  #down:Active {margin: 3px 5px 4px;}

  .punct {
    font: bold 12pt/.8 Georgia, Times, serif;
    color: crimson !important;
    background-color: lemonchiffon;
  }
  .punct span { font-weight: bold }
  #qwerty .punct b { margin-top: 6px !important }

  #keyboard-wrap {
    overflow: hidden;
    width: 310px;
    padding-top: 20px;
    padding-bottom: 30px;
    border-left: 2px solid #aaa;
  }
  #keyboard-wrap #keyboard { margin-left: -512px }

  @media only screen and (device-width: 768px) { #left, #up { font-size: 9pt } }
  @media only screen and (device-width: 320px) { #left, #up { font-size: 9pt } }
---

With the Option (<kbd>⌥</kbd>) key on the Mac, you have access to a wide
range of Unicode and international characters under your fingertips
without resorting to the Special Characters picker.

The information presented below assumes the "U.S. Extended" keyboard
selected in Input Sources. Most of these shortcuts will work with
standard "U.S." input source but not all.

![U.S. Extended chosen in Input Sources settings][settings]

## Punctuation

<table>
<thead><tr>
  <th>char</th>
  <th>name</th>
  <th>keystroke</th>
  <th>usage</th>
</tr></thead>
<tbody>
<tr>
  <th>–</th>
  <td>en dash</td>
  <td><span><kbd>⌥</kbd>+<kbd>–</kbd></span></td>
  <td><a href="http://en.wikipedia.org/wiki/Dash#En_dash" title="En dash on Wikipedia">ranges, relationships &amp; connections</a></td>
</tr>
<tr>
  <th>—</th>
  <td>em dash</td>
  <td><span><kbd>⌥⇧</kbd>+<kbd>–</kbd></span></td>
  <td><a href="http://en.wikipedia.org/wiki/Dash#Em_dash" title="Em dash on Wikipedia">a break of thought</a></td>
</tr>
<tr>
  <th>…</th>
  <td>horizontal ellipsis</td>
  <td><span><kbd>⌥</kbd>+<kbd>;</kbd></span></td>
  <td></td>
</tr>
<tr>
  <th>“ ”</th>
  <td>double quotes</td>
  <td><span><kbd>⌥</kbd>+<kbd>[</kbd></span> <br> <span><kbd>⌥⇧</kbd>+<kbd>[</kbd></span></td>
  <td>quotations, irony</td>
</tr>
<tr>
  <th>‘ ’</th>
  <td>single quotes</td>
  <td><span><kbd>⌥</kbd>+<kbd>]</kbd></span> <br> <span><kbd>⌥⇧</kbd>+<kbd>]</kbd></span></td>
  <td>quotations, apostrophe</td>
</tr>
<tr>
  <th>« »</th>
  <td>guillemets</td>
  <td><span><kbd>⌥</kbd>+<kbd>\</kbd></span> <br> <span><kbd>⌥⇧</kbd>+<kbd>\</kbd></span></td>
  <td>quotations in some languages</td>
</tr>
<tr>
  <th>€</th>
  <td>Euro</td>
  <td><span><kbd>⌥⇧</kbd>+<kbd>2</kbd></span></td>
  <td></td>
</tr>
<tr>
  <th>°</th>
  <td>degrees</td>
  <td><span><kbd>⌥⇧</kbd>+<kbd>8</kbd></span></td>
  <td>°C, °F</td>
</tr>
</tbody>
</table>

It's worth noting that the <kbd>-</kbd> key on your keyboard is
neither a hyphen nor a minus sign, it's the "hyphen-minus" character.
It's often used as a dash, but shouldn't if you have access to proper
dash characters.

To memorize these punctuation characters, just remember they are all
near the Return key:

<div id="keyboard-wrap"><div id="keyboard">
  <p><a href="http://dl.dropbox.com/u/921159/Keyboard/page.html">CSS keyboard by Dustin Cartwright</a></p>
  <ul class="cf">
      <li><a href="#" class="key c27 fn"><span id="esc">esc</span></a></li>
      <li><a href="#" class="key c112 fn"><span>F1</span></a></li>
      <li><a href="#" class="key c113 fn"><span>F2</span></a></li>
      <li><a href="#" class="key c114 fn"><span>F3</span></a></li>
      <li><a href="#" class="key c115 fn"><span>F4</span></a></li>
      <li><a href="#" class="key c116 fn"><span>F5</span></a></li>
      <li><a href="#" class="key c117 fn"><span>F6</span></a></li>
      <li><a href="#" class="key c118 fn"><span>F7</span></a></li>
      <li><a href="#" class="key c119 fn"><span>F8</span></a></li>
      <li><a href="#" class="key c120 fn"><span>F9</span></a></li>
      <li><a href="#" class="key c121 fn"><span>F10</span></a></li>
      <li><a href="#" class="key c122 fn"><span>F11</span></a></li>
      <li><a href="#" class="key c123 fn"><span>F12</span></a></li>
      <li><a href="#" class="key fn"><span id="eject">⏏</span></a></li>
    </ul>
  <ul class="cf" id="numbers">
    <li><a href="#" class="key c192"><b>~</b><span>`</span></a></li>
    <li><a href="#" class="key c49"><b>!</b><span>1</span></a></li>
    <li><a href="#" class="key c50"><b>@</b><span>2</span></a></li>
    <li><a href="#" class="key c51"><b>#</b><span>3</span></a></li>
    <li><a href="#" class="key c52"><b>$</b><span>4</span></a></li>
    <li><a href="#" class="key c53"><b>%</b><span>5</span></a></li>
    <li><a href="#" class="key c54"><b>^</b><span>6</span></a></li>
    <li><a href="#" class="key c55"><b>&amp;</b><span>7</span></a></li>
    <li><a href="#" class="key c56"><b>*</b><span>8</span></a></li>
    <li><a href="#" class="key c57"><b>(</b><span>9</span></a></li>
    <li><a href="#" class="key c48"><b>)</b><span>0</span></a></li>
    <li><a href="#" class="key c189 alt punct"><b>—</b><span>–</span></a></li>
    <li><a href="#" class="key c187"><b>+</b><span>=</span></a></li>
    <li><a href="#" class="key c46" id="delete"><span>Delete</span></a></li>
    </ul>
  <ul class="cf" id="qwerty">
    <li><a href="#" class="key c9" id="tab"><span>tab</span></a></li>
    <li><a href="#" class="key c81"><span>q</span></a></li>
    <li><a href="#" class="key c87"><span>w</span></a></li>
    <li><a href="#" class="key c69"><span>e</span></a></li>
    <li><a href="#" class="key c82"><span>r</span></a></li>
    <li><a href="#" class="key c84"><span>t</span></a></li>
    <li><a href="#" class="key c89"><span>y</span></a></li>
    <li><a href="#" class="key c85"><span>u</span></a></li>
    <li><a href="#" class="key c73"><span>i</span></a></li>
    <li><a href="#" class="key c79"><span>o</span></a></li>
    <li><a href="#" class="key c80"><span>p</span></a></li>
    <li><a href="#" class="key c219 alt punct"><b>”</b><span>“</span></a></li>
    <li><a href="#" class="key c221 alt punct"><b>’</b><span>‘</span></a></li>
    <li><a href="#" class="key c220 alt punct"><b>»</b><span>«</span></a></li>
    </ul>
    <ul class="cf" id="asdfg">
    <li><a href="#" class="key c20 alt" id="caps"><b></b><span>caps lock</span></a></li>
    <li><a href="#" class="key c65"><span>a</span></a></li>
    <li><a href="#" class="key c83"><span>s</span></a></li>
    <li><a href="#" class="key c68"><span>d</span></a></li>
    <li><a href="#" class="key c70"><span>f</span></a></li>
    <li><a href="#" class="key c71"><span>g</span></a></li>
    <li><a href="#" class="key c72"><span>h</span></a></li>
    <li><a href="#" class="key c74"><span>j</span></a></li>
    <li><a href="#" class="key c75"><span>k</span></a></li>
    <li><a href="#" class="key c76"><span>l</span></a></li>
    <li><a href="#" class="key c186 punct"><span>…</span></a></li>
    <li><a href="#" class="key c222 alt"><b>"</b><span>'</span></a></li>
    <li><a href="#" class="key c13 alt" id="enter"><span>return</span></a></li>
    </ul>
    <ul class="cf" id="zxcvb">
    <li><a href="#" class="key c16 shiftleft"><span>Shift</span></a></li>
    <li><a href="#" class="key c90"><span>z</span></a></li>
    <li><a href="#" class="key c88"><span>x</span></a></li>
    <li><a href="#" class="key c67"><span>c</span></a></li>
    <li><a href="#" class="key c86"><span>v</span></a></li>
    <li><a href="#" class="key c66"><span>b</span></a></li>
    <li><a href="#" class="key c78"><span>n</span></a></li>
    <li><a href="#" class="key c77"><span>m</span></a></li>
    <li><a href="#" class="key c188 alt"><b>&lt;</b><span>,</span></a></li>
    <li><a href="#" class="key c190 alt"><b>&gt;</b><span>.</span></a></li>
    <li><a href="#" class="key c191 alt"><b>?</b><span>/</span></a></li>
    <li><a href="#" class="key c16 shiftright"><span>Shift</span></a></li>
    </ul>
  <ul class="cf" id="bottomrow">
    <li><a href="#" class="key" id="fn"><span>fn</span></a></li>
    <li><a href="#" class="key c17" id="control"><span>control</span></a></li>
    <li><a href="#" class="key option" id="optionleft"><span>option</span></a></li>
    <li><a href="#" class="key command" id="commandleft"><span>command</span></a></li>
    <li><a href="#" class="key c32" id="spacebar"></a></li>
    <li><a href="#" class="key command" id="commandright"><span>command</span></a></li>
    <li><a href="#" class="key option" id="optionright"><span>option</span></a></li>
        <ol id="arrowkeys" class="cf">
          <li><a href="#" class="key c37" id="left"><span>◂</span></a></li>
            <li>
              <a href="#" class="key c38" id="up"><span>▴</span></a>
              <a href="#" class="key c40" id="down"><span>▾</span></a>
            </li>
          <li><a href="#" class="key c39" id="right"><span>▸</span></a></li>
        </ol>
    </ul>
</div></div>

<script>
  document.getElementById('keyboard').addEventListener('click', function(e) {
    if (/\bkey\b/.test(e.target.className) || /\bkey\b/.test(e.target.parentNode.className))
      e.preventDefault()
  }, false)
</script>

## International diacritics

<table>
<thead><tr>
  <th>char</th>
  <th>name</th>
  <th>keystroke</th>
  <th>where</th>
  <th>example</th>
</tr></thead>
<tbody>
<tr>
  <th>é</th>
  <td>acute</td>
  <td><span><kbd>⌥</kbd>+<kbd>e</kbd> <kbd>e</kbd></span></td>
  <td>many European</td>
  <td>résumé, Kraków</td>
</tr>
<tr>
  <th>ñ</th>
  <td>tilde</td>
  <td><span><kbd>⌥</kbd>+<kbd>n</kbd> <kbd>n</kbd></span></td>
  <td>Spanish</td>
  <td>jalapeño</td>
</tr>
<tr>
  <th>ç</th>
  <td>cedilla</td>
  <td><span><kbd>⌥</kbd>+<kbd>c</kbd> <kbd>c</kbd></span></td>
  <td>Catalan, French</td>
  <td>Barça</td>
</tr>
<tr>
  <th>ü</th>
  <td>umlaut</td>
  <td><span><kbd>⌥</kbd>+<kbd>u</kbd> <kbd>u</kbd></span></td>
  <td>German, Hungarian</td>
  <td>über</td>
</tr>
</tbody>
</table>

You can see how the above four are easy to memorize; they are each
located under the letter this diacritic is most commonly associated
with. This doesn't stop you from combining them with other characters,
though; you can use <span><kbd>⌥</kbd>+<kbd>e</kbd> <kbd>a</kbd></span>
to get "á", for example.

Finally, something that you will almost never use (except when typing my
last name): Croatian.

<table>
<thead><tr>
  <th>char</th>
  <th>keystroke</th>
</tr></thead>
<tbody>
<tr><th lang=hr>ć</th> <td><span><kbd>⌥</kbd>+<kbd>e</kbd> <kbd>c</kbd></span></td></tr>
<tr><th lang=hr>č</th> <td><span><kbd>⌥</kbd>+<kbd>v</kbd> <kbd>c</kbd></span></td></tr>
<tr><th lang=hr>š</th> <td><span><kbd>⌥</kbd>+<kbd>v</kbd> <kbd>s</kbd></span></td></tr>
<tr><th lang=hr>ž</th> <td><span><kbd>⌥</kbd>+<kbd>v</kbd> <kbd>z</kbd></span></td></tr>
<tr><th lang=hr>đ</th> <td><span><kbd>⌥</kbd>+<kbd>L</kbd> <kbd>d</kbd></span></td></tr>
</tbody>
</table>

Croatian diacritics may resemble accents, particularly for "ć", but they
in fact form separate characters (and sounds). True accents are almost
never used in Croatian language, except when disambiguating homonyms.

## Combining diacritics

"Combining characters" in Unicode are marks that modify other
characters. For example, to add an acute to the e's in "resume", you
could position the cursor after the "e" and type
<span><kbd>⌥⇧</kbd>+<kbd>e</kbd></span>. For diacritics, you can get
combining characters on the Mac keyboard by combining Shift with one of
the already mentioned Alt-based keystrokes.

Although "é" (e-acute) and "é" (e with a combining diacritic) appear to
be identical, they are not. The former takes 2 bytes in UTF-8 while the
latter takes 3. However, both should be valid for presenting to the end
user, and engines that perform transliteration should take both forms
into account.

## Special characters in iOS

Most, if not all of the aforementioned characters are available on iOS
keyboard, too. By pressing and holding a single key, a list of related
characters pops out:

![iOS keyboard special keys][ios]

So even when writing tweets on the go, you have access to different
dashes, curly quotes and more.


  [settings]: http://img.skitch.com/20120117-ebx1cpf59aa5cifk8kbq1bds49.png
  [ios]: http://img.skitch.com/20120117-1rujr5uemijtcu84a2ue8h5x2a.png
