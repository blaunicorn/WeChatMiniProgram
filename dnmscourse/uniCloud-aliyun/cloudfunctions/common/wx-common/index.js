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
// module.exports = function(e) {
	// 公用模块用法请参考 https://uniapp.dcloud.io/uniCloud/cf-common
	// return e
module.exports =  {
		appId: appId,
		appSecret: appSecret,
		getToken: getToken,
		verifyToken: verifyToken
}
