const card = document.querySelector('.card');
if(card) {
    const inputTitle = card.querySelector('input[name="title"]');
    const inputs = card.querySelectorAll('input[name="userId"]');
    const btn = card.querySelector('.submit');

    if(btn) {
        const object = {
            title: '',
            users: []
        };

        let cnt = 0;         // đếm số tick lựa chọn
        inputs.forEach(item => {
            item.addEventListener('change', () => {
                if(item.value == 'on') {
                    cnt++;
                }
                else {
                    cnt--;
                }
                btn.disabled = (cnt >= 2) ? false: true;
            })
        });

        btn.addEventListener('click', () => {
            if(inputTitle) {
                object.title = inputTitle.value;
            }

            if(inputs.length > 0) {
                for(let input of inputs) {
                    if(input.checked) {
                        object.users.push({
                            userId: input.id,
                            role: 'user'
                        })
                    }
                }
            }

            const form = document.createElement('form');
            form.action = '/group-chat/create';
            form.method = 'POST'

            const input = document.createElement('input');
            input.name = 'infoRoomChat';
            input.value = JSON.stringify(object);

            form.appendChild(input);

            document.body.appendChild(form);
            form.submit();
            
        })
    }

}