import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
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

const API_BASE_URL = 'https://custom-reports-server.onrender.com/api';

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
    fetchReports();
  }, []);

  useEffect(() => {
    const loadedTemplates = JSON.parse(localStorage.getItem('fieldTemplates') || '[]');
    setSavedTemplates(loadedTemplates);
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reports`);
      setSavedReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

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

  const applyFilters = (data) => {
    setFilters(data);
    handlePreviewReport(data);
  };

  const handleSaveReport = async (data) => {
    if (!data.reportName.trim()) {
      alert("Report name cannot be empty.");
      return;
    }

    const isDuplicateName = savedReports.some(report => 
      report.name.toLowerCase() === data.reportName.toLowerCase() && report._id !== editingReport?._id
    );

    if (isDuplicateName) {
      alert("A report with this name already exists. Please choose a unique name.");
      return;
    }

    const reportConfig = {
      name: data.reportName,
      fields: selectedFields,
      filters,
      chartType,
    };

    try {
      if (editingReport) {
        await axios.post(`${API_BASE_URL}/reports`, { ...reportConfig, _id: editingReport._id });
      } else {
        await axios.post(`${API_BASE_URL}/reports`, reportConfig);
      }
      fetchReports();
      setEditingReport(null);
      reset();
    } catch (error) {
      console.error('Error saving report:', error);
      alert('Failed to save report. Please try again.');
    }
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
    setValue("reportName", report.name);
    setSelectedFields(report.fields);
    setFilters(report.filters);
    setChartType(report.chartType);
  };

  const handleDeleteReport = async (reportId) => {
    try {
      await axios.delete(`${API_BASE_URL}/reports/${reportId}`);
      fetchReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report. Please try again.');
    }
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
