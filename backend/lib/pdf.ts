import PDFDocument from 'pdfkit';
import { supabase } from './auth';
import { uploadFile } from './storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generar PDF de solicitud
 */
export async function generateRequestPDF(
  requestId: string,
  requestData: any,
  formatName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const pdf = new PDFDocument();
      const chunks: Buffer[] = [];

      pdf.on('data', (chunk) => chunks.push(chunk));
      pdf.on('end', async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);
          
          // Subir a storage
          const fileName = `requests/${requestId}/${uuidv4()}.pdf`;
          const url = await uploadFile(
            'documents',
            fileName,
            pdfBuffer,
            'application/pdf'
          );

          // Guardar referencia en base de datos
          await supabase
            .from('generated_documents')
            .insert({
              request_id: requestId,
              file_url: url,
              document_type: 'pdf',
            });

          resolve(url);
        } catch (error) {
          reject(error);
        }
      });

      pdf.on('error', reject);

      // Encabezado
      pdf
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('Instituto Tecnológico de Puebla', { align: 'center' });

      pdf
        .fontSize(14)
        .font('Helvetica')
        .text(`Formato: ${formatName}`, { align: 'center' });

      pdf.moveDown();
      pdf.fontSize(10).text(`ID Solicitud: ${requestId}`);
      pdf.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`);

      pdf.moveDown();
      pdf.fontSize(12).font('Helvetica-Bold').text('Datos Capturados');
      pdf.fontSize(10).font('Helvetica');

      // Renderizar datos dinámicamente
      renderDataToPDF(pdf, requestData);

      pdf.moveDown();
      pdf.fontSize(8).text('Este documento fue generado automáticamente por el Sistema de Gestión de Trámites', {
        align: 'center',
      });

      pdf.end();
    } catch (error) {
      reject(error);
    }
  });
}

function renderDataToPDF(pdf: any, data: any, depth = 0) {
  const indent = '  '.repeat(depth);

  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      data.forEach((item, index) => {
        pdf.text(`${indent}[${index}]`);
        renderDataToPDF(pdf, item, depth + 1);
      });
    } else {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          pdf.text(`${indent}${key}:`);
          renderDataToPDF(pdf, value, depth + 1);
        } else {
          pdf.text(`${indent}${key}: ${value}`);
        }
      });
    }
  } else {
    pdf.text(`${indent}${data}`);
  }
}

/**
 * Obtener documentos generados de una solicitud
 */
export async function getGeneratedDocuments(requestId: string) {
  const { data, error } = await supabase
    .from('generated_documents')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
