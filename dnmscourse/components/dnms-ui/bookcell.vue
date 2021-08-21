<template>
	<view class="">
		<navigator :url="'../bookdetail/bookdetail?isbn=' +data.isbn">
			<image :src="data.cover_url" mode="aspectFit" style="width:100%;height: 150px;"></image>
			<view class=""
				style="font-size: 16px; text-align: center; width: 100%;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;">
				{{data.title}}
			</view>
			</navigator>
	</view>

</template>

<script>
	export default {
		props: {
			data: {
				type: Object
			}
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
