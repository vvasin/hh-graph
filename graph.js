'use strict'

function Node(func) {
    var f = function() {
        if (f.evaluating) {
            throw 'Cyclic graphs are not allowed';
        }
        if (!f.evaluated) {
            f.evaluating = true;
            f.value = func();
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
    receive(graph) {
        this.nodes = eval(Object.keys(graph).reduce((expr, key) => 
            expr + 'var ' + key + ' = nodes[\'' + key + '\'] = Node(' + graph[key] + '); ',
            'var nodes = {}; '
        ) + 'nodes');
    }
}

class LazyGraph extends Graph {
    solve(vertex) {
        return this.nodes[vertex]();
    }
}

class EagerGraph extends Graph {
    solve() {
        var solution = {};

        for (let key in this.nodes) {
            solution[key] = this.nodes[key]();
        }

        return solution;
    }
}

var graph = {
    a: () => b()*b(),
    b: () => c() - d(),
    c: () => e().reduce((acc, elem) => acc + elem),
    d: () => 2,
    e: () => [1, 2, 3],
    f: () => a() + a()
};

var lazy = new LazyGraph();
lazy.receive(graph);
console.log(lazy.solve('a'));

var eager = new EagerGraph();
eager.receive(graph);
console.log(eager.solve());

eager.receive({
    a: () => b()*a(),
    b: () => a()*b(),
});

try {
    eager.solve('a');
} catch (e) {
    console.log(e);
}
