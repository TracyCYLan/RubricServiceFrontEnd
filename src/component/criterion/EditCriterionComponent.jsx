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
            count:0,
            message: '',
            ratings: []
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
                    ratings: criterion.ratings
                })
            });
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

    saveCriterion = (e) => {
        e.preventDefault();
        let criterion = { id: this.state.id, name: this.state.name, description: this.state.description};
        ApiService.editCriterion(criterion,this.state.ratings)
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