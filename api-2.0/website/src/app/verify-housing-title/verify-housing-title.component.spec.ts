import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyHousingTitleComponent } from './verify-housing-title.component';

describe('VerifyHousingTitleComponent', () => {
  let component: VerifyHousingTitleComponent;
  let fixture: ComponentFixture<VerifyHousingTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyHousingTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyHousingTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
