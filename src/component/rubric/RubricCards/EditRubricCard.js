import React, { Component } from 'react'
import { Row, Col, Button, Form, Card } from 'react-bootstrap';
class EditRubricCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            description: props.description,
            publishDate: props.publishDate,
            editRubric: props.edit,
            save: props.save,
            cancel: props.cancel,
            type: props.type
        }
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        //pass the attribute name,attribute updated value, rating index to edit
        this.state.editRubric(e.target.name, e.target.value);
    }

    render() {
        return (
            <Card>
                <Card.Body >
                    <Form>
                        <Form.Group as={Row} controlId="formGridName">
                            <Form.Label column md={2}>Name</Form.Label>
                            <Col md={10}>
                                <Form.Control type="text" placeholder="Enter name" name="name" value={this.state.name} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridDescription">
                            <Form.Label column md={2}>Description</Form.Label>
                            <Col md={10}>
                                <Form.Control as="textarea" placeholder="description" name="description" value={this.state.description} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridDate">
                            <Form.Label column md={2}>Publish Date</Form.Label>
                            <Col md={10}>
                                <Form.Control type="date" name="publishDate" value={this.state.publishDate} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridNextBtn">
                            <Col>
                                <Button variant="outline-danger float-right ml-1" onClick={this.state.cancel}>Cancel</Button>
                                <Button
                                    variant="outline-dark float-right"
                                    onClick={this.state.save}>{this.state.type === 'add' ? 'Next' : 'Save'}
                                </Button>
                            </Col>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>)
    }
}
export default EditRubricCard;