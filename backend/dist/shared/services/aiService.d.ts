import { HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class AiHttpService {
    private readonly httpService;
    private readonly configService;
    constructor(httpService: HttpService, configService: ConfigService);
    private getOptions;
    get<T = any>(endpoint: string, params?: any): any;
    post<T = any>(endpoint: string, data?: any): any;
    put<T = any>(endpoint: string, data?: any): any;
    delete<T = any>(endpoint: string): any;
}
