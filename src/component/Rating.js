import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import AddCriterionComponent from './criterion/AddCriterionComponent';
class Rating extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: props.index,
            description: props.children,
            value: props.value,
            ratings: props.ratings,
            delete: props.delete
        }
    }
    delete = (index)  =>{
        // AddCriterionComponent.deleteRating(index);
    }
    render() {
        return (
            <Col lg>
                <Card>
                    <Card.Header><Button onClick={() => this.state.delete(this.state.index)}>Delete</Button></Card.Header>
                    <Card.Text><input type="text" placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange} /></Card.Text>
                    <Card.Text><input type="text" placeholder="value" name="value" className="form-control" value={this.state.value} onChange={this.onChange} /></Card.Text>
                </Card>
            </Col>
        )
    }
}
export default Rating;