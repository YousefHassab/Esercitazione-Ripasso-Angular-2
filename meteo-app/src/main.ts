// Importa la funzione bootstrapApplication che permette di avviare
// un'app Angular basata su componenti standalone (senza AppModule)
import { bootstrapApplication } from '@angular/platform-browser';

// Importa la configurazione globale dell'app (router, http, moduli, ecc.)
import { appConfig } from './app/app.config';

// Importa il componente principale dell'applicazione (equivalente al "root component")
import { App } from './app/app';

// Avvia l'applicazione Angular passando:
// - il componente root (App)
// - la configurazione generale (appConfig)
bootstrapApplication(App, appConfig)
  // Se succede un errore durante l'avvio, viene catturato e stampato in console
  .catch(err => console.error(err));
