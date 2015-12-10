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

CPX.Attack = function (name,range,damage,opts) {
	opts = typeof opts === "undefined" ? {} : opts;

	this.name=name;
	this.range=range;
	this.damage=damage;
}

cpxVar.units={};
cpxVar.orgSkills=["Force","Cunning","Wealth","Sorcery"];
cpxVar.heroApproaches=["Flashy","Subtle","Clever","Mighty","Quick","Wise"];
cpxVar.heroOvercome=[4,3,0,5,2,1];

cpxVar.troubleOvercome=["Guardsman","Military","Merchant","Sage","Prophet","Magistrate"];
cpxVar.troubleBasicUnits=["guard","ltinf","merchant","sage","prophet","magistrate"];
cpxVar.orgUnits ={};
cpxVar.orgUnits.merchant={name:"Merchant", spt:true, HD:-1, AC:-1, mv:120, atk:[], rng:[], sv:"T1", ml:-1, cost:[0,2,0], abil:["Merchant"]};
cpxVar.orgUnits.sage={name:"Sage", spt:true, HD:-1, AC:-1, mv:120, atk:[], rng:[], sv:"M1",ml: -1, cost:[0,2,0], abil:["Sage"]};
cpxVar.orgUnits.prophet={name:"Prophet", spt:true, HD:-1, AC:-1, mv:120, atk:[], rng:[], sv:"T1", ml:-1, cost:[0,0,2], abil:["Prophet"]};
cpxVar.orgUnits.magistrate={name:"Magistrate", spt:true, HD:-1, AC:-1, mv:120, atk:[], rng:[], sv:"T1", ml:-1, cost:[0,0,2], abil:["Magistrate"]};

cpxVar.orgUnits.guard={name:"Guard", spt:false, HD:1, AC:2, class:"F", lv:1, ml:8, mv:120, atks:[["Assault",0,[[1,6]]],["Shoot",1,[[1,6]]]], cost:[1,1,1], abil:["Ranger", "Skirmisher", "Guardsman", "Military"]};
cpxVar.orgUnits.ltinf={name:"Light Infantry", spt:false, HD:1, AC:2, class:"F", lv:1, ml:7, mv:120, atks:[["Assault",0,[[1,6]]]], cost:[1,1,0], abil:["Tacticts","Military"]};
cpxVar.orgUnits.militia={name:"Militia", spt:false, HD:1, AC:1, class:"N", lv:1, ml:6, mv:120, atks:[["Assault",0,[[1,6]]]], cost:[1,0,0], abil:["Garrison"]};
cpxVar.orgUnits.hvyinf={name:"Heavy Infantry", spt:false, HD:2, AC:5, class:"F", lv:2, ml:8, mv:90, atks:[["Assault",0,[[1,8]]]], cost:[2,2,0], abil:[]};

