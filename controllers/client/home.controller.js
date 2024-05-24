const index = (req, res) => {
    res.render('./client/pages/home/index.pug', {title: 'Home'})
}

module.exports = {index}