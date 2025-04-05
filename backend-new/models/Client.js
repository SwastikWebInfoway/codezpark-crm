// models/Client.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Client = sequelize.define('client', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Company name is required'
      },
      len: {
        args: [2, 100],
        msg: 'Company name must be 2-100 characters'
      }
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Company address is required'
      },
      len: {
        args: [5, 500],
        msg: 'Address must be 5-500 characters'
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Please enter a valid email address',
        args: {
          allowNull: true
        }
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
  industry: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 50],
        msg: 'Industry cannot exceed 50 characters'
      }
    }
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Logo must be a valid URL',
        args: {
          protocols: ['http', 'https'],
          require_protocol: true
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'prospect'),
    defaultValue: 'active',
    validate: {
      isIn: {
        args: [['active', 'inactive', 'prospect']],
        msg: 'Invalid status value'
      }
    }
  }
}, {
  tableName: 'client',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  },
  scopes: {
    withTimestamps: {
      attributes: { include: ['createdAt', 'updatedAt'] }
    },
    active: {
      where: { status: 'active' }
    }
  },
  hooks: {
    beforeValidate: (client) => {
      // Trim string fields
      if (client.company_name) client.company_name = client.company_name.trim();
      if (client.company_email) client.company_email = client.company_email.trim().toLowerCase();
    }
  }
});

// Add class methods if needed
Client.prototype.getContactInfo = function() {
  return {
    email: this.company_email,
    phone: this.company_phonenumber,
    address: this.company_address
  };
};

module.exports = Client;