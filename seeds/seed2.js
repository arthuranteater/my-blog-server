
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('posts').insert([
        { Title: "How to Redux", Subtitle: "Set up a redux store", Category: "redux", Slug: "/redux/", PDate: "2019-03-10" },
        { Title: "Rasp Pi", Subtitle: "Set up a Pi", Category: "pi", Slug: "/pi/", PDate: "2019-03-08" },
        { Title: "React Native + Google Maps", Subtitle: "React native with google maps", Category: "react-native", Slug: "/react-native/", PDate: "2019-03-08" }
      ]);
    });
};
