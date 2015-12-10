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

//////////////////////////////////////////////////////////////////////
//Sector variables and Sector Object

//Basic galaxy if not given a parent
cpxVar.basicGalaxy = { uid:"", radius: 50000, height:6000, totalPop:1000, sectorSize:4000}; 
//Sector types
cpxVar.sectorType=["Starry Void","Globular Cluster", "Open Cluster", "Stellar Association"];
//Probability of various sectors based upon radial position
cpxVar.bulgeA=[0.75,0.85,0.95,1];
cpxVar.bulgeB=[0.6,0.8,0.95,1];
cpxVar.bulgeC=[0.4,0.6,0.85,1];
cpxVar.disk=[0.1,0.4,0.7,1];

//modifier to global population chance based upon totalPop
cpxVar.sectorPop=[0.5,0.5,1.5,1.5];  

//Tech level names and probabilities
cpxVar.planetboundTL=["Stone Age", "Bronze Age", "Iron Age", "Middle Ages", "Early Modern", "Modern", "Information"];
cpxVar.planetProb=[.15,.25,.4,.55,.7,.85,1];
cpxVar.starfaringTL=["Early Interstellar","Interstellar","Early Galactic","Galactic","TransGalactic"];
cpxVar.starProb=[.45,.944,.994,1];
//Starfaring basic FTL in LY/day
cpxVar.FTLScale=[1,10,100,1000,10000];
cpxVar.FTLMod=[0.5,0.7,0.85,0.95,1,1.5,2.25,3.5,5];		

cpxVar.starTypes= ["Main Sequence","Giant","Bright Giant","Binary","Multiple Star System"];
cpxVar.stellarObjects= ["Megastructure","Nebula","Dark Matter Clouds","Phenominon"];


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Basic sector object

CPX.Sector=function (opts) {
	opts = typeof opts === "undefined" ? {} : opts;
	if (typeof opts.load !== "undefined") { return; }
	
	CPX.Area.call(this, opts);

	this.uid = "2"+makeUID(23);
	this.RNG = new CPX.RNG(this.uid);

	function randomPoint() {
		var angle= RN.RND()*Math.PI*2;
		var rr=Math.round(G.radius/G.sectorSize);
		var x=Math.round(Math.cos(angle)*RN.RND()*rr);
		var y=Math.round(Math.sin(angle)*RN.RND()*rr);
		return [x,y];
	}

	this.sid = typeof opts.sid === "undefined" ? randomPoint() : opts.sid;
	this.type="Sector";

	this.initialize(opts); 
}
CPX.Sector.inherits(CPX.galaxyArea);
//Generates the basic sector information
CPX.Sector.prototype.initialize =function (opts) {
	var auto = typeof opts.auto === "undefined" ? true : opts.auto;

	//pulls parent galaxy data
	var G=opts.parent;
	if (G === "undefined") { G=cpxVar.basicGalaxy; }
	this.width= cpxVar.sectorSize;
	//Determines the sector's positioning based upon its xyz ID
	this.calcPosition();

	//determines the sector type based upon radial postion - distance from center
	var sp=[];
	var rr=this.location[2]/G.radius;
	if (rr<0.1) { sp = cpxVar.bulgeA;}
	else if (rr<0.2) { sp = cpxVar.bulgeB;}
	else if (rr<0.25) { sp = cpxVar.bulgeC;}
	else { sp = cpxVar.disk;}

	//Uses the sector's RNG to determine sector type
	var p=this.RNG.RND();
	if (p<sp[0]) {this.subtype=0;}
	else if (p<sp[1]) {this.subtype=1;}
	else if (p<sp[2]) {this.subtype=2;}
	else {this.subtype=3;}

	if(auto) { 	this.realm().randomSector(this); }

	//save the initial 
	var sa = ["_realm","_parent","children","visible","name","type","size","width","sid","location","links","_visited","_owner","_isBase","assets","advancements","units","_attacker","trouble"];
	cpxSave({obj:this,doc:cpxSaveCompile(this,sa),initial:true});	

};
//Determines the sector's positioning based upon its xyz ID - coordinates x,y,z,rho,phi
CPX.Sector.prototype.calcPosition =function () {
	//pulls sector size
	var sectorSize=cpxVar.sectorSize;

	//determines the sector's xyz coordinates based upon the sid povided
	function peq (n) {
		return n*sectorSize;
	}
	var sx=peq(this.sid[0]), sy=peq(this.sid[1]);

	//this is the sectors radial position - cylindrical coordinates
	var rho = Math.sqrt(sx*sx+sy*sy);

	//this is the sectors angular position - cylindrical coordinates
	var theta=0;
	if (sx>0) {	theta=Math.asin(sy/rho)*180/Math.PI; }
	else {theta = (-Math.asin(sy/rho)+ Math.PI)*180/Math.PI; }

	this.setLocation([sx,sy,rho,theta]);
}
CPX.Sector.prototype.rndLocation  =function () {
	var RN=this.RNG, d=this.galaxy().sectorSize*10/2;
	var x= RN.rndInt(-d,d)/10, y= RN.rndInt(-d,d)/10, z=RN.rndInt(-d,d)/10;			

	return [x,y,z];
}

