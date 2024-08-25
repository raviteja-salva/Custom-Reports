import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, CardTitle, Button, PlusButton, StyledSelect, Input } from './styles/CommonStyles';

const FieldGroup = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
`;

const FieldGroupTitle = styled.h3`
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 16px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
`;

const FieldList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const FieldItem = styled.li`
  margin-bottom: 12px;
  display: flex;
  align-items: center;
`;

const FieldCheckbox = styled.input`
  margin-right: 12px;
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const FieldLabel = styled.label`
  font-size: 16px;
  color: #34495e;
  flex-grow: 1;
`;


const FieldSelector = ({ fields, selectedFields, onFieldSelection, savedTemplates, onSaveTemplate, onSelectTemplate }) => {
  const [customFields, setCustomFields] = useState([]);
  const [newFieldName, setNewFieldName] = useState('');
  const [templateName, setTemplateName] = useState('');

  const handleFieldToggle = (field) => {
    const updatedFields = selectedFields.includes(field)
      ? selectedFields.filter(f => f !== field)
      : [...selectedFields, field];
    onFieldSelection(updatedFields);
  };

  const handleAddCustomField = () => {
    if (newFieldName && !customFields.includes(newFieldName)) {
      setCustomFields([...customFields, newFieldName]);
      setNewFieldName('');
      handleFieldToggle(newFieldName);
    }
  };

  const handleSaveTemplate = () => {
    if (templateName) {
      onSaveTemplate(templateName, selectedFields);
      setTemplateName('');
    }
  };

  return (
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
                  checked={selectedFields.includes(field)}
                  onChange={() => handleFieldToggle(field)}
                />
                <FieldLabel>{field}</FieldLabel>
              </FieldItem>
            ))}
          </FieldList>
        </FieldGroup>
      ))}
      <FieldGroup>
        <FieldGroupTitle>Custom Fields</FieldGroupTitle>
        <FieldList>
          {customFields.map((field) => (
            <FieldItem key={field}>
              <FieldCheckbox
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={() => handleFieldToggle(field)}
              />
              <FieldLabel>{field}</FieldLabel>
            </FieldItem>
          ))}
        </FieldList>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            type="text"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Enter new field name"
          />
          <PlusButton onClick={handleAddCustomField}>+</PlusButton>
        </div>
      </FieldGroup>

      <FieldGroup>
        <FieldGroupTitle>Save Template</FieldGroupTitle>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Template Name"
          />
          <Button onClick={handleSaveTemplate}>Save Template</Button>
        </div>
      </FieldGroup>

      <FieldGroup>
        <FieldGroupTitle>Select Template</FieldGroupTitle>
        <StyledSelect onChange={(e) => onSelectTemplate(e.target.value)}>
          <option value="">Select a template</option>
          {savedTemplates.map((template) => (
            <option key={template.name} value={template.name}>
              {template.name}
            </option>
          ))}
        </StyledSelect>
      </FieldGroup>
    </Card>
  );
};

export default FieldSelector;

