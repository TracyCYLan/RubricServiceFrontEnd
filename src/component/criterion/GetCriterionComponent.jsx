import React, { Component } from 'react'
import ApiService from "../../service/ApiService";

class GetCriterionComponent extends Component {

    constructor(props){
        super(props);
        this.state ={
            id: '',
            name:'',
            description:'',
            message:''
        }
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


    render() {
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th className="hidden">Id</th>
                            <th>Name</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                                    <tr key={this.state.id}>
                                        <td>{this.state.name}</td>
                                        <td>{this.state.description}</td>
                                        <td>
                                            <button className="btn btn-success" onClick={() => this.deleteCrtierion(this.state.id)}> Delete</button>
                                            <button className="btn btn-success" onClick={() => this.editCriterion(this.state.id)} style={{ marginLeft: '20px' }}> Edit</button>
                                        </td>
                                    </tr>
                        }
                    </tbody>
                </table>

            </div>
        );
    }

}

export default GetCriterionComponent;