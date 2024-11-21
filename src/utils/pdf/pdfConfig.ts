import { jsPDF } from "jspdf";

export const PDF_CONFIG = {
  margin: 15,
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  headerHeight: 60,
  footerHeight: 20,
  primaryColor: '#F37121', // Military orange
  textColors: {
    primary: '#232323',
    secondary: '#505050',
    tertiary: '#646464'
  }
};

export const setupPDFDocument = () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  pdf.setDrawColor(243, 113, 33); // Military orange
  return pdf;
};

export const getContentWidth = () => {
  return PDF_CONFIG.pageWidth - (PDF_CONFIG.margin * 2);
};