import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent {
  @Input() parentForm!: FormGroup;

  increment(controlName: string): void {
    const control = this.parentForm.get(controlName);
    if (control) {
      control.setValue(control.value + 1);
    }
    
  }

  decrement(controlName: string): void {
    const control = this.parentForm.get(controlName);
    if (control && control.value > 1) {
      control.setValue(control.value - 1);
    }
  }
}
