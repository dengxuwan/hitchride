var vue = new Vue({
      el: '#app',
      created: function() {
            if (!window.webExtensionWallet) {
                  this.$notify({
                        showClose: true,
                        duration: 5000,
                        message: '温馨提示:使用本站所有功能请安装钱包插件，否则将无法正常使用本站功能！',
                        type: 'warning',
                        offset: 100
                  });
            }
            this.getWallectInfo();
            this.getAll();
      },
      mounted: function() {

      },
      updated: function() {},
      data() {
            return {
                  tempVar: true,
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
                        type: [{
                              trigger: 'change',
                              required: true,
                              message: "请填写成辆型号"
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
                              message: "请填写拼车费用（nas）"
                        }],

                  },
                  allList: [], //所有行程列表
                  cloneList: [],
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
                  tabPosition: 'left',
                  timer: {},
                  serialNumber: '',
                  // 要展开的行，数值的元素是row的key值
                  expands: [],
                  search: {
                        from: '',
                        to: '',
                        status: '',
                  }
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
            //发布行程
            toPublish: function() {
                  // if (this.curWallet === '') {
                  //       this.$notify({
                  //             showClose: true,
                  //             duration: 0,
                  //             message: '温馨提示:使用本站所有功能请安装钱包插件，否则将无法使用发布行程的功能！',
                  //             type: 'error',
                  //             offset: 150
                  //       });
                  //       return;
                  // }

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
                                    // vue.getAll();
                              }
                        }
                  });
            },
            publish: function() {
                  var args = [JSON.stringify(vue.travelInfo)];
                  defaultOptions.listener = function(data) {
                        if (data.txhash) {
                              vue.$notify({
                                    message: "发布行程需要15秒时间写入区块链,写入成功之后会自动提醒您,请耐心等待！",
                                    duration: 20000,
                                    showClose: true,
                                    type: "warning",
                                    offset: 200
                              });
                              //清空
                              vue.travelInfo = {
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

                                    console.log("交易号为" + vue.serialNumber, "发布行程交易hash");
                              var neburl = "https://mainnet.nebulas.io";
                              var txhash = data.txhash;
                              intervalQuery = setInterval(() => {
                                    console.log('wait......');
                                    axios.post(neburl + "/v1/user/getTransactionReceipt", {
                                                hash: txhash
                                          })
                                          .then(d => {
                                                if (d.data && d.data.result.execute_result !== "") {
                                                      vue.$confirm('行程已经成功写入区块链, 点击查看?', '成功', {
                                                            confirmButtonText: '查看',
                                                            cancelButtonText: '取消',
                                                            type: 'success'
                                                      }).then(() => {
                                                            window.location.href = "index.html#allListTable";
                                                            vue.getAll();
                                                      }).catch(() => {

                                                      });
                                                      // success
                                                      clearInterval(intervalQuery);
                                                } else if (d.data.result.status === 0) {
                                                       vue.$notify({
                                                            message: "分享失败，有可能是您的余额不足!",
                                                            duration: 0,
                                                            showClose: true,
                                                            type: "error",
                                                            offset: 150
                                                      });
                                                      clearInterval(intervalQuery);
                                                }
                                          });
                              }, 6000);
                        } else {
                              vue.$notify({
                                    message: "已经取消发布行程！",
                                    duration: 5000,
                                    showClose: true,
                                    type: "warning",
                                    offset: 200
                              });
                        }
                  };

                  vue.serialNumber = nebPay.call(config.contractAddr, "0", config.addTravel, JSON.stringify(args), defaultOptions);

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
                              obj['statusStr'] = '已过期';
                        } else {
                              obj['status'] = false;
                              obj['statusStr'] = '进行中';
                        }


                        var attents = obj.attents;
                        var isAttent = false;
                        for (var j = 0; j < attents.length; j++) {
                              var attentInfo = attents[j];
                              if (attentInfo.address === vue.curWallet) {
                                    isAttent = true;
                              }
                        }
                        if (isAttent) {
                              obj['statusStr'] = '已参加';
                        }
                        obj['isAttent'] = isAttent;
                  }
                  return respArr;

            },
            //获取所有行程列表
            getAll: function() {
                  this.allListLoading = true;
                  var address = "";
                  if (!this.curWallet || this.curWallet === '') {
                        address = config.myAddress;
                  } else {
                        address = this.curWallet;
                  }
                  query(address, config.getAll, "", function(resp) {
                        console.log(resp, "查询所有列表");
                        var respArr = JSON.parse(resp.result)
                        vue.allList = vue.handleList(respArr);
                        vue.cloneList = vue.allList;
                        console.log(vue.allList, "查询所有列表");
                        vue.allListLoading = false;
                        vue.tempVar = false;
                  });
            },
            toAttent: function(row) {
                  if (row.attents.length >= row.count) {
                        this.$message({
                              showClose: true,
                              duration: 5000,
                              message: '此行程参与人数已满！',
                              type: 'warning'
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

                                          if (data.txhash) {
                                                vue.dialogVisible = false;
                                                vue.$notify({
                                                      message: "数据需要15秒时间写入区块链,是否成功请耐心等待系统自动通知！",
                                                      duration: 20000,
                                                      showClose: true,
                                                      type: "warning",
                                                      offset: 150
                                                });
                                                var neburl = "https://mainnet.nebulas.io";
                                                var txhash = data.txhash;
                                                intervalQuery = setInterval(() => {
                                                      console.log('wait......');
                                                      axios.post(neburl + "/v1/user/getTransactionReceipt", {
                                                                  hash: txhash
                                                            })
                                                            .then(d => {
                                                                  if (d.data && d.data.result.execute_result !== "") {
                                                                        vue.$confirm('数据已经成功写入区块链点击查看', '成功', {
                                                                              confirmButtonText: '查看',
                                                                              cancelButtonText: '取消',
                                                                              type: 'success'
                                                                        }).then(() => {
                                                                              window.location.href = "center.html#personal";
                                                                        }).catch(() => {

                                                                        });
                                                                        // success
                                                                        clearInterval(intervalQuery);
                                                                  } else if (d.data.result.status === 0) {
                                                                        vue.$notify({
                                                                              message: "参与失败，有可能是您的余额不足!",
                                                                              duration: 0,
                                                                              showClose: true,
                                                                              type: "error",
                                                                              offset: 150
                                                                        });
                                                                        clearInterval(intervalQuery);
                                                                  }
                                                            });
                                                }, 6000);
                                          } else {
                                                vue.$notify({
                                                      message: "交易已经取消！",
                                                      duration: 5000,
                                                      showClose: true,
                                                      type: "info",
                                                      offset: 150
                                                });
                                          }

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
                  $("#portfolioModal1").modal("show");
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
            },
            toSearch: function() {
                  vue.allListLoading = true;
                  var list = [];
                  for (var i = 0; i < this.cloneList.length; i++) {
                        var obj = vue.cloneList[i];
                        var from = obj.fromAddress;
                        var to = obj.distination;
                        var status = obj.statusStr;
                        var isFrom = false;
                        var isTo = false;
                        var isStatus = false;
                        if (this.search.from !== '' && this.search.to === '') {
                              if (from.indexOf(this.search.from) !== -1 && status.indexOf(this.search.status) !== -1) {
                                    list.push(obj);
                              }
                        } else if (this.search.from === '' && this.search.to !== '') {
                              if (to.indexOf(this.search.to) !== -1 && status.indexOf(this.search.status) !== -1) {
                                    list.push(obj);
                              }
                        } else if (this.search.from === '' && this.search.to === '') {
                              if (status.indexOf(this.search.status) !== -1) {
                                    list.push(obj);
                              }
                        } else if (this.search.from !== '' && this.search.to !== '') {
                              if (from.indexOf(this.search.from) !== -1 && to.indexOf(this.search.to) !== -1 && status.indexOf(this.search.status) !== -1) {
                                    list.push(obj);
                              }
                        } else if (this.search.from === '' && this.search.to !== '') {
                              if (to.indexOf(this.search.to) !== -1 && status.indexOf(this.search.status) !== -1) {
                                    list.push(obj);
                              }
                        }
                  }
                  vue.allList = list;
                  vue.allListLoading = false;
            }
      }
});