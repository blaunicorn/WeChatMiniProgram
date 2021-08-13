<template>
	<ezpage title="附近">
		<view class="" slot="contentSection" style="height:100%;">
			<map @regionchange="onRengionChanged" :markers="markers" style="width: 100%;height:100%;" :latitude="latitude" :longitude="longitude" :show-location="true"></map>
		</view>
	</ezpage>
</template>

<script>
	import ezpage from "../../components/ezpage.vue"
	import cloudApi from "../../common/cloudApi.js"
	export default {
		components:{
			ezpage
		},
		data() {
			return {
				latitude: '',
				longitude: '',
				markers:[]
			}
		},
		onLoad() {
			uni.getLocation({
				success:(res)=> {
					console.log(res)
					this.latitude = res.latitude;
					this.longitude = res.longitude;
				}
			})
		},
		methods: {
			// 区域拖动变更事件
			onRengionChanged(e) {
				if (e.type === "end") {
					var latitude = e.detail.centerLocation.latitude;
					
				}
			}
		}
	}
</script>

<style>

</style>
