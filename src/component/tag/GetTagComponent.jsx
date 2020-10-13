import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Card, Breadcrumb } from 'react-bootstrap';
import Posts from "../pageComponents/Posts";
const aliceObj = window.sessionStorage.getItem("oidc.user:https://identity.cysun.org:alice-rubric-service-spa");
class GetTagComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tag: '',
            criteria: [],
            loading: false,
            resizeVar: true //dummy value for detecting if window resize
        }
        this.loadTag = this.loadTag.bind(this);
        this.getCriterion = this.getCriterion.bind(this);
        this.editCriterion = this.editCriterion.bind(this);
        this.copyneditCriterion = this.copyneditCriterion.bind(this);
        this.getCriterion = this.getCriterion.bind(this);
        this.publishCriterion = this.publishCriterion.bind(this);
        this.exportPage = this.exportPage.bind(this);
        this.handleWindowResize = this.handleWindowResize.bind(this);
    }

    componentDidMount() {
        this.loadTag(window.sessionStorage.getItem("tagId"));
        window.addEventListener('resize', this.handleWindowResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }
    handleWindowResize() {
        this.setState({ resizeVar: true })
    }

    getCriterion(id) {
        window.sessionStorage.setItem("criterionId", id);
        this.props.history.push('/criterion');
    }

    publishCriterion = (id) => {
        if (aliceObj) {
            ApiService.publishCriterion(id).then(res =>
                this.setState({
                    criteria: this.state.criteria.map(c => {
                        if (c.id === id)
                            return { ...c, publishDate: new Date(), published: true }
                        return c
                    })
                })
            );
        }
        else
            alert('You need to login')

    }
    copyneditCriterion(criterion) {
        //send exactly the same content to add-criterion
        if (aliceObj) {
            this.props.history.push(
                {
                    pathname: '/add-criterion',
                    state: {
                        name: criterion.name + "_copy",
                        description: criterion.description,
                        ratings: criterion.ratings,
                        published: criterion.published,
                        publishDate: criterion.publishDate,
                        tags: criterion.tags.map(t => t.value)//send only string array
                    }
                }
            );
        }
        else
            alert('You need to login')
    }
    editCriterion(id) {
        if (aliceObj) {
            window.sessionStorage.setItem("criterionId", id);
            this.props.history.push('/edit-criterion');
        }
        else
            alert('You need to login')
    }
    //direct to export page along with criterion Id
    exportPage = (id) => {
        window.sessionStorage.setItem("criterionId", id);
        this.props.history.push('/export-criterion');
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
                <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                    <Breadcrumb.Item onClick={() => this.props.history.push('/tags')}>All Tags</Breadcrumb.Item>
                    <Breadcrumb.Item active>{this.state.tag.value}</Breadcrumb.Item>
                </Breadcrumb>,
                <Card.Title key="cardTitle" as="h3" className="text-info mt-3 mb-3">Criteria using {this.state.tag.value}:
                </Card.Title>,
                <Card.Subtitle key="cardSubtitle">
                    Total {this.state.tag.count} criteria match
                </Card.Subtitle>
                ,
                <Posts key="posts"
                    posts={this.state.criteria}
                    loading={this.state.loading}
                    edit={this.editCriterion}
                    copynedit={this.copyneditCriterion}
                    get={this.getCriterion}
                    getTag={this.loadTag}
                    publishPost={this.publishCriterion}
                    exportPage={this.exportPage}
                    category='criterion' />
            ]
        );
    }

}

export default GetTagComponent;