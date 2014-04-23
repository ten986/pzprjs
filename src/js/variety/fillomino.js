//
// パズル固有スクリプト部 フィルオミノ版 fillomino.js v3.4.1
//
pzpr.classmgr.makeCustom('fillomino', {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.owner.playmode && (this.mousestart || this.mousemove)){
			if(this.btn.Left){
				if(this.isBorderMode()){ this.inputborder();}
				else                   { this.dragnumber_fillomino();}
			}
			else if(this.btn.Right){ this.inputQsubLine();}
		}

		if(this.mouseend && this.notInputted()){
			this.mouseCell = this.owner.board.emptycell;
			this.inputqnum();
		}
	},

	dragnumber_fillomino : function(){
		var cell = this.getcell();
		if(cell.isnull||cell===this.mouseCell){ return;}

		if(this.inputData===null){
			this.inputData = cell.getNum();
			if(this.inputData===-1){ this.inputData=-2;}
			this.mouseCell = cell;
			return;
		}
		else if(this.inputData===-2){
			this.inputData=(cell.getNum()===-1?-3:-1);
		}

		if(this.inputData>=-1){
			cell.setAnum(this.inputData);
			cell.draw();
		}
		else if(this.inputData<=-3){
			var cell2 = this.mouseCell;
			var border = this.owner.board.getb(((cell.bx+cell2.bx)>>1), ((cell.by+cell2.by)>>1));
			if(this.inputData===-3){ this.inputData=(border.getQsub()===1?-5:-4);}
			if(!border.isnull){
				border.setQsub(this.inputData===-4?1:0);
				border.draw();
			}
		}
		this.mouseCell = cell;
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true,
	enableplay : true,
	moveTarget : function(ca){
		if(this.owner.playmode && (this.isCTRL || this.isX || this.isZ)){
			return this.move_fillomino(ca);
		}
		return this.moveTCell(ca);
	},

	move_fillomino : function(ca){
		var cell = this.cursor.getTCC();
		if(cell.isnull){ return false;}

		var adc=cell.adjacent, adb=cell.adjborder;
		var nc, nb, dir=cell.NDIR;
		switch(ca){
			case this.KEYUP: nc=adc.top;    nb=adb.top;    dir=cell.UP; break;
			case this.KEYDN: nc=adc.bottom; nb=adb.bottom; dir=cell.DN; break;
			case this.KEYLT: nc=adc.left;   nb=adb.left;   dir=cell.LT; break;
			case this.KEYRT: nc=adc.right;  nb=adb.right;  dir=cell.RT; break;
			default: return false;
		}
		if(!nc.isnull){
			var isMoved = (this.isCTRL || this.isX || this.isZ);
			if(!isMoved){ return false;}

			if(this.isCTRL)  { if(!nb.isnull){ nb.setQsub((nb.getQsub()===0)?1:0); this.cursor.pos.movedir(dir,2);}}
			else if(this.isZ){ if(!nb.isnull){ nb.setQans((!nb.isBorder()?1:0));                                  }}
			else if(this.isX){ if(!nc.isnull){ nc.setAnum(cell.getNum());          this.cursor.pos.movedir(dir,2);}}

			cell.draw();
			this.stopEvent();	/* カーソルを移動させない */
			return true;
		}
		return false;
	}
},

//---------------------------------------------------------
// 盤面管理系
Board:{
	hasborder : 1
},

