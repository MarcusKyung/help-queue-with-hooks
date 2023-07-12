import React from "react";
import PropTypes from "prop-types";
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function TicketDetail(props){
  const { ticket, onClickingDelete, onClickingEdit } = props; 

  return (
    <React.Fragment>
      <Row>
        <Col />
        <Col>
          <Card>
            <Card.Header><h1 style={{ textDecoration: "underline" }}>Ticket Detail</h1></Card.Header>
            <Card.Body>
              <h5>Ticket Name/Location: <em>{ticket.names} - {ticket.location}</em></h5>
              <p>Issue Description: <em>{ticket.issue}</em></p>
              <div className="d-grid gap-2">
                <Button onClick={onClickingEdit} variant="primary" size="lg" block>Update Ticket</Button>
                <Button onClick={() => onClickingDelete(ticket.id)} variant="danger" size="lg" block>Close Ticket</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col />
      </Row>
    </React.Fragment>
  );
}

TicketDetail.propTypes = {
  ticket: PropTypes.object,
  onClickingDelete: PropTypes.func,
  onClickingEdit: PropTypes.func 
};

export default TicketDetail;