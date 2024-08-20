import React from 'react';
import { Controller } from 'react-hook-form';
import { Card, CardTitle, Form, Input, Button } from './styles/CommonStyles';

const ShareReportForm = ({ control, onSubmit }) => (
  <Card>
    <CardTitle>Share Report</CardTitle>
    <Form onSubmit={onSubmit}>
      <Controller
        name="recipientEmail"
        control={control}
        defaultValue=""
        rules={{ required: 'Recipient email is required', pattern: /^\S+@\S+$/i }}
        render={({ field, fieldState: { error } }) => (
          <>
            <Input {...field} placeholder="Recipient Email" type="email" />
            {error && <span>{error.message}</span>}
          </>
        )}
      />
      <Controller
        name="message"
        control={control}
        defaultValue=""
        render={({ field }) => <Input {...field} placeholder="Optional Message" />}
      />
      <Button type="submit">Share Report</Button>
    </Form>
  </Card>
);

export default ShareReportForm;