const axios = require("axios");
const { count } = require("../models/userModel");
const AppError = require("../utils/appError");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const BASE_URL = process.env.NEWS_URL;
const API_KEY = process.env.NEWSDATAAPI;

module.exports = async (category, country) => {
  try {
    const request = await axios.get(
      `${BASE_URL}?category=${category}&country=${country}&apiKey=${API_KEY}`
    );
    return request.data;
  } catch (err) {
    throw new AppError(
      `Error fetching data from the API: ${err.response.data.message}`,
      400
    );
  }
};
