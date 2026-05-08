import type { Vinculador } from './index';

export const initialVinculadorData: Vinculador[] = [
  {
    id: 'V-001',
    nombre: 'Juan',
    apellido: 'Pérez',
    cedula: '001-1234567-8',
    email: 'juan.perez@centro1.edu',
    telefono: '809-555-0101',
    estado: 'activo',
    fecha_creacion: '2023-01-15',
  },
  {
    id: 'V-002',
    nombre: 'María',
    apellido: 'González',
    cedula: '001-8765432-1',
    email: 'maria.gonzalez@centro2.edu',
    telefono: '829-555-0102',
    estado: 'activo',
    fecha_creacion: '2023-02-20',
  },
  {
    id: 'V-003',
    nombre: 'Roberto',
    apellido: 'Martínez',
    cedula: '402-2345678-9',
    email: 'roberto.martinez@centro3.edu',
    telefono: '849-555-0103',
    estado: 'inactivo',
    fecha_creacion: '2023-03-10',
    deleted_at: '2024-02-15'
  },
  {
    id: 'V-004',
    nombre: 'Ana',
    apellido: 'López',
    cedula: '001-9999999-9',
    email: 'ana.lopez@centro1.edu',
    telefono: '809-555-0104',
    estado: 'inactivo',
    fecha_creacion: '2023-04-05',
  },
  {
    id: 'V-005',
    nombre: 'Luis',
    apellido: 'Hernández',
    cedula: '031-1111111-1',
    email: 'luis.hernandez@centro2.edu',
    telefono: '829-555-0105',
    estado: 'activo',
    fecha_creacion: '2023-05-12',
  }
];
