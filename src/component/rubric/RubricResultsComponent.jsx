import React, { Component } from 'react';
import ApiService from "../../service/ApiService";
import { Table, Badge, Breadcrumb } from "react-bootstrap";
class RubricResultsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessmentGroups: [],
            rubricId: window.sessionStorage.getItem("rubricId"),
            amap: {} //contains key-value: course_name (i.e., agroup name) - array of agroups having the same assessmentGroup name
        }
        this.createMap = this.createMap.bind(this);
    }

    componentDidMount() {
        if (typeof (this.props.location.state) === 'undefined') {
            ApiService.fetchRubricById(window.sessionStorage.getItem("rubricId"))
                .then((res) => this.setState({ rubric: res.data }))
        }
        else {
            this.setState({ rubric: this.props.location.state.rubric })
        }
        // direct to list AssessmentGroup page which only shows AssessmentGroups using this rubric
        ApiService.fetchAssessmentGroupsByRubric(this.state.rubricId).then((res) => {
            this.setState({
                assessmentGroups: res.data
            }, () => { this.createMap(); })
        })
    }

    createMap() {
        let amap = {};
        for (let i = 0; i < this.state.assessmentGroups.length; i++) {
            let ag = this.state.assessmentGroups[i];
            if (amap[ag.name] === undefined)
                amap[ag.name] = [];
            amap[ag.name].push(ag);
        }
        this.setState({ amap: amap });
    }

    getAssessmentGroup(arr, indx) {
        window.sessionStorage.setItem("assessmentGroupId", arr[indx].id);
        this.props.history.push('/assessmentGroup');
    }

    seeCourseChart(name, arr) {
        this.props.history.push({ pathname: "/rubric-results/compare", state: { list: arr, name: name, rubric: this.state.rubric } })
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return [this.state.rubric===undefined?'':
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={() => this.props.history.push('/rubrics')}>Rubrics</Breadcrumb.Item>
                <Breadcrumb.Item onClick={() => this.props.history.push('/rubric')}>{this.state.rubric.name}</Breadcrumb.Item>
                <Breadcrumb.Item active>Results of {this.state.rubric.name}</Breadcrumb.Item>
            </Breadcrumb>,
            <Table key="table" border="1" className="mt-2">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.entries(this.state.amap).map(([key, value]) =>
                            <tr key={key}>
                                <td className="text-primary" onClick={() => this.seeCourseChart(key, value)}>{key}</td>
                                <td>{value.map((v, indx) =>
                                    <Badge
                                        key={indx}
                                        variant="secondary"
                                        className="ml-1"
                                        onClick={() => this.getAssessmentGroup(value, indx)}>
                                        {new Date(v.assessDate).toLocaleDateString()}</Badge>)}
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>];
    }

}

export default RubricResultsComponent;