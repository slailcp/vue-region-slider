<template>
		<view style="margin-top:200rpx;padding:100rpx;">
			<s-region-slider :minValue="300" :maxValue="700" :step="1" @up="up"  @down="down"  @move="move" />
		</view>
</template>

<script>
import sRegionSlider from '@/components/s-region-slider/s-region-slider.vue'

	export default {
		components: {sRegionSlider},
		data() {
			return { }
		},
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
</script>

<style>
</style>
