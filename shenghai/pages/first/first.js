// pages/first.js
//todo 角色有不同的策略 角色可自定义权值? 开始后锁定角色和策略不可更改

// var loadStrategyData = require("../../server/strategies.js").json;
var level = require("../../server/equip.js").level;
var proDic = require("../../server/equip.js").dic;
var characters = require("../../server/character.js").characters;
var defaultCharacter = wx.getStorageSync('defaultCharacter') || "今汐";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    strategyHidd:true,
    // defaultNo:0,
    // strategies:[
    //   {value:0,strategy:[0,10,36,78], desc:"综合最优"},
    //   {value:1,strategy:[6,6,6,6],desc:"资源最省"}
    // ],
    selectedStrategy:null,
    // selectedDesc:"待选择",
    selectedCharacter:null,
    selectedAvatar:"",
    // defaultAvatar:"../../images/c-avatar/default.png",
    propertiesHidd: true,
    started:false,
    properties: [],
    score:0.0,
    startIndicate: "开始强化",
    leftButtonText:'继续',
    pickArray:[Object.keys(proDic),level[0]]
  },

  init: function(){
    this.setData({propertiesHidd:true}),
    this.setData({started:false}),
    this.setData({properties:[]}),
    this.setData({score:0.0}),
    this.setData({startIndicate:"开始强化"}),
    this.setData({leftButtonText:"继续"}),
    this.setData({pickArray:[Object.keys(proDic),level[0]]})
  },

  onTabStrategy: function(){
    if(this.data.started) return;
    this.setData({strategyHidd:!this.data.strategyHidd})
  },

  onTabStart: function(){
    // 开始强化，依次输入新词条并计算得分，给出推荐
    if(this.data.started) return;
    this.addNewProperty(),
    this.setData({propertiesHidd:false}),
    this.setData({startIndicate:"请填写第一个副词条"}),
    this.setData({started:true})
  },

  onStrategyChange: function(e){
    var n = parseInt(e.detail.value);
    var sc = this.data.selectedCharacter;
    if(n != sc.defaultStrategy){
      this.data.selectedCharacter.defaultStrategy = n;
      wx.setStorageSync(sc.name, this.data.selectedCharacter);
      this.setData({selectedStrategy: sc.strategies[n]});
    }
    this.onTabStrategy()
  },

  onProPickerChange: function(e){
    var pickArray = this.data.pickArray;
    var properties = this.data.properties;
    var value = e.detail.value;
    var p = e.target.id;
    properties[p].name = pickArray[0][value[0]];
    properties[p].value = pickArray[1][value[1]];
    // console.log("properties is ", properties);
    this.setData({properties:properties});
    this.analyze();
    this.setData({pickArray:[Object.keys(proDic),level[0]]})

  },
  onProPickerColumnChange: function(e){
    var c = e.detail.column;
    var v = e.detail.value;
    var pickArray = this.data.pickArray;
    if(c === 0){
      pickArray[1] = level[proDic[pickArray[c][v]]];
      this.setData({pickArray:pickArray});
    }
  },

  onContinue: function(){
    var properties = this.data.properties;
    if(properties.length<=4){
      this.addNewProperty();
      if(properties.length===5) this.setData({leftButtonText:"保留"});
    } else{
      this.saveResult(true),
      this.init()
    }
  },
  onGiveUp: function(){
    this.saveResult(false),
    this.init()
  },

  saveResult: function(r){
    var equip = {
      "score" : this.data.score,
      "properties" : this.data.properties,
      "resule" : r? "保留" : "放弃",
      "belong" : this.data.selectedCharacter.name
    };
    const e = wx.getStorageSync('equip') || []
    e.unshift(equip);
    wx.setStorageSync('equip', e)
  },
  //暂时不需要这个，只有一个地方用到
  // freshStrategy: function(n){
  //   this.data.selectedCharacter.defaultStrategy = n;
  //   this.setData({selectedStrategy: this.data.selectedCharacter.strategies[n]})
  // },

  analyze:function(){
    //
    var properties = this.data.properties;
    var character = this.data.selectedCharacter;
    var score = 0.0;
    var count = 0;
    for(let key in properties){
      if(properties[key].value <= 0) continue;
      count++;
      let pN = proDic[properties[key].name];
      score += properties[key].value * character.currentScale[pN];
    }
    let indicate = "当前分数为：" + score + "。推荐";
    if(score+0.01 >= this.data.selectedStrategy.value[count-1]){
      indicate += "继续强化";
    }else indicate += "放弃";
    this.setData({score:score}),
    this.setData({startIndicate:indicate})
  },
  addNewProperty:function(){
    var properties = this.data.properties;
    if(properties.length===5) return;
    var newProperty = {
      "name":"null",
      "value":0.0
    };
    properties.push(newProperty);
    this.setData({properties:properties})
  },

  getDefaultCharacter: function(){
    for(let i=0; i<characters.length; i++) {
      if(characters[i].name === defaultCharacter) return characters[i];
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var sc = wx.getStorageSync(defaultCharacter) || this.getDefaultCharacter();
    var avatar = sc.avatarUrl===""? "../../images/c-avatar/default.png" : sc.avatarUrl;
    this.setData({selectedAvatar:avatar});
    this.setData({selectedStrategy:sc.strategies[sc.defaultStrategy]});
    this.setData({selectedCharacter:sc})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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