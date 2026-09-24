const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env = {}) => {
  const browser = env.browser || process.env.TARGET_BROWSER || 'chrome';
  const outputPath = path.resolve(__dirname, 'dist', browser);

  return {
    mode: env.production ? 'production' : 'development',
    devtool: 'source-map',
    entry: {
      background: './src/background.ts',
      content: './src/content.ts',
      'converter.worker': './src/converter.worker.ts'
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: '[name].js',
      path: outputPath,
      clean: true,
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, `src/manifest.${browser}.json`),
            to: 'manifest.json'
          }
        ],
      }),
    ],
  };
};
