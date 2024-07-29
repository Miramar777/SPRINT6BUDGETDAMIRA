import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, combineLatest, startWith, map } from 'rxjs';
import { WelcomeComponent } from '../welcome/welcome.component';
import { BudgetService } from '../services/budget.service';
import { PanelComponent } from '../panel/panel.component';
import { BudgetsListComponent } from '../budgets-list/budgets-list.component';
import { Service } from '../models/service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PanelComponent, BudgetsListComponent, ReactiveFormsModule, WelcomeComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  serviceForm!: FormGroup;
  webForm!: FormGroup;
  totalCost$!: Observable<number>;
  submittedBudget: any;

  @Input() item = ''; 
  services: Service[] = [
    { name: 'SEO', description: 'Programació d\'una web responsive completa', price: 300, controlName: 'seo' },
    { name: 'Ads', description: 'Programació d\'una web responsive completa', price: 400, controlName: 'ads' },
    { name: 'Web', description: 'Programació d\'una web responsive completa', price: 500, controlName: 'web' }
  ];

  constructor(
    private budgetService: BudgetService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initializeForms();
    this.setupTotalCostObservable();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.updateFormsFromParams(params);
    });

    this.serviceForm.valueChanges.subscribe(() => this.updateUrl());
    this.webForm.valueChanges.subscribe(() => this.updateUrl());
  }

  private initializeForms(): void {
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
  }

  private setupTotalCostObservable(): void {
    this.totalCost$ = combineLatest([
      this.serviceForm.valueChanges.pipe(startWith(this.serviceForm.value)),
      this.webForm.valueChanges.pipe(startWith(this.webForm.value))
    ]).pipe(
      map(([serviceValues, webValues]) => this.budgetService.calculateTotal(serviceValues, webValues))
    );
  }

  private updateFormsFromParams(params: any): void {
    if (params['seo']) this.serviceForm.get('seo')?.setValue(params['seo'] === 'true');
    if (params['ads']) this.serviceForm.get('ads')?.setValue(params['ads'] === 'true');
    if (params['web']) this.serviceForm.get('web')?.setValue(params['web'] === 'true');
    if (params['pages']) this.webForm.get('pages')?.setValue(parseInt(params['pages'], 10));
    if (params['languages']) this.webForm.get('languages')?.setValue(parseInt(params['languages'], 10));
    if (params['clientName']) this.serviceForm.get('clientName')?.setValue(params['clientName']);
    if (params['phone']) this.serviceForm.get('phone')?.setValue(params['phone']);
    if (params['email']) this.serviceForm.get('email')?.setValue(params['email']);
  }

  private updateUrl(): void {
    const queryParams: any = {
      seo: this.serviceForm.get('seo')?.value,
      ads: this.serviceForm.get('ads')?.value,
      web: this.serviceForm.get('web')?.value,
      pages: this.webForm.get('pages')?.value,
      languages: this.webForm.get('languages')?.value,
      clientName: this.serviceForm.get('clientName')?.value,
      phone: this.serviceForm.get('phone')?.value,
      email: this.serviceForm.get('email')?.value
    };
  
   
    Object.keys(queryParams).forEach(key => 
      (queryParams[key] === undefined || queryParams[key] === null || queryParams[key] === '') && delete queryParams[key]
    );
  
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  private resetForms(): void {
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
  }

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
      
  
      this.updateUrl();
      
  
      this.submittedBudget = budget;
      

    } else {
      Object.values(this.serviceForm.controls).forEach(control => control.markAsTouched());
      Object.values(this.webForm.controls).forEach(control => control.markAsTouched());
    }
  }
}