const express = require("express");
const router = express.Router();
const bookCtrl = require("../controllers/book");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");
const sharp = require("../middleware/sharp");

const bookCtrl = require("../controllers/book");

router.post("/", auth, sharp, bookCtrl.createBook);
router.get("/", auth, multer, bookCtrl.allBooks);
router.get("/:id", auth, bookCtrl.getOneBook);
router.put("/:id", auth, bookCtrl.updateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
