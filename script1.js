var SOUpdater = { Draw: {} }

SOUpdater.Draw.CreateQuestion = function(){

	var _question;	
	var _vote_count;
	var _answer_count;
	var _view_count; 
	var _question_title;
	var _excerpt;
	var _tags = {};
	var _relativetime;
	var _username;
	var _reputation;
	var _question_timeline_url;
	
	function InstanceConstructor(instance_seed){
		return {
			createQuestionSummary: _createQuestionSummary,
			getQuestion: _getQuestion,
			setter: _setter
		}
	}
	
	function _getTime(relativetime){
		var foo = new Date; // Generic JS date object
		var unixtime_ms = foo.getTime(); // Returns milliseconds since the epoch
		var unixtime = parseInt(unixtime_ms / 1000);
		var timelapse = unixtime-relativetime;
		if(timelapse > 60){
			timelapse = parseInt(timelapse/60);					
			if(timelapse == 1){
				return timelapse+" min ago";
			}
			return timelapse+" mins ago";
		}else{
			return timelapse+" secs ago";
		}		
	}

	function _setter(vote_count,answer_count,view_count,question_title,excerpt,tags,relativetime,username,user_id,reputation,question_timeline_url){
		
		_vote_count =vote_count;
		_answer_count= answer_count;
		_view_count= view_count;
		_question_title= question_title;
		_excerpt= excerpt;
		//_relativetime= relativetime;
		_relativetime= _getTime(relativetime);
		_tags = tags;
		_username= username;
		_user_id= user_id;
		_reputation= reputation;
		_question_timeline_url = question_timeline_url
	}
	
	function createStatsCotainer(){
		statscontainer=document.createElement('div');
			statsarrow=document.createElement('div');
			stats=document.createElement('div');
				status_answered=document.createElement('div');
					strong_answer_count=document.createElement('strong');
				vote=document.createElement('div');
					votes=document.createElement('div');
						voteLabel=document.createElement('div');
						vote_count_post=document.createElement('span');
							strong_vote_count=document.createElement('strong');
			views=document.createElement('div');

		$(statscontainer).addClass('statscontainer');
		$(statsarrow).addClass('statsarrow');
		$(stats).addClass('stats');
		$(status_answered).addClass('status unanswered');
		$(strong_answer_count).addClass('strong-answer-count');
		$(vote).addClass('vote');
		$(votes).addClass('votes');
		$(voteLabel).addClass('voteLabel');		
		$(vote_count_post).addClass('vote-count-post');
		$(strong_vote_count).addClass('strong-vote-count');
		$(views).addClass('views');
		
		$(strong_vote_count).text(_vote_count);
		$(strong_answer_count).text(_answer_count);
		$(views).text(_view_count+" views");
		$(voteLabel).text("votes");
		
		
		$(strong_vote_count).appendTo($(vote_count_post));
		$(vote_count_post).appendTo($(votes));
		$(voteLabel).appendTo($(votes));
		$(votes).appendTo($(vote));
		
		$(status_answered).text("answers");
		$(strong_answer_count).appendTo($(status_answered));		
		
		
		$(vote).appendTo($(stats));
		$(status_answered).appendTo($(stats));
		
		$(statsarrow).appendTo($(statscontainer));		
		$(stats).appendTo($(statscontainer));
		$(views).appendTo($(statscontainer));
		
		return $(statscontainer);
		//$(statscontainer).appendTo('body');
	}
	
	function createSummary(){
		summary=document.createElement('div');
		h3Heading=createh3Heading();
		excerpt=createExcerpt();
		started=createStarted();
		tags =createTags();
		$(summary).addClass('summary');
		
		$(h3Heading).appendTo($(summary));
		$(excerpt).appendTo($(summary));
		$(tags).appendTo($(summary));
		$(started).appendTo($(summary));
		
		return $(summary);
	}
	
	function createh3Heading(){
		h3Heading=document.createElement('h3');
			question_hyperlink=document.createElement('a');
		
		$(question_hyperlink).addClass("question-hyperlink");
		$(question_hyperlink).attr('href','http://stackoverflow.com/'+_question_timeline_url);
		$(question_hyperlink).text(_question_title);
		
		$(h3Heading).addClass("h3Heading");
		
		$(question_hyperlink).appendTo($(h3Heading));
		return $(h3Heading);		
	}
	
	function createTags(){
		var i =0;
		var link="http://stackoverflow.com/questions/tagged/";
		tagsDiv = document.createElement('div');
		$(tagsDiv).attr('id','tagsDiv');
		$.each(_tags,function(key,value){
			tagElement = document.createElement('a');
			$(tagElement).addClass("tags");
			$(tagElement).text(value);
			$(tagElement).attr('href',link+value);
			$(tagElement).appendTo($(tagsDiv));			
		});
		return $(tagsDiv);
	}

	function createExcerpt(){
//		var textExcerpt="So I have seen some questions like this on here, and maybe some of then answered it sufficiently for the person asking, but I still can't quite figure out what I'm supposed to do. Basically, I want ...";
		var textExcerpt=_excerpt;
		excerpt=document.createElement('div');
		$(excerpt).addClass("excerpt");
		textExcerpt = textExcerpt.replace(/undefined/g, ""); 
		$(excerpt).text(textExcerpt);
		return $(excerpt);
	}
	
	function createStarted(){
		started=document.createElement('div');
		userinfo=document.createElement('div');
			user_action_time=document.createElement('div');
				relativetime=document.createElement('span');
			user_gravatar32=document.createElement('div');
				user_link_tag=document.createElement('a');
				image_holder=document.createElement('div');
					image=document.createElement('img');
			user_details=document.createElement('div');
				userlink=document.createElement('a');
				breaktag=document.createElement('br');
				reputation_score=document.createElement('span');
		
		$(started).addClass('started');
		$(userinfo).addClass('user-info');
			$(user_action_time).addClass('user-action-time');
				$(relativetime).addClass('relativetime');
			$(user_gravatar32).addClass('user-gravatar32');
			$(user_details).addClass('user-details');
				$(reputation_score).addClass('reputation-score');
		
		$(user_action_time).text("asked ");
		$(relativetime).appendTo($(user_action_time));
		$(relativetime).text(_relativetime);
		$(image).appendTo($(image_holder));
		$(image).attr('src','http://www.gravatar.com/avatar/48fe4cb59ebbd3e59d0392855f78989f?s=32&amp;d=identicon&amp;r=PG');
		$(image_holder).appendTo($(user_link_tag));
		$(user_link_tag).appendTo($(user_gravatar32));
		$(user_link_tag).attr('href','http://stackoverflow.com/users/'+_user_id);
		$(userlink).appendTo($(user_details));
		$(userlink).text(_username);
		$(breaktag).appendTo($(user_details));
		$(reputation_score).appendTo((user_details));
		$(reputation_score).text(_reputation);
		
		$(user_action_time).appendTo($(userinfo));
		
		$(user_gravatar32).appendTo($(userinfo));
		$(user_details).appendTo($(userinfo));
		
		$(userinfo).appendTo($(started));

		return $(started);
	}

	function _createQuestionSummary(index){
		question_summary=document.createElement('div');
		
		$(question_summary).addClass('question-summary');		
		statscontainer=createStatsCotainer();
		summary=createSummary();
		
		$(statscontainer).appendTo($(question_summary));
		$(summary).appendTo($(question_summary));

		//return $(question_summary);
		_question=$(question_summary);
	}
	
	function _getQuestion(){
		return _question;
	}
	
	return InstanceConstructor;
}();

	
SOUpdater.Draw.Fetcher = function(){
	
	var obj_temp;
	var favTags;
	var PageSize;
	
	function Constructor(){
		return {
			soResponse: _soResponse,
			load_script: _load_script,
			getObj: _getObj,
			setTags: _setTags,
			setPageSize: _setPageSize
		}
	}
	function  _setPageSize(pagesize){
		PageSize = pagesize;
	}
	function _setTags(_favTags){
		favTags = _favTags;
	}
	
	function _getObj(){	
		_load_script('http://api.stackoverflow.com/1.1/questions/?key=uRgW3Xr8U0mbsHciMe9B7g&sort=creation&pagesize=' + PageSize + '&tagged=&jsonp=soResponse&body=true');
		return obj_temp;
	}
	
	function _setObj(obj){
		obj_temp = obj;
	}
	
	function _load_script(src) {
		var script= document.createElement('script');
		script.src = src;
		script.id="jsonpTag";
		document.getElementsByTagName('head')[0].appendChild(script);
		return script; 
	}

	function _soResponse(obj) {
		var loader = new SOUpdater.Draw.Loader;
		_setObj(obj); 
		loader.load(obj);
		loader.taggedInteresting(favTags);
		if($("script#jsonpTag").length > 0){
			$("script#jsonpTag").remove();
		}
	}
	_load_script('http://api.stackoverflow.com/1.1/questions/?key=uRgW3Xr8U0mbsHciMe9B7g&sort=creation&pagesize=' + PageSize + '&tagged=&jsonp=soResponse&body=true');
	return Constructor;
}();

