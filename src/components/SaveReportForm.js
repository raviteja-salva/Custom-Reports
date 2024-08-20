import React from 'react';
import { Controller } from 'react-hook-form';
import { Card, CardTitle, Form, Input, Button } from './styles/CommonStyles';

const SaveReportForm = ({ control, onSubmit, onPreview }) => (
  <Card>
    <CardTitle>Save Report</CardTitle>
    <Form onSubmit={onSubmit}>
      <Controller
        name="reportName"
        control={control}
        defaultValue=""
        render={({ field }) => <Input {...field} placeholder="Report Name" />}
      />
      <Button type="button" onClick={onPreview}>Preview Report</Button> {/* Add Preview Button */}
      <Button type="submit">Save Report</Button>
    </Form>
  </Card>
);

export default SaveReportForm;

// const SaveReportForm = ({ control, onSubmit }) => (
//   <Card>
//     <CardTitle>Save Report</CardTitle>
//     <Form onSubmit={onSubmit}>
//       <Controller
//         name="reportName"
//         control={control}
//         defaultValue=""
//         render={({ field }) => <Input {...field} placeholder="Report Name" />}
//       />
//       <Button type="submit">Save Report</Button>
//     </Form>
//   </Card>
// );

// export default SaveReportForm;