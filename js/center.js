var vue = new Vue({
      el: '#app',
      created: function() {
            this.getWallectInfo();
      },
      mounted: function() {
            // this.$notify({
            //       showClose: true,
            //       duration: 5000,
            //       message: '温馨提示:使用本站所有功能请安装钱包插件，否则将无法使用发布行程的功能！',
            //       type: 'warning',
            //       offset: 100
            // });
      },
      updated: function() {},
      data() {
            return {
                  myList: [], // 我的行程列表
                  myAttent: [], //我的参与列表
                  labelWidth: '100px', //表单左边label文字宽度
                  curWallet: "", //钱包地址
                  allListLoading: true,
                  personalLoading: true,
                  dialogVisible: false,
                  clickRow: {}, //点击的行对象
                  detailRow: {
                        name: '',
                        phone: '',
                        fromAddress: '',
                        distination: '',
                        type: '',
                        count: '',
                        price: '',
                        remark: '',
                        goTime: '',
                        attents: [],
                  },
                  tabPosition: 'top',
                  timer: {},
                  serialNumber: '',
                  // 要展开的行，数值的元素是row的key值
                  expands: [],
                  isShow: false,
                  infoTitle:"",
                  infoType:"success",
                  count:0
            }
      },
      filters: {
            getDateTimeStr: function(v) {
                  var value = Number(v);
                  var y = new Date(value).getFullYear();
                  var m = new Date(value).getMonth() + 1
                  var d = new Date(value).getDate();

                  var h = new Date(value).getHours()
                  var mm = new Date(value).getMinutes()

                  if (m < 10) {
                        m = '0' + m;
                  }
                  if (d < 10) {
                        d = '0' + d;
                  }
                  if (mm < 10) {
                        mm = '0' + mm;
                  }
                  if (h < 10) {
                        h = '0' + h;
                  }
                  var result = y + "-" + m + '-' + d + " " + h + ':' + mm;
                  return result;
            }
      },

      methods: {
            tableRowClassName: function({
                  row,
                  rowIndex
            }) {
                  if (rowIndex % 2 === 0) {
                        return 'success-row';
                  } else if (rowIndex % 2 != 0) {
                        return '';
                  }

            },
            //获取钱包地址
            getWallectInfo: function() {
                  window.postMessage({
                        "target": "contentscript",
                        "data": {},
                        "method": "getAccount",
                  }, "*");
                  window.addEventListener('message', function(e) {
                        if (e.data && e.data.data) {
                              if (e.data.data.account) {
                                    vue.curWallet = e.data.data.account;
                                    vue.personal();
                              }
                        }
                  });
            },
            //处理list
            handleList: function(respArr) {
                  for (var i = 0; i < respArr.length; i++) {
                        var obj = respArr[i];
                        obj['current'] = vue.curWallet;
                        var goTime = obj.goTime;
                        var current = new Date().getTime();
                        if (current > goTime) {
                              obj['status'] = true;
                        } else {
                              obj['status'] = false;
                        }

                        var attents = obj.attents;
                        var isAttent = false;
                        for (var j = 0; j < attents.length; j++) {
                              var attentInfo = attents[j];
                              if (attentInfo.address === vue.curWallet) {
                                    isAttent = true;
                              }
                        }
                        obj['isAttent'] = isAttent;
                  }
                  return respArr;

            },
            toDetail: function(row) {
                  //处理
                  // row.price = row.price + "nas";
                  // row.count = row.count + "个";
                  this.detailRow = row;
                  $("#portfolioModal1").modal("show");
            },
            //查询个人中心需要的数据
            personal: function() {
                  this.isShow = true;
                  var address ="";
                  if (!this.curWallet || this.curWallet === '') {
                        this.infoTitle = "请安装钱包插件!详情请点击使用方法";
                        this.infoType="warning";
                        vue.personalLoading = false;
                        return;
                  } else {
                        address = this.curWallet;
                        this.infoTitle = "钱包地址:" + address;
                        this.infoType="success";
                  }
                  query(address, config.personal, "", function(resp) {
                        console.log(resp, "查询个人中心");
                        var obj = JSON.parse(resp.result)
                        vue.myList = vue.handleList(obj.myTravels);
                        for (var i = 0; i < vue.myList.length; i++) {
                              if (vue.myList[i].attents && vue.myList[i].attents.length > 0)
                                    vue.expands.push(vue.myList[i].id);
                        }
                        vue.myAttent = obj.attentsRecords;
                        vue.personalLoading = false;
                  });

            },
            funcIntervalQuery: function() {
                  var defaultOptions = {
                        callback: "https://pay.nebulas.io/api/mainnet/pay"
                  }
                  nebPay.queryPayInfo(vue.serialNumber, defaultOptions) //search transaction result from server (result upload to server by app)
                        .then(function(resp) {
                              var respObject = JSON.parse(resp)
                              console.log(respObject, "获取交易状态返回对象") //resp is a JSON string
                              if (respObject.code === 0 && respObject.data.status === 1) { //说明成功写入区块链
                                    vue.getAll();
                                    //关闭定时任务
                                    clearInterval(intervalQuery)
                              }
                        })
                        .catch(function(err) {
                              console.log(err);
                        });
            },
            getRowKeys: function(row) {
                  return row.id;
            }
      }
});