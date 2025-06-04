const sharp = require("sharp");
const crypto = require("crypto");
const path = require("path")

const optimizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const { buffer, originalname } = req.file;
  console.log("Optimizing image:", originalname);
  const filename = `${crypto.randomBytes(16).toString("hex")}-${originalname
    .split(".")
    .slice(0, -1)
    .join(".")}.webp`;

  sharp(buffer)
    .resize({ height: 260, fit: sharp.fit.inside })
    .toFormat("webp", { quality: 80 })
    .toFile(path.join(__dirname, '..', 'images', filename), (err) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur lors de l'optimisation de l'image",
          error: "Une erreur interne est survenue. Veuillez réessayer.",
        });
      }

      req.file.filename = filename;
      next();
    });
};

module.exports = optimizeImage;
