import React, { Component } from 'react'
import ApiService from "../service/CanvasApiService";
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card

class ExportRubricComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            courseId: '',
            courses: [],
            rubricId: window.sessionStorage.getItem('rubricId')
        }
        this.loadCourses = this.loadCourses.bind(this);
        this.exportRubric = this.exportRubric.bind(this);
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
    exportRubric = (e) => {
        e.preventDefault();
        ApiService.exportRubric(this.state.rubricId, this.state.courseId,
            window.sessionStorage.getItem("canvasToken")).then(res => {
                window.sessionStorage.removeItem('rubricId');
                this.props.history.push('/');
            })
    }
    changeCourse = (e) =>{
        this.setState({
            courseId: e.target.value
        });
    }
    render() {
        return <Card className="mx-auto mt-3">
            <Card.Body>
                <Card.Title>Export Rubric</Card.Title>
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
                    {this.state.courseId === '' ? '' : <Button onClick={this.exportRubric}>Export</Button>}
                </Form>
            </Card.Body>
        </Card>
    }

}

export default ExportRubricComponent;