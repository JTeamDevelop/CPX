
CPX.Faction=function (opts) {
	opts = typeof opts === "undefined" ? {realm:{uid:""}} : opts;
	CPX.Object.call(this);

	this.uid = "F"+makeUID(23);

	this._realm=opts.realm.uid;

	this.bases=[];
	this.assets=[];
	this.units=[];

	if (typeof opts.auto !== "undefined") { this.initialize(); }
}
CPX.Faction.inherits(CPX.Object);
CPX.Faction.prototype.initialize =function (i) {
	if (typeof opts.load !== "undefined") { this.load(); return; }
	
	this.RNG = new CPX.RNG(this.uid);
	var RN=this.RNG;

	var getName = NameGenerator(RN.rndInt(1,9999999));
	this.name = getName();

	var R=RN.rndInt(0,256), G=RN.rndInt(0,256), B=RN.rndInt(0,256);
	this.color=[R,G,B,rgbToHex(R,G,B)];

	this.TL=0;
	this.FTL=RN.FateRoll();

	this.type="Faction";

	//save the initial 
	var sa = ["_realm","_parent","children","visible","name","type","bases","assets","units","TL","FTL","color"];
	cpxSave({obj:this,doc:cpxSaveCompile(this,sa),initial:true});

}
CPX.Faction.prototype.base =function (i) {
	return this.lookup(this.bases[i]);
}
CPX.Faction.prototype.unit =function (i) {
	return this.lookup(this.units[i]);
}
CPX.Faction.prototype.removeUnit =function (uid) {
	var ui = this.units.indexOf(uid);
	if(ui>-1) {
		this.units.splice(ui,1);
	}
}
CPX.Faction.prototype.removeBase =function (uid) {
	var ui = this.bases.indexOf(uid);
	if(ui>-1) {
		this.bases.splice(ui,1);
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
CPX.Faction.prototype.speed = function () {
	return cpxVar.FTLScale[this.TL]*cpxVar.FTLMod[this.FTL+4];
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Faction.prototype.levels =function () {
	var nl=[0,0,0], n=0, i=0, j=0, sa=-1, A={}, U={};
	
	for(i=0;i<this.bases.length;i++) {
		A=this.base(i).parent();
		if(A.trouble.length==0) {
			n=A.advancements.length;
			for (j=0;j<n;j++) {
				nl[0]+=A.advancements[j]*cpxVar.sAdvBenefit[j][0];
				nl[1]+=A.advancements[j]*cpxVar.sAdvBenefit[j][1];
				nl[2]+=A.advancements[j]*cpxVar.sAdvBenefit[j][2];
			}
		}
	}

	for(i=0;i<this.units.length;i++) {
		U=cpxVar.orgUnits[this.unit(i).subtype];
		nl[0]-=U.cost[0];
		nl[1]-=U.cost[1];
		nl[2]-=U.cost[2];
	}

	nl[0]=Math.floor(nl[0]), nl[1]=Math.floor(nl[1]), nl[2]=Math.floor(nl[2]);
	
	return nl;
}

CPX.Faction.prototype.levelLow =function () {
	var i=0, li=-1, lv=1, cL=this.levels(), iB=this.realm().factionInBuild(this.uid);
	for (i=0;i<3;i++) {
		if(cL[i]+iB[i]<lv) {
			li=i;
			lv=cL[i];
		}
	}
	return [li,lv];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Faction.prototype.addTrouble =function () {
	var A=this.RNG.rndArray(this.bases);
	A=this.lookup(A);
	A.parent().addTrouble();
}
CPX.Faction.prototype.troubleCheck =function () {
	var cB={}, ta=[], fa=[], F=this;
	this.bases.forEach(function(b){
		cB=F.lookup(b);
		if (cB.parent().trouble.length>0) { 
			if (cB.trouble.length == 0) { ta.push(b); }
		}
		else {fa.push(b);}			
	});

	return [ta,fa];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

CPX.Realm.prototype.factionRandomAssets =function (faction) {
	var RN=faction.RNG;

/*
	var l=this.TL, rl=[];
	rl[0]=[[2,1,1,1],[2,2,1,1]];
	rl[1]=[[4,2,1,1],[4,2,2,1]];
	rl[2]=[[6,4,2,1],[6,3,3,1],[6,3,2,2]];
	rl[3]=[[8,6,4,2],[8,5,4,3],[8,4,4,4]];
	rl=RN.rndArray(rl[l]);

	this.levels=this.RNG.shuffleAr(rl);
	lmax=ArrayMax(this.levels);
*/

	//set variables to randomly generate assets
	//org can have assets of a total level based upon their Tech Level, this is m
	var m=[5,10,15,20,25], av=m[faction.TL], i=0, A={};
	
	for (i=0; i < faction.bases.length ; i++) {
		av=m[faction.TL];
		A=faction.base(i).parent();
		while (av>1) {
			A.advancements[RN.rndInt(0,8)]++;
			av--;
		}
	}

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Finds whats in build for the particular faction uid
CPX.Realm.prototype.factionInBuild =function (uid) {
	var ba=[[],[],[],[]], q={};

	for(var x in this.queue) 
	{
		q=this.queue[x];	
		if (q.options.faction == uid) { 
			if(q.ftorun.search("BuildAsset") > -1) { 
			 	ba[0].push(q.options.what); 
			}
			else if (q.ftorun.search("BuildUnit") > -1) { 
				ba[1].push(q.options.what); 
			}
			ba[3].push(q.options.area);			 
		}
	}

	//sum levels of assets in build
	var cB=[], iBL=[0,0,0], i=-1;
	for (var j=0 ; j < ba[0].length ; j++ ) {
		cB=ba[0][j];
		i=cpxVar.siteAdvancements.indexOf(cB[0]);
		iBL[0]+=cpxVar.sAdvBenefit[i][0]*cB[1];
		iBL[1]+=cpxVar.sAdvBenefit[i][1]*cB[1];
		iBL[2]+=cpxVar.sAdvBenefit[i][2]*cB[1];
	}
	ba[2]=iBL;

	return ba;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//build if low levels 
CPX.Realm.prototype.factionImprove =function (opts) {
	var R=this, F=this.db[opts.uid], RN=F.RNG;

	function reQ () {
		var t=R.getTime()+RN.rndInt(12,18); 
		R.newQ(t,"realm","factionImprove",{uid:F.uid});
	}

	//if there are no free bases, requeue and try again later
	var fA=F.troubleCheck()[1], iB=this.factionInBuild(F.uid);
	if (fA.length==0 || iB[0].length >4) {
		reQ();
		return; 
	} 
	 
	//where to build
	var rA = RN.rndArray(fA); 
	//what to build
	var adv=RN.rndArray(cpxVar.siteAdvancements); 	
	this.factionBuildSetup(F,["Asset",adv,2],rA);

	reQ();	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//build units to overcome trouble at an area - uid
CPX.Realm.prototype.factionTroubleOvercome =function (opts) {
	var R=this, F=this.db[opts.uid], RN=F.RNG;

	function reQ () {
		var t=R.getTime()+RN.rndInt(12,18); 
		R.newQ(t,"realm","factionTroubleOvercome",{uid:F.uid});
	}

	//if there is no trouble, requeue and try again later
	var fA=F.troubleCheck();
	if (fA[0].length==0) {
		reQ();
		return; 
	} 

	//troubleOvercome: ["Guardsman","Military","Merchant","Sage","Prophet","Magistrate"];
	//Faction stats: "Diplomats","Engineers" , "Explorers", "Fighters", "Merchants" ,"Rogues", "Scholars"

	//Get the first trouble and try to solve it 
	var tA=this.db[fA[0][0]].parent(), T=tA.trouble, B=-9;	
	
	switch(T[0]) 
	{
		case 0: B=F.stats[5]; break;
		case 1: B=F.stats[3]; break;
	    case 2: B=F.stats[4]; break;
		case 3: 
			B=F.stats[1];
			if ( F.stats[6] > F.stats[1] ) { B=F.stats[6]; } 
			break;
		case 4: B=F.stats[6]; break;
		case 5: B=F.stats[0]; break;
	}
   
	var Roll=RN.DWRoll(), result="";
	if(Roll+B>=7) { tA.reduceTrouble(RN.rndInt(1,2)); result="Success"; }
	else if(R+B>=10) { tA.reduceTrouble(RN.rndInt(1,4)); result="Success+"; }
    else if(R+B>=12) { tA.reduceTrouble(RN.rndInt(2,6)); result="Success++"; }
    else 
    { 
    	if(RN.RND()<0.5) { this.areaRandomDestruction(tA,RN.rndInt(1,2)); }
    	else { tA.increaseTrouble(1); }
    	result="Failure";
	}

	reQ();

	var html="<div>T: "+this.getTime()+" Trouble Overcome "+F.name+" @ "+tA.name+" "+result+"</div>"
	this.GUI["log"+F.type](html);
	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////