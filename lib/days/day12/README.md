# Day 12

## Code notes

Used my pre-existing Dijkstra implementation, which is probably not as efficient as it could be.

Had a 'mare with the answers being off by two. My algorothm worked fine for the example, and for both Adam's and Michael's inputs, but not mine. It turned out that of those 4 inputs, only mine had some `y`s adjacent to the `E`, and I had set the height of `E` to be 1 more than `z`, forcing my algorithm to go via an explicit `z`.

## Coffee notes

To follow.
