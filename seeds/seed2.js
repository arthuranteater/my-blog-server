
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      // Inserts seed entries
      return knex('posts').insert([
        { Title: "How to Redux", Subtitle: "Set up a redux store", Category: "redux", Slug: "/redux/" },
        { Title: "Rasp Pi", Subtitle: "Set up a Pi", Category: "pi", Slug: "/pi/" },
        { Title: "React Native + Google Maps", Subtitle: "React native with google maps", Category: "react-native", Slug: "/react-native/" }
      ]);
    });
};
