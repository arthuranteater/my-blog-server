
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('sg-errors').del()
    .then(function () {
      // Inserts seed entries
      return knex('sg-errors').insert([
        { Message: 'invalid email', Type: 'welcome', EDate: '2019-03-08', Email: 'huntapples@aol.com' },
        { Message: 'server error', Type: 'post', EDate: '2019-03-06', Email: 'hunt@huntcodes.co' },
        { Message: 'unknown error', Type: 'del', EDate: '2019-03-04', Email: 'garf@funkel.com' }
      ]);
    });
};
