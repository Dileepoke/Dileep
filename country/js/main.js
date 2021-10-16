var world_map;
var allowedArr=[];
var blockedArr=[];

function hash_param(name){

	if(window.location.hash){
		var regex = new RegExp(name + "=([^&#]*)");
		var matches = regex.exec(window.location.hash);
		
		if(matches){
			return matches[1];
		}
	}
	
	return false;
}

function gen_colors(codes, allowed){

	var color_allowed = "#cecbca";
    var color_blocked = "#FF4500";

	var colors = {};
	
	var temp = [];	

	for(var code in world_map.regions){
		
		if(codes.indexOf(code) > -1){
			colors[code] = allowed ? color_allowed : color_blocked;
			if(allowed)
			 	allowedArr.push(world_map.regions[code].config.name);
			else
			 	blockedArr.push(world_map.regions[code].config.name);
		} else {
			colors[code] = allowed ? color_blocked : color_allowed;
			if(allowed)
				blockedArr.push(world_map.regions[code].config.name);
			else
				allowedArr.push(world_map.regions[code].config.name);
		}
		
		temp.push(code);
	}
	
	
	return colors;
}


function form_submit(){
	
	allowedArr=[];
	blockedArr=[];

	var url = $("input[name=youTubeLink]").val();
	
	var video_id = false;
	
	var match = url.match(new RegExp("v=([a-z0-9_-]+)", "gi"));
	var short_yt = url.match(new RegExp("\.be\/([a-z0-9_-]+)", "gi"));
	
	if(url.trim().length == 11){
		video_id = url.trim();
	} else if(match){
		video_id = match[0].substr(2);
	} else if(short_yt){
		video_id = short_yt[0].substr(4);
	} else {
		alert('Invalid YouTube link!');
		return false;
	}
	
	// store it in URL
	window.location.hash = '#url=' + video_id;

var video_url ="https://www.youtube.com/embed/"+video_id+"?autoplay=0&modestbranding=1&autohide=1&showinfo=0&origin=https://yt-country.thekvt.tk/&loop=1";document.getElementById("myIframe").src=video_url;

var thumbnail_url = "http://img.youtube.com/vi/"+video_id+"/maxresdefault.jpg"; document.getElementById("thumbnail").download=thumbnail_url;


	if(video_id){
		$.getJSON('https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id='+video_id+'&key=AIzaSyDPHUDf0GmZDoG-Mhr7iqMDMx0_aF97a3Y', function (data) {
		  if(data.items.length > 0){
                  var item=data.items[0];
                  var colors=[]
                
                  if(item.contentDetails.hasOwnProperty('regionRestriction')){
					  if(item.contentDetails.regionRestriction.hasOwnProperty('blocked'))
							colors = gen_colors(item.contentDetails.regionRestriction.blocked, false);
					  else
					  		colors = gen_colors(item.contentDetails.regionRestriction.allowed, true);
                  }
                  else{
                    colors = gen_colors([], false);
                  }
				
				
				//console.log(allowedArr);
				world_map.series.regions[0].setValues(colors);
				
				var vid_link = $("<a></a>").attr({
					'href': 'https://www.youtube.com/watch?v=' + item.id,
					'target': '_blank'
				}).text(item.snippet.title);
				
				$("#vid_title").html(vid_link);
				$("#blocked").html("");
				$("#allowed").html("");

				for (var key in blockedArr) {
					if (blockedArr.hasOwnProperty(key)) {
						$("#blocked").append(blockedArr[key]+"<br>");
					}
				}

				for (var key in allowedArr) {
					if (allowedArr.hasOwnProperty(key)) {
						$("#allowed").append(allowedArr[key]+"<br>");
					}
				}
				
		  }
		  else{
			alert('Could not get the data for this video... Refresh this page and try again, and if that doesnt work come back later.');
		  }
		
		});
	}
}



function fill(url){

	$("input[name=youTubeLink]").val(url);
	$("form").submit();
	
	return false;
}


$(document).ready(function(){
	
	var options = {
		map: 'world_mill',
		backgroundColor: 'white',//'#D4EAFF',
		container: $('#world-map'),
		regionStyle: {
			initial: { fill: "#7cbbdd" },
			stroke: 'red'
		},
		zoomButtons: true,
		series: {
			regions: [{
				attribute: 'fill'
			}]
		}
	};
	
	//example();
	
	$('#world-map').vectorMap(options);
	
	world_map = $('#world-map').vectorMap('get', 'mapObject');
	
	var url = hash_param('url');
	
	if(url){
		fill(url);
	}

});

$.get("http://ipinfo.io", function (response) {
    $("#ip").html("<b>IP: </b>" + response.ip);
    $("#address").html("<b>Location: </b>" + response.city + ", " + response.region + ", " + response.country);
 }, "jsonp");




