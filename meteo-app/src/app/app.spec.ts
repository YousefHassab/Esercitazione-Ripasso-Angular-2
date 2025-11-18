import { TestBed } from '@angular/core/testing'; // Importa il modulo di testing di Angular
import { App } from './app'; // Importa il componente da testare

// Descrive il gruppo di test per il componente App
describe('App', () => {

  // Eseguito prima di ogni test, configura il modulo di test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App], // Importa il componente standalone App
    }).compileComponents(); // Compila i componenti
  });

  // Test per verificare che il componente venga creato correttamente
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App); // Crea un'istanza del componente
    const app = fixture.componentInstance; // Ottiene il componente
    expect(app).toBeTruthy(); // Verifica che il componente esista
  });

  // Test per verificare che il titolo venga renderizzato correttamente
  it('should render title', () => {
    const fixture = TestBed.createComponent(App); // Crea un'istanza del componente
    fixture.detectChanges(); // Rileva le modifiche e aggiorna il DOM
    const compiled = fixture.nativeElement as HTMLElement; // Ottiene l'elemento DOM del componente
    // Verifica che nel DOM ci sia un <h1> contenente "Hello, meteo-app"
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, meteo-app');
  });
});
