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
        ApiService.login(this.state.username, this.state.pwd).then((res) => {
            if(res.data==='invalid user')
            {
                alert("invalid username or password");
                this.setState({
                    username: '',
                    pwd: ''
                })
                this.props.history.push('/login');
            }
            else
            {
                window.localStorage.setItem("userToken", res.data);
                
                while(!window.localStorage.getItem("userToken"));
                this.props.history.push('/');
                window.location.reload(false);
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
                    <Row>
                        <Col md={2}></Col>
                        <Col md={8}><Button onClick={this.login} variant="info mb-2">Login</Button></Col>
                    </Row>
                    <Row>
                        <Col md={2}></Col>
                        <Col md={8}><Button onClick={this.goReg} variant="outline-info">Create an Account</Button></Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    }

}

export default LoginComponent;