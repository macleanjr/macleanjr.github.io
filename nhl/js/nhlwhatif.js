var easternConferenceStandings = [];
var standingsBuilt = false;
var buildlist = false;


function switchToWest(){

	$('#listofteams').html("");
	standingsBuilt = false;
	$('#standings').html("");
	buildlist = false;

	$.getJSON('standings_west.json?version=5', function(data) {
		if(!buildlist){
			buildlist = true;
			//need to build the list of teams
			$.each(data.teams, function(){
				$('#listofteams').append('<div id="' + this.name + '" class="teamgames"><div style="text-align:center;width:100%;">' + this.name + '</div></div>');
			});
			$.getJSON('games_west.json?version=6', function(data){
				$.each(data.games, function(i,v){
					$('#' + this.home).append('<div id="' + this.home + 'game' + this.gameid + '" class="game nostatus game'+this.gameid+'">' + this.date + '<br/>' + this.away + '</div>');
					$('#' + this.away).append('<div id="' + this.away + 'game' + this.gameid + '" class="game nostatus game'+this.gameid+'">' + this.date + '<br/>' + this.home + '</div>');
				});
			});
		}
		calculateStandings(data.teams);
	});

	$('#conferenceSwitcher').html('<a href="#east" onclick="switchToEast();">Take me back East</a>');

}

function switchToEast(){

	$('#listofteams').html("");
	standingsBuilt = false;
	$('#standings').html("");
	buildlist = false;

	$.getJSON('standings.json?version=5', function(data) {
		if(!buildlist){
			buildlist = true;
			//need to build the list of teams
			$.each(data.teams, function(){
				$('#listofteams').append('<div id="' + this.name + '" class="teamgames"><div style="text-align:center;width:100%;">' + this.name + '</div></div>');
			});
			$.getJSON('games.json?version=6', function(data){
				$.each(data.games, function(i,v){
					$('#' + this.home).append('<div id="' + this.home + 'game' + this.gameid + '" class="game nostatus game'+this.gameid+'">' + this.date + '<br/>' + this.away + '</div>');
					$('#' + this.away).append('<div id="' + this.away + 'game' + this.gameid + '" class="game nostatus game'+this.gameid+'">' + this.date + '<br/>' + this.home + '</div>');
				});
			});
		}
		calculateStandings(data.teams);
	});

	$('#conferenceSwitcher').html('<a href="#west" onclick="switchToWest();">Take me out West</a>');



}

