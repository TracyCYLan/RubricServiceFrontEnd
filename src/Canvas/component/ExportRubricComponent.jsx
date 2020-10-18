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
            bindWithAssignment: false,
            //for create peer reviews
            groupCategories: [],
            groupCategory: '',
            needCreatePeerReview: false
        }
        this.loadCourses = this.loadCourses.bind(this);
        this.exportRubric = this.exportRubric.bind(this);
        this.reloadAssignments = this.reloadAssignments.bind(this);
        this.loadGroupCategories = this.loadGroupCategories.bind(this);
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
    loadGroupCategories() {
        ApiService.fetchGroupCategories(this.state.courseId, window.sessionStorage.getItem("canvasToken")).then(res => {
            this.setState({
                groupCategories: JSON.parse(res.data)
            })
        })
    }
    exportRubric = (e) => {
        e.preventDefault();
        var obj = '';
        if (this.state.bindWithAssignment) {
            if (this.state.needCreateNewAssignment && this.state.assignmentName === '') {
                alert('Assignment name cannot be null');
                return;
            }
            if (!this.state.needCreateNewAssignment && this.state.assignment === '') {
                alert('Select the assignment you would like to assign this rubric with');
                return;
            }
            if (!this.state.needCreateNewAssignment && this.state.assignment[0].rubric_settings !== undefined) {
                alert('selected assignment has already been assigned with other rubric');
                return;
            }
            if (this.state.needCreatePeerReview && this.state.groupCategory === '') {
                alert('need to select group set if want to assign intra-group peer reviews');
                return;
            }
            if (this.state.needCreateNewAssignment)
                obj = { 'name': this.state.assignmentName, 'group_category_id': this.state.groupCategory }
            else
                obj = { 'id': this.state.assignment[0].id, 'group_category_id': this.state.groupCategory }
        }
        ApiService.exportRubric(this.state.rubricId, this.state.courseId,
            window.sessionStorage.getItem("canvasToken"), obj);
        alert('this might take a while to process')
        window.sessionStorage.removeItem('rubricId');
        this.props.history.push('/');
    }
    changeCourse = (e) => {
        this.setState({
            courseId: e.target.value
        }, () => {
            this.reloadAssignments();
            this.loadGroupCategories();
        });
    }
    changeGroupCategory = (e) => {
        this.setState({
            groupCategory: e.target.value
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
                            <Form.Group as={Row} controlId="checkifassignPeerReview">
                                <Col><Form.Check
                                    custom
                                    type='checkbox'
                                    id='checkbox3'
                                    label='Check if this is a group project and you would like to create intra-group peer reviews'
                                    onClick={() => this.setState({ needCreatePeerReview: !this.state.needCreatePeerReview })}
                                /></Col>
                            </Form.Group>
                            {!this.state.needCreatePeerReview ? '' :
                                <Form.Group as={Row} controlId="selectGroupCategory">
                                    <Form.Label column md={2}>Select Group Set</Form.Label>
                                    <Col md={10}>
                                        <Form.Control as="select" defaultValue="DEFAULT"
                                            onChange={(e) => this.changeGroupCategory(e)} >
                                            <option value="DEFAULT" disabled>Select a group set</option>
                                            {
                                                this.state.groupCategories.map(
                                                    gc => <option value={gc.id} key={gc.id}>{gc.name}</option>)
                                            }
                                        </Form.Control>
                                    </Col>
                                </Form.Group>
                            }
                        </Form.Group>}
                    {this.state.courseId === '' ? '' : <Button onClick={this.exportRubric}>Export</Button>}
                </Form>
            </Card.Body>
        </Card>
    }

}

export default ExportRubricComponent;