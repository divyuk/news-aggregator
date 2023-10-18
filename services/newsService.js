const axios = require("axios");
const AppError = require("../utils/appError");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const BASE_URL = process.env.NEWS_URL;
const API_KEY = process.env.NEWSDATAAPI;

module.exports = async (categories, countries, languages, keyword) => {
  let baseUrl = `${BASE_URL}?apiKey=${API_KEY}`;

  //&category=sports,bussiness,technology
  if (categories.length > 0) {
    const categoryString = categories.join(",");
    baseUrl += `&category=${categoryString}`;
  }
  const filteredCountries = countries.filter((country) => countries !== null);
  if (filteredCountries > 0) {
    const countryString = countries.join(",");
    baseUrl += `&country=${countryString}`;
  }
  const filteredLanguages = languages.filter((language) => language !== null);
  if (filteredLanguages.length > 0) {
    const languageString = languages.join(",");
    baseUrl += `&language=${languageString}`;
  }

  if (keyword) baseUrl += `&q=${keyword}`;

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
