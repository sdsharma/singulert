$(document).ready(function(){
	$(".circle").flip({
    	trigger: 'manual'
	});
	$("#startBtn").click(function(){
		
		$(".circle").flip(true);
	});

	$("#nextBtn").click(function(){
	    if( $("#nameField").val().length > 0){	    	
	    	$(".front").empty();
	    	$(".circle").flip(false);
	    }
	});

	$(".Login").click(function(){
		$(".front").empty();
		$(".circle").flip(false);
		$(".front").append("<div id='circleForm'><p id='login'>Login</p><div id='loginError' class='alert alert-danger error'><strong>Please try again with correct username and password</strong></div><div class='fields'><div class='group'><input id='unameField' type='text' required><span class='highlight'></span><span class='bar'></span><label>Username</label></div><div class='group'><input id='pwField' type='password' required><span class='highlight'></span><span class='bar'></span><label>Password</label></div></div><button id='loginbtn'>Login</button></div>");
		$("#loginError").hide();
		$("#loginbtn").click(function(){
			$.ajax({
		      type: "POST",
		      url: 'http://localhost:3000/api/alert/login',
		      data: {
		      	username: $("#unameField").val(),
		      	password: $("#pwField").val()
		      },
		      success: function(data){		      			      	
		      	if(data == false){
		      		$("#loginError").show();
		      		$("#loginError").fadeOut(3000);

		      	}
		      	else{
		      		Cookies.set('userName', $("#unameField").val());
		      		$.ajax({
		      			type: "GET",
		      			url: 'http://localhost:3000/api/alert/userdata/' + Cookies.get('userName'),
		      			success: function(userdata){
		      				Cookies.set('userData', JSON.stringify(userdata));
		      			} 
		      		});		      		
		      	}
		      }
		    });
		});		
	});



	$(".Signup").click(function(){
		$(".front").empty();
		$(".circle").flip(false);
		$(".front").append("<div id='circleForm'><p id='signup'>Sign up</p><div id='signupError' class='alert alert-danger error'><strong>Please use a User Name that has not been used.</strong></div><div class='fields'><div class='group'><input id='unameField' type='text' required><span class='highlight'></span><span class='bar'></span><label>Username</label></div><div class='group'><input id='pwField' type='password' required><span class='highlight'></span><span class='bar'></span><label>Password</label></div></div><button id='signupbtn'>Join</button></div>");
		$("#signupError").hide();
		$("#signupbtn").click(function(){
			$.ajax({
		      type: "POST",
		      url: 'http://localhost:3000/api/alert/checkuser',
		      data: {
		      	username: $("#unameField").val()
		      },
		      success: function(data){
		      	if(data == true){
		      		Cookies.set('userName', $("#unameField").val());		      		
		      		$.ajax({
				      type: "POST",
				      url: 'http://localhost:3000/api/alert/createuser',
				      data: {
				      	username: $("#unameField").val(),
				      	password: $("#pwField").val()
				      }
				    });
		      		$(".back").empty();
					$(".circle").flip(true);
					$(".back").append("<div class='container'><p id='epic'>Link your Epic account</p><div><button type='button' class='btn btn-success Epic' id='epicbtn'>Link</button></div></div>");
					$("#epicbtn").click(function(){
						$.ajax({
					      type: "POST",
					      url: 'http://localhost:3000/api/alert/userprofile',
					      data: {
					      	username: Cookies.get('userName')
					      },
					      success: function(data){
					      	Cookies.set('userData', JSON.stringify(data));
					      }
					    });
					});	      	
		      	}	
		      	else{
					$("#signupError").show();
		      		$("#signupError").fadeOut(3000);
		      	}
		      }
		    });
		});	
	});

	

});