(function (root, factory) {

  // Node.
  if(typeof module === 'object' && typeof module.exports === 'object') {
    exports = module.exports = factory();
  }

  // AMD.
  if(typeof define === 'function' && define.amd) {
    define(["terraformer/terraformer"],factory);
  }

  // Browser Global.
  if(typeof navigator === "object") {
    if (typeof root.Terraformer === "undefined"){
      root.Terraformer = {};
    }
    root.Terraformer.WKT = factory();
  }

}(this, function() {
  var exports = { };
  var Terraformer;

  // Local Reference To Browser Global
  if(typeof this.navigator === "object") {
    Terraformer = this.Terraformer;
  }

  // Setup Node Dependencies
  if(typeof module === 'object' && typeof module.exports === 'object') {
    Terraformer = require('terraformer');
  }

  // Setup AMD Dependencies
  if(arguments[0] && typeof define === 'function' && define.amd) {
    Terraformer = arguments[0];
  }

  /* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"point":4,"EOF":5,"linestring":6,"polygon":7,"multipoint":8,"multilinestring":9,"multipolygon":10,"coordinate":11,"DOUBLE_TOK":12,"ptarray":13,"COMMA":14,"ring_list":15,"ring":16,"(":17,")":18,"POINT":19,"Z":20,"M":21,"EMPTY":22,"point_untagged":23,"polygon_list":24,"polygon_untagged":25,"point_list":26,"LINESTRING":27,"POLYGON":28,"MULTIPOINT":29,"MULTILINESTRING":30,"MULTIPOLYGON":31,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",12:"DOUBLE_TOK",14:"COMMA",17:"(",18:")",19:"POINT",20:"Z",21:"M",22:"EMPTY",27:"LINESTRING",28:"POLYGON",29:"MULTIPOINT",30:"MULTILINESTRING",31:"MULTIPOLYGON"},
productions_: [0,[3,2],[3,2],[3,2],[3,2],[3,2],[3,2],[11,2],[11,3],[11,4],[13,3],[13,1],[15,3],[15,1],[16,3],[4,4],[4,5],[4,6],[4,5],[4,2],[23,1],[23,3],[24,3],[24,1],[25,3],[26,3],[26,1],[6,4],[6,5],[6,5],[6,6],[6,2],[7,4],[7,5],[7,5],[7,6],[7,2],[8,4],[8,5],[8,5],[8,6],[8,2],[9,4],[9,5],[9,5],[9,6],[9,2],[10,4],[10,5],[10,5],[10,6],[10,2]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$,_$) {

var $0 = $.length - 1;
switch (yystate) {
case 1: return $[$0-1]; 
break;
case 2: return $[$0-1]; 
break;
case 3: return $[$0-1]; 
break;
case 4: return $[$0-1]; 
break;
case 5: return $[$0-1]; 
break;
case 6: return $[$0-1]; 
break;
case 7: this.$ = new PointArray([ Number($[$0-1]), Number($[$0]) ]); 
break;
case 8: this.$ = new PointArray([ Number($[$0-2]), Number($[$0-1]), Number($[$0]) ]); 
break;
case 9: this.$ = new PointArray([ Number($[$0-3]), Number($[$0-2]), Number($[$0-1]), Number($[$0]) ]); 
break;
case 10: this.$ = $[$0-2].addPoint($[$0]); 
break;
case 11: this.$ = $[$0]; 
break;
case 12: this.$ = $[$0-2].addRing($[$0]); 
break;
case 13: this.$ = new RingList($[$0]); 
break;
case 14: this.$ = new Ring($[$0-1]); 
break;
case 15: this.$ = { "type": "Point", "coordinates": $[$0-1].data[0] }; 
break;
case 16: this.$ = { "type": "Point", "coordinates": $[$0-2].data[0], "properties": { z: true } }; 
break;
case 17: this.$ = { "type": "Point", "coordinates": $[$0-3].data[0], "properties": { z: true, m: true } }; 
break;
case 18: this.$ = { "type": "Point", "coordinates": $[$0-2].data[0], "properties": { m: true } }; 
break;
case 19: this.$ = { "type": "Point", "coordinates": [ ] }; 
break;
case 20: this.$ = $[$0]; 
break;
case 21: this.$ = $[$0-1]; 
break;
case 22: this.$ = $[$0-2].addPolygon($[$0]); 
break;
case 23: this.$ = new PolygonList($[$0]); 
break;
case 24: this.$ = $[$0-1]; 
break;
case 25: this.$ = $[$0-2].addPoint($[$0]); 
break;
case 26: this.$ = $[$0]; 
break;
case 27: this.$ = { "type": "LineString", "coordinates": $[$0-1].data }; 
break;
case 28: this.$ = { "type": "LineString", "coordinates": $[$0-2].data, "properties": { z: true } }; 
break;
case 29: this.$ = { "type": "LineString", "coordinates": $[$0-2].data, "properties": { m: true } }; 
break;
case 30: this.$ = { "type": "LineString", "coordinates": $[$0-3].data, "properties": { z: true, m: true } }; 
break;
case 31: this.$ = { "type": "LineString", "coordinates": [ ] }; 
break;
case 32: this.$ = { "type": "Polygon", "coordinates": $[$0-1].toJSON() }; 
break;
case 33: this.$ = { "type": "Polygon", "coordinates": $[$0-2].toJSON(), "properties": { z: true } }; 
break;
case 34: this.$ = { "type": "Polygon", "coordinates": $[$0-2].toJSON(), "properties": { m: true } }; 
break;
case 35: this.$ = { "type": "Polygon", "coordinates": $[$0-3].toJSON(), "properties": { z: true, m: true } }; 
break;
case 36: this.$ = { "type": "Polygon", "coordinates": [ ] }; 
break;
case 37: this.$ = { "type": "MultiPoint", "coordinates": $[$0-1].data }; 
break;
case 38: this.$ = { "type": "MultiPoint", "coordinates": $[$0-2].data, "properties": { z: true } }; 
break;
case 39: this.$ = { "type": "MultiPoint", "coordinates": $[$0-2].data, "properties": { m: true } }; 
break;
case 40: this.$ = { "type": "MultiPoint", "coordinates": $[$0-3].data, "properties": { z: true, m: true } }; 
break;
case 41: this.$ = { "type": "MultiPoint", "coordinates": [ ] } 
break;
case 42: this.$ = { "type": "MultiLineString", "coordinates": $[$0-1].toJSON() }; 
break;
case 43: this.$ = { "type": "MultiLineString", "coordinates": $[$0-2].toJSON(), "properties": { z: true } }; 
break;
case 44: this.$ = { "type": "MultiLineString", "coordinates": $[$0-2].toJSON(), "properties": { m: true } }; 
break;
case 45: this.$ = { "type": "MultiLineString", "coordinates": $[$0-3].toJSON(), "properties": { z: true, m: true } }; 
break;
case 46: this.$ = { "type": "MultiLineString", "coordinates": [ ] }; 
break;
case 47: this.$ = { "type": "MultiPolygon", "coordinates": $[$0-1].toJSON() }; 
break;
case 48: this.$ = { "type": "MultiPolygon", "coordinates": $[$0-2].toJSON(), "properties": { z: true } }; 
break;
case 49: this.$ = { "type": "MultiPolygon", "coordinates": $[$0-2].toJSON(), "properties": { m: true } }; 
break;
case 50: this.$ = { "type": "MultiPolygon", "coordinates": $[$0-3].toJSON(), "properties": { z: true, m: true } }; 
break;
case 51: this.$ = { "type": "MultiPolygon", "coordinates": [ ] }; 
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:6,10:7,19:[1,8],27:[1,9],28:[1,10],29:[1,11],30:[1,12],31:[1,13]},{1:[3]},{5:[1,14]},{5:[1,15]},{5:[1,16]},{5:[1,17]},{5:[1,18]},{5:[1,19]},{17:[1,20],20:[1,21],21:[1,22],22:[1,23]},{17:[1,24],20:[1,25],21:[1,26],22:[1,27]},{17:[1,28],20:[1,29],21:[1,30],22:[1,31]},{17:[1,32],20:[1,33],21:[1,34],22:[1,35]},{17:[1,36],20:[1,37],21:[1,38],22:[1,39]},{17:[1,40],20:[1,41],21:[1,42],22:[1,43]},{1:[2,1]},{1:[2,2]},{1:[2,3]},{1:[2,4]},{1:[2,5]},{1:[2,6]},{11:45,12:[1,46],13:44},{17:[1,47],21:[1,48]},{17:[1,49]},{5:[2,19]},{11:52,12:[1,46],17:[1,53],23:51,26:50},{17:[1,54],21:[1,55]},{17:[1,56]},{5:[2,31]},{15:57,16:58,17:[1,59]},{17:[1,60],21:[1,61]},{17:[1,62]},{5:[2,36]},{11:52,12:[1,46],17:[1,53],23:51,26:63},{17:[1,64],21:[1,65]},{17:[1,66]},{5:[2,41]},{15:67,16:58,17:[1,59]},{17:[1,68],21:[1,69]},{17:[1,70]},{5:[2,46]},{17:[1,73],24:71,25:72},{17:[1,74],21:[1,75]},{17:[1,76]},{5:[2,51]},{14:[1,78],18:[1,77]},{14:[2,11],18:[2,11]},{12:[1,79]},{11:45,12:[1,46],13:80},{17:[1,81]},{11:45,12:[1,46],13:82},{14:[1,84],18:[1,83]},{14:[2,26],18:[2,26]},{14:[2,20],18:[2,20]},{11:85,12:[1,46]},{11:52,12:[1,46],17:[1,53],23:51,26:86},{17:[1,87]},{11:52,12:[1,46],17:[1,53],23:51,26:88},{14:[1,90],18:[1,89]},{14:[2,13],18:[2,13]},{11:45,12:[1,46],13:91},{15:92,16:58,17:[1,59]},{17:[1,93]},{15:94,16:58,17:[1,59]},{14:[1,84],18:[1,95]},{11:52,12:[1,46],17:[1,53],23:51,26:96},{17:[1,97]},{11:52,12:[1,46],17:[1,53],23:51,26:98},{14:[1,90],18:[1,99]},{15:100,16:58,17:[1,59]},{17:[1,101]},{15:102,16:58,17:[1,59]},{14:[1,104],18:[1,103]},{14:[2,23],18:[2,23]},{15:105,16:58,17:[1,59]},{17:[1,73],24:106,25:72},{17:[1,107]},{17:[1,73],24:108,25:72},{5:[2,15]},{11:109,12:[1,46]},{12:[1,110],14:[2,7],18:[2,7]},{14:[1,78],18:[1,111]},{11:45,12:[1,46],13:112},{14:[1,78],18:[1,113]},{5:[2,27]},{11:52,12:[1,46],17:[1,53],23:114},{18:[1,115]},{14:[1,84],18:[1,116]},{11:52,12:[1,46],17:[1,53],23:51,26:117},{14:[1,84],18:[1,118]},{5:[2,32]},{16:119,17:[1,59]},{14:[1,78],18:[1,120]},{14:[1,90],18:[1,121]},{15:122,16:58,17:[1,59]},{14:[1,90],18:[1,123]},{5:[2,37]},{14:[1,84],18:[1,124]},{11:52,12:[1,46],17:[1,53],23:51,26:125},{14:[1,84],18:[1,126]},{5:[2,42]},{14:[1,90],18:[1,127]},{15:128,16:58,17:[1,59]},{14:[1,90],18:[1,129]},{5:[2,47]},{17:[1,73],25:130},{14:[1,90],18:[1,131]},{14:[1,104],18:[1,132]},{17:[1,73],24:133,25:72},{14:[1,104],18:[1,134]},{14:[2,10],18:[2,10]},{12:[1,135],14:[2,8],18:[2,8]},{5:[2,16]},{14:[1,78],18:[1,136]},{5:[2,18]},{14:[2,25],18:[2,25]},{14:[2,21],18:[2,21]},{5:[2,28]},{14:[1,84],18:[1,137]},{5:[2,29]},{14:[2,12],18:[2,12]},{14:[2,14],18:[2,14]},{5:[2,33]},{14:[1,90],18:[1,138]},{5:[2,34]},{5:[2,38]},{14:[1,84],18:[1,139]},{5:[2,39]},{5:[2,43]},{14:[1,90],18:[1,140]},{5:[2,44]},{14:[2,22],18:[2,22]},{14:[2,24],18:[2,24]},{5:[2,48]},{14:[1,104],18:[1,141]},{5:[2,49]},{14:[2,9],18:[2,9]},{5:[2,17]},{5:[2,30]},{5:[2,35]},{5:[2,40]},{5:[2,45]},{5:[2,50]}],
defaultActions: {14:[2,1],15:[2,2],16:[2,3],17:[2,4],18:[2,5],19:[2,6],23:[2,19],27:[2,31],31:[2,36],35:[2,41],39:[2,46],43:[2,51],77:[2,15],83:[2,27],89:[2,32],95:[2,37],99:[2,42],103:[2,47],111:[2,16],113:[2,18],116:[2,28],118:[2,29],121:[2,33],123:[2,34],124:[2,38],126:[2,39],127:[2,43],129:[2,44],132:[2,48],134:[2,49],136:[2,17],137:[2,30],138:[2,35],139:[2,40],140:[2,45],141:[2,50]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == "undefined") {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            var errStr = "";
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            if (ranges) {
                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]];
            }
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
undefined/* Jison generated lexer */
var lexer = (function(){
var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        if (this.options.ranges) this.yylloc.range = [0,0];
        this.offset = 0;
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) this.yylloc.range[1]++;

        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length-len-1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length-1);
        this.matched = this.matched.substr(0, this.matched.length-1);

        if (lines.length-1) this.yylineno -= lines.length-1;
        var r = this.yylloc.range;

        this.yylloc = {first_line: this.yylloc.first_line,
          last_line: this.yylineno+1,
          first_column: this.yylloc.first_column,
          last_column: lines ?
              (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length:
              this.yylloc.first_column - len
          };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
less:function (n) {
        this.unput(this.match.slice(n));
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            tempMatch,
            index,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (!this.options.flex) break;
            }
        }
        if (match) {
            lines = match[0].match(/(?:\r\n?|\n).*/g);
            if (lines) this.yylineno += lines.length;
            this.yylloc = {first_line: this.yylloc.last_line,
                           last_line: this.yylineno+1,
                           first_column: this.yylloc.last_column,
                           last_column: lines ? lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length};
            this.yytext += match[0];
            this.match += match[0];
            this.matches = match;
            this.yyleng = this.yytext.length;
            if (this.options.ranges) {
                this.yylloc.range = [this.offset, this.offset += this.yyleng];
            }
            this._more = false;
            this._input = this._input.slice(match[0].length);
            this.matched += match[0];
            token = this.performAction.call(this, this.yy, this, rules[index],this.conditionStack[this.conditionStack.length-1]);
            if (this.done && this._input) this.done = false;
            if (token) return token;
            else return;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.options = {};
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:// ignore
break;
case 1:return 17
break;
case 2:return 18
break;
case 3:return 12
break;
case 4:return 19
break;
case 5:return 27
break;
case 6:return 28
break;
case 7:return 29
break;
case 8:return 30
break;
case 9:return 31
break;
case 10:return 14
break;
case 11:return 22
break;
case 12:return 21
break;
case 13:return 20
break;
case 14:return 5
break;
case 15:return "INVALID"
break;
}
};
lexer.rules = [/^(?:\s+)/,/^(?:\()/,/^(?:\))/,/^(?:-?[0-9]+(\.[0-9]+)?)/,/^(?:POINT\b)/,/^(?:LINESTRING\b)/,/^(?:POLYGON\b)/,/^(?:MULTIPOINT\b)/,/^(?:MULTILINESTRING\b)/,/^(?:MULTIPOLYGON\b)/,/^(?:,)/,/^(?:EMPTY\b)/,/^(?:M\b)/,/^(?:Z\b)/,/^(?:$)/,/^(?:.)/];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],"inclusive":true}};
return lexer;})()
parser.lexer = lexer;
function Parser () { this.yy = {}; }Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();function arrayToRing (arr) {
  var parts = [ ], ret = '';

  for (var i = 0; i < arr.length; i++) {
    parts.push(arr[i].join(' '));
  }

  ret += '(' + parts.join(', ') + ')';

  return ret;

}

