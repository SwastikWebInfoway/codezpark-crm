const User = require('../models/user');

const createUser = async (user) => {
  try {
    const newUser = await User.create(user);
    return newUser.id;
  } catch (error) {
    console.error('Error creating user:', error);
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
    const user = await User.findOne({ where: { email } });
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
