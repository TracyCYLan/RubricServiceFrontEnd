//list all assessments under certain assessmentGroup
import React, { Component } from 'react'
// import ApiService from "../../service/ApiService";
class ListAssessmentsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            assessments:[]
        }
    }

    componentDidMount() {
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return "";
    }

}

export default ListAssessmentsComponent;