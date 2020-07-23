import React, { Component } from 'react';
import ApiService from "../../service/ApiService";
import { Card, Breadcrumb, Table } from 'react-bootstrap';
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
            rubric: '',
            criteria: []
        }
        this.loadAssessmentGroup = this.loadAssessmentGroup.bind(this);
        this.countRating = this.countRating.bind(this);
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
                    rubric: assessmentGroup.rubric,
                    criteria: assessmentGroup.rubric.criteria
                }, () => {
                    this.countRating();
                });
            })
    }
    countRating() {
        alert(JSON.stringify(this.state.assessments))
        this.state.criteria.map(
            c => c.ratings.map(r => r['count'] = 0)
        )
        this.state.assessments.map(
            (a) => {
                a.ratings.map((r, index) => {
                    let ratings = this.state.criteria[index].ratings;
                    for (let i in ratings) {
                        console.log(ratings[i].value)
                        if (ratings[i].value === r.value) {
                            ratings[i].count++;
                            break;
                        }
                    }
                    return null;
                })
                return null;
            }
        )
        this.setState({
            criteria: this.state.criteria
        })
        console.log(JSON.stringify(this.state.criteria))
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
                    <Card.Text className="text-primary" onClick={() => {
                        window.sessionStorage.setItem("rubricId", this.state.rubric.id);
                        this.props.history.push('/rubric');
                    }}>Using {this.state.rubric.name}</Card.Text>
                    {
                        <Table bordered responsive="sm" size="sm" style={{ width: 300 }}>
                            <thead>
                                <tr>
                                <th>Criterion</th>
                                <th>Ratings and Counts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.criteria.map(c =>
                                        <tr key={c.id}>
                                            <td>{c.name}</td>
                                            <td>
                                                <Table>
                                                    <tbody>
                                                    {c.ratings.map((r) =>
                                                        <tr key={r.id}><td>{r.value} pts</td>
                                                            <td>{r.count}</td></tr>
                                                    )}
                                                    </tbody>
                                                </Table>
                                            </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </Table>
                    }
                </Card.Body>
            </Card>
            ]
        );
    }

}

export default GetAssessmentGroupComponent;