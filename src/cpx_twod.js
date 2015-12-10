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

var rect;
var graphics;

CPX.twoDGraph = function (game,x,y,width,height,steps) {
    
    var bounds = new Phaser.Rectangle(x,y,width,height);
    
    var graph= cpxTwoD.add.graphics(0, 0);
    graph.lineStyle(1, 0X00000, 0.5)
    graph.drawRect(x,y,width,height);
    
    for (var i=0;i<steps;i++) { graph.drawRect(x+i*width/steps,y+0,width/steps,height); }
    for (var i=0;i<steps;i++) { graph.drawRect(x+0,y+i*width/steps,width,height/steps); }
   
/*    graphics.inputEnabled = true;
    graphics.input.pixelPerfectClick = true;
    graphics.events.onInputDown.add(clicked, this);
*/
}

CPX.twoDSystem = function (game,system,x,y,color) {


}

function clicked(sprite) {

    text.text = 'You clicked ' + sprite.frameName;

}

var cpxTwoD = new Phaser.Game(1000, 750, Phaser.AUTO, 'cpxcanvas', { preload: cpxTwoDPreload, create: cpxTwoDCreate, update: cpxTwoDUpdate, render: cpxTwoDRender });

function cpxTwoDPreload() {
    cpxTwoD.load.image('star_white', 'images/white.png');    
    cpxTwoD.load.image('circle', 'images/symbols-shapes-circle-256.png');
}

function cpxTwoDCreate() {

    
    cpxTwoD.stage.backgroundColor = '#c0c0c0';

}

function cpxTwoDUpdate() {

//    rectA.x = cpxTwoD.input.activePointer.x;
//    rectA.y = cpxTwoD.input.activePointer.y;

}

function cpxTwoDRender() {


}