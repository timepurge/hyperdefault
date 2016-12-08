var test = require('tape')
var hyperdefault = require('../dist/hyperdefault').expand;

test('hyperdefault is a function', (assert) => {
    assert.plan(1);
    assert.equal('function' , typeof hyperdefault);
})
test('returns undefined when executed with no params',(assert)=>{
    assert.plan(1)
    assert.equal(undefined, hyperdefault())
})

test('returns the target unchanged when rule is undefined',(assert)=>{
    assert.plan(1)
    let target={
        a:10,
        b:{
            c:{
                d:10,
                a:"5"
            }
        },
        c:{
            d:10,
            a:function(){
                return Math.random();
            }
        }
    }
    assert.equal(target, hyperdefault(target))
})

test('will not apply rule object when no obj property exists in rule',(assert)=>{
    assert.plan(1)
    let target={
        a:10
    }
    let rule={
        ref:{
            bmeta:{
                c:10
            }
        },
        obj_:{
            a:11,
            b:"{{@bmeta:object}}"
        }
    }
    assert.equal(target, hyperdefault(target,rule))
})


test('will shallow apply non existant non iterable properties in target from rule object',(assert)=>{
    assert.plan(2)
    let _c=10;
    let target={
        a:_c
    }
    let rule={
        obj:{
            a:11,
            b:_c
        }
    }
    hyperdefault(target,rule)
    assert.equal(target.a,_c )
    assert.equal(target.b,_c )
})

test("will not shallow copy iterable properties from rule object",(assert)=>{
    assert.plan(1)
    let b_def={
        d:{
            c:100
        }
    }
    let target={
        a:10
    }
    let rule={
        obj:{
            b:b_def
        }
    }

    hyperdefault(target,rule);
    assert.notEqual(target.b.d,b_def.d )
})


test("will shallow copy iterable properties from rule object in rule arrays",(assert)=>{
    assert.plan(1)
    let b_def={
        d:{
            c:100,
            getval:function(){
                return "takeval"
            }
        }
    }
    let target={
        a:10
    }
    let rule={
        obj:{
            b:[b_def,b_def]
        }
    }
    hyperdefault(target,rule);
    assert.equal(target.b[0].d,b_def.d )
})

test('will apply rule props to target when (obj property exists in rule) AND (no ref in rule) AND (no overriders)',(assert)=>{
    assert.plan(2)
    let _c=10;
    let target={
        a:_c
    }
    let rule={
        obj:{
            a:11,
            b:{
                c:_c
            }
        }
    }
    hyperdefault(target,rule)
    assert.equal(target.a,_c )
    assert.equal(target.b.c,_c )
})

test('hyperdefault linked object', (t) => {
    let aval=10;
    let cvl=100;
    let foometaval=950;
    let ecval=1000;
    let dget="foobar"
    
    let rule={
        ref:{
            foometa:{
                f:foometaval
            },
            dmeta:{
                c:cvl,
                getval:function(){
                    return dget;
                },
                foo:"${foometa:object}"
            },
            nmeta:{
                x:100,
                y:"${dmeta:object}"
            }
        },
        obj:{
            a:900,
            d:"${dmeta:object}",
            e:"${dmeta:object}",
            m:"${dmeta:object}",
            n:"${nmeta:array}",
            p:"${nmeta:array}"
        }
    }
    
    let target={
        a:aval,
        e:{
            c:ecval
        },
        m:{
            c:700,
            foo:{
                f:500
            }
        },
        p:[
            {x:200},
            {k:900},
            {
                x:300,
                y:{
                    foo:{
                        f:"deep"
                    }
                }
             }
        ]
    }
    hyperdefault(target,rule);
    t.test("will not overwrite existing props in target",(assert)=>{
        assert.plan(3)
        assert.equal(target.a,aval)
        assert.equal(target.m.c,700)
        assert.equal(target.m.foo.f,500)
    })
    t.test("will follow deep linked rules and apply the values for non existent props in target",(assert)=>{
        assert.plan(5)
        assert.equal(target.d.c,cvl)
        assert.equal(target.d.getval(),dget)
        assert.equal(target.d.c,cvl)
        assert.equal(target.d.foo.f,foometaval)
        assert.equal(target.m.getval(),dget)
    })
    t.test("will add non existent array propery as an empty array",(assert)=>{
        assert.plan(1)
        assert.equal(target.n.length,0)
    })
    t.test("will not update existing value in array item with linked object rule",(assert)=>{
        assert.plan(2)
        assert.equal(target.p[0].x,200);
        assert.equal(target.p[1].x,100);
    })
    t.test("will add non existing props in array items with linked object rule",(assert)=>{
        assert.plan(6)
        assert.equal(target.p[0].y.c,cvl);
        assert.equal(target.p[0].y.getval(),dget);
        assert.equal(target.p[0].y.foo.f,foometaval);

        assert.equal(target.p[2].y.c,cvl);
        assert.equal(target.p[2].y.getval(),dget);
        assert.equal(target.p[2].y.foo.f,"deep");
    })
})