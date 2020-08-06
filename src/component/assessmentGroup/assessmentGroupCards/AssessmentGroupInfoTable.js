import React, { Component } from 'react'
import { Row, Table, Container } from 'react-bootstrap';
class AssessmentGroupInfoTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assessmentGroup: props.assessmentGroup,
            type: props.type //peer or instructor
        }
    }

    render() {
        return <Container>
            <Row className="text-info mb-1">{this.state.type==='peer'?'Peer Evaluations':'Instructor Evaluations'}</Row>
            <Row className="text-info mb-1">{new Date(this.state.assessmentGroup.assessDate).toLocaleDateString()}</Row>
            <Row><Table key="table" bordered responsive="sm" size="sm" style={{ width: 300, textAlign: 'center', verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th>Criterion</th>
                        <th>Ratings and Counts</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.assessmentGroup.rubric.criteria.map(c =>
                            <tr key={c.id}>
                                <td>{c.name}</td>
                                <td>
                                    <Table>
                                        <tbody>
                                            {c.ratings.map((r) =>
                                                <tr key={r.id}><td>{r.value} pts</td>
                                                    <td>{this.state.type === 'peer' ? r.peer_count : r.instructor_count}</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table></Row>
        </Container>
    }
}
export default AssessmentGroupInfoTable;