$(document).ready(function(){

$("body").disableSelection(); //so it's not annoying when clicking fast.

$(document).click(function(event){

  var div = $(event.target);

  if($(event.target).hasClass("game")){
		var gameid;
		var classes = $(div).attr("class").split(" ");
		for(var i=0;i<classes.length;i++){
			if(classes[i] != "game" && classes[i] != "win" && classes[i] != "lose" && classes[i] != "win-overtime" && classes[i] != "lose-overtime" && classes[i] != "lose-shootout" && classes[i] != "win-shootout" && classes[i] != "nostatus"){
				gameid = classes[i];
			}
		}
		//console.log("game id is : " + gameid);
		var otherdiv;
		$('.' + gameid).each(function(){
			if($(this).attr('id') != $(div).attr('id')){
				otherdiv = $(this);
			}
		});


		if($(div).hasClass("nostatus")){
			$(div).removeClass("nostatus").addClass("win");
			$(otherdiv).removeClass("nostatus").addClass("lose");

			//need to add 2 points to the winner
			var winner = $(div).parent().attr('id');
			$.each(easternConferenceStandings, function(){
				if(this.name == winner){

					var points = this.points;
					this.points = parseInt(this.points) + 2;
					//also add one to row
					this.row = parseInt(this.row) + 1;
					//add one to game played
					this.gp = parseInt(this.gp) + 1;

				}
			});
			//add a gp to the loser
			var loser = $(otherdiv).parent().attr('id');
			$.each(easternConferenceStandings, function(){
				if(this.name == loser){
					this.gp = parseInt(this.gp) + 1;
				}
			});
			
		}	
		else if($(div).hasClass("win")){
			$(div).removeClass("win").addClass("win-overtime");
			$(otherdiv).removeClass("lose").addClass("lose-overtime");
			//need to add 1 point to the loser
			var loser = $(otherdiv).parent().attr('id');
			$.each(easternConferenceStandings, function(){
				if(this.name == loser){
					var points = this.points;
					this.points = parseInt(this.points) + 1;
					
				}
			});
		}
		else if($(div).hasClass("win-overtime")){
			$(div).removeClass("win-overtime").addClass("win-shootout");
			$(otherdiv).removeClass("lose-overtime").addClass("lose-shootout");
			//need to remove 1 from row
			var thisguy = $(div).parent().attr('id');
			$.each(easternConferenceStandings, function(){
				if(this.name == thisguy){
					this.row = parseInt(this.row) - 1;
				}
			});

		}
		else if($(div).hasClass("win-shootout")){
			$(div).removeClass("win-shootout").addClass("lose");
			$(otherdiv).addClass("win").removeClass("lose-shootout");
			
			//need to add 1 point to the former loser andd subtract two from former winner
			//also need to add 1 to row of the other guy
			var thisguy = $(div).parent().attr('id');
			$.each(easternConferenceStandings, function(){
				if(this.name == thisguy){
					var points = this.points;
					this.points = parseInt(this.points) - 2;
				}
			});
			var otherguy = $(otherdiv).parent().attr('id');
			$.each(easternConferenceStandings, function(){
				if(this.name == otherguy){
					var points = this.points;
					this.points = parseInt(this.points) + 1;
					this.row = parseInt(this.row) + 1;

				}
			});
		}
		else if($(div).hasClass("lose")){
			$(div).removeClass("lose").addClass("lose-overtime");
			$(otherdiv).removeClass("win").addClass("win-overtime");
			//need to add 1 point to the former loser andd subtract two from former winner
			var thisguy = $(div).parent().attr('id');
			$.each(easternConferenceStandings, function(){
				if(this.name == thisguy){
					var points = this.points;
					this.points = parseInt(this.points) +1;
				}
			});
		}
		else if($(div).hasClass("lose-overtime")){
			$(div).removeClass("lose-overtime").addClass("lose-shootout");
			$(otherdiv).removeClass("win-overtime").addClass("win-shootout");
			//remove 1 from row of the other guy
			var otherguy = $(otherdiv).parent().attr('id');
			$.each(easternConferenceStandings, function(){
				if(this.name == otherguy){
					var points = this.points;
					this.row = parseInt(this.row) - 1;
				}
			});
		}
		else if($(div).hasClass("lose-shootout")){
			$(div).removeClass("lose-shootout").addClass("nostatus");
			$(otherdiv).removeClass("win-shootout").addClass("nostatus");
			//need to add 1 point to the former loser andd subtract two from former winner
			var thisguy = $(div).parent().attr('id');
			$.each(easternConferenceStandings, function(){
				if(this.name == thisguy){
					var points = this.points;
					this.points = parseInt(this.points) -1;
					this.gp = parseInt(this.gp) - 1;
				}
			});
			var otherguy = $(otherdiv).parent().attr('id');
			$.each(easternConferenceStandings, function(){
				if(this.name == otherguy){
					var points = this.points;
					this.points = parseInt(this.points) -2;
					this.gp = parseInt(this.gp) - 1;
				}
			});
		}

		$.each(easternConferenceStandings, function(){
			
		});


		calculateStandings(easternConferenceStandings);
	}

});


$.getJSON('standings.json?version=1', function(data) {
	if(!buildlist){
		buildlist = true;
		//need to build the list of teams
		$.each(data.teams, function(){
			$('#listofteams').append('<div id="' + this.name + '" class="teamgames"><div style="text-align:center;width:100%;">' + this.name + '</div></div>');
		});
	}
	calculateStandings(data.teams);
});


$.getJSON('games.json?version=2', function(data){
	$.each(data.games, function(i,v){
		$('#' + this.home).append('<div id="' + this.home + 'game' + this.gameid + '" class="game nostatus game'+this.gameid+'">' + this.date + '<br/>' + this.away + '</div>');
		$('#' + this.away).append('<div id="' + this.away + 'game' + this.gameid + '" class="game nostatus game'+this.gameid+'">' + this.date + '<br/>' + this.home + '</div>');
	});
});





});
function sortTeams(){

	$.each(easternConferenceStandings, function(){
		//console.log(this.rank);
		var pixels = (this.rank-1)*30+10;
		$('#'+this.name+'rank').animate({top: pixels+"px"}, 500, function(){});
	});
}

