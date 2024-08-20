import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';
import * as XLSX from 'xlsx';

export const saveReport = (reportConfig) => {
  // In a real application, you would save this to a backend database
  console.log('Saving report:', reportConfig);
  // For now, we'll just save it to localStorage
  const savedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
  savedReports.push(reportConfig);
  localStorage.setItem('savedReports', JSON.stringify(savedReports));
};

export const scheduleReport = (reportName, scheduleDate) => {
  // In a real application, you would set up a backend job to run the report at the specified time
  console.log(`Scheduling report "${reportName}" for ${scheduleDate}`);
};

export const exportToPDF = (reportData, reportName) => {
  const MyDocument = () => (
    <Document>
      <Page>
        <Text>{reportName}</Text>
        {/* Add more complex PDF structure here based on your report data */}
      </Page>
    </Document>
  );

  return (
    <PDFDownloadLink document={<MyDocument />} fileName={`${reportName}.pdf`}>
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download PDF'
      }
    </PDFDownloadLink>
  );
};

export const exportToExcel = (reportData, reportName) => {
  const worksheet = XLSX.utils.json_to_sheet(reportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
  XLSX.writeFile(workbook, `${reportName}.xlsx`);
};

export const exportToCSV = (reportData, reportName) => {
  const worksheet = XLSX.utils.json_to_sheet(reportData);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
