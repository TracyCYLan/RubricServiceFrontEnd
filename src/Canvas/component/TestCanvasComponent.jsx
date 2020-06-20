import React, { Component } from 'react'
import ApiService from "../service/ApiService";
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card

class TestCanvasComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null
        }
    }

    componentDidMount() {
        ApiService.checkCookie().then((res) => {
            alert(res.data)
        })
    }
    
    render() {
        return ""; 
    }

}

export default TestCanvasComponent;