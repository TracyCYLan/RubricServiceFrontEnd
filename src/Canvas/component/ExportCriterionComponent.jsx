import React, { Component } from 'react'
import ApiService from "../service/CanvasApiService";
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card

class ExportCriterionComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            courseId: '',
            courses: [],
            criterionId: window.sessionStorage.getItem('criterionId'),
            outcome_groups: [],
            outcome_group_id: ''
        }
        this.loadCourses = this.loadCourses.bind(this);
        this.exportCriterion = this.exportCriterion.bind(this);
        this.reloadOutcomeGroups = this.reloadOutcomeGroups.bind(this);
    }

    componentDidMount() {
        if (window.sessionStorage.getItem("canvasToken") === null) {
            alert("Need to login on Canvas to export");
            this.props.history.push('/');
        }
        else {
            this.loadCourses();
        }
    }
    loadCourses() {
        ApiService.fetchCourses(window.sessionStorage.getItem("canvasToken")).then(res => {
            this.setState({
                courses: JSON.parse(res.data)
            })
        })
    }
    exportCriterion = (e) => {
        e.preventDefault();
        ApiService.exportCriterion(this.state.criterionId, this.state.courseId,
            this.state.outcome_group_id,
            window.sessionStorage.getItem("canvasToken")).then(res => {
                window.sessionStorage.removeItem('criterionId');
                this.props.history.push('/');
            })

    }
    reloadOutcomeGroups() {
        ApiService.fetchOutcomeGroups(this.state.courseId, window.sessionStorage.getItem("canvasToken")).then(res => {
            this.setState({
                outcome_groups: JSON.parse(res.data)
            })
        })
    }
    changeCourse = (e) =>{
        this.setState({
            courseId: e.target.value
        }, () => {
            this.reloadOutcomeGroups();
        });
    }
    render() {
        return <Card className="mx-auto mt-3">
            <Card.Body>
                <Card.Title>Export Criterion</Card.Title>
                <Form>
                    <Form.Group as={Row} controlId="selectCourseForm">
                        <Form.Label column md={2}>Select Course</Form.Label>
                        <Col md={10}>
                            <Form.Control as="select"
                                onChange={(e) => this.changeCourse(e)} >
                                <option value="" disabled selected>Select a course</option>
                                {
                                    this.state.courses.map(
                                        c => <option value={c.id}>{c.name}</option>)
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    {this.state.courseId === '' ? '' :
                        <Form.Group as={Row} controlId="selectOutcomeGroupForm">
                            <Form.Label column md={2}>Select Folders</Form.Label>
                            <Col md={10}>
                                <Form.Control as="select"
                                    onChange={(e) => { this.setState({ outcome_group_id: e.target.value }) }} >
                                    <option value="" disabled selected>Select an outcome group</option>
                                    {
                                        this.state.outcome_groups.map(
                                            ogroup => <option value={ogroup.id}>{ogroup.title}</option>)
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>}
                    {this.state.outcome_group_id === '' ? '' : <Button onClick={this.exportCriterion}>Export</Button>}
                </Form>
            </Card.Body>
        </Card>
    }

}

export default ExportCriterionComponent;