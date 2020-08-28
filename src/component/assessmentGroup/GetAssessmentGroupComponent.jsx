import React, { Component } from 'react';
import ApiService from "../../service/ApiService";
import { Card, Breadcrumb, Col, Button } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AssessmentGroupInfoTable from './assessmentGroupCards/AssessmentGroupInfoTable';
class GetAssessmentGroupComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessmentGroup: '',
            assessments: [],
            rubric: '',
            criteria: [],
            ranks: 0,//num of ranks (i.e., the max number of ratings among all criteria) (for stackedbar x-axis)
            ChartOptionsAvg: '',
            ChartOptionsStacked: ''
        }
        this.loadAssessmentGroup = this.loadAssessmentGroup.bind(this);
        this.countRating = this.countRating.bind(this);
    }

    componentDidMount() {
        this.loadAssessmentGroup();
    }

    loadAssessmentGroup() {
        ApiService.fetchAssessmentGroupById(window.sessionStorage.getItem("assessmentGroupId"))
            .then((res) => {
                let assessmentGroup = res.data;
                this.setState({
                    assessmentGroup: assessmentGroup,
                    assessments: assessmentGroup.assessments,
                    rubric: assessmentGroup.rubric,
                    criteria: assessmentGroup.rubric.criteria
                }, () => {
                    this.countRating();
                });
            })
    }
    countRating() {
        this.state.criteria.map(
            c => c.ratings.map(r => {
                r['peer_count'] = 0
                r['instructor_count'] = 0
                return r;
            })
        )
        let agroup = this.state.assessmentGroup;
        agroup['peer_count'] = 0;
        agroup['ins_count'] = 0;
        let tmpRank = 0;
        for (let assessment of this.state.assessments) {
            if (assessment.type === 'peer_review')
                agroup['peer_count']++;
            else if (assessment.type === 'grading')
                agroup['ins_count']++;
            for (let i = 0; i < assessment.comments.length; i++) {
                let r = assessment.comments[i].rating; //current rating in this assessment
                //traverse ratings in certain criterion
                let ratings = this.state.criteria[i].ratings;
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
        this.setState({
            criteria: this.state.criteria,
            assessmentGroup: agroup,
            ranks: tmpRank
        }, () => {
            this.createAvgChart();
            this.createStackedBar();
        })
    }
    createAvgChart() {
        let avgSeries = [];
        if (this.state.assessmentGroup['ins_count'] > 0) {
            let avgData = [];
            for (let i = 0; i < this.state.criteria.length; i++) {
                let criterion = this.state.criteria[i];
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
            avgSeries = [...avgSeries, { name: "Instructor", data: avgData }]
        }
        if (this.state.assessmentGroup['peer_count'] > 0) {
            let avgData = [];
            for (let i = 0; i < this.state.criteria.length; i++) {
                let criterion = this.state.criteria[i];
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
            avgSeries = [...avgSeries, { "name": "Peer", "data": avgData }]
        }

        let obj = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Evaluations - Average Points'
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
            series: avgSeries
        };
        this.setState({ ChartOptionsAvg: obj })
    }

    createStackedBar() {
        let colors = ['#008000', '#00ff00', '#fcfc04', '#fcac04', '#d9534f'];
        let seriesData = [];
        if (this.state.assessmentGroup['ins_count'] > 0 && this.state.assessmentGroup['peer_count'] > 0) {
            for (let i = 0; i < this.state.ranks; i++) {
                let ins_arr = [], peer_arr = [];
                for (let j = 0; j < this.state.criteria.length; j++) {
                    let criterion = this.state.criteria[j];
                    if (i < criterion.ratings.length) {
                        ins_arr = [...ins_arr, criterion.ratings[i].instructor_count];
                        peer_arr = [...peer_arr, criterion.ratings[i].peer_count];
                    }
                }
                if (i < 5) {
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: ins_arr, color: colors[i], stack: 'Instructor' }];
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: peer_arr, color: colors[i], stack: 'Peer', linkedTo: ':previous' }];
                }
                else {
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: ins_arr, stack: 'Instructor' }];
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: peer_arr, stack: 'Peer', linkedTo: ':previous' }];
                }
            }
        }
        else if (this.state.assessmentGroup['ins_count'] > 0) {
            for (let i = 0; i < this.state.ranks; i++) {
                let arr = [];
                for (let j = 0; j < this.state.criteria.length; j++) {
                    let criterion = this.state.criteria[j];
                    if (i < criterion.ratings.length) {
                        arr = [...arr, criterion.ratings[i].instructor_count];
                    }
                }
                if (i < 5)
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: arr, color: colors[i], stack: 'Instructor' }];
                else
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: arr, stack: 'Instructor' }];
            }
        }
        else if (this.state.assessmentGroup['peer_count'] > 0) {
            for (let i = 0; i < this.state.ranks; i++) {
                let arr = [];
                for (let j = 0; j < this.state.criteria.length; j++) {
                    let criterion = this.state.criteria[j];
                    if (i < criterion.ratings.length) {
                        arr = [...arr, criterion.ratings[i].peer_count];
                    }
                }
                if (i < colors.length)
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: arr, color: colors[i], stack: 'Peer' }];
                else
                    seriesData = [...seriesData, { name: 'rank' + (i + 1), data: arr, stack: 'Peer' }];
            }
        }
        let obj = {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Stacked Evaluations'
            },
            xAxis: {
                categories: this.state.criteria.map(c => c.name)
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
            series: seriesData
        };
        this.setState({ ChartOptionsStacked: obj });
    }
    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return (
            [<Breadcrumb key="breadcrumb" className="mx-auto mt-2">
                <Breadcrumb.Item href="assessmentgroups">AssessmentGroups</Breadcrumb.Item>
                <Breadcrumb.Item active>{this.state.assessmentGroup.name}</Breadcrumb.Item>
            </Breadcrumb>,
            <Card key="card" className="mx-auto mt-2">
                <Card.Body>
                    <Col>
                        <Button className="float-right" variant="outline-dark" onClick={() => { this.props.history.push('assessments', { assessmentGroup: this.state.assessmentGroup }) }}> View {this.state.assessments.length} Assessments</Button>
                    </Col>
                    <Card.Title as="h3">
                        {this.state.assessmentGroup.name}
                    </Card.Title>
                    <Col>
                        <Button className="float-right" variant="outline-dark" onClick={() => { this.props.history.push('comments', { assessmentGroup: this.state.assessmentGroup }) }}> View All Comments</Button>
                    </Col>
                    <Card.Subtitle className="mb-2 text-muted">
                        {ReactHtmlParser(this.state.assessmentGroup.description)}
                    </Card.Subtitle>
                    <Card.Text className="text-primary" onClick={() => {
                        window.sessionStorage.setItem("rubricId", this.state.rubric.id);
                        this.props.history.push('/rubric');
                    }}>Using {this.state.rubric.name}</Card.Text>
                    {
                        this.state.assessmentGroup['ins_count'] === 0 || this.state.assessmentGroup['ins_count'] === undefined ? "" :
                            <AssessmentGroupInfoTable assessmentGroup={this.state.assessmentGroup} type="instructor"></AssessmentGroupInfoTable>
                    }
                    {
                        this.state.assessmentGroup['peer_count'] === 0 || this.state.assessmentGroup['peer_count'] === undefined ? "" :
                            <AssessmentGroupInfoTable assessmentGroup={this.state.assessmentGroup} type="peer"></AssessmentGroupInfoTable>
                    }
                    <HighchartsReact
                        key="avgChart"
                        highcharts={Highcharts}
                        options={this.state.ChartOptionsAvg}
                    />
                    <HighchartsReact
                        key="stackedBarChart"
                        highcharts={Highcharts}
                        options={this.state.ChartOptionsStacked}
                    />
                </Card.Body>
            </Card>
            ]
        );
    }

}

export default GetAssessmentGroupComponent;