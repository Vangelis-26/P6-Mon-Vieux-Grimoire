const sharp = require("sharp");

const optimizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const { buffer, originalname } = req.file;
  const timestamp = Date.now().toISOString();
  const filename = `${originalname}-${timestamp}`;

  sharp(buffer)
    .resize({ height: 600, fit: sharp.fit.inside })
    .webp({ quality: 20 })
    .toFile(`images/${filename}`, (err) => {
      if (err) {
        return res.status(500).json({
          message: "Erreur lors de l'optimisation de l'image",
          error: err.message,
        });
      }

      req.file.filename = filename;
      req.file.path = `images/${filename}`;
      next();
    });
};

module.exports = optimizeImage;
