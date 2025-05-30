const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const bookCtrl = require("../controllers/book");
const sharp = require("../middleware/sharp");

router.post("/", auth, sharp, bookCtrl.createBook);
router.get("/", auth, multer, bookCtrl.allBooks);
router.get("/:id", auth, bookCtrl.getOneBook);
router.put("/:id", auth, bookCtrl.updateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
