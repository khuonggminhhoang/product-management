// Permission
const tablePermission = document.querySelector('[table-permission]');
if(tablePermission){
    const btnUpdate = document.querySelector('[update-button]');
    if(btnUpdate){
        btnUpdate.addEventListener('click', () => {
            const arrObject = []
            const thPermissions = tablePermission.querySelectorAll('thead th[permission]');
        
            for(let th of thPermissions){
                arrObject.push({
                    id: th.id,
                    permission: []
                });
            }
            const rows = tablePermission.querySelectorAll('tr[data-name]');
            if(rows.length > 0){
                for(let row of rows){
                    const checkBoxs = row.querySelectorAll('td input[type="checkbox"]');
                    
                    checkBoxs.forEach((item, index) => {
                        if(item.checked){
                            arrObject[index].permission.push(row.getAttribute('data-name'));
                        }
                    });
                }
            } 
            
            // tạo form ẩn để gửi data qua button cập nhật khi click
            const form = document.createElement('form');
            form.method = "POST"
            form.action = `/admin/roles/permissions`;
            
            const input = document.createElement('input');
            input.value = JSON.stringify(arrObject);
            input.name = 'arrObject'
            input.type = 'hidden'
            
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
        })
    }   
}
// End Permission
