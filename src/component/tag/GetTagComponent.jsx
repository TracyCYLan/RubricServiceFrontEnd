import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import { Card } from 'react-bootstrap';
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
                ApiService.fetchCriteriaByTag(res.data.name)
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
            <Card className="mx-auto mt-2" style={{ width: '95%' }}>
                <Card.Body>
                    <Card.Title as="h3" className="text-info">{this.state.tag.name} </Card.Title>
                    <Card.Text as="h4">
                        {
                            this.state.criteria.map(
                                (c, index)=> {
                                    return <h4>{[index + 1,'. ',
                                        <span
                                            className="text-primary"
                                            onClick={() => this.getCriterion(c.id)}>
                                            {c.name}
                                        </span>]}
                                    </h4>
                                }
                            )
                        }
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }

}

export default GetTagComponent;