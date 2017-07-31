'use strict';

(function(){

	// Initialization of variables:
	var canvas = document.querySelector('#canvas'),
		 ctx = canvas.getContext('2d'),
		 selectColor = document.querySelector('#line-color'),
		 selectWidth = document.querySelector('#line-width'),
		 colorLine = selectColor.value,
		 widthLine = selectWidth.value,
		 clearCanvas = document.querySelector('#clear-canvas'),
		 undoStep = document.querySelector('.undo'),
		 redoStep = document.querySelector('.redo');

	// Save history:
	var history = {
		redoList: [],
		undoList: [],
		saveState: function(canvas, list, keep_redo) {
			keep_redo = keep_redo || false;
			if(!keep_redo) {
				this.redoList = [];
			}
			(list || this.undoList).push(canvas.toDataURL());
		},
		undo: function(canvas, ctx) {
			this.restoreState(canvas, ctx, this.undoList, this.redoList);
		},
		redo: function(canvas, ctx) {
			this.restoreState(canvas, ctx, this.redoList, this.undoList);
		},
		restoreState: function(canvas, ctx, pop, push) {
			if(pop.length) {
				this.saveState(canvas, push, true);
				var restore_state = pop.pop();
				var img = new Image();
				img.src = restore_state;
				img.onload = function() {
					canvas.width = canvas.width; 
					ctx.drawImage(img, 0, 0, 960, 500);
				}
			}
		}
	};

	// Redo/undo buttons init:
	redoStep.onclick = function(e){
		history.redo(canvas, ctx);
	}

	undoStep.onclick = function(e){
		history.undo(canvas, ctx);
	}

	//Save in localStorage:
	if (localStorage.saveImage) {
		var img = new Image();
		img.src = localStorage.saveImage;
		img.onload = function() {
			canvas.width = canvas.width; 
			ctx.drawImage(img, 0, 0, 960, 500);
		}
	}

	// Change width: 
	selectWidth.onchange = function(){
		widthLine = this.value;
	}

	// Change color: 
	selectColor.onchange = function(){
		colorLine = this.value;
	}

	canvas.onmousedown = function(event){
		var x = event.offsetX,
			 y = event.offsetY;
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineWidth = widthLine;
		ctx.moveTo(x,y);
		history.saveState(canvas);
		localStorage.saveImage = canvas.toDataURL();

		canvas.onmousemove = function(event){
			var x = event.offsetX,
				 y = event.offsetY;
			ctx.lineTo(x,y);
			ctx.strokeStyle = colorLine;
			ctx.stroke();
		};
	};

	canvas.onclick = function(event){
		var x = event.offsetX,
			 y = event.offsetY;
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x,y);
		ctx.strokeStyle = colorLine;
		ctx.stroke();
	};

	// Cancel onmousedown:
	canvas.onmouseup = function(){
		localStorage.saveImage = canvas.toDataURL();
		canvas.onmousemove = null;
	}

	// Cancel onmousedown:
	canvas.onmouseleave = function(){
		localStorage.saveImage = canvas.toDataURL();
		canvas.onmousemove = null;
	}

	// Clearing canvas:
	clearCanvas.onclick = function(){ 
		canvas.width = canvas.width;
		localStorage.saveImage = canvas.toDataURL();
		history.undoList = [];
		history.redoList = [];
	}

})();

