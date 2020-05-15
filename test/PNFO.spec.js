'use strict';

const PNFO = require('../PNFO');

describe('PNFO', function(){
  it('should be an immutable object', function(){
    expect(PNFO).to.be.frozen;
    expect(PNFO.singular).to.be.frozen;
    expect(PNFO.plural).to.be.frozen;
    expect(PNFO).to.deep.equal({singular: 'Node', plural: 'Nodes'});
    expect(PNFO.singular).to.equal('Node');
    expect(PNFO.plural).to.equal('Nodes');
    expect(() => { PNFO.singular = 'Group'; }).to.throw();
    expect(() => { PNFO.plural = 'Groups'; }).to.throw();
    expect(PNFO.singular).to.equal('Node');
    expect(PNFO.plural).to.equal('Nodes');
  });
});
