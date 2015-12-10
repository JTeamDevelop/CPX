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

cpxVar.heroApproaches=["Flashy","Subtle","Clever","Mighty","Quick","Wise"];
cpxVar.heroStats=["Strength","Dexterity","Constitution","Wisdom","Intelligence","Charisma"];
cpxVar.heroStatsIcons=['<img src="images/strong.png" width=25 height=25>','<img src="images/sprint.png" width=25 height=25>','<img src="images/mountaintop.png" width=25 height=25>','<img src="images/owl.png" width=25 height=25>','<img src="images/brain.png" width=25 height=25>','<img src="images/rose.png" width=25 height=25>'];
cpxVar.heroOvercome=[4,3,0,5,2,1];

//"Arcana", "Athletics", "Burglary", "Deceive", "Empathy", "Influence","Investigate", "Knowledge", "Leadership","Melee Combat", "Notice", "Performance", "Physique", "Pilot", "Ranged Combat", "Stealth", "Technical", "Unarmed Combat", "Will"
cpxVar.classes={};
cpxVar.classes.Fighter = {
	name:"Fighter", 
	skills:["Athletics","Melee Combat","Unarmed Combat", "Will"],
	abilities:["Slay","Inspire","Lucky","Deadeye"]
};
cpxVar.classes.brute = {
	name:"Brute", 
	skills:["Athletics","Melee Combat","Unarmed Combat", "Will"],
	abilities:["Slay","Inspire","Lucky","Deadeye"]
};
cpxVar.classes.soldier = {
	name: "Soldier", 
	skills:["Athletics", "Ranged Combat"],
	abilities:["Strategy","Slay","Inspire","Lucky","Deadeye"]
};
cpxVar.classes.officer = {
	name: "Officer",
	skills:["Influence","Leadership","Pilot","Technical"],
	abilities:["Jack","Connected","Strategy","Inspire"]
};

cpxVar.classes.elemental = {
	name:"Elemental", 
	skills:["Arcana", "Knowledge", "Ranged Combat"],
	abilities:["Healing","Divination","Lucky","Illusions","Magic","Cosmic Power","Element Control","Alternate Form"],
	required:["Healing","Illusions","Magic","Cosmic Power","Element Control"]
};
cpxVar.classes.psion = {
	name:"Psion", 
	skills:["Arcana", "Empathy", "Influence","Knowledge", "Will"],
	abilities:["Healing","Divination","Lucky","Pacify","Illusions","Magic","Cosmic Power"],
	required:["Healing","Illusions","Magic","Cosmic Power"]
};
cpxVar.classes.wizard = {
	name:"Wizard", 
	skills:["Arcana", "Knowledge", "Will"],
	abilities:["Healing","Divination","Lucky","Illusions","Magic","Cosmic Power"],
	required:["Magic","Cosmic Power"]
};

cpxVar.classes.diplomat = {
	name:"Diplomat", 
	skills:["Empathy", "Influence","Leadership"],
	abilities:["Connected","Strategy","Diplomat","Expert","Inspire","Pacify","Perform"]
};
cpxVar.classes.engineer = {
	name:"Engineer", 
	skills:["Knowledge", "Technical"],
	abilities:["Jack","Hacker","Engineer","Expert","Gadgetry"]
};
cpxVar.classes.healer = {
	name:"Healer", 
	skills:["Empathy", "Knowledge", "Technical", "Will"],
	abilities:["Healing","Expert","Inspire","Lucky","Pacify","Surgeon"]
};

cpxVar.classes.rogue = {
	name:"Rogue", 
	skills:["Burglary", "Deceive", "Performance", "Stealth"],
	abilities:["Jack","Getaway","Hacker","Connected","Trader","Lucky","Expert","Perform","Illusions"]
};
cpxVar.classes.investigator = {
	name:"Investigator", 
	skills:["Investigate", "Notice"],
	abilities:["Jack","Hacker","Connected","Strategy","Expert","Lucky","Sleuth"]
};
cpxVar.classes.agent = {
	name:"Agent", 
	skills:["Athletics", "Deceive", "Notice", "Unarmed Combat", "Will"],	
	abilities:["Getaway", "Hacker","Strategy","Connected","Slay","Expert","Deadeye"]
};

