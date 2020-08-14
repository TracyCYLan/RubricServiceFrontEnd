//should contains: a table of the points of each criterion 
//and the submission files under this assessment.
import React, { Component } from 'react';
import { Table, Breadcrumb, Container, Row, Col } from 'react-bootstrap';
class GetAssessmentComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessment: this.props.location.state.assessmentGroup.assessments[this.props.location.state.index],
            assessmentGroup: this.props.location.state.assessmentGroup,
            criteria: this.props.location.state.assessmentGroup.rubric.criteria
        }
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return [
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={() => { this.props.history.push('assessments', { assessmentGroup: this.state.assessmentGroup }) }}>Assessments</Breadcrumb.Item>
                <Breadcrumb.Item active>Assessment</Breadcrumb.Item>
            </Breadcrumb>,
            <Table bordered responsive="sm" size="sm" style={{ width: 300, textAlign: 'center', verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th>Criterion Name</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.criteria.map((c, indx) =>
                            <tr key={c.id + indx}>
                                <td>{c.name}</td>
                                <td>{this.state.assessment.ratings[indx].value} points</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>,
            <span>Comments: {this.state.assessment.comments}</span>];
    }

}

export default GetAssessmentComponent;