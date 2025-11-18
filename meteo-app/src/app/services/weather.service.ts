// Importa il decoratore Injectable per creare un servizio Angular
import { Injectable } from '@angular/core';

// Importa HttpClient per fare richieste HTTP, HttpErrorResponse per gestire errori,
// HttpParams per costruire parametri per l'URL
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';

// Importa Observable (risposte asincrone), throwError (generare errori),
// e of (creare dati finti)
import { Observable, throwError, of } from 'rxjs';

// Importa operatori RxJS: catchError per gestire errori,
// tap per loggare dati senza modificarli,
// timeout per impostare un limite di tempo alle richieste
import { catchError, tap, timeout } from 'rxjs/operators';

// Interfaccia che descrive la struttura dei dati ricevuti da OpenWeatherMap
export interface WeatherData {
  name: string;
  main: {
    temp: number;          // temperatura attuale
    feels_like: number;    // temperatura percepita
    humidity: number;      // umidità
    pressure: number;      // pressione atmosferica
    temp_min: number;      // temperatura minima
    temp_max: number;      // temperatura massima
  };
  weather: [{
    main: string;          // condizione meteo (es. “Clouds”)
    description: string;   // descrizione dettagliata (es. “nuvoloso”)
    icon: string;          // icona associata
  }];
  wind: {
    speed: number;         // velocità del vento
  };
  sys: {
    country: string;       // codice della nazione
  };
  visibility: number;      // visibilità in metri
}

// Dichiara che questo servizio è disponibile in tutta l'app
@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  // Chiave API di OpenWeatherMap
  private apiKey = 'cf90130f62f9149e1dc0201c4a6d7017';

  // URL base dell’API per ottenere meteo corrente
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

  // HttpClient viene iniettato automaticamente da Angular
  constructor(private http: HttpClient) {}

  // Metodo per ottenere meteo tramite nome città
  getWeather(city: string): Observable<WeatherData> {

    // Pulisce eventuali spazi extra nel nome della città
    const cleanCity = city.trim();
    
    console.log('🌤️ Chiamando API per città:', cleanCity);

    // Crea i parametri della richiesta HTTP in modo sicuro
    const params = new HttpParams()
      .set('q', cleanCity)     // città
      .set('appid', this.apiKey)  // chiave API
      .set('units', 'metric')     // unità in Celsius
      .set('lang', 'it');         // lingua italiana

    // Optional: mostra l’URL completo usato
    const url = `${this.apiUrl}?${params.toString()}`;
    console.log('🔗 URL completo:', url);

    // Esegue la richiesta GET
    return this.http.get<WeatherData>(this.apiUrl, { params })
      .pipe(
        timeout(10000), // Se la risposta impiega più di 10 secondi dà errore

        // tap esegue azioni mentre passa i dati senza modificarli
        tap(data => {
          console.log('✅ Dati ricevuti con successo:');
          console.log('📍 Città:', data.name);
          console.log('🌡️ Temperatura:', data.main.temp + '°C');
          console.log('☁️ Condizioni:', data.weather[0].description);
        }),

        // Se c'è un errore passa alla funzione di gestione errori
        catchError(this.handleError.bind(this))
      );
  }

  // Metodo per ottenere meteo tramite coordinate GPS
  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    console.log('🌤️ Chiamando API per coordinate:', lat, lon);

    // Parametri per la richiesta basati su latitudine e longitudine
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('appid', this.apiKey)
      .set('units', 'metric')
      .set('lang', 'it');

    // Chiamata API
    return this.http.get<WeatherData>(this.apiUrl, { params })
      .pipe(
        timeout(10000),
        tap(data => console.log('✅ Dati coordinate ricevuti:', data)),
        catchError(this.handleError.bind(this))
      );
  }

  // Funzione privata per gestire tutti gli errori API
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Errore sconosciuto';
    
    console.error('💥 Errore completo:', error);

    // Se l’errore è lato client (es. internet non funziona)
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Errore di rete: ${error.error.message}`;
    } else {
      // Gestione degli errori HTTP
      switch (error.status) {
        case 0:
          errorMessage = 'Errore di connessione. Verifica la connessione internet.';
          break;
        case 401:
          errorMessage = 'API key non valida. Controlla la tua chiave OpenWeatherMap.';
          break;
        case 404:
          errorMessage = 'Città non trovata. Controlla lo spelling.';
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

    // Ritorna un errore come Observable
    return throwError(() => new Error(errorMessage));
  }

  // Metodo di test: chiama direttamente l’API nel browser
  testDirectApiCall(city: string = 'Roma'): void {

    // Costruisce manualmente l’URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=it`;
    
    console.log('🧪 Test diretto API chiamando:', url);
    
    // Esegue la chiamata e vede se funziona
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

  // Metodo che restituisce dati finti per testare l'app senza API reali
  getMockWeather(city?: string): Observable<WeatherData> {

    // Oggetto meteo finto
    const mockData: WeatherData = {
      name: city || 'Roma',
      main: {
        temp: 20 + Math.floor(Math.random() * 10),      // temperatura casuale
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
    
    // Restituisce i dati mock come Observable
    return of(mockData).pipe(
      tap(() => console.log('📱 Usando dati MOCK per:', city || 'Roma'))
    );
  }
}
