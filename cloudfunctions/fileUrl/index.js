// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const id = event.id
  const db = cloud.database()
  let data = await db.collection('config').limit(100).get()
  const item = data.data.find(item => item.use === id);
  const file_id = item.file_id

  console.log('找到 {} 对应的file信息', id, file_id)

  const res = await cloud.getTempFileURL({
    fileList: [file_id],
  })
 
  console.log('res', res)
  let url = res.fileList[0].tempFileURL 
  console.log('url', url)

  return {
    result: {
      ...item,
      url
    }
  }
}