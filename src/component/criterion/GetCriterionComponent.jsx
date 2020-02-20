import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Rating from '../RatingCards/RatingView';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
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
            publishDate:'',
            tags:[]
        }
        this.loadCriterion = this.loadCriterion.bind(this);
        this.copyneditCriterion = this.copyneditCriterion.bind(this);
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
                    publishDate:criterion.publishDate,
                    tags:criterion.tags
                })
            });
    }
    copyneditCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        //send exactly the same content to add-criterion
        this.props.history.push(
            {
                pathname: '/add-criterion',
                state:{
                    name:this.state.name,
                    description: this.state.description,
                    ratings: this.state.ratings,
                    published: this.state.published,
                    publishDate:this.state.publishDate,
                    tags:this.state.tags
                }
            }
        );
    }
    editCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        this.props.history.push('/edit-criterion');
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });


    render() {
        return (
            <div>
                <h2 className="text-center">View Criterion</h2>
                <div className="text-right"><Button variant="info" hidden={!this.state.published} onClick={() => this.copyneditCriterion(this.state.id)}>Copy</Button></div>
                <div className="text-right"><Button variant="info" hidden={this.state.published} onClick={() => this.editCriterion(this.state.id)}>Edit</Button></div>
                <Table responsive="lg" hover="true" >
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{this.state.name}</td>
                        </tr>
                        {
                            <tr>
                                <th>Description</th>
                                <td>{this.state.description}</td>
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

            </div>
        );
    }

}

export default GetCriterionComponent;