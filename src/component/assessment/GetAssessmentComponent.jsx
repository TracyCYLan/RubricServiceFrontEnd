//should contains: a table of the points of each criterion 
//and the submission files under this assessment.
import React, { Component } from 'react';
import { Table, Breadcrumb, ListGroup } from 'react-bootstrap';
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

    download(id){
        this.props.history.push('/download',{fileId: id});
    }
    render() {
        console.log(JSON.stringify(this.state.assessment))
        return [
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={() => { this.props.history.push('assessments', { assessmentGroup: this.state.assessmentGroup }) }}>Assessments</Breadcrumb.Item>
                <Breadcrumb.Item active>Assessment</Breadcrumb.Item>
            </Breadcrumb>,
            <Table key="rating-table" bordered responsive="sm" size="sm" style={{ width: 300, textAlign: 'center', verticalAlign: 'middle' }}>
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
                                {this.state.assessment.ratings[indx] === undefined ? <td>ungraded</td> : <td>{this.state.assessment.ratings[indx].value} points</td>}
                            </tr>
                        )
                    }
                </tbody>
            </Table>,
            <div key="comment">Comments: {this.state.assessment.comments}</div>,
            this.state.assessment.artifacts.length === 0 ? "" :
                [<span key="list-title">Files: </span>,
                <ListGroup key="list">
                    {this.state.assessment.artifacts.map((a, indx) =>
                        <ListGroup.Item key={a.id} action className="text-primary" onClick={() => this.download(a.id)}>{a.name.split('-')[1]}</ListGroup.Item>)}
                </ListGroup>]
        ];
    }

}

export default GetAssessmentComponent;