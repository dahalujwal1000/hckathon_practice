"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('frontend', () => ({
    url: process.env.FRONTEND_URL,
}));
//# sourceMappingURL=frontend.config.js.map