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

function init (){

};



$(window).load(function(){

	cpxDBInitialize();

$('#SectorGen').click(function() {
	$("#GUI").slideDown();

	var nR= new CPX.Realm();
	nR.initGalaxy();
	console.log(nR);

	$( "#mainmenu-slideout" ).slideToggle();

});

$('#linkabout').click(function() {
    $("#right .content").remove();
    $("#header-right").empty();
    $("#about").clone().appendTo("#right");
    $("#header-right").append('<h2>About the Generator v'+version+'</h2>');
});



});

$(document).on("click", "#buttonThreeDisplay", function(){
	$("#sectorInfo").slideToggle();
	$("#starscape").slideToggle();
});

