function addScriptManager() {
    function addContactUsPageDiv(){
        const agentDiv = document.createElement('div');
        agentDiv.id = "nit-alme-window-root";
        const elementName = "alme--window--header--banner";
        agentDiv.setAttribute('aria-labelledby', elementName);
        agentDiv.setAttribute('role', "region");
        agentDiv.setAttribute('style', 'margin: 0 0 30px 15px;');
        agentDiv.className = 'ask-julie-embed';
        document.getElementById("contactUsContainer").appendChild(agentDiv);
    }

    function getCookie(cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.startsWith(' ')) {
            c = c.substring(1);
            }
            if (c.startsWith(name)) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    (function checkForContactUsCookie(){
        if(getCookie("NITContactUsPage") !== ""){
            addContactUsPageDiv();
        }
    })();
    const parent = document.getElementsByTagName('head')[0];

    // get script reference
    const scriptTags = document.getElementsByTagName('script');
    let url = '';
    for (let i = 0; i < scriptTags.length; i++) {
        const src = scriptTags[i].getAttribute('src', -1);
        // Use indexOf for IE 11 support
        // eslint-disable-next-line @typescript-eslint/prefer-includes
        if (src > '' && src.toLowerCase().indexOf('nextit-script-manager.js') > -1) {
            url = src;
            break;
        }
    }

    const baseUrl = url.substr(0, url.toLowerCase().lastIndexOf('/'));

    const scriptTag = document.createElement('script');
    scriptTag.id = "nit-loader";
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('language', 'javascript');
    scriptTag.setAttribute('async', 'true');
    scriptTag.setAttribute('defer', 'true');

    const currentTime = new Date().getTime();
    scriptTag.setAttribute('src', baseUrl + '/nextit-loader.js?' + currentTime);

    if (parent) parent.appendChild(scriptTag);
}

function addLaunchFunction() {
	if (!window.NITAgent) 
		window.NITAgent = {};

	if (!window.NITAgent.showAgentWithQuestion) 
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		window.NITAgent.showAgentWithQuestion = fakeLaunch;

	function fakeLaunch() {
		// eslint-disable-next-line prefer-rest-params
		const args = [].slice.call(arguments);
		const launch = window.NITAgent.showAgentWithQuestion;
		if (launch !== fakeLaunch) {
			// eslint-disable-next-line prefer-spread
			launch.apply(null, args);
		} else {
			// eslint-disable-next-line prefer-spread
			setTimeout(function () { fakeLaunch.apply(null, args); }, 100);
		}
	}
}

function start() { 
	addLaunchFunction();
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	addReduce();
	addScriptManager();
  }
if(document.readyState === "complete"){
	start();
}
else{
	window.addEventListener('load', start, false);
}
/*
The tickets page is using an old version of prototype and it is interfering with our reduce function.
Amtrak removed the reduce function from their prototype file but we need to add back the default.
This needs to be added before redux does it's thing.
*/
function addReduce(){
// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
//if (!Array.prototype.reduce) {
	Object.defineProperty(Array.prototype, 'reduce', {
	value: function(callback /*, initialValue*/) {
		if (this === null) {
	throw new TypeError( 'Array.prototype.reduce ' + 
			'called on null or undefined' );
		}
		if (typeof callback !== 'function') {
	throw new TypeError( callback +
			' is not a function');
		}
  
		// 1. Let O be ? ToObject(this value).
		const o = Object(this);
  
		// 2. Let len be ? ToLength(? Get(O, "length")).
		const len = o.length >>> 0; 
  
		// Steps 3, 4, 5, 6, 7      
		let k = 0; 
		let value;
  
		if (arguments.length >= 2) {
	// eslint-disable-next-line prefer-rest-params
	value = arguments[1];
		} else {
	while (k < len && !(k in o)) {
			k++; 
	}
  
	// 3. If len is 0 and initialValue is not present,
	//    throw a TypeError exception.
		if (k >= len) {
	throw new TypeError( 'Reduce of empty array ' +
		'with no initial value' );
	}
	value = o[k++];
		}
  
		// 8. Repeat, while k < len
		while (k < len) {
		// a. Let Pk be ! ToString(k).
		// b. Let kPresent be ? HasProperty(O, Pk).
		// c. If kPresent is true, then
		//    i.  Let kValue be ? Get(O, Pk).
		//    ii. Let accumulator be ? Call(
		//          callbackfn, undefined,
		//          « accumulator, kValue, k, O »).
		if (k in o) {
			value = callback(value, o[k], k, o);
		}

		// d. Increase k by 1.      
		k++;
	}
  
		// 9. Return accumulator.
		return value;
	},
	});
}
