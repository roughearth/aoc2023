# Day 10

Hard day.

I made Part 2 much harder that I needed to. I tried
* counting boundaries, but couldn't handle running along the boundary properly, especially because my found loop didn't include corner shapes, so I didn't know if an edge was a boundary or not
* flooding the outside, but that didn't work account for "tight" gaps

Then I remembered that the source data included corner info, and counting crossings to the left would work after all. I could probably made that more efficient with some sort of cumulative sum, but I didn't bother.
