// catchAsync is a function that saves us time in
// an async function that gets us rid of using try catch blocks
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
