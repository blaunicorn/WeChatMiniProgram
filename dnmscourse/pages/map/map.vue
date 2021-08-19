<template>
	<ezpage title="附近">
		<view class="" slot="contentSection" style="height:100%;">
			<map @regionchange="onRengionChanged" :markers="markers" 
			style="width: 100%;height:100%;"
			@markertap="btnMarkerTap"
			 :latitude="latitude" :longitude="longitude" :show-location="true">
			</map>
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
			// 当前位置经纬度
			uni.getLocation({
				success:(res)=> {
					console.log(res)
					this.latitude = res.latitude;
					this.longitude = res.longitude;
				}
			})
		},
		methods: {
			btnMarkerTap(e) {
				
				let markersId = e.detail.markerId;
				let shelfInfo = this.markers[markersId];
				console.log(e,shelfInfo,this.markers,markersId)
				uni.navigateTo({
					url:`../bookshelf/bookshelf?id=${shelfInfo._id}`
				})
				
			},
			// 区域拖动变更事件
			onRengionChanged(e) {
				if (e.type === "end") {
					console.log(e)
					var latitude = e.detail.centerLocation.latitude;
					var longitude = e.detail.centerLocation.longitude;
					console.log(latitude,longitude)
					cloudApi.call({
						name:"bookshelfs",
						data: {
							action:"listbygeo",
							longitude:longitude,
							latitude:latitude
						},
						success:(res) => {
							let shelfs = res.result || [];
							console.log(shelfs)
							let markers = [];
							shelfs.map((item,i)=> {
								markers.push({
									id:i,
									width:55,
									height:55,
									iconPath: "/static/mapmarker_shelf.png",
									latitude: item.geopoint.coordinates[1],
									longitude:item.geopoint.coordinates[0],
									name:item.name,
									_id: item._id
								})
							})
							this.markers = markers;
							console.log(this.markers)
						}
					})
				}
			}
		}
	}
</script>

<style>

</style>
