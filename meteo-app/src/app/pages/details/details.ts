// Importa il decoratore Component per creare il componente Angular
import { Component } from '@angular/core';

// Importa CommonModule (necessario per le direttive *ngIf / @if ecc.)
import { CommonModule } from '@angular/common';

// Importa Router per navigare tra le pagine
import { Router } from '@angular/router';

// Importa il tipo WeatherData per tipizzare i dati meteo
import { WeatherData } from '../../services/weather.service';

@Component({
  // Nome del selettore HTML del componente
  selector: 'app-details',

  // Template HTML del componente: interfaccia della pagina dei dettagli
  template: `
    @if (weatherData) {  <!-- Mostra i dettagli solo se i dati sono presenti -->
      <div class="details-container">

        <!-- HEADER DELLA PAGINA -->
        <div class="details-header">
          <button (click)="goBack()" class="back-btn">
            ← Torna alla Home
          </button>
          <h1>📊 Dettagli Meteo Completi</h1>
        </div>

        <!-- INTESTAZIONE CON NOME CITTÀ E ORARIO -->
        <div class="city-header">
          <h2>{{ weatherData.name }}</h2>
          <p class="current-time">{{ today | date:'dd/MM/yyyy HH:mm' }}</p>
        </div>

        <!-- GRIGLIA PRINCIPALE CON LE CARD DEI DETTAGLI -->
        <div class="details-grid">

          <!-- CARD TEMPERATURE -->
          <div class="detail-card temperature-card">

            <!-- Titolo card -->
            <div class="card-header">
              <span class="card-icon">🌡️</span>
              <h3>Temperatura</h3>
            </div>

            <!-- GRIGLIA CON LE DIVERSE TEMPERATURE -->
            <div class="temperature-grid">

              <!-- Temperatura attuale -->
              <div class="temp-item current" 
                   [style.color]="getTemperatureColor(weatherData.main.temp)">
                <span class="temp-label">Attuale</span>
                <span class="temp-value">{{ weatherData.main.temp | number:'1.1-1' }}°C</span>
              </div>

              <!-- Temperatura percepita -->
              <div class="temp-item feels-like">
                <span class="temp-label">Percepita</span>
                <span class="temp-value">{{ weatherData.main.feels_like | number:'1.1-1' }}°C</span>
              </div>

              <!-- Temperatura minima -->
              <div class="temp-item min-temp">
                <span class="temp-label">Minima</span>
                <span class="temp-value">{{ weatherData.main.temp_min | number:'1.1-1' }}°C</span>
              </div>

              <!-- Temperatura massima -->
              <div class="temp-item max-temp">
                <span class="temp-label">Massima</span>
                <span class="temp-value">{{ weatherData.main.temp_max | number:'1.1-1' }}°C</span>
              </div>

            </div>
          </div>

          <!-- CARD CONDIZIONI METEO -->
          <div class="detail-card conditions-card">

            <!-- Titolo -->
            <div class="card-header">
              <span class="card-icon">🌤️</span>
              <h3>Condizioni</h3>
            </div>

            <!-- Contenuto card -->
            <div class="conditions-content">

              <!-- Icona meteo (più grande rispetto alla home) -->
              <img 
                [src]="'https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@4x.png'"
                [alt]="weatherData.weather[0].description"
                class="weather-icon-large"
              >

              <!-- Descrizione -->
              <div class="conditions-text">
                <h4>{{ weatherData.weather[0].main }}</h4>
                <p>{{ weatherData.weather[0].description | titlecase }}</p>
              </div>

            </div>
          </div>

          <!-- CARD DETTAGLI ATMOSFERICI -->
          <div class="detail-card atmospheric-card">

            <div class="card-header">
              <span class="card-icon">🌬️</span>
              <h3>Atmosfera</h3>
            </div>

            <!-- Griglia dei parametri atmosferici -->
            <div class="atmospheric-grid">

              <!-- Umidità -->
              <div class="atmospheric-item">
                <span class="atmospheric-icon">💧</span>
                <div class="atmospheric-text">
                  <span class="atmospheric-label">Umidità</span>
                  <span class="atmospheric-value">{{ weatherData.main.humidity }}%</span>
                </div>
              </div>

              <!-- Pressione -->
              <div class="atmospheric-item">
                <span class="atmospheric-icon">📊</span>
                <div class="atmospheric-text">
                  <span class="atmospheric-label">Pressione</span>
                  <span class="atmospheric-value">{{ weatherData.main.pressure }} hPa</span>
                </div>
              </div>

              <!-- Visibilità -->
              <div class="atmospheric-item">
                <span class="atmospheric-icon">👁️</span>
                <div class="atmospheric-text">
                  <span class="atmospheric-label">Visibilità</span>
                  <span class="atmospheric-value">{{ weatherData.visibility / 1000 }} km</span>
                </div>
              </div>

            </div>
          </div>

          <!-- CARD VENTO -->
          <div class="detail-card wind-card">
            <div class="card-header">
              <span class="card-icon">💨</span>
              <h3>Vento</h3>
            </div>

            <div class="wind-content">
              <div class="wind-speed">
                <span class="wind-value">{{ weatherData.wind.speed }}</span>
                <span class="wind-unit">m/s</span>
              </div>
              <p class="wind-description">Velocità del vento attuale</p>
            </div>
          </div>

        </div> <!-- fine details-grid -->

        <!-- PULSANTE PER TORNARE ALLA RICERCA -->
        <div class="actions">
          <button (click)="goBack()" class="btn btn-primary">
            ← Torna alla Ricerca
          </button>
        </div>

      </div>
    } @else {   <!-- Se non ci sono dati mostra un messaggio -->
      <div class="error-container">
        <h2>Nessun dato meteo disponibile</h2>

        <button (click)="goBack()" class="btn btn-primary">
          ← Torna alla Home
        </button>
      </div>
    }
  `,

  // File CSS del componente
  styleUrls: ['./details.css'],

  // Standalone -> il componente non richiede un modulo
  standalone: true,

  // Moduli importati
  imports: [CommonModule]
})
export class DetailsComponent {

  // Dati meteo ricevuti dalla pagina Home
  weatherData: WeatherData;

  constructor(private router: Router) {

    // Recupera i dati passati dalla Home tramite router state
    const navigation = this.router.getCurrentNavigation();
    this.weatherData = navigation?.extras?.state?.['weatherData'];

    // Se non ci sono dati, torna alla home
    if (!this.weatherData) {
      console.log('Nessun dato ricevuto, redirect a home');
      this.router.navigate(['/']);
    }
  }

  // Restituisce la data e ora attuale
  get today(): Date {
    return new Date();
  }

  // Metodo per tornare alla pagina Home
  goBack() {
    console.log('Torno alla home');
    this.router.navigate(['/']);
  }

  // Cambia colore della temperatura in base al valore
  getTemperatureColor(temp: number): string {
    if (temp < 0) return '#74b9ff';     // Azzurro ghiaccio
    if (temp < 10) return '#00cec9';    // Verde acqua
    if (temp < 20) return '#00b894';    // Verde
    if (temp < 30) return '#fdcb6e';    // Giallo
    return '#e17055';                   // Arancione/rosso
  }
}
