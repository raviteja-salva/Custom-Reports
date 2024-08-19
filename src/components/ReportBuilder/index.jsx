import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { saveReport, scheduleReport, exportToPDF, exportToExcel, exportToCSV } from '../utils/reportUtils';
import ChartPreview from '../ChartPreview';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;


const Title = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h2`
  font-size: 24px;
  color: #444;
  margin-bottom: 20px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #007bff;
  width:200px;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const SavedReportName = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SavedReportItem = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

const StyledDataGrid = styled(DataGrid)`
  .MuiDataGrid-root {
    border: none;
  }

  .MuiDataGrid-cell {
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .MuiDataGrid-columnHeaders {
    background-color: #f8f9fa;
    border-bottom: 2px solid #007bff;
  }

  .MuiDataGrid-columnHeader {
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .MuiDataGrid-columnHeaderTitle {
    text-align: center;
    width: 100%;
  }

  .MuiCheckbox-root {
    padding: 4px;
  }

  .MuiDataGrid-columnSeparator {
    display: none;
  }

  .MuiDataGrid-cell:focus,
  .MuiDataGrid-cell:focus-within {
    outline: none;
  }
`;

const DataGridCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const generateRandomData = (count) => {
    const jobTitles = ['Developer', 'Designer', 'Manager', 'Analyst', 'Tester'];
    const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'UI/UX', 'Agile', 'SQL', 'Java', 'C#'];
  
    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `Employee ${index + 1}`,
      email: `employee${index + 1}@example.com`,
      jobTitle: jobTitles[Math.floor(Math.random() * jobTitles.length)],
      experience: Math.floor(Math.random() * 20) + 1,
      skills: Array.from(
        { length: Math.floor(Math.random() * 3) + 1 },
        () => skills[Math.floor(Math.random() * skills.length)]
      ).join(', ')
    }));
  };

const ReportBuilder = () => {
    const [selectedFields, setSelectedFields] = useState([]);
    const [filters, setFilters] = useState({});
    const [chartType, setChartType] = useState('bar');
    const [previewData, setPreviewData] = useState(null);
    const [savedReports, setSavedReports] = useState([]);
    const [randomData, setRandomData] = useState([]);
  
    const { control, handleSubmit } = useForm();

    useEffect(() => {
        // Generate random data when the component mounts
        setRandomData(generateRandomData(100));
        
        // Load saved reports from localStorage
        const loadedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
        setSavedReports(loadedReports);
      }, []);

      const availableFields = [
        { field: 'name', headerName: 'Name', width: 150, flex: 1 },
        { field: 'email', headerName: 'Email', width: 200, flex: 1 },
        { field: 'jobTitle', headerName: 'Job Title', width: 150, flex: 1 },
        { field: 'experience', headerName: 'Experience (years)', width: 150, type: 'number', flex: 1 },
        { field: 'skills', headerName: 'Skills', width: 200, flex: 1 },
      ];

      const handleFieldSelection = (params) => {
        setSelectedFields(params);
      };


  const applyFilters = (data) => {
    setFilters(data);
    const filteredData = randomData.filter(item => {
      if (data.experienceMin && item.experience < parseInt(data.experienceMin)) return false;
      if (data.experienceMax && item.experience > parseInt(data.experienceMax)) return false;
      if (data.skills && !data.skills.split(',').some(skill => item.skills.includes(skill.trim()))) return false;
      return true;
    });
    setPreviewData(filteredData);
  };

  const handleSaveReport = (data) => {
    const reportConfig = {
      name: data.reportName,
      fields: selectedFields,
      filters,
      chartType,
    };
    saveReport(reportConfig);
    setSavedReports([...savedReports, reportConfig]);
  };

  const handleScheduleReport = (data) => {
    scheduleReport(data.reportName, data.scheduleDate);
  };
  

  const handleExport = (format) => {
    switch (format) {
      case 'pdf':
        exportToPDF(previewData, 'Custom Report');
        break;
      case 'excel':
        exportToExcel(previewData, 'Custom Report');
        break;
      case 'csv':
        exportToCSV(previewData, 'Custom Report');
        break;
      default:
        console.error('Unsupported export format');
    }
  };


  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Custom Report Builder</Title>
        <DataGridCard>
            <CardTitle>Select Fields</CardTitle>
            <StyledDataGrid
                rows={randomData}
                columns={availableFields}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                onSelectionModelChange={handleFieldSelection}
                autoHeight
            />
        </DataGridCard>
        <Card>
          <CardTitle>Apply Filters</CardTitle>
          <Form onSubmit={handleSubmit(applyFilters)}>
            <Controller
              name="experienceMin"
              control={control}
              defaultValue=""
              render={({ field }) => <Input {...field} type="number" placeholder="Min Experience" />}
            />
            <Controller
              name="experienceMax"
              control={control}
              defaultValue=""
              render={({ field }) => <Input {...field} type="number" placeholder="Max Experience" />}
            />
            <Controller
              name="skills"
              control={control}
              defaultValue=""
              render={({ field }) => <Input {...field} placeholder="Skills (comma-separated)" />}
            />
            <Button type="submit">Apply Filters</Button>
          </Form>
        </Card>
        <Card>
          <CardTitle>Chart Preview</CardTitle>
          <ChartPreview data={previewData} type={chartType} />
          <ButtonGroup>
            <Button onClick={() => setChartType('bar')}>Bar Chart</Button>
            <Button onClick={() => setChartType('line')}>Line Graph</Button>
            <Button onClick={() => setChartType('pie')}>Pie Chart</Button>
          </ButtonGroup>
        </Card>
        <Card>
          <CardTitle>Save Report</CardTitle>
          <Form onSubmit={handleSubmit(handleSaveReport)}>
            <Controller
              name="reportName"
              control={control}
              defaultValue=""
              render={({ field }) => <Input {...field} placeholder="Report Name" />}
            />
            <Button type="submit">Save Report</Button>
          </Form>
        </Card>
        <Card>
          <CardTitle>Schedule Report</CardTitle>
          <Form onSubmit={handleSubmit(handleScheduleReport)}>
            <Controller
              name="reportName"
              control={control}
              defaultValue=""
              render={({ field }) => <Input {...field} placeholder="Report Name" />}
            />
            <Controller
              name="scheduleDate"
              control={control}
              defaultValue={null}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  customInput={<Input />}
                  placeholderText="Schedule Date and Time"
                />
              )}
            />
            <Button type="submit">Schedule Report</Button>
          </Form>
        </Card>
        <Card>
          <CardTitle>Saved Reports</CardTitle>
          {savedReports.map((report, index) => (
            <SavedReportItem key={index}>
              <SavedReportName>{report.name}</SavedReportName>
              <ButtonGroup>
                <Button onClick={() => handleExport('pdf')}>Export PDF</Button>
                <Button onClick={() => handleExport('excel')}>Export Excel</Button>
                <Button onClick={() => handleExport('csv')}>Export CSV</Button>
              </ButtonGroup>
            </SavedReportItem>
          ))}
        </Card>
      </Container>
    </>
  );
};



export default ReportBuilder;


















// import React, { useState } from 'react';
// import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import { useForm, Controller } from 'react-hook-form';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import ChartPreview from '../ChartPreview';
// import { saveReport, scheduleReport } from '../utils/reportUtils';


// const ReportBuilder = () => {
//   const [selectedFields, setSelectedFields] = useState([]);
//   const [filters, setFilters] = useState({});
//   const [chartType, setChartType] = useState('bar');
//   const [previewData, setPreviewData] = useState(null);

//   const { control, handleSubmit } = useForm();

//   const availableFields = [
//     { id: 'name', field: 'name', headerName: 'Name', width: 150 },
//     { id: 'email', field: 'email', headerName: 'Email', width: 200 },
//     { id: 'jobTitle', field: 'jobTitle', headerName: 'Job Title', width: 150 },
//     { id: 'experience', field: 'experience', headerName: 'Experience (years)', width: 150, type: 'number' },
//     { id: 'skills', field: 'skills', headerName: 'Skills', width: 200 },
//   ];

//   const handleFieldSelection = (params) => {
//     setSelectedFields(params.selectionModel);
//   };

//   const applyFilters = (data) => {
//     setFilters(data);
//     setPreviewData(generateMockData(selectedFields, data));
//   };

//   const handleSaveReport = (data) => {
//     const reportConfig = {
//       name: data.reportName,
//       fields: selectedFields,
//       filters,
//       chartType,
//     };
//     saveReport(reportConfig);
//   };

//   const handleScheduleReport = (data) => {
//     scheduleReport(data.reportName, data.scheduleDate);
//   };

//   return (
//     <Box sx={{ flexGrow: 1, p: 3 }}>
//       <Typography variant="h4" gutterBottom>
//         Custom Report Builder
//       </Typography>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Select Fields
//               </Typography>
//               <DataGrid
//                 rows={availableFields}
//                 columns={availableFields}
//                 pageSize={5}
//                 rowsPerPageOptions={[5]}
//                 checkboxSelection
//                 onSelectionModelChange={handleFieldSelection}
//                 autoHeight
//               />
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Apply Filters
//               </Typography>
//               <form onSubmit={handleSubmit(applyFilters)}>
//                 <Controller
//                   name="experienceMin"
//                   control={control}
//                   defaultValue=""
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Min Experience"
//                       type="number"
//                       fullWidth
//                       margin="normal"
//                     />
//                   )}
//                 />
//                 <Controller
//                   name="experienceMax"
//                   control={control}
//                   defaultValue=""
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Max Experience"
//                       type="number"
//                       fullWidth
//                       margin="normal"
//                     />
//                   )}
//                 />
//                 <Controller
//                   name="skills"
//                   control={control}
//                   defaultValue=""
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Skills (comma-separated)"
//                       fullWidth
//                       margin="normal"
//                     />
//                   )}
//                 />
//                 <Button type="submit" variant="contained" color="primary">
//                   Apply Filters
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Chart Preview
//               </Typography>
//               <ChartPreview data={previewData} type={chartType} />
//               <Button onClick={() => setChartType('bar')} variant="outlined" sx={{ mr: 1 }}>
//                 Bar Chart
//               </Button>
//               <Button onClick={() => setChartType('line')} variant="outlined" sx={{ mr: 1 }}>
//                 Line Graph
//               </Button>
//               <Button onClick={() => setChartType('pie')} variant="outlined">
//                 Pie Chart
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Save Report
//               </Typography>
//               <form onSubmit={handleSubmit(handleSaveReport)}>
//                 <Controller
//                   name="reportName"
//                   control={control}
//                   defaultValue=""
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Report Name"
//                       fullWidth
//                       margin="normal"
//                     />
//                   )}
//                 />
//                 <Button type="submit" variant="contained" color="primary">
//                   Save Report
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Schedule Report
//               </Typography>
//               <form onSubmit={handleSubmit(handleScheduleReport)}>
//                 <Controller
//                   name="reportName"
//                   control={control}
//                   defaultValue=""
//                   render={({ field }) => (
//                     <TextField
//                       {...field}
//                       label="Report Name"
//                       fullWidth
//                       margin="normal"
//                     />
//                   )}
//                 />
//                 <Controller
//                   name="scheduleDate"
//                   control={control}
//                   defaultValue={null}
//                   render={({ field }) => (
//                     <DatePicker
//                       {...field}
//                       selected={field.value}
//                       onChange={(date) => field.onChange(date)}
//                       showTimeSelect
//                       dateFormat="Pp"
//                       customInput={<TextField label="Schedule Date" fullWidth margin="normal" />}
//                     />
//                   )}
//                 />
//                 <Button type="submit" variant="contained" color="primary">
//                   Schedule Report
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default ReportBuilder;

// const generateMockData = (selectedFields, filters) => {
//     const mockData = [
//       { name: 'John Doe', email: 'john@example.com', jobTitle: 'Developer', experience: 5, skills: 'JavaScript, React' },
//       { name: 'Jane Smith', email: 'jane@example.com', jobTitle: 'Designer', experience: 3, skills: 'UI/UX, Figma' },
//       { name: 'Bob Johnson', email: 'bob@example.com', jobTitle: 'Manager', experience: 8, skills: 'Leadership, Agile' },
//     ];
  
//     const filteredData = mockData.filter(item => {
//       if (filters.experienceMin && item.experience < filters.experienceMin) return false;
//       if (filters.experienceMax && item.experience > filters.experienceMax) return false;
//       if (filters.skills && !filters.skills.split(',').some(skill => item.skills.includes(skill.trim()))) return false;
//       return true;
//     });
  
//     const formattedData = filteredData.map(item => {
//       const newItem = {};
//       selectedFields.forEach(field => {
//         newItem[field] = item[field];
//       });
//       return newItem;
//     });
  
//     // Transform the data for chart preview
//     return formattedData.map(item => ({
//       name: item.name || item.email || item.jobTitle,
//       value: item.experience || 1 
//     }));
//   };
