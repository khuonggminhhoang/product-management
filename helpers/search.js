module.exports = (query) => {
    const objectSearch = {
        'product-name': ''
    }

    if(query['product-name']){
        objectSearch['product-name'] = query['product-name'];
        objectSearch.regex = { $regex: new RegExp(query['product-name'], 'i')}
    }

    return objectSearch;
}