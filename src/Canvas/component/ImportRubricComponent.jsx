import React, { Component } from 'react'
import ApiService from "../service/CanvasApiService";
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card

class ImportRubricComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            courseId: '',
            courses: [],
            rubrics: [],
            rubricId: ''
        }
        this.loadCourses = this.loadCourses.bind(this);
        this.importRubric = this.importRubric.bind(this);
    }

    componentDidMount() {
        this.loadCourses();
    }
    loadCourses() {
        ApiService.fetchCourses(window.sessionStorage.getItem("canvasToken")).then(res => {
            this.setState({
                courses: JSON.parse(res.data)
            })
        })
    }
    importRubric= (e) => {
        e.preventDefault();
        ApiService.importRubric(this.state.courseId, this.state.rubricId,window.sessionStorage.getItem("canvasToken")).then(res=>{
            this.props.history.push('/rubrics')
        }
        )
    }
    reloadRubrics() {
        ApiService.fetchRubrics(this.state.courseId.window.sessionStorage.getItem("canvasToken")).then(res => {
            this.setState({
                rubrics: JSON.parse(res.data)
            })
        })
    }
    render() {
        if (this.state.courseId !== '') {
            this.reloadRubrics();
        }
        return <Card className="mx-auto mt-3">
            <Card.Body>
                <Card.Title>Import Rubric</Card.Title>
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
                        <Form.Group as={Row} controlId="selectRubricForm">
                            <Form.Label column md={2}>Select Rubric</Form.Label>
                            <Col md={10}>
                                <Form.Control as="select"
                                    onChange={(e) => { this.setState({ rubricId: e.target.value }) }} >
                                    <option value="" disabled selected>Select a rubric</option>
                                    {
                                        this.state.rubrics.map(
                                            r => <option value={r.id}>{r.title}</option>)
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>}
                    {this.state.rubricId === '' ? '' : <Button onClick={this.importRubric}>Import</Button>}
                </Form>
            </Card.Body>
        </Card>
    }

}

export default ImportRubricComponent;