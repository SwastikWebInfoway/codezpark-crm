// services/clientService.js
const Client = require('../models/Client');


const createClient = async (clientData) => {
          
      const client = await Client.create({
        name: clientData.company_name,
        address: clientData.company_address,
        email: clientData.company_email || null,
        phone_number: clientData.company_phonenumber || null,
        industry: clientData.company_industry || null,
        status: 'active' // Default status
      });

      return client;
        
};

const getClientById = async (id) => {
  return await Client.findByPk(id);
};

const getAllClients = async () => {
  return await Client.findAll();
};

const updateClient = async (id, clientData) => {
  return await Client.update(clientData, { where: { id } });
};

const deleteClient = async (id) => {
  return await Client.destroy({ where: { id } });
};

const findByEmail = async (email) => {
  return await Client.findOne({ where: { email } });
};

module.exports = {
  createClient,
  getClientById,
  getAllClients,
  updateClient,
  deleteClient,
  findByEmail
};