CPX.Sector.prototype.neighbors =function (location) {
	var directions=["North","Northeast","East","Southeast","South","Southwest","West","Northwest"];
	var sids=[[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
	var G=this.parent();

	var ns={}, i=0, x=-99, y=-99;
	for (i=0; i<8; i++) {
		x=this.sid[0]+sids[i][0], y=this.sid[1]+sids[i][1];
		if(typeof G.sectorList[x+','+y] !== "undefined") {
			ns[x+','+y]=[x,y,directions[i],G.sectorList[x+','+y]]; 	
		}
	}
	
	return ns;
}

//Adds an improtant CG - center of gravity the sector - may be a cluster, system, etc...
CPX.Sector.prototype.addSystem =function (location) {
	location = typeof location === "undefined" ? this.rndLocation() : location;
	
	var nA=new CPX.System({parent:this});
	nA.setLocation(location);

	this.children.push(nA.uid);
	this.realm().dbPush(nA);

	return this.lookup(nA.uid);
}
CPX.Sector.prototype.addRuin =function (location) {
	location = typeof location === "undefined" ? this.rndLocation() : location;

	var nR = new CPX.Ruin({parent:this});
	nR.setLocation(location);

	this.children.push(nR.uid);
	this.realm().dbPush(nR);

	return this.lookup(nR.uid);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Sector.onDisplay = function (sector) {}

//what to diplay when it is the focus 
CPX.Sector.selfDisplay = function (sector) {

	var width=700;
	var x = (cpxTwoD.width-width)/2, y= (cpxTwoD.height-width)/2; 
	CPX.twoDGraph(cpxTwoD,x,y,width,width,15);
	sector.twoD={x:x,y:y,width:width};

}
//what to display when it is a child in the scene
CPX.Sector.childDisplay = function (sector) {}
//what to display when it is a neighboor in the scene
CPX.Sector.neighboorDisplay = function (sector) {}
//html to return to the parent when the parent updates the GUI
CPX.Sector.childInfoDisplay = function (sector) {}
//display to the GUI when it is the focus
CPX.Sector.infoDisplay = function (sector) {
	var D=sector.realm().GUI; 
	var i=0, F=sector.listFactions(), n=F[0].length, cO={};
	
	var html='<div class="areaInfo sector" id="'+sector.uid+'_Container" data-uid='+sector.uid+' data-type='+sector.type+'>';
	html+='<h3 class="center header">Current Sector</h3><div class=areaContent>';
	html+='<div class=areaHeader>Sector ('+sector.sid[0]+','+sector.sid[1]+')</div>';
	html+='<div id="'+sector.uid+'_Location"><strong>Center: </strong>'+sector.location[0]+", "+sector.location[1]+"</div>";

	if (n>0) {
		html+='<div id="'+sector.uid+'_Cultures"><div class=areaSubHeader>Cultures </div>';
		for (i=0;i<n;i++) {
			cO=sector.lookup(F[0][i]);
			if (cO.type=="Player") { continue; }
			html+=CPX.Culture.childInfoDisplay(cO);
		}
		html+="</div>";
	}

//Ruins
	html+='<div class=noreveal id="'+sector.uid+'_Ruins"><div class=areaSubHeader>Ruins</div>';
	n=sector.children.length
	for (i=0;i<n;i++) {
		if ( sector.children[i].type == "Ruin" ) {
			cO=sector.child(i);
			html+=CPX.Ruin.childInfoDisplay(cO);
		}
	}
	html+="</div>";

//Threats
	html+='<div class=noreveal id="'+sector.uid+'_Threats"><div class=areaSubHeader>Threats</div>';
	n=F[1].length
	for (i=0;i<n;i++) {
		cO=sector.lookup(F[1][i]);
		html+=CPX.Threat.childInfoDisplay(cO);
	}
	html+="</div>";

	html+="</div>";
	
	//Add this info to the right
	D.postRight(html);

	//Add known sector - area navigation to right
	D.knownSectors();

	html='<h3 class="center header"><span id=actHero></span>Options</h3></span><div>';
	html+='<div class=center id=optSelect ></div>';
	html+='<div class="buttons center"><button id="bMoveTo" disabled>Move To</button>';
	html+='<button id="bTeamUp" disabled>Team Up</button>';
	html+='</br><button id="bOvercome" disabled>Overcome Trouble</button>';
	html+='<button id="bDeffend" disabled >Deffend</button>';
	html+='</div>';
	html+='</div>';

    D.postPlayerOptions(html);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.GUI.prototype.knownSectors = function () {
	$("#displayNav").empty();

	var ruid=$("#rName").data("uid"), sid=$("#mRightContent").children(".areaInfo").data("uid");
	var G=cpxRealms[ruid].db[sid].parent();

	var html='<div><h3 class="header center">Known Sectors</h3><ul class="areaList center">';
	var i=-1, x=99, y=99;
	for (var z in G.sectorList) {
		if(G.sectorList[z].length>0) {
			i=z.indexOf(","), x=z.slice(0,i), y=z.slice(i+1);
			html+='<li id="'+G.sectorList[z]+'_areaList" data-uid='+G.sectorList[z]+'><span class=hasHero></span>';
			html+='<span class=hasThreats></span><span class=liContent>Sector '+x+","+y+'</span></li>'; 
		}
	}
	html+="</ul>";

    $("#displayNav").append(html);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Generates a totally random sector with systems, ruins, threats, etc
CPX.Realm.prototype.randomSector =function (sector) {
	var S=sector;
	var RN=S.RNG, i=0, nc=[];

	S._visited = true;

	//pulls parent galaxy data
	var G=S.galaxy();

	//Adds TL 2,3 starfaring cultures - major players
	for (i=0; i < RN.rndArray([0,0,0,1,1,1,1,1,2,2,2,3]) ;i++) { 
		nc.push(this.addStarfaring(2));
	}
	for (i=0; i < RN.rndArray([0,0,0,1,1,1,1,1,1,2]) ;i++) { 
		nc.push(this.addStarfaring(3));
	}

	//Determines sector TL 0&1 civ population, Adds minor starfaring cultures
	var pop=RN.FateRoll()+4;
	pop=G.sectorPop[pop];
	for (i=0;i<pop;i++) { 
		if (RN.RND()<0.5) { nc.push(this.addStarfaring(0)); } 
		else { nc.push(this.addStarfaring(1)); }
	}

	function addSystems (n,faction) {
		var p=S.rndLocation(), j=0, nS={}, L=[];
		var r=cpxVar.FTLScale[faction.TL]*cpxVar.FTLMod[faction.FTL+4]*5;	
		
		for (j=0 ; j < n ; j++)
		{
			if(faction.TL<2) { L=WithinCircle(p[0],p[1],r,RN.RND); }
			else { L=S.rndLocation(); }
			
			nS = S.addSystem(L);
			if(faction.TL<2 && S.RNG.RND()<0.5) { nS.addTrouble(); }
			nS.addBase(faction.uid,true);
		}
	}

	for (i=0;i<nc.length;i++) 
	{
		if (nc[i].TL == 0) { addSystems(RN.rndInt(2,3),nc[i]); }
		else if (nc[i].TL == 1) { addSystems(RN.rndInt(4,6),nc[i]); }
		else if (nc[i].TL > 1) { addSystems(1,nc[i]); }
	}

	//Generate assets
	for (i=0 ; i<nc.length ; i++) { this.factionRandomAssets(nc[i]); }

	//add ruins
    for (i=0;i<RN.rndInt(4,8);i++) { S.addRuin(); }

	//add threats
    for (i=0;i<RN.rndInt(4,8);i++) { this.addThreat(S); }
		
	//Make resources 
	for (i=0;i<S.children.length;i++) {
		if(RN.RND()<0.3) { S.child(i).addResource(); }
    } 

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Adds a starfaring culture to the sector 
CPX.Realm.prototype.addStarfaring =function (TL) {
	TL = typeof TL === "undefined" ? this.RNG.rndInt(0,1) : TL;

	//New culture object - Generates strafaring culture data
	var nc= new CPX.Culture({realm:this,FTL:true,TL:TL});
    //adds the culture
    this.db[nc.uid]=nc;
    this.factions.push(nc.uid);

	var t=this.getTime()+this.RNG.rndInt(1,8);
	this.newQ(t,"realm","factionImprove",{uid:nc.uid});
	t=this.getTime()+this.RNG.rndInt(12,18);
	this.newQ(t,"realm","factionTroubleOvercome",{uid:nc.uid});

	return this.lookup(nc.uid);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////
//  Stellar objects
CPX.stellarObj =function (opts) {
	opts = typeof opts === "undefined" ? {} : opts;
	
	this.uid = typeof opts.seed === "undefined" ? "O"+makeUID(23) : opts.seed;
	this.parent = typeof opts.parent === "undefined" ? {children:[]} : opts.parent;

	this.RNG = new CPX.RNG(this.uid);

	this.type="stellarObj";
}
CPX.stellarObj.inherits(CPX.Object);
//Determines a random position based upon the sector coords
CPX.stellarObj.prototype.rndPosition =function () {
	var ss=this.galaxy.sectorSize*10/2;
	return [this.RNG.rndInt(-ss,ss)/10,this.RNG.rndInt(-ss,ss)/10,this.RNG.rndInt(-ss,ss)/10];
}
CPX.stellarObj.prototype.newMegastruct = function () {
	this.location = this.rndPosition();

	this.subtype = 0;
	this.info="";
	this.text="";
	this.subsub="";

	var megastructure=["Dyson Shell", "Dyson Ring", "Ringworld", "Orbital", "Shellworld"];
	this.subsub=this.RNG.rndArray(megastructure);

	this.short=" ("+this.subsub+")";
}
CPX.stellarObj.prototype.newNebula = function () {
	this.location = this.rndPosition();

	this.subtype = 1;
	this.info="";
	this.text="";
	this.short="";
}
CPX.stellarObj.prototype.newDarkMatter = function () {
	this.location = this.rndPosition();

	this.subtype = 2;
	this.info="";
	this.text="";
	this.short="";
}
CPX.stellarObj.prototype.newPhenomenon = function () {
	this.location = this.rndPosition();

	this.subtype = 3;
	this.info="";
	this.text="";
	this.subsub="";

	var phenomenon=["Blackhole","Dead god","Wormhole","Gate"];

	this.subsub=this.RNG.rndArray(phenomenon);

	this.short=" ("+this.subsub+")";
}
CPX.stellarObj.prototype.shortDisplay =function () {
	var header = '<div class="stellarObject" data-uid="'+this.uid+'"><strong>';
	header+=stellarObjects[this.subtype]+'</strong>';

	return header+this.short;
}
