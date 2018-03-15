'use strict'

function Node(func) {
    var f = function() {
        if (!f.evaluated) {
            if (f.evaluating) {
                throw 'Cyclic graphs are not allowed';
            }
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
    f.reset = function() { f.evaluated = false; };

    return f;
}

function Graph(graph) {
    for (let key in graph) {
        let value = graph[key];
        if (typeof value == 'function') {
            let func;
            try {
                func = new Function('__graph__', `with (__graph__) return function ${value};`)(this);
            } catch (e) {
                try {
                    func = new Function('__graph__', `with (__graph__) return ${value};`)(this);
                } catch (e) {
                    func = value;
                }
            }
            Object.defineProperty(this, key, {
                get: Node(func)
            });
        } else {
            Object.defineProperty(this, key, {
                value: value
            });
        }
    }
}
