function handleBodyParserError (err, req, res, next) {
    if (!err) {
        return next();
    }

    res.status(400);
    const { expose, type, message } = err;

    res.json({
        success: false,
        error: expose ? message : 'Request body is not proper JSON object or array.'
    });
}

module.exports = {
    handleBodyParserError
};
