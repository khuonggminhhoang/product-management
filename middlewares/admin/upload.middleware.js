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
                        resolve(result);                    // Khi Promise được giải quyết bằng resolve(result) trong hàm streamUpload, kết quả result sẽ được truyền đến nơi mà streamUpload được gọi
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
        req.body[req.file.fieldname] = result.secure_url;
        next();                                     // để hàm next ở đây là vì phải đợi gán link ảnh cloud cho 
    }

    if(req.file){
        upload(req);
        // Chú ý, không đặt next() ở đây. Vì phải đợi hàm upload xong thì mới next() sang hàm tiếp theo 
    }
    else{
        next();
    }
}
// end

module.exports.uploadMulti = (req, res, next) => {
    // console.log(req.files);                              // Lưu ý, req.files là 1 object chứ không phải à 1 mảng 
    let streamUpload = (file) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);                    // Khi Promise được giải quyết bằng resolve(result) trong hàm streamUpload, kết quả result sẽ được truyền đến nơi mà streamUpload được gọi
                    } else {
                        reject(error);
                    }
                }
            );

            streamifier.createReadStream(file.buffer).pipe(stream);
        });
    };

    async function upload(req) {
        for(let key in req.files) {
            let result = await streamUpload(req.files[key][0]);         // in object ra là thấy
            req.body[key] = result.secure_url;
        }
        next();                                     // để hàm next ở đây là vì phải đợi gán link ảnh cloud cho 
    }

    if(req.files){
        upload(req);
        // Chú ý, không đặt next() ở đây. Vì phải đợi hàm upload xong thì mới next() sang hàm tiếp theo 
    }
    else{
        next();
    }
}
// end