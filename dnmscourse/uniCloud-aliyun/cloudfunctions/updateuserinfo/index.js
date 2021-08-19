'use strict';

const { verifyToken}  = require("wx-common")
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const { userInfo,token} =event;
	const db = uniCloud.database();
	const payload = verifyToken(token);  // 用token把openid解密出来
console.log('payload',payload)
	// 也可以用专门的命令查询 dbCmd
	const dbCmd = db.command;
	// 存入数据库,选择需要的字段，,避免泄露
	const dbRes = await db.collection("users")
	.where({
		// openid:userInfo.openid
		openid: dbCmd.eq(payload.openid)
	})
		// .get()
	.update({
		nickName: userInfo.nickName,
		avatarUrl: userInfo.avatarUrl,
		gender: userInfo.gender,
		country: userInfo.country,
		province: userInfo.province,
		city: userInfo.city
	})
	//返回数据给客户端
	// return event
	return dbRes
};
