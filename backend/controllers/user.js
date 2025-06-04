require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ----- User Signup ----- //
exports.signup = (req, res) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).json({ error: "Email invalide !" });
  }
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur crée !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// ----- User Login ----- //
exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res
        .status(401)
        .json({ error: "Utilisateur/Mot de passe incorrect !" });
    }
    bcrypt.compare(req.body.password, user.password).then((valid) => {
      if (!valid) {
        return res
          .status(401)
          .json({ error: "Utilisateur/Mot de passe incorrect !" });
      }
      res
        .status(200)
        .json({
          userId: user._id,
          token: jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: "24h",
          }),
        })
    });
  });
};
