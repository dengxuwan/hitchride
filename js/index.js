var vue = new Vue({
      el: '#app',
      created: function() {
            this.getWallectInfo();
      },
      mounted: function() {
            this.$message({
                  showClose: true,
                  duration: 5000,
                  message: '温馨提示:使用本站所有功能请安装钱包插件，否则将无法使用发布行程的功能！',
                  type: 'warning'
            });
      },
      updated: function() {},
      data() {
            return {
                  travelInfo: {
                        name: '',
                        phone: '',
                        fromAddress: '',
                        distination: '',
                        type: '',
                        count: '',
                        price: '',
                        remark: '',
                        goTime: ''
                  },
                  attentRule: {
                        name: [{
                              trigger: 'change',
                              required: true,
                              message: '请填写姓名.'
                        }],
                        phone: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写联系方式"
                        }],
                  },
                  rules: {
                        name: [{
                              trigger: 'change',
                              required: true,
                              message: '请填写姓名.'
                        }],
                        phone: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写联系方式"
                        }],
                        fromAddress: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写出发地点！"
                        }],
                        goTime: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写争取的出发时间！"
                        }],
                        distination: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写目的地点！"
                        }],
                        count: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写剩余座位数！"
                        }],
                        price: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写联系方式"
                        }],

                  },
                  allList: [], //所有行程列表
                  myList: [], // 我的行程列表
                  myAttent: [], //我的参与列表
                  labelWidth: '100px', //表单左边label文字宽度
                  curWallet: "", //钱包地址
                  allListLoading: true,
                  personalLoading: true,
                  dialogVisible: false,
                  attentInfo: {
                        name: "",
                        phone: "",
                  },
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
                  tabPosition: 'left'
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
            //发布行程
            toPublish: function() {
                  if (this.curWallet === '') {
                        this.$message({
                              showClose: true,
                              duration: 0,
                              message: '温馨提示:使用本站所有功能请安装钱包插件，否则将无法使用发布行程的功能！',
                              type: 'error'
                        });
                        return;
                  }

                  this.$refs['ruleForm'].validate((valid) => {
                        if (valid) {
                              this.publish();
                        } else {
                              console.log('error submit!!');
                              return false;
                        }
                  });
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
                                    vue.getAll();
                                    vue.personal();
                              }
                        }
                  });
            },
            publish: function() {
                  var args = [JSON.stringify(vue.travelInfo)];
                  defaultOptions.listener = function(data) {
                        vue.$message({
                              message: "发布行程需要15秒时间写入区块链,请稍候刷新当前页面进行查看！",
                              duration: 5000,
                              showClose: true,
                              type: "info"
                        });
                  };

                  var serialNumber = nebPay.call(config.contractAddr, "0", config.addTravel, JSON.stringify(args), defaultOptions);
                  console.log("交易号为" + serialNumber, "发布行程交易hash");
            },
            //处理list
            handleList: function(respArr) {
                  for (var i = 0; i < respArr.length; i++) {
                        var obj = respArr[i];
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
            //获取所有形成列表
            getAll: function() {
                  var address = "";
                  if (!this.curWallet || this.curWallet === '') {
                        address = config.myAddress;
                  } else {
                        address = this.curWallet;
                  }
                  query(address, config.getAll, "", function(resp) {
                        console.log(resp, "查询所有列表");
                        var respArr = JSON.parse(resp.result)
                        vue.allList = vue.handleList(respArr);;
                        console.log(vue.allList, "查询所有列表");
                        vue.allListLoading = false;
                  });
            },
            toAttent: function(row) {
                  if (this.curWallet === '') {
                        this.$message({
                              showClose: true,
                              duration: 0,
                              message: '温馨提示:使用本站所有功能请安装钱包插件，否则将无法使用参与行程的功能！',
                              type: 'error'
                        });
                        return;
                  }
                  this.attentInfo.name = "";
                  this.attentInfo.phone = "";
                  this.clickRow = row;
                  this.dialogVisible = true;
            },
            attent: function() {
                  this.$refs['ruleForm1'].validate((valid) => {
                        if (valid) {
                              if (this.clickRow) {
                                    var name = this.attentInfo.name;
                                    var phone = this.attentInfo.phone;
                                    var price = this.clickRow.price;
                                    var args = [this.clickRow.id, name, phone]
                                    defaultOptions.listener = function(data) {
                                          vue.dialogVisible = false;
                                          vue.$message({
                                                message: "参加行程成功，数据需要15秒时间写入区块链,请稍候刷新页面",
                                                duration: 5000,
                                                showClose: true,
                                                type: "info"
                                          });
                                    };
                                    var serialNumber = nebPay.call(config.contractAddr, price, config.attention, JSON.stringify(args), defaultOptions);
                                    console.log("交易号为" + serialNumber, "参加行程交易hash");
                              }
                        } else {
                              console.log('error submit!!');
                              return false;
                        }
                  });
            },
            toDetail: function(row) {
                  //处理
                  // row.price = row.price + "nas";
                  // row.count = row.count + "个";
                  this.detailRow = row;
                  console.log(this.detailRow, 'dddddddddddddddddddddd');
                  $("#portfolioModal1").modal("show");
            },
            //查询个人中心需要的数据
            personal: function() {
                  if (!this.curWallet || this.curWallet === '') {
                        address = config.myAddress;
                  } else {
                        address = this.curWallet;
                  }
                  query(address, config.personal, "", function(resp) {
                        console.log(resp, "查询个人中心");
                        var obj = JSON.parse(resp.result)
                        vue.myList = vue.handleList(obj.myTravels);
                        console.log(vue.myList, '111111111111');
                        vue.myAttent = obj.attentsRecords;
                        console.log(vue.allList, "查询个人中心");
                        vue.personalLoading = false;
                  });
            }
      }
});