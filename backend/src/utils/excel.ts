import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Estructura para datos de venta
interface DatoVenta {
  id: number;
  fecha: string;
  cliente: string;
  producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

/**
 * Genera un reporte de ventas en formato Excel
 * @param ventas - Array con los datos de ventas
 * @param fechaInicio - Fecha de inicio del reporte
 * @param fechaFin - Fecha de fin del reporte
 * @returns Ruta del archivo generado
 */
export const generarReporteVentas = async (
  ventas: DatoVenta[],
  fechaInicio: string,
  fechaFin: string
): Promise<string> => {
  try {
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    
    // Añadir una hoja de trabajo
    const worksheet = workbook.addWorksheet('Reporte de Ventas');
    
    // Definir las columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Producto', key: 'producto', width: 30 },
      { header: 'Cantidad', key: 'cantidad', width: 15 },
      { header: 'Precio Unitario', key: 'precio_unitario', width: 20 },
      { header: 'Subtotal', key: 'subtotal', width: 20 }
    ];
    
    // Estilo para la cabecera
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    
    // Añadir los datos
    ventas.forEach(venta => {
      worksheet.addRow({
        id: venta.id,
        fecha: venta.fecha,
        cliente: venta.cliente,
        producto: venta.producto,
        cantidad: venta.cantidad,
        precio_unitario: venta.precio_unitario,
        subtotal: venta.subtotal
      });
    });
    
    // Calcular total
    const total = ventas.reduce((acc, venta) => acc + venta.subtotal, 0);
    
    // Añadir fila de total
    const filaTotal = worksheet.addRow({
      id: '',
      fecha: '',
      cliente: '',
      producto: 'TOTAL',
      cantidad: '',
      precio_unitario: '',
      subtotal: total
    });
    
    // Estilo para la fila de total
    filaTotal.font = { bold: true };
    filaTotal.getCell('G').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFCC00' }
    };
    
    // Formatear celdas numéricas a moneda
    worksheet.getColumn('F').numFmt = '"$"#,##0.00';
    worksheet.getColumn('G').numFmt = '"$"#,##0.00';
    
    // Añadir título al reporte
    worksheet.insertRow(1, []);
    worksheet.insertRow(1, []);
    worksheet.insertRow(1, [`REPORTE DE VENTAS DEL ${fechaInicio} AL ${fechaFin}`]);
    worksheet.getRow(1).font = { bold: true, size: 16 };
    worksheet.getRow(1).alignment = { horizontal: 'center' };
    worksheet.mergeCells('A1:G1');
    
    // Crear directorio temporal si no existe
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Generar nombre único para el archivo
    const fileName = `reporte_ventas_${uuidv4()}.xlsx`;
    const filePath = path.join(tempDir, fileName);
    
    // Guardar el archivo
    await workbook.xlsx.writeFile(filePath);
    
    return filePath;
  } catch (error) {
    console.error('Error al generar reporte Excel:', error);
    throw new Error('No se pudo generar el reporte Excel');
  }
};

/**
 * Elimina un archivo temporal después de un tiempo
 * @param filePath - Ruta del archivo a eliminar
 * @param delayMs - Tiempo de espera en milisegundos antes de eliminar
 */
export const eliminarArchivoTemporal = (filePath: string, delayMs = 300000): void => {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Archivo temporal eliminado: ${filePath}`);
    }
  }, delayMs);
}; 