(function() {
	var VueI18n = {
		install: function(Vue, options) {
			Vue.prototype.$language = window.localStorage.language = options.default;
            //window.localStorage.i18nDatas = options.data;
			Vue.directive('i18n', function(args) {
				if (args.value != undefined && options.data[options.default] != undefined) {
					/*if (args.language == undefined) {
						args.language = options.default
					}
					window.localStorage.language = args.language*/
					var val = eval('options.data.' + options.default + '.' + args.value);
					if (args.replace != undefined && args.replace.length > 0) {
						args.replace.forEach(function(v, k) {
							val = val.replace(new RegExp("\\{" + k + "\\}", "g"), v)
						})
					}
					if (val != undefined) {
						if (this.modifiers.placeholder) {
							this.el.setAttribute('placeholder', val)
						}else if(this.modifiers.value){
                            this.el.setAttribute('value', val)
						} else {
							this.el.innerHTML = val
						}
					} else {
						this.el.innerHTML = ""
					}
				} else {
					this.el.innerHTML = ""
				}
			});
			Vue.prototype.$translate = function(namespace){
                try {
                    var value = eval('options.data.' + options.default + '.' + namespace);
                    if (value != undefined) {
                    	return value;
                    }else{
                    	return "";
					}
                } catch(e) {
                    console.warn('No translation found for namespace', namespace, options.default, e);
                }
			}
		}
	};
	if (typeof exports == "object") {
		module.exports = VueI18n;
	} else if (typeof define == "function" && define.amd) {
		define([], function() {
			return VueI18n;
		});
	} else if (window.Vue) {
		window.VueI18n = VueI18n;
		Vue.use(VueI18n);
	}
})();