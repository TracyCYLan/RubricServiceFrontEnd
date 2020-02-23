import React, { Component } from 'react'
import ApiService from "../../service/ApiService";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Rating from '../RatingCards/RatingEdition';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import uniqueId from 'react-html-id';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
class AddCriterionComponent extends Component {

    constructor(props) {
        super(props);
        uniqueId.enableUniqueIds(this);
        this.state = {
            name: this.props.location.state.name,
            description: this.props.location.state.description,
            ratingCount: 0, //counting for ratingId
            ratings: this.props.location.state.ratings,
            publishDate: this.props.location.state.publishDate,
            tags: this.props.location.state.tags,
            tagCount: 1000,//counting for tagId
            hintTags: [],
            message: null
        }
        this.loadHintTags = this.loadHintTags.bind(this);
        this.saveCriterion = this.saveCriterion.bind(this);
        this.deleteRating = this.deleteRating.bind(this);
        this.addRating = this.addRating.bind(this);
        this.editRating = this.editRating.bind(this);
        this.addTag = this.addTag.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.editTag = this.editTag.bind(this);
    }
    componentDidMount() {
        this.loadHintTags();
    }
    loadHintTags(){
        ApiService.fetchTags()
        .then((res) => {
            this.setState({
                hintTags: res.data
            })
        });
    }
    saveCriterion = (e) => {
        e.preventDefault();
        let criterion = { name: this.state.name, description: this.state.description, publishDate: this.state.publishDate };
        let ratings = this.state.ratings;
        let tags = this.state.tags;
        ApiService.addCriterion(criterion, ratings, tags)
            .then(res => {
                this.setState({ message: 'Criterion added successfully.' });
                this.props.history.push('/criteria');
            })
    }

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });
    addRating = () => {
        var ratings = this.state.ratings;
        ratings.push({ id: this.state.ratingCount, description: '', value: '' });
        this.setState({ ratingCount: this.state.ratingCount + 1 });
        this.setState({
            ratings: ratings
        });
    }
    editRating = (input_name, input_value, index) => {
        var ratings = this.state.ratings;
        ratings.map(
            rating => {
                if (rating["id"] === index) {
                    rating[input_name] = input_value;
                }
                return rating;
            }
        )
        this.setState({ ratings: ratings });
    }
    deleteRating = (index) => {
        this.setState({
            ratings: this.state.ratings.filter(rating => rating.id !== index)
        })
    }
    addTag = () => {
        var tags = this.state.tags;
        tags.push({ id: this.state.tagCount, name: '' });
        this.setState({ tagCount: this.state.tagCount + 1 });
        this.setState({
            tags: tags
        });
    }
    editTag = (e, index,value) => {
        this.setState({ [e.target.name]: e.target.value });
        var tags = this.state.tags;
        tags.map(
            tag => {
                if (tag["id"] === index) {
                    tag["name"] = e.target.value||value;
                }
                return tag;
            }
        )
        this.setState({ tags: tags });
    }
    deleteTag = (index) => {
        this.setState({
            tags: this.state.tags.filter(tag => tag.id !== index)
        })
    }
    render() {
        return (
            <div>
                <h2 className="text-center">Add Criterion</h2>
                <form>
                    <Table responsive="lg" hover="true" >
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td><input type="text" placeholder="name" name="name" className="form-control" value={this.state.name} onChange={this.onChange} /></td>
                            </tr>
                            <tr>
                                <th>Description</th>
                                <td><textarea placeholder="description" name="description" className="form-control" value={this.state.description} onChange={this.onChange} /></td>
                            </tr>
                            <tr>
                                <th>Publish Date</th>
                                <td><input type="date" name="publishDate" className="form-control" value={this.state.publishDate} onChange={this.onChange} /></td>
                            </tr>
                            <tr>
                                <th>Tags: <Button variant="info" onClick={this.addTag}>Add Tag</Button> </th>
                                <Container>
                                    {
                                        this.state.tags.map(
                                            tag =>
                                                <Row>
                                                    <Autocomplete
                                                        margin="normal"
                                                        style={{ width: 300 }}
                                                        name="tagname"
                                                        freeSolo options={this.state.hintTags.map(tag=>tag.name)}
                                                        onChange ={(e,value) =>{this.editTag(e,tag.id,value)}}
                                                        renderInput={
                                                            (params)=>(
                                                                <TextField {...params} name="tagname"
                                                                variant = "outlined" margin = "normal" value = {tag.name}
                                                                onChange ={(e,value) =>{this.editTag(e,tag.id,value)}}
                                                                fullWidth/>          
                                                            )
                                                        }
                                                    />
                                                    <td><Button size="sm" variant="warning" onClick={() => this.deleteTag(tag.id)}>Remove</Button></td>
                                                </Row>
                                        )
                                    }
                                </Container>
                            </tr>
                        </tbody>
                    </Table>
                    <Button onClick={this.addRating}>Add new Rating</Button>
                    <div>
                        <Container>
                            <Row>
                                {
                                    this.state.ratings.map(
                                        rating =>
                                            <Rating key={rating.id} value={rating.value} index={rating.id} delete={this.deleteRating} edit={this.editRating}>{rating.description}</Rating>
                                    )
                                }
                            </Row>
                        </Container>
                    </div>
                    <div>
                        <Button className="btn btn-success" onClick={this.saveCriterion}>Create</Button> </div>
                </form>
            </div >
        );
    }
}


export default AddCriterionComponent;