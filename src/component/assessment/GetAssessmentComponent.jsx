//should contains: a table of the points of each criterion 
//and the submission files under this assessment.
import React, { Component } from 'react';
import { Table, Breadcrumb, ListGroup } from 'react-bootstrap';
import ApiService from '../../service/ApiService';
const FileDownload = require('js-file-download');
class GetAssessmentComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessment: '',
            assessmentGroup: '',
            criteria: []
        }
    }

    componentDidMount() {
        if (typeof (this.props.location.state) === 'undefined') {
            ApiService.fetchAssessmentGroupById(window.sessionStorage.getItem("assessmentGroupId")).then(
                res => this.setState({
                    assessmentGroup: res.data,
                    criteria: res.data.rubric.criteria
                })
            )
        }
        else {
            this.setState({
                assessmentGroup: this.props.location.state.assessmentGroup,
                criteria: this.props.location.state.assessmentGroup.rubric.criteria
            })
        }
        ApiService.fetchAssessmentById(window.sessionStorage.getItem("assessmentId"))
            .then((res) => {
                this.setState({ assessment: res.data })
            })
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    download(a) {
        ApiService.checkDownloadNeeded(a.name.split('.').pop(), a.id).then(
            res => {
                if (res.config['responseType'] !== 'blob')
                    this.props.history.push({
                        pathname: '/download',
                        state: { fileId: a.id, assessmentGroup: this.state.assessmentGroup, text: res.data }
                    });
                else
                    FileDownload(res.data, a.name.substr(a.name.indexOf('-')+1));
            }
        )
    }
    render() {
        return this.state.assessment === ''|| this.state.assessmentGroup==='' ? '' : [
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={() => { this.props.history.push({ pathname: 'assessments', state: { assessmentGroup: this.state.assessmentGroup } }) }}>Assessments</Breadcrumb.Item>
                <Breadcrumb.Item active>Assessment</Breadcrumb.Item>
            </Breadcrumb>,
            <Table key="rating-table" bordered responsive="sm" style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <thead>
                    <tr>
                        <th>Criterion Name</th>
                        <th>Points</th>
                        <th>Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.state.criteria.map((c, indx) =>
                            <tr key={c.id + indx}>
                                <td>{c.name}</td>
                                {this.state.assessment.comments[indx] === undefined ? [<td>ungraded</td>, <td></td>] :
                                    [<td>{this.state.assessment.comments[indx].rating.value} points</td>,
                                    <td>{this.state.assessment.comments[indx].content}</td>]}
                            </tr>
                        )
                    }
                </tbody>
            </Table>,
            this.state.assessment.artifacts.length === 0 ? "" :
                [<span key="list-title">Files: </span>,
                <ListGroup key="list">
                    {this.state.assessment.artifacts.map((a, indx) =>
                        <ListGroup.Item key={a.id} action className="text-primary" onClick={() => this.download(a)}>{a.name.substr(a.name.indexOf('-')+1)}</ListGroup.Item>)}
                </ListGroup>]

        ];
    }

}

export default GetAssessmentComponent;