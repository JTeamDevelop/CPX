if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var scene, mainmouse;

HexStart(); 
function HexStart () 
{
	// setup the thing
	scene = new Scene({
		element: document.getElementById('cpxcanvas'),
		cameraPosition: {x:0, y:150, z:150}
	}, true);
	
	var grid = new HexGrid({
		rings: 4,
		cellSize: 10,
		cellDepth: 2,
		cellScale: 0.95,
		extrudeSettings: {
			// options passed directly to: http://threejs.org/docs/#Reference/Extras.Geometries/ExtrudeGeometry
			// but don't use amount, instead use cellDepth
		}
	});
	/*var grid = new SquareGrid({
		width: 8,
		height: 8,
		cellSize: 15,
		cellScale: 0.95
		// same extrudeSettings as Hex
	});*/
	
	mainmouse = new MouseCaster(scene.container, scene.camera);
	var selector = new SelectionManager(mainmouse);

/*
	var board = new Board(grid);
	scene.add(board.group);
	scene.focusOn(board.group);
	
	// populate the board
	var i, sprites = [];
	var spriteConfig = {
		container: board.group,
		url: '../examples/img/water.png',
		scale: 10,
		offsetY: 6
	};
	
	for (i = 0; i < 5; i++) {
		sprites[i] = new Sprite(spriteConfig);
		sprites[i].activate(Tools.randomInt(100), Tools.randomInt(grid.extrudeSettings.amount + 15, 40), Tools.randomInt(100));
	}
	
	// keep track of states
	var currentPiece = 0;
	var movingPiece = null;
*/
	
	// handle interaction
	selector.onSelect.add(function(obj) {
		if (obj.type == "System") {
			scene.add(obj._ThreeD[4]);
		}
		else if (obj.objectType === Board.Cell) {
			// select the sprite if one was already there
			var e = obj.entity;
			if (e) {
				selector.select(e, false); // don't fire the signal when firing manually or you'll cause a stack overflow with recursion
				movingPiece = e; // new move
			}
			else {
				if (movingPiece) {
					moveEntityToCell(obj);
					return;
				}
				// cycle through the sprites, placing them on the clicked cell
				var p = sprites[currentPiece++];
				if (currentPiece === sprites.length) {
					currentPiece = 0;
				}
				board.placeEntityAtCell(p, obj);
			}
		}
		else {
			movingPiece = obj;
		}
	}, this);
	
	selector.onDeselect.add(function(obj) {
		if (obj.type == "System") {
			scene.remove(obj._ThreeD[4]);
		}
	}, this);
	
	function moveEntityToCell(cell) {
		board.placeEntityAtCell(movingPiece, cell);
		movingPiece = null;
	}
	
	// start the thing
	update();
	function update() {
		mainmouse.update();
		scene.render();
		requestAnimationFrame(update);
	}
}

CPX.ThreeD = function (realm) {
    this.realm = realm;
}
CPX.ThreeD.prototype.clearScene = function () {
	scene.container.children.forEach(function(o){
		scene.remove(o);
	});
}
CPX.ThreeD.prototype.addStar = function (star) {

/*
	var geometry = new THREE.SphereGeometry(15, 15, 15 );
	var material = new THREE.MeshBasicMaterial( { map: map, color: 0x0040ff, opacity: 0.5 } );
	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
*/
	scene.add( star._ThreeD[0] );

}
CPX.ThreeD.prototype.drawGrid = function () {
	// grid
	var size = 500, step = 50;
	var geometry = new THREE.Geometry();

	for ( var i = - size; i <= size; i += step ) {
		geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
		geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

		geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
		geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

	}

	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2, transparent: true } );

	var line = new THREE.LineSegments( geometry, material );
	scene.add( line );

	//

	var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
	geometry.rotateX( - Math.PI / 2 );

	var plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
	scene.add( plane );

	var objects=[];
	objects.push( plane );

	//Lighting
	var ambientLight = new THREE.AmbientLight( 0x606060 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff );
	directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
	scene.add( directionalLight );	
}
