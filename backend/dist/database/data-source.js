"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../modules/users/entities/user.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'nepal_health',
    entities: [user_entity_1.User],
    migrations: ['src/database/migrations/*{.ts,.js}'],
    subscribers: ['src/database/subscribers/*{.ts,.js}'],
    logging: process.env.NODE_ENV === 'development',
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map