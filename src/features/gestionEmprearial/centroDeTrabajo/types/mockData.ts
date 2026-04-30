import type { CentroTrabajo } from "./index";

export const initialData: CentroTrabajo[] = [
  {
    id: "CT-001",
    name: "Centro Administrativo Principal",
    location: "Ciudad de México",
    employees: 156,
    status: "active",
    validated: true,
    createdAt: "15 Ene 2024",
  },
  {
    id: "CT-002",
    name: "Planta de Producción Norte",
    location: "Monterrey, NL",
    employees: 342,
    status: "active",
    validated: true,
    createdAt: "22 Feb 2024",
  },
  {
    id: "CT-003",
    name: "Almacén Regional Centro",
    location: "Querétaro, Qro",
    employees: 89,
    status: "rejected",
    validated: false,
    createdAt: "10 Mar 2024",
  },
  {
    id: "CT-004",
    name: "Oficina Comercial Sur",
    location: "Guadalajara, Jal",
    employees: 67,
    status: "active",
    validated: true,
    createdAt: "05 Abr 2024",
  },
  {
    id: "CT-005",
    name: "Centro de Distribución Oeste",
    location: "Culiacán, Sin",
    employees: 124,
    status: "pending",
    validated: false,
    createdAt: "18 May 2024",
  },
];
