'use strict';

const sinon = require('sinon');

const knexHelpers = require('./knexHelpers');

describe('knexHelpers', function(){
  describe('knexSearch', function(){
    it('should be a function', function(){
      expect(knexHelpers.knexSearch).to.be.a('function');
    });
    it('should add a where condition to fuzzy match a set of columns as lowercase strings', function(){
      const query = {whereRaw: sinon.spy()};
      expect(query.whereRaw).to.have.not.been.called;

      const expectCase = ({columns, searchQuery, sql, sqlArgs}) => {
        knexHelpers.knexSearch(query, columns, searchQuery);
        expect(query.whereRaw).to.have.been.calledWith(sql, sqlArgs);
        query.whereRaw.resetHistory();
      };

      expectCase({
        columns: ['name'],
        searchQuery: 'Steve',
        sql: `LOWER(COALESCE(name, '')) LIKE ?`,
        sqlArgs: ['%steve%'],
      });

      expectCase({
        columns: ['apikey', 'consumer_name', 'description'],
        searchQuery: 'PLanET woRK',
        sql: `LOWER(COALESCE(apikey, '') || ' ' || COALESCE(consumer_name, '') || ' ' || COALESCE(description, '')) LIKE ?`,
        sqlArgs: ['%planet%work%'],
      });
    });
  });

});
