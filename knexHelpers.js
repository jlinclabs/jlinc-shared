'use strict';

function knexSearch(query, columns, searchQuery){
  return query.whereRaw(
    `LOWER(${columns.map(column => `COALESCE(${column}, '')`).join(` || ' ' || `)}) LIKE ?`,
    ['%' + searchQuery.toLowerCase().trim().replace(/\s+/g, '%') + '%'],
  );
};

module.exports = {
  knexSearch,
};
