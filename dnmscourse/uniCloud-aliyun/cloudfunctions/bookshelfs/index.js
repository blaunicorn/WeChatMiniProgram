'use strict';
// 引入公共模块，进行用户验证，然后对书房进行增删改查
const {verifyToken} = require("wx-common")
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db = uniCloud.database()
	const dbCmd = db.command;
	// 如果携带token，就校验token，并生成openid
	const payload = event.token?verifyToken(event.token):null;
	
	// actions
	
	const action = event.action; // create, query, get
	let dbRes;
	if (action ==="create") {
		// 一般应该还走一步内容安全监测流程
		// 创建一个书房的表
		// 书房的所有者 ，名称、地址、地理位置、总书量	
		dbRes = await db.collection("bookshelfs").add({
			owner: payload.openid,  
			name: event.name,
			address: event.address,
			geopoint: new db.Geo.Point(event.longitude,event.latitude), 
			totalbook: 0
		})
		
	} else if (action ==="listmy") {
		dbRes = await db.collection("bookshelfs").where({
			owner:dbCmd.eq(payload.openid)
		})
		.orderBy("_id","desc") // 通过id排序
		.limit(10)  //skip( ) 可以翻页
		.get()
	} else if (action === "delete") {
		dbRes = await db.collection("bookshelfs").where({
			"_id":dbCmd.eq(event._id),
			"owner":dbCmd.eq(payload.openid)
		}).remove()
	} else if (action === 'get') {
		dbRes = await db.collection("bookshelfs").where({
			_id: dbCmd.eq(event._id)
		})
		.get()
		// 如果是自己的书房，就 添加个你是书房主人的属性
		const owner = dbRes.data[0]["owner"];
		delete dbRes.data[0]["owner"];
		
		dbRes.data[0]["isowner"] = payload? owner===payload.openid:false;
		const ownerinfo =await db.collection("users").field({openid:false}).where({
			openid:dbCmd.eq(owner)
		}).get();
		
		dbRes.data[0]["ownerinfo"] = ownerinfo.data[0];
		return dbRes.data[0]
	} else if (action === 'listbygeo') {
		dbRes = await db.collection("bookshelfs").where({
			geopoint:dbCmd.geoNear({
				geometry:new db.Geo.Point(event.longitude,event.latitude),
				maxDistance:3000, // 3000米
				minDistance:0
			})
		})
		.limit(100)
	    .get();
	} else if (action === 'update') {
		dbRes = await db.collection("bookshelfs").where({
			"_id": dbCmd.eq(event._id),
			"owner":dbCmd.eq(payload.openid)
		})
		.limit(1)
	    .update({
			name: event.name,
			address: event.address,
			geopoint: new db.Geo.Point(event.longitude,event.latitude)
		});
	}

	//返回数据给客户端
	// return event
	return dbRes.data;
};
