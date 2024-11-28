import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function exportCharts(format: 'pdf' | 'png' = 'pdf') {
  const charts = document.querySelectorAll('.chart-container');
  if (!charts.length) return;

  if (format === 'png') {
    // For PNG, we'll export the first chart only
    const canvas = await html2canvas(charts[0] as HTMLElement, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    
    const link = document.createElement('a');
    link.download = 'productivity-charts.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  } else {
    // For PDF, we'll export all charts
    const pdf = new jsPDF('p', 'mm', 'a4');
    let isFirstPage = true;

    for (const chart of charts) {
      const canvas = await html2canvas(chart as HTMLElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      if (!isFirstPage) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      isFirstPage = false;
    }

    pdf.save('productivity-charts.pdf');
  }
}