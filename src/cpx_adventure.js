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

// 
// 3-12 of the smaller
// cpxVar.areaSize = ["Room", "House", "Department/Grocery Store", "Mall/Small Park", "Neighboorhood/City Park", "District/Small City", "Domain/Large City", "Region", "Territory", "Nation", "Bloc", "Continent"];
cpxVar.areaSize = ["","Room", "House", "Department Store", "Small Park", "Neighboorhood", "District", "Domain", "Region", "Territory", "Nation", "Bloc", "Continent"];
cpxVar.terrains = ["Hills", "Mountains", "Forest", "Plains", "Swamp", "Desert", "Coast", "Underground", "City"];

CPX.definedHero=function (id,opts) {
	this.uid = id;
	opts = typeof opts === "undefined" ? {} : opts;
	
	this.name = typeof opts.name === "undefined" ? cpxRNDName() : opts.name;

	this.stats = typeof opts.stats === "undefined" ? cpxRNG.shuffleAr([1,1,0,0,-1,-1]) : opts.stats;

	this.xp = typeof opts.xp === "undefined" ? 0 : opts.xp;
    this.levels = typeof opts.levels === "undefined" ? ["Fighter"] : opts.levels;
	this.HPMax = typeof opts.HPMax === "undefined" ? cpxRNG.rndInt(1,6) : opts.HPMax;

	this.skills = typeof opts.skills === "undefined" ? {} : opts.skills;
	this.abilities = typeof opts.abilities === "undefined" ? [] : opts.abilities;
	
	this.gear = typeof opts.gear === "undefined" ? [] : opts.gear;
}
CPX.definedHero.load = function (realm,hero,area) {
	var P=realm.player();
	var nH = CPX.Hero.define(P.uid,area,hero);
	nH.statsType = "Stats";
	realm.db[nH.uid] = nH;
	P.units.push(nH.uid);
}

CPX.definedArea = function (id,opts) {
	this.uid = id;
	opts = typeof opts === "undefined" ? {} : opts;

    this.name = typeof opts.name === "undefined" ? cpxRNDName() : opts.name;
    this.size = typeof opts.size === "undefined" ? "" : opts.size;
    this.terrain = typeof opts.terrain === "undefined" ? "" : opts.terrain;

    this.danger = typeof opts.danger === "undefined" ? -1 : opts.danger;
    this.dangerList = typeof opts.danger === "undefined" ? [] : opts.dangerList;

    this.isZone = typeof opts.isZone === "undefined" ? false : opts.isZone;

	//textD= description text, textN = neighboor text, textC = child text
	this.textD = typeof opts.textD === "undefined" ? "" : opts.textD;
	this.textN = typeof opts.textN === "undefined" ? "" : opts.textN;
	this.textC = typeof opts.textC === "undefined" ? "" : opts.textC;

	//link means you have to travel through the areas listed to get to this area
	//it will not be part of the general neighboors
	this.links = typeof opts.links === "undefined" ? [] : opts.links;

    this.nchild = typeof opts.nchild === "undefined" ? 0 : opts.nchild;
    this.nzones = typeof opts.nzones === "undefined" ? 5 : opts.nzones;
    this.children = typeof opts.children === "undefined" ? [] : opts.children;   

	this.visible = typeof opts.visible === "undefined" ? false : opts.visible;
    
    this.tags = typeof opts.tags === "undefined" ? [] : opts.tags;

}

CPX.definedArea.load = function (parent,area) {
	var R=parent.realm();

	var nA= new CPX.EpicArea({parent:parent, template:area});	
	R.db[nA.uid] = nA;

	//remove the children references to definedArea uids
	R.db[nA.uid].children.length = 0;

	var nC= {}, uton={}, i=0;
	area.children.forEach(function(c){
		//load each child
		nC= CPX.definedArea.load(R.db[nA.uid],cpxVar.definedArea[c]);
		//add the new child id to the parent area
		R.db[nA.uid].children.push(nC.uid);
		//link the definedArea uid to the new uid
		uton[c] = nC.uid;
	});

	var cl = [];
	//rewriting links to new uids
	R.db[nA.uid].children.forEach(function(c){
		cl = R.db[c].links;
		if( cl.length >0 ) {
			cl.forEach(function(l){
				l[0] = uton[l[0]];
			});
		}
	});
	
	return nA;
}

