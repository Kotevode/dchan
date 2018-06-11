import React from 'react'
import {
  Form,
  FormGroup,
  Button
} from 'reactstrap'
import { reduxForm, Field } from 'redux-form'

let PostForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <FormGroup>
      <Field name="text"
             component="textarea"
             className="form-control"
             type="text"/>
    </FormGroup>
    <Button color="primary">Send</Button>
  </Form>
)

PostForm = reduxForm({
  form: 'post'
})(PostForm)

export default PostForm
