import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, combineLatest, startWith, map } from 'rxjs';
import { WelcomeComponent } from '../welcome/welcome.component';
import { BudgetService } from '../services/budget.service';
import { PanelComponent } from '../panel/panel.component';
import { BudgetsListComponent } from '../budgets-list/budgets-list.component';
import { Service } from '../models/service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PanelComponent, BudgetsListComponent, ReactiveFormsModule, WelcomeComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  serviceForm: FormGroup;
  webForm: FormGroup;
  totalCost$: Observable<number>;
submittedBudget: any;


  @Input() item = ''; 
  services: Service[] = [
    { name: 'SEO', description: 'Programació d\'una web responsive completa', price: 300, controlName: 'seo' },
    { name: 'Ads', description: 'Programació d\'una web responsive completa', price: 400, controlName: 'ads' },
    { name: 'Web', description: 'Programació d\'una web responsive completa', price: 500, controlName: 'web' }
  ];

  constructor(private budgetService: BudgetService) {
    this.serviceForm = new FormGroup({
      clientName: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{9}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      seo: new FormControl(false),
      ads: new FormControl(false),
      web: new FormControl(false)
    });

    this.webForm = new FormGroup({
      pages: new FormControl(1, [Validators.required, Validators.min(1)]),
      languages: new FormControl(1, [Validators.required, Validators.min(1)])
    });

    this.totalCost$ = combineLatest([
      this.serviceForm.valueChanges.pipe(startWith(this.serviceForm.value)),
      this.webForm.valueChanges.pipe(startWith(this.webForm.value))
    ]).pipe(
      map(([serviceValues, webValues]) => this.budgetService.calculateTotal(serviceValues, webValues))
    );
  }



  ngOnInit(): void {}



  getPlaceholder(field: string): string {
    switch (field) {
      case 'clientName': return 'Nom del client';
      case 'phone': return 'Telèfon';
      case 'email': return 'Correu electrònic';
      default: return '';
    }
  }

  getErrorMessage(field: string): string {
    const control = this.serviceForm.get(field);
    if (control?.hasError('required')) {
      return 'Aquest camp és obligatori';
    }
    if (control?.hasError('pattern')) {
      return 'Format invàlid';
    }
    if (control?.hasError('email')) {
      return 'Correu electrònic invàlid';
    }
    return '';
  }



  saveBudget(): void {
    if (this.serviceForm.valid && this.webForm.valid) {
      const budget = {
        ...this.serviceForm.value,
        webDetails: this.webForm.value,
        totalCost: this.budgetService.calculateTotal(this.serviceForm.value, this.webForm.value),
        date: new Date()
      };

      
      this.budgetService.addBudget(budget);
      this.serviceForm.reset({
        clientName: '',
        phone: '',
        email: '',
        seo: false,
        ads: false,
        web: false
      });
      this.webForm.reset({
        pages: 1,
        languages: 1
      });
    } else {
      Object.values(this.serviceForm.controls).forEach(control => control.markAsTouched());
      Object.values(this.webForm.controls).forEach(control => control.markAsTouched());
    }
  }
 
}


