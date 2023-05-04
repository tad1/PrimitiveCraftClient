module.exports = [
    {
      mode: 'development',
      entry: './dist/game.js',
      target: 'electron-main',
      devtool: "source-map",
      module: {
        rules: [{
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }]
        }]
      },
      output: {
        path: __dirname + '/dist',
        filename: 'game.js'
      }
    }
  ];