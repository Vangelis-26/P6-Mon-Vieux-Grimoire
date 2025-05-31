const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const bookCtrl = require("../controllers/book");
const sharp = require("../middleware/sharp");

router.get("/", bookCtrl.allBooks);
router.get("/:id", bookCtrl.getOneBook);

router.post("/", auth, multer, sharp, bookCtrl.createBook);
router.put("/:id", auth, bookCtrl.updateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
