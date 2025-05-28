const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const bookCtrl = require("../controllers/book");

router.post("/", auth, bookCtrl.createBook);
router.get("/", auth, bookCtrl.allBooks);
router.get("/:id", auth, bookCtrl.getOneBook);
router.put("/:id", auth, bookCtrl.updateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
