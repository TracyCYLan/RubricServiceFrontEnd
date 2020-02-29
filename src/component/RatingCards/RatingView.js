import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
class RatingView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: props.index,
            description: props.children,
            value: props.value,
            delete: props.delete,
            edit: props.edit
        }
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        //pass the attribute name,attribute updated value, rating index to edit
        this.state.edit(e.target.name, e.target.value, this.state.index);
    }


    render() {
        return (
                <Card border="dark">
                    <Card.Body>
                    <Card.Text className="text-primary">{this.state.description}</Card.Text>
                    </Card.Body>
                    <Card.Text className="text-center">{this.state.value} points</Card.Text>
                </Card>
        )
    }
}
export default RatingView;