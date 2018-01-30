
# Hyperdefault

It's often nice to have guaranteed object properties when working with Javascript. This guarantee avoids the need for a lot of `hasOwnProperty` checks.

Hyperdefault normalizes your lean Json payload/ JS Objects with defaults from a schema rule. The schema rule itself is a json, thus allowing you to maintain your schema rule externally.

Hyperdefault is a good companion when working with configuration driven UI or when you just dont want hardcoded defaults in code.

# Installation
```sh
npm install hyperdefault --save
```

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
Following is a valid `Hyperdefault` rule for the above json:
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
Hyperdefault starts parsing rules from "obj" key in rule json. Once it encounters a value of format `${<ref.beankey>:<type>}`, it will look for beankey in "ref" . You can further deep link objects and arrays. Hyperdefault supports two `type` values:
  - array
  - object

# Usage
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

This will expand the lean `grid_config` to `grid_config_xl` state. Take a look at `test/unit.js` for more examples.