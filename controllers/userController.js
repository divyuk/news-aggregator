const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsyn = require("../utils/catchAsyn");
const newsService = require("../services/newsService");

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
exports.favorite = catchAsyn(async (req, res, next) => {
  const userId = req.user; // User Id
  const { id: articleId } = req.params;
  const user = await User.findById(userId);
  if (!user.favoriteArticles.includes(articleId)) {
    user.favoriteArticles.push(articleId);
    await user.save();
  } else
    return next(
      new AppError("This Article Already exist in your favourites", 400)
    );

  res.status(200).json({ status: "success" });
});

// GET : Favourites
exports.getFavorite = catchAsyn(async (req, res, next) => {
  const { results: allNews } = await newsService();
  const userId = req.user; // User Id
  const user = await User.findById(userId); // user.readArticles
  const favoriteArray = user.favoriteArticles;
  const filteredNews = allNews.filter((news) =>
    favoriteArray.includes(news.article_id)
  );
  res.status(200).json({ status: "success", data: filteredNews });
});
