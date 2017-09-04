export function convertMsToH(ms) {
    return ms / 3600000;
}

export const formatTime = (millisecond) => {
    var seconds = parseInt((millisecond / 1000) % 60);
    var minutes = parseInt((millisecond / (1000 * 60)) % 60);
    var hours = parseInt((millisecond / (1000 * 60 * 60)) % 24);

    return `${hours} : ${minutes < 10 ? '0' + minutes : minutes} : ${seconds < 10 ? '0' + seconds : seconds}`;
}