CPX.Unit=function (opts) {
	opts = typeof opts === "undefined" ? {faction:"",subtype:"",area:{uid:"",_realm:"",units:[]}} : opts;
	if (typeof opts.load !== "undefined") { return; }
	
	this.type="Unit";
	this.uid = "U"+makeUID(23);

	this._parent = typeof opts.faction === "undefined" ? "" : opts.faction;
	this.subtype = typeof opts.type === "undefined" ? "" : opts.type;
	this._militia = typeof opts.isMilitia === "undefined" ? false : opts.isMilitia;

	var area = typeof opts.area === "undefined" ? {uid:"",_realm:"",units:[]} : opts.area;
	this.setLocation(area);	

	//-1 dead, 0 in build, 1 ready, 2 cooldown
	this._active=0;
	this._visibile=false;

	this.xp=0;
    this.HP=0;
    this.HPMax=0;

	this.special=[];
	this.attacks=[];

	this.support=[];
	
	this._onBuild=[];
	this._onArrive=[];

	this.initialize(this.subtype);

}
CPX.Unit.inherits(CPX.Object);
CPX.Unit.prototype.load = function (opts) {}
CPX.Unit.prototype.initialize = function (type) {
	if(type.length > 0) { 
		var basic=cpxVar.orgUnits[type];

		this.name=basic.name;
		this.special=this.special.concat(basic.abil);

		if(!basic.spt) {
			this.attacks=basic.atks;
		}
	}

	if(!this._militia) {
		//save the initial 
		var sa = ["_realm","_parent","type","subtype","name","_area","_active","visibile","xp","HP","HPMax","special","attacks","support"];
		cpxSave({obj:this,doc:cpxSaveCompile(this,sa),initial:true});
	}
	
}
CPX.Unit.prototype.area = function () {
	return this.lookup(this._area);
}
CPX.Unit.prototype.systemLocation = function () {
	var A=cpxRealms[this._realm].db[this._area];
	return A.systemLocation();
}
CPX.Unit.prototype.setLocation = function (area) {
	this._area=area.uid;
	area.units.push(this.uid);
	this._realm=area._realm;
}
CPX.Unit.prototype.onBuild = function () {
	this.active=1;
	
	var oB=this._onBuild;
	if(Object.keys(oB).length != 0) {
		//add the unit id to the info 
		oB.options.unit=this.uid;

		if(oB.what == "realm") {
			this.realm()[oB.ftorun](oB.options);
		}
		else {
			this.lookup(oB.what)[oB.ftorun](oB.options);
		}
	}
	this._onBuild={};

	//output info to display
	var GUI=this.realm().GUI, t=this.realm().getTime(), P=this.parent();
	var html='<div class=moveNote>'+t+" Arrive "+P.name+" "+this.name+" "+this.area().name+'</div>';
	if(P.type=="Culture") {
		GUI.append("logCultureContent",html);	
	}
	else if	(P.type=="Threat") {
		GUI.append("logThreatContent",html);	
	}	
	else if	(P.type=="Player") {
		GUI.updateField(this.uid+"_Area",'@ '+this.area().factionColors()+this.area().name);
		GUI.append("logMainContent",html);	
	}
}
CPX.Unit.prototype.onArrive = function () {
	var oA=this._onArrive;

	if(Object.keys(oA).length != 0) {
		//add the unit id to the info 
		oA.options.unit=this.uid;
		
		if(oA.what == "realm") {
			this.realm()[oA.ftorun](oA.options);
		}
		else {
			this.lookup(oA.what)[oA.ftorun](oA.options);
		}
	}
	this._onArrive={};

	//output info to display
	var t=this.realm().getTime(), GUI=this.realm().GUI, P=this.parent();
	var html='<div class=moveNote>T: '+t+" Arrival "+this.name+" ("+P.name+") @ "+this.area().name+'</div>';
	GUI["log"+P.type](html);
	
 	if	(P.type=="Player") { GUI.heroArrive(this,this.area()); }
}
CPX.Unit.prototype.setVisible = function (bool) {
	this.visibile=bool;
}
CPX.Unit.prototype.Hack = function (AC,atknum) {
	atknum = typeof atknum === "undefined" ? 0 : atknum;

	var atk=this.attacks[atknum];
	var RN=this.RNG, ar=RN.Dice([[1,20]]), mar=ar+this._CAB, R=0;

	if(mar >= 10+AC) { 
		R = RN.Dice(atk.damage); 
	}
	return R;
}
CPX.Unit.prototype.Kill = function () {
	this.area().removeUnit(this.uid);
	this.parent().removeUnit(this.uid);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Unit.activeRoster = function (unit) {
	var html='<div class=activeUnit id="'+unit.uid+'_Hero" data-uid='+unit.uid+'><strong class=heroSlide>'+unit.name+'</strong>';	
	html+='<span class=heroArea id="'+unit.uid+'_Area"> (';
	
	var type=unit.area().parent().type;
	if(type=="Sector") { html+= unit.area().parent().type+" "+unit.area().parent().sid; }
	else { html+= unit.area().parent().type+": "+unit.area().parent().name; }

	html+=", "+unit.area().name+')</span>';
	html+='</div>';

	return html;
}

CPX.Unit.childInfoDisplay = function (unit) {
	var hA=cpxVar.heroApproaches;

	var html='<div class=hero id="'+unit.uid+'_Hero" data-uid='+unit.uid+'><strong class=heroSlide>'+unit.name+'</strong>';
	html+='<span class=heroArea id="'+unit.uid+'_Area"> (@ '+unit.area().factionColors()+unit.area().name+')</span>';
	html+='<div class=heroStats>';
	html+="Level: "+unit._level;
	html+='<div>'+hA[0]+' '+unit.stats[0]+' '+hA[2]+' '+unit.stats[2]+' '+hA[4]+' '+unit.stats[4]+'</div>';
	html+='<div>'+hA[1]+' '+unit.stats[1]+' '+hA[3]+' '+unit.stats[3]+' '+hA[5]+' '+unit.stats[5]+'</div>';
	html+='</div>';
	html+='</div>';

	return html;
}

CPX.Unit.prototype.genThreeD = function () {
	var l=this.location, sprite={};

	var G=this.area.Galaxy();
	if (G === "undefined") { G=cpxVar.basicGalaxy; }
	var n=500/(G.sectorSize/2);
	
	//label
	sprite = makeTextSprite( " " + this.name + " ", { fontsize: 50, backgroundColor: {r:0, g:204, b:0, a:1} } );
	sprite.position.set( l[0]*n-30, l[1]*n-30, l[2]*n-30 );
	sprite.userData.structure=this;
	return sprite;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Cooldown 

//sets the unit active to cooldown and puts it in the queue
CPX.Unit.prototype.setCooldown = function (n) {
	if(n==-1) {
		this.active=1;
		return;
	}

	var dt=n+this.realm().getTime();
	this.active=2;
	//t,what,ftorun,options,then
	this.realm().newQ(dt,"realm","unitPostCooldown",{uid:this.uid}); 

	this.realm().GUI.disableButtons(this);
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Realm.prototype.unitPostCooldown =function (opts) {
	var U=this.db[opts.uid];
	this.active=1;
	this.realm().GUI.enableButtons(this);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Team = function () {
	this.name="";
	this.units=[];
	this.leader={};
}
CPX.Team.prototype.addUnit = function (unit) {
	this.units.push(unit);
	return this.units;
}
CPX.Team.prototype.removeUnit = function (unit) { 
	var O=this.units.objSearch("uid",unit.uid);
	this.units.splice(O[0],1);
	return unit;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
Theater 2M-10M General 16
Army Front 400K-2M General 12
Army 40K – 200K General 8
Corps 20K – 40K Lt. General 4
Division 10K – 18K Major General 2
Brigade 3K – 5K Colonel 1
Battalion 500 – 600 Lt. Colonel 0

infantry, armored, air, sea, or artillery
*/

//CR = +1 per 2hp over 4, +1 per armor | avg +1per dmg step over 1d4,
cpxVar.units = {};
cpxVar.units.police={name:"Police Force", type:"Military Unit", cost:2, cr:0, hp:2, armor:0, atk:["Mighty"], dmg:[1,4,0], special:""};
cpxVar.units.militia={name:"Militia Unit", type:"Military Unit", cost:4, cr:1, hp:4, armor:1, atk:["Mighty"], dmg:[1,4,0], special:"P"};
cpxVar.units.hitmen={name:"Hitmen", type:"Special Forces", cost:2, cr:0, hp:2, armor:0, atk:["Subtle"], dmg:[1,6,0], special:""};
cpxVar.units.hvymilitia={name:"Heavy Militia", type:"Military Unit", cost:5, cr:3, hp:6, armor:1, atk:["Mighty"], dmg:[1,6,0], special:"P"};
cpxVar.units.infantry={name:"Infantry", type:"Military Unit", cost:5, cr:7, hp:10, armor:2, atk:["Mighty"], dmg:[1,8,0], special:"P"};

CPX.fieldUnit=function (opts) {
	opts = typeof opts === "undefined" ? {faction:"",subtype:"",area:{uid:"",_realm:"",units:[]}} : opts;
	if (typeof opts.load !== "undefined") { return; }
	
	this.type="fieldUnit";
	this.uid = "U"+makeUID(23);

	this._parent = typeof opts.faction === "undefined" ? "" : opts.faction;
	this.subtype = typeof opts.type === "undefined" ? "" : opts.type;
	this._militia = typeof opts.isMilitia === "undefined" ? false : opts.isMilitia;

	var area = typeof opts.area === "undefined" ? {uid:"",_realm:"",units:[]} : opts.area;
	this.setLocation(area);	

	//-1 dead, 0 in build, 1 ready, 2 cooldown
	this._active=0;
	this._visibile=false;

	this.xp=0;
    this.Power=0;
    this.powerMax=0;

	this.special=[];

	this._onBuild=[];
	this._onArrive=[];

	this.initialize(this.subtype);

}
CPX.fieldUnit.inherits(CPX.Unit);
