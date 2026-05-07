const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join('c:', 'Users', 'adxNi', 'OneDrive', 'Desktop', 'Plavet', 'src', 'features', 'evaluaciones', 'components', 'Plantilla_Evaluacion_Completa_V2.xlsx');

try {
    const workbook = XLSX.readFile(filePath);
    console.log('--- HOJAS ENCONTRADAS ---', workbook.SheetNames);
    
    workbook.SheetNames.forEach(name => {
        console.log(`\n--- CONTENIDO DE LA HOJA: ${name} ---`);
        const sheet = workbook.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        rows.slice(0, 20).forEach((row, i) => {
            if (row && row.length > 0) {
                console.log(`Fila ${i + 1}:`, row.map(c => String(c ?? '').substring(0, 25)));
            }
        });
    });
} catch (e) {
    console.error('Error reading Excel:', e.message);
}
