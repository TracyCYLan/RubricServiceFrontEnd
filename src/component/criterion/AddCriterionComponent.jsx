import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Row, Col, Button, CardGroup, Form, Card, Breadcrumb } from 'react-bootstrap';
import Rating from '../RatingCards/RatingEdition';
import TagsInput from 'react-tagsinput';
import Autosuggest from 'react-autosuggest';
class AddCriterionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            ratingCount: 'r0', //counting for ratingId
            ratings: [{ id: 'default-id-1', description: 'Exceed Expectations', value: 5 },
            { id: 'default-id-2', description: 'Meet Expectations', value: 3 },
            { id: 'default-id-3', description: 'Does not Meet Expectations', value: 0 }],
            publishDate: '',
            tags: [],
            hintTags: [],
            message: null
        }
        this.loadHintTags = this.loadHintTags.bind(this);
        this.saveCriterion = this.saveCriterion.bind(this);
        this.deleteRating = this.deleteRating.bind(this);
        this.addRating = this.addRating.bind(this);
        this.editRating = this.editRating.bind(this);
        this.handleTag = this.handleTag.bind(this);
    }
    componentDidMount() {
        //if we passed default value to this page: (i.e., copy original one to add)
        if (typeof (this.props.location.state) !== 'undefined') {
            this.setState({
                name: this.props.location.state.name,
                description: this.props.location.state.description,
                ratings: this.props.location.state.ratings,
                tags: this.props.location.state.tags
            })
        }
        //load suggestions for tags to do autocomplete
        this.loadHintTags();
    }
    loadHintTags() {
        ApiService.fetchTags()
            .then((res) => {
                this.setState({
                    hintTags: res.data
                })
            });
    }
    saveCriterion = (e) => {
        e.preventDefault();
        let criterion = {
            name: this.state.name,
            description: this.state.description,
            publishDate: this.state.publishDate,
            reusable: true
        };
        let ratings = this.state.ratings;
        let tags = this.state.tags;
        ApiService.addCriterion(criterion, ratings, tags)
            .then(res => {
                this.setState({ message: 'Criterion added successfully.' });
                this.props.history.push('/criteria');
            })
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });
    addRating = () => {
        var ratings = this.state.ratings;
        //assume maximum rating num till 21
        if (ratings.length >= 21)
            return;
        ratings.push({ id: this.state.ratingCount, description: '', value: '' });
        let num = this.state.ratingCount.substr(1);
        this.setState({ ratingCount: 'r'+(+num+1)});
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
        return [
            <Breadcrumb className="mx-auto mt-2">
            <Breadcrumb.Item href="criteria">Criteria</Breadcrumb.Item>
            <Breadcrumb.Item active>Add Criterion</Breadcrumb.Item>
          </Breadcrumb>,
            <Card className="mx-auto mt-3">
                <Card.Body>
                    <Card.Title>Add Criterion</Card.Title>
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
                                <Form.Control as="textarea" placeholder="description" name="description" value={this.state.description} onChange={this.onChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formGridDate">
                            <Form.Label column md={2}>Publish Date</Form.Label>
                            <Col md={10}>
                                <Form.Control type="date" name="publishDate" value={this.state.publishDate} onChange={this.onChange} />
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
                            <Form.Label column lg={10}>Criterion Ratings: </Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <CardGroup>
                                {
                                    this.state.ratings.map(
                                        rating =>
                                            <Rating key={rating.id} value={rating.value} index={rating.id} delete={this.deleteRating} edit={this.editRating}>{rating.description}</Rating>
                                    )
                                }
                                <Button variant="secondary" onClick={this.addRating}>+</Button>
                            </CardGroup>
                        </Form.Group>
                        <div>
                            <Button variant="outline-secondary" onClick={this.saveCriterion}>Create</Button> </div>
                    </Form>
                </Card.Body>
            </Card>
        ];
    }
}


export default AddCriterionComponent;