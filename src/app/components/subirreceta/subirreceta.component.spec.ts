import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirrecetaComponent } from './subirreceta.component';

describe('SubirrecetaComponent', () => {
  let component: SubirrecetaComponent;
  let fixture: ComponentFixture<SubirrecetaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubirrecetaComponent]
    });
    fixture = TestBed.createComponent(SubirrecetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
