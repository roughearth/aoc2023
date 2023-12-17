# Day 17

Quite slow at the moment (20s and 2min), but it works.

A suggestion from Reddit is to say that each neighbour of a node is the cells that can be reached by moving straight in a valid direction. eg for part 2, if R is a valid direction, then the neighbours include the cells 4,5,6,7,8,9 or 10 cells to the right. This reduces the search space *and* reduces the complexity of the algorithm by removing the need to track the length of the current straight line.