function calculateStandings(theStandings){

	easternConferenceStandings = [];
	var standings = theStandings;
	var northeast, northeastI, southeast, southeastI, atlantic = null, atlanticI = null;
	$.each(standings, function(i,v){
		if(this.division == "northeast"){
			if(northeast == null){
				northeast = this;
				northeastI = i;
			}
			else if(this.points > northeast.points){
				northeast = this;
				northeastI = i;
			}
			else if(this.points == northeast.points){
				if(northeast.gp > this.gp){
					northeast = this;
					northeastI = i;
				}
				else if(northeast.gp < this.gp){
					//do nothing
				}
				else if(this.row > northeast.row){
					northeast = this;
					northeastI = i;
				}
				else if(this.row == northeast.row){
					//well gee, I ain't going that far
					northeast = this;
					northeastI = i;
				}
			}
		}
		else if(this.division == "southeast"){
			if(southeast == null){
				southeast = this;
				southeastI = i;
			}
			else if(this.points > southeast.points){
				southeast = this;
				southeastI = i;
			}
			else if(this.points == southeast.points){
				if(southeast.gp > this.gp){
					southeast = this;
					southeastI = i;
				}
				else if(southeast.gp < this.gp){
					//do nothing
				}
				else if(this.row > southeast.row){
					southeast = this;
					southeastI = i;
				}
				else if(this.row == southeast.row){
					//well gee, I ain't going that far
					southeast = this;
					southeastI = i;
				}
			}
		}
		else if(this.division == "atlantic"){
			if(atlantic == null){
				atlantic = this;
				atlanticI = i;
			}
			else if(this.points > atlantic.points){
				atlantic = this;
				atlanticI = i;
			}
			else if(this.points == atlantic.points){
				if(atlantic.gp > this.gp){
					atlantic = this;
					atlanticI = i;
				}
				else if(atlantic.gp < this.gp){
					//do nothing
				}
				else if(this.row > atlantic.row){
					atlantic = this;
					atlanticI = i;
				}
				else if(this.row == atlantic.row){
					//well gee, I ain't going that far
					atlantic = this;
					atlanticI = i;
				}
			}
		}
	});
	$.each(standings, function(i,v){
		if(this.name == atlantic.name)
			standings.splice(i,1);
	});
	$.each(standings, function(i,v){
		if(this.name == northeast.name)
			standings.splice(i,1);
	});
	$.each(standings, function(i,v){
		if(this.name == southeast.name)
			standings.splice(i,1);
	});


	//build the top three
	var topTeams = [];

	topTeams.push(northeast);
	topTeams.push(southeast);
	topTeams.push(atlantic);


	//lets build the standings
	for(var i=0;i<3;i++){
		var topTeam = null;
		var topTeamIndex = null;
		$.each(topTeams, function(i,v){

			if(topTeam == null){
				topTeam = this;
				topTeamIndex = i;
			}
			else if(this.points > topTeam.points){
				topTeam = this;
				topTeamIndex = i;
			}
			else if(this.points == topTeam.points){
				if(topTeam.gp > this.gp){
					topTeam = this;
					topTeamIndex = i;
				}
				else if(topTeam.gp < this.gp){
					//leave the top team
				}
				else if(this.row > topTeam.row){
					topTeam = this;
					topTeamIndex = i;
				}
				else if(this.row == topTeam.row){
					//well gee, I ain't going that far
					topTeam = this;
					topTeamIndex = i;
				}
			}
		});
		if(!standingsBuilt)
			$('#standings').append('<div class="team" id="' + topTeam.name + 'rank">' + topTeam.name + '<div class="points" style="float:right;">' + topTeam.points + '</div></div>');
		else{
			$('#'+topTeam.name+'rank .points').html(topTeam.points);
		}

		topTeams.splice(topTeamIndex,1);
		

		topTeam.rank = i+1;


		easternConferenceStandings.push(topTeam);
	}


	//lets build the standings
	for(var i=0;i<12;i++){

		var topTeam = null;
		var topTeamIndex;

		$.each(standings, function(i,v){
			//console.log("Evaluating team " + this.name);
			if(topTeam == null){
				topTeam = this;
				topTeamIndex = i;
			}
			else if(this.points > topTeam.points){
				topTeam = this;
				topTeamIndex = i;
			}
			else if(this.points == topTeam.points){
				//console.log("comparing " + this.name + "(" + this.gp + ") and " + topTeam.name + "(" + topTeam.gp + ")");
				if(topTeam.gp > this.gp){
					topTeam = this;
					topTeamIndex = i;
				}
				else if(topTeam.gp < this.gp){
					//leave the top team
				}
				else if(this.row > topTeam.row){
					topTeam = this;
					topTeamIndex = i;
				}
				else if(this.row == topTeam.row){
					//well gee, I ain't going that far
					topTeam = this;
					topTeamIndex = i;
				}
			}
		});
		if(!standingsBuilt){
			$('#standings').append('<div class="team" id="' + topTeam.name + 'rank">' + topTeam.name + '<div class="points" style="float:right;">' + topTeam.points + '</div></div>');
			if(i == 4)
				$('#standings').append('<hr style="position:absolute;top:251px;width:245px;margin-top:-3px;margin-bottom:-3px;margin-left:8px;color: #000;background-color: #000;height: 3px;"/>');
		}
		else{
			$('#'+topTeam.name+'rank .points').html(topTeam.points);
		}
		standings.splice(topTeamIndex,1);
		topTeam.rank = i+4;
		easternConferenceStandings.push(topTeam);

	}

	if(!standingsBuilt){
		standingsBuilt = true;
		//$('#standings').append('<div style="position:absolute;top:500px;text-align:left;">Note: Tiebreakers not in effect.<br/>Click on a game to toggle the result.<br/><a href="http://twitter.com/macleanjr">@macleanjr</a><br/>macleajr@gmail.com</div>');
	}
	sortTeams();

}

(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);
