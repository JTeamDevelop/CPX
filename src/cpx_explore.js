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



CPX.EpicRegion = function (opts) {
    CPX.Area.call(this,opts);

    this.uid = "R"+makeUID(35);
    this.type="EpicRegion";

}
CPX.EpicRegion.inherits(CPX.Area);

CPX.EpicSite = function (opts) {
    CPX.Area.call(this,opts);
	
	this.name = typeof opts.name === "undefined" ? "" : opts.name;
	this.size = typeof opts.size === "undefined" ? -1 : opts.size;
	this.subtype = typeof opts.nature === "undefined" ? "random" : opts.subtype;
	this.generated = typeof opts.gen === "undefined" ? false : opts.gen;
    
    this.uid = "S"+makeUID(35);
    this.type="EpicSite";
    
}
CPX.EpicSite.inherits(CPX.Area);

CPX.EpicSite.generate = function (site,seed) {
	var RN=new CPX.RNG(seed);
	
	if(site.name.length == 0) { 
		var getName = NameGenerator(RN.rndInt(1,9999999));
		site.name=getName(); 
	}
	
	function Small () {
		return [RN.rndInt(1,4) , RN.rndInt(1,6)+2];	
	}
	function Medium () {
		return [RN.rndInt(1,6) , RN.multiRoll(1,6,2)+4];	
	}
	function Large () {
		return [RN.rndInt(1,6)+1 , RN.multiRoll(1,6,3)+6];	
	}
	function Huge () {
		return [RN.rndInt(1,6)+2 , RN.multiRoll(1,6,4)+10];	
	}	
	
	if(site.size == -1) {
		var size =[Small,Small,Small,Medium,Medium,Medium,Medium,Medium,Medium,Large,Large,Huge];
		size = RN.rndArray(size);
		size = size();
		site.themes=size[0];
		site.size=size[1];
	}

	var i = 0, j = 1, links=[], ra=-1, rt="Common";
	for (i = 0 ; i < site.size; i++ ) {
		ra = RN.rndInt(1,12);
		if(ra>9) {rt = "Unique";}
		site.children[i] = [rt];
	}	

	if(site.size>2) {
		//random	
		if(site.subtype == "random") {
			for (i = 0 ; i < site.size-2 ; i++ ) {
				links.push(RN.rndInt(0,site.size[1]-1)); 
			}
		}
		//tower
		else if(site.subtype == "tower") {
			while (i< site.size-2) {
				if( RN.RND() < 0.5 ) { links.push(j); i++; }
				else {
					links.push(j);
					links.push(j);
					i+=2;
				}
				j++;		
			}
		}
		//wide
		else if(site.subtype == "wide") {
			var ncore=[2,3,3,4,4,5,5,6], n=-1, k=0, picked=[];
			while (i< site.size[1]-2) {
				n = RN.rndArray(ncore);
				if ( i+n > site.size-2 ) { n = site.size-2 - i; }
			
				j = RN.rndInt(0,site.size-1);
				while ( picked.test(j) ) { j = RN.rndInt(0,site.size-1); }
				picked.push(j);

				for(k=0 ; k < n ; k++) {
					links.push(j);
				}			
			
				i+= n;		
			}
		}

	}
	var linkPrufer = Prufer(links);
	
	var r=[];
	site.innerLinks = {};
	linkPrufer.forEach(function(l) {
		if( !r.test(l[0]) ) {  
			r.push(l[0]);
			site.innerLinks[l[0]]=[l[1]];		
		}
		else {
			site.innerLinks[l[0]].push(l[1]);
		}
		if( !r.test(l[1]) ) {  
			r.push(l[1]);
			site.innerLinks[l[1]]=[l[0]];		
		}
		else {
			site.innerLinks[l[1]].push(l[0]);
		}
	});
	
}

$(window).load(function(){
    var R = cpxRealms["planes"] = {db:{}, uid:"planes",_realm:"planes"};	
    var S= new CPX.EpicSite({parent:R});
    CPX.EpicSite.generate(S);
	
    console.log(S);

    $("#cpxcanvas").append('<div class="center" id="planes" />');
  //  for(var x in P.db) {
//        if(P.db[x].type == "EpicWorld") { $("#planes").append(P.db[x].arrayDisplay()); }
//    }

});
