import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

const COLORS = [ '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d' ];

const dummyData = [
  { jobTitle: 'Engineer', experience: 3 },
  { jobTitle: 'Engineer', experience: 7 },
  { jobTitle: 'Manager', experience: 12 },
  { jobTitle: 'Analyst', experience: 5 },
  { jobTitle: 'Analyst', experience: 9 },
  { jobTitle: 'Manager', experience: 16 },
  { jobTitle: 'Engineer', experience: 1 },
  { jobTitle: 'Engineer', experience: 8 },
  { jobTitle: 'Manager', experience: 10 },
];

const ChartPreview = ({ data, type }) => {
  // Use dummyData if data is undefined or empty
  const effectiveData = data && data.length > 0 ? data : dummyData;

  const prepareData = () => {
    switch (type) {
      case 'bar':
      case 'line':
        const jobTitleCounts = effectiveData.reduce((acc, curr) => {
          acc[curr.jobTitle] = (acc[curr.jobTitle] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(jobTitleCounts).map(([name, value]) => ({ name, value }));
      case 'pie':
        const experienceRanges = {
          '0-5 years': 0,
          '6-10 years': 0,
          '11-15 years': 0,
          '16+ years': 0
        };
        effectiveData.forEach(item => {
          if (item.experience <= 5) experienceRanges['0-5 years']++;
          else if (item.experience <= 10) experienceRanges['6-10 years']++;
          else if (item.experience <= 15) experienceRanges['11-15 years']++;
          else experienceRanges['16+ years']++;
        });
        return Object.entries(experienceRanges).map(([name, value]) => ({ name, value }));
      default:
        return effectiveData;
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



