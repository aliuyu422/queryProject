var rooturl = 'http://10.21.16.51:9002'; //'http://113.59.101.122:9002';// 113.59.101.122:9002 211.139.11.136:18243 211.139.58.223:8001 211.139.11.136:18041
// var rooturl = 'http://127.0.0.1:8001';
var req;//测试：http://10.21.16.51:9002，正式：http://113.59.110.83:9002
if(!req)req={};
req.timeout = 300000;
req.listArr = [];
req.reportDefine = {};
req.url = {
    /**资源查询的*/
   //查询条件初始化
    queryInitCondition:rooturl+'/hnappservice/api/resQuery/init_condition',
    //查询资源列表
    queryPage_ByName:rooturl+'/hnappservice/api/resQuery/queryResByName',
    //查询资源详情
    queryAttrObject_ByID:rooturl+'/hnappservice/api/resQuery/res_QueryAttrObject_ByID',
     //查询资源类型
    neTypeList:rooturl+'/hnappservice/api/resQuery/res_QueryNeType',
    trans_QueryInfo_ByNAME: rooturl+'/hnappservice/api/resQuery/trans_QueryInfo_ByNAME',
    /**资源概览的*/
    //资源 列表
    classifyList:rooturl+'/hnappservice/api/resQuery/res_QueryNeType',
    //统计信息
    report:rooturl+'/appservice/rest/app/resourceModel/report',
    login:rooturl+'/hnappservice/api/login/loginByNameAndPwd',
    loginByName: rooturl+'/hnappservice/api/login/loginByName',
    genReportsByPid: rooturl + "/hnappservice/api/report/genReportsByPid?param=",
    genReport: rooturl + "/hnappservice/api/report/genReport?param=",
    getCityList: rooturl + "/hnappservice/api/util/getCityList?param=1",
    getReasonType : rooturl + "/hnappservice/api/report/getReasonType?param=",//断站原因类别
    getProfessional : rooturl + "/hnappservice/api/report/getProfessional?param={}",//断站专业类别
    getReasonDetail : rooturl + "/hnappservice/api/report/getReasonDetail?param=",//断站信息
    getAlarmRecord : rooturl + "/hnappservice/api/report/updateAlarmRecord?param=",//添加
    getDxqReasonDetail : rooturl + "/hnappservice/api/report/getDxqReasonDetail?param=",//掉小区原因信息
    updateDxqRecord : rooturl + "/hnappservice/api/report/updateDxqRecord?param=",//掉小区原因添加
    iprnanOperate: "http://113.59.110.170:8100/IpranManage_kfzc/interface.html",//iprnan排障跳转地址
    iprnanLineDiagnose: "http://10.21.16.56:8100/IpranManage_kfzc/line_diagnosis.html", // iprnan排障跳转到线路诊断地址
    ipRanPortInfo: rooturl + "/hnappservice/api/report/ipRanPortInfo",
    recordGoToIpRan: rooturl + "/hnappservice/api/report/addOperatioonRecord"
}

