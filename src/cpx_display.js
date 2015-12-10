/*

<one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>



*/

$.noty.defaults = {
    layout: 'center',
    theme: 'defaultTheme', // or 'relax'
    type: 'alert',
    text: '', // can be html or string
    dismissQueue: true, // If you want to use queue feature set this true
    template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
    animation: {
        open: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceInLeft'
        close: {height: 'toggle'}, // or Animate.css class names like: 'animated bounceOutLeft'
        easing: 'swing',
        speed: 500 // opening & closing animation speed
    },
    timeout: 2500, // delay for closing event. Set false for sticky notifications
    force: false, // adds notification to the beginning of queue when set to true
    modal: false,
    maxVisible: 5, // you can set max visible notification for dismissQueue true option,
    killer: false, // for close all notifications before show
    closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
    callback: {
        onShow: function() {},
        afterShow: function() {},
        onClose: function() {},
        afterClose: function() {},
        onCloseClick: function() {},
    },
    buttons: false // an array of buttons
};

//alert - success - error - warning - information - confirmation 
//top - topLeft - topCenter - topRight - center - centerLeft - centerRight - bottom - bottomLeft - bottomCenter - bottomRight

$( ".accordion" ).accordion();

$( ".jselectmenu" ).selectmenu();

/*
$( "#autocomplete" ).autocomplete({
	source: availableTags
});
$( "#radioset" ).buttonset();
$( "#tabs" ).tabs();
$( "#button" ).button();
$( "#datepicker" ).datepicker({
	inline: true
});
$( "#slider" ).slider({
	range: true,
	values: [ 17, 67 ]
});
$( "#progressbar" ).progressbar({
	value: 20
});
$( "#spinner" ).spinner();
$( "#menu" ).menu();
$( "#tooltip" ).tooltip();
// Hover states on the static widgets
$( "#dialog-link, #icons li" ).hover(
	function() {
		$( this ).addClass( "ui-state-hover" );
	},
	function() {
		$( this ).removeClass( "ui-state-hover" );
	}
);


*/

//GUI variables
cpxVar.closeButton = '<img class="closeButton" src="images/close_cross_128.png" style="width:16px;height:16px;">';


CPX.GUI = function (realm) {
    this.realm = realm;
}
CPX.GUI.prototype.init = function () {
	this.playerStats(this.realm);
}

CPX.GUI.prototype.initTextDisplay = function () {
	$("body").prepend('<div id=textDisplay />');
}
CPX.GUI.prototype.clearTextDisplay = function () {
    $("#textDisplay").empty();
}
CPX.GUI.prototype.postTextDisplay = function (html) {
    $("#textDisplay").append(html);
}

CPX.GUI.prototype.clearAll = function () {
	$("#mRightContent").empty();
	$("#displayNav").empty();
	$("#mLeftContent").empty();
	$("#uLocal").empty();
	$("#uActive").empty();
	$("#pOptions").empty();
}
CPX.GUI.prototype.clearMainRight = function () {
    $("#mRightContent").empty();
}
CPX.GUI.prototype.clearMainLeft = function () {
    $("#mLeftContent").empty();
}
CPX.GUI.prototype.postLeft = function (html) {
    this.clearMainLeft();
    $("#mLeftContent").append(html);
}
CPX.GUI.prototype.postRight = function (html) {
	this.clearMainRight();
    $("#mRightContent").append(html);
}

CPX.GUI.prototype.ruinNotice = function (area) 
{
	var html="The people of "+area.name+" know of a few ruins to investigate.";
	var n = noty({layout: 'centerLeft', type:"alert", text: html});
}
CPX.GUI.prototype.logCulture = function (html) {
    $("#logCultureContent").append(html);
}
CPX.GUI.prototype.logThreat = function (html) {
    $("#logThreatContent").append(html);
}
CPX.GUI.prototype.logPlayer = function (html) {
    $("#logMainContent").append(html);
}
CPX.GUI.prototype.append = function (where,html) {
    $("#"+where).append(html);
}

CPX.GUI.prototype.updateField = function (id,html) {
    $("#"+id).empty();
    $("#"+id).append(html);
}

