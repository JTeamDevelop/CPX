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
function sectorView() {

//	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var container;
	var camera, scene, renderer;
	var plane, cube;
	var mouse, raycaster, isShiftDown = false;

	var rollOverMesh, rollOverMaterial;
	var cubeGeo, cubeMaterial;

	var objects = [];
	var clock = new THREE.Clock();

	var sector=cpxSectors[$("#sectorInfo").data("uid")];

	init();
	render();

	function init() {

		container = $("#starscape")

		camera = new THREE.PerspectiveCamera( 45, container.width() / container.height(), 1, 10000 );
		camera.position.set( 500, 800, 1300 );
		camera.lookAt( new THREE.Vector3() );

		scene = new THREE.Scene();

		// roll-over helpers

//		rollOverGeo = new THREE.BoxGeometry( 50, 50, 50 );
//		rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
//		rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
//		scene.add( rollOverMesh );

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

		var line = new THREE.Line( geometry, material, THREE.LinePieces );
		scene.add( line );

		//

		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();

		var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		plane = new THREE.Mesh( geometry );
		plane.visible = false;
		scene.add( plane );

		objects.push( plane );

		// Lights

		var ambientLight = new THREE.AmbientLight( 0x606060 );
		scene.add( ambientLight );

		var directionalLight = new THREE.DirectionalLight( 0xffffff );
		directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
		scene.add( directionalLight );

		initStars();

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setClearColor( 0xf0f0f0 );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.width(), container.height() );

		$("#starscape").append( renderer.domElement );

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'keydown', onDocumentKeyDown, false );
		document.addEventListener( 'keyup', onDocumentKeyUp, false );

		//

		window.addEventListener( 'resize', onWindowResize, false );

		console.log(scene)

	}

	function initStars() {

		var sphere = new THREE.SphereGeometry( 5, 16, 8 );
		var light;

		sector.systems.forEach(function(s){ 
			var cs=cpxSystems[s]; 
			light = new THREE.PointLight( 0xff0040, 2, 50 );
			light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
			light.position.set(cs.coord[0],cs.coord[1],cs.coord[2]);
			light.name=s;
			scene.add( light );
		});
	}

	function removeEntity(object) {
    	var selectedObject = scene.getObjectByName(object.name);
    	scene.remove( selectedObject );
	}

	function onWindowResize() {

		camera.aspect = container.width() / container.height();
		camera.updateProjectionMatrix();

		renderer.setSize( container.width(), container.height() );

	}

	function onDocumentMouseMove( event ) {

		var offset = $("#starscape").offset();

		event.preventDefault();

		mouse.set( ( (event.clientX- offset.left) / container.width() ) * 2 - 1, - ( (event.clientY-offset.top) / container.height() ) * 2 + 1 );

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects( objects );

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

//			rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal );
//			rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );

		}

		render();

	}

	function onDocumentMouseDown( event ) {

		event.preventDefault();

		mouse.set( ( event.clientX / container.width() ) * 2 - 1, - ( event.clientY / container.height() ) * 2 + 1 );

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects( objects );

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			render();

		}

	}

	function onDocumentKeyDown( event ) {

		switch( event.keyCode ) {

			case 16: isShiftDown = true; break;

		}

	}

	function onDocumentKeyUp( event ) {

		switch ( event.keyCode ) {

			case 16: isShiftDown = false; break;

		}

	}

	function render() {



		renderer.render( scene, camera );

	}
}