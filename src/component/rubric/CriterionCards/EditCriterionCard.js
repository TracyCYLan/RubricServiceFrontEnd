import React, { Component } from 'react'
import { Button, Card, Form, Col, CardGroup } from 'react-bootstrap';
import RatingE from '../../RatingCards/RatingEdition';
import ApiService from '../../../service/ApiService';
class EditCriterionCard extends Component {

    constructor(props) {
        super(props);
        if (props.type === 'new') {
            this.state = {
                criterionId: props.index,
                name: props.name,
                description: props.description,
                publishDate: props.publishDate,
                ratings: props.ratings,
                ratingCount: props.ratingCount,
                deleteCriterionBlock: props.deleteCriterionBlock,
                addCriterionToRubric: props.addCriterionToRubric,
                type: props.type
            }
        }
        else if (props.type === 'update') {
            this.state = {
                criterionId: props.index,
                name: props.name,
                description: props.description,
                publishDate:props.publishDate,
                ratings: props.ratings,
                ratingCount: props.ratingCount,
                deleteCriterionBlock: props.deleteCriterionBlock,
                finishUpdateCriterion:props.finishUpdateCriterion,
                type: props.type
            }
        }
        this.addRating = this.addRating.bind(this);
        this.editRating = this.editRating.bind(this);
        this.deleteRating = this.deleteRating.bind(this);
        this.saveCriterion = this.saveCriterion.bind(this);
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        //pass the attribute name,attribute updated value, criterionId
    }

    addRating = () => {
        var ratings = this.state.ratings;
        //assume maximum rating num till 21
        if (ratings.length >= 21)
            return;
        ratings.push({ id: this.state.ratingCount, description: '', value: '' });
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
    saveCriterion = () => {
        if (this.state.type === 'new') {
            //save this to backend and send the id back to the page calling EditCriteironCard
            let criterion = {
                name: this.state.name,
                description: this.state.description,
                publishDate: this.state.publishDate,
                reusable: false
            }
            ApiService.addCriterion(criterion, this.state.ratings, [])
                .then(res => {
                    this.state.addCriterionToRubric(res.data);//Send criterion id back to rubric  
                })
        }
        else if(this.state.type ==='update')
        {
            let criterion = {
                id:this.state.criterionId,
                name: this.state.name,
                description: this.state.description,
                publishDate: this.state.publishDate,
                reusable: false
            }
            ApiService.editCriterion(criterion,this.state.ratings,[])
            .then(res => {
                this.state.finishUpdateCriterion(this.state.criterionId);//Send criterion id back to rubric  
            })
        }

    }
    render() {
        return (
            <Card className="mb-2" border="dark">
                <Card.Body>
                    <Button className="float-right" variant="outline-danger"
                        size="sm" onClick={this.state.deleteCriterionBlock}>x</Button>
                    <Card.Text>
                        <Form.Label column lg={2}>Criterion Name</Form.Label>
                        <Col md={10}>
                            <Form.Control type="text"
                                placeholder="Enter criterion name"
                                name="name" value={this.state.name}
                                onChange={this.onChange}
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
                                value={this.state.description}
                                onChange={this.onChange} />
                        </Col>
                    </Card.Text>
                    <Card.Text>
                        <Form.Label column lg={2}>Ratings:</Form.Label>
                        <Col>
                            <CardGroup>
                                {
                                    this.state.ratings.map(
                                        rating => <RatingE key={rating.id} value={rating.value} index={rating.id} edit={this.editRating} delete={this.deleteRating} criterionId={this.state.criterionId}>{rating.description}</RatingE>
                                    )
                                }
                                <Button variant="secondary" onClick={this.addRating}>+</Button>
                            </CardGroup>
                        </Col>
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <Button variant="outline-dark float-right" onClick={this.saveCriterion}>Save</Button>
                </Card.Footer>
            </Card>
        )
    }
}
export default EditCriterionCard;