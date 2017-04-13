module.exports = {
	__dict: null,
	__low: null,
	__lowresponse: null,
	_editDistance: function (s1, s2) {
	  	s1 = s1.toLowerCase();
	  	s2 = s2.toLowerCase();
	 	var costs = new Array();
	  	for (var i = 0; i <= s1.length; i++) {
	    	var lastValue = i;
	    	for (var j = 0; j <= s2.length; j++) {
	    		if (i == 0) costs[j] = j;
	    		else {
	    			if (j > 0) {
	    				var newValue = costs[j - 1];
	    				if (s1.charAt(i - 1) != s2.charAt(j - 1))
	        				newValue = Math.min(Math.min(newValue, lastValue),
	          				costs[j]) + 1;
	      					costs[j - 1] = lastValue;
	       					lastValue = newValue;
	      				}
	    			}
	    		}
	    	if (i > 0) costs[s2.length] = lastValue;
	  	}
	  	return costs[s2.length];
	},
	_similarity: function (s1, s2) {
	  	var longer = s1;
	  	var shorter = s2;
	  	if (s1.length < s2.length) {
	    	longer = s2;
	    	shorter = s1;
	  	}
	  	var longerLength = longer.length;
	  	if (longerLength == 0) {
	    	return 1.0;
	  	}
	 	return (longerLength - this._editDistance(longer, shorter)) / parseFloat(longerLength);
	},
	setdict: function(dict) {
		this.__dict = Object.keys(dict).map(k => ({
			query: k,
			answer: dict[k]
		}));
	},
	setlow: function(query) {
		if (typeof query !== "number") this.__lowresponse = query;
		else this.__low = query;
	},
	request: function(query) {
		var _this = this;
		var biggestPrecent = 0;
		var response = null;
		this.__dict.forEach(function(el) {
			var precent = _this._similarity(el.query, query);
			if (precent > biggestPrecent) {
				biggestPrecent = precent;
				response = el;
			}
		});
		return (this.__lowresponse && biggestPrecent < this.__low ? { query: null, answer: this.__lowresponse } : response);
	}
}