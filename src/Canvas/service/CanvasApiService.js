import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/canvas/';
const API_BASE_URL = 'https://alice.cysun.org/alice-rubrics/canvas/';

class CanvasApiService {
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

    exportRubric(rubricId, courseId, token) {
        return axios.post(API_BASE_URL + 'rubric/' + rubricId +
            '/export/course/' + courseId + '/token?token=' + token);
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