import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHousingTitleComponent } from './create-housing-title.component';

describe('CreateHousingTitleComponent', () => {
  let component: CreateHousingTitleComponent;
  let fixture: ComponentFixture<CreateHousingTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateHousingTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHousingTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
