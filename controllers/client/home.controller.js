// [GET] /
const index = (req, res) => {
    res.render('./client/pages/home/index.pug', {title: 'Trang chủ'});
}

module.exports = {index};