req.locfield ={
    useraccount:'useraccount',
    userCity:'user_city_name',
    /**资源id */
    resItemId:'res_itemid',
    resItemName: 'res_item_name',
    /**专业数据 */
    professObj:'professObj',
    /**资源类型数据 */
    nettypeObj:'nettypeObj',
    /**地市数据 */
    cityObj:'cityObj',
    /**资源类型 */
    resclassname:'resclassname',
    /**资源数据 */
    resItemInfo:'res_item_info',
    resItemTransInfo:'res_item_trans_info',
    /**资源二维码*/
    resCode:'res_code',
    
    classifyId:'classifyId',
    resViewHeaderHeight:'resViewHeaderHeight',
    resData:'resData',
    classifyName:'classifyName'
};
//拦截ajax请求，并设置header
req.ajax_hook = function(reportId, reportName){
    hookAjax({
        send:function(args,xhr){
            xhr.setRequestHeader("reportId", reportId);
            xhr.setRequestHeader("reportName", encodeURIComponent(reportName));
            xhr.setRequestHeader("country", "");
            xhr.setRequestHeader("dept", encodeURIComponent(appcan.locStorage.getVal(req.locfield.userCity)));
            xhr.setRequestHeader("ownerId", "");
            xhr.setRequestHeader("owerName", appcan.locStorage.getVal(req.locfield.useraccount));
            xhr.setRequestHeader("appid", appcan.locStorage.getVal("appid"));
        }
    });
}
req.req_func = (function(){
    /**登陆*/
    function login(useraccount,password,successcall,errorcall){
        // appcan.window.openToast("请稍后...",null,'middle',1);
        var param = "{'useraccount':'" + useraccount + "','password':'" + password + "'}";
        $.ajax({
            url : req.url.login,
            type : 'GET',
            dataType: 'json',
            timeout:req.timeout,
            data : {param: param},
            success : function(data) {
                // appcan.window.closeToast();
                if(successcall)successcall(data);
            },
            error : function(e) {
                // appcan.window.closeToast();
                console.log(e);
                if(errorcall)errorcall(e);
            }
        });
    }
    
    function loginByName(useraccount,password,successcall,errorcall){
        //appcan.window.openToast("请稍后...",null,'middle',1);
        var param = "{'useraccount':'" + useraccount + "','password':'" + password + "'}";
        $.ajax({
            url : req.url.loginByName,
            type : 'GET',
            dataType: 'json',
            timeout:req.timeout,
            data : {param: param},
            success : function(data) {
                //appcan.window.closeToast();
                if(successcall) successcall(data);
            },
            error : function(e) {
                appcan.window.closeToast();
                if(errorcall)errorcall(e);
            }
        });
    }
    
    /**资源专业列表**/
    function req_classifyList(successcall,errorcall){
        appcan.window.openToast("请稍后...",null,'middle',1);
        $.ajax({
            url : req.url.classifyList,
            type : 'POST',
            timeout:req.timeout,
            dataType: 'json',
            data : {},
            offline : false,//是否缓存
            success : function(data) {
                appcan.window.closeToast();
                var res = data;
                if(successcall)successcall(res);
            },
            error : function(e) {
                appcan.window.closeToast();
                if(errorcall)errorcall();
            }
        });
    }
    /**查询各专业下数据统计报表*/
    function req_report(param,successcall,errorcall){
        appcan.window.openToast("请稍后...",null,'middle',1);
        $.ajax({
            url : req.url.report,
            type : 'POST',
            dataType: 'json',
            timeout:req.timeout,
            data : {
                param: JSON.stringify(param) //param={'classifyId':''}
            },
            offline : false,//是否缓存
            success : function(data) {
                appcan.window.closeToast();
                var res={};
                if(data)res = data;
                if(successcall)successcall(res);
            },
            error : function(e) {
                appcan.window.closeToast();
                if(errorcall)errorcall();
            }
        });
    }
    return {
        req_classifyList: req_classifyList,
        req_report: req_report,
        login: login,
        loginByName: loginByName
    }
})();
/**资源查询部分方法*/
var current;
if(!current)current={};
current.resListInfo= (function(){
   function setReqParam(data){
       appcan.locStorage.setVal('resListInfo_reqparam',data);
   }
   function getReqParam(){
       return JSON.parse(appcan.locStorage.getVal('resListInfo_reqparam'));
   }
   function setData(data){
       appcan.locStorage.setVal('resListInfo_data',data);
   }
   function getData(){
       return JSON.parse(appcan.locStorage.getVal('resListInfo_data'));
   }
   function clean(){
       appcan.locStorage.setVal('resListInfo_reqparam',{});
       appcan.locStorage.setVal('resListInfo_data',[]);
   }
   function load(islast,successfunc,errfunc){
    //    appcan.window.openToast("请稍后...",null,'middle',1);
       var param = getReqParam();
       // if(param)param = JSON.parse(param);
       if(islast){
           //param.pageStart = parseInt(param.pageStart)+1;
           param.pageStart = parseInt(param.pageStart) + parseInt(param.pageSize);
       }
       $.ajax({
            url : req.url.queryPage_ByName,
            type : 'POST',
            timeout:req.timeout,
            cache:false,
            offline:false,
            dataType: 'json',
            data : {
                param:JSON.stringify(param)
            },
            success : function(data) {
                // appcan.window.closeToast();
                var res = data;
                var currentdata = getData();
                if(!islast || !currentdata){
                    //appcan.locStorage.setVal('resListInfo_data',);
                    setData(res.dataList);
                }/*else{//追加结果集本地存储
                    currentdata = JSON.parse(currentdata);
                    for(var i=0,j=res.resultList.length; i<j; i++){
                      currentdata.push(res.resultList[i])
                    };
                    setData(currentdata);
                }*/
                setReqParam(param);
                if(successfunc)successfunc(res.dataList);
            },
            error : function(e) {
                // appcan.window.closeToast();
                if(errfunc)errfunc();
            }
       });
   }
   //初始化专业 设备类型 地市选择 列表信息
   function initCondition(param,successfunc,errorfunc) {
        appcan.window.openToast("请稍后...",null,'middle',1);
        $.ajax({
            url : req.url.queryInitCondition,
            type : 'POST',
            timeout:req.timeout,
            dataType: 'json',
            data : {
                param:JSON.stringify(param)//{'useraccount':usercount}     
            },
            offline : false,//是否缓存
            success : function(data) {
                appcan.window.closeToast();
                var res = data;
                if(successfunc)successfunc(res);
            },
            error : function(e) {
                appcan.window.closeToast();
                if(errorfunc)errorfunc();
            }
        });
   }
   function queryAttrObjectById(param,successfunc,errorfunc) {
        appcan.window.openToast("请稍后...",null,'middle',1);
        $.ajax({
            url : req.url.queryAttrObject_ByID,
            type : 'POST',
            timeout:req.timeout,
            cache:false,
            offline:false,
            dataType: 'json',
            data : {
                param:JSON.stringify(param)
            },
            success : function(data) {
                appcan.window.closeToast();
                //var res = JSON.parse(data);
                appcan.locStorage.setVal(req.locfield.resItemInfo,data);
                if(successfunc)successfunc(data);
            },
            error : function(e) {
                appcan.window.closeToast();
                if(errorfunc)errorfunc();
            }
       });
   }
   
   function transQueryInfoByName(param,successfunc,errorfunc) {
        appcan.window.openToast("请稍后...",null,'middle',1);
        $.ajax({
            url : req.url.trans_QueryInfo_ByNAME,
            type : 'POST',
            timeout:req.timeout,
            cache:false,
            offline:false,
            dataType: 'json',
            data : {
                param:JSON.stringify(param)
            },
            success : function(data) {
                appcan.window.closeToast();
                //var res = JSON.parse(data);
                appcan.locStorage.setVal(req.locfield.resItemTransInfo,data);
                if(successfunc)successfunc(data);
            },
            error : function(e) {
                appcan.window.closeToast();
                if(errorfunc)errorfunc();
            }
       });
   }
   
   return {
       setReqParam:setReqParam,
       setData:setData,
       getReqParam:getReqParam,
       getData:getData,
       clean:clean,
       load:load,
       initCondition:initCondition,
       queryAttrObjectById:queryAttrObjectById,
       transQueryInfoByName: transQueryInfoByName
   }; 
})();
current.resListInfo.reqparam = (function() {
    function set(ResClassName,zh_label,pageStart,pageSize,city_id){
        if(pageStart)pageStart=0;
        if(pageSize)pageSize=10;
        return {'netypename':ResClassName,'keyValue':zh_label,'pageStart':pageStart,'pageSize':pageSize,'county':city_id};
    }
    return {set:set};
})();

