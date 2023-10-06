const axios = require("axios");
const { count } = require("../models/userModel");
const AppError = require("../utils/appError");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const BASE_URL = process.env.NEWS_URL;
const API_KEY = process.env.NEWSDATAAPI;

module.exports = async (category, country) => {
  const baseUrl = `${BASE_URL}?apiKey=${API_KEY}`;

  if (category) baseUrl += `&category=${category}`;
  if (country) baseUrl += `&country=${country}`;

  try {
    const request = await axios.get(baseUrl);
    return request.data;
  } catch (err) {
    throw new AppError(
      `Error fetching data from the API: ${err.response.data.message}`,
      400
    );
  }
};
