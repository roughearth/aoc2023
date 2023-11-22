# Day 18

## Code notes

I made a right meal of part 2. I made three poor decisions on testing for "inside".

1. I decided to test for inside rather that outside
2. I then decided to do some version of path counting to the outside, which just didn't work.
3. I then decided to BFS (via my Dijkstra) from each point to see if it was inside, which was stupidly slow.

I finally hit upon BFS from a known outside point (which "happened"(?) to be the smallest coordinate in the bounding box) to get all the outside points and go from there (doh! I know!).

That was still wrong! Finally I realised that there must be some "outside" points not reachable that way because the lava blob touches its bounding box in a way that cuts off some of the outside. So I expanded the bounding box before BFSing the outsides.

## Coffee notes

Today's coffee is really nice. 9 / 10.
