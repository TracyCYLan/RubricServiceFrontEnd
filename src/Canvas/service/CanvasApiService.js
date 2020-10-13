import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/canvas/';
const API_BASE_URL = 'https://alice.cysun.org/alice-rubrics/canvas/';
const aliceObj = window.sessionStorage.getItem("oidc.user:https://identity.cysun.org:alice-rubric-service-spa");
const homepage = '/tlan/#'; // /#/criteria /tlan/#
class CanvasApiService {
    constructor() {
        this.setInterceptors();
    }
    setInterceptors() {
        if (aliceObj) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(aliceObj)['access_token'];
        }
        else {
            axios.defaults.headers.common['Authorization'] = null;
        }
        axios.interceptors.response.use(response => {
            return response;
        }, error => {
            if (error.message === 'Network Error' || error.response.status === 502) { //if didn't turn on the spring-boot server 
                alert('Rubric Server is Down. Please come to visit the site later');
            }
            else if (error.response.status === 401) {
                console.log(error.message)
                alert("Sorry, your login is expired. Please login again.")
                window.location.replace(homepage);//go to homepage
                window.sessionStorage.removeItem("oidc.user:https://identity.cysun.org:alice-rubric-service-spa");
                window.sessionStorage.removeItem("canvasToken");
                window.location.reload(false);
            }
            else if (error.response.status === 403) {
                alert("Sorry, you are not authorized to do this action")
                window.location.replace(homepage);//go to homepage
            }
            else {
                alert("error status code: " + error.response.status);
                window.location.replace(homepage);//go to homepage
            }
        });
    }
    fetchCourses(token) {
        return axios.get(API_BASE_URL + 'course/token?token=' + token);
    }
    fetchRubrics(courseId, token) {
        return axios.get(API_BASE_URL + 'course/' + courseId +
            '/rubric/token?token=' + token);
    }

    importRubric(courseId, rubricId, token) {
        //get rubric from canvas then post it into db
        return axios.post(API_BASE_URL + 'course/' + courseId +
            '/rubric/' + rubricId + '/token?token=' + token);
    }

    fetchCriteria(courseId, token) {
        return axios.get(API_BASE_URL + 'course/' + courseId +
            '/criterion/token?token=' + token);
    }

    importCriterion(criterionId, token) {
        //get outcome from canvas then post it into db
        return axios.post(API_BASE_URL + 'criterion/' + criterionId + '/token?token=' + token);
    }

    fetchOutcomeGroups(courseId, token) {
        return axios.get(API_BASE_URL + 'course/' + courseId +
            '/outcome_group/token?token=' + token);
    }

    exportCriterion(criterionId, courseId, outcome_group_id, token) {
        return axios.post(API_BASE_URL + 'criterion/' + criterionId +
            '/export/course/' + courseId + '/outcome_group/' +
            outcome_group_id + '/token?token=' + token);
    }

    exportRubric(rubricId, courseId, token, type, value) {
        if (type === 'name') { //create new assignment (or simply export rubric)
            return axios.post(API_BASE_URL + 'rubric/' + rubricId +
                '/export/course/' + courseId + '/token?token=' + token, { 'name': value });
        }
        else if (type === 'id') { //bind with existing assignment
            return axios.post(API_BASE_URL + 'rubric/' + rubricId +
                '/export/course/' + courseId + '/token?token=' + token, { 'id': value });
        }
    }

    fetchAssignments(courseId, token) {
        return axios.get(API_BASE_URL + 'course/' + courseId +
            '/assignment/token?token=' + token);
    }

    importAssessments(courseId, assignmentId, rubricId, token, assessmentGroupInfo) {
        return axios.post(API_BASE_URL + 'course/' + courseId +
            '/assignment/' + assignmentId + '/rubric/' + rubricId + '/token?token=' + token, assessmentGroupInfo);
    }
}

export default new CanvasApiService();