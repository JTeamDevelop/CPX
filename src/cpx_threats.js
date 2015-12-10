cpxVar.Skills = {
	Arcana : ["Flashy","Subtle","Clever","Mighty","Quick","Wise"],
	Athletics : ["Mighty","Quick"],
	Burglary : ["Subtle","Clever","Quick"],
	Deceive : ["Flashy","Subtle","Clever"],
	Empathy : ["Subtle","Clever","Wise"],
	Influence : ["Subtle","Clever"],
	Investigate : ["Subtle","Clever","Wise"],
	Knowledge : ["Flashy","Subtle","Clever","Wise"],
	Leadership: ["Subtle","Clever","Wise"],
	"Melee Combat" : ["Flashy","Subtle","Clever","Mighty","Quick","Wise"],
	Notice : ["Clever","Quick"],
	Performance : ["Flashy","Clever"],
	Physique : ["Flashy","Mighty"],
	Pilot : ["Flashy","Clever","Quick"],
	"Ranged Combat" : ["Flashy","Subtle","Clever","Mighty","Quick","Wise"],
	Stealth : ["Subtle","Clever","Quick"],
	Technical : ["Flashy","Subtle","Clever","Quick","Wise"],
	"Unarmed Combat" : ["Flashy","Subtle","Clever","Mighty","Quick","Wise"],
	Will : ["Clever","Mighty","Wise"]
}
cpxVar.StatsXSkills = {
	Strength:["Physique","Melee Combat","Unarmed Combat"],
	Dexterity:["Athletics","Pilot", "Ranged Combat", "Stealth"],
	Constitution:[],
	Wisdom:["Empathy", "Notice", "Will"],
	Intelligence:["Arcana", "Burglary","Investigate", "Knowledge", "Technical"],
	Charisma:["Deceive", "Influence", "Leadership", "Performance"]
}


cpxVar.Trouble = {
	"Bad Reputation": ["Arcana","Empathy","Influence","Knowledge","Leadership","Technical"],
	"Class Hatred": ["Empathy","Influence","Knowledge","Leadership","Technical"],
	"Mercenary Populace": ["Influence","Knowledge","Leadership"],
	"Contaminated Land" : ["Arcana", "Influence", "Knowledge", "Leadership", "Technical"],
	"Monsters" : ["Physique", "Arcana", "Melee Combat", "Ranged Combat", "Unarmed Combat"],
	"Corrupt Leadership": ["Deceive", "Influence", "Leadership"],
	"Crushed Spirits" : ["Empathy","Influence","Leadership","Performance"],
	"Sickness" : ["Arcana","Knowledge","Technical"],
	"Demagogue" : ["Deceive", "Influence", "Leadership", "Will"], 
	"Riotous Thugs" : ["Deceive", "Influence", "Leadership", "Stealth"], 
	"Destructive Customs": ["Influence", "Leadership"], 
	"Secret Society" : ["Burglary", "Influence", "Investigate", "Leadership", "Stealth"],
	"Severe Damage" : ["Arcana", "Technical"], 
	"Dark Wizards" : ["Arcana", "Influence", "Ranged Combat", "Melee Combat"], 
	"Sinister Cult" : ["Arcana", "Influence", "Investigate","Ranged Combat", "Melee Combat", "Stealth"], 
	"Disputed Possession" : ["Empathy", "Influence", "Leadership" ], 
	"Things From Beyond" : ["Arcana", "Ranged Combat"], 
	"Disunity" : ["Empathy","Influence", "Leadership"], 
	"Raiders" : ["Arcana", "Ranged Combat", "Melee Combat", "Unarmed Combat"], 
	"Ethnic Feuding" : ["Empathy","Influence", "Leadership"], 
	"Exceptional Poverty" : ["Arcana","Knowledge","Technical"],
	"Toxic Process" : ["Arcana","Influence","Knowledge","Technical"]
}

