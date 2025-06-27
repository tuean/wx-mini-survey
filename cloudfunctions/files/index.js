// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

async function addTempURLsBatch(items) {
  // 1. 提取所有 fileID
  const fileIDs = items.map(item => item.file_id);
  
  try {
    // 2. 单次批量请求临时链接
    const res = await new Promise((resolve, reject) => {
      cloud.getTempFileURL({
        fileList: fileIDs,
        success: (apiRes) => resolve(apiRes.fileList), // ✅ 仅返回 fileList 数组
        fail: (e) => {console.log(e); reject(e)}
      });
    });
    console.log('res', res)

    // 3. 构建 fileID -> URL 的映射表
    const urlMap = new Map();
    res.fileList.forEach(file => {
      if (file.tempFileURL) {
        urlMap.set(file.fileID, file.tempFileURL);
      }
    });

    // 4. 合并结果到原数组
    return items.map(item => ({
      ...item,
      url: urlMap.get(item.file_id) || null // 未匹配时返回 null
    }));

  } catch (err) {
    console.error('批量获取链接失败:', err);
    // 5. 错误处理：返回带空链接的原数据
    return items.map(item => ({ ...item, url: null }));
  }
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  let data = await db.collection('config').limit(100).get()
  console.log('all configs', data);
  
  let result = await addTempURLsBatch(data.data)
  console.log('result', result)

  return {
    configs: result
  }
}