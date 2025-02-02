// Listener.js v3.4.1

//---------------------------------------------------------------------------
// ★UIListener Puzzleに付加するListenerイベント設定の管理を行う
//  注意：execListenerで呼び出される関数は、thisがui.listenerになっていません
//---------------------------------------------------------------------------
ui.listener =
{
	//---------------------------------------------------------------------------
	// listener.setListeners()  PuzzleのListenerを登録する
	//---------------------------------------------------------------------------
	setListeners : function(puzzle){
		puzzle.once('ready',  this.onFirstReady);
		puzzle.on('ready',    this.onReady);

		puzzle.on('key',      this.onKeyInput);
		puzzle.on('mouse',    this.onMouseInput);
		puzzle.on('history',  this.onHistoryChange);
		puzzle.on('trial',    this.onTrialModeChange);
		puzzle.on('mode',     this.onModeChange);

		puzzle.on('adjust',     this.onAdjust);
		puzzle.on('resize',     this.onResize);
	},

	//---------------------------------------------------------------------------
	// listener.onFirstReady() 初回のパズル読み込み完了時に呼び出される関数
	// listener.onReady()  パズル読み込み完了時に呼び出される関数
	//---------------------------------------------------------------------------
	onFirstReady : function(puzzle){
		ui.initImageSaveMethod(puzzle);
	},
	onReady : function(puzzle){
		/* パズルの種類が同じならMenuArea等の再設定は行わない */
		if(ui.currentpid !== puzzle.pid){
			/* 以前設定済みのイベントを削除する */
			ui.event.removeAllEvents();

			/* menuareaより先に キーポップアップを作成する必要がある */
			ui.keypopup.create();

			/* メニュー用の設定を消去・再設定する */
			ui.menuarea.reset();
			ui.toolarea.reset();
			ui.popupmgr.reset();
			ui.notify.reset();
			ui.misc.displayDesign();

			/* Windowへのイベント設定 */
			ui.event.setWindowEvents();
		}

		ui.menuconfig.sync();
		ui.menuconfig.set('autocheck_once', ui.menuconfig.get('autocheck'));
		ui.currentpid = puzzle.pid;

		ui.adjustcellsize();
		ui.keypopup.display();

		ui.timer.reset();					/* タイマーリセット(最後) */
	},

	//---------------------------------------------------------------------------
	// listener.onKeyInput()    キー入力時に呼び出される関数 (return false = 処理をキャンセル)
	// listener.onMouseInput()  盤面へのマウス入力時に呼び出される関数 (return false = 処理をキャンセル)
	//---------------------------------------------------------------------------
	onKeyInput : function(puzzle, c){
		var kc = puzzle.key, ut = ui.undotimer, result = true;
		if(kc.keydown){
			/* TimerでUndo/Redoする */
			if(c==='ctrl+z' || c==='meta+z'){ ut.startKeyUndo(); result = false;}
			if(c==='ctrl+y' || c==='meta+y'){ ut.startKeyRedo(); result = false;}

			/* F2で回答モード Shift+F2で問題作成モード */
			if(!puzzle.playeronly){
				if     (puzzle.editmode && c==='F2'      ){ ui.menuconfig.set("mode", puzzle.MODE_PLAYER); result = false;}
				else if(puzzle.playmode && c==='shift+F2'){ ui.menuconfig.set("mode", puzzle.MODE_EDITOR); result = false;}
			}
		}
		else if(kc.keyup){
			/* TimerのUndo/Redoを停止する */
			if(c==='ctrl+z' || c==='meta+z'){ ut.stopKeyUndo(); result = false;}
			if(c==='ctrl+y' || c==='meta+y'){ ut.stopKeyRedo(); result = false;}
		}

		if(!kc.isCTRL && !kc.isMETA){ ut.reset();}
		else if(!kc.isZ){ ut.stopKeyUndo();}
		else if(!kc.isY){ ut.stopKeyRedo();}

		kc.cancelEvent = !result;
	},
	onMouseInput : function(puzzle){
		var mv = puzzle.mouse, result = true;
		if(mv.mousestart && mv.btn==='middle'){ /* 中ボタン */
			ui.menuconfig.set('mode', puzzle.playmode ? 'edit' : 'play');
			mv.mousereset();
			result = false;
		}
		else if(ui.puzzle.pid === "goishi"){
			if(mv.mousestart && ui.puzzle.playmode){
				if(mv.btn==='left'){
					var cell = mv.getcell();
					if(cell.isnull || !cell.isStone() || cell.anum!==-1){
						ui.undotimer.startAnswerRedo();
						result = false;
					}
				}
				else if(mv.btn==='right'){
					ui.undotimer.startAnswerUndo();
					result = false;
				}
			}
			else if(mv.mouseend){
				ui.undotimer.stop();
				result = false;
			}
		}

		mv.cancelEvent = !result;
	},

	//---------------------------------------------------------------------------
	// listener.onHistoryChange() 履歴変更時に呼び出される関数
	// listener.onTrialModeChange() 仮置きモード変更時に呼び出される関数
	// listener.onModeChange()      Mode変更時に呼び出される関数
	//---------------------------------------------------------------------------
	onHistoryChange : function(puzzle){
		if(!!ui.currentpid){
			ui.setdisplay("operation");
		}
	},
	onTrialModeChange : function(puzzle, trialstage){
		if(!!ui.currentpid){
			ui.setdisplay("trialmode");
		}
	},
	onModeChange : function(puzzle){
		ui.menuconfig.list.mode.val = (ui.puzzle.playmode ? 'play' : 'edit');
		ui.setdisplay('mode');
		ui.menuconfig.set('inputmode', ui.puzzle.mouse.inputMode);

		ui.setdisplay('keypopup');
		ui.setdisplay('bgcolor');
		ui.setdisplay('passallcell');
		ui.keypopup.display();
	},

	//---------------------------------------------------------------------------
	// listener.onAdjust()  盤面の大きさが変わったときの処理を呼び出す
	//---------------------------------------------------------------------------
	onAdjust : function(puzzle){
		ui.adjustcellsize();
	},

	//---------------------------------------------------------------------------
	// listener.onResize()  canvasのサイズを変更したときの処理を呼び出す
	//---------------------------------------------------------------------------
	onResize : function(puzzle){
		var pc = puzzle.painter, cellsize = Math.min(pc.cw, pc.ch);
		var val = (ui.getBoardPadding()*cellsize)|0, valTop = val;
		if(puzzle.pid==='starbattle'||puzzle.pid==='easyasabc'){
			valTop = ((0.05*cellsize)|0)+'px';
		}
		puzzle.canvas.parentNode.style.padding = val+'px';
		puzzle.canvas.parentNode.style.paddingTop = valTop+'px';

		ui.keypopup.resizepanel();
	}
};
