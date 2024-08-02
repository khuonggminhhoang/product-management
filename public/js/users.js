// Xử lý sự kiện button Xóa bạn bè đề xuất
const btnDeleteFriend = document.querySelectorAll('.card-user [btn-del-friend]');
if (btnDeleteFriend.length > 0) {
    btnDeleteFriend.forEach((btn) => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card-user');
            card.style.display = 'none';
        });

    });
}

// Xử lý sự kiện button Thêm bạn bè
const btnAddFriends = document.querySelectorAll('.card-user [btn-add-friend]');
if (btnAddFriends.length > 0) {
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
if (btnCancelFriends.length > 0) {
    btnCancelFriends.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            cardBody.classList.remove('add');

            socket.emit('CLIENT_CANCEL_FRIEND', btn.getAttribute('btn-cancel-friend'));
        });
    });
}


// Xử lý sự kiện button Xác nhận
const btnAcceptFriends = document.querySelectorAll('[btn-accept-friend]');
if (btnAcceptFriends.length > 0) {
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
if (btnDeniedFriends.length > 0) {
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
if (btnUnFriends.length > 0) {
    btnUnFriends.forEach((btn) => {
        btn.addEventListener('click', () => {
            const cardBody = btn.closest('.card-body');
            cardBody.classList.remove('friend');

            socket.emit('CLIENT_UNFRIEND', btn.getAttribute('btn-unfriend'));
        });
    });
}


// Xử lý sự kiện khi đã nhận được yêu cầu kết bạn
const cards = document.querySelectorAll('[user-id]');
if (cards.length > 0) {
    socket.on('SERVER_NOTIFICATION_ADD_FRIEND', (fromUserId) => {
        cards.forEach((card) => {
            if (card.getAttribute('user-id') == fromUserId) {
                const cardBody = card.querySelector('.card-body');
                const arr = cardBody.className.split(' ');
                cardBody.className = arr[0];
                cardBody.classList.add('request');
                return;
            }
        });
    });

    socket.on('SERVER_NOTIFICATION_DENIED_FRIEND', (fromUserId) => {
        cards.forEach((card) => {
            if (card.getAttribute('user-id') == fromUserId) {
                const cardBody = card.querySelector('.card-body');
                cardBody.classList.remove('add');
                return;
            }
        });
    });

    socket.on('SERVER_NOTIFICATION_CANCEL_FRIEND', (fromUserId) => {
        cards.forEach((card) => {
            if (card.getAttribute('user-id') == fromUserId) {
                const cardBody = card.querySelector('.card-body');
                cardBody.classList.remove('request');
                return;
            }
        });
    });

    socket.on('SERVER_NOTIFICATION_UNFRIEND', (fromUserId) => {
        cards.forEach((card) => {
            if (card.getAttribute('user-id') == fromUserId) {
                const cardBody = card.querySelector('.card-body');
                cardBody.classList.remove('friend');
                return;
            }
        });
    });
}

// Cập nhật thông báo số lượng lời mời kết bạn
socket.on('SERVER_RETURN_ACCEPT_QUANTITY', ({ acceptQty, fromUser }) => {
    const badgeNotiAccept = document.querySelector('[badge-noti-accept]');

    const acceptFriend = document.querySelector('.accept-friend');
    if (parseInt(badgeNotiAccept.innerHTML) < acceptQty) {

        if (acceptFriend) {
            const cardUser = document.createElement('div');
            cardUser.className = 'col-2 card-user';
            cardUser.setAttribute('user-id', fromUser._id);
            cardUser.innerHTML = `
                <div class="card mb-2">
                    <img class="card-img-top" src="${fromUser.avatar}" alt='avatar' />
                    <div class="card-body request">
                        <p class="card-title">${fromUser.fullName}</p>
                        <small class="sent-friend"> Đã gửi lời mời </small>
                        <button class="btn-block btn btn-info btn-sm" btn-add-friend="${fromUser._id}" > Thêm bạn bè</button>
                        <button class="btn-block btn btn-info btn-sm mt-0" btn-accept-friend="${fromUser._id}" > Xác nhận</button>
                        <button class="btn-block btn btn-secondary btn-sm" btn-del-friend="${fromUser._id}" > Xóa</button>
                        <button class="btn-block btn btn-secondary btn-sm" btn-cancel-friend="${fromUser._id}" > Hủy lời mời</button>
                        <button class="btn-block btn btn-secondary btn-sm" btn-denied-friend="${fromUser._id}" > Từ chối lời mời</button>
                        <button class="btn-block btn btn-secondary btn-sm mt-3" noti-accepted disabled" > Đã chấp nhận kết bạn</button>
                        <button class="btn-block btn btn-secondary btn-sm mb-3" noti-denied disabled" > Đã Từ chối kết bạn</button>
                    </div>
                </div>
            `;
            acceptFriend.appendChild(cardUser);

            // Bắt sự kiện cho nút xác nhận
            const btnAcceptFriend = cardUser.querySelector('[btn-accept-friend]');
            if (btnAcceptFriend) {
                btnAcceptFriend.addEventListener('click', () => {
                    const cardBody = btnAcceptFriend.closest('.card-body');
                    cardBody.classList.remove('request');
                    cardBody.classList.add('accept');

                    socket.emit('CLIENT_ACCEPT_FRIEND', btnAcceptFriend.getAttribute('btn-accept-friend'));
                });
            }

            // bắt sự kiện cho nút từ chối lời mời
            const btnDeniedFriend = cardUser.querySelector('[btn-denied-friend]');
            if (btnDeniedFriend) {
                btnDeniedFriend.addEventListener('click', () => {
                    const cardBody = btnDeniedFriend.closest('.card-body');
                    cardBody.classList.remove('request');
                    cardBody.classList.add('denied');

                    socket.emit('CLIENT_DENIED_FRIEND', btnDeniedFriend.getAttribute('btn-denied-friend'));
                });
            }
        }
    }
    else {
        if (acceptFriend) {
            const cardUser = acceptFriend.querySelector(`[user-id="${fromUser._id}"]`);
            cardUser.remove();          // xóa chính phần tử đó
        }
    }

    if (badgeNotiAccept) {
        badgeNotiAccept.innerHTML = acceptQty;
    }


});
