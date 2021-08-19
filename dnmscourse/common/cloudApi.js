let token;

function call(option) {
	return new Promise((resolve,reject)=> {
		if (!option.data) option.data = {};
		console.log('option.data.token携带',option.data.token,'缓存token：',token)
		if (token) option.data.token = token;
		uni.showLoading({
			
		});
		uniCloud.callFunction({
			name: option.name,
			data: option.data,
			success: (res) => {
				//  把token更新存入内存,
				if (res.result.token) token=res.result.token;
				if (option.success) option.success(res);
				resolve(res)
			},
			fail: (err) => {
				if (option.fail) option.fail(err)
				reject(err)
			},
			complete:()=> {
				uni.hideLoading();
				if(option.complete) option.complete()
			}
		})
	})
}

module.exports = {
	call:call
}