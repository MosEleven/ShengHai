## 声骸养成

- [ ] 角色选择
- [x] 默认角色、默认策略
- [ ] 权重自定义
- [ ] 策略自定义
- [ ] 细分声骸：name,cost,main1,main2,suit
- [ ] 自动弹出词条选择（好像没这个功能）
- [ ] 库存声骸删除
- [ ] 声骸导入
- [ ] 伤害计算
- [ ] 伤害方案保存

## 存储数据管理

1. 强化过的声骸
   
   ```js
   saveResult: function(r){
       var equip = {
         "score" : this.data.score,
         "properties" : this.data.properties,
         "resule" : r
       };
       const e = wx.getStorageSync('equip') || []
       e.unshift(equip);
       wx.setStorageSync('equip', e)
     }
   ```

2. 角色数据
   
   - 默认角色
     
     ```js
     var dc = "今汐";
     wx.setStorageSync('defaultCharacter',dc)
     ```
   
   - 角色属性
     
     - 名称，头像
     - 权值：当前权值和默认权值
     - 强化策略，上一次策略
     
     ```js
     selectedCharacter...
     wx.setStorageSync(selectedCharacter.name, selectedCharacter)
     ```