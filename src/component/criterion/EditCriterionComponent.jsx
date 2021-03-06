import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Row, Col, Button, CardGroup, Form, Card, Modal, Breadcrumb } from 'react-bootstrap';
import Rating from '../RatingCards/RatingEdition';
import TagsInput from 'react-tagsinput';
import Autosuggest from 'react-autosuggest';
import RichTextEditor from 'react-rte';
class EditCriterionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: RichTextEditor.createEmptyValue(),
            publishDate: '',
            ratingCount: 'r0',
            message: '',
            ratings: [],
            tags: [],
            hintTags: [],
            showModal: false
        }
        this.saveCriterion = this.saveCriterion.bind(this);
        this.loadCriterion = this.loadCriterion.bind(this);
        this.deleteRating = this.deleteRating.bind(this);
        this.addRating = this.addRating.bind(this);
        this.editRating = this.editRating.bind(this);
        this.handleTag = this.handleTag.bind(this);
        this.getCriterion = this.getCriterion.bind(this);
        this.richTextonChange = this.richTextonChange.bind(this);
    }

    componentDidMount() {
        this.loadCriterion();
    }

    loadCriterion() {
        ApiService.fetchCriterionById(window.sessionStorage.getItem("criterionId"))
            .then((res) => {
                let criterion = res.data;
                this.setState({
                    id: criterion.id,
                    name: criterion.name,
                    description: RichTextEditor.createValueFromString(criterion.description,'html'),
                    // publishDate: criterion.publishDate,
                    publishDate: criterion.publishDate === null ? '' : new Date(criterion.publishDate).toLocaleDateString('fr-CA'),
                    ratings: criterion.ratings,
                    tags: criterion.tags.map(t => t.value)
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

    richTextonChange = (description) => {
        this.setState({ description });
        if (this.props.onChange) {
            this.props.onChange(
                description.toString('html')
            );
        }
    };
    addRating = () => {
        var ratings = this.state.ratings;
        //assume maximum rating num till 10
        if (ratings.length >= 21)
            return;
        ratings.push({ id: this.state.ratingCount, description: '', value: 0 });
        let num = this.state.ratingCount.substr(1);
        this.setState({ ratingCount: 'r' + (+num + 1) });
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
    saveCriterion = (e) => {
        e.preventDefault();
        let criterion = {
            id: this.state.id,
            name: this.state.name,
            description: this.state.description.toString('html'),
            publishDate: this.state.publishDate,
            reusable: true
        };
        ApiService.editCriterion(criterion, this.state.ratings, this.state.tags)
            .then(res => {
                this.setState({ message: 'Criterion updated successfully.' });
                this.props.history.push('/criteria');
            });
    }
    getCriterion() {
        window.sessionStorage.setItem("criterionId", this.state.id);
        this.props.history.push('/criterion');
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
            let suggestions = getHintTags.filter(t => t.value.toLowerCase().slice(0, inputLength) === inputValue)
            return (
                <Autosuggest
                    ref={props.ref}
                    suggestions={suggestions}
                    shouldRenderSuggestions={(value) => value && value.trim().length > 0}
                    getSuggestionValue={(suggestion) => suggestion.value}
                    renderSuggestion={(suggestion) => <span>{suggestion.value}</span>}
                    inputProps={{ ...props, onChange: handleOnChange }}
                    onSuggestionSelected={(e, { suggestion }) => {
                        addTag(suggestion.value)
                    }}
                    onSuggestionsClearRequested={() => { }}
                    onSuggestionsFetchRequested={() => { }}
                />
            )
        }
        return (
            [
                <Modal key="modal" show={this.state.showModal} onHide={() => this.setState({ showModal: false })} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure you want to leave this page?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>The modification will not be saved</Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger" onClick={this.getCriterion}>
                            Leave
                    </Button>
                        <Button variant="outline-secondary" onClick={() => this.setState({ showModal: false })}>
                            Cancel
                    </Button>
                    </Modal.Footer>
                </Modal>,
                <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                    <Breadcrumb.Item onClick={()=>this.props.history.push('/criteria')}>Criteria</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={this.getCriterion}>View Criterion</Breadcrumb.Item>
                    <Breadcrumb.Item active>Edit Criterion</Breadcrumb.Item>
                </Breadcrumb>,
                <Card key="card" className="mx-auto mt-3">
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
                                    <RichTextEditor
                                        value={this.state.description}
                                        onChange={this.richTextonChange}
                                    />
                                    {/* <Form.Control as="textarea" placeholder="description" name="description" value={this.state.description} onChange={this.onChange} /> */}
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="formGridDate">
                                <Form.Label column md={2}>Publish Date</Form.Label>
                                <Col md={10}>
                                    <Form.Control type="date"
                                        name="publishDate"
                                        value={this.state.publishDate}
                                        onChange={this.onChange} />
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
                            <Button variant="outline-secondary ml-1" onClick={() => { this.setState({ showModal: true }) }}>Cancel</Button>
                        </Form>
                    </Card.Body>
                </Card>
            ]
        );
    }
}

export default EditCriterionComponent;