# Day 24


## Dev notes

Line through m1,n1 with gradient p1,q1 is given by: y = (q1/p1)x1 + (n1 - m1(q1/p1))

Pt of intersection is given by (q1/p1)x1 + (n1 - m1(q1/p1)) = (q2/p2)x2 + (n2 - m2(q2/p2))

(q1/p1)x + (n1 - m1(q1/p1)) = (q2/p2)x + (n2 - m2(q2/p2))

(q1/p1)x - (q2/p2)x = (n2 - m2(q2/p2) - (n1 - m1(q1/p1))

x = (n2 - m2(q2/p2) - (n1 - m1(q1/p1)) / ((q1/p1) - (q2/p2))
y = (q1/p1)x1 + (n1 - m1(q1/p1))

function getIntersection([m1, n1], [p1, q1], [m2, n2], [p2, q2]) {
  const x = (n2 - m2 * (q2 / p2) - (n1 - m1 * (q1 / p1))) / ((q1 / p1) - (q2 / p2));
  const y = (q1 / p1) * x + (n1 - m1 * (q1 / p1));
  return [x, y];
}

