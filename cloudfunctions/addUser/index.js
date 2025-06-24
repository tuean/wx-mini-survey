// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(wxContext)

  let openid = wxContext.OPENID
  console.log(openid)
  let personInfo = event.personInfo
  const db = cloud.database()

  // let a = db.collection('users').get()


  const data = {
    // _id: openid,
    personInfo: personInfo
  }
  console.log(data)
  const updateResult = await db.collection('users').doc(openid).update({
    data: {
      personInfo: personInfo
    }
  })

  if (updateResult.stats.updated >= 1) {
    return {
      success: true,
      action: 'update',
      data: data,
      message: '数据更新成功'
    }
  } else {
    // 如果文档不存在，执行插入操作
    // 先添加创建时间字段
    data.createdAt = db.serverDate()
  
    try {
      const addResult = await db.collection('users').add({
        data: {
          _id: openid,
          personInfo: personInfo,
        },
      })
      let status = addResult.status
      console.log(status)
    } catch (e) {
      console.log(e)
    }

    

    return {
      success: true,
      action: 'insert',
      data: data,
      message: '数据创建成功'
    }
  }
}