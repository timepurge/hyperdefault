var test = require('tape')
var hyperdefault = require('../dist/hyperdefault').expand;


test('hyperdefault unexpected parse result handling', (t) => {
    
    let rule={
        ref:{
            dmeta:{
                c:123
            },
            nmeta:{
                x:100,
                z:99,
                y:"${{dmeta:object}",
                m:"${dmeta:object:foo}",
                n:"${dmeta:objecttt}"
            }
        },
        obj:{
            a:900,
            d:"${nmeta:object}",
        }
    }
    
    let target={
        d:{
            x:70
        }
    }
    hyperdefault(target,rule);
    t.test("will ignore mistyped link notation",(assert)=>{
        assert.plan(4);
        assert.equal(target.d.x,70)
        assert.equal(target.d.z,99)
        assert.equal(target.d.y,"${{dmeta:object}")
        assert.equal(target.d.m,"${dmeta:object:foo}")
    })
    t.test("will return undefined if type is unknown",(assert)=>{
        assert.plan(1);
        assert.equal(target.d.n,undefined)
    })
})

test('hyperdefault unexpected parse result handling', (t) => {
    let _t="thing!";
    let rule={
        ref:{
            nmeta:{
                x:100,
                z:99
            }
        },
        obj:{
            a:900,
            d:"${nmeta:object}",
        }
    }
    
    let target=_t
    hyperdefault(target,rule);
    t.test("will return target as is , if its not an object",(assert)=>{
        assert.plan(1);
        assert.equal(target,_t)
    })
})