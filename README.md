# Hyperdefault [![Build Status](https://travis-ci.org/timepurge/hyperdefault.svg?branch=master)](https://travis-ci.org/timepurge/hyperdefault)

It's often nice to have guaranteed object properties when working with Javascript. This guarantee avoids the need for a lot of `in` and `hasOwnProperty` checks.

Hyperdefault normalizes your lean Json payload/ JS Objects with defaults from a schema rule. The schema rule itself is a json, thus allowing you to maintain your schema rule externally.

Hyperdefault is a good companion when working with configuration driven UI or when you just dont want hardcoded defaults in code.

# Installation
```sh
npm install hyperdefault --save
```

# Jump straight into action
https://runkit.com/timepurge/5a70c08a8cbe6f0012dbc402

# Use case
Consider this hypothetical configuration json for a data-grid:
```sh
let grid_config_xl = { 
    "grid_title": "Records", 
    "columns": [
        { 
            "title": "Company", "key": "company", "cell-format": { 
                "type": "string", 
                "tooltip": true
            } 
        },
        { 
            "title": "Revenue", "key": "revenue", "cell-format": { 
                "type": "currency", 
                "tooltip": true 
            }
        }, 
        { 
            "title": "Address", "key": "address", "cell-format": { 
                "type": "string", 
                "tooltip": true 
            }
        }
    ]
} 
```

As obvious, properties like "cell-format" are repetitive in nature. Hyperdefault allows you to define a rule json, so that your payload need to have only the overriding properties.

# Usage
Following is a valid `Hyperdefault` rule for "grid_config_xl" above:

```sh
let rule = { 
    ref:{
        cellformatbean: { 
            "type": "string", "tooltip": true 
        }, 
        columnbean: { 
            "title": "", 
            "key": "", 
            "cell-format": "${cellformatbean:object}" 
        }
    },
    obj: { 
        grid_title: "", 
        columns: "${columnbean:array}" 
    }
} 
```

A `rule` is just an object with `obj` key defined. You can define your complex object structure with beans defined in `ref` key. 
Hyperdefault starts parsing rules from `obj` key in rule json. Once it encounters a value of format `${<ref.beankey>:<type>}`, it will look for beankey in `ref` . You can further deep link objects and arrays. Hyperdefault supports two `type` values:
  - array
  - object

Using `hyperdefault` you can ignore the defaults and have a lean json payload as in the implementation below:

```sh
const hyperdefault = require("hyperdefault");
let grid_config = { 
    "grid_title": "Records", 
    "columns": [
        { 
            "title": "Company", "key": "company"
        },
        { 
            "title": "Revenue", "key": "revenue", "cell-format": { 
                "type": "currency"
            }
        }, 
        { 
            "title": "Address", "key": "address"
        }
    ]
}
hyperdefault.expand(grid_config, rule); // see `rule` defined above.
```

This will expand the lean `grid_config` to `grid_config_xl` state. 
Take a look at `test/unit.js` for more examples.
