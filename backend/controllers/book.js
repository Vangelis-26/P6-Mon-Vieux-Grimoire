const Book = require("../models/book");
const fs = require("fs");

//----- POST ----- //
exports.createBook = (req, res) => {
  try {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;

    if (!req.file) {
      return res.status(400).json({ message: "Image manquante" });
    }

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
  } catch (error) {
    res.status(400).json({
      message: "Erreur lors de la création du livre",
      error: error.message,
    });
  }
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
      res.status(500).json({
        message: "Erreur lors de la récupération du livre",
        error: error.message,
      });
    });
};

// ----- PUT ----- //
exports.updateBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: "Action interdite" });
      }
      const bookObject = req.file
        ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          }
        : { ...req.body };
        fs.unlink(`images/${book.imageUrl.split("/images/")[1]}`, (err) => {
          if (err) {
            return res.status(500).json({
              message: "Erreur lors de la suppression de l'image",
              error: err.message,
            });
          }
        });
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
        .then(() => {
          res.status(200).json({ message: "Livre mis à jour avec succès" });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Erreur lors de la mise à jour du livre",
            error: error.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la recherche du livre",
        error: error.message,
      });
    });
};

// ----- DELETE ----- //
exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        return res.status(401).json({ message: "Action interdite" });
      }
      const filename = book.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          return res.status(500).json({
            message: "Erreur lors de la suppression de l'image",
            error: err.message,
          });
        }
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
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Erreur lors de la recherche du livre",
        error: error.message,
      });
    });
};

// ----- Get Best Rating ----- //
exports.bestRating = (req, res, next) => {
    Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// ----- Rating ----- //
exports.ratingBook = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (!book) {
				return res.status(400).json({ error: 'requête invalide' });
			}
			const rating = { userId: req.body.userId, grade: req.body.rating };
			const ratings = book.ratings;
			if (ratings.find((rate) => rate.userId === req.body.userId)) {
				return res.status(400).json({ error: 'requête invalide' });
			}
			ratings.push(rating);
			const averageRating =
				ratings.reduce((acc, current) => {
					return acc + current.grade;
				}, 0) / ratings.length.toFixed(1);

			Book.findOneAndUpdate(
				{
					_id: req.params.id,
				},
				{
					ratings: ratings,
					averageRating: averageRating,
				},
				{ new: true, runValidators: true },
			)
				.then((book) => {
					res.status(200).json(book);
					console.log(`${book.title}: ${book.averageRating}`);
				})
				.catch((error) => res.status(400).json({ error: 'requête invalide' }));
		})
		.catch((error) => res.status(500).json({ error: 'erreur serveur' }));
};
