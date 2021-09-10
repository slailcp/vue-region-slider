<template>
	<view clipchildren= false>
	  <text class="loading" :style="{opacity: lineLeft===0 ? '1' : '0'}">loading...</text>
	  <view class="fj-slider-box" :style="{opacity: lineLeft!==0 ? '1' : '0'}" clipchildren= false>
		<view class="fj-value">
			<text class="fj-v-l">¥{{showMinNum}}</text>
			<text class="fj-v-r">¥{{showMaxNum}}</text>
		</view>
		<text class="tip" :style="{left:`${tipLeft}px`,opacity: tipShow ? '1' : '0'}">{{curValue}}</text>
		<view class="fj-slider" clipchildren= false>
		  <view class="fj-line" ref="fj-line"></view>
		  <view v-if="maxLeft-minLeft>=0" class="fj-line-pull" :style="{left: `${minLeft + touchWidth/2}px`, width:`${Math.abs(maxLeft - minLeft)}px`}"></view>
		  <view v-else class="fj-line-pull" :style="{left: `${minLeft + touchWidth/2- Math.abs(maxLeft - minLeft) }px`, width:`${Math.abs(maxLeft - minLeft)}px`}"></view>
		  <view
			class="fj-touch-left" ref="fjtouchleft"
			@touchstart="touchstart($event, 'min')"
			@touchmove="touchmove($event, 'min')"
			@touchend="touchend($event, 'min')"
			:style="{left:`${minLeft}px`}"
		  >
		  </view>
		  <view
			class="fj-touch-right"
			@touchstart="touchstart($event, 'max')"
			@touchmove="touchmove($event, 'max')"
			@touchend="touchend($event, 'max')"
			:style="{left:`${maxLeft}px`}"
		  >
		  </view>
		</view>
	  </view>
	</view>
</template>


<script>
// #ifndef APP-PLUS
 const createSelectorQuery = (that) => {
  let  query = uni.createSelectorQuery().in(that);
  // #ifdef MP-ALIPAY
  query = my.createSelectorQuery();
  // #endif 
  return query;
}
// #endif

