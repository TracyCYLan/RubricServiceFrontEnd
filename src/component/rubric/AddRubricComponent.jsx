import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Row, Col, Button, CardGroup, Form, Card } from 'react-bootstrap';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import RatingV from '../RatingCards/RatingView';
import RatingE from '../RatingCards/RatingEdition';
class AddRubricComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            criteriaCount: 'c0', //count how many criteria for this rubric
            publishDate: '',
            suggestionCriteria: [],//for autocomplete
            resetText: true, //will change its value everytime we click import button. this prop will help us to clear the autocomplete field
            importedCriterion: '',//the certain criterion we just select in the autocomplete box
            importedCriteria: [], //criteria which is already existed
            criteria: [], //criteria created by(with) rubric
            openAutoComplete:false,
            message: null
        }
        this.saveRubric = this.saveRubric.bind(this);
        this.addCriterionBlock = this.addCriterionBlock.bind(this);
        this.deleteCriterionBlock = this.deleteCriterionBlock.bind(this);
        this.importCriterion = this.importCriterion.bind(this);
        this.deleteExistedCriterion = this.deleteExistedCriterion.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.editRating = this.editRating.bind(this);
        this.deleteRating = this.deleteRating.bind(this);
        this.addRating = this.addRating.bind(this);
        this.handleCriterionChange = this.handleCriterionChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }
    componentDidMount() {
        //if we passed default value to this page: (i.e., copy original one to add)
        if (typeof (this.props.location.state) !== 'undefined') {
            this.setState({
                name: this.props.location.state.name,
                description: this.props.location.state.description,
                criteria: this.props.location.state.criteria,
                importedCriteria: this.props.location.state.importedCriteria
            })
        }
        ApiService.fetchCriteria()
            .then((res) => {
                this.setState({
                    suggestionCriteria: res.data
                })
            })
    }
    addCriterionBlock = () => {
        var criteria = this.state.criteria;
        // //assume maximum criteria num till 10
        // if (criteria.length >= 10)
        //     return;
        criteria.push({
            id: this.state.criteriaCount,
            name: '',
            description: '',
            ratingCount: 'r0',
            ratings: [{ id: 'id-default-1', description: 'Exceed Expectations', value: 5 },
            { id: 'id-default-2', description: 'Meet Expectations', value: 3 },
            { id: 'id-default-3', description: 'Does not Meet Expectations', value: 0 }],
        });
        let num = this.state.criteriaCount.substr(1);
        this.setState({ criteriaCount: 'c' + (+num + 1) });
        this.setState({
            criteria: criteria
        });
    }
    deleteCriterionBlock = (criterionId) => {
        this.setState({
            criteria: this.state.criteria.filter(c => c.id !== criterionId)
        })
    }
    importCriterion = () => {
        //so far allow one criterion exists only once
        //import the autocomplete criterion into array
        if (this.state.importedCriterion === '')
            alert("You need to select a Criterion to import")
        else {
            let importedCriteria = this.state.importedCriteria;
            if (!importedCriteria.includes(this.state.importedCriterion)) {
                importedCriteria.push(this.state.importedCriterion);
                this.setState({
                    importedCriteria: importedCriteria,
                    importedCriterion: '',
                    resetText: !this.state.resetText
                });
            }
            else {
                this.setState({
                    importedCriterion: '',
                    resetText: !this.state.resetText
                })
            }
        }
    }
    deleteExistedCriterion = (criterionId) => {
        this.setState({
            importedCriteria: this.state.importedCriteria.filter(c => c.id !== criterionId)
        })
    }

    saveRubric = (e) => {
        e.preventDefault();
        let rubric = {
            name: this.state.name,
            description: this.state.description,
            publishDate: this.state.publishDate
        };
        ApiService.addRubric(rubric, this.state.criteria, this.state.importedCriteria)
            .then(res => {
                this.setState({ message: 'Rubric added successfully.' });
                this.props.history.push('/rubrics');
            });
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });


    handleChange(e, value) {
        //handleChange of autocomplete input box
        //value is a Criterion object
        if (value !== null) {
            this.setState({
                importedCriterion: value
            });
        }
    }
    handleCriterionChange = (input_name, input_value, index) => {
        var criteria = this.state.criteria;
        criteria.map(
            c => {
                if (c["id"] === index) {
                    c[input_name] = input_value;
                }
                return c;
            }
        )
        this.setState({ criteria: criteria });
    }

    addRating(criterionId) {
        var criteria = this.state.criteria;
        criteria.map(
            c => {
                if (c['id'] === criterionId) {
                    var ratings = c['ratings'];
                    if (ratings.length >= 21)
                        return c;
                    ratings.push({ id: c.ratingCount, description: '', value: '' });
                    let num = c.ratingCount.substr(1);
                    c['ratingCount'] = 'r' + (+num + 1);
                }
                return c;
            }
        )
        this.setState({ criteria: criteria });
    }

    editRating = (input_name, input_value, index, criterionId) => {
        var criteria = this.state.criteria;
        criteria.map(
            c => {
                if (c["id"] === criterionId) {
                    var ratings = c['ratings'];
                    ratings.map(
                        rating => {
                            if (rating["id"] === index) {
                                rating[input_name] = input_value;
                            }
                            return rating;
                        }
                    )
                }
                return c;
            }
        )
        this.setState({ criteria: criteria });
    }
    deleteRating = (index, criterionId) => {
        var criteria = this.state.criteria;
        criteria.map(
            c => {
                if (c['id'] === criterionId) {
                    c['ratings'] = c.ratings.filter(rating => rating.id !== index)
                }
                return c;
            }
        )
        this.setState({ criteria: criteria });
    }
    onInputChange(event, value, reason) {
        if( value.length >= 2 && reason ==='input') {
            this.setState({
                openAutoComplete: true
            })
        }
        else{
            this.setState({openAutoComplete:false})
        }
      }
    render() {
        return (
            <Card className="mx-auto mt-3" style={{ width: '95%' }}>
                <Card.Body>
                    <Card.Title>Add Rubric</Card.Title>
                    <Form>
                        <Form.Group as={Row} controlId="formGridName">
                            <Form.Label column md={2}>Name</Form.Label>
                            <Col md={10}>
                                <Form.Control type="text" placeholder="Enter name" name="name" value={this.state.name} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridDescription">
                            <Form.Label column md={2}>Description</Form.Label>
                            <Col md={10}>
                                <Form.Control type="textarea" placeholder="description" name="description" value={this.state.description} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridDate">
                            <Form.Label column md={2}>Publish Date</Form.Label>
                            <Col md={10}>
                                <Form.Control type="date" name="publishDate" value={this.state.publishDate} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridCriteriaImport">
                            <Form.Label column lg={2}>Criteria</Form.Label>
                            <Col md={10}>
                                <div class="input-group">
                                    <Autocomplete
                                        key={this.state.resetText}
                                        onInputChange={this.onInputChange}
                                        open={this.state.openAutoComplete}
                                        options={this.state.suggestionCriteria}
                                        getOptionLabel={option => option.name}
                                        style={{ width: 300 }}
                                        onChange={this.handleChange}
                                        renderInput={params =>
                                            <TextField {...params}
                                                variant="outlined"
                                                onChange={this.handleChange}
                                            />}
                                    />
                                    <Button variant="outline-info ml-2 mt-2" style={{ height: '80%' }} onClick={this.importCriterion}>Import</Button>
                                </div>
                            </Col>
                            <Button variant="outline-info ml-2" onClick={this.addCriterionBlock}>Add new Criterion</Button>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridEditCriteria">
                            <Col>
                                {this.state.criteria.map(
                                    c => <Card className="mb-2" border="dark">
                                        <Card.Body>
                                            <Button className="float-right" variant="outline-danger"
                                                size="sm" onClick={() => this.deleteCriterionBlock(c.id)}>x</Button>
                                            <Card.Text>
                                                <Form.Label column lg={2}>Criterion Name</Form.Label>
                                                <Col md={10}>
                                                    <Form.Control type="text"
                                                        placeholder="Enter criterion name"
                                                        name="name" value={c.name}
                                                        onChange={e => this.handleCriterionChange(e.target.name, e.target.value, c.id)}
                                                    />
                                                </Col>
                                            </Card.Text>
                                            <Card.Text>
                                                <Form.Label column lg={2}>Description</Form.Label>
                                                <Col sm={10}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="description of this criterion"
                                                        name="description"
                                                        value={c.description}
                                                        onChange={e => this.handleCriterionChange(e.target.name, e.target.value, c.id)} />
                                                </Col>
                                            </Card.Text>
                                            <Card.Text>
                                                <Form.Label column lg={2}>Ratings:</Form.Label>
                                                <Col>
                                                    <CardGroup>
                                                        {
                                                            c.ratings.map(
                                                                rating => <RatingE key={rating.id} value={rating.value} index={rating.id} edit={this.editRating} delete={this.deleteRating} criterionId={c.id}>{rating.description}</RatingE>
                                                            )
                                                        }
                                                        <Button variant="secondary" onClick={() => this.addRating(c.id)}>+</Button>
                                                    </CardGroup>
                                                </Col>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                )}
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridShowExistedCriterion">
                            <Col>
                                {this.state.importedCriteria.map(
                                    c => <Card className="mb-2">
                                        <Card.Header className="text-primary">
                                            {c.name}
                                            <Button className="float-right" variant="outline-danger" size="sm" onClick={() => this.deleteExistedCriterion(c.id)}>x</Button>
                                        </Card.Header>
                                        <CardGroup>
                                            <Card>
                                                <Card.Body>
                                                    <Card.Text>{c.description}</Card.Text>
                                                </Card.Body>
                                            </Card>
                                            <CardGroup>
                                                {c.ratings.map(
                                                    rating => <RatingV key={rating.id} value={rating.value} index={rating.id}>{rating.description}</RatingV>
                                                )}
                                            </CardGroup>
                                        </CardGroup>
                                    </Card>
                                )}
                            </Col>
                        </Form.Group>
                        <div>
                            <Button variant="outline-secondary" onClick={this.saveRubric}>Create</Button> </div>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}

export default AddRubricComponent;