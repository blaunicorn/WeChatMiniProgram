const appId = 'wxdaf109597d82a1ac';
const appSecret = "afbdb24a3c5649c537dd1ad3a7654f34";

const jwt = require("jsonwebtoken")

function getToken(openid) {
	return jwt.sign({
		openid: openid
	}, appSecret, {
		expiresIn: 60 * 60 * 24
	});
}

function verifyToken(token) {
	return jwt.verify(token, appSecret)
}

const db = uniCloud.database();
async function requestNewAccessToken() {
	const res = await uniCloud.httpclient.request(
		`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`, {
			dataType: "json"
		})
	console.log("reload accesstoken")
	await db.collection("system").doc("611e16030d30690001ffcb4a").update({
		accesstoken: {
			value: res.data.access_token,
			expiredtime: new Date().getTime() + 7000000
		}
	});
	return res.data.access_token;
}

async function getAccessToken(forceupdate = false) {
	const dbRes = await db.collection("system").doc("611e16030d30690001ffcb4a").get();
	const systemInfo = dbRes.data[0];

	const now = new Date().getTime();
	if (systemInfo.accesstoken.value && !forceupdate) {
		if (now > systemInfo.accesstoken.expiredtime) {
			const accesstoken = await requestNewAccessToken();
			return accesstoken;
		} else {
			console.log("服务器缓存accesstoken仍然有效");
			return systemInfo.accesstoken.value
		}
	} else {
		const accesstoken = await requestNewAccessToken();
		return accesstoken;
	}
}

async function msgSecCheck(openid, content) {
	const access_token = await getAccessToken();
	console.log("正在检测 " + content + " 的内容是否安全");
	const res = await uniCloud.httpclient.request("https://api.weixin.qq.com/wxa/msg_sec_check?access_token=" +
		access_token, {
			method: "POST",
			dataType: "json",
			headers: {
				"Content-Type": "application/json"
			},
			data: {
				version: "2",
				openid: openid,
				scene: 2,
				content: content
			}
		});
	console.log("检查结果", res);
	return res.data;
}

//https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=
async function getWXACodeUnlimited(scene, page) {
	console.log(scene,page)
	const access_token = await getAccessToken();
	const res = await uniCloud.httpclient.request("https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + access_token, 
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			data: {
				"scene": scene, 
				// 小程序码的场景标签
				// page: page  
				// 直接跳转到哪个页面去
			}
		});

	return res.data;
}

// module.exports = function(e) {
// 公用模块用法请参考 https://uniapp.dcloud.io/uniCloud/cf-common
// return e
module.exports = {
	getAccessToken: getAccessToken,
	msgSecCheck: msgSecCheck,
	getWXACodeUnlimited: getWXACodeUnlimited,
	appId: appId,
	appSecret: appSecret,
	getToken: getToken,
	verifyToken: verifyToken
}
