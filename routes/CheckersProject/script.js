var peer = new Peer();
var conn;
var otherPeer = null;
var pieces = [];
var boxes = [];
const position = ["0vmin", "10vmin", "20vmin", "30vmin", "40vmin", "50vmin", "60vmin", "70vmin"];
var posBoxDoubleJump = [];
var myTurn = false;
var gameBoard = [
	[2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
	[2, 0, 2, 0, 2, 0, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 0, 1, 0, 1, 0, 1],
	[1, 0, 1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1, 0, 1]
];

peer.on('open', function(id){
	$('#myId').text("Your PeerJS ID is: " + id);
});

peer.on('connection', function(conn){
	otherPeer = conn.peer;
	$("#connection").hide();
	
	conn.on('data', function(data) {
		switch(data[0]){
			case "start":
				conn = peer.connect(otherPeer);
				break;
			case "move":
				var box = boxes[31 - data[2]];
				var piece = pieces[23 - data[1]];
				piece.move(box);
				myTurn = true;
				switch(checkIfAnybodyWon()){
					case "win":
						endGame("YOU WIN !!");
						$("#close-message").text("");
						conn.close();
						break;
					case "lose":
						endGame("YOU LOSE !!");
						$("#close-message").text("");
						conn.close();
						break;
				}
				break;
			case "jump":
				var box = boxes[31 - data[2]];
				var piece = pieces[23 - data[1]];
				var pieceRem = pieces[23 - data[3]];
				pieceRem.remove();
				piece.move(box);
				switch(checkIfAnybodyWon()){
					case "win":
						endGame("YOU WIN !!");
						$("#close-message").text("");
						conn.close();
						break;
					case "lose":
						endGame("YOU LOSE !!");
						$("#close-message").text("");
						conn.close();
						break;
				}
				if(!data[4])
					myTurn = true;
				break;
			case "win":
				endGame("YOU WIN !!");
				$("#close-message").text("");
				break;
		}
	});

	conn.on('close', function() {
		$('div.boxes').css('opacity', '0');
		$('div.pieces').css('opacity', '0');
		$("#close-message").show();
		myTurn = false;
	});
});

$(document).ready(function() {
	$('#connect').click(function() {
		otherPeer = $('#otherId').val();
		conn = peer.connect(otherPeer);

		conn.on('open', function() {
			alert("Connected");
			$("#connection").hide();
			myTurn = true;
			conn.send(["start"]);
		});
	});

	$('#undo').click(function() {
		peer.destroy();
	});
});

function Piece(element, pos, player) {
    this.element = element;
    this.pos = pos;
    this.player = player;
	this.isKing = false;
	
	this.makeKing = function () {
      this.element.css("backgroundImage", "url('img/king" + this.player + ".png')");
      this.isKing = true;
    }
	
    this.move = function (box) {
		this.element.removeClass('selected');
		gameBoard[this.pos[0]][this.pos[1]] = 0;
		this.pos = [box.pos[0], box.pos[1]];
		gameBoard[box.pos[0]][box.pos[1]] = player;
		
		this.element.css('top', position[this.pos[0]]);
		this.element.css('left', position[this.pos[1]]);
		
		if (!this.isking && (this.pos[0] == 0 || this.pos[0] == 7))
			this.makeKing();
    };
	
	this.remove = function () {
		this.element.css("display", "none");
		gameBoard[this.pos[0]][this.pos[1]] = 0;
		this.pos = [];
	}

	this.keepSelected = function(){
		this.element.addClass('selected');
	}

}

function Box(element, pos) {
	this.element = element;
	this.pos = pos;
}

function endGame(message){
	$('div.boxes').css('opacity', '0');
	$('div.pieces').css('opacity', '0');
	$("#end-message").show();
	$("#end-message").text(message);
	myTurn = false;
}

function checkIfAnybodyWon() {
	counterPlayer1 = 0;
	counterPlayer2 = 0;
	player1Blocked = true;
	player2Blocked = true;
	
	for(let i = 0; i < 8; i++){
		for(let j = 0; j< 8; j++){
			if(gameBoard[i][j] == 1)
				counterPlayer1+=1;
			else if(gameBoard[i][j] == 2)
				counterPlayer2+=1;
		}
	}

	if(counterPlayer1 == 0)
		return "lose"
	else if(counterPlayer2 == 0)
		return "win"
	else{
		for(let i = 0; i < 8; i++){
			for(let j = 0; j < 8; j++){
				if(gameBoard[i][j] == 1){
					for (let pieceIndex in pieces) {
						if (pieces[pieceIndex].pos[0] == i && pieces[pieceIndex].pos[1] == j) {
							for(let boxIndex in boxes){
								if(movement_possible(pieces[pieceIndex], boxes[boxIndex]) != false){
									player1Blocked = false;
								}						
							}							
						}	
					}
				}
			}
		}

		if(player1Blocked){
			conn = peer.connect(otherPeer);
			conn.on('open', function() {
				conn.send(["win"]);
			});
			return "lose";
		}
		else
			return "nobady";
	}
}

function movement_possible(piece, box) {
	if(!piece.isKing){
		if(gameBoard[box.pos[0]][box.pos[1]] == 0){
			if(piece.pos[0] - 1 == box.pos[0] && (piece.pos[1] + 1 == box.pos[1] || piece.pos[1] - 1 == box.pos[1]))
				return "single";
			else if(piece.pos[0] - 2 == box.pos[0] && piece.pos[1] + 2 == box.pos[1] && gameBoard[piece.pos[0] - 1][piece.pos[1] + 1] == 2){
				for (let pieceIndex in pieces) {
						if (pieces[pieceIndex].pos[0] == (piece.pos[0] - 1) && pieces[pieceIndex].pos[1] == (piece.pos[1] + 1) ) {
							if(!pieces[pieceIndex].isKing)
								return "jumpR";
							break;
						}
					}
			}
			else if(piece.pos[0] - 2 == box.pos[0] && piece.pos[1] - 2 == box.pos[1] && gameBoard[piece.pos[0] - 1][piece.pos[1] - 1] == 2){
				for (let pieceIndex in pieces) {
						if (pieces[pieceIndex].pos[0] == (piece.pos[0] - 1) && pieces[pieceIndex].pos[1] == (piece.pos[1] - 1) ) {
							if(!pieces[pieceIndex].isKing)
								return "jumpL";
							break;
						}
					}
			}
		}
	}
	else{
		if(gameBoard[box.pos[0]][box.pos[1]] == 0){
			if((piece.pos[0] - 1 == box.pos[0] || piece.pos[0] + 1 == box.pos[0]) && (piece.pos[1] + 1 == box.pos[1] || piece.pos[1] - 1 == box.pos[1]))
				return "single";
			else if(piece.pos[0] - 2 == box.pos[0] && piece.pos[1] + 2 == box.pos[1] && gameBoard[piece.pos[0] - 1][piece.pos[1] + 1] == 2)
				return "jumpR";
			else if(piece.pos[0] - 2 == box.pos[0] && piece.pos[1] - 2 == box.pos[1] && gameBoard[piece.pos[0] - 1][piece.pos[1] - 1] == 2)
				return "jumpL";
			else if(piece.pos[0] + 2 == box.pos[0] && piece.pos[1] - 2 == box.pos[1] && gameBoard[piece.pos[0] + 1][piece.pos[1] - 1] == 2)
				return "jumpBackL";
			else if(piece.pos[0] + 2 == box.pos[0] && piece.pos[1] + 2 == box.pos[1] && gameBoard[piece.pos[0] + 1][piece.pos[1] + 1] == 2)
				return "jumpBackR";
		}
	}
	return false;
}

function canDoubleJump (piece){
	try{
		posBoxDoubleJump = [];
		if(!piece.isKing){
			if(gameBoard[piece.pos[0]-1][piece.pos[1]-1] == 2 && gameBoard[piece.pos[0]-2][piece.pos[1]-2] == 0){
				for (let pieceIndex in pieces) {
					if (pieces[pieceIndex].pos[0] == (piece.pos[0] - 1) && pieces[pieceIndex].pos[1] == (piece.pos[1] - 1) ) {
						if(!pieces[pieceIndex].isKing)
							posBoxDoubleJump.push([piece.pos[0]-2,piece.pos[1]-2]);
						break;
					}
				}
			}
			if(gameBoard[piece.pos[0]-1][piece.pos[1]+1] == 2 && gameBoard[piece.pos[0]-2][piece.pos[1]+2] == 0){
				for (let pieceIndex in pieces) {
					if (pieces[pieceIndex].pos[0] == (piece.pos[0] - 1) && pieces[pieceIndex].pos[1] == (piece.pos[1] + 1) ) {
						if(!pieces[pieceIndex].isKing)
							posBoxDoubleJump.push([piece.pos[0]-2,piece.pos[1]+2]);
						break;
					}
				}
			}
		}
	    else{
			if(gameBoard[piece.pos[0]-1][piece.pos[1]-1] == 2 && gameBoard[piece.pos[0]-2][piece.pos[1]-2] == 0)
				posBoxDoubleJump.push([piece.pos[0]-2,piece.pos[1]-2]);
			if(gameBoard[piece.pos[0]-1][piece.pos[1]+1] == 2 && gameBoard[piece.pos[0]-2][piece.pos[1]+2] == 0)
				posBoxDoubleJump.push([piece.pos[0]-2,piece.pos[1]+2]);
			if(gameBoard[piece.pos[0]+1][piece.pos[1]-1] == 2 && gameBoard[piece.pos[0]+2][piece.pos[1]-2] == 0)
				posBoxDoubleJump.push([piece.pos[0]+2,piece.pos[1]-2]);
			if(gameBoard[piece.pos[0]+1][piece.pos[1]+1] == 2 && gameBoard[piece.pos[0]+2][piece.pos[1]+2] == 0)
				posBoxDoubleJump.push([piece.pos[0]+2,piece.pos[1]+2]);
	    }

	  if(posBoxDoubleJump.length == 0)
		return false;
	  else
		return true;
	}
	catch(error){
		return false;
	}
}

function checkIfClickable (box){
	if(posBoxDoubleJump.length != 0){
		for (let pos in posBoxDoubleJump){
			if(box.pos[0] == posBoxDoubleJump[pos][0] && box.pos[1] == posBoxDoubleJump[pos][1])
				return true;
		}
	}
	else
		return true;

	return false;
}


window.onload = function () {

	var boxesElement = $('div.boxes');
	$("#close-message").hide();

	var countBox = 0;
	var countPiece = 0;

	for(let i = 0; i<8; i++){
		if(i%2 == 0)
			for(let j = 0; j<8; j+=2){
				boxesElement.append("<div class='box' id='box" + countBox + "' style='top:" + position[i] + ";left:" + position[j] + ";'></div>");
				boxes[countBox] = new Box($("#box" + countBox), [i,j]);
				countBox++;
				if(i>=0 && i<3){
					$('div.player2pieces').append("<div class='piece' id='" + countPiece + "' style='top:" + position[i] + ";left:" + position[j] + ";'></div>");
					pieces[countPiece] = new Piece($("#" + countPiece), [i,j], 2);
					countPiece++;
				}
				if(i>=5 && i<8){
					$('div.player1pieces').append("<div class='piece' id='" + countPiece + "' style='top:" + position[i] + ";left:" + position[j] + ";'></div>");
					pieces[countPiece] = new Piece($("#" + countPiece), [i,j], 1);
					countPiece++;
				}
			}
		else
			for(let j = 1; j<8; j+=2){
				boxesElement.append("<div class='box' id='box" + countBox + "' style='top:" + position[i] + ";left:" + position[j] + ";'></div>");
				boxes[countBox] = new Box($("#box" + countBox), [i,j]);
				countBox++;
				if(i>=0 && i<3){
					$('div.player2pieces').append("<div class='piece' id='" + countPiece + "' style='top:" + position[i] + ";left:" + position[j] + ";'></div>");
					pieces[countPiece] = new Piece($("#" + countPiece), [i,j], 2);
					countPiece++;
				}
				if(i>=5 && i<8){
					$('div.player1pieces').append("<div class='piece' id='" + countPiece + "' style='top:" + position[i] + ";left:" + position[j] + ";'></div>");
					pieces[countPiece] = new Piece($("#" + countPiece), [i,j], 1);
					countPiece++;
				}
			}
	}

	$('.piece').on("click", function () {
		if(posBoxDoubleJump.length == 0 && myTurn)
		{
			var piece = pieces[$(this).attr("id")];
			if(piece.player == 1){
				$('.piece').each(function (index) {
					$('.piece').eq(index).removeClass('selected')
				});
				$(this).addClass('selected');
			}
		}
	});

	$('.box').on("click", function () {
		try{
			if(myTurn){
				var boxID = $(this).attr("id").replace(/box/, '');
				var box = boxes[boxID];
				if(checkIfClickable(box)){
					var pieceID = $('.selected').attr("id");
					var piece = pieces[pieceID];
					conn = peer.connect(otherPeer);
					switch(movement_possible(piece, box)){
						case "single":
							piece.move(box);
							myTurn = false;
							conn.on('open', function() {
								conn.send(["move", pieceID,boxID]);
							});
							break;
						case "jumpL":
							for (let pieceIndex in pieces) {
								if (pieces[pieceIndex].pos[0] == (piece.pos[0] - 1) && pieces[pieceIndex].pos[1] == (piece.pos[1] - 1) ) {
									var pieceRemIndex = pieceIndex;
									break;
								}
							}
							
							var pieceToRemove = pieces[pieceRemIndex];
							pieceToRemove.remove();
							piece.move(box);
							
							if(canDoubleJump(piece))
								piece.keepSelected();
							else{
								myTurn = false;
								posBoxDoubleJump = [];
							}
							conn.on('open', function() {
								conn.send(["jump", pieceID,boxID, pieceRemIndex, myTurn]);
							});

							break;
						case "jumpR":
							for (let pieceIndex in pieces) {
								if (pieces[pieceIndex].pos[0] == (piece.pos[0] - 1) && pieces[pieceIndex].pos[1] == (piece.pos[1] + 1) ) {
									var pieceRemIndex = pieceIndex;
									break;
								}
							}

							var pieceToRemove = pieces[pieceRemIndex];
							pieceToRemove.remove();
							piece.move(box);

							if(canDoubleJump(piece))
								piece.keepSelected();
							else{
								myTurn = false;
								posBoxDoubleJump = [];
							}

							conn.on('open', function() {
								conn.send(["jump", pieceID,boxID, pieceRemIndex, myTurn]);
							});
							
							break;
						case "jumpBackL":
							for (let pieceIndex in pieces) {
								if (pieces[pieceIndex].pos[0] == (piece.pos[0] + 1) && pieces[pieceIndex].pos[1] == (piece.pos[1] - 1) ) {
									var pieceRemIndex = pieceIndex;
									break;
								}
							}

							var pieceToRemove = pieces[pieceRemIndex];
							pieceToRemove.remove();
							piece.move(box);

							if(canDoubleJump(piece))
								piece.keepSelected();
							else{
								myTurn = false;
								posBoxDoubleJump = [];
							}

							conn.on('open', function() {
								conn.send(["jump", pieceID,boxID, pieceRemIndex, myTurn]);
							});

							break;
						case "jumpBackR":
							for (let pieceIndex in pieces) {
								if (pieces[pieceIndex].pos[0] == (piece.pos[0] + 1) && pieces[pieceIndex].pos[1] == (piece.pos[1] + 1) ) {
									var pieceRemIndex = pieceIndex;
									break;
								}
							}

							var pieceToRemove = pieces[pieceRemIndex];
							pieceToRemove.remove();
							piece.move(box);

							if(canDoubleJump(piece))
								piece.keepSelected();
							else{
								myTurn = false;
								posBoxDoubleJump = [];
							}

							conn.on('open', function() {
								conn.send(["jump", pieceID,boxID, pieceRemIndex, myTurn]);
							});
							
							break;
					}

					switch(checkIfAnybodyWon()){
						case "win":
							endGame("YOU WIN !!");
							$("#close-message").text("");
							break;
						case "lose":
							endGame("YOU LOSE !!");
							$("#close-message").text("");
							break;
					}
				}
			}
		}
		catch(error){}
	});
}
