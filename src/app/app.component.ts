import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Workbook } from 'exceljs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { DoctorData, ResponseData } from '../interface/responseData';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule],
})
export class AppComponent {
  title = 'req-excel-frontend';
  selectedFile: File | null = null;
  responseData: DoctorData[] = [];

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
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

      // ✅ Función mejorada: elimina acentos + convierte a camelCase
      const toCamelCase = (text: string): string =>
        text
          .normalize('NFD') // separa letras de acentos
          .replace(/[\u0300-\u036f]/g, '') // quita acentos
          .toLowerCase()
          .split(' ')
          .map((word, index) =>
            index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join('');

      // ✅ Normaliza encabezados
      worksheet.getRow(1).eachCell((cell) => {
        const normalizedHeader = toCamelCase(cell.text.trim());
        headers.push(normalizedHeader);
      });

      // ✅ Procesa las filas
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const rowData: any = {};
        row.eachCell((cell, colNumber) => {
          const key = headers[colNumber - 1];
          let value = cell.value;

          // Manejo especial para horarioDeAtencion
          if (key === 'horarioDeAtencion' && typeof value === 'string') {
            value = value
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
              .join(', ');
          }

          rowData[key] = value;
        });

        jsonData.push(rowData);
      });

      console.log('Datos listos para enviar:', jsonData);

      this.http.post<ResponseData>('http://localhost:8000/api/upload-excel', jsonData).subscribe({
        next: res => {
          console.log('Respuesta del servidor:', res);
          this.responseData = res.total;
          Swal.fire({
            icon: "success",
            title: "Exitoso",
            text: "Archivo cargado exitosamente",
            confirmButtonColor: "#18542c",
          });
        },
        error: err => {
          err.error.message = err.error.message || "Error del servidor";
          console.error('Error al cargar el archivo:', err);
          console.error('Error del servidor:', err.error);
          if(err.status === 500) {
            Swal.fire({
            icon: "error",
            title: "Hubo un error",
            text:'Error interno del servidor',
            confirmButtonColor: "#18542c",
          });
          }else{
            Swal.fire({
            icon: "error",
            title: "Hubo un error",
            text: err.error.message,
            confirmButtonColor: "#18542c",
          });

          }

        }
      });
    };

    reader.readAsArrayBuffer(this.selectedFile);
  }
}
