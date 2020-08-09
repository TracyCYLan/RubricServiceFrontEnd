//should contains: a table of the points of each criterion 
//and the submission files under this assessment.
import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
// import { Button, Card, Badge, CardGroup, Modal, Breadcrumb } from 'react-bootstrap';
class GetAssessmentComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessment: ''
        }
    }

    componentDidMount() {
        this.loadAssessment();
    }

    loadAssessment() {
        ApiService.fetchAssessmentById(window.sessionStorage.getItem("assessmentId"))
            .then((res) => {
                this.setState({
                    assessment: res.data
                })
            });
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return "";
    }

}

export default GetAssessmentComponent;