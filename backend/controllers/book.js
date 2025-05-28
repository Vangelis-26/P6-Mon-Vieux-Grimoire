const Book = require("../models/book");

//----- POST ----- //
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre créé avec succès" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la création du livre",
        error: error.message,
      });
    });
};

// ----- GET all books ----- //
exports.allBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
      console.log(books);
    })
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la récupération des livres",
        error: error.message,
      });
    });
};

// ----- GET one book ----- //
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: "Livre non trouvé" });
      }
    })
    .catch((error) => {
      c;
      res.status(500).json({
        message: "Erreur lors de la récupération du livre",
        error: error.message,
      });
    });
};

// ----- PUT ----- //
exports.updateBook = (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Livre mis à jour avec succès" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la mise à jour du livre",
        error: error.message,
      });
    });
};

// ----- DELETE ----- //
exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Livre supprimé avec succès" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la suppression du livre",
        error: error.message,
      });
    });
};
