const NODE_ENV = process.env.NODE_ENV;
// const UNI_PLATFORM = process.env.UNI_PLATFORM; // 各平台标识
// console.log('NODE_ENVNODE_ENVNODE_ENVNODE_ENVNODE_ENVNODE_ENVNODE_ENVNODE_ENVNODE_ENVNODE_ENVNODE_ENVNODE_ENVNODE_ENV');
// console.log(NODE_ENV);
// console.log(process.env.UNI_PLATFORM);

// const outputDirObj = {
//   'debug': 'PublishTarget/Debug',
//   'production': 'PublishTarget/Release',
//   'test01': 'PublishTarget/PublishTest01',
//   'test02': 'PublishTarget/PublishTest02',
// }
// let _outputDirObj = NODE_ENV.replace(/\;|\'|\'/g,'');

// // // 非h5下的开发环境
// // if(NODE_ENV === 'development' && UNI_PLATFORM !== 'h5'){
// //   _outputDirObj = 
// // }

// module.exports = {
//   // lintOnSave: false,
//   publicPath: "./",
//   outputDir:'dsessss', // outputDirObj[_outputDirObj],
//   assetsDir: "content", // 将除了index.html的所有文件都打包到content文件夹中, publish的静态文件要用content包起来
//   configureWebpack: {
//       externals: {
//         'vue': 'Vue',
//       //   'vuex': 'Vuex',
//       //   'vue-router': 'VueRouter',
//       // 'element-ui': 'ELEMENT',
//       // 'ant-design-vue':'antd',
//       'moment':'moment',
//       "AMap": "AMap",
//       //   'Axios':'axios'
//       },
//     }
// }


// package.json中设置VUE_APP_FJ_URL,在此处设置才生效
if(NODE_ENV==='development'){
  process.env.VUE_APP_FJ_URL = 'http://192.168.2.222:8005'
}
if(NODE_ENV==='production'){
  process.env.VUE_APP_FJ_URL = 'production-dddddd'
}

