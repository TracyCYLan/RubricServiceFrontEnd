import React, { Component } from 'react'
import ApiService from "../service/CanvasApiService";
import { Button, Card, Form, Row, Col } from 'react-bootstrap'; //,Row, Col, Button, CardGroup, Form, Card
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
class ImportCriterionComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: null,
            courseId: '',
            courses: [],
            criteria: [],
            criterion: ''
        }
        this.loadCourses = this.loadCourses.bind(this);
        this.importCriterion = this.importCriterion.bind(this);
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
    importCriterion = (e) => {
        if (this.state.criterion[0] === undefined) {
            alert("you need to select one criterion to import!");
        }
        else {
            e.preventDefault();
            ApiService.importCriterion(this.state.criterion[0].outcome.id, window.sessionStorage.getItem("canvasToken")).then(res => {
                this.props.history.push('/criteria')
            })
        }
    }
    reloadCriteria() {
        ApiService.fetchCriteria(this.state.courseId, window.sessionStorage.getItem("canvasToken")).then(res => {
            this.setState({
                criteria: JSON.parse(res.data)
            })
        })
    }
    changeCourse = (e) => {
        this.setState({
            courseId: e.target.value
        }, () => {
            this.reloadCriteria();
        });
    }
    render() {
        return <Card className="mx-auto mt-3">
            <Card.Body>
                <Card.Title>Import Criterion</Card.Title>
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
                        <Form.Group as={Row} controlId="selectOutcomeForm">
                            <Form.Label column md={2}>Select Outcome</Form.Label>
                            <Col md={10}>
                                <Typeahead
                                    {...this.state.criteria}
                                    id="import-outcome-box"
                                    onChange={criterion => this.setState({ criterion })}
                                    options={this.state.criteria}
                                    labelKey={(option) => option.outcome.title}
                                    placeholder="Select an outcome"
                                />
                            </Col>
                        </Form.Group>}
                    {this.state.criterion === '' ? '' : <Button onClick={this.importCriterion}>Import</Button>}
                </Form>
            </Card.Body>
        </Card>
    }

}

export default ImportCriterionComponent;