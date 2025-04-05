const User = require('../models/user');
const bcrypt = require('bcrypt');

const createUser = async (user) => {

  const password = await bcrypt.hash(user.password, 10);
  //bcrypt.compare(plainPassword, hashedPassword)

  try {
    return await User.create({
      company_id: user.company_id,
      firstname: user.firstname,
      email: user.email,
      password: password,
      role_id: 1,
      lastname: user.lastname || null,
      phone_number: user.phone_number || null
    });
  } catch (error) {
    throw error;
  }
};

const findByUsername = async (username) => {
  try {
    const user = await User.findOne({ where: { username } });
    return user;
  } catch (error) {
    console.error('Error finding user by username:', error);
    throw error;
  }
};

const findByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email }, attributes: ['id', 'email', 'password', 'firstname', 'lastname'], });
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

const updateUserClientID = async (id, companyId) => {
  try {
    const user = await User.update(
      { company_id: companyId },
      {
        where: { id: id }
        // logging: console.log, // This will log the executed query
      }
    );

    return user;
  } catch (error) {
    console.error('Error updating user:', error);
  }
}

const findallUser = async (condition) => {
  try {
    const users = await User.findAll({
      where: condition,
    });
    return users;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

module.exports = {
  createUser,
  findByUsername,
  findByEmail,
  findById,
  updateUserClientID,
  findallUser
};
