import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoList } from './contacto-list';

describe('ContactoList', () => {
  let component: ContactoList;
  let fixture: ComponentFixture<ContactoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactoList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
