'use strict';

const {
  testPatternWithoutOptions,
  notStrings,
} = require('../helpers');
require('./date');

describe('matchers/date', function(){

  testPatternWithoutOptions(
    'anISODateString',
    ['2020-12-04T21:18:55.821Z', (new Date).toISOString()],
    [...notStrings(), 'today', '2020-12-04T21:18:55.821', new Date, Date.now()],
  );

  // by hand because time is hard
  it('aDateLessThanXAgo', function(){
    const isDateLessThan1000Ago = _.isDateLessThanXAgo(1000);
    expect(isDateLessThan1000Ago).to.be.a('function');
    expect(isDateLessThan1000Ago+'').to.be.equal('isDateLessThanXAgo(1000)');
    expect(isDateLessThan1000Ago()).to.be.false;
    expect(isDateLessThan1000Ago('yestuday')).to.be.false;
    expect(isDateLessThan1000Ago(new Date)).to.be.true;
    expect(isDateLessThan1000Ago(new Date(Date.now() - 2000))).to.be.false;
    expect(new Date(Date.now() - 1000)).to.be.aDateLessThanXAgo(2000);
    expect(() => {
      expect(new Date(Date.now() - 2000)).to.be.aDateLessThanXAgo(1000);
    }).to.throw('to match pattern aDateLessThanXAgo');
  });

  // by hand because time is hard
  it('aRecentDate', function(){
    expect(_.isRecentDate).to.be.a('function');
    expect(_.isRecentDate+'').to.be.equal('isRecentDate()');
    expect(_.isRecentDate()).to.be.false;
    expect(_.isRecentDate('yestuday')).to.be.false;
    const now = new Date;
    const twoSecondsAgo = new Date(now.getTime() - 2000);
    expect(_.isRecentDate(now)).to.be.true;
    expect(_.isRecentDate(twoSecondsAgo)).to.be.false;
    expect(now).to.be.aRecentDate();
    expect(twoSecondsAgo).to.not.be.aRecentDate();
  });

  // by hand because time is hard
  it('aRecentISODateString', function(){
    expect(_.isRecentISODateString).to.be.a('function');
    expect(_.isRecentISODateString+'').to.be.equal('isRecentISODateString()');
    expect(_.isRecentISODateString()).to.be.false;
    expect(_.isRecentISODateString('yestuday')).to.be.false;
    const now = new Date;
    const twoSecondsAgo = new Date(now.getTime() - 2000);
    expect(_.isRecentISODateString(now)).to.be.false;
    expect(_.isRecentISODateString(twoSecondsAgo)).to.be.false;
    expect(now).to.not.be.aRecentISODateString();
    expect(twoSecondsAgo).to.not.be.aRecentISODateString();
    expect(_.isRecentISODateString(now.toISOString())).to.be.true;
    expect(_.isRecentISODateString(twoSecondsAgo.toISOString())).to.be.false;
    expect(now.toISOString()).to.be.aRecentISODateString();
    expect(twoSecondsAgo.toISOString()).to.not.be.aRecentISODateString();
  });

  testPatternWithoutOptions(
    'aFullTimestamp',
    [
      'Wednesday, October 23rd 2019, 3:21:13pm',
    ],
    [...notStrings(), 'today', '2020-12-04T21:18:55.821'],
  );

  testPatternWithoutOptions(
    'aDateOrAnISODateString',
    ['2020-12-04T21:18:55.821Z', (new Date).toISOString(), new Date],
    [...notStrings(), 'today', '2020-12-04T21:18:55.821', Date.now()],
  );

});
