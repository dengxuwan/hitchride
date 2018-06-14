var nebulas = require("nebulas"),
  NebPay = require("nebpay"),
  Account = nebulas.Account,
  HttpRequest = nebulas.HttpRequest,
  Neb = nebulas.Neb;
var nasConfig = {
  mainnet: {
      chainID:'1',
      contractAddress: "n1pJVYCVACc2Pzo21db2KGSTbKQgsVmqjd6",
      host: "https://mainnet.nebulas.io",
      payHost: "https://pay.nebulas.io/api/mainnet/pay"
  },
  testnet: {
      chainID:'1001',
      contractAddress: "n1vwaTGHvJ5F1ijZD1YSGYJsqfF99c8uc1e",
      host: "https://testnet.nebulas.io",
      payHost: "https://pay.nebulas.io/api/pay"
  }
}
var neb = new Neb();
var chainInfo=nasConfig.mainnet;
// var chainInfo=nasConfig.testnet;

neb.setRequest(new HttpRequest(chainInfo.host));
var nasApi = neb.api;

var nebPay = new NebPay();

var account;
var isMobile;
var dappAddress=chainInfo.contractAddress;
var nonce = "0";
var gas_price = "1000000";
var gas_limit = "2000000";

var callbackUrl = NebPay.config.mainnetUrl; //在主网查询(默认值)
// var callbackUrl = NebPay.config.testnetUrl; //在测试网查询
var serialNumber;
var intervalQuery;  //定时查询交易结果  
var phoneNo;

$("#firstModelButton").click(function() {
	
	$("#model1_search_loading").show();

	phoneNo = document.getElementById("phone_content").value;
	var address = "";
	var productNumber = "01";

	var to = dappAddress;
	var value = 0.3;
	var callFunction = "buyProduct";
	var callArgs = "[\"" + phoneNo + "\",\"" + address + "\",\"" + productNumber + "\"]";
	serialNumber = nebPay.call(to , value, callFunction, callArgs, {
		callbackUrl : callbackUrl,
		listener : listener,
	});
})

function listener(resp) {
	console.log("listener resp: " + JSON.stringify(resp));
	var result = resp;
	var errorCode = JSON.stringify(resp).search("Error");
	if (errorCode == 1) {
		alert("Error: Transaction rejected by user.");
		$("#model1_search_loading").hide();
	} else {
		onrefreshClick(result["txhash"]);
	}
}

function onrefreshClick(txhash) {
	nasApi.getTransactionReceipt({hash: txhash}).then(function(receipt) {
	    console.log("status = " + receipt.status);
	    if (receipt.status == 1) {
	      console.log("交易成功,处理后续任务...");
	      clearInterval(intervalQuery)  //清除定时查询
	      getPerson();
	      $("#model1_search_loading").hide();
	    } else if (receipt.status == 0) {
	        clearInterval(intervalQuery)  //清除定时查询
	        alert("失败");
	        $("#model1_search_loading").hide();
	    } else {
	      intervalQuery = setTimeout(() => {
	        onrefreshClick(txhash);
	    }, 1000);    //建议查询频率10-15s,因为星云链出块时间为15s,并且查询服务器限制每分钟最多查询10次。
	    }
	});
}

function getPerson() {
	var from = Account.NewAccount().getAddressString();
	var value = "0";
	var callFunction = "getPerson";
	var callArgs = "[\""  + phoneNo + "\"]"
	var contract = {
		"function" : callFunction,
		"args" : callArgs,
	}

	neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
		cbSearch(resp);
	}) .catch(function(err) {
		alert("购买成功,购买单号读取失败,请在'我的'模块中重新读取");
	})
}

