const colorDistance = (hex1, hex2) => {
    var hex1_r = hex1.substring(0, 2);
    var hex1_g = hex1.substring(2, 4);
    var hex1_b = hex1.substring(4, 6);

    var hex2_r = hex2.substring(0, 2);
    var hex2_g = hex2.substring(2, 4);
    var hex2_b = hex2.substring(4, 6);

    // This is Euclidean distance
    var r = Math.pow(parseInt(hex2_r, 16) - parseInt(hex1_r, 16), 2);
    var g = Math.pow(parseInt(hex2_g, 16) - parseInt(hex1_g, 16), 2);
    var b = Math.pow(parseInt(hex2_b, 16) - parseInt(hex1_b, 16), 2);

    return Math.sqrt(r + g + b);
}

export const gDTRGB = (hex) => {
    var r = colorDistance(hex, "FF0000");
    var g = colorDistance(hex, "00FF00");
    var b = colorDistance(hex, "0000FF");

    return Math.sqrt(r + g + b);
};