# Day 16

Had an issue with `\` in the input being interpreted as an escape character. Fixed by using `String.raw`.

Part 2 takes 7 seconds. Could optimise this by memoizing between runs where a beam goes after r,c,d, bur really? Perhaps by storing each traversed path as [r,c,d][] and referring to that, but that might not be any quicker...


Maybe after xmas.