///////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Ability = function (name,opts) {
	opts = typeof opts === "undefined" ? {} : opts;

	this.name = name;
	this.info = typeof opts.info === "undefined" ? "" : opts.info;
	this.modTrouble = typeof opts.modTrouble === "undefined" ? [] : opts.modTrouble;
	this.isPower = typeof opts.isPower === "undefined" ? false : opts.isPower;
	this.step = typeof opts.step === "undefined" ? "" : opts.step;

}

///////////////////////////////////////////////////////////////////////////////////////////////////

cpxVar.abilities = {};

cpxVar.abilities.Jack = new CPX.Ability("Jack of All Trades");
//You dabble in just about everything. Get +1 to any Attribute rolls in where you are not using a Skill.
cpxVar.abilities.Getaway = new CPX.Ability("Getaway");
//Once per day, you can automatically flee a location sprinting, dodging, and ducking to avoid pursuit.
cpxVar.abilities.Hacker = new CPX.Ability("Hacker",{modTrouble:["Burglary", "Investigate", "Technical"]});
//You can use the Technology Skill to hack into computers and take control of networks.
cpxVar.abilities.Connected = new CPX.Ability("Connected",{modTrouble:["Influence", "Investigate"]});
//You can attempt to obtain favors from other Nobles, whether getting a loan, an invitation to a party, or introductions to other important people.
cpxVar.abilities.Strategy = new CPX.Ability("Strategy",{modTrouble:["Melee Combat", "Ranged Combat", "Unarmed Combat"]});
//When you take a few minutes to formulate a battle plan, allies get +1 to any rolls that follow that plan.
cpxVar.abilities.Trader = new CPX.Ability("Trader",{modTrouble:["Burglary", "Deceive", "Influence", "Knowledge"]});
//Once per day, you can halve the price of a purchase thanks to the different connections you have with distributers, merchants, tradesman, and smugglers. Also, you can tell the approximate value of artwork and trade goods once you've inspected them without having to roll.
cpxVar.abilities.Slay = new CPX.Ability("Slay");
// +2 melee damage.
//Bonus to damage if skill is melee or unarmed
cpxVar.abilities.Diplomat = new CPX.Ability("Diplomat",{modTrouble:["Empathy", "Influence", "Leadership"]});
// You can enter negotiations, bargain, or parley, even with the most disagreeable of people, as long as they are intelligent enough to understand you.
cpxVar.abilities.Engineer = new CPX.Ability("Engineer",{modTrouble:["Burglary", "Technical", "Knowledge"]});
// With the Crafting skill, you can create and repair devices of all kinds. You have a sizable workshop in a permanent location with a Specialist on retainer. Outside of the workshop, Also, you can make temporary repairs in a fraction of the time it takes a normal person using scavenged parts.
cpxVar.abilities.Expert = new CPX.Ability("Expert");
// Once per day, you can turn a Miss into a Partial Success.
//like jack
cpxVar.abilities.Inspire = new CPX.Ability("Inspire",{modTrouble:["Influence", "Leadership", "Performance"]});
// You can attempt to sway public opinion with your song, stories, or rhetoric.
cpxVar.abilities.Lucky = new CPX.Ability("Lucky");
// Once per day, you can turn any Miss into a Success instead.
//like jack
cpxVar.abilities.Pacify = new CPX.Ability("Pacify",{modTrouble:["Influence", "Deceive", "Performance"]});
// you can attempt to pacify or charm (demi)intelligent creatures with your voice.
cpxVar.abilities.Perform = new CPX.Ability("Perform",{modTrouble:["Influence", "Performance"]});
// When you entertain a crowd, you can earn d6s per Level each day. However, should any die roll a 1, the audience turns nasty and you won’t be allowed to perform for at least a  week without having rotten vegetables thrown at you.
cpxVar.abilities.Sleuth = new CPX.Ability("Sleuth",{modTrouble:["Empathy", "Investigate", "Notice"]});
// When you search for clues, you can do so quickly and while on the move. You can always tell when someone is lying, though you may not know the cause of their deception.
cpxVar.abilities.Surgeon = new CPX.Ability("Surgeon",{modTrouble:["Knowledge", "Empathy"]});
// With the Treatment skill, you can try to mix new medicines or bring someone back from the brink of death. 
cpxVar.abilities.Deadeye = new CPX.Ability("Deadeye",{modTrouble:["Ranged Combat"]});
// Add +2 damage to any ranged attack.
//Ranged Combat, and add damage

