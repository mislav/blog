---
title: "Git merge vs. rebase"
description: >
  How to settle on whether to merge or rebase at specific points in a
  team-shared git workflow.
layout: post
categories: git
styles: |
  ul { margin-left: 1.5em }
  pre {
    color: #D7DFDA; background-color: #222;
    padding: 1em 1.2em 1em 10px; font-size: 90%;
  }
  pre code { padding: 0 }
  pre em { color: #ACA41F; font-style: normal; }
---

## The short:

*   `git pull --rebase` instead of `git pull`

*   `git rebase -i @{u}` before `git push`

*   <i>(on "feature")</i> `git merge master` to make feature compatible with
    latest master

*   <i>(on "master")</i> `git merge --no-ff feature` to ship a feature

    However if "feature" contains only 1 commit, avoid the merge commit:  
    <i>(on "master")</i> `git cherry-pick feature`

## The long:

<i>
  If you enjoy this post, check out my
  [git tips you didn't know about]({% post_url 2010-07-23-git-tips %})!
</i>

### Avoid merge commits that result from `git pull`

When you want to push your changes to a branch, but someone else already pushed
before you, you have to pull in their changes first. Normally, git does a merge
commit in that situation.

Such merge commits can be numerous, especially between a team of people who push
their changes often. **Those merges convey no useful information to others, and
litter the project's history.**

You should always pull with `git pull --rebase`. Git can be configured to make
it the default behavior:

<pre>git config --global --bool <em>pull.rebase</em> true</pre>

### Interactively rebase local commits before pushing

Run this every time before pushing a set of commits:

<pre>git rebase <em>-i @{u}</em></pre>

The "u" stands for "upstream" (added in git v1.7.0), and it resolves to the
latest commit on this branch on the remote. Putting it simply,
**this command rewrites only the local commits which you're about the push.**
<ins>Starting in git v1.7.6, `@{upstream}` is the default for when there is no
argument.</ins>

This gives you a chance to perform basic housekeeping before sharing your
changes, such as _squashing related commits_ together and _rewording commit
messages_ if they're too long or not descriptive enough.

Suppose you have a set of 4 commits (newest first):

<pre>[D] oops! <em>fixed typo</em> in feature A
[C] <em>bugfix</em> for change B
<em>[B]</em> another change
<em>[A]</em> yay new feature!</pre>

You definitely want to squash A+D and B+C together, while still keeping A and B
separate. The philosophy behind this is: don't make bugs or typos a part of
your project's history if you haven't shared them yet.

### Integrate changes from master into a feature branch with merge

If you're working on a long-lived feature branch, it pays off to sometimes merge
in the master branch (assuming "master" is the main development branch) to
verify that they are compatible and to get the latest bug fixes.

You could also rebase the current branch on top of master, but the rebase has
shortcomings:

* If multiple people work on the feature, rewriting history complicates their
  workflow.
* Merge conflicts can be easier to deal with during merge than the more
  numerous, smaller conflicts during rebase.

### Record a merge commit when a feature lands into master

After working on a feature/topic branch, merge it in master like so:

<pre>git merge <em>--no-ff</em> feature</pre>

The `--no-ff` flag **ensures there will always be a merge commit**, even when
technically not necessary. Merge commits are useful because they convey the
following information:

* **where** do changes come from (in this case: the "feature" branch);
* **when** were the changes merged and **by whom**, possibly indicating a
  code review (if that's part of your development process);
* keeps commits related to this feature/topic **grouped together**.

Sometimes a topic branch will consist only of a single commit, especially for
bug fixes. When merging it in, I often **decide not to record the merge commit**
for a single commit because that merge information is less useful to the team:

* *where* changes come from is irrelevant, because the branch was likely
  short-lived, so people in the team haven't developed familiarity with it;
* *when* is already recorded in the commit itself as committer timestamp;
* there's nothing to *group* together.

You can pull in a single commit to master like so:

<pre>git <em>cherry-pick</em> feature</pre>
