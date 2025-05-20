import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Workbook } from 'exceljs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'req-excel-frontend';
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {9
      this.selectedFile = input.files[0];
    }
  }

  async uploadFile(): Promise<void> {
    if (!this.selectedFile) return;

    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const buffer = e.target.result;
      const workbook = new Workbook();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      const jsonData: any[] = [];

      const headers: string[] = [];

      worksheet.getRow(1).eachCell((cell) => {
        headers.push(cell.text.trim());
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // saltar encabezado

        const rowData: any = {};

        row.eachCell((cell, colNumber) => {
          const key = headers[colNumber - 1];
          let value = cell.value;

          if (key === 'Horario de Atención' && typeof value === 'string') {
            value = value
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
              .join(',');
          }

          rowData[key] = value;
        });

        jsonData.push(rowData);
      });

      console.log('Datos listos para enviar:', jsonData);

      this.http.post('http://localhost:8000/api/upload-excel', jsonData).subscribe({
        next: res => {
          console.log('Respuesta del servidor:', res);
          Swal.fire({
            icon: "success",
            title: "Exitoso",
            text: "Archivo cargado exitosamente",});
        },
        error: err => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.error.message,
          });
        }
      });
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }
}
