# closest-str
closest-str is a library for finding closest key in the dictionary and getting it's value.

# Installation
Install a lib using npm
```sh
npm i closest-str
```

# Usage
Basic usage:
```javascript
var closest = require("closest-str");
closest.setdict({
    "hello": function(query) {
        return "Hello! You typed: " + query
    },
    "goodbye": function() {
        return "Goodbye!";
    }
});

function makeRequest(query) {
    return closest.request(query).answer(query);
} 

makeRequest("hello, random guy!"); // "Hello! You typed: hello, random guy!"
makeRequest("goodbye then"); // "Goodbye!"
```

You can detect, if all matches are too low:

```javascript
closest.setlow(0.4);
closest.setlow("No matching keys");
closest.request("This is a random string, no close key in dictionary"); // { query: null, answer: "No matching keys" }
```