const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcrypt');

const User = sequelize.define('user', {
  // models/User.js
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // or false if required
    references: {
      model: 'client', // or whatever your company table is called
      key: 'id'
    }
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'First name is required'
      },
      len: {
        args: [2, 50],
        msg: 'First name must be 2-50 characters'
      }
    }
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Last name is required'
      },
      len: {
        args: [2, 50],
        msg: 'Last name must be 2-50 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: 'Please enter a valid email address'
      },
      notEmpty: {
        msg: 'Email is required'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password is required'
      },
      len: {
        args: [8, 100],
        msg: 'Password must be 8-100 characters'
      }
    }
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isPhoneNumber(value) {
        if (value && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(value)) {
          throw new Error('Invalid phone number format');
        }
      }
    }
  },
  phone_number_code: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
    validate: {
      isIn: {
        args: [['active', 'inactive', 'suspended']],
        msg: 'Invalid status value'
      }
    }
  },
  role_id: {
  type: DataTypes.INTEGER,
  allowNull: false,
  references: {
    model: 'role',
    key: 'id'
  }
}
}, {
  tableName: 'user',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  defaultScope: {
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']
    }
  },
  scopes: {
    withTimestamps: {
      attributes: { include: ['createdAt', 'updatedAt'] }
    },
    withPassword: {
      attributes: { include: ['password'] }
    },
    active: {
      where: { status: 'active' }
    }
  },
  hooks: {
    beforeValidate: (user) => {
      // Trim string fields
      if (user.firstname) user.firstname = user.firstname.trim();
      if (user.lastname) user.lastname = user.lastname.trim();
      if (user.email) user.email = user.email.trim().toLowerCase();
    },
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to compare passwords
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;