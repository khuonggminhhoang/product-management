const Article = require('./../../models/article.model');
const Account = require('./../../models/account.model');

const dateTimeFormatterHelper = require('./../../helpers/dateTimeFormatter');


// [GET] /articles
module.exports.index = async (req, res) => {
    try{
        // Tin tức nổi bât
        const featuredArticles = await Article.find({
            featured: true,
            status: "published",
            deleted: false
        }).sort({position: 'desc'});;
    
        for(let item of featuredArticles){
            const accountCreate = await Account.findOne({
                _id: item.createdBy.accountId
            })

            if(accountCreate){
                item.accountCreate = accountCreate;
                item.dateTimeCreate = dateTimeFormatterHelper.formatDateTime(item.createdBy.createAt);
            }
        }

        // Tin tức mới nhất
        const newestArticles = await Article.find({
            status: "published",
            deleted: false
        }).limit(5).sort({position: 'desc'});

        for(let item of newestArticles){
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
            featuredArticles: featuredArticles,
            newestArticles: newestArticles
        })

    }
    catch(err){
        res.status(404).json('Not found');
    }
}