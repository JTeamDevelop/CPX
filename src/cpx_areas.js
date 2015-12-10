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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Basic Area Object
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

cpxVar.areaSizes = ["","","","","","","","System","Association"]

//realm|parent|player|owner|attacker|isBase|isPlayer|isThreat

CPX.Area=function (opts) {
	opts = typeof opts === "undefined" ? {parent:{uid:"",_realm:""}} : opts;
	if (typeof opts.load !== "undefined") { return; }

	CPX.Object.call(this);
	
	this.uid = "A"+makeUID(23);

	//Creates a specific random number generator based upon the uid seed
	this.RNG = new CPX.RNG(this.uid);

	this.type="Area";
	this.size = -1;

	var getName = NameGenerator(this.RNG.rndInt(1,9999999));
	this.name = getName();
	
	this._parent=opts.parent.uid;
	this._realm=opts.parent._realm;

	this.location=[];

	this.neighboors=[];  //ha the following format [uid,isLocked,keyid,isSecret]

	this._visited = false;
	this._owner="";
	this.assets=[];
	this.advancements=[0,0,0,0,0,0,0,0,0];
	this.units=[];

	this._attacker="";
	this.trouble=[];
	this.knownRuins=[];

	this._isBase=false;

	this._onEnter= function() { return; }

	var auto = typeof opts.auto === "undefined" ? false : opts.auto;
	if (auto) { this.initialize(); }

}
CPX.Area.inherits(CPX.Object);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.Area.prototype.initialize = function () {


	//save the initial 
	var sa = ["_realm","_parent","children","visible","name","type","size","location","links","_visited","_owner","_isBase","assets","advancements","units","_attacker","trouble","knownRuins"];
	cpxSave({obj:this,doc:cpxSaveCompile(this,sa),initial:true});
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.galaxyArea=function (opts) {}
CPX.galaxyArea.inherits(CPX.Area);

CPX.galaxyArea.prototype.galaxy = function () {
	if (this.type == "Galaxy") { return this; }
	else { return this.parent().galaxy(); }
}
CPX.galaxyArea.prototype.sector = function () {
	if (this.type == "Sector") { return this; }
	else { return this.parent().sector(); }
}
CPX.galaxyArea.prototype.system = function () {
	if (this.type == "System")  { return this; }
	else { return this.parent().system(); }
}
CPX.galaxyArea.prototype.systemLocation  =function () {
	var pS=this.system();
	return pS.location;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Area.prototype.owner =function () {
	return this.lookup(this._owner);
}
CPX.Area.prototype.attacker =function () {
	return this.lookup(this._attacker);
}
CPX.Area.prototype.unit =function (i) {
	return this.lookup(this.units[i]);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.Area.prototype.setLocation =function (location) {
	this.location=location;
}
CPX.Area.prototype.makeOwner =function (faction) {
	this._owner=faction;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//if makeowner then make the faction the owner of the parent area
CPX.Area.prototype.addBase =function (faction,makeowner) {
	makeowner = typeof makeowner === "undefined" ? false : makeowner;
	if(makeowner) { this.makeOwner(faction); }

	var nB= new CPX.Area({parent:this,auto:true});
	nB.size=this.size-2;
	nB._isBase=true;
	nB.makeOwner(faction);

	this.realm().dbPush(nB);
	this.children.push(nB.uid);
	this.lookup(faction).bases.push(nB.uid);

	return nB;
}
CPX.Area.prototype.addResource =function () {
	this.assets.push("resource");
}
CPX.Area.prototype.addRuin =function () {
	var nS = new CPX.Ruin({parent:this});

	this.realm().dbPush(nS);
	this.children.push(nS.uid);

	return nS;
}
CPX.Area.prototype.addTrouble =function () {
	var T=CPX.randomTrouble(this.RNG), hp=this.RNG.rndInt(1,6)+2;
	T[2]=cpxVar.heroApproaches.indexOf(T[2]);

	//[name,skill,approach,current hp, max hp]
	this.trouble=[T[0],T[1],T[2],hp,hp];

//	this.realm.GUI.updateField(this.uid+"Trouble","T");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Area.prototype.reduceTrouble =function (val) {
	this.trouble[3]-=val;
	if (this.trouble[3]<1) { 
		this.removeTrouble(); 
		return -1;
	}
	
	return this.trouble[3];
}
CPX.Area.prototype.increaseTrouble =function (val) {
	this.trouble[3]+=val;
	return this.trouble[3];
}
CPX.Area.prototype.removeTrouble =function () {
	this.trouble.length = 0;
	//update display
	this.realm().GUI.updateField(this.uid+"_Trouble","");
}

CPX.Area.prototype.removeUnit =function (uid) {
	var ui=this.units.indexOf(uid);
	if(ui>-1) {
		this.units.splice(ui,1);
	}
}
CPX.Area.prototype.removeChild =function (uid) {
	var ui = this.children.indexOf(uid);
	if(ui>-1) {
		this.children.splice(ui,1);
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



CPX.Area.prototype.findBases =function () {
	var ba=[], A=this;

	if(this.children.length>0) {
		this.children.forEach(function (c){ 
			if (A.lookup(c)._isBase) { ba.push(c); }
		});
	}

	return ba;
}
CPX.Area.prototype.findAllBases =function () {
	var ba=[], ca=[], cc={}, A=this;

	if(this.children.length>0) {
		this.children.forEach(function (c){
			cc=A.lookup(c); 
			if (cc._isBase) { ba.push(c); }
			else {
				ca=cc.findAllBases();
				if(ca.length>0) { ba=ba.concat(ca); }
			}
		});
	}

	return ba;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.Area.prototype.listFactions =function () {
	var ca=[], ta=[], fuids=[], cb={}, A=this;

	ba=this.findAllBases();
	ba.forEach(function(b){
		cb=A.lookup(b);
		if (fuids.indexOf(cb._owner) == -1) { 
			if (cb.owner().type=="Threat") {ta.push(cb._owner);}
			else {ca.push(cb._owner);}
			fuids.push(cb._owner); 
		}	
	});
	
	return [ca,ta];
}
CPX.Area.prototype.factionColors =function () {
	var cF={}, F=this.listFactions(), n=F[0].length+F[1].length, w=15*n, color='';
	F=F[0].concat(F[1]);

	var html='<svg width="'+w+'" height="10">';
	for (var i=0; i< n; i++) {
		cF=this.lookup(F[i]);
		color='rgb('+cF.color[0]+','+cF.color[1]+','+cF.color[2]+')';
		html+='<rect x="'+i*15+'" width="10" height="10" style="fill:'+color+'" />';	
	}
	html+='</svg>';

	return html;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Area.onEnter = function () {}

CPX.Area.prototype.enter = function (from,who) {
	CPX.Area.onEnter(from,this,who);

	if( this.type != "Area" ) { CPX[this.type].onEnter(from,this,who); }
	if (typeof this.onEnter !== "undefined") { CPX.Enter[this.onEnter](from,this,who); }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* Prototype display setup
 Every area type should have its own:
 selfDisplay - what to diplay when it is the focus 
 childDisplay - what to display when it is a child in the scene
 neighboorDisplay - what to display when it is a neighboor in the scene
 infoDisplay - what to display to the GUI when it is the focus

*/

CPX.Area.onDisplay = function (area) {}

CPX.Area.prototype.display =function () {
	var R= this.realm();
	
	R.GUI.clearAll();
	cpxTwoD.world.removeAll();

	R.GUI.playerStats(R,this);

	CPX.Area.onDisplay(this);

	if( this.type != "Area" ) { CPX[this.type].onDisplay(this); }
	if (typeof this.onDisplay !== "undefined") { CPX.onDisplay[this.onDisplay](area); }

	CPX[this.type].selfDisplay(this);

	CPX[this.type].infoDisplay(this);

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//html to return to the parent when the parent updates the GUI
CPX.Area.childInfoDisplay = function (area) {
	var name="", reveal="", T="", colors="", uid="", trouble=false;

	if (area._isBase) {
		var P=area.parent(); 
		colors=P.factionColors();
		if (!P.visible) { reveal = "noreveal"; } 
		uid=P.uid;
		if (P.trouble.length>0) { trouble = true; }
		name=P.name;
	}
	else {
		colors=area.factionColors();
		if (!area.visible) { reveal = "noreveal"; } 
		uid=area.uid;
		if (area.trouble.length>0) { trouble = true; }
		name=area.name;
	}

	var html='<div class="areaShort '+reveal+'" id="'+uid+'_Area" data-uid='+uid+'>';
	html+=colors;

	if(trouble) {T="T";}
	html+='<span class=assaultStatus id="'+uid+'_Assault"></span> ';
	html+='<span class=troubleMark id="'+uid+'_Trouble">'+T+'</span>';

	html+=name;
	html+='</div>';

	return html;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.Area.prototype.select =function () {
	this.selected=true;
}
CPX.Area.prototype.deselect =function () {
	this.selected=false;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Ruin=function (opts) {
	if (typeof opts.load !== "undefined") { return; }
	
	CPX.Area.call(this, opts);

	this.type="Ruin";
	this.visible=false;
	this.initialize();
}
CPX.Ruin.inherits(CPX.Area);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//html to return to the parent when the parent updates the GUI
CPX.Ruin.childInfoDisplay = function (ruin) {
	var reveal="", html="";

	if (!ruin.visible) { reveal = "noreveal"; } 
	html='<div class="areaShort '+reveal+'" id="'+ruin.uid+'_Ruin" data-uid='+ruin.uid+'>';
	html+=ruin.name+" "+cpxVar.areaSizes[ruin.size];
	html+='</div>';

	return html;
}

//what to display when it is a child in the scene
CPX.Ruin.childDisplay = function (system) {
	if(!system.visible) { return; }

	var P=system.parent(), scale=P.twoD.width/P.width;
	var x = P.twoD.x+P.twoD.width/2, y= P.twoD.y+P.twoD.width/2;
	x+=system.getX()*scale, y+= P.twoD.y+system.getY()*scale;

	var color= "0x"+rgbToHex(system.owner().color[0],system.owner().color[1],system.owner().color[2]);

    this.twoD = cpxTwoD.add.sprite(x, y, 'circle');
    this.twoD.scale.setTo(0.058, 0.058);
    this.twoD.tint = Math.random() * 0xffffff;
    this.twoD.inputEnabled = true;
    this.twoD.input.pixelPerfectClick = true;
    this.twoD.events.onInputDown.add(clicked, system);
}

