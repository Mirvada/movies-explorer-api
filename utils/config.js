const MONGO_DB = process.env.MONGO_DB || 'mongodb://127.0.0.1:27017/bitfilmsdb';
const PORT = process.env.PORT || 3000;
const SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT : 'super-strong-key';

module.exports = {
  MONGO_DB,
  PORT,
  SECRET,
};
