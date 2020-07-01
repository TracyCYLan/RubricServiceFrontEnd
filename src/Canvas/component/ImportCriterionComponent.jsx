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
        if(window.sessionStorage.getItem("canvasToken")===null)
        {
            alert("Need to login on Canvas to import");
            this.props.history.push('/');
        }
        else
        {
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
    importCriterion= (e) => {
        e.preventDefault();
        ApiService.importCriterion(this.state.criterionId,window.sessionStorage.getItem("canvasToken")).then(res=>{
            this.props.history.push('/criteria')
        }
        )
    }
    reloadCriteria() {
        ApiService.fetchCriteria(this.state.courseId,window.sessionStorage.getItem("canvasToken")).then(res => {
            this.setState({
                criteria: JSON.parse(res.data)
            })
        })
    }
    changeCourse = (e) =>{
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
                        <Form.Group as={Row} controlId="selectOutcomeForm">
                            <Form.Label column md={2}>Select Outcome</Form.Label>
                            <Col md={10}>
                                <Form.Control as="select"
                                    onChange={(e) => { this.setState({ criterionId: e.target.value }) }} >
                                    <option value="" disabled selected>Select an outcome</option>
                                    {
                                        this.state.criteria.map(
                                            c => <option value={c.outcome.id}>{c.outcome.title}</option>)
                                    }
                                </Form.Control>
                            </Col>
                        </Form.Group>}
                    {this.state.criterionId === '' ? '' : <Button onClick={this.importCriterion}>Import</Button>}
                </Form>
            </Card.Body>
        </Card>
    }

}

export default ImportCriterionComponent;