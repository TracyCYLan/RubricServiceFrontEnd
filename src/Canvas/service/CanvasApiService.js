import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/canvas/';
// const API_BASE_URL = 'http://alice.cysun.org/alice-rubrics/canvas/';

class CanvasApiService {
    fetchCourses(token) {
        return axios.get(API_BASE_URL + 'courses/token?token='+token);
    }
    fetchRubrics(courseId,token) {
        return axios.get(API_BASE_URL + 'courses/' + courseId + '/rubrics/token?token='+token);
    }
    importRubric(courseId,rubricId,token){
        //get rubric from canvas then post it into db
        return axios.post(API_BASE_URL + 'courses/' + courseId + '/rubrics/'+rubricId+'/token?token='+token);
    }
    fetchCriteria(courseId,token){
        return axios.get(API_BASE_URL + 'courses/' + courseId + '/criteria/token?token='+token);
    }
    importCriterion(criterionId,token){
        //get outcome from canvas then post it into db
        return axios.post(API_BASE_URL + 'criterion/'+criterionId+'/token?token='+token);
    }

}

export default new CanvasApiService();