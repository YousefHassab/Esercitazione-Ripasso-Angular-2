// Importa Component: serve per definire un componente Angular
import { Component } from '@angular/core';

// Importa CommonModule, necessario per direttive base come *ngIf, *ngFor
import { CommonModule } from '@angular/common';

// Importa RouterModule, serve per attivare <router-outlet> e navigazione tra pagine
import { RouterModule } from '@angular/router';

@Component({
  // Nome del selettore HTML che rappresenta questo componente
  // (verrà usato in index.html come <app-root>)
  selector: 'app-root',

  // File HTML associato al componente
  templateUrl: './app.html',

  // Fogli di stile associati al componente
  styleUrls: ['./app.css'],

  // Indica che questo è un componente standalone (senza AppModule)
  standalone: true,

  // Moduli importati, necessari per usare direttive e routing
  imports: [CommonModule, RouterModule]
})
export class App {
  // Proprietà semplice usata come titolo dell'app
  title = 'meteo-app';
}
