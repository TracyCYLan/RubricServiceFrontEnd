import axios from 'axios';

// const API_BASE_URL = 'https://jsonplaceholder.typicode.com/comments';
const API_BASE_URL = 'http://ecst-csproj2.calstatela.edu:6358/';
class ApiService {

    // fetchTest(){
    //     return axios.get(API_BASE_URL);
    // }
    fetchRubrics() {
        return axios.get(API_BASE_URL + 'rubric');
    }

    fetchRubricById(rubricId) {
        return axios.get(API_BASE_URL + 'rubric/' + rubricId);
    }

    searchRubric(text) {
        return axios.get(API_BASE_URL + 'rubric/search/{text}?text=' + text);
    }

    deleteRubric(rubricId) {
        return axios.delete(API_BASE_URL + 'rubric/delete/' + rubricId);
    }

    addRubric(rubric) {
        return axios.post(API_BASE_URL + 'rubric', rubric);
    }

    addExistedCriterionUnderRubric(rubricId, criterionId) {
        return axios.post(API_BASE_URL + 'rubric/' + rubricId + '/criterion/' + criterionId);
    }

    removeCriterionUnderRubric(rubricId, criterionId) {
        return axios.delete(API_BASE_URL + 'rubric/' + rubricId + '/criterion/' + criterionId);
    }
    changeCriterionOrderUnderRubric(rubricId, order1, order2) {
        return axios.patch(API_BASE_URL + 'rubric/' + rubricId + '/criteria/' + order1 + '/' + order2);
    }
    editRubric(rubric) {
        return axios.patch(API_BASE_URL + 'rubric/' + rubric.id, rubric);
    }
    publishRubric(id) {
        return axios.put(API_BASE_URL + 'rubric/publish/' + id);
    }
    fetchCriteria() {
        return axios.get(API_BASE_URL + 'rubric/criterion');
    }

    fetchCriterionById(criterionId) {
        return axios.get(API_BASE_URL + 'rubric/criterion/' + criterionId);
    }

    searchCriterion(text) {
        return axios.get(API_BASE_URL + 'rubric/criterion/search/{text}?text=' + text);
    }
    deleteCriterion(criterionId) {
        return axios.delete(API_BASE_URL + 'rubric/criterion/delete/' + criterionId);
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
        return axios.post("" + API_BASE_URL + 'rubric/criterion', newCriterion);
    }
    publishCriterion(id) {
        return axios.put(API_BASE_URL + 'rubric/criterion/publish/' + id);
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
        return axios.patch(API_BASE_URL + 'rubric/criterion/' + criterion.id, newCriterion);
    }
    addRating(rating, criterionId) {
        return axios.post(API_BASE_URL + 'rubric/criterion/' + criterionId + '/rating', rating);
    }

    addTag(tag, criterionId) {
        return axios.post(API_BASE_URL + 'rubric/criterion/' + criterionId + '/tag', tag);
    }

    fetchTags() {
        return axios.get(API_BASE_URL + 'rubric/tag');
    }

    fetchhTagById(tagId) {
        return axios.get(API_BASE_URL + 'rubric/tag/' + tagId);
    }

    fetchCriteriaByTag(tagname) {
        return axios.get(API_BASE_URL + 'rubric/criterion/tag/' + tagname);
    }

    searchTag(text) {
        return axios.get(API_BASE_URL + 'rubric/tag/search/{text}?text=' + text);
    }

    fetchUsers() {
        return axios.get(API_BASE_URL + 'user');
    }
    fetchAssociations() {
        return axios.get(API_BASE_URL + 'association');
    }
    fetchArtifacts() {
        return axios.get(API_BASE_URL + 'artifact');
    }
    addTask(task, assessorId, associationId) {
        return axios.post(API_BASE_URL+'task/assessor/'+assessorId+'/association/'+associationId,task);
    }
}

export default new ApiService();