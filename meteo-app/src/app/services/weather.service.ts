import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';

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
  private apiKey = 'cf90130f62f9149e1dc0201c4a6d7017';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<WeatherData> {
    // Pulisci il nome della città
    const cleanCity = city.trim();
    
    console.log('🌤️ Chiamando API per città:', cleanCity);

    // Encoding corretto dei parametri
    const params = new HttpParams()
      .set('q', cleanCity)
      .set('appid', this.apiKey)
      .set('units', 'metric')
      .set('lang', 'it');

    const url = `${this.apiUrl}?${params.toString()}`;
    console.log('🔗 URL completo:', url);

    return this.http.get<WeatherData>(this.apiUrl, { params })
      .pipe(
        timeout(10000), // Timeout di 10 secondi
        tap(data => {
          console.log('✅ Dati ricevuti con successo:');
          console.log('📍 Città:', data.name);
          console.log('🌡️ Temperatura:', data.main.temp + '°C');
          console.log('☁️ Condizioni:', data.weather[0].description);
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    console.log('🌤️ Chiamando API per coordinate:', lat, lon);

    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', this.apiKey)
      .set('units', 'metric')
      .set('lang', 'it');

    return this.http.get<WeatherData>(this.apiUrl, { params })
      .pipe(
        timeout(10000),
        tap(data => console.log('✅ Dati coordinate ricevuti:', data)),
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Errore sconosciuto';
    
    console.error('💥 Errore completo:', error);

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Errore di rete: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Errore di connessione. Verifica la connessione internet.';
          break;
        case 401:
          errorMessage = 'API key non valida. Controlla la tua chiave OpenWeatherMap.';
          break;
        case 404:
          errorMessage = 'Città non trovata. Prova con il nome in inglese o controlla lo spelling.';
          break;
        case 429:
          errorMessage = 'Troppe richieste. Riprova più tardi.';
          break;
        case 500:
        case 502:
        case 503:
          errorMessage = 'Servizio meteorologico temporaneamente non disponibile.';
          break;
        default:
          errorMessage = `Errore ${error.status}: ${error.message}`;
      }
    }
    
    console.error('❌ Errore WeatherService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // METODO DI TEST - Usalo per verificare
  testDirectApiCall(city: string = 'Roma'): void {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=it`;
    
    console.log('🧪 Test diretto API chiamando:', url);
    
    // Test diretto nel browser
    this.http.get(url).subscribe({
      next: (response: any) => {
        console.log('🎉 TEST SUCCESSO! Risposta API:', response);
      },
      error: (error) => {
        console.error('💥 TEST FALLITO! Errore:', error);
        if (error.status === 401) {
          console.error('🔑 PROBLEMA API KEY: La key potrebbe non essere attiva o essere bloccata');
        }
      }
    });
  }

  // Metodo di test con dati mock
  getMockWeather(city?: string): Observable<WeatherData> {
    const mockData: WeatherData = {
      name: city || 'Roma',
      main: {
        temp: 20 + Math.floor(Math.random() * 10),
        feels_like: 19 + Math.floor(Math.random() * 10),
        humidity: 65 + Math.floor(Math.random() * 20),
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
    
    return of(mockData).pipe(
      tap(() => console.log('📱 Usando dati MOCK per:', city || 'Roma'))
    );
  }
}