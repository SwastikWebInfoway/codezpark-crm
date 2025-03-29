const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('role', {
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Role name is required'
      },
      len: {
        args: [2, 50],
        msg: 'Role name must be 2-50 characters'
      }
    }
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  tableName: 'role',
  timestamps: true,
  paranoid: true,
  defaultScope: {
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  },
  scopes: {
    withTimestamps: {
      attributes: { include: ['createdAt', 'updatedAt'] }
    },
    defaultRoles: {
      where: { is_default: true }
    }
  }
});

// Add class methods if needed
Role.prototype.getRoleInfo = function() {
  return {
    name: this.name,
    description: this.description,
    isDefault: this.is_default
  };
};

module.exports = Role;