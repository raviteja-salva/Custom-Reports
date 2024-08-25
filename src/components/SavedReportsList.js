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

const SavedReportsList = ({ savedReports, onExport, onDelete, onEdit }) => (
  <Card>
    <CardTitle>Saved Reports</CardTitle>
    {savedReports.map((report) => (
      <SavedReportItem key={report._id}>
        <SavedReportName>{report.name}</SavedReportName>
        <ButtonGroup>
          <Button onClick={() => onEdit(report)}>Edit</Button>
          <Button onClick={() => onDelete(report._id)}>Delete</Button>
          <Button onClick={() => onExport('pdf', report)}>Export PDF</Button>
          <Button onClick={() => onExport('excel', report)}>Export Excel</Button>
          <Button onClick={() => onExport('csv', report)}>Export CSV</Button>
        </ButtonGroup>
      </SavedReportItem>
    ))}
  </Card>
);

export default SavedReportsList;