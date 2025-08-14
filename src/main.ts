import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { runInInjectionContext } from '@angular/core';

bootstrapApplication(App, appConfig)
  .then(appRef => {
    const injector = appRef.injector;
    runInInjectionContext(injector, () => {
      import('./environments/firebase.config').then(module => {
        module.initFirebase();
      });
    });
  })
  .catch(err => console.error(err));
