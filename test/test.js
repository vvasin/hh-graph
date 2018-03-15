const Graph = require('../graph');
const expect = require('chai').expect;

// Helper... trusted to work properly
class AccessCounter {
  constructor(value) {
    this.accessCount = 0;
    this.returnValue = value;
  }

  get value() {
    this.accessCount++;
    return this.returnValue;
  }

  get count() {
    return this.accessCount;
  }
};

describe('Graph', function() {
  it('should exist', function() {
    let graph = new Graph({});

    expect(graph).to.be.a('object');
  });

  it('should accept native functions', function() {
    let graph = new Graph({
      a: (() => 1).bind()
    });

    expect(graph.a).to.equal(1);
  });

  describe('Static nodes', function() {
    it('should return the same value', function() {
      let graph = new Graph({
        a: 1
      });

      expect(graph.a).to.be.a('number');
      expect(graph.a).to.equal(1);
    });

    it('should be accessed by computational nodes', function() {
      let graph = new Graph({
        a: 1,
        b: () => a
      });

      expect(graph.b).to.equal(1);
    });
  });

  describe('Computational nodes', function() {
    it('should return computed value', function() {
      let graph = new Graph({
        a: () => 1 + 1,
      });

      expect(graph.a).to.equal(2);
    });

    it('should access other nodes', function() {
      let graph = new Graph({
        a: 1,
        b: () => a,
        c: () => b + b
      });

      expect(graph.c).to.equal(2);
    });

    it('should be lazy', function() {
      let accessCounter = new AccessCounter(1);

      let graph = new Graph({
        accessCounter: accessCounter,
        a: () => 1,
        b: () => accessCounter.value
      });

      expect(graph.a).to.equal(1);
      expect(accessCounter.count).to.equal(0);
    });

    it('should not be computed twice', function() {
      let accessCounter = new AccessCounter(1);

      let graph = new Graph({
        accessCounter: accessCounter,
        a: () => accessCounter.value
      });

      expect(graph.a).to.equal(1);
      expect(graph.a).to.equal(1);
      expect(accessCounter.count).to.equal(1);
    });

    it('but also should be able to reset (why not)', function() {
      let accessCounter = new AccessCounter(1);

      let graph = new Graph({
        accessCounter: accessCounter,
        a: () => accessCounter.value
      });

      expect(graph.a).to.equal(1);
      // Well, actually I forgot I have no interface for that
      graph.__lookupGetter__('a').reset();
      expect(graph.a).to.equal(1);
      expect(accessCounter.count).to.equal(2);
    });
  });

  describe('Cycles', function() {
    it('should not be allowed', function() {
      let graph = new Graph({
        a: () => b,
        b: () => c,
        c: () => a
      });

      expect(() => graph.a).to.throw();
    });
  });
});
