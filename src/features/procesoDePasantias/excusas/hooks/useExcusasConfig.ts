import type { UserRole } from "@/features/auth/types"
import { EXCUSAS_MODULE_CONFIG } from "@/shared/config/rbac"

export function useExcusasConfig(role: UserRole) {
  return EXCUSAS_MODULE_CONFIG[role];
}