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


/////////////////////////////////////////////////////////////////////////////////
// Basic Galaxy object

cpxVar.sectorSize = 4000;

CPX.Galaxy=function (opts) {
	opts = typeof opts === "undefined" ? {realm:{}} : opts;
	if (typeof opts.load !== "undefined") { return; }

	CPX.Area.call(this, {parent:opts.realm});
	
	this.uid = "1"+makeUID(23);
	this.RNG = new CPX.RNG(this.uid);
	
	this.radius = typeof opts.radius === "undefined" ? 50000 : opts.radius;
	this.height = typeof opts.height === "undefined" ? 4000 : opts.height;
	this.sectorSize = typeof opts.sector === "undefined" ? 4000 : opts.sector;

	this.initialize();
}
CPX.Galaxy.inherits(CPX.galaxyArea);
CPX.Galaxy.prototype.initialize =function () {
	this.RNG = new CPX.RNG(this.uid);

	//The TL 0,1 civlizaiton #s of a standard 4000ly sector 
	//This will create a total galaxy population of ~1000 civilizations
	this.sectorPop=[1,1,1,2,2,2,3,3,4];

	this.type = "Galaxy";
	this.size=12;
	this.sectorList={};
	this.sectorCount=[0,0];

	var mr=this.radius/cpxVar.sectorSize, i=0, j=0; 
	for(i=-Math.floor(mr); i< mr ; i++) {
		for(j=-Math.floor(mr); j< mr ; j++) {
			if((i*i+j*j) <= mr*mr) { 
				this.sectorList[i+","+j]=""; 
				this.sectorCount[1]++;
			}
		}
	}
	this.sectorCount[0] = Math.floor(mr);

	var sa = ["_realm","_parent","children","visible","name","type","size","radius","height","sectorCount","sectorList"];
	cpxSave({obj:this,doc:cpxSaveCompile(this,sa),initial:true});
}
CPX.Galaxy.prototype.load =function () {}
CPX.Galaxy.prototype.addSector =function (sid) {
	var nS= new CPX.Sector({parent:this,sid:sid});
	
	this.sectorList[sid[0]+","+sid[1]]=nS.uid;
	this.children.push(nS.uid);
	this.realm().dbPush(nS);

	return this.lookup(nS.uid);
}


