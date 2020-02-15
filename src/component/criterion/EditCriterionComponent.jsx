import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Rating from '../RatingEdition';
// import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
class EditCriterionComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: '',
            name: '',
            description: '',
            message: '',
            ratings:[]
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

    saveCriterion = (e) => {
        e.preventDefault();
        let criterion = { id: this.state.id, name: this.state.name, description: this.state.description };
        ApiService.editCriterion(criterion)
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
                    {
                    <Container>
                        <Row>
                            {
                                this.state.ratings.map(
                                    rating =>
                                        <Rating key={rating.id} value={rating.value} index={rating.id}>{rating.description}</Rating>
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