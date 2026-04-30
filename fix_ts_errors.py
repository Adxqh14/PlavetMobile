import sys
import re

def fix_ts_errors():
    # 1. Fix page.tsx for estudiantes
    path_page = r'src\features\gestionAcademica\estudiantes\pages\page.tsx'
    with open(path_page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace("'Dirección'", "'Referencia'")
    content = content.replace("estudiante.direccion", "estudiante.referencia")
    
    with open(path_page, 'w', encoding='utf-8') as f:
        f.write(content)

    # 2. Fix TallerDialogs.tsx
    path_talleres = r'src\features\gestionAcademica\talleres\components\TallerDialogs.tsx'
    with open(path_talleres, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix imports (remove UpdateTallerData which doesn't exist)
    content = content.replace('UpdateTallerData', 'Partial<CreateTallerData>')

    # Add estado to CreateTallerData
    content = content.replace(
        'horas_pasantia: formData.horas_pasantia || 0,',
        'horas_pasantia: formData.horas_pasantia || 0,\n        estado: "Activo",'
    )

    # Fix EditTallerDialogProps
    content = content.replace(
        '''interface EditTallerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateTallerData) => Promise<void>;''',
        '''interface EditTallerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: number, data: Partial<CreateTallerData>) => Promise<void>;'''
    )
    
    # Check why isSubmitting is unused. Did the button replacement fail?
    # Let's forcefully replace the buttons just in case.
    # CreateTallerDialog button:
    # <Button type="submit">Registrar Taller</Button> might have been modified to disabled but let's check
    content = re.sub(r'<Button type="submit"[^>]*>Registrar Taller</Button>', 
                     r'<Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Registrando..." : "Registrar Taller"}</Button>', 
                     content)
    
    # EditTallerDialog button:
    content = re.sub(r'<Button type="submit"[^>]*>Guardar Cambios</Button>', 
                     r'<Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Guardando..." : "Guardar Cambios"}</Button>', 
                     content)

    with open(path_talleres, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == '__main__':
    fix_ts_errors()
    print("Done")
