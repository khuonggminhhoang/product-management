// Xử lý sự kiện xóa friend
const btnDeleteFriend = document.querySelectorAll('.card-user [btn-del-friend]');
if(btnDeleteFriend.length > 0) {
    btnDeleteFriend.forEach((btn) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card-user');
            card.style.display = 'none'; 
            
        });
        
    });
}

// Xử lý sự kiện button kết bạn
const btnAddFriends = document.querySelectorAll('.card-user [btn-add-friend]');
if(btnAddFriends.length > 0) {
    btnAddFriends.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            cardBody.classList.add('add');

            socket.emit('CLIENT_REQUEST_FRIEND', btn.getAttribute('btn-add-friend'));       // gửi userId của người cần kết bạn tới server
        });
    });
}

// Xử lý sự kiện button Hủy lời mời 
const btnCancelFriends = document.querySelectorAll('.card-user [btn-cancel-friend]');
if(btnCancelFriends.length > 0) {
    btnCancelFriends.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            cardBody.classList.remove('add');
        });
    });
}