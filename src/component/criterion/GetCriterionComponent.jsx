import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, Card, Badge, CardGroup } from 'react-bootstrap';
import Rating from '../RatingCards/RatingView';
class GetCriterionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            ratings: [],
            message: '',
            published: '',
            publishDate: '',
            tags: []
        }
        this.loadCriterion = this.loadCriterion.bind(this);
        this.copyneditCriterion = this.copyneditCriterion.bind(this);
        this.deleteCriterion = this.deleteCriterion.bind(this);
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
                    published: criterion.published,
                    publishDate: criterion.publishDate,
                    tags: criterion.tags
                })
            });
    }
    copyneditCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        //send exactly the same content to add-criterion
        this.props.history.push(
            {
                pathname: '/add-criterion',
                state: {
                    name: this.state.name + "_copy",
                    description: this.state.description,
                    ratings: this.state.ratings,
                    published: this.state.published,
                    publishDate: this.state.publishDate,
                    tags: this.state.tags.map(t => t.name)//send only string array
                }
            }
        );
    }
    editCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        this.props.history.push('/edit-criterion');
    }
    deleteCriterion(id) {
        ApiService.deleteCriterion(id)
            .then(res => {
                this.setState({ message: 'Criterion deleted successfully.' });
                this.props.history.push('/criteria');
            })
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            <Card className="mx-auto" style={{ marginTop: '1rem', width: '95%' }}>
                <Card.Body>
                    <Card.Title as="h3">{this.state.name}
                        <Button className="float-right" variant="outline-danger" hidden={this.state.published} onClick={() => this.deleteCriterion(this.state.id)} style={{marginLeft:'1rem'}}>Delete</Button>
                        <Button className="float-right" variant="outline-secondary" hidden={!this.state.published} onClick={() => this.copyneditCriterion(this.state.id)} style={{marginLeft:'1rem'}}>Copy</Button>
                        <Button className="float-right" variant="outline-secondary" hidden={this.state.published} onClick={() => this.editCriterion(this.state.id)} style={{marginLeft:'1rem'}}>Edit</Button>
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{this.state.description}</Card.Subtitle>
                    <Card.Text>
                        {
                            this.state.tags.map(
                                function (tag) {
                                    return ([' ', <Badge variant="info">{tag.name}</Badge>])
                                }
                            )
                        }
                    </Card.Text>
                    {
                        <CardGroup>
                            {
                                this.state.ratings.map(
                                    rating =>
                                        <Rating key={rating.id} value={rating.value} index={rating.id}>{rating.description}</Rating>
                                )
                            }
                        </CardGroup>
                    }
                </Card.Body>
            </Card>
        );
    }

}

export default GetCriterionComponent;