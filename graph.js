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

function Graph(graph) {
    for (let key in graph) {
        let value = graph[key];
        if (typeof value == 'function') {
            let func;
            try {
                func = new Function('__graph__', `with (__graph__) return (${value})();`);
            } catch (e) {
                func = new Function('__graph__', `with (__graph__) return (function ${value})();`);
            }
            Object.defineProperty(this, key, {
                configurable: true,
                get: Node(this, func)
            });
        } else {
            Object.defineProperty(this, key, {
                value: value
            });
        }
    }
}

var globalVar = 10;

var graph = new Graph({
    // We can use different function declarations
    a() { return b*b; },
    b: function() { return c - d; },
    c: () => e.reduce((acc, elem) => acc + elem),
    // Also we can use constants
    d: 2,
    e: [1, 2, 3],
    // This is how to capture something from outside
    f: globalVar,
    g: () => a + f,
     // And here is a way to access graph itself
    h: () => Object.getOwnPropertyNames(__graph__)
});

console.log(graph.a);
console.log(graph.g);
console.log(graph.h);
