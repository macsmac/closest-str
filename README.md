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

// or

closest.setdict([
	{
		query: "hello",
		answer: function(query) {
			return "Hello! You typed: " + query
		}
	}
	// ...
]);

function makeRequest(query) {
    return closest.request(query).answer(query);
} 

makeRequest("hello, random guy!"); // "Hello! You typed: hello, random guy!"
makeRequest("goodbye then"); // "Goodbye!"
```

Load dict from file

```javascript
closest.setdict("./dict.json"); // file should be json
```

You can detect, if all matches are too low:

```javascript
closest.setlow(0.4);
closest.setlow("No matching keys");
closest.request("This is a random string, no close key in dictionary"); // { query: null, answer: "No matching keys" }
```

We can optimize our code... We don't need to check other keys if there was exact match. 

```javascript
closest.setmax(1); // Do not check other keys if there was 100% similarity
// closest.setmax(0.95); // If 95%
```

Also we can provide custom params for separate queries.

```javascript
closest.request("hello", {
	low: 0.5,
	lowresponse: "I don't understand you",
	max: 0.9,
	skip: 5 // Skip first 5 keys
});
```

# What can it be used for?
Simple bots:

```javascript
closest.setdict({
	"weather": function(query, callback) {
		/* Something to get weather */
		callback(/*result*/);
	}
	/* More commands here */
});

closest.setlow(0.3);
closest.setlow(function(query, callback) {
	callback("I don't understand you");
});

function makeRequest(query, callback) {
	closest.request(query).answer(callback);
}

makeRequest("what's the weather", console.log);
```

Word correction:

```javascript
closest.setdict({
	"pen": "pen",
	"apple": "apple",
	"pineapple": "pineapple"
});

closest.setlow(0.4);
closest.setlow("No idea");

closest.request("aple").answer; // "apple"
closest.request("pnapple").answer; // "pineapple"
```

Chat bot... why not?

```javascript
var fs = require("fs");
var closest = require("closest-str");
var answers = fs.readFileSync("./answers.txt").split("\n");
var dict = {};

answers.forEach(function(ans) {
	var s = ans.split("\\");
	if (dict[s[0]]) dict[s[0]].push(s[1]);
	else dict[s[0]] = [dict[s[1]]];
});

closest.setdict(dict);

function randPick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function makeRequest(query) {
	return randPick(closest.request(query).answer);
}
```

# Other

For comparing two strings

```javascript
closest._similarity("test", "tost"); // 0.75 (75%)
closest._similarity("test", "TEST"); // 1 (100%, case-insensetive)
```

```javascript
closest.__dict; // current dict
closest.__low; // lowest similarity
closest.__lowresponse; // lowest response
closest.__max; // maximum similarity
```

# Changelog

* **2.2.0**
* Load dict from file
* **2.1.0**
* Added custom params for separate queries
* Added max similarity
* Dict can be array
* **2.0.0**
* Initial release 
 
# TODO
 
* Async requests (for big dictionaries)