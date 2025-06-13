import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AvailabilitySlot } from '../../interface/responseData';
import { AvailabilityService} from '../services/availability.service';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent implements OnInit {
  form: FormGroup;
  message?: string;
  days = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];
  s: any;

  constructor(
    private fb: FormBuilder,
    private svc: AvailabilityService
  ) {
    this.form = this.fb.group({
      slots: this.fb.array([])
    });
  }

  get slots(): FormArray {
    return this.form.get('slots') as FormArray;
  }

  ngOnInit() {
    this.svc.getSlots().subscribe(slots => {
      slots.forEach(s => this.addSlot(s));
    });
  }

  addSlot(slot?: AvailabilitySlot) {
    this.slots.push(this.fb.group({
      day:        [slot?.day ?? 0, [Validators.required]],
      start_time:[slot?.start_time ?? '09:00', [Validators.required]],
      end_time:  [slot?.end_time   ?? '17:00', [Validators.required]],
      value:     [slot?.value ?? 0, [Validators.required, Validators.min(0)]],
      eliminate: [false]
    }));
  }

  markForDelete(i: number) {
    const ctrl = this.slots.at(i);
    ctrl.get('eliminate')!.setValue(true);
  }

  submit() {
    if (!this.form.valid) return;
    // Enviar todos, backend ignorará o borrará soft los que eliminen
    const payload: AvailabilitySlot[] = this.slots.value;
    this.svc.saveSlots(payload).subscribe({
      next: res => {
        console.log(payload)
        this.message = res.message;
      },
      error: err => {
        this.message = err.error?.message || 'Error al guardar.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Verifica que los datos sean correctos.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }
}
