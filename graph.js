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
                func = new Function('__graph__', `with (__graph__) return (function ${value})();`);
            } catch (e) {
                try {
                    func = new Function('__graph__', `with (__graph__) return (${value})();`);
                } catch (e) {
                    func = value;
                }
            }
            Object.defineProperty(this, key, {
                get: Node(this, func)
            });
        } else {
            Object.defineProperty(this, key, {
                value: value
            });
        }
    }
}

console.log();

var globalObj = { someVal: 10, someFun: (a, b) => a + b };

var graph = new Graph({
    // We can use different function declarations
    a() { return b*b; },
    b: function() { return c - d; },
    c: () => e.reduce((acc, elem) => acc + elem),
    // Also we can use constants
    d: 2,
    e: [1, 2, 3],
    // This is how to capture something from outside
    f: globalObj,
    g: () => f.someFun(a, f.someVal),
    // And here is a way to access graph itself
    h: () => Object.getOwnPropertyNames(__graph__),
    // Why not to use custom keys?
    42: 1,
    '!@#$%': 2,
    i: () => __graph__[42] + __graph__['!@#$%'],
    // Oh, well...
    j: { b: 10, c: () => (a) => a*b },
    k: [Graph],
    l: () => new k[0](j),
    m: () => l.c(a)
});

console.log(graph.a);
console.log(graph.g);
console.log(graph.h);
console.log(graph.i);
console.log(graph.m);
