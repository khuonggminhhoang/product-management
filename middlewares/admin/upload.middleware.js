// tham khảo https://cloudinary.com/blog/node_js_file_upload_to_a_local_server_or_to_the_cloud
// cloudinary để up ảnh lên cloud
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

module.exports.upload = (req, res, next) => {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        let result = await streamUpload(req);
        req.body.thumbnail = result.secure_url;
        // console.log('Ảnh sau khi được đưa lên cloud: ', req.body.thumbnail);
        next();                                     // để hàm next ở đây là vì phải đợi gán link ảnh cloud cho 
                                                    // key thumbnail trong req.body để sang bước tiếp cập nhật vào csdl
    }

    if(req.file){
        upload(req);
        // Chú ý, không đặt next() ở đây. Vì phải đợi hàm upload xong thì mới next() sang hàm tiếp theo 
    }
    else{
        next();
    }
}