//
// パズル固有スクリプト部 因子の部屋版 factors.js v3.2.3
//
Puzzles.factors = function(){ };
Puzzles.factors.prototype = {
	setting : function(){
		// グローバル変数の初期設定
		if(!k.qcols){ k.qcols = 9;}	// 盤面の横幅
		if(!k.qrows){ k.qrows = 9;}	// 盤面の縦幅
		k.irowake = 0;			// 0:色分け設定無し 1:色分けしない 2:色分けする

		k.iscross      = 0;		// 1:Crossが操作可能なパズル
		k.isborder     = 1;		// 1:Border/Lineが操作可能なパズル
		k.isextendcell = 0;		// 1:上・左側にセルを用意するパズル 2:四方にセルを用意するパズル

		k.isoutsidecross  = 0;	// 1:外枠上にCrossの配置があるパズル
		k.isoutsideborder = 0;	// 1:盤面の外枠上にborderのIDを用意する
		k.isLineCross     = 0;	// 1:線が交差するパズル
		k.isCenterLine    = 0;	// 1:マスの真ん中を通る線を回答として入力するパズル
		k.isborderAsLine  = 0;	// 1:境界線をlineとして扱う

		k.dispzero      = 0;	// 1:0を表示するかどうか
		k.isDispHatena  = 0;	// 1:qnumが-2のときに？を表示する
		k.isAnsNumber   = 1;	// 1:回答に数字を入力するパズル
		k.isArrowNumber = 0;	// 1:矢印つき数字を入力するパズル
		k.isOneNumber   = 1;	// 1:部屋の問題の数字が1つだけ入るパズル
		k.isDispNumUL   = 0;	// 1:数字をマス目の左上に表示するパズル(0はマスの中央)
		k.NumberWithMB  = 0;	// 1:回答の数字と○×が入るパズル

		k.BlackCell     = 0;	// 1:黒マスを入力するパズル
		k.NumberIsWhite = 0;	// 1:数字のあるマスが黒マスにならないパズル
		k.RBBlackCell   = 0;	// 1:連黒分断禁のパズル

		k.ispzprv3ONLY  = 0;	// 1:ぱずぷれv3にしかないパズル
		k.isKanpenExist = 0;	// 1:pencilbox/カンペンにあるパズル

		k.fstruct = ["borderques", "cellqnum", "cellqanssub"];

		//k.def_csize = 36;
		//k.def_psize = 24;
		//k.area = { bcell:0, wcell:0, number:0};	// areaオブジェクトで領域を生成する

		base.setTitle("因子の部屋",'Rooms of Factors');
		base.setExpression("　キーボードやマウスで数字が入力できます。",
						   " Inputting number is available by keybord or mouse");
		base.setFloatbgcolor("rgb(64, 64, 64)");
	},
	menufix : function(){
		if(k.EDITOR){ kp.defaultdisp = true;}
	},

	//---------------------------------------------------------
	//入力系関数オーバーライド
	input_init : function(){
		// マウス入力系
		mv.mousedown = function(){
			if(k.editmode) this.borderinput = this.inputborder();
			if(k.playmode){
				if(!kp.enabled()){ this.inputqnum();}
				else{ kp.display();}
			}
		};
		mv.mouseup = function(){
			if(this.notInputted()){
				if(k.editmode){
					if(!kp.enabled()){ this.inputqnum();}
					else{ kp.display();}
				}
			}
		};
		mv.mousemove = function(){
			if(k.editmode && this.btn.Left) this.inputborder();
		};

		// キーボード入力系
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum(ca);
		};

		kp.generate(0, true, true, '');
		kp.kpinput = function(ca){ kc.key_factors(ca,Math.max(k.qcols,k.qrows));};

		bd.nummaxfunc = function(cc){ return k.editmode?999999:Math.max(k.qcols,k.qrows);};
		bd.setNum = function(c,val){
			if(val==0){ return;}
			if(k.editmode){ this.sQnC(c,val);}else{ this.sQaC(c,val);}
		};
	},

	//---------------------------------------------------------
	//画像表示系関数オーバーライド
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_DLIGHT;

		pc.paint = function(x1,y1,x2,y2){
			this.flushCanvas(x1,y1,x2,y2);
		//	this.flushCanvasAll();

			this.drawBGCells(x1,y1,x2,y2);
			this.drawGrid(x1,y1,x2,y2);

			this.drawNumbers_factors(x1,y1,x2,y2);

			this.drawBorders(x1,y1,x2,y2);

			this.drawChassis(x1,y1,x2,y2);

			this.drawTCell(x1,y1,x2+1,y2+1);
		};
		pc.drawNumbers_factors = function(x1,y1,x2,y2){
			var clist = this.cellinside(x1,y1,x2,y2);
			for(var i=0;i<clist.length;i++){
				var c = clist[i], obj = bd.cell[c];

				if(bd.cell[c].qans==-1){ this.hideEL(obj.numobj);}
				else{
					var color = (bd.cell[c].error==1?this.fontErrcolor:this.fontAnscolor);
					if(!obj.numobj){ obj.numobj = this.CreateDOMAndSetNop();}
					var size = (bd.cell[c].qans<10?0.8:0.7);
					this.dispnum(obj.numobj, 1, (""+bd.cell[c].qans), size, color, obj.px, obj.py);
				}

				if(bd.cell[c].qnum==-1){ this.hideEL(obj.numobj2);}
				else{
					if(!obj.numobj2){ obj.numobj2 = this.CreateDOMAndSetNop();}
					var size = 0.45;
					if     (bd.QnC(c)>=100000){ size = 0.30;}
					else if(bd.QnC(c)>= 10000){ size = 0.36;}
					this.dispnum(obj.numobj2, 5, (""+bd.cell[c].qnum), size, this.fontcolor, obj.px, obj.py);
				}
			}
			this.vinc();
		};
	},

	//---------------------------------------------------------
	// URLエンコード/デコード処理
	encode_init : function(){
		enc.pzlimport = function(type, bstr){
			if(type==0 || type==1){
				bstr = this.decodeBorder(bstr);
				bstr = this.decodeRoomNumber16(bstr);
			}
		};
		enc.pzlexport = function(type){
			if(type==0)     { document.urloutput.ta.value = this.getURLbase()+"?"+k.puzzleid+this.pzldata();}
			else if(type==1){ document.urloutput.ta.value = this.getDocbase()+k.puzzleid+"/sa/m.html?c"+this.pzldata();}
			else if(type==3){ document.urloutput.ta.value = this.getURLbase()+"?m+"+k.puzzleid+this.pzldata();}
		};
		enc.pzldata = function(){
			return "/"+k.qcols+"/"+k.qrows+"/"+this.encodeBorder()+this.encodeRoomNumber16();
		};
	},

	//---------------------------------------------------------
	// 正解判定処理実行部
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkRowsCols() ){
				this.setAlert('同じ列に同じ数字が入っています。','There are same numbers in a row.'); return false;
			}

			if( !this.checkRoomNumber(area.getRoomInfo()) ){
				this.setAlert('ブロックの数字と数字の積が同じではありません。','A number of room is not equal to the product of these numbers.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QaC(c)==-1);}) ){
				this.setAlert('数字の入っていないマスがあります。','There is a empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(function(c){ return (bd.QaC(c)==-1);});};

		ans.checkRowsCols = function(){
			var cx, cy, result = true;

			for(var cy=0;cy<k.qrows;cy++){
				var clist = [];
				for(var cx=0;cx<k.qcols;cx++){ clist.push(bd.cnum(cx,cy));}
				if(!this.checkDifferentNumberInClist(clist)){
					if(this.inAutoCheck){ return false;}
					result = false;
				}
			}
			for(var cx=1;cx<k.qcols;cx++){
				var clist = [];
				for(var cy=0;cy<k.qrows;cy++){ clist.push(bd.cnum(cx,cy));}
				if(!this.checkDifferentNumberInClist(clist)){
					if(this.inAutoCheck){ return false;}
					result = false;
				}
			}
			return result;
		};
		ans.checkDifferentNumberInClist = function(clist){
			var d = [];
			for(var i=1;i<=Math.max(k.qcols,k.qrows);i++){ d[i]=-1;}
			for(var i=0;i<clist.length;i++){
				var val=bd.QaC(clist[i]);
				if     (val==-1){ continue;}
				else if(d[val]==-1){ d[val] = bd.QaC(clist[i]); continue;}

				for(var j=0;j<clist.length;j++){ if(bd.QaC(clist[j])==val){ bd.sErC([clist[j]],1);} }
				return false;
			}
			return true;
		};

		ans.checkRoomNumber = function(rinfo){
			var result = true;
			for(var id=1;id<=rinfo.max;id++){
				var product = 1;
				for(var i=0;i<rinfo.room[id].idlist.length;i++){
					if(bd.QaC(rinfo.room[id].idlist[i])>0){ product *= bd.QaC(rinfo.room[id].idlist[i]);}
					else{ product = 0;}
				}
				if(product==0){ continue;}

				if(product!=bd.QnC(area.getTopOfRoom(id))){
					if(this.inAutoCheck){ return false;}
					bd.sErC(rinfo.room[id].idlist,1);
					result = false;
				}
			}
			return result;
		};
	}
};
