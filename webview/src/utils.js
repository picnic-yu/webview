var paths = [{
  name: 'default', parent: ''
},
  {
    name: 'items', parent: 'default'
  },
  {
    name: 'search', parent: 'default'
  },
  {
    name: 'shops', parent: 'default'
  },
  {
    name: 'itemshops', parent: 'items'
  },
  {
    name: 'shopitems', parent: 'shops'
  },
  {
    name: 'shopitemdetails', parent: 'shopitems'
  },
  {
    name: 'itemshopdetails', parent: 'itemshops'
  },
  {
    name: 'capacityusers', parent: 'default'
  },
  {
    name: 'capacityproblems', parent: 'capacityusers'
  },
  {
    name: 'capacitytasks', parent: 'capacityusers'
  },
  {
    name: 'capacityitems', parent: 'capacityusers'
  },
  {
    name: 'capacityshops',parent:'capacityusers'
  }
];
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


