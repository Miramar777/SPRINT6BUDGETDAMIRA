import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BudgetService } from '../services/budget.service';
import { Budget } from '../models/budget';
import { Signal, signal, computed } from '@angular/core';

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
  filteredBudgets: Signal<Budget[]>;
  searchTerm: string = '';
  sortCriteria: string = 'date'; // Default sort criteria

  constructor(private budgetService: BudgetService) {
    this.filteredBudgets = computed(() => this.filterAndSortBudgets());
  }

  ngOnInit() {
    this.budgets = this.budgetService.getBudgets();
  }

  onSearchChange() {
    // Trigger recomputation of filteredBudgets
    this.filteredBudgets = computed(() => this.filterAndSortBudgets());
  }

  private filterAndSortBudgets(): Budget[] {
    const term = this.searchTerm.toLowerCase();
    let filtered = this.budgets().filter(budget =>
      budget.clientName.toLowerCase().includes(term)
    );

    // Apply sorting
    switch (this.sortCriteria) {
      case 'date':
        filtered.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'cost':
        filtered.sort((a, b) => a.totalCost - b.totalCost);
        break;
      case 'name':
        filtered.sort((a, b) => a.clientName.localeCompare(b.clientName));
        break;
    }

    return filtered;
  }

  sortByDate() {
    this.sortCriteria = 'date';
    this.filteredBudgets = computed(() => this.filterAndSortBudgets());
  }

  sortByCost() {
    this.sortCriteria = 'cost';
    this.filteredBudgets = computed(() => this.filterAndSortBudgets());
  }

  sortByName() {
    this.sortCriteria = 'name';
    this.filteredBudgets = computed(() => this.filterAndSortBudgets());
  }

  trackByDate(index: number, budget: Budget): number {
    return budget.date.getTime();
  }
}