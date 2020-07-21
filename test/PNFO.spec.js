'use strict';

const PNFO = require('../PNFO');

describe('PNFO', function(){
  it('should be an immutable object', function(){
    expect(PNFO).to.be.frozen;
    expect(PNFO.singular).to.be.frozen;
    expect(PNFO.plural).to.be.frozen;
    expect(PNFO).to.deep.equal({singular: 'Hub', plural: 'Hubs'});
    expect(PNFO.singular).to.equal('Hub');
    expect(PNFO.plural).to.equal('Hubs');
    expect(() => { PNFO.singular = 'Group'; }).to.throw();
    expect(() => { PNFO.plural = 'Groups'; }).to.throw();
    expect(PNFO.singular).to.equal('Hub');
    expect(PNFO.plural).to.equal('Hubs');
  });
});
