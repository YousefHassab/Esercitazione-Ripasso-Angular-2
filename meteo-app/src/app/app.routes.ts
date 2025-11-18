import { Routes } from '@angular/router'; 
// Importa il tipo Routes da Angular Router per definire le rotte

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) 
    // Rotta principale (root) che carica lazy-loaded il componente HomeComponent
  },
  { 
    path: 'details', 
    loadComponent: () => import('./pages/details/details').then(m => m.DetailsComponent) 
    // Rotta per i dettagli meteo, caricamento lazy di DetailsComponent
  },
  { path: '**', redirectTo: '' } 
  // Rotta "catch-all": se l'utente inserisce un percorso non valido, viene reindirizzato alla root
];
