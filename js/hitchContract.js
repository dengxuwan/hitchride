'use strict';
//评论对象
var Comment = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.id = obj.id;
		this.user = obj.user;
		this.time = obj.time;
		this.content = obj.content;
	} else {
		this.id = "";
		this.user = "";
		this.time = "";
		this.content = "";
	}
};
Comment.prototype = {
	toString: function() {
		return JSON.stringify(this);
	}
};
//行程信息对象
var TravelInfo = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.id = obj.id;
		this.name = obj.name;
		this.author = obj.author;
		this.phone = obj.phone;
		this.fromAddress = obj.fromAddress;
		this.distination = obj.distination;
		this.type = obj.type;
		this.count = obj.count;
		this.price = obj.price;
		this.remark = obj.remark;
		this.goTime = obj.goTime;
		this.time = obj.time;
		this.attents = obj.attents;
		this.comments = obj.comments;
	} else {
		this.id = "";
		this.name = "";
		this.author = "";
		this.phone = "";
		this.fromAddress = "";
		this.distination = "";
		this.type = "";
		this.count = "";
		this.price = "";
		this.goTime = "";
		this.remark = "";
		this.time = "";
		this.attents = [];
		this.comments = [];
	}
};
TravelInfo.prototype = {
	toString: function() {
		return JSON.stringify(this);
	},
	//添加乘客信息
	addAttent: function(attent) {
		if (!this.attents || this.attents == null) {
			this.attents = [];
		}
		if (typeof attent != "undefined") {
			this.attents.push(attent);
		}
	},
	addComment: function(comment) {
		if (!this.comments || this.comments == null) {
			this.comments = [];
		}
		if (typeof comment != "undefined") {
			this.comments.push(comment);
		}
	}
};
var AttentInfo = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.id = obj.id;
		this.address = obj.address;
		this.travelId = obj.travelId;
		this.name = obj.name;
		this.price = obj.price;
		this.phone = obj.phone;
		this.time = obj.time;
	} else {
		this.id = "";
		this.address = "";
		this.travelId = "";
		this.price = "";
		this.name = "";
		this.phone = "";
		this.time = "";
	}
};
AttentInfo.prototype = {
	toString: function() {
		return JSON.stringify(this);
	}
};
var hitchRideContract = function() {
	// 定义全局变量
	LocalContractStorage.defineProperties(this, {
		_currentUser: "", // 当前使用人地址
		_fee: new BigNumber(0.01),
		_wei: 1000000000000000000,
		_jSize: 0
	});
	// 定义全局的map变量
	LocalContractStorage.defineMapProperties(this, {
		"travelInfos": {
			parse: function(value) {
				return new TravelInfo(value);
			},
			stringify: function(o) {
				return o.toString();
			}
		},
		"travelInfoKeys": {
			parse: function(value) {
				return value.toString();
			},
			stringify: function(o) {
				return o.toString();
			}
		}
	});
};
hitchRideContract.prototype = {
	init: function() {
		this._currentUser = Blockchain.transaction.from;
		this._fee = new BigNumber(0.01); // 手续费
		this._wei = 1000000000000000000; // 单位
		this._jSize = 0;
		var travelInfo = new TravelInfo({
			id: "one",
			name: "开火车的小猴子",
			author: "n1JeDTMq5xHq6Y16yApYbMdT4Vw4K9kzbK9",
			phone: "18907395221",
			fromAddress: "深圳南山区科技园",
			distination: "湖南邵阳市人民政府",
			type: "奥迪A6",
			count: "3",
			price: "15",
			remark: "准时出发，请乘客准时到达南山科技园立交桥上车",
			goTime: "1529131359517",
			time: "1529131359517",
			attents: []
		});
		this.travelInfoKeys.set(this._jSize, travelInfo.id);
		this.travelInfos.set(travelInfo.id, travelInfo);
		this._jSize++;
	},
	//智能合约中验证地址正确性
	_verifyAddress: function(address) {
		// 1-valid, 0-invalid
		var result = Blockchain.verifyAddress(address);
		return {
			valid: result == 0 ? false : true
		};
	},
	currentUser: function() {
		return this._currentUser;
	},

	resetCurrentUser: function(addr) {
		if (this._currentUser === Blockchain.transaction.from && this.verifyAddress(addr)) {
			this._currentUser = addr;
		} else {
			return 'Permission denied!';
		}
	},

	wei: function() {
		return this._wei;
	},

	resetWei: function(wei) {
		if (this._creator === Blockchain.transaction.from) {
			this._wei = wei;
		} else {
			return 'Permission denied!';
		}
	},

	fee: function() {
		return this._fee;
	},

	resetFee: function(value) {
		if (this._creator === Blockchain.transaction.from) {
			this._fee = new BigNumber(value);
		} else {
			return 'Permission denied!';
		}
	},
	//对象深拷贝
	_deepCopy: function(obj) {
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
							objClone[key] = this._deepCopy(obj[key]);
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
	},
	// 查询所有行程
	getAll: function() {
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.travelInfoKeys.get(i);
			var travelInfo = this.travelInfos.get(key);
			travelInfo['id'] = key;
			list.push(travelInfo);
		}
		list = list.reverse(); //反转
		return list;
	},
	//添加评论
	comment: function(travelId, content) {
		var from = Blockchain.transaction.from;
		var time = Blockchain.transaction.timestamp.toString();
		var id = from + time;
		var travelInfo = this.travelInfos.get(travelId);
		if (!travelInfo) {
			throw new Error("没有找到此行程信息!");
		}
		var comment = new Comment({
			id: id,
			user: from,
			content: content,
			time: time
		});
		travelInfo.addComment(comment);
		this.travelInfos.set(travelId, travelInfo);
		return "success";
	},
	//添加行程
	addTravel: function(arg) {
		var from = Blockchain.transaction.from;
		var time = Blockchain.transaction.timestamp.toString();
		var args = new TravelInfo(arg);
		args.author = from;
		args['id'] = from + time;
		args.comments = [];
		args.attents = [];
		args['time'] = time;

		this.travelInfoKeys.set(this._jSize, args.id);
		this.travelInfos.set(args.id, args);
		this._jSize++;
	},
	// 查询自己发布的行程
	getMyList: function() {
		var from = Blockchain.transaction.from;
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.travelInfoKeys.get(i);
			var travelInfo = this.travelInfos.get(key);
			if (travelInfo.author === from) {
				list.push(travelInfo);
			}
		}
		return list.reverse();
	},
	//参加行程
	attention: function(travelId, name, phone) {
		var from = Blockchain.transaction.from;
		var time = Blockchain.transaction.timestamp.toString();
		var value = Blockchain.transaction.value;
		var travelInfo = this.travelInfos.get(travelId);
		if (!travelInfo) {
			throw new Error("没有找到此行程信息!");
		}
		if (!travelInfo.attents || travelInfo.attents.length >= travelInfo.count) {
			throw new Error("count fail");
		}
		if ((value.div(this._wei)).toString() !== travelInfo.price) {
			throw new Error("Error amount");
		}
		if (travelInfo.attents && travelInfo.attents.length > 0) {
			for (var i = 0; i < travelInfo.attents.length; i++) {
				var attentInfo = travelInfo.attents[i];
				if (attentInfo.address === from) {
					throw new Error('isRepeat');
				}
			}
		}
		var result = Blockchain.transfer(travelInfo.author, value);
		if (!result) {
			throw new Error("fail transfer");
		}
		var attentInfo = new AttentInfo({
			id: from + time,
			address: from,
			travelId: travelId,
			name: name,
			phone: phone,
			time: time
		});
		travelInfo.addAttent(attentInfo);
		this.travelInfos.set(travelId, travelInfo);
		return "success";
	},
	//查看自己参加的行程
	getMyAttents: function() {
		var from = Blockchain.transaction.from;
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.travelInfoKeys.get(i);
			var travelInfo = this.travelInfos.get(key);
			var attentInfos = travelInfo.attents;
			if (attentInfos.length > 0) {
				for (var j = 0; j < attentInfos.length; j++) {
					var attentInfo = attentInfos[j];
					if (attentInfo.address === from) {
						list.push(travelInfo);
					}
				}
			}
		}
		return list.reverse();
	},
	//查询个人中心需要的信息
	personal: function() {
		var obj = {};
		obj['myTravels'] = this.getMyList();
		obj['attentsRecords'] = this.getMyAttents();
		return obj;
	}
};
module.exports = hitchRideContract;