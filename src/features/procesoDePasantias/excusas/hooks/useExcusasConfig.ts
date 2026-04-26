import { GetRoleConfigUseCase } from '../services/excusasConfig';

export type ExcusaRole = 'ADMINISTRADOR' | 'TUTOR EMPRESARIAL' | 'ESTUDIANTE' | 'TUTOR ACADEMICO' | 'SUPERVISOR' | 'VINCULADOR';

export const useExcusasConfig = (role: ExcusaRole) => {
  const useCase = new GetRoleConfigUseCase();
  const { roles_config } = useCase.execute();
  
  return roles_config[role];
};