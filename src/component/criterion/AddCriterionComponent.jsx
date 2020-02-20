import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Rating from '../RatingCards/RatingEdition';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import uniqueId from 'react-html-id';
class AddCriterionComponent extends Component {

    constructor(props) {
        super(props);
        uniqueId.enableUniqueIds(this);
        this.state = {
            name: this.props.location.state.name,
            description: this.props.location.state.description,
            count: 0, //counting for ratingId
            publishDate: this.props.location.state.publishDate,
            tags: this.props.location.state.tags,
            ratings: this.props.location.state.ratings,
            message: null
        }

        this.saveCriterion = this.saveCriterion.bind(this);
        this.deleteRating = this.deleteRating.bind(this);
        this.addRating = this.addRating.bind(this);
        this.editRating = this.editRating.bind(this);
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
        ratings.push({ id: this.state.count, description: '', value: '', delete: this.deleteRating });
        this.setState({ count: this.state.count + 1 });
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
    render() {
        return (
            <div>
                <h2 className="text-center">Add Criterion</h2>
                <form>
                    <Table responsive="lg" hover="true" >
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td><input type="text" placeholder="name" name="name" className="form-control" value={this.state.name} onChange={this.onChange} /></td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td><textarea placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange} /></td>
                            </tr>
                            <tr>
                                <th>Publish Date</th>
                                <td><input type="date" name="publishDate" className="form-control" value={this.state.publishDate} onChange={this.onChange} /></td>
                            </tr>
                        </tbody>
                    </Table>
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
                </form>
            </div >
        );
    }
}


export default AddCriterionComponent;