"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('fastapi', () => ({
    url: process.env.FASTAPI_URL,
    internalToken: process.env.FASTAPI_INTERNAL_TOKEN,
}));
//# sourceMappingURL=fastapi.config.js.map