// #ifdef APP-PLUS
const dom = weex.requireModule('dom');
// #endif
export default {
  name:'s-region-slider',
  props: {
    fillValue: { 
      type: Number,
      default: 1000,
    },
    minValue: { 
      type: Number,
      default: 0,
    },
    maxValue: { 
      type: Number,
      default: 1000,
    },
    step: { 
      type: Number,
      default: 50,
    },
  },
  watch: {
    minValue(newVal, oldVla){
      this.sMinValue = this.minValue;
      this.showMinNum = this.minValue;
      this.minLeft = this.sMinValue / this.percentage;
    },
    maxValue(newVal, oldVla){
      this.sMaxValue =  this.maxValue;
      this.showMaxNum =  this.maxValue;
      this.maxLeft = this.sMaxValue / this.percentage;
    }
  },
  data() {
    return {
      tipShow:false,
      tipLeft:0,

      minLeft: 0, 
      maxLeft: 0, 
      
      touchWidth:30, 

      lineWidth:0, 
      lineLeft:0, 
	  
	  showMinNum:0,
	  showMaxNum:0,

      curValue:0, 
      sMinValue:0, 
      sMaxValue:0, 
      percentage: 0
    };
  },
  mounted(){
	 this.$nextTick().then(() => {
		this.envir({
			classname:'.fj-touch-left',
			refname:this.$refs.fjtouchleft,
			fn:(ret)=>{
				this.touchWidth = ret.width;
			}
		})
		this.envir({
			classname:'.fj-line', 
			refname:this.$refs['fj-line'],
			fn:(ret)=>{
				  this.lineWidth = ret.width;
				  this.lineLeft = ret.left;// 
				 
				  this.percentage = this.fillValue / this.lineWidth;
				
				  this.sMinValue = this.minValue;
				  this.sMaxValue =  this.maxValue; 
				  this.minLeft = this.sMinValue / this.percentage;
				  this.maxLeft = this.sMaxValue / this.percentage;
				  
				  this.showMaxNum = this.sMaxValue
				  this.showMinNum = this.sMinValue
			}
		})
	})

  },
  methods: {
	envir(opt){
		setTimeout(() => {
			// #ifdef APP-PLUS
			dom.getComponentRect(opt.refname, ret => {
				const option = ret.size
				opt.fn({
					width: option.width,
					height:option.height,
					top: option.top,
					bottom: option.bottom,
					left: option.left,
					right: option.right,
				})
			})
			// #endif
			
			// #ifndef APP-PLUS
			createSelectorQuery(this).select(opt.classname).boundingClientRect().exec((data)=>{
			  const option = data[0];
			  opt.fn({
			  	width: option.width,
			  	height:option.height,
			  	top: option.top,
			  	bottom: option.bottom,
			  	left: option.left,
			  	right: option.right,
			  })
			})
			// #endif
		},200)
	},
    touchstart(e, type) {
      this.$emit('down', { 
        ...e,
        custom:{
          type,
          minValue: this.showMinNum,
          maxValue: this.showMaxNum
        }
      })
    },
    touchmove(e, type) {
	  // #ifndef APP-PLUS
      const disX = e.touches[0].clientX - this.lineLeft
	  // #endif
	  // #ifdef APP-PLUS
	   const disX = e.touches[0].screenX - this.lineLeft
	   // #endif
      if(disX < 0 || disX > this.lineWidth ) { return;}

      if(type === 'min'){
        this.minLeft = Math.floor(disX);
        if(this.minLeft < 0) { this.minLeft = 0; return; }
        if(this.maxLeft > this.lineWidth) { this.maxLeft = this.lineWidth; return; }
        //if(this.maxLeft - this.minLeft <= this.touchWidth ) {this.minLeft = this.maxLeft - this.touchWidth; return;}
        this.curValue = Math.floor(this.minLeft * this.percentage);
      }
      
      if(type === 'max'){
        this.maxLeft =  Math.ceil(disX);
		if(this.minLeft < 0) { this.minLeft = 0; return; }
        if(this.maxLeft > this.lineWidth) { this.maxLeft = this.lineWidth; return; }
        // if(this.maxLeft - this.minLeft <= this.touchWidth ) {this.maxLeft = this.minLeft + this.touchWidth;return;}
        this.curValue = Math.round(this.maxLeft * this.percentage);
      }
	  
	  
      this.tipShow = true;
      this.tipLeft = Math.round(this.curValue / this.percentage);
	  this.tipLeft = this.tipLeft >= this.lineWidth?this.lineWidth:this.tipLeft
	  this.tipLeft = this.tipLeft <= 0?0:this.tipLeft
      this.$emit('move', {
        ...e,
        custom:{
          type,
          minValue: this.showMinNum,
          maxValue: this.showMaxNum,
          curValue: this.curValue,
        }

      })
    },
    touchend(e, type) {
      if(type === 'min') {
        if(this.step === 1){
          this.sMinValue = this.curValue;
        }else{
          const stepnum = Math.round((this.minLeft * this.percentage) / this.step); 
          this.sMinValue = stepnum * this.step;
          this.minLeft = this.sMinValue / this.percentage;
        }
      }
      if(type === 'max') {
        if(this.step === 1){
          this.sMaxValue = this.curValue;
        }else{
          const stepnum = Math.round((this.maxLeft * this.percentage) / this.step);  
          this.sMaxValue = stepnum * this.step;
          if(this.fillValue - this.sMaxValue < this.step) { this.sMaxValue =  this.fillValue} 
          this.maxLeft = this.sMaxValue / this.percentage;
        }
      }
      this.tipShow = false;
	  
	  if(this.sMinValue <= this.sMaxValue) {
		  this.showMaxNum = this.sMaxValue
		  this.showMinNum = this.sMinValue
	  }else{
		  this.showMaxNum = this.sMinValue
		  this.showMinNum = this.sMaxValue
	  }
	  
      this.$emit('up', {
        ...e, 
        custom:{
          type,
          minValue: this.showMinNum,
          maxValue: this.showMaxNum
        }
      })
    },
  },
};
</script>


<style scoped>
.fj-slider-box{padding-top:20px;font-size:12px;}
.loading{font-size:12px;}
.fj-value{position: relative;height:20px;}
.fj-v-l,.fj-v-r{font-size: 12px;position: absolute;}
.fj-v-l{left:0;}
.fj-v-r{right:0;}

.fj-slider {
  position: relative;
  height: 30px;
}

.fj-touch-left,.fj-touch-right {
    opacity: 0.8;
    position: absolute;
    height: 30px;
    width: 30px;
    border-radius: 15px;
    background: rgb(177, 177, 248);
    z-index: 3;
  }
 
  .tip{
    position: absolute;
    padding:10px;background: rgba(0,0,0,0.6);color:#fff;
    top:0px;
    border-radius: 10px;
    z-index: 4;font-size: 10px;
	justify-content:center
  }

  .fj-line, .fj-line-pull {
    height: 5px;
    background: #999;
    position: absolute;
    top:12px;
    left: 15px;
    right: 15px;
    z-index: 1;
  }
  .fj-line-pull{z-index: 2;background: #2F85FC;}

</style>



