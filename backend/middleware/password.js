const passwordValidator = require('password-validator');

const schema = new passwordValidator();
schema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(2)
  .has().symbols(1)
  .has().not().spaces();

const passwordMiddleware = (req, res, next) => {
  const { password } = req.body;
  if (!schema.validate(password)) {
    return res.status(400).json({ error: 'Mot de passe trop faible ou invalide' });
  }
  next();
};

module.exports = passwordMiddleware;
