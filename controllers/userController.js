const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsyn = require("../utils/catchAsyn");
const newsService = require("../services/newsService");
const Favourite = require("../models/favouriteModel");
const Article = require("../models/articleModel");
const mongoose = require("mongoose");
const filterObj = (obj, ...allowedFields) => {
  newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

exports.preferences = catchAsyn(async (req, res, next) => {
  const { category, sources, country } = await User.findById(req.user);
  res
    .status(200)
    .json({ status: "success", data: { category, sources, country } });
});

exports.updatePreferences = catchAsyn(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(AppError("This route is not for updating password", 400));

  //! Filter out unawanted fields and only include whats needed
  const filteredObj = filterObj(req.body, "category", "country");
  const updatedPrefernces = await User.findByIdAndUpdate(
    req.user.id,
    filteredObj,
    { new: true, runValidators: true }
  );
  res.status(200).json({ status: "success", data: updatedPrefernces });
});

exports.news = catchAsyn(async (req, res, next) => {
  const { category, country } = await User.findById(req.user);

  const data = await newsService(category, country);
  res.status(200).json({ status: "success", data });
});

// POST : To mark the article Read
exports.read = catchAsyn(async (req, res, next) => {
  const userId = req.user; // User Id
  const { id: articleId } = req.params;
  const user = await User.findById(userId);
  if (!user.readArticles.includes(articleId)) {
    user.readArticles.push(articleId);
    await user.save();
  } else
    return next(
      AppError("This Article Already exist in your read collections", 400)
    );

  res.status(200).json({ status: "success" });
});

// GET : To get all the read news of the user
exports.getNews = catchAsyn(async (req, res, next) => {
  const { results: allNews } = await newsService();
  const userId = req.user; // User Id
  const user = await User.findById(userId); // user.readArticles
  const readArray = user.readArticles;
  const filteredNews = allNews.filter((news) =>
    readArray.includes(news.article_id)
  );
  res.status(200).json({ status: "success", data: filteredNews });
});

// POST: Controller to mark favorite article
exports.favourite = catchAsyn(async (req, res, next) => {
  const userId = req.user; // User Id
  let { id: articleId } = req.params;
  const {
    title,
    link,
    keywords,
    creator,
    video_url,
    description,
    content,
    pubDate,
    image_url,
    source_id,
    source_priority,
    country,
    category,
    language,
  } = req.body;
  const isFavorite = await Favourite.find({
    user: userId, // User ID
    newsArticle: articleId, // News article ID
  });
  if (isFavorite.length > 0)
    return next(new AppError("Already present in the favorites", 400));
  await Favourite.create({
    user: userId,
    newsArticle: articleId,
  });
  const newsArticle = await Article.find({ article_id: articleId });
  if (newsArticle.length == 0) {
    const newNewsArticle = new Article({
      article_id: articleId,
      title,
      link,
      keywords,
      creator,
      video_url,
      description,
      content,
      pubDate,
      image_url,
      source_id,
      source_priority,
      country,
      category,
      language,
    });

    // Save the new news article to the "NewsArticle" collection
    await newNewsArticle.save();
  }

  res.status(200).json({ status: "success" });
});

// GET : Favourites
exports.getFavourite = catchAsyn(async (req, res, next) => {
  const userId = req.user; // User Id

  // Find all "Favorite" documents for the user
  const favoriteArticles = await Favourite.find({ user: userId });

  // Extract the newsArticle IDs from the favoriteArticles
  const favoriteArticleIds = favoriteArticles.map(
    (favorite) => favorite.newsArticle
  );

  // Find the corresponding news articles in the "NewsArticle" collection
  const newsArticles = await Article.find({
    article_id: { $in: favoriteArticleIds },
  });

  res.status(200).json({ status: "success", favoriteNews: newsArticles });
});

exports.getFromKeyword = catchAsyn(async (req, res, next) => {
  const { keyword } = req.params; // Get the keyword
  const { results } = await newsService(null, null, keyword);
  res.status(200).json({ status: "success", results });
});
