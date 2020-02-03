import React from "react";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput
} from "@patternfly/react-core";
import { UserIcon, EnvelopeIcon } from "@patternfly/react-icons";

const ResidencyUser = ({ values, onChange }) => {
  return (
    <Form isHorizontal>
      <FormGroup
        fieldId="residency_user"
        helperText="A Residency User"
        isRequired
        label="Labs Residency User"
      >
        <InputGroup>
          <InputGroupText component="label" htmlFor="residency-user">
            <UserIcon />
          </InputGroupText>
          <TextInput
            aria-label="User's first name"
            id="first-name"
            name="residency-user-first-name"
            onChange={e => {
              onChange({ type: "residency_first_user_name", payload: e });
            }}
            placeholder="First Name"
            type="text"
            value={values.residency_first_user_name}
          />
          <InputGroupText component="label" htmlFor="residency-user">
            <UserIcon />
          </InputGroupText>
          <TextInput
            aria-label="User's last name"
            id="last-name"
            name="residency-user-last-name"
            onChange={e => {
              onChange({ type: "residency_user_last_name", payload: e });
            }}
            placeholder="Last Name"
            type="text"
            value={values.residency_user_last_name}
          />
          <InputGroupText component="label" htmlFor="residency-user-email">
            <EnvelopeIcon />
          </InputGroupText>
          <TextInput
            aria-label="User's email"
            id="email"
            name="residency-user-email"
            onChange={e =>
              onChange({ type: "residency_user_email", payload: e })
            }
            placeholder="Email Address"
            type="email"
            value={values.residency_user_email}
          />
          <InputGroupText component="label" htmlFor="residency-user-email">
            <EnvelopeIcon />
          </InputGroupText>
          <TextInput
            aria-label="User's role"
            id="role"
            name="residency-user-role"
            onChange={e =>
              onChange({ type: "residency_user_role", payload: e })
            }
            placeholder="Role"
            type="text"
            value={values.residency_user_role}
          />
        </InputGroup>
      </FormGroup>
    </Form>
  );
};

export default ResidencyUser;
