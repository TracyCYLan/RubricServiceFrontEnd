import React, { Component } from 'react'
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card
import ApiService from '../../service/ApiService';

class LoginComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            username: '',
            pwd: ''
        }
        this.login = this.login.bind(this);
        this.goReg = this.goReg.bind(this);
    }

    componentDidMount() {
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });
    login = (e) => {
        e.preventDefault();
        alert("before");
        ApiService.login(this.state.username, this.state.pwd).then((res) => {
            if(res.data === -1)
            {
                //failed
                alert("no such user or password is wrong")
            }         
            else
            {
                alert("success")
            }
        });
    }
    goReg() {
        this.props.history.push('/register');
    }
    render() {
        return <Card className="mx-auto mt-3">
            <Card.Body>
                <Form>
                    <Form.Group as={Row} controlId="LoginForm">
                        <Form.Label column md={2}>Login</Form.Label>
                        <Col md={10}>
                            <Button onClick={this.goReg}>Register</Button>
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
                    <Button onClick={this.login}>Login</Button>
                </Form>
            </Card.Body>
        </Card>
    }

}

export default LoginComponent;