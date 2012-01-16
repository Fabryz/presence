/*
*  Author: Fabrizio Codello
*  Name: Experimenting multiplayer mouse chat, using Node.js, Express.js and Socket.io
*
*/

$(document).ready(function() {
	var socket = new io.connect(window.location.href);
	
	var chatMsg = $("#chatMsg"),
		status = $("#status"),
		nick = $("#nick"),
		users = $("#users ul"),
		online = $("#online"),
		tot = $("#tot");
		
	status.html("Connecting.");
	chatMsg.focus();

	$(document).mousemove(function(e) {
		socket.emit("move", { x: e.pageX, y: e.pageY });
	});	
	
	chatMsg.keydown(function(e) {
		if ((e.keyCode === 13)) { //return
			socket.emit("chat", { msg: chatMsg.val() });

			chatMsg.val('');
		}
	});
	
	/* 
	* Socket stuff	
	*/
	    
    socket.on('connect', function() {
    	status.html("Connected.");
	});
			
	socket.on('disconnect', function() {
		status.html("Disconnected.");
	});
	
	socket.on('nick', function(data) {
    	nick.html(data.nick);
	});
	
	socket.on("tot", function(data) {	
		tot.html(data.tot);
	});
	
	socket.on("users", function(data) {
		users.html('');
		data.users.forEach(function(sessid) {
			users.append('<li><a class="userNick" href="#" title="">'+ sessid +'</a></li>');
		});
	});

	socket.on("chat", function(data) {	
		$("#mouse_"+ data.from +" #msg").html(data.msg)
	});

	socket.on("move", function(data) {
		if ($("#mouse_"+ data.id).length == 0) {
			$('body').append('<div id="mouse_'+ data.id +'" class="mouse"><img src="/img/mouse_pointer.gif" alt="" /><span id="msg"></span></div>');
			if (nick.html() !== data.id) {
				$("#mouse_"+ data.id +" img").show();
			}
		}
		$("#mouse_"+ data.id).css({ left: data.x, top: data.y });
	});

	socket.on("quit", function(data) {
		$("#mouse_"+ data.id).remove();
	});
});
