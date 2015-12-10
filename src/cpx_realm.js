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
// Queue object
CPX.qItem = function (t,what,ftorun,options,then) {
	options = typeof options === "undefined" ? {} : options;
	then = typeof then === "undefined" ? {} : then;

	this.uid = "Q"+makeUID(17);

	this.t=t;
	this.what=what;
	this.ftorun=ftorun;
	this.options=options;
	this.then=then;
}
CPX.qItem.prototype.saveData = function () {
	return {uid:this.uid,t:this.t,what:this.what,ftorun:this.ftorun,options:this.options,then:this.then};
}

/////////////////////////////////////////////////////////////////////////////////
// Realm object - container for a single "game setting"

CPX.Realm=function (opts) {
	opts = typeof opts === "undefined" ? {} : opts;

	CPX.Object.call(this);

	this.factions=[];
	this.db={};
	this.queue={};
	this._paused=false;

	this.GUI=new CPX.GUI(this);
//	this.ThreeD=new CPX.ThreeD(this);

	//if load stop here
	if (typeof opts.load !== "undefined") { return; }

	this.uid = "0"+makeUID(23);
	//Creates a specific random number generator based upon the uid seed
	this.RNG = new CPX.RNG(this.uid);

	var getName = NameGenerator(this.RNG.rndInt(1,9999999));
	this.name = getName();

	this.type="Realm";

	this.game= typeof opts.game === "undefined" ? "CPX" : opts.game;
	this.rules= typeof opts.rules === "undefined" ? "DW" : opts.rules;

	this._realm=this.uid;
	this._player="";

	cpxRealms[this.uid]=this;
}
CPX.Realm.inherits(CPX.Object);
CPX.Realm.prototype.initialize = function () {
	this.Start();
	this.GUI.init();
	
	//save to realms
	var doc={};
	doc[this.uid] = this.name;
	cpxSave({obj:{uid:"realms"},doc:doc});
	//save to id
	cpxSave({obj:this,doc:{"_id":this.uid,"name":this.name},initial:true});

//	nP.addHero(randomStart());


}
CPX.Realm.prototype.initGalaxy = function () {
	this.initialize();
	
	var R=this, nG= this.addGalaxy(), nP=this.addPlayer();
	
	var sid= [R.RNG.rndInt(-nG.sectorCount[0],nG.sectorCount[0]),0];
	nS=nG.addSector(sid);

	var F=nS.listFactions()[0];

	function randomStart() {
		var rF=nG.RNG.rndArray(F), rB=nG.RNG.rndArray(R.db[rF].bases);
		return R.db[rB].parent();
	}

	nP.addHero(randomStart());
	nP.addHero(randomStart());
	nP.addHero(randomStart());
	nP.addHero(randomStart());
	nP.Display();

	this.newQ(7,"realm","autoSave");

	nS.display();

}

