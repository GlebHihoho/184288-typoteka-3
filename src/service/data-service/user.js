'use strict';

const bcrypt = require(`bcrypt`);

const {BCRYPT_SALT} = process.env;

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(data) {
    const {password} = data;
    const hash = await bcrypt.hash(password, BCRYPT_SALT);
    const user = await this._User.create({...data, password: hash});

    return user.get();
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email}
    });

    return user;
  }
}

module.exports = UserService;
