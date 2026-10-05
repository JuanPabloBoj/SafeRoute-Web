import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaList } from './zona-list';

describe('ZonaList', () => {
  let component: ZonaList;
  let fixture: ComponentFixture<ZonaList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonaList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonaList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
