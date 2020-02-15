import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
class RatingView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: props.index,
            desc: props.children,
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
            <Col lg>
                <Card border="info">
                    <Card.Header as="h5" className="text-center">Rating</Card.Header>
                    <Card.Text>{this.state.desc}</Card.Text>
                    <Card.Footer className="text-center">{this.state.value}</Card.Footer>
                </Card>
            </Col>
        )
    }
}
export default RatingView;