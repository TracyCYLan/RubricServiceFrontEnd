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

    addRubric(rubric, criteria, importedCriteria) {
        return axios.post("" + API_BASE_URL, rubric).then(response => {
            importedCriteria.map(
                c => {
                    return this.addExistedCriterionUnderRubric(response.data,c.id);
                }
            )
            //add criteria
            criteria.map(
                criterion => {
                    const newCriterion = {
                        name: criterion.name,
                        description: criterion.description,
                        publihDate: rubric.publihDate,
                        reusable: false
                    };
                    return this.addCriterionUnderRubric(response.data, newCriterion, criterion.ratings);
                }
            )
        })
    }
    addExistedCriterionUnderRubric(rubricId, criterionId) {
        return axios.post(API_BASE_URL + "/" + rubricId + "/criterion/" + criterionId);
    }
    addCriterionUnderRubric(rubricId, criterion, ratings) {
        return axios.post(API_BASE_URL + '/criterion', criterion).then(response => {
            //bind relationship between ratings and criterion
            ratings.map(
                rating => {
                    const newRating = { description: rating.description, value: rating.value };
                    return this.addRating(newRating, response.data);
                })
            //bind relationship between criterion and rubric
            return this.addExistedCriterionUnderRubric(rubricId, response.data);

        })
    }
    editRubric(rubric, criteria, importedCriteria) {
        //first update rubric basic props, then clear all original criteria with original rubric
        return axios.patch(API_BASE_URL + '/' + rubric.id, rubric).then(response=>{
            //then we are going to create connection with rubric and importedCriteria
            importedCriteria.map(
                c => {
                    return this.addExistedCriterionUnderRubric(rubric.id,c.id);
                }
            )
            //and bind rubric with newcriteria
            criteria.map(
                criterion => {
                    const newCriterion = {
                        name: criterion.name,
                        description: criterion.description,
                        publihDate: rubric.publihDate,
                        reusable: false
                    };
                    return this.addCriterionUnderRubric(rubric.id, newCriterion, criterion.ratings);
                }
            )
        })
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
        return axios.post("" + API_BASE_URL + '/criterion', criterion).then(response => {
            //tags is an array of strings
            tags.map(
                tagvalue => {
                    const newTag = { value: tagvalue };
                    return this.addTag(newTag, response.data);
                }
            )
            ratings.map(
                rating => {
                    const newRating = { description: rating.description, value: rating.value };
                    return this.addRating(newRating, response.data);
                }
            )
        })
    }

    editCriterion(criterion, ratings, tags) {
        return axios.patch(API_BASE_URL + '/criterion/' + criterion.id, criterion).then(response => {
            //tags is an array of strings
            tags.map(
                tagvalue => {
                    const newTag = { value: tagvalue };
                    return this.addTag(newTag, criterion.id);
                }
            )
            ratings.map(
                rating => {
                    const newRating = { description: rating.description, value: rating.value };
                    return this.addRating(newRating, criterion.id);
                }
            )
        });
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