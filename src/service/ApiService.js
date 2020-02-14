import axios from 'axios';

// const API_BASE_URL = 'https://jsonplaceholder.typicode.com/comments';
const API_BASE_URL = 'http://localhost:8080/rubric';
class ApiService {

    fetchRubrics() {
        return axios.get(API_BASE_URL);
    }

    fetchRubricById(rubricId) {
        return axios.get(API_BASE_URL + '/' + rubricId);
    }

    deleteRubric(rubricId) {
        return axios.delete(API_BASE_URL + '/delete/' + rubricId);
    }

    addRubric(rubric) {
        return axios.post(""+API_BASE_URL, rubric);
    }

    editRubric(rubric) {
        return axios.patch(API_BASE_URL + '/' + rubric.id, rubric);
    }

    fetchCriteria() {
        return axios.get(API_BASE_URL + '/criterion');
    }

    fetchCriterionById(criterionId) {
        return axios.get(API_BASE_URL + '/criterion/' + criterionId);
    }

    deleteCriterion(criterionId) {
        return axios.delete(API_BASE_URL + '/criterion/delete/' + criterionId);
    }

    addCriterion(criterion) {
        return axios.post(""+API_BASE_URL+'/criterion', criterion);
    }

    editCriterion(criterion) {
        return axios.patch(API_BASE_URL + '/criterion/' + criterion.id, criterion);
    }
}

export default new ApiService();