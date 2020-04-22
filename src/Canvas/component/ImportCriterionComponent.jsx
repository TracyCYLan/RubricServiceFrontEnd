import React, { Component } from 'react'
import ApiService from "../service/CanvasApiService";
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card

class ImportCriterionComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            courseId: '',
            courses: [],
            criteria: [],
            criterionId: ''
        }
        this.loadCourses = this.loadCourses.bind(this);
        this.importCriterion = this.importCriterion.bind(this);
    }

    componentDidMount() {
        this.loadCourses();
    }
    loadCourses() {
        ApiService.fetchCourses().then(res => {
            this.setState({
                courses: JSON.parse(res.data)
            })
        })
    }
    importCriterion= (e) => {
        e.preventDefault();
        ApiService.importCriterion(this.state.criterionId).then(res=>{
            this.props.history.push('/criteria')
        }
        )
    }
    reloadCriteria() {
        ApiService.fetchCriteria(this.state.courseId).then(res => {
            this.setState({
                criteria: JSON.parse(res.data)
            })
        })
    }
    render() {
        if (this.state.courseId !== '') {
            this.reloadCriteria();
        }
        return <Card className="mx-auto mt-3">
            <Card.Body>
                <Card.Title>Import Criterion</Card.Title>
                <Form>
                    <Form.Group as={Row} controlId="selectCourseForm">
                        <Form.Label column md={2}>Select Course</Form.Label>
                        <Col md={10}>
                            <Form.Control as="select"
                                onChange={(e) => { this.setState({ courseId: e.target.value }) }} >
                                <option value="" disabled selected>Select a course</option>
                                {
                                    this.state.courses.map(
                                        c => <option value={c.id}>{c.name}</option>)
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    {this.state.courseId === '' ? '' :
                        <Form.Group as={Row} controlId="selectOutcomeForm">
                            <Form.Label column md={2}>Select Outcome</Form.Label>
                            <Col md={10}>
                                <Form.Control as="select"
                                    onChange={(e) => { this.setState({ criterionId: e.target.value }) }} >
                                    <option value="" disabled selected>Select a rubric</option>
                                    {
                                        this.state.criteria.map(
                                            c => <option value={c.outcome.id}>{c.outcome.title}</option>)
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>}
                    {this.state.rubricId === '' ? '' : <Button onClick={this.importCriterion}>Import</Button>}
                </Form>
            </Card.Body>
        </Card>
    }

}

export default ImportCriterionComponent;