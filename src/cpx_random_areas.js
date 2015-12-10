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


CPX.Realm.prototype.areaRandom =function () {
	this.build=[];
    var RN=this.RNG, nt=[1,1,2,2,2,2,3,3,4], i=0, j=0, n=0, nmj=0, nmi=0, m=0;

	//add major steading
    var nm=[0,1,1,1,2,2,3,3,4];
    nmj=this.size;
    if(this.size<0) { nmj=nm[RN.FateRoll()+4]; }
    for (i=0;i<nmj;i++) { this.build.push("mj"); }

	//add minor steading
    m=RN.rndInt(3,5);
    for(j=0;j<m;j++) { this.build.push("mi"); nmi++; } 
    for (i=1;i<nmj;i++) {
    	m=RN.rndInt(3,5);
        for(j=0;j<m;j++) { this.build.push("mi"); }
        nmi++;
    }

	//add ruins
    m=RN.rndInt(4,6);
    for(j=0;j<m;j++) { this.build.push("ru"); } 
    n=nmj;
    if(n<2) { n = 3; }
    else if(n==2) { n= 2; }
    else { n= 1; }
    for (i=1;i<n;i++) {
        m=RN.rndInt(4,6);
        for(j=0;j<m;j++) { this.build.push("ru"); }
    }

	//add resource
    for (i=0;i<nmi;i++) { this.build.push("re"); } 

	//add threats
    m=RN.rndInt(5,7);
    for(j=0;j<m;j++) { this.build.push("t"); } 
    for (i=1;i<nmj;i++) {
        m=RN.rndInt(5,7);
        for(j=0;j<m;j++) { this.build.push("t"); }
    }
}

CPX.Realm.prototype.ruinRandom =function () {
	if (!this.auto) {return;}
	var RN=this.RNG;
//	this.generatePW();

	this.builder=RN.rndInt(0,cpxVar.ruinBuilder.length-1);
	this.function=RN.rndInt(0,cpxVar.ruinFunction.length-1);
	this.ruination=RN.rndInt(0,cpxVar.ruinRuination.length-1);
	
	this.nature=RN.rndInt(0,cpxVar.ruinNature.length-1);
	this.traits=RN.rndInt(0,cpxVar.ruinTraits.length-1);
	this.stats=[0,0,0];
}
//Scarlet Heroes generator for a ruin
CPX.Realm.prototype.ruinGenereateSH =function () {
    var RN=this.RNG;

	function rndSHSize () {
		this.parts=[];
		this.size=RN.rndInt(1,12);
		
		switch(this.size) {
    		case 1: this.parts.push(RN.Dice(1,6)); 
    			break;
    		case 2: this.parts.push(RN.Dice(2,6)); 
    			break;
    		case 3: this.parts.push(RN.Dice(3,6)); 
    			break;
    		case 4: this.parts.push(RN.Dice(1,10,10)); 
    			break;
    		case 5: this.parts.push(RN.Dice(1,10,5)); 
    			break;
    		case 6: 
    			this.parts.push(RN.Dice(3,6)); 
    			this.parts.push(RN.Dice(3,6)); 
    			break;
    		case 7: this.parts.push(RN.Dice(1,20)); 
    			break;
    		case 8: this.parts.push(RN.Dice(2,12)); 
    			break;
    		case 9: 
    			for (var i=0;i<RN.rndInt(1,6);i++) {
    				this.parts.push(RN.Dice(1,20));     				
    			}
    			break;
    		case 10: this.parts.push(RN.Dice(1,12,10)); 
    			break;
    		case 11: this.parts.push(RN.Dice(2,20)); 
    			break;
    		case 12: this.parts.push(RN.Dice(1,100)); 
    			break;
		}
	}

	
}
//SH RandomRoom  Encounter generator
CPX.Realm.prototype.ruinGenereateSHEncounter = function () {
    var RN=this.RNG;
    var x="";

	var e=RN.rndInt(1,10);
	var t=RN.rndInt(1,10);
	var h=RN.rndInt(1,10);
	var f=RN.rndInt(1,10);

	if (e>7) {e="Y";}
	
	if (t>7) {
		if (t==10) {t+="Y";}
		else {t="H";}
		if (e!="Y") {h+=3;}
	}
	
	if (h>9) {h="Y";}


}
//Perilous Wilds generator for a ruin
CPX.Realm.prototype.ruinGenereatePW =function () {
    var RN=this.RNG;

	function rndPWSize () {
	    var s=RN.rndInt(1,12);
    	if(s<4) { this.size=0; }
    	else if(s<10) { this.size=1; }
    	else if(s<12) { this.size=2; }
    	else { this.size=3; }
	}

    if(this.size<0) { rndPWSize(); }

	switch(this.size) {
    	case 0:
        	this.themes=2;
        	var t=RN.rndInt(1,4);
        	if (t>2) { this.themes=t; }

        	this.areas=RN.rndInt(1,6)+2;
        	break;
    	case 1:
        	this.themes=3;
        	var t=RN.rndInt(1,6);
        	if (t>3) { this.themes=t; }

        	this.areas=RN.multiRoll(1,6,2)+4;        	
        	break;
		case 2:
	        this.themes=4;
        	var t=RN.rndInt(1,6)+1;
        	if (t>4) { this.themes=t; }

        	this.areas=RN.multiRoll(1,6,3)+6;        	
        	break;
		case 3:
        	this.themes=5;
        	var t=RN.rndInt(1,6)+2;
        	if (t>5) { this.themes=t; }

        	this.areas=RN.multiRoll(1,6,4)+10;         	
        	break;
	}

}

$(window).load(function(){
	
});
