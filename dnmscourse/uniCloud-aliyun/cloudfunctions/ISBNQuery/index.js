'use strict';
// 引入解密豆瓣的包
let doubanbook = require("doubanbook")

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	const db = uniCloud.database();
	let { isbn } = event;
	// 如果自己的数据库存在该条数据，就直接读取，并返回
	let dbResult = await db.collection("isbnlib").where({
		isbn:isbn
	}).get()	

	if (dbResult.affectedDocs>0) {
		return dbResult.data[0]
	}
	
	// 如果该条数据 ，自己的数据库不存在，就爬豆瓣数据，并存在自己的数据中
	// 设计豆瓣爬虫，

	let res = await uniCloud.httpclient.request(
	`https://search.douban.com/book/subject_search?search_text=${isbn}&cat=1001`,
	{
		dataType:"text"
	}
	)
	let reg = /window\.__DATA__ = "(.*)"/; // 正则表达式，然后用豆瓣插件解密出来data
	if (reg.test(res.data)) {
		let bookdata = RegExp.$1;
		let data = doubanbook(bookdata)[0];
		
		
		// 创建数据库，把查询的豆瓣数据存到自己的数据库		
		let coverImage = await uniCloud.httpclient.request(
		data.cover_url  // 解析出的图片地址
		)
		let uploadResult = await uniCloud.uploadFile({
			cloudPath:isbn+".jpg",  // 图片名
			fileContent:coverImage.data  // 图片流
		})
		let resData = {
			isbn:isbn,
			title:data.title,
			cover_url: uploadResult.fileID, // 上传到自己服务器的图片的url
			abstract:data.abstract
		}			
		dbResult = await db.collection("isbnlib").add(resData);
		
		resData["_id"] = dbResult["id"]
		return resData
	}
	
	

	//返回数据给客户端
	// return event
	return res
};
