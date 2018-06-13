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
var TransferRecord = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.patentId = obj.patentId;
		this.title = obj.title;
		this.from = obj.from;
		this.to = obj.to;
		this.price = obj.price;
		this.time = obj.time;
		this.no = obj.no;
	} else {
		this.patentId = "";
		this.title = "";
		this.from = "";
		this.to = "";
		this.price = "";
		this.time = "";
		this.no = "";
	}
};
TransferRecord.prototype = {
	toString: function() {
		return JSON.stringify(this);
	}
};
//专利信息对象
var PatentInfo = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.id = obj.id;
		this.no = obj.no; //专利号
		this.from = obj.from; //从哪里购买的
		this.author = obj.author;
		this.title = obj.title; // 专利标题
		this.appDate = obj.appDate; // 申请时间
		this.appName = obj.appName; // 申请人
		this.inventName = obj.inventName; //
		this.appAddress = obj.appAddress; // 申请人地址
		this.appPhone = obj.appPhone; //申请人联系方式
		this.mainTypeNo = obj.mainTypeNo; //主分类号
		this.typeNo = obj.typeNo; //分类号
		this.agency = obj.agency; // 代理机构
		this.status = obj.status; // 专利状态
		this.rawStatus = obj.rawStatus; //法律状态
		this.description = obj.description; // 摘要
		this.shuoming = obj.shuoming; //说明
		this.power = obj.power; // 权利要求
		this.price = obj.price; //价格
		this.createDate = obj.createDate; // 创建时间
		this.pic = obj.pic;
		this.isTrans = obj.isTrans; // 是否转让 
		this.isBuy = obj.isBuy; //是否购买过来 的
		this.comments = obj.comments;
	} else {
		this.id = "";
		this.no = ""; //专利号
		this.from = "";
		this.author = "";
		this.title = ""; // 专利标题
		this.appDate = ""; // 申请时间
		this.appName = ""; // 申请人
		this.inventName = ""; //
		this.appAddress = ""; // 申请人地址
		this.appPhone = ""; //申请人联系方式
		this.mainTypeNo = ""; //主分类号
		this.typeNo = ""; //分类号
		this.agency = ""; // 代理机构
		this.status = ""; // 专利状态
		this.rawStatus = ""; //法律状态
		this.description = ""; // 摘要
		this.power = ""; // 权利要求
		this.price = "0"; //价格
		this.shuoming = "";
		this.pic = "";
		this.createDate = ""; // 创建时间
		this.isTrans = false; // 是否转让
		this.isBuy = false;
		this.comments = [];
	}
};
PatentInfo.prototype = {
	toString: function() {
		return JSON.stringify(this);
	},
	//添加评论记录
	addComment: function(comment) {
		if (!this.comments || this.comments == null) {
			this.comments = [];
		}
		if (typeof comment != "undefined") {
			this.comments.push(comment);
		}
	},
	//转让
	transfer: function(to) {
		this.from = this.author;
		this.author = to;
		this.isBuy = true;
		this.isTrans = false;
	}
};
var Message = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.id = obj.id;
		this.from = obj.from; //发送人
		this.content = obj.content;
		this.time = obj.time;
		this.isRead = obj.isRead; // 0 ：未读  1 ：已读
	} else {
		this.id = "";
		this.from = ""; //发送人
		this.content = "";
		this.time = "";
		this.isRead = "0"; // 0 ：未读  1 ：已读
	}
};
Message.prototype = {
	toString: function() {
		return JSON.stringify(this);
	}
};
var MessageInfo = function(obj) {
	if (typeof obj === "string") {
		obj = JSON.parse(obj);
	}
	if (typeof obj === "object") {
		this.messages = obj.messages;
	} else {
		this.messages = [];
	}
};
MessageInfo.prototype = {
	toString: function() {
		return JSON.stringify(this);
	},
	//添加消息记录
	addMessage: function(message) {
		if (this.messages == null) {
			this.messages = [];
		}
		if (typeof message != "undefined") {
			this.messages.push(message);
		}
	}
};
var patentContract = function() {
	// 定义全局变量
	LocalContractStorage.defineProperties(this, {
		_currentUser: "", // 当前使用人地址
		_fee: new BigNumber(0.01),
		_wei: 1000000000000000000,
		_jSize: 0,
		_transSize: 0,
		_seeCount: 0 // 总浏览数
	});
	// 定义全局的map变量
	LocalContractStorage.defineMapProperties(this, {
		"patentInfos": {
			parse: function(value) {
				return new PatentInfo(value);
			},
			stringify: function(o) {
				return o.toString();
			}
		},
		"patentInfoKeys": {
			parse: function(value) {
				return value.toString();
			},
			stringify: function(o) {
				return o.toString();
			}
		},
		"messages": {
			parse: function(value) {
				return new messageInfo(value);
			},
			stringify: function(o) {
				return o.toString();
			}
		},
		"transfers": {
			parse: function(value) {
				return new TransferRecord(value);
			},
			stringify: function(o) {
				return o.toString();
			}
		},
		"transferKeys": {
			parse: function(value) {
				return value.toString();
			},
			stringify: function(o) {
				return o.toString();
			}
		}
	});
};
patentContract.prototype = {
	init: function() {
		this._currentUser = Blockchain.transaction.from;
		this._fee = new BigNumber(0.01); // 手续费
		this._wei = 1000000000000000000; // 单位
		this._jSize = 0;
		this._seeCount = 0;
		this._transSize=0;
		var time = Blockchain.transaction.timestamp.toString(10);
		var id = "one";
		var patentInfo = new PatentInfo({
			id: id,
			no: "CN201720055242.X ", //专利号
			from: "", //从哪里购买的
			author: "n1JeDTMq5xHq6Y16yApYbMdT4Vw4K9kzbK9",
			title: "拖地节水器", // 专利标题
			appDate: "2015-05-28", // 申请时间
			appName: "薛广治", // 申请人
			inventName: "薛广治", //
			appAddress: "163000 黑龙江省大庆市大同区 ", // 申请人地址
			appPhone: "18907395220", //申请人联系方式
			mainTypeNo: "E03B1/04", //主分类号
			typeNo: "E03B1/04;E03C1/122;E03C1/182 ", //分类号
			agency: "大庆禹奥专利事务所 23208 ", // 代理机构
			status: "实用新型专利授权公告 ", // 专利状态
			rawStatus: "授权", //法律状态
			description: "本实用新型属涉及一种节水器，具体涉及一种拖地节水器。包括底座及节水桶，节水桶底部设有锥形沉淀斗，锥形沉淀斗上方设有过滤罩，过滤罩包括环形挡盘和锥形过滤网，过滤罩的环形挡盘上设有静水盘，静水盘包括支撑杆和过水圆环，过水圆环上设有圆周均布的过水孔，过水孔底部设有防返斜槽，防返斜槽上设有固定孔，锥形过滤网位于过水圆环的圆孔内；节水桶侧面设有溢流管和进水管，进水管位于溢流管下方，溢流管与排水管连接排水管上安装有控制阀，控制阀上方设有阀门操作杆，阀门操作杆底部设有U型旋转头，U型旋转头插于控制阀的手轮内。本实用新型的结构设计合理，操作简单，使用方便，便于安装于及维修，节约环保，制作成本低廉。", // 摘要
			power: "1.一种拖地节水器，包括底座（13）及节水桶（1），其特征在于：节水桶（1）安装于底座（13）上，节水桶（1）底部设有锥形沉淀斗（12），锥形沉淀斗（12）上方设有过滤罩（3），过滤罩（3）包括环形挡盘（302）和锥形过滤网（301），过滤罩（3）的环形挡盘（302）上设有静水盘（2），静水盘（2）包括支撑杆（205）和过水圆环（201），过水圆环（201）上设有圆周均布的过水孔（204），过水孔（204）底部设有防返斜槽（203），防返斜槽（203）上设有固定孔（206），锥形过滤网（301）位于过水圆环（201）的圆孔（202）内；所述的节水桶（1）侧面设有溢流管（7）和进水管（8），进水管（8）位于溢流管（7）下方，溢流管（7）与排水管（11）连接，排水管（11）穿过节水桶（1）底部的圆孔与锥形沉淀斗（12）底部的出水孔（121）连接，排水管（11）上安装有控制阀（10），控制阀（10）上方设有阀门操作杆（5），阀门操作杆（5）位于套管（6）内，套管（6）固定于节水桶（1）上部，阀门操作杆（5）底部设有U型旋转头（9），U型旋转头（9）插于控制阀（10）的手轮内，阀门操作杆（5）顶部设有旋柄（4）；所述的底座（13）包括底框（134）和安装框架（131），底框（134）上设有对称分布的横梁（133），安装框架（131）上设有安装孔（132）。2.根据权利要求1所述的一种拖地节水器，其特征在于：所述的防返斜槽（203）为一体设计，使用不锈钢板加工成型，防返斜槽（203）通过螺丝安装固定于过水圆环（201）底部。3.根据权利要求1所述的一种拖地节水器，其特征在于：所述的节水桶（1）通过螺栓或合页固定于安装框架（131）的横框上，底座（13）通过安装框架（131）的竖框固定于墙体或固定支架上。", // 权利要求
			shuoming: "技术领域：本实用新型涉及一种节水器，具体涉及一种拖地节水器。背景技术：随着人们环保意识的提高，节约用水已经成为了我们生产和生活的常态，各种节水器随之进入市场。目前，节水器主要应用于用水量大的场所，比如蔬菜水果深加工企业、洗浴场所、洗车行等用水量大的企业。而在家庭生活用水的回收再利用方面，则没有一种使用方便及节水效果好的节水器，尤其是在洗涤废水的回收利用方面。设计一种用于回收洗手盆中的洗涤废水进行投洗拖布的拖地节水器是十分必要的。实用新型内容：本实用新型弥补和改善了上述现有技术的不足之处，实现了洗手盆的洗涤废水的回收再利用，洗手盆的洗涤废水通过节水桶的回收、过滤、沉淀后用于投洗拖布，达到了拖地节水的目的，节约环保。本实用新型采用的技术方案为：一种拖地节水器，包括底座及节水桶，节水桶安装于底座上，节水桶底部设有锥形沉淀斗，锥形沉淀斗上方设有过滤罩，过滤罩包括环形挡盘和锥形过滤网，过滤罩的环形挡盘上设有静水盘，静水盘包括支撑杆和过水圆环，过水圆环上设有圆周均布的过水孔，过水孔底部设有防返斜槽，防返斜槽上设有固定孔，锥形过滤网位于过水圆环的圆孔内；所述的节水桶侧面设有溢流管和进水管，进水管位于溢流管下方，溢流管与排水管连接，排水管穿过节水桶底部的圆孔与锥形沉淀斗底部的出水孔连接，排水管上安装有控制阀，控制阀上方设有阀门操作杆，阀门操作杆位于套管内，套管固定于节水桶上部，阀门操作杆底部设有U型旋转头，U型旋转头插于控制阀的手轮内，阀门操作杆顶部设有旋柄；所述的底座包括底框和安装框架，底框上设有对称分布的横梁，安装框架上设有安装孔。所述的防返斜槽为一体设计，使用不锈钢板加工成型，防返斜槽通过螺丝安装固定于过水圆环底部。所述的节水桶通过螺栓或合页固定于安装框架的横框上，底座通过安装框架的竖框固定于墙体或固定支架上。本实用新型的有益效果：结构设计合理，操作简单，使用方便，便于安装于及维修，节约环保，制作成本低廉，经济适用，易于大规模地推广和使用。在不改变原有洗手盆的构造的使用方式下安装拖地节水器，确定拖地节水器的安装位置后，先安装底座，再将两用阀门与洗手盆排水管、节水桶进水管和下水道排水管连接，最后连接节水桶的排水管及其它连接部件。当需要利用废水进行拖地时，旋转两用阀门的控制杆，使得洗涤废水进入节水桶内，洗涤后的废水通过节水桶回收、过滤、淤积及沉淀后用于投洗拖布，进行拖地，在节水桶内洗涮拖布时，静水盘能够防止沉积的杂物上返至节水桶上部，保证了拖地用水的清洁，拖地结束后，旋转阀门操作杆将节水桶底部的污水排放至下水道内。附图说明：图1是本实用新型的结构示意图。图2是本实用新型中锥形沉淀斗的结构示意图。图3是本实用新型中过滤罩的结构示意图。图4是图3的俯视图。图5是本实用新型中静水盘的俯视结构示意图。图6是图5的仰视图。图7是本实用新型中防返斜槽的俯视结构示意图。图8是图7的俯视图。图9是本实用新型中底座的结构示意图。图10是本实用新型的安装使用结构示意图。具体实施方式：实施案例一参照图1至图10，在不改变原有洗手盆14的构造的使用方式下安装拖地节水器，确定拖地节水器的安装位置后，先安装固定底座13，再将两用阀门17与洗手盆14的下水管15、节水桶1的进水管8和下水道排水管18连接，再将下水道排水管18和节水桶1的排水管11与下水道19连接。当需要利用废水进行拖地时，旋转两用阀门17的控制杆16，流经洗手盆14的洗涤废水通过进水管8进入节水桶1内，洗涤废水中的杂物通过静水盘2上过水圆环201的过水孔204流入静水盘2和过滤罩3形成的淤积室内，头发、碎片等大颗粒杂物经过锥形过滤网301的过滤后存积在淤积室内，小颗粒的污物通过锥形过滤网301后存积在锥形沉淀斗12内待排放；当节水桶1的水位超过溢流管7时，洗涤废水通过溢流管7流入排水管11后进入下水道19内，水面上的漂浮物也随之流出。经过过滤沉淀后的清洁水用于投洗拖布，在洗涮拖布的过程中，当搅动拖布时，防返斜槽203能够防止淤积室内的杂物上返至静水盘2上方，由于防返斜槽203的出水口与过水孔204不在同一条垂直线上，在进行洗涮拖布时过水圆环201下方的杂物不会发生倒流现象，同理，投洗拖布的杂物进入淤积室内并不会发生倒流现象，保证了拖地用水的清洁。拖地结束后，通过转动旋柄4旋转阀门操作杆5打开控制阀10，将节水桶1内的污水及存积在锥形沉淀斗12内的杂物通过排水管11排放至下水道19内，下水道19上安装有返味挡片20，防止有异味返出，取出静水盘2后清理淤积室内的杂物。洗涤废水经过回收进行拖地使用后，旋转两用阀门17的控制杆16，恢复洗手盆14的下水管15与下水道排水管18的接通。实施案例二参照图10，可将洗手盆14的下水管15与节水桶1的进水管8连接，洗涤废液流经节水桶1的过滤、淤积及沉淀后通过溢流管7流入下水道19，当需要洗涮拖布时，关闭排水管11上的控制阀10进行蓄水，按照实施案例一进行操作实现拖布的投洗。",
			price: "0.0001", //价格
			createDate: time, // 创建时间
			pic: "http://www.jszyfw.com//upload//53774A452908698C7DEF263//20180606170839566.jpg",
			isTrans: true, // 是否转让 
			isBuy: false, //是否购买过来 的
			comments: []
		});
		this.patentInfoKeys.set(this._jSize, id);
		this.patentInfos.set(id, patentInfo);
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
	//发送消息
	sendMessage: function(to, content) {
		if (!content || content === '') {
			return new Error('请填写消息内容');
		}
		var from = LocalContractStorage.transaction.from;
		var time = LocalContractStorage.transaction.timestamp.toString();
		var message = new Message({
			id: from + time,
			from: from, //发送人
			content: content,
			time: time,
			isRead: "0" // 0 ：未读  1 ：已读
		});
		var messageInfo = this._initUserMessage(from);
		messageInfo.addMessage(message);
		this.messages.set(from, messageInfo);
	},
	//获取用户的消息对象
	_initUserMessage: function(user) {
		var messageInfo = this.messages.get(user);
		if (messageInfo) {
			return messageInfo;
		} else {
			return new messageInfo({
				messages: []
			});
		}
	},
	// 查询所有列表
	getAll: function() {
		var obj = {};
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.patentInfoKeys.get(i);
			var patentInfo = this.patentInfos.get(key);
			patentInfo['id'] = key;
			list.push(patentInfo);
		}
		list = list.reverse(); //反转
		obj['list'] = list;
		var base = this.getIndexData(false);
		obj['base'] = base;
		return obj;
	},
	//添加评论
	comment: function(patentId, content) {
		var from = Blockchain.transaction.from;
		var time = Blockchain.transaction.timestamp.toString(10);
		var id = from + time;
		var patentInfo = this.patentInfos.get(patentId);
		if (!patentInfo) {
			throw new Error("没有找到此段子信息!");
		}
		var comment = new Comment({
			id: id,
			user: from,
			content: content,
			time: time
		});
		patentInfo.addComment(comment);
		this.patentInfos.set(patentId, patentInfo);
		return "success";
	},
	//添加专利
	addPatent: function(arg) {
		var time = Blockchain.transaction.timestamp.toString(10);
		var args = new PatentInfo(arg);
		args.comments = [];
		args.isBuy = false;
		args.from = '';
		args.createDate = time;
		var from = Blockchain.transaction.from;

		this.patentInfos.set(args.id, args);
		this.patentInfoKeys.set(this._jSize, args.id);
		this._jSize++;
	},
	// 查询自己发布的列表
	_getMyList: function() {
		var from = Blockchain.transaction.from;
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.patentInfoKeys.get(i);
			var patentInfo = this.patentInfos.get(key);
			if (patentInfo.author === from) {
				patentInfo['id'] = key;
				list.push(patentInfo);
			}
		}
		return list.reverse();
	},
	//查看自己的购买记录
	_getGoodList: function() {
		var from = Blockchain.transaction.from;
		var list = [];
		for (var i = 0; i < this._transSize; i++) {
			var key = this.transferKeys.get(i);
			var transfer = this.transfers.get(key);
			if (transfer.to === from) {
				list.push(transfer);
			}
		}
		return list.reverse();
	},
	//查看自己的评论记录
	_getCommentList: function() {
		var from = Blockchain.transaction.from;
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.patentInfoKeys.get(i);
			var patentInfo = this.patentInfos.get(key);
			for (var j = 0; j < patentInfo.comments.length; j++) {
				var comment = patentInfo.comments[j];
				if (comment.user === from) {
					list.push({
						id: key,
						title: patentInfo.title,
						content: comment.content,
						time: comment.time
					});
				}
			}
		}
		return list.reverse();
	},
	// 个人主页需要的数据
	personal: function() {
		var from = Blockchain.transaction.from;
		var result = {};
		var base = this.getIndexData(false);
		var comments = this._getCommentList();
		var goods = this._getGoodList();
		var patentInfos = this._getMyList();
		result["comments"] = comments;
		result["goods"] = goods;
		result["patentInfos"] = patentInfos;
		result['base'] = base;
		return result;
	},
	//获取专利详情
	getPatentInfo: function(patentInfoId) {
		var obj = {};
		var patentInfo = this.patentInfos.get(patentInfoId);
		if (!patentInfo) {
			throw new Error('此专利不存在!');
		}
		patentInfo['id'] = patentInfoId;

		obj['patentInfo'] = patentInfo;
		this._seeCount += 1;
		var base = this.getIndexData(false);
		obj['base'] = base;
		return obj;
	},
	//获取当前时间格式：20180530
	_getCurrentDate: function() {
		var y = new Date().getFullYear();
		var m = new Date().getMonth() + 1;
		var d = new Date().getDate();
		var time = y + m + d;
		return time;
	},
	//搜索专利
	search: function(keyWord) {
		var reg = new RegExp(keyWord);
		var obj = {};
		var list = [];
		for (var i = 0; i < this._jSize; i++) {
			var key = this.patentInfoKeys.get(i);
			var patentInfo = this.patentInfos.get(key);
			//按专利号搜索 /按专利名称搜索
			if (patentInfo.title.match(reg) || patentInfo.no.match(reg)) {
				patentInfo['id'] = key;
				list.push(patentInfo);
			}
		}
		obj['list'] = list;
		var base = this.getIndexData(false);
		obj['base'] = base;
		return obj;
	},
	//主页需要的数据
	getIndexData: function(isIndex) {
		var obj = {};
		var list = [];
		obj['totalCount'] = this._jSize;
		obj['seeCount'] = this._seeCount; // 总浏览数
		if (isIndex) {
			for (var i = 0; i < 3; i++) {
				var key = this.patentInfoKeys.get(i);
				var patentInfo = this.patentInfos.get(key);
				if (patentInfo) {
					patentInfo['id'] = key;
					list.push(patentInfo);
				}
			}
			obj['data'] = list;
		}
		obj['transCount'] = this._transSize;
		return obj;
	},
	//转让专利
	transfer: function(patentId) {
		var from = Blockchain.transaction.from;
		var time = Blockchain.transaction.timestamp.toString(10);

		var patentInfo = this.patentInfos.get(patentId);
		if (!patentInfo) {
			return new Error("patentInfo is not exitst");
		}
		var value = Blockchain.transaction.value.div(this._wei);
		// if (!value.eq(new BigNumber(patentInfo.price))) {
		// 	return new Error("the amount is error");
		// }
		var result = Blockchain.transfer(patentInfo.author, Blockchain.transaction.value);
		if (!result) {
			throw new Error("transfer failed.");
		}
		
		var record = new TransferRecord({
			patentId: patentId,
			title: patentInfo.title,
			no: patentInfo.no,
			from: patentInfo.author,
			to: from,
			price: value,
			time: time
		});
		patentInfo.transfer(from);
		this.patentInfos.set(patentId, patentInfo);

		var id = time + from;
		this.transferKeys.set(this._transSize,id);
		this.transfers.set(id,record);
		this._transSize += 1;
		return "success";
	},
	getTransferList : function(){
		var result = {};
		result["base"] = this.getIndexData(false);
		var list =[];
		for(var i=0;i<this._transSize;i++){
			var key = this.transferKeys.get(i);
			var transfer = this.transfers.get(key);
			list.push(transfer);
		}
		result["list"] = list.reverse();
		return result;
	}
};
module.exports = patentContract;