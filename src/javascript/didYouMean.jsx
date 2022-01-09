function LDA(str1, str2) {
    // This is Levenshtein Distance
    // https://www.tutorialspoint.com/levenshtein-distance-in-javascript

    const track = Array(str2.length + 1).fill(null).map(() =>
    Array(str1.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i += 1) {
        track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
        track[j][0] = j;
    }
    for (let j = 1; j <= str2.length; j += 1) {
        for (let i2 = 1; i2 <= str1.length; i2 += 1) {
            const indicator = str1[i2 - 1] === str2[j - 1] ? 0 : 1;
            track[j][i2] = Math.min(
                track[j][i2 - 1] + 1, // deletion
                track[j - 1][i2] + 1, // insertion
                track[j - 1][i2 - 1] + indicator, // substitution
            );
        }
    }
    return track[str2.length][str1.length];
}

export const didYouMean = ((thing, list) => {
    let closest = "";
    let closestDistance = Infinity;
    for (let thing2 of list) {
        const distance = LDA(thing2, thing);
        if (distance < closestDistance) {
            closestDistance = distance;
            closest = thing2;
        }
    }
    console.log(closest);
    return closest;
});