import React, { Component } from 'react'
import { Row, Col, Form, Card, Button } from 'react-bootstrap';
const aliceObj = window.sessionStorage.getItem("oidc.user:https://identity.cysun.org:alice-rubric-service-spa");
class ViewRubricCard extends Component {

    constructor(props) {
        super(props);
        if (props.type === 'add') {
            this.state = {
                name: props.name,
                description: props.description,
                publishDate: props.publishDate,
                editRubric: props.editRubric,
                type: props.type
            }
        }
        else if (props.type === 'view') {
            this.state = {
                id: props.id,
                name: props.name,
                description: props.description,
                publishDate: props.publishDate,
                published: props.published,
                preDelete: props.preDelete,//method will be called if clicked delete btn
                editRubric: props.editRubric,
                copyneditRubric: props.copyneditRubric,
                publishRubric: props.publishRubric,
                allowEdit: props.allowEdit,
                type: props.type,
                showResults: props.showResults
            }
        }
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        //pass the attribute name,attribute updated value, rating index to edit
        this.state.edit(e.target.name, e.target.value, this.state.index);
    }
    publishRubric = () => {
        if (this.state.type === 'view') {
            if (aliceObj) {
                if (this.state.allowEdit) {
                    this.setState({
                        publishDate: new Date().toLocaleDateString('fr-CA'),
                        published: true
                    })
                    this.state.publishRubric();
                }
                else
                    alert('You are not authorized to do this action')
            }
            else
                alert('You need to login')
        }
    }

    render() {
        return (
            <Card>
                <Card.Body>
                    <Form>
                        {this.state.type === 'add' ?
                            ''
                            :
                            <Form.Group as={Row} controlId="formGridOperation">
                                <Col>
                                    <h3>{this.state.name}</h3>
                                </Col>
                                <Col>
                                    <Button className="float-right" variant="outline-success ml-1" hidden={!this.state.published || !aliceObj} onClick={this.state.showResults}>Results</Button>
                                    <Button className="float-right" variant="outline-danger ml-1" hidden={this.state.published} onClick={this.state.preDelete}>Delete</Button>
                                    <Button className="float-right" variant="outline-secondary ml-1" hidden={!this.state.published || !aliceObj} onClick={this.state.copyneditRubric}>Copy</Button>
                                    <Button className="float-right" variant="outline-secondary ml-1" hidden={this.state.published} onClick={() => this.state.editRubric(this.state.id)}>Edit</Button>
                                </Col>

                            </Form.Group>
                        }
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
                                <Form.Label className="text-primary">
                                    {this.state.type === 'view' && this.state.publishDate === '' ?
                                        <Button variant="info" size="sm" onClick={this.publishRubric}>publish</Button>
                                        : this.state.publishDate
                                    }</Form.Label>
                            </Col>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>)
    }
}
export default ViewRubricCard;