import React from "react";
import PropTypes from "prop-types";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ReusableForm(props) {
  return (
    <React.Fragment>
      <Row>
        <Col />
        <Col>
          <Card>
            <Card.Header><h1>Ticket Submission Form:</h1></Card.Header>
            <Card.Body>
              <Form onSubmit={props.formSubmissionHandler}>
                <Form.Group>
                  <Form.Control type='text' name='names' placeholder='Student Name(s)' />
                  <Form.Control type='text' name='location' placeholder='Location' />
                  <Form.Control type='textarea' name='issue' placeholder='Describe your issue.' />
                  <Button type='submit'>{props.buttonText}</Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col />
      </Row>
    </React.Fragment>
  );
}

ReusableForm.propTypes = {
  formSubmissionHandler: PropTypes.func,
  buttonText: PropTypes.string
};

export default ReusableForm;