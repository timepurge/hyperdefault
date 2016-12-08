const CONFIG={
    TYPES:{
        o:"object",
        a:"array"
    }
}

const ruleparse=(rulekey,ruleobj)=>{
    let ruleval=ruleobj[rulekey];
    if(typeof ruleval ==="string" ){
        if(ruleval.match(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g)){
            let  link=ruleval.match(/[\w\.:]+/)[0].split(":")
            if(link.length==2){
                return {
                    linked_key:link[0],
                    linked_type:link[1],
                    isrule:true
                }
            }
        }
    }
    return {
        value: ruleval,
        isrule:false
    }
}


const ruleextend=(target,linkdef,rule,key)=>{
    if(linkdef.linked_type===CONFIG.TYPES.o){
        if(!(key in target)){
            target[key]={};
        }
        extend(target[key],rule.ref[linkdef.linked_key],rule);
    }else if(linkdef.linked_type===CONFIG.TYPES.a){
        if(!(key in target)){
            target[key]=[];
        }else{
            for(let i=0; i<target[key].length; i++ ){
                extend(target[key][i],rule.ref[linkdef.linked_key],rule);
            }
        }
    }
}

const extend=(target,ruleobj,rule)=>{
    //do ruleobj iteration only if the target is an object, else return the target as is.
    if(typeof target === CONFIG.TYPES.o ){
        for(let key in ruleobj){
            let _propdef=ruleparse(key,ruleobj);
            if(_propdef.isrule){
                ruleextend(target,_propdef,rule,key)
            }else{
                if(!(key in target)){
                    let _ruleval=_propdef.value;
                    if(typeof _ruleval === CONFIG.TYPES.o ){
                        if(Array.isArray(_ruleval)){
                            target[key]=_ruleval ;// This is a shallow reference, and could lead to bugs.
                        }else{
                            //not Array , jumps into Object conclusion now .. TODO: Map,  @@iterable?
                            target[key]={};
                            extend(target[key],_ruleval)
                        }
                    }else{
                        target[key]=_ruleval
                    }
                }
            }
            
        }
    }
    
    return target
}

const handleRuleExtend=(target,rule)=>{
    if(!("obj" in rule)){
        // not a valid default rule object. ignore
        return;
    }
    extend(target,rule.obj,rule)
}

const expand=(target,rule)=>{
    // ignore if target doesnt exist
    if(target==undefined){
        return;
    }

    if(rule!==undefined){
        handleRuleExtend(target,rule)
    }
    return target;
}

export {expand}