//list all assessments under certain assessmentGroup
import React, { Component } from 'react'
import { Breadcrumb, Card, Table, ListGroup } from 'react-bootstrap';
class ListCommentsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assessmentGroup: this.props.location.state.assessmentGroup
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    getAssessment(indx) {
        this.props.history.push({
            pathname: '/assessment',
            state: { assessmentGroup: this.state.assessmentGroup, index: indx }
        });
    }

    render() {
        return [
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={() => this.props.history.push('/assessmentgroup')}>{this.state.assessmentGroup.name + " - " + new Date(this.state.assessmentGroup.assessDate).toLocaleDateString()}</Breadcrumb.Item>
                <Breadcrumb.Item active>All Comments</Breadcrumb.Item>
            </Breadcrumb>,
            <Card key="card" className="mx-auto mt-2">
                <Card.Body>
                    <Table key="table" bordered responsive="sm" size="sm" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        <thead>
                            <tr>
                                <th>Criterion</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.assessmentGroup.rubric.criteria.map((c, indx) =>
                                    <tr key={c.id}>
                                        <th>{c.name}</th>
                                        <td>
                                            <Table>
                                                <tbody>
                                                    <ListGroup key="list" variant="flush">
                                                        {this.state.assessmentGroup.assessments.map((a, j) =>
                                                            a.comments[indx].content === '' ? '' :
                                                                <ListGroup.Item key={a.id} action className="text-primary" variant="light"
                                                                    onClick={() => { this.props.history.push({ pathname: '/assessment', state: { assessmentGroup: this.state.assessmentGroup, index: j } }) }}>
                                                                    {a.comments[indx].rating.value} pts - {a.comments[indx].content}
                                                                </ListGroup.Item>
                                                        )}

                                                    </ListGroup>
                                                    {/* {
                                                        this.state.assessmentGroup.assessments.map((a) =>
                                                            a.comments[indx].content === '' ? '' :
                                                                <tr>
                                                                    <td>{a.comments[indx].rating.value} pts</td>
                                                                    <td>{a.comments[indx].content}</td>
                                                                </tr>
                                                        )
                                                    } */}
                                                </tbody>
                                            </Table>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        ];
    }

}

export default ListCommentsComponent;