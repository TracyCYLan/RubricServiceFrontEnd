import axios from 'axios';

const API_BASE_URL = 'http://ecst-csproj2.calstatela.edu:6358/canvas/';

class CanvasApiService {
    fetchCourses() {
        return axios.get(API_BASE_URL + 'courses');
    }
    fetchRubrics(courseId) {
        return axios.get(API_BASE_URL + 'courses/' + courseId + '/rubrics');
    }
    importRubric(courseId,rubricId){
        //get rubric from canvas then post it into db
        return axios.post(API_BASE_URL + 'courses/' + courseId + '/rubrics/'+rubricId);
    }
    fetchCriteria(courseId){
        return axios.get(API_BASE_URL + 'courses/' + courseId + '/criteria');
    }
    importCriterion(criterionId){
        //get outcome from canvas then post it into db
        return axios.post(API_BASE_URL + 'criterion/'+criterionId);
    }
}

export default new CanvasApiService();