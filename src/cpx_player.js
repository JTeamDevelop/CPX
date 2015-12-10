
//Creates the player
CPX.Player=function (opts) {
	if (typeof opts.load !== "undefined") { return; }
	
	CPX.Faction.call(this,opts);

	//creates a completely random seed
	this.uid = "9"+makeUID(27);
	//Creates a specific random number generator based upon the uid seed
	this.RNG = new CPX.RNG(this.uid);

	this.name = "Player";
    this.type="Player";
    this._XP=0;

	//equivalent to an FTL of 350 ly/day
   	this.TL=2;
    this.FTL=3;

	this.initialize();
}
CPX.Player.inherits(CPX.Faction);
CPX.Player.prototype.initialize = function (opts) {

	//save the initial 
	var sa = ["_realm","_parent","children","visible","name","type","bases","assets","units","TL","FTL","color","_XP"];
	cpxSave({obj:this,doc:cpxSaveCompile(this,sa),initial:true});

}
CPX.Player.prototype.addHero =function (area) {
	var RN=this.RNG, lv=RN.rndInt(3,5), stats=[2,1,1,0,0,-1];

	var getName = NameGenerator(RN.rndInt(1,9999999));

	nH=new CPX.Hero({faction:this.uid,area:area});
	nH.name = getName();

	this.realm().randomHero(nH);
	for (var i =1 ; i<lv ; i++) { this.realm().randomLevel(nH); }

	this.realm().dbPush(nH);
	this.units.push(nH.uid);

	return nH;
}
CPX.Player.prototype.infoDisplay =function () {

	return "";
}
CPX.Player.prototype.Display =function () {
	var html=this.infoDisplay();

	this.realm().GUI.append("mLeft",html);

/*	for(var x in this.units){
		if(this.units[x]._hero) {
			scene.add(this.units[x].genThreeD());	
		}
	}	
	*/
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Realm.prototype.playerOvercomeTrouble = function (opts) {
	var hero=this.db[opts.unit], L=hero.levels.length, sp=hero.special, A=hero.area();
    var F=hero.parent(), RN=F.RNG, T=A.trouble, skill=T[1], stat=T[2];
    
    var hasSkill=false, step=0;
    var B=-9, R=0;
    var RF="fail"; //fail, close-call, weak, strong, super, cosmic

	var skills = []; 
	for (var x in cpxVar.Skills) { skills.push(x); }

	//check for never fail conditions
    if( sp.test(skill) ) { hasSkill=true; }

	B=hero.stats[stat];
	//check for Jack of all trades
    if( sp.test("Jack") || sp.test("Expert") || sp.test("Lucky") ) { 
    	if(!hasSkill) { B++; }
    }

	//check whether there is an ability that grants a bonus to the skill roll
    var i=0;
    for (i=0 ; i<sp.length ; i++) {
    	//not a skill
    	if (skills.indexOf(sp[i]) == -1) {
    		//it may modify trouble rolls
			if (cpxVar.abilities[sp[i]].modTrouble.length>0) {
				//skill is on the list, gain a bonus
				if(cpxVar.abilities[sp[i]].modTrouble.test(skill) ) { B++; }
			}
			//if the ability/power has a step mod for the skill - step starts @ 1 & increases at 3,5,7,9
			if (cpxVar.abilities[sp[i]].step == skill) { step = 1+Math.floor(L/2); }
    	}
    }

    R=RN.rndInt(1,6)+RN.rndInt(1,6+(2*step));
    
    if(R+B>=15) { RF="cosmic"; }
    else if(R+B>=12) { RF="super"; }
    else if(R+B>=10) { RF="strong"; }
    else if(R+B>=7) { RF="weak"; } 
    else { 
		if(hasSkill) { RF="close"; }
	}

	//half damage for fail
	if( hero.special.test("getaway") ) {  }

	this.GUI.overcomeResult(U,A,T[0],R+B);

    hero.setCooldown(7+RN.multiRoll(1,6,2));
}

CPX.Realm.prototype.heroSkillRoll = function (hero,skill,stat) {

	

}

