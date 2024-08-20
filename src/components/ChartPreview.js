import React from 'react';
import { Card, CardTitle, ButtonGroup, Button } from './styles/CommonStyles';
import ChartPreview from './ChartPreview';

const ChartPreviewSection = ({ previewData, chartType, onChartTypeChange }) => (
  <Card>
    <CardTitle>Chart Preview</CardTitle>
    <ChartPreview data={previewData} type={chartType} />
    <ButtonGroup>
      <Button onClick={() => onChartTypeChange('bar')} className={chartType === 'bar' ? 'active' : ''}>Bar Chart</Button>
      <Button onClick={() => onChartTypeChange('line')} className={chartType === 'line' ? 'active' : ''}>Line Graph</Button>
      <Button onClick={() => onChartTypeChange('pie')} className={chartType === 'pie' ? 'active' : ''}>Pie Chart</Button>
      <Button onClick={() => onChartTypeChange('scatter')} className={chartType === 'scatter' ? 'active' : ''}>Scatter Plot</Button>
    </ButtonGroup>
  </Card>
);

export default ChartPreviewSection;