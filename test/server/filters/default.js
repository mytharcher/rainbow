module.exports = function (req, res, next) {
	res.locals.filterValue = '1';
	next();
};
