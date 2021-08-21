<template>
	<view class="" 
	style="height:44pp;line-height: 44px;width:100%;transition:background .4s,color .4s"
	:style="{background:backgroundColor,color: titleColor}"
	>
	<view class="" style="display: flex;width: 100%;vertical-align: middel;">
		<!-- 把一行分成三列，平均分配 -->
		<view class="" 
		style="width:94px;height: 44px;line-height:44px;padding-left: 15px;font-size: 18px;">
			<slot name="leftItems">
				<!-- 判断是否有>1的历史记录，以此显示后退按钮 -->
				<text @click="btnBack" v-if="showBackButton" class="iconfont icon-back leftitem"></text>
				<text @click="btnHome" v-if="showHomeButton" class="iconfont icon-homefill leftitem"></text>
			</slot>
		</view>
		<view class="navTitle">
			<slot name="title"></slot>
		</view>
		<view class="" style="width:94px;height: 44px;">		
		</view>
	</view>
	<view class="" style="height:1px;width:100%;"
	:style="{background: bottomlineColor,display:hasBottomLine?'':'none'}">		
	</view>	
	</view>
</template>

<script>
	export default {
		props: {
			hasHomeButton: {
				type: Boolean,
				default: true
			},
			backgroundColor: {
				type: String,
				default:"#ffffff"
			},
			titleColor: {
				type: String,
				default: "#000000"
			},
			hasBottomLine: {
				type: Boolean,
				default: true
			},
			bottomlineColor: {
				type: String,
				default: "#F2F2F2"
			}
		},
		data() {
			return {
				showBackButton: false,
				showHomeButton:false
			}
		},
		mounted() {
			let curpages = getCurrentPages();
			let sysInfo = uni.getSystemInfoSync();
			console.log('curpages',curpages)
			if (curpages.length>1) this.showBackButton = true;
			if (curpages.length>2) this.showHomeButton = true;
		},
		methods: {
			btnBack:function() {
				uni.navigateBack({})
			},
			btnHome:function() {
				uni.navigateBack({
					delta:999
				})
			}
		}
	}
</script>

<style>
	.leftitem {
		margin-right: 20px;
	}
	.navTitle {
		flex: 1;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		height: 44px;
		line-height: 44px;
	}
</style>
