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
            <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
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

    // Usa dati mock per test
    this.useMockData();
  }

  useMockData() {
    this.loading = true;
    setTimeout(() => {
      this.weatherData = {
        name: this.city || 'Roma',
        main: {
          temp: 20 + Math.floor(Math.random() * 10),
          feels_like: 19,
          humidity: 65,
          pressure: 1013,
          temp_min: 18,
          temp_max: 25
        },
        weather: [{
          main: 'Clouds',
          description: 'nuvole sparse',
          icon: '03d'
        }],
        wind: {
          speed: 3.5
        },
        sys: {
          country: 'IT'
        },
        visibility: 10000
      };
      this.loading = false;
      console.log('Dati mock caricati:', this.weatherData);
    }, 1500);
  }

  getCurrentLocation() {
    console.log('Cliccato posizione corrente');
    this.loading = true;
    this.error = '';
    this.weatherData = null;
    
    // Simula geolocalizzazione
    setTimeout(() => {
      this.useMockData();
      this.city = 'Posizione Attuale';
    }, 1000);
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