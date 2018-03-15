const Graph = require('../graph');
const expect = require('chai').expect;

describe('Graph', function() {
  it('should exist', function() {
    let graph = new Graph({});

    expect(graph).to.be.a('object');
  });
});
