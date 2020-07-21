import React, { Component } from 'react';
import ApiService from "../../service/ApiService";
import { Card, Breadcrumb } from 'react-bootstrap';
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
            assessDate: '',
            showModal: false,
            rubric: ''
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
                    assessDate: assessmentGroup.assessDate,
                    rubric: assessmentGroup.rubric
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
                        {ReactHtmlParser(this.state.description)}
                    </Card.Subtitle>
                    <Card.Text as="h6">
                        Total {this.state.assessments.length} assessments.
                    </Card.Text>
                    <Card.Text class="text-primary" onClick={() => {
                        window.sessionStorage.setItem("rubricId", this.state.rubric.id);
                        this.props.history.push('/rubric');
                    }}>Using {this.state.rubric.name}</Card.Text>

                </Card.Body>
            </Card>
            ]
        );
    }

}

export default GetAssessmentGroupComponent;