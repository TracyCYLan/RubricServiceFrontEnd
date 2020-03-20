import React, { Component } from 'react'
import { Button, Card, CardGroup } from 'react-bootstrap';
import RatingV from '../../RatingCards/RatingView';
class ViewCriterionCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            criterionId: props.index,
            name: props.name,
            description: props.description,
            ratings: props.ratings,
            reusable:props.reusable,
            deleteExistedCriterion:props.deleteExistedCriterion,
            changeToEditCriterion:props.changeToEditCriterion
        }
    }
    render() {
        return (
            <Card className="mb-2">
                <Card.Header className="text-primary">
                    {this.state.name}
                    {this.state.reusable?
                    <Button variant="outline-danger float-right" size="sm" onClick={() => this.state.deleteExistedCriterion(this.state.criterionId)}>x</Button>
                    :[<Button variant="outline-warning float-right" size="sm" onClick={() =>this.state.changeToEditCriterion(this.state.criterionId)}>Edit</Button>,
                    <Button variant="outline-danger float-right ml-1" size="sm" onClick={() => this.state.deleteExistedCriterion(this.state.criterionId)}>x</Button>]
                    }
                    
                </Card.Header>
                <CardGroup>
                    <Card>
                        <Card.Body>
                            <Card.Text>{this.state.description}</Card.Text>
                        </Card.Body>
                    </Card>
                    <CardGroup>
                        {this.state.ratings.map(
                            rating => <RatingV key={rating.id} value={rating.value} index={rating.id}>{rating.description}</RatingV>
                        )}
                    </CardGroup>
                </CardGroup>
            </Card>
        )
    }
}
export default ViewCriterionCard;