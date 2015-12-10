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

var CPX={};

var cpxDB = new PouchDB('CPX');
var cpxRealms ={};

var cpxVar={};
cpxVar.abilities = {};
cpxVar.gear = {};

///////////////////////////////////////////////////////////////////////////////////////////////////////

function cpxDBInitialize () {
  	localforage.getItem('user-data', function(err, value) {

    	if(value === null) {
    		localforage.setItem('user-data', {"id":'user-data',db:[]}, function(err, value) {
    		// Do other things once the value has been saved.
    		//console.log(value);
			});
    	}
		else {
  			for (var x in value) {

  			}
		}	
  	});


	localforage.getItem('realms', function(err, value) {

    	if(value === null) {
    		localforage.setItem('realms', {"_id":'realms'}, function(err, value) {
    		// Do other things once the value has been saved.
    		//console.log(value);
			});
    	}
		else {
  			for (var x in value) {
  				if(x.length==24) {
  					$("#SectorGen").after('<div class="loadRealm" data-uid='+x+'>Load Realm: '+value[x]+'</div>');
  				}
  			}
		}	
  	});

}

///////////////////////////////////////////////////////////////////////////////////////////////////////

cpxSaveCompile = function (obj,array,initial) {
	initial = typeof initial === "undefined" ? true : initial;
	
	var doc = {}, i=0, oi="";
	if(initial) { doc["_id"] = obj.uid; }
	
	for (i=0 ; i < array.length ; i++) {
		oi=array[i];
		if(oi[0] == "_") {
			doc[oi.substr(1)] = obj[oi]; 
		}
		else { doc[oi] = obj[oi]; }
	}
	return doc;
}

cpxSave = function (opts) {
	var initial = typeof opts.initial === "undefined" ? false : opts.initial;

	//save arrays to update during play
	var sa={};
	//galaxy
	sa.Galaxy = ["children","name","sectorList"];
	//sector
	sa.Sector = ["children","visible","name","_visited","_owner","_isBase","assets","advancements","units","_attacker","trouble"];
	//area, system, ruin
	sa.Area = ["children","visible","name","size","location","links","_visited","_owner","_isBase","assets","advancements","units","_attacker","trouble"];
	//units
	sa.Unit = ["name","_area","_active","visibile","_hero","xp","HP","HPMax","special","attacks","support"];
	//heroes
	sa.Hero = ["name","_area","_active","visibile","levels","xp","HP","HPMax","stats","special","attacks"];
	//culture, faction, threat
	sa.Faction = ["children","visible","name","bases","assets","units","TL","FTL","color"];
	//player
	sa.Player = ["children","name","bases","assets","units","TL","FTL","color","_XP"];

	var type="";
	var area = /Area|System|Ruin/;
	var faction = /Faction|Culture|Threat/;

	if(area.test(opts.obj.type)) { type = "Area"; }
	else if (faction.test(opts.obj.type)) { type = "Faction"; }
	else { type = opts.obj.type; }

	var ndoc = typeof opts.doc === "undefined" ? cpxSaveCompile(opts.obj,sa[type],initial) : opts.doc;
	
	//localforage
	if(initial) {
		localforage.setItem(opts.obj.uid, ndoc, function(err, value) {
    		// Do other things once the value has been saved. console.log(value);
		});
	}
	else {
		localforage.getItem(opts.obj.uid, function(err, value) {
    		// Run this code once the value has been loaded from the offline store.
    		for (var x in ndoc) {
    			value[x] = ndoc[x];
    		}

    		localforage.setItem(opts.obj.uid, value, function(err, value) {
    			// Do other things once the value has been saved.
			});
   		});
	}

/*PouchDB style
	if(initial) {
		cpxDB.put(ndoc).then(function () {
    		return cpxDB.get(opts.obj.uid);
  		}).then(function (doc) {
    		console.log('We stored a ' + doc.type);
  		}).catch(function (err) {
  			console.log(err);
		});
	}
	else {
		cpxDB.get(opts.obj.uid).then(function (doc) {
  			// okay, doc contains our document
  			for (var x in ndoc) { doc[x]=ndoc[x]; }
  			// put them back
  			return cpxDB.put(doc);  
		}).catch(function (err) {
			// oh noes! we got an error		
  		});
	}
*/
}

cpxSaveRealm = function (realm) {
	
	var sa = ["_realm","name","type","children","_player","start","tock"];
	var doc = cpxSaveCompile(realm,sa,false);

	//generate a list of objects stored in the realm db
	doc.rdb=[];
	for (var x in realm.db) { 	
		doc.rdb.push({uid:x,type:realm.db[x].type});
		cpxSave({obj:realm.db[x]}); 
	}
	
	//generate a list of objects stored queue
	doc.q=[];
	for (var x in realm.queue) { 	
		doc.q.push(realm.queue[x].saveData());
	}	

	//save the realm itself
	cpxSave({obj:realm,doc:doc});	
}

