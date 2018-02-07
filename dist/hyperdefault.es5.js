"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var CONFIG = {
    TYPES: {
        o: "object",
        a: "array"
    }
};

var ruleparse = function ruleparse(rulekey, ruleobj) {
    var ruleval = ruleobj[rulekey];
    if (typeof ruleval === "string") {
        if (ruleval.match(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g)) {
            var link = ruleval.match(/[\w\.:]+/)[0].split(":");
            if (link.length == 2) {
                return {
                    linked_key: link[0],
                    linked_type: link[1],
                    isrule: true
                };
            }
        }
    }
    return {
        value: ruleval,
        isrule: false
    };
};

var ruleextend = function ruleextend(target, linkdef, rule, key) {
    if (linkdef.linked_type === CONFIG.TYPES.o) {
        if (!(key in target)) {
            target[key] = {};
        }
        extend(target[key], rule.ref[linkdef.linked_key], rule);
    } else if (linkdef.linked_type === CONFIG.TYPES.a) {
        if (!(key in target)) {
            target[key] = [];
        } else {
            for (var i = 0; i < target[key].length; i++) {
                extend(target[key][i], rule.ref[linkdef.linked_key], rule);
            }
        }
    }
};

var extend = function extend(target, ruleobj, rule) {
    if ((typeof target === "undefined" ? "undefined" : _typeof(target)) === CONFIG.TYPES.o) {
        for (var key in ruleobj) {
            var _propdef = ruleparse(key, ruleobj);
            if (_propdef.isrule) {
                ruleextend(target, _propdef, rule, key);
            } else {
                if (!(key in target)) {
                    var _ruleval = _propdef.value;
                    if ((typeof _ruleval === "undefined" ? "undefined" : _typeof(_ruleval)) === CONFIG.TYPES.o) {
                        if (Array.isArray(_ruleval)) {
                            target[key] = _ruleval;
                        } else {
                            target[key] = {};
                            extend(target[key], _ruleval);
                        }
                    } else {
                        target[key] = _ruleval;
                    }
                }
            }
        }
    }
    return target;
};

var handleRuleExtend = function handleRuleExtend(target, rule) {
    if (!("obj" in rule)) {
        return;
    }
    extend(target, rule.obj, rule);
};

var expand = function expand(target, rule) {
    if (target == undefined) {
        return;
    }
    if (rule !== undefined) {
        handleRuleExtend(target, rule);
    }
    return target;
};

module.exports.expand = expand;
