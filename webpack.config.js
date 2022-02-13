module.exports = {
    target: 'node',
    entry: require.resolve('./src/index.js'),
    resolve: {
        fallback: { "timers": require.resolve("timers-browserify") }
    },
};