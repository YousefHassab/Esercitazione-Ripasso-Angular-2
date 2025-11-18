import { ComponentFixture, TestBed } from '@angular/core/testing'; 
// Importa strumenti di testing di Angular
// ComponentFixture serve a manipolare e accedere al componente e al DOM

import { HomeComponent } from './home'; 
// Importa il componente Home da testare

// Descrive il gruppo di test per il componente Home
describe('Home', () => {
  let component: HomeComponent; // Variabile per l'istanza del componente
  let fixture: ComponentFixture<HomeComponent>; // Variabile per gestire il fixture (DOM + componente)

  // Eseguito prima di ogni test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent] // Importa il componente standalone
    })
    .compileComponents(); // Compila il componente e i template

    // Crea il fixture e l'istanza del componente
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); 
    // Rileva le modifiche e aggiorna il DOM
  });

  // Test principale: verifica che il componente venga creato
  it('should create', () => {
    expect(component).toBeTruthy(); 
    // Controlla che l'istanza del componente esista
  });
});
