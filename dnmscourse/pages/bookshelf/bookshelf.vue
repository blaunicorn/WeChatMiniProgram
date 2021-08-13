<template>
	<ezpage :title="shelfInfo.name">
		<view slot="contentSection" style="height:100%;">
			<canvas id="myPoster" type="2d" style="position: absolute;"></canvas>
			<ezshare v-if="showShareMenu" @selected="onShareSelected"></ezshare>
			<view class="" style="justify-content: start;display: flex;flex-wrap: wrap;padding:10px;">
				<view v-for="(item,index) in books" :key="index" style="width: 33.3%;padding: 10px;margin-top:10px;">
					<bookcell :data="item"></bookcell>
					<view class="" v-if="isEditing" @click="btnDeleteBook" :data-id="item._id">
						删除
					</view>
				</view>
			</view>
<!-- 			是拥有者，才能显示编辑选项 -->
			<view class="" v-if="shelfInfo.isowner" slot="tabSection" style="position: fixed; bottom:5px;width: 100%;padding: 10px;">
				<view class="" v-if="!isEditing" style="background-color: #C0C0C0;width:100%;height:100px;">
					<view @click="showShareMenu=true" class="iconfont icon-share" style="">
						分享
					</view>
					<view @click="btnScan" class="iconfont " style="">
						添加图书
					</view>
					<view @click="btnEnterEditing" class="iconfont icon-apps" style="">
						编辑
					</view>
				</view>
			</view>
		</view>
	</ezpage>

</template>

<script>
	import cloudApi from "../../common/cloudApi.js"
	import ezpage from '../../components/ezpage.vue'
	import ezshare from '../../components/ezshare.vue'
	import bookcell from '../../components/dnms-ui/bookcell.vue'
	export default {
		components: {
			ezpage,
			ezshare,
			bookcell
		},
		data() {
			return {
				title: "",
				isEditing: false,
				shelfInfo: null,
				shelfid: null,
				canloadmore: true,
				showShareMenu: false,
				books: []
			}
		},
		onLoad(options) {
			this.shelfid = options.id;
			this.getBookshelfInfo();
		},
		onReachBottom() {

		},
		onShareAppMessage() {

		},
		methods: {
			getBookshelfInfo() {
				cloudApi.call({
					name:"bookshelfs",
					data: {
						action:"get",
						_id:this.shelfid
					},
					success:(res)=> {
						console.log(res)
						this.shelfInfo = res.result
					}
				})
			},
			drawPoster() {

			},

			onShareSelected(index) {}
		}
	}
</script>

<style>

</style>
