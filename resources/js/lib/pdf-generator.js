import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from './axios';

/**
 * Centered PDF generator with company branding
 * @param {string} title - Report title
 * @param {Array} columns - Table column headers
 * @param {Array} data - Table data rows
 * @param {string} fileName - Output filename
 */
export const generateBRPDF = async (title, columns, data, fileName) => {
    try {
        // Fetch global settings for branding
        const response = await axios.get('/v1/documents?page_id=2');
        const settings = response.data[0]?.data;

        const companyName = settings?.navbar?.companyName || "Numan Trading Corporation";
        const email = settings?.footer?.email1 || "ntc.flavour@gmail.com";
        const phone = settings?.footer?.phone1 || "+88 01924-714220";
        const address = settings?.footer?.address || "180,181 Prime Tower, Bijoy Nagar, Dhaka-1000";

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Header Function
        const renderHeader = (pdfDoc) => {
            pdfDoc.setTextColor(30, 41, 59); // Dark slate
            pdfDoc.setFontSize(22);
            pdfDoc.setFont("helvetica", "bold");
            pdfDoc.text(companyName, pageWidth / 2, 22, { align: "center" });

            pdfDoc.setTextColor(100, 116, 139); // Slate 500
            pdfDoc.setFontSize(10);
            pdfDoc.setFont("helvetica", "normal");
            pdfDoc.text(address, pageWidth / 2, 30, { align: "center" });
            pdfDoc.text(`Email: ${email} | Mobile: ${phone}`, pageWidth / 2, 36, { align: "center" });

            pdfDoc.setDrawColor(203, 213, 225); // Slate 300
            pdfDoc.setLineWidth(0.5);
            pdfDoc.line(20, 42, pageWidth - 20, 42);

            pdfDoc.setTextColor(15, 23, 42); // Slate 900
            pdfDoc.setFontSize(16);
            pdfDoc.setFont("helvetica", "bold");
            pdfDoc.text(title, pageWidth / 2, 54, { align: "center" });
            
            pdfDoc.setTextColor(100, 116, 139);
            pdfDoc.setFontSize(8);
            pdfDoc.setFont("helvetica", "normal");
            pdfDoc.text(`PDF GENERATED ON: ${format(new Date(), 'PPPP p').toUpperCase()}`, pageWidth / 2, 60, { align: "center" });
            
            pdfDoc.setTextColor(0, 0, 0); // Reset to black
        };

        // Initial Header
        renderHeader(doc);

        autoTable(doc, {
            startY: 72,
            head: [columns],
            body: data,
            theme: 'grid',
            headStyles: {
                fillColor: [15, 23, 42], // Dark Slate 900
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'center',
                cellPadding: 4
            },
            bodyStyles: {
                fontSize: 9,
                textColor: [30, 41, 59],
                cellPadding: 3,
                lineColor: [226, 232, 240] // Slate 200
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            margin: { top: 72 },
            didDrawPage: (data) => {
                if (data.pageNumber > 1) {
                    // Minimal footer on pages
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(`Page ${data.pageNumber}`, pageWidth / 2, pageHeight - 10, { align: "center" });
                }
            }
        });

        doc.save(`${fileName}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        // Fallback to basic pdf if branding fails
        const doc = new jsPDF();
        doc.text(title, 14, 15);
        autoTable(doc, {
            startY: 20,
            head: [columns],
            body: data,
        });
        doc.save(`${fileName}_${format(new Date(), 'yyyyMMdd')}.pdf`);
    }
};
