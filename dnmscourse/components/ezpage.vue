<template>
	<view style="position:relative;height: 100%;">
		<view class="" 
		style="width: 100%;position: fixed;transform: all .4s;z-index: 9999;" 
		:style="{height:statusBarHeight+'px',background:statusBackground}">			
		</view>
		<view class="" v-if="showNavigation" style="width:100%;position:fixed;top:0px;left: 0px;z-inde:9998;"> 
			<slot name="navigationSection"></slot>
		</view>
<!-- 		<view class="header" style="height:50px;width:100%;border-bottom:1px  solid #C0C0C0;">
			<button style="position: absolute;margin-top:20px; heigth:10px; display: inline; " type="default" @tap="goBack">返回</button>
			<view class="" style="position: absolute; display: inline;">
				{{title}}
			</view> 
		</view> -->

		<!-- 		<view v-slot="navigationSection">
			
		</view> -->
		<view class="page">
			<slot name="contentSection"></slot>
		</view>
		<view class="" style="100%;position:fixed;z-index:998;bottom:0;" >
			<slot name ="tabSection"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			navigationHasBottomLine: {
				type: Boolean,
				default: true
			},
			title: {
				type: String,
				default: "标题"
			},
			showNavigation: {
				type: Boolean,
				default: true
			},
			statusBackground: {
				type: String,
				default:"#ffffff"
			}
		},
		data() {
			return {
				statusBarHeight: 22,
				height: "100%",
				paddingTop: 0,
				paddingBottom: 0,
			}
		},
		methods: {
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style>

</style>
