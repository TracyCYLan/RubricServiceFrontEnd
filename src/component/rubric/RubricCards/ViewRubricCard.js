import React, { Component } from 'react'
import { Row, Col, Form, Card } from 'react-bootstrap';
class ViewRubricCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            description: props.description,
            publishDate: props.publishDate
        }
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        //pass the attribute name,attribute updated value, rating index to edit
        this.state.edit(e.target.name, e.target.value, this.state.index);
    }


    render() {
        return (
            <Card>
                <Card.Body>
                    <Form>
                        <Form.Group as={Row} controlId="formGridName">
                            <Col md={2}>
                                <Form.Label>Name</Form.Label>
                            </Col>
                            <Col md={10}>
                                <Form.Label className="text-primary">{this.state.name}</Form.Label>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridDescription">
                            <Col md={2}>
                                <Form.Label>Description</Form.Label>
                            </Col>
                            <Col md={10}>
                                <Form.Label className="text-primary">{this.state.description}</Form.Label>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridDate">
                            <Col md={2}>
                                <Form.Label>Publish Date</Form.Label>
                            </Col>
                            <Col md={10}>
                                <Form.Label className="text-primary">{this.state.publishDate}</Form.Label>
                            </Col>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>)
    }
}
export default ViewRubricCard;