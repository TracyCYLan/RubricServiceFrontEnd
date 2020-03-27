import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Card, Breadcrumb } from 'react-bootstrap';
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
        this.loadTag(window.localStorage.getItem("tagId"));
    }

    loadTag(id) {
        ApiService.fetchhTagById(id)
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
                <Breadcrumb className="mx-auto mt-2">
                    <Breadcrumb.Item href="tags">All Tags</Breadcrumb.Item>
                    <Breadcrumb.Item active>{this.state.tag.value}</Breadcrumb.Item>
                </Breadcrumb>,
                <Card.Title as="h3" className="text-info mt-3 mb-3">Criteria using {this.state.tag.value}:
                </Card.Title>,
                <Card.Subtitle>
                    Total {this.state.tag.count} criteria match
                </Card.Subtitle>
                ,
                <Posts
                    posts={this.state.criteria}
                    loading={this.state.loading}
                    edit={this.editCriterion}
                    copynedit={this.copyneditCriterion}
                    get={this.getCriterion}
                    getTag={this.loadTag}
                    category='criterion' />
            ]
        );
    }

}

export default GetTagComponent;