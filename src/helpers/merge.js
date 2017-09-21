 function merge(destObj, sourceObj) {
    if (!sourceObj) {
        return destObj;
    }

    Object.keys(destObj).forEach((key) => {
        if (sourceObj[key] && typeof destObj[key] === typeof sourceObj[key]) {
            if (destObj[key].constructor !== Object) { //typeof !== 'object' won't work becaouse returns true for arrays
                destObj[key] = sourceObj[key];
            } else {
                merge(destObj[key], sourceObj[key]);
            }
        }
    });

    return destObj;
}

export default merge;