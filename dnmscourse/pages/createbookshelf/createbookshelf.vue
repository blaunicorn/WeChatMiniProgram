<template>
	<ezpage :title="title">
		<view slot="contentSection" style="padding:10px;">
			<view class="dnms-card">
				<input v-model="name" placeholder="请输入书房名称" maxlength="20"
				 style="font-size: 18px;width:100%;height:44px;line-height: 44px;"
				 />
				<view class="dnms-divider"></view>
				<view class="dnms-cell" @click="btnChooseLocation">
					<view class="">
						{{address}}
					</view>
					<view class="iconfont icon-right"></view>
				</view>
			</view>
	<view class="" 
	style="width: 100%; background-color: #FFFFFF;
	border-radius: 8px;border:1px solid #2C405A;overflow:hidden; margin-bottom: 10px;"  >
		<view class=""
		style="height:30px; line-height: 30px;font-size: 18px;
		padding: 0px 10px;display: flex;justify-content: space-around;">
			<view @click="btnEnter" class="" style="flex:1;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
			{{name}}
			<text style="color:#999999;font-size: 12px;margin-left: 5px;">
			({{totalbook}}本藏书)</text>
			</view>
		</view>
		<view class="" style="" >
			<image mode="aspectFill" 
			style="width: 100%;height: 80px;vertical-align: middle;"
			:src="'https://api.map.baidu.com/staticimage/v2?ak=aQL63G24g76aLOgqg6aKt4iWGqfHG7sk&mcode=666666&center=' + longitude + ',' + latitude + '&zoom=16&coordtype=gcj02ll'"></image>
<!-- 		:src="'https://api.map.baidu.com/staticimage/v2?ak=aQL63G24g76aLOgqg6aKt4iWGqfHG7sk&mcode=666666&center=' + bookshelf.geopoint.coordinates[0] + ',' + bookshelf.geopoint.coordinates[1] + '&width=200&height=80&zoom=16&coordtype=gcj02ll'"></image>
 -->		
        </view>		
		<view class=""
		style="height:30px;line-height: 30px;font-size: 14px;color: #666; padding:0px 10px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
		 {{name}}--{{address}}
		</view>
	</view>
			<view class="dnms-blockbutton" @click="btnSaveBookshelf">保存</view>
		</view>
	</ezpage>
</template>

<script>
	import cloudApi from "../../common/cloudApi.js"
	import ezpage from '../../components/ezpage.vue'
	export default {
		components: {
			ezpage
		},
		data() {
			return {
				title: "新建书房",
				_id: null,
				name: "",
				totalbook:'',
				address: "选取书房所在地址",
				longitude: "",
				latitude: ""
			}
		},
		onLoad(options) {
			if (options.id) {
				this.title = "修改书房";
				this._id = options.id;
				this.getBookshelfsById(this._id)
			}
		},
		methods: {
			getBookshelfsById(id) {
				// 请求下该id的书房具体信息
				cloudApi.call({
					name:"bookshelfs",
					data:{
						action:"get",
						_id:id
					},
					success:(res)=> {
						console.log("该id的书房具体信息",res)
						this.name = res.result.name;
						this.address = res.result.address;
						this.totalbook = res.result.totalbook;
						this.longitude=res.result.geopoint.coordinates[0];
						this.latitude=res.result.geopoint.coordinates[1];
					}
				})
			},
			btnChooseLocation() {
				uni.getLocation({
					success: (res) => {
						uni.chooseLocation({
							latitude: res.latitude,
							longitude: res.longitude,
							success: (res) => {
								this.address = res.address + res.name;
								this.longitude = res.longitude;
								this.latitude = res.latitude;
							}
						})
					}
				})
			},
			btnSaveBookshelf() {
				if (this.name.length < 3) return uni.showToast({
					icon: "none",
					mask: true,
					title: "书房名称至少需要3个字符"
				});
				else if (this.latitude === "" || this.longitude === "" || this.address === "") return uni.showToast({
					icon: "none",
					mask: true,
					title: "请选择正确的书房所在位置"
				});
				cloudApi.call({
					name: "bookshelfs",
					data: {
						action: this._id ? "update" : "create",
						_id: this._id,
						name: this.name,
						address: this.address,
						longitude: this.longitude,
						latitude: this.latitude,
					},
					success: (res) => {
						uni.navigateBack() 
					}})

			}
		}
	}
</script>

<style>

</style>
