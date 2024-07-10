module.exports.ramdomNumber = (strlen) => {
    const random = '0123456789';
    let res = '';

    for(let i = 0; i < strlen; ++i){
        res += random.charAt(Math.floor(Math.random() * random.length));
    }
    return res;
}