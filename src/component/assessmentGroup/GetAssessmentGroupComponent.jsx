import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, Card, CardGroup,Breadcrumb } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';
class GetAssessmentGroupComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            assessments: [],
            message: '',
            publishDate: '',
            showModal: false
        }
        this.loadAssessmentGroup = this.loadAssessmentGroup.bind(this);
    }

    componentDidMount() {
        this.loadAssessmentGroup();
    }

    loadAssessmentGroup() {
        ApiService.fetchAssessmentGroupById(window.sessionStorage.getItem("assessmentGroupId"))
            .then((res) => {
                let assessmentGroup = res.data;
                this.setState({
                    id: assessmentGroup.id,
                    name: assessmentGroup.name,
                    description: assessmentGroup.description,
                    assessments: assessmentGroup.assessments,
                    publishDate: assessmentGroup.publishDate
                })
            });
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            [<Breadcrumb key="breadcrumb" className="mx-auto mt-2">
            <Breadcrumb.Item href="assessmentgroups">AssessmentGroups</Breadcrumb.Item>
            <Breadcrumb.Item active>{this.state.name}</Breadcrumb.Item>
          </Breadcrumb>,
            <Card key="card" className="mx-auto mt-2">
                <Card.Body>
                    <Card.Title as="h3">{this.state.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        { ReactHtmlParser(this.state.description) }
                    </Card.Subtitle>
                </Card.Body>
            </Card>
            ]
        );
    }

}

export default GetAssessmentGroupComponent;