cpxLoadInitialize = function (realm) {
	realm.GUI.init();
	$( "#mainmenu-slideout" ).slideToggle();
	
	var P=realm.player(), H=realm.RNG.rndArray(P.units);
	P.Display();
	realm.db[H].area().sector().display();

	console.log(realm);
}

/*
	//save arrays to update during play
	var sa={};
	//galaxy
	sa.Galaxy = ["_realm","_parent","children","visible","name","type","size","radius","height","sectorSize"];
	//sector
	sa.Sector = ["_realm","_parent","children","visible","name","type","size","sid","location","links","_owner","_isBase","assets","advancements","units","_attacker","trouble"];
	//area, system, ruin
	sa.Area = ["_realm","_parent","children","visible","name","type","size","location","links","_owner","_isBase","assets","advancements","units","_attacker","trouble","knownRuins"];
	//units
	sa.Unit = ["_realm","_parent","type","subtype","name","_area","_active","visibile","_hero","_class","_level","_xp","_HP","_HPMax","_AC","abilities","attacks","support"];
	//culture, faction, threat
	sa.Faction = ["_realm","_parent","children","visible","name","type","bases","assets","units","TL","FTL","color"];
	sa.Culture = ["_realm","_parent","children","visible","name","type","bases","assets","units","TL","FTL","color"];
	sa.Threat = ["_realm","_parent","children","visible","name","type","bases","assets","units","TL","FTL","color","check"];
	//player
	sa.Player = ["_realm","_parent","children","visible","name","type","bases","assets","units","TL","FTL","color","_XP"];
*/

cpxLoadObject = function (uid,last) {
	last = typeof last === "undefined" ? false : last;

	var prepend=["realm","parent","visited","owner","isBase","attacker","area","active","hero","XP"];
	var culture = ["realm","parent","children","visible","name","type","bases","assets","units","TL","FTL","color"];
	var no={}, R={};

	localforage.getItem(uid, function(err, value) {
		R=cpxRealms[value.realm];
		no= new CPX[value.type]({load:true});	
		no.uid = value["_id"];
		no.RNG = new CPX.RNG(no.uid);
		
		if(value.type == "Culture") {
			culture.forEach(function(x) {
				if(prepend.indexOf(x)>-1) { no["_"+x] = value[x]; }
				else { no[x] = value[x]; }
			})
		}
		else {
			for (var x in value) { 
				if(x=="_id") { continue; }
			
				if(prepend.indexOf(x)>-1) { no["_"+x] = value[x]; }
				else { no[x] = value[x]; }
			}
		}

		R.db[no.uid] = no;
		if(last) { cpxLoadInitialize(R); }
	});
}

cpxLoadRealm = function (uid) {

	var R=new CPX.Realm({load:true});
	
//	cpxVar.realmSave = ["_realm","name","type","children","_player","start","tock"];
	function Load (doc) {
		R.uid = doc["_id"];
		R.RNG = new CPX.RNG(R.uid);
	
		R.name = doc.name;
		R.type = doc.type;
		
		R._realm = doc.realm;
		R.children = doc.children;
		R._player = doc.player;
		
		//load the queue
		var i=0, qn=[];
		for (i=0 ; i < doc.q.length ; i++) { 	
			qn=doc.q[i];			
			R.newQ(qn.t,qn.what,qn.ftorun,qn.options,qn.then);
		}	
		
		R.Start();	
		R.pause();	
		
		R.start= doc.start;
		R.tock = doc.tock;

		cpxRealms[R.uid]=R;

		//load the realm db
		for (i=0; i < doc.rdb.length ; i++) { 
			if(i==doc.rdb.length-1) { cpxLoadObject(doc.rdb[i].uid,true); break; }
			cpxLoadObject(doc.rdb[i].uid); 
		}

	}

	localforage.getItem(uid, function(err, value) {
		Load(value);
	});

}

$(document).on("click", "#clearDB", function(){	

	localforage.clear(function(err) {
    	// Run this code once the database has been entirely deleted.
    	console.log('Database is now empty.');
	});
	$( "#mainmenu-slideout" ).slideToggle();

/*
	new PouchDB('CPX').destroy().then(function () {
  		// database destroyed
  		cpxDB = new PouchDB('CPX');
	}).catch(function (err) {
  		// error occurred
	})
	
*/
//	location.reload();
});

$(document).on("click", "#saveRealm", function(){	
	var ruid=$("#rName").data("uid");

	cpxSaveRealm(cpxRealms[ruid]);

});

$(document).on("click", ".loadRealm", function(){	
	var ruid=$(this).data("uid");

	cpxLoadRealm(ruid);

});

///////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

