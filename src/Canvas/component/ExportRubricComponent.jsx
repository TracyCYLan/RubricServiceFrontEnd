import React, { Component } from 'react'
import ApiService from "../service/CanvasApiService";
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
class ExportRubricComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            courseId: '',
            courses: [],
            rubricId: window.sessionStorage.getItem('rubricId'),
            //for new created
            assignmentName: '',
            needCreateNewAssignment: false,
            //for existing assignment
            assignments: [],
            assignment: '',
            bindWithAssignment: false
        }
        this.loadCourses = this.loadCourses.bind(this);
        this.exportRubric = this.exportRubric.bind(this);
        this.reloadAssignments = this.reloadAssignments.bind(this);
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
        if (this.state.bindWithAssignment) {
            if (this.state.needCreateNewAssignment) {
                if (this.state.assignmentName === '') {
                    alert('Assignment name cannot be null')
                    return;
                }
                ApiService.exportRubric(this.state.rubricId, this.state.courseId,
                    window.sessionStorage.getItem("canvasToken"), 'name', this.state.assignmentName).then(res => {
                        window.sessionStorage.removeItem('rubricId');
                        this.props.history.push('/');
                    })
            }
            else {
                if (this.state.assignment === '')
                    alert('Select the assignment you would like to assign this rubric with')
                else if (this.state.assignment[0].rubric_settings !== undefined)
                    alert('selected assignment has already been assigned with other rubric');
                else {
                    ApiService.exportRubric(this.state.rubricId, this.state.courseId,
                        window.sessionStorage.getItem("canvasToken"), 'id', this.state.assignment[0].id).then(res => {
                            window.sessionStorage.removeItem('rubricId');
                            this.props.history.push('/');
                        })
                }
            }
        }
        else //no need to bind with any assignment!
        {
            ApiService.exportRubric(this.state.rubricId, this.state.courseId,
                window.sessionStorage.getItem("canvasToken"), 'name', '').then(res => {
                    window.sessionStorage.removeItem('rubricId');
                    this.props.history.push('/');
                })
        }
    }
    changeCourse = (e) => {
        this.setState({
            courseId: e.target.value
        }, () => {
            this.reloadAssignments();
        });
    }
    reloadAssignments() {
        ApiService.fetchAssignments(this.state.courseId, window.sessionStorage.getItem("canvasToken")).then(res => {
            this.setState({
                assignments: JSON.parse(res.data)
            })
        })
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });
    render() {
        return <Card className="mx-auto mt-3">
            <Card.Body>
                <Card.Title>Export Rubric</Card.Title>
                <Form>
                    <Form.Group as={Row} controlId="selectCourseForm">
                        <Form.Label column md={2}>Select Course</Form.Label>
                        <Col md={10}>
                            <Form.Control as="select" defaultValue="DEFAULT"
                                onChange={(e) => this.changeCourse(e)} >
                                <option value="DEFAULT" disabled>Select a course</option>
                                {
                                    this.state.courses.map(
                                        c => <option value={c.id} key={c.id}>{c.name}</option>)
                                }
                            </Form.Control>
                        </Col>
                    </Form.Group>
                    {this.state.courseId === '' ? '' :
                        <Form.Group as={Row} controlId="bindWithAssignmentOrNot">
                            <Col><Form.Check
                                custom
                                type='checkbox'
                                id='checkbox1'
                                label='Check if want to assign this rubric with an assignment'
                                onClick={() => this.setState({ bindWithAssignment: !this.state.bindWithAssignment })}
                            /></Col>
                        </Form.Group>}
                    {!this.state.bindWithAssignment ? '' :
                        <Form.Group controlId="selectingAssignmentArea">
                            <Form.Group as={Row} controlId="createOrNot">
                                <Col><Form.Check
                                    custom
                                    type='checkbox'
                                    id='checkbox2'
                                    label='Check if want to create new assignment instead of selecting existing one'
                                    onClick={() => this.setState({ needCreateNewAssignment: !this.state.needCreateNewAssignment })}
                                /></Col>
                            </Form.Group>
                            {!this.state.needCreateNewAssignment ?
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
                                </Form.Group> :
                                <Form.Group as={Row} controlId="createAssignmentForm">
                                    <Form.Label column md={2}>New Assignment</Form.Label>
                                    <Col md={10}>
                                        <Form.Control type="text" placeholder="Enter name" name="assignmentName" value={this.state.assignmentName} onChange={this.onChange} />
                                    </Col>
                                </Form.Group>}
                        </Form.Group>}
                    {this.state.courseId === '' ? '' : <Button onClick={this.exportRubric}>Export</Button>}
                </Form>
            </Card.Body>
        </Card>
    }

}

export default ExportRubricComponent;