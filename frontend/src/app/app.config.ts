import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import localeEsCo from '@angular/common/locales/es-CO';
import { routes } from './app.routes';
import { APP_LOCALE } from './core/constants/locale.constant';

// Sin esto, DatePipe lanza NG0701 y la excepción rompe la detección de
// cambios de los componentes que lo usan.
registerLocaleData(localeEsCo, APP_LOCALE);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: LOCALE_ID, useValue: APP_LOCALE },
  ],
};
