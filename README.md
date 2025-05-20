# ReqExcelFrontend

# req-excel-frontend

Frontend en Angular para la importación y visualización de datos desde archivos Excel, diseñado para integrarse con una API Laravel. Este proyecto permite cargar registros de profesionales de la salud (u otros usuarios) junto con sus horarios de atención.

## 🧩 Tecnologías

- [Angular 17+](https://angular.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind](https://tailwindcss.com)
- Integración con backend Laravel (`/import` endpoint)

## 🚀 Funcionalidades

- Carga y previsualización de archivos `.xlsx` (Excel)
- Mapeo de columnas como: `Nombre`, `RUT`, `Especialidad`, `Horario de Atención`, `Valor Consulta`
- Envío de datos al backend vía HTTP POST
- Validación básica del contenido antes del envío

## 📦 Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/naatox/req-excel-frontend.git
cd req-excel-frontend
```
2. **Instala Dependencias**

```bash
npm install
```

3. **Iniciael servidor**

```bash
ng serve
```
