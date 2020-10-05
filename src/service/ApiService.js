import axios from 'axios';
const API_BASE_URL = 'https://alice.cysun.org/alice-rubrics/';
// const API_BASE_URL = 'http://localhost:8080/';
const aliceObj = window.sessionStorage.getItem("oidc.user:https://identity.cysun.org:alice-rubric-service-spa");
const homepage = '/tlan/#'; // /#/criteria /tlan/#
class ApiService {

    constructor() {
        this.setInterceptors();
    }

    setInterceptors() {
        if (aliceObj)
        {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + JSON.parse(aliceObj)['access_token'];
        }
        else
        {
            axios.defaults.headers.common['Authorization'] = null;
        }
        axios.interceptors.response.use(response => {
            return response;
        }, error => {
            if (error.message === 'Network Error'|| error.response.status === 502) { //if didn't turn on the spring-boot server 
                alert('Rubric Server is Down. Please come to visit the site later');
            }
            else if (error.response.status === 401) {
                console.log(error.message)
                alert("Sorry, your login is expired!")
                window.location.replace(homepage);//go to homepage
                window.sessionStorage.removeItem("oidc.user:https://identity.cysun.org:alice-rubric-service-spa");
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

    fetchRubrics() {
        return axios.get(API_BASE_URL + 'rubric')
    }

    fetchRubricById(rubricId) {
        return axios.get(API_BASE_URL + 'rubric/' + rubricId);
    }

    searchRubric(text) {
        return axios.get(API_BASE_URL + 'rubric/search/text?text=' + text);
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
        return axios.get(API_BASE_URL + 'rubric/criterion/search/text?text=' + text);
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
        return axios.get(API_BASE_URL + 'rubric/tag/search/text?text=' + text);
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

    fetchAssessmentGroups() {
        return axios.get(API_BASE_URL + 'assessment/assessmentgroup');
    }

    fetchAssessmentGroupById(id) {
        return axios.get(API_BASE_URL + 'assessment/assessmentgroup/' + id);
    }

    fetchAssessmentGroupsByRubric(rid) {
        return axios.get(API_BASE_URL + 'assessment/rubric/' + rid + '/assessmentgroup');
    }

    searchAssessmentGroup(text) {
        return axios.get(API_BASE_URL + 'assessment/assessmentgroup/search/text?text=' + text);
    }

    fetchAssessmentById(id) {
        return axios.get(API_BASE_URL + 'assessment/' + id);
    }

    fetchArtifactById(id) {
        return axios.get(API_BASE_URL + 'assessment/artifact/' + id);
    }

    checkDownloadNeeded(ext, id) {
        return axios.get(API_BASE_URL + 'assessment/artifact/download/' + ext).then(res => {
            if (res.data === true)
                return axios.get(API_BASE_URL + 'assessment/artifact/' + id + '/download', { responseType: 'blob' });
            else
                return axios.get(API_BASE_URL + 'assessment/artifact/' + id + '/download')
        })
    }
}

export default new ApiService();