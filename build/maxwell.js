/**
 * @license almond 0.3.0 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("../bower_components/almond/almond", function(){});

/**
 * CoffeeScript Compiler v1.7.1
 * http://coffeescript.org
 *
 * Copyright 2011, Jeremy Ashkenas
 * Released under the MIT License
 */
(function(root){var CoffeeScript=function(){function require(e){return require[e]}return require["./helpers"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a;e.starts=function(e,t,n){return t===e.substr(n,t.length)},e.ends=function(e,t,n){var i;return i=t.length,t===e.substr(e.length-i-(n||0),i)},e.repeat=s=function(e,t){var n;for(n="";t>0;)1&t&&(n+=e),t>>>=1,e+=e;return n},e.compact=function(e){var t,n,i,r;for(r=[],n=0,i=e.length;i>n;n++)t=e[n],t&&r.push(t);return r},e.count=function(e,t){var n,i;if(n=i=0,!t.length)return 1/0;for(;i=1+e.indexOf(t,i);)n++;return n},e.merge=function(e,t){return n(n({},e),t)},n=e.extend=function(e,t){var n,i;for(n in t)i=t[n],e[n]=i;return e},e.flatten=i=function(e){var t,n,r,s;for(n=[],r=0,s=e.length;s>r;r++)t=e[r],t instanceof Array?n=n.concat(i(t)):n.push(t);return n},e.del=function(e,t){var n;return n=e[t],delete e[t],n},e.last=r=function(e,t){return e[e.length-(t||0)-1]},e.some=null!=(a=Array.prototype.some)?a:function(e){var t,n,i;for(n=0,i=this.length;i>n;n++)if(t=this[n],e(t))return!0;return!1},e.invertLiterate=function(e){var t,n,i;return i=!0,n=function(){var n,r,s,o;for(s=e.split("\n"),o=[],n=0,r=s.length;r>n;n++)t=s[n],i&&/^([ ]{4}|[ ]{0,3}\t)/.test(t)?o.push(t):(i=/^\s*$/.test(t))?o.push(t):o.push("# "+t);return o}(),n.join("\n")},t=function(e,t){return t?{first_line:e.first_line,first_column:e.first_column,last_line:t.last_line,last_column:t.last_column}:e},e.addLocationDataFn=function(e,n){return function(i){return"object"==typeof i&&i.updateLocationDataIfMissing&&i.updateLocationDataIfMissing(t(e,n)),i}},e.locationDataToString=function(e){var t;return"2"in e&&"first_line"in e[2]?t=e[2]:"first_line"in e&&(t=e),t?""+(t.first_line+1)+":"+(t.first_column+1)+"-"+(""+(t.last_line+1)+":"+(t.last_column+1)):"No location data"},e.baseFileName=function(e,t,n){var i,r;return null==t&&(t=!1),null==n&&(n=!1),r=n?/\\|\//:/\//,i=e.split(r),e=i[i.length-1],t&&e.indexOf(".")>=0?(i=e.split("."),i.pop(),"coffee"===i[i.length-1]&&i.length>1&&i.pop(),i.join(".")):e},e.isCoffee=function(e){return/\.((lit)?coffee|coffee\.md)$/.test(e)},e.isLiterate=function(e){return/\.(litcoffee|coffee\.md)$/.test(e)},e.throwSyntaxError=function(e,t){var n;throw n=new SyntaxError(e),n.location=t,n.toString=o,n.stack=""+n,n},e.updateSyntaxError=function(e,t,n){return e.toString===o&&(e.code||(e.code=t),e.filename||(e.filename=n),e.stack=""+e),e},o=function(){var e,t,n,i,r,o,a,c,h,l,u,p,d;return this.code&&this.location?(p=this.location,a=p.first_line,o=p.first_column,h=p.last_line,c=p.last_column,null==h&&(h=a),null==c&&(c=o),r=this.filename||"[stdin]",e=this.code.split("\n")[a],u=o,i=a===h?c+1:e.length,l=s(" ",u)+s("^",i-u),"undefined"!=typeof process&&null!==process&&(n=process.stdout.isTTY&&!process.env.NODE_DISABLE_COLORS),(null!=(d=this.colorful)?d:n)&&(t=function(e){return"[1;31m"+e+"[0m"},e=e.slice(0,u)+t(e.slice(u,i))+e.slice(i),l=t(l)),""+r+":"+(a+1)+":"+(o+1)+": error: "+this.message+"\n"+e+"\n"+l):Error.prototype.toString.call(this)},e.nameWhitespaceCharacter=function(e){switch(e){case" ":return"space";case"\n":return"newline";case"\r":return"carriage return";case"	":return"tab";default:return e}}}.call(this),t.exports}(),require["./rewriter"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,h,l,u,p,d,f,m,b,g,k,y,v=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},w=[].slice;for(f=function(e,t,n){var i;return i=[e,t],i.generated=!0,n&&(i.origin=n),i},e.Rewriter=function(){function e(){}return e.prototype.rewrite=function(e){return this.tokens=e,this.removeLeadingNewlines(),this.closeOpenCalls(),this.closeOpenIndexes(),this.normalizeLines(),this.tagPostfixConditionals(),this.addImplicitBracesAndParens(),this.addLocationDataToGeneratedTokens(),this.tokens},e.prototype.scanTokens=function(e){var t,n,i;for(i=this.tokens,t=0;n=i[t];)t+=e.call(this,n,t,i);return!0},e.prototype.detectEnd=function(e,t,n){var i,o,a,c,h;for(a=this.tokens,i=0;o=a[e];){if(0===i&&t.call(this,o,e))return n.call(this,o,e);if(!o||0>i)return n.call(this,o,e-1);c=o[0],v.call(s,c)>=0?i+=1:(h=o[0],v.call(r,h)>=0&&(i-=1)),e+=1}return e-1},e.prototype.removeLeadingNewlines=function(){var e,t,n,i,r;for(r=this.tokens,e=n=0,i=r.length;i>n&&(t=r[e][0],"TERMINATOR"===t);e=++n);return e?this.tokens.splice(0,e):void 0},e.prototype.closeOpenCalls=function(){var e,t;return t=function(e,t){var n;return")"===(n=e[0])||"CALL_END"===n||"OUTDENT"===e[0]&&")"===this.tag(t-1)},e=function(e,t){return this.tokens["OUTDENT"===e[0]?t-1:t][0]="CALL_END"},this.scanTokens(function(n,i){return"CALL_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.closeOpenIndexes=function(){var e,t;return t=function(e){var t;return"]"===(t=e[0])||"INDEX_END"===t},e=function(e){return e[0]="INDEX_END"},this.scanTokens(function(n,i){return"INDEX_START"===n[0]&&this.detectEnd(i+1,t,e),1})},e.prototype.matchTags=function(){var e,t,n,i,r,s,o;for(t=arguments[0],i=arguments.length>=2?w.call(arguments,1):[],e=0,n=r=0,s=i.length;s>=0?s>r:r>s;n=s>=0?++r:--r){for(;"HERECOMMENT"===this.tag(t+n+e);)e+=2;if(null!=i[n]&&("string"==typeof i[n]&&(i[n]=[i[n]]),o=this.tag(t+n+e),0>v.call(i[n],o)))return!1}return!0},e.prototype.looksObjectish=function(e){return this.matchTags(e,"@",null,":")||this.matchTags(e,null,":")},e.prototype.findTagsBackwards=function(e,t){var n,i,o,a,c,h,l;for(n=[];e>=0&&(n.length||(a=this.tag(e),0>v.call(t,a)&&(c=this.tag(e),0>v.call(s,c)||this.tokens[e].generated)&&(h=this.tag(e),0>v.call(u,h))));)i=this.tag(e),v.call(r,i)>=0&&n.push(this.tag(e)),o=this.tag(e),v.call(s,o)>=0&&n.length&&n.pop(),e-=1;return l=this.tag(e),v.call(t,l)>=0},e.prototype.addImplicitBracesAndParens=function(){var e;return e=[],this.scanTokens(function(t,i,l){var p,d,m,b,g,k,y,w,T,F,L,C,N,E,x,D,S,R,A,I,_,$,O,j,M,B,V,P;if($=t[0],L=(C=i>0?l[i-1]:[])[0],T=(l.length-1>i?l[i+1]:[])[0],S=function(){return e[e.length-1]},R=i,m=function(e){return i-R+e},b=function(){var e,t;return null!=(e=S())?null!=(t=e[2])?t.ours:void 0:void 0},g=function(){var e;return b()&&"("===(null!=(e=S())?e[0]:void 0)},y=function(){var e;return b()&&"{"===(null!=(e=S())?e[0]:void 0)},k=function(){var e;return b&&"CONTROL"===(null!=(e=S())?e[0]:void 0)},A=function(t){var n;return n=null!=t?t:i,e.push(["(",n,{ours:!0}]),l.splice(n,0,f("CALL_START","(")),null==t?i+=1:void 0},p=function(){return e.pop(),l.splice(i,0,f("CALL_END",")")),i+=1},I=function(n,r){var s;return null==r&&(r=!0),s=null!=n?n:i,e.push(["{",s,{sameLine:!0,startsLine:r,ours:!0}]),l.splice(s,0,f("{",f(new String("{")),t)),null==n?i+=1:void 0},d=function(n){return n=null!=n?n:i,e.pop(),l.splice(n,0,f("}","}",t)),i+=1},g()&&("IF"===$||"TRY"===$||"FINALLY"===$||"CATCH"===$||"CLASS"===$||"SWITCH"===$))return e.push(["CONTROL",i,{ours:!0}]),m(1);if("INDENT"===$&&b()){if("=>"!==L&&"->"!==L&&"["!==L&&"("!==L&&","!==L&&"{"!==L&&"TRY"!==L&&"ELSE"!==L&&"="!==L)for(;g();)p();return k()&&e.pop(),e.push([$,i]),m(1)}if(v.call(s,$)>=0)return e.push([$,i]),m(1);if(v.call(r,$)>=0){for(;b();)g()?p():y()?d():e.pop();e.pop()}if((v.call(c,$)>=0&&t.spaced&&!t.stringEnd||"?"===$&&i>0&&!l[i-1].spaced)&&(v.call(o,T)>=0||v.call(h,T)>=0&&!(null!=(O=l[i+1])?O.spaced:void 0)&&!(null!=(j=l[i+1])?j.newLine:void 0)))return"?"===$&&($=t[0]="FUNC_EXIST"),A(i+1),m(2);if(v.call(c,$)>=0&&this.matchTags(i+1,"INDENT",null,":")&&!this.findTagsBackwards(i,["CLASS","EXTENDS","IF","CATCH","SWITCH","LEADING_WHEN","FOR","WHILE","UNTIL"]))return A(i+1),e.push(["INDENT",i+2]),m(3);if(":"===$){for(N="@"===this.tag(i-2)?i-2:i-1;"HERECOMMENT"===this.tag(N-2);)N-=2;return this.insideForDeclaration="FOR"===T,_=0===N||(M=this.tag(N-1),v.call(u,M)>=0)||l[N-1].newLine,S()&&(B=S(),D=B[0],x=B[1],("{"===D||"INDENT"===D&&"{"===this.tag(x-1))&&(_||","===this.tag(N-1)||"{"===this.tag(N-1)))?m(1):(I(N,!!_),m(2))}if(y()&&v.call(u,$)>=0&&(S()[2].sameLine=!1),w="OUTDENT"===L||C.newLine,v.call(a,$)>=0||v.call(n,$)>=0&&w)for(;b();)if(V=S(),D=V[0],x=V[1],P=V[2],E=P.sameLine,_=P.startsLine,g()&&","!==L)p();else if(y()&&!this.insideForDeclaration&&E&&"TERMINATOR"!==$&&":"!==L&&d());else{if(!y()||"TERMINATOR"!==$||","===L||_&&this.looksObjectish(i+1))break;d()}if(!(","!==$||this.looksObjectish(i+1)||!y()||this.insideForDeclaration||"TERMINATOR"===T&&this.looksObjectish(i+2)))for(F="OUTDENT"===T?1:0;y();)d(i+F);return m(1)})},e.prototype.addLocationDataToGeneratedTokens=function(){return this.scanTokens(function(e,t,n){var i,r,s,o,a,c;return e[2]?1:e.generated||e.explicit?("{"===e[0]&&(s=null!=(a=n[t+1])?a[2]:void 0)?(r=s.first_line,i=s.first_column):(o=null!=(c=n[t-1])?c[2]:void 0)?(r=o.last_line,i=o.last_column):r=i=0,e[2]={first_line:r,first_column:i,last_line:r,last_column:i},1):1})},e.prototype.normalizeLines=function(){var e,t,r,s,o;return o=r=s=null,t=function(e,t){var r,s,a,c;return";"!==e[1]&&(r=e[0],v.call(p,r)>=0)&&!("TERMINATOR"===e[0]&&(s=this.tag(t+1),v.call(i,s)>=0))&&!("ELSE"===e[0]&&"THEN"!==o)&&!!("CATCH"!==(a=e[0])&&"FINALLY"!==a||"->"!==o&&"=>"!==o)||(c=e[0],v.call(n,c)>=0&&this.tokens[t-1].newLine)},e=function(e,t){return this.tokens.splice(","===this.tag(t-1)?t-1:t,0,s)},this.scanTokens(function(n,a,c){var h,l,u,p,f,m;if(l=n[0],"TERMINATOR"===l){if("ELSE"===this.tag(a+1)&&"OUTDENT"!==this.tag(a-1))return c.splice.apply(c,[a,1].concat(w.call(this.indentation()))),1;if(p=this.tag(a+1),v.call(i,p)>=0)return c.splice(a,1),0}if("CATCH"===l)for(h=u=1;2>=u;h=++u)if("OUTDENT"===(f=this.tag(a+h))||"TERMINATOR"===f||"FINALLY"===f)return c.splice.apply(c,[a+h,0].concat(w.call(this.indentation()))),2+h;return v.call(d,l)>=0&&"INDENT"!==this.tag(a+1)&&("ELSE"!==l||"IF"!==this.tag(a+1))?(o=l,m=this.indentation(c[a]),r=m[0],s=m[1],"THEN"===o&&(r.fromThen=!0),c.splice(a+1,0,r),this.detectEnd(a+2,t,e),"THEN"===l&&c.splice(a,1),1):1})},e.prototype.tagPostfixConditionals=function(){var e,t,n;return n=null,t=function(e,t){var n,i;return i=e[0],n=this.tokens[t-1][0],"TERMINATOR"===i||"INDENT"===i&&0>v.call(d,n)},e=function(e){return"INDENT"!==e[0]||e.generated&&!e.fromThen?n[0]="POST_"+n[0]:void 0},this.scanTokens(function(i,r){return"IF"!==i[0]?1:(n=i,this.detectEnd(r+1,t,e),1)})},e.prototype.indentation=function(e){var t,n;return t=["INDENT",2],n=["OUTDENT",2],e?(t.generated=n.generated=!0,t.origin=n.origin=e):t.explicit=n.explicit=!0,[t,n]},e.prototype.generate=f,e.prototype.tag=function(e){var t;return null!=(t=this.tokens[e])?t[0]:void 0},e}(),t=[["(",")"],["[","]"],["{","}"],["INDENT","OUTDENT"],["CALL_START","CALL_END"],["PARAM_START","PARAM_END"],["INDEX_START","INDEX_END"]],e.INVERSES=l={},s=[],r=[],g=0,k=t.length;k>g;g++)y=t[g],m=y[0],b=y[1],s.push(l[b]=m),r.push(l[m]=b);i=["CATCH","THEN","ELSE","FINALLY"].concat(r),c=["IDENTIFIER","SUPER",")","CALL_END","]","INDEX_END","@","THIS"],o=["IDENTIFIER","NUMBER","STRING","JS","REGEX","NEW","PARAM_START","CLASS","IF","TRY","SWITCH","THIS","BOOL","NULL","UNDEFINED","UNARY","UNARY_MATH","SUPER","THROW","@","->","=>","[","(","{","--","++"],h=["+","-"],a=["POST_IF","FOR","WHILE","UNTIL","WHEN","BY","LOOP","TERMINATOR"],d=["ELSE","->","=>","TRY","FINALLY","THEN"],p=["TERMINATOR","CATCH","FINALLY","ELSE","OUTDENT","LEADING_WHEN"],u=["TERMINATOR","INDENT","OUTDENT"],n=[".","?.","::","?::"]}.call(this),t.exports}(),require["./lexer"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,h,l,u,p,d,f,m,b,g,k,y,v,w,T,F,L,C,N,E,x,D,S,R,A,I,_,$,O,j,M,B,V,P,U,H,q,G,W,X,Y,z,K,J,Z,Q,et,tt,nt=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};et=require("./rewriter"),j=et.Rewriter,y=et.INVERSES,tt=require("./helpers"),W=tt.count,Z=tt.starts,G=tt.compact,z=tt.last,J=tt.repeat,X=tt.invertLiterate,K=tt.locationDataToString,Q=tt.throwSyntaxError,e.Lexer=N=function(){function e(){}return e.prototype.tokenize=function(e,t){var n,i,r,s;for(null==t&&(t={}),this.literate=t.literate,this.indent=0,this.baseIndent=0,this.indebt=0,this.outdebt=0,this.indents=[],this.ends=[],this.tokens=[],this.chunkLine=t.line||0,this.chunkColumn=t.column||0,e=this.clean(e),i=0;this.chunk=e.slice(i);)n=this.identifierToken()||this.commentToken()||this.whitespaceToken()||this.lineToken()||this.heredocToken()||this.stringToken()||this.numberToken()||this.regexToken()||this.jsToken()||this.literalToken(),s=this.getLineAndColumnFromChunk(n),this.chunkLine=s[0],this.chunkColumn=s[1],i+=n;return this.closeIndentation(),(r=this.ends.pop())&&this.error("missing "+r),t.rewrite===!1?this.tokens:(new j).rewrite(this.tokens)},e.prototype.clean=function(e){return e.charCodeAt(0)===t&&(e=e.slice(1)),e=e.replace(/\r/g,"").replace(P,""),q.test(e)&&(e="\n"+e,this.chunkLine--),this.literate&&(e=X(e)),e},e.prototype.identifierToken=function(){var e,t,n,i,r,c,h,l,u,p,d,f,m,g;return(h=b.exec(this.chunk))?(c=h[0],i=h[1],e=h[2],r=i.length,l=void 0,"own"===i&&"FOR"===this.tag()?(this.token("OWN",i),i.length):(n=e||(u=z(this.tokens))&&("."===(f=u[0])||"?."===f||"::"===f||"?::"===f||!u.spaced&&"@"===u[0]),p="IDENTIFIER",!n&&(nt.call(T,i)>=0||nt.call(a,i)>=0)&&(p=i.toUpperCase(),"WHEN"===p&&(m=this.tag(),nt.call(F,m)>=0)?p="LEADING_WHEN":"FOR"===p?this.seenFor=!0:"UNLESS"===p?p="IF":nt.call(U,p)>=0?p="UNARY":nt.call($,p)>=0&&("INSTANCEOF"!==p&&this.seenFor?(p="FOR"+p,this.seenFor=!1):(p="RELATION","!"===this.value()&&(l=this.tokens.pop(),i="!"+i)))),nt.call(w,i)>=0&&(n?(p="IDENTIFIER",i=new String(i),i.reserved=!0):nt.call(O,i)>=0&&this.error('reserved word "'+i+'"')),n||(nt.call(s,i)>=0&&(i=o[i]),p=function(){switch(i){case"!":return"UNARY";case"==":case"!=":return"COMPARE";case"&&":case"||":return"LOGIC";case"true":case"false":return"BOOL";case"break":case"continue":return"STATEMENT";default:return p}}()),d=this.token(p,i,0,r),l&&(g=[l[2].first_line,l[2].first_column],d[2].first_line=g[0],d[2].first_column=g[1]),e&&(t=c.lastIndexOf(":"),this.token(":",":",t,e.length)),c.length)):0},e.prototype.numberToken=function(){var e,t,n,i,r;return(n=A.exec(this.chunk))?(i=n[0],/^0[BOX]/.test(i)?this.error("radix prefix '"+i+"' must be lowercase"):/E/.test(i)&&!/^0x/.test(i)?this.error("exponential notation '"+i+"' must be indicated with a lowercase 'e'"):/^0\d*[89]/.test(i)?this.error("decimal literal '"+i+"' must not be prefixed with '0'"):/^0\d+/.test(i)&&this.error("octal literal '"+i+"' must be prefixed with '0o'"),t=i.length,(r=/^0o([0-7]+)/.exec(i))&&(i="0x"+parseInt(r[1],8).toString(16)),(e=/^0b([01]+)/.exec(i))&&(i="0x"+parseInt(e[1],2).toString(16)),this.token("NUMBER",i,0,t),t):0},e.prototype.stringToken=function(){var e,t,n,i;switch(t=this.chunk.charAt(0)){case"'":n=B.exec(this.chunk)[0];break;case'"':n=this.balancedString(this.chunk,'"')}return n?(i=this.removeNewlines(n.slice(1,-1)),'"'===t&&n.indexOf("#{",1)>0?this.interpolateString(i,{strOffset:1,lexedLength:n.length}):this.token("STRING",t+this.escapeLines(i)+t,0,n.length),(e=/^(?:\\.|[^\\])*\\(?:0[0-7]|[1-7])/.test(n))&&this.error("octal escape sequences "+n+" are not allowed"),n.length):0},e.prototype.heredocToken=function(){var e,t,n,i;return(n=u.exec(this.chunk))?(t=n[0],i=t.charAt(0),e=this.sanitizeHeredoc(n[2],{quote:i,indent:null}),'"'===i&&e.indexOf("#{")>=0?this.interpolateString(e,{heredoc:!0,strOffset:3,lexedLength:t.length}):this.token("STRING",this.makeString(e,i,!0),0,t.length),t.length):0},e.prototype.commentToken=function(){var e,t,n;return(n=this.chunk.match(c))?(e=n[0],t=n[1],t&&this.token("HERECOMMENT",this.sanitizeHeredoc(t,{herecomment:!0,indent:J(" ",this.indent)}),0,e.length),e.length):0},e.prototype.jsToken=function(){var e,t;return"`"===this.chunk.charAt(0)&&(e=v.exec(this.chunk))?(this.token("JS",(t=e[0]).slice(1,-1),0,t.length),t.length):0},e.prototype.regexToken=function(){var e,t,n,i,r,s,o;return"/"!==this.chunk.charAt(0)?0:(t=this.heregexToken())?t:(i=z(this.tokens),i&&(s=i[0],nt.call(i.spaced?S:R,s)>=0)?0:(n=_.exec(this.chunk))?(o=n,n=o[0],r=o[1],e=o[2],"//"===r?0:("/*"===r.slice(0,2)&&this.error("regular expressions cannot begin with `*`"),this.token("REGEX",""+r+e,0,n.length),n.length)):0)},e.prototype.heregexToken=function(){var e,t,n,i,r,s,o,a,c,h,l,u,p,d,b,g,k;if(!(r=f.exec(this.chunk)))return 0;if(i=r[0],e=r[1],t=r[2],0>e.indexOf("#{"))return a=this.escapeLines(e.replace(m,"$1$2").replace(/\//g,"\\/"),!0),a.match(/^\*/)&&this.error("regular expressions cannot begin with `*`"),this.token("REGEX","/"+(a||"(?:)")+"/"+t,0,i.length),i.length;for(this.token("IDENTIFIER","RegExp",0,0),this.token("CALL_START","(",0,0),l=[],b=this.interpolateString(e,{regex:!0}),p=0,d=b.length;d>p;p++){if(h=b[p],c=h[0],u=h[1],"TOKENS"===c)l.push.apply(l,u);else if("NEOSTRING"===c){if(!(u=u.replace(m,"$1$2")))continue;u=u.replace(/\\/g,"\\\\"),h[0]="STRING",h[1]=this.makeString(u,'"',!0),l.push(h)}else this.error("Unexpected "+c);o=z(this.tokens),s=["+","+"],s[2]=o[2],l.push(s)}return l.pop(),"STRING"!==(null!=(g=l[0])?g[0]:void 0)&&(this.token("STRING",'""',0,0),this.token("+","+",0,0)),(k=this.tokens).push.apply(k,l),t&&(n=i.lastIndexOf(t),this.token(",",",",n,0),this.token("STRING",'"'+t+'"',n,t.length)),this.token(")",")",i.length-1,0),i.length},e.prototype.lineToken=function(){var e,t,n,i,r;if(!(n=D.exec(this.chunk)))return 0;if(t=n[0],this.seenFor=!1,r=t.length-1-t.lastIndexOf("\n"),i=this.unfinished(),r-this.indebt===this.indent)return i?this.suppressNewlines():this.newlineToken(0),t.length;if(r>this.indent){if(i)return this.indebt=r-this.indent,this.suppressNewlines(),t.length;if(!this.tokens.length)return this.baseIndent=this.indent=r,t.length;e=r-this.indent+this.outdebt,this.token("INDENT",e,t.length-r,r),this.indents.push(e),this.ends.push("OUTDENT"),this.outdebt=this.indebt=0,this.indent=r}else this.baseIndent>r?this.error("missing indentation",t.length):(this.indebt=0,this.outdentToken(this.indent-r,i,t.length));return t.length},e.prototype.outdentToken=function(e,t,n){var i,r,s,o;for(i=this.indent-e;e>0;)s=this.indents[this.indents.length-1],s?s===this.outdebt?(e-=this.outdebt,this.outdebt=0):this.outdebt>s?(this.outdebt-=s,e-=s):(r=this.indents.pop()+this.outdebt,n&&(o=this.chunk[n],nt.call(g,o)>=0)&&(i-=r-e,e=r),this.outdebt=0,this.pair("OUTDENT"),this.token("OUTDENT",e,0,n),e-=r):e=0;for(r&&(this.outdebt-=e);";"===this.value();)this.tokens.pop();return"TERMINATOR"===this.tag()||t||this.token("TERMINATOR","\n",n,0),this.indent=i,this},e.prototype.whitespaceToken=function(){var e,t,n;return(e=q.exec(this.chunk))||(t="\n"===this.chunk.charAt(0))?(n=z(this.tokens),n&&(n[e?"spaced":"newLine"]=!0),e?e[0].length:0):0},e.prototype.newlineToken=function(e){for(;";"===this.value();)this.tokens.pop();return"TERMINATOR"!==this.tag()&&this.token("TERMINATOR","\n",e,0),this},e.prototype.suppressNewlines=function(){return"\\"===this.value()&&this.tokens.pop(),this},e.prototype.literalToken=function(){var e,t,n,s,o,a,c,u;if((e=I.exec(this.chunk))?(s=e[0],r.test(s)&&this.tagParameters()):s=this.chunk.charAt(0),n=s,t=z(this.tokens),"="===s&&t&&(!t[1].reserved&&(o=t[1],nt.call(w,o)>=0)&&this.error('reserved word "'+this.value()+"\" can't be assigned"),"||"===(a=t[1])||"&&"===a))return t[0]="COMPOUND_ASSIGN",t[1]+="=",s.length;if(";"===s)this.seenFor=!1,n="TERMINATOR";else if(nt.call(E,s)>=0)n="MATH";else if(nt.call(h,s)>=0)n="COMPARE";else if(nt.call(l,s)>=0)n="COMPOUND_ASSIGN";else if(nt.call(U,s)>=0)n="UNARY";else if(nt.call(H,s)>=0)n="UNARY_MATH";else if(nt.call(M,s)>=0)n="SHIFT";else if(nt.call(C,s)>=0||"?"===s&&(null!=t?t.spaced:void 0))n="LOGIC";else if(t&&!t.spaced)if("("===s&&(c=t[0],nt.call(i,c)>=0))"?"===t[0]&&(t[0]="FUNC_EXIST"),n="CALL_START";else if("["===s&&(u=t[0],nt.call(k,u)>=0))switch(n="INDEX_START",t[0]){case"?":t[0]="INDEX_SOAK"}switch(s){case"(":case"{":case"[":this.ends.push(y[s]);break;case")":case"}":case"]":this.pair(s)}return this.token(n,s),s.length},e.prototype.sanitizeHeredoc=function(e,t){var n,i,r,s,o;if(r=t.indent,i=t.herecomment){if(p.test(e)&&this.error('block comment cannot contain "*/", starting'),0>e.indexOf("\n"))return e}else for(;s=d.exec(e);)n=s[1],(null===r||(o=n.length)>0&&r.length>o)&&(r=n);return r&&(e=e.replace(RegExp("\\n"+r,"g"),"\n")),i||(e=e.replace(/^\n/,"")),e},e.prototype.tagParameters=function(){var e,t,n,i;if(")"!==this.tag())return this;for(t=[],i=this.tokens,e=i.length,i[--e][0]="PARAM_END";n=i[--e];)switch(n[0]){case")":t.push(n);break;case"(":case"CALL_START":if(!t.length)return"("===n[0]?(n[0]="PARAM_START",this):this;t.pop()}return this},e.prototype.closeIndentation=function(){return this.outdentToken(this.indent)},e.prototype.balancedString=function(e,t){var n,i,r,s,o,a,c,h;for(n=0,a=[t],i=c=1,h=e.length;h>=1?h>c:c>h;i=h>=1?++c:--c)if(n)--n;else{switch(r=e.charAt(i)){case"\\":++n;continue;case t:if(a.pop(),!a.length)return e.slice(0,+i+1||9e9);t=a[a.length-1];continue}"}"!==t||'"'!==r&&"'"!==r?"}"===t&&"/"===r&&(s=f.exec(e.slice(i))||_.exec(e.slice(i)))?n+=s[0].length-1:"}"===t&&"{"===r?a.push(t="}"):'"'===t&&"#"===o&&"{"===r&&a.push(t="}"):a.push(t=r),o=r}return this.error("missing "+a.pop()+", starting")},e.prototype.interpolateString=function(t,n){var i,r,s,o,a,c,h,l,u,p,d,f,m,b,g,k,y,v,w,T,F,L,C,N,E,x,D,S,R;for(null==n&&(n={}),o=n.heredoc,v=n.regex,b=n.offsetInChunk,T=n.strOffset,p=n.lexedLength,b||(b=0),T||(T=0),p||(p=t.length),C=[],g=0,a=-1;u=t.charAt(a+=1);)"\\"!==u?"#"===u&&"{"===t.charAt(a+1)&&(s=this.balancedString(t.slice(a+1),"}"))&&(a>g&&C.push(this.makeToken("NEOSTRING",t.slice(g,a),T+g)),r||(r=this.makeToken("","string interpolation",b+a+1,2)),c=s.slice(1,-1),c.length&&(D=this.getLineAndColumnFromChunk(T+a+1),d=D[0],i=D[1],m=(new e).tokenize(c,{line:d,column:i,rewrite:!1}),y=m.pop(),"TERMINATOR"===(null!=(S=m[0])?S[0]:void 0)&&(y=m.shift()),(l=m.length)&&(l>1&&(m.unshift(this.makeToken("(","(",T+a+1,0)),m.push(this.makeToken(")",")",T+a+1+c.length,0))),C.push(["TOKENS",m]))),a+=s.length,g=a+1):a+=1;if(a>g&&t.length>g&&C.push(this.makeToken("NEOSTRING",t.slice(g),T+g)),v)return C;if(!C.length)return this.token("STRING",'""',b,p);for("NEOSTRING"!==C[0][0]&&C.unshift(this.makeToken("NEOSTRING","",b)),(h=C.length>1)&&this.token("(","(",b,0,r),a=E=0,x=C.length;x>E;a=++E)L=C[a],F=L[0],N=L[1],a&&(a&&(k=this.token("+","+")),f="TOKENS"===F?N[0]:L,k[2]={first_line:f[2].first_line,first_column:f[2].first_column,last_line:f[2].first_line,last_column:f[2].first_column}),"TOKENS"===F?(R=this.tokens).push.apply(R,N):"NEOSTRING"===F?(L[0]="STRING",L[1]=this.makeString(N,'"',o),this.tokens.push(L)):this.error("Unexpected "+F);return h&&(w=this.makeToken(")",")",b+p,0),w.stringEnd=!0,this.tokens.push(w)),C},e.prototype.pair=function(e){var t;return e!==(t=z(this.ends))?("OUTDENT"!==t&&this.error("unmatched "+e),this.outdentToken(z(this.indents),!0),this.pair(e)):this.ends.pop()},e.prototype.getLineAndColumnFromChunk=function(e){var t,n,i,r;return 0===e?[this.chunkLine,this.chunkColumn]:(r=e>=this.chunk.length?this.chunk:this.chunk.slice(0,+(e-1)+1||9e9),n=W(r,"\n"),t=this.chunkColumn,n>0?(i=r.split("\n"),t=z(i).length):t+=r.length,[this.chunkLine+n,t])},e.prototype.makeToken=function(e,t,n,i){var r,s,o,a,c;return null==n&&(n=0),null==i&&(i=t.length),s={},a=this.getLineAndColumnFromChunk(n),s.first_line=a[0],s.first_column=a[1],r=Math.max(0,i-1),c=this.getLineAndColumnFromChunk(n+r),s.last_line=c[0],s.last_column=c[1],o=[e,t,s]},e.prototype.token=function(e,t,n,i,r){var s;return s=this.makeToken(e,t,n,i),r&&(s.origin=r),this.tokens.push(s),s},e.prototype.tag=function(e,t){var n;return(n=z(this.tokens,e))&&(t?n[0]=t:n[0])},e.prototype.value=function(e,t){var n;return(n=z(this.tokens,e))&&(t?n[1]=t:n[1])},e.prototype.unfinished=function(){var e;return L.test(this.chunk)||"\\"===(e=this.tag())||"."===e||"?."===e||"?::"===e||"UNARY"===e||"MATH"===e||"UNARY_MATH"===e||"+"===e||"-"===e||"**"===e||"SHIFT"===e||"RELATION"===e||"COMPARE"===e||"LOGIC"===e||"THROW"===e||"EXTENDS"===e},e.prototype.removeNewlines=function(e){return e.replace(/^\s*\n\s*/,"").replace(/([^\\]|\\\\)\s*\n\s*$/,"$1")},e.prototype.escapeLines=function(e,t){return e=e.replace(/\\[^\S\n]*(\n|\\)\s*/g,function(e,t){return"\n"===t?"":e}),t?e.replace(x,"\\n"):e.replace(/\s*\n\s*/g," ")},e.prototype.makeString=function(e,t,n){return e?(e=e.replace(RegExp("\\\\("+t+"|\\\\)","g"),function(e,n){return n===t?n:e}),e=e.replace(RegExp(""+t,"g"),"\\$&"),t+this.escapeLines(e,n)+t):t+t},e.prototype.error=function(e,t){var n,i,r;return null==t&&(t=0),r=this.getLineAndColumnFromChunk(t),i=r[0],n=r[1],Q(e,{first_line:i,first_column:n})},e}(),T=["true","false","null","this","new","delete","typeof","in","instanceof","return","throw","break","continue","debugger","if","else","switch","for","while","do","try","catch","finally","class","extends","super"],a=["undefined","then","unless","until","loop","of","by","when"],o={and:"&&",or:"||",is:"==",isnt:"!=",not:"!",yes:"true",no:"false",on:"true",off:"false"},s=function(){var e;e=[];for(Y in o)e.push(Y);return e}(),a=a.concat(s),O=["case","default","function","var","void","with","const","let","enum","export","import","native","__hasProp","__extends","__slice","__bind","__indexOf","implements","interface","package","private","protected","public","static","yield"],V=["arguments","eval"],w=T.concat(O).concat(V),e.RESERVED=O.concat(T).concat(a).concat(V),e.STRICT_PROSCRIBED=V,t=65279,b=/^([$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)([^\n\S]*:(?!:))?/,A=/^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i,u=/^("""|''')((?:\\[\s\S]|[^\\])*?)(?:\n[^\n\S]*)?\1/,I=/^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>*\/%])\2=?|\?(\.|::)|\.{2,3})/,q=/^[^\n\S]+/,c=/^###([^#][\s\S]*?)(?:###[^\n\S]*|###$)|^(?:\s*#(?!##[^#]).*)+/,r=/^[-=]>/,D=/^(?:\n[^\n\S]*)+/,B=/^'[^\\']*(?:\\[\s\S][^\\']*)*'/,v=/^`[^\\`]*(?:\\.[^\\`]*)*`/,_=/^(\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)([imgy]{0,4})(?!\w)/,f=/^\/{3}((?:\\?[\s\S])+?)\/{3}([imgy]{0,4})(?!\w)/,m=/((?:\\\\)+)|\\(\s|\/)|\s+(?:#.*)?/g,x=/\n/g,d=/\n+([^\n\S]*)/g,p=/\*\//,L=/^\s*(?:,|\??\.(?![.\d])|::)/,P=/\s+$/,l=["-=","+=","/=","*=","%=","||=","&&=","?=","<<=",">>=",">>>=","&=","^=","|=","**=","//=","%%="],U=["NEW","TYPEOF","DELETE","DO"],H=["!","~"],C=["&&","||","&","|","^"],M=["<<",">>",">>>"],h=["==","!=","<",">","<=",">="],E=["*","/","%","//","%%"],$=["IN","OF","INSTANCEOF"],n=["TRUE","FALSE"],S=["NUMBER","REGEX","BOOL","NULL","UNDEFINED","++","--"],R=S.concat(")","}","THIS","IDENTIFIER","STRING","]"),i=["IDENTIFIER","STRING","REGEX",")","]","}","?","::","@","THIS","SUPER"],k=i.concat("NUMBER","BOOL","NULL","UNDEFINED"),F=["INDENT","OUTDENT","TERMINATOR"],g=[")","}","]"]}.call(this),t.exports}(),require["./parser"]=function(){var e={},t={exports:e},n=function(){function e(){this.yy={}}var t={trace:function(){},yy:{},symbols_:{error:2,Root:3,Body:4,Line:5,TERMINATOR:6,Expression:7,Statement:8,Return:9,Comment:10,STATEMENT:11,Value:12,Invocation:13,Code:14,Operation:15,Assign:16,If:17,Try:18,While:19,For:20,Switch:21,Class:22,Throw:23,Block:24,INDENT:25,OUTDENT:26,Identifier:27,IDENTIFIER:28,AlphaNumeric:29,NUMBER:30,STRING:31,Literal:32,JS:33,REGEX:34,DEBUGGER:35,UNDEFINED:36,NULL:37,BOOL:38,Assignable:39,"=":40,AssignObj:41,ObjAssignable:42,":":43,ThisProperty:44,RETURN:45,HERECOMMENT:46,PARAM_START:47,ParamList:48,PARAM_END:49,FuncGlyph:50,"->":51,"=>":52,OptComma:53,",":54,Param:55,ParamVar:56,"...":57,Array:58,Object:59,Splat:60,SimpleAssignable:61,Accessor:62,Parenthetical:63,Range:64,This:65,".":66,"?.":67,"::":68,"?::":69,Index:70,INDEX_START:71,IndexValue:72,INDEX_END:73,INDEX_SOAK:74,Slice:75,"{":76,AssignList:77,"}":78,CLASS:79,EXTENDS:80,OptFuncExist:81,Arguments:82,SUPER:83,FUNC_EXIST:84,CALL_START:85,CALL_END:86,ArgList:87,THIS:88,"@":89,"[":90,"]":91,RangeDots:92,"..":93,Arg:94,SimpleArgs:95,TRY:96,Catch:97,FINALLY:98,CATCH:99,THROW:100,"(":101,")":102,WhileSource:103,WHILE:104,WHEN:105,UNTIL:106,Loop:107,LOOP:108,ForBody:109,FOR:110,ForStart:111,ForSource:112,ForVariables:113,OWN:114,ForValue:115,FORIN:116,FOROF:117,BY:118,SWITCH:119,Whens:120,ELSE:121,When:122,LEADING_WHEN:123,IfBlock:124,IF:125,POST_IF:126,UNARY:127,UNARY_MATH:128,"-":129,"+":130,"--":131,"++":132,"?":133,MATH:134,"**":135,SHIFT:136,COMPARE:137,LOGIC:138,RELATION:139,COMPOUND_ASSIGN:140,$accept:0,$end:1},terminals_:{2:"error",6:"TERMINATOR",11:"STATEMENT",25:"INDENT",26:"OUTDENT",28:"IDENTIFIER",30:"NUMBER",31:"STRING",33:"JS",34:"REGEX",35:"DEBUGGER",36:"UNDEFINED",37:"NULL",38:"BOOL",40:"=",43:":",45:"RETURN",46:"HERECOMMENT",47:"PARAM_START",49:"PARAM_END",51:"->",52:"=>",54:",",57:"...",66:".",67:"?.",68:"::",69:"?::",71:"INDEX_START",73:"INDEX_END",74:"INDEX_SOAK",76:"{",78:"}",79:"CLASS",80:"EXTENDS",83:"SUPER",84:"FUNC_EXIST",85:"CALL_START",86:"CALL_END",88:"THIS",89:"@",90:"[",91:"]",93:"..",96:"TRY",98:"FINALLY",99:"CATCH",100:"THROW",101:"(",102:")",104:"WHILE",105:"WHEN",106:"UNTIL",108:"LOOP",110:"FOR",114:"OWN",116:"FORIN",117:"FOROF",118:"BY",119:"SWITCH",121:"ELSE",123:"LEADING_WHEN",125:"IF",126:"POST_IF",127:"UNARY",128:"UNARY_MATH",129:"-",130:"+",131:"--",132:"++",133:"?",134:"MATH",135:"**",136:"SHIFT",137:"COMPARE",138:"LOGIC",139:"RELATION",140:"COMPOUND_ASSIGN"},productions_:[0,[3,0],[3,1],[4,1],[4,3],[4,2],[5,1],[5,1],[8,1],[8,1],[8,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[24,2],[24,3],[27,1],[29,1],[29,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[32,1],[16,3],[16,4],[16,5],[41,1],[41,3],[41,5],[41,1],[42,1],[42,1],[42,1],[9,2],[9,1],[10,1],[14,5],[14,2],[50,1],[50,1],[53,0],[53,1],[48,0],[48,1],[48,3],[48,4],[48,6],[55,1],[55,2],[55,3],[55,1],[56,1],[56,1],[56,1],[56,1],[60,2],[61,1],[61,2],[61,2],[61,1],[39,1],[39,1],[39,1],[12,1],[12,1],[12,1],[12,1],[12,1],[62,2],[62,2],[62,2],[62,2],[62,1],[62,1],[70,3],[70,2],[72,1],[72,1],[59,4],[77,0],[77,1],[77,3],[77,4],[77,6],[22,1],[22,2],[22,3],[22,4],[22,2],[22,3],[22,4],[22,5],[13,3],[13,3],[13,1],[13,2],[81,0],[81,1],[82,2],[82,4],[65,1],[65,1],[44,2],[58,2],[58,4],[92,1],[92,1],[64,5],[75,3],[75,2],[75,2],[75,1],[87,1],[87,3],[87,4],[87,4],[87,6],[94,1],[94,1],[94,1],[95,1],[95,3],[18,2],[18,3],[18,4],[18,5],[97,3],[97,3],[97,2],[23,2],[63,3],[63,5],[103,2],[103,4],[103,2],[103,4],[19,2],[19,2],[19,2],[19,1],[107,2],[107,2],[20,2],[20,2],[20,2],[109,2],[109,2],[111,2],[111,3],[115,1],[115,1],[115,1],[115,1],[113,1],[113,3],[112,2],[112,2],[112,4],[112,4],[112,4],[112,6],[112,6],[21,5],[21,7],[21,4],[21,6],[120,1],[120,2],[122,3],[122,4],[124,3],[124,5],[17,1],[17,3],[17,3],[17,3],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,2],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,3],[15,5],[15,4],[15,3]],performAction:function(e,t,n,i,r,s,o){var a=s.length-1;switch(r){case 1:return this.$=i.addLocationDataFn(o[a],o[a])(new i.Block);case 2:return this.$=s[a];case 3:this.$=i.addLocationDataFn(o[a],o[a])(i.Block.wrap([s[a]]));break;case 4:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].push(s[a]));break;case 5:this.$=s[a-1];break;case 6:this.$=s[a];break;case 7:this.$=s[a];break;case 8:this.$=s[a];break;case 9:this.$=s[a];break;case 10:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 11:this.$=s[a];break;case 12:this.$=s[a];break;case 13:this.$=s[a];break;case 14:this.$=s[a];break;case 15:this.$=s[a];break;case 16:this.$=s[a];break;case 17:this.$=s[a];break;case 18:this.$=s[a];break;case 19:this.$=s[a];break;case 20:this.$=s[a];break;case 21:this.$=s[a];break;case 22:this.$=s[a];break;case 23:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Block);break;case 24:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-1]);break;case 25:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 26:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 27:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 28:this.$=s[a];break;case 29:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 30:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 31:this.$=i.addLocationDataFn(o[a],o[a])(new i.Literal(s[a]));break;case 32:this.$=i.addLocationDataFn(o[a],o[a])(new i.Undefined);
break;case 33:this.$=i.addLocationDataFn(o[a],o[a])(new i.Null);break;case 34:this.$=i.addLocationDataFn(o[a],o[a])(new i.Bool(s[a]));break;case 35:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(s[a-2],s[a]));break;case 36:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Assign(s[a-3],s[a]));break;case 37:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(s[a-4],s[a-1]));break;case 38:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 39:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(i.addLocationDataFn(o[a-2])(new i.Value(s[a-2])),s[a],"object"));break;case 40:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(i.addLocationDataFn(o[a-4])(new i.Value(s[a-4])),s[a-1],"object"));break;case 41:this.$=s[a];break;case 42:this.$=s[a];break;case 43:this.$=s[a];break;case 44:this.$=s[a];break;case 45:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Return(s[a]));break;case 46:this.$=i.addLocationDataFn(o[a],o[a])(new i.Return);break;case 47:this.$=i.addLocationDataFn(o[a],o[a])(new i.Comment(s[a]));break;case 48:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Code(s[a-3],s[a],s[a-1]));break;case 49:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Code([],s[a],s[a-1]));break;case 50:this.$=i.addLocationDataFn(o[a],o[a])("func");break;case 51:this.$=i.addLocationDataFn(o[a],o[a])("boundfunc");break;case 52:this.$=s[a];break;case 53:this.$=s[a];break;case 54:this.$=i.addLocationDataFn(o[a],o[a])([]);break;case 55:this.$=i.addLocationDataFn(o[a],o[a])([s[a]]);break;case 56:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].concat(s[a]));break;case 57:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-3].concat(s[a]));break;case 58:this.$=i.addLocationDataFn(o[a-5],o[a])(s[a-5].concat(s[a-2]));break;case 59:this.$=i.addLocationDataFn(o[a],o[a])(new i.Param(s[a]));break;case 60:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Param(s[a-1],null,!0));break;case 61:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Param(s[a-2],s[a]));break;case 62:this.$=i.addLocationDataFn(o[a],o[a])(new i.Expansion);break;case 63:this.$=s[a];break;case 64:this.$=s[a];break;case 65:this.$=s[a];break;case 66:this.$=s[a];break;case 67:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Splat(s[a-1]));break;case 68:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 69:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a-1].add(s[a]));break;case 70:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Value(s[a-1],[].concat(s[a])));break;case 71:this.$=s[a];break;case 72:this.$=s[a];break;case 73:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 74:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 75:this.$=s[a];break;case 76:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 77:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 78:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 79:this.$=s[a];break;case 80:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(s[a]));break;case 81:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Access(s[a],"soak"));break;case 82:this.$=i.addLocationDataFn(o[a-1],o[a])([i.addLocationDataFn(o[a-1])(new i.Access(new i.Literal("prototype"))),i.addLocationDataFn(o[a])(new i.Access(s[a]))]);break;case 83:this.$=i.addLocationDataFn(o[a-1],o[a])([i.addLocationDataFn(o[a-1])(new i.Access(new i.Literal("prototype"),"soak")),i.addLocationDataFn(o[a])(new i.Access(s[a]))]);break;case 84:this.$=i.addLocationDataFn(o[a],o[a])(new i.Access(new i.Literal("prototype")));break;case 85:this.$=s[a];break;case 86:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-1]);break;case 87:this.$=i.addLocationDataFn(o[a-1],o[a])(i.extend(s[a],{soak:!0}));break;case 88:this.$=i.addLocationDataFn(o[a],o[a])(new i.Index(s[a]));break;case 89:this.$=i.addLocationDataFn(o[a],o[a])(new i.Slice(s[a]));break;case 90:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Obj(s[a-2],s[a-3].generated));break;case 91:this.$=i.addLocationDataFn(o[a],o[a])([]);break;case 92:this.$=i.addLocationDataFn(o[a],o[a])([s[a]]);break;case 93:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].concat(s[a]));break;case 94:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-3].concat(s[a]));break;case 95:this.$=i.addLocationDataFn(o[a-5],o[a])(s[a-5].concat(s[a-2]));break;case 96:this.$=i.addLocationDataFn(o[a],o[a])(new i.Class);break;case 97:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Class(null,null,s[a]));break;case 98:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Class(null,s[a]));break;case 99:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Class(null,s[a-1],s[a]));break;case 100:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Class(s[a]));break;case 101:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Class(s[a-1],null,s[a]));break;case 102:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Class(s[a-2],s[a]));break;case 103:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Class(s[a-3],s[a-1],s[a]));break;case 104:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Call(s[a-2],s[a],s[a-1]));break;case 105:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Call(s[a-2],s[a],s[a-1]));break;case 106:this.$=i.addLocationDataFn(o[a],o[a])(new i.Call("super",[new i.Splat(new i.Literal("arguments"))]));break;case 107:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Call("super",s[a]));break;case 108:this.$=i.addLocationDataFn(o[a],o[a])(!1);break;case 109:this.$=i.addLocationDataFn(o[a],o[a])(!0);break;case 110:this.$=i.addLocationDataFn(o[a-1],o[a])([]);break;case 111:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-2]);break;case 112:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(new i.Literal("this")));break;case 113:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(new i.Literal("this")));break;case 114:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Value(i.addLocationDataFn(o[a-1])(new i.Literal("this")),[i.addLocationDataFn(o[a])(new i.Access(s[a]))],"this"));break;case 115:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Arr([]));break;case 116:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Arr(s[a-2]));break;case 117:this.$=i.addLocationDataFn(o[a],o[a])("inclusive");break;case 118:this.$=i.addLocationDataFn(o[a],o[a])("exclusive");break;case 119:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Range(s[a-3],s[a-1],s[a-2]));break;case 120:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Range(s[a-2],s[a],s[a-1]));break;case 121:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Range(s[a-1],null,s[a]));break;case 122:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Range(null,s[a],s[a-1]));break;case 123:this.$=i.addLocationDataFn(o[a],o[a])(new i.Range(null,null,s[a]));break;case 124:this.$=i.addLocationDataFn(o[a],o[a])([s[a]]);break;case 125:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].concat(s[a]));break;case 126:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-3].concat(s[a]));break;case 127:this.$=i.addLocationDataFn(o[a-3],o[a])(s[a-2]);break;case 128:this.$=i.addLocationDataFn(o[a-5],o[a])(s[a-5].concat(s[a-2]));break;case 129:this.$=s[a];break;case 130:this.$=s[a];break;case 131:this.$=i.addLocationDataFn(o[a],o[a])(new i.Expansion);break;case 132:this.$=s[a];break;case 133:this.$=i.addLocationDataFn(o[a-2],o[a])([].concat(s[a-2],s[a]));break;case 134:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Try(s[a]));break;case 135:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Try(s[a-1],s[a][0],s[a][1]));break;case 136:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Try(s[a-2],null,null,s[a]));break;case 137:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Try(s[a-3],s[a-2][0],s[a-2][1],s[a]));break;case 138:this.$=i.addLocationDataFn(o[a-2],o[a])([s[a-1],s[a]]);break;case 139:this.$=i.addLocationDataFn(o[a-2],o[a])([i.addLocationDataFn(o[a-1])(new i.Value(s[a-1])),s[a]]);break;case 140:this.$=i.addLocationDataFn(o[a-1],o[a])([null,s[a]]);break;case 141:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Throw(s[a]));break;case 142:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Parens(s[a-1]));break;case 143:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Parens(s[a-2]));break;case 144:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(s[a]));break;case 145:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.While(s[a-2],{guard:s[a]}));break;case 146:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(s[a],{invert:!0}));break;case 147:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.While(s[a-2],{invert:!0,guard:s[a]}));break;case 148:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a-1].addBody(s[a]));break;case 149:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a].addBody(i.addLocationDataFn(o[a-1])(i.Block.wrap([s[a-1]]))));break;case 150:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a].addBody(i.addLocationDataFn(o[a-1])(i.Block.wrap([s[a-1]]))));break;case 151:this.$=i.addLocationDataFn(o[a],o[a])(s[a]);break;case 152:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(i.addLocationDataFn(o[a-1])(new i.Literal("true"))).addBody(s[a]));break;case 153:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.While(i.addLocationDataFn(o[a-1])(new i.Literal("true"))).addBody(i.addLocationDataFn(o[a])(i.Block.wrap([s[a]]))));break;case 154:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(s[a-1],s[a]));break;case 155:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(s[a-1],s[a]));break;case 156:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.For(s[a],s[a-1]));break;case 157:this.$=i.addLocationDataFn(o[a-1],o[a])({source:i.addLocationDataFn(o[a])(new i.Value(s[a]))});break;case 158:this.$=i.addLocationDataFn(o[a-1],o[a])(function(){return s[a].own=s[a-1].own,s[a].name=s[a-1][0],s[a].index=s[a-1][1],s[a]}());break;case 159:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a]);break;case 160:this.$=i.addLocationDataFn(o[a-2],o[a])(function(){return s[a].own=!0,s[a]}());break;case 161:this.$=s[a];break;case 162:this.$=s[a];break;case 163:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 164:this.$=i.addLocationDataFn(o[a],o[a])(new i.Value(s[a]));break;case 165:this.$=i.addLocationDataFn(o[a],o[a])([s[a]]);break;case 166:this.$=i.addLocationDataFn(o[a-2],o[a])([s[a-2],s[a]]);break;case 167:this.$=i.addLocationDataFn(o[a-1],o[a])({source:s[a]});break;case 168:this.$=i.addLocationDataFn(o[a-1],o[a])({source:s[a],object:!0});break;case 169:this.$=i.addLocationDataFn(o[a-3],o[a])({source:s[a-2],guard:s[a]});break;case 170:this.$=i.addLocationDataFn(o[a-3],o[a])({source:s[a-2],guard:s[a],object:!0});break;case 171:this.$=i.addLocationDataFn(o[a-3],o[a])({source:s[a-2],step:s[a]});break;case 172:this.$=i.addLocationDataFn(o[a-5],o[a])({source:s[a-4],guard:s[a-2],step:s[a]});break;case 173:this.$=i.addLocationDataFn(o[a-5],o[a])({source:s[a-4],step:s[a-2],guard:s[a]});break;case 174:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Switch(s[a-3],s[a-1]));break;case 175:this.$=i.addLocationDataFn(o[a-6],o[a])(new i.Switch(s[a-5],s[a-3],s[a-1]));break;case 176:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Switch(null,s[a-1]));break;case 177:this.$=i.addLocationDataFn(o[a-5],o[a])(new i.Switch(null,s[a-3],s[a-1]));break;case 178:this.$=s[a];break;case 179:this.$=i.addLocationDataFn(o[a-1],o[a])(s[a-1].concat(s[a]));break;case 180:this.$=i.addLocationDataFn(o[a-2],o[a])([[s[a-1],s[a]]]);break;case 181:this.$=i.addLocationDataFn(o[a-3],o[a])([[s[a-2],s[a-1]]]);break;case 182:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a-1],s[a],{type:s[a-2]}));break;case 183:this.$=i.addLocationDataFn(o[a-4],o[a])(s[a-4].addElse(i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a-1],s[a],{type:s[a-2]}))));break;case 184:this.$=s[a];break;case 185:this.$=i.addLocationDataFn(o[a-2],o[a])(s[a-2].addElse(s[a]));break;case 186:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a],i.addLocationDataFn(o[a-2])(i.Block.wrap([s[a-2]])),{type:s[a-1],statement:!0}));break;case 187:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.If(s[a],i.addLocationDataFn(o[a-2])(i.Block.wrap([s[a-2]])),{type:s[a-1],statement:!0}));break;case 188:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op(s[a-1],s[a]));break;case 189:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op(s[a-1],s[a]));break;case 190:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("-",s[a]));break;case 191:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("+",s[a]));break;case 192:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("--",s[a]));break;case 193:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("++",s[a]));break;case 194:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("--",s[a-1],null,!0));break;case 195:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Op("++",s[a-1],null,!0));break;case 196:this.$=i.addLocationDataFn(o[a-1],o[a])(new i.Existence(s[a-1]));break;case 197:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op("+",s[a-2],s[a]));break;case 198:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op("-",s[a-2],s[a]));break;case 199:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-1],s[a-2],s[a]));break;case 200:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-1],s[a-2],s[a]));break;case 201:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-1],s[a-2],s[a]));break;case 202:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-1],s[a-2],s[a]));break;case 203:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Op(s[a-1],s[a-2],s[a]));break;case 204:this.$=i.addLocationDataFn(o[a-2],o[a])(function(){return"!"===s[a-1].charAt(0)?new i.Op(s[a-1].slice(1),s[a-2],s[a]).invert():new i.Op(s[a-1],s[a-2],s[a])}());break;case 205:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Assign(s[a-2],s[a],s[a-1]));break;case 206:this.$=i.addLocationDataFn(o[a-4],o[a])(new i.Assign(s[a-4],s[a-1],s[a-3]));break;case 207:this.$=i.addLocationDataFn(o[a-3],o[a])(new i.Assign(s[a-3],s[a],s[a-2]));break;case 208:this.$=i.addLocationDataFn(o[a-2],o[a])(new i.Extends(s[a-2],s[a]))}},table:[{1:[2,1],3:1,4:2,5:3,7:4,8:5,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[3]},{1:[2,2],6:[1,73]},{1:[2,3],6:[2,3],26:[2,3],102:[2,3]},{1:[2,6],6:[2,6],26:[2,6],102:[2,6],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,7],6:[2,7],26:[2,7],102:[2,7],103:87,104:[1,64],106:[1,65],109:88,110:[1,67],111:68,126:[1,86]},{1:[2,11],6:[2,11],25:[2,11],26:[2,11],49:[2,11],54:[2,11],57:[2,11],62:90,66:[1,92],67:[1,93],68:[1,94],69:[1,95],70:96,71:[1,97],73:[2,11],74:[1,98],78:[2,11],81:89,84:[1,91],85:[2,108],86:[2,11],91:[2,11],93:[2,11],102:[2,11],104:[2,11],105:[2,11],106:[2,11],110:[2,11],118:[2,11],126:[2,11],129:[2,11],130:[2,11],133:[2,11],134:[2,11],135:[2,11],136:[2,11],137:[2,11],138:[2,11],139:[2,11]},{1:[2,12],6:[2,12],25:[2,12],26:[2,12],49:[2,12],54:[2,12],57:[2,12],62:100,66:[1,92],67:[1,93],68:[1,94],69:[1,95],70:96,71:[1,97],73:[2,12],74:[1,98],78:[2,12],81:99,84:[1,91],85:[2,108],86:[2,12],91:[2,12],93:[2,12],102:[2,12],104:[2,12],105:[2,12],106:[2,12],110:[2,12],118:[2,12],126:[2,12],129:[2,12],130:[2,12],133:[2,12],134:[2,12],135:[2,12],136:[2,12],137:[2,12],138:[2,12],139:[2,12]},{1:[2,13],6:[2,13],25:[2,13],26:[2,13],49:[2,13],54:[2,13],57:[2,13],73:[2,13],78:[2,13],86:[2,13],91:[2,13],93:[2,13],102:[2,13],104:[2,13],105:[2,13],106:[2,13],110:[2,13],118:[2,13],126:[2,13],129:[2,13],130:[2,13],133:[2,13],134:[2,13],135:[2,13],136:[2,13],137:[2,13],138:[2,13],139:[2,13]},{1:[2,14],6:[2,14],25:[2,14],26:[2,14],49:[2,14],54:[2,14],57:[2,14],73:[2,14],78:[2,14],86:[2,14],91:[2,14],93:[2,14],102:[2,14],104:[2,14],105:[2,14],106:[2,14],110:[2,14],118:[2,14],126:[2,14],129:[2,14],130:[2,14],133:[2,14],134:[2,14],135:[2,14],136:[2,14],137:[2,14],138:[2,14],139:[2,14]},{1:[2,15],6:[2,15],25:[2,15],26:[2,15],49:[2,15],54:[2,15],57:[2,15],73:[2,15],78:[2,15],86:[2,15],91:[2,15],93:[2,15],102:[2,15],104:[2,15],105:[2,15],106:[2,15],110:[2,15],118:[2,15],126:[2,15],129:[2,15],130:[2,15],133:[2,15],134:[2,15],135:[2,15],136:[2,15],137:[2,15],138:[2,15],139:[2,15]},{1:[2,16],6:[2,16],25:[2,16],26:[2,16],49:[2,16],54:[2,16],57:[2,16],73:[2,16],78:[2,16],86:[2,16],91:[2,16],93:[2,16],102:[2,16],104:[2,16],105:[2,16],106:[2,16],110:[2,16],118:[2,16],126:[2,16],129:[2,16],130:[2,16],133:[2,16],134:[2,16],135:[2,16],136:[2,16],137:[2,16],138:[2,16],139:[2,16]},{1:[2,17],6:[2,17],25:[2,17],26:[2,17],49:[2,17],54:[2,17],57:[2,17],73:[2,17],78:[2,17],86:[2,17],91:[2,17],93:[2,17],102:[2,17],104:[2,17],105:[2,17],106:[2,17],110:[2,17],118:[2,17],126:[2,17],129:[2,17],130:[2,17],133:[2,17],134:[2,17],135:[2,17],136:[2,17],137:[2,17],138:[2,17],139:[2,17]},{1:[2,18],6:[2,18],25:[2,18],26:[2,18],49:[2,18],54:[2,18],57:[2,18],73:[2,18],78:[2,18],86:[2,18],91:[2,18],93:[2,18],102:[2,18],104:[2,18],105:[2,18],106:[2,18],110:[2,18],118:[2,18],126:[2,18],129:[2,18],130:[2,18],133:[2,18],134:[2,18],135:[2,18],136:[2,18],137:[2,18],138:[2,18],139:[2,18]},{1:[2,19],6:[2,19],25:[2,19],26:[2,19],49:[2,19],54:[2,19],57:[2,19],73:[2,19],78:[2,19],86:[2,19],91:[2,19],93:[2,19],102:[2,19],104:[2,19],105:[2,19],106:[2,19],110:[2,19],118:[2,19],126:[2,19],129:[2,19],130:[2,19],133:[2,19],134:[2,19],135:[2,19],136:[2,19],137:[2,19],138:[2,19],139:[2,19]},{1:[2,20],6:[2,20],25:[2,20],26:[2,20],49:[2,20],54:[2,20],57:[2,20],73:[2,20],78:[2,20],86:[2,20],91:[2,20],93:[2,20],102:[2,20],104:[2,20],105:[2,20],106:[2,20],110:[2,20],118:[2,20],126:[2,20],129:[2,20],130:[2,20],133:[2,20],134:[2,20],135:[2,20],136:[2,20],137:[2,20],138:[2,20],139:[2,20]},{1:[2,21],6:[2,21],25:[2,21],26:[2,21],49:[2,21],54:[2,21],57:[2,21],73:[2,21],78:[2,21],86:[2,21],91:[2,21],93:[2,21],102:[2,21],104:[2,21],105:[2,21],106:[2,21],110:[2,21],118:[2,21],126:[2,21],129:[2,21],130:[2,21],133:[2,21],134:[2,21],135:[2,21],136:[2,21],137:[2,21],138:[2,21],139:[2,21]},{1:[2,22],6:[2,22],25:[2,22],26:[2,22],49:[2,22],54:[2,22],57:[2,22],73:[2,22],78:[2,22],86:[2,22],91:[2,22],93:[2,22],102:[2,22],104:[2,22],105:[2,22],106:[2,22],110:[2,22],118:[2,22],126:[2,22],129:[2,22],130:[2,22],133:[2,22],134:[2,22],135:[2,22],136:[2,22],137:[2,22],138:[2,22],139:[2,22]},{1:[2,8],6:[2,8],26:[2,8],102:[2,8],104:[2,8],106:[2,8],110:[2,8],126:[2,8]},{1:[2,9],6:[2,9],26:[2,9],102:[2,9],104:[2,9],106:[2,9],110:[2,9],126:[2,9]},{1:[2,10],6:[2,10],26:[2,10],102:[2,10],104:[2,10],106:[2,10],110:[2,10],126:[2,10]},{1:[2,75],6:[2,75],25:[2,75],26:[2,75],40:[1,101],49:[2,75],54:[2,75],57:[2,75],66:[2,75],67:[2,75],68:[2,75],69:[2,75],71:[2,75],73:[2,75],74:[2,75],78:[2,75],84:[2,75],85:[2,75],86:[2,75],91:[2,75],93:[2,75],102:[2,75],104:[2,75],105:[2,75],106:[2,75],110:[2,75],118:[2,75],126:[2,75],129:[2,75],130:[2,75],133:[2,75],134:[2,75],135:[2,75],136:[2,75],137:[2,75],138:[2,75],139:[2,75]},{1:[2,76],6:[2,76],25:[2,76],26:[2,76],49:[2,76],54:[2,76],57:[2,76],66:[2,76],67:[2,76],68:[2,76],69:[2,76],71:[2,76],73:[2,76],74:[2,76],78:[2,76],84:[2,76],85:[2,76],86:[2,76],91:[2,76],93:[2,76],102:[2,76],104:[2,76],105:[2,76],106:[2,76],110:[2,76],118:[2,76],126:[2,76],129:[2,76],130:[2,76],133:[2,76],134:[2,76],135:[2,76],136:[2,76],137:[2,76],138:[2,76],139:[2,76]},{1:[2,77],6:[2,77],25:[2,77],26:[2,77],49:[2,77],54:[2,77],57:[2,77],66:[2,77],67:[2,77],68:[2,77],69:[2,77],71:[2,77],73:[2,77],74:[2,77],78:[2,77],84:[2,77],85:[2,77],86:[2,77],91:[2,77],93:[2,77],102:[2,77],104:[2,77],105:[2,77],106:[2,77],110:[2,77],118:[2,77],126:[2,77],129:[2,77],130:[2,77],133:[2,77],134:[2,77],135:[2,77],136:[2,77],137:[2,77],138:[2,77],139:[2,77]},{1:[2,78],6:[2,78],25:[2,78],26:[2,78],49:[2,78],54:[2,78],57:[2,78],66:[2,78],67:[2,78],68:[2,78],69:[2,78],71:[2,78],73:[2,78],74:[2,78],78:[2,78],84:[2,78],85:[2,78],86:[2,78],91:[2,78],93:[2,78],102:[2,78],104:[2,78],105:[2,78],106:[2,78],110:[2,78],118:[2,78],126:[2,78],129:[2,78],130:[2,78],133:[2,78],134:[2,78],135:[2,78],136:[2,78],137:[2,78],138:[2,78],139:[2,78]},{1:[2,79],6:[2,79],25:[2,79],26:[2,79],49:[2,79],54:[2,79],57:[2,79],66:[2,79],67:[2,79],68:[2,79],69:[2,79],71:[2,79],73:[2,79],74:[2,79],78:[2,79],84:[2,79],85:[2,79],86:[2,79],91:[2,79],93:[2,79],102:[2,79],104:[2,79],105:[2,79],106:[2,79],110:[2,79],118:[2,79],126:[2,79],129:[2,79],130:[2,79],133:[2,79],134:[2,79],135:[2,79],136:[2,79],137:[2,79],138:[2,79],139:[2,79]},{1:[2,106],6:[2,106],25:[2,106],26:[2,106],49:[2,106],54:[2,106],57:[2,106],66:[2,106],67:[2,106],68:[2,106],69:[2,106],71:[2,106],73:[2,106],74:[2,106],78:[2,106],82:102,84:[2,106],85:[1,103],86:[2,106],91:[2,106],93:[2,106],102:[2,106],104:[2,106],105:[2,106],106:[2,106],110:[2,106],118:[2,106],126:[2,106],129:[2,106],130:[2,106],133:[2,106],134:[2,106],135:[2,106],136:[2,106],137:[2,106],138:[2,106],139:[2,106]},{6:[2,54],25:[2,54],27:108,28:[1,72],44:109,48:104,49:[2,54],54:[2,54],55:105,56:106,57:[1,107],58:110,59:111,76:[1,69],89:[1,112],90:[1,113]},{24:114,25:[1,115]},{7:116,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:118,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:119,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:120,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{12:122,13:123,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:124,44:62,58:46,59:47,61:121,63:23,64:24,65:25,76:[1,69],83:[1,26],88:[1,57],89:[1,58],90:[1,56],101:[1,55]},{12:122,13:123,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:124,44:62,58:46,59:47,61:125,63:23,64:24,65:25,76:[1,69],83:[1,26],88:[1,57],89:[1,58],90:[1,56],101:[1,55]},{1:[2,72],6:[2,72],25:[2,72],26:[2,72],40:[2,72],49:[2,72],54:[2,72],57:[2,72],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,72],74:[2,72],78:[2,72],80:[1,129],84:[2,72],85:[2,72],86:[2,72],91:[2,72],93:[2,72],102:[2,72],104:[2,72],105:[2,72],106:[2,72],110:[2,72],118:[2,72],126:[2,72],129:[2,72],130:[2,72],131:[1,126],132:[1,127],133:[2,72],134:[2,72],135:[2,72],136:[2,72],137:[2,72],138:[2,72],139:[2,72],140:[1,128]},{1:[2,184],6:[2,184],25:[2,184],26:[2,184],49:[2,184],54:[2,184],57:[2,184],73:[2,184],78:[2,184],86:[2,184],91:[2,184],93:[2,184],102:[2,184],104:[2,184],105:[2,184],106:[2,184],110:[2,184],118:[2,184],121:[1,130],126:[2,184],129:[2,184],130:[2,184],133:[2,184],134:[2,184],135:[2,184],136:[2,184],137:[2,184],138:[2,184],139:[2,184]},{24:131,25:[1,115]},{24:132,25:[1,115]},{1:[2,151],6:[2,151],25:[2,151],26:[2,151],49:[2,151],54:[2,151],57:[2,151],73:[2,151],78:[2,151],86:[2,151],91:[2,151],93:[2,151],102:[2,151],104:[2,151],105:[2,151],106:[2,151],110:[2,151],118:[2,151],126:[2,151],129:[2,151],130:[2,151],133:[2,151],134:[2,151],135:[2,151],136:[2,151],137:[2,151],138:[2,151],139:[2,151]},{24:133,25:[1,115]},{7:134,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,135],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,96],6:[2,96],12:122,13:123,24:136,25:[1,115],26:[2,96],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:124,44:62,49:[2,96],54:[2,96],57:[2,96],58:46,59:47,61:138,63:23,64:24,65:25,73:[2,96],76:[1,69],78:[2,96],80:[1,137],83:[1,26],86:[2,96],88:[1,57],89:[1,58],90:[1,56],91:[2,96],93:[2,96],101:[1,55],102:[2,96],104:[2,96],105:[2,96],106:[2,96],110:[2,96],118:[2,96],126:[2,96],129:[2,96],130:[2,96],133:[2,96],134:[2,96],135:[2,96],136:[2,96],137:[2,96],138:[2,96],139:[2,96]},{7:139,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,46],6:[2,46],7:140,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,26:[2,46],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],102:[2,46],103:38,104:[2,46],106:[2,46],107:39,108:[1,66],109:40,110:[2,46],111:68,119:[1,41],124:36,125:[1,63],126:[2,46],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,47],6:[2,47],25:[2,47],26:[2,47],54:[2,47],78:[2,47],102:[2,47],104:[2,47],106:[2,47],110:[2,47],126:[2,47]},{1:[2,73],6:[2,73],25:[2,73],26:[2,73],40:[2,73],49:[2,73],54:[2,73],57:[2,73],66:[2,73],67:[2,73],68:[2,73],69:[2,73],71:[2,73],73:[2,73],74:[2,73],78:[2,73],84:[2,73],85:[2,73],86:[2,73],91:[2,73],93:[2,73],102:[2,73],104:[2,73],105:[2,73],106:[2,73],110:[2,73],118:[2,73],126:[2,73],129:[2,73],130:[2,73],133:[2,73],134:[2,73],135:[2,73],136:[2,73],137:[2,73],138:[2,73],139:[2,73]},{1:[2,74],6:[2,74],25:[2,74],26:[2,74],40:[2,74],49:[2,74],54:[2,74],57:[2,74],66:[2,74],67:[2,74],68:[2,74],69:[2,74],71:[2,74],73:[2,74],74:[2,74],78:[2,74],84:[2,74],85:[2,74],86:[2,74],91:[2,74],93:[2,74],102:[2,74],104:[2,74],105:[2,74],106:[2,74],110:[2,74],118:[2,74],126:[2,74],129:[2,74],130:[2,74],133:[2,74],134:[2,74],135:[2,74],136:[2,74],137:[2,74],138:[2,74],139:[2,74]},{1:[2,28],6:[2,28],25:[2,28],26:[2,28],49:[2,28],54:[2,28],57:[2,28],66:[2,28],67:[2,28],68:[2,28],69:[2,28],71:[2,28],73:[2,28],74:[2,28],78:[2,28],84:[2,28],85:[2,28],86:[2,28],91:[2,28],93:[2,28],102:[2,28],104:[2,28],105:[2,28],106:[2,28],110:[2,28],118:[2,28],126:[2,28],129:[2,28],130:[2,28],133:[2,28],134:[2,28],135:[2,28],136:[2,28],137:[2,28],138:[2,28],139:[2,28]},{1:[2,29],6:[2,29],25:[2,29],26:[2,29],49:[2,29],54:[2,29],57:[2,29],66:[2,29],67:[2,29],68:[2,29],69:[2,29],71:[2,29],73:[2,29],74:[2,29],78:[2,29],84:[2,29],85:[2,29],86:[2,29],91:[2,29],93:[2,29],102:[2,29],104:[2,29],105:[2,29],106:[2,29],110:[2,29],118:[2,29],126:[2,29],129:[2,29],130:[2,29],133:[2,29],134:[2,29],135:[2,29],136:[2,29],137:[2,29],138:[2,29],139:[2,29]},{1:[2,30],6:[2,30],25:[2,30],26:[2,30],49:[2,30],54:[2,30],57:[2,30],66:[2,30],67:[2,30],68:[2,30],69:[2,30],71:[2,30],73:[2,30],74:[2,30],78:[2,30],84:[2,30],85:[2,30],86:[2,30],91:[2,30],93:[2,30],102:[2,30],104:[2,30],105:[2,30],106:[2,30],110:[2,30],118:[2,30],126:[2,30],129:[2,30],130:[2,30],133:[2,30],134:[2,30],135:[2,30],136:[2,30],137:[2,30],138:[2,30],139:[2,30]},{1:[2,31],6:[2,31],25:[2,31],26:[2,31],49:[2,31],54:[2,31],57:[2,31],66:[2,31],67:[2,31],68:[2,31],69:[2,31],71:[2,31],73:[2,31],74:[2,31],78:[2,31],84:[2,31],85:[2,31],86:[2,31],91:[2,31],93:[2,31],102:[2,31],104:[2,31],105:[2,31],106:[2,31],110:[2,31],118:[2,31],126:[2,31],129:[2,31],130:[2,31],133:[2,31],134:[2,31],135:[2,31],136:[2,31],137:[2,31],138:[2,31],139:[2,31]},{1:[2,32],6:[2,32],25:[2,32],26:[2,32],49:[2,32],54:[2,32],57:[2,32],66:[2,32],67:[2,32],68:[2,32],69:[2,32],71:[2,32],73:[2,32],74:[2,32],78:[2,32],84:[2,32],85:[2,32],86:[2,32],91:[2,32],93:[2,32],102:[2,32],104:[2,32],105:[2,32],106:[2,32],110:[2,32],118:[2,32],126:[2,32],129:[2,32],130:[2,32],133:[2,32],134:[2,32],135:[2,32],136:[2,32],137:[2,32],138:[2,32],139:[2,32]},{1:[2,33],6:[2,33],25:[2,33],26:[2,33],49:[2,33],54:[2,33],57:[2,33],66:[2,33],67:[2,33],68:[2,33],69:[2,33],71:[2,33],73:[2,33],74:[2,33],78:[2,33],84:[2,33],85:[2,33],86:[2,33],91:[2,33],93:[2,33],102:[2,33],104:[2,33],105:[2,33],106:[2,33],110:[2,33],118:[2,33],126:[2,33],129:[2,33],130:[2,33],133:[2,33],134:[2,33],135:[2,33],136:[2,33],137:[2,33],138:[2,33],139:[2,33]},{1:[2,34],6:[2,34],25:[2,34],26:[2,34],49:[2,34],54:[2,34],57:[2,34],66:[2,34],67:[2,34],68:[2,34],69:[2,34],71:[2,34],73:[2,34],74:[2,34],78:[2,34],84:[2,34],85:[2,34],86:[2,34],91:[2,34],93:[2,34],102:[2,34],104:[2,34],105:[2,34],106:[2,34],110:[2,34],118:[2,34],126:[2,34],129:[2,34],130:[2,34],133:[2,34],134:[2,34],135:[2,34],136:[2,34],137:[2,34],138:[2,34],139:[2,34]},{4:141,5:3,7:4,8:5,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,142],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:143,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,147],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],87:145,88:[1,57],89:[1,58],90:[1,56],91:[1,144],94:146,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,112],6:[2,112],25:[2,112],26:[2,112],49:[2,112],54:[2,112],57:[2,112],66:[2,112],67:[2,112],68:[2,112],69:[2,112],71:[2,112],73:[2,112],74:[2,112],78:[2,112],84:[2,112],85:[2,112],86:[2,112],91:[2,112],93:[2,112],102:[2,112],104:[2,112],105:[2,112],106:[2,112],110:[2,112],118:[2,112],126:[2,112],129:[2,112],130:[2,112],133:[2,112],134:[2,112],135:[2,112],136:[2,112],137:[2,112],138:[2,112],139:[2,112]},{1:[2,113],6:[2,113],25:[2,113],26:[2,113],27:150,28:[1,72],49:[2,113],54:[2,113],57:[2,113],66:[2,113],67:[2,113],68:[2,113],69:[2,113],71:[2,113],73:[2,113],74:[2,113],78:[2,113],84:[2,113],85:[2,113],86:[2,113],91:[2,113],93:[2,113],102:[2,113],104:[2,113],105:[2,113],106:[2,113],110:[2,113],118:[2,113],126:[2,113],129:[2,113],130:[2,113],133:[2,113],134:[2,113],135:[2,113],136:[2,113],137:[2,113],138:[2,113],139:[2,113]},{25:[2,50]},{25:[2,51]},{1:[2,68],6:[2,68],25:[2,68],26:[2,68],40:[2,68],49:[2,68],54:[2,68],57:[2,68],66:[2,68],67:[2,68],68:[2,68],69:[2,68],71:[2,68],73:[2,68],74:[2,68],78:[2,68],80:[2,68],84:[2,68],85:[2,68],86:[2,68],91:[2,68],93:[2,68],102:[2,68],104:[2,68],105:[2,68],106:[2,68],110:[2,68],118:[2,68],126:[2,68],129:[2,68],130:[2,68],131:[2,68],132:[2,68],133:[2,68],134:[2,68],135:[2,68],136:[2,68],137:[2,68],138:[2,68],139:[2,68],140:[2,68]},{1:[2,71],6:[2,71],25:[2,71],26:[2,71],40:[2,71],49:[2,71],54:[2,71],57:[2,71],66:[2,71],67:[2,71],68:[2,71],69:[2,71],71:[2,71],73:[2,71],74:[2,71],78:[2,71],80:[2,71],84:[2,71],85:[2,71],86:[2,71],91:[2,71],93:[2,71],102:[2,71],104:[2,71],105:[2,71],106:[2,71],110:[2,71],118:[2,71],126:[2,71],129:[2,71],130:[2,71],131:[2,71],132:[2,71],133:[2,71],134:[2,71],135:[2,71],136:[2,71],137:[2,71],138:[2,71],139:[2,71],140:[2,71]},{7:151,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:152,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:153,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:155,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:154,25:[1,115],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{27:160,28:[1,72],44:161,58:162,59:163,64:156,76:[1,69],89:[1,112],90:[1,56],113:157,114:[1,158],115:159},{112:164,116:[1,165],117:[1,166]},{6:[2,91],10:170,25:[2,91],27:171,28:[1,72],29:172,30:[1,70],31:[1,71],41:168,42:169,44:173,46:[1,45],54:[2,91],77:167,78:[2,91],89:[1,112]},{1:[2,26],6:[2,26],25:[2,26],26:[2,26],43:[2,26],49:[2,26],54:[2,26],57:[2,26],66:[2,26],67:[2,26],68:[2,26],69:[2,26],71:[2,26],73:[2,26],74:[2,26],78:[2,26],84:[2,26],85:[2,26],86:[2,26],91:[2,26],93:[2,26],102:[2,26],104:[2,26],105:[2,26],106:[2,26],110:[2,26],118:[2,26],126:[2,26],129:[2,26],130:[2,26],133:[2,26],134:[2,26],135:[2,26],136:[2,26],137:[2,26],138:[2,26],139:[2,26]},{1:[2,27],6:[2,27],25:[2,27],26:[2,27],43:[2,27],49:[2,27],54:[2,27],57:[2,27],66:[2,27],67:[2,27],68:[2,27],69:[2,27],71:[2,27],73:[2,27],74:[2,27],78:[2,27],84:[2,27],85:[2,27],86:[2,27],91:[2,27],93:[2,27],102:[2,27],104:[2,27],105:[2,27],106:[2,27],110:[2,27],118:[2,27],126:[2,27],129:[2,27],130:[2,27],133:[2,27],134:[2,27],135:[2,27],136:[2,27],137:[2,27],138:[2,27],139:[2,27]},{1:[2,25],6:[2,25],25:[2,25],26:[2,25],40:[2,25],43:[2,25],49:[2,25],54:[2,25],57:[2,25],66:[2,25],67:[2,25],68:[2,25],69:[2,25],71:[2,25],73:[2,25],74:[2,25],78:[2,25],80:[2,25],84:[2,25],85:[2,25],86:[2,25],91:[2,25],93:[2,25],102:[2,25],104:[2,25],105:[2,25],106:[2,25],110:[2,25],116:[2,25],117:[2,25],118:[2,25],126:[2,25],129:[2,25],130:[2,25],131:[2,25],132:[2,25],133:[2,25],134:[2,25],135:[2,25],136:[2,25],137:[2,25],138:[2,25],139:[2,25],140:[2,25]},{1:[2,5],5:174,6:[2,5],7:4,8:5,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,26:[2,5],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],102:[2,5],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,196],6:[2,196],25:[2,196],26:[2,196],49:[2,196],54:[2,196],57:[2,196],73:[2,196],78:[2,196],86:[2,196],91:[2,196],93:[2,196],102:[2,196],104:[2,196],105:[2,196],106:[2,196],110:[2,196],118:[2,196],126:[2,196],129:[2,196],130:[2,196],133:[2,196],134:[2,196],135:[2,196],136:[2,196],137:[2,196],138:[2,196],139:[2,196]},{7:175,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:176,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:177,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:178,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:179,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:180,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:181,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:182,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:183,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,150],6:[2,150],25:[2,150],26:[2,150],49:[2,150],54:[2,150],57:[2,150],73:[2,150],78:[2,150],86:[2,150],91:[2,150],93:[2,150],102:[2,150],104:[2,150],105:[2,150],106:[2,150],110:[2,150],118:[2,150],126:[2,150],129:[2,150],130:[2,150],133:[2,150],134:[2,150],135:[2,150],136:[2,150],137:[2,150],138:[2,150],139:[2,150]},{1:[2,155],6:[2,155],25:[2,155],26:[2,155],49:[2,155],54:[2,155],57:[2,155],73:[2,155],78:[2,155],86:[2,155],91:[2,155],93:[2,155],102:[2,155],104:[2,155],105:[2,155],106:[2,155],110:[2,155],118:[2,155],126:[2,155],129:[2,155],130:[2,155],133:[2,155],134:[2,155],135:[2,155],136:[2,155],137:[2,155],138:[2,155],139:[2,155]},{7:184,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,149],6:[2,149],25:[2,149],26:[2,149],49:[2,149],54:[2,149],57:[2,149],73:[2,149],78:[2,149],86:[2,149],91:[2,149],93:[2,149],102:[2,149],104:[2,149],105:[2,149],106:[2,149],110:[2,149],118:[2,149],126:[2,149],129:[2,149],130:[2,149],133:[2,149],134:[2,149],135:[2,149],136:[2,149],137:[2,149],138:[2,149],139:[2,149]},{1:[2,154],6:[2,154],25:[2,154],26:[2,154],49:[2,154],54:[2,154],57:[2,154],73:[2,154],78:[2,154],86:[2,154],91:[2,154],93:[2,154],102:[2,154],104:[2,154],105:[2,154],106:[2,154],110:[2,154],118:[2,154],126:[2,154],129:[2,154],130:[2,154],133:[2,154],134:[2,154],135:[2,154],136:[2,154],137:[2,154],138:[2,154],139:[2,154]},{82:185,85:[1,103]},{1:[2,69],6:[2,69],25:[2,69],26:[2,69],40:[2,69],49:[2,69],54:[2,69],57:[2,69],66:[2,69],67:[2,69],68:[2,69],69:[2,69],71:[2,69],73:[2,69],74:[2,69],78:[2,69],80:[2,69],84:[2,69],85:[2,69],86:[2,69],91:[2,69],93:[2,69],102:[2,69],104:[2,69],105:[2,69],106:[2,69],110:[2,69],118:[2,69],126:[2,69],129:[2,69],130:[2,69],131:[2,69],132:[2,69],133:[2,69],134:[2,69],135:[2,69],136:[2,69],137:[2,69],138:[2,69],139:[2,69],140:[2,69]},{85:[2,109]},{27:186,28:[1,72]},{27:187,28:[1,72]},{1:[2,84],6:[2,84],25:[2,84],26:[2,84],27:188,28:[1,72],40:[2,84],49:[2,84],54:[2,84],57:[2,84],66:[2,84],67:[2,84],68:[2,84],69:[2,84],71:[2,84],73:[2,84],74:[2,84],78:[2,84],80:[2,84],84:[2,84],85:[2,84],86:[2,84],91:[2,84],93:[2,84],102:[2,84],104:[2,84],105:[2,84],106:[2,84],110:[2,84],118:[2,84],126:[2,84],129:[2,84],130:[2,84],131:[2,84],132:[2,84],133:[2,84],134:[2,84],135:[2,84],136:[2,84],137:[2,84],138:[2,84],139:[2,84],140:[2,84]},{27:189,28:[1,72]},{1:[2,85],6:[2,85],25:[2,85],26:[2,85],40:[2,85],49:[2,85],54:[2,85],57:[2,85],66:[2,85],67:[2,85],68:[2,85],69:[2,85],71:[2,85],73:[2,85],74:[2,85],78:[2,85],80:[2,85],84:[2,85],85:[2,85],86:[2,85],91:[2,85],93:[2,85],102:[2,85],104:[2,85],105:[2,85],106:[2,85],110:[2,85],118:[2,85],126:[2,85],129:[2,85],130:[2,85],131:[2,85],132:[2,85],133:[2,85],134:[2,85],135:[2,85],136:[2,85],137:[2,85],138:[2,85],139:[2,85],140:[2,85]},{7:191,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,195],58:46,59:47,61:35,63:23,64:24,65:25,72:190,75:192,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],92:193,93:[1,194],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{70:196,71:[1,97],74:[1,98]},{82:197,85:[1,103]},{1:[2,70],6:[2,70],25:[2,70],26:[2,70],40:[2,70],49:[2,70],54:[2,70],57:[2,70],66:[2,70],67:[2,70],68:[2,70],69:[2,70],71:[2,70],73:[2,70],74:[2,70],78:[2,70],80:[2,70],84:[2,70],85:[2,70],86:[2,70],91:[2,70],93:[2,70],102:[2,70],104:[2,70],105:[2,70],106:[2,70],110:[2,70],118:[2,70],126:[2,70],129:[2,70],130:[2,70],131:[2,70],132:[2,70],133:[2,70],134:[2,70],135:[2,70],136:[2,70],137:[2,70],138:[2,70],139:[2,70],140:[2,70]},{6:[1,199],7:198,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,200],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,107],6:[2,107],25:[2,107],26:[2,107],49:[2,107],54:[2,107],57:[2,107],66:[2,107],67:[2,107],68:[2,107],69:[2,107],71:[2,107],73:[2,107],74:[2,107],78:[2,107],84:[2,107],85:[2,107],86:[2,107],91:[2,107],93:[2,107],102:[2,107],104:[2,107],105:[2,107],106:[2,107],110:[2,107],118:[2,107],126:[2,107],129:[2,107],130:[2,107],133:[2,107],134:[2,107],135:[2,107],136:[2,107],137:[2,107],138:[2,107],139:[2,107]},{7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,147],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],86:[1,201],87:202,88:[1,57],89:[1,58],90:[1,56],94:146,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,52],25:[2,52],49:[1,204],53:206,54:[1,205]},{6:[2,55],25:[2,55],26:[2,55],49:[2,55],54:[2,55]},{6:[2,59],25:[2,59],26:[2,59],40:[1,208],49:[2,59],54:[2,59],57:[1,207]},{6:[2,62],25:[2,62],26:[2,62],49:[2,62],54:[2,62]},{6:[2,63],25:[2,63],26:[2,63],40:[2,63],49:[2,63],54:[2,63],57:[2,63]},{6:[2,64],25:[2,64],26:[2,64],40:[2,64],49:[2,64],54:[2,64],57:[2,64]},{6:[2,65],25:[2,65],26:[2,65],40:[2,65],49:[2,65],54:[2,65],57:[2,65]},{6:[2,66],25:[2,66],26:[2,66],40:[2,66],49:[2,66],54:[2,66],57:[2,66]},{27:150,28:[1,72]},{7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,147],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],87:145,88:[1,57],89:[1,58],90:[1,56],91:[1,144],94:146,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,49],6:[2,49],25:[2,49],26:[2,49],49:[2,49],54:[2,49],57:[2,49],73:[2,49],78:[2,49],86:[2,49],91:[2,49],93:[2,49],102:[2,49],104:[2,49],105:[2,49],106:[2,49],110:[2,49],118:[2,49],126:[2,49],129:[2,49],130:[2,49],133:[2,49],134:[2,49],135:[2,49],136:[2,49],137:[2,49],138:[2,49],139:[2,49]},{4:210,5:3,7:4,8:5,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,26:[1,209],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,188],6:[2,188],25:[2,188],26:[2,188],49:[2,188],54:[2,188],57:[2,188],73:[2,188],78:[2,188],86:[2,188],91:[2,188],93:[2,188],102:[2,188],103:84,104:[2,188],105:[2,188],106:[2,188],109:85,110:[2,188],111:68,118:[2,188],126:[2,188],129:[2,188],130:[2,188],133:[1,74],134:[2,188],135:[2,188],136:[2,188],137:[2,188],138:[2,188],139:[2,188]},{103:87,104:[1,64],106:[1,65],109:88,110:[1,67],111:68,126:[1,86]},{1:[2,189],6:[2,189],25:[2,189],26:[2,189],49:[2,189],54:[2,189],57:[2,189],73:[2,189],78:[2,189],86:[2,189],91:[2,189],93:[2,189],102:[2,189],103:84,104:[2,189],105:[2,189],106:[2,189],109:85,110:[2,189],111:68,118:[2,189],126:[2,189],129:[2,189],130:[2,189],133:[1,74],134:[2,189],135:[1,78],136:[2,189],137:[2,189],138:[2,189],139:[2,189]},{1:[2,190],6:[2,190],25:[2,190],26:[2,190],49:[2,190],54:[2,190],57:[2,190],73:[2,190],78:[2,190],86:[2,190],91:[2,190],93:[2,190],102:[2,190],103:84,104:[2,190],105:[2,190],106:[2,190],109:85,110:[2,190],111:68,118:[2,190],126:[2,190],129:[2,190],130:[2,190],133:[1,74],134:[2,190],135:[1,78],136:[2,190],137:[2,190],138:[2,190],139:[2,190]},{1:[2,191],6:[2,191],25:[2,191],26:[2,191],49:[2,191],54:[2,191],57:[2,191],73:[2,191],78:[2,191],86:[2,191],91:[2,191],93:[2,191],102:[2,191],103:84,104:[2,191],105:[2,191],106:[2,191],109:85,110:[2,191],111:68,118:[2,191],126:[2,191],129:[2,191],130:[2,191],133:[1,74],134:[2,191],135:[1,78],136:[2,191],137:[2,191],138:[2,191],139:[2,191]},{1:[2,192],6:[2,192],25:[2,192],26:[2,192],49:[2,192],54:[2,192],57:[2,192],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,192],74:[2,72],78:[2,192],84:[2,72],85:[2,72],86:[2,192],91:[2,192],93:[2,192],102:[2,192],104:[2,192],105:[2,192],106:[2,192],110:[2,192],118:[2,192],126:[2,192],129:[2,192],130:[2,192],133:[2,192],134:[2,192],135:[2,192],136:[2,192],137:[2,192],138:[2,192],139:[2,192]},{62:90,66:[1,92],67:[1,93],68:[1,94],69:[1,95],70:96,71:[1,97],74:[1,98],81:89,84:[1,91],85:[2,108]},{62:100,66:[1,92],67:[1,93],68:[1,94],69:[1,95],70:96,71:[1,97],74:[1,98],81:99,84:[1,91],85:[2,108]},{66:[2,75],67:[2,75],68:[2,75],69:[2,75],71:[2,75],74:[2,75],84:[2,75],85:[2,75]},{1:[2,193],6:[2,193],25:[2,193],26:[2,193],49:[2,193],54:[2,193],57:[2,193],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,193],74:[2,72],78:[2,193],84:[2,72],85:[2,72],86:[2,193],91:[2,193],93:[2,193],102:[2,193],104:[2,193],105:[2,193],106:[2,193],110:[2,193],118:[2,193],126:[2,193],129:[2,193],130:[2,193],133:[2,193],134:[2,193],135:[2,193],136:[2,193],137:[2,193],138:[2,193],139:[2,193]},{1:[2,194],6:[2,194],25:[2,194],26:[2,194],49:[2,194],54:[2,194],57:[2,194],73:[2,194],78:[2,194],86:[2,194],91:[2,194],93:[2,194],102:[2,194],104:[2,194],105:[2,194],106:[2,194],110:[2,194],118:[2,194],126:[2,194],129:[2,194],130:[2,194],133:[2,194],134:[2,194],135:[2,194],136:[2,194],137:[2,194],138:[2,194],139:[2,194]},{1:[2,195],6:[2,195],25:[2,195],26:[2,195],49:[2,195],54:[2,195],57:[2,195],73:[2,195],78:[2,195],86:[2,195],91:[2,195],93:[2,195],102:[2,195],104:[2,195],105:[2,195],106:[2,195],110:[2,195],118:[2,195],126:[2,195],129:[2,195],130:[2,195],133:[2,195],134:[2,195],135:[2,195],136:[2,195],137:[2,195],138:[2,195],139:[2,195]},{6:[1,213],7:211,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,212],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:214,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{24:215,25:[1,115],125:[1,216]},{1:[2,134],6:[2,134],25:[2,134],26:[2,134],49:[2,134],54:[2,134],57:[2,134],73:[2,134],78:[2,134],86:[2,134],91:[2,134],93:[2,134],97:217,98:[1,218],99:[1,219],102:[2,134],104:[2,134],105:[2,134],106:[2,134],110:[2,134],118:[2,134],126:[2,134],129:[2,134],130:[2,134],133:[2,134],134:[2,134],135:[2,134],136:[2,134],137:[2,134],138:[2,134],139:[2,134]},{1:[2,148],6:[2,148],25:[2,148],26:[2,148],49:[2,148],54:[2,148],57:[2,148],73:[2,148],78:[2,148],86:[2,148],91:[2,148],93:[2,148],102:[2,148],104:[2,148],105:[2,148],106:[2,148],110:[2,148],118:[2,148],126:[2,148],129:[2,148],130:[2,148],133:[2,148],134:[2,148],135:[2,148],136:[2,148],137:[2,148],138:[2,148],139:[2,148]},{1:[2,156],6:[2,156],25:[2,156],26:[2,156],49:[2,156],54:[2,156],57:[2,156],73:[2,156],78:[2,156],86:[2,156],91:[2,156],93:[2,156],102:[2,156],104:[2,156],105:[2,156],106:[2,156],110:[2,156],118:[2,156],126:[2,156],129:[2,156],130:[2,156],133:[2,156],134:[2,156],135:[2,156],136:[2,156],137:[2,156],138:[2,156],139:[2,156]},{25:[1,220],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{120:221,122:222,123:[1,223]},{1:[2,97],6:[2,97],25:[2,97],26:[2,97],49:[2,97],54:[2,97],57:[2,97],73:[2,97],78:[2,97],86:[2,97],91:[2,97],93:[2,97],102:[2,97],104:[2,97],105:[2,97],106:[2,97],110:[2,97],118:[2,97],126:[2,97],129:[2,97],130:[2,97],133:[2,97],134:[2,97],135:[2,97],136:[2,97],137:[2,97],138:[2,97],139:[2,97]},{7:224,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,100],6:[2,100],24:225,25:[1,115],26:[2,100],49:[2,100],54:[2,100],57:[2,100],66:[2,72],67:[2,72],68:[2,72],69:[2,72],71:[2,72],73:[2,100],74:[2,72],78:[2,100],80:[1,226],84:[2,72],85:[2,72],86:[2,100],91:[2,100],93:[2,100],102:[2,100],104:[2,100],105:[2,100],106:[2,100],110:[2,100],118:[2,100],126:[2,100],129:[2,100],130:[2,100],133:[2,100],134:[2,100],135:[2,100],136:[2,100],137:[2,100],138:[2,100],139:[2,100]},{1:[2,141],6:[2,141],25:[2,141],26:[2,141],49:[2,141],54:[2,141],57:[2,141],73:[2,141],78:[2,141],86:[2,141],91:[2,141],93:[2,141],102:[2,141],103:84,104:[2,141],105:[2,141],106:[2,141],109:85,110:[2,141],111:68,118:[2,141],126:[2,141],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,45],6:[2,45],26:[2,45],102:[2,45],103:84,104:[2,45],106:[2,45],109:85,110:[2,45],111:68,126:[2,45],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[1,73],102:[1,227]},{4:228,5:3,7:4,8:5,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,129],25:[2,129],54:[2,129],57:[1,230],91:[2,129],92:229,93:[1,194],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,115],6:[2,115],25:[2,115],26:[2,115],40:[2,115],49:[2,115],54:[2,115],57:[2,115],66:[2,115],67:[2,115],68:[2,115],69:[2,115],71:[2,115],73:[2,115],74:[2,115],78:[2,115],84:[2,115],85:[2,115],86:[2,115],91:[2,115],93:[2,115],102:[2,115],104:[2,115],105:[2,115],106:[2,115],110:[2,115],116:[2,115],117:[2,115],118:[2,115],126:[2,115],129:[2,115],130:[2,115],133:[2,115],134:[2,115],135:[2,115],136:[2,115],137:[2,115],138:[2,115],139:[2,115]},{6:[2,52],25:[2,52],53:231,54:[1,232],91:[2,52]},{6:[2,124],25:[2,124],26:[2,124],54:[2,124],86:[2,124],91:[2,124]},{7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,147],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],87:233,88:[1,57],89:[1,58],90:[1,56],94:146,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,130],25:[2,130],26:[2,130],54:[2,130],86:[2,130],91:[2,130]},{6:[2,131],25:[2,131],26:[2,131],54:[2,131],86:[2,131],91:[2,131]},{1:[2,114],6:[2,114],25:[2,114],26:[2,114],40:[2,114],43:[2,114],49:[2,114],54:[2,114],57:[2,114],66:[2,114],67:[2,114],68:[2,114],69:[2,114],71:[2,114],73:[2,114],74:[2,114],78:[2,114],80:[2,114],84:[2,114],85:[2,114],86:[2,114],91:[2,114],93:[2,114],102:[2,114],104:[2,114],105:[2,114],106:[2,114],110:[2,114],116:[2,114],117:[2,114],118:[2,114],126:[2,114],129:[2,114],130:[2,114],131:[2,114],132:[2,114],133:[2,114],134:[2,114],135:[2,114],136:[2,114],137:[2,114],138:[2,114],139:[2,114],140:[2,114]},{24:234,25:[1,115],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,144],6:[2,144],25:[2,144],26:[2,144],49:[2,144],54:[2,144],57:[2,144],73:[2,144],78:[2,144],86:[2,144],91:[2,144],93:[2,144],102:[2,144],103:84,104:[1,64],105:[1,235],106:[1,65],109:85,110:[1,67],111:68,118:[2,144],126:[2,144],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,146],6:[2,146],25:[2,146],26:[2,146],49:[2,146],54:[2,146],57:[2,146],73:[2,146],78:[2,146],86:[2,146],91:[2,146],93:[2,146],102:[2,146],103:84,104:[1,64],105:[1,236],106:[1,65],109:85,110:[1,67],111:68,118:[2,146],126:[2,146],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,152],6:[2,152],25:[2,152],26:[2,152],49:[2,152],54:[2,152],57:[2,152],73:[2,152],78:[2,152],86:[2,152],91:[2,152],93:[2,152],102:[2,152],104:[2,152],105:[2,152],106:[2,152],110:[2,152],118:[2,152],126:[2,152],129:[2,152],130:[2,152],133:[2,152],134:[2,152],135:[2,152],136:[2,152],137:[2,152],138:[2,152],139:[2,152]},{1:[2,153],6:[2,153],25:[2,153],26:[2,153],49:[2,153],54:[2,153],57:[2,153],73:[2,153],78:[2,153],86:[2,153],91:[2,153],93:[2,153],102:[2,153],103:84,104:[1,64],105:[2,153],106:[1,65],109:85,110:[1,67],111:68,118:[2,153],126:[2,153],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,157],6:[2,157],25:[2,157],26:[2,157],49:[2,157],54:[2,157],57:[2,157],73:[2,157],78:[2,157],86:[2,157],91:[2,157],93:[2,157],102:[2,157],104:[2,157],105:[2,157],106:[2,157],110:[2,157],118:[2,157],126:[2,157],129:[2,157],130:[2,157],133:[2,157],134:[2,157],135:[2,157],136:[2,157],137:[2,157],138:[2,157],139:[2,157]},{116:[2,159],117:[2,159]},{27:160,28:[1,72],44:161,58:162,59:163,76:[1,69],89:[1,112],90:[1,113],113:237,115:159},{54:[1,238],116:[2,165],117:[2,165]},{54:[2,161],116:[2,161],117:[2,161]},{54:[2,162],116:[2,162],117:[2,162]},{54:[2,163],116:[2,163],117:[2,163]},{54:[2,164],116:[2,164],117:[2,164]},{1:[2,158],6:[2,158],25:[2,158],26:[2,158],49:[2,158],54:[2,158],57:[2,158],73:[2,158],78:[2,158],86:[2,158],91:[2,158],93:[2,158],102:[2,158],104:[2,158],105:[2,158],106:[2,158],110:[2,158],118:[2,158],126:[2,158],129:[2,158],130:[2,158],133:[2,158],134:[2,158],135:[2,158],136:[2,158],137:[2,158],138:[2,158],139:[2,158]},{7:239,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:240,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,52],25:[2,52],53:241,54:[1,242],78:[2,52]},{6:[2,92],25:[2,92],26:[2,92],54:[2,92],78:[2,92]},{6:[2,38],25:[2,38],26:[2,38],43:[1,243],54:[2,38],78:[2,38]},{6:[2,41],25:[2,41],26:[2,41],54:[2,41],78:[2,41]},{6:[2,42],25:[2,42],26:[2,42],43:[2,42],54:[2,42],78:[2,42]},{6:[2,43],25:[2,43],26:[2,43],43:[2,43],54:[2,43],78:[2,43]},{6:[2,44],25:[2,44],26:[2,44],43:[2,44],54:[2,44],78:[2,44]},{1:[2,4],6:[2,4],26:[2,4],102:[2,4]},{1:[2,197],6:[2,197],25:[2,197],26:[2,197],49:[2,197],54:[2,197],57:[2,197],73:[2,197],78:[2,197],86:[2,197],91:[2,197],93:[2,197],102:[2,197],103:84,104:[2,197],105:[2,197],106:[2,197],109:85,110:[2,197],111:68,118:[2,197],126:[2,197],129:[2,197],130:[2,197],133:[1,74],134:[1,77],135:[1,78],136:[2,197],137:[2,197],138:[2,197],139:[2,197]},{1:[2,198],6:[2,198],25:[2,198],26:[2,198],49:[2,198],54:[2,198],57:[2,198],73:[2,198],78:[2,198],86:[2,198],91:[2,198],93:[2,198],102:[2,198],103:84,104:[2,198],105:[2,198],106:[2,198],109:85,110:[2,198],111:68,118:[2,198],126:[2,198],129:[2,198],130:[2,198],133:[1,74],134:[1,77],135:[1,78],136:[2,198],137:[2,198],138:[2,198],139:[2,198]},{1:[2,199],6:[2,199],25:[2,199],26:[2,199],49:[2,199],54:[2,199],57:[2,199],73:[2,199],78:[2,199],86:[2,199],91:[2,199],93:[2,199],102:[2,199],103:84,104:[2,199],105:[2,199],106:[2,199],109:85,110:[2,199],111:68,118:[2,199],126:[2,199],129:[2,199],130:[2,199],133:[1,74],134:[2,199],135:[1,78],136:[2,199],137:[2,199],138:[2,199],139:[2,199]},{1:[2,200],6:[2,200],25:[2,200],26:[2,200],49:[2,200],54:[2,200],57:[2,200],73:[2,200],78:[2,200],86:[2,200],91:[2,200],93:[2,200],102:[2,200],103:84,104:[2,200],105:[2,200],106:[2,200],109:85,110:[2,200],111:68,118:[2,200],126:[2,200],129:[2,200],130:[2,200],133:[1,74],134:[2,200],135:[1,78],136:[2,200],137:[2,200],138:[2,200],139:[2,200]},{1:[2,201],6:[2,201],25:[2,201],26:[2,201],49:[2,201],54:[2,201],57:[2,201],73:[2,201],78:[2,201],86:[2,201],91:[2,201],93:[2,201],102:[2,201],103:84,104:[2,201],105:[2,201],106:[2,201],109:85,110:[2,201],111:68,118:[2,201],126:[2,201],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[2,201],137:[2,201],138:[2,201],139:[2,201]},{1:[2,202],6:[2,202],25:[2,202],26:[2,202],49:[2,202],54:[2,202],57:[2,202],73:[2,202],78:[2,202],86:[2,202],91:[2,202],93:[2,202],102:[2,202],103:84,104:[2,202],105:[2,202],106:[2,202],109:85,110:[2,202],111:68,118:[2,202],126:[2,202],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[2,202],138:[2,202],139:[1,82]},{1:[2,203],6:[2,203],25:[2,203],26:[2,203],49:[2,203],54:[2,203],57:[2,203],73:[2,203],78:[2,203],86:[2,203],91:[2,203],93:[2,203],102:[2,203],103:84,104:[2,203],105:[2,203],106:[2,203],109:85,110:[2,203],111:68,118:[2,203],126:[2,203],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[2,203],139:[1,82]},{1:[2,204],6:[2,204],25:[2,204],26:[2,204],49:[2,204],54:[2,204],57:[2,204],73:[2,204],78:[2,204],86:[2,204],91:[2,204],93:[2,204],102:[2,204],103:84,104:[2,204],105:[2,204],106:[2,204],109:85,110:[2,204],111:68,118:[2,204],126:[2,204],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[2,204],138:[2,204],139:[2,204]},{1:[2,187],6:[2,187],25:[2,187],26:[2,187],49:[2,187],54:[2,187],57:[2,187],73:[2,187],78:[2,187],86:[2,187],91:[2,187],93:[2,187],102:[2,187],103:84,104:[1,64],105:[2,187],106:[1,65],109:85,110:[1,67],111:68,118:[2,187],126:[2,187],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,186],6:[2,186],25:[2,186],26:[2,186],49:[2,186],54:[2,186],57:[2,186],73:[2,186],78:[2,186],86:[2,186],91:[2,186],93:[2,186],102:[2,186],103:84,104:[1,64],105:[2,186],106:[1,65],109:85,110:[1,67],111:68,118:[2,186],126:[2,186],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,104],6:[2,104],25:[2,104],26:[2,104],49:[2,104],54:[2,104],57:[2,104],66:[2,104],67:[2,104],68:[2,104],69:[2,104],71:[2,104],73:[2,104],74:[2,104],78:[2,104],84:[2,104],85:[2,104],86:[2,104],91:[2,104],93:[2,104],102:[2,104],104:[2,104],105:[2,104],106:[2,104],110:[2,104],118:[2,104],126:[2,104],129:[2,104],130:[2,104],133:[2,104],134:[2,104],135:[2,104],136:[2,104],137:[2,104],138:[2,104],139:[2,104]},{1:[2,80],6:[2,80],25:[2,80],26:[2,80],40:[2,80],49:[2,80],54:[2,80],57:[2,80],66:[2,80],67:[2,80],68:[2,80],69:[2,80],71:[2,80],73:[2,80],74:[2,80],78:[2,80],80:[2,80],84:[2,80],85:[2,80],86:[2,80],91:[2,80],93:[2,80],102:[2,80],104:[2,80],105:[2,80],106:[2,80],110:[2,80],118:[2,80],126:[2,80],129:[2,80],130:[2,80],131:[2,80],132:[2,80],133:[2,80],134:[2,80],135:[2,80],136:[2,80],137:[2,80],138:[2,80],139:[2,80],140:[2,80]},{1:[2,81],6:[2,81],25:[2,81],26:[2,81],40:[2,81],49:[2,81],54:[2,81],57:[2,81],66:[2,81],67:[2,81],68:[2,81],69:[2,81],71:[2,81],73:[2,81],74:[2,81],78:[2,81],80:[2,81],84:[2,81],85:[2,81],86:[2,81],91:[2,81],93:[2,81],102:[2,81],104:[2,81],105:[2,81],106:[2,81],110:[2,81],118:[2,81],126:[2,81],129:[2,81],130:[2,81],131:[2,81],132:[2,81],133:[2,81],134:[2,81],135:[2,81],136:[2,81],137:[2,81],138:[2,81],139:[2,81],140:[2,81]},{1:[2,82],6:[2,82],25:[2,82],26:[2,82],40:[2,82],49:[2,82],54:[2,82],57:[2,82],66:[2,82],67:[2,82],68:[2,82],69:[2,82],71:[2,82],73:[2,82],74:[2,82],78:[2,82],80:[2,82],84:[2,82],85:[2,82],86:[2,82],91:[2,82],93:[2,82],102:[2,82],104:[2,82],105:[2,82],106:[2,82],110:[2,82],118:[2,82],126:[2,82],129:[2,82],130:[2,82],131:[2,82],132:[2,82],133:[2,82],134:[2,82],135:[2,82],136:[2,82],137:[2,82],138:[2,82],139:[2,82],140:[2,82]},{1:[2,83],6:[2,83],25:[2,83],26:[2,83],40:[2,83],49:[2,83],54:[2,83],57:[2,83],66:[2,83],67:[2,83],68:[2,83],69:[2,83],71:[2,83],73:[2,83],74:[2,83],78:[2,83],80:[2,83],84:[2,83],85:[2,83],86:[2,83],91:[2,83],93:[2,83],102:[2,83],104:[2,83],105:[2,83],106:[2,83],110:[2,83],118:[2,83],126:[2,83],129:[2,83],130:[2,83],131:[2,83],132:[2,83],133:[2,83],134:[2,83],135:[2,83],136:[2,83],137:[2,83],138:[2,83],139:[2,83],140:[2,83]},{73:[1,244]},{57:[1,195],73:[2,88],92:245,93:[1,194],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{73:[2,89]},{7:246,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,73:[2,123],76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{11:[2,117],28:[2,117],30:[2,117],31:[2,117],33:[2,117],34:[2,117],35:[2,117],36:[2,117],37:[2,117],38:[2,117],45:[2,117],46:[2,117],47:[2,117],51:[2,117],52:[2,117],73:[2,117],76:[2,117],79:[2,117],83:[2,117],88:[2,117],89:[2,117],90:[2,117],96:[2,117],100:[2,117],101:[2,117],104:[2,117],106:[2,117],108:[2,117],110:[2,117],119:[2,117],125:[2,117],127:[2,117],128:[2,117],129:[2,117],130:[2,117],131:[2,117],132:[2,117]},{11:[2,118],28:[2,118],30:[2,118],31:[2,118],33:[2,118],34:[2,118],35:[2,118],36:[2,118],37:[2,118],38:[2,118],45:[2,118],46:[2,118],47:[2,118],51:[2,118],52:[2,118],73:[2,118],76:[2,118],79:[2,118],83:[2,118],88:[2,118],89:[2,118],90:[2,118],96:[2,118],100:[2,118],101:[2,118],104:[2,118],106:[2,118],108:[2,118],110:[2,118],119:[2,118],125:[2,118],127:[2,118],128:[2,118],129:[2,118],130:[2,118],131:[2,118],132:[2,118]},{1:[2,87],6:[2,87],25:[2,87],26:[2,87],40:[2,87],49:[2,87],54:[2,87],57:[2,87],66:[2,87],67:[2,87],68:[2,87],69:[2,87],71:[2,87],73:[2,87],74:[2,87],78:[2,87],80:[2,87],84:[2,87],85:[2,87],86:[2,87],91:[2,87],93:[2,87],102:[2,87],104:[2,87],105:[2,87],106:[2,87],110:[2,87],118:[2,87],126:[2,87],129:[2,87],130:[2,87],131:[2,87],132:[2,87],133:[2,87],134:[2,87],135:[2,87],136:[2,87],137:[2,87],138:[2,87],139:[2,87],140:[2,87]},{1:[2,105],6:[2,105],25:[2,105],26:[2,105],49:[2,105],54:[2,105],57:[2,105],66:[2,105],67:[2,105],68:[2,105],69:[2,105],71:[2,105],73:[2,105],74:[2,105],78:[2,105],84:[2,105],85:[2,105],86:[2,105],91:[2,105],93:[2,105],102:[2,105],104:[2,105],105:[2,105],106:[2,105],110:[2,105],118:[2,105],126:[2,105],129:[2,105],130:[2,105],133:[2,105],134:[2,105],135:[2,105],136:[2,105],137:[2,105],138:[2,105],139:[2,105]},{1:[2,35],6:[2,35],25:[2,35],26:[2,35],49:[2,35],54:[2,35],57:[2,35],73:[2,35],78:[2,35],86:[2,35],91:[2,35],93:[2,35],102:[2,35],103:84,104:[2,35],105:[2,35],106:[2,35],109:85,110:[2,35],111:68,118:[2,35],126:[2,35],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{7:247,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:248,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,110],6:[2,110],25:[2,110],26:[2,110],49:[2,110],54:[2,110],57:[2,110],66:[2,110],67:[2,110],68:[2,110],69:[2,110],71:[2,110],73:[2,110],74:[2,110],78:[2,110],84:[2,110],85:[2,110],86:[2,110],91:[2,110],93:[2,110],102:[2,110],104:[2,110],105:[2,110],106:[2,110],110:[2,110],118:[2,110],126:[2,110],129:[2,110],130:[2,110],133:[2,110],134:[2,110],135:[2,110],136:[2,110],137:[2,110],138:[2,110],139:[2,110]},{6:[2,52],25:[2,52],53:249,54:[1,232],86:[2,52]},{6:[2,129],25:[2,129],26:[2,129],54:[2,129],57:[1,250],86:[2,129],91:[2,129],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{50:251,51:[1,59],52:[1,60]},{6:[2,53],25:[2,53],26:[2,53],27:108,28:[1,72],44:109,55:252,56:106,57:[1,107],58:110,59:111,76:[1,69],89:[1,112],90:[1,113]},{6:[1,253],25:[1,254]},{6:[2,60],25:[2,60],26:[2,60],49:[2,60],54:[2,60]},{7:255,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,23],6:[2,23],25:[2,23],26:[2,23],49:[2,23],54:[2,23],57:[2,23],73:[2,23],78:[2,23],86:[2,23],91:[2,23],93:[2,23],98:[2,23],99:[2,23],102:[2,23],104:[2,23],105:[2,23],106:[2,23],110:[2,23],118:[2,23],121:[2,23],123:[2,23],126:[2,23],129:[2,23],130:[2,23],133:[2,23],134:[2,23],135:[2,23],136:[2,23],137:[2,23],138:[2,23],139:[2,23]},{6:[1,73],26:[1,256]},{1:[2,205],6:[2,205],25:[2,205],26:[2,205],49:[2,205],54:[2,205],57:[2,205],73:[2,205],78:[2,205],86:[2,205],91:[2,205],93:[2,205],102:[2,205],103:84,104:[2,205],105:[2,205],106:[2,205],109:85,110:[2,205],111:68,118:[2,205],126:[2,205],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{7:257,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:258,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,208],6:[2,208],25:[2,208],26:[2,208],49:[2,208],54:[2,208],57:[2,208],73:[2,208],78:[2,208],86:[2,208],91:[2,208],93:[2,208],102:[2,208],103:84,104:[2,208],105:[2,208],106:[2,208],109:85,110:[2,208],111:68,118:[2,208],126:[2,208],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,185],6:[2,185],25:[2,185],26:[2,185],49:[2,185],54:[2,185],57:[2,185],73:[2,185],78:[2,185],86:[2,185],91:[2,185],93:[2,185],102:[2,185],104:[2,185],105:[2,185],106:[2,185],110:[2,185],118:[2,185],126:[2,185],129:[2,185],130:[2,185],133:[2,185],134:[2,185],135:[2,185],136:[2,185],137:[2,185],138:[2,185],139:[2,185]},{7:259,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,135],6:[2,135],25:[2,135],26:[2,135],49:[2,135],54:[2,135],57:[2,135],73:[2,135],78:[2,135],86:[2,135],91:[2,135],93:[2,135],98:[1,260],102:[2,135],104:[2,135],105:[2,135],106:[2,135],110:[2,135],118:[2,135],126:[2,135],129:[2,135],130:[2,135],133:[2,135],134:[2,135],135:[2,135],136:[2,135],137:[2,135],138:[2,135],139:[2,135]},{24:261,25:[1,115]},{24:264,25:[1,115],27:262,28:[1,72],59:263,76:[1,69]},{120:265,122:222,123:[1,223]},{26:[1,266],121:[1,267],122:268,123:[1,223]},{26:[2,178],121:[2,178],123:[2,178]},{7:270,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],95:269,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,98],6:[2,98],24:271,25:[1,115],26:[2,98],49:[2,98],54:[2,98],57:[2,98],73:[2,98],78:[2,98],86:[2,98],91:[2,98],93:[2,98],102:[2,98],103:84,104:[1,64],105:[2,98],106:[1,65],109:85,110:[1,67],111:68,118:[2,98],126:[2,98],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,101],6:[2,101],25:[2,101],26:[2,101],49:[2,101],54:[2,101],57:[2,101],73:[2,101],78:[2,101],86:[2,101],91:[2,101],93:[2,101],102:[2,101],104:[2,101],105:[2,101],106:[2,101],110:[2,101],118:[2,101],126:[2,101],129:[2,101],130:[2,101],133:[2,101],134:[2,101],135:[2,101],136:[2,101],137:[2,101],138:[2,101],139:[2,101]},{7:272,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,142],6:[2,142],25:[2,142],26:[2,142],49:[2,142],54:[2,142],57:[2,142],66:[2,142],67:[2,142],68:[2,142],69:[2,142],71:[2,142],73:[2,142],74:[2,142],78:[2,142],84:[2,142],85:[2,142],86:[2,142],91:[2,142],93:[2,142],102:[2,142],104:[2,142],105:[2,142],106:[2,142],110:[2,142],118:[2,142],126:[2,142],129:[2,142],130:[2,142],133:[2,142],134:[2,142],135:[2,142],136:[2,142],137:[2,142],138:[2,142],139:[2,142]},{6:[1,73],26:[1,273]},{7:274,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,67],11:[2,118],25:[2,67],28:[2,118],30:[2,118],31:[2,118],33:[2,118],34:[2,118],35:[2,118],36:[2,118],37:[2,118],38:[2,118],45:[2,118],46:[2,118],47:[2,118],51:[2,118],52:[2,118],54:[2,67],76:[2,118],79:[2,118],83:[2,118],88:[2,118],89:[2,118],90:[2,118],91:[2,67],96:[2,118],100:[2,118],101:[2,118],104:[2,118],106:[2,118],108:[2,118],110:[2,118],119:[2,118],125:[2,118],127:[2,118],128:[2,118],129:[2,118],130:[2,118],131:[2,118],132:[2,118]},{6:[1,276],25:[1,277],91:[1,275]},{6:[2,53],7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[2,53],26:[2,53],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],86:[2,53],88:[1,57],89:[1,58],90:[1,56],91:[2,53],94:278,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,52],25:[2,52],26:[2,52],53:279,54:[1,232]},{1:[2,182],6:[2,182],25:[2,182],26:[2,182],49:[2,182],54:[2,182],57:[2,182],73:[2,182],78:[2,182],86:[2,182],91:[2,182],93:[2,182],102:[2,182],104:[2,182],105:[2,182],106:[2,182],110:[2,182],118:[2,182],121:[2,182],126:[2,182],129:[2,182],130:[2,182],133:[2,182],134:[2,182],135:[2,182],136:[2,182],137:[2,182],138:[2,182],139:[2,182]},{7:280,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:281,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{116:[2,160],117:[2,160]},{27:160,28:[1,72],44:161,58:162,59:163,76:[1,69],89:[1,112],90:[1,113],115:282},{1:[2,167],6:[2,167],25:[2,167],26:[2,167],49:[2,167],54:[2,167],57:[2,167],73:[2,167],78:[2,167],86:[2,167],91:[2,167],93:[2,167],102:[2,167],103:84,104:[2,167],105:[1,283],106:[2,167],109:85,110:[2,167],111:68,118:[1,284],126:[2,167],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,168],6:[2,168],25:[2,168],26:[2,168],49:[2,168],54:[2,168],57:[2,168],73:[2,168],78:[2,168],86:[2,168],91:[2,168],93:[2,168],102:[2,168],103:84,104:[2,168],105:[1,285],106:[2,168],109:85,110:[2,168],111:68,118:[2,168],126:[2,168],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[1,287],25:[1,288],78:[1,286]},{6:[2,53],10:170,25:[2,53],26:[2,53],27:171,28:[1,72],29:172,30:[1,70],31:[1,71],41:289,42:169,44:173,46:[1,45],78:[2,53],89:[1,112]},{7:290,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,291],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,86],6:[2,86],25:[2,86],26:[2,86],40:[2,86],49:[2,86],54:[2,86],57:[2,86],66:[2,86],67:[2,86],68:[2,86],69:[2,86],71:[2,86],73:[2,86],74:[2,86],78:[2,86],80:[2,86],84:[2,86],85:[2,86],86:[2,86],91:[2,86],93:[2,86],102:[2,86],104:[2,86],105:[2,86],106:[2,86],110:[2,86],118:[2,86],126:[2,86],129:[2,86],130:[2,86],131:[2,86],132:[2,86],133:[2,86],134:[2,86],135:[2,86],136:[2,86],137:[2,86],138:[2,86],139:[2,86],140:[2,86]},{7:292,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,73:[2,121],76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{73:[2,122],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,36],6:[2,36],25:[2,36],26:[2,36],49:[2,36],54:[2,36],57:[2,36],73:[2,36],78:[2,36],86:[2,36],91:[2,36],93:[2,36],102:[2,36],103:84,104:[2,36],105:[2,36],106:[2,36],109:85,110:[2,36],111:68,118:[2,36],126:[2,36],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{26:[1,293],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[1,276],25:[1,277],86:[1,294]},{6:[2,67],25:[2,67],26:[2,67],54:[2,67],86:[2,67],91:[2,67]},{24:295,25:[1,115]},{6:[2,56],25:[2,56],26:[2,56],49:[2,56],54:[2,56]},{27:108,28:[1,72],44:109,55:296,56:106,57:[1,107],58:110,59:111,76:[1,69],89:[1,112],90:[1,113]},{6:[2,54],25:[2,54],26:[2,54],27:108,28:[1,72],44:109,48:297,54:[2,54],55:105,56:106,57:[1,107],58:110,59:111,76:[1,69],89:[1,112],90:[1,113]},{6:[2,61],25:[2,61],26:[2,61],49:[2,61],54:[2,61],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,24],6:[2,24],25:[2,24],26:[2,24],49:[2,24],54:[2,24],57:[2,24],73:[2,24],78:[2,24],86:[2,24],91:[2,24],93:[2,24],98:[2,24],99:[2,24],102:[2,24],104:[2,24],105:[2,24],106:[2,24],110:[2,24],118:[2,24],121:[2,24],123:[2,24],126:[2,24],129:[2,24],130:[2,24],133:[2,24],134:[2,24],135:[2,24],136:[2,24],137:[2,24],138:[2,24],139:[2,24]},{26:[1,298],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,207],6:[2,207],25:[2,207],26:[2,207],49:[2,207],54:[2,207],57:[2,207],73:[2,207],78:[2,207],86:[2,207],91:[2,207],93:[2,207],102:[2,207],103:84,104:[2,207],105:[2,207],106:[2,207],109:85,110:[2,207],111:68,118:[2,207],126:[2,207],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{24:299,25:[1,115],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{24:300,25:[1,115]},{1:[2,136],6:[2,136],25:[2,136],26:[2,136],49:[2,136],54:[2,136],57:[2,136],73:[2,136],78:[2,136],86:[2,136],91:[2,136],93:[2,136],102:[2,136],104:[2,136],105:[2,136],106:[2,136],110:[2,136],118:[2,136],126:[2,136],129:[2,136],130:[2,136],133:[2,136],134:[2,136],135:[2,136],136:[2,136],137:[2,136],138:[2,136],139:[2,136]},{24:301,25:[1,115]},{24:302,25:[1,115]},{1:[2,140],6:[2,140],25:[2,140],26:[2,140],49:[2,140],54:[2,140],57:[2,140],73:[2,140],78:[2,140],86:[2,140],91:[2,140],93:[2,140],98:[2,140],102:[2,140],104:[2,140],105:[2,140],106:[2,140],110:[2,140],118:[2,140],126:[2,140],129:[2,140],130:[2,140],133:[2,140],134:[2,140],135:[2,140],136:[2,140],137:[2,140],138:[2,140],139:[2,140]},{26:[1,303],121:[1,304],122:268,123:[1,223]},{1:[2,176],6:[2,176],25:[2,176],26:[2,176],49:[2,176],54:[2,176],57:[2,176],73:[2,176],78:[2,176],86:[2,176],91:[2,176],93:[2,176],102:[2,176],104:[2,176],105:[2,176],106:[2,176],110:[2,176],118:[2,176],126:[2,176],129:[2,176],130:[2,176],133:[2,176],134:[2,176],135:[2,176],136:[2,176],137:[2,176],138:[2,176],139:[2,176]},{24:305,25:[1,115]},{26:[2,179],121:[2,179],123:[2,179]},{24:306,25:[1,115],54:[1,307]},{25:[2,132],54:[2,132],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,99],6:[2,99],25:[2,99],26:[2,99],49:[2,99],54:[2,99],57:[2,99],73:[2,99],78:[2,99],86:[2,99],91:[2,99],93:[2,99],102:[2,99],104:[2,99],105:[2,99],106:[2,99],110:[2,99],118:[2,99],126:[2,99],129:[2,99],130:[2,99],133:[2,99],134:[2,99],135:[2,99],136:[2,99],137:[2,99],138:[2,99],139:[2,99]},{1:[2,102],6:[2,102],24:308,25:[1,115],26:[2,102],49:[2,102],54:[2,102],57:[2,102],73:[2,102],78:[2,102],86:[2,102],91:[2,102],93:[2,102],102:[2,102],103:84,104:[1,64],105:[2,102],106:[1,65],109:85,110:[1,67],111:68,118:[2,102],126:[2,102],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{102:[1,309]},{91:[1,310],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,116],6:[2,116],25:[2,116],26:[2,116],40:[2,116],49:[2,116],54:[2,116],57:[2,116],66:[2,116],67:[2,116],68:[2,116],69:[2,116],71:[2,116],73:[2,116],74:[2,116],78:[2,116],84:[2,116],85:[2,116],86:[2,116],91:[2,116],93:[2,116],102:[2,116],104:[2,116],105:[2,116],106:[2,116],110:[2,116],116:[2,116],117:[2,116],118:[2,116],126:[2,116],129:[2,116],130:[2,116],133:[2,116],134:[2,116],135:[2,116],136:[2,116],137:[2,116],138:[2,116],139:[2,116]},{7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],94:311,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:203,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,25:[1,147],27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],57:[1,149],58:46,59:47,60:148,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],87:312,88:[1,57],89:[1,58],90:[1,56],94:146,96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[2,125],25:[2,125],26:[2,125],54:[2,125],86:[2,125],91:[2,125]},{6:[1,276],25:[1,277],26:[1,313]},{1:[2,145],6:[2,145],25:[2,145],26:[2,145],49:[2,145],54:[2,145],57:[2,145],73:[2,145],78:[2,145],86:[2,145],91:[2,145],93:[2,145],102:[2,145],103:84,104:[1,64],105:[2,145],106:[1,65],109:85,110:[1,67],111:68,118:[2,145],126:[2,145],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,147],6:[2,147],25:[2,147],26:[2,147],49:[2,147],54:[2,147],57:[2,147],73:[2,147],78:[2,147],86:[2,147],91:[2,147],93:[2,147],102:[2,147],103:84,104:[1,64],105:[2,147],106:[1,65],109:85,110:[1,67],111:68,118:[2,147],126:[2,147],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{116:[2,166],117:[2,166]},{7:314,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:315,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:316,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,90],6:[2,90],25:[2,90],26:[2,90],40:[2,90],49:[2,90],54:[2,90],57:[2,90],66:[2,90],67:[2,90],68:[2,90],69:[2,90],71:[2,90],73:[2,90],74:[2,90],78:[2,90],84:[2,90],85:[2,90],86:[2,90],91:[2,90],93:[2,90],102:[2,90],104:[2,90],105:[2,90],106:[2,90],110:[2,90],116:[2,90],117:[2,90],118:[2,90],126:[2,90],129:[2,90],130:[2,90],133:[2,90],134:[2,90],135:[2,90],136:[2,90],137:[2,90],138:[2,90],139:[2,90]},{10:170,27:171,28:[1,72],29:172,30:[1,70],31:[1,71],41:317,42:169,44:173,46:[1,45],89:[1,112]},{6:[2,91],10:170,25:[2,91],26:[2,91],27:171,28:[1,72],29:172,30:[1,70],31:[1,71],41:168,42:169,44:173,46:[1,45],54:[2,91],77:318,89:[1,112]},{6:[2,93],25:[2,93],26:[2,93],54:[2,93],78:[2,93]},{6:[2,39],25:[2,39],26:[2,39],54:[2,39],78:[2,39],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{7:319,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{73:[2,120],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,37],6:[2,37],25:[2,37],26:[2,37],49:[2,37],54:[2,37],57:[2,37],73:[2,37],78:[2,37],86:[2,37],91:[2,37],93:[2,37],102:[2,37],104:[2,37],105:[2,37],106:[2,37],110:[2,37],118:[2,37],126:[2,37],129:[2,37],130:[2,37],133:[2,37],134:[2,37],135:[2,37],136:[2,37],137:[2,37],138:[2,37],139:[2,37]},{1:[2,111],6:[2,111],25:[2,111],26:[2,111],49:[2,111],54:[2,111],57:[2,111],66:[2,111],67:[2,111],68:[2,111],69:[2,111],71:[2,111],73:[2,111],74:[2,111],78:[2,111],84:[2,111],85:[2,111],86:[2,111],91:[2,111],93:[2,111],102:[2,111],104:[2,111],105:[2,111],106:[2,111],110:[2,111],118:[2,111],126:[2,111],129:[2,111],130:[2,111],133:[2,111],134:[2,111],135:[2,111],136:[2,111],137:[2,111],138:[2,111],139:[2,111]},{1:[2,48],6:[2,48],25:[2,48],26:[2,48],49:[2,48],54:[2,48],57:[2,48],73:[2,48],78:[2,48],86:[2,48],91:[2,48],93:[2,48],102:[2,48],104:[2,48],105:[2,48],106:[2,48],110:[2,48],118:[2,48],126:[2,48],129:[2,48],130:[2,48],133:[2,48],134:[2,48],135:[2,48],136:[2,48],137:[2,48],138:[2,48],139:[2,48]},{6:[2,57],25:[2,57],26:[2,57],49:[2,57],54:[2,57]},{6:[2,52],25:[2,52],26:[2,52],53:320,54:[1,205]},{1:[2,206],6:[2,206],25:[2,206],26:[2,206],49:[2,206],54:[2,206],57:[2,206],73:[2,206],78:[2,206],86:[2,206],91:[2,206],93:[2,206],102:[2,206],104:[2,206],105:[2,206],106:[2,206],110:[2,206],118:[2,206],126:[2,206],129:[2,206],130:[2,206],133:[2,206],134:[2,206],135:[2,206],136:[2,206],137:[2,206],138:[2,206],139:[2,206]},{1:[2,183],6:[2,183],25:[2,183],26:[2,183],49:[2,183],54:[2,183],57:[2,183],73:[2,183],78:[2,183],86:[2,183],91:[2,183],93:[2,183],102:[2,183],104:[2,183],105:[2,183],106:[2,183],110:[2,183],118:[2,183],121:[2,183],126:[2,183],129:[2,183],130:[2,183],133:[2,183],134:[2,183],135:[2,183],136:[2,183],137:[2,183],138:[2,183],139:[2,183]},{1:[2,137],6:[2,137],25:[2,137],26:[2,137],49:[2,137],54:[2,137],57:[2,137],73:[2,137],78:[2,137],86:[2,137],91:[2,137],93:[2,137],102:[2,137],104:[2,137],105:[2,137],106:[2,137],110:[2,137],118:[2,137],126:[2,137],129:[2,137],130:[2,137],133:[2,137],134:[2,137],135:[2,137],136:[2,137],137:[2,137],138:[2,137],139:[2,137]},{1:[2,138],6:[2,138],25:[2,138],26:[2,138],49:[2,138],54:[2,138],57:[2,138],73:[2,138],78:[2,138],86:[2,138],91:[2,138],93:[2,138],98:[2,138],102:[2,138],104:[2,138],105:[2,138],106:[2,138],110:[2,138],118:[2,138],126:[2,138],129:[2,138],130:[2,138],133:[2,138],134:[2,138],135:[2,138],136:[2,138],137:[2,138],138:[2,138],139:[2,138]},{1:[2,139],6:[2,139],25:[2,139],26:[2,139],49:[2,139],54:[2,139],57:[2,139],73:[2,139],78:[2,139],86:[2,139],91:[2,139],93:[2,139],98:[2,139],102:[2,139],104:[2,139],105:[2,139],106:[2,139],110:[2,139],118:[2,139],126:[2,139],129:[2,139],130:[2,139],133:[2,139],134:[2,139],135:[2,139],136:[2,139],137:[2,139],138:[2,139],139:[2,139]},{1:[2,174],6:[2,174],25:[2,174],26:[2,174],49:[2,174],54:[2,174],57:[2,174],73:[2,174],78:[2,174],86:[2,174],91:[2,174],93:[2,174],102:[2,174],104:[2,174],105:[2,174],106:[2,174],110:[2,174],118:[2,174],126:[2,174],129:[2,174],130:[2,174],133:[2,174],134:[2,174],135:[2,174],136:[2,174],137:[2,174],138:[2,174],139:[2,174]},{24:321,25:[1,115]},{26:[1,322]},{6:[1,323],26:[2,180],121:[2,180],123:[2,180]},{7:324,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{1:[2,103],6:[2,103],25:[2,103],26:[2,103],49:[2,103],54:[2,103],57:[2,103],73:[2,103],78:[2,103],86:[2,103],91:[2,103],93:[2,103],102:[2,103],104:[2,103],105:[2,103],106:[2,103],110:[2,103],118:[2,103],126:[2,103],129:[2,103],130:[2,103],133:[2,103],134:[2,103],135:[2,103],136:[2,103],137:[2,103],138:[2,103],139:[2,103]},{1:[2,143],6:[2,143],25:[2,143],26:[2,143],49:[2,143],54:[2,143],57:[2,143],66:[2,143],67:[2,143],68:[2,143],69:[2,143],71:[2,143],73:[2,143],74:[2,143],78:[2,143],84:[2,143],85:[2,143],86:[2,143],91:[2,143],93:[2,143],102:[2,143],104:[2,143],105:[2,143],106:[2,143],110:[2,143],118:[2,143],126:[2,143],129:[2,143],130:[2,143],133:[2,143],134:[2,143],135:[2,143],136:[2,143],137:[2,143],138:[2,143],139:[2,143]},{1:[2,119],6:[2,119],25:[2,119],26:[2,119],49:[2,119],54:[2,119],57:[2,119],66:[2,119],67:[2,119],68:[2,119],69:[2,119],71:[2,119],73:[2,119],74:[2,119],78:[2,119],84:[2,119],85:[2,119],86:[2,119],91:[2,119],93:[2,119],102:[2,119],104:[2,119],105:[2,119],106:[2,119],110:[2,119],118:[2,119],126:[2,119],129:[2,119],130:[2,119],133:[2,119],134:[2,119],135:[2,119],136:[2,119],137:[2,119],138:[2,119],139:[2,119]},{6:[2,126],25:[2,126],26:[2,126],54:[2,126],86:[2,126],91:[2,126]},{6:[2,52],25:[2,52],26:[2,52],53:325,54:[1,232]},{6:[2,127],25:[2,127],26:[2,127],54:[2,127],86:[2,127],91:[2,127]},{1:[2,169],6:[2,169],25:[2,169],26:[2,169],49:[2,169],54:[2,169],57:[2,169],73:[2,169],78:[2,169],86:[2,169],91:[2,169],93:[2,169],102:[2,169],103:84,104:[2,169],105:[2,169],106:[2,169],109:85,110:[2,169],111:68,118:[1,326],126:[2,169],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,171],6:[2,171],25:[2,171],26:[2,171],49:[2,171],54:[2,171],57:[2,171],73:[2,171],78:[2,171],86:[2,171],91:[2,171],93:[2,171],102:[2,171],103:84,104:[2,171],105:[1,327],106:[2,171],109:85,110:[2,171],111:68,118:[2,171],126:[2,171],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,170],6:[2,170],25:[2,170],26:[2,170],49:[2,170],54:[2,170],57:[2,170],73:[2,170],78:[2,170],86:[2,170],91:[2,170],93:[2,170],102:[2,170],103:84,104:[2,170],105:[2,170],106:[2,170],109:85,110:[2,170],111:68,118:[2,170],126:[2,170],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[2,94],25:[2,94],26:[2,94],54:[2,94],78:[2,94]},{6:[2,52],25:[2,52],26:[2,52],53:328,54:[1,242]},{26:[1,329],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[1,253],25:[1,254],26:[1,330]},{26:[1,331]},{1:[2,177],6:[2,177],25:[2,177],26:[2,177],49:[2,177],54:[2,177],57:[2,177],73:[2,177],78:[2,177],86:[2,177],91:[2,177],93:[2,177],102:[2,177],104:[2,177],105:[2,177],106:[2,177],110:[2,177],118:[2,177],126:[2,177],129:[2,177],130:[2,177],133:[2,177],134:[2,177],135:[2,177],136:[2,177],137:[2,177],138:[2,177],139:[2,177]},{26:[2,181],121:[2,181],123:[2,181]},{25:[2,133],54:[2,133],103:84,104:[1,64],106:[1,65],109:85,110:[1,67],111:68,126:[1,83],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[1,276],25:[1,277],26:[1,332]},{7:333,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{7:334,8:117,9:18,10:19,11:[1,20],12:6,13:7,14:8,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,27:61,28:[1,72],29:48,30:[1,70],31:[1,71],32:22,33:[1,49],34:[1,50],35:[1,51],36:[1,52],37:[1,53],38:[1,54],39:21,44:62,45:[1,44],46:[1,45],47:[1,27],50:28,51:[1,59],52:[1,60],58:46,59:47,61:35,63:23,64:24,65:25,76:[1,69],79:[1,42],83:[1,26],88:[1,57],89:[1,58],90:[1,56],96:[1,37],100:[1,43],101:[1,55],103:38,104:[1,64],106:[1,65],107:39,108:[1,66],109:40,110:[1,67],111:68,119:[1,41],124:36,125:[1,63],127:[1,29],128:[1,30],129:[1,31],130:[1,32],131:[1,33],132:[1,34]},{6:[1,287],25:[1,288],26:[1,335]},{6:[2,40],25:[2,40],26:[2,40],54:[2,40],78:[2,40]},{6:[2,58],25:[2,58],26:[2,58],49:[2,58],54:[2,58]},{1:[2,175],6:[2,175],25:[2,175],26:[2,175],49:[2,175],54:[2,175],57:[2,175],73:[2,175],78:[2,175],86:[2,175],91:[2,175],93:[2,175],102:[2,175],104:[2,175],105:[2,175],106:[2,175],110:[2,175],118:[2,175],126:[2,175],129:[2,175],130:[2,175],133:[2,175],134:[2,175],135:[2,175],136:[2,175],137:[2,175],138:[2,175],139:[2,175]},{6:[2,128],25:[2,128],26:[2,128],54:[2,128],86:[2,128],91:[2,128]},{1:[2,172],6:[2,172],25:[2,172],26:[2,172],49:[2,172],54:[2,172],57:[2,172],73:[2,172],78:[2,172],86:[2,172],91:[2,172],93:[2,172],102:[2,172],103:84,104:[2,172],105:[2,172],106:[2,172],109:85,110:[2,172],111:68,118:[2,172],126:[2,172],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{1:[2,173],6:[2,173],25:[2,173],26:[2,173],49:[2,173],54:[2,173],57:[2,173],73:[2,173],78:[2,173],86:[2,173],91:[2,173],93:[2,173],102:[2,173],103:84,104:[2,173],105:[2,173],106:[2,173],109:85,110:[2,173],111:68,118:[2,173],126:[2,173],129:[1,76],130:[1,75],133:[1,74],134:[1,77],135:[1,78],136:[1,79],137:[1,80],138:[1,81],139:[1,82]},{6:[2,95],25:[2,95],26:[2,95],54:[2,95],78:[2,95]}],defaultActions:{59:[2,50],60:[2,51],91:[2,109],192:[2,89]},parseError:function(e,t){if(!t.recoverable)throw Error(e);
this.trace(e)},parse:function(e){function t(){var e;return e=n.lexer.lex()||p,"number"!=typeof e&&(e=n.symbols_[e]||e),e}var n=this,i=[0],r=[null],s=[],o=this.table,a="",c=0,h=0,l=0,u=2,p=1,d=s.slice.call(arguments,1);this.lexer.setInput(e),this.lexer.yy=this.yy,this.yy.lexer=this.lexer,this.yy.parser=this,this.lexer.yylloc===void 0&&(this.lexer.yylloc={});var f=this.lexer.yylloc;s.push(f);var m=this.lexer.options&&this.lexer.options.ranges;this.parseError="function"==typeof this.yy.parseError?this.yy.parseError:Object.getPrototypeOf(this).parseError;for(var b,g,k,y,v,w,T,F,L,C={};;){if(k=i[i.length-1],this.defaultActions[k]?y=this.defaultActions[k]:((null===b||b===void 0)&&(b=t()),y=o[k]&&o[k][b]),y===void 0||!y.length||!y[0]){var N="";L=[];for(w in o[k])this.terminals_[w]&&w>u&&L.push("'"+this.terminals_[w]+"'");N=this.lexer.showPosition?"Parse error on line "+(c+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+L.join(", ")+", got '"+(this.terminals_[b]||b)+"'":"Parse error on line "+(c+1)+": Unexpected "+(b==p?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(N,{text:this.lexer.match,token:this.terminals_[b]||b,line:this.lexer.yylineno,loc:f,expected:L})}if(y[0]instanceof Array&&y.length>1)throw Error("Parse Error: multiple actions possible at state: "+k+", token: "+b);switch(y[0]){case 1:i.push(b),r.push(this.lexer.yytext),s.push(this.lexer.yylloc),i.push(y[1]),b=null,g?(b=g,g=null):(h=this.lexer.yyleng,a=this.lexer.yytext,c=this.lexer.yylineno,f=this.lexer.yylloc,l>0&&l--);break;case 2:if(T=this.productions_[y[1]][1],C.$=r[r.length-T],C._$={first_line:s[s.length-(T||1)].first_line,last_line:s[s.length-1].last_line,first_column:s[s.length-(T||1)].first_column,last_column:s[s.length-1].last_column},m&&(C._$.range=[s[s.length-(T||1)].range[0],s[s.length-1].range[1]]),v=this.performAction.apply(C,[a,h,c,this.yy,y[1],r,s].concat(d)),v!==void 0)return v;T&&(i=i.slice(0,2*-1*T),r=r.slice(0,-1*T),s=s.slice(0,-1*T)),i.push(this.productions_[y[1]][0]),r.push(C.$),s.push(C._$),F=o[i[i.length-2]][i[i.length-1]],i.push(F);break;case 3:return!0}}return!0}};return e.prototype=t,t.Parser=e,new e}();return require!==void 0&&e!==void 0&&(e.parser=n,e.Parser=n.Parser,e.parse=function(){return n.parse.apply(n,arguments)},e.main=function(t){t[1]||(console.log("Usage: "+t[0]+" FILE"),process.exit(1));var n=require("fs").readFileSync(require("path").normalize(t[1]),"utf8");return e.parser.parse(n)},t!==void 0&&require.main===t&&e.main(process.argv.slice(1))),t.exports}(),require["./scope"]=function(){var e={},t={exports:e};return function(){var t,n,i,r;r=require("./helpers"),n=r.extend,i=r.last,e.Scope=t=function(){function e(t,n,i){this.parent=t,this.expressions=n,this.method=i,this.variables=[{name:"arguments",type:"arguments"}],this.positions={},this.parent||(e.root=this)}return e.root=null,e.prototype.add=function(e,t,n){return this.shared&&!n?this.parent.add(e,t,n):Object.prototype.hasOwnProperty.call(this.positions,e)?this.variables[this.positions[e]].type=t:this.positions[e]=this.variables.push({name:e,type:t})-1},e.prototype.namedMethod=function(){var e;return(null!=(e=this.method)?e.name:void 0)||!this.parent?this.method:this.parent.namedMethod()},e.prototype.find=function(e){return this.check(e)?!0:(this.add(e,"var"),!1)},e.prototype.parameter=function(e){return this.shared&&this.parent.check(e,!0)?void 0:this.add(e,"param")},e.prototype.check=function(e){var t;return!!(this.type(e)||(null!=(t=this.parent)?t.check(e):void 0))},e.prototype.temporary=function(e,t){return e.length>1?"_"+e+(t>1?t-1:""):"_"+(t+parseInt(e,36)).toString(36).replace(/\d/g,"a")},e.prototype.type=function(e){var t,n,i,r;for(r=this.variables,n=0,i=r.length;i>n;n++)if(t=r[n],t.name===e)return t.type;return null},e.prototype.freeVariable=function(e,t){var n,i;for(null==t&&(t=!0),n=0;this.check(i=this.temporary(e,n));)n++;return t&&this.add(i,"var",!0),i},e.prototype.assign=function(e,t){return this.add(e,{value:t,assigned:!0},!0),this.hasAssignments=!0},e.prototype.hasDeclarations=function(){return!!this.declaredVariables().length},e.prototype.declaredVariables=function(){var e,t,n,i,r,s;for(e=[],t=[],s=this.variables,i=0,r=s.length;r>i;i++)n=s[i],"var"===n.type&&("_"===n.name.charAt(0)?t:e).push(n.name);return e.sort().concat(t.sort())},e.prototype.assignedVariables=function(){var e,t,n,i,r;for(i=this.variables,r=[],t=0,n=i.length;n>t;t++)e=i[t],e.type.assigned&&r.push(""+e.name+" = "+e.type.value);return r},e}()}.call(this),t.exports}(),require["./nodes"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,h,l,u,p,d,f,m,b,g,k,y,v,w,T,F,L,C,N,E,x,D,S,R,A,I,_,$,O,j,M,B,V,P,U,H,q,G,W,X,Y,z,K,J,Z,Q,et,tt,nt,it,rt,st,ot,at,ct,ht,lt,ut,pt,dt,ft,mt,bt,gt,kt,yt,vt,wt,Tt={}.hasOwnProperty,Ft=function(e,t){function n(){this.constructor=e}for(var i in t)Tt.call(t,i)&&(e[i]=t[i]);return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e},Lt=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1},Ct=[].slice;Error.stackTraceLimit=1/0,H=require("./scope").Scope,vt=require("./lexer"),M=vt.RESERVED,U=vt.STRICT_PROSCRIBED,wt=require("./helpers"),nt=wt.compact,ot=wt.flatten,st=wt.extend,pt=wt.merge,it=wt.del,bt=wt.starts,rt=wt.ends,lt=wt.last,mt=wt.some,tt=wt.addLocationDataFn,ut=wt.locationDataToString,gt=wt.throwSyntaxError,e.extend=st,e.addLocationDataFn=tt,et=function(){return!0},A=function(){return!1},Y=function(){return this},R=function(){return this.negated=!this.negated,this},e.CodeFragment=h=function(){function e(e,t){var n;this.code=""+t,this.locationData=null!=e?e.locationData:void 0,this.type=(null!=e?null!=(n=e.constructor)?n.name:void 0:void 0)||"unknown"}return e.prototype.toString=function(){return""+this.code+(this.locationData?": "+ut(this.locationData):"")},e}(),at=function(e){var t;return function(){var n,i,r;for(r=[],n=0,i=e.length;i>n;n++)t=e[n],r.push(t.code);return r}().join("")},e.Base=r=function(){function e(){}return e.prototype.compile=function(e,t){return at(this.compileToFragments(e,t))},e.prototype.compileToFragments=function(e,t){var n;return e=st({},e),t&&(e.level=t),n=this.unfoldSoak(e)||this,n.tab=e.indent,e.level!==x&&n.isStatement(e)?n.compileClosure(e):n.compileNode(e)},e.prototype.compileClosure=function(e){var n,i,r,a,h;return(a=this.jumps())&&a.error("cannot use a pure statement in an expression"),e.sharedScope=!0,r=new c([],s.wrap([this])),n=[],((i=this.contains(ct))||this.contains(ht))&&(n=[new D("this")],i?(h="apply",n.push(new D("arguments"))):h="call",r=new Z(r,[new t(new D(h))])),new o(r,n).compileNode(e)},e.prototype.cache=function(e,t,n){var r,s;return this.isComplex()?(r=new D(n||e.scope.freeVariable("ref")),s=new i(r,this),t?[s.compileToFragments(e,t),[this.makeCode(r.value)]]:[s,r]):(r=t?this.compileToFragments(e,t):this,[r,r])},e.prototype.cacheToCodeFragments=function(e){return[at(e[0]),at(e[1])]},e.prototype.makeReturn=function(e){var t;return t=this.unwrapAll(),e?new o(new D(""+e+".push"),[t]):new V(t)},e.prototype.contains=function(e){var t;return t=void 0,this.traverseChildren(!1,function(n){return e(n)?(t=n,!1):void 0}),t},e.prototype.lastNonComment=function(e){var t;for(t=e.length;t--;)if(!(e[t]instanceof l))return e[t];return null},e.prototype.toString=function(e,t){var n;return null==e&&(e=""),null==t&&(t=this.constructor.name),n="\n"+e+t,this.soak&&(n+="?"),this.eachChild(function(t){return n+=t.toString(e+X)}),n},e.prototype.eachChild=function(e){var t,n,i,r,s,o,a,c;if(!this.children)return this;for(a=this.children,i=0,s=a.length;s>i;i++)if(t=a[i],this[t])for(c=ot([this[t]]),r=0,o=c.length;o>r;r++)if(n=c[r],e(n)===!1)return this;return this},e.prototype.traverseChildren=function(e,t){return this.eachChild(function(n){var i;return i=t(n),i!==!1?n.traverseChildren(e,t):void 0})},e.prototype.invert=function(){return new $("!",this)},e.prototype.unwrapAll=function(){var e;for(e=this;e!==(e=e.unwrap()););return e},e.prototype.children=[],e.prototype.isStatement=A,e.prototype.jumps=A,e.prototype.isComplex=et,e.prototype.isChainable=A,e.prototype.isAssignable=A,e.prototype.unwrap=Y,e.prototype.unfoldSoak=A,e.prototype.assigns=A,e.prototype.updateLocationDataIfMissing=function(e){return this.locationData?this:(this.locationData=e,this.eachChild(function(t){return t.updateLocationDataIfMissing(e)}))},e.prototype.error=function(e){return gt(e,this.locationData)},e.prototype.makeCode=function(e){return new h(this,e)},e.prototype.wrapInBraces=function(e){return[].concat(this.makeCode("("),e,this.makeCode(")"))},e.prototype.joinFragmentArrays=function(e,t){var n,i,r,s,o;for(n=[],r=s=0,o=e.length;o>s;r=++s)i=e[r],r&&n.push(this.makeCode(t)),n=n.concat(i);return n},e}(),e.Block=s=function(e){function t(e){this.expressions=nt(ot(e||[]))}return Ft(t,e),t.prototype.children=["expressions"],t.prototype.push=function(e){return this.expressions.push(e),this},t.prototype.pop=function(){return this.expressions.pop()},t.prototype.unshift=function(e){return this.expressions.unshift(e),this},t.prototype.unwrap=function(){return 1===this.expressions.length?this.expressions[0]:this},t.prototype.isEmpty=function(){return!this.expressions.length},t.prototype.isStatement=function(e){var t,n,i,r;for(r=this.expressions,n=0,i=r.length;i>n;n++)if(t=r[n],t.isStatement(e))return!0;return!1},t.prototype.jumps=function(e){var t,n,i,r,s;for(s=this.expressions,i=0,r=s.length;r>i;i++)if(t=s[i],n=t.jumps(e))return n},t.prototype.makeReturn=function(e){var t,n;for(n=this.expressions.length;n--;)if(t=this.expressions[n],!(t instanceof l)){this.expressions[n]=t.makeReturn(e),t instanceof V&&!t.expression&&this.expressions.splice(n,1);break}return this},t.prototype.compileToFragments=function(e,n){return null==e&&(e={}),e.scope?t.__super__.compileToFragments.call(this,e,n):this.compileRoot(e)},t.prototype.compileNode=function(e){var n,i,r,s,o,a,c,h,l;for(this.tab=e.indent,a=e.level===x,i=[],l=this.expressions,s=c=0,h=l.length;h>c;s=++c)o=l[s],o=o.unwrapAll(),o=o.unfoldSoak(e)||o,o instanceof t?i.push(o.compileNode(e)):a?(o.front=!0,r=o.compileToFragments(e),o.isStatement(e)||(r.unshift(this.makeCode(""+this.tab)),r.push(this.makeCode(";"))),i.push(r)):i.push(o.compileToFragments(e,C));return a?this.spaced?[].concat(this.joinFragmentArrays(i,"\n\n"),this.makeCode("\n")):this.joinFragmentArrays(i,"\n"):(n=i.length?this.joinFragmentArrays(i,", "):[this.makeCode("void 0")],i.length>1&&e.level>=C?this.wrapInBraces(n):n)},t.prototype.compileRoot=function(e){var t,n,i,r,s,o,a,c,h,u;for(e.indent=e.bare?"":X,e.level=x,this.spaced=!0,e.scope=new H(null,this,null),u=e.locals||[],c=0,h=u.length;h>c;c++)r=u[c],e.scope.parameter(r);return s=[],e.bare||(o=function(){var e,n,r,s;for(r=this.expressions,s=[],i=e=0,n=r.length;n>e&&(t=r[i],t.unwrap()instanceof l);i=++e)s.push(t);return s}.call(this),a=this.expressions.slice(o.length),this.expressions=o,o.length&&(s=this.compileNode(pt(e,{indent:""})),s.push(this.makeCode("\n"))),this.expressions=a),n=this.compileWithDeclarations(e),e.bare?n:[].concat(s,this.makeCode("(function() {\n"),n,this.makeCode("\n}).call(this);\n"))},t.prototype.compileWithDeclarations=function(e){var t,n,i,r,s,o,a,c,h,u,p,d,f,m;for(r=[],o=[],d=this.expressions,s=u=0,p=d.length;p>u&&(i=d[s],i=i.unwrap(),i instanceof l||i instanceof D);s=++u);return e=pt(e,{level:x}),s&&(a=this.expressions.splice(s,9e9),f=[this.spaced,!1],h=f[0],this.spaced=f[1],m=[this.compileNode(e),h],r=m[0],this.spaced=m[1],this.expressions=a),o=this.compileNode(e),c=e.scope,c.expressions===this&&(n=e.scope.hasDeclarations(),t=c.hasAssignments,n||t?(s&&r.push(this.makeCode("\n")),r.push(this.makeCode(""+this.tab+"var ")),n&&r.push(this.makeCode(c.declaredVariables().join(", "))),t&&(n&&r.push(this.makeCode(",\n"+(this.tab+X))),r.push(this.makeCode(c.assignedVariables().join(",\n"+(this.tab+X))))),r.push(this.makeCode(";\n"+(this.spaced?"\n":"")))):r.length&&o.length&&r.push(this.makeCode("\n"))),r.concat(o)},t.wrap=function(e){return 1===e.length&&e[0]instanceof t?e[0]:new t(e)},t}(r),e.Literal=D=function(e){function t(e){this.value=e}return Ft(t,e),t.prototype.makeReturn=function(){return this.isStatement()?this:t.__super__.makeReturn.apply(this,arguments)},t.prototype.isAssignable=function(){return b.test(this.value)},t.prototype.isStatement=function(){var e;return"break"===(e=this.value)||"continue"===e||"debugger"===e},t.prototype.isComplex=A,t.prototype.assigns=function(e){return e===this.value},t.prototype.jumps=function(e){return"break"!==this.value||(null!=e?e.loop:void 0)||(null!=e?e.block:void 0)?"continue"!==this.value||(null!=e?e.loop:void 0)?void 0:this:this},t.prototype.compileNode=function(e){var t,n,i;return n="this"===this.value?(null!=(i=e.scope.method)?i.bound:void 0)?e.scope.method.context:this.value:this.value.reserved?'"'+this.value+'"':this.value,t=this.isStatement()?""+this.tab+n+";":n,[this.makeCode(t)]},t.prototype.toString=function(){return' "'+this.value+'"'},t}(r),e.Undefined=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return Ft(t,e),t.prototype.isAssignable=A,t.prototype.isComplex=A,t.prototype.compileNode=function(e){return[this.makeCode(e.level>=F?"(void 0)":"void 0")]},t}(r),e.Null=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return Ft(t,e),t.prototype.isAssignable=A,t.prototype.isComplex=A,t.prototype.compileNode=function(){return[this.makeCode("null")]},t}(r),e.Bool=function(e){function t(e){this.val=e}return Ft(t,e),t.prototype.isAssignable=A,t.prototype.isComplex=A,t.prototype.compileNode=function(){return[this.makeCode(this.val)]},t}(r),e.Return=V=function(e){function t(e){e&&!e.unwrap().isUndefined&&(this.expression=e)}return Ft(t,e),t.prototype.children=["expression"],t.prototype.isStatement=et,t.prototype.makeReturn=Y,t.prototype.jumps=Y,t.prototype.compileToFragments=function(e,n){var i,r;return i=null!=(r=this.expression)?r.makeReturn():void 0,!i||i instanceof t?t.__super__.compileToFragments.call(this,e,n):i.compileToFragments(e,n)},t.prototype.compileNode=function(e){var t;return t=[],t.push(this.makeCode(this.tab+("return"+(this.expression?" ":"")))),this.expression&&(t=t.concat(this.expression.compileToFragments(e,E))),t.push(this.makeCode(";")),t},t}(r),e.Value=Z=function(e){function t(e,n,i){return!n&&e instanceof t?e:(this.base=e,this.properties=n||[],i&&(this[i]=!0),this)}return Ft(t,e),t.prototype.children=["base","properties"],t.prototype.add=function(e){return this.properties=this.properties.concat(e),this},t.prototype.hasProperties=function(){return!!this.properties.length},t.prototype.bareLiteral=function(e){return!this.properties.length&&this.base instanceof e},t.prototype.isArray=function(){return this.bareLiteral(n)},t.prototype.isRange=function(){return this.bareLiteral(B)},t.prototype.isComplex=function(){return this.hasProperties()||this.base.isComplex()},t.prototype.isAssignable=function(){return this.hasProperties()||this.base.isAssignable()},t.prototype.isSimpleNumber=function(){return this.bareLiteral(D)&&P.test(this.base.value)},t.prototype.isString=function(){return this.bareLiteral(D)&&y.test(this.base.value)},t.prototype.isRegex=function(){return this.bareLiteral(D)&&k.test(this.base.value)},t.prototype.isAtomic=function(){var e,t,n,i;for(i=this.properties.concat(this.base),t=0,n=i.length;n>t;t++)if(e=i[t],e.soak||e instanceof o)return!1;return!0},t.prototype.isNotCallable=function(){return this.isSimpleNumber()||this.isString()||this.isRegex()||this.isArray()||this.isRange()||this.isSplice()||this.isObject()},t.prototype.isStatement=function(e){return!this.properties.length&&this.base.isStatement(e)},t.prototype.assigns=function(e){return!this.properties.length&&this.base.assigns(e)},t.prototype.jumps=function(e){return!this.properties.length&&this.base.jumps(e)},t.prototype.isObject=function(e){return this.properties.length?!1:this.base instanceof _&&(!e||this.base.generated)},t.prototype.isSplice=function(){return lt(this.properties)instanceof q},t.prototype.looksStatic=function(e){var t;return this.base.value===e&&this.properties.length&&"prototype"!==(null!=(t=this.properties[0].name)?t.value:void 0)},t.prototype.unwrap=function(){return this.properties.length?this:this.base},t.prototype.cacheReference=function(e){var n,r,s,o;return s=lt(this.properties),2>this.properties.length&&!this.base.isComplex()&&!(null!=s?s.isComplex():void 0)?[this,this]:(n=new t(this.base,this.properties.slice(0,-1)),n.isComplex()&&(r=new D(e.scope.freeVariable("base")),n=new t(new j(new i(r,n)))),s?(s.isComplex()&&(o=new D(e.scope.freeVariable("name")),s=new T(new i(o,s.index)),o=new T(o)),[n.add(s),new t(r||n.base,[o||s])]):[n,r])},t.prototype.compileNode=function(e){var t,n,i,r,s;for(this.base.front=this.front,i=this.properties,t=this.base.compileToFragments(e,i.length?F:null),(this.base instanceof j||i.length)&&P.test(at(t))&&t.push(this.makeCode(".")),r=0,s=i.length;s>r;r++)n=i[r],t.push.apply(t,n.compileToFragments(e));return t},t.prototype.unfoldSoak=function(e){return null!=this.unfoldedSoak?this.unfoldedSoak:this.unfoldedSoak=function(n){return function(){var r,s,o,a,c,h,l,p,d,f;if(o=n.base.unfoldSoak(e))return(d=o.body.properties).push.apply(d,n.properties),o;for(f=n.properties,s=l=0,p=f.length;p>l;s=++l)if(a=f[s],a.soak)return a.soak=!1,r=new t(n.base,n.properties.slice(0,s)),h=new t(n.base,n.properties.slice(s)),r.isComplex()&&(c=new D(e.scope.freeVariable("ref")),r=new j(new i(c,r)),h.base=c),new v(new u(r),h,{soak:!0});return!1}}(this)()},t}(r),e.Comment=l=function(e){function t(e){this.comment=e}return Ft(t,e),t.prototype.isStatement=et,t.prototype.makeReturn=Y,t.prototype.compileNode=function(e,t){var n,i;return i=this.comment.replace(/^(\s*)#/gm,"$1 *"),n="/*"+dt(i,this.tab)+(Lt.call(i,"\n")>=0?"\n"+this.tab:"")+" */",(t||e.level)===x&&(n=e.indent+n),[this.makeCode("\n"),this.makeCode(n)]},t}(r),e.Call=o=function(e){function n(e,t,n){this.args=null!=t?t:[],this.soak=n,this.isNew=!1,this.isSuper="super"===e,this.variable=this.isSuper?null:e,e instanceof Z&&e.isNotCallable()&&e.error("literal is not a function")}return Ft(n,e),n.prototype.children=["variable","args"],n.prototype.newInstance=function(){var e,t;return e=(null!=(t=this.variable)?t.base:void 0)||this.variable,e instanceof n&&!e.isNew?e.newInstance():this.isNew=!0,this},n.prototype.superReference=function(e){var n,i;return i=e.scope.namedMethod(),(null!=i?i.klass:void 0)?(n=[new t(new D("__super__"))],i["static"]&&n.push(new t(new D("constructor"))),n.push(new t(new D(i.name))),new Z(new D(i.klass),n).compile(e)):(null!=i?i.ctor:void 0)?""+i.name+".__super__.constructor":this.error("cannot call super outside of an instance method.")},n.prototype.superThis=function(e){var t;return t=e.scope.method,t&&!t.klass&&t.context||"this"},n.prototype.unfoldSoak=function(e){var t,i,r,s,o,a,c,h,l;if(this.soak){if(this.variable){if(i=kt(e,this,"variable"))return i;h=new Z(this.variable).cacheReference(e),r=h[0],o=h[1]}else r=new D(this.superReference(e)),o=new Z(r);return o=new n(o,this.args),o.isNew=this.isNew,r=new D("typeof "+r.compile(e)+' === "function"'),new v(r,new Z(o),{soak:!0})}for(t=this,s=[];;)if(t.variable instanceof n)s.push(t),t=t.variable;else{if(!(t.variable instanceof Z))break;if(s.push(t),!((t=t.variable.base)instanceof n))break}for(l=s.reverse(),a=0,c=l.length;c>a;a++)t=l[a],i&&(t.variable instanceof n?t.variable=i:t.variable.base=i),i=kt(e,t,"variable");return i},n.prototype.compileNode=function(e){var t,n,i,r,s,o,a,c,h,l;if(null!=(h=this.variable)&&(h.front=this.front),r=G.compileSplattedArray(e,this.args,!0),r.length)return this.compileSplat(e,r);for(i=[],l=this.args,n=a=0,c=l.length;c>a;n=++a)t=l[n],n&&i.push(this.makeCode(", ")),i.push.apply(i,t.compileToFragments(e,C));return s=[],this.isSuper?(o=this.superReference(e)+(".call("+this.superThis(e)),i.length&&(o+=", "),s.push(this.makeCode(o))):(this.isNew&&s.push(this.makeCode("new ")),s.push.apply(s,this.variable.compileToFragments(e,F)),s.push(this.makeCode("("))),s.push.apply(s,i),s.push(this.makeCode(")")),s},n.prototype.compileSplat=function(e,t){var n,i,r,s,o,a;return this.isSuper?[].concat(this.makeCode(""+this.superReference(e)+".apply("+this.superThis(e)+", "),t,this.makeCode(")")):this.isNew?(s=this.tab+X,[].concat(this.makeCode("(function(func, args, ctor) {\n"+s+"ctor.prototype = func.prototype;\n"+s+"var child = new ctor, result = func.apply(child, args);\n"+s+"return Object(result) === result ? result : child;\n"+this.tab+"})("),this.variable.compileToFragments(e,C),this.makeCode(", "),t,this.makeCode(", function(){})"))):(n=[],i=new Z(this.variable),(o=i.properties.pop())&&i.isComplex()?(a=e.scope.freeVariable("ref"),n=n.concat(this.makeCode("("+a+" = "),i.compileToFragments(e,C),this.makeCode(")"),o.compileToFragments(e))):(r=i.compileToFragments(e,F),P.test(at(r))&&(r=this.wrapInBraces(r)),o?(a=at(r),r.push.apply(r,o.compileToFragments(e))):a="null",n=n.concat(r)),n=n.concat(this.makeCode(".apply("+a+", "),t,this.makeCode(")")))},n}(r),e.Extends=d=function(e){function t(e,t){this.child=e,this.parent=t}return Ft(t,e),t.prototype.children=["child","parent"],t.prototype.compileToFragments=function(e){return new o(new Z(new D(yt("extends"))),[this.child,this.parent]).compileToFragments(e)},t}(r),e.Access=t=function(e){function t(e,t){this.name=e,this.name.asKey=!0,this.soak="soak"===t}return Ft(t,e),t.prototype.children=["name"],t.prototype.compileToFragments=function(e){var t;return t=this.name.compileToFragments(e),b.test(at(t))?t.unshift(this.makeCode(".")):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.isComplex=A,t}(r),e.Index=T=function(e){function t(e){this.index=e}return Ft(t,e),t.prototype.children=["index"],t.prototype.compileToFragments=function(e){return[].concat(this.makeCode("["),this.index.compileToFragments(e,E),this.makeCode("]"))},t.prototype.isComplex=function(){return this.index.isComplex()},t}(r),e.Range=B=function(e){function t(e,t,n){this.from=e,this.to=t,this.exclusive="exclusive"===n,this.equals=this.exclusive?"":"="}return Ft(t,e),t.prototype.children=["from","to"],t.prototype.compileVariables=function(e){var t,n,i,r,s;return e=pt(e,{top:!0}),n=this.cacheToCodeFragments(this.from.cache(e,C)),this.fromC=n[0],this.fromVar=n[1],i=this.cacheToCodeFragments(this.to.cache(e,C)),this.toC=i[0],this.toVar=i[1],(t=it(e,"step"))&&(r=this.cacheToCodeFragments(t.cache(e,C)),this.step=r[0],this.stepVar=r[1]),s=[this.fromVar.match(I),this.toVar.match(I)],this.fromNum=s[0],this.toNum=s[1],this.stepVar?this.stepNum=this.stepVar.match(I):void 0},t.prototype.compileNode=function(e){var t,n,i,r,s,o,a,c,h,l,u,p,d,f;return this.fromVar||this.compileVariables(e),e.index?(a=this.fromNum&&this.toNum,s=it(e,"index"),o=it(e,"name"),h=o&&o!==s,p=""+s+" = "+this.fromC,this.toC!==this.toVar&&(p+=", "+this.toC),this.step!==this.stepVar&&(p+=", "+this.step),d=[""+s+" <"+this.equals,""+s+" >"+this.equals],c=d[0],r=d[1],n=this.stepNum?ft(this.stepNum[0])>0?""+c+" "+this.toVar:""+r+" "+this.toVar:a?(f=[ft(this.fromNum[0]),ft(this.toNum[0])],i=f[0],u=f[1],f,u>=i?""+c+" "+u:""+r+" "+u):(t=this.stepVar?""+this.stepVar+" > 0":""+this.fromVar+" <= "+this.toVar,""+t+" ? "+c+" "+this.toVar+" : "+r+" "+this.toVar),l=this.stepVar?""+s+" += "+this.stepVar:a?h?u>=i?"++"+s:"--"+s:u>=i?""+s+"++":""+s+"--":h?""+t+" ? ++"+s+" : --"+s:""+t+" ? "+s+"++ : "+s+"--",h&&(p=""+o+" = "+p),h&&(l=""+o+" = "+l),[this.makeCode(""+p+"; "+n+"; "+l)]):this.compileArray(e)},t.prototype.compileArray=function(e){var t,n,i,r,s,o,a,c,h,l,u,p,d;return this.fromNum&&this.toNum&&20>=Math.abs(this.fromNum-this.toNum)?(h=function(){d=[];for(var e=p=+this.fromNum,t=+this.toNum;t>=p?t>=e:e>=t;t>=p?e++:e--)d.push(e);return d}.apply(this),this.exclusive&&h.pop(),[this.makeCode("["+h.join(", ")+"]")]):(o=this.tab+X,s=e.scope.freeVariable("i"),l=e.scope.freeVariable("results"),c="\n"+o+l+" = [];",this.fromNum&&this.toNum?(e.index=s,n=at(this.compileNode(e))):(u=""+s+" = "+this.fromC+(this.toC!==this.toVar?", "+this.toC:""),i=""+this.fromVar+" <= "+this.toVar,n="var "+u+"; "+i+" ? "+s+" <"+this.equals+" "+this.toVar+" : "+s+" >"+this.equals+" "+this.toVar+"; "+i+" ? "+s+"++ : "+s+"--"),a="{ "+l+".push("+s+"); }\n"+o+"return "+l+";\n"+e.indent,r=function(e){return null!=e?e.contains(ct):void 0},(r(this.from)||r(this.to))&&(t=", arguments"),[this.makeCode("(function() {"+c+"\n"+o+"for ("+n+")"+a+"}).apply(this"+(null!=t?t:"")+")")])},t}(r),e.Slice=q=function(e){function t(e){this.range=e,t.__super__.constructor.call(this)}return Ft(t,e),t.prototype.children=["range"],t.prototype.compileNode=function(e){var t,n,i,r,s,o,a;return a=this.range,s=a.to,i=a.from,r=i&&i.compileToFragments(e,E)||[this.makeCode("0")],s&&(t=s.compileToFragments(e,E),n=at(t),(this.range.exclusive||-1!==+n)&&(o=", "+(this.range.exclusive?n:P.test(n)?""+(+n+1):(t=s.compileToFragments(e,F),"+"+at(t)+" + 1 || 9e9")))),[this.makeCode(".slice("+at(r)+(o||"")+")")]},t}(r),e.Obj=_=function(e){function t(e,t){this.generated=null!=t?t:!1,this.objects=this.properties=e||[]}return Ft(t,e),t.prototype.children=["properties"],t.prototype.compileNode=function(e){var t,n,r,s,o,a,c,h,u,p,d,f,m;if(u=this.properties,!u.length)return[this.makeCode(this.front?"({})":"{}")];if(this.generated)for(p=0,f=u.length;f>p;p++)c=u[p],c instanceof Z&&c.error("cannot have an implicit value in an implicit object");for(r=e.indent+=X,a=this.lastNonComment(this.properties),t=[],n=d=0,m=u.length;m>d;n=++d)h=u[n],o=n===u.length-1?"":h===a||h instanceof l?"\n":",\n",s=h instanceof l?"":r,h instanceof i&&h.variable instanceof Z&&h.variable.hasProperties()&&h.variable.error("Invalid object key"),h instanceof Z&&h["this"]&&(h=new i(h.properties[0].name,h,"object")),h instanceof l||(h instanceof i||(h=new i(h,h,"object")),(h.variable.base||h.variable).asKey=!0),s&&t.push(this.makeCode(s)),t.push.apply(t,h.compileToFragments(e,x)),o&&t.push(this.makeCode(o));return t.unshift(this.makeCode("{"+(u.length&&"\n"))),t.push(this.makeCode(""+(u.length&&"\n"+this.tab)+"}")),this.front?this.wrapInBraces(t):t},t.prototype.assigns=function(e){var t,n,i,r;for(r=this.properties,n=0,i=r.length;i>n;n++)if(t=r[n],t.assigns(e))return!0;return!1},t}(r),e.Arr=n=function(e){function t(e){this.objects=e||[]}return Ft(t,e),t.prototype.children=["objects"],t.prototype.compileNode=function(e){var t,n,i,r,s,o,a;if(!this.objects.length)return[this.makeCode("[]")];if(e.indent+=X,t=G.compileSplattedArray(e,this.objects),t.length)return t;for(t=[],n=function(){var t,n,i,r;for(i=this.objects,r=[],t=0,n=i.length;n>t;t++)s=i[t],r.push(s.compileToFragments(e,C));return r}.call(this),r=o=0,a=n.length;a>o;r=++o)i=n[r],r&&t.push(this.makeCode(", ")),t.push.apply(t,i);return at(t).indexOf("\n")>=0?(t.unshift(this.makeCode("[\n"+e.indent)),t.push(this.makeCode("\n"+this.tab+"]"))):(t.unshift(this.makeCode("[")),t.push(this.makeCode("]"))),t},t.prototype.assigns=function(e){var t,n,i,r;for(r=this.objects,n=0,i=r.length;i>n;n++)if(t=r[n],t.assigns(e))return!0;return!1},t}(r),e.Class=a=function(e){function n(e,t,n){this.variable=e,this.parent=t,this.body=null!=n?n:new s,this.boundFuncs=[],this.body.classBody=!0}return Ft(n,e),n.prototype.children=["variable","parent","body"],n.prototype.determineName=function(){var e,n;return this.variable?(e=(n=lt(this.variable.properties))?n instanceof t&&n.name.value:this.variable.base.value,Lt.call(U,e)>=0&&this.variable.error("class variable name may not be "+e),e&&(e=b.test(e)&&e)):null},n.prototype.setContext=function(e){return this.body.traverseChildren(!1,function(t){return t.classBody?!1:t instanceof D&&"this"===t.value?t.value=e:t instanceof c&&(t.klass=e,t.bound)?t.context=e:void 0})},n.prototype.addBoundFunctions=function(e){var n,i,r,s,o;for(o=this.boundFuncs,r=0,s=o.length;s>r;r++)n=o[r],i=new Z(new D("this"),[new t(n)]).compile(e),this.ctor.body.unshift(new D(""+i+" = "+yt("bind")+"("+i+", this)"))},n.prototype.addProperties=function(e,n,r){var s,o,a,h,l;return l=e.base.properties.slice(0),a=function(){var e;for(e=[];s=l.shift();)s instanceof i&&(o=s.variable.base,delete s.context,h=s.value,"constructor"===o.value?(this.ctor&&s.error("cannot define more than one constructor in a class"),h.bound&&s.error("cannot define a constructor as a bound function"),h instanceof c?s=this.ctor=h:(this.externalCtor=r.classScope.freeVariable("class"),s=new i(new D(this.externalCtor),h))):s.variable["this"]?h["static"]=!0:(s.variable=new Z(new D(n),[new t(new D("prototype")),new t(o)]),h instanceof c&&h.bound&&(this.boundFuncs.push(o),h.bound=!1))),e.push(s);return e}.call(this),nt(a)},n.prototype.walkBody=function(e,t){return this.traverseChildren(!1,function(r){return function(o){var a,c,h,l,u,p,d;if(a=!0,o instanceof n)return!1;if(o instanceof s){for(d=c=o.expressions,h=u=0,p=d.length;p>u;h=++u)l=d[h],l instanceof i&&l.variable.looksStatic(e)?l.value["static"]=!0:l instanceof Z&&l.isObject(!0)&&(a=!1,c[h]=r.addProperties(l,e,t));o.expressions=c=ot(c)}return a&&!(o instanceof n)}}(this))},n.prototype.hoistDirectivePrologue=function(){var e,t,n;for(t=0,e=this.body.expressions;(n=e[t])&&n instanceof l||n instanceof Z&&n.isString();)++t;return this.directives=e.splice(0,t)},n.prototype.ensureConstructor=function(e){return this.ctor||(this.ctor=new c,this.externalCtor?this.ctor.body.push(new D(""+this.externalCtor+".apply(this, arguments)")):this.parent&&this.ctor.body.push(new D(""+e+".__super__.constructor.apply(this, arguments)")),this.ctor.body.makeReturn(),this.body.expressions.unshift(this.ctor)),this.ctor.ctor=this.ctor.name=e,this.ctor.klass=null,this.ctor.noReturn=!0},n.prototype.compileNode=function(e){var t,n,r,a,h,l,u,p,f;return(a=this.body.jumps())&&a.error("Class bodies cannot contain pure statements"),(n=this.body.contains(ct))&&n.error("Class bodies shouldn't reference arguments"),u=this.determineName()||"_Class",u.reserved&&(u="_"+u),l=new D(u),r=new c([],s.wrap([this.body])),t=[],e.classScope=r.makeScope(e.scope),this.hoistDirectivePrologue(),this.setContext(u),this.walkBody(u,e),this.ensureConstructor(u),this.addBoundFunctions(e),this.body.spaced=!0,this.body.expressions.push(l),this.parent&&(p=new D(e.classScope.freeVariable("super",!1)),this.body.expressions.unshift(new d(l,p)),r.params.push(new O(p)),t.push(this.parent)),(f=this.body.expressions).unshift.apply(f,this.directives),h=new j(new o(r,t)),this.variable&&(h=new i(this.variable,h)),h.compileToFragments(e)},n}(r),e.Assign=i=function(e){function n(e,t,n,i){var r,s,o;this.variable=e,this.value=t,this.context=n,this.param=i&&i.param,this.subpattern=i&&i.subpattern,o=s=this.variable.unwrapAll().value,r=Lt.call(U,o)>=0,r&&"object"!==this.context&&this.variable.error('variable name may not be "'+s+'"')}return Ft(n,e),n.prototype.children=["variable","value"],n.prototype.isStatement=function(e){return(null!=e?e.level:void 0)===x&&null!=this.context&&Lt.call(this.context,"?")>=0},n.prototype.assigns=function(e){return this["object"===this.context?"value":"variable"].assigns(e)},n.prototype.unfoldSoak=function(e){return kt(e,this,"variable")},n.prototype.compileNode=function(e){var t,n,i,r,s,o,a,h,l,u,p;if(i=this.variable instanceof Z){if(this.variable.isArray()||this.variable.isObject())return this.compilePatternMatch(e);if(this.variable.isSplice())return this.compileSplice(e);if("||="===(h=this.context)||"&&="===h||"?="===h)return this.compileConditional(e);if("**="===(l=this.context)||"//="===l||"%%="===l)return this.compileSpecialMath(e)}return n=this.variable.compileToFragments(e,C),s=at(n),this.context||(a=this.variable.unwrapAll(),a.isAssignable()||this.variable.error('"'+this.variable.compile(e)+'" cannot be assigned'),("function"==typeof a.hasProperties?a.hasProperties():void 0)||(this.param?e.scope.add(s,"var"):e.scope.find(s))),this.value instanceof c&&(r=S.exec(s))&&(r[2]&&(this.value.klass=r[1]),this.value.name=null!=(u=null!=(p=r[3])?p:r[4])?u:r[5]),o=this.value.compileToFragments(e,C),"object"===this.context?n.concat(this.makeCode(": "),o):(t=n.concat(this.makeCode(" "+(this.context||"=")+" "),o),C>=e.level?t:this.wrapInBraces(t))
},n.prototype.compilePatternMatch=function(e){var i,r,s,o,a,c,h,l,u,d,f,m,g,k,y,v,w,F,L,E,S,R,A,I,_,$,O,B;if(v=e.level===x,F=this.value,m=this.variable.base.objects,!(g=m.length))return s=F.compileToFragments(e),e.level>=N?this.wrapInBraces(s):s;if(l=this.variable.isObject(),v&&1===g&&!((f=m[0])instanceof G))return f instanceof n?(A=f,I=A.variable,h=I.base,f=A.value):h=l?f["this"]?f.properties[0].name:f:new D(0),i=b.test(h.unwrap().value||0),F=new Z(F),F.properties.push(new(i?t:T)(h)),_=f.unwrap().value,Lt.call(M,_)>=0&&f.error("assignment to a reserved word: "+f.compile(e)),new n(f,F,null,{param:this.param}).compileToFragments(e,x);for(L=F.compileToFragments(e,C),E=at(L),r=[],o=!1,(!b.test(E)||this.variable.assigns(E))&&(r.push([this.makeCode(""+(k=e.scope.freeVariable("ref"))+" = ")].concat(Ct.call(L))),L=[this.makeCode(k)],E=k),c=S=0,R=m.length;R>S;c=++S){if(f=m[c],h=c,l&&(f instanceof n?($=f,O=$.variable,h=O.base,f=$.value):f.base instanceof j?(B=new Z(f.unwrapAll()).cacheReference(e),f=B[0],h=B[1]):h=f["this"]?f.properties[0].name:f),!o&&f instanceof G)d=f.name.unwrap().value,f=f.unwrap(),w=""+g+" <= "+E+".length ? "+yt("slice")+".call("+E+", "+c,(y=g-c-1)?(u=e.scope.freeVariable("i"),w+=", "+u+" = "+E+".length - "+y+") : ("+u+" = "+c+", [])"):w+=") : []",w=new D(w),o=""+u+"++";else{if(!o&&f instanceof p){(y=g-c-1)&&(1===y?o=""+E+".length - 1":(u=e.scope.freeVariable("i"),w=new D(""+u+" = "+E+".length - "+y),o=""+u+"++",r.push(w.compileToFragments(e,C))));continue}d=f.unwrap().value,(f instanceof G||f instanceof p)&&f.error("multiple splats/expansions are disallowed in an assignment"),"number"==typeof h?(h=new D(o||h),i=!1):i=l&&b.test(h.unwrap().value||0),w=new Z(new D(E),[new(i?t:T)(h)])}null!=d&&Lt.call(M,d)>=0&&f.error("assignment to a reserved word: "+f.compile(e)),r.push(new n(f,w,null,{param:this.param,subpattern:!0}).compileToFragments(e,C))}return v||this.subpattern||r.push(L),a=this.joinFragmentArrays(r,", "),C>e.level?a:this.wrapInBraces(a)},n.prototype.compileConditional=function(e){var t,i,r,s;return s=this.variable.cacheReference(e),i=s[0],r=s[1],!i.properties.length&&i.base instanceof D&&"this"!==i.base.value&&!e.scope.check(i.base.value)&&this.variable.error('the variable "'+i.base.value+"\" can't be assigned with "+this.context+" because it has not been declared before"),Lt.call(this.context,"?")>=0?(e.isExistentialEquals=!0,new v(new u(i),r,{type:"if"}).addElse(new n(r,this.value,"=")).compileToFragments(e)):(t=new $(this.context.slice(0,-1),i,new n(r,this.value,"=")).compileToFragments(e),C>=e.level?t:this.wrapInBraces(t))},n.prototype.compileSpecialMath=function(e){var t,i,r;return r=this.variable.cacheReference(e),t=r[0],i=r[1],new n(t,new $(this.context.slice(0,-1),i,this.value)).compileToFragments(e)},n.prototype.compileSplice=function(e){var t,n,i,r,s,o,a,c,h,l,u,p;return l=this.variable.properties.pop().range,i=l.from,a=l.to,n=l.exclusive,o=this.variable.compile(e),i?(u=this.cacheToCodeFragments(i.cache(e,N)),r=u[0],s=u[1]):r=s="0",a?i instanceof Z&&i.isSimpleNumber()&&a instanceof Z&&a.isSimpleNumber()?(a=a.compile(e)-s,n||(a+=1)):(a=a.compile(e,F)+" - "+s,n||(a+=" + 1")):a="9e9",p=this.value.cache(e,C),c=p[0],h=p[1],t=[].concat(this.makeCode("[].splice.apply("+o+", ["+r+", "+a+"].concat("),c,this.makeCode(")), "),h),e.level>x?this.wrapInBraces(t):t},n}(r),e.Code=c=function(e){function t(e,t,n){this.params=e||[],this.body=t||new s,this.bound="boundfunc"===n}return Ft(t,e),t.prototype.children=["params","body"],t.prototype.isStatement=function(){return!!this.ctor},t.prototype.jumps=A,t.prototype.makeScope=function(e){return new H(e,this.body,this)},t.prototype.compileNode=function(e){var r,a,c,h,l,u,d,f,m,b,g,k,y,w,T,L,C,N,E,x,S,R,A,I,_,j,M,B,V,P,U,H,q;if(this.bound&&(null!=(B=e.scope.method)?B.bound:void 0)&&(this.context=e.scope.method.context),this.bound&&!this.context)return this.context="_this",T=new t([new O(new D(this.context))],new s([this])),a=new o(T,[new D("this")]),a.updateLocationDataIfMissing(this.locationData),a.compileNode(e);for(e.scope=it(e,"classScope")||this.makeScope(e.scope),e.scope.shared=it(e,"sharedScope"),e.indent+=X,delete e.bare,delete e.isExistentialEquals,m=[],h=[],V=this.params,L=0,x=V.length;x>L;L++)f=V[L],f instanceof p||e.scope.parameter(f.asReference(e));for(P=this.params,C=0,S=P.length;S>C;C++)if(f=P[C],f.splat||f instanceof p){for(U=this.params,N=0,R=U.length;R>N;N++)d=U[N].name,f instanceof p||(d["this"]&&(d=d.properties[0].name),d.value&&e.scope.add(d.value,"var",!0));g=new i(new Z(new n(function(){var t,n,i,r;for(i=this.params,r=[],t=0,n=i.length;n>t;t++)d=i[t],r.push(d.asReference(e));return r}.call(this))),new Z(new D("arguments")));break}for(H=this.params,E=0,A=H.length;A>E;E++)f=H[E],f.isComplex()?(y=b=f.asReference(e),f.value&&(y=new $("?",b,f.value)),h.push(new i(new Z(f.name),y,"=",{param:!0}))):(b=f,f.value&&(u=new D(b.name.value+" == null"),y=new i(new Z(f.name),f.value,"="),h.push(new v(u,y)))),g||m.push(b);for(w=this.body.isEmpty(),g&&h.unshift(g),h.length&&(q=this.body.expressions).unshift.apply(q,h),l=j=0,I=m.length;I>j;l=++j)d=m[l],m[l]=d.compileToFragments(e),e.scope.parameter(at(m[l]));for(k=[],this.eachParamName(function(e,t){return Lt.call(k,e)>=0&&t.error("multiple parameters named '"+e+"'"),k.push(e)}),w||this.noReturn||this.body.makeReturn(),c="function",this.ctor&&(c+=" "+this.name),c+="(",r=[this.makeCode(c)],l=M=0,_=m.length;_>M;l=++M)d=m[l],l&&r.push(this.makeCode(", ")),r.push.apply(r,d);return r.push(this.makeCode(") {")),this.body.isEmpty()||(r=r.concat(this.makeCode("\n"),this.body.compileWithDeclarations(e),this.makeCode("\n"+this.tab))),r.push(this.makeCode("}")),this.ctor?[this.makeCode(this.tab)].concat(Ct.call(r)):this.front||e.level>=F?this.wrapInBraces(r):r},t.prototype.eachParamName=function(e){var t,n,i,r,s;for(r=this.params,s=[],n=0,i=r.length;i>n;n++)t=r[n],s.push(t.eachName(e));return s},t.prototype.traverseChildren=function(e,n){return e?t.__super__.traverseChildren.call(this,e,n):void 0},t}(r),e.Param=O=function(e){function t(e,t,n){var i;this.name=e,this.value=t,this.splat=n,i=e=this.name.unwrapAll().value,Lt.call(U,i)>=0&&this.name.error('parameter name "'+e+'" is not allowed')}return Ft(t,e),t.prototype.children=["name","value"],t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e,C)},t.prototype.asReference=function(e){var t;return this.reference?this.reference:(t=this.name,t["this"]?(t=t.properties[0].name,t.value.reserved&&(t=new D(e.scope.freeVariable(t.value)))):t.isComplex()&&(t=new D(e.scope.freeVariable("arg"))),t=new Z(t),this.splat&&(t=new G(t)),t.updateLocationDataIfMissing(this.locationData),this.reference=t)},t.prototype.isComplex=function(){return this.name.isComplex()},t.prototype.eachName=function(e,t){var n,r,s,o,a,c;if(null==t&&(t=this.name),n=function(t){var n;return n=t.properties[0].name,n.value.reserved?void 0:e(n.value,n)},t instanceof D)return e(t.value,t);if(t instanceof Z)return n(t);for(c=t.objects,o=0,a=c.length;a>o;o++)s=c[o],s instanceof i?this.eachName(e,s.value.unwrap()):s instanceof G?(r=s.name.unwrap(),e(r.value,r)):s instanceof Z?s.isArray()||s.isObject()?this.eachName(e,s.base):s["this"]?n(s):e(s.base.value,s.base):s instanceof p||s.error("illegal parameter "+s.compile())},t}(r),e.Splat=G=function(e){function t(e){this.name=e.compile?e:new D(e)}return Ft(t,e),t.prototype.children=["name"],t.prototype.isAssignable=et,t.prototype.assigns=function(e){return this.name.assigns(e)},t.prototype.compileToFragments=function(e){return this.name.compileToFragments(e)},t.prototype.unwrap=function(){return this.name},t.compileSplattedArray=function(e,n,i){var r,s,o,a,c,h,l,u,p,d;for(l=-1;(u=n[++l])&&!(u instanceof t););if(l>=n.length)return[];if(1===n.length)return u=n[0],c=u.compileToFragments(e,C),i?c:[].concat(u.makeCode(""+yt("slice")+".call("),c,u.makeCode(")"));for(r=n.slice(l),h=p=0,d=r.length;d>p;h=++p)u=r[h],o=u.compileToFragments(e,C),r[h]=u instanceof t?[].concat(u.makeCode(""+yt("slice")+".call("),o,u.makeCode(")")):[].concat(u.makeCode("["),o,u.makeCode("]"));return 0===l?(u=n[0],a=u.joinFragmentArrays(r.slice(1),", "),r[0].concat(u.makeCode(".concat("),a,u.makeCode(")"))):(s=function(){var t,i,r,s;for(r=n.slice(0,l),s=[],t=0,i=r.length;i>t;t++)u=r[t],s.push(u.compileToFragments(e,C));return s}(),s=n[0].joinFragmentArrays(s,", "),a=n[l].joinFragmentArrays(r,", "),[].concat(n[0].makeCode("["),s,n[l].makeCode("].concat("),a,lt(n).makeCode(")")))},t}(r),e.Expansion=p=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return Ft(t,e),t.prototype.isComplex=A,t.prototype.compileNode=function(){return this.error("Expansion must be used inside a destructuring assignment or parameter list")},t.prototype.asReference=function(){return this},t.prototype.eachName=function(){},t}(r),e.While=Q=function(e){function t(e,t){this.condition=(null!=t?t.invert:void 0)?e.invert():e,this.guard=null!=t?t.guard:void 0}return Ft(t,e),t.prototype.children=["condition","guard","body"],t.prototype.isStatement=et,t.prototype.makeReturn=function(e){return e?t.__super__.makeReturn.apply(this,arguments):(this.returns=!this.jumps({loop:!0}),this)},t.prototype.addBody=function(e){return this.body=e,this},t.prototype.jumps=function(){var e,t,n,i,r;if(e=this.body.expressions,!e.length)return!1;for(i=0,r=e.length;r>i;i++)if(n=e[i],t=n.jumps({loop:!0}))return t;return!1},t.prototype.compileNode=function(e){var t,n,i,r;return e.indent+=X,r="",n=this.body,n.isEmpty()?n=this.makeCode(""):(this.returns&&(n.makeReturn(i=e.scope.freeVariable("results")),r=""+this.tab+i+" = [];\n"),this.guard&&(n.expressions.length>1?n.expressions.unshift(new v(new j(this.guard).invert(),new D("continue"))):this.guard&&(n=s.wrap([new v(this.guard,n)]))),n=[].concat(this.makeCode("\n"),n.compileToFragments(e,x),this.makeCode("\n"+this.tab))),t=[].concat(this.makeCode(r+this.tab+"while ("),this.condition.compileToFragments(e,E),this.makeCode(") {"),n,this.makeCode("}")),this.returns&&t.push(this.makeCode("\n"+this.tab+"return "+i+";")),t},t}(r),e.Op=$=function(e){function n(e,t,n,i){if("in"===e)return new w(t,n);if("do"===e)return this.generateDo(t);if("new"===e){if(t instanceof o&&!t["do"]&&!t.isNew)return t.newInstance();(t instanceof c&&t.bound||t["do"])&&(t=new j(t))}return this.operator=r[e]||e,this.first=t,this.second=n,this.flip=!!i,this}var r,s;return Ft(n,e),r={"==":"===","!=":"!==",of:"in"},s={"!==":"===","===":"!=="},n.prototype.children=["first","second"],n.prototype.isSimpleNumber=A,n.prototype.isUnary=function(){return!this.second},n.prototype.isComplex=function(){var e;return!(this.isUnary()&&("+"===(e=this.operator)||"-"===e))||this.first.isComplex()},n.prototype.isChainable=function(){var e;return"<"===(e=this.operator)||">"===e||">="===e||"<="===e||"==="===e||"!=="===e},n.prototype.invert=function(){var e,t,i,r,o;if(this.isChainable()&&this.first.isChainable()){for(e=!0,t=this;t&&t.operator;)e&&(e=t.operator in s),t=t.first;if(!e)return new j(this).invert();for(t=this;t&&t.operator;)t.invert=!t.invert,t.operator=s[t.operator],t=t.first;return this}return(r=s[this.operator])?(this.operator=r,this.first.unwrap()instanceof n&&this.first.invert(),this):this.second?new j(this).invert():"!"===this.operator&&(i=this.first.unwrap())instanceof n&&("!"===(o=i.operator)||"in"===o||"instanceof"===o)?i:new n("!",this)},n.prototype.unfoldSoak=function(e){var t;return("++"===(t=this.operator)||"--"===t||"delete"===t)&&kt(e,this,"first")},n.prototype.generateDo=function(e){var t,n,r,s,a,h,l,u;for(s=[],n=e instanceof i&&(a=e.value.unwrap())instanceof c?a:e,u=n.params||[],h=0,l=u.length;l>h;h++)r=u[h],r.value?(s.push(r.value),delete r.value):s.push(r);return t=new o(e,s),t["do"]=!0,t},n.prototype.compileNode=function(e){var t,n,i,r,s,o;if(n=this.isChainable()&&this.first.isChainable(),n||(this.first.front=this.front),"delete"===this.operator&&e.scope.check(this.first.unwrapAll().value)&&this.error("delete operand may not be argument or var"),("--"===(s=this.operator)||"++"===s)&&(o=this.first.unwrapAll().value,Lt.call(U,o)>=0)&&this.error('cannot increment/decrement "'+this.first.unwrapAll().value+'"'),this.isUnary())return this.compileUnary(e);if(n)return this.compileChain(e);switch(this.operator){case"?":return this.compileExistence(e);case"**":return this.compilePower(e);case"//":return this.compileFloorDivision(e);case"%%":return this.compileModulo(e);default:return i=this.first.compileToFragments(e,N),r=this.second.compileToFragments(e,N),t=[].concat(i,this.makeCode(" "+this.operator+" "),r),N>=e.level?t:this.wrapInBraces(t)}},n.prototype.compileChain=function(e){var t,n,i,r;return r=this.first.second.cache(e),this.first.second=r[0],i=r[1],n=this.first.compileToFragments(e,N),t=n.concat(this.makeCode(" "+(this.invert?"&&":"||")+" "),i.compileToFragments(e),this.makeCode(" "+this.operator+" "),this.second.compileToFragments(e,N)),this.wrapInBraces(t)},n.prototype.compileExistence=function(e){var t,n;return this.first.isComplex()?(n=new D(e.scope.freeVariable("ref")),t=new j(new i(n,this.first))):(t=this.first,n=t),new v(new u(t),n,{type:"if"}).addElse(this.second).compileToFragments(e)},n.prototype.compileUnary=function(e){var t,i,r;return i=[],t=this.operator,i.push([this.makeCode(t)]),"!"===t&&this.first instanceof u?(this.first.negated=!this.first.negated,this.first.compileToFragments(e)):e.level>=F?new j(this).compileToFragments(e):(r="+"===t||"-"===t,("new"===t||"typeof"===t||"delete"===t||r&&this.first instanceof n&&this.first.operator===t)&&i.push([this.makeCode(" ")]),(r&&this.first instanceof n||"new"===t&&this.first.isStatement(e))&&(this.first=new j(this.first)),i.push(this.first.compileToFragments(e,N)),this.flip&&i.reverse(),this.joinFragmentArrays(i,""))},n.prototype.compilePower=function(e){var n;return n=new Z(new D("Math"),[new t(new D("pow"))]),new o(n,[this.first,this.second]).compileToFragments(e)},n.prototype.compileFloorDivision=function(e){var i,r;return r=new Z(new D("Math"),[new t(new D("floor"))]),i=new n("/",this.first,this.second),new o(r,[i]).compileToFragments(e)},n.prototype.compileModulo=function(e){var t;return t=new Z(new D(yt("modulo"))),new o(t,[this.first,this.second]).compileToFragments(e)},n.prototype.toString=function(e){return n.__super__.toString.call(this,e,this.constructor.name+" "+this.operator)},n}(r),e.In=w=function(e){function t(e,t){this.object=e,this.array=t}return Ft(t,e),t.prototype.children=["object","array"],t.prototype.invert=R,t.prototype.compileNode=function(e){var t,n,i,r,s;if(this.array instanceof Z&&this.array.isArray()&&this.array.base.objects.length){for(s=this.array.base.objects,i=0,r=s.length;r>i;i++)if(n=s[i],n instanceof G){t=!0;break}if(!t)return this.compileOrTest(e)}return this.compileLoopTest(e)},t.prototype.compileOrTest=function(e){var t,n,i,r,s,o,a,c,h,l,u,p;for(l=this.object.cache(e,N),o=l[0],s=l[1],u=this.negated?[" !== "," && "]:[" === "," || "],t=u[0],n=u[1],a=[],p=this.array.base.objects,i=c=0,h=p.length;h>c;i=++c)r=p[i],i&&a.push(this.makeCode(n)),a=a.concat(i?s:o,this.makeCode(t),r.compileToFragments(e,F));return N>e.level?a:this.wrapInBraces(a)},t.prototype.compileLoopTest=function(e){var t,n,i,r;return r=this.object.cache(e,C),i=r[0],n=r[1],t=[].concat(this.makeCode(yt("indexOf")+".call("),this.array.compileToFragments(e,C),this.makeCode(", "),n,this.makeCode(") "+(this.negated?"< 0":">= 0"))),at(i)===at(n)?t:(t=i.concat(this.makeCode(", "),t),C>e.level?t:this.wrapInBraces(t))},t.prototype.toString=function(e){return t.__super__.toString.call(this,e,this.constructor.name+(this.negated?"!":""))},t}(r),e.Try=K=function(e){function t(e,t,n,i){this.attempt=e,this.errorVariable=t,this.recovery=n,this.ensure=i}return Ft(t,e),t.prototype.children=["attempt","recovery","ensure"],t.prototype.isStatement=et,t.prototype.jumps=function(e){var t;return this.attempt.jumps(e)||(null!=(t=this.recovery)?t.jumps(e):void 0)},t.prototype.makeReturn=function(e){return this.attempt&&(this.attempt=this.attempt.makeReturn(e)),this.recovery&&(this.recovery=this.recovery.makeReturn(e)),this},t.prototype.compileNode=function(e){var t,n,r,s;return e.indent+=X,s=this.attempt.compileToFragments(e,x),t=this.recovery?(r=new D("_error"),this.errorVariable?this.recovery.unshift(new i(this.errorVariable,r)):void 0,[].concat(this.makeCode(" catch ("),r.compileToFragments(e),this.makeCode(") {\n"),this.recovery.compileToFragments(e,x),this.makeCode("\n"+this.tab+"}"))):this.ensure||this.recovery?[]:[this.makeCode(" catch (_error) {}")],n=this.ensure?[].concat(this.makeCode(" finally {\n"),this.ensure.compileToFragments(e,x),this.makeCode("\n"+this.tab+"}")):[],[].concat(this.makeCode(""+this.tab+"try {\n"),s,this.makeCode("\n"+this.tab+"}"),t,n)},t}(r),e.Throw=z=function(e){function t(e){this.expression=e}return Ft(t,e),t.prototype.children=["expression"],t.prototype.isStatement=et,t.prototype.jumps=A,t.prototype.makeReturn=Y,t.prototype.compileNode=function(e){return[].concat(this.makeCode(this.tab+"throw "),this.expression.compileToFragments(e),this.makeCode(";"))},t}(r),e.Existence=u=function(e){function t(e){this.expression=e}return Ft(t,e),t.prototype.children=["expression"],t.prototype.invert=R,t.prototype.compileNode=function(e){var t,n,i,r;return this.expression.front=this.front,i=this.expression.compile(e,N),b.test(i)&&!e.scope.check(i)?(r=this.negated?["===","||"]:["!==","&&"],t=r[0],n=r[1],i="typeof "+i+" "+t+' "undefined" '+n+" "+i+" "+t+" null"):i=""+i+" "+(this.negated?"==":"!=")+" null",[this.makeCode(L>=e.level?i:"("+i+")")]},t}(r),e.Parens=j=function(e){function t(e){this.body=e}return Ft(t,e),t.prototype.children=["body"],t.prototype.unwrap=function(){return this.body},t.prototype.isComplex=function(){return this.body.isComplex()},t.prototype.compileNode=function(e){var t,n,i;return n=this.body.unwrap(),n instanceof Z&&n.isAtomic()?(n.front=this.front,n.compileToFragments(e)):(i=n.compileToFragments(e,E),t=N>e.level&&(n instanceof $||n instanceof o||n instanceof f&&n.returns),t?i:this.wrapInBraces(i))},t}(r),e.For=f=function(e){function t(e,t){var n;this.source=t.source,this.guard=t.guard,this.step=t.step,this.name=t.name,this.index=t.index,this.body=s.wrap([e]),this.own=!!t.own,this.object=!!t.object,this.object&&(n=[this.index,this.name],this.name=n[0],this.index=n[1]),this.index instanceof Z&&this.index.error("index cannot be a pattern matching expression"),this.range=this.source instanceof Z&&this.source.base instanceof B&&!this.source.properties.length,this.pattern=this.name instanceof Z,this.range&&this.index&&this.index.error("indexes do not apply to range loops"),this.range&&this.pattern&&this.name.error("cannot pattern match over range loops"),this.own&&!this.object&&this.name.error("cannot use own with for-in"),this.returns=!1}return Ft(t,e),t.prototype.children=["body","source","guard","step"],t.prototype.compileNode=function(e){var t,n,r,o,a,c,h,l,u,p,d,f,m,g,k,y,w,T,F,L,N,E,S,R,A,_,$,O,M,B,P,U,H,q;return t=s.wrap([this.body]),T=null!=(H=lt(t.expressions))?H.jumps():void 0,T&&T instanceof V&&(this.returns=!1),$=this.range?this.source.base:this.source,_=e.scope,this.pattern||(L=this.name&&this.name.compile(e,C)),g=this.index&&this.index.compile(e,C),L&&!this.pattern&&_.find(L),g&&_.find(g),this.returns&&(A=_.freeVariable("results")),k=this.object&&g||_.freeVariable("i"),y=this.range&&L||g||k,w=y!==k?""+y+" = ":"",this.step&&!this.range&&(q=this.cacheToCodeFragments(this.step.cache(e,C)),O=q[0],B=q[1],M=B.match(I)),this.pattern&&(L=k),U="",d="",h="",f=this.tab+X,this.range?p=$.compileToFragments(pt(e,{index:k,name:L,step:this.step})):(P=this.source.compile(e,C),!L&&!this.own||b.test(P)||(h+=""+this.tab+(E=_.freeVariable("ref"))+" = "+P+";\n",P=E),L&&!this.pattern&&(N=""+L+" = "+P+"["+y+"]"),this.object||(O!==B&&(h+=""+this.tab+O+";\n"),this.step&&M&&(u=0>ft(M[0]))||(F=_.freeVariable("len")),a=""+w+k+" = 0, "+F+" = "+P+".length",c=""+w+k+" = "+P+".length - 1",r=""+k+" < "+F,o=""+k+" >= 0",this.step?(M?u&&(r=o,a=c):(r=""+B+" > 0 ? "+r+" : "+o,a="("+B+" > 0 ? ("+a+") : "+c+")"),m=""+k+" += "+B):m=""+(y!==k?"++"+k:""+k+"++"),p=[this.makeCode(""+a+"; "+r+"; "+w+m)])),this.returns&&(S=""+this.tab+A+" = [];\n",R="\n"+this.tab+"return "+A+";",t.makeReturn(A)),this.guard&&(t.expressions.length>1?t.expressions.unshift(new v(new j(this.guard).invert(),new D("continue"))):this.guard&&(t=s.wrap([new v(this.guard,t)]))),this.pattern&&t.expressions.unshift(new i(this.name,new D(""+P+"["+y+"]"))),l=[].concat(this.makeCode(h),this.pluckDirectCall(e,t)),N&&(U="\n"+f+N+";"),this.object&&(p=[this.makeCode(""+y+" in "+P)],this.own&&(d="\n"+f+"if (!"+yt("hasProp")+".call("+P+", "+y+")) continue;")),n=t.compileToFragments(pt(e,{indent:f}),x),n&&n.length>0&&(n=[].concat(this.makeCode("\n"),n,this.makeCode("\n"))),[].concat(l,this.makeCode(""+(S||"")+this.tab+"for ("),p,this.makeCode(") {"+d+U),n,this.makeCode(""+this.tab+"}"+(R||"")))},t.prototype.pluckDirectCall=function(e,t){var n,r,s,a,h,l,u,p,d,f,m,b,g,k,y,v;for(r=[],f=t.expressions,h=p=0,d=f.length;d>p;h=++p)s=f[h],s=s.unwrapAll(),s instanceof o&&(u=null!=(m=s.variable)?m.unwrapAll():void 0,(u instanceof c||u instanceof Z&&(null!=(b=u.base)?b.unwrapAll():void 0)instanceof c&&1===u.properties.length&&("call"===(g=null!=(k=u.properties[0].name)?k.value:void 0)||"apply"===g))&&(a=(null!=(y=u.base)?y.unwrapAll():void 0)||u,l=new D(e.scope.freeVariable("fn")),n=new Z(l),u.base&&(v=[n,u],u.base=v[0],n=v[1]),t.expressions[h]=new o(n,s.args),r=r.concat(this.makeCode(this.tab),new i(l,a).compileToFragments(e,x),this.makeCode(";\n"))));return r},t}(Q),e.Switch=W=function(e){function t(e,t,n){this.subject=e,this.cases=t,this.otherwise=n}return Ft(t,e),t.prototype.children=["subject","cases","otherwise"],t.prototype.isStatement=et,t.prototype.jumps=function(e){var t,n,i,r,s,o,a,c;for(null==e&&(e={block:!0}),o=this.cases,r=0,s=o.length;s>r;r++)if(a=o[r],n=a[0],t=a[1],i=t.jumps(e))return i;return null!=(c=this.otherwise)?c.jumps(e):void 0},t.prototype.makeReturn=function(e){var t,n,i,r,o;for(r=this.cases,n=0,i=r.length;i>n;n++)t=r[n],t[1].makeReturn(e);return e&&(this.otherwise||(this.otherwise=new s([new D("void 0")]))),null!=(o=this.otherwise)&&o.makeReturn(e),this},t.prototype.compileNode=function(e){var t,n,i,r,s,o,a,c,h,l,u,p,d,f,m,b;for(c=e.indent+X,h=e.indent=c+X,o=[].concat(this.makeCode(this.tab+"switch ("),this.subject?this.subject.compileToFragments(e,E):this.makeCode("false"),this.makeCode(") {\n")),f=this.cases,a=l=0,p=f.length;p>l;a=++l){for(m=f[a],r=m[0],t=m[1],b=ot([r]),u=0,d=b.length;d>u;u++)i=b[u],this.subject||(i=i.invert()),o=o.concat(this.makeCode(c+"case "),i.compileToFragments(e,E),this.makeCode(":\n"));if((n=t.compileToFragments(e,x)).length>0&&(o=o.concat(n,this.makeCode("\n"))),a===this.cases.length-1&&!this.otherwise)break;s=this.lastNonComment(t.expressions),s instanceof V||s instanceof D&&s.jumps()&&"debugger"!==s.value||o.push(i.makeCode(h+"break;\n"))}return this.otherwise&&this.otherwise.expressions.length&&o.push.apply(o,[this.makeCode(c+"default:\n")].concat(Ct.call(this.otherwise.compileToFragments(e,x)),[this.makeCode("\n")])),o.push(this.makeCode(this.tab+"}")),o},t}(r),e.If=v=function(e){function t(e,t,n){this.body=t,null==n&&(n={}),this.condition="unless"===n.type?e.invert():e,this.elseBody=null,this.isChain=!1,this.soak=n.soak}return Ft(t,e),t.prototype.children=["condition","body","elseBody"],t.prototype.bodyNode=function(){var e;return null!=(e=this.body)?e.unwrap():void 0},t.prototype.elseBodyNode=function(){var e;return null!=(e=this.elseBody)?e.unwrap():void 0},t.prototype.addElse=function(e){return this.isChain?this.elseBodyNode().addElse(e):(this.isChain=e instanceof t,this.elseBody=this.ensureBlock(e),this.elseBody.updateLocationDataIfMissing(e.locationData)),this},t.prototype.isStatement=function(e){var t;return(null!=e?e.level:void 0)===x||this.bodyNode().isStatement(e)||(null!=(t=this.elseBodyNode())?t.isStatement(e):void 0)},t.prototype.jumps=function(e){var t;return this.body.jumps(e)||(null!=(t=this.elseBody)?t.jumps(e):void 0)},t.prototype.compileNode=function(e){return this.isStatement(e)?this.compileStatement(e):this.compileExpression(e)},t.prototype.makeReturn=function(e){return e&&(this.elseBody||(this.elseBody=new s([new D("void 0")]))),this.body&&(this.body=new s([this.body.makeReturn(e)])),this.elseBody&&(this.elseBody=new s([this.elseBody.makeReturn(e)])),this},t.prototype.ensureBlock=function(e){return e instanceof s?e:new s([e])},t.prototype.compileStatement=function(e){var n,i,r,s,o,a,c;return r=it(e,"chainChild"),(o=it(e,"isExistentialEquals"))?new t(this.condition.invert(),this.elseBodyNode(),{type:"if"}).compileToFragments(e):(c=e.indent+X,s=this.condition.compileToFragments(e,E),i=this.ensureBlock(this.body).compileToFragments(pt(e,{indent:c})),a=[].concat(this.makeCode("if ("),s,this.makeCode(") {\n"),i,this.makeCode("\n"+this.tab+"}")),r||a.unshift(this.makeCode(this.tab)),this.elseBody?(n=a.concat(this.makeCode(" else ")),this.isChain?(e.chainChild=!0,n=n.concat(this.elseBody.unwrap().compileToFragments(e,x))):n=n.concat(this.makeCode("{\n"),this.elseBody.compileToFragments(pt(e,{indent:c}),x),this.makeCode("\n"+this.tab+"}")),n):a)},t.prototype.compileExpression=function(e){var t,n,i,r;return i=this.condition.compileToFragments(e,L),n=this.bodyNode().compileToFragments(e,C),t=this.elseBodyNode()?this.elseBodyNode().compileToFragments(e,C):[this.makeCode("void 0")],r=i.concat(this.makeCode(" ? "),n,this.makeCode(" : "),t),e.level>=L?this.wrapInBraces(r):r},t.prototype.unfoldSoak=function(){return this.soak&&this},t}(r),J={"extends":function(){return"function(child, parent) { for (var key in parent) { if ("+yt("hasProp")+".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }"},bind:function(){return"function(fn, me){ return function(){ return fn.apply(me, arguments); }; }"},indexOf:function(){return"[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }"},modulo:function(){return"function(a, b) { return (a % b + +b) % b; }"},hasProp:function(){return"{}.hasOwnProperty"},slice:function(){return"[].slice"}},x=1,E=2,C=3,L=4,N=5,F=6,X="  ",g="[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*",b=RegExp("^"+g+"$"),P=/^[+-]?\d+$/,m=/^[+-]?0x[\da-f]+/i,I=/^[+-]?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)$/i,S=RegExp("^("+g+")(\\.prototype)?(?:\\.("+g+")|\\[(\"(?:[^\\\\\"\\r\\n]|\\\\.)*\"|'(?:[^\\\\'\\r\\n]|\\\\.)*')\\]|\\[(0x[\\da-fA-F]+|\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\])$"),y=/^['"]/,k=/^\//,yt=function(e){var t;return t="__"+e,H.root.assign(t,J[e]()),t},dt=function(e,t){return e=e.replace(/\n/g,"$&"+t),e.replace(/\s+$/,"")},ft=function(e){return null==e?0:e.match(m)?parseInt(e,16):parseFloat(e)},ct=function(e){return e instanceof D&&"arguments"===e.value&&!e.asKey},ht=function(e){return e instanceof D&&"this"===e.value&&!e.asKey||e instanceof c&&e.bound||e instanceof o&&e.isSuper},kt=function(e,t,n){var i;if(i=t[n].unfoldSoak(e))return t[n]=i.body,i.body=new Z(t),i}}.call(this),t.exports}(),require["./sourcemap"]=function(){var e={},t={exports:e};return function(){var e,n;e=function(){function e(e){this.line=e,this.columns=[]}return e.prototype.add=function(e,t,n){var i,r;return r=t[0],i=t[1],null==n&&(n={}),this.columns[e]&&n.noReplace?void 0:this.columns[e]={line:this.line,column:e,sourceLine:r,sourceColumn:i}},e.prototype.sourceLocation=function(e){for(var t;!((t=this.columns[e])||0>=e);)e--;return t&&[t.sourceLine,t.sourceColumn]},e}(),n=function(){function t(){this.lines=[]}var n,i,r,s;return t.prototype.add=function(t,n,i){var r,s,o,a;return null==i&&(i={}),s=n[0],r=n[1],o=(a=this.lines)[s]||(a[s]=new e(s)),o.add(r,t,i)},t.prototype.sourceLocation=function(e){var t,n,i;for(n=e[0],t=e[1];!((i=this.lines[n])||0>=n);)n--;return i&&i.sourceLocation(t)},t.prototype.generate=function(e,t){var n,i,r,s,o,a,c,h,l,u,p,d,f,m,b,g;for(null==e&&(e={}),null==t&&(t=null),u=0,i=0,s=0,r=0,h=!1,n="",b=this.lines,a=p=0,f=b.length;f>p;a=++p)if(o=b[a])for(g=o.columns,d=0,m=g.length;m>d;d++)if(c=g[d]){for(;c.line>u;)i=0,h=!1,n+=";",u++;h&&(n+=",",h=!1),n+=this.encodeVlq(c.column-i),i=c.column,n+=this.encodeVlq(0),n+=this.encodeVlq(c.sourceLine-s),s=c.sourceLine,n+=this.encodeVlq(c.sourceColumn-r),r=c.sourceColumn,h=!0}return l={version:3,file:e.generatedFile||"",sourceRoot:e.sourceRoot||"",sources:e.sourceFiles||[""],names:[],mappings:n},e.inline&&(l.sourcesContent=[t]),JSON.stringify(l,null,2)},r=5,i=1<<r,s=i-1,t.prototype.encodeVlq=function(e){var t,n,o,a;for(t="",o=0>e?1:0,a=(Math.abs(e)<<1)+o;a||!t;)n=a&s,a>>=r,a&&(n|=i),t+=this.encodeBase64(n);return t},n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t.prototype.encodeBase64=function(e){return n[e]||function(){throw Error("Cannot Base64 encode value: "+e)}()},t}(),t.exports=n}.call(this),t.exports}(),require["./coffee-script"]=function(){var e={},t={exports:e};return function(){var t,n,i,r,s,o,a,c,h,l,u,p,d,f={}.hasOwnProperty,m=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};s=require("fs"),p=require("vm"),l=require("path"),t=require("./lexer").Lexer,h=require("./parser").parser,a=require("./helpers"),n=require("./sourcemap"),e.VERSION="1.7.1",e.FILE_EXTENSIONS=[".coffee",".litcoffee",".coffee.md"],e.helpers=a,d=function(e){return function(t,n){var i;null==n&&(n={});try{return e.call(this,t,n)}catch(r){throw i=r,a.updateSyntaxError(i,t,n.filename)}}},e.compile=i=d(function(e,t){var i,r,s,o,l,u,p,d,f,m,b,g,k;for(m=a.merge,o=a.extend,t=o({},t),t.sourceMap&&(f=new n),u=h.parse(c.tokenize(e,t)).compileToFragments(t),s=0,t.header&&(s+=1),t.shiftLine&&(s+=1),r=0,d="",g=0,k=u.length;k>g;g++)l=u[g],t.sourceMap&&(l.locationData&&f.add([l.locationData.first_line,l.locationData.first_column],[s,r],{noReplace:!0}),b=a.count(l.code,"\n"),s+=b,b?r=l.code.length-(l.code.lastIndexOf("\n")+1):r+=l.code.length),d+=l.code;return t.header&&(p="Generated by CoffeeScript "+this.VERSION,d="// "+p+"\n"+d),t.sourceMap?(i={js:d},i.sourceMap=f,i.v3SourceMap=f.generate(t,e),i):d}),e.tokens=d(function(e,t){return c.tokenize(e,t)}),e.nodes=d(function(e,t){return"string"==typeof e?h.parse(c.tokenize(e,t)):h.parse(e)}),e.run=function(e,t){var n,r,o,c;return null==t&&(t={}),o=require.main,o.filename=process.argv[1]=t.filename?s.realpathSync(t.filename):".",o.moduleCache&&(o.moduleCache={}),r=t.filename?l.dirname(s.realpathSync(t.filename)):s.realpathSync("."),o.paths=require("module")._nodeModulePaths(r),(!a.isCoffee(o.filename)||require.extensions)&&(n=i(e,t),e=null!=(c=n.js)?c:n),o._compile(e,o.filename)},e.eval=function(e,t){var n,r,s,o,a,c,h,u,d,m,b,g,k,y;if(null==t&&(t={}),e=e.trim()){if(r=p.Script){if(null!=t.sandbox){if(t.sandbox instanceof r.createContext().constructor)h=t.sandbox;else{h=r.createContext(),g=t.sandbox;for(o in g)f.call(g,o)&&(u=g[o],h[o]=u)}h.global=h.root=h.GLOBAL=h}else h=global;if(h.__filename=t.filename||"eval",h.__dirname=l.dirname(h.__filename),h===global&&!h.module&&!h.require){for(n=require("module"),h.module=b=new n(t.modulename||"eval"),h.require=y=function(e){return n._load(e,b,!0)},b.filename=h.__filename,k=Object.getOwnPropertyNames(require),d=0,m=k.length;m>d;d++)c=k[d],"paths"!==c&&(y[c]=require[c]);y.paths=b.paths=n._nodeModulePaths(process.cwd()),y.resolve=function(e){return n._resolveFilename(e,b)}}}a={};for(o in t)f.call(t,o)&&(u=t[o],a[o]=u);return a.bare=!0,s=i(e,a),h===global?p.runInThisContext(s):p.runInContext(s,h)}},e.register=function(){return require("./register")},e._compileFile=function(e,t){var n,r,o,c;null==t&&(t=!1),o=s.readFileSync(e,"utf8"),c=65279===o.charCodeAt(0)?o.substring(1):o;try{n=i(c,{filename:e,sourceMap:t,literate:a.isLiterate(e)})}catch(h){throw r=h,a.updateSyntaxError(r,c,e)}return n},c=new t,h.lexer={lex:function(){var e,t;
return t=this.tokens[this.pos++],t?(e=t[0],this.yytext=t[1],this.yylloc=t[2],this.errorToken=t.origin||t,this.yylineno=this.yylloc.first_line):e="",e},setInput:function(e){return this.tokens=e,this.pos=0},upcomingInput:function(){return""}},h.yy=require("./nodes"),h.yy.parseError=function(e,t){var n,i,r,s,o,c,l;return o=t.token,l=h.lexer,s=l.errorToken,c=l.tokens,i=s[0],r=s[1],n=s[2],r=s===c[c.length-1]?"end of input":"INDENT"===i||"OUTDENT"===i?"indentation":a.nameWhitespaceCharacter(r),a.throwSyntaxError("unexpected "+r,n)},r=function(e,t){var n,i,r,s,o,a,c,h,l,u,p,d;return s=void 0,r="",e.isNative()?r="native":(e.isEval()?(s=e.getScriptNameOrSourceURL(),s||(r=""+e.getEvalOrigin()+", ")):s=e.getFileName(),s||(s="<anonymous>"),h=e.getLineNumber(),i=e.getColumnNumber(),u=t(s,h,i),r=u?""+s+":"+u[0]+":"+u[1]:""+s+":"+h+":"+i),o=e.getFunctionName(),a=e.isConstructor(),c=!(e.isToplevel()||a),c?(l=e.getMethodName(),d=e.getTypeName(),o?(p=n="",d&&o.indexOf(d)&&(p=""+d+"."),l&&o.indexOf("."+l)!==o.length-l.length-1&&(n=" [as "+l+"]"),""+p+o+n+" ("+r+")"):""+d+"."+(l||"<anonymous>")+" ("+r+")"):a?"new "+(o||"<anonymous>")+" ("+r+")":o?""+o+" ("+r+")":r},u={},o=function(t){var n,i;if(u[t])return u[t];if(i=null!=l?l.extname(t):void 0,!(0>m.call(e.FILE_EXTENSIONS,i)))return n=e._compileFile(t,!0),u[t]=n.sourceMap},Error.prepareStackTrace=function(t,n){var i,s,a,c;return a=function(e,t,n){var i,r;return r=o(e),r&&(i=r.sourceLocation([t-1,n-1])),i?[i[0]+1,i[1]+1]:null},s=function(){var t,s,o;for(o=[],t=0,s=n.length;s>t&&(i=n[t],i.getFunction()!==e.run);t++)o.push("  at "+r(i,a));return o}(),""+t.name+": "+(null!=(c=t.message)?c:"")+"\n"+s.join("\n")+"\n"}}.call(this),t.exports}(),require["./browser"]=function(){var exports={},module={exports:exports};return function(){var CoffeeScript,compile,runScripts,__indexOf=[].indexOf||function(e){for(var t=0,n=this.length;n>t;t++)if(t in this&&this[t]===e)return t;return-1};CoffeeScript=require("./coffee-script"),CoffeeScript.require=require,compile=CoffeeScript.compile,CoffeeScript.eval=function(code,options){return null==options&&(options={}),null==options.bare&&(options.bare=!0),eval(compile(code,options))},CoffeeScript.run=function(e,t){return null==t&&(t={}),t.bare=!0,t.shiftLine=!0,Function(compile(e,t))()},"undefined"!=typeof window&&null!==window&&("undefined"!=typeof btoa&&null!==btoa&&"undefined"!=typeof JSON&&null!==JSON&&"undefined"!=typeof unescape&&null!==unescape&&"undefined"!=typeof encodeURIComponent&&null!==encodeURIComponent&&(compile=function(e,t){var n,i,r;return null==t&&(t={}),t.sourceMap=!0,t.inline=!0,r=CoffeeScript.compile(e,t),n=r.js,i=r.v3SourceMap,""+n+"\n//# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(i)))+"\n//# sourceURL=coffeescript"}),CoffeeScript.load=function(e,t,n,i){var r;return null==n&&(n={}),null==i&&(i=!1),n.sourceFiles=[e],r=window.ActiveXObject?new window.ActiveXObject("Microsoft.XMLHTTP"):new window.XMLHttpRequest,r.open("GET",e,!0),"overrideMimeType"in r&&r.overrideMimeType("text/plain"),r.onreadystatechange=function(){var s,o;if(4===r.readyState){if(0!==(o=r.status)&&200!==o)throw Error("Could not load "+e);if(s=[r.responseText,n],i||CoffeeScript.run.apply(CoffeeScript,s),t)return t(s)}},r.send(null)},runScripts=function(){var e,t,n,i,r,s,o,a,c,h,l;for(a=window.document.getElementsByTagName("script"),t=["text/coffeescript","text/literate-coffeescript"],e=function(){var e,n,i,r;for(r=[],e=0,n=a.length;n>e;e++)s=a[e],i=s.type,__indexOf.call(t,i)>=0&&r.push(s);return r}(),r=0,n=function(){var t;return t=e[r],t instanceof Array?(CoffeeScript.run.apply(CoffeeScript,t),r++,n()):void 0},c=function(i,r){var s;return s={literate:i.type===t[1]},i.src?CoffeeScript.load(i.src,function(t){return e[r]=t,n()},s,!0):(s.sourceFiles=["embedded"],e[r]=[i.innerHTML,s])},i=h=0,l=e.length;l>h;i=++h)o=e[i],c(o,i);return n()},window.addEventListener?window.addEventListener("DOMContentLoaded",runScripts,!1):window.attachEvent("onload",runScripts))}.call(this),module.exports}(),require["./coffee-script"]}();"function"==typeof define&&define.amd?define('coffee-script',[],function(){return CoffeeScript}):root.CoffeeScript=CoffeeScript})(this);
define('cs',{load: function(id){throw new Error("Dynamic load not allowed: " + id);}});
/*! jQuery v2.1.3 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l=a.document,m="2.1.3",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){return!n.isArray(a)&&a-parseFloat(a)+1>=0},isPlainObject:function(a){return"object"!==n.type(a)||a.nodeType||n.isWindow(a)?!1:a.constructor&&!j.call(a.constructor.prototype,"isPrototypeOf")?!1:!0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=l.createElement("script"),b.text=a,l.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:g.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(e=d.call(arguments,2),f=function(){return a.apply(b||this,e.concat(d.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:k}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=hb(),z=hb(),A=hb(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N=M.replace("w","w#"),O="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+L+"*\\]",P=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",Q=new RegExp(L+"+","g"),R=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),S=new RegExp("^"+L+"*,"+L+"*"),T=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),U=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),V=new RegExp(P),W=new RegExp("^"+N+"$"),X={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+P),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,ab=/[+~]/,bb=/'|\\/g,cb=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),db=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},eb=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(fb){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function gb(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=_.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(bb,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+rb(o[l]);w=ab.test(a)&&pb(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function hb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ib(a){return a[u]=!0,a}function jb(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function kb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function lb(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function mb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function nb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function ob(a){return ib(function(b){return b=+b,ib(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function pb(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=gb.support={},f=gb.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=gb.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",eb,!1):e.attachEvent&&e.attachEvent("onunload",eb)),p=!f(g),c.attributes=jb(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=jb(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(g.getElementsByClassName),c.getById=jb(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(cb,db);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(g.querySelectorAll))&&(jb(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),jb(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&jb(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",P)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return lb(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?lb(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},gb.matches=function(a,b){return gb(a,null,null,b)},gb.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return gb(b,n,null,[a]).length>0},gb.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},gb.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},gb.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},gb.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=gb.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=gb.selectors={cacheLength:50,createPseudo:ib,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(cb,db),a[3]=(a[3]||a[4]||a[5]||"").replace(cb,db),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||gb.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&gb.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(cb,db).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=gb.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(Q," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||gb.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ib(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ib(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?ib(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ib(function(a){return function(b){return gb(a,b).length>0}}),contains:ib(function(a){return a=a.replace(cb,db),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ib(function(a){return W.test(a||"")||gb.error("unsupported lang: "+a),a=a.replace(cb,db).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:ob(function(){return[0]}),last:ob(function(a,b){return[b-1]}),eq:ob(function(a,b,c){return[0>c?c+b:c]}),even:ob(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:ob(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:ob(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:ob(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=mb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=nb(b);function qb(){}qb.prototype=d.filters=d.pseudos,d.setFilters=new qb,g=gb.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?gb.error(a):z(a,i).slice(0)};function rb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function sb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function tb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ub(a,b,c){for(var d=0,e=b.length;e>d;d++)gb(a,b[d],c);return c}function vb(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function wb(a,b,c,d,e,f){return d&&!d[u]&&(d=wb(d)),e&&!e[u]&&(e=wb(e,f)),ib(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ub(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:vb(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=vb(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=vb(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function xb(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=sb(function(a){return a===b},h,!0),l=sb(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[sb(tb(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return wb(i>1&&tb(m),i>1&&rb(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&xb(a.slice(i,e)),f>e&&xb(a=a.slice(e)),f>e&&rb(a))}m.push(c)}return tb(m)}function yb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=vb(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&gb.uniqueSort(i)}return k&&(w=v,j=t),r};return c?ib(f):f}return h=gb.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=xb(b[c]),f[u]?d.push(f):e.push(f);f=A(a,yb(e,d)),f.selector=a}return f},i=gb.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(cb,db),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(cb,db),ab.test(j[0].type)&&pb(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&rb(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,ab.test(a)&&pb(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=jb(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),jb(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||kb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&jb(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||kb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),jb(function(a){return null==a.getAttribute("disabled")})||kb(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),gb}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return g.call(b,a)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:l,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}return d=l.getElementById(c[2]),d&&d.parentNode&&(this.length=1,this[0]=d),this.context=l,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};A.prototype=n.fn,y=n(l);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?g.call(n(a),this[0]):g.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(C[a]||n.unique(e),B.test(a)&&e.reverse()),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return n.each(a.match(E)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(b=a.memory&&l,c=!0,g=e||0,e=0,f=h.length,d=!0;h&&f>g;g++)if(h[g].apply(l[0],l[1])===!1&&a.stopOnFalse){b=!1;break}d=!1,h&&(i?i.length&&j(i.shift()):b?h=[]:k.disable())},k={add:function(){if(h){var c=h.length;!function g(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&g(c)})}(arguments),d?f=h.length:b&&(e=c,j(b))}return this},remove:function(){return h&&n.each(arguments,function(a,b){var c;while((c=n.inArray(b,h,c))>-1)h.splice(c,1),d&&(f>=c&&f--,g>=c&&g--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],f=0,this},disable:function(){return h=i=b=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,b||k.disable(),this},locked:function(){return!i},fireWith:function(a,b){return!h||c&&!i||(b=b||[],b=[a,b.slice?b.slice():b],d?i.push(b):j(b)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!c}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(H.resolveWith(l,[n]),n.fn.triggerHandler&&(n(l).triggerHandler("ready"),n(l).off("ready"))))}});function I(){l.removeEventListener("DOMContentLoaded",I,!1),a.removeEventListener("load",I,!1),n.ready()}n.ready.promise=function(b){return H||(H=n.Deferred(),"complete"===l.readyState?setTimeout(n.ready):(l.addEventListener("DOMContentLoaded",I,!1),a.addEventListener("load",I,!1))),H.promise(b)},n.ready.promise();var J=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f};n.acceptData=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function K(){Object.defineProperty(this.cache={},0,{get:function(){return{}}}),this.expando=n.expando+K.uid++}K.uid=1,K.accepts=n.acceptData,K.prototype={key:function(a){if(!K.accepts(a))return 0;var b={},c=a[this.expando];if(!c){c=K.uid++;try{b[this.expando]={value:c},Object.defineProperties(a,b)}catch(d){b[this.expando]=c,n.extend(a,b)}}return this.cache[c]||(this.cache[c]={}),c},set:function(a,b,c){var d,e=this.key(a),f=this.cache[e];if("string"==typeof b)f[b]=c;else if(n.isEmptyObject(f))n.extend(this.cache[e],b);else for(d in b)f[d]=b[d];return f},get:function(a,b){var c=this.cache[this.key(a)];return void 0===b?c:c[b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=this.key(a),g=this.cache[f];if(void 0===b)this.cache[f]={};else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in g?d=[b,e]:(d=e,d=d in g?[d]:d.match(E)||[])),c=d.length;while(c--)delete g[d[c]]}},hasData:function(a){return!n.isEmptyObject(this.cache[a[this.expando]]||{})},discard:function(a){a[this.expando]&&delete this.cache[a[this.expando]]}};var L=new K,M=new K,N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(O,"-$1").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}M.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return M.hasData(a)||L.hasData(a)},data:function(a,b,c){return M.access(a,b,c)
},removeData:function(a,b){M.remove(a,b)},_data:function(a,b,c){return L.access(a,b,c)},_removeData:function(a,b){L.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=M.get(f),1===f.nodeType&&!L.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d])));L.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){M.set(this,a)}):J(this,function(b){var c,d=n.camelCase(a);if(f&&void 0===b){if(c=M.get(f,a),void 0!==c)return c;if(c=M.get(f,d),void 0!==c)return c;if(c=P(f,d,void 0),void 0!==c)return c}else this.each(function(){var c=M.get(this,d);M.set(this,d,b),-1!==a.indexOf("-")&&void 0!==c&&M.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){M.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=L.get(a,b),c&&(!d||n.isArray(c)?d=L.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return L.get(a,c)||L.access(a,c,{empty:n.Callbacks("once memory").add(function(){L.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=L.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var Q=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,R=["Top","Right","Bottom","Left"],S=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},T=/^(?:checkbox|radio)$/i;!function(){var a=l.createDocumentFragment(),b=a.appendChild(l.createElement("div")),c=l.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var U="undefined";k.focusinBubbles="onfocusin"in a;var V=/^key/,W=/^(?:mouse|pointer|contextmenu)|click/,X=/^(?:focusinfocus|focusoutblur)$/,Y=/^([^.]*)(?:\.(.+)|)$/;function Z(){return!0}function $(){return!1}function _(){try{return l.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return typeof n!==U&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(E)||[""],j=b.length;while(j--)h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g,!1)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=L.hasData(a)&&L.get(a);if(r&&(i=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=Y.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&(delete r.handle,L.remove(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,m,o,p=[d||l],q=j.call(b,"type")?b.type:b,r=j.call(b,"namespace")?b.namespace.split("."):[];if(g=h=d=d||l,3!==d.nodeType&&8!==d.nodeType&&!X.test(q+n.event.triggered)&&(q.indexOf(".")>=0&&(r=q.split("."),q=r.shift(),r.sort()),k=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=r.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},e||!o.trigger||o.trigger.apply(d,c)!==!1)){if(!e&&!o.noBubble&&!n.isWindow(d)){for(i=o.delegateType||q,X.test(i+q)||(g=g.parentNode);g;g=g.parentNode)p.push(g),h=g;h===(d.ownerDocument||l)&&p.push(h.defaultView||h.parentWindow||a)}f=0;while((g=p[f++])&&!b.isPropagationStopped())b.type=f>1?i:o.bindType||q,m=(L.get(g,"events")||{})[b.type]&&L.get(g,"handle"),m&&m.apply(g,c),m=k&&g[k],m&&m.apply&&n.acceptData(g)&&(b.result=m.apply(g,c),b.result===!1&&b.preventDefault());return b.type=q,e||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!n.acceptData(d)||k&&n.isFunction(d[q])&&!n.isWindow(d)&&(h=d[k],h&&(d[k]=null),n.event.triggered=q,d[q](),n.event.triggered=void 0,h&&(d[k]=h)),b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(L.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(g.namespace))&&(a.handleObj=g,a.data=g.data,e=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==e&&(a.result=e)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!==this;i=i.parentNode||this)if(i.disabled!==!0||"click"!==a.type){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>=0:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||l,d=c.documentElement,e=c.body,a.pageX=b.clientX+(d&&d.scrollLeft||e&&e.scrollLeft||0)-(d&&d.clientLeft||e&&e.clientLeft||0),a.pageY=b.clientY+(d&&d.scrollTop||e&&e.scrollTop||0)-(d&&d.clientTop||e&&e.clientTop||0)),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=W.test(e)?this.mouseHooks:V.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=l),3===a.target.nodeType&&(a.target=a.target.parentNode),g.filter?g.filter(a,f):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==_()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===_()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?Z:$):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:$,isPropagationStopped:$,isImmediatePropagationStopped:$,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=Z,a&&a.preventDefault&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=Z,a&&a.stopPropagation&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=Z,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=L.access(d,b);e||d.addEventListener(a,c,!0),L.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=L.access(d,b)-1;e?L.access(d,b,e):(d.removeEventListener(a,c,!0),L.remove(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(g in a)this.on(g,b,c,a[g],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=$;else if(!d)return this;return 1===e&&(f=d,d=function(a){return n().off(a),f.apply(this,arguments)},d.guid=f.guid||(f.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=$),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});var ab=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bb=/<([\w:]+)/,cb=/<|&#?\w+;/,db=/<(?:script|style|link)/i,eb=/checked\s*(?:[^=]|=\s*.checked.)/i,fb=/^$|\/(?:java|ecma)script/i,gb=/^true\/(.*)/,hb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ib={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ib.optgroup=ib.option,ib.tbody=ib.tfoot=ib.colgroup=ib.caption=ib.thead,ib.th=ib.td;function jb(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function kb(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function lb(a){var b=gb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function mb(a,b){for(var c=0,d=a.length;d>c;c++)L.set(a[c],"globalEval",!b||L.get(b[c],"globalEval"))}function nb(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(L.hasData(a)&&(f=L.access(a),g=L.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}M.hasData(a)&&(h=M.access(a),i=n.extend({},h),M.set(b,i))}}function ob(a,b){var c=a.getElementsByTagName?a.getElementsByTagName(b||"*"):a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function pb(a,b){var c=b.nodeName.toLowerCase();"input"===c&&T.test(a.type)?b.checked=a.checked:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}n.extend({clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=ob(h),f=ob(a),d=0,e=f.length;e>d;d++)pb(f[d],g[d]);if(b)if(c)for(f=f||ob(a),g=g||ob(h),d=0,e=f.length;e>d;d++)nb(f[d],g[d]);else nb(a,h);return g=ob(h,"script"),g.length>0&&mb(g,!i&&ob(a,"script")),h},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k=b.createDocumentFragment(),l=[],m=0,o=a.length;o>m;m++)if(e=a[m],e||0===e)if("object"===n.type(e))n.merge(l,e.nodeType?[e]:e);else if(cb.test(e)){f=f||k.appendChild(b.createElement("div")),g=(bb.exec(e)||["",""])[1].toLowerCase(),h=ib[g]||ib._default,f.innerHTML=h[1]+e.replace(ab,"<$1></$2>")+h[2],j=h[0];while(j--)f=f.lastChild;n.merge(l,f.childNodes),f=k.firstChild,f.textContent=""}else l.push(b.createTextNode(e));k.textContent="",m=0;while(e=l[m++])if((!d||-1===n.inArray(e,d))&&(i=n.contains(e.ownerDocument,e),f=ob(k.appendChild(e),"script"),i&&mb(f),c)){j=0;while(e=f[j++])fb.test(e.type||"")&&c.push(e)}return k},cleanData:function(a){for(var b,c,d,e,f=n.event.special,g=0;void 0!==(c=a[g]);g++){if(n.acceptData(c)&&(e=c[L.expando],e&&(b=L.cache[e]))){if(b.events)for(d in b.events)f[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);L.cache[e]&&delete L.cache[e]}delete M.cache[c[M.expando]]}}}),n.fn.extend({text:function(a){return J(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){(1===this.nodeType||11===this.nodeType||9===this.nodeType)&&(this.textContent=a)})},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=jb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(ob(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&mb(ob(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(ob(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return J(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!db.test(a)&&!ib[(bb.exec(a)||["",""])[1].toLowerCase()]){a=a.replace(ab,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(ob(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(ob(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,m=this,o=l-1,p=a[0],q=n.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&eb.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(c=n.buildFragment(a,this[0].ownerDocument,!1,this),d=c.firstChild,1===c.childNodes.length&&(c=d),d)){for(f=n.map(ob(c,"script"),kb),g=f.length;l>j;j++)h=c,j!==o&&(h=n.clone(h,!0,!0),g&&n.merge(f,ob(h,"script"))),b.call(this[j],h,j);if(g)for(i=f[f.length-1].ownerDocument,n.map(f,lb),j=0;g>j;j++)h=f[j],fb.test(h.type||"")&&!L.access(h,"globalEval")&&n.contains(i,h)&&(h.src?n._evalUrl&&n._evalUrl(h.src):n.globalEval(h.textContent.replace(hb,"")))}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),g=e.length-1,h=0;g>=h;h++)c=h===g?this:this.clone(!0),n(e[h])[b](c),f.apply(d,c.get());return this.pushStack(d)}});var qb,rb={};function sb(b,c){var d,e=n(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:n.css(e[0],"display");return e.detach(),f}function tb(a){var b=l,c=rb[a];return c||(c=sb(a,b),"none"!==c&&c||(qb=(qb||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=qb[0].contentDocument,b.write(),b.close(),c=sb(a,b),qb.detach()),rb[a]=c),c}var ub=/^margin/,vb=new RegExp("^("+Q+")(?!px)[a-z%]+$","i"),wb=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)};function xb(a,b,c){var d,e,f,g,h=a.style;return c=c||wb(a),c&&(g=c.getPropertyValue(b)||c[b]),c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),vb.test(g)&&ub.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0!==g?g+"":g}function yb(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d=l.documentElement,e=l.createElement("div"),f=l.createElement("div");if(f.style){f.style.backgroundClip="content-box",f.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===f.style.backgroundClip,e.style.cssText="border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute",e.appendChild(f);function g(){f.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",f.innerHTML="",d.appendChild(e);var g=a.getComputedStyle(f,null);b="1%"!==g.top,c="4px"===g.width,d.removeChild(e)}a.getComputedStyle&&n.extend(k,{pixelPosition:function(){return g(),b},boxSizingReliable:function(){return null==c&&g(),c},reliableMarginRight:function(){var b,c=f.appendChild(l.createElement("div"));return c.style.cssText=f.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",f.style.width="1px",d.appendChild(e),b=!parseFloat(a.getComputedStyle(c,null).marginRight),d.removeChild(e),f.removeChild(c),b}})}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var zb=/^(none|table(?!-c[ea]).+)/,Ab=new RegExp("^("+Q+")(.*)$","i"),Bb=new RegExp("^([+-])=("+Q+")","i"),Cb={position:"absolute",visibility:"hidden",display:"block"},Db={letterSpacing:"0",fontWeight:"400"},Eb=["Webkit","O","Moz","ms"];function Fb(a,b){if(b in a)return b;var c=b[0].toUpperCase()+b.slice(1),d=b,e=Eb.length;while(e--)if(b=Eb[e]+c,b in a)return b;return d}function Gb(a,b,c){var d=Ab.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Hb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+R[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+R[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+R[f]+"Width",!0,e))):(g+=n.css(a,"padding"+R[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+R[f]+"Width",!0,e)));return g}function Ib(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=wb(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=xb(a,b,f),(0>e||null==e)&&(e=a.style[b]),vb.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Hb(a,b,c||(g?"border":"content"),d,f)+"px"}function Jb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=L.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&S(d)&&(f[g]=L.access(d,"olddisplay",tb(d.nodeName)))):(e=S(d),"none"===c&&e||L.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=xb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Fb(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=Bb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Fb(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=xb(a,b,d)),"normal"===e&&b in Db&&(e=Db[b]),""===c||c?(f=parseFloat(e),c===!0||n.isNumeric(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?zb.test(n.css(a,"display"))&&0===a.offsetWidth?n.swap(a,Cb,function(){return Ib(a,b,d)}):Ib(a,b,d):void 0},set:function(a,c,d){var e=d&&wb(a);return Gb(a,c,d?Hb(a,b,d,"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),n.cssHooks.marginRight=yb(k.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},xb,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+R[d]+b]=f[d]||f[d-2]||f[0];return e}},ub.test(a)||(n.cssHooks[a+b].set=Gb)}),n.fn.extend({css:function(a,b){return J(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=wb(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Jb(this,!0)},hide:function(){return Jb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){S(this)?n(this).show():n(this).hide()})}});function Kb(a,b,c,d,e){return new Kb.prototype.init(a,b,c,d,e)}n.Tween=Kb,Kb.prototype={constructor:Kb,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Kb.propHooks[this.prop];return a&&a.get?a.get(this):Kb.propHooks._default.get(this)},run:function(a){var b,c=Kb.propHooks[this.prop];return this.pos=b=this.options.duration?n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Kb.propHooks._default.set(this),this}},Kb.prototype.init.prototype=Kb.prototype,Kb.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Kb.propHooks.scrollTop=Kb.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=Kb.prototype.init,n.fx.step={};var Lb,Mb,Nb=/^(?:toggle|show|hide)$/,Ob=new RegExp("^(?:([+-])=|)("+Q+")([a-z%]*)$","i"),Pb=/queueHooks$/,Qb=[Vb],Rb={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=Ob.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&Ob.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function Sb(){return setTimeout(function(){Lb=void 0}),Lb=n.now()}function Tb(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=R[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ub(a,b,c){for(var d,e=(Rb[b]||[]).concat(Rb["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Vb(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&S(a),q=L.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?L.get(a,"olddisplay")||tb(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Nb.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?tb(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=L.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;L.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ub(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function Wb(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function Xb(a,b,c){var d,e,f=0,g=Qb.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Lb||Sb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:Lb||Sb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(Wb(k,j.opts.specialEasing);g>f;f++)if(d=Qb[f].call(j,a,k,j.opts))return d;return n.map(k,Ub,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(Xb,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],Rb[c]=Rb[c]||[],Rb[c].unshift(b)},prefilter:function(a,b){b?Qb.unshift(a):Qb.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(S).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=Xb(this,n.extend({},a),f);(e||L.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=L.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Pb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=L.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Tb(b,!0),a,d,e)}}),n.each({slideDown:Tb("show"),slideUp:Tb("hide"),slideToggle:Tb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Lb=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Lb=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Mb||(Mb=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(Mb),Mb=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a=l.createElement("input"),b=l.createElement("select"),c=b.appendChild(l.createElement("option"));a.type="checkbox",k.checkOn=""!==a.value,k.optSelected=c.selected,b.disabled=!0,k.optDisabled=!c.disabled,a=l.createElement("input"),a.value="t",a.type="radio",k.radioValue="t"===a.value}();var Yb,Zb,$b=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return J(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===U?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?Zb:Yb)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))
},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),Zb={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=$b[b]||n.find.attr;$b[b]=function(a,b,d){var e,f;return d||(f=$b[b],$b[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,$b[b]=f),e}});var _b=/^(?:input|select|textarea|button)$/i;n.fn.extend({prop:function(a,b){return J(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){return a.hasAttribute("tabindex")||_b.test(a.nodeName)||a.href?a.tabIndex:-1}}}}),k.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var ac=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h="string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0===arguments.length||"string"==typeof a&&a,i=0,j=this.length;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(h)for(b=(a||"").match(E)||[];j>i;i++)if(c=this[i],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ac," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===U||"boolean"===c)&&(this.className&&L.set(this,"__className__",this.className),this.className=this.className||a===!1?"":L.get(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ac," ").indexOf(b)>=0)return!0;return!1}});var bc=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(bc,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(d.value,f)>=0)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},k.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var cc=n.now(),dc=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(a){var b,c;if(!a||"string"!=typeof a)return null;try{c=new DOMParser,b=c.parseFromString(a,"text/xml")}catch(d){b=void 0}return(!b||b.getElementsByTagName("parsererror").length)&&n.error("Invalid XML: "+a),b};var ec=/#.*$/,fc=/([?&])_=[^&]*/,gc=/^(.*?):[ \t]*([^\r\n]*)$/gm,hc=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,ic=/^(?:GET|HEAD)$/,jc=/^\/\//,kc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,lc={},mc={},nc="*/".concat("*"),oc=a.location.href,pc=kc.exec(oc.toLowerCase())||[];function qc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function rc(a,b,c,d){var e={},f=a===mc;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function sc(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function tc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function uc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:oc,type:"GET",isLocal:hc.test(pc[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":nc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?sc(sc(a,n.ajaxSettings),b):sc(n.ajaxSettings,a)},ajaxPrefilter:qc(lc),ajaxTransport:qc(mc),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!f){f={};while(b=gc.exec(e))f[b[1].toLowerCase()]=b[2]}b=f[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?e:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return c&&c.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||oc)+"").replace(ec,"").replace(jc,pc[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(h=kc.exec(k.url.toLowerCase()),k.crossDomain=!(!h||h[1]===pc[1]&&h[2]===pc[2]&&(h[3]||("http:"===h[1]?"80":"443"))===(pc[3]||("http:"===pc[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),rc(lc,k,b,v),2===t)return v;i=n.event&&k.global,i&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!ic.test(k.type),d=k.url,k.hasContent||(k.data&&(d=k.url+=(dc.test(d)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=fc.test(d)?d.replace(fc,"$1_="+cc++):d+(dc.test(d)?"&":"?")+"_="+cc++)),k.ifModified&&(n.lastModified[d]&&v.setRequestHeader("If-Modified-Since",n.lastModified[d]),n.etag[d]&&v.setRequestHeader("If-None-Match",n.etag[d])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+nc+"; q=0.01":""):k.accepts["*"]);for(j in k.headers)v.setRequestHeader(j,k.headers[j]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(j in{success:1,error:1,complete:1})v[j](k[j]);if(c=rc(mc,k,b,v)){v.readyState=1,i&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,c.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,f,h){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),c=void 0,e=h||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,f&&(u=tc(k,v,f)),u=uc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[d]=w),w=v.getResponseHeader("etag"),w&&(n.etag[d]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,i&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),i&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var vc=/%20/g,wc=/\[\]$/,xc=/\r?\n/g,yc=/^(?:submit|button|image|reset|file)$/i,zc=/^(?:input|select|textarea|keygen)/i;function Ac(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||wc.test(a)?d(a,e):Ac(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Ac(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Ac(c,a[c],b,e);return d.join("&").replace(vc,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&zc.test(this.nodeName)&&!yc.test(a)&&(this.checked||!T.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(xc,"\r\n")}}):{name:b.name,value:c.replace(xc,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new XMLHttpRequest}catch(a){}};var Bc=0,Cc={},Dc={0:200,1223:204},Ec=n.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Cc)Cc[a]()}),k.cors=!!Ec&&"withCredentials"in Ec,k.ajax=Ec=!!Ec,n.ajaxTransport(function(a){var b;return k.cors||Ec&&!a.crossDomain?{send:function(c,d){var e,f=a.xhr(),g=++Bc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)f.setRequestHeader(e,c[e]);b=function(a){return function(){b&&(delete Cc[g],b=f.onload=f.onerror=null,"abort"===a?f.abort():"error"===a?d(f.status,f.statusText):d(Dc[f.status]||f.status,f.statusText,"string"==typeof f.responseText?{text:f.responseText}:void 0,f.getAllResponseHeaders()))}},f.onload=b(),f.onerror=b("error"),b=Cc[g]=b("abort");try{f.send(a.hasContent&&a.data||null)}catch(h){if(b)throw h}},abort:function(){b&&b()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(d,e){b=n("<script>").prop({async:!0,charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&e("error"===a.type?404:200,a.type)}),l.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Fc=[],Gc=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Fc.pop()||n.expando+"_"+cc++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Gc.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Gc.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Gc,"$1"+e):b.jsonp!==!1&&(b.url+=(dc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Fc.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||l;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var Hc=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Hc)return Hc.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e,dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,f||[a.responseText,b,a])}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var Ic=a.document.documentElement;function Jc(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(typeof d.getBoundingClientRect!==U&&(e=d.getBoundingClientRect()),c=Jc(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||Ic;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ic})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(b,c){var d="pageYOffset"===c;n.fn[b]=function(e){return J(this,function(b,e,f){var g=Jc(b);return void 0===f?g?g[c]:b[e]:void(g?g.scrollTo(d?a.pageXOffset:f,d?f:a.pageYOffset):b[e]=f)},b,e,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=yb(k.pixelPosition,function(a,c){return c?(c=xb(a,b),vb.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return J(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Kc=a.jQuery,Lc=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Lc),b&&a.jQuery===n&&(a.jQuery=Kc),n},typeof b===U&&(a.jQuery=a.$=n),n});
//# sourceMappingURL=jquery.min.map;

// Generated by CoffeeScript 1.7.1

/*
Stores Environment-specific settings

These are the global settings for Maxwell and should defined by the user.
Settings do not change by loading a new circuit.
 */

(function() {
  define('cs!settings/Settings',[], function() {
    var Settings;
    Settings = (function() {
      var ColorPalette;

      function Settings() {}

      ColorPalette = {
        'voltageScale': ["#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737", "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777", "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747", "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"],
        'aliceblue': '#f0f8ff',
        'antiquewhite': '#faebd7',
        'aqua': '#00ffff',
        'aquamarine': '#7fffd4',
        'azure': '#f0ffff',
        'beige': '#f5f5dc',
        'bisque': '#ffe4c4',
        'black': '#000000',
        'blanchedalmond': '#ffebcd',
        'blue': '#0000ff',
        'blueviolet': '#8a2be2',
        'brown': '#a52a2a',
        'burlywood': '#deb887',
        'cadetblue': '#5f9ea0',
        'chartreuse': '#7fff00',
        'chocolate': '#d2691e',
        'coral': '#ff7f50',
        'cornflowerblue': '#6495ed',
        'cornsilk': '#fff8dc',
        'crimson': '#dc143c',
        'cyan': '#00ffff',
        'darkblue': '#00008b',
        'darkcyan': '#008b8b',
        'darkgoldenrod': '#b8860b',
        'darkgray': '#a9a9a9',
        'darkgrey': '#a9a9a9',
        'darkgreen': '#006400',
        'darkkhaki': '#bdb76b',
        'darkmagenta': '#8b008b',
        'darkolivegreen': '#556b2f',
        'darkorange': '#ff8c00',
        'darkorchid': '#9932cc',
        'darkred': '#8b0000',
        'darksalmon': '#e9967a',
        'darkseagreen': '#8fbc8f',
        'darkslateblue': '#483d8b',
        'darkslategray': '#2f4f4f',
        'darkslategrey': '#2f4f4f',
        'darkturquoise': '#00ced1',
        'darkviolet': '#9400d3',
        'deeppink': '#ff1493',
        'deepskyblue': '#00bfff',
        'dimgray': '#696969',
        'dimgrey': '#696969',
        'dodgerblue': '#1e90ff',
        'firebrick': '#b22222',
        'floralwhite': '#fffaf0',
        'forestgreen': '#228b22',
        'fuchsia': '#ff00ff',
        'gainsboro': '#dcdcdc',
        'ghostwhite': '#f8f8ff',
        'gold': '#ffd700',
        'goldenrod': '#daa520',
        'gray': '#808080',
        'grey': '#808080',
        'green': '#008000',
        'greenyellow': '#adff2f',
        'honeydew': '#f0fff0',
        'hotpink': '#ff69b4',
        'indianred': '#cd5c5c',
        'indigo': '#4b0082',
        'ivory': '#fffff0',
        'khaki': '#f0e68c',
        'lavender': '#e6e6fa',
        'lavenderblush': '#fff0f5',
        'lawngreen': '#7cfc00',
        'lemonchiffon': '#fffacd',
        'lightblue': '#add8e6',
        'lightcoral': '#f08080',
        'lightcyan': '#e0ffff',
        'lightgoldenrodyellow': '#fafad2',
        'lightgray': '#d3d3d3',
        'lightgrey': '#d3d3d3',
        'lightgreen': '#90ee90',
        'lightpink': '#ffb6c1',
        'lightsalmon': '#ffa07a',
        'lightseagreen': '#20b2aa',
        'lightskyblue': '#87cefa',
        'lightslategray': '#778899',
        'lightslategrey': '#778899',
        'lightsteelblue': '#b0c4de',
        'lightyellow': '#ffffe0',
        'lime': '#00ff00',
        'limegreen': '#32cd32',
        'linen': '#faf0e6',
        'magenta': '#ff00ff',
        'maroon': '#800000',
        'mediumaquamarine': '#66cdaa',
        'mediumblue': '#0000cd',
        'mediumorchid': '#ba55d3',
        'mediumpurple': '#9370d8',
        'mediumseagreen': '#3cb371',
        'mediumslateblue': '#7b68ee',
        'mediumspringgreen': '#00fa9a',
        'mediumturquoise': '#48d1cc',
        'mediumvioletred': '#c71585',
        'midnightblue': '#191970',
        'mintcream': '#f5fffa',
        'mistyrose': '#ffe4e1',
        'moccasin': '#ffe4b5',
        'navajowhite': '#ffdead',
        'navy': '#000080',
        'oldlace': '#fdf5e6',
        'olive': '#808000',
        'olivedrab': '#6b8e23',
        'orange': '#ffa500',
        'orangered': '#ff4500',
        'orchid': '#da70d6',
        'palegoldenrod': '#eee8aa',
        'palegreen': '#98fb98',
        'paleturquoise': '#afeeee',
        'palevioletred': '#d87093',
        'papayawhip': '#ffefd5',
        'peachpuff': '#ffdab9',
        'peru': '#cd853f',
        'pink': '#ffc0cb',
        'plum': '#dda0dd',
        'powderblue': '#b0e0e6',
        'purple': '#800080',
        'red': '#ff0000',
        'rosybrown': '#bc8f8f',
        'royalblue': '#4169e1',
        'saddlebrown': '#8b4513',
        'salmon': '#fa8072',
        'sandybrown': '#f4a460',
        'seagreen': '#2e8b57',
        'seashell': '#fff5ee',
        'sienna': '#a0522d',
        'silver': '#c0c0c0',
        'skyblue': '#87ceeb',
        'slateblue': '#6a5acd',
        'slategray': '#708090',
        'slategrey': '#708090',
        'snow': '#fffafa',
        'springgreen': '#00ff7f',
        'steelblue': '#4682b4',
        'tan': '#d2b48c',
        'teal': '#008080',
        'thistle': '#d8bfd8',
        'tomato': '#ff6347',
        'turquoise': '#40e0d0',
        'violet': '#ee82ee',
        'wheat': '#f5deb3',
        'white': '#ffffff',
        'whitesmoke': '#f5f5f5',
        'yellow': '#ffff00',
        'yellowgreen': '#9acd32'
      };

      Settings.FRACTIONAL_DIGITS = 2;

      Settings.CURRENT_SEGMENT_LENGTH = 16;

      Settings.POST_RADIUS = 1;

      Settings.CURRENT_RADIUS = 1;

      Settings.LINE_WIDTH = 2;

      Settings.GRID_SIZE = 16;

      Settings.SMALL_GRID = false;

      Settings.SHOW_VALUES = false;

      Settings.SELECT_COLOR = ColorPalette.orange;

      Settings.POST_COLOR_SELECTED = ColorPalette.orange;

      Settings.POST_COLOR = ColorPalette.black;

      Settings.DOTS_COLOR = ColorPalette.yellow;

      Settings.DOTS_OUTLINE = ColorPalette.orange;

      Settings.TEXT_COLOR = ColorPalette.black;

      Settings.TEXT_ERROR_COLOR = ColorPalette.red;

      Settings.TEXT_WARNING_COLOR = ColorPalette.yellow;

      Settings.SELECTION_MARQUEE_COLOR = ColorPalette.orange;

      Settings.GRID_COLOR = ColorPalette.darkyellow;

      Settings.BG_COLOR = ColorPalette.white;

      Settings.FG_COLOR = ColorPalette.darkgray;

      Settings.ERROR_COLOR = ColorPalette.darkred;

      Settings.WARNING_COLOR = ColorPalette.orange;

      return Settings;

    })();
    return Settings;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!geom/Point',[], function() {
    var Point;
    Point = (function() {
      function Point(x, y) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
      }

      Point.prototype.equals = function(otherPoint) {
        return this.x === otherPoint.x && this.y === otherPoint.y;
      };

      Point.toArray = function(num) {
        var i, _i, _len, _ref, _results;
        _ref = Array(num);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(new Point(0, 0));
        }
        return _results;
      };

      Point.comparePair = function(x1, x2, y1, y2) {
        return (x1 === y1 && x2 === y2) || (x1 === y2 && x2 === y1);
      };

      Point.distanceSq = function(x1, y1, x2, y2) {
        x2 -= x1;
        y2 -= y1;
        return x2 * x2 + y2 * y2;
      };

      Point.prototype.toString = function() {
        return "[\t" + this.x + ", \t" + this.y + "]";
      };

      return Point;

    })();
    return Point;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!geom/Polygon',['cs!geom/Point'], function(Point) {
    var Polygon;
    Polygon = (function() {
      function Polygon(vertices) {
        var i;
        this.vertices = [];
        if (vertices && vertices.length % 2 === 0) {
          i = 0;
          while (i < vertices.length) {
            this.addVertex(vertices[i], vertices[i + 1]);
            i += 2;
          }
        }
      }

      Polygon.prototype.addVertex = function(x, y) {
        return this.vertices.push(new Point(x, y));
      };

      Polygon.prototype.getX = function(n) {
        return this.vertices[n].x;
      };

      Polygon.prototype.getY = function(n) {
        return this.vertices[n].y;
      };

      Polygon.prototype.numPoints = function() {
        return this.vertices.length;
      };

      return Polygon;

    })();
    return Polygon;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!geom/Rectangle',[], function() {
    var Rectangle;
    Rectangle = (function() {
      function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }

      Rectangle.prototype.contains = function(x, y) {
        return x >= this.x && x <= (this.x + this.width) && y >= this.y && (y <= this.y + this.height);
      };

      Rectangle.prototype.equals = function(otherRect) {
        if (otherRect != null) {
          if (otherRect.x === this.x && otherRect.y === this.y && otherRect.width === this.width && otherRect.height === this.height) {
            return true;
          }
        }
        return false;
      };

      Rectangle.prototype.intersects = function(otherRect) {
        var otherX, otherX2, otherY, otherY2;
        this.x2 = this.x + this.width;
        this.y2 = this.y + this.height;
        otherX = otherRect.x;
        otherY = otherRect.y;
        otherX2 = otherRect.x + otherRect.width;
        otherY2 = otherRect.y + otherRect.height;
        return this.x < otherX2 && this.x2 > otherX && this.y < otherY2 && this.y2 > otherY;
      };

      Rectangle.prototype.collidesWithComponent = function(circuitComponent) {
        return this.intersects(circuitComponent.getBoundingBox());
      };

      return Rectangle;

    })();
    return Rectangle;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!render/DrawHelper',['cs!settings/Settings', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point'], function(Settings, Polygon, Rectangle, Point) {
    var DrawHelper;
    DrawHelper = (function() {
      var EPSILON;

      function DrawHelper() {}

      DrawHelper.ps1 = new Point(0, 0);

      DrawHelper.ps2 = new Point(0, 0);

      DrawHelper.colorScaleCount = 32;

      DrawHelper.colorScale = [];

      DrawHelper.muString = "u";

      DrawHelper.ohmString = "ohm";

      EPSILON = 0.48;

      DrawHelper.initializeColorScale = function() {
        var i, n1, n2, voltage, _i, _ref, _results;
        this.colorScale = new Array(this.colorScaleCount);
        _results = [];
        for (i = _i = 0, _ref = this.colorScaleCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          voltage = i * 2 / this.colorScaleCount - 1;
          if (voltage < 0) {
            n1 = Math.floor((128 * -voltage) + 127);
            n2 = Math.floor(127 * (1 + voltage));
            _results.push(this.colorScale[i] = new Color(n1, n2, n2));
          } else {
            n1 = Math.floor((128 * voltage) + 127);
            n2 = Math.floor(127 * (1 - voltage));
            _results.push(this.colorScale[i] = new Color(n2, n1, n2));
          }
        }
        return _results;
      };

      DrawHelper.scale = ["#ff0000", "#f70707", "#ef0f0f", "#e71717", "#df1f1f", "#d72727", "#cf2f2f", "#c73737", "#bf3f3f", "#b74747", "#af4f4f", "#a75757", "#9f5f5f", "#976767", "#8f6f6f", "#877777", "#7f7f7f", "#778777", "#6f8f6f", "#679767", "#5f9f5f", "#57a757", "#4faf4f", "#47b747", "#3fbf3f", "#37c737", "#2fcf2f", "#27d727", "#1fdf1f", "#17e717", "#0fef0f", "#07f707", "#00ff00"];

      DrawHelper.unitsFont = "Arial, Helvetica, sans-serif";

      DrawHelper.interpPoint = function(ptA, ptB, f, g) {
        var gx, gy, ptOut;
        if (g == null) {
          g = 0;
        }
        gx = ptB.y - ptA.y;
        gy = ptA.x - ptB.x;
        g /= Math.sqrt(gx * gx + gy * gy);
        ptOut = new Point();
        ptOut.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) + g * gx + EPSILON);
        ptOut.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) + g * gy + EPSILON);
        return ptOut;
      };

      DrawHelper.interpPoint2 = function(ptA, ptB, f, g) {
        var gx, gy, ptOut1, ptOut2;
        gx = ptB.y - ptA.y;
        gy = ptA.x - ptB.x;
        g /= Math.sqrt(gx * gx + gy * gy);
        ptOut1 = new Point();
        ptOut2 = new Point();
        ptOut1.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) + g * gx + EPSILON);
        ptOut1.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) + g * gy + EPSILON);
        ptOut2.x = Math.floor((1 - f) * ptA.x + (f * ptB.x) - g * gx + EPSILON);
        ptOut2.y = Math.floor((1 - f) * ptA.y + (f * ptB.y) - g * gy + EPSILON);
        return [ptOut1, ptOut2];
      };

      DrawHelper.calcArrow = function(point1, point2, al, aw) {
        var dist, dx, dy, p1, p2, poly, _ref;
        poly = new Polygon();
        dx = point2.x - point1.x;
        dy = point2.y - point1.y;
        dist = Math.sqrt(dx * dx + dy * dy);
        poly.addVertex(point2.x, point2.y);
        _ref = this.interpPoint2(point1, point2, 1 - al / dist, aw), p1 = _ref[0], p2 = _ref[1];
        poly.addVertex(p1.x, p1.y);
        poly.addVertex(p2.x, p2.y);
        return poly;
      };

      DrawHelper.createPolygon = function(pt1, pt2, pt3, pt4) {
        var newPoly;
        newPoly = new Polygon();
        newPoly.addVertex(pt1.x, pt1.y);
        newPoly.addVertex(pt2.x, pt2.y);
        newPoly.addVertex(pt3.x, pt3.y);
        if (pt4) {
          newPoly.addVertex(pt4.x, pt4.y);
        }
        return newPoly;
      };

      DrawHelper.createPolygonFromArray = function(vertexArray) {
        var newPoly, vertex, _i, _len;
        newPoly = new Polygon();
        for (_i = 0, _len = vertexArray.length; _i < _len; _i++) {
          vertex = vertexArray[_i];
          newPoly.addVertex(vertex.x, vertex.y);
        }
        return newPoly;
      };

      DrawHelper.drawCoil = function(hs, point1, point2, vStart, vEnd, renderContext) {
        var color, cx, hsx, i, segments, voltageLevel, _i, _results;
        segments = 40;
        this.ps1.x = point1.x;
        this.ps1.y = point1.y;
        _results = [];
        for (i = _i = 0; 0 <= segments ? _i < segments : _i > segments; i = 0 <= segments ? ++_i : --_i) {
          cx = (((i + 1) * 8 / segments) % 2) - 1;
          hsx = Math.sqrt(1 - cx * cx);
          this.ps2 = this.interpPoint(point1, point2, i / segments, hsx * hs);
          voltageLevel = vStart + (vEnd - vStart) * i / segments;
          color = this.getVoltageColor(voltageLevel);
          renderContext.drawThickLinePt(this.ps1, this.ps2, color);
          this.ps1.x = this.ps2.x;
          _results.push(this.ps1.y = this.ps2.y);
        }
        return _results;
      };

      DrawHelper.getShortUnitText = function(value, unit) {
        return this.getUnitText(value, unit, 1);
      };

      DrawHelper.getUnitText = function(value, unit, decimalPoints) {
        var absValue;
        if (decimalPoints == null) {
          decimalPoints = 2;
        }
        absValue = Math.abs(value);
        if (absValue < 1e-18) {
          return "0 " + unit;
        }
        if (absValue < 1e-12) {
          return (value * 1e15).toFixed(decimalPoints) + " f" + unit;
        }
        if (absValue < 1e-9) {
          return (value * 1e12).toFixed(decimalPoints) + " p" + unit;
        }
        if (absValue < 1e-6) {
          return (value * 1e9).toFixed(decimalPoints) + " n" + unit;
        }
        if (absValue < 1e-3) {
          return (value * 1e6).toFixed(decimalPoints) + " " + this.muString + unit;
        }
        if (absValue < 1) {
          return (value * 1e3).toFixed(decimalPoints) + " m" + unit;
        }
        if (absValue < 1e3) {
          return value.toFixed(decimalPoints) + " " + unit;
        }
        if (absValue < 1e6) {
          return (value * 1e-3).toFixed(decimalPoints) + " k" + unit;
        }
        if (absValue < 1e9) {
          return (value * 1e-6).toFixed(decimalPoints) + " M" + unit;
        }
        return (value * 1e-9).toFixed(decimalPoints) + " G" + unit;
      };

      DrawHelper.getVoltageDText = function(v) {
        return this.getUnitText(Math.abs(v), "V");
      };

      DrawHelper.getVoltageText = function(v) {
        return this.getUnitText(v, "V");
      };

      DrawHelper.getCurrentText = function(value) {
        return this.getUnitText(value, "A");
      };

      DrawHelper.getCurrentDText = function(value) {
        return this.getUnitText(Math.abs(value), "A");
      };

      DrawHelper.getVoltageColor = function(volts, fullScaleVRange) {
        var value;
        if (fullScaleVRange == null) {
          fullScaleVRange = 10;
        }
        value = Math.floor((volts + fullScaleVRange) * (this.colorScaleCount - 1) / (2 * fullScaleVRange));
        if (value < 0) {
          value = 0;
        } else if (value >= this.colorScaleCount) {
          value = this.colorScaleCount - 1;
        }
        return this.scale[value];
      };

      DrawHelper.getPowerColor = function(power, scaleFactor) {
        var b, powerLevel, rg;
        if (scaleFactor == null) {
          scaleFactor = 1;
        }
        if (!Settings.powerCheckItem) {
          return;
        }
        powerLevel = power * scaleFactor;
        power = Math.abs(powerLevel);
        if (power > 1) {
          power = 1;
        }
        rg = 128 + Math.floor(power * 127);
        return b = Math.floor(128 * (1 - power));
      };

      return DrawHelper;

    })();
    return DrawHelper;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!util/MathUtils',[], function() {
    var MathUtils;
    MathUtils = (function() {
      function MathUtils() {}

      MathUtils.isInfinite = function(num) {
        return num > 1e18 || !isFinite(num);
      };

      MathUtils.sign = function(x) {
        if (x < 0) {
          return -1;
        } else if (x === 0) {
          return 0;
        } else {
          return 1;
        }
      };

      MathUtils.getRand = function(x) {
        return Math.floor(Math.random() * (x + 1));
      };

      return MathUtils;

    })();
    return MathUtils;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!util/ArrayUtils',[], function() {
    var ArrayUtils;
    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function(searchItem, i) {
        if (i == null) {
          i = 0;
        }
        while (i < this.length) {
          if (this[i] === searchItem) {
            return i;
          }
          ++i;
        }
        return -1;
      };
    }
    Array.prototype.remove = function() {
      var args, ax, item, num_args;
      args = arguments;
      num_args = args.length;
      while (num_args && this.length) {
        item = args[--num_args];
        while ((ax = this.indexOf(item)) !== -1) {
          this.splice(ax, 1);
        }
      }
      return this;
    };
    ArrayUtils = (function() {
      function ArrayUtils() {}

      ArrayUtils.zeroArray = function(numElements) {
        var i;
        if (numElements < 1) {
          return [];
        }
        return (function() {
          var _i, _len, _ref, _results;
          _ref = Array(numElements);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            _results.push(0);
          }
          return _results;
        })();
      };

      ArrayUtils.zeroArray2 = function(numRows, numCols) {
        var i, _i, _len, _ref, _results;
        if (numRows < 1) {
          return [];
        }
        _ref = Array(numRows);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          i = _ref[_i];
          _results.push(this.zeroArray(numCols));
        }
        return _results;
      };

      ArrayUtils.isCleanArray = function(arr) {
        var element, valid, _i, _len;
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          element = arr[_i];
          if (element instanceof Array) {
            valid = arguments.callee(element);
          } else {
            if (!isFinite(element)) {
              console.warn("Invalid number found: " + element);
              console.printStackTrace();
              return false;
            }
          }
        }
      };

      ArrayUtils.printArray = function(arr) {
        var subarr, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arr.length; _i < _len; _i++) {
          subarr = arr[_i];
          _results.push(console.log(subarr));
        }
        return _results;
      };

      return ArrayUtils;

    })();
    return ArrayUtils;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('cs!component/CircuitComponent',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!util/MathUtils', 'cs!util/ArrayUtils'], function(Settings, DrawHelper, Rectangle, Point, MathUtils, ArrayUtils) {
    var CircuitComponent;
    CircuitComponent = (function() {
      function CircuitComponent(x1, y1, x2, y2, flags, st) {
        this.x1 = x1 != null ? x1 : 100;
        this.y1 = y1 != null ? y1 : 100;
        this.x2 = x2 != null ? x2 : 100;
        this.y2 = y2 != null ? y2 : 200;
        if (flags == null) {
          flags = 0;
        }
        if (st == null) {
          st = [];
        }
        this.drawDots = __bind(this.drawDots, this);
        this.destroy = __bind(this.destroy, this);
        this.current = 0;
        this.curcount = 0;
        this.noDiagonal = false;
        this.selected = false;
        this.dragging = false;
        this.parentCircuit = null;
        this.focused = false;
        this.flags = flags || this.getDefaultFlags();
        this.setPoints();
        this.allocNodes();
        this.initBoundingBox();
        this.component_id = MathUtils.getRand(100000000) + (new Date()).getTime();
      }

      CircuitComponent.prototype.getParentCircuit = function() {
        return this.Circuit;
      };

      CircuitComponent.prototype.isBeingDragged = function() {
        return this.dragging;
      };

      CircuitComponent.prototype.beingDragged = function(dragging) {
        return this.dragging = dragging;
      };

      CircuitComponent.prototype.allocNodes = function() {
        this.nodes = ArrayUtils.zeroArray(this.getPostCount() + this.getInternalNodeCount());
        return this.volts = ArrayUtils.zeroArray(this.getPostCount() + this.getInternalNodeCount());
      };

      CircuitComponent.prototype.setPoints = function() {
        this.dx = this.x2 - this.x1;
        this.dy = this.y2 - this.y1;
        this.dn = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
        this.dpx1 = this.dy / this.dn;
        this.dpy1 = -this.dx / this.dn;
        this.dsign = (this.dy === 0 ? MathUtils.sign(this.dx) : MathUtils.sign(this.dy));
        this.point1 = new Point(this.x1, this.y1);
        return this.point2 = new Point(this.x2, this.y2);
      };

      CircuitComponent.prototype.setPowerColor = function(color) {
        return console.warn("Set power color not yet implemented");
      };

      CircuitComponent.prototype.getDumpType = function() {
        return 0;
      };

      CircuitComponent.prototype.reset = function() {
        this.volts = ArrayUtils.zeroArray(this.volts.length);
        return this.curcount = 0;
      };

      CircuitComponent.prototype.setCurrent = function(x, current) {
        return this.current = current;
      };

      CircuitComponent.prototype.getCurrent = function() {
        return this.current;
      };

      CircuitComponent.prototype.getVoltageDiff = function() {
        return this.volts[0] - this.volts[1];
      };

      CircuitComponent.prototype.getPower = function() {
        return this.getVoltageDiff() * this.current;
      };

      CircuitComponent.prototype.calculateCurrent = function() {};

      CircuitComponent.prototype.doStep = function() {};

      CircuitComponent.prototype.orphaned = function() {
        return this.Circuit === null || this.Circuit === void 0;
      };

      CircuitComponent.prototype.destroy = function() {
        return this.Circuit.desolder(this);
      };

      CircuitComponent.prototype.startIteration = function() {};

      CircuitComponent.prototype.getPostVoltage = function(post_idx) {
        return this.volts[post_idx];
      };

      CircuitComponent.prototype.setNodeVoltage = function(node_idx, voltage) {
        this.volts[node_idx] = voltage;
        return this.calculateCurrent();
      };

      CircuitComponent.prototype.calcLeads = function(len) {
        if (this.dn < len || len === 0) {
          this.lead1 = this.point1;
          this.lead2 = this.point2;
          console.log("Len: " + len);
          return;
        }
        this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, (this.dn - len) / (2 * this.dn));
        return this.lead2 = DrawHelper.interpPoint(this.point1, this.point2, (this.dn + len) / (2 * this.dn));
      };

      CircuitComponent.prototype.updateDotCount = function(cur, cc) {
        var cadd;
        if (isNaN(cur) || (cur == null)) {
          cur = this.current;
        }
        if (isNaN(cc) || (cc == null)) {
          cc = this.curcount;
        }
        cadd = cur * this.Circuit.Params.getCurrentMult();
        cadd %= 8;
        this.curcount = cc + cadd;
        return this.curcount;
      };

      CircuitComponent.prototype.getDefaultFlags = function() {
        return 0;
      };

      CircuitComponent.prototype.equal_to = function(otherComponent) {
        return this.component_id === otherComponent.component_id;
      };

      CircuitComponent.prototype.drag = function(newX, newY) {
        newX = this.Circuit.snapGrid(newX);
        newY = this.Circuit.snapGrid(newY);
        if (this.noDiagonal) {
          if (Math.abs(this.x1 - newX) < Math.abs(this.y1 - newY)) {
            newX = this.x1;
          } else {
            newY = this.y1;
          }
        }
        this.x2 = newX;
        this.y2 = newY;
        return this.setPoints();
      };

      CircuitComponent.prototype.move = function(deltaX, deltaY) {
        this.x1 += deltaX;
        this.y1 += deltaY;
        this.x2 += deltaX;
        this.y2 += deltaY;
        this.boundingBox.x += deltaX;
        this.boundingBox.y += deltaY;
        return this.setPoints();
      };

      CircuitComponent.prototype.allowMove = function(deltaX, deltaY) {
        var circuitElm, newX, newX2, newY, newY2, _i, _len, _ref;
        newX = this.x1 + deltaX;
        newY = this.y1 + deltaY;
        newX2 = this.x2 + deltaX;
        newY2 = this.y2 + deltaY;
        _ref = this.Circuit.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          circuitElm = _ref[_i];
          if (circuitElm.x1 === newX && circuitElm.y1 === newY && circuitElm.x2 === newX2 && circuitElm.y2 === newY2) {
            return false;
          }
          if (circuitElm.x1 === newX2 && circuitElm.y1 === newY2 && circuitElm.x2 === newX && circuitElm.y2 === newY) {
            return false;
          }
        }
        return true;
      };

      CircuitComponent.prototype.movePoint = function(n, deltaX, deltaY) {
        if (n === 0) {
          this.x1 += deltaX;
          this.y1 += deltaY;
        } else {
          this.x2 += deltaX;
          this.y2 += deltaY;
        }
        return this.setPoints();
      };

      CircuitComponent.prototype.stamp = function() {
        throw "Called abstract function stamp() in Circuit " + (this.getDumpType());
      };

      CircuitComponent.prototype.getDumpClass = function() {
        return this.toString();
      };

      CircuitComponent.prototype.toString = function() {
        return console.error("Virtual call on toString in circuitComponent was " + (this.dump()));
      };

      CircuitComponent.prototype.dump = function() {
        return this.getDumpType() + " " + this.x1 + " " + this.y1 + " " + this.x2 + " " + this.y2 + " " + this.flags;
      };

      CircuitComponent.prototype.getVoltageSourceCount = function() {
        return 0;
      };

      CircuitComponent.prototype.getInternalNodeCount = function() {
        return 0;
      };

      CircuitComponent.prototype.setNode = function(nodeIdx, newValue) {
        return this.nodes[nodeIdx] = newValue;
      };

      CircuitComponent.prototype.setVoltageSource = function(node, value) {
        return this.voltSource = value;
      };

      CircuitComponent.prototype.getVoltageSource = function() {
        return this.voltSource;
      };

      CircuitComponent.prototype.nonLinear = function() {
        return false;
      };

      CircuitComponent.prototype.getPostCount = function() {
        return 2;
      };

      CircuitComponent.prototype.getNode = function(nodeIdx) {
        return this.nodes[nodeIdx];
      };

      CircuitComponent.prototype.getPost = function(postIdx) {
        if (postIdx === 0) {
          return this.point1;
        } else if (postIdx === 1) {
          return this.point2;
        }
        return console.printStackTrace();
      };

      CircuitComponent.prototype.getBoundingBox = function() {
        return this.boundingBox;
      };

      CircuitComponent.prototype.initBoundingBox = function() {
        this.boundingBox = new Rectangle();
        this.boundingBox.x = Math.min(this.x1, this.x2);
        this.boundingBox.y = Math.min(this.y1, this.y2);
        this.boundingBox.width = Math.abs(this.x2 - this.x1) + 1;
        return this.boundingBox.height = Math.abs(this.y2 - this.y1) + 1;
      };

      CircuitComponent.prototype.setBbox = function(x1, y1, x2, y2) {
        var temp;
        if (x1 > x2) {
          temp = x1;
          x1 = x2;
          x2 = temp;
        }
        if (y1 > y2) {
          temp = y1;
          y1 = y2;
          y2 = temp;
        }
        this.boundingBox.x = x1;
        this.boundingBox.y = y1;
        this.boundingBox.width = x2 - x1 + 1;
        return this.boundingBox.height = y2 - y1 + 1;
      };

      CircuitComponent.prototype.setBboxPt = function(p1, p2, width) {
        var deltaX, deltaY;
        this.setBbox(p1.x, p1.y, p2.x, p2.y);
        deltaX = this.dpx1 * width;
        deltaY = this.dpy1 * width;
        return this.adjustBbox(p1.x + deltaX, p1.y + deltaY, p1.x - deltaX, p1.y - deltaY);
      };

      CircuitComponent.prototype.adjustBbox = function(x1, y1, x2, y2) {
        var q;
        if (x1 > x2) {
          q = x1;
          x1 = x2;
          x2 = q;
        }
        if (y1 > y2) {
          q = y1;
          y1 = y2;
          y2 = q;
        }
        x1 = Math.min(this.boundingBox.x, x1);
        y1 = Math.min(this.boundingBox.y, y1);
        x2 = Math.max(this.boundingBox.x + this.boundingBox.width - 1, x2);
        y2 = Math.max(this.boundingBox.y + this.boundingBox.height - 1, y2);
        this.boundingBox.x = x1;
        this.boundingBox.y = y1;
        this.boundingBox.width = x2 - x1;
        return this.boundingBox.height = y2 - y1;
      };

      CircuitComponent.prototype.adjustBboxPt = function(p1, p2) {
        return this.adjustBbox(p1.x, p1.y, p2.x, p2.y);
      };

      CircuitComponent.prototype.isCenteredText = function() {
        return false;
      };

      CircuitComponent.prototype.getInfo = function(arr) {
        return arr = new Array(15);
      };

      CircuitComponent.prototype.getEditInfo = function(n) {
        throw "Called abstract function getEditInfo() in AbstractCircuitElement";
      };

      CircuitComponent.prototype.setEditValue = function(n, ei) {
        throw "Called abstract function setEditInfo() in AbstractCircuitElement";
      };

      CircuitComponent.prototype.getBasicInfo = function(arr) {
        arr[1] = "I = " + DrawHelper.getCurrentDText(this.getCurrent());
        arr[2] = "Vd = " + DrawHelper.getVoltageDText(this.getVoltageDiff());
        return 3;
      };

      CircuitComponent.prototype.getScopeValue = function(x) {
        if (x === 1) {
          return this.getPower();
        } else {
          return this.getVoltageDiff();
        }
      };

      CircuitComponent.getScopeUnits = function(x) {
        if (x === 1) {
          return "W";
        } else {
          return "V";
        }
      };

      CircuitComponent.prototype.getConnection = function(n1, n2) {
        return true;
      };

      CircuitComponent.prototype.hasGroundConnection = function(n1) {
        return false;
      };

      CircuitComponent.prototype.isWire = function() {
        return false;
      };

      CircuitComponent.prototype.canViewInScope = function() {
        return this.getPostCount() <= 2;
      };

      CircuitComponent.prototype.needsHighlight = function() {
        return this.focused;
      };

      CircuitComponent.prototype.setSelected = function(selected) {
        return this.selected = selected;
      };

      CircuitComponent.prototype.isSelected = function() {
        return this.selected;
      };

      CircuitComponent.prototype.needsShortcut = function() {
        return false;
      };


      /* */


      /* */

      CircuitComponent.prototype.draw = function(renderContext) {
        this.curcount = this.updateDotCount();
        this.drawPosts(renderContext);
        return this.draw2Leads(renderContext);
      };

      CircuitComponent.prototype.draw2Leads = function(renderContext) {
        if ((this.point1 != null) && (this.lead1 != null)) {
          renderContext.drawThickLinePt(this.point1, this.lead1, DrawHelper.getVoltageColor(this.volts[0]));
        }
        if ((this.point2 != null) && (this.lead2 != null)) {
          return renderContext.drawThickLinePt(this.lead2, this.point2, DrawHelper.getVoltageColor(this.volts[1]));
        }
      };

      CircuitComponent.prototype.drawDots = function(point1, point2, renderContext) {
        var currentIncrement, dn, ds, dx, dy, newPos, x0, y0, _ref, _results;
        if (point1 == null) {
          point1 = this.point1;
        }
        if (point2 == null) {
          point2 = this.point2;
        }
        if (((_ref = this.Circuit) != null ? _ref.isStopped() : void 0) || this.current === 0) {
          return;
        }
        dx = point2.x - point1.x;
        dy = point2.y - point1.y;
        dn = Math.sqrt(dx * dx + dy * dy);
        ds = 16;
        currentIncrement = this.current * this.Circuit.currentSpeed();
        this.curcount = (this.curcount + currentIncrement) % ds;
        if (this.curcount < 0) {
          this.curcount += ds;
        }
        newPos = this.curcount;
        _results = [];
        while (newPos < dn) {
          x0 = point1.x + newPos * dx / dn;
          y0 = point1.y + newPos * dy / dn;
          renderContext.fillCircle(x0, y0, Settings.CURRENT_RADIUS);
          _results.push(newPos += ds);
        }
        return _results;
      };


      /*
      Todo: Not yet implemented
       */

      CircuitComponent.prototype.drawCenteredText = function(text, x, y, doCenter, renderContext) {
        var ascent, descent, strWidth;
        strWidth = 10 * text.length;
        if (doCenter) {
          x -= strWidth / 2;
        }
        ascent = -10;
        descent = 5;
        renderContext.fillStyle = Settings.TEXT_COLOR;
        renderContext.fillText(text, x, y + ascent);
        this.adjustBbox(x, y - ascent, x + strWidth, y + ascent + descent);
        return text;
      };


      /*
       * Draws relevant values near components
       *  e.g. 500 Ohms, 10V, etc...
       */

      CircuitComponent.prototype.drawValues = function(valueText, hs, renderContext) {
        var dpx, dpy, offset, stringWidth, xc, xx, ya, yc;
        if (!valueText) {
          return;
        }
        stringWidth = 100;
        ya = -10;
        xc = (this.x2 + this.x1) / 2;
        yc = (this.y2 + this.y1) / 2;
        dpx = Math.floor(this.dpx1 * hs);
        dpy = Math.floor(this.dpy1 * hs);
        offset = 20;
        renderContext.fillStyle = Settings.TEXT_COLOR;
        if (dpx === 0) {
          return renderContext.fillText(valueText, xc - stringWidth / 2 + 3 * offset / 2, yc - Math.abs(dpy) - offset / 3);
        } else {
          xx = xc + Math.abs(dpx) + offset;
          return renderContext.fillText(valueText, xx, yc + dpy + ya);
        }
      };

      CircuitComponent.prototype.drawPosts = function(renderContext) {
        var i, post, _i, _ref, _results;
        _results = [];
        for (i = _i = 0, _ref = this.getPostCount(); 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          post = this.getPost(i);
          _results.push(this.drawPost(post.x, post.y, this.nodes[i], renderContext));
        }
        return _results;
      };

      CircuitComponent.prototype.drawPost = function(x0, y0, node, renderContext) {
        var fillColor, strokeColor;
        if (this.needsHighlight()) {
          fillColor = Settings.POST_COLOR_SELECTED;
          strokeColor = Settings.POST_COLOR_SELECTED;
        } else {
          fillColor = Settings.POST_COLOR;
          strokeColor = Settings.POST_COLOR;
        }
        return renderContext.fillCircle(x0, y0, Settings.POST_RADIUS, 1, fillColor, strokeColor);
      };

      CircuitComponent.newPointArray = function(n) {
        var a;
        a = new Array(n);
        while (n > 0) {
          a[--n] = new Point(0, 0);
        }
        return a;
      };

      CircuitComponent.prototype.comparePair = function(x1, x2, y1, y2) {
        (x1 === y1 && x2 === y2) || (x1 === y2 && x2 === y1);
        return this.Circuit.Params;
      };

      CircuitComponent.prototype.timeStep = function() {
        return this.Circuit.timeStep();
      };

      return CircuitComponent;

    })();
    return CircuitComponent;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/WireElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var WireElm;
    WireElm = (function(_super) {
      __extends(WireElm, _super);

      function WireElm(xa, ya, xb, yb, f, st) {
        WireElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      }

      WireElm.prototype.toString = function() {
        return "WireElm";
      };

      WireElm.FLAG_SHOWCURRENT = 1;

      WireElm.FLAG_SHOWVOLTAGE = 2;

      WireElm.prototype.draw = function(renderContext) {
        var s;
        renderContext.drawThickLinePt(this.point1, this.point2, DrawHelper.getVoltageColor(this.volts[0]));
        this.setBboxPt(this.point1, this.point2, 3);
        if (this.mustShowCurrent()) {
          s = DrawHelper.getUnitText(Math.abs(this.getCurrent()), "A");
          this.drawValues(s, 4, renderContext);
        } else if (this.mustShowVoltage()) {
          s = DrawHelper.getUnitText(this.volts[0], "V");
        }
        this.drawValues(s, 4, renderContext);
        this.drawPosts(renderContext);
        return this.drawDots(this.point1, this.point2, renderContext);
      };

      WireElm.prototype.stamp = function(stamper) {
        console.log("\nStamping Wire Elm");
        return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
      };

      WireElm.prototype.mustShowCurrent = function() {
        return (this.flags & WireElm.FLAG_SHOWCURRENT) !== 0;
      };

      WireElm.prototype.mustShowVoltage = function() {
        return (this.flags & WireElm.FLAG_SHOWVOLTAGE) !== 0;
      };

      WireElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      WireElm.prototype.getInfo = function(arr) {
        WireElm.__super__.getInfo.call(this);
        arr[0] = "Wire";
        arr[1] = "I = " + DrawHelper.getCurrentDText(this.getCurrent());
        return arr[2] = "V = " + DrawHelper.getVoltageText(this.volts[0]);
      };

      WireElm.prototype.getEditInfo = function(n) {};

      WireElm.prototype.setEditValue = function(n, ei) {};

      WireElm.prototype.getDumpType = function() {
        return "w";
      };

      WireElm.prototype.getPower = function() {
        return 0;
      };

      WireElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      WireElm.prototype.isWire = function() {
        return true;
      };

      WireElm.prototype.needsShortcut = function() {
        return true;
      };

      return WireElm;

    })(CircuitComponent);
    return WireElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/ResistorElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var ResistorElm;
    ResistorElm = (function(_super) {
      __extends(ResistorElm, _super);

      function ResistorElm(xa, ya, xb, yb, f, st) {
        if (f == null) {
          f = 0;
        }
        if (st == null) {
          st = null;
        }
        ResistorElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        if (st && st.length > 0) {
          this.resistance = parseFloat(st);
        } else {
          this.resistance = 500;
        }
        this.ps3 = new Point(100, 50);
        this.ps4 = new Point(100, 150);
      }

      ResistorElm.prototype.draw = function(renderContext) {
        var hs, i, newOffset, oldOffset, pt1, pt2, resistanceVal, segf, segments, volt1, volt2, voltDrop, _i;
        segments = 16;
        oldOffset = 0;
        hs = 6;
        volt1 = this.volts[0];
        volt2 = this.volts[1];
        this.setBboxPt(this.point1, this.point2, hs);
        this.draw2Leads(renderContext);
        DrawHelper.getPowerColor(this.getPower);
        segf = 1 / segments;
        for (i = _i = 0; 0 <= segments ? _i < segments : _i > segments; i = 0 <= segments ? ++_i : --_i) {
          newOffset = 0;
          switch (i & 3) {
            case 0:
              newOffset = 1;
              break;
            case 2:
              newOffset = -1;
              break;
            default:
              newOffset = 0;
          }
          voltDrop = volt1 + (volt2 - volt1) * i / segments;
          pt1 = DrawHelper.interpPoint(this.lead1, this.lead2, i * segf, hs * oldOffset);
          pt2 = DrawHelper.interpPoint(this.lead1, this.lead2, (i + 1) * segf, hs * newOffset);
          renderContext.drawThickLinePt(pt1, pt2, DrawHelper.getVoltageColor(voltDrop));
          oldOffset = newOffset;
        }
        resistanceVal = DrawHelper.getUnitText(this.resistance, "ohm");
        this.drawValues(resistanceVal, hs, renderContext);
        this.drawDots(this.point1, this.point2, renderContext);
        return this.drawPosts(renderContext);
      };

      ResistorElm.prototype.dump = function() {
        return ResistorElm.__super__.dump.call(this) + " " + this.resistance;
      };

      ResistorElm.prototype.getDumpType = function() {
        return "r";
      };

      ResistorElm.prototype.getEditInfo = function(n) {
        if (n === 0) {
          return new EditInfo("Resistance (ohms):", this.resistance, 0, 0);
        }
        return null;
      };

      ResistorElm.prototype.setEditValue = function(n, ei) {
        if (ei.value > 0) {
          return this.resistance = ei.value;
        }
      };

      ResistorElm.prototype.getInfo = function(arr) {
        arr[0] = "resistor";
        this.getBasicInfo(arr);
        arr[3] = "R = " + DrawHelper.getUnitText(this.resistance, DrawHelper.ohmString);
        arr[4] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
        return arr;
      };

      ResistorElm.prototype.needsShortcut = function() {
        return true;
      };

      ResistorElm.prototype.calculateCurrent = function() {
        return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
      };

      ResistorElm.prototype.setPoints = function() {
        ResistorElm.__super__.setPoints.call(this);
        this.calcLeads(32);
        this.ps3 = new Point(0, 0);
        return this.ps4 = new Point(0, 0);
      };

      ResistorElm.prototype.stamp = function(stamper) {
        console.log("\nStamping Resistor Elm");
        if (this.orphaned()) {
          console.warn("attempting to stamp an orphaned resistor");
        }
        return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
      };

      ResistorElm.prototype.toString = function() {
        return "ResistorElm";
      };

      return ResistorElm;

    })(CircuitComponent);
    return ResistorElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/GroundElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var GroundElm;
    GroundElm = (function(_super) {
      __extends(GroundElm, _super);

      function GroundElm(xa, ya, xb, yb, f, st) {
        GroundElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      }

      GroundElm.prototype.getDumpType = function() {
        return "g";
      };

      GroundElm.prototype.getPostCount = function() {
        return 1;
      };

      GroundElm.prototype.draw = function(renderContext) {
        var color, endPt, pt1, pt2, row, startPt, _i, _ref;
        color = DrawHelper.getVoltageColor(0);
        renderContext.drawThickLinePt(this.point1, this.point2, color);
        for (row = _i = 0; _i < 3; row = ++_i) {
          startPt = 10 - row * 2;
          endPt = row * 3;
          _ref = DrawHelper.interpPoint2(this.point1, this.point2, 1 + endPt / this.dn, startPt), pt1 = _ref[0], pt2 = _ref[1];
          renderContext.drawThickLinePt(pt1, pt2, color);
        }
        pt2 = DrawHelper.interpPoint(this.point1, this.point2, 1 + 11.0 / this.dn);
        this.setBboxPt(this.point1, pt2, 11);
        this.drawPost(this.x1, this.y1, this.nodes[0], renderContext);
        return this.drawDots(this.point1, this.point2, renderContext);
      };

      GroundElm.prototype.setCurrent = function(x, currentVal) {
        return this.current = -currentVal;
      };

      GroundElm.prototype.stamp = function(stamper) {
        console.log("\nStamping Ground Elm");
        return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, 0);
      };

      GroundElm.prototype.getVoltageDiff = function() {
        return 0;
      };

      GroundElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      GroundElm.prototype.getInfo = function(arr) {
        GroundElm.__super__.getInfo.call(this);
        arr[0] = "ground";
        return arr[1] = "I = " + DrawHelper.getCurrentText(this.getCurrent());
      };

      GroundElm.prototype.hasGroundConnection = function(n1) {
        return true;
      };

      GroundElm.prototype.needsShortcut = function() {
        return true;
      };

      GroundElm.prototype.toString = function() {
        return "GroundElm";
      };

      return GroundElm;

    })(CircuitComponent);
    return GroundElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/VoltageElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var VoltageElm;
    VoltageElm = (function(_super) {
      __extends(VoltageElm, _super);

      VoltageElm.FLAG_COS = 2;

      VoltageElm.WF_DC = 0;

      VoltageElm.WF_AC = 1;

      VoltageElm.WF_SQUARE = 2;

      VoltageElm.WF_TRIANGLE = 3;

      VoltageElm.WF_SAWTOOTH = 4;

      VoltageElm.WF_PULSE = 5;

      VoltageElm.WF_VAR = 6;

      VoltageElm.circleSize = 17;

      function VoltageElm(xa, ya, xb, yb, f, st) {
        VoltageElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.waveform = VoltageElm.WF_DC;
        this.frequency = 40;
        this.maxVoltage = 5;
        this.freqTimeZero = 0;
        this.bias = 0;
        this.phaseShift = 0;
        this.dutyCycle = 0.5;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.waveform = (st[0] ? Math.floor(parseInt(st[0])) : VoltageElm.WF_DC);
          this.frequency = (st[1] ? parseFloat(st[1]) : 40);
          this.maxVoltage = (st[2] ? parseFloat(st[2]) : 5);
          this.bias = (st[3] ? parseFloat(st[3]) : 0);
          this.phaseShift = (st[4] ? parseFloat(st[4]) : 0);
          this.dutyCycle = (st[5] ? parseFloat(st[5]) : 0.5);
        }
        if (this.flags & VoltageElm.FLAG_COS !== 0) {
          this.flags &= ~VoltageElm.FLAG_COS;
          this.phaseShift = Math.PI / 2;
        }
        this.reset();
      }

      VoltageElm.prototype.getDumpType = function() {
        return "v";
      };

      VoltageElm.prototype.dump = function() {
        return "" + (VoltageElm.__super__.dump.call(this)) + " " + this.waveform + " " + this.frequency + " " + this.maxVoltage + " " + this.bias + " " + this.phaseShift + " " + this.dutyCycle;
      };

      VoltageElm.prototype.reset = function() {
        this.freqTimeZero = 0;
        return this.curcount = 5;
      };

      VoltageElm.prototype.triangleFunc = function(x) {
        if (x < Math.PI) {
          return x * (2 / Math.PI) - 1;
        }
        return 1 - (x - Math.PI) * (2 / Math.PI);
      };

      VoltageElm.prototype.stamp = function(stamper) {
        console.log("\nStamping Voltage Elm");
        if (this.waveform === VoltageElm.WF_DC) {
          return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
        } else {
          return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource);
        }
      };

      VoltageElm.prototype.doStep = function(stamper) {
        if (this.waveform !== VoltageElm.WF_DC) {
          return stamper.updateVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, this.getVoltage());
        }
      };

      VoltageElm.prototype.getVoltage = function() {
        var omega;
        omega = 2 * Math.PI * (this.Circuit.time - this.freqTimeZero) * this.frequency + this.phaseShift;
        switch (this.waveform) {
          case VoltageElm.WF_DC:
            return this.maxVoltage + this.bias;
          case VoltageElm.WF_AC:
            return Math.sin(omega) * this.maxVoltage + this.bias;
          case VoltageElm.WF_SQUARE:
            return this.bias + (omega % (2 * Math.PI) > (2 * Math.PI * this.dutyCycle) ? -this.maxVoltage : this.maxVoltage);
          case VoltageElm.WF_TRIANGLE:
            return this.bias + this.triangleFunc(omega % (2 * Math.PI)) * this.maxVoltage;
          case VoltageElm.WF_SAWTOOTH:
            return this.bias + (omega % (2 * Math.PI)) * (this.maxVoltage / Math.PI) - this.maxVoltage;
          case VoltageElm.WF_PULSE:
            if ((omega % (2 * Math.PI)) < 1) {
              return this.maxVoltage + this.bias;
            } else {
              return this.bias;
            }
            break;
          default:
            return 0;
        }
      };

      VoltageElm.prototype.setPoints = function() {
        VoltageElm.__super__.setPoints.call(this);
        if (this.waveform === VoltageElm.WF_DC || this.waveform === VoltageElm.WF_VAR) {
          return this.calcLeads(8);
        } else {
          return this.calcLeads(VoltageElm.circleSize * 2);
        }
      };

      VoltageElm.prototype.draw = function(renderContext) {
        var ps1, ptA, ptB, _ref, _ref1;
        this.setBbox(this.x1, this.y2, this.x2, this.y2);
        this.draw2Leads(renderContext);
        if (!this.isBeingDragged()) {
          if (this.waveform === VoltageElm.WF_DC) {
            this.drawDots(this.point1, this.point2, renderContext);
          } else {
            this.drawDots(this.point1, this.lead1, renderContext);
          }
        }
        if (this.waveform === VoltageElm.WF_DC) {
          _ref = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, 10), ptA = _ref[0], ptB = _ref[1];
          renderContext.drawThickLinePt(this.lead1, ptA, DrawHelper.getVoltageColor(this.volts[0]));
          renderContext.drawThickLinePt(ptA, ptB, DrawHelper.getVoltageColor(this.volts[0]));
          this.setBboxPt(this.point1, this.point2, 16);
          _ref1 = DrawHelper.interpPoint2(this.lead1, this.lead2, 1, 16), ptA = _ref1[0], ptB = _ref1[1];
          renderContext.drawThickLinePt(ptA, ptB, DrawHelper.getVoltageColor(this.volts[1]));
        } else {
          this.setBboxPt(this.point1, this.point2, VoltageElm.circleSize);
          ps1 = DrawHelper.interpPoint(this.lead1, this.lead2, 0.5);
          this.drawWaveform(ps1, renderContext);
        }
        return this.drawPosts(renderContext);
      };

      VoltageElm.prototype.drawWaveform = function(center, renderContext) {
        var color, i, ox, oy, valueString, wl, xc, xc2, xl, yc, yy;
        color = this.needsHighlight() ? Settings.FG_COLOR : void 0;
        xc = center.x;
        yc = center.y;
        renderContext.fillCircle(xc, yc, VoltageElm.circleSize, 2, "#FFFFFF");
        wl = 8;
        this.adjustBbox(xc - VoltageElm.circleSize, yc - VoltageElm.circleSize, xc + VoltageElm.circleSize, yc + VoltageElm.circleSize);
        xc2 = void 0;
        switch (this.waveform) {
          case VoltageElm.WF_DC:
            break;
          case VoltageElm.WF_SQUARE:
            xc2 = Math.floor(wl * 2 * this.dutyCycle - wl + xc);
            xc2 = Math.max(xc - wl + 3, Math.min(xc + wl - 3, xc2));
            renderContext.drawThickLine(xc - wl, yc - wl, xc - wl, yc, color);
            renderContext.drawThickLine(xc - wl, yc - wl, xc2, yc - wl, color);
            renderContext.drawThickLine(xc2, yc - wl, xc2, yc + wl, color);
            renderContext.drawThickLine(xc + wl, yc + wl, xc2, yc + wl, color);
            renderContext.drawThickLine(xc + wl, yc, xc + wl, yc + wl, color);
            break;
          case VoltageElm.WF_PULSE:
            yc += wl / 2;
            renderContext.drawThickLine(xc - wl, yc - wl, xc - wl, yc, color);
            renderContext.drawThickLine(xc - wl, yc - wl, xc - wl / 2, yc - wl, color);
            renderContext.drawThickLine(xc - wl / 2, yc - wl, xc - wl / 2, yc, color);
            renderContext.drawThickLine(xc - wl / 2, yc, xc + wl, yc, color);
            break;
          case VoltageElm.WF_SAWTOOTH:
            renderContext.drawThickLine(xc, yc - wl, xc - wl, yc, color);
            renderContext.drawThickLine(xc, yc - wl, xc, yc + wl, color);
            renderContext.drawThickLine(xc, yc + wl, xc + wl, yc, color);
            break;
          case VoltageElm.WF_TRIANGLE:
            xl = 5;
            renderContext.drawThickLine(xc - xl * 2, yc, xc - xl, yc - wl, color);
            renderContext.drawThickLine(xc - xl, yc - wl, xc, yc, color);
            renderContext.drawThickLine(xc, yc, xc + xl, yc + wl, color);
            renderContext.drawThickLine(xc + xl, yc + wl, xc + xl * 2, yc, color);
            break;
          case VoltageElm.WF_AC:
            xl = 10;
            ox = -1;
            oy = -1;
            i = -xl;
            while (i <= xl) {
              yy = yc + Math.floor(0.95 * Math.sin(i * Math.PI / xl) * wl);
              if (ox !== -1) {
                renderContext.drawThickLine(ox, oy, xc + i, yy, color);
              }
              ox = xc + i;
              oy = yy;
              i++;
            }
        }
        if (Settings.SHOW_VALUES) {
          valueString = DrawHelper.getShortUnitText(this.frequency, "Hz");
          if (this.dx === 0 || this.dy === 0) {
            return this.drawValues(valueString, VoltageElm.circleSize);
          }
        }
      };

      VoltageElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      VoltageElm.prototype.getPower = function() {
        return -this.getVoltageDiff() * this.current;
      };

      VoltageElm.prototype.getVoltageDiff = function() {
        return this.volts[1] - this.volts[0];
      };

      VoltageElm.prototype.getInfo = function(arr) {
        var i;
        switch (this.waveform) {
          case VoltageElm.WF_DC:
          case VoltageElm.WF_VAR:
            arr[0] = "voltage source";
            break;
          case VoltageElm.WF_AC:
            arr[0] = "A/C source";
            break;
          case VoltageElm.WF_SQUARE:
            arr[0] = "square wave gen";
            break;
          case VoltageElm.WF_PULSE:
            arr[0] = "pulse gen";
            break;
          case VoltageElm.WF_SAWTOOTH:
            arr[0] = "sawtooth gen";
            break;
          case VoltageElm.WF_TRIANGLE:
            arr[0] = "triangle gen";
        }
        arr[1] = "I = " + DrawHelper.getCurrentText(this.getCurrent());
        if (this.waveform !== VoltageElm.WF_DC && this.waveform !== VoltageElm.WF_VAR) {
          arr[3] = "f = " + DrawHelper.getUnitText(this.frequency, "Hz");
          arr[4] = "Vmax = " + DrawHelper.getVoltageText(this.maxVoltage);
          i = 5;
          if (this.bias !== 0) {
            arr[i++] = "Voff = " + this.getVoltageText(this.bias);
          } else {
            if (this.frequency > 500) {
              arr[i++] = "wavelength = " + DrawHelper.getUnitText(2.9979e8 / this.frequency, "m");
            }
          }
          return arr[i++] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
        }
      };

      VoltageElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo((this.waveform === VoltageElm.WF_DC ? "Voltage" : "Max Voltage"), this.maxVoltage, -20, 20);
        }
        if (n === 1) {
          ei = new EditInfo("Waveform", this.waveform, -1, -1);
          ei.choice = new Array();
          ei.choice.push("D/C");
          ei.choice.push("A/C");
          ei.choice.push("Square Wave");
          ei.choice.push("Triangle");
          ei.choice.push("Sawtooth");
          ei.choice.push("Pulse");
          ei.choice.push(this.waveform);
          return ei;
          if (this.waveform === VoltageElm.WF_DC) {
            return null;
          }
          if (n === 2) {
            return new EditInfo("Frequency (Hz)", this.frequency, 4, 500);
          }
          if (n === 3) {
            return new EditInfo("DC Offset (V)", this.bias, -20, 20);
          }
          if (n === 4) {
            return new EditInfo("Phase Offset (degrees)", this.phaseShift * 180 / Math.PI, -180, 180).setDimensionless();
          }
          if (n === 5 && this.waveform === VoltageElm.WF_SQUARE) {
            return new EditInfo("Duty Cycle", this.dutyCycle * 100, 0, 100).setDimensionless();
          }
        }
      };

      VoltageElm.prototype.setEditValue = function(n, ei) {
        var adj, maxfreq, oldfreq, waveform, _ref, _ref1;
        if (n === 0) {
          this.maxVoltage = ei.value;
        }
        if (n === 3) {
          this.bias = ei.value;
        }
        if (n === 2) {
          oldfreq = this.frequency;
          this.frequency = ei.value;
          maxfreq = 1 / (8 * simParams);
          if (this.frequency > maxfreq) {
            this.frequency = maxfreq;
          }
          adj = this.frequency - oldfreq;
          this.freqTimeZero = ((_ref = this.Circuit) != null ? _ref.time : void 0) - oldfreq * (((_ref1 = this.Circuit) != null ? _ref1.time : void 0) - this.freqTimeZero) / this.frequency;
        }
        if (n === 1) {
          waveform = this.waveform;
          if (this.waveform === VoltageElm.WF_DC && waveform !== VoltageElm.WF_DC) {
            this.bias = 0;
          } else {
            this.waveform !== VoltageElm.WF_DC && waveform === VoltageElm.WF_DC;
          }
          if ((this.waveform === VoltageElm.WF_SQUARE || waveform === VoltageElm.WF_SQUARE) && this.waveform !== waveform) {
            this.setPoints();
          }
        }
        if (n === 4) {
          this.phaseShift = ei.value * Math.PI / 180;
        }
        if (n === 5) {
          return this.dutyCycle = ei.value * 0.01;
        }
      };

      VoltageElm.prototype.toString = function() {
        return "VoltageElm";
      };

      return VoltageElm;

    })(CircuitComponent);
    return VoltageElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!component/components/core/Diode',[], function() {
    var Diode;
    Diode = (function() {
      Diode.leakage = 1e-14;

      function Diode(circuit) {
        this.nodes = new Array(2);
        this.vt = 0;
        this.vdcoef = 0;
        this.fwdrop = 0;
        this.zvoltage = 0;
        this.zoffset = 0;
        this.lastvoltdiff = 0;
        this.crit = 0;
        this.circuit = circuit;
        this.leakage = 1e-14;
      }

      Diode.prototype.setup = function(fw, zv) {
        var i;
        this.fwdrop = fw;
        this.zvoltage = zv;
        this.vdcoef = Math.log(1 / this.leakage + 1) / this.fwdrop;
        this.vt = 1 / this.vdcoef;
        this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
        if (this.zvoltage !== 0) {
          i = -.005;
          return this.zoffset = this.zvoltage - Math.log(-(1 + i / this.leakage)) / this.vdcoef;
        }
      };

      Diode.prototype.reset = function() {
        return this.lastvoltdiff = 0;
      };

      Diode.prototype.limitStep = function(vnew, vold) {
        var arg, oo, v0;
        arg = void 0;
        oo = vnew;
        if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
          if (vold > 0) {
            arg = 1 + (vnew - vold) / this.vt;
            if (arg > 0) {
              vnew = vold + this.vt * Math.log(arg);
              v0 = Math.log(1e-6 / this.leakage) * this.vt;
              vnew = Math.max(v0, vnew);
            } else {
              vnew = this.vcrit;
            }
          } else {
            vnew = this.vt * Math.log(vnew / this.vt);
          }
          this.circuit.converged = false;
        } else if (vnew < 0 && this.zoffset !== 0) {
          vnew = -vnew - this.zoffset;
          vold = -vold - this.zoffset;
          if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
            if (vold > 0) {
              arg = 1 + (vnew - vold) / this.vt;
              if (arg > 0) {
                vnew = vold + this.vt * Math.log(arg);
                v0 = Math.log(1e-6 / this.leakage) * this.vt;
                vnew = Math.max(v0, vnew);
              } else {
                vnew = this.vcrit;
              }
            } else {
              vnew = this.vt * Math.log(vnew / this.vt);
            }
            this.circuit.converged = false;
          }
          vnew = -(vnew + this.zoffset);
        }
        return vnew;
      };

      Diode.prototype.stamp = function(n0, n1, stamper) {
        this.nodes[0] = n0;
        this.nodes[1] = n1;
        stamper.stampNonLinear(this.nodes[0]);
        return stamper.stampNonLinear(this.nodes[1]);
      };

      Diode.prototype.doStep = function(voltdiff, stamper) {
        var eval_, geq, nc;
        if (Math.abs(voltdiff - this.lastvoltdiff) > .01) {
          this.circuit.converged = false;
        }
        voltdiff = this.limitStep(voltdiff, this.lastvoltdiff);
        this.lastvoltdiff = voltdiff;
        if (voltdiff >= 0 || this.zvoltage === 0) {
          eval_ = Math.exp(voltdiff * this.vdcoef);
          if (voltdiff < 0) {
            eval_ = 1;
          }
          geq = this.vdcoef * this.leakage * eval_;
          nc = (eval_ - 1) * this.leakage - geq * voltdiff;
          stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
          return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
        } else {
          geq = this.leakage * this.vdcoef * (Math.exp(voltdiff * this.vdcoef) + Math.exp((-voltdiff - this.zoffset) * this.vdcoef));
          nc = this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1) + geq * (-voltdiff);
          stamper.stampConductance(this.nodes[0], this.nodes[1], geq);
          return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], nc);
        }
      };

      Diode.prototype.calculateCurrent = function(voltdiff) {
        if (voltdiff >= 0 || this.zvoltage === 0) {
          return this.leakage * (Math.exp(voltdiff * this.vdcoef) - 1);
        }
        return this.leakage * (Math.exp(voltdiff * this.vdcoef) - Math.exp((-voltdiff - this.zoffset) * this.vdcoef) - 1);
      };

      return Diode;

    })();
    return Diode;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/DiodeElm',['cs!component/components/core/Diode', 'cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Diode, Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var DiodeElm;
    DiodeElm = (function(_super) {
      __extends(DiodeElm, _super);

      DiodeElm.FLAG_FWDROP = 1;

      DiodeElm.DEFAULT_DROP = .805904783;

      function DiodeElm(xa, ya, xb, yb, f, st) {
        DiodeElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.hs = 8;
        this.poly;
        this.cathode = [];
        this.diode = new Diode(self);
        this.fwdrop = DiodeElm.DEFAULT_DROP;
        this.zvoltage = 0;
        if ((f & DiodeElm.FLAG_FWDROP) > 0) {
          try {
            this.fwdrop = parseFloat(st);
          } catch (_error) {}
        }
        this.setup();
      }

      DiodeElm.prototype.nonLinear = function() {
        return true;
      };

      DiodeElm.prototype.setup = function() {
        return this.diode.setup(this.fwdrop, this.zvoltage);
      };

      DiodeElm.prototype.getDumpType = function() {
        return "d";
      };

      DiodeElm.prototype.dump = function() {
        this.flags |= DiodeElm.FLAG_FWDROP;
        return CircuitComponent.prototype.dump.call(this) + " " + this.fwdrop;
      };

      DiodeElm.prototype.setPoints = function() {
        var pa, pb, _ref, _ref1;
        DiodeElm.__super__.setPoints.call(this);
        this.calcLeads(16);
        this.cathode = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, this.hs), pa = _ref[0], pb = _ref[1];
        _ref1 = DrawHelper.interpPoint2(this.lead1, this.lead2, 1, this.hs), this.cathode[0] = _ref1[0], this.cathode[1] = _ref1[1];
        return this.poly = DrawHelper.createPolygonFromArray([pa, pb, this.lead2]);
      };

      DiodeElm.prototype.draw = function(renderContext) {
        this.drawDiode(renderContext);
        this.drawDots(this.point1, this.point2, renderContext);
        return this.drawPosts(renderContext);
      };

      DiodeElm.prototype.reset = function() {
        this.diode.reset();
        return this.volts[0] = this.volts[1] = this.curcount = 0;
      };

      DiodeElm.prototype.drawDiode = function(renderContext) {
        var color, v1, v2;
        this.setBboxPt(this.point1, this.point2, this.hs);
        v1 = this.volts[0];
        v2 = this.volts[1];
        this.draw2Leads(renderContext);
        color = DrawHelper.getVoltageColor(v1);
        renderContext.drawThickPolygonP(this.poly, color);
        color = DrawHelper.getVoltageColor(v2);
        return renderContext.drawThickLinePt(this.cathode[0], this.cathode[1], color);
      };

      DiodeElm.prototype.stamp = function(stamper) {
        return this.diode.stamp(this.nodes[0], this.nodes[1], stamper);
      };

      DiodeElm.prototype.doStep = function(stamper) {
        return this.diode.doStep(this.volts[0] - this.volts[1], stamper);
      };

      DiodeElm.prototype.calculateCurrent = function() {
        return this.current = this.diode.calculateCurrent(this.volts[0] - this.volts[1]);
      };

      DiodeElm.prototype.getInfo = function(arr) {
        DiodeElm.__super__.getInfo.call(this);
        arr[0] = "diode";
        arr[1] = "I = " + DrawHelper.getCurrentText(this.getCurrent());
        arr[2] = "Vd = " + DrawHelper.getVoltageText(this.getVoltageDiff());
        arr[3] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
        return arr[4] = "Vf = " + DrawHelper.getVoltageText(this.fwdrop);
      };

      DiodeElm.prototype.getEditInfo = function(n) {
        if (n === 0) {
          return new EditInfo("Fwd Voltage @ 1A", this.fwdrop, 10, 1000);
        }
      };

      DiodeElm.prototype.setEditValue = function(n, ei) {
        this.fwdrop = ei.value;
        return this.setup();
      };

      DiodeElm.prototype.toString = function() {
        return "DiodeElm";
      };

      DiodeElm.prototype.needsShortcut = function() {
        return true;
      };

      return DiodeElm;

    })(CircuitComponent);
    return DiodeElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/OutputElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var OutputElm;
    OutputElm = (function(_super) {
      __extends(OutputElm, _super);

      OutputElm.FLAG_VALUE = 1;

      function OutputElm(xa, ya, xb, yb, f, st) {
        OutputElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      }

      OutputElm.prototype.getDumpType = function() {
        return "O";
      };

      OutputElm.prototype.getPostCount = function() {
        return 1;
      };

      OutputElm.prototype.setPoints = function() {
        OutputElm.__super__.setPoints.call(this);
        return this.lead1 = new Point();
      };

      OutputElm.prototype.draw = function(renderContext) {
        var color, s, selected;
        selected = this.needsHighlight();
        color = (selected ? Settings.SELECT_COLOR : "#FFF");
        s = ((this.flags & OutputElm.FLAG_VALUE) !== 0 ? DrawHelper.getVoltageText(this.volts[0]) : "out");
        this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, 1 - (3 * s.length / 2 + 8) / this.dn);
        this.setBboxPt(this.point1, this.lead1, 0);
        this.drawCenteredText(s, this.x2, this.y2, true, renderContext);
        if (selected) {
          color = DrawHelper.getVoltageColor(this.volts[0]);
        } else {
          color = Settings.SELECT_COLOR;
        }
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        return this.drawPosts(renderContext);
      };

      OutputElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      OutputElm.prototype.getInfo = function(arr) {
        arr[0] = "output";
        return arr[1] = "V = " + DrawHelper.getVoltageText(this.volts[0]);
      };

      OutputElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = "Show Voltage";
          return ei;
        }
        return null;
      };

      OutputElm.prototype.stamp = function(stamper) {};

      OutputElm.prototype.toString = function() {
        return "OutputElm";
      };

      OutputElm.prototype.setEditValue = function(n, ei) {};

      return OutputElm;

    })(CircuitComponent);
    return OutputElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/SwitchElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var SwitchElm;
    SwitchElm = (function(_super) {
      __extends(SwitchElm, _super);

      function SwitchElm(xa, ya, xb, yb, f, st) {
        var str;
        SwitchElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.momentary = false;
        this.position = 0;
        this.posCount = 2;
        this.ps = new Point(0, 0);
        this.ps2 = new Point(0, 0);
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          str = st.shift();
          this.position = 0;
        }
      }

      SwitchElm.prototype.getDumpType = function() {
        return "s";
      };

      SwitchElm.prototype.dump = function() {
        return "" + (SwitchElm.__super__.dump.call(this)) + " " + this.position + " " + this.momentary;
      };

      SwitchElm.prototype.setPoints = function() {
        SwitchElm.__super__.setPoints.call(this);
        this.calcLeads(32);
        this.ps = new Point(0, 0);
        return this.ps2 = new Point(0, 0);
      };

      SwitchElm.prototype.stamp = function(stamper) {
        console.log(this.voltSource);
        if (this.position === 0) {
          return stamper.stampVoltageSource(this.nodes[0], this.nodes[1], this.voltSource, 0);
        }
      };

      SwitchElm.prototype.draw = function(renderContext) {
        var hs1, hs2, openhs;
        openhs = 16;
        hs1 = (this.position === 1 ? 0 : 2);
        hs2 = (this.position === 1 ? openhs : 2);
        this.setBboxPt(this.point1, this.point2, openhs);
        this.draw2Leads(renderContext);
        if (this.position === 0) {
          this.drawDots(renderContext);
        }
        this.ps = DrawHelper.interpPoint(this.lead1, this.lead2, 0, hs1);
        this.ps2 = DrawHelper.interpPoint(this.lead1, this.lead2, 1, hs2);
        renderContext.drawThickLinePt(this.ps, this.ps2, Settings.FG_COLOR);
        return this.drawPosts(renderContext);
      };

      SwitchElm.prototype.calculateCurrent = function() {
        if (this.position === 1) {
          return this.current = 0;
        }
      };

      SwitchElm.prototype.getVoltageSourceCount = function() {
        if (this.position === 1) {
          return 0;
        } else {
          return 1;
        }
      };

      SwitchElm.prototype.mouseUp = function() {
        if (this.momentary) {
          return this.toggle();
        }
      };

      SwitchElm.prototype.toggle = function() {
        this.position++;
        if (this.position >= this.posCount) {
          this.position = 0;
        }
        return this.Circuit.Solver.analyzeFlag = true;
      };

      SwitchElm.prototype.getInfo = function(arr) {
        arr[0] = (this.momentary ? "push switch (SPST)" : "switch (SPST)");
        if (this.position === 1) {
          arr[1] = "open";
          return arr[2] = "Vd = " + DrawHelper.getVoltageDText(this.getVoltageDiff());
        } else {
          arr[1] = "closed";
          arr[2] = "V = " + DrawHelper.getVoltageText(this.volts[0]);
          return arr[3] = "I = " + DrawHelper.getCurrentDText(this.getCurrent());
        }
      };

      SwitchElm.prototype.getConnection = function(n1, n2) {
        return this.position === 0;
      };

      SwitchElm.prototype.isWire = function() {
        return true;
      };

      SwitchElm.prototype.getEditInfo = function(n) {};

      SwitchElm.prototype.setEditValue = function(n, ei) {
        return n === 0;
      };

      SwitchElm.prototype.toString = function() {
        return "SwitchElm";
      };

      return SwitchElm;

    })(CircuitComponent);
    return SwitchElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/CapacitorElm',['cs!component/CircuitComponent', 'cs!render/DrawHelper', 'cs!geom/Point'], function(CircuitComponent, DrawHelper, Point) {
    var CapacitorElm;
    CapacitorElm = (function(_super) {
      __extends(CapacitorElm, _super);

      CapacitorElm.FLAG_BACK_EULER = 2;

      function CapacitorElm(xa, ya, xb, yb, f, st) {
        CapacitorElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.capacitance = 5e-6;
        this.compResistance = 11;
        this.voltDiff = 10;
        this.plate1 = [];
        this.plate2 = [];
        this.curSourceValue = 0;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.capacitance = Number(st[0]);
          this.voltDiff = Number(st[1]);
        }
      }

      CapacitorElm.prototype.isTrapezoidal = function() {
        return (this.flags & CapacitorElm.FLAG_BACK_EULER) === 0;
      };

      CapacitorElm.prototype.nonLinear = function() {
        return false;
      };

      CapacitorElm.prototype.setNodeVoltage = function(n, c) {
        CapacitorElm.__super__.setNodeVoltage.call(this, n, c);
        return this.voltDiff = this.volts[0] - this.volts[1];
      };

      CapacitorElm.prototype.reset = function() {
        this.current = this.curcount = 0;
        return this.voltDiff = 1e-3;
      };

      CapacitorElm.prototype.getDumpType = function() {
        return "c";
      };

      CapacitorElm.prototype.dump = function() {
        return "" + CapacitorElm.__super__.dump.apply(this, arguments) + " " + this.capacitance + " " + this.voltDiff;
      };

      CapacitorElm.prototype.setPoints = function() {
        var f, _ref, _ref1;
        CapacitorElm.__super__.setPoints.call(this);
        f = (this.dn / 2 - 4) / this.dn;
        this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, f);
        this.lead2 = DrawHelper.interpPoint(this.point1, this.point2, 1 - f);
        this.plate1 = [new Point(), new Point()];
        this.plate2 = [new Point(), new Point()];
        _ref = DrawHelper.interpPoint2(this.point1, this.point2, f, 12), this.plate1[0] = _ref[0], this.plate1[1] = _ref[1];
        return _ref1 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - f, 12), this.plate2[0] = _ref1[0], this.plate2[1] = _ref1[1], _ref1;
      };

      CapacitorElm.prototype.draw = function(renderContext) {
        var color, hs;
        hs = 12;
        this.setBboxPt(this.point1, this.point2, hs);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        renderContext.drawThickLinePt(this.plate1[0], this.plate1[1], color);
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.point2, this.lead2, color);
        renderContext.drawThickLinePt(this.plate2[0], this.plate2[1], color);
        this.drawDots(this.point1, this.lead1, renderContext);
        this.drawDots(this.lead2, this.point2, renderContext);
        return this.drawPosts(renderContext);
      };

      CapacitorElm.prototype.drawUnits = function() {
        var s;
        s = DrawHelper.getUnitText(this.capacitance, "F");
        return this.drawValues(s, hs);
      };

      CapacitorElm.prototype.doStep = function(stamper) {
        return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
      };

      CapacitorElm.prototype.stamp = function(stamper) {
        if (this.isTrapezoidal()) {
          this.compResistance = this.timeStep() / (2 * this.capacitance);
        } else {
          this.compResistance = this.timeStep() / this.capacitance;
        }
        stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
        stamper.stampRightSide(this.nodes[0]);
        stamper.stampRightSide(this.nodes[1]);
      };

      CapacitorElm.prototype.startIteration = function() {
        if (this.isTrapezoidal()) {
          this.curSourceValue = -this.voltDiff / this.compResistance - this.current;
        } else {
          this.curSourceValue = -this.voltDiff / this.compResistance;
        }
      };

      CapacitorElm.prototype.calculateCurrent = function() {
        var vdiff;
        vdiff = this.volts[0] - this.volts[1];
        if (this.compResistance > 0) {
          return this.current = vdiff / this.compResistance + this.curSourceValue;
        }
      };

      CapacitorElm.prototype.getInfo = function(arr) {
        var v;
        CapacitorElm.__super__.getInfo.call(this);
        arr[0] = "capacitor";
        this.getBasicInfo(arr);
        arr[3] = "C = " + DrawHelper.getUnitText(this.capacitance, "F");
        arr[4] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
        v = this.getVoltageDiff();
        return arr[4] = "U = " + DrawHelper.getUnitText(.5 * this.capacitance * v * v, "J");
      };

      CapacitorElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Capacitance (F)", this.capacitance, 0, 0);
        }
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = "Trapezoidal Approximation";
          return ei;
        }
        return null;
      };

      CapacitorElm.prototype.setEditValue = function(n, ei) {
        if (n === 0 && ei.value > 0) {
          this.capacitance = ei.value;
        }
        if (n === 1) {
          if (ei.isChecked) {
            return this.flags &= ~CapacitorElm.FLAG_BACK_EULER;
          } else {
            return this.flags |= CapacitorElm.FLAG_BACK_EULER;
          }
        }
      };

      CapacitorElm.prototype.needsShortcut = function() {
        return true;
      };

      CapacitorElm.prototype.toString = function() {
        return "CapacitorElm";
      };

      return CapacitorElm;

    })(CircuitComponent);
    return CapacitorElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/InductorElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var InductorElm;
    InductorElm = (function(_super) {
      __extends(InductorElm, _super);

      InductorElm.FLAG_BACK_EULER = 2;

      function InductorElm(xa, ya, xb, yb, f, st) {
        InductorElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.inductance = 0;
        this.nodes = new Array(2);
        this.flags = 0;
        this.compResistance = 0;
        this.current = 0;
        this.curSourceValue = 0;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.inductance = parseFloat(st[0]);
          this.current = parseFloat(st[1]);
        }
      }

      InductorElm.prototype.stamp = function(stamper) {
        var ts;
        ts = this.getParentCircuit().timeStep();
        console.log(ts);
        console.log(this.inductance);
        if (this.isTrapezoidal()) {
          this.compResistance = 2 * this.inductance / ts;
        } else {
          this.compResistance = this.inductance / ts;
        }
        stamper.stampResistor(this.nodes[0], this.nodes[1], this.compResistance);
        stamper.stampRightSide(this.nodes[0]);
        return stamper.stampRightSide(this.nodes[1]);
      };

      InductorElm.prototype.doStep = function(stamper) {
        return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.curSourceValue);
      };

      InductorElm.prototype.draw = function(renderContext) {
        var hs, unit_text, v1, v2;
        v1 = this.volts[0];
        v2 = this.volts[1];
        hs = 8;
        this.setBboxPt(this.point1, this.point2, hs);
        this.draw2Leads(renderContext);
        DrawHelper.drawCoil(8, this.lead1, this.lead2, v1, v2, renderContext);
        unit_text = DrawHelper.getUnitText(this.inductance, "H");
        this.drawValues(unit_text, hs, renderContext);
        this.drawPosts(renderContext);
        return this.drawDots(this.point1, this.point2, renderContext);
      };

      InductorElm.prototype.dump = function() {
        return "" + (InductorElm.__super__.dump.call(this)) + " " + this.inductance + " " + this.current;
      };

      InductorElm.prototype.getDumpType = function() {
        return "l";
      };

      InductorElm.prototype.startIteration = function() {
        if (this.isTrapezoidal()) {
          return this.curSourceValue = this.getVoltageDiff() / this.compResistance + this.current;
        } else {
          return this.curSourceValue = this.current;
        }
      };

      InductorElm.prototype.nonLinear = function() {
        return false;
      };

      InductorElm.prototype.isTrapezoidal = function() {
        return (this.flags & InductorElm.FLAG_BACK_EULER) === 0;
      };

      InductorElm.prototype.calculateCurrent = function() {
        if (this.compResistance > 0) {
          this.current = this.getVoltageDiff() / this.compResistance + this.curSourceValue;
        }
        return this.current;
      };

      InductorElm.prototype.getInfo = function(arr) {
        arr[0] = "inductor";
        this.getBasicInfo(arr);
        arr[3] = "L = " + DrawHelper.getUnitText(this.inductance, "H");
        return arr[4] = "P = " + DrawHelper.getUnitText(this.getPower(), "W");
      };

      InductorElm.prototype.reset = function() {
        this.current = 0;
        this.volts[0] = 0;
        this.volts[1] = 0;
        return this.curcount = 0;
      };

      InductorElm.prototype.getVoltageDiff = function() {
        return this.volts[0] - this.volts[1];
      };

      InductorElm.prototype.toString = function() {
        return "InductorElm";
      };

      InductorElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Inductance (H)", this.inductance, 0, 0);
        }
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = "Trapezoidal Approximation";
          return ei;
        }
        return null;
      };

      InductorElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.inductance = ei.value;
        }
        if (n === 1) {
          if (ei.checkbox.getState()) {
            return this.flags &= ~Inductor.FLAG_BACK_EULER;
          } else {
            return this.flags |= Inductor.FLAG_BACK_EULER;
          }
        }
      };

      InductorElm.prototype.setPoints = function() {
        InductorElm.__super__.setPoints.call(this);
        return this.calcLeads(32);
      };

      return InductorElm;

    })(CircuitComponent);
    return InductorElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/SparkGapElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var SparkGapElm;
    SparkGapElm = (function(_super) {
      __extends(SparkGapElm, _super);

      function SparkGapElm(xa, ya, xb, yb, f, st) {
        SparkGapElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.resistance = 0;
        this.offresistance = 1e9;
        this.onresistance = 1e3;
        this.breakdown = 1e3;
        this.holdcurrent = 0.001;
        this.state = false;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          if (st) {
            this.onresistance = parseFloat(st != null ? st.shift() : void 0);
          }
          if (st) {
            this.offresistance = parseFloat(st != null ? st.shift() : void 0);
          }
          if (st) {
            this.breakdown = parseFloat(st != null ? st.shift() : void 0);
          }
          if (st) {
            this.holdcurrent = parseFloat(st != null ? st.shift() : void 0);
          }
        }
      }

      SparkGapElm.prototype.nonLinear = function() {
        return true;
      };

      SparkGapElm.prototype.getDumpType = function() {
        return 187;
      };

      SparkGapElm.prototype.dump = function() {
        return "" + (SparkGapElm.__super__.dump.call(this)) + " " + this.onresistance + " " + this.offresistance + " " + this.breakdown + " " + this.holdcurrent;
      };

      SparkGapElm.prototype.setPoints = function() {
        var alen, dist;
        SparkGapElm.__super__.setPoints.call(this);
        dist = 16;
        alen = 8;
        return this.calcLeads(dist + alen);
      };

      SparkGapElm.prototype.calculateCurrent = function() {
        return this.current = (this.volts[0] - this.volts[1]) / this.resistance;
      };

      SparkGapElm.prototype.reset = function() {
        SparkGapElm.__super__.reset.call(this);
        return this.state = false;
      };

      SparkGapElm.prototype.startIteration = function() {
        var vd;
        if (Math.abs(this.current) < this.holdcurrent) {
          this.state = false;
        }
        vd = this.volts[0] - this.volts[1];
        if (Math.abs(vd) > this.breakdown) {
          return this.state = true;
        }
      };

      SparkGapElm.prototype.doStep = function(stamper) {
        if (this.state) {
          console.log("SPARK!");
          this.resistance = this.onresistance;
        } else {
          this.resistance = this.offresistance;
        }
        return stamper.stampResistor(this.nodes[0], this.nodes[1], this.resistance);
      };

      SparkGapElm.prototype.toString = function() {
        return "SparkGapElm";
      };

      SparkGapElm.prototype.stamp = function(stamper) {
        stamper.stampNonLinear(this.nodes[0]);
        return stamper.stampNonLinear(this.nodes[1]);
      };

      SparkGapElm.prototype.getInfo = function(arr) {
        arr[0] = "spark gap";
        this.getBasicInfo(arr);
        arr[3] = (this.state ? "on" : "off");
        arr[4] = "Ron = " + DrawHelper.getUnitText(this.onresistance, Circuit.ohmString);
        arr[5] = "Roff = " + DrawHelper.getUnitText(this.offresistance, Circuit.ohmString);
        return arr[6] = "Vbreakdown = " + DrawHelper.getUnitText(this.breakdown, "V");
      };

      SparkGapElm.prototype.needsShortcut = function() {
        return false;
      };

      return SparkGapElm;

    })(CircuitComponent);
    return SparkGapElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/CurrentElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var CurrentElm;
    CurrentElm = (function(_super) {
      __extends(CurrentElm, _super);

      function CurrentElm(xa, ya, xb, yb, f, st) {
        var e;
        CurrentElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        try {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.currentValue || (this.currentValue = parseFloat(st[0]));
        } catch (_error) {
          e = _error;
          this.currentValue = .01;
        }
      }

      CurrentElm.prototype.dump = function() {
        return CurrentElm.__super__.dump.call(this) + " " + this.currentValue;
      };

      CurrentElm.prototype.getDumpType = function() {
        return "i";
      };

      CurrentElm.prototype.setPoints = function() {
        var p2;
        CurrentElm.__super__.setPoints.call(this);
        this.calcLeads(26);
        this.ashaft1 = DrawHelper.interpPoint(this.lead1, this.lead2, .25);
        this.ashaft2 = DrawHelper.interpPoint(this.lead1, this.lead2, .6);
        this.center = DrawHelper.interpPoint(this.lead1, this.lead2, .5);
        p2 = DrawHelper.interpPoint(this.lead1, this.lead2, .75);
        return this.arrow = DrawHelper.calcArrow(this.center, p2, 4, 4);
      };

      CurrentElm.prototype.draw = function(renderContext) {
        var color, cr;
        cr = 12;
        this.draw2Leads(renderContext);
        color = DrawHelper.getVoltageColor((this.volts[0] + this.volts[1]) / 2);
        renderContext.drawCircle(this.center.x, this.center.y, cr);
        renderContext.drawCircle(this.ashaft1, this.ashaft2);
        renderContext.fillPolygon(this.arrow);
        renderContext.setBboxPt(this.point1, this.point2, cr);
        this.drawPosts(renderContext);
        return this.doDots(renderContext);
      };

      CurrentElm.prototype.stamp = function(stamper) {
        this.current = this.currentValue;
        return stamper.stampCurrentSource(this.nodes[0], this.nodes[1], this.current);
      };

      CurrentElm.prototype.getInfo = function(arr) {
        CurrentElm.__super__.getInfo.call(this);
        arr[0] = "current source";
        return this.getBasicInfo(arr);
      };

      CurrentElm.prototype.getVoltageDiff = function() {
        return this.volts[1] - this.volts[0];
      };

      return CurrentElm;

    })(CircuitComponent);
    return CurrentElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/AntennaElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var AntennaElm;
    AntennaElm = (function(_super) {
      __extends(AntennaElm, _super);

      function AntennaElm(xa, ya, xb, yb, f, st) {
        AntennaElm.__super__.constructor.call(this, this, xa, ya, xb, yb, f);
      }

      return AntennaElm;

    })(CircuitComponent);
    return AntennaElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/RailElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/components/VoltageElm', 'cs!component/components/AntennaElm', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, VoltageElm, AntennaElm, CircuitComponent) {
    var RailElm;
    RailElm = (function(_super) {
      __extends(RailElm, _super);

      RailElm.FLAG_CLOCK = 1;

      function RailElm(xa, ya, xb, yb, f, st) {
        RailElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
      }

      RailElm.prototype.getDumpType = function() {
        return "R";
      };

      RailElm.prototype.getPostCount = function() {
        return 1;
      };

      RailElm.prototype.setPoints = function() {
        RailElm.__super__.setPoints.call(this);
        return this.lead1 = DrawHelper.interpPoint(this.point1, this.point2, 1 - VoltageElm.circleSize / this.dn);
      };

      RailElm.prototype.draw = function(renderContext) {
        var clock, color, s, v;
        this.setBboxPt(this.point1, this.point2, this.circleSize);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        clock = this.waveform === VoltageElm.WF_SQUARE && (this.flags & VoltageElm.FLAG_CLOCK) !== 0;
        if (this.waveform === VoltageElm.WF_DC || this.waveform === VoltageElm.WF_VAR || clock) {
          color = (this.needsHighlight() ? Settings.SELECT_COLOR : "#FFFFFF");
          v = this.getVoltage();
          s = DrawHelper.getShortUnitText(v, "V");
          if (Math.abs(v) < 1) {
            s = v + "V";
          }
          if (this.getVoltage() > 0) {
            s = "+" + s;
          }
          if (this instanceof AntennaElm) {
            s = "Ant";
          }
          if (clock) {
            s = "CLK";
          }
          this.drawCenteredText(s, this.x2, this.y2, true, renderContext);
        } else {
          this.drawWaveform(this.point2, renderContext);
        }
        this.drawPosts(renderContext);
        return this.drawDots(this.point1, this.lead1, renderContext);
      };

      RailElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      RailElm.prototype.stamp = function(stamper) {
        if (this.waveform === VoltageElm.WF_DC) {
          return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
        } else {
          return stamper.stampVoltageSource(0, this.nodes[0], this.voltSource);
        }
      };

      RailElm.prototype.doStep = function(stamper) {
        if (this.waveform !== VoltageElm.WF_DC) {
          return stamper.updateVoltageSource(0, this.nodes[0], this.voltSource, this.getVoltage());
        }
      };

      RailElm.prototype.hasGroundConnection = function(n1) {
        return true;
      };

      return RailElm;

    })(VoltageElm);
    return RailElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/MosfetElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var JFetElm, MosfetElm;
    JFetElm = (function() {
      function JFetElm() {}

      return JFetElm;

    })();
    MosfetElm = (function(_super) {
      __extends(MosfetElm, _super);

      MosfetElm.FLAG_PNP = 1;

      MosfetElm.FLAG_SHOWVT = 2;

      MosfetElm.FLAG_DIGITAL = 4;

      function MosfetElm(xa, ya, xb, yb, f, st) {
        MosfetElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.lastv1 = 0;
        this.lastv2 = 0;
        this.ids = 0;
        this.mode = 0;
        this.gm = 0;
        this.vt = 1.5;
        this.pcircler = 3;
        this.src = [];
        this.drn = [];
        this.gate = [];
        this.pcircle = [];
        this.pnp = ((f & MosfetElm.FLAG_PNP) !== 0 ? -1 : 1);
        this.noDiagonal = true;
        this.vt = this.getDefaultThreshold();
        this.hs = 16;
        if (st && st.length > 0) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.vt || (this.vt = st[0]);
        }
      }

      MosfetElm.prototype.getDefaultThreshold = function() {
        return 1.5;
      };

      MosfetElm.prototype.getBeta = function() {
        return .02;
      };

      MosfetElm.prototype.nonLinear = function() {
        return true;
      };

      MosfetElm.prototype.toString = function() {
        return "MosfetElm";
      };

      MosfetElm.prototype.drawDigital = function() {
        return (this.flags & MosfetElm.FLAG_DIGITAL) !== 0;
      };

      MosfetElm.prototype.reset = function() {
        return this.lastv1 = this.lastv2 = this.volts[0] = this.volts[1] = this.volts[2] = this.curcount = 0;
      };

      MosfetElm.prototype.dump = function() {
        return MosfetElm.__super__.dump.call(this) + " " + this.vt;
      };

      MosfetElm.prototype.getDumpType = function() {
        return "f";
      };

      MosfetElm.prototype.draw = function(renderContext) {
        var color, i, ps1, ps2, s, segf, segments, v, _i;
        this.setBboxPt(this.point1, this.point2, this.hs);
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.src[0], this.src[1], color);
        color = DrawHelper.getVoltageColor(this.volts[2]);
        renderContext.drawThickLinePt(this.drn[0], this.drn[1], color);
        segments = 6;
        segf = 1.0 / segments;
        for (i = _i = 0; 0 <= segments ? _i < segments : _i > segments; i = 0 <= segments ? ++_i : --_i) {
          v = this.volts[1] + (this.volts[2] - this.volts[1]) * i / segments;
          color = DrawHelper.getVoltageColor(v);
          ps1 = DrawHelper.interpPoint(this.src[1], this.drn[1], i * segf);
          ps2 = DrawHelper.interpPoint(this.src[1], this.drn[1], (i + 1) * segf);
          renderContext.drawThickLinePt(ps1, ps2, color);
        }
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.src[1], this.src[2], color);
        color = DrawHelper.getVoltageColor(this.volts[2]);
        renderContext.drawThickLinePt(this.drn[1], this.drn[2], color);
        if (!this.drawDigital()) {
          color = DrawHelper.getVoltageColor((this.pnp === 1 ? this.volts[1] : this.volts[2]));
          renderContext.drawThickPolygonP(this.arrowPoly, color);
        }
        renderContext.drawThickPolygonP(this.arrowPoly);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.gate[1], color);
        renderContext.drawThickLinePt(this.gate[0], this.gate[2], color);
        this.drawDigital() && this.pnp === -1;
        if ((this.flags & MosfetElm.FLAG_SHOWVT) !== 0) {
          s = "" + (this.vt * this.pnp);
        }
        this.drawDots(this.src[0], this.src[1], renderContext);
        this.drawDots(this.src[1], this.drn[1], renderContext);
        this.drawDots(this.drn[1], this.drn[0], renderContext);
        return this.drawPosts(renderContext);
      };

      MosfetElm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.point1;
        } else {
          if (n === 1) {
            return this.src[0];
          } else {
            return this.drn[0];
          }
        }
      };

      MosfetElm.prototype.getCurrent = function() {
        return this.ids;
      };

      MosfetElm.prototype.getPower = function() {
        return this.ids * (this.volts[2] - this.volts[1]);
      };

      MosfetElm.prototype.getPostCount = function() {
        return 3;
      };

      MosfetElm.prototype.setPoints = function() {
        var dist, hs2, _ref, _ref1, _ref2, _ref3;
        MosfetElm.__super__.setPoints.call(this);
        hs2 = this.hs * this.dsign;
        this.src = CircuitComponent.newPointArray(3);
        this.drn = CircuitComponent.newPointArray(3);
        _ref = DrawHelper.interpPoint2(this.point1, this.point2, 1, -hs2), this.src[0] = _ref[0], this.drn[0] = _ref[1];
        _ref1 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 22 / this.dn, -hs2), this.src[1] = _ref1[0], this.drn[1] = _ref1[1];
        _ref2 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 22 / this.dn, -hs2 * 4 / 3), this.src[2] = _ref2[0], this.drn[2] = _ref2[1];
        this.gate = CircuitComponent.newPointArray(3);
        _ref3 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 28 / this.dn, hs2 / 2), this.gate[0] = _ref3[0], this.gate[2] = _ref3[1];
        this.gate[1] = DrawHelper.interpPoint(this.gate[0], this.gate[2], .5);
        console.log("GATE: " + this.gate[1]);
        if (!this.drawDigital()) {
          if (this.pnp === 1) {
            return this.arrowPoly = DrawHelper.calcArrow(this.src[1], this.src[0], 10, 4);
          } else {
            return this.arrowPoly = DrawHelper.calcArrow(this.drn[0], this.drn[1], 12, 5);
          }
        } else if (this.pnp === -1) {
          this.gate[1] = DrawHelper.interpPoint(this.point1, this.point2, 1 - 36 / this.dn);
          dist = (this.dsign < 0 ? 32 : 31);
          this.pcircle = DrawHelper.interpPoint(this.point1, this.point2, 1 - dist / this.dn);
          return this.pcircler = 3;
        }
      };

      MosfetElm.prototype.stamp = function(stamper) {
        stamper.stampNonLinear(this.nodes[1]);
        return stamper.stampNonLinear(this.nodes[2]);
      };

      MosfetElm.prototype.doStep = function(stamper) {
        var Gds, beta, drain_node, gate, realvds, realvgs, rs, source_node, vds, vgs, vs;
        vs = new Array(3);
        vs[0] = this.volts[0];
        vs[1] = this.volts[1];
        vs[2] = this.volts[2];
        if (vs[1] > this.lastv1 + .5) {
          vs[1] = this.lastv1 + .5;
        }
        if (vs[1] < this.lastv1 - .5) {
          vs[1] = this.lastv1 - .5;
        }
        if (vs[2] > this.lastv2 + .5) {
          vs[2] = this.lastv2 + .5;
        }
        if (vs[2] < this.lastv2 - .5) {
          vs[2] = this.lastv2 - .5;
        }
        source_node = 1;
        drain_node = 2;
        if (this.pnp * vs[1] > this.pnp * vs[2]) {
          source_node = 2;
          drain_node = 1;
        }
        gate = 0;
        vgs = vs[gate] - vs[source_node];
        vds = vs[drain_node] - vs[source_node];
        if (Math.abs(this.lastv1 - vs[1]) > .01 || Math.abs(this.lastv2 - vs[2]) > .01) {
          this.getParentCircuit().converged = false;
        }
        this.lastv1 = vs[1];
        this.lastv2 = vs[2];
        realvgs = vgs;
        realvds = vds;
        vgs *= this.pnp;
        vds *= this.pnp;
        this.ids = 0;
        this.gm = 0;
        Gds = 0;
        beta = this.getBeta();
        if (vgs > .5 && this instanceof JFetElm) {
          Circuit.halt("JFET is reverse biased!", this);
          return;
        }
        if (vgs < this.vt) {
          Gds = 1e-8;
          this.ids = vds * Gds;
          this.mode = 0;
        } else if (vds < vgs - this.vt) {
          this.ids = beta * ((vgs - this.vt) * vds - vds * vds * .5);
          this.gm = beta * vds;
          Gds = beta * (vgs - vds - this.vt);
          this.mode = 1;
        } else {
          this.gm = beta * (vgs - this.vt);
          Gds = 1e-8;
          this.ids = .5 * beta * (vgs - this.vt) * (vgs - this.vt) + (vds - (vgs - this.vt)) * Gds;
          this.mode = 2;
        }
        rs = -this.pnp * this.ids + Gds * realvds + this.gm * realvgs;
        stamper.stampMatrix(this.nodes[drain_node], this.nodes[drain_node], Gds);
        stamper.stampMatrix(this.nodes[drain_node], this.nodes[source_node], -Gds - this.gm);
        stamper.stampMatrix(this.nodes[drain_node], this.nodes[gate], this.gm);
        stamper.stampMatrix(this.nodes[source_node], this.nodes[drain_node], -Gds);
        stamper.stampMatrix(this.nodes[source_node], this.nodes[source_node], Gds + this.gm);
        stamper.stampMatrix(this.nodes[source_node], this.nodes[gate], -this.gm);
        stamper.stampRightSide(this.nodes[drain_node], rs);
        stamper.stampRightSide(this.nodes[source_node], -rs);
        if ((source_node === 2 && this.pnp === 1) || (source_node === 1 && this.pnp === -1)) {
          return this.ids = -this.ids;
        }
      };

      MosfetElm.prototype.getFetInfo = function(arr, n) {
        arr[0] = (this.pnp === -1 ? "p-" : "n-") + n;
        arr[0] += " (Vt = " + DrawHelper.getVoltageText(this.pnp * this.vt) + ")";
        arr[1] = (this.pnp === 1 ? "Ids = " : "Isd = ") + DrawHelper.getCurrentText(this.ids);
        arr[2] = "Vgs = " + DrawHelper.getVoltageText(this.volts[0] - this.volts[(this.pnp === -1 ? 2 : 1)]);
        arr[3] = (this.pnp === 1 ? "Vds = " : "Vsd = ") + DrawHelper.getVoltageText(this.volts[2] - this.volts[1]);
        arr[4] = (this.mode === 0 ? "off" : (this.mode === 1 ? "linear" : "saturation"));
        return arr[5] = "gm = " + DrawHelper.getUnitText(this.gm, "A/V");
      };

      MosfetElm.prototype.getInfo = function(arr) {
        return this.getFetInfo(arr, "MOSFET");
      };

      MosfetElm.prototype.canViewInScope = function() {
        return true;
      };

      MosfetElm.prototype.getVoltageDiff = function() {
        return this.volts[2] - this.volts[1];
      };

      MosfetElm.prototype.getConnection = function(n1, n2) {
        return !(n1 === 0 || n2 === 0);
      };

      return MosfetElm;

    })(CircuitComponent);
    return MosfetElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/TransistorElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var TransistorElm;
    TransistorElm = (function(_super) {
      __extends(TransistorElm, _super);

      TransistorElm.FLAG_FLIP = 1;

      function TransistorElm(xa, ya, xb, yb, f, st) {
        var beta, lastvbc, lastvbe, pnp;
        TransistorElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.beta = 100;
        this.rect = [];
        this.coll = [];
        this.emit = [];
        this.base = new Point();
        this.pnp = 0;
        this.gmin = 0;
        this.ie = 0;
        this.ic = 0;
        this.ib = 0;
        this.rectPoly = 0;
        this.arrowPoly = 0;
        this.vt = .025;
        this.vdcoef = 1 / this.vt;
        this.rgain = .5;
        this.lastvbc = 0;
        this.lastvbe = 0;
        this.leakage = 1e-13;
        if (st && st.length > 0) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          pnp = st.shift();
          if (pnp) {
            this.pnp = parseInt(pnp);
          }
          lastvbe = st.shift();
          if (lastvbe) {
            this.lastvbe = parseFloat(lastvbe);
          }
          lastvbc = st.shift();
          if (lastvbc) {
            this.lastvbc = parseFloat(lastvbc);
          }
          beta = st.shift();
          if (beta) {
            this.beta = parseFloat(beta);
          }
        }
        this.volts[0] = 0;
        this.volts[1] = -this.lastvbe;
        this.volts[2] = -this.lastvbc;
        this.setup();
      }

      TransistorElm.prototype.setup = function() {
        this.vcrit = this.vt * Math.log(this.vt / (Math.sqrt(2) * this.leakage));
        this.fgain = this.beta / (this.beta + 1);
        return this.noDiagonal = true;
      };

      TransistorElm.prototype.nonLinear = function() {
        return true;
      };

      TransistorElm.prototype.reset = function() {
        this.volts[0] = this.volts[1] = this.volts[2] = 0;
        return this.lastvbc = this.lastvbe = this.curcount_c = this.curcount_e = this.curcount_b = 0;
      };

      TransistorElm.prototype.getDumpType = function() {
        return "t";
      };

      TransistorElm.prototype.dump = function() {
        return TransistorElm.__super__.dump.call(this) + " " + this.pnp + " " + (this.volts[0] - this.volts[1]) + " " + (this.volts[0] - this.volts[2]) + " " + this.beta;
      };

      TransistorElm.prototype.draw = function(renderContext) {
        var color;
        this.setBboxPt(this.point1, this.point2, 16);
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.coll[0], this.coll[1], color);
        color = DrawHelper.getVoltageColor(this.volts[2]);
        renderContext.drawThickLinePt(this.emit[0], this.emit[1], color);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.base, color);
        this.drawDots(this.base, this.point1, renderContext);
        this.drawDots(this.coll[1], this.coll[0], renderContext);
        this.drawDots(this.emit[1], this.emit[0], renderContext);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickPolygonP(this.rectPoly, color);
        return this.drawPosts(renderContext);
      };

      TransistorElm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.point1;
        } else {
          if (n === 1) {
            return this.coll[0];
          } else {
            return this.emit[0];
          }
        }
      };

      TransistorElm.prototype.getPostCount = function() {
        return 3;
      };

      TransistorElm.prototype.getPower = function() {
        return (this.volts[0] - this.volts[2]) * this.ib + (this.volts[1] - this.volts[2]) * this.ic;
      };

      TransistorElm.prototype.setPoints = function(stamper) {
        var hs, hs2, pt, _ref, _ref1, _ref2, _ref3;
        TransistorElm.__super__.setPoints.call(this);
        hs = 16;
        if ((this.flags & TransistorElm.FLAG_FLIP) !== 0) {
          this.dsign = -this.dsign;
        }
        hs2 = hs * this.dsign * this.pnp;
        this.coll = CircuitComponent.newPointArray(2);
        this.emit = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint2(this.point1, this.point2, 1, hs2), this.coll[0] = _ref[0], this.emit[0] = _ref[1];
        this.rect = CircuitComponent.newPointArray(4);
        _ref1 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 16 / this.dn, hs), this.rect[0] = _ref1[0], this.rect[1] = _ref1[1];
        _ref2 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 13 / this.dn, hs), this.rect[2] = _ref2[0], this.rect[3] = _ref2[1];
        _ref3 = DrawHelper.interpPoint2(this.point1, this.point2, 1 - 13 / this.dn, 6 * this.dsign * this.pnp), this.coll[1] = _ref3[0], this.emit[1] = _ref3[1];
        this.base = new Point();
        this.base = DrawHelper.interpPoint(this.point1, this.point2, 1 - 16 / this.dn);
        this.rectPoly = DrawHelper.createPolygon(this.rect[0], this.rect[2], this.rect[3], this.rect[1]);
        if (this.pnp !== 1) {
          pt = DrawHelper.interpPoint(this.point1, this.point2, 1 - 11 / this.dn, -5 * this.dsign * this.pnp);
          return this.arrowPoly = DrawHelper.calcArrow(this.emit[0], pt, 8, 4);
        }
      };

      TransistorElm.prototype.limitStep = function(vnew, vold) {
        var arg, oo;
        arg = 0;
        oo = vnew;
        if (vnew > this.vcrit && Math.abs(vnew - vold) > (this.vt + this.vt)) {
          if (vold > 0) {
            arg = 1 + (vnew - vold) / this.vt;
            if (arg > 0) {
              vnew = vold + this.vt * Math.log(arg);
            } else {
              vnew = this.vcrit;
            }
          } else {
            vnew = this.vt * Math.log(vnew / this.vt);
          }
          this.getParentCircuit().converged = false;
        }
        return vnew;
      };

      TransistorElm.prototype.stamp = function(stamper) {
        stamper.stampNonLinear(this.nodes[0]);
        stamper.stampNonLinear(this.nodes[1]);
        return stamper.stampNonLinear(this.nodes[2]);
      };

      TransistorElm.prototype.doStep = function(stamper) {
        var expbc, expbe, gcc, gce, gec, gee, pcoef, subIterations, vbc, vbe;
        subIterations = this.getParentCircuit().Solver.subIterations;
        vbc = this.volts[0] - this.volts[1];
        vbe = this.volts[0] - this.volts[2];
        if (Math.abs(vbc - this.lastvbc) > .01 || Math.abs(vbe - this.lastvbe) > .01) {
          this.getParentCircuit.converged = false;
        }
        this.gmin = 0;
        if (subIterations > 100) {
          this.gmin = Math.exp(-9 * Math.log(10) * (1 - subIterations / 3000.0));
          if (this.gmin > .1) {
            this.gmin = .1;
          }
        }
        vbc = this.pnp * this.limitStep(this.pnp * vbc, this.pnp * this.lastvbc);
        vbe = this.pnp * this.limitStep(this.pnp * vbe, this.pnp * this.lastvbe);
        this.lastvbc = vbc;
        this.lastvbe = vbe;
        pcoef = this.vdcoef * this.pnp;
        expbc = Math.exp(vbc * pcoef);
        expbe = Math.exp(vbe * pcoef);
        if (expbe < 1) {
          expbe = 1;
        }
        this.ie = this.pnp * this.leakage * (-(expbe - 1) + this.rgain * (expbc - 1));
        this.ic = this.pnp * this.leakage * (this.fgain * (expbe - 1) - (expbc - 1));
        this.ib = -(this.ie + this.ic);
        gee = -this.leakage * this.vdcoef * expbe;
        gec = this.rgain * this.leakage * this.vdcoef * expbc;
        gce = -gee * this.fgain;
        gcc = -gec * (1 / this.rgain);
        stamper.stampMatrix(this.nodes[0], this.nodes[0], -gee - gec - gce - gcc + this.gmin * 2);
        stamper.stampMatrix(this.nodes[0], this.nodes[1], gec + gcc - this.gmin);
        stamper.stampMatrix(this.nodes[0], this.nodes[2], gee + gce - this.gmin);
        stamper.stampMatrix(this.nodes[1], this.nodes[0], gce + gcc - this.gmin);
        stamper.stampMatrix(this.nodes[1], this.nodes[1], -gcc + this.gmin);
        stamper.stampMatrix(this.nodes[1], this.nodes[2], -gce);
        stamper.stampMatrix(this.nodes[2], this.nodes[0], gee + gec - this.gmin);
        stamper.stampMatrix(this.nodes[2], this.nodes[1], -gec);
        stamper.stampMatrix(this.nodes[2], this.nodes[2], -gee + this.gmin);
        stamper.stampRightSide(this.nodes[0], -this.ib - (gec + gcc) * vbc - (gee + gce) * vbe);
        stamper.stampRightSide(this.nodes[1], -this.ic + gce * vbe + gcc * vbc);
        return stamper.stampRightSide(this.nodes[2], -this.ie + gee * vbe + gec * vbc);
      };

      TransistorElm.prototype.getInfo = function(arr) {
        var vbc, vbe, vce;
        arr[0] = "transistor (" + (this.pnp === -1 ? "PNP)" : "NPN)") + " beta=" + this.beta.toFixed(4);
        arr[0] = "";
        vbc = this.volts[0] - this.volts[1];
        vbe = this.volts[0] - this.volts[2];
        vce = this.volts[1] - this.volts[2];
        if (vbc * this.pnp > .2) {
          arr[1] = (vbe * this.pnp > .2 ? "saturation" : "reverse active");
        } else {
          arr[1] = (vbe * this.pnp > .2 ? "fwd active" : "cutoff");
        }
        arr[2] = "Ic = " + DrawHelper.getCurrentText(this.ic);
        arr[3] = "Ib = " + DrawHelper.getCurrentText(this.ib);
        arr[4] = "Vbe = " + DrawHelper.getVoltageText(vbe);
        arr[5] = "Vbc = " + DrawHelper.getVoltageText(vbc);
        return arr[6] = "Vce = " + DrawHelper.getVoltageText(vce);
      };

      TransistorElm.prototype.getScopeValue = function(x) {
        switch (x) {
          case Oscilloscope.VAL_IB:
            return this.ib;
          case Oscilloscope.VAL_IC:
            return this.ic;
          case Oscilloscope.VAL_IE:
            return this.ie;
          case Oscilloscope.VAL_VBE:
            return this.volts[0] - this.volts[2];
          case Oscilloscope.VAL_VBC:
            return this.volts[0] - this.volts[1];
          case Oscilloscope.VAL_VCE:
            return this.volts[1] - this.volts[2];
        }
        return 0;
      };

      TransistorElm.prototype.getScopeUnits = function(x) {
        switch (x) {
          case Oscilloscope.VAL_IB:
          case Oscilloscope.VAL_IC:
          case Oscilloscope.VAL_IE:
            return "A";
          default:
            return "V";
        }
      };

      TransistorElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Beta/hFE", this.beta, 10, 1000).setDimensionless();
        }
        if (n === 1) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Swap E/C", (this.flags & TransistorElm.FLAG_FLIP) !== 0);
          return ei;
        }
        return null;
      };

      TransistorElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.beta = ei.value;
          this.setup();
        }
        if (n === 1) {
          if (ei.checkbox.getState()) {
            this.flags |= TransistorElm.FLAG_FLIP;
          } else {
            this.flags &= ~TransistorElm.FLAG_FLIP;
          }
          return this.setPoints();
        }
      };

      TransistorElm.prototype.canViewInScope = function() {
        return true;
      };

      return TransistorElm;

    })(CircuitComponent);
    return TransistorElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/VarRailElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent', 'cs!component/components/RailElm'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, RailElm) {
    var VarRailElm;
    VarRailElm = (function(_super) {
      __extends(VarRailElm, _super);

      function VarRailElm(xa, ya, xb, yb, f, st) {
        VarRailElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.frequency = this.maxVoltage;
      }

      VarRailElm.prototype.dump = function() {
        return VarRailElm.__super__.dump.call(this);
      };

      VarRailElm.prototype.getDumpType = function() {
        return 172;
      };

      VarRailElm.prototype.createSlider = function() {};

      VarRailElm.prototype.getVoltageDiff = function() {
        return this.volts[0];
      };

      VarRailElm.prototype.getVoltage = function() {
        return VarRailElm.__super__.getVoltage.call(this);
      };

      VarRailElm.prototype.destroy = function() {};

      VarRailElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          return new EditInfo("Min Voltage", bias, -20, 20);
        }
        if (n === 1) {
          return new EditInfo("Max Voltage", maxVoltage, -20, 20);
        }
        if (n === 2) {
          ei = new EditInfo("Slider Text", 0, -1, -1);
          ei.text = sliderText;
          return ei;
        }
        return null;
      };

      VarRailElm.prototype.setEditValue = function(n, ei) {
        var bias, maxVoltage, sliderText;
        if (n === 0) {
          bias = ei.value;
        }
        if (n === 1) {
          maxVoltage = ei.value;
        }
        if (n === 2) {
          sliderText = ei.textf.getText();
          return label.setText(sliderText);
        }
      };

      return VarRailElm;

    })(RailElm);
    return VarRailElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/OpAmpElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent', 'cs!util/MathUtils'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, MathUtils) {
    var OpAmpElm;
    OpAmpElm = (function(_super) {
      __extends(OpAmpElm, _super);

      OpAmpElm.FLAG_SWAP = 1;

      OpAmpElm.FLAG_SMALL = 2;

      OpAmpElm.FLAG_LOWGAIN = 4;

      function OpAmpElm(xa, ya, xb, yb, f, st) {
        OpAmpElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.opsize = 0;
        this.opwidth = 0;
        this.opaddtext = 0;
        this.maxOut = 15;
        this.minOut = -15;
        this.gain = 1e6;
        this.reset = false;
        this.in1p = [];
        this.in2p = [];
        this.textp = [];
        this.maxOut = 15;
        this.minOut = -15;
        this.gbw = 1e6;
        if (st && st.length > 0) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          try {
            this.maxOut || (this.maxOut = parseFloat(st[0]));
            this.minOut || (this.minOut = parseFloat(st[1]));
            this.gbw || (this.gbw = parseFloat(st[2]));
          } catch (_error) {}
        }
        this.noDiagonal = true;
        this.setSize((f & OpAmpElm.FLAG_SMALL) !== 0 ? 1 : 2);
        this.setGain();
      }

      OpAmpElm.prototype.setGain = function() {
        return this.gain = ((this.flags & OpAmpElm.FLAG_LOWGAIN) !== 0 ? 1000 : 100000);
      };

      OpAmpElm.prototype.dump = function() {
        return "" + (OpAmpElm.__super__.dump.call(this)) + " " + this.maxOut + " " + this.minOut + " " + this.gbw;
      };

      OpAmpElm.prototype.nonLinear = function() {
        return true;
      };

      OpAmpElm.prototype.draw = function(renderContext) {
        var color;
        this.setBboxPt(this.point1, this.point2, this.opheight * 2);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.in1p[0], this.in1p[1], color);
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.in2p[0], this.in2p[1], color);
        renderContext.drawThickPolygonP(this.triangle, (this.needsHighlight() ? Settings.SELECT_COLOR : Settings.FG_COLOR));
        color = DrawHelper.getVoltageColor(this.volts[2]);
        renderContext.drawThickLinePt(this.lead2, this.point2, color);
        this.drawDots(this.point2, this.lead2, renderContext);
        return this.drawPosts(renderContext);
      };

      OpAmpElm.prototype.getPower = function() {
        return this.volts[2] * this.current;
      };

      OpAmpElm.prototype.setSize = function(s) {
        this.opsize = s;
        this.opheight = 8 * s;
        this.opwidth = 13 * s;
        return this.flags = (this.flags & ~OpAmpElm.FLAG_SMALL) | (s === 1 ? OpAmpElm.FLAG_SMALL : 0);
      };

      OpAmpElm.prototype.setPoints = function() {
        var hs, tris, ww, _ref, _ref1, _ref2, _ref3;
        OpAmpElm.__super__.setPoints.call(this);
        this.setSize(2);
        if (ww > this.dn / 2) {
          ww = Math.floor(this.dn / 2);
        } else {
          ww = Math.floor(this.opwidth);
        }
        this.calcLeads(ww * 2);
        hs = Math.floor(this.opheight * this.dsign);
        if ((this.flags & OpAmpElm.FLAG_SWAP) !== 0) {
          hs = -hs;
        }
        this.in1p = CircuitComponent.newPointArray(2);
        this.in2p = CircuitComponent.newPointArray(2);
        this.textp = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint2(this.point1, this.point2, 0, hs), this.in1p[0] = _ref[0], this.in2p[0] = _ref[1];
        _ref1 = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, hs), this.in1p[1] = _ref1[0], this.in2p[1] = _ref1[1];
        _ref2 = DrawHelper.interpPoint2(this.lead1, this.lead2, .2, hs), this.textp[0] = _ref2[0], this.textp[1] = _ref2[1];
        tris = CircuitComponent.newPointArray(2);
        _ref3 = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, hs * 2), tris[0] = _ref3[0], tris[1] = _ref3[1];
        return this.triangle = DrawHelper.createPolygonFromArray([tris[0], tris[1], this.lead2]);
      };

      OpAmpElm.prototype.getPostCount = function() {
        return 3;
      };

      OpAmpElm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.in1p[0];
        } else {
          if (n === 1) {
            return this.in2p[0];
          } else {
            return this.point2;
          }
        }
      };

      OpAmpElm.prototype.getVoltageSourceCount = function() {
        return 1;
      };

      OpAmpElm.prototype.getInfo = function(arr) {
        var vo;
        OpAmpElm.__super__.getInfo.call(this);
        arr[0] = "op-amp";
        arr[1] = "V+ = " + DrawHelper.getVoltageText(this.volts[1]);
        arr[2] = "V- = " + DrawHelper.getVoltageText(this.volts[0]);
        vo = Math.max(Math.min(this.volts[2], this.maxOut), this.minOut);
        arr[3] = "Vout = " + DrawHelper.getVoltageText(vo);
        arr[4] = "Iout = " + DrawHelper.getCurrentText(this.getCurrent());
        return arr[5] = "range = " + DrawHelper.getVoltageText(this.minOut) + " to " + DrawHelper.getVoltageText(this.maxOut);
      };

      OpAmpElm.prototype.stamp = function(stamper) {
        var vn;
        vn = this.Circuit.numNodes() + this.voltSource;
        stamper.stampNonLinear(vn);
        return stamper.stampMatrix(this.nodes[2], vn, 1);
      };

      OpAmpElm.prototype.doStep = function(stamper) {
        var dx, vd, vn, x;
        vd = this.volts[1] - this.volts[0];
        if (Math.abs(this.lastvd - vd) > .1) {
          this.Circuit.converged = false;
        } else if (this.volts[2] > this.maxOut + .1 || this.volts[2] < this.minOut - .1) {
          this.Circuit.converged = false;
        }
        x = 0;
        vn = this.Circuit.numNodes() + this.voltSource;
        dx = 0;
        if (vd >= this.maxOut / this.gain && (this.lastvd >= 0 || MathUtils.getRand(4) === 1)) {
          dx = 1e-4;
          x = this.maxOut - dx * this.maxOut / this.gain;
        } else if (vd <= this.minOut / this.gain && (this.lastvd <= 0 || MathUtils.getRand(4) === 1)) {
          dx = 1e-4;
          x = this.minOut - dx * this.minOut / this.gain;
        } else {
          dx = this.gain;
        }
        stamper.stampMatrix(vn, this.nodes[0], dx);
        stamper.stampMatrix(vn, this.nodes[1], -dx);
        stamper.stampMatrix(vn, this.nodes[2], 1);
        stamper.stampRightSide(vn, x);
        return this.lastvd = vd;
      };

      OpAmpElm.prototype.getConnection = function(n1, n2) {
        return false;
      };

      OpAmpElm.prototype.toString = function() {
        return "OpAmpElm";
      };

      OpAmpElm.prototype.hasGroundConnection = function(n1) {
        return n1 === 2;
      };

      OpAmpElm.prototype.getVoltageDiff = function() {
        return this.volts[2] - this.volts[1];
      };

      OpAmpElm.prototype.getDumpType = function() {
        return "a";
      };

      OpAmpElm.prototype.getEditInfo = function(n) {
        if (n === 0) {
          return new EditInfo("Max Output (V)", this.maxOut, 1, 20);
        }
        if (n === 1) {
          return new EditInfo("Min Output (V)", this.minOut, -20, 0);
        }
        return null;
      };

      OpAmpElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.maxOut = ei.value;
        }
        if (n === 1) {
          return this.minOut = ei.value;
        }
      };

      return OpAmpElm;

    })(CircuitComponent);
    return OpAmpElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/ZenerElm',['cs!component/components/core/Diode', 'cs!component/components/DiodeElm', 'cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Diode, DiodeElm, Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var ZenerElm;
    return ZenerElm = (function(_super) {
      __extends(ZenerElm, _super);

      function ZenerElm(xa, ya, xb, yb, f, st) {
        ZenerElm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.default_z_voltage = 5.6;
        this.zvoltage = st[0] || this.default_z_voltage;
        if ((f & DiodeElm.FLAG_FWDROP) > 0) {
          try {
            this.fwdrop = st[1];
          } catch (_error) {}
        }
        this.setup();
      }

      ZenerElm.prototype.setPoints = function() {
        var pa, _ref, _ref1;
        ZenerElm.__super__.setPoints.call(this);
        this.calcLeads(16);
        pa = CircuitComponent.newPointArray(2);
        this.wing = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint2(this.lead1, this.lead2, 0, this.hs), pa[0] = _ref[0], pa[1] = _ref[1];
        _ref1 = DrawHelper.interpPoint2(this.lead1, this.lead2, 1, this.hs), this.cathode[0] = _ref1[0], this.cathode[1] = _ref1[1];
        this.wing[0] = DrawHelper.interpPoint(this.cathode[0], this.cathode[1], -0.2, -this.hs);
        this.wing[1] = DrawHelper.interpPoint(this.cathode[1], this.cathode[0], -0.2, -this.hs);
        return this.poly = DrawHelper.createPolygonFromArray([pa[0], pa[1], this.lead2]);
      };

      ZenerElm.prototype.draw = function(renderContext) {
        var color, v1, v2;
        this.setBboxPt(this.point1, this.point2, this.hs);
        v1 = this.volts[0];
        v2 = this.volts[1];
        this.draw2Leads(renderContext);
        color = DrawHelper.getVoltageColor(v1);
        renderContext.drawThickPolygonP(this.poly, color);
        renderContext.drawThickLinePt(this.cathode[0], this.cathode[1], v1);
        color = DrawHelper.getVoltageColor(v2);
        renderContext.drawThickLinePt(this.wing[0], this.cathode[0], color);
        renderContext.drawThickLinePt(this.wing[1], this.cathode[1], color);
        this.drawDots(this.point2, this.point1, renderContext);
        return this.drawPosts(renderContext);
      };

      ZenerElm.prototype.nonlinear = function() {
        return true;
      };

      ZenerElm.prototype.setup = function() {
        this.diode.leakage = 5e-6;
        return ZenerElm.__super__.setup.call(this);
      };

      ZenerElm.prototype.getDumpType = function() {
        return "z";
      };

      ZenerElm.prototype.dump = function() {
        return ZenerElm.__super__.dump.call(this) + " " + this.zvoltage;
      };

      ZenerElm.prototype.getInfo = function(arr) {
        ZenerElm.__super__.getInfo.call(this, arr);
        arr[0] = "Zener diode";
        return arr[5] = "Vz = " + DrawHelper.getVoltageText(zvoltage);
      };

      ZenerElm.prototype.getEditInfo = function() {};

      ZenerElm.prototype.setEditInfo = function() {};

      return ZenerElm;

    })(DiodeElm);
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/Switch2Elm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent', 'cs!component/components/SwitchElm'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent, SwitchElm) {

    /*
    Todo: Click functionality does not work
     */
    var Switch2Elm;
    Switch2Elm = (function(_super) {
      __extends(Switch2Elm, _super);

      Switch2Elm.FLAG_CENTER_OFF = 1;

      function Switch2Elm(xa, ya, xb, yb, f, st) {
        Switch2Elm.__super__.constructor.call(this, xa, ya, xb, yb, f, st);
        this.openhs = 16;
        this.noDiagonal = true;
        if (st) {
          this.link = parseInt(st[st.length - 1]);
        }
      }

      Switch2Elm.prototype.getDumpType = function() {
        return "S";
      };

      Switch2Elm.prototype.dump = function() {
        return Switch2Elm.__super__.dump.call(this) + this.link;
      };

      Switch2Elm.prototype.setPoints = function() {
        var _ref, _ref1, _ref2;
        Switch2Elm.__super__.setPoints.call(this);
        this.calcLeads(32);
        this.swpoles = CircuitComponent.newPointArray(3);
        this.swposts = CircuitComponent.newPointArray(2);
        _ref = DrawHelper.interpPoint2(this.lead1, this.lead2, 1, this.openhs), this.swpoles[0] = _ref[0], this.swpoles[1] = _ref[1];
        this.swpoles[2] = this.lead2;
        _ref1 = DrawHelper.interpPoint2(this.point1, this.point2, 1, this.openhs), this.swposts[0] = _ref1[0], this.swposts[1] = _ref1[1];
        return this.posCount = (_ref2 = this.hasCenterOff()) != null ? _ref2 : {
          3: 2
        };
      };

      Switch2Elm.prototype.draw = function(renderContext) {
        var color;
        this.setBbox(this.point1, this.point2, this.openhs);
        color = DrawHelper.getVoltageColor(this.volts[0]);
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        color = DrawHelper.getVoltageColor(this.volts[1]);
        renderContext.drawThickLinePt(this.swpoles[0], this.swposts[0], color);
        color = DrawHelper.getVoltageColor(this.volts[2]);
        renderContext.drawThickLinePt(this.swpoles[1], this.swposts[1], color);
        if (!this.needsHighlight()) {
          color = Settings.SELECT_COLOR;
        }
        renderContext.drawThickLinePt(this.lead1, this.swpoles[this.position], color);
        this.drawDots(this.point1, this.lead1, renderContext);
        if (this.position !== 2) {
          this.drawDots(this.swpoles[this.position], this.swposts[this.position], renderContext);
        }
        return this.drawPosts(renderContext);
      };

      Switch2Elm.prototype.getPost = function(n) {
        if (n === 0) {
          return this.point1;
        } else {
          return this.swposts[n - 1];
        }
      };

      Switch2Elm.prototype.getPostCount = function() {
        return 3;
      };

      Switch2Elm.prototype.calculateCurrent = function() {
        if (this.position === 2) {
          return this.current = 0;
        }
      };

      Switch2Elm.prototype.stamp = function(stamper) {
        if (this.position === 2) {
          return;
        }
        return stamper.stampVoltageSource(this.nodes[0], this.nodes[this.position + 1], this.voltSource, 0);
      };

      Switch2Elm.prototype.getVoltageSourceCount = function() {
        if (this.position === 2) {
          return 0;
        } else {
          return 1;
        }
      };

      Switch2Elm.prototype.toggle = function() {
        var i;
        Switch2Elm.__super__.toggle.call(this);
        if (this.link !== 0) {
          i = 0;
          return getParentCircuit().eachComponent(function(component) {
            var s2;
            if (component instanceof Switch2Elm) {
              s2 = component;
              if (s2.link === this.link) {
                return s2.position = this.position;
              }
            }
          });
        }
      };

      Switch2Elm.prototype.getConnection = function(n1, n2) {
        if (this.position === 2) {
          return false;
        }
        return this.comparePair(n1, n2, 0, 1 + this.position);
      };

      Switch2Elm.prototype.getInfo = function(arr) {
        arr[0] = (this.link === 0 ? "switch (SPDT)" : "switch (DPDT)");
        return arr[1] = "I = " + this.getCurrentDText(this.getCurrent());
      };

      Switch2Elm.prototype.hasCenterOff = function() {
        return (this.flags & Switch2Elm.FLAG_CENTER_OFF) !== 0;
      };

      return Switch2Elm;

    })(SwitchElm);
    return Switch2Elm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/TextElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var TextElm;
    TextElm = (function(_super) {
      __extends(TextElm, _super);

      TextElm.FLAG_CENTER = 1;

      TextElm.FLAG_BAR = 2;

      function TextElm() {
        var st;
        TextElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
        this.text = "hello";
        this.lines = new Array();
        this.lines.add(text);
        this.size = 24;
        if (st) {
          if (typeof st === "string") {
            st = st.split(" ");
          }
          this.size = Math.floor(st.shift());
          this.text = st.shift();
          while (st.length !== 0) {
            this.text += " " + st.shift();
          }
        }
      }

      TextElm.prototype.split = function() {
        return this.lines = this.text.split("\n");
      };

      TextElm.prototype.dump = function() {
        return TextElm.__super__.dump.call(this) + " " + this.size + " " + this.text;
      };

      TextElm.prototype.getDumpType = function() {
        return "x";
      };

      TextElm.prototype.drag = function(xx, yy) {
        this.x1 = xx;
        this.y = yy;
        this.x2 = xx + 16;
        return this.y2 = yy;
      };

      TextElm.prototype.draw = function(renderContext) {
        var color, i, line, _i, _len, _ref;
        color = (this.needsHighlight() ? Settings.SELECT_COLOR : Settings.TEXT_COLOR);
        this.setBbox(this.x1, this.y, this.x1, this.y);
        i = 0;
        _ref = this.lines;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          line = _ref[_i];
          renderContext.fillText(line, 40, 15 * i + 100);
          i++;
        }
        this.x2 = this.boundingBox.x1 + this.boundingBox.width;
        return this.y2 = this.boundingBox.y + this.boundingBox.height;
      };

      TextElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          ei = new EditInfo("Text", 0, -1, -1);
          ei.text = text;
          return ei;
        }
        if (n === 1) {
          return new EditInfo("Size", size, 5, 100);
        }
        if (n === 2) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Center", (this.flags & TextElm.FLAG_CENTER) !== 0);
          return ei;
        }
        if (n === 3) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Draw Bar On Top", (this.flags & TextElm.FLAG_BAR) !== 0);
          return ei;
        }
        return null;
      };

      TextElm.prototype.setEditValue = function(n, ei) {
        if (n === 0) {
          this.text = ei.textf.getText();
          this.split();
        }
        if (n === 1) {
          this.size = Math.floor(ei.value);
        }
        if (n === 3) {
          if (ei.checkbox.getState()) {
            this.flags |= TextElm.FLAG_BAR;
          } else {
            this.flags &= ~TextElm.FLAG_BAR;
          }
        }
        if (n === 2) {
          if (ei.checkbox.getState()) {
            return this.flags |= TextElm.FLAG_CENTER;
          } else {
            return this.flags &= ~TextElm.FLAG_CENTER;
          }
        }
      };

      TextElm.prototype.isCenteredText = function() {
        return (this.flags & TextElm.FLAG_CENTER) !== 0;
      };

      TextElm.prototype.getInfo = function(arr) {
        return arr[0] = this.text;
      };

      TextElm.prototype.getPostCount = function() {
        return 0;
      };

      return TextElm;

    })(CircuitComponent);
    return TextElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!component/components/ProbeElm',['cs!settings/Settings', 'cs!render/DrawHelper', 'cs!geom/Polygon', 'cs!geom/Rectangle', 'cs!geom/Point', 'cs!component/CircuitComponent'], function(Settings, DrawHelper, Polygon, Rectangle, Point, CircuitComponent) {
    var ProbeElm;
    ProbeElm = (function(_super) {
      __extends(ProbeElm, _super);

      ProbeElm.FLAG_SHOWVOLTAGE = 1;

      function ProbeElm(xa, ya, xb, yb, f, st) {
        ProbeElm.__super__.constructor.call(this, xa, ya, xb, yb, f);
      }

      ProbeElm.prototype.getDumpType = function() {
        return "p";
      };

      ProbeElm.prototype.toString = function() {
        return "ProbeElm";
      };

      ProbeElm.prototype.setPoints = function() {
        var x;
        ProbeElm.__super__.setPoints.call(this);
        if (this.point2.y < this.point1.y) {
          x = this.point1;
          this.point1 = this.point2;
          this.point2 = this.x1;
        }
        return this.center = DrawHelper.interpPoint(this.point1, this.point2, .5);
      };

      ProbeElm.prototype.draw = function(renderContext) {
        var color, hs, len, unit_text;
        hs = 8;
        this.setBboxPt(this.point1, this.point2, hs);
        len = this.dn - 32;
        this.calcLeads(Math.floor(len));
        if (this.isSelected()) {
          color = Settings.SELECT_COLOR;
        } else {
          color = DrawHelper.getVoltageColor(this.volts[0]);
        }
        renderContext.drawThickLinePt(this.point1, this.lead1, color);
        if (this.isSelected()) {
          color = Settings.SELECT_COLOR;
        } else {
          color = DrawHelper.getVoltageColor(this.volts[1]);
        }
        renderContext.drawThickLinePt(this.lead2, this.point2, color);
        if (this.mustShowVoltage()) {
          unit_text = DrawHelper.getShortUnitText(this.volts[0], "V");
          this.drawValues(unit_text, 4, renderContext);
        }
        return this.drawPosts(renderContext);
      };

      ProbeElm.prototype.mustShowVoltage = function() {
        return (this.flags & ProbeElm.FLAG_SHOWVOLTAGE) !== 0;
      };

      ProbeElm.prototype.getInfo = function(arr) {
        arr[0] = "scope probe";
        return arr[1] = "Vd = " + DrawHelper.getVoltageText(this.getVoltageDiff());
      };

      ProbeElm.prototype.stamp = function(stamper) {};

      ProbeElm.prototype.getConnection = function(n1, n2) {
        return false;
      };

      ProbeElm.prototype.getEditInfo = function(n) {
        var ei;
        if (n === 0) {
          ei = new EditInfo("", 0, -1, -1);
          ei.checkbox = new Checkbox("Show Voltage", this.mustShowVoltage());
          return ei;
        }
        return null;
      };

      ProbeElm.prototype.setEditValue = function(n, ei) {
        var flags;
        if (n === 0) {
          if (ei.checkbox.getState()) {
            return flags = ProbeElm.FLAG_SHOWVOLTAGE;
          } else {
            return flags &= ~ProbeElm.FLAG_SHOWVOLTAGE;
          }
        }
      };

      return ProbeElm;

    })(CircuitComponent);
    return ProbeElm;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!component/ComponentRegistry',['cs!component/components/WireElm', 'cs!component/components/ResistorElm', 'cs!component/components/GroundElm', 'cs!component/components/VoltageElm', 'cs!component/components/DiodeElm', 'cs!component/components/OutputElm', 'cs!component/components/SwitchElm', 'cs!component/components/CapacitorElm', 'cs!component/components/InductorElm', 'cs!component/components/SparkGapElm', 'cs!component/components/CurrentElm', 'cs!component/components/RailElm', 'cs!component/components/MosfetElm', 'cs!component/components/TransistorElm', 'cs!component/components/VarRailElm', 'cs!component/components/OpAmpElm', 'cs!component/components/ZenerElm', 'cs!component/components/Switch2Elm', 'cs!component/components/TextElm', 'cs!component/components/ProbeElm'], function(WireElm, ResistorElm, GroundElm, VoltageElm, DiodeElm, OutputElm, SwitchElm, CapacitorElm, InductorElm, SparkGapElm, CurrentElm, RailElm, MosfetElm, TransistorElm, VarRailElm, OpAmpElm, ZenerElm, Switch2Elm, TextElm, ProbeElm) {
    var ComponentRegistry;
    ComponentRegistry = (function() {
      function ComponentRegistry() {}

      ComponentRegistry.ComponentDefs = {
        'w': WireElm,
        'r': ResistorElm,
        'g': GroundElm,
        'l': InductorElm,
        'c': CapacitorElm,
        'v': VoltageElm,
        'd': DiodeElm,
        's': SwitchElm,
        '187': SparkGapElm,
        'a': OpAmpElm,
        'f': MosfetElm,
        'R': RailElm,
        '172': VarRailElm,
        'z': ZenerElm,
        'i': CurrentElm,
        't': TransistorElm,
        'S': Switch2Elm,
        'x': TextElm,
        'o': ProbeElm,
        'O': OutputElm
      };

      ComponentRegistry.registerAll = function() {
        var Component, _i, _len, _ref, _results;
        _ref = this.ComponentDefs;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          Component = _ref[_i];
          if (process.env.NODE_ENV === 'development') {
            console.log("Registering Element: " + Component.prototype + " ");
          }
          _results.push(this.register(Component));
        }
        return _results;
      };

      ComponentRegistry.register = function(componentConstructor) {
        var dumpClass, dumpType, e, newComponent;
        if (componentConstructor == null) {
          console.error("nil constructor");
        }
        try {
          newComponent = new componentConstructor(0, 0, 0, 0, 0, null);
          dumpType = newComponent.getDumpType();
          dumpClass = componentConstructor;
          if (newComponent == null) {
            console.error("Component is nil!");
          }
          if (this.dumpTypes[dumpType] === dumpClass) {
            console.log("" + componentConstructor + " is a dump class");
            return;
          }
          if (this.dumpTypes[dumpType] != null) {
            console.log("Dump type conflict: " + dumpType + " " + this.dumpTypes[dumpType]);
            return;
          }
          return this.dumpTypes[dumpType] = componentConstructor;
        } catch (_error) {
          e = _error;
          return Logger.warn("Element: " + componentConstructor.prototype + " Not yet implemented: [" + e.message + "]");
        }
      };

      return ComponentRegistry;

    })();
    return ComponentRegistry;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!core/SimulationParams',[], function() {

    /*
      Stores Circuit-specific settings.
      Usually loaded from the params object of a .json file
     */
    var SimulationParams;
    SimulationParams = (function() {
      function SimulationParams(paramsObj) {
        this.completionStatus = (paramsObj != null ? paramsObj['completion_status'] : void 0) || "in development";
        this.createdAt = paramsObj != null ? paramsObj['created_at'] : void 0;
        this.currentSpeed = (paramsObj != null ? paramsObj['current_speed'] : void 0) || 63;
        this.updatedAt = paramsObj != null ? paramsObj['updated_at'] : void 0;
        this.description = (paramsObj != null ? paramsObj['description'] : void 0) || "";
        this.flags = (paramsObj != null ? paramsObj['flags'] : void 0) || 1;
        this.id = (paramsObj != null ? paramsObj['id'] : void 0) || null;
        this.name = (paramsObj != null ? paramsObj['name_unique'] : void 0) || "default";
        this.powerRange = (paramsObj != null ? paramsObj['power_range'] : void 0) || 62.0;
        this.voltageRange = (paramsObj != null ? paramsObj['voltage_range'] : void 0) || 10.0;
        this.simSpeed = this.convertSimSpeed((paramsObj != null ? paramsObj['sim_speed'] : void 0) || 10.0);
        this.timeStep = (paramsObj != null ? paramsObj['time_step'] : void 0) || 5.0e-06;
        this.title = (paramsObj != null ? paramsObj['title'] : void 0) || "Default";
        this.topic = (paramsObj != null ? paramsObj['topic'] : void 0) || null;
        if (this.timeStep == null) {
          throw new Error("Circuit params is missing its time step (was null)!");
        }
      }

      SimulationParams.prototype.toString = function() {
        return ["", "" + this.title, "================================================================", "\tName:        " + this.name, "\tTopic:       " + this.topic, "\tStatus:      " + this.completionStatus, "\tCreated at:  " + this.createdAt, "\tUpdated At:  " + this.updatedAt, "\tDescription: " + this.description, "\tId:          " + this.id, "\tTitle:       " + this.title, "----------------------------------------------------------------", "\tFlags:       " + this.flags, "\tTimeStep:    " + this.timeStep, "\tSim Speed:   " + this.simSpeed, "\tCur Speed:   " + this.currentSpeed, "\tVolt. Range: " + this.voltageRange, "\tPwr Range:   " + this.powerRange, ""].join("\n");
      };

      SimulationParams.prototype.convertSimSpeed = function(speed) {
        return Math.floor(Math.log(10 * speed) * 24.0 + 61.5);
      };

      SimulationParams.prototype.setCurrentMult = function(mult) {
        return this.currentMult = mult;
      };

      SimulationParams.prototype.getCurrentMult = function() {
        return this.currentMult;
      };

      return SimulationParams;

    })();
    return SimulationParams;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!scope/Oscilloscope',[], function() {
    var Oscilloscope;
    Oscilloscope = (function() {
      function Oscilloscope(timeStep) {
        var chartDiv, i, xbuffer_size, _i;
        this.timeStep = timeStep != null ? timeStep : 1;
        this.timeBase = 0;
        this.frames = 0;
        this.seriesData = [[], [], [], [], [], [], [], [], []];
        xbuffer_size = 150;
        chartDiv = document.getElementById("chart");
        for (i = _i = 0; 0 <= xbuffer_size ? _i <= xbuffer_size : _i >= xbuffer_size; i = 0 <= xbuffer_size ? ++_i : --_i) {
          this.addData(0);
        }
        setInterval((function(_this) {
          return function() {
            _this.step();
            return graph.update();
          };
        })(this), 40);
      }

      Oscilloscope.prototype.step = function() {
        this.frames += 1;
        this.removeData(1);
        return this.addData(0.5 * Math.sin(this.frames / 10) + 0.5);
      };

      Oscilloscope.prototype.addData = function(value) {
        var index, item, _i, _len, _ref, _results;
        index = this.seriesData[0].length;
        _ref = this.seriesData;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _results.push(item.push({
            x: index * this.timeStep + this.timeBase,
            y: value
          }));
        }
        return _results;
      };

      Oscilloscope.prototype.removeData = function(data) {
        var item, _i, _len, _ref;
        _ref = this.seriesData;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          item.shift();
        }
        return this.timeBase += this.timeStep;
      };

      return Oscilloscope;

    })();
    return Oscilloscope;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!io/Logger',[], function() {
    var Logger;
    Logger = (function() {
      var errorStack, warningStack;

      function Logger() {}

      errorStack = new Array();

      warningStack = new Array();

      Logger.error = function(msg) {
        console.error("Error: " + msg);
        return errorStack.push(msg);
      };

      Logger.warn = function(msg) {
        console.error("Warning: " + msg);
        return warningStack.push(msg);
      };

      return Logger;

    })();
    return Logger;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!engine/RowInfo',[], function() {
    var RowInfo;
    RowInfo = (function() {
      RowInfo.ROW_NORMAL = 0;

      RowInfo.ROW_CONST = 1;

      RowInfo.ROW_EQUAL = 2;

      function RowInfo() {
        this.type = RowInfo.ROW_NORMAL;
        this.nodeEq = 0;
        this.mapCol = 0;
        this.mapRow = 0;
        this.value = 0;
        this.rsChanges = false;
        this.lsChanges = false;
        this.dropRow = false;
      }

      RowInfo.prototype.toString = function() {
        return "RowInfo: type: " + this.type + ", nodeEq: " + this.nodeEq + ", mapCol: " + this.mapCol + ", mapRow: " + this.mapRow + ", value: " + this.value + ", rsChanges: " + this.rsChanges + ", lsChanges: " + this.lsChanges + ", dropRow: " + this.dropRow;
      };

      return RowInfo;

    })();
    return RowInfo;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!engine/MatrixStamper',['cs!util/MathUtils', 'cs!engine/RowInfo'], function(MathUtils, RowInfo) {
    var MatrixStamper;
    MatrixStamper = (function() {
      function MatrixStamper(Circuit) {
        this.Circuit = Circuit;
      }


      /*
      control voltage source vs with voltage from n1 to n2 (must also call stampVoltageSource())
       */

      MatrixStamper.prototype.stampVCVS = function(n1, n2, coef, vs) {
        var vn;
        if (isNaN(vs) || isNaN(coef)) {
          console.log("NaN in stampVCVS");
        }
        vn = this.Circuit.numNodes() + vs;
        this.stampMatrix(vn, n1, coef);
        return this.stampMatrix(vn, n2, -coef);
      };

      MatrixStamper.prototype.stampVoltageSource = function(n1, n2, vs, v) {
        var vn;
        vn = this.Circuit.numNodes() + vs;
        console.log("Stamp voltage source " + " " + n1 + " " + n2 + " " + vs + " " + v);
        this.stampMatrix(vn, n1, -1);
        this.stampMatrix(vn, n2, 1);
        this.stampRightSide(vn, v);
        this.stampMatrix(n1, vn, 1);
        return this.stampMatrix(n2, vn, -1);
      };

      MatrixStamper.prototype.updateVoltageSource = function(n1, n2, vs, voltage) {
        var vn;
        vn = this.Circuit.numNodes() + vs;
        return this.stampRightSide(vn, voltage);
      };

      MatrixStamper.prototype.stampResistor = function(n1, n2, r) {
        var a, r0;
        console.log("Stamp resistor: " + n1 + " " + n2 + " " + r);
        r0 = 1 / r;
        if (isNaN(r0) || MathUtils.isInfinite(r0)) {
          this.Circuit.halt("bad resistance");
          a = 0;
          a /= a;
        }
        this.stampMatrix(n1, n1, r0);
        this.stampMatrix(n2, n2, r0);
        this.stampMatrix(n1, n2, -r0);
        return this.stampMatrix(n2, n1, -r0);
      };

      MatrixStamper.prototype.stampConductance = function(n1, n2, r0) {
        if (isNaN(r0) || MathUtils.isInfinite(r0)) {
          this.Circuit.halt("bad conductance");
        }
        this.stampMatrix(n1, n1, r0);
        this.stampMatrix(n2, n2, r0);
        this.stampMatrix(n1, n2, -r0);
        return this.stampMatrix(n2, n1, -r0);
      };


      /*
      current from cn1 to cn2 is equal to voltage from vn1 to 2, divided by g
       */

      MatrixStamper.prototype.stampVCCurrentSource = function(cn1, cn2, vn1, vn2, value) {
        if (isNaN(gain) || MathUtils.isInfinite(gain)) {
          this.Circuit.halt("Invalid gain on voltage controlled current source");
        }
        this.stampMatrix(cn1, vn1, value);
        this.stampMatrix(cn2, vn2, value);
        this.stampMatrix(cn1, vn2, -value);
        return this.stampMatrix(cn2, vn1, -value);
      };

      MatrixStamper.prototype.stampCurrentSource = function(n1, n2, value) {
        this.stampRightSide(n1, -value);
        return this.stampRightSide(n2, value);
      };


      /*
      stamp a current source from n1 to n2 depending on current through vs
       */

      MatrixStamper.prototype.stampCCCS = function(n1, n2, vs, gain) {
        var vn;
        if (isNaN(gain) || MathUtils.isInfinite(gain)) {
          this.Circuit.halt("Invalid gain on current source");
        }
        vn = this.Circuit.numNodes() + vs;
        this.stampMatrix(n1, vn, gain);
        return this.stampMatrix(n2, vn, -gain);
      };


      /*
      stamp value x in row i, column j, meaning that a voltage change
      of dv in node j will increase the current into node i by x dv.
      (Unless i or j is a voltage source node.)
       */

      MatrixStamper.prototype.stampMatrix = function(row, col, value) {
        var rowInfo;
        if (isNaN(value) || MathUtils.isInfinite(value)) {
          this.Circuit.halt("attempted to stamp Matrix with invalid value");
        }
        if (row > 0 && col > 0) {
          if (this.Circuit.Solver.circuitNeedsMap) {
            row = this.Circuit.Solver.circuitRowInfo[row - 1].mapRow;
            rowInfo = this.Circuit.Solver.circuitRowInfo[col - 1];
            if (rowInfo.type === RowInfo.ROW_CONST) {
              this.Circuit.Solver.circuitRightSide[row] -= value * rowInfo.value;
              return;
            }
            col = rowInfo.mapCol;
          } else {
            row--;
            col--;
          }
          return this.Circuit.Solver.circuitMatrix[row][col] += value;
        }
      };


      /*
      Stamp value x on the right side of row i, representing an
      independent current source flowing into node i
       */

      MatrixStamper.prototype.stampRightSide = function(row, value) {
        if (isNaN(value) || value === null) {
          if (row > 0) {
            console.log("rschanges true " + (row - 1));
            return this.Circuit.Solver.circuitRowInfo[row - 1].rsChanges = true;
          }
        } else {
          if (row > 0) {
            if (this.Circuit.Solver.circuitNeedsMap) {
              row = this.Circuit.Solver.circuitRowInfo[row - 1].mapRow;
            } else {
              row--;
            }
            return this.Circuit.Solver.circuitRightSide[row] += value;
          }
        }
      };


      /*
      Indicate that the values on the left side of row i change in doStep()
       */

      MatrixStamper.prototype.stampNonLinear = function(row) {
        if (isNaN(row) || (row === null)) {
          console.error("null/NaN in stampNonlinear");
        }
        if (row > 0) {
          return this.Circuit.Solver.circuitRowInfo[row - 1].lsChanges = true;
        }
      };

      return MatrixStamper;

    })();
    return MatrixStamper;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!engine/graphTraversal/Pathfinder',['cs!component/components/VoltageElm', 'cs!component/components/CurrentElm', 'cs!component/components/ResistorElm', 'cs!component/components/InductorElm', 'cs!component/components/CapacitorElm'], function(VoltageElm, CurrentElm, ResistorElm, InductorElm, CapacitorElm) {
    var Pathfinder;
    Pathfinder = (function() {
      Pathfinder.INDUCT = 1;

      Pathfinder.VOLTAGE = 2;

      Pathfinder.SHORT = 3;

      Pathfinder.CAP_V = 4;

      function Pathfinder(type, firstElm, dest, elementList, numNodes) {
        this.type = type;
        this.firstElm = firstElm;
        this.dest = dest;
        this.elementList = elementList;
        this.used = new Array(numNodes);
      }

      Pathfinder.prototype.findPath = function(n1, depth) {
        var c, ce, j, k, _i, _j, _k, _l, _len, _ref, _ref1, _ref2, _ref3;
        if (n1 === this.dest) {
          console.log("n1 is @dest");
          return true;
        }
        if (depth-- === 0) {
          return false;
        }
        if (this.used[n1]) {
          console.log("used " + n1);
          return false;
        }
        this.used[n1] = true;
        _ref = this.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ce = _ref[_i];
          if (ce === this.firstElm) {
            console.log("ce is @firstElm");
            continue;
          }
          if ((ce instanceof CurrentElm) && (this.type === Pathfinder.INDUCT)) {
            continue;
          }
          if (this.type === Pathfinder.VOLTAGE) {
            if (!(ce.isWire() || ce instanceof VoltageElm)) {
              console.log("type == VOLTAGE");
              continue;
            }
          }
          if (this.type === Pathfinder.SHORT && !ce.isWire()) {
            console.log("(type == SHORT && !ce.isWire())");
            continue;
          }
          if (this.type === Pathfinder.CAP_V) {
            if (!(ce.isWire() || ce instanceof CapacitorElm || ce instanceof VoltageElm)) {
              console.log("if !(ce.isWire() or ce instanceof CapacitorElm or ce instanceof VoltageElm)");
              continue;
            }
          }
          if (n1 === 0) {
            for (j = _j = 0, _ref1 = ce.getPostCount(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j) {
              if (ce.hasGroundConnection(j) && this.findPath(ce.getNode(j), depth)) {
                console.log(ce + " has ground (n1 is 0)");
                this.used[n1] = false;
                return true;
              }
            }
          }
          for (j = _k = 0, _ref2 = ce.getPostCount(); 0 <= _ref2 ? _k < _ref2 : _k > _ref2; j = 0 <= _ref2 ? ++_k : --_k) {
            console.log("get post " + ce.dump() + " " + ce.getNode(j));
            if (ce.getNode(j) === n1) {
              break;
            }
          }
          if (j === ce.getPostCount()) {
            continue;
          }
          if (ce.hasGroundConnection(j) && this.findPath(0, depth)) {
            console.log(ce + " has ground");
            this.used[n1] = false;
            return true;
          }
          if (this.type === Pathfinder.INDUCT && ce instanceof InductorElm) {
            c = ce.getCurrent();
            if (j === 0) {
              c = -c;
            }
            console.log(ce + " > " + this.firstElm + " >> matching " + ce + " to " + this.firstElm.getCurrent());
            if (Math.abs(c - this.firstElm.getCurrent()) > 1e-10) {
              continue;
            }
          }
          for (k = _l = 0, _ref3 = ce.getPostCount(); 0 <= _ref3 ? _l < _ref3 : _l > _ref3; k = 0 <= _ref3 ? ++_l : --_l) {
            if (j === k) {
              continue;
            }
            console.log(ce + " " + ce.getNode(j) + " - " + ce.getNode(k));
            if (ce.getConnection(j, k) && this.findPath(ce.getNode(k), depth)) {
              this.used[n1] = false;
              console.log("got findpath " + n1);
              return true;
            }
          }
        }
        this.used[n1] = false;
        return false;
      };

      return Pathfinder;

    })();
    return Pathfinder;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!engine/graphTraversal/CircuitNode',[], function() {
    var CircuitNode;
    CircuitNode = (function() {
      function CircuitNode(x, y, intern, links) {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
        this.intern = intern != null ? intern : false;
        this.links = links != null ? links : [];
      }

      CircuitNode.prototype.toString = function() {
        return "CircuitNode: " + this.x + " " + this.y + " " + this.intern + " [" + (this.links.toString()) + "]";
      };

      return CircuitNode;

    })();
    return CircuitNode;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!engine/graphTraversal/CircuitNodeLink',[], function() {
    var CircuitNodeLink;
    CircuitNodeLink = (function() {
      function CircuitNodeLink(num, elm) {
        this.num = num != null ? num : 0;
        this.elm = elm != null ? elm : null;
      }

      CircuitNodeLink.prototype.toString = function() {
        return "" + this.num + " " + (this.elm.toString());
      };

      return CircuitNodeLink;

    })();
    return CircuitNodeLink;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!engine/CircuitSolver',['cs!engine/MatrixStamper', 'cs!component/components/GroundElm', 'cs!component/components/RailElm', 'cs!component/components/VoltageElm', 'cs!component/components/WireElm', 'cs!engine/graphTraversal/Pathfinder', 'cs!engine/graphTraversal/CircuitNode', 'cs!engine/graphTraversal/CircuitNodeLink', 'cs!engine/RowInfo', 'cs!settings/Settings', 'cs!util/ArrayUtils', 'cs!component/components/CapacitorElm', 'cs!component/components/InductorElm', 'cs!component/components/CurrentElm'], function(MatrixStamper, GroundElm, RailElm, VoltageElm, WireElm, Pathfinder, CircuitNode, CircuitNodeLink, RowInfo, Settings, ArrayUtils, CapacitorElm, InductorElm, CurrentElm) {
    var CircuitSolver;
    CircuitSolver = (function() {
      function CircuitSolver(Circuit) {
        this.Circuit = Circuit;
        this.scaleFactors = ArrayUtils.zeroArray(400);
        this.reset();
        this.Stamper = new MatrixStamper(this.Circuit);
      }

      CircuitSolver.prototype.reset = function() {
        this.Circuit.time = 0;
        this.Circuit.frames = 0;
        this.converged = true;
        this.subIterations = 5000;
        this.circuitMatrix = [];
        this.circuitRightSide = [];
        this.origMatrix = [];
        this.origRightSide = [];
        this.circuitRowInfo = [];
        this.circuitPermute = [];
        this.circuitNonLinear = false;
        this.lastTime = 0;
        this.secTime = 0;
        this.lastFrameTime = 0;
        this.lastIterTime = 0;
        return this.analyzeFlag = true;
      };

      CircuitSolver.prototype._updateTimings = function(lastIterationTime) {
        var currentSpeed, inc, sysTime;
        this.lastIterTime = lastIterationTime;
        sysTime = (new Date()).getTime();
        if (this.lastTime !== 0) {
          inc = Math.floor(sysTime - this.lastTime);
          currentSpeed = Math.exp(this.Circuit.currentSpeed() / 3.5 - 14.2);
          this.Circuit.Params.setCurrentMult(1.7 * inc * currentSpeed);
        }
        if ((sysTime - this.secTime) >= 1000) {
          console.log("Reset!");
          this.frames = 0;
          this.steps = 0;
          this.secTime = sysTime;
        }
        this.lastTime = sysTime;
        return this.lastFrameTime = this.lastTime;
      };

      CircuitSolver.prototype.getStamper = function() {
        return this.Stamper;
      };

      CircuitSolver.prototype.getIterCount = function() {
        var sim_speed;
        sim_speed = 150;
        return 0.1 * Math.exp((sim_speed - 61.0) / 24.0);
      };

      CircuitSolver.prototype.reconstruct = function() {
        var ce, changed, circuitElement, circuitElm, circuitNodeLink, circuitRowInfo, closure, cn, cnl, elt, fpi, gotGround, gotRail, i, ii, internalNodeCount, internalVSCount, j, k, kn, newMatDim, newMatx, newRS, newSize, pathfinder, postCount, postPt, pt, q, qm, qp, qq, qv, re, rowInfo, rowNodeEq, rsadd, tempclosure, volt, voltageSourceCount, vs, _aa, _ab, _ac, _ad, _ae, _i, _j, _k, _l, _len, _len1, _len2, _m, _n, _o, _p, _q, _r, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _results, _s, _t, _u, _v, _w, _x, _y, _z;
        if (!this.analyzeFlag || (this.Circuit.numElements() === 0)) {
          return;
        }
        this.Circuit.clearErrors();
        this.Circuit.resetNodes();
        voltageSourceCount = 0;
        gotGround = false;
        gotRail = false;
        volt = null;
        _ref = this.Circuit.getElements();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ce = _ref[_i];
          if (ce instanceof GroundElm) {
            console.log("Found ground");
            gotGround = true;
            break;
          }
          if (ce instanceof RailElm) {
            console.log("Got rail");
            gotRail = true;
          }
          if ((volt == null) && ce instanceof VoltageElm) {
            console.log("Ve");
            volt = ce;
          }
        }
        if (!gotGround && (volt != null) && !gotRail) {
          cn = new CircuitNode();
          pt = volt.getPost(0);
          console.log("GOT GROUND cn=" + cn + ", pt=" + pt);
          cn.x = pt.x;
          cn.y = pt.y;
          this.Circuit.addCircuitNode(cn);
        } else {
          cn = new CircuitNode();
          cn.x = cn.y = -1;
          this.Circuit.addCircuitNode(cn);
        }
        for (i = _j = 0, _ref1 = this.Circuit.numElements(); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
          circuitElm = this.Circuit.getElmByIdx(i);
          internalNodeCount = circuitElm.getInternalNodeCount();
          internalVSCount = circuitElm.getVoltageSourceCount();
          postCount = circuitElm.getPostCount();
          for (j = _k = 0; 0 <= postCount ? _k < postCount : _k > postCount; j = 0 <= postCount ? ++_k : --_k) {
            postPt = circuitElm.getPost(j);
            console.log("D: " + circuitElm.dump());
            k = 0;
            while (k < this.Circuit.numNodes()) {
              cn = this.Circuit.getNode(k);
              console.log("j=" + j + "  k=" + k + "  pt=" + postPt + "  " + cn);
              if (postPt.x === cn.x && postPt.y === cn.y) {
                console.log("" + i + " Break!");
                break;
              }
              k++;
            }
            console.log(("NUM NODES: " + i + " ") + this.Circuit.numNodes());
            if (k === this.Circuit.numNodes()) {
              cn = new CircuitNode();
              cn.x = postPt.x;
              cn.y = postPt.y;
              circuitNodeLink = new CircuitNodeLink();
              circuitNodeLink.num = j;
              circuitNodeLink.elm = circuitElm;
              cn.links.push(circuitNodeLink);
              circuitElm.setNode(j, this.Circuit.numNodes());
              this.Circuit.addCircuitNode(cn);
            } else {
              cnl = new CircuitNodeLink();
              cnl.num = j;
              cnl.elm = circuitElm;
              this.Circuit.getNode(k).links.push(cnl);
              circuitElm.setNode(j, k);
              if (k === 0) {
                circuitElm.setNodeVoltage(j, 0);
              }
            }
          }
          for (j = _l = 0; 0 <= internalNodeCount ? _l < internalNodeCount : _l > internalNodeCount; j = 0 <= internalNodeCount ? ++_l : --_l) {
            cn = new CircuitNode(null, null, true);
            cnl = new CircuitNodeLink();
            cnl.num = j + postCount;
            cnl.elm = circuitElm;
            cn.links.push(cnl);
            circuitElm.setNode(cnl.num, this.Circuit.numNodes());
            this.Circuit.addCircuitNode(cn);
          }
          voltageSourceCount += internalVSCount;
        }
        this.Circuit.voltageSources = new Array(voltageSourceCount);
        voltageSourceCount = 0;
        this.circuitNonLinear = false;
        _ref2 = this.Circuit.getElements();
        for (_m = 0, _len1 = _ref2.length; _m < _len1; _m++) {
          circuitElement = _ref2[_m];
          if (circuitElement.nonLinear()) {
            this.circuitNonLinear = true;
          }
          internalVSCount = circuitElement.getVoltageSourceCount();
          for (j = _n = 0; 0 <= internalVSCount ? _n < internalVSCount : _n > internalVSCount; j = 0 <= internalVSCount ? ++_n : --_n) {
            this.Circuit.voltageSources[voltageSourceCount] = circuitElement;
            circuitElement.setVoltageSource(j, voltageSourceCount++);
          }
        }
        this.Circuit.voltageSourceCount = voltageSourceCount;
        this.matrixSize = this.Circuit.numNodes() - 1 + voltageSourceCount;
        this.circuitMatrixSize = this.circuitMatrixFullSize = this.matrixSize;
        this.circuitMatrix = ArrayUtils.zeroArray2(this.matrixSize, this.matrixSize);
        this.origMatrix = ArrayUtils.zeroArray2(this.matrixSize, this.matrixSize);
        this.circuitRightSide = ArrayUtils.zeroArray(this.matrixSize);
        this.origRightSide = ArrayUtils.zeroArray(this.matrixSize);
        this.circuitRowInfo = ArrayUtils.zeroArray(this.matrixSize);
        this.circuitPermute = ArrayUtils.zeroArray(this.matrixSize);
        vs = 0;
        for (i = _o = 0, _ref3 = this.matrixSize; 0 <= _ref3 ? _o < _ref3 : _o > _ref3; i = 0 <= _ref3 ? ++_o : --_o) {
          this.circuitRowInfo[i] = new RowInfo();
        }
        this.circuitNeedsMap = false;
        _ref4 = this.Circuit.getElements();
        for (_p = 0, _len2 = _ref4.length; _p < _len2; _p++) {
          circuitElm = _ref4[_p];
          circuitElm.stamp(this.Stamper);
        }
        closure = new Array(this.Circuit.numNodes());
        tempclosure = new Array(this.Circuit.numNodes());
        closure[0] = true;
        changed = true;
        while (changed) {
          changed = false;
          for (i = _q = 0, _ref5 = this.Circuit.numElements(); 0 <= _ref5 ? _q < _ref5 : _q > _ref5; i = 0 <= _ref5 ? ++_q : --_q) {
            circuitElm = this.Circuit.getElmByIdx(i);
            for (j = _r = 0, _ref6 = circuitElm.getPostCount(); 0 <= _ref6 ? _r < _ref6 : _r > _ref6; j = 0 <= _ref6 ? ++_r : --_r) {
              if (!closure[circuitElm.getNode(j)]) {
                if (circuitElm.hasGroundConnection(j)) {
                  changed = true;
                  closure[circuitElm.getNode(j)] = true;
                }
                continue;
              }
              for (k = _s = 0, _ref7 = circuitElm.getPostCount(); 0 <= _ref7 ? _s < _ref7 : _s > _ref7; k = 0 <= _ref7 ? ++_s : --_s) {
                if (j === k) {
                  continue;
                }
                kn = circuitElm.getNode(k);
                if (circuitElm.getConnection(j, k) && !closure[kn]) {
                  closure[kn] = true;
                  changed = true;
                }
              }
            }
          }
          if (changed) {
            continue;
          }
          for (i = _t = 0, _ref8 = this.Circuit.numNodes(); 0 <= _ref8 ? _t < _ref8 : _t > _ref8; i = 0 <= _ref8 ? ++_t : --_t) {
            if (!closure[i] && !this.Circuit.nodeList[i].intern) {
              console.warn("Node " + i + " unconnected!");
              this.Stamper.stampResistor(0, i, 1e8);
              closure[i] = true;
              changed = true;
              break;
            }
          }
        }
        for (i = _u = 0, _ref9 = this.Circuit.numElements(); 0 <= _ref9 ? _u < _ref9 : _u > _ref9; i = 0 <= _ref9 ? ++_u : --_u) {
          ce = this.Circuit.getElmByIdx(i);
          if (ce instanceof InductorElm) {
            fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
            if (!fpi.findPath(ce.getNode(0), 5) && !fpi.findPath(ce.getNode(0))) {
              ce.reset();
            }
          }
          if (ce instanceof CurrentElm) {
            fpi = new Pathfinder(Pathfinder.INDUCT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
            if (!fpi.findPath(ce.getNode(0))) {
              this.Circuit.halt("No path for current source!", ce);
              return;
            }
          }
          if ((ce instanceof VoltageElm && ce.getPostCount() === 2) || ce instanceof WireElm) {
            console.log("Examining Loop: " + (ce.dump()));
            pathfinder = new Pathfinder(Pathfinder.VOLTAGE, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
            if (pathfinder.findPath(ce.getNode(0))) {
              this.Circuit.halt("Voltage source/wire loop with no resistance!", ce);
            }
          }
          if (ce instanceof CapacitorElm) {
            fpi = new Pathfinder(Pathfinder.SHORT, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
            if (fpi.findPath(ce.getNode(0))) {
              ce.reset();
            } else {
              fpi = new Pathfinder(Pathfinder.CAP_V, ce, ce.getNode(1), this.Circuit.getElements(), this.Circuit.numNodes());
              if (fpi.findPath(ce.getNode(0))) {
                this.Circuit.halt("Capacitor loop with no resistance!", ce);
                return;
              }
            }
          }
        }
        for (i = _v = 0, _ref10 = this.matrixSize; 0 <= _ref10 ? _v < _ref10 : _v > _ref10; i = 0 <= _ref10 ? ++_v : --_v) {
          qm = -1;
          qp = -1;
          qv = 0;
          re = this.circuitRowInfo[i];
          if (re.lsChanges || re.dropRow || re.rsChanges) {
            continue;
          }
          rsadd = 0;
          for (j = _w = 0, _ref11 = this.matrixSize; 0 <= _ref11 ? _w < _ref11 : _w > _ref11; j = 0 <= _ref11 ? ++_w : --_w) {
            q = this.circuitMatrix[i][j];
            if (this.circuitRowInfo[j].type === RowInfo.ROW_CONST) {
              rsadd -= this.circuitRowInfo[j].value * q;
              continue;
            }
            if (q === 0) {
              continue;
            }
            if (qp === -1) {
              qp = j;
              qv = q;
              continue;
            }
            if (qm === -1 && (q === -qv)) {
              qm = j;
              continue;
            }
            break;
          }
          if (j === this.matrixSize) {
            if (qp === -1) {
              this.Circuit.halt("Matrix error qp (rsadd = " + rsadd + ")", null);
              return;
            }
            elt = this.circuitRowInfo[qp];
            if (qm === -1) {
              k = 0;
              while (elt.type === RowInfo.ROW_EQUAL && k < 100) {
                qp = elt.nodeEq;
                elt = this.circuitRowInfo[qp];
                ++k;
              }
              if (elt.type === RowInfo.ROW_EQUAL) {
                elt.type = RowInfo.ROW_NORMAL;
                continue;
              }
              if (elt.type !== RowInfo.ROW_NORMAL) {
                continue;
              }
              elt.type = RowInfo.ROW_CONST;
              elt.value = (this.circuitRightSide[i] + rsadd) / qv;
              this.circuitRowInfo[i].dropRow = true;
              console.error("iter = 0 # start over from scratch");
              i = -1;
            } else if ((this.circuitRightSide[i] + rsadd) === 0) {
              if (elt.type !== RowInfo.ROW_NORMAL) {
                qq = qm;
                qm = qp;
                qp = qq;
                elt = this.circuitRowInfo[qp];
                if (elt.type !== RowInfo.ROW_NORMAL) {
                  console.error("Swap failed!");
                  continue;
                }
              }
              elt.type = RowInfo.ROW_EQUAL;
              elt.nodeEq = qm;
              this.circuitRowInfo[i].dropRow = true;
            }
          }
        }
        newMatDim = 0;
        for (i = _x = 0, _ref12 = this.matrixSize; 0 <= _ref12 ? _x < _ref12 : _x > _ref12; i = 0 <= _ref12 ? ++_x : --_x) {
          rowInfo = this.circuitRowInfo[i];
          if (rowInfo.type === RowInfo.ROW_NORMAL) {
            rowInfo.mapCol = newMatDim++;
            continue;
          }
          if (rowInfo.type === RowInfo.ROW_EQUAL) {
            while (j !== (function() {
                _results = [];
                for (_y = 0; _y < 100; _y++){ _results.push(_y); }
                return _results;
              }).apply(this)) {
              rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];
              if (rowNodeEq.type !== RowInfo.ROW_EQUAL) {
                break;
              }
              if (i === rowNodeEq.nodeEq) {
                break;
              }
              rowInfo.nodeEq = rowNodeEq.nodeEq;
            }
          }
          if (rowInfo.type === RowInfo.ROW_CONST) {
            rowInfo.mapCol = -1;
          }
        }
        for (i = _z = 0, _ref13 = this.matrixSize; 0 <= _ref13 ? _z < _ref13 : _z > _ref13; i = 0 <= _ref13 ? ++_z : --_z) {
          rowInfo = this.circuitRowInfo[i];
          if (rowInfo.type === RowInfo.ROW_EQUAL) {
            rowNodeEq = this.circuitRowInfo[rowInfo.nodeEq];
            if (rowNodeEq.type === RowInfo.ROW_CONST) {
              rowInfo.type = rowNodeEq.type;
              rowInfo.value = rowNodeEq.value;
              rowInfo.mapCol = -1;
            } else {
              rowInfo.mapCol = rowNodeEq.mapCol;
            }
          }
        }
        newSize = newMatDim;
        newMatx = ArrayUtils.zeroArray2(newSize, newSize);
        newRS = new Array(newSize);
        ArrayUtils.zeroArray(newRS);
        ii = 0;
        for (i = _aa = 0, _ref14 = this.matrixSize; 0 <= _ref14 ? _aa < _ref14 : _aa > _ref14; i = 0 <= _ref14 ? ++_aa : --_aa) {
          circuitRowInfo = this.circuitRowInfo[i];
          if (circuitRowInfo.dropRow) {
            circuitRowInfo.mapRow = -1;
            continue;
          }
          newRS[ii] = this.circuitRightSide[i];
          circuitRowInfo.mapRow = ii;
          for (j = _ab = 0, _ref15 = this.matrixSize; 0 <= _ref15 ? _ab < _ref15 : _ab > _ref15; j = 0 <= _ref15 ? ++_ab : --_ab) {
            rowInfo = this.circuitRowInfo[j];
            if (rowInfo.type === RowInfo.ROW_CONST) {
              newRS[ii] -= rowInfo.value * this.circuitMatrix[i][j];
            } else {
              newMatx[ii][rowInfo.mapCol] += this.circuitMatrix[i][j];
            }
          }
          ii++;
        }
        this.circuitMatrix = newMatx;
        this.circuitRightSide = newRS;
        this.matrixSize = this.circuitMatrixSize = newSize;
        for (i = _ac = 0, _ref16 = this.matrixSize; 0 <= _ref16 ? _ac < _ref16 : _ac > _ref16; i = 0 <= _ref16 ? ++_ac : --_ac) {
          this.origRightSide[i] = this.circuitRightSide[i];
        }
        for (i = _ad = 0, _ref17 = this.matrixSize; 0 <= _ref17 ? _ad < _ref17 : _ad > _ref17; i = 0 <= _ref17 ? ++_ad : --_ad) {
          for (j = _ae = 0, _ref18 = this.matrixSize; 0 <= _ref18 ? _ae < _ref18 : _ae > _ref18; j = 0 <= _ref18 ? ++_ae : --_ae) {
            this.origMatrix[i][j] = this.circuitMatrix[i][j];
          }
        }
        this.circuitNeedsMap = true;
        this.analyzeFlag = false;
        if (!this.circuitNonLinear) {
          if (!this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute)) {
            this.Circuit.halt("Singular matrix in linear circuit!", null);
          }
        }
      };

      CircuitSolver.prototype.solveCircuit = function() {
        var circuitElm, circuitNode, cn1, debugPrint, i, iter, j, ji, lit, res, rowInfo, stepRate, subiter, subiterCount, tm, _i, _j, _k, _l, _len, _len1, _len2, _m, _n, _o, _p, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
        this.sysTime = (new Date()).getTime();
        if ((this.circuitMatrix == null) || this.Circuit.numElements() === 0) {
          this.circuitMatrix = null;
          return;
        }
        debugPrint = this.dumpMatrix;
        this.dumpMatrix = false;
        stepRate = Math.floor(160 * this.getIterCount());
        tm = (new Date()).getTime();
        lit = this.lastIterTime;
        if (1000 >= stepRate * (tm - this.lastIterTime)) {
          return;
        }
        iter = 1;
        while (true) {
          _ref = this.Circuit.getElements();
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            circuitElm = _ref[_i];
            circuitElm.startIteration();
          }
          ++this.steps;
          subiterCount = 5000;
          for (subiter = _j = 0; 0 <= subiterCount ? _j < subiterCount : _j > subiterCount; subiter = 0 <= subiterCount ? ++_j : --_j) {
            this.converged = true;
            this.subIterations = subiter;
            for (i = _k = 0, _ref1 = this.circuitMatrixSize; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
              this.circuitRightSide[i] = this.origRightSide[i];
            }
            if (this.circuitNonLinear) {
              for (i = _l = 0, _ref2 = this.circuitMatrixSize; 0 <= _ref2 ? _l < _ref2 : _l > _ref2; i = 0 <= _ref2 ? ++_l : --_l) {
                for (j = _m = 0, _ref3 = this.circuitMatrixSize; 0 <= _ref3 ? _m < _ref3 : _m > _ref3; j = 0 <= _ref3 ? ++_m : --_m) {
                  this.circuitMatrix[i][j] = this.origMatrix[i][j];
                }
              }
            }
            _ref4 = this.Circuit.getElements();
            for (_n = 0, _len1 = _ref4.length; _n < _len1; _n++) {
              circuitElm = _ref4[_n];
              circuitElm.doStep(this.Stamper);
            }
            if (this.stopMessage != null) {
              return;
            }
            debugPrint = false;
            if (this.circuitNonLinear) {
              if (this.converged && subiter > 0) {
                break;
              }
              if (!this.luFactor(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute)) {
                this.Circuit.halt("Singular matrix in nonlinear circuit!", null);
                return;
              }
            }
            this.luSolve(this.circuitMatrix, this.circuitMatrixSize, this.circuitPermute, this.circuitRightSide);
            for (j = _o = 0, _ref5 = this.circuitMatrixFullSize; 0 <= _ref5 ? _o < _ref5 : _o > _ref5; j = 0 <= _ref5 ? ++_o : --_o) {
              rowInfo = this.circuitRowInfo[j];
              res = 0;
              if (rowInfo.type === RowInfo.ROW_CONST) {
                res = rowInfo.value;
              } else {
                res = this.circuitRightSide[rowInfo.mapCol];
              }
              if (isNaN(res)) {
                this.converged = false;
                break;
              }
              if (j < (this.Circuit.numNodes() - 1)) {
                circuitNode = this.Circuit.nodeList[j + 1];
                _ref6 = circuitNode.links;
                for (_p = 0, _len2 = _ref6.length; _p < _len2; _p++) {
                  cn1 = _ref6[_p];
                  cn1.elm.setNodeVoltage(cn1.num, res);
                }
              } else {
                ji = j - (this.Circuit.numNodes() - 1);
                this.Circuit.voltageSources[ji].setCurrent(ji, res);
              }
            }
            if (!this.circuitNonLinear) {
              break;
            }
            subiter++;
          }
          if (subiter > 5) {
            console.log("converged after " + subiter + " iterations\n");
          }
          if (subiter >= subiterCount) {
            this.halt("Convergence failed: " + subiter, null);
            break;
          }
          this.Circuit.time += this.Circuit.timeStep();
          tm = (new Date()).getTime();
          lit = tm;
          if (iter * 1000 >= stepRate * (tm - this.lastIterTime)) {
            break;
          } else if ((tm - this.lastFrameTime) > 500) {
            break;
          }
          ++iter;
        }
        this.frames++;
        this.Circuit.iterations++;
        return this._updateTimings(lit);
      };


      /*
        luFactor: finds a solution to a factored matrix through LU (Lower-Upper) factorization
      
        Called once each frame for resistive circuits, otherwise called many times each frame
      
        @param circuitMatrix 2D matrix to be solved
        @param matrixSize number or rows/columns in the matrix
        @param pivotArray pivot index
       */

      CircuitSolver.prototype.luFactor = function(circuitMatrix, matrixSize, pivotArray) {
        var i, j, k, largest, largestRow, matrix_ij, mult, x;
        i = 0;
        while (i < matrixSize) {
          largest = 0;
          j = 0;
          while (j < matrixSize) {
            x = Math.abs(circuitMatrix[i][j]);
            if (x > largest) {
              largest = x;
            }
            ++j;
          }
          if (largest === 0) {
            return false;
          }
          this.scaleFactors[i] = 1.0 / largest;
          ++i;
        }
        j = 0;
        while (j < matrixSize) {
          i = 0;
          while (i < j) {
            matrix_ij = circuitMatrix[i][j];
            k = 0;
            while (k !== i) {
              matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j];
              ++k;
            }
            circuitMatrix[i][j] = matrix_ij;
            ++i;
          }
          largest = 0;
          largestRow = -1;
          i = j;
          while (i < matrixSize) {
            matrix_ij = circuitMatrix[i][j];
            k = 0;
            while (k < j) {
              matrix_ij -= circuitMatrix[i][k] * circuitMatrix[k][j];
              ++k;
            }
            circuitMatrix[i][j] = matrix_ij;
            x = Math.abs(matrix_ij);
            if (x >= largest) {
              largest = x;
              largestRow = i;
            }
            ++i;
          }
          if (j !== largestRow) {
            k = 0;
            while (k < matrixSize) {
              x = circuitMatrix[largestRow][k];
              circuitMatrix[largestRow][k] = circuitMatrix[j][k];
              circuitMatrix[j][k] = x;
              ++k;
            }
            this.scaleFactors[largestRow] = this.scaleFactors[j];
          }
          pivotArray[j] = largestRow;
          if (circuitMatrix[j][j] === 0) {
            circuitMatrix[j][j] = 1e-18;
          }
          if (j !== matrixSize - 1) {
            mult = 1 / circuitMatrix[j][j];
            i = j + 1;
            while (i !== matrixSize) {
              circuitMatrix[i][j] *= mult;
              ++i;
            }
          }
          ++j;
        }
        return true;
      };


      /*
        Step 2: `lu_solve`: (Called by lu_factor)
        finds a solution to a factored matrix through LU (Lower-Upper) factorization
      
        Called once each frame for resistive circuits, otherwise called many times each frame
      
        @param circuitMatrix matrix to be solved
        @param numRows dimension
        @param pivotVector pivot index
        @param circuitRightSide Right-side (dependent) matrix
       */

      CircuitSolver.prototype.luSolve = function(circuitMatrix, numRows, pivotVector, circuitRightSide) {
        var bi, i, j, row, swap, tot, total, _results;
        i = 0;
        while (i < numRows) {
          row = pivotVector[i];
          swap = circuitRightSide[row];
          circuitRightSide[row] = circuitRightSide[i];
          circuitRightSide[i] = swap;
          if (swap !== 0) {
            break;
          }
          ++i;
        }
        bi = i++;
        while (i < numRows) {
          row = pivotVector[i];
          tot = circuitRightSide[row];
          circuitRightSide[row] = circuitRightSide[i];
          j = bi;
          while (j < i) {
            tot -= circuitMatrix[i][j] * circuitRightSide[j];
            ++j;
          }
          circuitRightSide[i] = tot;
          ++i;
        }
        i = numRows - 1;
        _results = [];
        while (i >= 0) {
          total = circuitRightSide[i];
          j = i + 1;
          while (j !== numRows) {
            total -= circuitMatrix[i][j] * circuitRightSide[j];
            ++j;
          }
          circuitRightSide[i] = total / circuitMatrix[i][i];
          _results.push(i--);
        }
        return _results;
      };

      return CircuitSolver;

    })();
    return CircuitSolver;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __slice = [].slice;

  define('cs!util/Observer',[], function() {
    var Observer;
    Observer = (function() {
      function Observer() {}

      Observer.prototype.addObserver = function(event, fn) {
        var _base;
        this._events || (this._events = {});
        (_base = this._events)[event] || (_base[event] = []);
        return this._events[event].push(fn);
      };

      Observer.prototype.removeObserver = function(event, fn) {
        this._events || (this._events = {});
        if (this._events[event]) {
          return this._events[event].splice(this._events[event].indexOf(fn), 1);
        }
      };

      Observer.prototype.notifyObservers = function() {
        var args, callback, event, _i, _len, _ref, _results;
        event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        this._events || (this._events = {});
        if (this._events[event]) {
          _ref = this._events[event];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            callback = _ref[_i];
            _results.push(callback.apply(this, args));
          }
          return _results;
        }
      };

      Observer.prototype.getObservers = function() {
        return this._events;
      };

      return Observer;

    })();
    return Observer;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define('cs!core/Circuit',['cs!scope/Oscilloscope', 'cs!io/Logger', 'cs!core/SimulationParams', 'cs!engine/CircuitSolver', 'cs!util/Observer'], function(Oscilloscope, Logger, SimulationParams, CircuitSolver, Observer) {
    var Circuit;
    Circuit = (function(_super) {
      __extends(Circuit, _super);

      Circuit.ON_START_UPDATE = "ON_START_UPDATE";

      Circuit.ON_COMPLETE_UPDATE = "ON_END_UPDATE";

      Circuit.ON_RESET = "ON_RESET";

      Circuit.ON_SOLDER = "ON_SOLDER";

      Circuit.ON_DESOLDER = "ON_DESOLDER";

      Circuit.ON_ADD_COMPONENT = "ON_ADD_COMPONENT";

      Circuit.ON_REMOVE_COMPONENT = "ON_MOVE_COMPONENT";

      Circuit.ON_MOVE_COMPONENT = "ON_MOVE_COMPONENT";

      Circuit.ON_ERROR = "ON_ERROR";

      Circuit.ON_WARNING = "ON_WARNING";

      function Circuit() {
        this.Params = new SimulationParams();
        this.clearAndReset();
      }

      Circuit.prototype.clearAndReset = function() {
        var element, _i, _len, _ref;
        _ref = this.elementList != null;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          element = _ref[_i];
          element.destroy();
        }
        this.Solver = new CircuitSolver(this);
        this.nodeList = [];
        this.elementList = [];
        this.voltageSources = [];
        this.scopes = [];
        this.time = 0;
        this.iterations = 0;
        this.clearErrors();
        return this.notifyObservers(this.ON_RESET);
      };

      Circuit.prototype.solder = function(newElement) {
        console.log("\tSoldering " + newElement + ": " + (newElement.dump()));
        this.notifyObservers(this.ON_SOLDER);
        newElement.Circuit = this;
        newElement.setPoints();
        return this.elementList.push(newElement);
      };

      Circuit.prototype.desolder = function(component, destroy) {
        if (destroy == null) {
          destroy = false;
        }
        this.notifyObservers(this.ON_DESOLDER);
        component.Circuit = null;
        this.elementList.remove(component);
        if (destroy) {
          return component.destroy();
        }
      };

      Circuit.prototype.toString = function() {
        return this.Params;
      };


      /* Simulation Frame Computation
       */


      /*
      UpdateCircuit: Updates the circuit each frame.
        1. ) Reconstruct Circuit:
              Rebuilds a data representation of the circuit (only applied when circuit changes)
        2. ) Solve Circuit build matrix representation of the circuit solve for the voltage and current for each component.
              Solving is performed via LU factorization.
       */

      Circuit.prototype.updateCircuit = function() {
        this.notifyObservers(this.ON_START_UPDATE);
        this.Solver.reconstruct();
        if (this.Solver.isStopped) {
          this.Solver.lastTime = 0;
        } else {
          this.Solver.solveCircuit();
        }
        return this.notifyObservers(this.ON_COMPLETE_UPDATE);
      };

      Circuit.prototype.setSelected = function(component) {
        var elm, _i, _len, _ref, _results;
        _ref = this.elementList;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elm = _ref[_i];
          if (elm === component) {
            console.log("Selected: " + (component.dump()));
            this.selectedElm = component;
            _results.push(component.setSelected(true));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      Circuit.prototype.warn = function(message) {
        Logger.warn(message);
        return this.warnMessage = message;
      };

      Circuit.prototype.halt = function(message) {
        Logger.error(message);
        return this.stopMessage = message;
      };

      Circuit.prototype.clearErrors = function() {
        this.stopMessage = null;
        return this.stopElm = null;
      };


      /* Circuit Element Accessors:
       */

      Circuit.prototype.getScopes = function() {
        return [];
      };

      Circuit.prototype.findElm = function(searchElm) {
        var circuitElm, _i, _len, _ref;
        _ref = this.elementList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          circuitElm = _ref[_i];
          if (searchElm === circuitElm) {
            return circuitElm;
          }
        }
        return false;
      };

      Circuit.prototype.getElements = function() {
        return this.elementList;
      };

      Circuit.prototype.getElmByIdx = function(elmIdx) {
        return this.elementList[elmIdx];
      };

      Circuit.prototype.numElements = function() {
        return this.elementList.length;
      };

      Circuit.prototype.getVoltageSources = function() {
        return this.voltageSources;
      };


      /* Nodes
       */

      Circuit.prototype.resetNodes = function() {
        return this.nodeList = [];
      };

      Circuit.prototype.addCircuitNode = function(circuitNode) {
        return this.nodeList.push(circuitNode);
      };

      Circuit.prototype.getNode = function(idx) {
        return this.nodeList[idx];
      };

      Circuit.prototype.getNodes = function() {
        return this.nodeList;
      };

      Circuit.prototype.numNodes = function() {
        return this.nodeList.length;
      };

      Circuit.prototype.findBadNodes = function() {
        var circuitElm, circuitNode, firstCircuitNode, numBadPoints, _i, _j, _len, _len1, _ref, _ref1;
        this.badNodes = [];
        _ref = this.nodeList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          circuitNode = _ref[_i];
          if (!circuitNode.intern && circuitNode.links.length === 1) {
            numBadPoints = 0;
            firstCircuitNode = circuitNode.links[0];
            _ref1 = this.elementList;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              circuitElm = _ref1[_j];
              if (firstCircuitNode.elm.equal_to(circuitElm) === false && circuitElm.boundingBox.contains(circuitNode.x, circuitNode.y)) {
                numBadPoints++;
              }
            }
            if (numBadPoints > 0) {
              this.badNodes.push(circuitNode);
            }
          }
        }
        return this.badNodes;
      };


      /* Simulation Accessor Methods
       */

      Circuit.prototype.subIterations = function() {
        return this.Solver.subIterations;
      };

      Circuit.prototype.eachComponent = function(callback) {
        var component, _i, _len, _ref, _results;
        _ref = this.elementList;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          component = _ref[_i];
          _results.push(callback(component));
        }
        return _results;
      };

      Circuit.prototype.isStopped = function() {
        return this.Solver.isStopped;
      };

      Circuit.prototype.timeStep = function() {
        return this.Params.timeStep;
      };

      Circuit.prototype.voltageRange = function() {
        return this.Params.voltageRange;
      };

      Circuit.prototype.powerRange = function() {
        return this.Params.powerRange;
      };

      Circuit.prototype.currentSpeed = function() {
        return this.Params.currentSpeed;
      };

      Circuit.prototype.getState = function() {
        return this.state;
      };

      Circuit.prototype.getStamper = function() {
        return this.Solver.getStamper();
      };

      Circuit.prototype.getNode = function(idx) {
        return this.nodeList[idx];
      };

      return Circuit;

    })(Observer);
    return Circuit;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!engine/Hint',[], function() {
    var Hint;
    Hint = (function() {
      Hint.HINT_LC = "@HINT_LC";

      Hint.HINT_RC = "@HINT_RC";

      Hint.HINT_3DB_C = "@HINT_3DB_C";

      Hint.HINT_TWINT = "@HINT_TWINT";

      Hint.HINT_3DB_L = "@HINT_3DB_L";

      Hint.hintType = -1;

      Hint.hintItem1 = -1;

      Hint.hintItem2 = -1;

      function Hint(Circuit) {
        this.Circuit = Circuit;
      }

      Hint.prototype.readHint = function(st) {
        if (typeof st === 'string') {
          st = st.split(' ');
        }
        this.hintType = st[0];
        this.hintItem1 = st[1];
        return this.hintItem2 = st[2];
      };

      Hint.prototype.getHint = function() {
        var c1, c2, ce, ie, re;
        c1 = this.Circuit.getElmByIdx(this.hintItem1);
        c2 = this.Circuit.getElmByIdx(this.hintItem2);
        if ((c1 == null) || (c2 == null)) {
          return null;
        }
        if (this.hintType === this.HINT_LC) {
          if (!(c1 instanceof InductorElm)) {
            return null;
          }
          if (!(c2 instanceof CapacitorElm)) {
            return null;
          }
          ie = c1;
          ce = c2;
          return "res.f = " + getUnitText(1 / (2 * Math.PI * Math.sqrt(ie.inductance * ce.capacitance)), "Hz");
        }
        if (this.hintType === this.HINT_RC) {
          if (!(c1 instanceof ResistorElm)) {
            return null;
          }
          if (!(c2 instanceof CapacitorElm)) {
            return null;
          }
          re = c1;
          ce = c2;
          return "RC = " + getUnitText(re.resistance * ce.capacitance, "s");
        }
        if (this.hintType === this.HINT_3DB_C) {
          if (!(c1 instanceof ResistorElm)) {
            return null;
          }
          if (!(c2 instanceof CapacitorElm)) {
            return null;
          }
          re = c1;
          ce = c2;
          return "f.3db = " + getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz");
        }
        if (this.hintType === this.HINT_3DB_L) {
          if (!(c1 instanceof ResistorElm)) {
            return null;
          }
          if (!(c2 instanceof InductorElm)) {
            return null;
          }
          re = c1;
          ie = c2;
          return "f.3db = " + getUnitText(re.resistance / (2 * Math.PI * ie.inductance), "Hz");
        }
        if (this.hintType === this.HINT_TWINT) {
          if (!(c1 instanceof ResistorElm)) {
            return null;
          }
          if (!(c2 instanceof CapacitorElm)) {
            return null;
          }
          re = c1;
          ce = c2;
          return "fc = " + getUnitText(1 / (2 * Math.PI * re.resistance * ce.capacitance), "Hz");
        }
        return null;
      };

      return Hint;

    })();
    return Hint;
  });

}).call(this);


// Generated by CoffeeScript 1.7.1
(function() {
  define('cs!io/CircuitLoader',['jquery', 'cs!component/ComponentRegistry', 'cs!core/SimulationParams', 'cs!core/Circuit', 'cs!scope/Oscilloscope', 'cs!engine/Hint'], function($, ComponentRegistry, SimulationParams, Circuit, Oscilloscope, Hint) {
    var CircuitLoader;
    CircuitLoader = (function() {
      function CircuitLoader() {}

      CircuitLoader.createCircuitFromJsonData = function(jsonData) {
        var circuit, circuitParams, elementData, elms, flags, newCircuitElm, params, sym, type, x1, x2, y1, y2, _i, _len;
        circuit = new Circuit();
        circuitParams = jsonData.shift();
        circuit.Params = new SimulationParams(jsonData);
        console.log(circuit.Params.toString());
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
        console.log("Soldering Components:");
        console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
        elms = [];
        for (_i = 0, _len = jsonData.length; _i < _len; _i++) {
          elementData = jsonData[_i];
          type = elementData['sym'];
          sym = ComponentRegistry.ComponentDefs[type];
          x1 = parseInt(elementData['x1']);
          y1 = parseInt(elementData['y1']);
          x2 = parseInt(elementData['x2']);
          y2 = parseInt(elementData['y2']);
          flags = parseInt(elementData['flags']);
          params = elementData['params'];
          if (sym === null) {
            circuit.halt("Element: " + (JSON.stringify(elementData)) + " is null");
          }
          if (type === Hint) {
            console.log("Hint found in file!");
          }
          if (type === Oscilloscope) {
            console.log("Scope found in file!");
          }
          if (!type) {
            circuit.warn("Unrecognized Type");
          }
          if (!sym) {
            circuit.warn("Unrecognized dump type: " + type);
          } else {
            newCircuitElm = new sym(x1, y1, x2, y2, flags, params);
            elms.push(newCircuitElm);
            circuit.solder(newCircuitElm);
          }
        }
        if (elms.length === 0) {
          console.error("No elements loaded. JSON most likely malformed");
        }
        return circuit;
      };


      /*
      Retrieves string data from a circuit text file (via AJAX GET)
       */

      CircuitLoader.createCircuitFromJsonFile = function(circuitFileName, onComplete) {
        if (onComplete == null) {
          onComplete = null;
        }
        return $.getJSON(circuitFileName, (function(_this) {
          return function(jsonData) {
            var circuit;
            circuit = CircuitLoader.createCircuitFromJsonData(jsonData);
            return typeof onComplete === "function" ? onComplete(circuit) : void 0;
          };
        })(this));
      };

      return CircuitLoader;

    })();
    return CircuitLoader;
  });

}).call(this);

(function() {
  define('../build/js/src/Maxwell',['cs!io/CircuitLoader', 'cs!core/Circuit'], function(CircuitLoader, Circuit) {
    var Maxwell;
    Maxwell = (function() {
      Maxwell.Circuits = {};

      function Maxwell(canvas, options) {
        if (options == null) {
          options = {};
        }
        this.Circuit = null;
        this.circuitName = options['circuitName'];
        if (this.circuitName) {
          CircuitLoader.createCircuitFromJsonFile(this.circuitName, (function(_this) {
            return function(circuit) {
              return _this.Circuit = circuit;
            };
          })(this));
        }
      }

      Maxwell._loadCircuitFromFile = function(circuitFileName) {
        return CircuitLoader.createCircuitFromJsonFile(circuitFileName);
      };

      Maxwell._loadCircuitFromJson = function(jsonData) {
        return CircuitLoader.createCircuitFromJsonData(jsonData);
      };

      Maxwell.createCircuit = function(circuitName, circuitData) {
        var circuit;
        circuit = null;
        if (circuitData) {
          if (typeof circuitData === "string") {
            circuit = Maxwell._loadCircuitFromFile(circuitData);
          } else if (typeof circuitData === "object") {
            circuit = Maxwell._loadCircuitFromJson(circuitData);
          } else {
            raise("Parameter must either be a path to a JSON file or raw JSON data representing the circuit. Use `Maxwell.createCircuit()` to create a new empty circuit object.");
          }
        } else {
          circuit = new Circuit();
        }
        this.Circuits[circuitName] = circuit;
        return circuit;
      };

      return Maxwell;

    })();
    return Maxwell;
  });

}).call(this);

