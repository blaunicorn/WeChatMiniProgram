<template>
	<view class="" style="width: 100%; background-color: #FFFFFF;border-radius: 8px;border:1px solid #2C405A; margin:10px 0;" >
		<view class="" style="height:30px; line-height: 30px;font-size: 18px;padding: 0px 10px;display: flex;">
			<view @click="btnEnter" class="" style="flex:1;text-overflow: ellipsis;white-space: nowrap;">
			{{bookshelf.name}}({{bookshelf.totalbook}}本藏书)
			</view>
			<view @click="btnMore" class="iconfont icon-more" style="color:#666;">更多</view>
		</view>
		<view class="" @click="btnEnter">
			<image mode="aspectFill" :src="'https://api.map.baidu.com/staticimage/v2?ak=aQL63G24g76aLOgqg6aKt4iWGqfHG7sk&mcode=666666&center=' + bookshelf.geopoint.coordinates[0] + ',' + bookshelf.geopoint.coordinates[1] + '&width=200&height=80&zoom=13'"></image>
		</view>
		
		<view class="">
		 {{bookshelf.name}}--{{bookshelf.address}}
		</view>
	</view>
</template>

<script>
	import cloudApi from "../../common/cloudApi.js"
	export default {
		props: {
			bookshelf: Object
		},
		data() {
			return {

			}
		},
		methods:{
			btnEnter() {
				uni.navigateTo({
					url:`../../pages/bookshelf/bookshelf?id=${this.bookshelf._id}`
				})
			},
			btnMore() {
				uni.showActionSheet({
					itemList:["修改","删除"],
					success: (res) => {
						console.log(res)
						if (res.tapIndex === 0) {
							uni.navigateTo({
								url: "../../pages/createbookshelf/createbookshelf?id=" + this.bookshelf._id
							})
						} else if (res.tapIndex === 1) {
							uni.showModal({
								content:"确定要删除此书屋吗？",
								success: (res) => {
									if (res.confirm) {
										cloudApi.call({
											name:"bookshelfs",
											data: {
												action: "delete",
												_id: this.bookshelf._id
											},
											success:()=> {
												this.$emit("removeHandler")
											}
										})
									}
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
</style>
