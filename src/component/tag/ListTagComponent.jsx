import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { TagCloud } from 'react-tagcloud';
import { Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
const colorOptions = {
    luminosity: 'dark',
    hue: '#5bc0de',
    format: 'rgb'
}
class ListTagComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tags: [],
            message: null,
            searchingText: ''
        }
        this.reloadTagList = this.reloadTagList.bind(this);
        this.getTag = this.getTag.bind(this);
        this.search = this.search.bind(this);
        this.loadTag = this.loadTag.bind(this);
    }

    componentDidMount() {
        this.reloadTagList();
    }

    reloadTagList() {
        ApiService.fetchTags()
            .then((res) => {
                this.setState({
                    tags: res.data
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
        window.sessionStorage.setItem("tagId", id);
        this.props.history.push('/tag');
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
        return [
            <Row key="row" className="mt-3">
                <Col></Col>
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
            </Row>
            ,<TagCloud
                key="cloud"
                minSize={22}
                maxSize={45}
                tags={this.state.tags}
                onClick={tag => { this.getTag(tag.id) }}
                className="simple-cloud"
                colorOptions={colorOptions}
                style={{backgroundColor:'#00000', textAlign:'center'}}
            />];
    }

}

export default ListTagComponent;