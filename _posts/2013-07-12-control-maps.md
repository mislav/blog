---
title: "Terminal control sequences"
description: >
  Mapping every letter of the alphabet to its function in shell prompt, process
  control, and Vim normal mode.
layout: post
categories: vim, shell
styles: |
  p code.file { background: none; padding: 0; color: #666 }
  td, th { vertical-align:top; text-align:left }
  th { padding:.1em .3em .1em 0 }
  th kbd, td kbd { font-size:.8em; font-weight:normal }
  table { border-collapse: collapse; margin: 1.2em 0 1.2em 1.5em }
  @media only screen and (max-width: 480px) {
    table { margin: 1em 0 }
  }
  table { font-family: "Minion Pro", "Palatino", "Hoefler Text", "Times New Roman", serif }
  table thead { cursor:default }
  table thead { text-transform: uppercase }
  table.split tbody th { font-weight: normal }
  table.split th, table.split td { padding: .1em .4em }
  table.split thead tr { border-bottom: 1px solid silver }
  table.split th, table.split td { border-right: 1px solid silver }
  table.split th:last-child, table.split td:last-child { border:none }
  table tr:nth-child(2n) { background:#eef }
  table td strong { color: darkred }
  ins { font-style: italic }
---

Using many control keys during the day, such as <kbd>Ctrl-f</kbd> to page down
in Vim and <kbd>Ctrl-c</kbd> to kill a process in terminal, and [assigning some
of my own][splits] to tmux, I've began wondering whether all the letters of the
alphabet were accounted for. The answer is: yes, they are; plus even some extra
characters.

Most key bindings differ depending on the context, except ones in the "term"
column that always keep the same function. The layers that I'm most interested
in are:

* **the shell** (bash/zsh with Emacs key bindings), where I edit commands and
  browse history;
* **process control** while running a process attached to the terminal;
* **Vim**, which I use exclusively in the terminal.

I have compiled a comprehensive overview of all control key bindings in different
contexts and highlighted the features that matter to me the most:

<table class=split>
<thead>
<tr><th>                 </th><th> term  </th><th> shell prompt               </th><th> process           </th><th> Vim normal</th></tr>
</thead>
<tr><th><kbd>C-A</kbd>   </th><td>       </td><td><strong> start of line</strong>              </td><td>                   </td><td><strong>increment number</strong></td></tr>
<tr><th><kbd>C-B</kbd>   </th><td>       </td><td> move back a char           </td><td>                   </td><td><strong> page up</strong></td></tr>
<tr><th><kbd>C-C</kbd>   </th><td>       </td><td>                            </td><td> SIGINT            </td><td></td></tr>
<tr><th><kbd>C-D</kbd>   </th><td>       </td><td> delete char                </td><td> send EOF          </td><td> half page down</td></tr>
<tr><th><kbd>C-E</kbd>   </th><td>       </td><td><strong> end of line</strong>                </td><td>                   </td><td> scroll up</td></tr>
<tr><th><kbd>C-F</kbd>   </th><td>       </td><td> move forward a char        </td><td>                   </td><td><strong> page down</strong></td></tr>
<tr><th><kbd>C-G</kbd>   </th><td>       </td><td> abort line                 </td><td>                   </td><td> file/position info</td></tr>
<tr><th><kbd>C-H</kbd>   </th><td> &lt;Bsp&gt; </td><td>                            </td><td>                   </td><td></td></tr>
<tr><th><kbd>C-I</kbd>   </th><td> &lt;Tab&gt; </td><td>                            </td><td>                   </td><td> jump forward</td></tr>
<tr><th><kbd>C-J</kbd>   </th><td> &lt;LF&gt;  </td><td>                            </td><td>                   </td><td></td></tr>
<tr><th><kbd>C-K</kbd>   </th><td>       </td><td> kill text to end of line   </td><td>                   </td><td></td></tr>
<tr><th><kbd>C-L</kbd>   </th><td>       </td><td> clear screen               </td><td>                   </td><td></td></tr>
<tr><th><kbd>C-M</kbd>   </th><td> &lt;CR&gt;  </td><td>                            </td><td>                   </td><td></td></tr>
<tr><th><kbd>C-N</kbd>   </th><td>       </td><td> next history               </td><td>                   </td><td> move cursor down</td></tr>
<tr><th><kbd>C-O</kbd>   </th><td>       </td><td> operate-and-get-next       </td><td>                   </td><td><strong> jump back</strong></td></tr>
<tr><th><kbd>C-P</kbd>   </th><td>       </td><td> previous history           </td><td>                   </td><td> move cursor up</td></tr>
<tr><th><kbd>C-Q</kbd>   </th><td>       </td><td> zsh: clear line            </td><td>                   </td><td></td></tr>
<tr><th><kbd>C-R</kbd>   </th><td>       </td><td><strong> backward inc. search</strong>        </td><td>                   </td><td> redo</td></tr>
<tr><th><kbd>C-S</kbd>   </th><td>       </td><td><strong> forward inc. search*</strong>         </td><td>                   </td><td></td></tr>
<tr><th><kbd>C-T</kbd>   </th><td>       </td><td> transpose chars            </td><td> SIGINFO           </td><td> undo tag jump</td></tr>
<tr><th><kbd>C-U</kbd>   </th><td>       </td><td> clear line                 </td><td>                   </td><td> half page up</td></tr>
<tr><th><kbd>C-V</kbd>   </th><td>       </td><td> insert next char literally </td><td>                   </td><td> visual block mode</td></tr>
<tr><th><kbd>C-W</kbd>   </th><td>       </td><td><strong> delete word</strong>                </td><td>                   </td><td> window prefix</td></tr>
<tr><th><kbd>C-X</kbd>   </th><td>       </td><td> prefix, e.g. C-x,C-e       </td><td>                   </td><td><strong>decrement number</strong></td></tr>
<tr><th><kbd>C-Y</kbd>   </th><td>       </td><td> yank                       </td><td> (delayed suspend) </td><td> scroll down</td></tr>
<tr><th><kbd>C-Z</kbd>   </th><td>       </td><td>                            </td><td><strong> SIGTSTP (suspend)</strong> </td><td></td></tr>
<tr><th><kbd>C-\</kbd>   </th><td>       </td><td>                            </td><td> SIGQUIT           </td><td></td></tr>
<tr><th><kbd>C-[</kbd>   </th><td> &lt;Esc&gt; </td><td>                            </td><td>                   </td><td> exit insert mode</td></tr>
<tr><th><kbd>C-]</kbd>   </th><td>       </td><td>                            </td><td>                   </td><td><strong> jump to tag</strong></td></tr>
<tr><th><kbd>C-^</kbd>   </th><td>       </td><td>                            </td><td>                   </td><td><strong> alternate buffer</strong></td></tr>
</table>

In the shell, these are indispensable:

* <kbd>C-r</kbd> - Backward incremental search through history
* <kbd>C-s</kbd> - Forward incremental search

<ins>\*For bash, `C-s` [doesn't work by default][unfreeze].
Here's how to enable it:</ins>

    # Allow <C-s> to pass through to shell and programs
    stty -ixon -ixoff

For process control:

* <kbd>C-z</kbd> - Suspend a process. Useful for switching away from a man page
  or Vim while keeping the option to return to it intact.
* <kbd>fg</kbd> (shell) - Return a process to foreground
* <kbd>jobs</kbd> (shell) - List suspended processes

In Vim:

* <kbd>C-f/b</kbd> - Page down/up
* <kbd>C-a/x</kbd> - Increment/decrement the number after cursor.
  Can't do CSS without it!
* <kbd>C-]</kbd> - Jump to tag under cursor
* <kbd>C-o</kbd> - Backtrack after having jumped

To learn more about navigating tags and jumps in Vim, see
[Vim: Revisited][revisited].


  [splits]: https://coderwall.com/p/rwmdvq
    "Seamlessly navigate tmux and Vim splits"
  [revisited]: http://mislav.uniqpath.com/2011/12/vim-revisited/
  [unfreeze]: http://unix.stackexchange.com/a/12146/28595
    "How to unfreeze after accidentally pressing Ctrl-S in a terminal?"
