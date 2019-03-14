
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('subscribers').del()
    .then(function () {
      // Inserts seed entries
      return knex('subscribers').insert([
        { Name: "Hunt", Email: "huntapplegate@gmail.com", Categories: "raspberry-pi", Passcode: "123456" },
        { Name: "Arthur", Email: "hunt@huntcodes.co", Categories: "redux", Passcode: "234567" },
        { Name: "Hunter", Email: "hunt@healthadvising.com", Categories: "raspberry-pi", Passcode: "213456" }
      ]);
    });
};
