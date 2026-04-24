import type {
  Plaza,
  CreatePlazaData,
  ApiResponse,
  PlazaQueryParams,
} from "../types";

const API_BASE = "/api/plazas";

function buildQueryString(params: PlazaQueryParams): string {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.estado && params.estado !== "todos")
    searchParams.set("estado", params.estado);
  if (params.taller && params.taller !== "todos")
    searchParams.set("taller", params.taller);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));
  return searchParams.toString();
}

export async function fetchPlazas(
  params: PlazaQueryParams = {}
): Promise<Plaza[]> {
  const qs = buildQueryString(params);
  const res = await fetch(`${API_BASE}${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Error al obtener plazas");
  const json: ApiResponse<Plaza[]> = await res.json();
  return json.data;
}

export async function fetchPlazaById(id: number): Promise<Plaza> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Error al obtener plaza");
  const json: ApiResponse<Plaza> = await res.json();
  return json.data;
}

export async function createPlaza(data: CreatePlazaData): Promise<Plaza> {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear plaza");
  const json: ApiResponse<Plaza> = await res.json();
  return json.data;
}

export async function updatePlazaApi(plaza: Plaza): Promise<Plaza> {
  const res = await fetch(`${API_BASE}/${plaza.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(plaza),
  });
  if (!res.ok) throw new Error("Error al actualizar plaza");
  const json: ApiResponse<Plaza> = await res.json();
  return json.data;
}

export async function deletePlazaApi(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar plaza");
}
