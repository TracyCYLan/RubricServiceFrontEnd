import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Rating from '../RatingCards/RatingEdition';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
class EditCriterionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            ratingCount:0,
            message: '',
            ratings: [],
            tags:[]
        }
        this.saveCriterion = this.saveCriterion.bind(this);
        this.loadCriterion = this.loadCriterion.bind(this);
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
                    tags:criterion.tags
                })
            });
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    addRating = () => {
        var ratings = this.state.ratings;
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
    addTag = () => {
        var tags = this.state.tags;
        tags.push({ id: this.state.tagCount, name: '' });
        this.setState({ tagCount: this.state.tagCount + 1 });
        this.setState({
            tags: tags
        });
    }
    editTag = (e, index) => {
        this.setState({ [e.target.name]: e.target.value });
        var tags = this.state.tags;
        tags.map(
            tag => {
                if (tag["id"] === index) {
                    tag["name"] = e.target.value;
                }
                return tag;
            }
        )
        this.setState({ tags: tags });

    }
    deleteTag = (index) => {
        this.setState({
            tags: this.state.tags.filter(tag => tag.id !== index)
        })
    }
    saveCriterion = (e) => {
        e.preventDefault();
        let criterion = { id: this.state.id, name: this.state.name, description: this.state.description};
        ApiService.editCriterion(criterion,this.state.ratings,this.state.tags)
            .then(res => {
                this.setState({ message: 'Criterion updated successfully.' });
                this.props.history.push('/criteria');
            });
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Edit Criterion</h2>
                <form>
                    <Table responsive="lg" hover="true" >
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td><input type="text" placeholder="name" name="name" className="form-control" value={this.state.name} onChange={this.onChange} /></td>
                            </tr>
                            {
                                <tr>
                                    <th>Description</th>
                                    <td><input placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange} /></td>
                                </tr>
                            }
                            <tr>
                                <th>Tags: <Button variant="info" onClick={this.addTag}>Add Tag</Button> </th>
                                <Container>
                                    {
                                        this.state.tags.map(
                                            tag =>
                                                <Row>
                                                    <td><input type="text" name="tagname" className="form-control" value={tag.name} onChange={(e) => {this.editTag(e, tag.id)}} /></td>
                                                    <td><Button size="sm" variant="warning" onClick={() => this.deleteTag(tag.id)}>Remove</Button></td>
                                                </Row>
                                        )
                                    }
                                </Container>
                            </tr>
                        </tbody>
                    </Table>
                    <Button onClick={this.addRating}>Add new Rating</Button>
                    {
                        <Container>
                            <Row>
                                {
                                    this.state.ratings.map(
                                        rating =>
                                            <Rating key={rating.id} value={rating.value} index={rating.id} edit={this.editRating} delete={this.deleteRating}>{rating.description}</Rating>
                                    )
                                }
                            </Row>
                        </Container>
                    }
                    <button className="btn btn-success" onClick={this.saveCriterion}>Save</button>
                </form>
            </div>
        );
    }
}

export default EditCriterionComponent;