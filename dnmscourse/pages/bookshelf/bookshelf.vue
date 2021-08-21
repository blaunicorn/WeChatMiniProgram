<template>
	<ezpage :title="'书架：'+ shelfInfo.name">
		<view slot="contentSection" style="height:100%;">
			<canvas id="myPoster" type="2d" 
			style="position: absolute;left:-350px;width:350px;height:750px;"></canvas>
			<ezshare v-if="showShareMenu" @selected="onShareSelected" @dismiss="onShareDismiss"></ezshare>
			<view class="" style="justify-content: start;display: flex;flex-wrap: wrap;padding:10px;">
				<view v-for="(item,index) in books" :key="index" style="width: 33.3%;padding: 10px;margin-top:10px;">
					<bookcell :data="item"></bookcell>
					<view class="" v-if="isEditing" @click="btnDeleteBook" :data-id="item._id"
					style="font-size: 10px;text-align: center;marigin-top:10px;"
					>
					<text style="padding: 5px 10px;background:#f3433e;color: #FFFFFF;;border-radius: 5px;">编辑</text>
						
					</view>
				</view>
			</view>
		</view>
		<!-- 			是拥有者，才能显示编辑、分享、添加灯编辑选项 -->
		<view class="" v-if="shelfInfo.isowner" slot="tabSection" style="padding: 10px;">
			<view class="" v-if="!isEditing"
				style="background-color: #000000;width:100%;height:50px;border-radius:25px;display: flex;line-height: 50px;color:#FFFFFF;justify-content: space-between;">
				<view @click="showShareMenu=true" class="iconfont icon-share"
					style="width:50px;height: 50px;text-align: center;">
					分享
				</view>
				<view @click="btnScan" class="iconfont " style="flex: 1;text-align: center;">
					添加图书（ISBN）
				</view>
				<view @click="btnEnterEditing" class="iconfont icon-apps"
					style="width:50px;height:50px;text-align: center;">
					编辑
				</view>
			</view>
			<view class="" v-else
				style="background-color: #000000;width:100%;height:50px;border-radius: 25px;display: flex;line-height: 50px;color: #FFFFFF;justify-content: space-between;">
				<view class="">

				</view>
				<view @click="btnExitEditing" class="" style="flex: 1;text-align: center;">
					退出编辑模式
				</view>
				<view class="">

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
			// if(!this.shelfid)uni.navigateBack();
			this.getBookshelfInfo();
			this.requestBookList()
		},
		onReachBottom() {
			this.requestBookList(this.books[this.books.length-1]._id)
		},
		onShareAppMessage() {
			return {
				title: this.title,
				path:'/pages/me/index?scene=sid=' + this.shelfInfo._id
			}
		},
		methods: {
			btnEnterEditing() {
				this.isEditing = true;
			},
			btnExitEditing() {
			this.isEditing = false;
			},
			btnDeleteBook(e) {
				console.log(e.currentTarget.dataset.id);
				uni.showActionSheet({
					itemList:["置顶","删除"],
					success:(res)=> {
						if (res.tapIndex=== 0) {
							cloudApi.call({
								name:"books",
								data: {
									action:"movetop",
									bookid:e.currentTarget.dataset.id
								},
								success:(res)=> {
									this.requestBookList()
								}
							})
						} else if (res.tapIndex === 1) {
							cloudApi.call({
								name: "books",
								data:{
									action:"delete",
									shelfid:this.shelfid,
									bookid:e.currentTarget.dataset.id
								},
								success:(res)=> {
									this.requestBookList()
								}
							})
						}
					}
				})
			},
			getBookshelfInfo() {
				cloudApi.call({
					name: "bookshelfs",
					data: {
						action: "get",
						_id: this.shelfid
					},
					success: (res) => {
						console.log(res)
						this.shelfInfo = res.result
					}
				})
			},
			drawPoster() {
				uni.showLoading({
					title: "生成中...",
					mask:true
				});
				console.log('0000');
				
				const query = wx.createSelectorQuery();
				console.log('0001');
				query.select('#myPoster')
				.fields({id: true,node:true,size:true})
				.exec(this.init1.bind(this));
			},
			init(res) {
				   console.log(res)
				    const canvas = res[0].node
				    const ctx = canvas.getContext('2d')
				    const dpr = wx.getSystemInfoSync().pixelRatio
				    //新接口需显示设置画布宽高；
				    canvas.width = res[0].width * dpr
				    canvas.height = res[0].height * dpr
				ctx.scale(dpr,dpr);
				ctx.fillStyle="#FFFFFF";
				ctx.fillRect(0,0,350,750);
				
				ctx.fillStyle="#000000";
				ctx.fontsize = 16;
				ctx.fillText(this.shelfInfo.name,70,25);
				
				ctx.fontsize =12;
				ctx.fillText("馆主：" + this.shelfInfo.ownerinfo.nickName,70,44)
				
				ctx.fontsize =12;
				ctx.fillText("地址："+this.shelfInfo.address,70,60)
				uni.canvasToTempFilePath({
					canvas: canvas,
					success: (res) => {
						uni.previewImage({
							current: res.tempFilePath,
							urls: [res.tempFilePath]
						})
						// 提示保存到相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath
						})
					},
					fail:(error)=> {
						console.log(error)
					}
				})
				uni.hideLoading();
			},
			async init1(res) {
					console.log('1111');
					let canvas = res[0].node;
					let ctx = canvas.getContext("2d");
					console.log('2222');
					let dpr = uni.getSystemInfoSync().pixelRatio;
					canvas.width = res[0].width *dpr;
					canvas.height = res[0].height * dpr;
					ctx.scale(dpr,dpr);
					ctx.fillStyle="#FFFFFF";
					ctx.fillRect(0,0,350,750);
					
					ctx.fillStyle="#000000";
					ctx.fontsize = 16;
					ctx.fillText(this.shelfInfo.name,70,25);
					
					ctx.fontsize =12;
					ctx.fillText("馆主：" + this.shelfInfo.ownerinfo.nickName,70,44)
					
					ctx.fontsize =12;
					ctx.fillText("地址："+this.shelfInfo.address,70,60)
					
					//绘制头像
					let image = canvas.createImage();
					// 绘制的位置
					image.onload=(res)=> {
						ctx.drawImage(image,10,15,50,50);
											// uni.canvasToTempFilePath({
											// 	canvas: canvas,
											// 	success: (res) => {
											// 		uni.previewImage({
											// 			current: res.tempFilePath,
											// 			urls: [res.tempFilePath]
											// 		})
											// 	},
											// 	fail:(error)=> {
											// 		console.log(error)
											// 	}
											// })
					};
					image.src = this.shelfInfo.ownerinfo.avatarUrl;
				
					// books 设置图书的本书，确保不超过图片,并且grid 布局排序
					let bookLength = Math.min(9,this.books.length);
					
					let bookIndex = 0;
					let loadNextBook = () => {
						let bookItem = this.books[bookIndex];
						console.log(bookIndex)
						// 图片的本地化，获得成功 再画到画布上
						uni.getImageInfo({
							src: bookItem.cover_url,
							success:(res)=> {
								let image = canvas.createImage();
								image.onload=()=> {
									console.log(bookIndex,bookLength)
									// 书的序号取余，确保每行3列，并且宽度100 ，间隔15，前面初始位置10
									let dx = Math.floor(bookIndex%3) * (100+15) +10;
									// 高度 取除数 ，高度150，间隔15，初始80
									let dy = Math.floor(bookIndex/3)*(150 +15) + 80;
									ctx.drawImage(image,dx,dy,100,150);
									if (bookIndex<bookLength-1) {
										console.log(bookIndex)
										bookIndex++;
										loadNextBook();
									} else {
										console.log("all book loading finish");
										
										// 把canvas转换成图片 预览api ，也可用 uni.saveImageToPhotosAlbum  将图片保存到相册里
										// 因为画布时，可能头像还没有画完
										uni.canvasToTempFilePath({
											canvas: canvas,
											success: (res) => {
												uni.previewImage({
													current: res.tempFilePath,
													urls: [res.tempFilePath]
												})
												// 提示保存到相册
												uni.saveImageToPhotosAlbum({
													filePath: res.tempFilePath
												})
											},
											fail:(error)=> {
												console.log(error)
											}
										})
									}
								}
								image.src = res.path;
							},
							fail:(error)=> {
								console.log(error)
							}
						})
					};	
					// 加入小程序码.,需要服务端调用，需要服务器生成token 去调用
					const wxacodeRes = await cloudApi.call({
						name: "getwxacode",
						data: {
							scene: "sid="+ this.shelfInfo._id,  // 书架的id	
							page: "pages/me/index"					
						}
					});
					// console.log(wxacodeRes)
					// 把返回的小程序码 图片数据流 写到本地
					wx.getFileSystemManager().writeFileSync(`${wx.env.USER_DATA_PATH}/mpcode.jpg`,
					uni.arrayBufferToBase64(wxacodeRes.result.data) ,
					"base64"
					)
					// 在读取到画布上
					uni.getImageInfo({
						src: `${wx.env.USER_DATA_PATH}/mpcode.jpg`,
						success: (res) => {
							let image = canvas.createImage();
							image.onload =()=> {
								ctx.drawImage(image,350-170,750-170,160,160);
								// 执行持续画书
					            loadNextBook();
							}
							image.src = res.path;
						},
						fail:(error)=> {
							console.log(error)
						}
					})
					
					
					uni.hideLoading();				
					
				
			},
			requestBookList(start = 0) {
				if (start && !this.canloadmore) return
				// 请求该书房所有图书的列表
				cloudApi.call({
					name:"books",
					data: {
						action:"listbyshelf",
						shelfid:this.shelfid,
						start:start,
					},
					success:(res)=> {
						console.log(res)
						this.canloadmore = res.result.length>=9;
						if (!start) {
							this.books = res.result;
						} else {
							this.books = this.books.concat(res.result);
						}
						
					}
				})
			},
			// 设计分享海报生成逻辑
			onShareSelected(index) {				
				if (index===1) {
					this.drawPoster()
				} else {
					console.log(index)
				}
			},				
			onShareDismiss() {
				this.showShareMenu = false;
			},
			btnScan() {
				// 扫描isbn查询
				uni.scanCode({
						success: (res) => {
						console.log(res)
						let isbn = res.result
						cloudApi.call({
							name:"ISBNQuery",
							data: {
								isbn
							},
							success:(res)=> {
								console.log(res)
								cloudApi.call({
									name: "books",
									data: {
										action:"add",
										shelfid:this.shelfid,
										isbnid:res.result._id
									},
									success:(res)=> {
										console.log(res)
										this.requestBookList()
									}
								})
							}
						})
					}
				})
				
				// cloudApi.call({
				// 	name: "ISBNQuery",
				// 	data: {
				// 		isbn:"9787115564672"
				// 	},
				// 	success:(res)=> {
				// 		console.log(res)
				// 		cloudApi.call({
				// 			name: "books",
				// 			data: {
				// 				action:"add",
				// 				shelfid:this.shelfid,
				// 				isbnid:res.result._id
				// 			},
				// 			success:(res)=> {
				// 				console.log(res)
				// 				this.requestBookList()
				// 			}
				// 		})
				// 	}
				// })
			}
		}
	}
</script>

<style>
	page
	{
		background-color: #fff;
	}
</style>
