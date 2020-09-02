import React, { Component } from 'react';
import { Card, Breadcrumb, Form, Col, Button } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AssessmentGroupInfoTable from '../assessmentGroup/assessmentGroupCards/AssessmentGroupInfoTable';
class RubricResultsCompareComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessmentGroups: this.props.location.state.list.sort((a, b) => (new Date(a.assessDate) - new Date(b.assessDate))),
            rubric: this.props.location.state.rubric,
            name: this.props.location.state.name,//assessmentGroup name
            InsChartOptionsAvg: '',
            PeerChartOptionsAvg: '',
            InsChartOptionsStacked: '',
            PeerChartOptionsStacked: '',
            years: [],
            showIns: true, //current show instructor chart or peer chart
            show: true //same thing as showIns, think of like a temp boolean which won't affect the chart
        }
    }

    componentDidMount() {
        this.countRating();
    }
    countRating() {
        let newAssessmentGroups = [], years = [];
        let tmpRank = 0, startYear = Infinity, endYear = -Infinity, len = this.state.assessmentGroups.length;
        for (var i = 0; i < len; i++) {
            let assessmentGroup = this.state.assessmentGroups[i];
            let year = new Date(assessmentGroup['assessDate']).getFullYear();
            startYear = Math.min(startYear, year);
            endYear = Math.max(endYear, year);
            assessmentGroup.rubric.criteria.map(
                c => c.ratings.map(r => {
                    r['peer_count'] = 0
                    r['instructor_count'] = 0
                    return r;
                })
            )
            assessmentGroup['year'] = year;
            let peer_count = 0;
            let ins_count = 0;
            let assessments = this.state.assessmentGroups[i].assessments;
            while (i < len) {
                for (let assessment of assessments) {
                    if (assessment.type === 'peer_review')
                        peer_count++;
                    else if (assessment.type === 'grading')
                        ins_count++;
                    for (let j = 0; j < assessment.comments.length; j++) {
                        let r = assessment.comments[j].rating; //current rating in this assessment
                        //traverse ratings in certain criterion
                        let ratings = assessmentGroup.rubric.criteria[j].ratings;
                        tmpRank = Math.max(tmpRank, ratings.length);//update rank
                        for (let rating of ratings) {
                            if (rating.value === r.value) {
                                if (assessment.type === 'peer_review')
                                    rating.peer_count++;
                                else if (assessment.type === 'grading')
                                    rating.instructor_count++;
                                break;
                            }
                        }
                    }
                }
                if (i < len - 1 && new Date(this.state.assessmentGroups[i + 1]['assessDate']).getFullYear() === year) {
                    assessments = this.state.assessmentGroups[i + 1].assessments;
                    i++;
                }
                else
                    break;
            }
            assessmentGroup['ins_count'] = ins_count;
            assessmentGroup['peer_count'] = peer_count;
            newAssessmentGroups = [...newAssessmentGroups, assessmentGroup];
        }
        for (let i = startYear; i <= endYear; i++)
            years = [...years, i];
        this.setState({
            assessmentGroups: newAssessmentGroups,
            originalList: newAssessmentGroups, // later might change the range, then we will based on this to change
            ranks: tmpRank,
            years: years,
            startYear: startYear,
            endYear: endYear
        }, () => {
            if (this.state.assessmentGroups !== '' || this.state.assessmentGroups.length !== 0) {
                this.createAvgChart();
                this.createStackedBar();
            }
        })
    }
    createAvgChart() {
        let ins_series = [], peer_series = [];
        for (let assessmentGroup of this.state.assessmentGroups) {
            let year_name = assessmentGroup.year;
            if (assessmentGroup.ins_count > 0) {
                let avgData = [];
                let criteria = assessmentGroup.rubric.criteria
                for (let i = 0; i < criteria.length; i++) {
                    let criterion = criteria[i];
                    let avg = 0;
                    let totalCount = 0;
                    for (let j = 0; j < criterion.ratings.length; j++) {
                        let rating = criterion.ratings[j];
                        avg += (rating.value * rating.instructor_count);
                        totalCount += rating.instructor_count;
                    }
                    criterion['avg'] = avg / totalCount;
                    avgData = [...avgData, [criterion.name, criterion['avg']]];
                }
                ins_series = [...ins_series, { name: year_name, data: avgData }];
            }
            if (assessmentGroup.peer_count > 0) {
                let avgData = [];
                let criteria = assessmentGroup.rubric.criteria
                for (let i = 0; i < criteria.length; i++) {
                    let criterion = criteria[i];
                    let avg = 0;
                    let totalCount = 0;
                    for (let j = 0; j < criterion.ratings.length; j++) {
                        let rating = criterion.ratings[j];
                        avg += (rating.value * rating.peer_count);
                        totalCount += rating.peer_count;
                    }
                    criterion['avg'] = avg / totalCount;
                    avgData = [...avgData, [criterion.name, criterion['avg']]];
                }
                peer_series = [...peer_series, { name: year_name, data: avgData }];
            }
        }

        if (ins_series.length > 0) {
            let ins_obj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Instructor Evaluations - Average Points'
                },
                xAxis: {
                    categories: this.state.rubric.criteria.map(c => c.name),
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Point'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} points</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: ins_series
            }
            this.setState({ InsChartOptionsAvg: ins_obj })
        }
        if (peer_series.length > 0) {
            let peer_obj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Peer Evaluations - Average Points'
                },
                xAxis: {
                    categories: this.state.rubric.criteria.map(c => c.name),
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Point'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} points</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: peer_series
            }
            this.setState({ PeerChartOptionsAvg: peer_obj })
        }
        if (ins_series.length === 0)
            this.setState({ showIns: false });
    }

    createStackedBar() {
        let colors = ['#008000', '#00ff00', '#fcfc04', '#fcac04', '#d9534f'];
        let ins_seriesArr = [], peer_seriesArr = [];
        for (let i = 0; i < this.state.ranks; i++) {
            if (i === colors.length) //if reach number, add random color to array
                colors = [...colors, 'rgb(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ')'];
            for (let j = 0; j < this.state.assessmentGroups.length; j++) {
                let assessmentGroup = this.state.assessmentGroups[j];
                let ins_data = [], peer_data = [];
                if (assessmentGroup.ins_count > 0) {
                    for (let k = 0; k < this.state.rubric.criteria.length; k++) {
                        let ratings = assessmentGroup.rubric.criteria[k].ratings;
                        if (i < ratings.length)
                            ins_data = [...ins_data, ratings[i].instructor_count];
                    }
                }
                if (assessmentGroup.peer_count > 0) {
                    for (let k = 0; k < this.state.rubric.criteria.length; k++) {
                        let ratings = assessmentGroup.rubric.criteria[k].ratings;
                        if (i < ratings.length)
                            peer_data = [...peer_data, ratings[i].peer_count];
                    }
                }
                let ins_seriesObj = '', peer_seriesObj = '';
                if (ins_data.length > 0) {
                    ins_seriesObj = {
                        name: 'rank' + (i + 1),
                        data: ins_data,
                        stack: assessmentGroup.year,
                        color: colors[i]
                    };
                    if (j > 0)
                        ins_seriesObj['linkedTo'] = ':previous';
                    ins_seriesArr = [...ins_seriesArr, ins_seriesObj];
                }
                if (peer_data.length > 0) {
                    peer_seriesObj = {
                        name: 'rank' + (i + 1),
                        data: peer_data,
                        stack: assessmentGroup.year,
                        color: colors[i]
                    };
                    if (j > 0)
                        peer_seriesObj['linkedTo'] = ':previous';
                    peer_seriesArr = [...peer_seriesArr, peer_seriesObj];
                }
            }
        }
        if (ins_seriesArr.length > 0) {
            let obj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Instructor Evaluations'
                },
                xAxis: {
                    categories: this.state.rubric.criteria.map(c => c.name)
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Percent'
                    },
                    stackLabels: {
                        enabled: true,
                        crop: false,
                        overflow: 'allow',
                        style: {
                            fontWeight: 'bold',
                            color: '#545775'
                        },
                        format: '{stack}'
                    }
                },
                tooltip: {
                    pointFormat: '<span>{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>'
                },
                plotOptions: {
                    column: {
                        stacking: 'percent'
                    }
                },
                series: ins_seriesArr
            };
            this.setState({ InsChartOptionsStacked: obj });
        }
        if (peer_seriesArr.length > 0) {
            let obj = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Peer Evaluations'
                },
                xAxis: {
                    categories: this.state.rubric.criteria.map(c => c.name)
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Percent'
                    },
                    stackLabels: {
                        enabled: true,
                        crop: false,
                        overflow: 'allow',
                        style: {
                            fontWeight: 'bold',
                            color: '#545775'
                        },
                        format: '{stack}'
                    }
                },
                tooltip: {
                    pointFormat: '<span>{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>'
                },
                plotOptions: {
                    column: {
                        stacking: 'percent'
                    }
                },
                series: peer_seriesArr
            };
            this.setState({ PeerChartOptionsStacked: obj });
        }


    }

    reloadGroups() {
        let list = this.state.originalList;
        let s = this.state.startYear, e = this.state.endYear;
        this.setState({
            assessmentGroups: list.filter(a => a.year >= s && a.year <= e),
            showIns: this.state.show === true
        }, () => {
            if (this.state.assessmentGroups !== '' || this.state.assessmentGroups.length !== 0) {
                this.createAvgChart();
                this.createStackedBar();
            }
        })
    }
    selectHandler = (e, text) => {
        if (text === 's') {
            this.setState({
                startYear: e.target.value
            });
            if (this.state.endYear < e.target.value)
                this.setState({ endYear: e.target.value })
        }
        else if (text === 'e') {
            this.setState({
                endYear: e.target.value
            });
        }
        else if (text === 'type') {
            this.setState({
                show: e.target.value
            })
        }
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return [
            <Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item onClick={()=>this.props.history.push('/rubrics')}>Rubrics</Breadcrumb.Item>
                <Breadcrumb.Item onClick={()=>this.props.history.push('/rubric')}>{this.state.rubric.name}</Breadcrumb.Item>
                <Breadcrumb.Item onClick={() => this.props.history.push('/rubric-results', { rubric: this.state.rubric })}>Results of {this.state.rubric.name}</Breadcrumb.Item>
                <Breadcrumb.Item active>AssessmentGroups of {this.state.name}</Breadcrumb.Item>
            </Breadcrumb>,
            <Card key="card" className="mx-auto mt-2">
                <Card.Body>
                    <Card.Title>{this.state.rubric.name + " - " + this.state.name}</Card.Title>
                    <Form>
                        <Form.Row key="selectRange">
                            <Col sm={1} style={{ textAlign: 'center', verticalAlign: 'middle' }}>Type: </Col>
                            <Col sm={2} key="selectType">
                                <Form.Control as="select" onChange={(e) => this.selectHandler(e, 'type')}>
                                    {this.state.InsChartOptionsAvg === '' ? '' : <option key="ins" value={true}>Instructor</option>}
                                    {this.state.PeerChartOptionsAvg === '' ? '' : <option key="peer" value={false}>Peer</option>}
                                </Form.Control>
                            </Col>
                            <Col sm={1} style={{ textAlign: 'center', verticalAlign: 'middle' }}>From</Col>
                            <Col sm={2} key="beginYear">
                                <Form.Control as="select" onChange={(e) => this.selectHandler(e, 's')}>
                                    {this.state.years.map(y => <option key={y}>{y}</option>)}
                                </Form.Control>
                            </Col>
                            <Col sm={1} style={{ textAlign: 'center', verticalAlign: 'middle' }}>To</Col>
                            <Col sm={2} key="endYear">
                                <Form.Control as="select" value={this.state.endYear} onChange={(e) => this.selectHandler(e, 'e')}>
                                    {
                                        this.state.years.filter(y => y >= this.state.startYear).map(y => <option key={y}>{y}</option>)
                                    }
                                </Form.Control>
                            </Col>
                            <Col sm={1} key="submit">
                                <Button className="float-right" variant="info" onClick={() => this.reloadGroups()}>
                                    Select
                                </Button>
                            </Col>
                        </Form.Row>
                    </Form>
                    {!this.state.showIns || this.state.InsChartOptionsAvg === '' ? "" :
                        <HighchartsReact
                            key="ins_avgChart"
                            highcharts={Highcharts}
                            options={this.state.InsChartOptionsAvg}
                        />
                    }
                    {(this.state.showIns || this.state.PeerChartOptionsAvg === '') ? "" :
                        <HighchartsReact
                            key="peer_avgChart"
                            highcharts={Highcharts}
                            options={this.state.PeerChartOptionsAvg}
                        />
                    }
                    {!this.state.showIns || this.state.InsChartOptionsStacked === '' ? "" :
                        <HighchartsReact
                            key="ins_stackedBar"
                            highcharts={Highcharts}
                            options={this.state.InsChartOptionsStacked}
                        />
                    }
                    {this.state.showIns || this.state.PeerChartOptionsStacked === '' ? "" :
                        <HighchartsReact
                            key="peer_stackedBar"
                            highcharts={Highcharts}
                            options={this.state.PeerChartOptionsStacked}
                        />
                    }
                    {this.state.showIns ? this.state.assessmentGroups.map(
                        a => a.ins_count === 'undefined' || a.ins_count === 0 ?
                            "" : <AssessmentGroupInfoTable key={"ins_" + a.id} assessmentGroup={a} type="instructor" compare={true}></AssessmentGroupInfoTable>
                    ) : ""}
                    {!this.state.showIns ? this.state.assessmentGroups.map(
                        a => a.peer_count === 'undefined' || a.peer_count === 0 ?
                            "" : <AssessmentGroupInfoTable key={"peer_" + a.id} assessmentGroup={a} type="peer" compare={true}></AssessmentGroupInfoTable>
                    ) : ""}
                </Card.Body>
            </Card>];
    }

}

export default RubricResultsCompareComponent;