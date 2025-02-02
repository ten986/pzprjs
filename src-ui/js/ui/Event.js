// Event.js v3.4.0
/* global _doc:readonly */

//---------------------------------------------------------------------------
// ★UIEventsクラス イベント設定の管理を行う
//---------------------------------------------------------------------------
// メニュー描画/取得/html表示系
ui.event =
{
	resizetimer : null,	// resizeタイマー

	removers : [],

	//----------------------------------------------------------------------
	// event.addEvent()        addEventListener(など)を呼び出す
	//----------------------------------------------------------------------
	addEvent : function(el, event, self, callback, capt){
		this.removers.push( pzpr.util.addEvent(el, event, self, callback, !!capt) );
	},

	//----------------------------------------------------------------------
	// event.removeAllEvents() addEventで登録されたイベントを削除する
	//----------------------------------------------------------------------
	removeAllEvents : function(){
		this.removers.forEach(function(remover){ remover();});
		this.removers=[];
	},

	//---------------------------------------------------------------------------
	// event.setWindowEvents()  マウス入力、キー入力以外のイベントの設定を行う
	//---------------------------------------------------------------------------
	setWindowEvents : function(){
		// File API＋Drag&Drop APIの設定
		if(!!ui.reader){
			var DDhandler = function(e){
				ui.reader.readAsText(e.dataTransfer.files[0]);
				e.preventDefault();
				e.stopPropagation();
			};
			this.addEvent(window, 'dragover', this, function(e){ e.preventDefault();}, true);
			this.addEvent(window, 'drop', this, DDhandler, true);
		}

		// onBlurにイベントを割り当てる
		this.addEvent(_doc, 'blur', this, this.onblur_func);

		// onresizeイベントを割り当てる
		var evname = (!pzpr.env.OS.iOS ? 'resize' : 'orientationchange');
		this.addEvent(window, evname, this, this.onresize_func);

		// onbeforeunloadイベントを割り当てる
		this.addEvent(window, 'beforeunload', this, this.onbeforeunload_func);

		// onunloadイベントを割り当てる
		this.addEvent(window, 'unload', this, this.onunload_func);

		// エラー表示を消去する
		this.addEvent(document.getElementById('quesboard'), 'mousedown', this, function(e){
			ui.puzzle.errclear();
			e.stopPropagation();
		});
	},

	//---------------------------------------------------------------------------
	// event.onload_func()   ウィンドウを開いた時に呼ばれる関数
	// event.onunload_func() ウィンドウをクローズする前に呼ばれる関数
	//---------------------------------------------------------------------------
	onload_func : function(){
		ui.initFileReadMethod();

		ui.menuconfig.restore();

		ui.listener.setListeners(ui.puzzle);

		if(pzpr.env.OS.Android){
			ui.misc.modifyCSS({'body, .btn':{fontFamily:'Verdana, Arial, sans-serif'}});
		}
	},
	onunload_func : function(){
		ui.menuconfig.save();
	},

	//---------------------------------------------------------------------------
	// event.onresize_func() ウィンドウリサイズ時に呼ばれる関数
	// event.onblur_func()   ウィンドウからフォーカスが離れた時に呼ばれる関数
	// event.onbeforeunload_func()  ウィンドウをクローズする前に呼ばれる関数
	//---------------------------------------------------------------------------
	onresize_func : function(){
		if(this.resizetimer){ clearTimeout(this.resizetimer);}
		this.resizetimer = setTimeout(function(){ ui.adjustcellsize();},250);
	},
	onblur_func : function(){
		ui.puzzle.key.keyreset();
		ui.puzzle.mouse.mousereset();
	},
	onbeforeunload_func : function(e){
		if(ui.puzzle.playeronly || !ui.puzzle.ismodified()){ return;}

		var msg = ui.selectStr("盤面が更新されています", "The board is edited.");
		e.returnValue = msg;
		return msg;
	}
};
