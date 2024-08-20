<!-- import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { generateRandomData, recruitmentFields } from './utils/dataUtils';
import { GlobalStyle, Container, Title } from './styles/GlobalStyles';
import FieldSelector from './FieldSelector';
import FilterForm from './FilterForm';
import ChartPreviewSection from './ChartPreviewSection';
import SaveReportForm from './SaveReportForm';
import ScheduleReportForm from './ScheduleReportForm';
import SavedReportsList from './SavedReportsList';

const ReportBuilder = () => {
  const [selectedFields, setSelectedFields] = useState([]);
  const [filters, setFilters] = useState({});
  const [chartType, setChartType] = useState('bar');
  const [previewData, setPreviewData] = useState(null);
  const [savedReports, setSavedReports] = useState([]);
  const [randomData, setRandomData] = useState([]);

  const { control, handleSubmit } = useForm();

  useEffect(() => {
    setRandomData(generateRandomData(100));
    const loadedReports = JSON.parse(localStorage.getItem('savedReports') || '[]');
    setSavedReports(loadedReports);
  }, []);

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
    const updatedReports = [...savedReports, reportConfig];
    setSavedReports(updatedReports);
    localStorage.setItem('savedReports', JSON.stringify(updatedReports));
  };

  const handleScheduleReport = (data) => {
    // Implement scheduling logic here
    console.log('Scheduling report:', data);
  };

  const handleExport = (format) => {
    // Implement export logic here
    console.log('Exporting to', format);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Custom Recruitment Report Builder</Title>
        <FieldSelector
          fields={recruitmentFields}
          onFieldSelection={handleFieldSelection}
        />
        <FilterForm
          control={control}
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
        />
        <ScheduleReportForm
          control={control}
          onSubmit={handleSubmit(handleScheduleReport)}
        />
        <SavedReportsList
          savedReports={savedReports}
          onExport={handleExport}
        />
      </Container>
    </>
  );
};

export default ReportBuilder;