CPX.randomTrouble = function (RNG) {
	var trouble = [], skills=[];

	for (var x in cpxVar.Trouble) { trouble.push(x); }
	for (var x in cpxVar.Skills) { skills.push(x); }

	var name = RNG.rndArray(trouble);

	var skill = "";
	if( cpxVar.Trouble[name].length == 0 ) { skill = RNG.rndArray(skills); }
	else { skill = RNG.rndArray(cpxVar.Trouble[name]); }

	var approach = RNG.rndArray(cpxVar.Skills[skill]);

	return [name,skill,approach];
}

//heroApproaches=["Flashy","Subtle","Clever","Mighty","Quick","Wise"];
//professions=["Diplomats","Engineers" , "Explorers", "Fighters", "Merchants" ,"Rogues", "Scholars"];

/* Skills
D&D 5E
Strength: Athletics
Dexterity: Acrobatics, Sleight of Hand, Stealth
Intelligence: Arcana, History, Investigation, Nature, Religion
Wisdom: Animal Handling, Insight, Medicine, Perception, Survival
Charisma: Deception, Intimidation, Performance, Persuasion

FATE
Arcana, Athletics, Bureaucracy, Burglary, Contacts, Deceive, Empathy, Investigate, Knowledge, Melee Combat, Notice, Performance
Physique, Pilot, Provoke, Ranged Combat, Rapport, Science, Stealth, Technical, Unarmed Combat, Will
*/

