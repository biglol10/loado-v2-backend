"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = exports.logger = exports.asyncHandler = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    res.status(500).send(err.message || "An error occurred");
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch((err) => {
    // err = new Error("This is another error"); // errorHandler의 err엔 이게 감
    next(err);
});
exports.asyncHandler = asyncHandler;
const logger = (req, res, next) => {
    req.msg = "Logging Start";
    console.log(`${req.method} ${req.path}`);
    next();
};
exports.logger = logger;
const cors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
        res.status(204).end();
    }
    else {
        next();
    }
};
exports.cors = cors;
