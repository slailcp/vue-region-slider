

## 简介
有些项目涉及到价格选择,需要用到区间滑动,s-region-slider是基于uni-app开发的slider, 脱离了原生的slider,使用纯view+css+js开发的插件;

## 安裝
npm i -S vue-region-slider

## 导入
// mian.js
import vueRegionSlider from 'vue-region-slider'
import 'vue-region-slider/vue-region-slider/vue-region-slider.css'
Vue.use(vueRegionSlider)

// template.vue
<vue-region-slider :minValue="300" :maxValue="700" :step="40" @up="up"  @down="down"  @move="move" />


## 方法说明
**属性**
| 名 | 类型	 | 说明	 | 默认	 |
|--|--|--|--|
| fillValue| number | 最大范围 | 1000 |
| maxValue  | number |滑块最大默认值  |1000  |
| minValue  |number  |滑块最小默认值  | 0 |
| step| number |滑动后显示的数值只能是step倍数,例如:金额只能是10的倍数的时候,step可以设置为10  | 50 |
**事件**
| 名 | 说明	 | event	| 
|--|--|--|
| down| 触发touchstart方法 | 返回了原有的event信息, 并添加了custom对象 | 
| move  | 触发touchmove方法 | 返回了原有的event信息, 并添加了custom对象  |
| up| 触发touchend方法  | 返回了原有的event信息, 并添加了custom对象 | 

**e.custom 说明**
| 名 | 说明	 | event	| 
|--|--|--|
| type| 当前触发的事件中是哪个滑块 ,('min'/'max') | 
| minValue| 左边滑块的值 | 
| maxValue | 右边滑块的值  | 
| curValue  | 互动过程中的值, **注:此项只有move方法中才会有值,down和up不存在curValue**    |
### 使用案例
```
<div style="margin-top:200px;padding:100px;">
	<s-region-slider :minValue="300" :maxValue="700" :step="40" @up="up"  @down="down"  @move="move" />
</div>

	export default {
		components: {sRegionSlider},
		methods: {
			down(e){
				// e中包含了原有的e信息, 并添加了custom对象
				const type = e.custom.type;
				const minValue = e.custom.minValue;
				const maxValue = e.custom.maxValue ;
				console.log(type, minValue, maxValue);			
			},
			up(e){
				// e中包含了原有的e信息, 并添加了custom对象
				const type = e.custom.type;
				const minValue = e.custom.minValue;
				const maxValue = e.custom.maxValue ;		
				console.log(type, minValue, maxValue);			
			},
			move(e){
				// e中包含了原有的e信息, 并添加了custom对象
				const type = e.custom.type;
				const minValue = e.custom.minValue;
				const maxValue = e.custom.maxValue ;
				const curValue  = e.custom.curValue  ;	
				console.log(type, minValue, maxValue, curValue);			
			},
		}
	}
```
#### 上面代码运行到各端的效果图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210520145913167.gif#pic_center)

#### 文档
[s-region-slider使用文档](https://blog.csdn.net/sllailcp/article/details/117075569)


