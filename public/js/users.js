// Xử lý sự kiện button Xóa bạn bè đề xuất
const btnDeleteFriend = document.querySelectorAll('.card-user [btn-del-friend]');
if(btnDeleteFriend.length > 0) {
    btnDeleteFriend.forEach((btn) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card-user');
            card.style.display = 'none';  
        });
        
    });
}

// Xử lý sự kiện button Thêm bạn bè
const btnAddFriends = document.querySelectorAll('.card-user [btn-add-friend]');
if(btnAddFriends.length > 0) {
    btnAddFriends.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            cardBody.classList.add('add');
            
            socket.emit('CLIENT_ADD_FRIEND', btn.getAttribute('btn-add-friend'));       // gửi userId của người cần kết bạn tới server
        });
    });
}

// Xử lý sự kiện button Hủy lời mời 
const btnCancelFriends = document.querySelectorAll('[btn-cancel-friend]');
if(btnCancelFriends.length > 0) {
    btnCancelFriends.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            cardBody.classList.remove('add');

            socket.emit('CLIENT_CANCEL_FRIEND', btn.getAttribute('btn-cancel-friend'));
        });
    });
}


// Xử lý sự kiện khi đã nhận được yêu cầu kết bạn
const cards = document.querySelectorAll('[user-id]');
if(cards.length > 0) {
    socket.on('SERVER_NOTIFICATION_ADD_FRIEND', (fromUserId) => {
        cards.forEach((card) => {
            if(card.getAttribute('user-id') == fromUserId) {
                const cardBody = card.querySelector('.card-body');
                const arr = cardBody.className.split(' ');
                cardBody.className = arr[0];
                cardBody.classList.add('request');
                return;
            }
        }); 
    })

    socket.on('SERVER_NOTIFICATION_DENIED_FRIEND', (fromUserId) => {
        cards.forEach((card) => {
            if(card.getAttribute('user-id') == fromUserId) {
                const cardBody = card.querySelector('.card-body');
                cardBody.classList.remove('add');
                return;
            }
        }); 
    })

    socket.on('SERVER_NOTIFICATION_CANCEL_FRIEND', (fromUserId) => {
        cards.forEach((card) => {
            if(card.getAttribute('user-id') == fromUserId) {
                const cardBody = card.querySelector('.card-body');
                cardBody.classList.remove('request');
                return;
            }
        }); 
    })


}

// Xử lý sự kiện button Xác nhận
const btnAcceptFriends = document.querySelectorAll('[btn-accept-friend]');
if(btnAcceptFriends.length > 0) {
    btnAcceptFriends.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            cardBody.classList.remove('request');
            cardBody.classList.add('accept');

            socket.emit('CLIENT_ACCEPT_FRIEND', btn.getAttribute('btn-accept-friend'));
        });
    });
}

// Xử lý sự kiện button Từ chối kết bạn
const btnDeniedFriends = document.querySelectorAll('[btn-denied-friend]');
if(btnDeniedFriends.length > 0) {
    btnDeniedFriends.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            cardBody.classList.remove('request');
            cardBody.classList.add('denied');

            socket.emit('CLIENT_DENIED_FRIEND', btn.getAttribute('btn-denied-friend'));
        });  
    });
}

// Xử lý sự kiện Hủy kết bạn
const btnUnFriends = document.querySelectorAll('[btn-unfriend]');
if(btnUnFriends.length > 0) {
    btnUnFriends.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            cardBody.classList.remove('friend');

            socket.emit('CLIENT_UNFRIEND', btn.getAttribute('btn-unfriend'));
        });
    });
}