//Powers

//Alteration
cpxVar.abilities["Ability Boost"] = new CPX.Ability("Ability Boost",{isPower:true});
cpxVar.abilities["Alternate Form"] = new CPX.Ability("Alternate Form",{isPower:true});
cpxVar.abilities["Animal Shape"] = new CPX.Ability("Animal Shape",{isPower:true});
//You can take the form of animals gaining benefits for a short period of time. The longer you stay a beast, the more will it takes to return to your original form.  
cpxVar.abilities.Duplication = new CPX.Ability("Duplication",{isPower:true});
cpxVar.abilities.Growth = new CPX.Ability("Growth",{isPower:true, step:"Physique"});
cpxVar.abilities.Healing = new CPX.Ability("Healing",{modTrouble:["Arcana", "Empathy", "Influence"],isPower:true});
// You can neutralize poisons, remove curses and heal wounds without a touch.
cpxVar.abilities.Invisibility = new CPX.Ability("Invisibility",{isPower:true, step:"Stealth"});
cpxVar.abilities.Phasing = new CPX.Ability("Phasing",{isPower:true, step:"Burglary"});
cpxVar.abilities.Shrinking = new CPX.Ability("Shrinking",{isPower:true, step:"Stealth"});
cpxVar.abilities["Material Mimicry"] = new CPX.Ability("Material Mimicry",{isPower:true});
cpxVar.abilities.Stretching = new CPX.Ability("Stretching",{isPower:true, step:"Athletics"});
cpxVar.abilities["Super Agility"] = new CPX.Ability("Super Agility",{isPower:true, step:"Athletics"});
//You can defy gravity and leap, flip, tumble, and climb with superhuman agility.
cpxVar.abilities["Super Strength"] = new CPX.Ability("Super Strength",{isPower:true, step:"Physique"});
//Your strength is super heven by superhuman stnadards. 
cpxVar.abilities.Transformation = new CPX.Ability("Transformation",{isPower:true});

//Control
cpxVar.abilities["Cosmic Power"] = new CPX.Ability("Cosmic Power",{isPower:true, step:"Arcana"});
// You can create magical effects drawn from the raw power of Chaos. Such effects are powerful and wondrous, and not limited in scope like Sorcery. However, the risks of weaving such energies have hazards, both extreme and varied. You start with a Power score equal to your base Hit Dice +WIS.
cpxVar.abilities["Element Control"] = new CPX.Ability("Element Control",{isPower:true});
cpxVar.abilities.Gadgetry = new CPX.Ability("Gadgetry",{isPower:true, step:"Technical"});
// You try to solve any problem with gadgets you build. Anytime you attempt something risky, you roll +INT (you‘re using a gadget designed for exactly that problem). A Miss means the gadget does not what it should (GM‘s discretion). At Level 3, you design a device that replicates a Sorcery spell three times a day. At Levels 6 and 9, you each get one additional device that replicates another Sorcery spell.
cpxVar.abilities.Magic = new CPX.Ability("Magic",{modTrouble:["Arcana", "Melee Combat", "Ranged Combat"],isPower:true});
// You are able to cast spells that, while limited in scope, are much safer than the raw magical power of Wizardry. You start with three spells.
cpxVar.abilities["Time Control"] = new CPX.Ability("Time Control",{isPower:true});
cpxVar.abilities.Telekinesis = new CPX.Ability("Telekinesis",{isPower:true});
//You possess a powerful telekinetic ability. You can attempt to Push or Pull, as well as levitate heavy objects and even crush matter into itself
cpxVar.abilities.Transmutation = new CPX.Ability("Transmutation",{isPower:true});
cpxVar.abilities.Nullification = new CPX.Ability("Nullification",{isPower:true});

