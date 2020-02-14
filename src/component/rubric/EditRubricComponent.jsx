import React, { Component } from 'react'
import ApiService from "../../service/ApiService";

class EditRubricComponent extends Component {

    constructor(props){
        super(props);
        this.state ={
            id: '',
            name:'',
            description:'',
            message:''
        }
        this.saveRubric = this.saveRubric.bind(this);
        this.loadRubric = this.loadRubric.bind(this);
    }

    componentDidMount() {
        this.loadRubric();
    }

    loadRubric() {
        ApiService.fetchRubricById(window.localStorage.getItem("rubricId"))
            .then((res) => {
                let rubric = res.data;
                this.setState({
                id: rubric.id,
                name: rubric.name,
                description: rubric.description
                })
            });
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    saveRubric = (e) => {
        e.preventDefault();
        let rubric = {id: this.state.id, name:this.state.name,description:this.state.description};
        ApiService.editRubric(rubric)
            .then(res => {
                this.setState({message : 'Rubric added successfully.'});
                this.props.history.push('/rubrics');
            });
    }

    render() {
        return (
            <div>
                <h2 className="text-center">Edit Rubric</h2>
                <form>

                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" placeholder="name" name="name" className="form-control" defaultValue={this.state.name}/>
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <input placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange}/>
                    </div>

                    <button className="btn btn-success" onClick={this.saveRubric}>Save</button>
                </form>
            </div>
        );
    }
}

export default EditRubricComponent;