import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Card } from 'react-bootstrap';
import Posts from "../pageComponents/Posts";
class GetTagComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tag: '',
            criteria: []
        }
        this.loadTag = this.loadTag.bind(this);
        this.getCriterion = this.getCriterion.bind(this);
    }

    getCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        this.props.history.push('/criterion');
    }
    componentDidMount() {
        this.loadTag();
    }

    loadTag() {
        ApiService.fetchhTagById(window.localStorage.getItem("tagId"))
            .then((res) => {
                this.setState({
                    tag: res.data
                })
                ApiService.fetchCriteriaByTag(res.data.value)
                    .then((res2) => {
                        this.setState({
                            criteria: res2.data
                        })
                    })
            })
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            [
                <Card.Title as="h3" className="text-info mt-3 mb-3">{this.state.tag.value} 
                </Card.Title>,
                <Posts
                    posts={this.state.criteria}
                    loading={this.state.loading}
                    edit={this.editCriterion}
                    copynedit={this.copyneditCriterion}
                    get={this.getCriterion}
                    category='criterion' />
            ]
        );
    }

}

export default GetTagComponent;