// middleware/logger.js
const logger = (req, res, next) => {
    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL: ${req.originalUrl}`);
    console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
    if (Object.keys(req.body).length) {
        console.log(`Request Body: ${JSON.stringify(req.body)}`);
    }
    next();  // Call the next middleware or route handler
};

module.exports = logger;