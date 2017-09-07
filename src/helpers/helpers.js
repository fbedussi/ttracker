export function convertMsToH(ms) {
    return ms / 3600000;
}

export const formatTime = (millisecond) => {
    var seconds = parseInt((millisecond / 1000) % 60, 10);
    var minutes = parseInt((millisecond / (1000 * 60)) % 60, 10);
    var hours = parseInt((millisecond / (1000 * 60 * 60)) % 24, 10);

    return `${hours} : ${minutes < 10 ? '0' + minutes : minutes} : ${seconds < 10 ? '0' + seconds : seconds}`;
}

export const getOnlyOwnProperies = (obj) => {
    var newObj = {};
    Object.keys(obj).forEach((key) => {
        newObj[key] = Array.isArray(obj[key]) ? obj[key].map((i) => i) : obj[key]
    });

    return newObj;
}

