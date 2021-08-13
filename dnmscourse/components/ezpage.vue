<template>
	<view style="position:relative;height: 100%;">
		<view class="header" style="height:50px;width:100%;border-bottom:1px  solid #C0C0C0;">
			<button style="position: absolute;margin-top:20px; heigth:10px; display: inline; " type="default" @tap="goBack">返回</button>
			<view class="" style="position: absolute; display: inline;">
				{{title}}
			</view> 
		</view>

		<!-- 		<view v-slot="navigationSection">
			
		</view> -->
		<view class="page">
			<slot name="contentSection"></slot>
		</view>
		<view class="footer" >
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
			}
		},
		data() {

			return {}
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
