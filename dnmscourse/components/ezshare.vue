<template>
	<view class="ezshare">
		<view class="">
			<view class="divider">
				<button @click="clicked_selected(0)" type="default" class="clear_button" open-type="share">选择好友发送邀请</button>
			</view>
			<view class="divider" @click="clicked_selected(1)">
				生成朋友圈分享海报
			</view>
			<view class="" @click="clicked_cancel" style="{height: safeArea.top + 30 + 'px'}">
					取消
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		porps: {
			
		},
		data() {
			return {
				safeArea:null,
			}
		},
		mounted() {
			this.safeArea = uni.getSystemInfoSync().safeArea;
		},
		methods:{
			clicked_selected(index) {
				this.$emit("selected",index);
				this.$emit("dismiss")
			},
			clicked_cancel() {
				this.$emit("dismiss")
			}
		}
	}
</script>

<style>
	.clear_button:after {
		border: none;
	}		
	.clear_button {
		border: none;
		bakcground:none;
		padding: 0px;
		margin: 0px;
		border-radius: 0px;
		line-height:inherit;
	}
	.ezshare {
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.3);
		position: absolute;
		z-index: 999999;
	}
	.ezshare>view {
		width: 100%;
		bottom: 0px;
		background:#FFFFFF;
		position: fixed;
	}
	.ezshare>view>view {
		text-align: center;
		font-size: 16px;
		height: 50px;
		line-height: 50px;
		color: #000000;
	}
	.ezshare>view>view.divider {
		border-bottom: 1px solid #F2F2F2;
	}		
	.ezshare>view>view:nth-child(3) {
		color: #ff0000;
	}
</style>
