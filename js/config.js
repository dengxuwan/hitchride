"use strict";


var nebulas = require("nebulas"),
	Account = nebulas.Account,
	neb = new nebulas.Neb(),
	api = neb.api,
	nonce = 0;

var NebPay = require("nebpay");
var nebPay = new NebPay();
var config = {
	chainId: 1,
	apiPrefix: "https://mainnet.nebulas.io", //https://testnet.nebulas.io  https://mainnet.nebulas.io
	contractAddr: "n1n1X7Ea9BBKBhsVqwuk9W25neYnv3FTMEJ", //main n1zsohpv63CnmUs7aeVBfgeQBozpK5bmTMk test n21iah7tXxgxTZ6R81n9UuWGwULcuVansBd
	myAddress: Account.NewAccount().getAddressString(),
	gaslimit: 2000000,
	gasprice: 1000000,
	transfer: "transfer",
	addTravel: "addTravel",
	attention: "attention",
	getAll: "getAll",
	comment: "comment", //添加评论
	getPatentInfo: "getPatentInfo",
	getTransferList: "getTransferList",
	personal: "personal",
	search: "search",
	checkTxhash: "https://explorer.nebulas.io/#/tx/"
};
neb.setRequest(new nebulas.HttpRequest(config.apiPrefix));
var serialNumber;
var defaultOptions = {
	goods: { //Dapp端对当前交易商品的描述信息，app暂时不展示
		name: "", //商品名称
		desc: "", //描述信息
		orderId: "", //订单ID
		ext: "" //扩展字段
	},
	qrcode: {
		showQRCode: false, //是否显示二维码信息
		container: undefined //指定显示二维码的canvas容器，不指定则生成一个默认canvas
	},
	mobile: {
		showInstallTip: true, //是否支持手机钱包安装提示
		installTip: undefined // 手机钱包安装提示
	},
	extension: {
		openExtension: true //是否支持插件调用
	},
	// callback 是记录交易返回信息的交易查询服务器地址，不指定则使用默认地址
	callback: undefined,
	// listener: 指定一个listener函数来处理交易返回信息（仅用于浏览器插件，App钱包不支持listener）
	listener: undefined,
	// if use nrc20pay ,should input nrc20 params like name, address, symbol, decimals
	nrc20: undefined
};

function query(curWallet, method, args, callback) {
	if (typeof method != "undefined") {
		try {
			neb.setRequest(new nebulas.HttpRequest(config.apiPrefix));
			neb.api.call({
				from: curWallet,
				to: config.contractAddr,
				value: 0,
				nonce: "0",
				gasPrice: config.gasprice,
				gasLimit: config.gaslimit,
				contract: {
					"function": method,
					"args": args
				}
			}).then(function(resp) {
				callback(resp);
			}).catch(function(err) {
				callback(err);
				console.log(err);
			});
		} catch (e) {
			callback(e);
		}
	}
}
Date.prototype.toLocaleString = function() {
	return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes();
};

function tips(text, isok) {
	var modal = $('#myModal');
	$('#myModal').modal('show');
	modal.find('.modal-title').text('提示');
	if (isok) {
		modal.find('.modal-body').html('<div class="alert alert-success" role="alert">' + text + '</div>');
	} else {
		modal.find('.modal-body').html('<div class="alert alert-warning" role="alert">' + text + '</div>');
	}
	setTimeout(function() {
		$('#myModal').modal('hide');
	}, 10000);
}

function calcReward(profits) {
	var count = new BigNumber(0);
	$.each(profits, function(key, item) {
		count = count.plus(new BigNumber(item.value));
	});
	return count;
}

function getTimeStr(date) {
	var y = new Date(date).getFullYear();
	var m = new Date(date).getMonth() + 1
	var d = new Date(date).getDate();

	var h = new Date(date).getHours()
	var mm = new Date(date).getMinutes()
	return y + "-" + m + '-' + d + " " + h + ':' + mm
}

function getDateStr(date) {
	var y = new Date(date).getFullYear();
	var m = new Date(date).getMonth() + 1
	var d = new Date(date).getDate();

	var h = new Date(date).getHours()
	var mm = new Date(date).getMinutes()
	return y + "-" + m + '-' + d;
}

function getQueryString(name) {
	// 用该属性获取页面 URL 地址从问号 (?) 开始的 URL（查询部分）
	var url = window.location.search;
	// 正则筛选地址栏
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	// 匹配目标参数
	var result = url.substr(1).match(reg);
	//返回参数值
	return result ? decodeURIComponent(result[2]) : null;

}
//对象深拷贝
function _deepCopy(obj) {
	var objClone;
	if (obj.constructor == Object) {
		objClone = new obj.constructor();
	} else if (obj.constructor == Array && obj.length == 0) {
		objClone = [];
	} else {
		objClone = new obj.constructor(obj.valueOf());
	}
	for (var key in obj) {
		if (objClone[key] != obj[key]) {
			if (typeof(obj[key]) == 'object') {
				if (obj[key].constructor == Array && obj[key].length == 0) {
					objClone[key] = [];
				} else {
					if (obj[key] == null) {
						objClone[key] = null;
					} else {
						objClone[key] = _deepCopy(obj[key]);
					}
				}
			} else {
				objClone[key] = obj[key];
			}
		}
	}
	objClone.toString = obj.toString;
	objClone.valueOf = obj.valueOf;
	return objClone;
}
//判断两个时间戳是不是同一天
function isToday(str, str1) {
	if (new Date(str).toDateString() === new Date().toDateString(str1)) {
		//今天
		return true;
	} else {
		return false;
	}
}
var intervalQuery;
var serialNumber;