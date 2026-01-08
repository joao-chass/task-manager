import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { 
  faTrash, 
  faEdit, 
  faCheck, 
  faPlus, 
  faSignOutAlt, 
  faUser, 
  faUserPlus, 
  faTasks,
  faArrowLeft,
  faEnvelope,
  faLock,
  faExclamationTriangle,
  faInfoCircle,
  faSearch,
  faCalendar,
  faHome,
  faBars,
  faTimes,
  faEye,
  faEyeSlash
} from '@fortawesome/free-solid-svg-icons';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(
      NgbModule,
      FontAwesomeModule
    ),
    // Provedor para inicializar os ícones
    {
      provide: 'APP_INITIALIZER',
      useFactory: (library: FaIconLibrary) => () => {
        library.addIcons(
          faTrash, faEdit, faCheck, faPlus, faSignOutAlt, 
          faUser, faUserPlus, faTasks, faArrowLeft, faEnvelope,
          faLock, faExclamationTriangle, faInfoCircle, faSearch,
          faCalendar, faHome, faBars, faTimes, faEye, faEyeSlash
        );
      },
      deps: [FaIconLibrary],
      multi: true
    }
  ]
};
