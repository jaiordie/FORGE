"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = globalThis.__prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV === 'development') {
    globalThis.__prisma = exports.prisma;
}
exports.default = exports.prisma;
//# sourceMappingURL=database.js.map