import 
// React,
 { Component } from 'react'
import ApiService from "../service/ApiService";
// import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card

class TestComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            token: window.localStorage.getItem("userToken")
        }
    }
    
    //if contains cookie, then we do callback, if not, we head to /login
    componentDidMount() {
        if(!window.localStorage.getItem("userToken"))
            this.props.history.push('/login');
        else
        {
            ApiService.checkCookie(this.state.token);
        }
    }
    
    render() {
        return ""; 
    }

}

export default TestComponent;