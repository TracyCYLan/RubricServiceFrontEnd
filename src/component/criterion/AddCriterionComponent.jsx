import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Rating from '../Rating';
import Button from 'react-bootstrap/Button';
import uniqueId from 'react-html-id';
class AddCriterionComponent extends Component {

    constructor(props) {
        super(props);
        uniqueId.enableUniqueIds(this);
        this.state = {
            name: '',
            description: '',
            ratings: [{ id:"123",desc: 'Exceed Expectations', value: 5,  delete: this.deleteRating },
            { id:"144",desc: 'Meet Expectations', value: 3,delete:this.deleteRating },
            { id:"3212",desc: 'Does not Meet Expectations', value: 0, delete:this.deleteRating }],
            message: null
        }
        this.saveCriterion = this.saveCriterion.bind(this);
        this.deleteRating = this.deleteRating.bind(this);
    }
    saveCriterion = (e) => {
        e.preventDefault();
        let criterion = { name: this.state.name, description: this.state.description };
        ApiService.addCriterion(criterion)
            .then(res => {
                this.setState({ message: 'Criterion added successfully.' });
                this.props.history.push('/criteria');
            });
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    addRating = () => {
        var ratings = this.state.ratings;
        ratings.push({ id:12312,desc: '', value: '',isHide:false });
        this.setState({
            ratings: ratings
        });
    }
    deleteRating = (index) => {
        const ratings = this.state.ratings;
        ratings.forEach((r, idx) => {
            if (r["id"] === index){
                ratings.splice(1, 1);
            }
        });
        this.setState({ratings: ratings});
    }
    render() {
        return (
            <div>
                <h2 className="text-center">Add Criterion</h2>
                <form>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" placeholder="name" name="name" className="form-control" value={this.state.name} onChange={this.onChange} />
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <input type="text" placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange} />
                    </div>
                    <Button onClick={this.addRating}>Add new Rating</Button>
                    <div>
                        <Container>
                            <Row>
                                    {

                                        this.state.ratings.map(
                                            rating =>
                                                    <Rating value={rating.value} ratings={this.state.ratings} index={rating.id} delete={rating.delete}>{rating.desc}</Rating>
                                        )
                                    }
                            </Row>
                        </Container>
                    </div>
                    <div>
                        <button className="btn btn-success" onClick={this.saveCriterion}>Add</button> </div>
                </form>
            </div >
        );
    }
}


export default AddCriterionComponent;
