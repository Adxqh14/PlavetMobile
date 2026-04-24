import { GetRoleConfigUseCase } from '../services/excusasConfig';

export const useExcusasConfig = (role: 'ADMINISTRADOR' | 'TUTOR EMPRESARIAL' | 'ESTUDIANTE') => {
  const useCase = new GetRoleConfigUseCase();
  const { roles_config } = useCase.execute();
  
  return roles_config[role];
};