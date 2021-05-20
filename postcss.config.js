const path = require('path')
module.exports = {
  parser: require('postcss-comment'),
  plugins: [
    require('postcss-import')({
      resolve (id, basedir, importOptions) {
        if (id.startsWith('~@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(3))
        } else if (id.startsWith('@/')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(2))
        } else if (id.startsWith('/') && !id.startsWith('//')) {
          return path.resolve(process.env.UNI_INPUT_DIR, id.substr(1))
        }
        return id
      }
    }),
    require('autoprefixer')({
      remove: process.env.UNI_PLATFORM !== 'h5'
    }),
    // require('postcss-px-to-viewport')({
    //   unitToConvert: 'px',
    //   viewportWidth: 750,
    //   unitPrecision: 5,
    //   propList: ['*'],
    //   viewportUnit: 'px',
    //   fontViewportUnit: 'px',
    //   selectorBlackList: [],
    //   minPixelValue: 1,
    //   mediaQuery: false,
    //   replace: true,
    //   exclude: undefined,
    //   include: undefined,
    //   landscape: false
    // }),
    require('@dcloudio/vue-cli-plugin-uni/packages/postcss')
  ]
}
