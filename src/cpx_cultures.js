cpxCVar={};

cpxVar.professions=["Diplomats","Engineers" , "Explorers", "Fighters", "Merchants" ,"Rogues", "Scholars"];
cpxVar.statsArray=[2,1,1,0,0,0,-1];

cpxCVar.psychp=["Militant","Progressive","Artistic","Industrious","Ascetic","Commerce", "Collectivity", "Journeying", "Curiosity", "Joy", "Pacifism", "Faith", "Sagacity", "Subtlety", "Tradition", "Tribalism", "Honor"];
cpxCVar.psychn=["Despair", "Domination", "Pride", "Fear", "Gluttony", "Greed", "Treachery", "Hate", "Wrath"];
cpxCVar.spiritual=["God Kings","Theological","Rational","Shamanic","Ritualistic","Cults","Spiritual"];
cpxCVar.society=["Outposts","Wondrous","Exploitative","Nomadic","Centralized","Underworld","Mercantile"];
cpxCVar.technology=["Steam","Magical","Biotech","Primative","Dark","Standard","Standard","Standard"];
//cpxCVar.secrets=["Relic of Dark Power","Forgotten Prison/Vault","Vile Corruption","Haunted","Lost Symbol of Hope", "Wild Magic Pockets", "Power Behind the Throne", "Politically Inconvenient", "I am Your Father", "Red Herring"];
//cpxCVar.wonders=["An ancient ruin", "A bazaar", "Circles of mysterious stones", "A city built within a skeleton", "A city buried under a millennium of ice", "A courthouse", "An extravagant palace", "A factory", "A flying castle", "A ghost ship", "A ghost town", "A gigantic stone statue", "A graveyard", "A hidden city", "A hidden treasure", "An inventor's castle", "A landmark that appears only at certain times", "A beacon", "A lush garden", "A mechanical tower", "A military base", "A monster's nest", "A museum", "A peculiar forest", "A star archive", "A portal to an alternate reality", "A power plant", "A prison complex", "A pyramid", "A research laboratory", "A sealed cavern", "A secret underground complex", "A temple", "A tomb sealed one thousand years", "A tower of crystal", "A superskyscraper", "A tunnel of unknown depth", "An underwater city", "A university", "A war memorial"];
cpxCVar.exports=["Alcohol", "Ammunition", "Data", "Ships", "Clocks", "Crystals", "Currency", "Fancy Clothes", "Glasswork", "Gold", "Guns", "Horses", "Plants", "Incense", "Ivory", "Licenses", "Lockboxes", "Lucky Trinkets", "Luxury Foods", "Medicines", "Musical Instruments", "Musical Scores", "Pack Animals", "Pet Monsters", "Popular Fiction", "Portrait Paintings", "Precious Ores", "Precision Instruments", "Preserved Foods", "Rare Food", "Raw Metals", "Sculptures", "Secret Documents", "Silk Clothes", "Coffee", "Melee weapons", "Tapestries", "Textbooks", "Wool"];

var CultureSkills=["Diplomats","Engineers","Explorers","Warriors","Scientists","Rogues"];


CPX.Culture=function (opts) {
	if (typeof opts.load !== "undefined") { return; }
	
	CPX.Faction.call(this, opts);

	this.uid = "C"+makeUID(23);
	this.RNG = new CPX.RNG(this.uid);
	this.type="Culture";

	this.initialize(opts); 
}
CPX.Culture.inherits(CPX.Faction);
//
CPX.Culture.prototype.initialize = function (opts) {
	var RN=this.RNG;
	
	//color
	var R=RN.rndInt(0,256), G=RN.rndInt(0,256), B=RN.rndInt(0,256);
	this.color=[R,G,B,rgbToHex(R,G,B)];

	//name
	var getName = NameGenerator(RN.rndInt(1,9999999));
	this.name = getName();

	var v=cpxCVar;
	//species
	this.species=[];
	if (typeof opts.FTL !== "undefined") { 
		this.TL=opts.TL;
		this.FTL=RN.FateRoll();
		this.makeStarfaring(); 

		this.subtype="Starfaring";
	}

	//save doc for the initial culture
	var sa = ["_realm","_parent","children","visible","name","type","bases","assets","units","TL","FTL","color"];
	this.doc = cpxSaveCompile(this,sa);
	
	this.doc.subtype = this.subtype;

	this.doc.stats=RN.shuffleAr(cpxVar.statsArray);	//Diplomat, Engineer, Explorer, Fighter, Science, Subterfuge
	this.doc.aggro=RN.FateRoll(); 		//determines their initial aggression
    this.doc.psych=[RN.rndArray(v.psychp),RN.rndArray(v.psychn)];

    this.doc.gov=[RN.rndArray(government)];
    if (RN.seedrnd()>0.75) {
        var ng= RN.rndInt(2,4)-1;
        for (var i=0; i<ng; i++) {
            this.doc.gov.push(RN.rndArray(government));
        }
    }

    this.doc.society=RN.rndInt(0,v.society.length-1);
	this.doc.spiritual=RN.rndInt(0,v.spiritual.length-1);
	this.doc.tech=RN.rndInt(0,v.technology.length-1);

	this.doc.species = this.species;
	delete this["species"];

	//save the initial 
	cpxSave({obj:this,doc:this.doc,initial:true});
	delete this["doc"];

}
CPX.Culture.prototype.makeStarfaring = function () {
	var RN=this.RNG;

	this.subtype="Starfaring";

	var nspecies=[];
	if (this.TL==0) { nspecies=RN.rndArray([1, 1, 1, 1, 2, RN.rndInt(3,5)]); }
	else if (this.TL==1) { nspecies=RN.rndArray([1, 1, 2, RN.rndInt(3,5)]); }
	else { nspecies=RN.rndArray([1, 2, RN.rndInt(3,5), RN.rndInt(3,5), "Multitude", "Multitude"]); }

   	var rs=races.std.concat(races.fantasy);
   	var rt=rs.concat(races.ftsynt, races.outsider, races.undead, races.beasts);

   	if (nspecies=="Multitude") {
        this.species.push("Multitude")
        nspecies=(RN.rndInt(3,5));
    }

	var s="";
    for (var i=0;i<nspecies;i++) {
		s=RN.rndArray(rt);
		if (i==0) { s=RN.rndArray(rs); }
    	if (RN.seedrnd()<humanity) { s="Humans"; }
    	this.species.push(s);
    }

}
CPX.Culture.prototype.makePlanetbound = function () {

}
CPX.Culture.prototype.maxStat = function () {
	var maxstat=ArrayMax(this.stats);
	var statd=CultureSkills[maxstat[0]];
	return statd;	
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//html to return to the parent when the parent updates the GUI
//TODO refactor with JQuery variables instead of string addition
CPX.Culture.childInfoDisplay = function (culture) {
	var color='rgb('+culture.color[0]+','+culture.color[1]+','+culture.color[2]+')';
	color='<svg width="15" height="10"><rect width="10" height="10" style="fill:'+color+'" /></svg>';
	
	var html='<div id="'+culture.uid+'_Container">';
	html+='<div id="'+culture.uid+'_Name" class="starfaring" data-uid="'+culture.uid+'">';
	html+=color;
	html+='<strong>'+culture.name+"</strong>";
	html+=' (TL '+culture.TL+')</div>';

	html+='<div id="'+culture.uid+'_BaseContainer">'
	for(var i=0; i < culture.bases.length ; i++) { html+= CPX.Area.childInfoDisplay(culture.base(i));  }
	html+='</div>'
	
	html+='</div>';

    return html;
}


