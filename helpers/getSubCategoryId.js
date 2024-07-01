module.exports.getSubCategoryId = async (model, parentId) => {
    const getSubCategory = async (model, parentId) => {
        const subs = await model.find({
            parentId: parentId,
            status: 'active',
            deleted: false
        });
    
        let arr = [...subs];
    
        for(let sub of subs){
            const childs = await getSubCategory(model, sub.id); 
            arr = [...arr, ...childs]
        }
        return arr;
    }

    const result = await getSubCategory(model, parentId);
    return result.map(item => item.id);
}
// return list id category