////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Realm.prototype.autoSave = function () {
	cpxSaveRealm(this);
	
	var t=this.getTime()+(1000*60*10)
	this.newQ(t,"realm","autoSave");
}
CPX.Realm.prototype.save = function () {
	cpxSaveRealm(this);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//Timer functions

CPX.Realm.prototype.Start = function () {
	this.start=Date.now();
	this.GUI.append("rTimer",'<span id=rName data-uid='+this.uid+'>Realm: '+this.name+'</span>');

	if(this.game=="CPX") {
		this.GUI.append("rTimer",' Day <span id=gTime></span>');

		this.tick=0;
		this.tock=0;
		this.dt=1000;

		var pid=this.uid;
		this.keeper=setInterval(function () { cpxRealms[pid].pulse() }, 100);	
	}
}
CPX.Realm.prototype.pulse = function () {
	if(this._paused) { return; }

	this.tick++;
	if(this.tick>=this.dt/100) { 
		this.tick=0;

		this.checkQueue();
   		this.GUI.updateField("gTime",this.tock);

		this.tock++; 
	}
}
CPX.Realm.prototype.getTime = function () {
	return this.tock;
}
CPX.Realm.prototype.pause = function () {
	this._paused=true;
}
CPX.Realm.prototype.resume = function () {
	this._paused=false;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Realm.prototype.dbPush = function (object) {
	this.db[object.uid]=object;
}
CPX.Realm.prototype.newQ = function (t,what,ftorun,options,then) {
	options = typeof options === "undefined" ? {} : options;
	then = typeof then === "undefined" ? {} : then;

	var nQ=new CPX.qItem(t,what,ftorun,options,then);
	this.queue[nQ.uid]=nQ;
}
CPX.Realm.prototype.player = function () {
	return this.db[this._player];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Generating functions

CPX.Realm.prototype.addGalaxy = function () {
	var nG= new CPX.Galaxy({realm:this});

	this.children.push(nG.uid);
	this.db[nG.uid] = nG;

	return this.db[nG.uid];
}
CPX.Realm.prototype.addPlayer = function () {
	var nP = new CPX.Player({realm:this});
	this._player=nP.uid;
	this.db[nP.uid] = nP;
	return this.db[nP.uid];	
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
// Queue operations

CPX.Realm.prototype.checkQueue =function () {
	var t=this.getTime(), qx={}, d=[], i=0;

	//run through the queue
	for(var x in this.queue) {
		qx=this.queue[x]
		//if the time of the que is less than the current time complete the action
		if (qx.t<t) { 
			if(qx.what == "realm") {
				this[qx.ftorun](qx.options);
			}
			else {
				this.db[qx.what][qx.ftorun](qx.options);
			}

			if(!jQuery.isEmptyObject(qx.then)) {
				this.newQ(qx.then.t,qx.then.what,qx.then.ftorun,qx.then.options,qx.then.then);
			}
			//push the queue index to the done array
			d.push(x);
		}
	}

	//iterate through delete completed entries
	for(i=0; i<d.length; i++) {
		delete this.queue[d[i]];
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Build asset/unit Functions



CPX.Realm.prototype.factionBuildSetup =function (faction,what,area) {
	var RN=faction.RNG, cL=faction.levels(), r=[], nC=[12,12,12], i=0, n=0;
	var t=this.getTime(), dt=t, type="", html="", build="";
	var F=faction, A=this.db[area];

	if(what[0]=="Asset"){ 
		var j=cpxVar.siteAdvancements.indexOf(what[1]), ab=cpxVar.sAdvBenefit[j];
		var k=A.advancements[j]+what[2];
		nC[0]+=Math.round(Math.abs(k*ab[0]));
		nC[1]+=Math.round(Math.abs(k*ab[1]));
		nC[2]+=Math.round(Math.abs(k*ab[2]));

		build=[what[1],what[2]];
		type="BuildAsset";
	}
	else {
		var unit=what[1];
		nC[0]+=Math.abs(unit.cost[0]);
		nC[1]+=Math.abs(unit.cost[1]);
		nC[2]+=Math.abs(unit.cost[2]);

		var nU= new CPX.Unit(faction,area,what[1]);

		//if what has a length of 3, onBuild and onArrive orders are provided
		if(what.length==3) {
			nU._onBuild=what[2][0];
			if(what[2].length==2) { nU._onArrive=what[2][1]; }
		}

		this.db[nU.uid] = nU;

		build=nU.uid;
		type="BuildUnit";
	}

	function Roll (i) { return RN.Dice([[1,20]])+cL[i]; }

	r[0]=Roll(0);
	r[1]=Roll(1);
	r[2]=Roll(2);

	//Creating a unit takes 3 successful checks one for M,W,S
	//Each check increases n which ultimately increases the time it takes to build it. 
	for(i=0;i<3;i++) {
		dt+=RN.rndInt(25,35);
		while ( r[i]<nC[i] ) {
			nC[i]--;
			dt+=RN.rndInt(25,35);
			r[i]=Roll(i);
		}
	}

	this.newQ(dt,"realm","faction"+type,{faction:faction.uid,what:build,area:area});

	if(what[0]=="Asset"){ 
		html='<div class="buildNote">T: '+t+" Build Asset "+faction.name+" "+what[1]+" @ "+A.name+" Complete on: "+dt+'</div>';
	}
	else {
		//Update logs
		var spt=" milUnit";
		if(nU.basicUnit.spt) {spt=" sptUnit";}
		html='<div class="buildNote'+spt+'">T: '+t+" Build Unit "+faction.name+" "+nU.name+" @ "+A.name+" Complete on: "+dt+'</div>';	
	}

	this.GUI["log"+faction.type](html);
}

CPX.Realm.prototype.factionBuildAsset =function (opts) {
	var A=this.db[opts.area];
	//determine the advancement index and increase it 
	var j=cpxVar.siteAdvancements.indexOf(opts.what[0]);
	A.advancements[j]+=opts.what[1];
}

CPX.Realm.prototype.factionBuildUnit =function (opts) {
	var U=this.db[opts.what];
	U.onBuild(); 
}

CPX.Realm.prototype.stopBuild =function (opts) {


}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Unit Functions

CPX.Realm.prototype.unitMoveSetup =function (opts) {
	var U = this.db[opts.unit], P=U.parent(), A= this.db[opts.area];
	var t=this.getTime();
	var d=Distance(U.systemLocation(),A.systemLocation());
	var dt=t+d/(P.speed());
	dt= Math.round(dt);

	//remove the unit from its current area
	U.area().removeUnit(U.uid);

	this.newQ(dt,"realm","unitMoveComplete",{what:U.uid,area:A.uid});

	//update logs
	var html='<div class=moveNote>T: '+t+" Move "+U.name+" ("+U.parent().name+") TO "+A.name+" Arrival @ "+dt+'</div>';
	this.GUI["log"+P.type](html);
	if (P.type=="Player") { this.GUI.heroMove(U,A); }	

	/*
	Incremental move calc
			var dr=FTL/d;
		this.location[0]+=dr*(dl[0]-l[0]);
		this.location[1]+=dr*(dl[1]-l[1]);
		this.location[2]+=dr*(dl[2]-l[2]);
	*/
}
CPX.Realm.prototype.unitMoveComplete =function (opts) {
	var U=this.db[opts.what];
	U.setLocation(this.db[opts.area]);

	if(U._hero) { this.db[opts.area].enter(); }
	U.onArrive(); 

}
CPX.Realm.prototype.removeUnit =function (unit) {
	var U=this.db[unit];
	
	U.parent().removeUnit(unit);
	U.area().removeUnit(unit);

	delete this.db[unit];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Area handling functions

CPX.Realm.prototype.removeArea = function (area) {
	var A=this.db[area];

	if(A._isBase) {
		A.owner().removeBase(area);	
	}
	A.parent().removeChild(area);

	delete this.db[unit];
}
CPX.Realm.prototype.destroyBase =function (base) {
	var B=this.db[base], A=B.parent(), F=B.owner();
	var Qx={}, i=0, stops=[], units=[];
	
	//loop through the build array
	for (var x in this.queue) {
		Qx=this.queue[x];
		//if a build
		if(Qx.ftorun.search("BuildAsset") > -1 || q.ftorun.search("BuildUnit") > -1) {
			//if the area is the same
			if(A.uid == Qx.options.area) {
				//if the faction is the owner
				if(Qx.options.faction == F.uid) {
					if (q.ftorun.search("BuildUnit") > -1) { units.push(Qx.options.what); }
					stops.push(Qx.uid);
				}				
			}					
		}
	}

	//remove the builds
	for(i=0; i<=stops.length ; i++) {
		delete this.queue[stops[i]];
	}
	//remove the units
	for(i=0; i<=units.length ; i++) {
		this.killUnit(units[i]);
	}

	//Remove base from parent and faction
	this.removeArea(base);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////



