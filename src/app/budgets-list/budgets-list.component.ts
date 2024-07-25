import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BudgetService } from '../services/budget.service';
import { Budget } from '../models/budget';
import { Signal, signal } from '@angular/core';

@Component({
  selector: 'app-budgets-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './budgets-list.component.html',
  styleUrls: ['./budgets-list.component.scss']
})
export class BudgetsListComponent implements OnInit {
  @Input() isButtonClicked: boolean = false; 
  budgets: Signal<Budget[]> = signal([]);
  filteredBudgets: Signal<Budget[]> = signal([]);
  searchTerm: string = '';
  newBudget: Budget = {
    clientName: '',
    phone: '',
    email: '',
    seo: false,
    ads: false,
    web: false,
    webDetails: {
      pages: 0,
      languages: 0
    },
    date: new Date(),
    totalCost: 0
  };

  constructor(private budgetService: BudgetService) {}

  ngOnInit() {
    // Initialize budgets and filteredBudgets
    this.budgets = this.budgetService.getBudgets();
    this.filteredBudgets = this.budgets;

    // Perform initial filtering
    this.filterBudgets();
  }

  onSearchChange() {
    this.filterBudgets();
  }

  private filterBudgets() {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.budgets().filter(budget =>
      budget.clientName.toLowerCase().includes(term)
    );
    this.filteredBudgets = signal(filtered);
  }

  addBudget() {
    if (this.newBudget.clientName) {
      this.budgetService.addBudget(this.newBudget);
      this.newBudget = {
        clientName: '',
        phone: '',
        email: '',
        seo: false,
        ads: false,
        web: false,
        webDetails: {
          pages: 0,
          languages: 0
        },
        date: new Date(),
        totalCost: 0
      };
      this.searchTerm = ''; // Optionally clear search term
      this.filterBudgets(); // Refresh the list to include new budget
    }
  }

  trackByDate(index: number, budget: Budget): number {
    return budget.date.getTime();
  }

  sortByDate() {
    const sorted = [...this.budgets()].sort((a, b) => a.date.getTime() - b.date.getTime());
    this.filteredBudgets = signal(sorted);
  }

  sortByCost() {
    const sorted = [...this.budgets()].sort((a, b) => a.totalCost - b.totalCost);
    this.filteredBudgets = signal(sorted);
  }

  sortByName() {
    const sorted = [...this.budgets()].sort((a, b) => a.clientName.localeCompare(b.clientName));
    this.filteredBudgets = signal(sorted);
  }
}
