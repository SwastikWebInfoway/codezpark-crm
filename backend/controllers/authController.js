const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require('../utils/jwt');
// const { createUser, findByEmail, findById } = require("../services/userService");
const { createClient, findByEmail } = require("../services/clientService");
const { createUser } = require("../services/userService");
const Token = require("../models/token");

const register = async (req, res) => {
  
  const { company_name, company_address, company_email, company_phonenumber, company_industry, firstname, lastname, email, password, phonenumber } = req.body;

  if (company_email) {
    const emailExists = await findByEmail(company_email);
    if (emailExists) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }
  }

  const client = await createClient({ company_name, company_address, company_email, company_phonenumber, company_industry });

  if(client.id > 0){
    const user = await createUser({
      company_id : client.id,
      firstname,
      lastname,
      email,
      password,
      phonenumber
    });
    console.log('user',user);
  }
  
  return res.status(201).json();

  //Create JWT Tokens
  const accessToken = jwt.generateAccessToken({id : userId, email : email});
  const refreshToken = jwt.generateRefreshToken({id : userId, email : email});

  //Add Both token in database
  await Token.create({
    userId: userId,
    accessToken,
    refreshToken,
  });

  res.status(201).json({ userid : userId, accessToken, refreshToken });
};

const login = async (req, res) => {

  //Get input param
  const { email, password } = req.body;

  //Get User record by email from database
  const user = await findByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  //Create JWT Tokens
  const accessToken = jwt.generateAccessToken({id : user.id, email : user.email});
  const refreshToken = jwt.generateRefreshToken({id : user.id, email : user.email});

  //Add Both token in database
  await Token.create({
    userId: user.id,
    accessToken,
    refreshToken,
  });

  res.json({ accessToken, refreshToken, email : user.email, firstname : user.lastname, lastname : user.lastname, userid : user.id });
};

const refreshToken = async (req, res) => {

  //Recieve refresh token from post
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {

    //verify refresh token in JWT
    const decoded = jwt.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    //Find that token record in database based on decrypted id and token
    const tokenRecord = await Token.findOne({
      where: { userId: decoded.id, refreshToken },
    });

    if (!tokenRecord) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    //Find User data from database by id
    const user = await findById(decoded.id);
    
    //Create JWT Tokens
    const newAccessToken = jwt.generateAccessToken({id : user.id, email : user.email});
    const newRefreshToken = jwt.generateRefreshToken({id : user.id, email : user.email});

    //Update input token to new token in database(only latest token will remain other all will be expire for that user)
    tokenRecord.accessToken = newAccessToken;
    tokenRecord.refreshToken = newRefreshToken;
    await tokenRecord.save();

    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token", error });
  }
};

module.exports = { register, login, refreshToken };
