import React from 'react';
import { Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Card, CardTitle, Form, Input, Select, Button } from './styles/CommonStyles';

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
        name="scheduleFrequency"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select {...field}>
            <option value="">Select Frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
        )}
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
            placeholderText="Schedule Start Date and Time"
          />
        )}
      />
      <Button type="submit">Schedule Report</Button>
    </Form>
  </Card>
);

export default ScheduleReportForm;