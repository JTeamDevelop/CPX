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


var wildlife=["Dire","Natural","Aberrant","Exotic","Epic","Unnatural","Organized"];
    var elements=["Fire", "Lightning", "Ice", "Water", "Wind", "Force", "Earth", "Light", "Darkness", "Nature", "Life", "Death", "Poison","Mental","Arcane"]; 


cpxVar.Terrain =["Desert","Plains","Mountains","Forest","Swamp","Water"];
cpxVar.steadOrigin=[["Ancestral Land",[0,0,2]], ["Outcasts",[0,2,0]], ["Ancient Industry",[0,0,2]], ["Rebels",[2,0,0]], ["Defensible Site",[2,0,0]], ["Religious Community",[0,2,0]], ["Ethnocentrists",[0,2,0]], ["Survivors",[2,0,0]], ["Innovators",[0,0,2]], ["Trading Hub",[0,0,2]]];
cpxVar.steadActivity=[["Councils",[0,0,0]], ["Missionary Zeal",[0,0,0]], ["Destined Conquerors",[0,0,0]], ["Mutual Defense",[0,0,0]], ["Educational Tradition",[0,0,0]], ["Production Center",[0,0,0]], ["Expert Artisans",[0,0,0]], ["Strong Society",[0,0,0]], ["Martial Tradition",[0,0,0]], ["Vigorous Trade",[0,0,0]]];
cpxVar.ruinNature=[["Abandoned Town",[0,0,0]], ["Failed Colony",[0,0,0]], ["Ancient Settlement",[0,0,0]], ["Forsaken Outpost",[0,0,0]], ["Broken Temple",[0,0,0]], ["Lost Mine",[0,0,0]], ["Crumbled Fortress",[0,0,0]], ["Plundered City",[0,0,0]], ["Dwarven Hold",[0,0,0]], ["Prehuman Ruins",[0,0,0]], ["Empty Tower",[0,0,0]], ["Shattered School",[0,0,0]]];
cpxVar.ruinTraits=[["Ancient Armory",[0,0,0]], ["Lost Techniques",[0,0,0]], ["Buried Treasure",[0,0,0]], ["Pre-Exile Relics",[0,0,0]], ["Commanding Location",[0,0,0]], ["Rich Resources",[0,0,0]], ["Forgotten Sorceries",[0,0,0]], ["Scattered Heirs",[0,0,0]], ["Glorious Dead",[0,0,0]], ["Seat of Legitimacy",[0,0,0]], ["Great Art",[0,0,0]], ["Willing Recruits",[0,0,0]]];
cpxVar.resourceType=[["Fertile Land",[0,0,0]], ["Lush Pasture",[0,0,0]], ["Good Fishing",[0,0,0]], ["Medicinal Plants",[0,0,0]], ["Good Hunting",[0,0,0]], ["Old Industry",[0,0,0]], ["Good Mine",[0,0,0]], ["Rich Gathering",[0,0,0]], ["Good Timber",[0,0,0]], ["Sorcerous Materials",[0,0,0]]];
cpxVar.Threats=["Ancient Evil", "Magical Gate", "Ancient Fort", "Malevolent Creed", "Aspiring Warlord", "Monster Nest", "Bandit Camp", "Renegade Outpost", "Cruel Vowed", "School of Dark Sorcery", "Cult Shrine", "Shou Tribe", "Cursed Earth", "Splinter Group", "Demonic Master", "Thieves' Stronghold", "Dwarven Outcasts", "Tidespawn Infestation", "Mad Wizard", "Vicious Humanoids"];