//Defenseive
cpxVar.abilities.Absorption = new CPX.Ability("Absorption",{isPower:true, step:"Ranged Combat"});
cpxVar.abilities["Force Field"] = new CPX.Ability("Force Field",{isPower:true});
//As long as you are awake and aware you ares surrounded by a protective barrier (Armor 2)
cpxVar.abilities.Immortality = new CPX.Ability("Immortality",{isPower:true});
cpxVar.abilities["Life Support"] = new CPX.Ability("Life Support",{isPower:true});
cpxVar.abilities.Reflection = new CPX.Ability("Reflection",{isPower:true, step:"Ranged Combat"});
cpxVar.abilities.Regeneration = new CPX.Ability("Regeneration",{isPower:true});
cpxVar.abilities.Resistance = new CPX.Ability("Resistance",{isPower:true});

//Mental
cpxVar.abilities["Emotion Control"] = new CPX.Ability("Emotion Control",{isPower:true, step:"Influence"});
cpxVar.abilities.Illusions = new CPX.Ability("Illusions",{modTrouble:["Deceive", "Perfromance", "Stealth"],isPower:true});
// You can create illusions to make someone see something that isn’t there, or mesmerise them so they believe something that isn’t true.
cpxVar.abilities["Mental Blast"] = new CPX.Ability("Mental Blast",{isPower:true, step:"Ranged Combat"});
cpxVar.abilities["Mind Control"] = new CPX.Ability("Mind Control",{isPower:true, step:"Deceive"});
cpxVar.abilities["Mind Shield"] = new CPX.Ability("Mind Shield",{isPower:true, step:"Will"});
//You are immune against fear, charm and sleep spells, and can resist mind control and mind blast.
cpxVar.abilities.Telepathy = new CPX.Ability("Telepathy",{isPower:true, step: "Empathy"});

//Offensive
cpxVar.abilities.Affliction = new CPX.Ability("Affliction",{isPower:true, step:"Unarmed Combat"});
cpxVar.abilities.Binding = new CPX.Ability("Binding",{isPower:true, step:"Melee Combat"});
cpxVar.abilities.Blast = new CPX.Ability("Blast",{isPower:true, step:"Ranged Combat"});
cpxVar.abilities.Strike = new CPX.Ability("Strike",{isPower:true, step:"Melee Combat"});
//you do 1d6 unarmed damage. On level 3,5,7 and 9, you get an additional +1 damage.
cpxVar.abilities.Aura = new CPX.Ability("Aura",{isPower:true, step:"Unarmed Combat"});
cpxVar.abilities.Dazzle = new CPX.Ability("Dazzle",{isPower:true, step:"Ranged Combat"});
cpxVar.abilities["Energy Drain"] = new CPX.Ability("Energy Drain",{isPower:true});
cpxVar.abilities["Fast Attack"] = new CPX.Ability("Fast Attack",{isPower:true, step:"Melee Combat"});
cpxVar.abilities.Stunning = new CPX.Ability("Stunning",{isPower:true, step:"Ranged Combat"});

//Movement 
cpxVar.abilities.Burrowing = new CPX.Ability("Burrowing",{isPower:true});
cpxVar.abilities.Flight = new CPX.Ability("Flight",{isPower:true});
cpxVar.abilities.Leaping = new CPX.Ability("Leaping",{isPower:true});
cpxVar.abilities["Super-Speed"] = new CPX.Ability("Super-Speed",{isPower:true});
cpxVar.abilities.Swinging = new CPX.Ability("Swinging",{isPower:true});
cpxVar.abilities.Teleportation = new CPX.Ability("Teleportation",{isPower:true});
cpxVar.abilities["Wall-Crawling"] = new CPX.Ability("Wall-Crawling",{isPower:true});

//Sensory
cpxVar.abilities.Divination = new CPX.Ability("Divination",{step:"Investigate" ,isPower:true});
// When you gaze into a crystal or a bowl of holy water, you can attempt to see events either far away, in the past, or in the future.
cpxVar.abilities.Detection = new CPX.Ability("Detection",{isPower:true});
cpxVar.abilities["Super-Senses"] = new CPX.Ability("Super-Senses",{isPower:true, step:"Notice"});
cpxVar.abilities["Danger Sense"] = new CPX.Ability("Danger Sense",{isPower:true});
//You always act first, and can react when suddenly surprised.
cpxVar.abilities.Interface = new CPX.Ability("Interface",{isPower:true, step:"Technical"});



