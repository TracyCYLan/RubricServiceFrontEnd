import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Row, Col, Button, CardGroup, Form, Card, Modal } from 'react-bootstrap';
import Rating from '../RatingCards/RatingEdition';
import TagsInput from 'react-tagsinput';
import Autosuggest from 'react-autosuggest';
class EditCriterionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            ratingCount: 0,
            message: '',
            ratings: [],
            tags: [],
            hintTags: [],
            showModal:false
        }
        this.saveCriterion = this.saveCriterion.bind(this);
        this.loadCriterion = this.loadCriterion.bind(this);
        this.deleteRating = this.deleteRating.bind(this);
        this.addRating = this.addRating.bind(this);
        this.editRating = this.editRating.bind(this);
        this.handleTag = this.handleTag.bind(this);
        this.backToListPage = this.backToListPage.bind(this);
    }

    componentDidMount() {
        this.loadCriterion();
    }

    loadCriterion() {
        ApiService.fetchCriterionById(window.localStorage.getItem("criterionId"))
            .then((res) => {
                let criterion = res.data;
                this.setState({
                    id: criterion.id,
                    name: criterion.name,
                    description: criterion.description,
                    ratings: criterion.ratings,
                    tags: criterion.tags.map(t => t.name)
                })
            });
        ApiService.fetchTags()
            .then((res) => {
                this.setState({
                    hintTags: res.data
                })
            });
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    addRating = () => {
        var ratings = this.state.ratings;
        //assume maximum rating num till 10
        if(ratings.length>=21)
            return;
        ratings.push({ id: this.state.ratingCount, description: '', value: '', delete: this.deleteRating });
        this.setState({ ratingCount: this.state.ratingCount + 1 });
        this.setState({
            ratings: ratings
        });
    }
    editRating = (input_name, input_value, index) => {
        var ratings = this.state.ratings;
        ratings.map(
            rating => {
                if (rating["id"] === index) {
                    rating[input_name] = input_value;
                }
                return rating;
            }
        )
        this.setState({ ratings: ratings });
    }
    deleteRating = (index) => {
        this.setState({
            ratings: this.state.ratings.filter(rating => rating.id !== index)
        })
    }
    handleTag(value) {
        this.setState({ tags: value });
    }
    backToListPage =(e) =>this.props.history.push('/criteria');
    saveCriterion = (e) => {
        e.preventDefault();
        let criterion = { id: this.state.id, name: this.state.name, description: this.state.description };
        ApiService.editCriterion(criterion, this.state.ratings, this.state.tags)
            .then(res => {
                this.setState({ message: 'Criterion updated successfully.' });
                this.props.history.push('/criteria');
            });
    }

    render() {
        const getHintTags = this.state.hintTags;
        function autocompleteRenderInput({ addTag, ...props }) {
            const handleOnChange = (e, { newValue, method }) => {
                if (method === 'enter') {
                    e.preventDefault()
                } else {
                    props.onChange(e)
                }
            }

            const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
            const inputLength = inputValue.length
            let suggestions = getHintTags.filter(t => t.name.toLowerCase().slice(0, inputLength) === inputValue)
            return (
                <Autosuggest
                    ref={props.ref}
                    suggestions={suggestions}
                    shouldRenderSuggestions={(value) => value && value.trim().length > 0}
                    getSuggestionValue={(suggestion) => suggestion.name}
                    renderSuggestion={(suggestion) => <span>{suggestion.name}</span>}
                    inputProps={{ ...props, onChange: handleOnChange }}
                    onSuggestionSelected={(e, { suggestion }) => {
                        addTag(suggestion.name)
                    }}
                    onSuggestionsClearRequested={() => { }}
                    onSuggestionsFetchRequested={() => { }}
                />
            )
        }
        return (
            [
                <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure you want to leave this page?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>The modification will not be saved</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger" onClick={() => this.backToListPage()}>
                            Leave
                    </Button>
                        <Button variant="outline-secondary" onClick={() => this.setState({ showModal: false })}>
                            Cancel
                    </Button>
                    </Modal.Footer>
                </Modal>,
                <Card className="mx-auto mt-2" style={{ width: '95%' }}>
                    <Card.Body>
                        <Card.Title>Edit Criterion</Card.Title>
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
                            <fieldset>
                                <Form.Group as={Row}>
                                    <Form.Label as="legend" column md={2}>Tags</Form.Label>
                                    <Col md={10}>
                                        <TagsInput renderInput={autocompleteRenderInput} inputProps={{ placeholder: 'Enter to add a tag' }} value={this.state.tags} onChange={(v) => this.handleTag(v)} onlyUnique={true} />
                                    </Col>
                                </Form.Group>
                            </fieldset>
                            <Form.Group as={Row}>
                                <Form.Label column lg={10}>Criterion Ratings:</Form.Label>
                            </Form.Group>
                            <Form.Group>
                                {
                                    <CardGroup>
                                        {
                                            this.state.ratings.map(
                                                rating =>
                                                    <Rating key={rating.id} value={rating.value} index={rating.id} edit={this.editRating} delete={this.deleteRating}>{rating.description}</Rating>
                                            )
                                        }
                                        <Button variant="secondary" onClick={this.addRating}>+</Button>
                                    </CardGroup>
                                }
                            </Form.Group>
                            <Button variant="outline-secondary" onClick={this.saveCriterion}>Save</Button>
                            <Button variant="outline-secondary ml-1" onClick={() => { this.setState({ showModal: true })}}>Cancel</Button>
                        </Form>
                    </Card.Body>
                </Card>
            ]
        );
    }
}

export default EditCriterionComponent;