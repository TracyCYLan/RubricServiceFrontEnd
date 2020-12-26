//should contains: a table of the points of each criterion 
//and the submission files under this assessment.
import React, { Component } from 'react';
import { Breadcrumb } from 'react-bootstrap';
class GetArtifactComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessmentGroup: this.props.location.state.assessmentGroup,
            fileId: this.props.location.state.fileId,
            text: this.props.location.state.text
        }
    }

    componentDidMount() {
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return [
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={() => 
                    { this.props.history.push({
                        pathname:"/assessment",
                        state: {assessmentGroup: this.state.assessmentGroup}
                    }) }
                }>Assessment</Breadcrumb.Item>
                <Breadcrumb.Item active>File</Breadcrumb.Item>
            </Breadcrumb>,
            <pre key="text">{this.state.text}</pre>
        ];
    }

}

export default GetArtifactComponent;