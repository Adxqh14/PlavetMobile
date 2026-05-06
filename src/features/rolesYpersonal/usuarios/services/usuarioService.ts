import { apiClient } from "@/lib/api";
import type { Usuario, UsuarioQueryParams } from "../types";

interface UsersApiResponse {
  users: Usuario[];
}

export async function fetchUsuarios(
  _params: UsuarioQueryParams = {}
): Promise<{ data: Usuario[] }> {
  const response = await apiClient.get<UsersApiResponse>("/api/v1/users");
  return { data: response.users ?? [] };
}

export async function fetchUsuarioById(id: string): Promise<Usuario> {
  const response = await apiClient.get<{ user: Usuario }>(`/api/v1/users/${id}`);
  return response.user;
}

export async function patchUsuarioRol(
  id: string,
  id_rol: string
): Promise<void> {
  await apiClient.patch(`/api/v1/users/${id}/role`, { id_rol });
}

export async function patchUsuarioEstado(
  id: string,
  estado: string
): Promise<void> {
  await apiClient.patch(`/api/v1/users/${id}/estado`, { estado });
}
