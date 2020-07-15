import React, { Component } from 'react'
import ApiService from "../service/CanvasApiService";
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
class ImportAssessmentsComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            courseId: '',
            courses: [],
            assignments: [],
            assignment: ''
        }
        this.loadCourses = this.loadCourses.bind(this);
        this.importAssessments = this.importAssessments.bind(this);
    }

    componentDidMount() {
        if (window.sessionStorage.getItem("canvasToken") === null) {
            alert("Need to login on Canvas to import");
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
    importAssessments = (e) => {
        if (this.state.assignment[0] === undefined) {
            alert("you need to select an assignment!");
        }
        else {
            e.preventDefault();
            if (this.state.assignment[0].rubric_settings === undefined) {
                alert('selected assignment hasnt select a rubric to grade');
            }
            else {
                alert(this.state.courseId + " " + this.state.assignment[0].id + " " + this.state.assignment[0].rubric_settings.id);
                ApiService.importAssessments(this.state.courseId, this.state.assignment[0].id, this.state.assignment[0].rubric_settings.id, window.sessionStorage.getItem("canvasToken")).then(res => {
                    this.props.history.push('/')
                })
            }

        }
    }
    reloadAssignments() {
        ApiService.fetchAssignments(this.state.courseId, window.sessionStorage.getItem("canvasToken")).then(res => {
            this.setState({
                assignments: JSON.parse(res.data)
            })
        })
    }
    changeCourse = (e) => {
        this.setState({
            courseId: e.target.value
        }, () => {
            this.reloadAssignments();
        });
    }
    render() {
        return <Card className="mx-auto mt-3">
            <Card.Body>
                <Card.Title>Import Assessments</Card.Title>
                <Form>
                    <Form.Group as={Row} controlId="selectCourseForm">
                        <Form.Label column md={2}>Select Course</Form.Label>
                        <Col md={10}>
                            <Form.Control as="select" defaultValue="DEFAULT"
                                onChange={(e) => this.changeCourse(e)} >
                                <option value="DEFAULT" disabled>Select a course</option>
                                {
                                    this.state.courses.map(
                                        c => <option key={c.id} value={c.id}>{c.name}</option>)
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    {this.state.courseId === '' ? '' :
                        <Form.Group as={Row} controlId="selectAssignmentForm">
                            <Form.Label column md={2}>Select Assignment</Form.Label>
                            <Col md={10}>
                                <Typeahead
                                    {...this.state.assignments}
                                    id="import-outcome-box"
                                    onChange={assignment => this.setState({ assignment })}
                                    options={this.state.assignments}
                                    labelKey={(option) => option.name}
                                    placeholder="Select an assignment"
                                />
                            </Col>
                        </Form.Group>}
                    {this.state.assignment === '' ? '' : <Button onClick={this.importAssessments}>Import</Button>}
                </Form>
            </Card.Body>
        </Card>
    }

}

export default ImportAssessmentsComponent;