import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Workbook } from 'exceljs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { DoctorData, ResponseData } from '../interface/responseData';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, RouterOutlet],
})
export class AppComponent {
  title = 'req-excel-frontend';

}
