class XRegExp {
    constructor(source, flag, root = "root") {
      this.table = new Map();
      this.regexp = new RegExp(this.compileRegExp(source, root, 0).source,flag);
    }
  
    compileRegExp(source, name, start) {
      if (source[name] instanceof RegExp) {
        return {
          source: source[name].source,
          length: 0,
        };
      }
      let length = 0;
      let regexp = source[name].replace(/\<([^>]+)\>/g, (str, $1) => {
        this.table.set(start + length, $1);
  
        ++length;
  
        let r = this.compileRegExp(source, $1, start + length);
  
        length += r.length;
        return "(" + r.source + ")";
      });
      return {
        source: regexp,
        length: length,
      };
    }
  
    exec(string) {
      let r = this.regexp.exec(string);
      for (let i = 1; i < r.length; i++) {
        if (r[i] !== void 0) {
          r[this.table.get(i - 1)] = r[i];
        }
      }
      return r;
    }
  
    get lastIndex() {
      return this.regexp.lastIndex;
    }
  
    set lastIndex(value) {
      return this.regexp.lastIndex = value;
    }
  }
  export function* scan(str) {
    let regexp = new XRegExp(
      {
        InputElement: "<Whitespace>|<LineTerminatior>|<Comments>|<Token>",
        Whitespace: / /,
        LineTerminatior: /\n/,
        Comments: /\/\*(?:[^*]|\*[^\/])*\*\/|\/\/[^\n]*/,
        Token: "<Literal>|<Keywords>|<Identifier>|<Punctuator>", //Keywords必须在Identifier之前，不然会识别错误
        Literal: "<NumericLiteral>|<BooleanLiteral>|<StringLiteral>|<NullLiteral>",
        NumericLiteral: /0x[0-9a-zA-Z]+|0o[0-7]+|0b[01]+|(?:[1-9][0-9]*|0)(?:\.[0-9]*)?|\.[0-9]+/,
        BooleanLiteral: /true|false/,
        StringLiteral: /\"(?:[^"\n]|\\[\s\S])*\"|\'(?:[^'\n]|\\[\s\S])*\'/, //双引号和单引号
        NullLiteral: /null/,
        Identifier: /[a-zA-Z_$][a-zA-Z0-9_$]*/, 
        Keywords: /continue|break|if|else|for|function|var|let|new|while/,//关键字
        Punctuator:/\|\||\&\&|\+|\-|\,|\?|\:|\{|\}|\.|\(|\=|\<|\+\+|\=\=|\=\>|\*|\)|\[|\]|;/
      },
      "g",
      "InputElement"
    );
    while (regexp.lastIndex < str.length) {
      let r = regexp.exec(str);
      if (r.Whitespace) {
        
      } else if (r.LineTerminatior) {
        
      } else if (r.Comments) {
        
      } else if (r.NumericLiteral) {
        yield {
          type: 'NumericLiteral',
          value:r[0]
        }
      } else if (r.BooleanLiteral) {
        yield {
          type: 'BooleanLiteral',
          value:r[0]
        }
      } else if (r.StringLiteral) {
        yield {
          type: 'StringLiteral',
          value:r[0]
        }
      } else if (r.NullLiteral){
        yield {
          type: 'NullLiteral',
          value:null
        }
      } else if (r.Identifier) {
        yield {
          type: 'Identifier',
          name:r[0]
        }
      } else if (r.Keywords) {
        yield {
          type:r[0]
        }
      } else if (r.Punctuator) {
        yield {
          type:r[0]
        }
      } else {
        throw new Error('error tiken'+ r[0])
      }
  
      if (!r[0].length) 
        break;
    }
    yield {
      type:'EOF'
    }
  }
  