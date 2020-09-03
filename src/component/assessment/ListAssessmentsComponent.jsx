//list all assessments under certain assessmentGroup
import React, { Component } from 'react'
import {Breadcrumb, ListGroup} from 'react-bootstrap';
class ListAssessmentsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assessmentGroup: this.props.location.state.assessmentGroup
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    getAssessment(indx){
        this.props.history.push({
            pathname: '/assessment',
            state: {assessmentGroup: this.state.assessmentGroup,index: indx}
        });
    }

    render() {
        return [
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={()=>this.props.history.push('/assessmentgroup')}>{this.state.assessmentGroup.name+" - "+new Date(this.state.assessmentGroup.assessDate).toLocaleDateString()}</Breadcrumb.Item>
                <Breadcrumb.Item active>Assessments</Breadcrumb.Item>
            </Breadcrumb>,
            <ListGroup key="list">
                {this.state.assessmentGroup.assessments.map((a,indx)=>
                    <ListGroup.Item key={a.id} action className="text-primary" onClick={()=>this.getAssessment(indx)}>Assessment {indx+1}</ListGroup.Item>)}
            </ListGroup>];
    }

}

export default ListAssessmentsComponent;