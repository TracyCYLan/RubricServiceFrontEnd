import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Row, Col, Button, Container,Form, Card } from 'react-bootstrap';
import Rating from '../RatingCards/RatingEdition';
import uniqueId from 'react-html-id';
import TagsInput from 'react-tagsinput';
import Autosuggest from 'react-autosuggest';
class AddCriterionComponent extends Component {

    constructor(props) {
        super(props);
        uniqueId.enableUniqueIds(this);
        this.state = {
            name: this.props.location.state.name,
            description: this.props.location.state.description,
            ratingCount: 0, //counting for ratingId
            ratings: this.props.location.state.ratings,
            publishDate: this.props.location.state.publishDate,
            tags: this.props.location.state.tags,
            tagCount: 1000,//counting for tagId
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
        let criterion = { name: this.state.name, description: this.state.description, publishDate: this.state.publishDate };
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
        ratings.push({ id: this.state.ratingCount, description: '', value: '' });
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
        this.setState({tags:value});
      }
    render() {
        const getHintTags = this.state.hintTags;
        function autocompleteRenderInput ({addTag, ...props}) {
            const handleOnChange = (e, {newValue, method}) => {
              if (method === 'enter') {
                e.preventDefault()
              } else {
                props.onChange(e)
              }
            }
      
            const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
            const inputLength = inputValue.length
            let suggestions = getHintTags.filter(t=>t.name.toLowerCase().slice(0, inputLength) === inputValue)
            return (
                <Autosuggest
                  ref={props.ref}
                  suggestions={suggestions}
                  shouldRenderSuggestions={(value) => value && value.trim().length > 0}
                  getSuggestionValue={(suggestion) => suggestion.name}
                  renderSuggestion={(suggestion) => <span>{suggestion.name}</span>}
                  inputProps={{...props, onChange: handleOnChange}}
                  onSuggestionSelected={(e, {suggestion}) => {
                    addTag(suggestion.name)
                  }}
                  onSuggestionsClearRequested={() => {}}
                  onSuggestionsFetchRequested={() => {}}
                />
              )
            }
        return (
            <Card className="mx-auto" style={{ marginTop: '1rem' , width:'95%'}}>
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
                        <Form.Control type="textarea" placeholder="description" name="description" value={this.state.description} onChange={this.onChange} />
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
                        <TagsInput renderInput={autocompleteRenderInput} inputProps={{placeholder:'Enter to add a tag'}} value={this.state.tags} onChange={(v) => this.handleTag(v)} onlyUnique={true}/> 
                        </Col>
                    </Form.Group>
                </fieldset>
                <Button onClick={this.addRating}>Add new Rating</Button>
                <div>
                    <Container>
                        <Row>
                            {
                                this.state.ratings.map(
                                    rating =>
                                        <Rating key={rating.id} value={rating.value} index={rating.id} delete={this.deleteRating} edit={this.editRating}>{rating.description}</Rating>
                                )
                            }
                        </Row>
                    </Container>
                </div>
                <div>
                    <Button className="btn btn-success" onClick={this.saveCriterion}>Create</Button> </div>
            </Form>
            </Card.Body>
            </Card>
        );
    }
}


export default AddCriterionComponent;