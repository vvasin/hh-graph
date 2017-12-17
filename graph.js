'use strict'

function Node(graph, func) {
    var f = function() {
        if (!f.evaluated) {
            if (f.evaluating) {
                throw 'Cyclic graphs are not allowed';
            }
            f.evaluating = true;
            f.value = func(graph);
            f.evaluating = false;
            f.evaluated = true;
        }
        return f.value;
    }

    f.evaluating = false;
    f.evaluated = false;
    f.value = undefined;

    return f;
}

class Graph {
    constructor(graph) {
        for (let key in graph) {
            var value = graph[key];
            if (typeof value == 'function') {
                Object.defineProperty(this, key, {
                    configurable: true,
                    get: Node(this, value)
                });
            } else {
                Object.defineProperty(this, key, {
                    value: value
                });
            }
        }
    }

    solve() {
        var solution = {};
        Object.getOwnPropertyNames(this).forEach(function(key) {
            solution[key] = this[key]
        }, this);
        return solution;
    }
}

var graph = new Graph({
    a: (G) => G.b*G.b,
    b: (G) => G.c - G.d,
    c: (G) => G.e.reduce((acc, elem) => acc + elem),
    d: 2,
    e: [1, 2, 3],
    f: (G) => G.a + G.a
});

console.log(graph.a);
console.log(graph.solve());