cpxVar.Trouble=["Bad Reputation", "Flooding", "Class Hatred", "Mercenary Populace", "Contaminated Land", "Monsters", "Corrupt Leadership", "Pervasive Hunger", "Crushed Spirits", "Recurrent Sickness", "Demagogue", "Riotous Thugs", "Destructive Customs", "Secret Society", "Disunity", "Shou Raiders", "Ethnic Feuding", "Tide Cult", "Exceptional Poverty", "Xenophobia"];
cpxVar.Trouble=cpxVar.Trouble.concat(["Ancient Curse", "Angry Dead", "Murderous Heirs", "Barren Surroundings", "Relic Golems", "Conquering Heirs", "Severe Damage", "Dark Wizards", "Sinister Cult", "Disputed Possession", "Taboo Land", "Exiled Lord", "Things From Below", "Inaccessible", "Tidespawn"]);
cpxVar.Trouble=cpxVar.Trouble.concat(["Bad Feng Shui", "No Workers", "Recalcitrant Locals", "Covetous Polity", "Failed Settlement", "Harsh Conditions", "Hazardous Resource", "Toxic Process", "Human Raiders", "Undeveloped", "Wasted Production"]);

cpxVar.siteAdvancements = ["Business","Defenses","Industry","Military","Militia","Religion","Research","Resources","Schools"];
cpxVar.sAdvBenefit = [[-0.125,1,-0.25],[1,-0.25,0],[0,0.5,0.5],[0.5,-0.25,-0.125],[1,-0.5,0],[0,-0.25,1],[-0.125,1,-0.25],[0,0.5,0],[0,1,-0.25]];
cpxVar.siteBuild = [[1,3],[0,2,6,7,8],[2,5]];

var hexSize=600;
var hexZHeight=1000;

var humanity=0.3;
var races={};
races.std = [];
races.fantasy = ["Elves", "Dwarves", "Gnomes", "Halfings", "Orcs", "Hobgoblins", "Ogres", "Trolls", "Lizardfolk", "Goblins", "Dark Elves", "Deep Dwarves", "Kobolds", "Merfolk", "Sahuagin", "Snake Men", "Lycantrophes", "Gnolls", "Demi-humans", "Animal Humanoids"];
races.ftsynt = ["Gargoyles", "Harpies", "Minotaurs", "Yeti", 'Giants', "Constructs", "Golems", "Elementals", "Dragons",  "Genies"]; 
races.outsider = [ "Aliens", "Outsiders", 'Abberations' ];
races.undead= ["Ghouls", "Wights", "Wraiths", "Ghosts", "Vampires", "Liches"];
races.beasts= ["Beasts", "Dinosaurs", "Giant Insects", "Giant Spiders", "Giant Bugs"]; 
races.scifi= [];

var orgs={};
orgs.std=["Refugees", "Bandits", "Pirates", "Secret Brotherhood", "Assassins", "Monks", "Foreigners", "Evil Empire", "Gang", "Cult", "Thieves", "Nobles", "Merchants", "Mob", "Royals", 'Religion', 'Mercenaries', 'Guild', 'Warriors','Watchmen', 'Warlord', 'Champions' ];
orgs.fantasy = ["Lost Civilization", "Mastermind", 'Barbarians', "Wizards","Alchemists",'Sorcerer', 'Deity', 'Artifact','Outsider'];
orgs.scifi= ["Lost Civilization", "Mastermind", 'Barbarians', 'Artifact','Outsider'];

var government=["Democracy", "Plutocracy", "Kingdom","Theocracy", "Tribalism","Technocracy", "Meritocracy","Aristocracy","Republic"];
var govneg=["Tyranny", "Anarchy"];

DangerList=[];
DangerList[0]=[["Misguided Good","To do what is 'right' no matter the cost"],["Thieves Guild","To take by subterfuge"],["Cult","To infest from within"],["Religious Organization","To establish and follow doctrine"],["Corrupt Government","To maintain the status quo"],["Cabal ","To absorb those in power, to grow"]];
DangerList[1]=[["God","To gather worshippers"],["Demon Prince","To open the gates of Hell"],["Elemental Lord","To tear down creation to its component parts"],["Force of Chaos","To destroy all semblance of order"],["Choir of Angels","To pass judgement"],["Construct of Law","To eliminate perceived disorder"]];
DangerList[2]=[["Lord of the Undead","To seek true immortality"],["Power-mad Wizard","To seek magical power"],["Sentient Artifact","To find a worthy wielder"],["Ancient Curse","To ensnare"],["Chosen One","To fulfill or resent their destiny"],["Dragon","To hoard gold and jewels, to protect the clutch"]];
DangerList[3]=[["Wandering Barbarians","To grow strong, to drive their enemies before them"],["Humanoid Vermin","To breed, to multiply and consume"],["Underground Dwellers","To defend the complex from outsiders"],["Plague of the Undead","To spread"]];
DangerList[4]=[["Abandoned Tower","To draw in the weak-willed"],["Unholy Ground","To spawn evil"],["Elemental Vortex","To grow, to tear apart reality"],["Dark Portal","To disgorge demons"],["Shadowland","To corrupt or consume the living"],["Place of Power","To be controlled or tamed"]];


