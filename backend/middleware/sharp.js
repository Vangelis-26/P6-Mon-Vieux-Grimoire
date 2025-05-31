const sharp = require("sharp");
const crypto = require("crypto");

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
    .webp({ quality: 20 })
    .toFile(`./images/${filename}`, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur lors de l'optimisation de l'image",
          error: err.message,
        });
      }

      req.file.filename = filename;
      next();
    });
};

module.exports = optimizeImage;
