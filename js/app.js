


MadDoc = {

	_element : '#apidoc',

	init : function(){
		$('#api-container').append(' <div id="apidoc"></div>');
		MadDoc.render();
	},

	title : function(data){
		var headerTemplate = '<ul class="no-style">'+
							 '<li><h1> <%= name %> </h1></li>'+
							 '</ul>';
		var template = _.template(headerTemplate)
		return template(data);		
	},

	requests : function(data){				
		var reqTemplate = 		
		'<ul class="no-style requests">'+
			'<% for(var request in requests){%>'+
				'<li class="request <%=requests[request].method.toLowerCase()%>">'+
					'<h1 class="name"> <%= requests[request].name %> </h1>'+
					'<div class="description"> <%= requests[request].description %> </div>'+		
					'<div class="api <%=requests[request].method.toLowerCase()%>">'+			
						'<div class="url">  <span class="type"> <%=requests[request].method%> </span> <%= requests[request].url %>  </div>'+
						'<h4> Headers </h4>'+
						'<div class="headers"> <% '+
							'var lines = s.lines(requests[request].headers); '+
							' for( var l in lines ){'+
								'lines[l] = "<b>"+lines[l].replace(":","</b>:")+"<br/>";'+
							'} '+
						'%>'+
						'<%= s.wrap(s.replaceAll(lines,",",""),{width : 60, cut : true}) %></div>'+
						'<% if (requests[request].data != ""){ %>'+
							'<h4> Sample Data </h4>'+
							'<h6> <pre class="prettyprint"><%= requests[request].data %> </pre></div>'+
						'<% } %>'+
					'</div>'+
				'</li>'+
			'<%}%>'+
		'</ul>';
		
		var template = _.template(reqTemplate);				
		return template(data);
	},

	validate : function(){
		var apiData = this.apiData;		
			
		if( apiData && apiData.requests && apiData.requests.length &&	apiData.requests[0].name){			
			return true;
		}

		else{
			this.error(true);			
			return false;
		}
	},

	error : function(show){
		if(show){
			$('.error').show('fade');
			setTimeout(function(){
				$('.error').hide('slow');
			},3000)
		}
		else{
			$('.error').hide();
		}
	},

	bindFileChangeEvent : function(){		
		var reader = new FileReader();
		var _this = this;
		this.apiData = {};
		reader.onloadend = function(evt) {			
		    if (evt.target.readyState == FileReader.DONE) { // DONE == 2		    			    			    	
		    	_this.apiData = JSON.parse(evt.target.result);	
		    	_this.buildDoc();
		  }
		};

		$('#apis').on('change', function(){
			reader.readAsText($(this)[0].files[0]);
		});
	},

	buildDoc : function(){					
		if(this.validate()){
			$('#api-container').show();
			$(this._element).append(MadDoc.title(this.apiData));
			$(this._element).append(MadDoc.requests(this.apiData));					
			$('#download-window').show();
			$('#file-upload').hide();

			this.prepareScreenshot();
		}
		else{
		 	this.error(true);
		}
		
	},

	bindBuildDoc : function(){
		var _this = this;
		$('#buildDoc').on('click', function(){			
			_this.apiData = JSON.parse($('#jsonText').val());
			console.log(_this.apiData);
			_this.buildDoc();
		});
	},

	prepareScreenshot : function(){
		$('#api-container').show();
		html2canvas($('#api-container')).then(function(canvas) {		
			console.log(canvas);
			 $('#download-link').attr('href',canvas.toDataURL());
			 $('#download-link').attr('download','documentation.jpg');
			 $('#download-link').trigger('click');
			 $('#download-link').addClass('button');			 
			 $('#file-upload').hide();
			 $('#download-window').show();
		});
	},

	

	render : function(){

		this.bindFileChangeEvent();		
		this.bindBuildDoc();
			
	}

	
}


MadDoc.init();