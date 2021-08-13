<template>
	<ezpage class="content" :navigationHasBottomLine="false">
		<view slot="contentSection" class="">
			<view @tap="updateUserProfile()" style="text-align:center;background-color: #FFFFFF;padding-bottom: 10px;"
				class="">
				<image :src="userInfo.avatarUrl?userInfo.avatarUrl :'/static/logo.png'" mode="widthFix" class="logo"
					style=""></image>
				<view>{{userInfo.nickName}}</view>
				<view><text class="dnms-tag" style="background-color: #3aa64e;" @tap="">同步微信信息</text></view>
			</view>
			<view style="padding: 10px">
				<view @click="btnCreateBookshelf" class="dnms-blockbutton" style="border-radius: 40rpx;color: #F8F8F8 ;font-size:40rpx; background-color: #333333;width:300px;height:30px;line-height: 20rpx; display: flex;

  align-items: center;

  justify-content: center;">
					新建书房
				</view>
				<view  v-for="(item,index) in bookshelfs" :key="item._id" class="" >
					<bookshelfcell  :bookshelf="item" @removeHandler="onRemoveHandler"></bookshelfcell>
				</view>
			</view>
		</view>
		
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">111{{title}}</text>
		</view>
	</ezpage>
</template>

<script>
	import ezpage from '../../components/ezpage.vue';
	import bookshelfcell from '../../components/dnms-ui/bookshelfcell.vue';

	import cloudApi from "../../common/cloudApi.js"
	export default {
		components: {
			ezpage,
			bookshelfcell
		},
		data() {
			return {
				title: 'Hello',
				userInfo: {
					nickName: '',
					avatarUrl: ''
				},
				bookshelfs: []
			}
		},
		async onLoad(options) {
			// uni.login({
			// 	provider: "weixin",
			// 	success: (res) => {
			// 		let code = res.code;
			// 		uniCloud.callFunction({
			// 			name: "login",
			// 			data: {
			// 				code: code
			// 			},
			// 			success: (res) => {
			// 				console.log(res)
			// 				this.userInfo = res.result
			// 			}
			// 		})
			// 	}
			// })

			// 封装后的
			uni.login({
				provider: "weixin",
				success: (res) => {
					let code = res.code;
					cloudApi.call({
						name: "login",
						data: {
							code: code
						},
						success: (res) => {
							console.log(res)
							this.userInfo = res.result
							this.getBookshelfs()
						}
					})
				}
			})
		},
			
		onShow() {
			// 如果用户信息存在，则请求该用户的书房列表
			if (this.userInfo.avatarUrl) {
				this.getBookshelfs()
			}
		},
		methods: {
				
			onRemoveHandler() {
				this.getBookshelfs()
			},
			getBookshelfs() {
				cloudApi.call({
					name:"bookshelfs",
					data: {
						action: "listmy",						
					},
					success: (res)=> {
						console.log("bookshelfs",res)
						this.bookshelfs = res.result;
					}
				})
			},
			btnCreateBookshelf() {
				uni.navigateTo({
					url: "../createbookshelf/createbookshelf"
				})
			},
			updateUserProfile() {

				uni.getUserProfile({
					desc: "申请获取用户信息",
					success: (res) => {
						console.log(res)
						this.userInfo = Object.assign(this.userInfo, res.userInfo)
						cloudApi.call({
							name: "updateuserinfo",
							data: {
								userInfo: this.userInfo
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
