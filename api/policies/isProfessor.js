module.exports = function isProfessor (req, res, next) {


    // Finally, if the user has a clean record, we'll call the `next()` function
    // to let them through to the next policy or our controller
    next();
};