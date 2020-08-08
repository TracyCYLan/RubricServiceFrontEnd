import React, { Component } from 'react';
// import ApiService from "../../service/ApiService";
import { Card } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import AssessmentGroupInfoTable from '../assessmentGroup/assessmentGroupCards/AssessmentGroupInfoTable';
class RubricResultsCompareComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            assessmentGroups: this.props.location.state.list,
            rubric: this.props.location.state.rubric,
            name: this.props.location.state.name,//assessmentGroup name
            InsChartOptionsAvg: '',
            PeerChartOptionsAvg: '',
            InsChartOptionsStacked: '',
            PeerChartOptionsStacked: ''
        }
    }

    componentDidMount() {
        this.countRating();
    }
    countRating() {
        let newAssessmentGroups = [];
        let tmpRank = 0;
        for (var i = 0; i < this.state.assessmentGroups.length; i++) {
            let assessmentGroup = this.state.assessmentGroups[i];
            assessmentGroup.rubric.criteria.map(
                c => c.ratings.map(r => {
                    r['peer_count'] = 0
                    r['instructor_count'] = 0
                    return r;
                })
            )
            let assessments = assessmentGroup.assessments;
            let peer_count = 0;
            let ins_count = 0;
            for (let assessment of assessments) {
                if (assessment.type === 'peer_review')
                    peer_count++;
                else if (assessment.type === 'grading')
                    ins_count++;
                for (let j = 0; j < assessment.ratings.length; j++) {
                    let r = assessment.ratings[j]; //current rating in this assessment
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
            assessmentGroup['ins_count'] = ins_count;
            assessmentGroup['peer_count'] = peer_count;
            newAssessmentGroups = [...newAssessmentGroups, assessmentGroup];
        }
        this.setState({
            assessmentGroups: newAssessmentGroups,
            ranks: tmpRank
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
            let date_name = new Date(assessmentGroup.assessDate).toLocaleDateString();
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
                ins_series = [...ins_series, { name: date_name, data: avgData }];
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
                peer_series = [...peer_series, { name: date_name, data: avgData }];
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
                        stack: new Date(assessmentGroup.assessDate).toLocaleDateString(),
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
                        stack: new Date(assessmentGroup.assessDate).toLocaleDateString(),
                        color: colors[i]
                    };
                    if (j > 0)
                        peer_seriesObj['linkedTo'] = ':previous';
                    peer_seriesArr = [...peer_seriesArr, peer_seriesObj];
                }
            }
        }
        if(ins_seriesArr.length>0)
        {
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
                    pointFormat: '<span style="color:{series.color}">{series.stack}{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>'
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
        if(peer_seriesArr.length>0)
        {
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
                    pointFormat: '<span style="color:{series.color}">{series.stack}{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>'
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

    onChange = (e) =>
        this.setState({ [e.target.name]: e.target.value });

    render() {
        return <Card className="mx-auto mt-2">
            <Card.Body>
                <Card.Title>{this.state.rubric.name + " - " + this.state.name}</Card.Title>
                {this.state.assessmentGroups.map(
                    a => <AssessmentGroupInfoTable key="table" assessmentGroup={a} type="instructor"></AssessmentGroupInfoTable>
                )}
                <HighchartsReact
                    key="ins_avgChart"
                    highcharts={Highcharts}
                    options={this.state.InsChartOptionsAvg}
                />
                <HighchartsReact
                    key="peer_avgChart"
                    highcharts={Highcharts}
                    options={this.state.PeerChartOptionsAvg}
                />
                <HighchartsReact
                    key="ins_stackedBar"
                    highcharts={Highcharts}
                    options={this.state.InsChartOptionsStacked}
                />
                <HighchartsReact
                    key="peer_stackedBar"
                    highcharts={Highcharts}
                    options={this.state.PeerChartOptionsStacked}
                />
            </Card.Body>
        </Card>;
    }

}

export default RubricResultsCompareComponent;