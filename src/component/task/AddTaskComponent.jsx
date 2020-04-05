import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Row, Col, Button, Form, Card, Breadcrumb } from 'react-bootstrap';
class AddTaskComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            dueDate:'',
            type:'',
            users: [],
            assessorId: '',
            associations: [],
            associationId: ''
        }
        this.addTask = this.addTask.bind(this);
    }
    componentDidMount() {
        this.loadUsers();
        this.loadAssociations();
    }
    loadUsers() {
        ApiService.fetchUsers().then(res => {
            this.setState({
                users: res.data
            })
        })
    }
    loadAssociations() {
        ApiService.fetchAssociations().then(res => {
            this.setState({
                associations: res.data
            })
        })
    }
    addTask = (e) => {
        e.preventDefault();
        let task = {
            name: this.state.name,
            type: this.state.type,
            dueDate: this.state.dueDate
        };
        ApiService.addTask(task, this.state.assessorId, this.state.associationId)
            .then(res => {
                this.props.history.push('/criteria');
            })
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return [
            <Breadcrumb className="mx-auto mt-2">
                {/* <Breadcrumb.Item href="tasks">All Task</Breadcrumb.Item> */}
                <Breadcrumb.Item active>Assign Task</Breadcrumb.Item>
            </Breadcrumb>,
            <Card className="mx-auto mt-3">
                <Card.Body>
                    <Card.Title>Assign Task to ...</Card.Title>
                    <Form>
                        <Form.Group as={Row} controlId="formGridName">
                            <Form.Label column md={2}>Task Name</Form.Label>
                            <Col md={10}>
                                <Form.Control type="text" placeholder="Enter name" name="name" value={this.state.name} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridDate">
                            <Form.Label column md={2}>Task Due Date</Form.Label>
                            <Col md={10}>
                                <Form.Control type="date" name="dueDate" value={this.state.dueDate} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="selectTypeForm">
                            <Form.Label column md={2}>Type</Form.Label>
                            <Col md={10}>
                                <Form.Control as="select"
                                    onChange={(e) => { this.setState({ type: e.target.value }) }} >
                                    <option value="" disabled selected>Select a type</option>
                                    <option>INSTRUCTOR</option>
                                    <option>PEER</option>
                                    <option>EXTERNAL</option>
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="selectUserForm">
                            <Form.Label column md={2}>Select Assessor</Form.Label>
                            <Col md={10}>
                                <Form.Control as="select"
                                    onChange={(e) => { this.setState({ assessorId: e.target.value }) }} >
                                    <option value="" disabled selected>Select an assessor</option>
                                    {
                                        this.state.users.map(
                                            u => <option value={u.id}>{u.username}</option>)
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="selectAssociationForm">
                            <Form.Label column md={2}>Association</Form.Label>
                            <Col md={10}>
                                <Form.Control as="select"
                                    onChange={(e) => { this.setState({ associationId: e.target.value }) }}>
                                    <option value="" disabled selected>Select an association</option>
                                    {
                                        this.state.associations.map(
                                            a => <option value={a.id}>{a.name}</option>)
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <div>
                            <Button variant="outline-secondary" onClick={this.addTask}>Assign</Button> </div>
                    </Form>
                </Card.Body>
            </Card>
        ];
    }
}


export default AddTaskComponent;