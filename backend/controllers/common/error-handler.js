function handleError(res) {
    res.status(500).json({
        success: false,
        error: 'Server error occurred.'
    });
}

module.exports = {
    handleError
};
