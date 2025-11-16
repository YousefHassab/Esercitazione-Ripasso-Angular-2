import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    temp_min: number;
    temp_max: number;
  };
  weather: [{
    main: string;
    description: string;
    icon: string;
  }];
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
  visibility: number;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // PER TEST - usa una città fissa per debug
  private apiKey = 'tuachiave'; // METTI LA TUA API KEY QUI
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<WeatherData> {
    console.log('Chiamando API per città:', city); // Debug
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric&lang=it`;
    console.log('URL API:', url); // Debug
    return this.http.get<WeatherData>(url);
  }

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    console.log('Chiamando API per coordinate:', lat, lon); // Debug
    return this.http.get<WeatherData>(
      `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=it`
    );
  }

  // Metodo di test con dati mock
  getMockWeather(): Observable<WeatherData> {
    const mockData: WeatherData = {
      name: 'Roma',
      main: {
        temp: 20,
        feels_like: 19,
        humidity: 65,
        pressure: 1013,
        temp_min: 18,
        temp_max: 22
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
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockData);
        observer.complete();
      }, 1000);
    });
  }
}