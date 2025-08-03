"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const database_1 = __importDefault(require("../utils/database"));
const auth_1 = require("../utils/auth");
const signup = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role, phone } = req.body;
        // Validate required fields
        if (!email || !password || !firstName || !lastName || !role) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Validate role
        if (!Object.values(client_1.UserRole).includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        // Check if user already exists
        const existingUser = await database_1.default.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
        // Hash password
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        // Create user
        const user = await database_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            }
        });
        // Create plumber profile if user is a plumber
        if (role === client_1.UserRole.PLUMBER) {
            await database_1.default.plumberProfile.create({
                data: {
                    userId: user.id,
                }
            });
        }
        // Generate token
        const token = (0, auth_1.generateToken)(user);
        res.status(201).json({
            message: 'User created successfully',
            user,
            token
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        // Find user
        const user = await database_1.default.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                firstName: true,
                lastName: true,
                role: true,
            }
        });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Verify password
        const isValidPassword = await (0, auth_1.comparePassword)(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate token
        const token = (0, auth_1.generateToken)({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        });
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map