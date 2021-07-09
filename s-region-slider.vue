<template>
  <view class="fj-slider-box">
    <view class="fj-slider">
      <view class="fj-value">
        <view class="fj-v-l">¥{{sMinValue}}</view>
        <view class="fj-v-r">¥{{sMaxValue}}</view>
      </view>
      <view
        class="fj-touch-left"
        @touchstart="touchstart($event, 'min')"
        @touchmove="touchmove($event, 'min')"
        @touchend="touchend($event, 'min')"
        :style="{left:`${minLeft}px`}"
      ></view>
      <view
        class="fj-touch-right"
        @touchstart="touchstart($event, 'max')"
        @touchmove="touchmove($event, 'max')"
        @touchend="touchend($event, 'max')"
        :style="{left:`${maxLeft}px`}"
      ></view>
      <view class="tip" :style="{left:`${tipLeft}px`,display: tipShow ? 'block' : 'none'}">{{curValue}}</view>
      <view class="fj-line-pull" :style="{left: `${minLeft + touchWidth/2}px`, width:`${maxLeft - minLeft}px`}"></view>
      <view class="fj-line"></view>
    </view>
  </view>
</template>


<script>
 const createSelectorQuery = (that) => {
  let  query = uni.createSelectorQuery().in(that);
  // #ifdef MP-ALIPAY
  query = my.createSelectorQuery();
  // #endif
  return query;
}
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
      this.minLeft = this.sMinValue / this.percentage;
    },
    maxValue(newVal, oldVla){
      this.sMaxValue =  this.maxValue;
      this.maxLeft = this.sMaxValue / this.percentage;
    }
  },
  data() {
    return {
      tipShow:false,
      tipLeft:0,

      minLeft: 0, 
      maxLeft: 0, 
      
      touchWidth:50, 

      lineWidth:0, 
      lineLeft:0, 

      curValue:0, 
      sMinValue:0, 
      sMaxValue:0, 
      percentage: 0, 

    };
  },
  mounted(){
	 this.$nextTick(() => {
		createSelectorQuery(this).select('.fj-touch-left').boundingClientRect().exec((data)=>{
		  this.touchWidth = data[0].width;
		})
		createSelectorQuery(this).select('.fj-line').boundingClientRect().exec((ret)=>{
		  this.lineWidth = ret[0].width;
		  this.lineLeft = ret[0].left
		  this.maxLeft = this.lineWidth;
		  this.percentage = this.fillValue / this.lineWidth;

		  this.sMinValue = this.minValue;
		  this.sMaxValue =  this.maxValue;
		  this.minLeft = this.sMinValue / this.percentage;
		  this.maxLeft = this.sMaxValue / this.percentage;
		});
	})

  },
  methods: {
    touchstart(e, type) {
      this.$emit('down', {
        ...e,
        custom:{
          type,
          minValue: this.sMinValue,
          maxValue: this.sMaxValue
        }
      })
    },
    touchmove(e, type) {
      const disX = e.touches[0].clientX - this.lineLeft
      if(disX < 0 || disX > this.lineWidth ) { return;}

      if(type === 'min'){
        this.minLeft = Math.floor(disX);
        if(this.minLeft < 0) { this.minLeft = 0; return; }
        if(this.maxLeft - this.minLeft <= this.touchWidth ) {this.minLeft = this.maxLeft - this.touchWidth; return;}
        this.curValue = Math.floor(this.minLeft * this.percentage);
      }
      
      if(type === 'max'){
        this.maxLeft =  Math.ceil(disX);
        if(this.maxLeft > this.lineWidth) { this.maxLeft = this.lineWidth; return; }
        if(this.maxLeft - this.minLeft <= this.touchWidth ) {this.maxLeft = this.minLeft + this.touchWidth;return;}
        this.curValue = Math.round(this.maxLeft * this.percentage);
      }
      this.tipShow = true;
      this.tipLeft = Math.round(this.curValue / this.percentage - 15);
      this.$emit('move', {
        ...e,
        custom:{
          type,
          minValue: this.sMinValue,
          maxValue: this.sMaxValue,
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
      this.$emit('up', {
        ...e, 
        custom:{
          type,
          minValue: this.sMinValue,
          maxValue: this.sMaxValue
        }
      })
    },
  },
};
</script>


<style lang="scss" scoped>
$touchWidth: 50rpx; /** circle的宽度 */
view {
  box-sizing: border-box;
}
.fj-slider-box{padding-top:40rpx;
  .fj-v-l,.fj-v-r{position: absolute;font-size: 24rpx;top:-40rpx;}
  .fj-v-l{left:0}
  .fj-v-r{right:0}
}
.fj-slider {
  position: relative;
  height: $touchWidth;
  .fj-touch-left,
  .fj-touch-right {
    opacity: 0.8;
    position: absolute;
    height: $touchWidth;
    width: $touchWidth;
    border-radius: 25rpx;
    background: rgb(177, 177, 248);
    z-index: 3;
  }
  .tip{
    display: block;
    position: absolute;
    padding:10rpx 20rpx;background: rgba(0,0,0,0.6);color:#fff;
    top:-80rpx;
    border-radius: 10rpx;
    min-width:100rpx;
    text-align: center;
  }
  .fj-line, .fj-line-pull {
    height: 10rpx;
    background: #999;
    margin-top: -5rpx;
    position: absolute;
    top: 50%;
    left: $touchWidth/2;
    right: $touchWidth/2;
    z-index: 1;
  }
  .fj-line-pull{z-index: 2;background: blue;}
}
</style>




