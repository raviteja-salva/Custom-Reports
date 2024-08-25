import React from 'react';
import { Controller } from 'react-hook-form';
import { Card, CardTitle, Form, Input, Button } from './styles/CommonStyles';

const SaveReportForm = ({ control, onSubmit, editingReport }) => (
  <Card>
    <CardTitle>{editingReport ? 'Edit Report' : 'Save Report'}</CardTitle>
    <Form onSubmit={onSubmit}>
      <Controller
        name="reportName"
        control={control}
        defaultValue=""
        rules={{ required: "Report name is required" }}
        render={({ field, fieldState: { error } }) => (
          <>
            <Input {...field} placeholder="Report Name" />
            {error && <span style={{ color: 'red' }}>{error.message}</span>}
          </>
        )}
      />
      <Button type="submit">{editingReport ? 'Update Report' : 'Save Report'}</Button>
    </Form>
  </Card>
);

export default SaveReportForm;
