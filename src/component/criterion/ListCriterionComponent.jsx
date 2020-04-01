import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import Posts from "../pageComponents/Posts";
class ListCriterionComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            criteria: [],
            message: null,
            loading: false,
            searchingText: ''
        }
        this.addCriterion = this.addCriterion.bind(this);
        this.reloadCriterionList = this.reloadCriterionList.bind(this);
        this.editCriterion = this.editCriterion.bind(this);
        this.copyneditCriterion = this.copyneditCriterion.bind(this);
        this.getCriterion = this.getCriterion.bind(this);
        this.publishCriterion = this.publishCriterion.bind(this);
        this.search = this.search.bind(this);
        this.getTag = this.getTag.bind(this);
    }

    componentDidMount() {
        this.reloadCriterionList();
    }

    reloadCriterionList() {
        ApiService.fetchCriteria()
            .then((res) => {
                this.setState({
                    criteria: res.data
                })
            });
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value.length === 0) {
            this.reloadCriterionList();
        }
    }
    getCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        this.props.history.push('/criterion');
    }
    publishCriterion = (id) => {
        ApiService.publishCriterion(id).then(res =>
            this.setState({
                criteria: this.state.criteria.map(c => {
                    if (c.id === id)
                        return {...c,publishDate:new Date(),published:true}
                    return c
                })
            })
        );
    }
    addCriterion() {
        window.localStorage.removeItem("criterionId");
        this.props.history.push('add-criterion');
    }
    copyneditCriterion(criterion) {
        //send exactly the same content to add-criterion
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
    editCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        this.props.history.push('/edit-criterion');
    }
    search = (e) => {
        this.setState({ searchingText: this.state.searchingText.trim() })
        if (this.state.searchingText.length === 0) {
            this.reloadCriterionList();
        }
        else {
            ApiService.searchCriterion(this.state.searchingText)
                .then(res => {
                    this.setState({ criteria: res.data })
                });
        }
    }
    clearSearchBox = (e) => {
        this.setState({ searchingText: "" });
        this.reloadCriterionList();
    }
    getTag = (id) => {
        window.localStorage.setItem("tagId", id);
        this.props.history.push('/tag');
    }
    render() {
        return (<div>
            {
                    [<h2 className="text-center mt-3">All Criteria</h2>,
                    <Row>
                        <Col lg={8} md={10}>
                            <Button variant="outline-secondary" onClick={() => this.addCriterion()}>Add Criterion</Button>
                        </Col>
                        <Col className="mt-1">
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <Button variant="outline-danger" onClick={this.clearSearchBox}>x</Button>
                                </InputGroup.Prepend>
                                <FormControl name="searchingText"
                                    value={this.state.searchingText}
                                    onChange={this.onChange}
                                    onKeyPress={event => {
                                        if (event.key === 'Enter') {
                                            this.search()
                                        }
                                    }} />
                                <InputGroup.Append>
                                    <Button variant="outline-secondary" onClick={this.search}>Search</Button>
                                </InputGroup.Append>
                            </InputGroup>
                        </Col>
                    </Row>,
                    <Posts
                        posts={this.state.criteria}
                        loading={this.state.loading}
                        edit={this.editCriterion}
                        copynedit={this.copyneditCriterion}
                        get={this.getCriterion}
                        getTag={this.getTag}
                        publishPost={this.publishCriterion}
                        category='criterion' />
                    ] 
            }</div>);
    }

}

export default ListCriterionComponent;