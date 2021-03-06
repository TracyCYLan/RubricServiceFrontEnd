//list all assessments under certain assessmentGroup
import React, { Component } from 'react'
import { Breadcrumb, ListGroup, Alert } from 'react-bootstrap';
import ApiService from '../../service/ApiService';
class ListAssessmentsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assessmentGroup: '',
        }
    }

    componentDidMount() {
        if (typeof (this.props.location.state) === 'undefined') {
            ApiService.fetchAssessmentGroupById(window.sessionStorage.getItem("assessmentGroupId")).then(
                res => this.setState({ assessmentGroup: res.data })
            )
        }
        else
            this.setState({ assessmentGroup: this.props.location.state.assessmentGroup })
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    getAssessment(aid) {
        window.sessionStorage.setItem("assessmentId", aid);
        this.props.history.push({
            pathname: '/assessment',
            state: { assessmentGroup: this.state.assessmentGroup }
        });
    }

    render() {
        return this.state.assessmentGroup === '' ? '' : [
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={() => this.props.history.push('/assessmentgroup')}>{this.state.assessmentGroup.name + " - " + new Date(this.state.assessmentGroup.assessDate).toLocaleDateString()}</Breadcrumb.Item>
                <Breadcrumb.Item active>Assessments</Breadcrumb.Item>
            </Breadcrumb>,
            <div key="alert1">
                {this.state.assessmentGroup.ins_count === 0 ? "" :
                    <Alert key='ins' variant='primary'>
                        Instructor Evaluations
                </Alert>}
            </div>,
            <ListGroup key="list">
                {this.state.assessmentGroup.assessments.filter(a => a.type === 'grading').map((a, indx) =>
                    <ListGroup.Item key={a.id} action className="text-primary" onClick={() => this.getAssessment(a.id)}>Assessment {indx + 1}</ListGroup.Item>)}
            </ListGroup>,
            <div key="alert2">
                {this.state.assessmentGroup.peer_count === 0 ? "" :
                    <Alert key='ins' variant='primary' className='mt-4'>
                        Peer Evaluations
            </Alert>}
            </div>,
            <ListGroup key="list2">
                {this.state.assessmentGroup.assessments.filter(a => a.type === 'peer_review').map((a, indx) =>
                    <ListGroup.Item key={a.id} action className="text-primary" onClick={() => this.getAssessment(a.id)}>Assessment {indx + 1}</ListGroup.Item>)}
            </ListGroup>,
        ];
    }

}

export default ListAssessmentsComponent;