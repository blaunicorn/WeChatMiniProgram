'use strict';
const { verifyToken } = require("wx-common")
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	// 要操作数据库，必然要实例化一个数据库
	const db = uniCloud.database();
	const dbCmd = db.command;
	const action = event.action;
	const payload = verifyToken(event.token);
	const now = new Date().getTime();
	let dbRes 
		
	if (action === "add") {
		// doc 可以直接拿到信息，就不需要where命令了，比where的效率高
		const bookInfo = await db.collection("isbnlib").doc(event.isbnid).get();
		// 在书房中添加图书资料
		dbRes = await db.collection("books").add({
			owner:payload.openid,
			shelfid:event.shelfid,
			title:bookInfo.data[0].title,
			cover_url: bookInfo.data[0].cover_url,
			isbn: bookInfo.data[0].isbn,
			isbnid:event.isbnid,
			createtime: now,
			updatetime: now
		});
		
		// 查 该书房 ,并增加整体图书数量+1
		await db.collection("bookshelfs").where({
			owner:payload.openid,
			_id:event.shelfid
		}).update({
			totalbook:dbCmd.inc(1)  // 
		})
		
		return dbRes
	} else if (action === "listbyshelf") {
		// 返回的数据 不需要知道owner的相关数据，所以用 field参数去掉
		dbRes = await db.collection("books").field({owner:false}).where({
			shelfid:dbCmd.eq(event.shelfid)
		}).limit(10).get()
		
		// 优化为聚合查询,避免相同的书出现2本
		// dbRes = await db.collection("books").aggregate().group({
		// 	"_id":"$isbnid",
		// 	"isbnid":dbCmd.aggregate.last("$isbnid"),
		// 	"title":dbCmd.aggregate.last("$title"),
		// 	"cover_url":dbCmd.aggregate.last("$cover_url")
		// }).sort({
		// 	"_id":-1
		// }).end();
		// // field({owner:false}).where({
		// // 	shelfid:dbCmd.eq(event.shelfid)
		// // }).limit(10).get()
		
		return dbRes.data
	}
	//返回数据给客户端
	return event
};
