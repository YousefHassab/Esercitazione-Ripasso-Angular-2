// Importa ApplicationConfig: permette di configurare l'app Angular senza usare AppModule (standalone)
import { ApplicationConfig, importProvidersFrom } from '@angular/core';

// provideRouter permette di attivare il routing e indicare le rotte
import { provideRouter } from '@angular/router';

// provideHttpClient abilita le richieste HTTP nella tua applicazione
import { provideHttpClient } from '@angular/common/http';

// Import delle rotte definite nel file app.routes.ts
import { routes } from './app.routes';

// CommonModule contiene direttive standard come *ngIf, *ngFor, ecc.
import { CommonModule } from '@angular/common';

// FormsModule serve per utilizzare ngModel nei form template-driven
import { FormsModule } from '@angular/forms';

// Qui definisci la configurazione generale dell'app Angular
export const appConfig: ApplicationConfig = {

  // providers = servizi globali disponibili in tutta l'app
  providers: [

    // Attiva il sistema di routing usando le rotte che hai definito
    provideRouter(routes),

    // Abilita il sistema per fare chiamate HTTP
    provideHttpClient(),

    // Importa moduli "vecchio stile" come providers globali per un progetto standalone
    importProvidersFrom(CommonModule, FormsModule)
  ]
};
