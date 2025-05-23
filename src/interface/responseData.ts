export interface ResponseData {
  message: string;
  pd: string;
  status: string;
  total: DoctorData[];
}

export interface DoctorData {
  nombre: string;
  especialidad: string;
  horarioDeAtencion: string;
  valorConsulta: string;
  rut: string;

}
