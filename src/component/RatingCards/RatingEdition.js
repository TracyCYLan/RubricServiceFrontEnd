import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
class RatingEdition extends Component {

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
            <Col lg>
                <Card>
                    <form>
                        <Card.Header className="text-right"><Button className="btn btn-warning" onClick={() => this.state.delete(this.state.index)}>Delete</Button></Card.Header>
                        <Card.Text><textarea placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange} /></Card.Text>
                        <Card.Text><input type="text" placeholder="value" name="value" className="form-control" value={this.state.value} onChange={this.onChange} /></Card.Text>
                    </form>
                </Card>
            </Col>
        )
    }
}
export default RatingEdition;