SOUpdater.Draw.Loader = function(){
	
	function Constructor(){
		return{
			load: _load,
			taggedInteresting: _taggedInteresting
		}
	}
	
	function _taggedInteresting(favTags){
		var tempArr = new Array();
		tempArr = favTags;
		var questions = document.getElementsByClassName("summary");
		var bool =false;
		var i=0;
			$.each(questions,function(key,value){
				var tags=$(this).find("#tagsDiv").find("a.tags");
				$.each(tags,function(key,value){
					//var index  = $.inArray($(value).text(),favTags);
					var index = tempArr.indexOf($(value).text());
					if(index != -1){ bool = true; return false;}
				});
				if(bool == true){ $(this).addClass("tagged-interesting"); bool = false;}
			});
	}
	
	function _load(obj){
		var i;
		
		mainbar=document.createElement('div');
		$(mainbar).addClass('mainbar');
		
		var questions = new Array();
		
		for(i=0;i<obj.pagesize;i++){
			var excerpt="";
			var j;
			var questionCreator = new SOUpdater.Draw.CreateQuestion();
			var html = obj.questions[i].body;
			var div = document.createElement("div");
			div.innerHTML = html;
			var e = div.textContent || div.innerText || "";
			e = e.replace(/undefined/g,"");
			for(j=0;j<150;j++){
				if((e[j] == "undefined")){
					break;
				}
				excerpt+= e[j];
				
			}
			excerpt+="...";
			//function _setter(		   vote_count,														answer_count,				  view_count,				   question_title,		   excerpt,				  relativetime,					username,							 user_id,						reputation,						question_timeline_url				){
			questionCreator.setter((obj.questions[i].up_vote_count - obj.questions[i].down_vote_count),obj.questions[i].answer_count,obj.questions[i].view_count,obj.questions[i].title,   excerpt,obj.questions[i].tags,obj.questions[i].creation_date,obj.questions[i].owner.display_name,obj.questions[i].owner.user_id,obj.questions[i].owner.reputation,obj.questions[i].question_timeline_url);
			questionCreator.createQuestionSummary();
			questions[i]=questionCreator.getQuestion();
			$(questions[i]).appendTo($(mainbar));
		}
		
		if($("div.mainbar").length >0){
			$("div.mainbar").remove();
		}
		//$(mainbar).appendTo('body')
		  $(mainbar).appendTo('div#SOContainer')
				  .animate({opacity: "0", left: "+=400"}, 1200)
				  .animate({opacity: "1.0", left: "+=400"}, 1200);
		
		$("div.question-summary").attr("id", function (arr) {
			return arr;
		});
	}	
	return Constructor;
}();

function soResponse(obj){
		var update = new SOUpdater.Draw.Fetcher();
		update.soResponse(obj);
}
