/**
 * Created by jxm on 16-6-6.
 * 存放全局变量
 */
module.exports = {
    search: {
        startTime: '',
        endTime: '',
        dateTime: ''
    },
    needRefresh: true,//是否需要刷新列表
    createrId: '',
    bo: '',//交接本对象
    hasSigleDep: false,//是否是单个门店权限
    hasGetAuth: false,//是否已经获取过是否有单个门店权限
    selectedUsers: [],//已选择提醒用户
    atMe: 0,//查询条件
    isMe: 0,//查询条件
    needReadMessage: false,//表示是否需要告诉服务器，我已经看过@过我的记录了
    token: '',
    curRoute: {
        path: '',
        pathName: '',
        params: {},
        backpath: ''
    },
    userInfo: {
        id: '',
        name: ''
    },
    shopInfo: {
        id: '',
        name: ''
    },
    create: {
        isOpen: 0//创建界面是不是公开的门店
    },
    layout: {
        scrollTop: 0
    },
    source: ''//空为webviewurl来自于未选择门店时候的跳转，1来自于门店界面的跳转
};