CPX.dbThreats = {
	dragonclans: {
		names: ["Verylthraxsis", "Kharisbrax", "Totensheras"],
		group: "Dragon Clans",
		units: ["Flamestrike Squad","Ebonwing Raiders"],
		trouble: []
	},
	goblins: {
		group: "Goblins",
		units: ["Goblin Hordes"]
	},
	shadstlsynd: {
		group: "Shadowsteel Syndicate",
		units: ["Syndic Raiders"]
	},
	starhive: {
		group: "Star Hive",
		units: ["Kaiju Force"]
	},
	sect: {
		group: "Sect",
		units: ["Sect Heavy Strike Platoon"]
	},
	pirates: {
		group: "Pirates",
		units: ["Pirate Corsairs"]
	},
	rogueai: {
		group: "Rogue AI",
		units: ["Strike Drone Brigade"]
	}
}
CPX.randomThreat = function (RNG) {
	var list=[];
	for (var x in CPX.dbThreats) { list.push(x); }
	return RNG.rndArray(list);
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// Threat object

CPX.Threat=function (opts) {
	if (typeof opts.load !== "undefined") { return; }
	
	CPX.Faction.call(this,opts);

	//creates a completely random seed
	this.uid = "T"+makeUID(27);
	//Creates a specific random number generator based upon the uid seed
	this.RNG = new CPX.RNG(this.uid);

    this._parent = typeof opts.threat === "undefined" ? "" : opts.threat;
 
    this.type="Threat";
    this.visible=false;

    this.initialize(); 
}
CPX.Threat.inherits(CPX.Faction);

CPX.Threat.prototype.initialize =function () {
	var RN= this.RNG, doc={"_id":this.uid, "type":this.type};
	var R=RN.rndInt(0,256), G=RN.rndInt(0,256), B=RN.rndInt(0,256);
	this.color=[R,G,B,rgbToHex(R,G,B)];

	if(this._parent.length == 0) { this._parent=CPX.randomThreat(RN); }
	var P=this.parent();

	// = if true, then : else
	this.name = typeof P.names === "undefined" ? P.group : RN.rndArray(P.names)
    
    this.TL=this.RNG.rndInt(2,4);
    this.FTL=this.RNG.FateRoll();
    this.check=this.RNG.rndArray([3,4,4,4,4,4,5,5,5,5]);
    
    var t=this.realm().getTime()+RN.rndInt(9,18);
   	this.realm().newQ(t,"realm","threatThreaten",{uid:this.uid});

	//save the initial 
	var sa = ["_realm","_parent","children","visible","name","type","bases","assets","units","TL","FTL","color","check"];
	cpxSave({obj:this,doc:cpxSaveCompile(this,sa),initial:true});

}
CPX.Threat.prototype.parent =function () {
	return CPX.dbThreats[this._parent];
}
CPX.Threat.prototype.group =function () {
	return CPX.dbThreats[this._parent].group;
}
CPX.Threat.prototype.randomUnit =function () {

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//html to return to the parent when the parent updates the GUI
CPX.Threat.childInfoDisplay = function (threat) {
	var color='rgb('+threat.color[0]+','+threat.color[1]+','+threat.color[2]+')';
	color='<svg width="15" height="10"><rect width="10" height="10" style="fill:'+color+'" /></svg>';

	var html='<div class="threat noreveal" id="'+threat.uid+'_Container">';
    html+='<div id="'+threat.uid+'_Name">'+color+'<strong>'+threat.name+'</strong></div>';

	html+='<div id="'+threat.uid+'_BaseContainer">'
	for(var i=0; i < threat.bases.length ; i++) { html+= CPX.Area.childInfoDisplay(threat.base(i)); }
	html+='</div>'

	html+='</div>';

	return html;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Adds a threat to the area
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Realm.prototype.addThreat =function (area) {
	var nT = new CPX.Threat({realm:area.realm(), area:area});
	this.db[nT.uid] = nT;
	this.factions.push(nT.uid);
	
	if( area.type == "Sector") 
	{
		var nS= area.addSystem();
		nS.visible=false;
		nS.addBase(nT.uid,true);
	}
	else { area.addBase(nT.uid); }

	var t=this.getTime()+this.RNG.rndInt(1,8);
	this.newQ(t,"realm","threatThreaten",{uid:nT.uid});

	return this.db[nT.uid];
}

///////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Realm.prototype.threatThreaten =function (opts) {
	var T= this.db[opts.uid], RN=T.RNG;
	var t=this.getTime(), dt=t+RN.rndInt(25,35);

	var html='<div class="assaultNote">'+t+" Threaten "+T.name+'</div>';
	this.realm().GUI.append("logThreatContent",html);

	var r=RN.rndInt(1,6);
	if(r>=T.check) {
		this.threatAssaultForce({uid:T.uid})
	}

	this.newQ(dt,"realm","threatThreaten",{uid:T.uid});
}

CPX.Realm.prototype.threatAssaultForce =function (opts) {
	var T= this.db[opts.uid], nQ={};
	var RN=T.RNG, t=this.getTime(), dt=t+RN.rndInt(25,35);

	var Tb=this.db[RN.rndArray(T.bases)];
	var ca=Tb.parent().sector().listFactions()[0];
	var c=this.db[RN.rndArray(ca)], b=this.db[RN.rndArray(c.bases)];
	//if no bases return
	if(c.bases.length==0) {return;}
		
	var nU= new CPX.Unit({faction:T.uid,area:Tb.parent(),type:"ltinf"});
	nU.name=RN.rndArray(T.parent().units);
	nQ={t:0,what:"realm",ftorun:"factionAssaultStart",options:{attacker:T.uid,unit:nU.uid,area:b._parent}};

	nU._onArrive=nQ;
	nU.onBuild();
	
	this.db[nU.uid]=nU;	
	T.units.push(nU.uid);

	//debug
	console.log(nU.uid);

	html='<div class="buildNote milUnit">'+t+" Build Unit "+T.name+" "+nU.name+" "+Tb.parent().name+'</div>';
	this.realm().GUI.append("logThreatContent",html);
		
	this.unitMoveSetup({unit:nU.uid,area:b._parent});

}

CPX.Realm.prototype.areaRandomDestruction =function (area,n) {
	n = typeof n === "undefined" ? 4 : n;
	
	var i=0, t=-1, above=[], RN=this.RNG;

	function AboveZero () {
		above.length = 0;
		for (i=0 ; i < area.advancements.length ; i++) {
			if(area.advancements[i]>0) { above.push(i); }
		}
	}

	function DestroyBase () {
		var B=A.findBases();
		B=RN.rndArray(B);
		B.owner.destroyBase(B);
		T.killUnit(unit);
	}

	while (n >= 1) {
		AboveZero();
		if(above.length == 0) { 
//			DestroyBase(); 
			return;
		}
		t=RN.rndArray(above);
		area.advancements[t]--;
		n--;
	}

}
