module.exports.formatTime = (date) => {
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

module.exports.formatDate = (date) => {
    let YYYY = date.getFullYear() + '';
    let MM = date.getMonth() + 1 + '';
    let DD = date.getDate() + '';
    if(DD.length < 2){
        DD = '0' + DD;
    }
    if(MM.length < 2){
        MM = '0' + MM;
    }
    return `${YYYY}-${MM}-${DD}`;
}

module.exports.formatDateTime = (date) => {
    const dateStd = this.formatDate(date);
    const timeStd = this.formatTime(date);
    return `${dateStd} ${timeStd}`;
}