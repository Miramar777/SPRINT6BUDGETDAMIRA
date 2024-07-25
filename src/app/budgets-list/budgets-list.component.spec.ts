import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetsListComponent } from './budgets-list.component';

describe('BudgetsListComponent', () => {
  let component: BudgetsListComponent;
  let fixture: ComponentFixture<BudgetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
