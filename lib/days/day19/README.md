# Day 19

## Code notes

Well it works, but it's *very* slow (many minutes).

I wonder if that's down to recursive DFS, and if iterative might be better...

A scan of the Reddit (which is almost useless this year), suggests no-one is doing any major pruning that I'm not, so it must be something else.

There's a lot of variation on the pruning heuristics too. Some weird ones out there.

If I get time (and find the effort), I might revisit this and try an iterative DFS with;

* nodes only at robot building, possibly jumping several minutes
* existing resource based limits on robot count
* existing big prune on upper bound vs already discovered max

Not sure about these (but they seemed to work for me);
* Don't make ore robots once you have clay
* Making a geode means don't try anything else (although pt 1 above might obviate that)
* Don't try "doing nothing" if you've also tried making geodebot or obsidian bot.

## Coffee notes


