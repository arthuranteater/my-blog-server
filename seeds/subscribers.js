
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('subscribers').del()
    .then(function () {
      // Inserts seed entries
      return knex('subscribers').insert([
        { Name: "Hunt", Email: "huntapplegate@gmail.com", Passcode: "123456" },
        { Name: "Arthur", Email: "hunt@huntcodes.co", Passcode: "234567" },
        { Name: "Hunter", Email: "hunt@healthadvising.com", Passcode: "213456" }
      ]);
    });
};
