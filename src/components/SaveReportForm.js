import React from 'react';
import { Controller } from 'react-hook-form';
import { Card, CardTitle, Form, Input, TextArea, Button } from './styles/CommonStyles';

const SaveReportForm = ({ control, onSubmit }) => (
  <Card>
    <CardTitle>Save Report</CardTitle>
    <Form onSubmit={onSubmit}>
      <Controller
        name="reportName"
        control={control}
        defaultValue=""
        rules={{ required: 'Report name is required' }}
        render={({ field, fieldState: { error } }) => (
          <>
            <Input {...field} placeholder="Report Name" />
            {error && <span>{error.message}</span>}
          </>
        )}
      />
      <Controller
        name="reportDescription"
        control={control}
        defaultValue=""
        render={({ field }) => <TextArea {...field} placeholder="Report Description" />}
      />
      <Button type="submit">Save Report</Button>
    </Form>
  </Card>
);

export default SaveReportForm;