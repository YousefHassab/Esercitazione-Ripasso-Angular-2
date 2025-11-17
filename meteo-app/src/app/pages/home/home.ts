import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { WeatherService, WeatherData } from '../../services/weather.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <header class="header">
        <h1>🌤️ Meteo App</h1>
        <p>Scopri le condizioni meteo in tempo reale</p>
      </header>

      <div class="search-section">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="city" 
            placeholder="Inserisci il nome della città..."
            (keyup.enter)="searchWeather()"
            class="search-input"
          >
          <div class="search-buttons">
            <button (click)="searchWeather()" class="btn btn-primary">
              🔍 Cerca
            </button>
            <button (click)="clearSearch()" class="btn btn-secondary">
              ❌ Pulisci
            </button>
          </div>
        </div>
        
        <button (click)="getCurrentLocation()" class="btn btn-location">
          📍 Meteo nella mia posizione
        </button>
      </div>

      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Ricerca meteo in corso...</p>
        </div>
      }

      @if (error && !loading) {
        <div class="error-state">
          ⚠️ {{ error }}
        </div>
      }

      @if (weatherData && !loading) {
        <div class="weather-card">
          <div class="weather-header">
            <!-- RIMOSSO IL PAESE - SOLO NOME CITTA' -->
            <h2>{{ weatherData.name }}</h2>
            <p class="current-time">{{ today | date:'dd/MM/yyyy HH:mm' }}</p>
          </div>

          <div class="weather-main">
            <div class="temperature-section">
              <img 
                [src]="'https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png'" 
                [alt]="weatherData.weather[0].description"
                class="weather-icon"
              >
              <div class="temperature">
                <span class="temp-value">{{ weatherData.main.temp | number:'1.0-0' }}</span>
                <span class="temp-unit">°C</span>
              </div>
            </div>

            <div class="weather-info">
              <p class="weather-description">{{ weatherData.weather[0].description | titlecase }}</p>
              <p class="feels-like">Percepiti: {{ weatherData.main.feels_like | number:'1.0-0' }}°C</p>
            </div>
          </div>

          <div class="weather-details">
            <div class="detail-item">
              <span class="detail-icon">💧</span>
              <div class="detail-text">
                <span class="detail-label">Umidità</span>
                <span class="detail-value">{{ weatherData.main.humidity }}%</span>
              </div>
            </div>

            <div class="detail-item">
              <span class="detail-icon">💨</span>
              <div class="detail-text">
                <span class="detail-label">Vento</span>
                <span class="detail-value">{{ weatherData.wind.speed }} m/s</span>
              </div>
            </div>

            <div class="detail-item">
              <span class="detail-icon">📊</span>
              <div class="detail-text">
                <span class="detail-label">Pressione</span>
                <span class="detail-value">{{ weatherData.main.pressure }} hPa</span>
              </div>
            </div>

            <div class="detail-item">
              <span class="detail-icon">👁️</span>
              <div class="detail-text">
                <span class="detail-label">Visibilità</span>
                <span class="detail-value">{{ weatherData.visibility / 1000 }} km</span>
              </div>
            </div>
          </div>

          <button (click)="viewDetails()" class="btn btn-details">
            📊 Vedi Dettagli Completi
          </button>
        </div>
      }

      @if (!weatherData && !loading && !error) {
        <div class="instructions">
          <h3>Come utilizzare l'app:</h3>
          <ul>
            <li>🔍 Inserisci il nome di una città e premi Cerca</li>
            <li>📍 Oppure clicca "Meteo nella mia posizione"</li>
            <li>📊 Visualizza i dettagli completi del meteo</li>
          </ul>
        </div>
      }
    </div>
  `,
  styleUrls: ['./home.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class HomeComponent {
  city: string = '';
  weatherData: WeatherData | null = null;
  loading: boolean = false;
  error: string = '';

  constructor(
    private weatherService: WeatherService,
    private router: Router
  ) {}

  get today(): Date {
    return new Date();
  }

  searchWeather() {
    console.log('Cliccato cerca per:', this.city);
    if (!this.city.trim()) {
      this.error = 'Inserisci il nome di una città';
      return;
    }

    this.loading = true;
    this.error = '';
    this.weatherData = null;

    // SOSTITUITO: ora usa l'API reale invece dei mock
    this.weatherService.getWeather(this.city).subscribe({
      next: (data) => {
        this.weatherData = data;
        this.loading = false;
        console.log('Dati API ricevuti:', data);
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        console.error('Errore API:', err);
      }
    });
  }

  getCurrentLocation() {
    console.log('Cliccato posizione corrente');
    
    if (!navigator.geolocation) {
      this.error = 'Geolocalizzazione non supportata dal browser';
      return;
    }

    this.loading = true;
    this.error = '';
    this.weatherData = null;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        this.weatherService.getWeatherByCoords(lat, lon).subscribe({
          next: (data) => {
            this.weatherData = data;
            this.loading = false;
            this.city = data.name;
            console.log('Dati posizione ricevuti:', data);
          },
          error: (err) => {
            this.error = err.message;
            this.loading = false;
          }
        });
      },
      (error) => {
        this.loading = false;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.error = 'Permesso di localizzazione negato';
            break;
          case error.POSITION_UNAVAILABLE:
            this.error = 'Posizione non disponibile';
            break;
          case error.TIMEOUT:
            this.error = 'Timeout nella richiesta di posizione';
            break;
          default:
            this.error = 'Errore nella geolocalizzazione';
        }
      }
    );
  }

  viewDetails() {
    console.log('Cliccato vedi dettagli');
    if (this.weatherData) {
      this.router.navigate(['/details'], { 
        state: { weatherData: this.weatherData } 
      });
    }
  }

  clearSearch() {
    console.log('Cliccato pulisci');
    this.city = '';
    this.weatherData = null;
    this.error = '';
  }
}