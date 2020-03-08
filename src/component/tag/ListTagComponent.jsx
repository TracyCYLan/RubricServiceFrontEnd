import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import PaginationComponent from "../pageComponents/Pagination";
import Posts from "../pageComponents/Posts";
class ListTagComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tags: [],
            message: null,
            postsPerPage: 10,
            currentPage: 1,
            loading: false,
            searchingText: ''
        }
        this.reloadTagList = this.reloadTagList.bind(this);
        this.paginate = this.paginate.bind(this);
        this.getTag = this.getTag.bind(this);
        this.search = this.search.bind(this);
        this.loadTag = this.loadTag.bind(this);
    }

    componentDidMount() {
        this.reloadTagList();
    }

    reloadTagList() {
        this.setState({ loading: true });
        ApiService.fetchTags()
            .then((res) => {
                this.setState({
                    tags: res.data,
                    loading: false
                }
                )
            });
    }
    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        if (e.target.value.length === 0)
            this.reloadTagList()
    }

    getTag(id) {
        window.localStorage.setItem("tagId", id);
        this.props.history.push('/tag');
    }

    paginate(pageNumber) {
        this.setState({ currentPage: pageNumber })
    }
    search = (e) => {
        this.setState({ searchingText: this.state.searchingText.trim() })
        if (this.state.searchingText.length === 0)
            this.reloadTagList();
        else {
            ApiService.searchTag(this.state.searchingText)
                .then(res => {
                    this.setState({ tags: res.data })
                });
        }
    }
    clearSearchBox = () => {
        this.setState({ searchingText: '' });
        this.reloadTagList();
    }
    loadTag(name) {
        ApiService.fetchCriteriaByTag(name)
            .then(res => {
                return res.data.map(c => c.name);
            })
    }

render() {
    const currentPosts = this.state.tags.slice(this.state.currentPage * this.state.postsPerPage - this.state.postsPerPage, this.state.currentPage * this.state.postsPerPage);
    // this.state.tags.map(
    //     t => alert(t.criteria)
    // )
    return (<div>
        {
            !this.state.loading ?
                [<h2 className="text-center mt-3">All Tags</h2>,
                <Row>
                    <Col lg={8} md={10}>
                        <Button variant="outline-secondary" onClick={() => this.addTag()}>Add Tag</Button>
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
                <Row>{this.loadTag('CS2011_OUTCOME')}</Row>,
                <Posts
                    posts={typeof (currentPosts) === 'string' ? [] : currentPosts}
                    loading={this.state.loading}
                    edit={this.editTag}
                    get={this.getTag}
                    loadTag={this.loadTag}
                    category='tag' />,
                <PaginationComponent
                    postsPerPage={this.state.postsPerPage}
                    totalPosts={this.state.tags.length}
                    paginate={this.paginate}
                    currentPage={this.state.currentPage}
                />] : <h2>Loading...</h2>
        }</div>);
}

}

export default ListTagComponent;