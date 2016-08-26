var paths = [{
    name: 'default', parent: ''
},
    {
        name: 'shoplist', parent: 'default'
    },
    {
        name: 'userlist', parent: 'default'
    },
    {
        name: 'search', parent: 'default'
    },
    {
        name: 'create', parent: 'default'
    },
    {
        name: 'detail', parent: 'default'
    },
    {
        name: 'mutipleuserlist', parent: 'create'
    },
    {
        name: 'templates', parent: 'create'
    },
    {
        name: 'searchdate', parent: 'default'
    }];
module.exports.getBackPath = function (name) {
    var res = {};
    for (var i = 0; i < paths.length; i++) {
        if (name == paths[i].name) {
            res.parent = paths[i].parent;
            break;
        }
    }
    for (var i = 0; i < paths.length; i++) {
        if (res.parent == paths[i].name) {
            res.params = paths[i].params;
            break;
        }
    }
    return res;
};

module.exports.setBackPath = function (name, params) {
    for (var i = 0; i < paths.length; i++) {
        if (name == paths[i].name) {
            paths[i].params = params;
            break;
        }
    }
};



