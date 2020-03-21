import axios from 'axios';

// const API_BASE_URL = 'https://jsonplaceholder.typicode.com/comments';
const API_BASE_URL = 'http://localhost:8080/rubric';
class ApiService {

    // fetchTest(){
    //     return axios.get(API_BASE_URL);
    // }
    fetchRubrics() {
        return axios.get(API_BASE_URL);
    }

    fetchRubricById(rubricId) {
        return axios.get(API_BASE_URL + '/' + rubricId);
    }

    searchRubric(text) {
        return axios.get(API_BASE_URL + '/search/{text}?text=' + text);
    }

    deleteRubric(rubricId) {
        return axios.delete(API_BASE_URL + '/delete/' + rubricId);
    }

    addRubric(rubric) {
        return axios.post(API_BASE_URL, rubric);
    }
    
    addExistedCriterionUnderRubric(rubricId, criterionId) {
        return axios.post(API_BASE_URL + "/" + rubricId + "/criterion/" + criterionId);
    }
    
    removeCriterionUnderRubric(rubricId, criterionId) {
        return axios.delete(API_BASE_URL + "/" + rubricId + "/criterion/" + criterionId);
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

    searchCriterion(text) {
        return axios.get(API_BASE_URL + '/criterion/search/{text}?text=' + text);
    }
    deleteCriterion(criterionId) {
        return axios.delete(API_BASE_URL + '/criterion/delete/' + criterionId);
    }

    addCriterion(criterion, ratings, tags) {
        const newCriterion = {
            name: criterion.name,
            description: criterion.description,
            publishDate: criterion.publishDate,
            reusable: criterion.reusable,
            ratings: ratings.map(function (rating) { return { description: rating.description, value: rating.value } }),
            tags: tags.map(function (t) { return { value: t } })
        };
        return axios.post("" + API_BASE_URL + '/criterion', newCriterion);
    }

    editCriterion(criterion, ratings, tags) {
        const newCriterion = {
            id: criterion.id,
            name: criterion.name,
            description: criterion.description,
            publishDate: criterion.publishDate,
            reusable: criterion.reusable,
            ratings: ratings.map(function (rating) { return { description: rating.description, value: rating.value } }),
            tags: tags.map(function (t) { return { value: t } })
        };
        return axios.patch(API_BASE_URL + '/criterion/' + criterion.id, newCriterion);
    }
    addRating(rating, criterionId) {
        return axios.post(API_BASE_URL + '/criterion/' + criterionId + '/rating', rating);
    }

    addTag(tag, criterionId) {
        return axios.post(API_BASE_URL + '/criterion/' + criterionId + '/tag', tag);
    }

    fetchTags() {
        return axios.get(API_BASE_URL + '/tag');
    }

    fetchhTagById(tagId) {
        return axios.get(API_BASE_URL + '/tag/' + tagId);
    }

    fetchCriteriaByTag(tagname) {
        return axios.get(API_BASE_URL + '/criterion/tag/' + tagname);
    }

    searchTag(text) {
        return axios.get(API_BASE_URL + '/tag/search/{text}?text=' + text);
    }
}

export default new ApiService();