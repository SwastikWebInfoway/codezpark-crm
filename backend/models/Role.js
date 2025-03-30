const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Role = sequelize.define('role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Description cannot exceed 500 characters'
      }
    }
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isNullIfDefault(value) {
        if (this.is_default && value !== null) {
          throw new Error('company_id must be null when is_default is true');
        }
      }
    }
  }
}, {
  tableName: 'role',
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
    defaultRoles: {
      where: { is_default: true }
    },
    companyRoles: {
      where: { is_default: false }
    }
  },
  hooks: {
    beforeValidate: (role) => {
      // Trim string fields
      if (role.name) role.name = role.name.trim();
      if (role.description) role.description = role.description.trim();
      
      // Ensure company_id is null for default roles
      if (role.is_default) {
        role.company_id = null;
      }
    }
  }
});

// Add associations in another file or after model definition
// Role.belongsTo(Client, { foreignKey: 'company_id' });

module.exports = Role;