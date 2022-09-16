import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHousingTitleComponent } from './view-housing-title.component';

describe('ViewHousingTitleComponent', () => {
  let component: ViewHousingTitleComponent;
  let fixture: ComponentFixture<ViewHousingTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHousingTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHousingTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
