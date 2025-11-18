import { ComponentFixture, TestBed } from '@angular/core/testing'; 
// Importa gli strumenti di testing di Angular per creare componenti e fixture

import { DetailsComponent } from './details'; 
// Importa il componente Details da testare

// Gruppo di test per DetailsComponent
describe('Details', () => {
  let component: DetailsComponent; // Variabile per l'istanza del componente
  let fixture: ComponentFixture<DetailsComponent>; // Fixture per interagire con il DOM e il componente

  // Eseguito prima di ogni test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsComponent] 
      // Importa il componente standalone senza dover dichiarare moduli aggiuntivi
    })
    .compileComponents(); // Compila il template e il CSS del componente

    // Crea il fixture e recupera l'istanza del componente
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;

    fixture.detectChanges(); 
    // Rileva le modifiche e aggiorna il DOM
  });

  // Test principale: verifica che il componente sia creato correttamente
  it('should create', () => {
    expect(component).toBeTruthy(); 
    // Controlla che l'istanza del componente esista
  });
});
