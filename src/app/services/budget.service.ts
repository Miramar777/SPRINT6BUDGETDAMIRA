import { Injectable, signal } from '@angular/core';
import { Budget } from '../models/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  private budgets = signal<Budget[]>([]);

  calculateTotal(serviceSelection: any, webDetails: any): number {
    let total = 0;
    if (serviceSelection.seo) total += 300;
    if (serviceSelection.ads) total += 400;
    if (serviceSelection.web) {
      total += 500 + (webDetails.pages * webDetails.languages * 30);
    }
    return total;
  }

  addBudget(budget: Budget): void {
    console.log('Adding budget:', budget); // Debug statement
    this.budgets.update(budgets => [...budgets, budget]);
    console.log('Budgets list:', this.budgets()); // Debug statement
  }

  getBudgets() {
    return this.budgets; // Return the signal itself
  }
}
