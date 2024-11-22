import { jsPDF } from "jspdf";

export const PDF_CONFIG = {
  margin: 15,
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  headerHeight: 80,
  footerHeight: 35,
  bottomMargin: 40, // New bottom margin configuration
  primaryColor: '#F37121', // Military orange
  textColors: {
    primary: '#232323',
    secondary: '#505050',
    tertiary: '#646464'
  },
  logos: {
    left: '/lovable-uploads/63247fb3-8531-4f6b-9dec-a4242ad8caba.png',
    right: '/lovable-uploads/a887ad88-1670-4c06-a496-9fdd635070fa.png'
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