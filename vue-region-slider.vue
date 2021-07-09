<template>
  <div class="fj-slider-box">
    <div class="fj-slider">
      <div class="fj-value">
        <div class="fj-v-l">¥{{sMinValue }}</div>
        <div class="fj-v-r">¥{{sMaxValue}}</div>
      </div>
      <div
        class="fj-touch-left"
        @touchstart="touchstart($event, 'min')"
        @touchmove="touchmove($event, 'min')"
        @touchend="touchend($event, 'min')"
        :style="{left:`${minLeft}px`}"
      ></div>
      <div
        class="fj-touch-right"
        @touchstart="touchstart($event, 'max')"
        @touchmove="touchmove($event, 'max')"
        @touchend="touchend($event, 'max')"
        :style="{left:`${maxLeft}px`}"
      ></div>
      <div class="tip" :style="{left:`${tipLeft}px`,display: tipShow ? 'block' : 'none'}">{{curValue}}</div>
      <div class="fj-line-pull" :style="{left: `${minLeft + touchWidth/2}px`, width:`${maxLeft - minLeft}px`}"></div>
      <div class="fj-line"></div>
    </div>
  </div>
</template>


<script>
export default {
  name:'vue-region-slider',
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
  data() {
    return {
      tipShow:false,
      tipLeft:0,

      minLeft: 0,
      maxLeft: 0, 
      
      touchWidth:25, 

      lineWidth:0,
      lineLeft:0,

      curValue:0,
      sMinValue:0,
      sMaxValue:0,
      percentage: 0,
      multiple:1,

    };
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
  mounted(){
    this.$nextTick(() => {
      this.touchWidth = document.querySelector('.fj-touch-left').getBoundingClientRect().width;
      const fjLine = document.querySelector('.fj-line').getBoundingClientRect()
      this.lineWidth = fjLine.width;
      this.lineLeft = fjLine.left
      this.maxLeft = this.lineWidth;
      this.percentage = (this.fillValue / this.lineWidth) * this.multiple;
      this.sMinValue = this.minValue;
      this.sMaxValue = this.maxValue;
      this.minLeft = this.sMinValue * this.multiple / this.percentage;
      this.maxLeft = this.sMaxValue * this.multiple / this.percentage;
    });
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
      let disX = e.touches[0].clientX - this.lineLeft
      if(disX < 0 || disX > this.lineWidth ) { return;}
      if(type === 'min'){
        this.minLeft = Math.floor(disX);
        if(this.minLeft < 0) { this.minLeft = 0; return; }
        if(this.maxLeft - this.minLeft <= this.touchWidth ) {this.minLeft = this.maxLeft - this.touchWidth; return;}
        this.curValue = Math.floor(this.minLeft * this.percentage / this.multiple);
      }
      
      if(type === 'max'){
        this.maxLeft = Math.ceil(disX);
        if(this.maxLeft > this.lineWidth) { this.maxLeft = this.lineWidth; return; }
        if(this.maxLeft - this.minLeft <= this.touchWidth ) {this.maxLeft = this.minLeft + this.touchWidth;return;}
        this.curValue = Math.round(this.maxLeft * this.percentage / this.multiple);
      }
      this.tipShow = true;
      this.tipLeft = Math.round(this.curValue * this.multiple / this.percentage - 15);
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
          const stepnum = Math.round((this.minLeft * this.percentage / this.multiple) / this.step);
          this.sMinValue = stepnum * this.step;
          this.minLeft = this.sMinValue *  this.multiple / this.percentage;
        }
      }
      if(type === 'max') {
        if(this.step === 1){
          this.sMaxValue = this.curValue;
        }else{
          const stepnum = Math.round((this.maxLeft * this.percentage / this.multiple) / this.step); 
          this.sMaxValue = stepnum * this.step;
          if(this.fillValue - this.sMaxValue < this.step) { this.sMaxValue =  this.fillValue} 
          this.maxLeft = this.sMaxValue * this.multiple / this.percentage;
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


<style lang="less" scoped>
@touchWidth: 25px; /** circle的宽度 */
div {
  box-sizing: border-box;
}
.fj-slider-box{padding-top:20px;
  .fj-v-l,.fj-v-r{position: absolute;font-size: 12px;top:-20px;}
  .fj-v-l{left:0}
  .fj-v-r{right:0}
}
.fj-slider {
  position: relative;
  height: @touchWidth;
  .fj-touch-left,
  .fj-touch-right {
    opacity: 0.8;
    position: absolute;
    height: @touchWidth;
    width: @touchWidth;
    border-radius: 20px;
    background: rgb(177, 177, 248);
    z-index: 3;
  }
  .tip{
    font-size: 24px;;
    display: block;
    position: absolute;
    padding:5px 10px;background: rgba(0,0,0,0.6);color:#fff;
    top:-40px;
    border-radius: 5px;
    min-width:25px;
    text-align: center;
  }
  .fj-line, .fj-line-pull {
    height: 6px;
    background: #999;
    margin-top: -2px;
    position: absolute;
    top: 50%;
    left: @touchWidth/2;
    right: @touchWidth/2;
    z-index: 1;
  }
  .fj-line-pull{z-index: 2;background: blue;}
}
</style>




