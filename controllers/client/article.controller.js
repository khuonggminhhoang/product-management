const Article = require('./../../models/article.model');
const Account = require('./../../models/account.model');

const dateTimeFormatterHelper = require('./../../helpers/dateTimeFormatter');


// [GET] /articles
module.exports.index = async (req, res) => {
    try{
        const featuredArticle = await Article.find({
            featured: true,
            status: "published",
            deleted: false
        }).sort({position: 'desc'});
    
        for(let item of featuredArticle){
            const accountCreate = await Account.findOne({
                _id: item.createdBy.accountId
            })

            if(accountCreate){
                item.accountCreate = accountCreate;
                item.dateTimeCreate = dateTimeFormatterHelper.formatDateTime(item.createdBy.createAt);
            }
        }
    
        res.render('./client/pages/articles/index.pug', {
            title: 'Blog',
            featuredArticle: featuredArticle
        })

    }
    catch(err){
        res.status(404).json('Not found');
    }
}