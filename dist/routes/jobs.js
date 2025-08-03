"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const jobController_1 = require("../controllers/jobController");
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_DIR || 'uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
// Job routes
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.DISPATCHER, client_1.UserRole.HOMEOWNER), jobController_1.createJob);
router.post('/:id/quote', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.PLUMBER), jobController_1.submitQuote);
router.post('/:id/status', auth_1.authenticate, jobController_1.updateJobStatus);
router.post('/:id/photo', auth_1.authenticate, upload.single('photo'), jobController_1.uploadJobPhoto);
router.post('/:id/review', auth_1.authenticate, (0, auth_1.authorize)(client_1.UserRole.HOMEOWNER), jobController_1.createReview);
exports.default = router;
//# sourceMappingURL=jobs.js.map