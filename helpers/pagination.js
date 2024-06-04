module.exports = (query, totalProduct, objectPagination) => {
    if(!isNaN(query.page)){                                 // kiểm tra điều kiện phân trang
        objectPagination.currentPage = parseInt(query.page);
    }   

    objectPagination.totalPage = Math.ceil(totalProduct/objectPagination.limitItems);
    return objectPagination;
}