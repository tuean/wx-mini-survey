// pages/map/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    playing: false,
    innerAudioContext: null,
    videoUrl: '',
    // x: 0,
    // y: 0,
    // dataScale: 1.0,
    mapImage1: '/static/flag.jpg',
    video: '/static/SampleVideo.mp4',
    mapImage: '/static/pc-all.png', // 地图底图路径
    markers: [
      { id: 1, x: 100, y: 150, title: '标记点1', desc: '这是第一个标记点的描述信息' },
      { id: 2, x: 250, y: 200, title: '标记点2', desc: '这是第二个标记点的描述信息' },
      { id: 3, x: 180, y: 300, title: '标记点3', desc: '这是第三个标记点的描述信息' }
    ],
    scale: 1, // 当前缩放比例
    minScale: 0.5, // 最小缩放比例
    maxScale: 2, // 最大缩放比例
    translateX: 0, // X轴偏移
    translateY: 0, // Y轴偏移
    mapWidth: 800, // 地图宽度
    mapHeight: 600, // 地图高度
    windowWidth: 0, // 窗口宽度
    windowHeight: 0, // 窗口高度
    currentMarker: null, // 当前选中的标记
    showMarkerInfo: false, // 是否显示标记信息
    touchStartTime: 0, // 触摸开始时间
    touchStartX: 0, // 触摸开始X坐标
    touchStartY: 0, // 触摸开始Y坐标
    isDragging: false, // 是否正在拖拽
    lastDistance: 0, // 上次双指距离（用于缩放）
    lastScale: 1, // 上次缩放比例
  },
  radio() {
      let isPlaying = this.data.playing
      if (isPlaying) {
        this.data.innerAudioContext.pause();
        this.setData({playing: false})
      } else {
        this.data.innerAudioContext.play();
        this.setData({playing: true})
      }
  },
  jump() {
    console.log('跳转')
    this.setData({ visible: true });
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },
  videoErrorCallback(e) {
    console.log(e)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      // 获取窗口尺寸
      const systemInfo = wx.getSystemInfoSync();
      this.setData({
        windowWidth: systemInfo.windowWidth,
        windowHeight: systemInfo.windowHeight
      });

      // 初始化地图位置（居中显示）
      this.centerMap();
  },

   // 居中显示地图
   centerMap: function() {
    const { windowWidth, windowHeight, mapWidth, mapHeight, scale } = this.data;
    const translateX = (windowWidth - mapWidth * scale) / 2;
    const translateY = (windowHeight - mapHeight * scale) / 2;
    
    this.setData({
      translateX,
      translateY
    });
  },

  // 触摸开始事件
  onTouchStart: function(e) {
    this.setData({
      touchStartTime: Date.now(),
      touchStartX: e.touches[0].clientX,
      touchStartY: e.touches[0].clientY,
      isDragging: false
    });
    
    // 处理双指缩放
    if (e.touches.length === 2) {
      const distance = this.calculateDistance(e.touches[0], e.touches[1]);
      this.setData({
        lastDistance: distance,
        lastScale: this.data.scale
      });
    }
  },

  // 触摸移动事件
  onTouchMove: function(e) {
    const { touchStartX, touchStartY, scale, lastDistance, lastScale, mapWidth, mapHeight, windowWidth, windowHeight } = this.data;
    
    // 双指缩放
    if (e.touches.length === 2) {
      const currentDistance = this.calculateDistance(e.touches[0], e.touches[1]);
      const newScale = lastScale * (currentDistance / lastDistance);
      
      // 限制缩放范围
      const limitedScale = Math.max(this.data.minScale, Math.min(this.data.maxScale, newScale));
      
      // 计算缩放后的偏移量，保持缩放中心不变
      const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      
      const oldMapCenterX = touchCenterX - this.data.translateX;
      const oldMapCenterY = touchCenterY - this.data.translateY;
      
      const scaleRatio = limitedScale / scale;
      const newTranslateX = touchCenterX - oldMapCenterX * scaleRatio;
      const newTranslateY = touchCenterY - oldMapCenterY * scaleRatio;
      
      // 限制偏移范围，防止地图拖出边界
      const maxTranslateX = 0;
      const minTranslateX = Math.min(0, windowWidth - mapWidth * limitedScale);
      const maxTranslateY = 0;
      const minTranslateY = Math.min(0, windowHeight - mapHeight * limitedScale);
      
      const limitedTranslateX = Math.max(minTranslateX, Math.min(maxTranslateX, newTranslateX));
      const limitedTranslateY = Math.max(minTranslateY, Math.min(maxTranslateY, newTranslateY));
      
      this.setData({
        scale: limitedScale,
        translateX: limitedTranslateX,
        translateY: limitedTranslateY
      });
      
      return;
    }
    
    // 单指拖拽
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    
    // 计算移动距离
    const diffX = currentX - touchStartX;
    const diffY = currentY - touchStartY;
    
    // 如果移动距离超过阈值，认为是拖拽
    if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
      this.setData({
        isDragging: true
      });
      
      // 计算新的偏移量
      let newTranslateX = this.data.translateX + diffX;
      let newTranslateY = this.data.translateY + diffY;
      
      // 限制偏移范围，防止地图拖出边界
      const maxTranslateX = 0;
      const minTranslateX = Math.min(0, windowWidth - mapWidth * scale);
      const maxTranslateY = 0;
      const minTranslateY = Math.min(0, windowHeight - mapHeight * scale);
      
      newTranslateX = Math.max(minTranslateX, Math.min(maxTranslateX, newTranslateX));
      newTranslateY = Math.max(minTranslateY, Math.min(maxTranslateY, newTranslateY));
      
      this.setData({
        translateX: newTranslateX,
        translateY: newTranslateY,
        touchStartX: currentX,
        touchStartY: currentY
      });
    }
  },

  // 触摸结束事件
  onTouchEnd: function(e) {
    const { touchStartTime, isDragging } = this.data;
    const touchDuration = Date.now() - touchStartTime;
    
    // 如果触摸时间短且没有拖拽，认为是点击
    if (touchDuration < 300 && !isDragging) {
      this.handleTap(e);
    }
  },

  // 处理点击事件
  handleTap: function(e) {
    const { clientX, clientY } = e.changedTouches[0];
    const { scale, translateX, translateY, markers } = this.data;
    
    // 将点击坐标转换为地图上的坐标
    const mapX = (clientX - translateX) / scale;
    const mapY = (clientY - translateY) / scale;
    
    // 检查是否点击了标记
    const markerSize = 24; // 标记的大小（假设为正方形）
    const clickedMarker = markers.find(marker => {
      return (
        mapX >= marker.x - markerSize/2 && 
        mapX <= marker.x + markerSize/2 && 
        mapY >= marker.y - markerSize/2 && 
        mapY <= marker.y + markerSize/2
      );
    });
    
    if (clickedMarker) {
      this.setData({
        currentMarker: clickedMarker,
        showMarkerInfo: true
      });
    } else {
      // 点击了地图空白处，隐藏信息
      this.setData({
        showMarkerInfo: false
      });
    }
  },

  // 计算两点之间的距离
  calculateDistance: function(point1, point2) {
    const dx = point2.clientX - point1.clientX;
    const dy = point2.clientY - point1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  },

  // 关闭标记信息
  closeMarkerInfo: function() {
    this.setData({
      showMarkerInfo: false
    });
  },

  // 重置地图（回到初始状态）
  resetMap: function() {
    this.setData({
      scale: 1,
      translateX: 0,
      translateY: 0
    });
    this.centerMap();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 先从数据库中拿到所有链接
    wx.cloud.init()
    let _this = this
    wx.cloud.callFunction({
      // 云函数名称
      name: 'files',
      // 传给云函数的参数
      data: {},
      success: function(res) {
        console.log(res.result) // 3
        const f1 = res.result.data.find(item => item.use === 'flag1');
        _this.data.innerAudioContext.src = f1 == null ? '' : f1.url

        const f2 = res.result.data.find(item => item.use === 'flag2');
        _this.data.videoUrl = f2 == null ? '' : f2.url
      },
      fail: console.error
    })
    this.videoContext = wx.createVideoContext('myVideo')
    const audio = wx.createInnerAudioContext({useWebAudioImplement: true})
    // audio.src = "https://636c-cloud1-8g0nusr7bf320e06-1305050421.tcb.qcloud.la/ringing_short.mp3?sign=7cf2addc75f3a13eec2737a2ad39740f&t=1751024785"
    console.log(audio)
    this.setData({
        innerAudioContext:  audio
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
  
})