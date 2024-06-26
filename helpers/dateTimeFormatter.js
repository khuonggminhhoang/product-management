module.exports.formatTime = (milliseconds) => {
    let date = new Date(milliseconds);
    let HH = date.getHours() + '';
    let mm = date.getMinutes() + '';
    let ss = date.getSeconds() + '';
    if(HH.length < 2){
        HH = '0' + HH;
    }
    if(mm.length < 2){
        mm = '0' + mm;
    }
    if(ss.length < 2){
        ss = '0' + ss;
    }

    return `${HH}:${mm}:${ss}`;
}

module.exports.formatDate = (milliseconds) => {
    let date = new Date(milliseconds);
    let YYYY = date.getFullYear() + '';
    let MM = date.getMonth() + '';
    let DD = date.getDate() + '';
    if(DD.length < 2){
        DD = '0' + DD;
    }
    if(MM.length < 2){
        MM = '0' + MM;
    }
    return `${DD}/${MM}/${YYYY}`;
}

module.exports.formatDateTime = (milliseconds) => {
    const dateStd = this.formatDate(milliseconds);
    const timeStd = this.formatTime(milliseconds);
    return `${dateStd} ${timeStd}`;
}