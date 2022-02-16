module.exports = {
    target: 'node',
    entry: './src/index.js',
    resolve: {
        fallback: { "timers": require.resolve("timers-browserify") }
    },
};