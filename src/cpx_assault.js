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

CPX.GUI.prototype.lingeringAlert = function (faction,area) {
	var F=this.realm.db[faction], A=this.realm.db[area];

	if(!this.areaCheck(area)) { return; }

	html = F.group()+" Activity at "+A.name;
	var n = noty({type:"error", layout: 'topCenter', text: html});
}

CPX.Realm.prototype.lingeringThreat =function (faction,area) {
	var dt=this.getTime()+this.RNG.rndInt(25,35);
	this.newQ(dt,"realm","lingeringThreat",{faction:faction,area:area});
	this.GUI.lingeringAlert(faction,area);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
// Assault Updates


CPX.GUI.prototype.attackerAlert = function (area) {

}
CPX.GUI.prototype.assaultAlert = function (faction,area,dt) 
{	
	if(!this.areaCheck(area)) { 
		this.knownAreaThreat(area.parent()); 
		return;
	}

	this.updateField(area.uid+"_Assault","A");
	
	var html='<div class="assaultNote">T: '+this.realm.getTime()+" Assault "+faction.name+" @ "+area.name+" Complete on "+dt+'</div>';
	this["log"+faction.type](html);

	html = faction.group()+" Incursion Assault at "+area.name;
	var n = noty({type:"error", layout: 'topCenter', text: html});
}
CPX.GUI.prototype.assaultComplete = function (faction,area) 
{
	if(!this.areaCheck(area)) { return; }

	this.updateField(area.uid+"_Assault","");
	
	var html='<div class="assaultNote">T: '+this.realm.getTime()+" Assault Complete @ "+area.name+'</div>';
	this["log"+faction.type](html);

	html = faction.group()+" Assault Complete at "+area.name;
	var n = noty({type:"error", layout: 'topCenter', text: html});
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////
// Assault funcitons

CPX.Realm.prototype.factionAssaultStart =function (opts) {
	//attacker,area,defenders
	defenders = typeof opts.defenders === "undefined" ? [] : opts.defenders;

	var AF=this.db[opts.attacker];
	if(AF.type == "Threat") {
		var A=this.db[opts.area], militia=false, hero=false, dt=0;
		if(A.advancements[4] > 0) { militia = true; }

		for (var i=0; i<A.units ; i++) {
			if( A.unit[i].parent().uid == this._player ) { hero = true; }
		}

		//if hero or militia present then the result is calculated
		if(hero || militia) {
			this.db[opts.area]._attacker=opts.unit;

			dt=this.getTime()+this.RNG.rndInt(7,14);
			this.newQ(dt,"realm","assaultResult",{attacker:opts.attacker,area:opts.area,defenders:defenders});
			this.GUI.assaultAlert(this.db[opts.attacker],this.db[opts.area],dt);
		}
		//lingering threat
		else {
			dt=this.getTime()+this.RNG.rndInt(25,35);
			this.newQ(dt,"realm","lingeringThreat",{faction:opts.attacker,area:opts.area});
			this.GUI.lingeringAlert(opts.attacker,opts.area);
		}
	}

	//update displays
//	area._ThreeD[0].add( opts.area._ThreeD[3] );

}

//Automatic attack result - the attacker is always the faction calling the function
// given the area and possible array of faction uids to attack - if no faction - attacks everyone
CPX.Realm.prototype.assaultResult =function (opts) {
	//attacker,area,defenders
	var AF=this.db[opts.attacker], A=this.db[opts.area];
	var RN=this.RNG;

	var i=0, hasPlayer=false, U={}, attackers=[];
	for (i = 0 ; i < A.units.length ; i++) {
		U=A.unit(i);
		if ( U.parent().type == "Player" ) { hasPlayer = true; }
		if ( U._parent == opts.attacker ) { attackers.push(U); }
	}

	if (hasPlayer) {
		this.pause();
		
		var R=this;
		var n = noty({
			type:"warning", 
			timeout: false,
			text: 'The '+AF.group()+' Incursion threatens '+A.name+'. Will you help?',
			closeWith: ['button'],
			buttons: [
			{addClass: 'btn btn-primary', text: 'To the Front!', onClick: function($noty) {				
					$noty.close();
					R.playerAssaultDefense({attacker:AF, area:A});
				}
			},
			{addClass: 'btn btn-danger', text: 'No', onClick: function($noty) {
				$noty.close();
				}
			}
			]	
		});
	}
	//keep it simple if there aren't any heroes, just reduce militia
	else {
		var nmi=A.advancements[4], militia={};
		if(nmi>0) {
			var dmg = RN.rndArray([1,1,1,1,2,2]);
			if (dmg > nmi) { A.advancements[4] = 0; }
			else { A.advancements[4] -= dmg; }
			this.GUI.assaultComplete(this.db[opts.attacker],this.db[opts.area]);
			attackers[0].Kill();
		}
		else {
			dt=this.getTime()+RN.rndInt(25,35);
			this.newQ(dt,"realm","lingeringThreat",{faction:opts.attacker,area:opts.area});
			this.GUI.lingeringAlert(opts.attacker,opts.area);	
		}
	}

}


CPX.Realm.prototype.playerAssaultDefense =function (opts) { 
	var attackers=[], defenders=[];
	var atktarget={}, deftarget={}, target={};
}

		//Lead, Fight, Infiltrate, Build, Arcane 


	/*
	if (hasPlayer) {
		this.pause();

		var n = noty({
			layout: 'centerLeft', 
			type:"confirmation", 
			timeout: false,
			text: 'The battle  '+cH.area().trouble[0]+' at '+cH.area().name+'. Are you sure?',
			closeWith: ['button'],
			buttons: [
			{addClass: 'btn btn-primary', text: 'Lead', onClick: function($noty) {
					// this = button element
					// $noty = $noty element
					$noty.close();
					cpxRealms[ruid].playerOvercomeTrouble({unit:uid});
				}
			},
			{addClass: 'btn btn-primary', text: 'Fight', onClick: function($noty) {
					// this = button element
					// $noty = $noty element
					$noty.close();
					cpxRealms[ruid].playerOvercomeTrouble({unit:uid});
				}
			},
			{addClass: 'btn btn-primary', text: 'Infiltrate', onClick: function($noty) {
					// this = button element
					// $noty = $noty element
					$noty.close();
					cpxRealms[ruid].playerOvercomeTrouble({unit:uid});
				}
			},
			{addClass: 'btn btn-primary', text: 'Arcane', onClick: function($noty) {
					// this = button element
					// $noty = $noty element
					$noty.close();
					cpxRealms[ruid].playerOvercomeTrouble({unit:uid});
				}
			}
			]	
		});

		//Lead, Fight, Infiltrate, Build, Arcane 
	}

*/



/*
	function addMilitia (heavy) {
		var nU={}
		if (heavy) { nU=new CPX.Unit({faction:A._owner,area:A,type:"hvyinf",isMilitia:true}); }
		else { nU=new CPX.Unit({faction:A._owner,area:A,type:"militia",isMilitia:true}); }
		nU.active=1;
		militia[nU.uid]=nU;
	}

	//if protected by a militia load those into the militia object
	if (nmi>0) {
		if (nmi<6){
			for (i=0; i<nmi; i++) { addMilitia(false); }
		}
		else if (nmi >=6) {
			for (i=0; i < nmi/2 ; i++) { addMilitia(true); }
		}	
	}

	//determine the attacking units
	function AttackMuster () {
		attackers.length = 0;
		for (i=0 ; i < A.units.length ; i++) {
			if ( A.unit(i).parent().uid == AF.uid ) { 
				attackers.push(area.units[i]);
			}
		}
	}
	
		//determine the defending units
	function DefenseMuster() {
		defenders.length = 0;
		for (i=0 ; i < A.units.length ; i++) {
			if ( dfactions.indexOf(area.units[i].parent.uid) > -1 ) { 
				defenders.push(area.units[i]);
			}
		}
		for (var mx in militia) { 
			defenders.push(militia[mx]);
		}
	}

	function FindTarget (side) {
		//attackers
		if (side==1) { 
			DefenseMuster();
			atktarget = RN.rndArray(defenders);
			if (atktarget === null) { victor=attackers[0].parent; }
		}
		else { 
			AttackMuster();
			deftarget = RN.rndArray(attackers);
			if (deftarget === null) { victor=area.owner; } 
		}
	}

	function KillTarget(unit) {
		var side=0;
		if(unit._militia) {
			delete militia[unit.uid];
			area.advancements[4]--;
			FindTarget(1);
		}
		else { 
			if (unit.parent.uid!=AF.uid) { side = 1; }
			unit.parent.killUnit(unit); 
			FindTarget(side);
		}
	}

	function Hack (uatk,udef) {
		var R = uatk.Hack(udef._AC), hp=99;
		if(R>0) { hp=udef.takeDamage(R); }
		if (hp<=0) { KillTarget(udef); }
	}

	DefenseMuster();
	if(defenders.length==0) {
		nc=true;
		victor=this;
		AttackMuster();
	}
	
	FindTarget(1);
	FindTarget(0);
	while (victor.uid.length==0) {
		AttackMuster();
		for (i=0 ; i < attackers.length ; i++) {
			Hack(attackers[i],atktarget);
			if (atktarget === null) { break; }
		}
		
		DefenseMuster();
		for (i=0 ; i < defenders.length ; i++) {
			Hack(defenders[i],deftarget);
			if (deftarget === null) { break; }
		}		
	}

	if(victor.type == "Threat") {
		if(nc) { victor.rndDestruction(attackers[0]); }
	}
*/
