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
