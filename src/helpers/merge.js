export default function(destObj, sourceObj) {
    if (!sourceObj) {
        return destObj;
    }

    for (var key in destObj) {        
        if (sourceObj[key] && typeof destObj[key] === typeof sourceObj[key]) {
            destObj[key] = sourceObj[key];
        }
    }
}