CPX.GUI.prototype.areaCheck = function (area) {
	var uid=$("#mRightContent").children(".areaInfo").data("uid");

	if(area.uid == uid || area._parent == uid) {return true;}
	return false;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hero updates

CPX.GUI.prototype.playerStats = function (area) {
	$("#mLeftContent").empty();
	//game type
	if(this.realm.game == "CPX") { 
		$("#mLeftContent").append('<h3 class="center header">Statistics</h3>');
	}
	else {
		this.EpicPlayerDisplay(this.realm.player(),area);
	}
}
CPX.GUI.prototype.EpicPlayerDisplay = function (player,area) {
	var i=0, html='<h3 class="center header">Heroes</h3><div>';
	for(i=0 ; i <player.units.length ; i++) {
		html+= CPX[player.unit(i).type].childInfoDisplay(player.unit(i)); 
	}
	html+="</div>";

	$("#uActive").append(html);
}

CPX.GUI.prototype.postPlayerOptions = function (html) {
	$("#pOptions").empty();
    $("#pOptions").append(html);
}

CPX.GUI.prototype.localUnits = function (area) {
	var ruid=$("#rName").data("uid");
	var P=cpxRealms[ruid].player();

	var i=0, html='<h3 class="center header">Active Units</h3><div>';
	var local="", active="";
	for(i=0 ; i <P.units.length ; i++) {
		if(P.unit(i).area()._parent == area.uid) { local+= CPX[P.unit(i).type].childInfoDisplay(P.unit(i)); }
		else { active+= CPX[P.unit(i).type].activeRoster(P.unit(i)); }
	}
	html+="</div>";

	$("#uActive").append(html);
}
CPX.GUI.prototype.activeUnits = function (area) {
	var ruid=$("#rName").data("uid");
	var P=cpxRealms[ruid].player();

	var i=0, html='<h3 class="center header">Active Units</h3><div>';
	var local='<div class="center header subheader">Local</div>', active='<div class="center header subheader">Active</div>';
	for(i=0 ; i <P.units.length ; i++) {
		if(P.unit(i).area()._parent == area.uid) { local+= CPX[P.unit(i).type].childInfoDisplay(P.unit(i)); }
		else { active+= CPX[P.unit(i).type].activeRoster(P.unit(i)); }
	}
	html+=local+active+"</div>";

	$("#uActive").append(html);
}

CPX.GUI.prototype.clearHeroes = function () {
	$("#hero_Container").empty();
}
CPX.GUI.prototype.addHero = function (hero) {
	$("#hero_Container").append(hero.infoDisplay());
}
CPX.GUI.prototype.heroMove = function (hero,area) {
	this.updateField(hero.uid+"_Area",' (In Transit to '+area.name+')');

	var html = hero.name + " in transit to " + area.name;
	var n = noty({layout: 'bottomCenter', type:"information", text: html});
}
CPX.GUI.prototype.heroArrive = function (hero,area) {
	this.updateField(hero.uid+"_Area",' (@ '+area.factionColors()+area.name+')');

	var html = hero.name + " arrives at " + area.name;
	var n = noty({layout: 'bottomCenter', type:"information", text: html});
}

$(document).on("click", ".dialogClose", function(){
	var uid=$(this).data("uid");

	$("#"+uid+"_Dialog").remove();
});

$(document).on("dblclick", ".areaList > li", function(){
	var ruid=$("#rName").data("uid"), uid=$(this).data("uid");

	cpxRealms[ruid].db[uid].display();

});


////////////////////////////////////////////////////////////////////////////////////////////////////////
////// Trouble Functions

CPX.GUI.prototype.overcomeResult = function (unit,area,trouble,roll) 
{
	var html="Your were successful in helping the people of "+area.name+"."; 

	var type="success";
	if(roll < 7) { 
		type = "error"; 
		html="Your were not successful against the "+trouble+" at "+area.name+"."; 
	}

	if(area.trouble.length>0) {
		type="warning";
		html+= "The "+trouble+" is weaker but still trouble.";
	}
	else {
		html+= "You overcame the "+trouble+"!";
	}
	
	var n = noty({type:type, text: html});
}
CPX.GUI.prototype.troubleNotice = function (area) 
{
	var html="The people of "+area.name+" ask for your help with "+area.trouble[0]+".";
	var n = noty({type:"warning", text: html});

	var uid=$( "#pOptions" ).children(".buttons").data("uid");
	if(typeof uid !== "undefined") {
		var cH=this.realm.db[uid];

		if(cH._area == area.uid) { $( "#bOvercome" ).prop("disabled",false); }
	}
}
$(document).on("click", "#bOvercome", function(){
	var ruid=$("#rName").data("uid"), uid=$( ".hero.selected" ).data("uid");
	var cH=cpxRealms[ruid].db[uid];

	var n = noty({
		type:"confirmation", 
		timeout: false,
		text: 'You are going to attempt to overcome the '+cH.area().trouble[0]+' at '+cH.area().name+'. Are you sure?',
		closeWith: ['button'],
		buttons: [
		{addClass: 'btn btn-primary', text: 'Ok', onClick: function($noty) {
				// this = button element
				// $noty = $noty element
				$noty.close();
				cpxRealms[ruid].playerOvercomeTrouble({unit:uid});
			}
		},
		{addClass: 'btn btn-danger', text: 'Cancel', onClick: function($noty) {
				$noty.close();
			}
		}
		]	
	});

});

////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Enable and disable the player option buttons

CPX.GUI.prototype.disableUnitButtons = function (unit) {
	$( "#bTeamUp" ).prop("disabled",true);
	$( "#bOvercome" ).prop("disabled",true);
	$( "#bDeffend" ).prop("disabled",true);
	$( "#bMoveTo" ).prop("disabled",true);
}

CPX.GUI.prototype.enableButtons = function (unit) {
	var uid=$( ".hero.selected" ).data("uid");

	if(unit.uid == uid) {
		$( "#bTeamUp" ).prop("disabled",true);
		$( "#bOvercome" ).prop("disabled",true);
		$( "#bDeffend" ).prop("disabled",true);
	
		$( "#bMoveTo" ).prop("disabled",false);
		if(unit.area().trouble.length>0) { $( "#bOvercome" ).prop("disabled",false); }	
	}
}

//Disable all the buttons if the unit is active
CPX.GUI.prototype.disableButtons = function (unit) {
	var uid=$( "#pOptions" ).children(".buttons").data("uid");
	if(unit.uid == uid) { $( "#pOptions" ).children().children().prop("disabled",true); }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Movement

$(document).on("click", "#bMoveTo", function(){
	var ruid=$("#rName").data("uid"), uid=$( ".hero.selected" ).data("uid");
	var cH=cpxRealms[ruid].db[uid];
	var S=cH.area().sector();

	var html='<div class="content center">Within Sector:<select class=jselectmenu id=selMove>'
	for (var i=0; i<S.children.length ; i++) {
		if (S.child(i).visible) { html+='<option value='+S.child(i).uid+'>'+S.child(i).name+'</option>'; }
	}
	html+="</select>";
	html+="<button class=moveFinal data-uid="+uid+">Move</button>";

	var N=S.neighbors();  //ns[x+','+y]=[x,y,directions[i],G.sectorList[x+','+y]];
	html+="</br>New Sector:<select class=jselectmenu id=selMoveSector>";;
	for (var z in N) {
		html+='<option value='+z+'>'+N[z][2];
		html+=' ('+N[z][0]+','+N[z][1]+')</option>';
	}
	html+="</select>";
	html+="<button class=moveSector data-uid="+uid+">Move</button>"
		
	html+="</div>";

	$("#optSelect").append(html);
});
$(document).on("click", ".moveFinal", function(){
	var ruid=$("#rName").data("uid"), uid=$(this).data("uid");

	var A=$("#selMove").val();
	
	$("#optSelect").empty();
	cpxRealms[ruid].unitMoveSetup({unit:uid,area:A});

});

$(document).on("click", ".moveSector", function(){
	var ruid=$("#rName").data("uid"), uid=$(this).data("uid");
	var cH=cpxRealms[ruid].db[uid];
	var S=cH.area().sector(), G=S.galaxy();
	var N=S.neighbors(); //ns[x+','+y]=[x,y,directions[i],G.sectorList[x+','+y]];

	var sid=$("#selMoveSector").val(), nS={};

	if( N[sid][3].length>0 ) { nS=cpxRealms[ruid].db[N[sid][3]]; }
	else {
		nS=G.addSector([N[sid][0],N[sid][1]]);
	}
		
	var rSy = G.RNG.rndArray(nS.children);
	
	$("#optSelect").empty();

	cpxRealms[ruid].GUI.knownSectors();
	
	cpxRealms[ruid].unitMoveSetup({unit:uid,area:rSy});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////

window.onkeyup = function(e) {
   //67 = C | 81 = Q | 82= R | 84 = T 
    var key = e.keyCode ? e.keyCode : e.which;
    
    if (key == 67) { $("#logCulture").slideToggle(); }
	else if (key == 81) { 
    	var ruid=$("#rName").data("uid");
    	if (cpxRealms[ruid]._paused) {
    		cpxRealms[ruid].resume();	
    	}
    	else { cpxRealms[ruid].pause(); }    	
    }
    else if (key == 82) {
        var $NR=$(".noreveal"), $R=$(".reveal");

        $NR.removeClass("noreveal").addClass("reveal");
        $R.removeClass("reveal").addClass("noreveal");
    }
    else if (key == 84) { $("#logThreat").slideToggle(); }

}

/* Three D support
$( "div.mainbars" )
  .mouseenter(function() {
  	mainmouse.active=false;
  })
  .mouseleave(function() {
    mainmouse.active=true;
  });
  */

$( ".dialog-moveto" ).dialog({
	resizable: false,
    height:340,
	modal: true,
	buttons: 
	{
		"Move To": function() {
          $( this ).dialog( "close" );
        },
		Cancel: function() {
          $( this ).dialog( "close" );
        }
	}
});

$(document).on("click", "#slideMenu", function(){	
	$("#mainmenu-slideout").slideToggle();
});

$(document).on("click", "h3.header", function(){	
	$(this).next().slideToggle();
});






$(window).load(function(){

});