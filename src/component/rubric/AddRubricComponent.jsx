import React, { Component } from 'react'
import ApiService from "../../service/ApiService";

class AddRubricComponent extends Component{

    constructor(props){
        super(props);
        this.state ={
            name: '',
            description:'',
            message: null
        }
        this.saveRubric = this.saveRubric.bind(this);
    }
    saveRubric = (e) => {
        e.preventDefault();
        let rubric = {name: this.state.name, description: this.state.description};
        ApiService.addRubric(rubric)
            .then(res => {
                this.setState({message : 'Rubric added successfully.'});
                this.props.history.push('/rubrics');
            });
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        console.log("12345");
        return(
            <div>
                <h2 className="text-center">Add Rubric</h2>
                <form>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" placeholder="name" name="name" className="form-control" value={this.state.name} onChange={this.onChange}/>
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <input type="text" placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange}/>
                </div>

                <button className="btn btn-success" onClick={this.saveRubric}>Add</button>
            </form>
    </div>
        );
    }
}

export default AddRubricComponent;