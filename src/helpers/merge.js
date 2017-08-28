 function merge(destObj, sourceObj) {
    if (!sourceObj) {
        return destObj;
    }

    for (var key in destObj) {        
        if (sourceObj[key] && typeof destObj[key] === typeof sourceObj[key]) {
            if (destObj[key].constructor !== Object) { //typeof !== 'object' won't work becaouse returns true for arrays
                destObj[key] = sourceObj[key];
            } else {
                merge(destObj[key], sourceObj[key]);
            }
        }
    }
}

export default merge;