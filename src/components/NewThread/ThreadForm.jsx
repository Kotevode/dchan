import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { Form, FormGroup, Label, Button } from 'reactstrap'

let ThreadForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup>
      <Label for="topic">Topic</Label>
      <Field name="topic"
             type="text"
             className="form-control"
             component="input" />
    </FormGroup>
    <FormGroup>
      <Label for="text">Text</Label>
      <Field name="text"
             type="text"
             component="textarea"
             className="form-control"/>
    </FormGroup>
    <Button color="primary">Submit</Button>
  </Form>
)

ThreadForm = reduxForm({
  form: 'thread'
})(ThreadForm)

export default ThreadForm
