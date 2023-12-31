const express = require("express");
const factory = require("./handleFactory");
const { Read, Favourite } = require("../models/articleInteractionModel");
const newsService = require("../services/newsService");
const catchAsyn = require("../utils/catchAsyn");
const User = require("../models/userModel");

exports.news = catchAsyn(async (req, res, next) => {
  const { categories, languages, countries } = await User.findById(req.user);
  const { page } = req.params;
  const data = await newsService(categories, countries, languages, null, page);
  res.status(200).json({ status: "success", data });
});

exports.getFromKeyword = catchAsyn(async (req, res, next) => {
  const { keyword } = req.params; // Get the keyword
  const { results } = await newsService(null, null, keyword);
  res.status(200).json({ status: "success", results });
});

exports.updataRead = factory.addArticles(Read);

exports.getRead = factory.getArticles(Read);

exports.updateFavourite = factory.addArticles(Favourite);

exports.getFavourite = factory.getArticles(Favourite);

exports.deleteFavourite = factory.deleteArticles(Favourite);

exports.deleteRead = factory.deleteArticles(Read);
