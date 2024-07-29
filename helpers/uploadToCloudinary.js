const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

let streamUpload = (buffer) => {
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

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

module.exports.uploadImages = async (buffer) => {
    let result = await streamUpload(buffer);         // in object ra là thấy
    return result.secure_url;
}

// end