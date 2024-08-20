import React from 'react';
import styled from 'styled-components';
import { Card, CardTitle } from './styles/CommonStyles';

const FieldGroup = styled.div`
  margin-bottom: 20px;
`;

const FieldGroupTitle = styled.h3`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`;

const FieldList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FieldItem = styled.li`
  margin-bottom: 5px;
`;

const FieldCheckbox = styled.input`
  margin-right: 10px;
`;

const FieldLabel = styled.label`
  font-size: 14px;
  color: #444;
`;

const FieldSelector = ({ fields, onFieldSelection }) => (
    <Card>
      <CardTitle>Select Fields</CardTitle>
      {Object.entries(fields).map(([groupName, groupFields]) => (
        <FieldGroup key={groupName}>
          <FieldGroupTitle>{groupName}</FieldGroupTitle>
          <FieldList>
            {groupFields.map((field) => (
              <FieldItem key={field}>
                <FieldCheckbox
                  type="checkbox"
                  id={field}
                  onChange={(e) => onFieldSelection(field, e.target.checked)}
                />
                <FieldLabel htmlFor={field}>{field}</FieldLabel>
              </FieldItem>
            ))}
          </FieldList>
        </FieldGroup>
      ))}
    </Card>
);

export default FieldSelector;








// import React from 'react';
// import styled from 'styled-components';
// import { DataGrid } from '@mui/x-data-grid';
// import { Card, CardTitle } from './styles/CommonStyles';

// const StyledDataGrid = styled(DataGrid)`
//   .MuiDataGrid-root {
//     border: none;
//   }
//   .MuiDataGrid-cell {
//     border-bottom: 1px solid #f0f0f0;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     text-align: center;
//   }
//   .MuiDataGrid-columnHeaders {
//     background-color: #f8f9fa;
//     border-bottom: 2px solid #007bff;
//   }
//   .MuiDataGrid-columnHeader {
//     font-weight: bold;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }
//   .MuiDataGrid-columnHeaderTitle {
//     text-align: center;
//     width: 100%;
//   }
//   .MuiCheckbox-root {
//     padding: 4px;
//   }
//   .MuiDataGrid-columnSeparator {
//     display: none;
//   }
//   .MuiDataGrid-cell:focus,
//   .MuiDataGrid-cell:focus-within {
//     outline: none;
//   }
// `;

// const DataGridCard = styled(Card)`
//   padding: 0;
//   overflow: hidden;
// `;

// const availableFields = [
//   { field: 'name', headerName: 'Name', width: 150, flex: 1 },
//   { field: 'email', headerName: 'Email', width: 200, flex: 1 },
//   { field: 'jobTitle', headerName: 'Job Title', width: 150, flex: 1 },
//   { field: 'experience', headerName: 'Experience (years)', width: 150, type: 'number', flex: 1 },
//   { field: 'skills', headerName: 'Skills', width: 200, flex: 1 },
// ];

// const FieldSelector = ({ randomData, onFieldSelection }) => (
//   <DataGridCard>
//     <CardTitle>Select Fields</CardTitle>
//     <StyledDataGrid
//       rows={randomData}
//       columns={availableFields}
//       pageSize={10}
//       rowsPerPageOptions={[5, 10, 20]}
//       checkboxSelection
//       onSelectionModelChange={onFieldSelection}
//       autoHeight
//     />
//   </DataGridCard>
// );

// export default FieldSelector;