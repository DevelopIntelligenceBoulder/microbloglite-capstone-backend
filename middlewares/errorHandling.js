const errorHandler = (err, req, res, next) => {
    // some packages pass an error with a status property instead of statusCode
    // reconcile that difference here by copying err.status to err.statusCode
    if (err.status) {
        err.statusCode = err.status;
    }

    if (err.statusCode >= 400 && err.statusCode < 500) {
        if (err.statusCode === 401) {
            res.set(
                'WWW-Authenticate',
                `Bearer realm="POST your username and password to /auth/login to receive a token"`
            );
        }

        res
            .status(err.statusCode)
            .json({
                message: err.message,
                statusCode: err.statusCode
            });
    } else {
        res
            .status(err.statusCode || 500)
            .json({
                message: err.message,
                statusCode: res.statusCode
            });
        
        // morgan is NOT an error handler, so must add error to req so morgan has access to it
        // also ensure req/res gets passed to following morgan logging middleware by calling next()
        req.error = err;
        console.log(err);
        next();
    }
};

module.exports = errorHandler;
