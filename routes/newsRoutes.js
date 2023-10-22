const express = require("express");
const newsController = require("../controllers/newsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/", newsController.news);
// router.route("/").get(newsController.news);
router.get("/:page", newsController.news);

// router.post("/news/:id/read", userController.read);
router.route("/:id/read").post(newsController.updataRead);

// router.get("/news/read", userController.getNews);
router.route("/read").get(newsController.getRead);

router.route("/:id/read").delete(newsController.deleteRead);

// router.post("/news/:id/favourite", userController.favourite);
router.route("/:id/favourite").post(newsController.updateFavourite);

// router.get("/news/favorite", userController.getFavourite);
router.route("/favourite").get(newsController.getFavourite);

router.route("/:id/favourite").delete(newsController.deleteFavourite);

// router.get("/news/search/:keyword", userController.getFromKeyword);

router.route("/search/:keyword").get(newsController.getFromKeyword);

module.exports = router;
