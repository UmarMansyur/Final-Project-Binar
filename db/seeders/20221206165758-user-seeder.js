"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const encrypted = await bcrypt.hash("@john123", 10);
    //role user
    await queryInterface.bulkInsert("Users", [
      {
        username: "johnsihombing",
        email: "johnsihombing80@gmail.com",
        password: encrypted,
        thumbnail:
          "https://img1.pngdownload.id/20180605/ylu/kisspng-businessperson-clip-art-cartoon-man-5b173e4b598a71.4316264915282499313668.jpg",
        role: "User",
        user_type: "Basic",
        is_verified: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      //role admin
      {
        username: "admin123",
        email: "terbangtinggiapp@gmail.com",
        password: encrypted,
        thumbnail:
          "https://img1.pngdownload.id/20180605/ylu/kisspng-businessperson-clip-art-cartoon-man-5b173e4b598a71.4316264915282499313668.jpg",
        role: "Admin",
        user_type: "Basic",
        is_verified: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
