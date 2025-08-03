"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const jobController_1 = require("../controllers/jobController");
const plumberController_1 = require("../controllers/plumberController");
const router = (0, express_1.Router)();
// All plumber routes require authentication and plumber role
router.use(auth_1.authenticate);
router.use((0, auth_1.authorize)(client_1.UserRole.PLUMBER));
router.get('/jobs', jobController_1.getPlumberJobs);
router.get('/dashboard', plumberController_1.getPlumberDashboard);
router.put('/availability', plumberController_1.updateAvailability);
router.put('/preferences', plumberController_1.updateJobPreferences);
exports.default = router;
//# sourceMappingURL=plumber.js.map