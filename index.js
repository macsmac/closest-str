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
		if (dict instanceof Array) this.__dict = dict;
		else if (typeof dict == "string") this.setdict(require(dict));
		else this.__dict = Object.keys(dict).map(k => ({
			query: k,
			answer: dict[k]
		}));
	},
	setlow: function(query) {
		if (typeof query !== "number") this.__lowresponse = query;
		else this.__low = query;
	},
	setmax: function(max) {
		this.__max = max;
	},
	request: function(query, params) {
		var _this = this;
		var biggestPrecent = -1;
		var response = null;
		var max, low, lowresponse, skip;
		if (params) {
			low = params.low == null ? this.__low : params.low;
			max = params.max == null ? this.__max : params.max;
			lowresponse = params.lowresponse == null ? this.__lowresponse : params.lowresponse;
			skip = params.skip || 0;
		} else {
			max = this.__max;
			low = this.__low;
			skip = 0;
			lowresponse = this.__lowresponse;
		}
		for (var i = skip; i < this.__dict.length; i++) {
			var el = this.__dict[i];
			var precent = _this._similarity(el.query, query);
			if (precent > biggestPrecent) {
				biggestPrecent = precent;
				response = el;
			}
			if (precent >= max) break;
		}
		return (lowresponse && biggestPrecent < low ? { query: null, answer: lowresponse } : response);
	}
}