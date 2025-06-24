import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VlogbrothersComponent } from './vlogbrothers.component';

describe('VlogbrothersComponent', () => {
  let component: VlogbrothersComponent;
  let fixture: ComponentFixture<VlogbrothersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VlogbrothersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VlogbrothersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
