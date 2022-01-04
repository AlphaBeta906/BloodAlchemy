export const randomInt = (max) => {
    const crypto = window.crypto;
    var array = new Uint32Array(1);

    return crypto.getRandomValues(array);
}