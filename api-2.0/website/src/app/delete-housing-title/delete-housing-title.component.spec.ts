import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteHousingTitleComponent } from './delete-housing-title.component';

describe('DeleteHousingTitleComponent', () => {
  let component: DeleteHousingTitleComponent;
  let fixture: ComponentFixture<DeleteHousingTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteHousingTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteHousingTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
