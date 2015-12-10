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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Basic System object - a star system
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//cpxVar.objectSave = ["_realm","_parent","children",visible"];
//cpxVar.areaSave = cpxVar.objectSave.concat(["name","type","size","location","links","_owner","_isBase","assets","advancements","units","_attacker","trouble","knownRuins"]);

CPX.System =function (opts) {
	if (typeof opts.load !== "undefined") { return; }
	
	CPX.Area.call(this, opts);

	this.uid = "3"+makeUID(23);
	this.RNG = new CPX.RNG(this.uid);
	
	this.type="System";

	this.initialize();
}
CPX.System.inherits(CPX.galaxyArea);

CPX.System.prototype.getX =function () { return this.location[0]; }
CPX.System.prototype.getY =function () { return this.location[1]; }
//Determines a random position based upon the sector coords
CPX.System.prototype.rndPosition =function () {
	var ss=this.galaxy.sectorSize*10/2;
	return [this.RNG.rndInt(-ss,ss)/10,this.RNG.rndInt(-ss,ss)/10,this.RNG.rndInt(-ss,ss)/10];
}
CPX.System.prototype.newHabitable =function () {
	this.location = this.rndPosition();
	var RN=this.RNG;

	var nw=new CPX.Planet();
	nw.parent=this;
	nw.galaxy=this.galaxy;
	nw.newHabitable();

	if (RN.RND()<0.5) {
		this.star=0;
	}
	else {
		this.star=3;
		nw.subtype=1;
	}

	this.children.push(nw);
	return this.children.last();
}
//Generates the system
CPX.System.prototype.newMain =function () {
	this.location = this.rndPosition();
	var RN=this.RNG;
	
	this.star=0;
	var nw=new CPX.Planet();
	nw.galaxy=this.galaxy;
	nw.parent=this;

	if (RN.RND()<0.5) {	
		if (RN.RND()<0.5) {	nw.newHabitable(); }
		else {	nw.newRndSH(); }
	}
	else { nw.newRandom(); }

	this.children.push(nw);
	return this.children.last();
}
//Generates the system
CPX.System.prototype.newGiant =function () {
	this.location = this.rndPosition();
	var RN=this.RNG;
	
	this.star=RN.rndInt(1,2);
	var nw=new CPX.Planet();
	nw.galaxy=this.galaxy;
	nw.parent=this;
	nw.newRandom(); 
	
	this.children.push(nw);
	return this.children.last();
}
//Generates the system
CPX.System.prototype.newMulti =function () {
	this.location = this.rndPosition();
	var RN=this.RNG;
	
	this.star=RN.rndInt(3,4);
	var nw=new CPX.Planet();
	nw.galaxy=this.galaxy;
	nw.parent=this;
	
	if (this.star==3) {
		if (RN.RND()<0.5) {	
			nw.newHabitable(); 
			nw.subtype=1;
		}
		else { nw.newRandom(); }
	}
	else { nw.newRandom(); }

	this.children.push(nw);
	return this.children.last();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//what to display when it is a child in the scene
CPX.System.childDisplay = function (system) {
	if(!system.visible) { return; }

	var P=system.parent(), scale=P.twoD.width/P.width;
	var x = P.twoD.x+P.twoD.width/2, y= P.twoD.y+P.twoD.width/2;
	x+=system.getX()*scale, y+= P.twoD.y+system.getY()*scale;

	var color= "0x"+rgbToHex(system.owner().color[0],system.owner().color[1],system.owner().color[2]);

/*
    this.twoD = cpxTwoD.add.sprite(x, y, 'circle');
    this.twoD.scale.setTo(0.058, 0.058);
    this.twoD.tint = Math.random() * 0xffffff;
    this.twoD.inputEnabled = true;
    this.twoD.input.pixelPerfectClick = true;
    this.twoD.events.onInputDown.add(clicked, system);
   */
}

CPX.System.prototype.twoDisplay =function () {

/*	
	this._ThreeD=[];
	
	var l= this.location, F=this.listFactions()[0];

	var G=this.Galaxy();
	if (G === "undefined") { G=cpxVar.basicGalaxy; }
	var n=500/(G.sectorSize/2);

	// Lights, color, intensity, distance
	this._ThreeD[0] = new THREE.PointLight( 0x0040ff, 2.5, 100 );
	this._ThreeD[0].userData.structure=this;

	//star sprite
	var map = THREE.ImageUtils.loadTexture( "images/white.png" );
    var material = new THREE.SpriteMaterial( { map: map, color: 0x0040ff, fog: true } );
    this._ThreeD[1] = new THREE.Sprite( material );
    this._ThreeD[1].scale.set( 20, 20, 1 );
   	this._ThreeD[1].position.set( l[0]*n, l[1]*n, l[2]*n );
   	this._ThreeD[1].userData.structure=this;
	//add sprite to light
	this._ThreeD[0].add( this._ThreeD[1] );

	//label
	var color=F[0].color;
	if(F.length>1) { color=[96,96,96]; }
	this._ThreeD[2] = makeTextSprite( " " + this.name + " ", { fontsize: 50, backgroundColor: {r:color[0], g:color[1], b:color[2], a:1} } );
	this._ThreeD[2].position.set( l[0]*n+30, l[1]*n+30, l[2]*n+30 );
	this._ThreeD[2].userData.structure=this;
	//add sprite to light
	this._ThreeD[0].add( this._ThreeD[2] );

	//assault sprite, only added during assault, color = red
	map = THREE.ImageUtils.loadTexture( "images/star.png" );
    material = new THREE.SpriteMaterial( { map: map, color: 0xff0000, fog: true } );
    this._ThreeD[3] = new THREE.Sprite( material );
    this._ThreeD[3].scale.set( 50, 50, 1 );
    this._ThreeD[3].position.set( l[0]*n, l[1]*n, l[2]*n );

    //marker sprite - green
	map = THREE.ImageUtils.loadTexture( "images/marker_green_46.png" );
    material = new THREE.SpriteMaterial( { map: map, color: 0x00ff00, rotation:Math.PI/4, fog: true } );
    this._ThreeD[4] = new THREE.Sprite( material );
    this._ThreeD[4].scale.set( 10, 10, 1 );
   	this._ThreeD[4].position.set( l[0]*n, l[1]*n, l[2]*n+35 );
	//add sprite to light

    this.realm.ThreeD.addStar(this);

    */

}
CPX.System.prototype.clearDisplay =function () {
	this._ThreeD.length=0;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.System.onEnter = function (from,area,who) {

	if(area._attacker.length>0) { area.realm().GUI.attackerAlert(area); }
	if(area.trouble.length>0) { area.realm().GUI.troubleNotice(area); }
	if(area.knownRuins.length>0) 
	{ 
		area.realm().GUI.ruinNotice(area);
		area.knownRuins.length=0; 
	}

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

cpxVar.worldTypes=["Habitable","Habitable Moon","Semi-habitable","Near Orbit","Gas Giant","Gas Giant", "Far Orbit", "Asteroid"];
cpxVar.habitableTScale=["Frigid", "Cold", "Cool","Temperate","Temperate", "Temperate","Warm", "Hot","Burning"];
cpxVar.lscale=[0.25,0.41,0.54,0.64,0.7,0.73,0.78,0.85,0.9];

CPX.Planet=function (opts) {
	opts = typeof opts === "undefined" ? {} : opts;
	CPX.Area.call(this, opts);

	this.uid = typeof opts.seed === "undefined" ? "W"+makeUID(23) : opts.seed;
	this.RNG = new CPX.RNG(this.uid);

	var getName = NameGenerator(this.RNG.rndInt(1,9999999));
	this.name = getName();

	this.type="Planet";

	this.newTags();

	//setup the data to save when SaveData is called
	this.save=["uid"];
}
CPX.Planet.inherits(CPX.galaxyArea);
//Generates the system tags
CPX.Planet.prototype.newTags =function () {
	this.tags=[];
	var RN=this.RNG;
	
	function newTag (system) {
		var nt=RN.rndArray(Tags.array());
		return new Tags.list[nt](system);
	}

	this.tags.push(newTag(this));
	
	do {
		this.tags[1] = newTag(this);	
	}
	while (this.tags[0].name==this.tags[1].name);
	
}
CPX.Planet.prototype.newHabitable = function () {
	var RN=this.RNG;
	this.subtype=0;

	this.temp=RN.FateRoll();
    this.moisture=RN.FateRoll();
    this.land=RN.FateRoll();
    this.continents=RN.FateRoll();  

}
CPX.Planet.prototype.newRndSH = function () {
	var RN=this.RNG;
	this.subtype=0;

	this.temp=RN.FateRoll();
  
}
CPX.Planet.prototype.newRandom = function () {
	var RN=this.RNG;
	this.subtype=RN.rndInt(2,6);
    
}
CPX.Planet.prototype.setLocation = function (array) {
	this.location=array;
}
CPX.Planet.prototype.supportingData = function () {
	var x="";
	var types=["habitable","habitablemoon","semihabitable","nearorbit","gasgiant","gasgiant","farorbit","asteroid"];
	x+=$("#"+types[this.subtype]).html();

	return x;
}
CPX.Planet.prototype.shortDisplay = function () {
	var x='<div class=pclass><em>'+worldTypes[this.subtype]+':</em> ';
	
	var types=["habitable","habitablemoon","semihabitable","nearorbit","gasgiant","gasgiant","farorbit","asteroid"];
	x+=$("#"+types[this.subtype]).text();
    
	if (this.subtype<2) {
		x+='<div id=temp><strong>Temperature:</strong> '+habitableTScale[this.temp+4] + '</div>';
	}
	
	return x;
}
CPX.Planet.prototype.Display = function () {
	var v=cpxVar;
	
	var x='<div class=pclass><strong>Class:</strong> '+v.worldTypes[this.subtype]+'</div>';
	  
	if (this.subtype<2) {
		x+='<div id=temp><strong>Temperature:</strong> '+v.habitableTScale[this.temp+4] + '</div>';
	}

	var tar=[];
	x+='<div id=tags><strong>Tags: </strong>';
	this.tags.forEach(function(t){
		tar.push(t.txtSimple());		
	});
	x+=tar.readable()+"</div>";

	var types=["habitable","habitablemoon","semihabitable","nearorbit","gasgiant","gasgiant","farorbit","asteroid"];
	x+="<div class=info>";
	x+=$("#"+types[this.subtype]).html();
	x+="</div>";

	return x;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$(window).load(function(){



});

