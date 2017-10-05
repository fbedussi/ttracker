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

export const objHasDeepProp = (obj, deepProp) => {
    const props = deepProp.split('.');
    var objToTest = obj;
    var result = true;

    if (!obj) {
        return false;
    }

    for (let i = 0; i < props.length; i++) {
        if (objToTest && objToTest.hasOwnProperty(props[i])) {
            objToTest = objToTest[props[i]];
        } else {
            result = false;
            break;
        }
    }
    
    return result;
}

export const deepCloneDataObject = (dataObject) => JSON.parse(JSON.stringify(dataObject));
