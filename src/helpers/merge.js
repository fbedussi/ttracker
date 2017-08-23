export default function(destObj, sourceObj) {
    for (var key in destObj) {        
        if (sourceObj[key] && (typeof destObj[key] === typeof sourceObj[key] || destObj[key] === null)) {
            destObj[key] = sourceObj[key];
        }
    }
}