/*
cpxVar.abilities.dodge = {name:"Dodge", info: "Once per day, ignore the damage from a single attack."}
//Soldier
cpxVar.abilities.bounty = {name:"Bounty Hunter", info:  "You are licensed and trained in the pursuit and apprehension of beings with bounties on their head. When fighting or subduing them, add +1 die to damage, discarding the lowest result." };
cpxVar.abilities.commando = {name:"Commando", info:  "Get +3 to all ranged attack damage when you are firing from a superior position on the field. Also, the weight of your armor should never have a negative effect on your ability to move stealthily." };
cpxVar.abilities.tacdef = {name:"Tactical Defense", info:  "Any Hirelings under your command get +1 to Armor as long as they can see and hear you." };
cpxVar.abilities.tank = {name:"Tank", info:  "The weight of your armor will never change your speed to less than Fast. You can also carry an extra heavy item." };
//Brute
cpxVar.abilities.brawler = {name:"Brawler", info:  "When outnumbered by enemies, you get +1 to armor." };
cpxVar.abilities.hardened = {name:"Hardened", info:  "Add +6 to your Vitality." };
cpxVar.abilities.slugger = {name:"Slugger", info:  "Your unarmed attacks become light melee weapons and, when wielding a heavy melee weapon, you get +2 damage to attacks." };
*/

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Hero=function (opts) {
	opts = typeof opts === "undefined" ? {faction:"",subtype:"",area:{uid:"",_realm:"",units:[]}} : opts;
	if (typeof opts.load !== "undefined") { return; }
	
	this.type="Hero";
	this.uid = "H"+makeUID(23);

	this._parent = typeof opts.faction === "undefined" ? "" : opts.faction;

	var area = typeof opts.area === "undefined" ? {uid:"",_realm:"",units:[]} : opts.area;
	this.setLocation(area);	

	//-1 dead, 0 in build, 1 ready, 2 cooldown
	this._active=1;

	this._hero=true;

	this.xp=0;
    this.HP=0;
    this.HPMax=0;
    
    this.levels=[];
	this.stats=[];
	this.statsType="Approaches";
	this.skills={};
	this.abilities=[];
	this.powers=[];
	this.special=[];
	this.attacks=[];

	this.initialize();
}
CPX.Hero.inherits(CPX.Unit);
CPX.Hero.prototype.initialize = function (type) {
	//save the initial 
	var sa = ["_realm","_parent","type","name","_area","_active","visibile","levels","xp","HP","HPMax","stats","special","attacks"];
	cpxSave({obj:this,doc:cpxSaveCompile(this,sa),initial:true});
}
CPX.Hero.prototype.skillVal = function (skill,stat) {
	var B=[0,0,0], S="", sid = -1;
	if (typeof this[skill] !== "undefined") { B[0] = this[skill]; }
	
	if(this.statsType == "Approaches" ) {
		S=cpxRNG.rndArray(cpxVar.Skills[skill]);
	}
	else {
		if (typeof stat === "undefined") {
			for(var x in cpxVar.StatsXSkills) {
				if(cpxVar.StatsXSkills[x].test(skill)) { S=x; }
			}
		}
		else { S = stat; }
	}

	B[1]=this.stats[cpxVar.heroStats.indexOf(S)];
	B[2]=B[0]+B[1];

	if(this.realm().rules=="DW") {
		if(B[2] > 3) { B[2] = 3; }
	}
	
	return B;
}

CPX.Hero.define = function(faction,area,template) {
	var nH = new CPX.Hero({faction:faction, area:area})

	var doc={}
	for (var x in template) {
		if(x == "uid" || x == "type" || x == "load") { continue; }
		doc[x] = template[x];
	}
	doc = JSON.stringify(doc);

	var ndoc = JSON.parse(doc);
	for (var x in ndoc) {
		nH[x] = ndoc[x];
	}

	return nH;	
}


