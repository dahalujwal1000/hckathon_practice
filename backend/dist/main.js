"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const validation_pipe_1 = require("@nestjs/common/pipes/validation.pipe");
const swagger_1 = require("@nestjs/swagger");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new validation_pipe_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nepal Health Hospital API')
        .setDescription('API for Nepal Health Hospital platform')
        .setVersion('1.0')
        .addTag('authentication')
        .addTag('users')
        .addTag('doctors')
        .addTag('hospitals')
        .addTag('appointments')
        .addTag('ambulance')
        .addTag('ai')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map