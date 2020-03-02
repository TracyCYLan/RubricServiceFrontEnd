import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button } from 'react-bootstrap';
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
            loading: false
        }
        this.addCriterion = this.addCriterion.bind(this);
        this.reloadCriterionList = this.reloadCriterionList.bind(this);
        this.paginate = this.paginate.bind(this);
        this.editCriterion = this.editCriterion.bind(this);
        this.copyneditCriterion = this.copyneditCriterion.bind(this);
        this.getCriterion = this.getCriterion.bind(this);
    }

    componentDidMount() {
        this.reloadCriterionList();
    }

    reloadCriterionList() {
        this.setState({ loading: true });
        ApiService.fetchCriteria()
            .then((res) => {
                this.setState({
                    criteria: res.data,
                    loading: false
                })
            });
    }

    getCriterion(id) {
        window.localStorage.setItem("criterionId", id);
        this.props.history.push('/criterion');
    }
    addCriterion() {
        window.localStorage.removeItem("criterionId");
        this.props.history.push(
            {
                pathname: '/add-criterion',
                state: {
                    name: '',
                    description: '',
                    ratings: [{ id: 'default-id-1', description: 'Exceed Expectations', value: 5 },
                    { id: 'default-id-2', description: 'Meet Expectations', value: 3 },
                    { id: 'default-id-3', description: 'Does not Meet Expectations', value: 0 }],
                    published: '',
                    publishDate: '',
                    tags: []
                }
            }
        );
    }
    searchCriterion() {
        window.localStorage.removeItem("criterionId");
        this.props.history.push('/criterion/search');
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
                    tags: criterion.tags.map(t => t.name)//send only string array
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
    render() {
        const currentPosts = this.state.criteria.slice(this.state.currentPage * this.state.postsPerPage - this.state.postsPerPage, this.state.currentPage * this.state.postsPerPage);
        return (<div>
            {
                !this.state.loading ?
                    [<h2 className="text-center mt-1">All Criteria</h2>,
                    <Button variant="outline-secondary ml-1" onClick={() => this.addCriterion()}>Add Criterion</Button>,
                    <Button variant="outline-secondary ml-2" onClick={() => this.searchCriterion()}>Search Criterion</Button>,
                    <Posts posts={currentPosts} loading={this.state.loading} edit={this.editCriterion} copynedit={this.copyneditCriterion} get={this.getCriterion} />,
                    <PaginationComponent
                        postsPerPage={this.state.postsPerPage}
                        totalPosts={this.state.criteria.length}
                        paginate={this.paginate}
                        currentPage={this.state.currentPage}
                    />] : "Loading..."
            }</div>);
    }

}

export default ListCriterionComponent;