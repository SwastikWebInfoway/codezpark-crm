const profileService = require('../services/clientService');
const bcrypt = require("bcrypt");
const { updateUserClientID, findById, createUser, findByEmail, findallUser } = require("../services/userService");

const createProfile = async (req, res) => {
    try {
      const profileData = req.body;
      const checkUser = await findById(profileData.user_id);
      if(checkUser.company_id > 0){
        res.status(201).json({ message: 'Company Already Registered'});
      }else{
        const profile = await profileService.createClient(profileData);
        if(profile.id > 0){
          await updateUserClientID(profileData.user_id,profile.id);
        }
        res.status(201).json(profile);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const addUser = async (req, res) => {

    try{
      const profileData = req.body;
      const existingUser = await findByEmail(profileData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      if (profileData.password) {
        profileData.password = await bcrypt.hash(profileData.password, 10);
      }

      // Create new user
      const userId = await createUser(profileData);
      res.status(201).json({userid : userId});
    }catch (error){
      res.status(500).json({ message: error.message });
    }
  }

  const getUser = async (req, res) => {

    try{
      const companyId = req.body.company_id;

      if (!companyId) {
        return res.status(400).json({ message: "Company ID is required" });
      }
      const userList = await findallUser({company_id : companyId});
    
      res.status(201).json(userList);
    }catch (error){
      res.status(500).json({ message: error.message });
    }
  }
  
  module.exports = {
    createProfile,
    addUser,
    getUser
  };