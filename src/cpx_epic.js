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

cpxVar.worldTags = ["Ancient Ruins","Aquatic Races","Badlands","Burning","Civil War", "Cold", "Cosmic Prison", "Desert", 
"Extreme Geology", "Feral", "Flying Islands", "Freak Weather", "Friendly Foe", "Frozen", "High Magic", "Hi-tech", "Hollow Earth", 
"Intelligent Animals", "Jungle", "Megaflora and Fauna", "Mountainous", "Myriad Races", "Oceanic", "Small Oceans", "Sprawling Cities", 
"Steampunk", "Stoneage", "Underdark", "Vassal World", "World War"];

cpxVar.pantheons = ["Norse", "Indian", "Greek", "Egyptian", "Lovecraftian", "Aztec", "Babylonian", "Chinese"];

CPX.Pantheon = function (opts) {
    if (typeof opts.load !== "undefined") { return; }
	
	CPX.Faction.call(this,opts);

	//creates a completely random seed
	this.uid = "P"+makeUID(29);

    this._group = typeof opts.group === "undefined" ? "" : opts.group;
    this.levels = typeof opts.levels === "undefined" ? 1 : opts.levels;
    this.deities = typeof opts.deities === "undefined" ? [""] : opts.deities; 

    this.type="Pantheon";

    var ndp=0, nb=0, i=0, DP=[], RN=new CPX.RNG(), R=opts.realm;
    if (this.levels == 7) { ndp = RN.rndInt(1,6); nb = 9; }
    else if (this.levels == 5) { ndp = RN.rndInt(1,3); nb = 6; }
    else if (this.levels == 3) { ndp = 1; nb = 2; }

    for (i = 0 ; i < ndp ; i ++) {
        DP[i] = new CPX.EpicWorld({parent:R});
        R.db[DP[i].uid]=DP[i];
    }

    var worlds = [], cW={}, cR={};
    for (var x in R.db) {
        if (R.db[x].type == "EpicWorld") { worlds.push(x); }
    } 

    for (i=0 ; i<nb ; i++) {
        cW = R.db[RN.rndArray(worlds)];
        cR = R.db[RN.rndArray(cW.children)];
        cR.addBase(this.uid);        
    }

}

CPX.generatePantheon = function (seed) {
    var RN=new CPX.RNG(seed), n= RN.multiRoll(1,6,2), P={};

    var R=cpxRealms["planes"];

    function addDeity (n) {
        for (var i = 0; i < n ; i++) {
            P = new CPX.Pantheon({realm:R, group:RN.rndArray(cpxVar.pantheons),levels:3});
        }
        R.db[P.uid]=P;
    }

    var group = [], cp="";
    for (var i = 0; i < 3 ; i++) {
        cp = RN.rndArray(cpxVar.pantheons);
        while ( group.test(cp) ) { cp = RN.rndArray(cpxVar.pantheons); }
        group.push(cp);
    }
    
    if (n == 2) { addDeity(RN.multiRoll(1,6,3)); }
    else if (n == 3 || n == 4) { 
        P = new CPX.Pantheon({realm:R, group:group[0],levels:5});   //RN.rndInt(1,6)
        R.db[P.uid]=P; 
        addDeity(RN.multiRoll(1,6,2)); 
    }
    else if (n == 5) {
        P = new CPX.Pantheon({realm:R, group:group[0],levels:5});   //RN.multiRoll(1,4,2)
        R.db[P.uid]=P; 
        P = new CPX.Pantheon({realm:R, group:group[1],levels:5});   //RN.multiRoll(1,4,2)
        R.db[P.uid]=P; 
    }
    else if (n == 6 || n == 7 || n == 8) { 
        P = new CPX.Pantheon({realm:R, group:group[0],levels:5});   //RN.multiRoll(1,6,1)
        R.db[P.uid]=P;
        P = new CPX.Pantheon({realm:R, group:group[1],levels:5});   //RN.multiRoll(1,6,1)
        R.db[P.uid]=P;
        P = new CPX.Pantheon({realm:R, group:group[2],levels:5});   //RN.multiRoll(1,6,1)
        R.db[P.uid]=P;
    }
    else if (n == 9) {
        P = new CPX.Pantheon({realm:R, group:group[0],levels:7});   //RN.multiRoll(1,6,1)
        R.db[P.uid]=P;
        P = new CPX.Pantheon({realm:R, group:group[1],levels:5});   //RN.multiRoll(1,6,1)
        R.db[P.uid]=P;
        P = new CPX.Pantheon({realm:R, group:group[2],levels:5});   //RN.multiRoll(1,6,1)
        R.db[P.uid]=P; 
    }
    else if (n == 10 || n == 11) { 
        P = new CPX.Pantheon({realm:R, group:group[0],levels:7});   //RN.multiRoll(1,4,2)
        R.db[P.uid]=P;
        P = new CPX.Pantheon({realm:R, group:group[1],levels:7});   //RN.multiRoll(1,4,2)
        R.db[P.uid]=P;
    }
    else if (n == 12) { 
        P = new CPX.Pantheon({realm:R, group:group[0],levels:7});   //RN.multiRoll(1,6,1)+1
        R.db[P.uid]=P;
        addDeity(RN.multiRoll(1,6,2));
    }

}

