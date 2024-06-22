//=================================== Hàm này lấy ra các danh mục và phân cấp
function createTree(arr, parentId){
    const ans = [];
    for(let item of arr){
        if(item.parentId == parentId){
            const newItem = item;
            const child = createTree(arr, newItem.id);
            if(child.length > 0){
                newItem.children = child;
            }
            ans.push(newItem);
        }
    }
    return ans;
}
//====================================

module.exports = createTree;