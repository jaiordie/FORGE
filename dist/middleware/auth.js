"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const auth_1 = require("../utils/auth");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1]; // Bearer <token>
        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }
        const user = (0, auth_1.verifyToken)(token);
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map