CPX.Hero.childInfoDisplay = function (hero) {
	var hA=cpxVar.heroApproaches;

    //current classes
    var cclass=[], n="";
    hero.levels.forEach(function(c){
        n=cpxVar.classes[c].name;
        if( cclass.indexOf(n) == -1 ) { cclass.push(n); }
    });

	var html='<div class=hero id="'+hero.uid+'_Hero" data-uid='+hero.uid+'><strong class=heroSlide>'+hero.name+'</strong>';
	html+='<span class=heroArea id="'+hero.uid+'_Area"> (@ '+hero.area().factionColors()+hero.area().name+')</span>';
	html+='</div>';

	return html;
}

CPX.Hero.activeRoster = function (unit) {
	var html='<div class=activeUnit id="'+unit.uid+'_Hero" data-uid='+unit.uid+'><strong class=heroSlide>'+unit.name+'</strong>';	
	html+='<span class=heroArea id="'+unit.uid+'_Area"> (';
	
	var type=unit.area().parent().type;
	if(type=="Sector") { html+= unit.area().parent().type+" "+unit.area().parent().sid; }
	else { html+= unit.area().parent().type+": "+unit.area().parent().name; }

	html+=", "+unit.area().name+')</span>';
	html+='</div>';

	return html;
}


CPX.Realm.prototype.randomHero = function (hero) {
    var list=[], RN=this.RNG;
    for(var x in cpxVar.classes) { list.push(x); }

	var hclass = RN.rndArray(list), C=cpxVar.classes[hclass];
    hero.levels.push(hclass);

	var stats=[2,1,1,0,0,-1];
	hero.stats=RN.shuffleAr(stats);

	//Number of powers
	var powers = [];
	for (var x in cpxVar.abilities) { 
		if (cpxVar.abilities[x].isPower) { powers.push(x); }
	}

	var skills = []; 
	for (var x in cpxVar.Skills) { skills.push(x); }
	
   	//heroes initially get a skill, ability and power
   	//initial skill comes from their class skill list
   	var nspecial=RN.rndArray(C.skills);
   	hero.special.push(nspecial);

	//Power
    //either a required power or a power
    if(typeof C.required !== "undefined") {
    	nspecial=RN.rndArray(C.required);
    }
    else { nspecial=RN.rndArray(powers); }
	hero.special.push(nspecial);

    //Their ability from the class list
	nspecial=RN.rndArray(C.abilities);
   	while ( hero.special.test(nspecial) ) { nspecial=RN.rndArray(C.abilities); }
    hero.special.push(nspecial); 

}
CPX.Realm.prototype.randomLevel = function (hero) {
    var classes=[], RN=this.RNG;
    for(var x in cpxVar.classes) { classes.push(x); }

	var skills = []; 
	for (var x in cpxVar.Skills) { skills.push(x); }

    //current classes and powers
    var cclass=[], cpowers=[];
    hero.levels.forEach(function(c){
        if( !cclass.test(c) ) { cclass.push(c); }
    });
	hero.special.forEach(function(s){
		if( !skills.test(s) ) {
        	if( cpxVar.abilities[s].isPower ) { cpowers.push(s); }
		}
    });

    //add class
    if (cclass.length == 1) {
        if(RN.RND()<0.5) { hero.levels.push(RN.rndArray(cclass)); }
        else { hero.levels.push(RN.rndArray(classes)); }
    }
    else if (cclass.length == 2) {
        if(L > 6) {
            if(RN.RND()<0.5) { hero.levels.push(RN.rndArray(cclass)); }
            else { hero.levels.push(RN.rndArray(classes)); }
        }
        else { hero.levels.push(RN.rndArray(cclass)); }
    }
    else {
        hero.levels.push(RN.rndArray(cclass));
    }

	//current level
    L=hero.levels.length;

    //increases stats at levels 4,7,& 10
    var j=RN.rndInt(0,5), stlv=[4,7,10];
    if( stlv.test(L) ) {  
	    //ensures a random stat is not 3 or greater
	    while ( hero.stats[j]>=3 ) {
	        j = RN.rndInt(0,5);
	    }
	    hero.stats[j]++;
    }

   	//make a power instead of an ability or skill under certain conditions
    var np = 0;
    if( cpowers.length <3 ) { if (RN.RND<0.35) { np=1; } }
    else if( cpowers.length == 3 ) { if (RN.RND<0.10) { np=1; } }

    //Number of powers
	var powers = [];
	for (var x in cpxVar.abilities) { 
		if (cpxVar.abilities[x].isPower) { powers.push(x); }
	}

    //increases skills at 3,5,7,9
    var nability="", slv=[3,5,7,9];
    if( slv.test(L) ) {
    	if (np > 0) {
			nability=RN.rndArray(powers);
			while ( hero.special.test(nability) ) { nability=RN.rndArray(powers); }
    	}
    	else {
			nability=RN.rndArray(skills);
			while ( hero.special.test(nability) ) { nability=RN.rndArray(skills); }
    	}
    	hero.special.push(nability); 
    }

    //increases abilities at 2,4,6,8,10
    var abilities=[], ablv=[2,4,6,8,10];
    cclass.forEach(function(c){
		abilities=abilities.concat(cpxVar.classes[c].abilities);
    });
    if( ablv.test(L) ) {
    	if (np > 0) {
			nability=RN.rndArray(powers);
			while ( hero.special.test(nability) ) { nability=RN.rndArray(powers); }
    	}
    	else {
			nability=RN.rndArray(abilities);
			while ( hero.special.test(nability) ) { nability=RN.rndArray(abilities); }
    	}
    	hero.special.push(nability); 
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

$(document).on("click", ".hero", function(){
	var ruid=$("#rName").data("uid"), uid=$(this).data("uid");
	var cH=cpxRealms[ruid].db[uid];

	if($( "#"+uid+"_Hero"  ).hasClass("selected")) {
		cpxRealms[ruid].GUI.disableUnitButtons();
		$( "#"+uid+"_Hero"  ).removeClass("selected");
	}
	else {
		$(".hero").removeClass("selected");
		$( "#"+uid+"_Hero"  ).addClass("selected");
		$( "#actHero" ).empty();
		$( "#actHero" ).append(cH.name+" ");
		$( "#pOptions" ).children(".buttons").attr("data-uid",uid);
		cpxRealms[ruid].GUI.enableButtons(cH);
	}

	if($("#" + cH.uid + '_Dialog').length == 0) {
		var html='<div class="dialog-hero" id="'+cH.uid+'_Dialog">';
		html+='<h3 class="center header"><button class=dialogSlider></button>'+cH.name;
		html+='<img class=dialogClose src="images/close_boxx_128.png" data-uid="'+cH.uid+'" /></h3>';

		html+='<div><div class=dHeroSub><span class=dHeroXP>XP '+cH.xp+'</span></div>'
		html+='<div class="center dHeroSub dHeroStats">';
		var i=0, hs= cpxVar["hero"+cH.statsType];
		if(cH.statsType == "Stats") {
			for(i=0 ; i<hs.length ; i++) {
				html+='<span class="hero'+cH.statsType+'">'+cpxVar.heroStatsIcons[i]+' '+cH.stats[i]+'</span>';
			}
		}
		else {
			for(i=0 ; i<hs.length ; i++) {
				html+='<span class="hero'+cH.statsType+'">'+hs[i]+'</span>';
			}
		}
		html+='</div>';

		html+='<div class="dHeroSub dHeroSkills">Skills: ';
		for(var x in cH.skills){
			html+=x+' '+cH.skills[x];
		}
		html+='</div>';

		html+='<div class="dHeroSub dHeroAbilities">Abilities: ';
		cH.abilities.forEach(function(a){
			html+=cpxVar.abilities[a].name+": "+cpxVar.abilities.text;
		});
		html+='</div>';

		html+='<div class="dHeroSub dHeroGear">Gear: ';
		cH.gear.forEach(function(g){
			html+=cpxVar.gear[g].name;
		});
		html+='</div>';

		html+='</div></div>';

		$("#moreInfo").append(html);

		$( "#" + cH.uid + '_Dialog' ).draggable();
	}
	else { $("#" + cH.uid + '_Dialog').show(); }
	
});