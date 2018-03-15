const Graph = require('./graph')

let graph = new Graph({
    a: () => b*b,
    b: () => c + c,
    c: 1
});

console.log(graph.a);