CPX.definedArea.save = function (area) {
	localforage.setItem(area.uid, area, function(err, value) {
  		// Do other things once the value has been saved.
   		//console.log(value);
	});
}
CPX.definedArea.display = function (area) {
}

CPX.Adventure = function (id,opts) {
	this.uid = id;
	this.type="Adventure";

	opts = typeof opts === "undefined" ? {} : opts;

	this.name = typeof opts.name === "undefined" ? "" : opts.name;
	this.heroes = typeof opts.heroes === "undefined" ? [] : opts.heroes;
	this.areas = typeof opts.areas === "undefined" ? [] : opts.areas;
	this.enter = typeof opts.enter === "undefined" ? "" : opts.enter;
}
CPX.Adventure.prototype.load = function (realm) {
	this.areas.forEach(function(a){
		CPX.definedArea.load(realm,cpxVar.definedArea[a]);
	});
	
	var A = {};
	for(var x in realm.db) {
		if(realm.db[x].template==this.enter) {  A = realm.db[x]; }
	}

	this.heroes.forEach(function(a){
		CPX.definedHero.load(realm,cpxVar.Hero[a],A);
	});

	A.enter();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.EpicArea = function (opts) {
	opts = typeof opts === "undefined" ? {} : opts;

	this._parent=opts.parent.uid;
	this._realm=opts.parent._realm;
	this.nexplore = 0;
	
	if (typeof opts.template !== "undefined") { CPX.EpicArea.define(this,opts.template); }
	else { CPX.EpicArea.define(this,cpxVar.definedArea.generic); }

	if (this.size == "") { 
		var size=cpxVar.areaSize[cpxVar.areaSize.indexOf(opts.parent.size)-1];
    	this.size = typeof opts.size === "undefined" ? size : opts.size;
	}
    
    if (typeof opts.isZone !== "undefined") { this.isZone = opts.isZone; } 

	if (this.terrain == "") { 
    	this.terrain = typeof opts.terrain === "undefined" ? opts.parent.terrain : opts.terrain;
	}
	if (this.danger == -1) { 
    	this.danger = typeof opts.danger === "undefined" ? opts.parent.danger : opts.danger;
	}

	//textD= description text, textN = neighboor text, textC = child text
	if (typeof opts.textD !== "undefined") { this.textD = opts.textD; } 
	if (typeof opts.textN !== "undefined") { this.textN = opts.textN; } 
	if (typeof opts.textC !== "undefined") { this.textC = opts.textC; } 

	//link means you have to travel through the areas listed to get to this area
	//it will not be part of the general neighboors
	if (typeof opts.links !== "undefined") { this.links = opts.links; } 

	if(this.size == "Room"){
		this.nchild = 0;
    	this.nzones = 0;
    	this.children = [];
	}
	else {
		if (typeof opts.nchild !== "undefined") { this.nchild = opts.nchild; }
		if (typeof opts.nzones !== "undefined") { this.links = opts.nzones; }
		if (typeof opts.children !== "undefined") { this.children = opts.children; }			
	}
   
   if (typeof opts.visible !== "undefined") { this.visible = opts.visible; }
   if (typeof opts.tags !== "undefined") { this.tags = opts.tags; }
    
}
CPX.EpicArea.inherits(CPX.Area);

CPX.EpicArea.fullDangerList = function(area) {
	var dL = area.dangerList, dangers = [], fD = CPX.EpicArea.fullDangerList; 

	if(dL.length == 0 || dL[0] == "add") {
		dangers = dangers.concat(fD(area.parent()));
	}
	else { dangers = dL.slice(1); }
	
	return dangers;
}

CPX.EpicArea.onEnter = function(from,area,who) {
	area.realm().GUI.clearTextDisplay();
	area.visible = true;
	area.visited = true;
	area.display();
}
CPX.EpicArea.onDisplay = function (area) {}

//what to diplay when it is the focus 
CPX.EpicArea.selfDisplay = function(area) {
	var R=area.realm(), GUI=R.GUI;
	var P=area.parent();
	
	var html='<div class=areaTextDisplay data-uid='+area.uid+'>';
	html+='<h3>'+area.name+'</h3><div class=selfArea data-uid='+area.uid+'>';
	html+='<p>'+area.textD+'</p>';

	var ex= false;
	area.children.forEach(function(c){  
		if(!R.db[c].visible) {
			if(R.db[c].links.length == 0) { ex = true; }
		}
	});
	if (area.children.length < area.nchild + area.nzones ) { ex = true; }
	if (ex) {
		html+='<div class="center buttons"><button class=bExplore data-uid="'+area.uid+'">Explore '+area.name+'</button></div>';	
	}
	html+='</div></div>';

	GUI.postTextDisplay(html);

	var i=0;
	if( area.children.length > 0) {
		html='<h4>'+area.name+' Locations</h4><div class=areaChildren id="'+area.uid+'_Children" />';
		GUI.append("textDisplay",html);

		for (i=0; i<area.children.length ; i++) { CPX[area.child(i).type].childDisplay(area.child(i)); }
	}
	
	if(area.links.length > 0 || P.children.length > 0) {
		html='<h4>'+area.name+' Neighboors</h4><div class=areaNeighboors id="'+area.uid+'_Neighboors" />';
		GUI.append("textDisplay",html);
		
		if (area.links.length == 0) {
			for (i=0; i<P.children.length ; i++) { CPX[P.child(i).type].neighboorDisplay(P.child(i),area.uid); }
		}
		else {
			area.links.forEach(function(l){
				if(l[1] == "out" || l[1] == "both") {
					CPX[R.db[l[0]].type].neighboorDisplay(R.db[l[	0]],area.uid); 	
				}
			});
		}

	}

	if(P.type != "Realm") {
		html = '<div class="center buttons"><button class=lTravelTo data-uid="'+area._parent+'">Leave '+area.name+'</button></div>'
		GUI.append("textDisplay",html);
	}
}

//what to display when it is a child in the scene
CPX.EpicArea.childDisplay = function(area) {
	if(!area.visible) {return;}

	var GUI=area.realm().GUI;

	var html='<div class=areaChild><span class=lTravelTo data-uid="'+area.uid+'"> '+area.name+'</span>';
	if(area.textC.length > 0) { html+= ": "; }
	html+=area.textC+'</div>';
	GUI.append(area._parent+"_Children",html);
} 
//what to display when it is a neighboor in the scene
CPX.EpicArea.neighboorDisplay = function(area,caller) {
	if(!area.visible || area.uid == caller) {return;}

	//test for links, if true display area.
	var links = [];
	area.links.forEach(function(l){ links.push(l[0]); });
	if(links.length > 0) {
		if(!links.test(caller)) {return;}	
	}
	
	var GUI=area.realm().GUI;
	var html='<div class=areaNeighboor><span class=lTravelTo data-uid="'+area.uid+'"> '+area.name+'</span>';
	if(area.textN.length > 0) { html+= ": "; }
	html+=area.textN+'</div>';
	GUI.append(caller+"_Neighboors",html);
} 
//what to display to the GUI when it is the focus
CPX.EpicArea.infoDisplay = function(area) {} 

CPX.EpicArea.define = function(area,template) {
	area.uid = "E"+makeUID(35);
	area.visited = false;
	area.type="EpicArea";
	area.template = template.uid;
	
	area.name = template.name;
	if(template.name=="") {
		var RN= CPX.RNG(area.uid);
		area.name = RN.rndName();
	}
	
	var doc={}
	for (var x in template) {
		if(x == "uid" || x == "type" || x == "name" || x == "load") { continue; }
		doc[x] = template[x];
	}
	doc = JSON.stringify(doc);

	var ndoc = JSON.parse(doc);
	for (var x in ndoc) {
		area[x] = ndoc[x];
	}
		
}

CPX.EpicArea.explore = function (area) {
	area.nexplore++;
	var hold=0, ex=false, danger = false, alert = "alert";

	function scoutSuccess () {
		if(cpxRNG.rndInt(1,4) > 1) { hold++; }
		else { ex = true; }
	}

	//Scout
	var rS = cpxRNG.DWRoll(), rSb = -1;
	if(rS > 9) {
		scoutSuccess ();
		scoutSuccess ();
	}
	else if(rS > 6) {
		scoutSuccess ();
	}
	else {
		danger = true;
	}

	//Navigate
	var rN = cpxRNG.DWRoll(); 
	if(rN > 9) { ex=true; }
	else if(rN > 6) { 
		if(cpxRNG.rndInt(1,3) < 3) { ex=true; }
		else {
			if(cpxRNG.rndInt(1,4) == 1) { danger = true; }
		}
	}
	else {
		//danger
		if( cpxRNG.rndInt(1,3) > 1) { danger = true; }
		//lost
		else {}
	}

	//area danger 
	var rD = cpxRNG.rndInt(1,100);
	if(rD < area.danger*10 ) { danger = true; }

	var html = '';
	if(ex) { html = "You have found a new area." }
	else { html = "You explored but found nothing of interest." }
	
	if(danger) {
		var aD = CPX.EpicArea.fullDangerList(area), dL = [[],[]];
		aD.forEach(function(d){
			if(cpxVar.Hazards[d].type == "Hazard") { dL[0].push(cpxVar.Hazards[d]); }
			else if(cpxVar.Hazards[d].type == "Creature") { dL[1].push(cpxVar.Hazards[d]); }
		});
		 
		alert = "error";
		html+= " Unfortunately you've encountered some danger!"; 
		if(hold > 0) { 
			alert = "warning";
			html+= " But you managed to spot it before it was too late." 
		}

		var dtype = cpxRNG.rndInt(1,12);
		if(dtype == 1) { }
		else if (dtype <7 ) { aD = cpxRNG.rndArray(dL[0]); }
		else { aD = cpxRNG.rndArray(dL[1]); }

	}

	var n = noty({type:alert, text: html});
	n = noty({type:alert, text: aD.name});

	if(area.isZone || !ex) {return;}

	CPX.EpicArea.discovery(area);

}

CPX.EpicArea.discovery = function (area) {

	var nc = area.nchild, nz = area.nzones, R=area.realm(), PC = area.parent().children;

	//account for non-visible children
	var reveal=[];
	area.children.forEach(function (r) {
		if(area.lookup(r).isZone) { nz--; }
		else {nc--;}

		if (!area.lookup(r).visible) { 
			if (area.lookup(r).links.length == 0) { reveal.push(r); }
		}
	});

	//look for neighboors with links
	PC.forEach(function(c){
		var nl = area.lookup(c).links;
		//has links
		if(nl.length > 0) {
			nl.forEach(function(l){
				//link id is area
				if(l[0] == area.uid) {
					//link goes both ways or goes in
					if( l[1] == "both" || l[1] == "in") { reveal.push(c); }
				}
			});
		}
	});

	var i=0;
	for (i = 0; i<nc ; i++) { reveal.push("nc"); }
	for (i = 0; i<nz ; i++) { reveal.push("nz"); }
	
	var na = cpxRNG.rndArray(reveal);	
	
	var size=cpxVar.areaSize[cpxVar.areaSize.indexOf(area.size)-1];
	if (na == "nc") {
		var nA= new CPX.EpicArea({parent:area, size:size, visible:true});
		R.db[nA.uid] = nA;
		area.children.push(nA.uid);
		R.db[nA.uid].enter();
	}
	else if (na == "nz") {
		var nA= new CPX.EpicArea({parent:area, size:size, isZone:true, visible:true});	
		R.db[nA.uid] = nA;
		area.children.push(nA.uid);
		R.db[nA.uid].enter();
	}
	else { area.lookup(na).enter(); }

}



///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////


//name, size, nchild, children, tags

$(window).load(function(){

    $("#cpxcanvas").append('<div class="center" id="planes" />');
    $("#planes").append('<h2>Adventure Area </h2><div id="AdventureArea" ></div> ');


$('#newRealm').click(function() {
	$("#GUI").slideDown();

	var nR= new CPX.Realm({game:"Epic"});
	nR.addPlayer();
	nR.initialize();

	nR.GUI.initTextDisplay();

	cpxVar.Adventure.LongWinter.load(nR);
	
	console.log(nR);

	$( "#mainmenu-slideout" ).slideToggle();

});


});

$(document).on("click", "#infoPlayer", function(){
	$("#mLeft").slideToggle();
});

$(document).on("click", ".bExplore", function(){
	var ruid=$("#rName").data("uid"), uid=$(this).data("uid");
	var area=cpxRealms[ruid].db[uid];
	CPX[area.type].explore(area);
});

$(document).on("click", ".lTravelTo", function(){
	var ruid=$("#rName").data("uid"), uid=$(this).data("uid");
	var area=cpxRealms[ruid].db[uid];

	cpxRealms[ruid].db[uid].enter();
	
});

$(document).on("click", "#saveArea", function(){
	var id=$("#newArea").children("input.areaUID").val();
	var cid=$("#newArea").children(".children").children("input.areaUID").val();
	var b=0;
});

///////////////////////////////////////////////////////////////////////////////////////////////////////

cpxVar.definedArea = {};

cpxVar.definedArea.generic = new CPX.definedArea("generic",{});

cpxVar.definedArea.MaJel = new CPX.definedArea("MaJel",{
	name:"MaJel",
	size:"Domain",
	terrain:"Mountains",
	dangerList:["only","iceMist","iceBats","Raiders","Yeti"],
	danger:6,
	nchild:3,
	nzones:3,
	children:["MaJelFoothills","MaJelSlopes","Decatur","DecaturValley","WesternSlopes","TheLongCut"],
	textD:"Even though the mountain range cuts through the region it is easy to tell which is MaJel. " +
		"Easily taller than the rest - it dominates your view. Snow still covers its imposing slopes. " +
		"At its feet a river flushed with snowmelt cuts through the wide valley. Houses and other buildings that must be the city of Decatur line the river. " +
		"Smoke still rises from chimnies on this bright but cold late spring day." 
});
cpxVar.definedArea.DecaturValley = new CPX.definedArea("DecaturValley",{
	name:"Decatur Valley",
	size:"District",
	terrain:"Forest",
	danger:4,
	visible:true,
	isZone:true
});
cpxVar.definedArea.WesternSlopes = new CPX.definedArea("WesternSlopes",{
	name:"Western Slopes",
	size:"District",
	isZone:true
});
cpxVar.definedArea.TheLongCut = new CPX.definedArea("TheLongCut",{
	name:"The Long Cut",
	size:"District",
	isZone:true
});


cpxVar.definedArea.MaJelFoothills = new CPX.definedArea("MaJelFoothills",{
	name:"MaJel Foothills",
	size:"District",
	visible:true,
	nchild:0,
	nzones:8
});
cpxVar.definedArea.MaJelSlopes = new CPX.definedArea("MaJelSlopes",{
	name:"MaJel Slopes",
	size:"District",
	danger:7,
	nchild:1,
	nzones:7,
	children:["Iconia"],
	links:[["MaJelFoothills","both",false], ["WesternSlopes","out",false]]
});
cpxVar.definedArea.Iconia = new CPX.definedArea("Iconia",{
	name:"Iconia",
	size:"Neighboorhood",
	terrain:"City",
	danger:8,
	nchild:3,
	nzones:5
});
cpxVar.definedArea.Decatur = new CPX.definedArea("Decatur",{
	name:"Decatur",
	size:"District",
	terrain:"City",
	danger:3,
	dangerList:["only","pickPocket","iceMistCity","iceBats"],
	visible:true,
	nchild:0,
	nzones:6,
	children:["DecRiverfront","DecCityCenter","DecHillTop","DecMillWorks","DecCountryside","DecAspenMile"],
	textC:'The largest city on the slopes of MaJel.'
});
cpxVar.definedArea.DecRiverfront = new CPX.definedArea("DecRiverfront",{
	name:"Riverfront",
	size:"Neighboorhood",
	dangerList:["add","MajRiverSnake"],
	visible:true,
	isZone:true
});
cpxVar.definedArea.DecCityCenter = new CPX.definedArea("DecCityCenter",{
	name:"City Center",
	size:"Neighboorhood",
	visible:true,
	isZone:true
});
cpxVar.definedArea.DecHillTop = new CPX.definedArea("DecHillTop",{
	name:"HillTop",
	size:"Neighboorhood",
	visible:true,
	isZone:true
});
cpxVar.definedArea.DecMillWorks = new CPX.definedArea("DecMillWorks",{
	name:"MillWorks",
	size:"Neighboorhood",
	visible:true,
	isZone:true
});
cpxVar.definedArea.DecCountryside = new CPX.definedArea("DecCountryside",{
	name:"Decatur Countryside",
	size:"Neighboorhood",
	visible:true,
	isZone:true
});
cpxVar.definedArea.DecAspenMile = new CPX.definedArea("DecAspenMile",{
	name:"AspenMile",
	size:"Neighboorhood",
	visible:true,
	isZone:true
});

cpxVar.Hazards = {};

cpxVar.Hazards.MajRiverSnake = {type:"Creature",name:"River snake", hp:6,dmg:[1,8],AR:1,moves:["poison"],
	text:"You hear screams and run to see what is the mater. A river snake - far too large to be natural - is slithering towards a family that is running in your direction."
};
cpxVar.Hazards.iceBats = {type:"Creature",name:"Ice bats",hp:2,dmg:[1,6],AR:0,moves:["swarm"],text:""};
cpxVar.Hazards.Raiders = {type:"Creature",name:"Raiders",hp:4,dmg:[1,6],AR:1,moves:["reinforce"],text:""};
cpxVar.Hazards.Yeti = {type:"Creature",name:"Yeti",hp:10,dmg:[1,8],AR:1,special:["Size1"],moves:["breakStuff"],text:""};

cpxVar.Hazards.pickPocket = {type:"Hazard",name:"Pickpocket",skill:["Notice","Burglary"],moves:["loseGold"]};
cpxVar.Hazards.iceMistCity = {type:"Hazard",name:"Ice mist",skill:["Influence"],moves:["loseGold"]};
cpxVar.Hazards.iceMist = {type:"Hazard",name:"Ice mist",skill:["Physique"],moves:["enviroDamageLight"]};

cpxVar.Adventure = {};
cpxVar.Adventure.LongWinter = new CPX.Adventure("LongWinter",{
	name: "Long Winter",
	heroes:["Creshan","Aila","Stone","Lyris"],
	areas:["MaJel"],
	enter:"MaJel"
});

///////////////////////////////////////////////////////////////////////////////////////////////////////

cpxVar.Hero = {};
cpxVar.Hero.Creshan = new CPX.definedHero("Creshan",{name:"Creshan",skills:{Technical:1}});
cpxVar.Hero.Aila = new CPX.definedHero("Aila",{name:"Aila"});
cpxVar.Hero.Stone = new CPX.definedHero("Stone",{name:"Stone",skills:{Physique:1}});
cpxVar.Hero.Lyris = new CPX.definedHero("Lyris",{name:"Lyris"});