import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import PaginationComponent from "../pageComponents/Pagination";
import Posts from "../pageComponents/Posts";
class ListCriterionComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            criteria: [],
            message: null,
            postsPerPage: 10,
            currentPage: 1,
            loading: false,
            searchingText: ''
        }
        this.addCriterion = this.addCriterion.bind(this);
        this.reloadCriterionList = this.reloadCriterionList.bind(this);
        this.paginate = this.paginate.bind(this);
        this.editCriterion = this.editCriterion.bind(this);
        this.copyneditCriterion = this.copyneditCriterion.bind(this);
        this.getCriterion = this.getCriterion.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        this.reloadCriterionList();
    }

    reloadCriterionList() {
        ApiService.fetchCriteria()
            .then((res) => {
                this.setState({
                    criteria: res.data,
                    loading: false
                })
            });
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value.length === 0) {
            this.setState({loading:true});
            this.reloadCriterionList();
        }
    }
    getCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        this.props.history.push('/criterion');
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
    paginate(pageNumber) {
        this.setState({ currentPage: pageNumber })
    }
    search = (e) => {
        this.setState({ searchingText: this.state.searchingText.trim() })
        if (this.state.searchingText.length === 0) {
            this.setState({loading:true});
            this.reloadCriterionList();
            this.setState({loading:false});
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
    render() {
        const currentPosts = this.state.criteria.slice(this.state.currentPage * this.state.postsPerPage - this.state.postsPerPage, this.state.currentPage * this.state.postsPerPage);
        return (<div>
            {
                !this.state.loading ?
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
                        posts={typeof (currentPosts) === 'string' ? [] : currentPosts}
                        loading={this.state.loading}
                        edit={this.editCriterion}
                        copynedit={this.copyneditCriterion}
                        get={this.getCriterion}
                        category='criterion' />,
                    <PaginationComponent
                        postsPerPage={this.state.postsPerPage}
                        totalPosts={this.state.criteria.length}
                        paginate={this.paginate}
                        currentPage={this.state.currentPage}
                    />] : <h2>Loading...</h2>
            }</div>);
    }

}

export default ListCriterionComponent;