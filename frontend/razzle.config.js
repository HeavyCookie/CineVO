/* eslint-disable */
const path = require('path')

module.exports = {
  plugins: [
    {
      name: 'typescript',
      options: {
        useBabel: true,
        useEslint: true, // ignored if `useBabel` is false
        tsLoader: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
        forkTsChecker: {
          tsconfig: './tsconfig.json',
          tslint: false,
          watch: './src',
          typeCheck: true,
        },
      },
    },
  ],
  modify: config => {
    config.module.rules[0].use[0].options.eslintPath = path.resolve(
      __dirname,
      'node_modules/eslint'
    )
    return config
  },
}
