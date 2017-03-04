$(document).ready(function(){
	$(".circle").flip({
    	trigger: 'manual'
	});
	$("#startBtn").click(function(){
		console.log("whatip");		
		$(".circle").flip(true);
	});

	$("#nextBtn").click(function(){
	    if( $("#nameField").val().length > 0){
	    	Cookies.set('userName', $("#nameField").val());
	    	$(".front").empty();
	    	$(".circle").flip(false);
	    }
	    $.ajax({
	      type: "GET",
	      url: 'http://localhost:3000/api/fit/authorize',
	      success: function(data){
	      	$(".front").append("<p id='textForm' style='position: absolute; margin-top:130px; margin-left:100px; font-size:38px;'>Connect Your Fitbit</p><button id='nextBtn' style='margin-top:280px; margin-left: 150px; padding: 13px; font-size:large; font-weight:bold;'><a href = '" + data + "'>Login</a></button>");
	      }
	    });
	    

	});

	

});