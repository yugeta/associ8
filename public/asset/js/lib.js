$$lib = (function(){
  // ----------
  // Library
  function LIB(){

  }
  LIB.prototype.event = function(target, mode, func , flg){
    flg = (flg) ? flg : false;
		if (target.addEventListener){target.addEventListener(mode, func, flg)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
  };
  LIB.prototype.urlinfo = function(uri){
    uri = (uri) ? uri : location.href;
    var data={};
		//URLとクエリ分離分解;
    var urls_hash  = uri.split("#");
    var urls_query = urls_hash[0].split("?");
		//基本情報取得;
		var sp   = urls_query[0].split("/");
		var data = {
      uri      : uri
		,	url      : sp.join("/")
    , dir      : sp.slice(0 , sp.length-1).join("/") +"/"
    , file     : sp.pop()
		,	domain   : sp[2]
    , protocol : sp[0].replace(":","")
    , hash     : (urls_hash[1]) ? urls_hash[1] : ""
		,	query    : (urls_query[1])?(function(urls_query){
				var data = {};
				var sp   = urls_query.split("#")[0].split("&");
				for(var i=0;i<sp .length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv.slice(1).join("=");
				}
				return data;
			})(urls_query[1]):[]
		};
		return data;
  };
  LIB.prototype.pathinfo = function(p){
		var basename="",
		    dirname=[],
				filename=[],
				ext="";
		var p2 = p.split("?");
		var urls = p2[0].split("/");
		for(var i=0; i<urls.length-1; i++){
			dirname.push(urls[i]);
		}
		basename = urls[urls.length-1];
		var basenames = basename.split(".");
		for(var i=0;i<basenames.length-1;i++){
			filename.push(basenames[i]);
		}
		ext = basenames[basenames.length-1];
		return {
			"hostname":urls[2],
			"basename":basename,
			"dirname":dirname.join("/"),
			"filename":filename.join("."),
			"extension":ext,
      "query":(p2[1])?p2[1]:"",
      "path":p2[0]
    };
  };

  LIB.prototype.upperSelector = function(elm , selectors) {
    if(!selectors){return;}
    selectors = (typeof selectors === "object") ? selectors : [selectors];
    if(!elm || !selectors){return;}
    var flg = null;
    for(var i=0; i<selectors.length; i++){
      if(!selectors[i]){continue}
      for (var cur=elm; cur; cur=cur.parentElement) {
        if (cur.matches(selectors[i])) {
          flg = true;
          break;
        }
      }
      if(flg){
        break;
      }
    }
    return cur;
  }
  LIB.prototype.upperSelectors = function(elm , selector){
    if(!elm || !selector){return;}
    let elms = [];
    for(var cur=elm; cur; cur=cur.parentElement){
      elms.push(cur);
      if(cur.matches(selector)) {break;}
    }
    return cur;
  }
  LIB.prototype.construct = function(MAIN){
    switch(document.readyState){
      case "complete"    : new MAIN();break;
      case "interactive" : this.event(window , "DOMContentLoaded" , (function(){new MAIN()}).bind(this));break;
      default            : this.event(window , "load"             , (function(){new MAIN()}).bind(this));break;
		}
  };

  LIB.prototype.ymdhis2date = function(ymdhis){
    var y = ymdhis.substr(0,4);
    var m = ymdhis.substr(4,2);
    var d = ymdhis.substr(6,2);
    var h = ymdhis.substr(8,2);
    var i = ymdhis.substr(10,2);
    var s = ymdhis.substr(12,2);
    return y+"/"+m+"/"+d+" "+h+":"+i+":"+s;
  };



  //指定したエレメントの座標を取得
	LIB.prototype.pos = function(e,t){

		//エレメント確認処理
		if(!e){return null;}

		//途中指定のエレメントチェック（指定がない場合はbody）
		if(typeof(t)=='undefined' || t==null){
			t = document.body;
		}

		//デフォルト座標
		var pos={x:0,y:0};
		do{
			//指定エレメントでストップする。
			if(e == t){break}

			//対象エレメントが存在しない場合はその辞典で終了
			if(typeof(e)=='undefined' || e==null){return pos;}

			//座標を足し込む
			pos.x += e.offsetLeft;
			pos.y += e.offsetTop;
		}

		//上位エレメントを参照する
		while(e = e.offsetParent);

		//最終座標を返す
		return pos;
  };
  // 配列（連想配列）のソート
  LIB.prototype.hash_sort = function(val){
    // json化して戻すことで、元データの書き換えを防ぐ
    var hash = JSON.parse(JSON.stringify(val));
    
    // 連想配列処理
    if(typeof hash === "object"){
      var flg = 0;
      for(var i in hash){
        if(typeof hash[i] === "object"){
          hash[i] = JSON.stringify(hashSort(hash[i]));
        }
        flg++;
      }
      if(flg <= 1){console.log(hash);
        return JSON.stringify(hash)}
      if(typeof hash.length === "undefined"){
        var keys = Object.keys(hash).sort();
        var newHash = {};
        for(var i=0; i<keys.length; i++){
          newHash[keys[i]] = hash[keys[i]];
        }
        return newHash;
      }
      else{
        hash.sort(function(a,b){
          if( a < b ) return -1;
          if( a > b ) return 1;
          return 0;
        });
        return hash;
      }
    }
    // その他タイプはそのまま返す
   else{
      return hash;
    }
  }
  // ２つのハッシュデータの同一比較
  LIB.prototype.hash_compare = function(data1 , data2){
    data1 = this.hash_sort(data1);
    data2 = this.hash_sort(data2);
    if(JSON.stringify(data1) === JSON.stringify(data2)){
      return true;
    }
    else{
      return false;
    }
  };
  LIB.prototype.numberFormat3_integer = function(num){
    num = String(num);
    var tmpStr = "";
    while (num != (tmpStr = num.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2"))){num = tmpStr;}
    return num;
  };
  return LIB;
})()