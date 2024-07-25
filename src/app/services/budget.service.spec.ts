import { TestBed } from '@angular/core/testing';
import { BudgetService } from './budget.service';

describe('BudgetService', () => {
  let service: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate total cost correctly', () => {
    const serviceSelection = { seo: true, ads: false, web: true };
    const webDetails = { pages: 3, languages: 2 };
    const total = service.calculateTotal(serviceSelection, webDetails);
    expect(total).toBe(500 + 300 + (3 * 2 * 30));
  });

  it('should calculate total cost correctly when no services are selected', () => {
    const serviceSelection = { seo: false, ads: false, web: false };
    const webDetails = { pages: 1, languages: 1 };
    const total = service.calculateTotal(serviceSelection, webDetails);
    expect(total).toBe(0);
  });

  it('should calculate total cost correctly with only ads selected', () => {
    const serviceSelection = { seo: false, ads: true, web: false };
    const webDetails = { pages: 1, languages: 1 };
    const total = service.calculateTotal(serviceSelection, webDetails);
    expect(total).toBe(400);
  });
});
