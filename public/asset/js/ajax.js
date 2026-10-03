$$ajax = (function(){
  /**
	* Ajax
	* $$MYNT_AJAX | $$ajax({
	* url:"",					// "http://***"
	* method:"POST",	// POST or GET
	* async:true,			// true or false
	* data:{},				// Object
	* query:{},				// Object
	* querys:[],			// Array
	* header:{}				// Object
	* });
	*/
	var $$ajax = function(options){
    if(!options){return}
		// var ajax = new $$ajax;
		var httpoj = this.createHttpRequest();
		if(!httpoj){return "a";}

		// open メソッド;
		var option = this.setOption(options);

		// 実行
		httpoj.open( option.method , option.url , option.async );

		// requestHeader(open後に実行)
		if(option.requestHeader){
			httpoj.setRequestHeader('Content-Type', option.contentText);
			
		}

		// header登録
		for(var i in option.header){
			console.log(i +"="+ option.header[i]);
			httpoj.setRequestHeader(i , option.header[i]);
		}

		// onload-check
		httpoj.onreadystatechange = function(){
			//readyState値は4で受信完了;
			if (httpoj.readyState==4){
				//コールバック
				if (httpoj.status === 200) {
					option.onSuccess(httpoj.responseText);
				}
				else{
					option.onError(httpoj.responseText);
				}
			}
		};

		// responseType
		if(typeof option.responseType !== "undefined" && option.responseType){
			httpoj.responseType = option.responseType;
		}

		//query整形
		var data = this.setQuery(option);
// console.log(data);

		//send メソッド（クエリ有り）
		if(data.length){
			httpoj.send(data.join("&"));
		}
		// クエリ無し
		else{
			httpoj.send();
		}
		return "hoge";
	};
	
	$$ajax.prototype.dataOption = {
		url:"",
		query:{},				// same-key Nothing
		querys:[],			// same-key OK
		data:{},				// ETC-data event受渡用
		header:{},
		async:true,		// [true:非同期 false:同期]
		method:"POST",	// [POST / GET]
		responseType:"", // 
		// requestHeader : "application/json", // ["application/x-www-form-urlencoded"]
		requestHeader : true,
		contentText : "application/x-www-form-urlencoded",
		// requestHeader : "application/x-www-form-urlencoded", // [""]
		// type:"", // [text/javascript]...
		onSuccess:function(res){},
		onError:function(res){}
	};
	$$ajax.prototype.option = {};
	$$ajax.prototype.createHttpRequest = function(){
		//Win ie用
		if(window.ActiveXObject){
			//MSXML2以降用;
			try{return new ActiveXObject("Msxml2.XMLHTTP")}
			catch(e){
				//旧MSXML用;
				try{return new ActiveXObject("Microsoft.XMLHTTP")}
				catch(e2){return null}
			}
		}
		//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
		else if(window.XMLHttpRequest){return new XMLHttpRequest()}
		else{return null}
	};
	$$ajax.prototype.setOption = function(options){
		var option = {};
		for(var i in this.dataOption){
			if(typeof options[i] != "undefined"){
				option[i] = options[i];
			}
			else{
				option[i] = this.dataOption[i];
			}
		}
		return option;
	};
	$$ajax.prototype.setQuery = function(option){
		var data = [];
		if(typeof option.query != "undefined"){
			for(var i in option.query){
				data.push(i+"="+encodeURIComponent(option.query[i]));
			}
		}
		if(typeof option.querys != "undefined"){
			for(var i=0;i<option.querys.length;i++){
				if(typeof option.querys[i] == "Array"){
					data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
				}
				else{
					var sp = option.querys[i].split("=");
					data.push(sp[0]+"="+encodeURIComponent(sp[1]));
				}
			}
		}
		return data;
	};
  return $$ajax;
})();