CPX.generateMortalPlanes = function (seed) {
    var RN=new CPX.RNG(seed), n= RN.multiRoll(1,3,2), i=0, g=0;
    var R = cpxRealms["planes"] = {db:{}, uid:"planes",_realm:"planes"};

    var p = [], names=[];
    for (i = 0 ; i < n ; i ++) {
        p[i] = new CPX.EpicWorld({parent:R});
        names[i] = p[i].uid;
    }

    var l=-1, j=0, planes = {};
    for (i = 0 ; i < n ; i ++) {
        p[i].links = names.slice(0);
        p[i].links.splice(i,1);
        p[i].links = RN.shuffleAr(p[i].links);
        l=RN.rndInt(1,6);
        p[i].links = p[i].links.slice(0,l);

        R.db[p[i].uid]=p[i];
    }

    CPX.generatePantheon();

}

CPX.EpicRegion = function (opts) {
    CPX.Area.call(this,opts);

    this.uid = "R"+makeUID(35);
    this.type="EpicRegion"

}
CPX.EpicRegion.inherits(CPX.Area);

CPX.EpicWorld = function (opts) {
    CPX.Area.call(this,opts);

    this.uid = "W"+makeUID(35);
    this.type="EpicWorld"

    var RN = new CPX.RNG(this.uid);
	var getName = NameGenerator(RN.rndInt(1,9999999));

    this.name=getName();

    function rndColor () {
        return '#'+(RN.RND()*0xFFFFFF<<0).toString(16);
    }
    function rndWorld () {
        if (RN.RND()<0.5) { return "World"; }
        else { return "Plane "+ RN.FateRoll(); }
    }

    this.color=rndColor();
    this.subtype=rndWorld();
    this.tags= [RN.rndArray(cpxVar.worldTags),RN.rndArray(cpxVar.worldTags)];
    this.links=[];

    for(var i = 0; i < RN.rndInt(1,4)+1 ; i++ ) { this.addRegion(); } 

}
CPX.EpicWorld.inherits(CPX.Area);
CPX.EpicWorld.prototype.addRegion = function () {
    var ER = new CPX.EpicRegion({parent:this});

    this.children.push(ER.uid);
    this.realm().db[ER.uid] = ER;
}
CPX.EpicWorld.prototype.arrayDisplay = function () {
    var html = '<div class=planeArray id="'+this.uid+'_Array" data-uid='+this.uid+'>';
    html+='<h3 class=center>'+this.name+'</h3>';
    
    html+='<svg class=center width="200" height="150">';

    if(this.subtype == "World") {
        html+='<circle cx="100" cy="75" r="35" stroke="black" stroke-width="1" fill="'+this.color+'" />';
    }
    else {
        var poly = regularPolygon(100, 75, 35, 6);
        html+='<polygon points="'+poly.text+'" style="fill:'+this.color+';stroke:black;stroke-width:1" />';  
    }

    var i=0, ln=this.links.length, sx=0, color=""; 
    for(i=0 ; i < ln ; i++) {
        sx=100-(15*ln/2)+2.5+15*i;
        lp=this.lookup(this.links[i]);
        html+='<rect x="'+sx+'" y="115" width="10" height="10" style="fill:'+lp.color+';stroke:pink;stroke-width:0" >';
        html+= '<title>'+lp.name+'</title></rect>'
    }

    html+='</svg>';

    html+='<div class="center tags">'+this.tags[0]+'</br>'+this.tags[1]+'</div>';

    html+='</div>';

    return html;
}

$(window).load(function(){
    CPX.generateMortalPlanes();

    var P=cpxRealms["planes"];
    console.log(P.db);

    $("#cpxcanvas").append('<div class="center" id="planes" />');
    for(var x in P.db) {
        if(P.db[x].type == "EpicWorld") { $("#planes").append(P.db[x].arrayDisplay()); }
    }

});
