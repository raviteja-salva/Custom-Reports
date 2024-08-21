import React from 'react';
import { Controller } from 'react-hook-form';
import styled from 'styled-components';
import { Card, CardTitle, Form, Input, Button, StyledSelect } from './styles/CommonStyles';

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
            <StyledSelect {...field}>
              <option value="">All</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </StyledSelect>
          )}
        />
      </FilterGroup>
      <Button type="submit">Apply Filters</Button>
    </Form>
  </Card>
);

export default FilterForm;