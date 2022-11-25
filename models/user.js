'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    checkPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    generateToken() {
      const payload = {
        id: this.id,
        username: this.username,
        email: this.email,
        role: this.role,
        usertype: this.usertype,
        is_verified: this.is_verified

      };

      return jwt.sign(payload, process.env.JWT_SECRET_KEY);
    }

    static authenticate = async ({ email, password }) => {
      try {
        const user = await this.findOne({ where: { email: email } });
        if (!user) return Promise.reject(new Error('user tidak ditemukan!'));

        const valid = user.checkPassword(password);
        if (!valid) return Promise.reject(new Error('password salah!'));

        return Promise.resolve(user);
      } catch (err) {
        return Promise.reject(err);
      }
    };
  }
  User.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    role: DataTypes.STRING,
    user_type: DataTypes.STRING,
    is_verified: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};