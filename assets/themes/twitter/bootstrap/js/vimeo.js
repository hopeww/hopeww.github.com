//John Resig micro templates..
(function(){
  var cache = {};
  this.tmpl = function tmpl(str, data){
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :

      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

(function(GLOBAL, $){
	
	var ns, _ops, vidArr, pages, manual,
		//jq objects
		win, content, container, title, screen, screen_top, iframe, description, gallery, thumbs, search_info;
	
		
	ns = "vimeo";
	//default options passed 
	_ops = {
		resource : 'channel', 
		id : 'vimeohq'
	}
	
	/*
	@resource & id options set with $.vimeo.init({ 
					resource : 'channel', 
					id : <place id like 23432423 or named channel/album here>
		});
	*/
	
	vidArr = [];
	pages = 1;
	manual = false;
	
	
	function _init(){
		win = $(window);
		content = $("#content");
		container = content.find('#video-container');
			title = container.find("#title");
			description = container.find("#description");
			screen = container.find("#screen");
			screen_top = container.offset().top;
			iframe = screen.find("iframe");
		gallery = content.find("#gallery");
		thumbs = gallery.find("#thumbs");
		searchInfo = content.find("#search-info");
		
		sizeScreen();
		//hide the container
		container.addClass("hidden");
		getVideos();	
	}
	
	function init(ops){
		ops = ops || {};
		$.extend(_ops, ops);
		_init();
		win.resize(sizeScreen).bind('hashchange',controller);
		thumbs.delegate("form","submit",updateVidInfo);
		ipad();
		search();
	}
	
	function ipad(){
		var userAgent = navigator.userAgent.toLowerCase();
		if(/ipad/.test(userAgent)){
			gallery.addClass('ipad');
		}
	}
	
	function sizeScreen(){
		var contentWidth = container.width() - 10;
		screen.css({
			height : (contentWidth / 1.777)
		});
	}
	
	function createVideos(filtered_data, id){
		var hash, html;
		
		html = "";
		data = (filtered_data || vidArr).slice().reverse();
		
		l = data.length;
		
		while(l--){
			html += tmpl("thumb_tmpl",data[l]);
		}
		html = html || tmpl("no_videos_tmpl", {});
		
		thumbs.html(html);
		
		if(filtered_data){
			return container.addClass("hidden");
		}
		
		if(id){
			return thumbs.find("#"+id).trigger("submit");
		}
		
		//otherwise click on the first video
		return thumbs.find('form').eq(0).trigger("submit");
	
	}
	
	function controller(){
		var hash, paths;
		
		if(manual){
			return false;
		}
		
		hash = (this.location.hash.replace("#", "")).replace(/\+/g, " ");
		hash = decodeURIComponent(hash);
		
		//(/\/search\/\w+/g).test(hash);
		paths = hash.split("/search/"); 
		
		if(paths[1]){
			return filter(paths[1]);
		}
		
		toggleSearchString();
		//test whether or not this is an id
		if( (/\d+/g).test(paths[0]) ){
			return createVideos(false, paths[0]);
		}
		
		return createVideos();
		
	}
	
	function validateResources(){
		if(!_ops.resource || !_ops.id){
			return $.error("resource or id is missing!");
		}
	}
	
	function getVideos(){
		var url, _url;
		
		url = "http://vimeo.com/api/v2/"+_ops.resource+"/"+_ops.id+"/videos.json?callback=?";
		if(pages > 3){
			return controller.call(GLOBAL);
		}
		
		
		_url = url + "&page="+pages;		
		$.getJSON(_url, function(data){
			vidArr = vidArr.concat(data);
			pages++;
			getVideos();
		});
	}
	
	function updateVidInfo(){
		var vidObj, id;
		
		id = this.id;
		//todo use filter instead? But IE doesn't support filter
		vidObj = $.grep(vidArr,function(n){
			return (n["id"] === (1 * id) );
		});
		
		vidObj = vidObj[0] || vidArr[0];
		manual = true;
		window.location.hash = id;
		setTimeout(function(){
			manual = false;	
		}, 500);
		
		title.html(vidObj["title"]);
		description.html(vidObj["description"]);
		container.removeClass("hidden");
		sizeScreen();
		window.scrollTo(0, screen_top - 60 );	
		return true;
	}
	
	function filter(val){
		var data;

		val = val.toLowerCase();		
		data = vidArr.slice();
		data = $.grep(data, function(n){
			return [n.tags, n.title, n.description].join(" ").toLowerCase().indexOf(val) !== -1;
		});
		toggleSearchString(val);
		return createVideos(data);
	}
	
	function toggleSearchString(val){
		var _val, action;
		
		_val = val || "";
		action = _val ? "remove" : "add";
		return searchInfo[action+"Class"]('hidden').find("#search-string").text(_val);
	}
	
	function search(){
		var _search, go;
		
		_search = $("#search");
		go = function(){
			var val = _search.val();
			if(val){
				location.hash = "/search/"+val;
				return true;
			}
			
		};
		_search
		.bind("keydown", function(e){
			if(e.which !== 13){
				return true;
			}
			e.preventDefault();
			e.stopPropagation();
			
			return go();
		})
		
		$("#search-button").click(go);
	}
	
	//export
	$[ns] = {
		init : init
	};
	
	
})(window, window.jQuery);




