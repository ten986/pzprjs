//
// パズル固有スクリプト部 黒マスはどこだ版 kurodoko.js
//
(function(pidlist, classbase){
	if(typeof module==='object' && module.exports){module.exports = [pidlist, classbase];}
	else{ pzpr.classmgr.makeCustom(pidlist, classbase);}
}(
['kurodoko','nurimisaki'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	use    : true,
	mouseinput_auto : function(){
		if(this.puzzle.playmode){
			if(this.mousestart || this.mousemove){ this.inputcell();}
		}
		else if(this.puzzle.editmode){
			if(this.mousestart){ this.inputqnum();}
		}
	}
},
"MouseEvent@kurodoko":{
	inputModes : {edit:['number','clear','info-blk'],play:['shade','unshade','info-blk']},
	RBShadeCell : true
},
"MouseEvent@nurimisaki":{
	inputModes: { edit: ['number', 'misaki-circle', 'clear', 'info-ublk'], play: ['shade', 'unshade', 'info-ublk'] },
	mouseinput_other : function(){
		if(this.inputMode==='misaki-circle'){ this.inputMisaki();}
	},
	inputMisaki: function () {
		var cell = this.getcell();
		var num = 2;
			if(cell.isnull || cell===this.mouseCell){ return;}
	
		if (cell !== this.cursor.getc()) {
			this.setcursor(cell);
		} else {
			var val = cell.qnum2;
			if (this.inputData === null || 1 === 1) { this.inputData = (val === num ? -1 : num); }
			if (val !== num || this.inputData === -1) {
				cell.setQnum2(this.inputData);
				cell.draw();
			}
		}
		this.mouseCell = cell;
		// var cell = this.getcell();
		// if(cell.isnull || cell===this.mouseCell){ return;}

		// if(this.cursor.modesnum && this.puzzle.playmode && !this.cursor.checksnum(this.inputPoint) && cell.noNum()){
		// 	this.setcursorsnum(cell);
		// }
		// else if(cell!==this.cursor.getc()){
		// 	this.setcursor(cell);
		// }
		// else{
		// 	this.inputqnum_main(cell);
		// }
		// this.mouseCell = cell;
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	numberRemainsUnshaded : true,

	maxnum : function(){
		return this.board.cols+this.board.rows-1;
	},
	minnum : 2
},
"Cell@nurimisaki":{
	qansUnshade: true
},
Board:{
	cols : 9,
	rows : 9
},

AreaUnshadeGraph:{
	enabled : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	hideHatena : true,

	gridcolor_type : "DLIGHT",

	enablebcolor : true,
	bgcellcolor_func : "qsub1",
	numbercolor_func : "qnum",

	circleratio : [0.45, 0.40],

	paint : function(){
		this.drawBGCells();
		this.drawShadedCells();
		this.drawGrid();

		// this.drawCircledNumbers();
		this.drawCircles();
		this.drawQuesNumbers();
		if(this.pid==='nurimisaki'){ this.drawDotCells();}

		this.drawChassis();

		this.drawTarget();
	}
},
"Graphic@nurimisaki":{
	undefcolor : "silver",
	trialcolor: "rgb(120, 120, 120)",

	getBGCellColor : function(cell){
		if(!cell.isUnshade()){ return null;}
		var undef = this.puzzle.execConfig('undefcell');
		var info = cell.error || cell.qinfo;
		if     (info===1){ return this.errbcolor1;}
		else if(info===2){ return this.errbcolor2;}
		return undef?null:this.qsubcolor1;
	},
	getShadedCellColor : function(cell){
		if(!cell.isShade()){ return null;}
		var undef = this.puzzle.execConfig('undefcell');
		var info = cell.error || cell.qinfo;
		if     (info===1){ return this.errcolor1;}
		else if(info===2){ return this.errcolor2;}
		else if(cell.qsub===1){
			return cell.trial?this.trialcolor:this.shadecolor;
		}
		else if(undef){ return this.undefcolor; }
		return null;
	},
	drawDotCells : function(){
		var undef = this.puzzle.execConfig('undefcell');
		var g = this.vinc('cell_dot', 'auto', true);

		var dsize = Math.max(this.cw*0.06, 2);
		var clist = this.range.cells;
		for(var i=0;i<clist.length;i++){
			var cell = clist[i];

			g.vid = "c_dot_"+cell.id;
			if(cell.isUnshade()&&cell.qnum===-1&&!undef){
				g.fillStyle = (!cell.trial ? this.qanscolor : this.trialcolor);
				g.fillCircle(cell.bx*this.bw, cell.by*this.bh, dsize);
			}
			else{ g.vhide();}
		}
	},
	getCircleStrokeColor : function(cell){
		// if(cell.qnum2===2 || cell.anum===2){
		// 	if(cell.error===1){ return this.errcolor1;}
		// 	else if(cell.qnum===2){ return this.quescolor;}
		// 	else if(cell.trial){ return this.trialcolor;}
		// 	else if(this.puzzle.editmode && !this.puzzle.execConfig('dispqnumbg')){ return "silver";}
		// 	else{ return this.quescolor;}
		// }
		// else if(cell.qnum2===1 && this.puzzle.execConfig('dispqnumbg') && cell.error===0){
		// 	return 'white';
		// }
		if (cell.qnum2 === 2) {
			return 'black';
		}
		return null;
	},
	getCircleFillColor : function(cell){
		// if(cell.qnum2===2 || cell.anum===2){
		// 	if(cell.error===1){ return this.errcolor1;}
		// 	else if(cell.qnum===2){ return this.quescolor;}
		// 	else if(cell.trial){ return this.trialcolor;}
		// 	else if(this.puzzle.editmode && !this.puzzle.execConfig('dispqnumbg')){ return "silver";}
		// 	else{ return this.quescolor;}
		// }
		// else if(cell.qnum2===1 && this.puzzle.execConfig('dispqnumbg') && cell.error===0){
		// 	return 'white';
		// }
		if (cell.qnum2 === 2) {
			return 'white';
		}
		return null;
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeNumber16();
	},
	encodePzpr : function(type){
		this.encodeNumber16();
	},

	decodeKanpen : function(){
		this.fio.decodeCellQnum_kanpen();
	},
	encodeKanpen : function(){
		this.fio.encodeCellQnum_kanpen();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellQnum();
		this.decodeCellAns();
	},
	encodeData : function(){
		this.encodeCellQnum();
		this.encodeCellAns();
	},

	kanpenOpen : function(){
		this.decodeCellQnumAns_kanpen();
	},
	kanpenSave : function(){
		this.encodeCellQnumAns_kanpen();
	},

	kanpenOpenXML : function(){
		this.decodeCellQnum_XMLBoard();
		this.decodeCellAns_XMLAnswer();
	},
	kanpenSaveXML : function(){
		this.encodeCellQnum_XMLBoard();
		this.encodeCellAns_kurodoko_XMLAnswer();
	},

	UNDECIDED_NUM_XML : -4,

	encodeCellAns_kurodoko_XMLAnswer : function(){
		this.encodeCellXMLArow(function(cell){
			if(cell.qnum===-1){
				if     (cell.qans===1){ return 'w';}
				else if(cell.qsub===1){ return 's';}
			}
			return 'u';
		});
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkShadeCellExist",
		"checkNumUnshade@nurimisaki",
		"check2x2ShadeCell@nurimisaki",
		"checkAdjacentShadeCell@kurodoko",
		"checkConnectUnshadeRB@kurodoko",
		"checkConnectUnshade@nurimisaki",
		"checkViewOfNumber",
		"check2x2UnshadeCell@nurimisaki",
		"checkCirclePromontory@nurimisaki",
		"checkNonCircleNotPromontory@nurimisaki"
	],

	checkViewOfNumber : function(){
		var boardcell = this.board.cell;
		for(var cc=0;cc<boardcell.length;cc++){
			var cell = boardcell[cc];
			if(!cell.isValidNum()){ continue;}

			var clist = new this.klass.CellList(), adc = cell.adjacent, target;
			clist.add(cell);
			target=adc.left;   while(target.isUnshade()){ clist.add(target); target=target.adjacent.left;  }
			target=adc.right;  while(target.isUnshade()){ clist.add(target); target=target.adjacent.right; }
			target=adc.top;    while(target.isUnshade()){ clist.add(target); target=target.adjacent.top;   }
			target=adc.bottom; while(target.isUnshade()){ clist.add(target); target=target.adjacent.bottom;}
			if(cell.qnum===clist.length){ continue;}

			this.failcode.add("nmSumViewNe");
			if(this.checkOnly){ break;}
			clist.seterr(1);
		}
	}
},

"AnsCheck@nurimisaki":{
	checkNumUnshade : function(){
		this.checkAllCell(function(cell){ return cell.isNum()&&!cell.isUnshade();}, "nmShade");
	},

	check2x2UnshadeCell : function(){
		this.check2x2Block(function(cell){ return cell.isUnshade();}, "cu2x2");
	},

	checkCirclePromontory : function(){
		var self = this;
		this.checkAllCell(function(cell){ return (cell.qnum2===2 && !self.isPromontory(cell));}, "circleNotPromontory");
	},

	checkNonCircleNotPromontory : function(){
		var self = this;
		this.checkAllCell(function(cell){ return (cell.qnum2!==2 && cell.isUnshade() && self.isPromontory(cell));}, "nonCirclePromontory");
	},

	isPromontory : function(cell){
		var countUnshade = 0;
		if(cell.adjacent.left.isUnshade()){countUnshade++;}
		if(cell.adjacent.right.isUnshade()){countUnshade++;}
		if(cell.adjacent.top.isUnshade()){countUnshade++;}
		if(cell.adjacent.bottom.isUnshade()){countUnshade++;}
		return countUnshade===1;
	}
},

FailCode:{
	nmShade : ["(please translate) A clue is not unshaded.", "A clue is not unshaded."],
	nmSumViewNe : ["数字と黒マスにぶつかるまでの4方向のマスの合計が違います。","The number and the sum of the continuous unshaded cells of four direction is different."],
	cu2x2 : ["2x2の白マスのかたまりがあります。","There is a 2x2 block of unshaded cells."],
	circleNotPromontory : ["丸のマスが岬になっていません。","A circle has more than one unshaded neighbor."],
	nonCirclePromontory : ["丸のないマスが岬になっています。","An unshaded uncircled cells has only one unshaded neighbor."]
}
}));