import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ChartPreview = ({ data, type }) => {
  if (!data || data.length === 0) return <div>No data to display</div>;

  const prepareData = () => {
    switch (type) {
      case 'bar':
      case 'line':
        // Group by job title and count
        const jobTitleCounts = data.reduce((acc, curr) => {
          acc[curr.jobTitle] = (acc[curr.jobTitle] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(jobTitleCounts).map(([name, value]) => ({ name, value }));
      case 'pie':
        // Group by experience ranges
        const experienceRanges = {
          '0-5 years': 0,
          '6-10 years': 0,
          '11-15 years': 0,
          '16+ years': 0
        };
        data.forEach(item => {
          if (item.experience <= 5) experienceRanges['0-5 years']++;
          else if (item.experience <= 10) experienceRanges['6-10 years']++;
          else if (item.experience <= 15) experienceRanges['11-15 years']++;
          else experienceRanges['16+ years']++;
        });
        return Object.entries(experienceRanges).map(([name, value]) => ({ name, value }));
      default:
        return data;
    }
  };

  const chartData = prepareData();

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default ChartPreview;

import React from 'react';
import { Card, CardTitle, ButtonGroup, Button } from './styles/CommonStyles';
import ChartPreview from './ChartPreview';

const ChartPreviewSection = ({ previewData, chartType, onChartTypeChange }) => (
  <Card>
    <CardTitle>Chart Preview</CardTitle>
    <ChartPreview data={previewData} type={chartType} />
    <ButtonGroup>
      <Button onClick={() => onChartTypeChange('bar')}>Bar Chart</Button>
      <Button onClick={() => onChartTypeChange('line')}>Line Graph</Button>
      <Button onClick={() => onChartTypeChange('pie')}>Pie Chart</Button>
    </ButtonGroup>
  </Card>
);

export default ChartPreviewSection;

import React from 'react';
import styled from 'styled-components';
import { Card, CardTitle } from './styles/CommonStyles';

const FieldGroup = styled.div`
  margin-bottom: 20px;
`;

const FieldGroupTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const FieldList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FieldItem = styled.li`
  margin-bottom: 5px;
`;

const FieldCheckbox = styled.input`
  margin-right: 10px;
`;

const FieldLabel = styled.label`
  font-size: 14px;
  color: #444;
`;

const FieldSelector = ({ fields, onFieldSelection }) => (
    <Card>
      <CardTitle>Select Fields</CardTitle>
      {Object.entries(fields).map(([groupName, groupFields]) => (
        <FieldGroup key={groupName}>
          <FieldGroupTitle>{groupName}</FieldGroupTitle>
          <FieldList>
            {groupFields.map((field) => (
              <FieldItem key={field}>
                <FieldCheckbox
                  type="checkbox"
                  id={field}
                  onChange={(e) => onFieldSelection(field, e.target.checked)}
                />
                <FieldLabel htmlFor={field}>{field}</FieldLabel>
              </FieldItem>
            ))}
          </FieldList>
        </FieldGroup>
      ))}
    </Card>
);

export default FieldSelector;

import React from 'react';
import { Controller } from 'react-hook-form';
import styled from 'styled-components';
import { Card, CardTitle, Form, Input, Button } from './styles/CommonStyles';

const FilterGroup = styled.div`
  margin-bottom: 20px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const FilterForm = ({ control, onSubmit }) => (
  <Card>
    <CardTitle>Apply Filters</CardTitle>
    <Form onSubmit={onSubmit}>
      <FilterGroup>
        <FilterLabel>Application Date Range</FilterLabel>
        <Controller
          name="applicationDateStart"
          control={control}
          defaultValue=""
          render={({ field }) => <Input {...field} type="date" />}
        />
        <Controller
          name="applicationDateEnd"
          control={control}
          defaultValue=""
          render={({ field }) => <Input {...field} type="date" />}
        />
      </FilterGroup>
      <FilterGroup>
        <FilterLabel>Current Status</FilterLabel>
        <Controller
          name="currentStatus"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <select {...field}>
              <option value="">All</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
        />
      </FilterGroup>
      <Button type="submit">Apply Filters</Button>
    </Form>
  </Card>
);

export default FilterForm;

import React from 'react';
import styled from 'styled-components';
import { Card, CardTitle, ButtonGroup, Button } from './styles/CommonStyles';

const SavedReportItem = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
`;

const SavedReportName = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SavedReportsList = ({ savedReports, onExport }) => (
  <Card>
    <CardTitle>Saved Reports</CardTitle>
    {savedReports.map((report, index) => (
      <SavedReportItem key={index}>
        <SavedReportName>{report.name}</SavedReportName>
        <ButtonGroup>
          <Button onClick={() => onExport('pdf')}>Export PDF</Button>
          <Button onClick={() => onExport('excel')}>Export Excel</Button>
          <Button onClick={() => onExport('csv')}>Export CSV</Button>
        </ButtonGroup>
      </SavedReportItem>
    ))}
  </Card>
);

export default SavedReportsList;

import React from 'react';
import { Controller } from 'react-hook-form';
import { Card, CardTitle, Form, Input, Button } from './styles/CommonStyles';

const SaveReportForm = ({ control, onSubmit }) => (
  <Card>
    <CardTitle>Save Report</CardTitle>
    <Form onSubmit={onSubmit}>
      <Controller
        name="reportName"
        control={control}
        defaultValue=""
        render={({ field }) => <Input {...field} placeholder="Report Name" />}
      />
      <Button type="submit">Save Report</Button>
    </Form>
  </Card>
);

export default SaveReportForm;

import React from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, CardTitle, Form, Input, Button } from './styles/CommonStyles';

const ScheduleReportForm = ({ control, onSubmit }) => (
  <Card>
    <CardTitle>Schedule Report</CardTitle>
    <Form onSubmit={onSubmit}>
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
);

export default ScheduleReportForm;

// utils/dataUtils.js

import { faker } from '@faker-js/faker';


export const recruitmentFields = {
    'Report Information': [
      'Report Title',
      'Report Date',
      'Reporting Period',
      'Prepared By',
      'Reviewed By',
      'Department/Team',
    ],
    'Candidate Information': [
      'Candidate Name',
      'Candidate ID',
      'Job Title Applied For',
      'Department Applied To',
      'Application Date',
      'Source of Application',
      'Resume/CV',
      'Current Status',
    ],
    'Recruitment Process Details': [
      'Screening Date',
      'Screening Outcome',
      'Interview Dates',
      'Interviewers',
      'Interview Scores/Feedback',
      'Assessment Results',
      'Background Check Status',
      'Offer Date',
      'Offer Acceptance Date',
      'Onboarding Date',
      'Onboarding Status',
    ],
    'Job Requisition Details': [
      'Job Requisition ID',
      'Position Title',
      'Department',
      'Hiring Manager',
      'Date Requisition Created',
      'Requisition Status',
      'Number of Positions',
      'Number of Candidates Screened',
      'Number of Candidates Interviewed',
      'Number of Offers Made',
      'Number of Offers Accepted',
      'Time to Fill',
      'Time to Hire',
    ],
    'Employee Information': [
      'Employee Name',
      'Employee ID',
      'Date of Joining',
      'Current Position',
      'Current Department',
      'Probation Status',
      'Training Completion Status',
      'Performance Evaluation Scores',
      'Retention Rate',
    ],
    'Recruitment Metrics and Analytics': [
      'Total Applications Received',
      'Conversion Rate',
      'Cost per Hire',
      'Source Effectiveness',
      'Diversity Metrics',
      'Attrition Rate',
      'Recruiter Efficiency',
      'Offer Decline Reasons',
    ],
    'Employee Status Information': [
      'Current Employment Status',
      'Last Performance Review Date',
      'Next Scheduled Review Date',
      'Promotion/Transfer History',
      'Training Completed',
      'Pending Certifications',
      'Vacation/Sick Leave Status',
    ],
    'Notes and Comments': [
      'Recruiter Comments',
      'Manager Comments',
      'Additional Notes',
    ],
    'Attachments': [
      'Supporting Documents',
    ],
    'Approval and Sign-off': [
      'Manager Approval',
      'HR Sign-off',
      'Date of Approval',
    ],
  };

export const generateRandomData = (count) => {
  const jobTitles = ['Software Developer', 'UX Designer', 'Product Manager', 'Data Analyst', 'DevOps Engineer'];
  const departments = ['Engineering', 'Design', 'Product', 'Data Science', 'Operations'];
  const applicationSources = ['LinkedIn', 'Company Website', 'Job Board', 'Referral', 'Recruiter'];
  const statuses = ['New', 'In Progress', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected'];
  const requisitionStatuses = ['Open', 'Closed', 'On Hold'];
  const employmentStatuses = ['Active', 'On Probation', 'Terminated', 'Resigned'];

  return Array.from({ length: count }, (_, index) => {
    const applicationDate = faker.date.past();
    const screeningDate = faker.date.between(applicationDate, new Date());
    const interviewDate = faker.date.between(screeningDate, new Date());
    const offerDate = faker.date.between(interviewDate, new Date());
    const offerAcceptanceDate = faker.date.between(offerDate, new Date());
    const onboardingDate = faker.date.future(0.1, offerAcceptanceDate);
    const joinDate = faker.date.future(0.1, onboardingDate);

    const jobTitle = faker.helpers.arrayElement(jobTitles);
    const department = faker.helpers.arrayElement(departments);
    const currentStatus = faker.helpers.arrayElement(statuses);

    return {
      // Report Information
      reportTitle: `Recruitment Report ${faker.number.int(1000)}`,
      reportDate: faker.date.recent(),
      reportingPeriod: faker.helpers.arrayElement(['Weekly', 'Monthly', 'Quarterly']),
      preparedBy: faker.person.fullName(),
      reviewedBy: faker.person.fullName(),
      departmentTeam: department,

      // Candidate Information
      candidateName: faker.person.fullName(),
      candidateId: faker.string.uuid(),
      jobTitleAppliedFor: jobTitle,
      departmentAppliedTo: department,
      applicationDate,
      sourceOfApplication: faker.helpers.arrayElement(applicationSources),
      resumeCV: faker.internet.url(),
      currentStatus,

      // Recruitment Process Details
      screeningDate,
      screeningOutcome: faker.helpers.arrayElement(['Pass', 'Fail']),
      interviewDates: {
        initial: interviewDate,
        technical: faker.date.between(interviewDate, new Date()),
        hr: faker.date.between(interviewDate, new Date()),
      },
      interviewers: [
        { name: faker.person.fullName(), role: 'Hiring Manager' },
        { name: faker.person.fullName(), role: 'Team Lead' },
        { name: faker.person.fullName(), role: 'HR Representative' },
      ],
      interviewScoresFeedback: faker.number.float({ min: 1, max: 10, precision: 0.1 }),
      assessmentResults: faker.helpers.arrayElement(['Excellent', 'Good', 'Average', 'Poor']),
      backgroundCheckStatus: faker.helpers.arrayElement(['Pending', 'Completed', 'Failed']),
      offerDate,
      offerAcceptanceDate,
      onboardingDate,
      onboardingStatus: faker.helpers.arrayElement(['Not Started', 'In Progress', 'Completed']),

      // Job Requisition Details
      jobRequisitionId: faker.string.alphanumeric(8).toUpperCase(),
      positionTitle: jobTitle,
      hiringManager: faker.person.fullName(),
      dateRequisitionCreated: faker.date.past(),
      requisitionStatus: faker.helpers.arrayElement(requisitionStatuses),
      numberOfPositions: faker.number.int({ min: 1, max: 5 }),
      numberOfCandidatesScreened: faker.number.int({ min: 10, max: 100 }),
      numberOfCandidatesInterviewed: faker.number.int({ min: 5, max: 20 }),
      numberOfOffersMade: faker.number.int({ min: 1, max: 5 }),
      numberOfOffersAccepted: faker.number.int({ min: 0, max: 5 }),
      timeToFill: faker.number.int({ min: 30, max: 90 }),
      timeToHire: faker.number.int({ min: 45, max: 120 }),

      // Employee Information
      employeeName: faker.person.fullName(),
      employeeId: faker.string.alphanumeric(6).toUpperCase(),
      dateOfJoining: joinDate,
      currentPosition: jobTitle,
      currentDepartment: department,
      probationStatus: faker.helpers.arrayElement(['On Probation', 'Completed', 'Extended']),
      trainingCompletionStatus: faker.helpers.arrayElement(['Not Started', 'In Progress', 'Completed']),
      performanceEvaluationScores: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
      retentionRate: faker.number.float({ min: 0.5, max: 1, precision: 0.01 }),

      // Recruitment Metrics and Analytics
      totalApplicationsReceived: faker.number.int({ min: 50, max: 500 }),
      conversionRate: faker.number.float({ min: 0.01, max: 0.1, precision: 0.001 }),
      costPerHire: faker.number.float({ min: 1000, max: 10000, precision: 0.01 }),
      sourceEffectiveness: {
        LinkedIn: faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
        'Company Website': faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
        'Job Board': faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
        Referral: faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
        Recruiter: faker.number.float({ min: 0.1, max: 0.5, precision: 0.01 }),
      },
      diversityMetrics: {
        gender: {
          male: faker.number.float({ min: 0.3, max: 0.7, precision: 0.01 }),
          female: faker.number.float({ min: 0.3, max: 0.7, precision: 0.01 }),
          other: faker.number.float({ min: 0, max: 0.1, precision: 0.01 }),
        },
        ethnicity: {
          white: faker.number.float({ min: 0.2, max: 0.6, precision: 0.01 }),
          asian: faker.number.float({ min: 0.1, max: 0.4, precision: 0.01 }),
          hispanic: faker.number.float({ min: 0.1, max: 0.3, precision: 0.01 }),
          black: faker.number.float({ min: 0.1, max: 0.3, precision: 0.01 }),
          other: faker.number.float({ min: 0, max: 0.1, precision: 0.01 }),
        },
      },
      attritionRate: faker.number.float({ min: 0.05, max: 0.2, precision: 0.01 }),
      recruiterEfficiency: faker.number.float({ min: 1, max: 10, precision: 0.1 }),
      offerDeclineReasons: faker.helpers.arrayElement(['Better Offer', 'Salary', 'Location', 'Role Mismatch', 'Personal Reasons']),

      // Employee Status Information
      currentEmploymentStatus: faker.helpers.arrayElement(employmentStatuses),
      lastPerformanceReviewDate: faker.date.past(),
      nextScheduledReviewDate: faker.date.future(),
      promotionTransferHistory: [
        { date: faker.date.past(), type: faker.helpers.arrayElement(['Promotion', 'Transfer']), details: faker.lorem.sentence() },
      ],
      trainingCompleted: [
        { name: 'Onboarding', date: faker.date.past() },
        { name: faker.helpers.arrayElement(['Leadership', 'Technical Skills', 'Soft Skills']), date: faker.date.past() },
      ],
      pendingCertifications: faker.helpers.arrayElement(['Project Management', 'Agile Scrum', 'Cloud Computing', 'None']),
      vacationSickLeaveStatus: {
        vacationDaysUsed: faker.number.int({ min: 0, max: 20 }),
        vacationDaysRemaining: faker.number.int({ min: 0, max: 20 }),
        sickDaysUsed: faker.number.int({ min: 0, max: 10 }),
        sickDaysRemaining: faker.number.int({ min: 0, max: 10 }),
      },

      // Notes and Comments
      recruiterComments: faker.lorem.paragraph(),
      managerComments: faker.lorem.paragraph(),
      additionalNotes: faker.lorem.sentences(2),

      // Attachments
      supportingDocuments: [
        { name: 'Offer Letter', url: faker.internet.url() },
        { name: 'Interview Transcript', url: faker.internet.url() },
      ],

      // Approval and Sign-off
      managerApproval: faker.helpers.arrayElement(['Pending', 'Approved', 'Rejected']),
      hrSignOff: faker.helpers.arrayElement(['Pending', 'Completed']),
      dateOfApproval: faker.date.recent(),
    };
  });
};
 -->
