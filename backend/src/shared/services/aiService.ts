import { Injectable, HttpService, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, timeout, retry } from 'rxjs/operators';
import { throwError, timeout as rxjsTimeout } from 'rxjs';

@Injectable()
export class AiHttpService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private getOptions() {
    return {
      timeout: this.configService.get<number>('AI_TIMEOUT') || 30000,
      headers: {
        'X-Internal-Token': this.configService.get<string>('FASTAPI_INTERNAL_TOKEN'),
      },
    };
  }

  get<T = any>(endpoint: string, params?: any) {
    return this.httpService
      .get<T>(
        `${this.configService.get<string>('FASTAPI_URL')}${endpoint}`,
        { params, ...this.getOptions() },
      )
      .pipe(
        timeout(this.getOptions().timeout),
        retry(3),
        catchError((error) => {
          throw new HttpException(
            error.response?.data?.message || 'AI service unavailable',
            error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
      )
      .toPromise()
      .then((res) => res.data);
  }

  post<T = any>(endpoint: string, data?: any) {
    return this.httpService
      .post<T>(
        `${this.configService.get<string>('FASTAPI_URL')}${endpoint}`,
        data,
        this.getOptions(),
      )
      .pipe(
        timeout(this.getOptions().timeout),
        retry(3),
        catchError((error) => {
          throw new HttpException(
            error.response?.data?.message || 'AI service unavailable',
            error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
      )
      .toPromise()
      .then((res) => res.data);
  }

  put<T = any>(endpoint: string, data?: any) {
    return this.httpService
      .put<T>(
        `${this.configService.get<string>('FASTAPI_URL')}${endpoint}`,
        data,
        this.getOptions(),
      )
      .pipe(
        timeout(this.getOptions().timeout),
        retry(3),
        catchError((error) => {
          throw new HttpException(
            error.response?.data?.message || 'AI service unavailable',
            error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
      )
      .toPromise()
      .then((res) => res.data);
  }

  delete<T = any>(endpoint: string) {
    return this.httpService
      .delete<T>(
        `${this.configService.get<string>('FASTAPI_URL')}${endpoint}`,
        this.getOptions(),
      )
      .pipe(
        timeout(this.getOptions().timeout),
        retry(3),
        catchError((error) => {
          throw new HttpException(
            error.response?.data?.message || 'AI service unavailable',
            error.response?.status || HttpStatus.SERVICE_UNAVAILABLE,
          );
        }),
      )
      .toPromise()
      .then((res) => res.data);
  }
}
