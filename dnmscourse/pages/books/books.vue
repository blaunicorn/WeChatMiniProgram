<template>
	<view>
		<ezpage title="标题">
			<view class="" slot="navigationSection">
				<view class=""
					style="width: 100%;text-align: center;height:44px;line-height:44px; background-color: #FFFFFF;">
					搜书
				</view>
				<view class="" style="padding:10px;background-color: #FFFFFF;">
					<view class=""
						style="width:100%;height:44px;line-height:44px;display: flex;border-radius: 22px;border:1px solid #CCCCCC;overflow: hidden; ">
						<view class="" style="width:44px;text-align: center;">
							<text class="iconfont icon-search"></text>
						</view>
						<view class="" style="flex:1">
							<input @confirm="btnSearch" type="text" v-model="keyword" maxlength="15"
								style="width:100%;height: 44px;line-height:44px;" placeholder="输入书名搜索" />
						</view>
						<view class="" @click="btnSearch" style="width:80px;text-align: center;">
							搜索
						</view>
					</view>
				</view>
			</view>
			<view class="" slot="contentSection">
				<view class="" style="display: flex;flex-wrap: wrap; justify-content: start; padding-top:64px;">
					<view v-for="(item,index) in books" :key="index" class=""
						style="width:33.3%;padding:10px;margin-bottom:10px;">
						<bookcell :data="item"></bookcell>
					</view>
				</view>
			</view>
		</ezpage>
	</view>
</template>

<script>
	import ezpage from "../../components/ezpage.vue"
	import bookcell from "../../components/dnms-ui/bookcell.vue"
	import cloudApi from "../../common/cloudApi.js"
	export default {
		components: {
			ezpage,
			bookcell
		},
		data() {
			return {
				books: [],
				keyword: '',
				canloadmore: true,
			}
		},
		onLoad() {
			this.getBooks();
		},
		onReachBottom() {
			this.getBooks(this.books[this.books.length-1]._id);
		},
		methods: {
			btnSearch() {
			this.canloadmore = true;
			this.getBooks();
			},
			getBooks(start=0) {
				// if(!this.canloadmore) return;
				cloudApi.call({
					name: "books",
					data:{
						action: "listall",
						start:start,
						keyword:this.keyword
					},
					success:(res)=> {
						this.canloadmore = res.result.length>=9;
						if (start) this.books = this.books.concat(res.result)
						else {
							this.books = res.result;
						}
					}
				})
			}
		}
	}
</script>

<style>

</style>
