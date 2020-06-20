import React, { Component } from 'react'
import ApiService from "../service/ApiService";
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card

class TestComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null
        }
    }
    
    //if contains cookie, then we do callback, if not, we head to /login
    componentDidMount() {
        ApiService.checkCookie().then((res) => {
            alert(res.data)
            if(res.data===-1)
            {
                this.props.history.push('/login');
            }
            else
            {
                // window.localStorage.setItem("userId", res.data);
                //should I 
            }
        })
    }
    
    render() {
        return ""; 
    }

}

export default TestComponent;