AreaRoomManager:{
	enabled : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	initialize : function(){
		this.Common.prototype.initialize.call(this);

		this.gridcolor = this.gridcolor_DLIGHT;
		this.setBorderColorFunc('qans');
	},
	paint : function(){
		this.drawBGCells();
		this.drawDashedGrid();

		this.drawNumbers();

		this.drawBorders();
		this.drawBorderQsubs();

		this.drawChassis();

		this.drawCursor();
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
		this.owner.fio.decodeCellQnum_kanpen();
	},
	encodeKanpen : function(){
		this.owner.fio.encodeCellQnum_kanpen();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellQnum();
		this.decodeCellAnumsub();
		this.decodeBorderAns();
	},
	encodeData : function(){
		this.encodeCellQnum();
		this.encodeCellAnumsub();
		this.encodeBorderAns();
	},

	kanpenOpen : function(){
		this.decodeCellQnum_kanpen();
		this.decodeCellAnum_kanpen();

		// 境界線を自動入力
		var bd = this.owner.board;
		for(var id=0;id<bd.bdmax;id++){
			var border = bd.border[id], cell1 = border.sidecell[0], cell2 = border.sidecell[1];
			border.qans = 0;
			if(!cell1.isnull && !cell2.isnull){
				var qa1 = cell1.getNum(), qa2 = cell2.getNum();
				if(qa1!==-1 && qa2!==-1 && qa1!==qa2){ border.qans = 1;}
			}
		}
	},
	kanpenSave : function(){
		this.encodeCellQnum_kanpen();
		this.encodeCellAnum_kanpen();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checkAns : function(){

		var rinfo = this.getErrorFlag_cell();
		if( !this.checkErrorFlag_cell(rinfo, 3) ){ return 'bkNoNum';}

		if( !this.checkErrorFlag_cell(rinfo, 1) || !this.checkAreaSize(rinfo, 2) ){ return 'bkSizeLt';}

		if( !this.checkSideAreaNumberSize(rinfo) ){ return 'sbSameNum';}

		if( !this.checkErrorFlag_cell(rinfo, 2) || !this.checkAreaSize(rinfo, 1) ){ return 'bkSizeGt';}

		if( !this.checkErrorFlag_cell(rinfo, 4) ){ return 'bkPlNum';}

		if( !this.owner.getConfig('enbnonum') && !this.checkNoNumCell() ){ return 'ceEmpty';}

		return null;
	},
	check1st : function(){
		return ((this.owner.getConfig('enbnonum') || this.checkNoNumCell()) ? null : 'ceEmpty');
	},

	checkSideAreaNumberSize : function(rinfo){
		return this.checkSideAreaSize(rinfo, function(room){ return room.number;});
	},
	checkAreaSize : function(rinfo, flag){
		var result = true;
		for(var id=1;id<=rinfo.max;id++){
			var room = rinfo.room[id];
			if(room.error===-1||room.number<=0){ continue;}
			if     (flag===1 && room.number<room.clist.length){
				if(this.checkOnly){ return false;}
				rinfo.room[id].clist.seterr(1);
				result = false;
			}
			else if(flag===2 && room.number>room.clist.length){
				if(this.checkOnly){ return false;}
				rinfo.room[id].clist.seterr(1);
				result = false;
			}
		}
		return result;
	},

	getErrorFlag_cell : function(){
		var rinfo = this.owner.board.getRoomInfo();
		for(var id=1,max=rinfo.max;id<=max;id++){
			var room = rinfo.room[id], clist = room.clist;
			room.error  =  0;
			room.number = -1;
			var nums = [];
			var emptycell=0, numcnt=0, filled=0;
			for(var i=0;i<clist.length;i++){
				var num = clist[i].getNum();
				if(num==-1){ emptycell++;}
				else if(isNaN(nums[num])){ numcnt++; filled=num; nums[num]=1;}
				else{ nums[num]++;}
			}

			if(numcnt>1 && emptycell>0){ room.error=4;}
			else if(numcnt===0)        { room.error=3;}
			else if(numcnt===1 && filled < nums[filled]+emptycell){ room.error=2;  room.number=filled;}
			else if(numcnt===1 && filled > nums[filled]+emptycell){ room.error=1;  room.number=filled;}
			else if(numcnt===1)                                   { room.error=-1; room.number=filled;}
			else{
				// ここまで来るのはemptycellが0で2種類以上の数字が入っている領域のみ
				// -> それぞれに別の領域idを割り当てて判定できるようにする
				for(var i=0;i<clist.length;i++){ rinfo.id[clist[i].id] = 0;}
				for(var i=0;i<clist.length;i++){
					if(rinfo.getRoomID(clist[i])!==0){ continue;}
					max++;
					rinfo.addRoom();
					this.setNewID(rinfo, clist[i]);
				}
				// 最後に自分の情報を無効にする
				rinfo.room[id] = {idlist:[], error:0, number:-1};
			}
		}
		return rinfo;
	},
	setNewID : function(rinfo, cell0){
		var stack=[cell0];
		while(stack.length>0){
			var cell=stack.pop();
			if(!rinfo.emptyCell(cell)){ continue;}
			rinfo.addCell(cell);
			var list = cell.getdir4clist();
			for(var i=0;i<list.length;i++){
				if(cell.sameNumber(list[i][0])){ stack.push(list[i][0]);}
			}
		}
	}
},

FailCode:{
	sbSameNum : ["同じ数字のブロックが辺を共有しています。","Adjacent blocks have the same number."],
	ceEmpty : ["数字の入っていないマスがあります。","There is an empty cell."]
}
});