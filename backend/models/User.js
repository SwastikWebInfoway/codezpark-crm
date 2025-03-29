const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  company_id: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Firstname is required"
      }
    }
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Lastname is required"
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: "Email already exists"
    },
    validate: {
      isEmail: {
        msg: "Email is not valid"
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Password is required"
      }
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Phone number is required"
      }
    }
  },
  profile_image: DataTypes.STRING,
  role: DataTypes.STRING,
  phone_number_code: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  address: DataTypes.STRING,
  language: DataTypes.STRING,
  theme: DataTypes.STRING,
  third_party_key: DataTypes.STRING,
  profile_image_url: DataTypes.STRING,
  is_delete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deleted_at: DataTypes.DATE,
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}, {
  tableName: 'users'
});

module.exports = User;
