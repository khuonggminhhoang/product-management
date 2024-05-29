const dashboard = (req, res) => {
    res.render('./admin/pages/dashboard/index.pug', {title: 'Dashboard'});
}

module.exports = {dashboard};