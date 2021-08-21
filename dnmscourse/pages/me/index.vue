<template>
	<ezpage class="" :navigationHasBottomLine="false" :title="title">
		<view slot="contentSection" class="">
			<view @tap="updateUserProfile()" style="text-align:center;background-color: #FFFFFF;padding: 20px 0;"
				class="">
				<image :src="userInfo.avatarUrl?userInfo.avatarUrl :'/static/logo.png'" mode="widthFix" class=""
				style="width:100px;height:100px;border-radius:50px;background-color: #8F8F94;"></image>
				<view>{{userInfo.nickName}}</view>
				<view><text class="dnms-tag" style="background-color: #3aa64e;" @tap="">同步微信信息</text></view>
			</view>
			<view style="padding: 10px">
				<view @click="btnCreateBookshelf" class="dnms-blockbutton" 
				style="margin-bottom:10px;">
					新建书房
				</view>
				<view  v-for="(item,index) in bookshelfs" :key="item._id" class="" 
				style="margin-bottom:10px;">
					<bookshelfcell  :bookshelf="item" @removeHandler="onRemoveHandler"></bookshelfcell>
				</view>
			</view>
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
				title: '萤光觅书',
				userInfo: {
					nickName: '',
					avatarUrl: ''
				},
				bookshelfs: []
			}
		},
		onLaunch(query) {
			console.log('query',query)	
		},
		async onLoad(options) {
			
			// 如果携带信息,就用options转跳页面
			console.log(options.scene)
			if (options.scene) {
				let scene = unescape(options.scene);
				let params = scene.split("=");
				let key = params[0];
				uni.navigateTo({
					url:"../bookshelf/bookshelf?id="+params[1]
				})
			}
			
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
						console.log('申请获取用户信息结果',res)
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
