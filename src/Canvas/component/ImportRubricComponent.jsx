import React, { Component } from 'react'
import ApiService from "../service/CanvasApiService";
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
class ImportRubricComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            courseId: '',
            courses: [],
            rubrics: [],
            rubric: ''
        }
        this.loadCourses = this.loadCourses.bind(this);
        this.importRubric = this.importRubric.bind(this);
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
    importRubric = (e) => {
        if(this.state.rubric[0]===undefined)
        {
            alert("you need to select one rubric to import!");
        }
        else
        {
            e.preventDefault();
            ApiService.importRubric(this.state.courseId, this.state.rubric[0].id, window.sessionStorage.getItem("canvasToken")).then(res => {
                this.props.history.push('/rubrics')
            })
        }
        
    }
    reloadRubrics() {
        ApiService.fetchRubrics(this.state.courseId, window.sessionStorage.getItem("canvasToken")).then(res => {
            this.setState({
                rubrics: JSON.parse(res.data)
            })
        })
    }
    changeCourse = (e) => {
        this.setState({
            courseId: e.target.value
        }, () => {
            this.reloadRubrics();
        });
    }
    render() {
        return <Card className="mx-auto mt-3">
            <Card.Body>
                <Card.Title>Import Rubric</Card.Title>
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
                        <Form.Group as={Row} controlId="selectRubricForm">
                            <Form.Label column md={2}>Select Rubric</Form.Label>
                            <Col md={10}>
                                <Typeahead
                                    {...this.state.rubrics}
                                    id="import-rubric-box"
                                    onChange={rubric => this.setState({ rubric })}
                                    options={this.state.rubrics}
                                    labelKey={(option) => option.title}
                                    placeholder="Select a rubric"
                                />
                            </Col>
                        </Form.Group>}
                    {this.state.rubric === '' ? '' : <Button onClick={this.importRubric}>Import</Button>}
                </Form>
            </Card.Body>
        </Card>
    }

}

export default ImportRubricComponent;