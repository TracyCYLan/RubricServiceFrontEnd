import React, { Component } from 'react'
import ApiService from "../../service/ApiService";

class EditCriterionComponent extends Component {

    constructor(props){
        super(props);
        this.state ={
            id: '',
            name:'',
            description:'',
            message:''
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
                description: criterion.description
                })
            });
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    saveCriterion = (e) => {
        e.preventDefault();
        let criterion = {id: this.state.id, name:this.state.name,description:this.state.description};
        ApiService.editCriterion(criterion)
            .then(res => {
                this.setState({message : 'Criterion updated successfully.'});
                this.props.history.push('/criteria');
            });
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Edit Criterion</h2>
                <form>

                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" placeholder="name" name="name" className="form-control" value={this.state.name} onChange={this.onChange}/>
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <input placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange}/>
                    </div>

                    <button className="btn btn-success" onClick={this.saveCriterion}>Save</button>
                </form>
            </div>
        );
    }
}

export default EditCriterionComponent;