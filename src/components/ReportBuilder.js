import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { generateRandomData, recruitmentFields } from './utils/dataUtils';
import { GlobalStyle, Container, Title } from './styles/GlobalStyles';
import FieldSelector from './FieldSelector';
import FilterForm from './FilterForm';
import ChartPreviewSection from './ChartPreviewSection';
import SaveReportForm from './SaveReportForm';
import ScheduleReportForm from './ScheduleReportForm';
import SavedReportsList from './SavedReportsList';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import jsPDF from 'jspdf';

const ReportBuilder = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [filters, setFilters] = useState({});
  const [chartType, setChartType] = useState('bar');
  const [previewData, setPreviewData] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  const [randomData, setRandomData] = useState([]);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [editingReport, setEditingReport] = useState(null);

  const { control, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    setRandomData(generateRandomData(100));
    const loadedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    setSavedReports(loadedReports);
  }, []);

  useEffect(() => {
    const loadedTemplates = JSON.parse(localStorage.getItem('fieldTemplates') || '[]');
    setSavedTemplates(loadedTemplates);
  }, []);
  
  const handleSaveTemplate = (templateName, fields) => {
    const newTemplate = { name: templateName, fields };
    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem('fieldTemplates', JSON.stringify(updatedTemplates));
  };

  const handleSelectTemplate = (templateName) => {
    const template = savedTemplates.find(t => t.name === templateName);
    if (template) {
      setSelectedFields(template.fields);
    }
  };

  const handleFieldSelection = (fields) => {
    setSelectedFields(fields);
  };

  const applyFilters = (data) => {
    setFilters(data);
    handlePreviewReport(data);
  };

  const handleSaveReport = (data) => {
    if (!data.reportName.trim()) {
      alert("Report name cannot be empty.");
      return;
    }

    const isDuplicateName = savedReports.some(report => 
      report.name.toLowerCase() === data.reportName.toLowerCase() && report.id !== editingReport?.id
    );

    if (isDuplicateName) {
      alert("A report with this name already exists. Please choose a unique name.");
      return;
    }

    if (editingReport) {
      const updatedReports = savedReports.map(report =>
        report.id === editingReport.id ? { ...report, name: data.reportName } : report
      );
      setSavedReports(updatedReports);
      setEditingReport(null);
    } else {
      const reportConfig = {
        id: Date.now(),
        name: data.reportName,
        fields: selectedFields,
        filters,
        chartType,
      };
      setSavedReports([...savedReports, reportConfig]);
    }

    localStorage.setItem('savedReports', JSON.stringify(savedReports));
    reset();
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
    setValue("reportName", report.name);
  };

  const handleDeleteReport = (reportId) => {
    const updatedReports = savedReports.filter(report => report.id !== reportId);
    setSavedReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
  };

  const handleScheduleReport = (data) => {
    console.log('Scheduling report:', data);
  };

  const handleExport = (format, report) => {
    const reportData = report ? randomData.filter(item => report.fields.every(field => item[field])) : (previewData || randomData);
    
    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Custom Report', 20, 20);
      reportData.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.candidateName} - ${item.jobTitle}`, 20, 30 + index * 10);
      });
      doc.save('report.pdf');
    } else if (format === 'excel') {
      const ws = utils.json_to_sheet(reportData);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, 'Report');
      const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'report.xlsx');
    } else if (format === 'csv') {
      const csvData = reportData.map(item => `${item.candidateName},${item.jobTitle}`).join('\n');
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'report.csv');
    }
  };

  const handlePreviewReport = (currentFilters = filters) => {
    const filteredData = randomData.filter(item => {
      for (const [key, value] of Object.entries(currentFilters)) {
        if (value && item[key] !== undefined) {
          if (typeof value === 'string' && !item[key].toLowerCase().includes(value.toLowerCase())) {
            return false;
          } else if (typeof value === 'number' && item[key] !== value) {
            return false;
          }
        }
      }
      return true;
    });
    
    const previewDataWithSelectedFields = filteredData.map(item => {
      const selectedData = {};
      selectedFields.forEach(field => {
        selectedData[field] = item[field];
      });
      return selectedData;
    });
    
    setPreviewData(previewDataWithSelectedFields);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Custom Reports</Title>
        <FieldSelector
          fields={recruitmentFields}
          selectedFields={selectedFields}
          onFieldSelection={setSelectedFields}
          savedTemplates={savedTemplates}
          onSaveTemplate={handleSaveTemplate}
          onSelectTemplate={handleSelectTemplate}
        />
        <FilterForm
          control={control}
          filters={filters}
          onSubmit={handleSubmit(applyFilters)}
        />
        <ChartPreviewSection
          previewData={previewData}
          chartType={chartType}
          onChartTypeChange={setChartType}
        />
        <SaveReportForm
          control={control}
          onSubmit={handleSubmit(handleSaveReport)}
          onPreview={handlePreviewReport}
          editingReport={editingReport}
        />
        <ScheduleReportForm
          control={control}
          onSubmit={handleSubmit(handleScheduleReport)}
        />
        <SavedReportsList
          savedReports={savedReports}
          onExport={handleExport}
          onDelete={handleDeleteReport}
          onEdit={handleEditReport}
        />
      </Container>
    </>
  );
};

export default ReportBuilder;












// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { generateRandomData, recruitmentFields } from './utils/dataUtils';
// import { GlobalStyle, Container, Title } from './styles/GlobalStyles';
// import FieldSelector from './FieldSelector';
// import FilterForm from './FilterForm';
// import ChartPreviewSection from './ChartPreviewSection';
// import SaveReportForm from './SaveReportForm';
// import ScheduleReportForm from './ScheduleReportForm';
// import SavedReportsList from './SavedReportsList';
// import { saveAs } from 'file-saver';
// import { utils, write } from 'xlsx';
// import jsPDF from 'jspdf';

// const ReportBuilder = () => {
//   const [selectedFields, setSelectedFields] = useState([]);
//   const [filters, setFilters] = useState({});
//   const [chartType, setChartType] = useState('bar');
//   const [previewData, setPreviewData] = useState(null);
//   const [savedReports, setSavedReports] = useState([]);
//   const [randomData, setRandomData] = useState([]);
//   const [savedTemplates, setSavedTemplates] = useState([]);

//   const { control, handleSubmit, reset } = useForm();

//   useEffect(() => {
//     setRandomData(generateRandomData(100));
//     const loadedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
//     setSavedReports(loadedReports);
//   }, []);

//   useEffect(() => {
//     const loadedTemplates = JSON.parse(localStorage.getItem('fieldTemplates') || '[]');
//     setSavedTemplates(loadedTemplates);
//   }, []);
  
//   const handleSaveTemplate = (templateName, fields) => {
//     const newTemplate = { name: templateName, fields };
//     const updatedTemplates = [...savedTemplates, newTemplate];
//     setSavedTemplates(updatedTemplates);
//     localStorage.setItem('fieldTemplates', JSON.stringify(updatedTemplates));
//   };

//   const handleSelectTemplate = (templateName) => {
//     const template = savedTemplates.find(t => t.name === templateName);
//     if (template) {
//       setSelectedFields(template.fields);
//     }
//   };

//   const handleFieldSelection = (fields) => {
//     setSelectedFields(fields);
//   };

//   const applyFilters = (data) => {
//     setFilters(data);
//     handlePreviewReport(data);
//   };

//   const handleSaveReport = (data) => {
//     const reportConfig = {
//       id: Date.now(),
//       name: data.reportName,
//       fields: selectedFields,
//       filters,
//       chartType,
//     };
    
//     const updatedReports = [...savedReports, reportConfig];
    
//     setSavedReports(updatedReports);
//     localStorage.setItem('savedReports', JSON.stringify(updatedReports));
//     reset();
//   };
  

//   const handleDeleteReport = (reportId) => {
//     const updatedReports = savedReports.filter(report => report.id !== reportId);
//     setSavedReports(updatedReports);
//     localStorage.setItem('savedReports', JSON.stringify(updatedReports));
//   };

//   const handleScheduleReport = (data) => {
//     console.log('Scheduling report:', data);
//   };

//   const handleExport = (format) => {
//     const reportData = previewData || randomData;
    
//     if (format === 'pdf') {
//       const doc = new jsPDF();
//       doc.text('Custom Report', 20, 20);
//       reportData.forEach((item, index) => {
//         doc.text(`${index + 1}. ${item.candidateName} - ${item.jobTitle}`, 20, 30 + index * 10);
//       });
//       doc.save('report.pdf');
//     } else if (format === 'excel') {
//       const ws = utils.json_to_sheet(reportData);
//       const wb = utils.book_new();
//       utils.book_append_sheet(wb, ws, 'Report');
//       const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
//       saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'report.xlsx');
//     } else if (format === 'csv') {
//       const csvData = reportData.map(item => `${item.candidateName},${item.jobTitle}`).join('\n');
//       const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
//       saveAs(blob, 'report.csv');
//     }
//   };

//   const handlePreviewReport = (currentFilters = filters) => {
//     const filteredData = randomData.filter(item => {
//       for (const [key, value] of Object.entries(currentFilters)) {
//         if (value && item[key] !== undefined) {
//           if (typeof value === 'string' && !item[key].toLowerCase().includes(value.toLowerCase())) {
//             return false;
//           } else if (typeof value === 'number' && item[key] !== value) {
//             return false;
//           }
//         }
//       }
//       return true;
//     });
    
//     const previewDataWithSelectedFields = filteredData.map(item => {
//       const selectedData = {};
//       selectedFields.forEach(field => {
//         selectedData[field] = item[field];
//       });
//       return selectedData;
//     });
    
//     setPreviewData(previewDataWithSelectedFields);
//   };

//   return (
//     <>
//       <GlobalStyle />
//       <Container>
//         <Title>Custom Reports</Title>
//         <FieldSelector
//             fields={recruitmentFields}
//             selectedFields={selectedFields}
//             onFieldSelection={setSelectedFields}
//             savedTemplates={savedTemplates}
//             onSaveTemplate={handleSaveTemplate}
//             onSelectTemplate={handleSelectTemplate}
//         />
//         <FilterForm
//           control={control}
//           filters={filters}
//           onSubmit={handleSubmit(applyFilters)}
//         />
//         <ChartPreviewSection
//           previewData={previewData}
//           chartType={chartType}
//           onChartTypeChange={setChartType}
//         />
//         <SaveReportForm
//           control={control}
//           onSubmit={handleSubmit(handleSaveReport)}
//           onPreview={handlePreviewReport}
//         />
//         <ScheduleReportForm
//           control={control}
//           onSubmit={handleSubmit(handleScheduleReport)}
//         />
//         <SavedReportsList
//           savedReports={savedReports}
//           onExport={handleExport}
//           onDelete={handleDeleteReport}
//         />
//       </Container>
//     </>
//   );
// };

// export default ReportBuilder;

