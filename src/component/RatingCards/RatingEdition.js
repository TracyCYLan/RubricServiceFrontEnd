import React, { Component } from 'react'
import { Button, Card, Form} from 'react-bootstrap';
class RatingEdition extends Component {

    constructor(props) {
        super(props);
        if(typeof(props.criterionId) ==='undefined'){
            this.state = {
                index: props.index,
                description: props.children,
                value: props.value,
                delete: props.delete,
                edit: props.edit,
                criterionId:''
            }
        }
        else //if we pass rating in addRubric, we need criterionId when edit rating 
        {
            this.state = {
                index: props.index,
                description: props.children,
                value: props.value,
                delete: props.delete,
                edit: props.edit,
                criterionId:props.criterionId,
            }
        }
        this.deleteRating = this.deleteRating.bind(this);
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        //pass the attribute name,attribute updated value, rating index to edit
        if(this.state.criterionId ==='')
            this.state.edit(e.target.name, e.target.value, this.state.index);
        else
            this.state.edit(e.target.name, e.target.value, this.state.index,this.state.criterionId);
    }

    deleteRating = () =>{
        if(this.state.criterionId ==='')
            this.state.delete(this.state.index);
        else 
            this.state.delete(this.state.index,this.state.criterionId);
    }
    render() {
        return (
            <Card>
                <Form>
                    <Button className="float-right" variant="light" size="sm" onClick={this.deleteRating}>x</Button>
                    <Card.Text>
                        <textarea placeholder="description"
                            name="description"
                            className="form-control"
                            value={this.state.description}
                            onChange={this.onChange} 
                            rows="6"/>
                    </Card.Text>
                    <Card.Text class="text-center"><input type="text"
                            placeholder="value"
                            name="value"
                            className="form-control"
                            value={this.state.value}
                            onChange={this.onChange}
                            style={{ width: '30%',display:'inline' }} />
                            <label stlye={{ width: '10%'}}>{'points'}</label>
                    </Card.Text>
                </Form>
            </Card>
        )
    }
}
export default RatingEdition;