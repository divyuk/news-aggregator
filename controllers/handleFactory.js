const catchAsyn = require("../utils/catchAsyn");
const AppError = require("../utils/appError");
const Article = require("../models/articleModel");

const callArticles = async (articleId, body) => {
  //! 1. Find the Articles in the Articles Model

  const newsArticle = await Article.find({ article_id: articleId });
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
  } = body;
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
};

//? Factory Method to Add Articles
exports.addArticles = (Model) =>
  catchAsyn(async (req, res, next) => {
    //! 1. Get users Id
    const userId = req.user;

    //! 2. Get the articles id from the parameter
    const { id: articleId } = req.params;

    const doc = await Model.find({
      user: userId,
      newsArticle: articleId,
    });

    if (doc.length > 0) {
      return next(
        new AppError("Document Already present with the given id", 409) // raise Conflict error
      );
    }

    await Model.create({
      user: userId,
      newsArticle: articleId,
    });

    callArticles(articleId, req.body);
    res.status(200).json({ status: "success" });
  });

//? Factory Method to Get Articles
exports.getArticles = (Model) =>
  catchAsyn(async (req, res, next) => {
    //! 1. Get users Id
    const userId = req.user;

    //! 2. Find all documents related to user
    const doc = await Model.find({ user: userId });

    //! 3. Extract the newsArticle IDS from the doc
    const articlesIds = doc.map((article) => article.newsArticle);

    //! 4. Find the corresponding Articles
    const newsArticles = await Article.find({
      article_id: { $in: articlesIds },
    });

    //! 5. Send the response
    res.status(200).json({ status: "success", data: newsArticles });
  });

//? Factory Method to delete Articles
exports.deleteArticles = (Model) =>
  catchAsyn(async (req, res, next) => {
    //! 0. Get users Id
    const userId = req.user;
    //! 1. Get the article id from the parameter
    const { id: articleId } = req.params;

    //! 2. Find the Corresponding Article ID
    const doc = await Model.findOne({ newsArticle: articleId, user: userId });

    if (!doc) {
      return next(
        new AppError("Document Not present with the given id", 404) // raise Not Found error
      );
    }

    // Check if the article exists in the Article model
    const article = await Article.findOne({ article_id: articleId });

    if (article) {
      //! Delete the corresponding Article from the Article model
      await Article.findOneAndDelete({ article_id: articleId });
    }

    //! 3. Delete the document from the Model
    await Model.deleteOne({ newsArticle: articleId, user: userId });

    res.status(204).json(); // Respond with a 204 status code (No Content) as the article has been successfully deleted
  });
