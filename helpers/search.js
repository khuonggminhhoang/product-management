module.exports = (query) => {
    const objectSearch = {
        target: ''
    }

    if(query.keyword){
        objectSearch.target = query.keyword;
        objectSearch.regex = { $regex: new RegExp(query.keyword, 'i')}
    }

    return objectSearch;
}