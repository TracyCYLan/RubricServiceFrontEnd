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
            criteria: [],
            assessmentPeerCount: 0, //count num of peer assessments
            assessmentInstructorCount: 0 //count num of instructor assessments
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
        // alert(JSON.stringify(this.state.assessments))
        this.state.criteria.map(
            c => c.ratings.map(r => {
                r['peer_count'] = 0
                r['instructor_count'] = 0
                return r;
            })
        )
        let peer_count = 0;
        let ins_count = 0;
        for (let assessment of this.state.assessments) {
            if (assessment.type === 'peer_review')
                peer_count++;
            else if (assessment.type === 'grading')
                ins_count++;
            for (let i = 0; i < assessment.ratings.length; i++) {
                let r = assessment.ratings[i]; //current rating in this assessment
                //traverse ratings in certain criterion
                let ratings = this.state.criteria[i].ratings;
                for (let rating of ratings) {
                    if (rating.value === r.value) {
                        if (assessment.type === 'peer_review')
                            rating.peer_count++;
                        else if (assessment.type === 'grading')
                            rating.instructor_count++;
                        break;
                    }
                }
            }
        }
        this.setState({
            criteria: this.state.criteria,
            assessmentInstructorCount: ins_count,
            assessmentPeerCount: peer_count
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
                        this.state.assessmentInstructorCount === 0 ? "" :
                            [<Card.Text key="title" className="text-success"> Instructor Evaluations </Card.Text>,
                            <Table key="table" bordered responsive="sm" size="sm" style={{ width: 300, textAlign: 'center',verticalAlign:'middle'}}>
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
                                                                    <td>{r.instructor_count}</td></tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>]
                    }
                    {
                        this.state.assessmentPeerCount === 0 ? "" :
                            [<Card.Text key="words" className="text-success"> Peer Evaluations</Card.Text>,
                            <Table key="table" bordered responsive="sm" size="sm" style={{ width: 300, textAlign: 'center',verticalAlign:'middle'}}>
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
                                                                    <td>{r.peer_count}</td></tr>
                                                            )}
                                                        </tbody>
                                                    </Table>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>]
                    }
                </Card.Body>
            </Card>
            ]
        );
    }

}

export default GetAssessmentGroupComponent;