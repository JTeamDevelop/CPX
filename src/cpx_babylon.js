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

window.addEventListener('DOMContentLoaded', function(){
    // get the canvas DOM element
    var canvas = document.getElementById('renderCanvas');

    // load the 3D engine
    var engine = new BABYLON.Engine(canvas, true);

    var sphere={}
    // createScene function that creates and return the scene
    var createScene = function(){
        // create a basic BJS Scene object
        var scene = new BABYLON.Scene(engine);

        // ArcRotateCamera >> Camera turning around a 3D point (here Vector zero) with mouse and cursor keys
        // Parameters : name, alpha, beta, radius, target, scene
        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);

        // target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // attach the camera to the canvas
        camera.attachControl(canvas, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);

        // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
        sphere = new BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

        // move the sphere upward 1/2 of its height
        sphere.position.y = 1;

        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        var ground = new BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

        // return the created scene
        return scene;
    }

    // call the createScene function
    var scene = createScene();

    // run the render loop
    engine.runRenderLoop(function(){
        scene.render();
    });

    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
        engine.resize();
    });

	var canvas = document.getElementById("renderCanvas");
    var css = "button{cursor:pointer;} #textDialog{margin:6px;}";
    var guisystem = new CASTORGUI.GUIManager(canvas, css);

    var guiTexture = new CASTORGUI.GUITexture("life", "data/image.png", {w:50,h:50,x:sphere.position.x,y:sphere.position.y}, guisystem, null);

    var optionsDialog = {w: (guisystem.getCanvasWidth().width - 20), h: 100, x: 8, y: (guisystem.getCanvasWidth().height - 110)};
    var dialog = new CASTORGUI.GUIDialog("dialog", optionsDialog, guisystem);
    dialog.setVisible(true);

    var text = new CASTORGUI.GUIText("textDialog", {size:15, text:"Display text here"}, guisystem, false);
    dialog.add(text);

});