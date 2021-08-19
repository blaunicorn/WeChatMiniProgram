'use strict';
const {
	appId,
	appSecret,
	getToken
} = require("wx-common")
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event, 'appId', appId, "wx-common", require("wx-common"))

	// 创建数据库
	const db = uniCloud.database()

	// jscode2session
	const {
		code
	} = event;
	const res = await uniCloud.httpclient.request(
		// `https://api.weixin.qq.com/sns/jscode2session?appid='wxdaf109597d82a1ac'&secret='afbdb24a3c5649c537dd1ad3a7654f34'&js_code=${code}`,
		`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`,

		{
			dataType: "json"
		}
	)

	const openid = res.data.openid;

	console.log('login event 请求获取openid', res, getToken)
	let dbRes = await db.collection("users").where({
		openid: openid
	}).limit(1).get();

	// 根据openid 生成 token
	const token = getToken(openid)
	console.log('getToken', token)
	let userData

	if (dbRes.affectedDocs <= 0) {
		// 如果没有查到数据
		console.log(res)
		userData = {
			openid: openid,
			nickName: "微信用户",
			avatarUrl: ""
		}
		// 存入数据库
		await db.collection("users").add(userData);
	} else {
		userData = dbRes.data[0];
	}



	// 注意 ，不需要把token 放入数据库，只需要返回给用户
	userData["token"] = token
	delete userData["openid"];
	//返回数据给客户端，让客户端拿到数据
	// return event
	return userData
};