function pointToWKTPoint (primitive) {
  var ret = 'POINT ';

  if (primitive.coordinates === undefined || primitive.coordinates.length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (primitive.coordinates.length === 3) {
    // 3d or time? default to 3d
    if (primitive.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (primitive.coordinates.length === 4) {
    // 3d and time
    ret += 'ZM ';
  }

  // include coordinates
  ret += '(' + primitive.coordinates.join(' ') + ')';

  return ret;
}

function lineStringToWKTLineString (primitive) {
  var ret = 'LINESTRING ';

  if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (primitive.coordinates[0][0].length === 3) {
    if (primitive.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (primitive.coordinates[0][0].length === 4) {
    ret += 'ZM ';
  }

  ret += arrayToRing(primitive.coordinates);

  return ret;
}

function polygonToWKTPolygon (primitive) {
  var ret = 'POLYGON ';

  if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (primitive.coordinates[0][0].length === 3) {
    if (primitive.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (primitive.coordinates[0][0].length === 4) {
    ret += 'ZM ';
  }

  ret += '(';
  var parts = [ ];
  for (var i = 0; i < primitive.coordinates.length; i++) {
    parts.push(arrayToRing(primitive.coordinates[i]));
  }

  ret += parts.join(', ');
  ret += ')';

  return ret;
}

function multiPointToWKTMultiPoint (primitive) {
  var ret = 'MULTIPOINT ';

  if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (primitive.coordinates[0][0].length === 3) {
    if (primitive.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (primitive.coordinates[0][0].length === 4) {
    ret += 'ZM ';
  }

  ret += arrayToRing(primitive.coordinates);

  return ret;
}

function multiLineStringToWKTMultiLineString (primitive) {
  var ret = 'MULTILINESTRING ';

  if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (primitive.coordinates[0][0].length === 3) {
    if (primitive.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (primitive.coordinates[0][0].length === 4) {
    ret += 'ZM ';
  }

  ret += '(';
  var parts = [ ];
  for (var i = 0; i < primitive.coordinates.length; i++) {
    parts.push(arrayToRing(primitive.coordinates[i]));
  }

  ret += parts.join(', ');
  ret += ')';

  return ret;
}

function multiPolygonToWKTMultiPolygon (primitive) {
  var ret = 'MULTIPOLYGON ';

  if (primitive.coordinates === undefined || primitive.coordinates.length === 0 || primitive.coordinates[0].length === 0) {
    ret += 'EMPTY';

    return ret;
  } else if (primitive.coordinates[0][0][0].length === 3) {
    if (primitive.properties.m === true) {
      ret += 'M ';
    } else {
      ret += 'Z ';
    }
  } else if (primitive.coordinates[0][0][0].length === 4) {
    ret += 'ZM ';
  }

  ret += '(';
  var inner = [ ];
  for (var c = 0; c < primitive.coordinates.length; c++) {
    var it = '(';
    var parts = [ ];
    for (var i = 0; i < primitive.coordinates[c].length; i++) {
      parts.push(arrayToRing(primitive.coordinates[c][i]));
    }

    it += parts.join(', ');
    it += ')';

    inner.push(it);
  }

  ret += inner.join(', ');
  ret += ')';

  return ret;
}

function convert (primitive) {
  switch (primitive.type) {
    case 'Point':
      return pointToWKTPoint(primitive);
      break;
    case 'LineString':
      return lineStringToWKTLineString(primitive);
      break;
    case 'Polygon':
      return polygonToWKTPolygon(primitive);
      break;
    case 'MultiPoint':
      return multiPointToWKTMultiPoint(primitive);
      break;
    case 'MultiLineString':
      return multiLineStringToWKTMultiLineString(primitive);
      break;
    case 'MultiPolygon':
      return multiPolygonToWKTMultiPolygon(primitive);
      break;
    default:
      throw Error ("Unknown Type: " + primitive.type);
  }
}

exports.convert = convert;


  function PointArray (point) {
    this.data = [ point ];
    this.type = 'PointArray';
  }

  PointArray.prototype.addPoint = function (point) {
    if (point.type === 'PointArray') {
      this.data = this.data.concat(point.data);
    } else {
      this.data.push(point);
    }

    return this;
  };

  PointArray.prototype.toJSON = function () {
    return this.data;
  };

  function Ring (point) {
    this.data = point;
    this.type = 'Ring';
  }

  Ring.prototype.toJSON = function () {
    var data = [ ];

    for (var i = 0; i < this.data.data.length; i++) {
      data.push(this.data.data[i]);
    }

    return data;
  };

  function RingList (ring) {
    this.data = [ ring ];
    this.type = 'RingList';
  }

  RingList.prototype.addRing = function (ring) {
    this.data.push(ring);

    return this;
  };

  RingList.prototype.toJSON = function () {
    var data = [ ];

    for (var i = 0; i < this.data.length; i++) {
      data.push(this.data[i].toJSON());
    }

    if (data.length === 1) {
      return data;
    } else {
      return data;
    }
    return data;
  };

  function PolygonList (polygon) {
    this.data = [ polygon ];
    this.type = 'PolygonList';
  }

  PolygonList.prototype.addPolygon = function (polygon) {
    this.data.push(polygon);

    return this;
  };

  PolygonList.prototype.toJSON = function () {
    var data = [ ];

    for (var i = 0; i < this.data.length; i++) {
      data = data.concat( [ this.data[i].toJSON() ] );
    }

    if (data.length === 1) {
      return data;
    } else {
      return data;
    }
    return data;
  };

  function _parse () {
    return parser.parse.apply(parser, arguments);
  }

  function parse (element) {
    var res, primitive;

    try {
      res = parser.parse(element);
    } catch (err) {
    console.dir(err);
      throw Error("Unable to parse", err);
    }

    return Terraformer.Primitive(res);
  }

  exports.parser = parser;
  exports.Parser = parser.Parser;
  exports.parse = parse;

  return exports;
}));