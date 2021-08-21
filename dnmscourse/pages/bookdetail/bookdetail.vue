<template>
	<ezpage title="图书详情">
		<!-- 		<view slot="navigationSection">
			
		</view> -->
		<view slot="contentSection">
			<view class="" style="width:100%;text-align: center;background-color: #FFFFFF;padding:10px;">
				<image :src="bookInfo.cover_url" mode="widthFix" style="width:150px;"></image>
				<view class=""
					style="font-size: 16px;text-align: center;padding:5px 0px;width: 100%;text-overflow: ellipsis;white-space: nowrap;">
					{{bookInfo.title}}
				</view>
				<text style="font-size: 14px;text-align: center;color: #666;width: 100%;">{{bookInfo.abstract}}</text>
			</view>
		</view>
		<!-- 		<view slot="tabSection">
			
		</view> -->
	</ezpage>

</template>

<script>
	import ezpage from '../../components/ezpage.vue'
	import cloudApi from "../../common/cloudApi.js"
	export default {

		components: {
			ezpage
		},
		data() {
			return {
				bookInfo: null
			}

		},
		onLoad(options) {
			console.log(options)
			this.requestBookDetail(options.isbn)
		},
		methods: {
			requestBookDetail(isbn) {
				if (!isbn) return
				cloudApi.call({
					name: "books",
					data: {
						action: "get",
						isbn: isbn
					},
					success: (res) => {
						console.log(res)
						this.bookInfo = res.result;
					}
				})
			}
		}
	}
</script>

<style>

</style>
