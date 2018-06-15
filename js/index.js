var vue = new Vue({
      el: '#app',
      created: function() {
            this.getWallectInfo();
      },
      mounted: function() {

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
                  allList: [],
                  labelWidth: '100px', //表单左边label文字宽度
                  curWallet: "", //钱包地址
                  allListLoading: true,
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
            }
      },
      filters: {
            getDateTimeStr: function(value) {
                  var y = new Date(value).getFullYear();
                  var m = new Date(value).getMonth() + 1
                  var d = new Date(value).getDate();

                  var h = new Date(value).getHours()
                  var mm = new Date(value).getMinutes()
                  return y + "-" + m + '-' + d + " " + h + ':' + mm
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
                              }
                        }
                  });
            },
            publish: function() {
                  var args = [JSON.stringify(vue.travelInfo)];
                  defaultOptions.listener = function(data) {
                        vue.$message({
                              message: "发布行程需要15秒时间写入区块链,请耐心等待",
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
                  row.price = row.price + "nas";
                  row.count = row.count + "个";
                  this.detailRow = row;
                  console.log(this.detailRow, 'dddddddddddddddddddddd');
                  $("#portfolioModal1").modal("show");
            }
      }
});