//return of search,
function cbSearch(resp) {
  var result = resp.result;
  console.log("return of rpc call: " + JSON.stringify(result));
  var resultStringify = JSON.stringify(result);

  if (resultStringify.search("Error") !== -1) {
    
  	alert("购买成功,购买单号读取失败,请在'我的'模块中重新读取");
  } else if (resultStringify.search("null") !== -1) {
    alert("购买成功,购买单号读取失败,请在'我的'模块中重新读取");
  } else {  //搜索成功
    result = JSON.parse(resultStringify);
    result = JSON.parse(result);
    var product = result["product"]
    var newestProduct = product[product.length -1];
    var buyNumber = newestProduct["buyNumber"];
    var string = "购买成功,购买单号为: " + buyNumber;
    alert(string);
  }
}


function searchCard() {

	$("#mine_search_loading").show();
	$("#mine_p").empty();
	phoneNo = document.getElementById("minePhoneNo").value;
	var from = Account.NewAccount().getAddressString();
	var value = "0";
	var callFunction = "getPerson";
	var callArgs = "[\""  + phoneNo + "\"]"
	var contract = {
		"function" : callFunction,
		"args" : callArgs,
	}

	neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then(function(resp) {
		cbSearchCard(resp);
		$("#mine_search_loading").hide();
	}) .catch(function(err) {
		alert("读取失败");
		$("#mine_search_loading").hide();
	})
}

function cbSearchCard(resp) {
  var result = resp.result;
  // console.log("return of rpc call: " + JSON.stringify(result));
  var resultStringify = JSON.stringify(result);

  if (resultStringify.search("Error") !== -1) {
    
  	alert("读取失败");
  } 
  // else if (resultStringify.search("null") !== -1) {
  //   alert("购买成功,购买单号读取失败,请在'我的'模块中重新读取");
  // } 
  else {  //搜索成功
    result = JSON.parse(resultStringify);
    result = JSON.parse(result);
    var product = result["product"]

    for (var i = 0; i < product.length; i++) {
    	var productObject = product[i];
    	var value = productObject["value"];
    	var productNumber = value["productNumber"];
    	var isOnSaling = value["isOnSaling"];
    	var price = value["price"];
    	var buyNumber = productObject["buyNumber"];
    	var isSendProduct = productObject["isSendProduct"];
    	console.log("productNumber = " + productNumber + " isOnSaling = " + isOnSaling + " price = " + price + " buyNumber = " + buyNumber + " isSendProduct = " + isSendProduct);
    	
    	var p = document.getElementById('mine_p');
    	var pChild1 = document.createElement("strong");
    	pChild1.innerHTML = "购物" + (i+1) + ": ";
    	p.append(pChild1);
    	var br = document.createElement("br");
		p.append(br);
    	var pChild2 = document.createElement("div");
    	pChild2.innerHTML = "产品编号 : " + productNumber;
    	p.append(pChild2);
    	p.append(br);

    	var pChild3 = document.createElement("div");
    	pChild3.innerHTML = "是否在售 : " + (isOnSaling ? "是" : "否");
    	p.append(pChild3);
    	p.append(br);

    	var pChild4 = document.createElement("div");
    	pChild4.innerHTML = "价格 : " + price + "NAS";
    	p.append(pChild4);
    	p.append(br);

    	var pChild5 = document.createElement("div");
    	pChild5.innerHTML = "购买单号 : " + buyNumber;
    	p.append(pChild5);
    	p.append(br);

    	var pChild6 = document.createElement("div");
    	pChild6.innerHTML = "是否已发货 : " + (isSendProduct ? "是" : "否");
    	p.append(pChild6);
    	p.append(br);
    }
  }
}


// var isMobile;
var browser = {
  versions: function() {
      var u = navigator.userAgent,
          app = navigator.appVersion;
      return { //移动终端浏览器版本信息
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
          iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
          weixin: u.indexOf('MicroMessenger') > -1, //是否微信   
          qq: u.match(/\sQQ/i) !== null//u.indexOf("MQQBrowser")>-1  //是否QQ 
      };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

window.addEventListener('load', function () {
  
  isMobile=browser.versions.mobile;
  console.log("isMobile"+isMobile);
  if(typeof(webExtensionWallet) === "undefined"&&!isMobile){

  	$("#firstModel").hide();
  }else{
    console.log("start");
    
	$("#firstModel").show();
  }
});

