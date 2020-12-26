import React, { Component } from 'react'
import { Button, Card, Form, Row, Col, Breadcrumb } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card
import ApiService from '../../service/ApiService';
class RegisterComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            username: '',
            pwd: ''
        }
        this.register = this.register.bind(this);
    }

    componentDidMount() {
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });
    register = (e) => {
        e.preventDefault();
        ApiService.registerUser(this.state.username, this.state.pwd)
            .then((res) => {
                this.setState({ message: 'User added successfully.' });
                this.props.history.push('/login');
            });
    }
    render() {
        return [
            <Breadcrumb className="mx-auto mt-2">
                <Breadcrumb.Item onClick={()=>this.props.history.push('/login')}>Login</Breadcrumb.Item>
                <Breadcrumb.Item active>Register</Breadcrumb.Item>
            </Breadcrumb>,
            <Card className="mx-auto mt-3">
                <Card.Body>
                    <Form>
                        <Form.Group as={Row} controlId="RegisterForm">
                            <Form.Label column md={2}>Register</Form.Label>
                            <Col md={10}>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="username">
                            <Form.Label column md={2}>Username: </Form.Label>
                            <Col md={8}>
                                <Form.Control type="text" placeholder="Enter name" name="username" value={this.state.username} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="pwd">
                            <Form.Label column md={2}>Password: </Form.Label>
                            <Col md={8}>
                                <Form.Control type="password" placeholder="Enter password" name="pwd" value={this.state.pwd} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Button onClick={this.register}>Register</Button>
                    </Form>
                </Card.Body>
            </Card>]
    }

}

export default RegisterComponent;