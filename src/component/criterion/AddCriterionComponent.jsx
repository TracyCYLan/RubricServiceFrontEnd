import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Rating from '../RatingEdition';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import uniqueId from 'react-html-id';
class AddCriterionComponent extends Component {

    constructor(props) {
        super(props);
        uniqueId.enableUniqueIds(this);
        this.state = {
            name: '',
            description: '',
            count: 0,
            ratings: [{ id: this.nextUniqueId(), desc: 'Exceed Expectations', value: 5 },
            { id: this.nextUniqueId(), desc: 'Meet Expectations', value: 3 },
            { id: this.nextUniqueId(), desc: 'Does not Meet Expectations', value: 0 }],
            message: null
        }
        this.saveCriterion = this.saveCriterion.bind(this);
        this.deleteRating = this.deleteRating.bind(this);
        this.addRating = this.addRating.bind(this);
        this.editRating = this.editRating.bind(this);
    }
    saveCriterion = (e) => {
        e.preventDefault();
        let criterion = { name: this.state.name, description: this.state.description };
        let ratings = this.state.ratings;
        ApiService.addCriterion(criterion, ratings)
            .then(res => {
                this.setState({ message: 'Criterion added successfully.' });
                this.props.history.push('/criteria');
            })
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });
    addRating = () => {
        var ratings = this.state.ratings;
        ratings.push({ id: this.state.count, desc: '', value: '', delete: this.deleteRating });
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
                            {
                                <tr>
                                    <th>Description</th>
                                    <td><textarea placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange} /></td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                    <Button onClick={this.addRating}>Add new Rating</Button>
                    <div>
                        <Container>
                            <Row>
                                {
                                    this.state.ratings.map(
                                        rating =>
                                            <Rating key={rating.id} value={rating.value} index={rating.id} delete={this.deleteRating} edit={this.editRating}>{rating.desc}</Rating>
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