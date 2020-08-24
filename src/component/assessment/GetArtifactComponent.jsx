//should contains: a table of the points of each criterion 
//and the submission files under this assessment.
import React, { Component } from 'react';
import { Breadcrumb } from 'react-bootstrap';
class GetArtifactComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: this.props.location.state.index,//for assessment
            assessmentGroup: this.props.location.state.assessmentGroup,
            fileId: this.props.location.state.fileId,
            text: this.props.location.state.text
        }
    }

    componentDidMount() {
        // ApiService.fetchArtifactById(this.state.fileId).then((res) => {
        //     this.setState({
        //         text: res.data
        //     })
        // })
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return [
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={() => { this.props.history.push('assessment', { assessmentGroup: this.state.assessmentGroup, index: this.state.index }) }}>Assessment</Breadcrumb.Item>
                <Breadcrumb.Item active>File</Breadcrumb.Item>
            </Breadcrumb>,
            <pre key="text">{this.state.text}</pre>
        ];
    }

}

export default GetArtifactComponent;