cpxVar.ruinBuilder=["Aliens", "Precursors", "Demigod", "Demon", "Natural", "Religious Order", "Humanoids", "Dwarves", "Gnomes", "Elves", "Wizard", "Madman", "Monarch", "Warlord"];
cpxVar.ruinFunction=["Source", "Portal", "Mine", "Tomb", "Prison", "Lair", "Stronghold", "Temple", "Archive", "Steading", "Mystery"];
cpxVar.ruinRuination=["Arcane Disaster", "Curse","Earthquake", "Fire" , "Flood", "Plague", "Famine", "Drought", "Overrun by monsters", "War", "Invasion", "Depleted resources", "Better prospects elsewhere"];

cpxVar.faeApproaches=["Careful", "Clever", "Flashy", "Forceful", "Quick", "Sneaky"];

/*
["Name", HP, Cost, "Type", [Attack Type, Defence Type], [Damage], [Counterattack], "Special" ]
*/

cpxVar.orgAssets=[[{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{}],[{},{},{},{},{},{},{},{}]];
cpxVar.orgAssets[0][0].base=["Base of Influence", -1, -1, "Special", [], [], [], "S"]



cpxVar.orgAssets[0][1].skirmisher=["Elite Skirmishers", 5, 5, "Military Unit", [0,0], [2,4,0], [1,4,1], "P"];
cpxVar.orgAssets[0][1].hardpersonnel=["Hardened Personnel", 4, 4, "Special Forces", [], [], [1,4,1], ""];
cpxVar.orgAssets[0][1].guerilla=["Guerilla Populace", 6, 4, "Military Unit", [0,1], [1,4,1], [], ""];
cpxVar.orgAssets[0][2].zealots=["Zealots", 4, 6, "Special Forces", [0,0], [2,6,0], [2,6,0], "S"];
cpxVar.orgAssets[0][2].counterintel=["Counterintel Unit", 4, 6, "Special Forces", [1,1], [1,4,1], [1,6,0], ""];
cpxVar.orgAssets[0][3].postinfantry=["Postech Infantry", 12, 8, "Military Unit", [0,0], [1,8,0], [1,8,0], "P"];
cpxVar.orgAssets[0][4].assassins=["Psychic Assassins", 4, 12, "Special Forces", [1,1], [2,6,2], [], "S"];
cpxVar.orgAssets[0][5].preinfantry=["Pretech Infantry", 16, 20, "Military Unit", [0,0], [2,8,0], [2,8,2], "P"];
cpxVar.orgAssets[0][5].gravtank=["Gravtank Formation", 14, 25, "Military Unit", [0,0], [2,10,4], [1,10,0], "P"];
cpxVar.orgAssets[0][6].spacemarine=["Space Marines", 16, 30, "Military Unit", [0,0], [2,8,2], [2,8,0], "A"];

cpxVar.orgAssets[0][3].strikefleet=["Strike Fleet", 8, 12, "Starship", [0,0], [2,6,0], [1,8,0], "A"];
cpxVar.orgAssets[0][4].blockade=["Blockade Fleet", 8, 10, "Starship", [0, 2], [1,6,0], [], "S"];
cpxVar.orgAssets[0][7].capitalfleet=["Capital Fleet", 30, 40, "Spaceship", [0,0], [3,10,4], [3,8,0], "A, S"];


cpxVar.orgAssets[0][1].hvydrop=["Heavy Drop Assets", 6, 4, "Facility", [], [], [], "P"];
cpxVar.orgAssets[0][2].trap=["Cunning Trap", 2, 5, "Tactic", [], [], [1,6,3], ""];
cpxVar.orgAssets[0][3].landers=["Beachhead Landers", 10, 10, "Facility", [], [], [], "A"];
cpxVar.orgAssets[0][3].extendedtheater=["Extended Theater", 10, 10, "Facility", [], [], [], "A"];
cpxVar.orgAssets[0][4].logistics=["Pretech Logistics", 6, 14, "Facility", [], [], [], "A"];
cpxVar.orgAssets[0][5].planetdef=["Planetary Defenses", 20, 18, "Facility", [], [], [2,6,6], "S"];
cpxVar.orgAssets[0][6].deepstrike=["Deep Strike Landers", 10, 25, "Facility", [], [], [], "A"];
cpxVar.orgAssets[0][6].integral=["Integral Protocols", 10, 20, "Facility", [], [], [2,8,2], "S"];

cpxVar.orgAssets[1][0].smugglers=["Smugglers", 4, 2, "Starship", [1,2], [1,4,0], [], "A"];
cpxVar.orgAssets[1][0].informers=["Informers", 3, 2, "Special Forces", [1,1], [], [], "A, S"];
cpxVar.orgAssets[1][0].false=["False Front", 2, 1, "Logistics Facility", [], [], [], "S"];
cpxVar.orgAssets[1][1].lobbyists=["Lobbyists", 4, 4, "Special Forces", [1,1], [], [], "S"];
cpxVar.orgAssets[1][1].saboteurs=["Saboteurs", 6, 5, "Special Forces", [1,1], [2,4,0], [], "S"];
cpxVar.orgAssets[1][1].blackmail=["Blackmail", 4, 4, "Tactic", [1,1], [1,4,1], [], "S"];
cpxVar.orgAssets[1][1].seductress=["Seductress", 4, 4, "Special Forces", [1,1], [], [], "A, S"];
cpxVar.orgAssets[1][2].cyberninja=["Cyberninjas", 4, 6, "Special Forces", [1,1], [2,6,0], [], ""];
cpxVar.orgAssets[1][2].stealth=["Stealth", 0, 3, "Tactic", [], [], [], "S"];
cpxVar.orgAssets[1][2].shipping=["Covert Shipping", 4, 8, "Logistics Facility", [], [], [], "A, S"];
cpxVar.orgAssets[1][3].partymachine=["Party Machine", 10, 10, "Logistics Facility", [1,1], [2,6,0], [1,6,0], "S"];
cpxVar.orgAssets[1][3].vanguard=["Vanguard Cadres", 12, 8, "Military Unit", [1,1], [1,6,0], [1,6,0], ];
cpxVar.orgAssets[1][3].tripwire=["Tripwire Cells", 8, 12, "Special Forces", [], [], [1,4,0], "A, S"];
cpxVar.orgAssets[1][3].seditionists=["Seditionists", 8, 12, "Special Forces", [], [], [], "A"];
cpxVar.orgAssets[1][4].moles=["Organization Moles", 8, 10, "Tactic", [1,1], [2,6,0], [], "S"];
cpxVar.orgAssets[1][4].comms=["Cracked Comms", 6, 14, "Tactic", [], [], [], "S"];
cpxVar.orgAssets[1][4].boltholes=["Boltholes", 6, 12, "Logistics Facility", [], [], [2,6,0], "S"];
cpxVar.orgAssets[1][5].lockdown=["Transport Lockdown", 10, 20, "Tactic", [1,1], [], [], "S"];
cpxVar.orgAssets[1][5].covertnet=["Covert Transit Net", 15, 18, "Logistics Facility", [], [], [], "A"];
cpxVar.orgAssets[1][5].demagogue=["Demagogue", 10, 20, "Special Forces", [1,1], [2,8,0], [1,8,0], ""];
cpxVar.orgAssets[1][6].popular=["Popular Movement", 16, 25, "Tactic", [1,1], [2,6,0], [1,6,0], "S"];
cpxVar.orgAssets[1][6].booksecrets=["Book of Secrets", 10, 20, "Tactic", [], [], [2,8,0], "S"];
cpxVar.orgAssets[1][6].treachery=["Treachery", 5, 10, "Tactic", [1,1], [], [], "S"];
cpxVar.orgAssets[1][7].panopticon=["Panopticon Matrix", 20, 30, "Logistics Facility", [], [], [1,6,0], ""];

cpxVar.orgAssets[2][0].franchise=["Franchise", 3, 2, "Facility", [2,2], [1,4,0], [1,4,-1], "S"];
cpxVar.orgAssets[2][0].harvesters=["Harvesters", 4, 2, "Facility", [], [], [1,4,0], "A"];
cpxVar.orgAssets[2][0].investments=["Local Investments", 2, 1, "Facility", [2,2], [1,4,-1], [], "S"];
cpxVar.orgAssets[2][1].freighter=["Freighter Contract", 4, 5, "Starship", [2,2], [1,4,0], [], "A"];
cpxVar.orgAssets[2][1].lawyers=["Lawyers", 4, 6, "Special Forces", [1,2], [2,4,0], [1,6,0], "S"];
cpxVar.orgAssets[2][1].union=["Union Toughs", 6, 4, "Military Unit", [2,0], [1,4,1], [1,4,0], ""];
cpxVar.orgAssets[2][1].surveyors=["Surveyors", 4, 4, "Special Forces", [], [], [1,4,0], "A, S"];
cpxVar.orgAssets[2][2].postindustry=["Postech Industry", 4, 8, "Facility", [], [], [1,4,0], "A"];
cpxVar.orgAssets[2][2].laboratory=["Laboratory", 4, 6, "Facility", [], [], [], "S"];
cpxVar.orgAssets[2][2].mercenaries=["Mercenaries", 6, 8, "Military Unit", [2,0], [2,4,2], [1,6,0], "A, S, P"];
cpxVar.orgAssets[2][3].shipping=["Shipping Combine", 10, 10, "Facility", [], [], [1,6,0], "A"];
cpxVar.orgAssets[2][3].monopoly=["Monopoly", 12, 8, "Facility", [2,2], [1,6,0], [1,6,0], "S"];
cpxVar.orgAssets[2][3].medcenter=["Medical Center", 8, 12, "Facility", [], [], [], "S"];
cpxVar.orgAssets[2][3].bank=["Bank", 8, 12, "Facility", [], [], [], "S"];
cpxVar.orgAssets[2][4].marketers=["Marketers", 8, 10, "Tactic", [1,2], [1,6,0], [], "A"];
cpxVar.orgAssets[2][4].preresearch=["Pretech Researchers", 6, 14, "Special Forces", [], [], [], "S"];
cpxVar.orgAssets[2][4].blockrunner=["Blockade Runners", 6, 12, "Starship", [], [], [2,4,0], "A"];
cpxVar.orgAssets[2][5].venturecap=["Venture Capital", 10, 15, "Facility", [2,2], [2,6,0], [1,6,0], "A"];
cpxVar.orgAssets[2][5].randd=["R&D Department", 15, 18, "Facility", [], [], [], "S"];
cpxVar.orgAssets[2][5].commodities=["Commodities Broker", 10, 20, "Special Forces", [2,2], [2,8,0], [1,8,0], "A"];
cpxVar.orgAssets[2][6].preindustry=["Pretech Manufactory", 16, 25, "Facility", [], [], [], "S"];
cpxVar.orgAssets[2][6].takeover=["Hostile Takeover", 10, 20, "Tactic", [2,2], [2,10,0], [2,8,0], "S"];
cpxVar.orgAssets[2][6].transitweb=["Transit Web", 5, 15, "Facility", [1,1], [], [], "S"];
cpxVar.orgAssets[2][7].scavenger=["Scavenger Fleet", 20, 30, "Starship", [2,2], [2,10,4], [2,10,0], ""];

CPX.Asset=function (opts) {}