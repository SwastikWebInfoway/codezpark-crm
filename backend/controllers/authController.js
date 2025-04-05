const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require('../utils/jwt');
// const { createUser, findByEmail, findById } = require("../services/userService");
const { createClient, findByEmail } = require("../services/clientService");
const { createUser, findByEmail: findUserByEmail } = require("../services/userService");
const Token = require("../models/token");

const register = async (req, res) => {

  const { company_name, company_address, company_email, company_phonenumber, company_industry, firstname, lastname, email, password, phonenumber } = req.body;

  if (company_email) {
    const emailExists = await findByEmail(company_email);
    if (emailExists) {
      return res.status(409).json({
        message: 'Company Email already registered'
      });
    }
  }

  const userEmailExist = await findUserByEmail(email);
  if (userEmailExist) {
    return res.status(409).json({
      message: 'Email already registered'
    });
  }

  const client = await createClient({ company_name, company_address, company_email, company_phonenumber, company_industry });

  if (client.id > 0) {
    const user = await createUser({
      company_id: client.id,
      firstname,
      lastname,
      email,
      password,
      phonenumber
    });

    //Create JWT Tokens
    const accessToken = jwt.generateAccessToken({ id: user.id, email: email });
    const refreshToken = jwt.generateRefreshToken({ id: user.id, email: email });

    // Set HTTP-only cookie for refreshToken (secure in production)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict' // Prevent CSRF
    });

    return res.status(201).json({ userid: user.id, accessToken });
  }

};

const login = async (req, res) => {

  //Get input param
  const { email, password } = req.body;

  //Get User record by email from database
  const user = await findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: "Invalid email" });
  }

  console.log(' input password', password);
  console.log(' user password', user.password);


  const isPasswordValid = await bcrypt.compare(password, user.password.trim());

  // if (!isPasswordValid) {
  //   return res.status(401).json({ message: "Invalid  password" });
  // }

  //Create JWT Tokens
  const accessToken = jwt.generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = jwt.generateRefreshToken({ id: user.id, email: user.email });

  // Set HTTP-only cookie for refreshToken (secure in production)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: 'strict' // Prevent CSRF
  });

  return res.status(201).json({ userid: user.id, accessToken });
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
    const newAccessToken = jwt.generateAccessToken({ id: user.id, email: user.email });
    const newRefreshToken = jwt.generateRefreshToken({ id: user.id, email: user.email });

    //Update input token to new token in database(only latest token will remain other all will be expire for that user)
    tokenRecord.accessToken = newAccessToken;
    tokenRecord.refreshToken = newRefreshToken;
    await tokenRecord.save();

    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token", error });
  }
};

const logout = async (req, res) => {

  // 1. Extract refreshToken from cookies
  const refreshToken = req.cookies;
  console.log('token', refreshToken);

  if (!refreshToken) {
    return res.status(400).json({ message: "No refresh token found" });
  }

  // 3. Clear the HTTP-only cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = { register, login, refreshToken, logout };
