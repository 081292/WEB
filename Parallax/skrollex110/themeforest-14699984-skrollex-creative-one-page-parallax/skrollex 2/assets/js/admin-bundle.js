(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict"; var $ = jQuery;
$(function() { new (function(){
		var Widget = require('./admin/widget.js');
		var editor = require('./admin/editor.js');
		var queue = require('./admin/queue.js');
		var $redirect = $('.redirect');
		if($redirect.length > 0){
			var url = $redirect.data('url');
			if(url){
				window.location = url;
				return;
			}
		}
		new Widget();
		editor.initAll(queue);
})();});
},{"./admin/editor.js":2,"./admin/queue.js":3,"./admin/widget.js":4}],2:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = new (function(){
	var me = this;
	this.init = function($element, data){
		var $input = $element.parent().children('textarea');
		var isTimeout = false;
		var timeout;
		CKEDITOR.dtd.$removeEmpty['span'] = false;
		CKEDITOR.dtd.$removeEmpty['i'] = false;
		var editor = CKEDITOR.inline($element[0], {
			disableNativeSpellChecker: false,
			contentsCss: [
				CKEDITOR.getUrl('../../css/admin/admin.css?' + (new Date().getTime()))
			],
			extraPlugins: 'showblocks,sourcedialog,embed,autolink,justify,autoembed,widget,embedbase,notification,clipboard,dialog,dialogui,notificationaggregator,toolbar,lineutils',
			justifyClasses: [ 'text-left', 'text-center', 'text-right', 'text-justify' ],
			baseFloatZIndex: 1000000,
			skin: 'office2013',
			entities: false,
			allowedContent: true,
			htmlEncodeOutput: false,
			toolbarGroups: [
				{ name: 'document',	   groups: [ 'mode', 'document' ] },
				{ name: 'tools' },
				{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
				{ name: 'doctools' },
				{ name: 'styles' },
				{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
				{ name: 'paragraph',   groups: [ 'align', 'list', 'indent', 'blocks', 'bidi' ] },
				{ name: 'links' },
				{ name: 'insert' },
				{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
				{ name: 'forms' },
				{ name: 'others' },
				{ name: 'colors' },
			],
			removeButtons: 'Subscript,Superscript,Blockquote,SpecialChar,Format,RemoveFormat',
			stylesSet: [
				{ name: 'Page Title', element: 'h1', attributes: {'class': 'heading-page-title'} },
				{ name: 'Header Title', element: 'h3', attributes: {'class': 'heading-section-title'} },
				{ name: 'Header Details', element: 'p', attributes: {'class': 'header-details'} },
				{ name: 'Header Caption', element: 'p', attributes: {'class': 'header-caption'} },
				{ name: 'Lead', element: 'p', attributes: {'class': 'lead'} },
				{ name: 'Column Title', element: 'h5', attributes: {'class': 'heading-col-title'} },
				{ name: 'Column Details', element: 'p', attributes: {'class': 'col-details'} },
				{ name: 'Subsection Header Title', element: 'h4', attributes: {'class': 'heading-subsection-title'} },
				{ name: 'Subsection Header Details', element: 'p', attributes: {'class': 'subsection-details'} },
				{ name: 'Subsection Column Title', element: 'h4', attributes: {'class': 'heading-subsection-col-title'} },
				{ name: 'Block Title', element: 'h6', attributes: {'class': 'heading-block-title'} },
				{ name: 'Narrow', element: 'p', attributes: {'class': 'narrow'} },
				{ name: 'Caption', element: 'p', attributes: {'class': 'caption'} },
				{ name: 'Circle Caption', element: 'p', attributes: {'class': 'circle-caption'} },
				{ name: 'Item Title', element: 'h4', attributes: {'class': 'heading-subsection-title text-center'} },
				{ name: 'Item Details', element: 'p', attributes: {'class': 'col-details text-center'} },
				{ name: 'Slogan', element: 'div', attributes: {'class': 'slogan'} },
				{ name: 'Photo Stream', element: 'p', attributes: {'class': 'photo-stream'} },
				{ name: 'Center', element: 'p', attributes: {'class': 'text-center'} },
				{ name: 'Right', element: 'p', attributes: {'class': 'text-right'} },
				{ name: 'Big', element: 'p', attributes: {'class': 'text-big'} },
				{ name: 'Big Center', element: 'p', attributes: {'class': 'text-big text-center'} },
				{ name: 'Big Right', element: 'p', attributes: {'class': 'text-big text-right'} },
				
				{ name: 'Home A UpTitle', element: 'div', attributes: {'class': 'home-a-uptitle'} },
				{ name: 'Home A Title', element: 'h1', attributes: {'class': 'home-a-title'} },
				{ name: 'Home A Details', element: 'p', attributes: {'class': 'home-a-details'} },
				{ name: 'Home A Buttons', element: 'p', attributes: {'class': 'home-a-buttons'} },
				
				{ name: 'Home B UpTitle', element: 'div', attributes: {'class': 'home-b-uptitle heading'} },
				{ name: 'Home B Title', element: 'h1', attributes: {'class': 'home-b-title'} },
				{ name: 'Home B Details', element: 'p', attributes: {'class': 'home-b-details heading'} },
				{ name: 'Home B Buttons', element: 'p', attributes: {'class': 'home-b-buttons'} },
				
				{ name: 'Home C UpTitle', element: 'div', attributes: {'class': 'home-c-uptitle'} },
				{ name: 'Home C Title', element: 'h1', attributes: {'class': 'home-c-title'} },
				{ name: 'Home C Details', element: 'p', attributes: {'class': 'home-c-details'} },
				{ name: 'Home C Buttons', element: 'p', attributes: {'class': 'home-c-buttons'} },
				
				{ name: 'Home D UpTitle', element: 'div', attributes: {'class': 'home-d-uptitle'} },
				{ name: 'Home D Title', element: 'h1', attributes: {'class': 'home-d-title'} },
				{ name: 'Home D Details', element: 'p', attributes: {'class': 'home-d-details'} },
				{ name: 'Home D Buttons', element: 'p', attributes: {'class': 'home-d-buttons'} },
				
				{ name: 'Home E UpTitle', element: 'div', attributes: {'class': 'home-e-uptitle'} },
				{ name: 'Home E Title', element: 'h1', attributes: {'class': 'home-e-title'} },
				{ name: 'Home E Details', element: 'p', attributes: {'class': 'home-e-details'} },
				{ name: 'Home E Buttons', element: 'p', attributes: {'class': 'home-e-buttons'} },
				
				{ name: 'Home F UpTitle', element: 'div', attributes: {'class': 'home-f-uptitle  color-heading'} },
				{ name: 'Home F Title', element: 'h1', attributes: {'class': 'home-f-title'} },
				{ name: 'Home F Details', element: 'p', attributes: {'class': 'home-f-details  color-heading'} },
				{ name: 'Home F Buttons', element: 'p', attributes: {'class': 'home-f-buttons'} },
				
				{ name: 'Highlight', element: 'span' },
				
				{ name: 'Float Left', element: 'p', attributes: {'class': 'heading float-text-left'} },
				{ name: 'Float Right', element: 'p', attributes: {'class': 'heading float-text-right'} },
				{ name: 'Float Top', element: 'p', attributes: {'class': 'color-heading float-text-top'} },
				{ name: 'Float Bottom', element: 'p', attributes: {'class': 'color-heading float-text-bottom'} },
				{ name: 'Float Left Top', element: 'p', attributes: {'class': 'color-heading float-text-left-top'} },
				{ name: 'Float Left Bottom', element: 'p', attributes: {'class': 'color-heading float-text-left-bottom'} },
				{ name: 'Float Right Top', element: 'p', attributes: {'class': 'color-heading float-text-right-top'} },
				{ name: 'Float Right Bottom', element: 'p', attributes: {'class': 'color-heading float-text-right-bottom'} },
			],
			on: {
				change: function(e){
					if(isTimeout){
						clearTimeout(timeout);
					}
					isTimeout = true;
					timeout = setTimeout(
						function(){
							update(e);
						}
					, 2000);
				},
				blur: function(e){
					if(isTimeout){
						update(e);
					}
					$input.trigger("blur");
				},
				maximize: function(e){
					if(e.data === CKEDITOR.TRISTATE_OFF){
						update(e);
					}
				},
				mode: function(e){
					if ( this.mode === 'source' ) {
						var editable = e.editor.editable();
						editable.attachListener(editable, 'input', function() {
							update(e);
						});
					}
				},
				instanceReady: function(e){
					e.editor.setReadOnly(false);
					if(data){
						e.editor.setData(data);
					}
					var dataProcessor = editor.dataProcessor;
					var htmlFilter = dataProcessor && dataProcessor.htmlFilter;
					if (htmlFilter) {
						htmlFilter.addRules({
							text: function (text) {
								return text.replace(/&nbsp;/g, ' ');
							}
						}, {
							applyToAll: true,
							excludeNestedEditable: true
						});
					}
				}
			}
		});
		function update(e){
			clearTimeout(timeout);
			isTimeout = false;
			var editorData = e.editor.getData();
			$input.val(editorData).trigger("change");
			var clean = function(str){
				return str.toString().replace(/(\<([^\>]+)\>)/ig, "").replace(/(\[([^\]]+)\])/ig, "").replace(/[\s]+/ig, " ").trim();
			};
			if($element.hasClass('col-header')){
				var text = clean(editorData);
				if(text.length > 40) text = text.substr(0, 40) + '...';
				$element.closest('.layers-accordion-item').children('.layers-accordion-title').find( 'span.layers-detail' ).text(': ' + text);
			}else if($element.hasClass('htmltitle')){
				$element.closest('.layers-content').find('.texttitle').val(clean(editorData));
			}
		}
	};
	this.initAll = function(queue){
		function doInitAll($ctx, noQueue){
			$ctx.find( '.content-editor').each( function() {
				var $editor = $(this);
				if( $editor.hasClass('inited') ) {
					return true;
				}else{
					$editor.addClass('inited');
					var dCont = $editor.data('editor-content');
					if(dCont){
						$editor.removeData('editor-content');
						$editor.html(dCont);
					}
					if(noQueue){
						me.init($editor);
					}else{
						queue.add(function(){ me.init($editor); });
					}
				}
			});
		}
		$( document ).on( 'layers-interface-init', function(e, element){
			doInitAll($(element), true);
		});
	};
})();
},{}],3:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = new(function(){
	var queueFuns = [];
	var queueStoped = true;
	function runQueue(){
		if(queueStoped){
			queueStoped = false;
			perform();
		}
		function perform(){
			setTimeout(function(){
				if(queueFuns.length > 0){
					var fun = queueFuns.shift();
					fun();
					perform();
				}else{
					queueStoped = true;
				}
			}, 10);
		}
	}
	this.add = function(fun){
		queueFuns.push(fun);
		runQueue();
	};
})();
},{}],4:[function(require,module,exports){
"use strict"; var $ = jQuery;
module.exports = function(){
	function sortable(){
		$('.widget-list').each(function(){
			sortableList($(this));
		})
	};
	function sortableList($list){
		$list.sortable({
			placeholder: "layers-sortable-drop",
			handle: '.' + $list[0].id + '-handle',
			stop: function(e , li){
				var $widgetList = li.item.closest( 'ul' );
				var $listIds = $('#' + $widgetList.data('list-ids-id'));
				var itemGuids = [];
				$widgetList.children( '.layers-accordion-item' ).each(function(){
					itemGuids.push( $(this).data( 'guid' ) );
				});
				$listIds.val( itemGuids.join() ).layers_trigger_change();
			}
		});
	}
	sortable();
	$(document).on('widget-added' , function(){
		sortable();
	});
	$(document).on('click' , '.widget-list .icon-trash' , function(e){
		e.preventDefault();
		var $control = $(this);
		if( false === confirm( contentwidgeti18n.confirm_message ) ) return;
		var $widgetList = $control.closest('.widget-list');
		var $listIds = $('#' + $widgetList.data('list-ids-id'));
		$control.closest( '.layers-accordion-item' ).remove();
		var itemGuids = [];
		$widgetList.children( '.layers-accordion-item' ).each(function(){
			itemGuids.push( $(this).data( 'guid' ) );
		});
		$listIds.val( itemGuids.join() ).layers_trigger_change();
		sortableList($widgetList);
	});
	$(document).on('click', '.add-widget-list-item' , function(e){
		e.preventDefault();
		var $control = $(this);
		var $widgetList = $('#' + $control.data('list-id'));
		var $listIds = $('#' + $control.data('list-ids-id'));
		var serialized_inputs = [];
		var $last = $widgetList.children( '.layers-accordion-item' ).last();
		var $allLastlInp = $last.find( 'textarea, input, select' ).not('[id$="_ids"]');
		var $excl = $last.find('.layers-accordions .layers-accordion-item').find( 'textarea, input, select' );
		$allLastlInp.not($excl).each(function(){
			serialized_inputs.push( escape($(this).attr('name')) + '=' + escape(escape($(this).val())) );
		});
		$control.addClass('layers-loading-button');
		$.post(
			ajaxurl,
			{	action: 'skrollex_widget_action',
				php_class: $control.data('php-class'),
				widget_action: 'add',
				instance: serialized_inputs.join( '&' ),
				list_id: $control.data('list-id'),
				list_name: $control.data('list-name'),
				list_model_path: $control.data('list-model-path'),
				$last_list_item_guid: ($last.length > 0) ? $last.data( 'guid' ) : '',
				nonce: layers_widget_params.nonce,
			},
			function(data){
				var $item = $(data);
				$item.children('.layers-accordion-section').hide();
				$widgetList.append($item);
				var itemGuids = [];
				$widgetList.children( '.layers-accordion-item' ).each(function(){
					itemGuids.push( $(this).data( 'guid' ) );
				});
				$listIds.val( itemGuids.join() ).layers_trigger_change();
				$( document ).trigger( 'layers-interface-init', $item );
				$control.removeClass('layers-loading-button');
				setTimeout( function(){
					$item.children('.layers-accordion-title').trigger('click');
				}, 300 );
			}
		);
	});
	$( document ).on( 'layers-interface-init', function(e, element){
		$(element).find( 'img[data-src]' ).each(function(){
			$(this).attr( 'src', $(this).data( 'src' ) );
		});
	});
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6XFwwMDBcXF9iaXRidWNrZXRcXHNrcm9sbGV4LXdwXFxub2RlX21vZHVsZXNcXGdydW50LWJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiZjovMDAwL19iaXRidWNrZXQvc2tyb2xsZXgtd3Avc3JjL3NjcmlwdHMvYWRtaW4uanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy9hZG1pbi9lZGl0b3IuanMiLCJmOi8wMDAvX2JpdGJ1Y2tldC9za3JvbGxleC13cC9zcmMvc2NyaXB0cy9hZG1pbi9xdWV1ZS5qcyIsImY6LzAwMC9fYml0YnVja2V0L3Nrcm9sbGV4LXdwL3NyYy9zY3JpcHRzL2FkbWluL3dpZGdldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlwidXNlIHN0cmljdFwiOyB2YXIgJCA9IGpRdWVyeTtcbiQoZnVuY3Rpb24oKSB7IG5ldyAoZnVuY3Rpb24oKXtcblx0XHR2YXIgV2lkZ2V0ID0gcmVxdWlyZSgnLi9hZG1pbi93aWRnZXQuanMnKTtcblx0XHR2YXIgZWRpdG9yID0gcmVxdWlyZSgnLi9hZG1pbi9lZGl0b3IuanMnKTtcblx0XHR2YXIgcXVldWUgPSByZXF1aXJlKCcuL2FkbWluL3F1ZXVlLmpzJyk7XG5cdFx0dmFyICRyZWRpcmVjdCA9ICQoJy5yZWRpcmVjdCcpO1xuXHRcdGlmKCRyZWRpcmVjdC5sZW5ndGggPiAwKXtcblx0XHRcdHZhciB1cmwgPSAkcmVkaXJlY3QuZGF0YSgndXJsJyk7XG5cdFx0XHRpZih1cmwpe1xuXHRcdFx0XHR3aW5kb3cubG9jYXRpb24gPSB1cmw7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHR9XG5cdFx0bmV3IFdpZGdldCgpO1xuXHRcdGVkaXRvci5pbml0QWxsKHF1ZXVlKTtcbn0pKCk7fSk7IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBuZXcgKGZ1bmN0aW9uKCl7XG5cdHZhciBtZSA9IHRoaXM7XG5cdHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCRlbGVtZW50LCBkYXRhKXtcblx0XHR2YXIgJGlucHV0ID0gJGVsZW1lbnQucGFyZW50KCkuY2hpbGRyZW4oJ3RleHRhcmVhJyk7XG5cdFx0dmFyIGlzVGltZW91dCA9IGZhbHNlO1xuXHRcdHZhciB0aW1lb3V0O1xuXHRcdENLRURJVE9SLmR0ZC4kcmVtb3ZlRW1wdHlbJ3NwYW4nXSA9IGZhbHNlO1xuXHRcdENLRURJVE9SLmR0ZC4kcmVtb3ZlRW1wdHlbJ2knXSA9IGZhbHNlO1xuXHRcdHZhciBlZGl0b3IgPSBDS0VESVRPUi5pbmxpbmUoJGVsZW1lbnRbMF0sIHtcblx0XHRcdGRpc2FibGVOYXRpdmVTcGVsbENoZWNrZXI6IGZhbHNlLFxuXHRcdFx0Y29udGVudHNDc3M6IFtcblx0XHRcdFx0Q0tFRElUT1IuZ2V0VXJsKCcuLi8uLi9jc3MvYWRtaW4vYWRtaW4uY3NzPycgKyAobmV3IERhdGUoKS5nZXRUaW1lKCkpKVxuXHRcdFx0XSxcblx0XHRcdGV4dHJhUGx1Z2luczogJ3Nob3dibG9ja3Msc291cmNlZGlhbG9nLGVtYmVkLGF1dG9saW5rLGp1c3RpZnksYXV0b2VtYmVkLHdpZGdldCxlbWJlZGJhc2Usbm90aWZpY2F0aW9uLGNsaXBib2FyZCxkaWFsb2csZGlhbG9ndWksbm90aWZpY2F0aW9uYWdncmVnYXRvcix0b29sYmFyLGxpbmV1dGlscycsXG5cdFx0XHRqdXN0aWZ5Q2xhc3NlczogWyAndGV4dC1sZWZ0JywgJ3RleHQtY2VudGVyJywgJ3RleHQtcmlnaHQnLCAndGV4dC1qdXN0aWZ5JyBdLFxuXHRcdFx0YmFzZUZsb2F0WkluZGV4OiAxMDAwMDAwLFxuXHRcdFx0c2tpbjogJ29mZmljZTIwMTMnLFxuXHRcdFx0ZW50aXRpZXM6IGZhbHNlLFxuXHRcdFx0YWxsb3dlZENvbnRlbnQ6IHRydWUsXG5cdFx0XHRodG1sRW5jb2RlT3V0cHV0OiBmYWxzZSxcblx0XHRcdHRvb2xiYXJHcm91cHM6IFtcblx0XHRcdFx0eyBuYW1lOiAnZG9jdW1lbnQnLFx0ICAgZ3JvdXBzOiBbICdtb2RlJywgJ2RvY3VtZW50JyBdIH0sXG5cdFx0XHRcdHsgbmFtZTogJ3Rvb2xzJyB9LFxuXHRcdFx0XHR7IG5hbWU6ICdlZGl0aW5nJywgICAgIGdyb3VwczogWyAnZmluZCcsICdzZWxlY3Rpb24nLCAnc3BlbGxjaGVja2VyJyBdIH0sXG5cdFx0XHRcdHsgbmFtZTogJ2RvY3Rvb2xzJyB9LFxuXHRcdFx0XHR7IG5hbWU6ICdzdHlsZXMnIH0sXG5cdFx0XHRcdHsgbmFtZTogJ2Jhc2ljc3R5bGVzJywgZ3JvdXBzOiBbICdiYXNpY3N0eWxlcycsICdjbGVhbnVwJyBdIH0sXG5cdFx0XHRcdHsgbmFtZTogJ3BhcmFncmFwaCcsICAgZ3JvdXBzOiBbICdhbGlnbicsICdsaXN0JywgJ2luZGVudCcsICdibG9ja3MnLCAnYmlkaScgXSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdsaW5rcycgfSxcblx0XHRcdFx0eyBuYW1lOiAnaW5zZXJ0JyB9LFxuXHRcdFx0XHR7IG5hbWU6ICdjbGlwYm9hcmQnLCAgIGdyb3VwczogWyAnY2xpcGJvYXJkJywgJ3VuZG8nIF0gfSxcblx0XHRcdFx0eyBuYW1lOiAnZm9ybXMnIH0sXG5cdFx0XHRcdHsgbmFtZTogJ290aGVycycgfSxcblx0XHRcdFx0eyBuYW1lOiAnY29sb3JzJyB9LFxuXHRcdFx0XSxcblx0XHRcdHJlbW92ZUJ1dHRvbnM6ICdTdWJzY3JpcHQsU3VwZXJzY3JpcHQsQmxvY2txdW90ZSxTcGVjaWFsQ2hhcixGb3JtYXQsUmVtb3ZlRm9ybWF0Jyxcblx0XHRcdHN0eWxlc1NldDogW1xuXHRcdFx0XHR7IG5hbWU6ICdQYWdlIFRpdGxlJywgZWxlbWVudDogJ2gxJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdoZWFkaW5nLXBhZ2UtdGl0bGUnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdIZWFkZXIgVGl0bGUnLCBlbGVtZW50OiAnaDMnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hlYWRpbmctc2VjdGlvbi10aXRsZSd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0hlYWRlciBEZXRhaWxzJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hlYWRlci1kZXRhaWxzJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnSGVhZGVyIENhcHRpb24nLCBlbGVtZW50OiAncCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnaGVhZGVyLWNhcHRpb24nfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdMZWFkJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2xlYWQnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdDb2x1bW4gVGl0bGUnLCBlbGVtZW50OiAnaDUnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hlYWRpbmctY29sLXRpdGxlJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnQ29sdW1uIERldGFpbHMnLCBlbGVtZW50OiAncCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnY29sLWRldGFpbHMnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdTdWJzZWN0aW9uIEhlYWRlciBUaXRsZScsIGVsZW1lbnQ6ICdoNCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnaGVhZGluZy1zdWJzZWN0aW9uLXRpdGxlJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnU3Vic2VjdGlvbiBIZWFkZXIgRGV0YWlscycsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdzdWJzZWN0aW9uLWRldGFpbHMnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdTdWJzZWN0aW9uIENvbHVtbiBUaXRsZScsIGVsZW1lbnQ6ICdoNCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnaGVhZGluZy1zdWJzZWN0aW9uLWNvbC10aXRsZSd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0Jsb2NrIFRpdGxlJywgZWxlbWVudDogJ2g2JywgYXR0cmlidXRlczogeydjbGFzcyc6ICdoZWFkaW5nLWJsb2NrLXRpdGxlJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnTmFycm93JywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ25hcnJvdyd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0NhcHRpb24nLCBlbGVtZW50OiAncCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnY2FwdGlvbid9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0NpcmNsZSBDYXB0aW9uJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2NpcmNsZS1jYXB0aW9uJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnSXRlbSBUaXRsZScsIGVsZW1lbnQ6ICdoNCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnaGVhZGluZy1zdWJzZWN0aW9uLXRpdGxlIHRleHQtY2VudGVyJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnSXRlbSBEZXRhaWxzJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2NvbC1kZXRhaWxzIHRleHQtY2VudGVyJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnU2xvZ2FuJywgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnc2xvZ2FuJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnUGhvdG8gU3RyZWFtJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ3Bob3RvLXN0cmVhbSd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0NlbnRlcicsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICd0ZXh0LWNlbnRlcid9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ1JpZ2h0JywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ3RleHQtcmlnaHQnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdCaWcnLCBlbGVtZW50OiAncCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAndGV4dC1iaWcnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdCaWcgQ2VudGVyJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ3RleHQtYmlnIHRleHQtY2VudGVyJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnQmlnIFJpZ2h0JywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ3RleHQtYmlnIHRleHQtcmlnaHQnfSB9LFxuXHRcdFx0XHRcblx0XHRcdFx0eyBuYW1lOiAnSG9tZSBBIFVwVGl0bGUnLCBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogeydjbGFzcyc6ICdob21lLWEtdXB0aXRsZSd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0hvbWUgQSBUaXRsZScsIGVsZW1lbnQ6ICdoMScsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnaG9tZS1hLXRpdGxlJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnSG9tZSBBIERldGFpbHMnLCBlbGVtZW50OiAncCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnaG9tZS1hLWRldGFpbHMnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdIb21lIEEgQnV0dG9ucycsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdob21lLWEtYnV0dG9ucyd9IH0sXG5cdFx0XHRcdFxuXHRcdFx0XHR7IG5hbWU6ICdIb21lIEIgVXBUaXRsZScsIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hvbWUtYi11cHRpdGxlIGhlYWRpbmcnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdIb21lIEIgVGl0bGUnLCBlbGVtZW50OiAnaDEnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hvbWUtYi10aXRsZSd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0hvbWUgQiBEZXRhaWxzJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hvbWUtYi1kZXRhaWxzIGhlYWRpbmcnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdIb21lIEIgQnV0dG9ucycsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdob21lLWItYnV0dG9ucyd9IH0sXG5cdFx0XHRcdFxuXHRcdFx0XHR7IG5hbWU6ICdIb21lIEMgVXBUaXRsZScsIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hvbWUtYy11cHRpdGxlJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnSG9tZSBDIFRpdGxlJywgZWxlbWVudDogJ2gxJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdob21lLWMtdGl0bGUnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdIb21lIEMgRGV0YWlscycsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdob21lLWMtZGV0YWlscyd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0hvbWUgQyBCdXR0b25zJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hvbWUtYy1idXR0b25zJ30gfSxcblx0XHRcdFx0XG5cdFx0XHRcdHsgbmFtZTogJ0hvbWUgRCBVcFRpdGxlJywgZWxlbWVudDogJ2RpdicsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnaG9tZS1kLXVwdGl0bGUnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdIb21lIEQgVGl0bGUnLCBlbGVtZW50OiAnaDEnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hvbWUtZC10aXRsZSd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0hvbWUgRCBEZXRhaWxzJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hvbWUtZC1kZXRhaWxzJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnSG9tZSBEIEJ1dHRvbnMnLCBlbGVtZW50OiAncCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnaG9tZS1kLWJ1dHRvbnMnfSB9LFxuXHRcdFx0XHRcblx0XHRcdFx0eyBuYW1lOiAnSG9tZSBFIFVwVGl0bGUnLCBlbGVtZW50OiAnZGl2JywgYXR0cmlidXRlczogeydjbGFzcyc6ICdob21lLWUtdXB0aXRsZSd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0hvbWUgRSBUaXRsZScsIGVsZW1lbnQ6ICdoMScsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnaG9tZS1lLXRpdGxlJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnSG9tZSBFIERldGFpbHMnLCBlbGVtZW50OiAncCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnaG9tZS1lLWRldGFpbHMnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdIb21lIEUgQnV0dG9ucycsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdob21lLWUtYnV0dG9ucyd9IH0sXG5cdFx0XHRcdFxuXHRcdFx0XHR7IG5hbWU6ICdIb21lIEYgVXBUaXRsZScsIGVsZW1lbnQ6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hvbWUtZi11cHRpdGxlICBjb2xvci1oZWFkaW5nJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnSG9tZSBGIFRpdGxlJywgZWxlbWVudDogJ2gxJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdob21lLWYtdGl0bGUnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdIb21lIEYgRGV0YWlscycsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdob21lLWYtZGV0YWlscyAgY29sb3ItaGVhZGluZyd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0hvbWUgRiBCdXR0b25zJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hvbWUtZi1idXR0b25zJ30gfSxcblx0XHRcdFx0XG5cdFx0XHRcdHsgbmFtZTogJ0hpZ2hsaWdodCcsIGVsZW1lbnQ6ICdzcGFuJyB9LFxuXHRcdFx0XHRcblx0XHRcdFx0eyBuYW1lOiAnRmxvYXQgTGVmdCcsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdoZWFkaW5nIGZsb2F0LXRleHQtbGVmdCd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0Zsb2F0IFJpZ2h0JywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2hlYWRpbmcgZmxvYXQtdGV4dC1yaWdodCd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0Zsb2F0IFRvcCcsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdjb2xvci1oZWFkaW5nIGZsb2F0LXRleHQtdG9wJ30gfSxcblx0XHRcdFx0eyBuYW1lOiAnRmxvYXQgQm90dG9tJywgZWxlbWVudDogJ3AnLCBhdHRyaWJ1dGVzOiB7J2NsYXNzJzogJ2NvbG9yLWhlYWRpbmcgZmxvYXQtdGV4dC1ib3R0b20nfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdGbG9hdCBMZWZ0IFRvcCcsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdjb2xvci1oZWFkaW5nIGZsb2F0LXRleHQtbGVmdC10b3AnfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdGbG9hdCBMZWZ0IEJvdHRvbScsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdjb2xvci1oZWFkaW5nIGZsb2F0LXRleHQtbGVmdC1ib3R0b20nfSB9LFxuXHRcdFx0XHR7IG5hbWU6ICdGbG9hdCBSaWdodCBUb3AnLCBlbGVtZW50OiAncCcsIGF0dHJpYnV0ZXM6IHsnY2xhc3MnOiAnY29sb3ItaGVhZGluZyBmbG9hdC10ZXh0LXJpZ2h0LXRvcCd9IH0sXG5cdFx0XHRcdHsgbmFtZTogJ0Zsb2F0IFJpZ2h0IEJvdHRvbScsIGVsZW1lbnQ6ICdwJywgYXR0cmlidXRlczogeydjbGFzcyc6ICdjb2xvci1oZWFkaW5nIGZsb2F0LXRleHQtcmlnaHQtYm90dG9tJ30gfSxcblx0XHRcdF0sXG5cdFx0XHRvbjoge1xuXHRcdFx0XHRjaGFuZ2U6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGlmKGlzVGltZW91dCl7XG5cdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlzVGltZW91dCA9IHRydWU7XG5cdFx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoXG5cdFx0XHRcdFx0XHRmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHR1cGRhdGUoZSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0LCAyMDAwKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Ymx1cjogZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0aWYoaXNUaW1lb3V0KXtcblx0XHRcdFx0XHRcdHVwZGF0ZShlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JGlucHV0LnRyaWdnZXIoXCJibHVyXCIpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtYXhpbWl6ZTogZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0aWYoZS5kYXRhID09PSBDS0VESVRPUi5UUklTVEFURV9PRkYpe1xuXHRcdFx0XHRcdFx0dXBkYXRlKGUpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0bW9kZTogZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0aWYgKCB0aGlzLm1vZGUgPT09ICdzb3VyY2UnICkge1xuXHRcdFx0XHRcdFx0dmFyIGVkaXRhYmxlID0gZS5lZGl0b3IuZWRpdGFibGUoKTtcblx0XHRcdFx0XHRcdGVkaXRhYmxlLmF0dGFjaExpc3RlbmVyKGVkaXRhYmxlLCAnaW5wdXQnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0dXBkYXRlKGUpO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRpbnN0YW5jZVJlYWR5OiBmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRlLmVkaXRvci5zZXRSZWFkT25seShmYWxzZSk7XG5cdFx0XHRcdFx0aWYoZGF0YSl7XG5cdFx0XHRcdFx0XHRlLmVkaXRvci5zZXREYXRhKGRhdGEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR2YXIgZGF0YVByb2Nlc3NvciA9IGVkaXRvci5kYXRhUHJvY2Vzc29yO1xuXHRcdFx0XHRcdHZhciBodG1sRmlsdGVyID0gZGF0YVByb2Nlc3NvciAmJiBkYXRhUHJvY2Vzc29yLmh0bWxGaWx0ZXI7XG5cdFx0XHRcdFx0aWYgKGh0bWxGaWx0ZXIpIHtcblx0XHRcdFx0XHRcdGh0bWxGaWx0ZXIuYWRkUnVsZXMoe1xuXHRcdFx0XHRcdFx0XHR0ZXh0OiBmdW5jdGlvbiAodGV4dCkge1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiB0ZXh0LnJlcGxhY2UoLyZuYnNwOy9nLCAnICcpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XHRcdGFwcGx5VG9BbGw6IHRydWUsXG5cdFx0XHRcdFx0XHRcdGV4Y2x1ZGVOZXN0ZWRFZGl0YWJsZTogdHJ1ZVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0ZnVuY3Rpb24gdXBkYXRlKGUpe1xuXHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXHRcdFx0aXNUaW1lb3V0ID0gZmFsc2U7XG5cdFx0XHR2YXIgZWRpdG9yRGF0YSA9IGUuZWRpdG9yLmdldERhdGEoKTtcblx0XHRcdCRpbnB1dC52YWwoZWRpdG9yRGF0YSkudHJpZ2dlcihcImNoYW5nZVwiKTtcblx0XHRcdHZhciBjbGVhbiA9IGZ1bmN0aW9uKHN0cil7XG5cdFx0XHRcdHJldHVybiBzdHIudG9TdHJpbmcoKS5yZXBsYWNlKC8oXFw8KFteXFw+XSspXFw+KS9pZywgXCJcIikucmVwbGFjZSgvKFxcWyhbXlxcXV0rKVxcXSkvaWcsIFwiXCIpLnJlcGxhY2UoL1tcXHNdKy9pZywgXCIgXCIpLnRyaW0oKTtcblx0XHRcdH07XG5cdFx0XHRpZigkZWxlbWVudC5oYXNDbGFzcygnY29sLWhlYWRlcicpKXtcblx0XHRcdFx0dmFyIHRleHQgPSBjbGVhbihlZGl0b3JEYXRhKTtcblx0XHRcdFx0aWYodGV4dC5sZW5ndGggPiA0MCkgdGV4dCA9IHRleHQuc3Vic3RyKDAsIDQwKSArICcuLi4nO1xuXHRcdFx0XHQkZWxlbWVudC5jbG9zZXN0KCcubGF5ZXJzLWFjY29yZGlvbi1pdGVtJykuY2hpbGRyZW4oJy5sYXllcnMtYWNjb3JkaW9uLXRpdGxlJykuZmluZCggJ3NwYW4ubGF5ZXJzLWRldGFpbCcgKS50ZXh0KCc6ICcgKyB0ZXh0KTtcblx0XHRcdH1lbHNlIGlmKCRlbGVtZW50Lmhhc0NsYXNzKCdodG1sdGl0bGUnKSl7XG5cdFx0XHRcdCRlbGVtZW50LmNsb3Nlc3QoJy5sYXllcnMtY29udGVudCcpLmZpbmQoJy50ZXh0dGl0bGUnKS52YWwoY2xlYW4oZWRpdG9yRGF0YSkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0dGhpcy5pbml0QWxsID0gZnVuY3Rpb24ocXVldWUpe1xuXHRcdGZ1bmN0aW9uIGRvSW5pdEFsbCgkY3R4LCBub1F1ZXVlKXtcblx0XHRcdCRjdHguZmluZCggJy5jb250ZW50LWVkaXRvcicpLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgJGVkaXRvciA9ICQodGhpcyk7XG5cdFx0XHRcdGlmKCAkZWRpdG9yLmhhc0NsYXNzKCdpbml0ZWQnKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0JGVkaXRvci5hZGRDbGFzcygnaW5pdGVkJyk7XG5cdFx0XHRcdFx0dmFyIGRDb250ID0gJGVkaXRvci5kYXRhKCdlZGl0b3ItY29udGVudCcpO1xuXHRcdFx0XHRcdGlmKGRDb250KXtcblx0XHRcdFx0XHRcdCRlZGl0b3IucmVtb3ZlRGF0YSgnZWRpdG9yLWNvbnRlbnQnKTtcblx0XHRcdFx0XHRcdCRlZGl0b3IuaHRtbChkQ29udCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmKG5vUXVldWUpe1xuXHRcdFx0XHRcdFx0bWUuaW5pdCgkZWRpdG9yKTtcblx0XHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcdHF1ZXVlLmFkZChmdW5jdGlvbigpeyBtZS5pbml0KCRlZGl0b3IpOyB9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblx0XHQkKCBkb2N1bWVudCApLm9uKCAnbGF5ZXJzLWludGVyZmFjZS1pbml0JywgZnVuY3Rpb24oZSwgZWxlbWVudCl7XG5cdFx0XHRkb0luaXRBbGwoJChlbGVtZW50KSwgdHJ1ZSk7XG5cdFx0fSk7XG5cdH07XG59KSgpOyIsIlwidXNlIHN0cmljdFwiOyB2YXIgJCA9IGpRdWVyeTtcbm1vZHVsZS5leHBvcnRzID0gbmV3KGZ1bmN0aW9uKCl7XG5cdHZhciBxdWV1ZUZ1bnMgPSBbXTtcblx0dmFyIHF1ZXVlU3RvcGVkID0gdHJ1ZTtcblx0ZnVuY3Rpb24gcnVuUXVldWUoKXtcblx0XHRpZihxdWV1ZVN0b3BlZCl7XG5cdFx0XHRxdWV1ZVN0b3BlZCA9IGZhbHNlO1xuXHRcdFx0cGVyZm9ybSgpO1xuXHRcdH1cblx0XHRmdW5jdGlvbiBwZXJmb3JtKCl7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKHF1ZXVlRnVucy5sZW5ndGggPiAwKXtcblx0XHRcdFx0XHR2YXIgZnVuID0gcXVldWVGdW5zLnNoaWZ0KCk7XG5cdFx0XHRcdFx0ZnVuKCk7XG5cdFx0XHRcdFx0cGVyZm9ybSgpO1xuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRxdWV1ZVN0b3BlZCA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0sIDEwKTtcblx0XHR9XG5cdH1cblx0dGhpcy5hZGQgPSBmdW5jdGlvbihmdW4pe1xuXHRcdHF1ZXVlRnVucy5wdXNoKGZ1bik7XG5cdFx0cnVuUXVldWUoKTtcblx0fTtcbn0pKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7IHZhciAkID0galF1ZXJ5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuXHRmdW5jdGlvbiBzb3J0YWJsZSgpe1xuXHRcdCQoJy53aWRnZXQtbGlzdCcpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHNvcnRhYmxlTGlzdCgkKHRoaXMpKTtcblx0XHR9KVxuXHR9O1xuXHRmdW5jdGlvbiBzb3J0YWJsZUxpc3QoJGxpc3Qpe1xuXHRcdCRsaXN0LnNvcnRhYmxlKHtcblx0XHRcdHBsYWNlaG9sZGVyOiBcImxheWVycy1zb3J0YWJsZS1kcm9wXCIsXG5cdFx0XHRoYW5kbGU6ICcuJyArICRsaXN0WzBdLmlkICsgJy1oYW5kbGUnLFxuXHRcdFx0c3RvcDogZnVuY3Rpb24oZSAsIGxpKXtcblx0XHRcdFx0dmFyICR3aWRnZXRMaXN0ID0gbGkuaXRlbS5jbG9zZXN0KCAndWwnICk7XG5cdFx0XHRcdHZhciAkbGlzdElkcyA9ICQoJyMnICsgJHdpZGdldExpc3QuZGF0YSgnbGlzdC1pZHMtaWQnKSk7XG5cdFx0XHRcdHZhciBpdGVtR3VpZHMgPSBbXTtcblx0XHRcdFx0JHdpZGdldExpc3QuY2hpbGRyZW4oICcubGF5ZXJzLWFjY29yZGlvbi1pdGVtJyApLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRpdGVtR3VpZHMucHVzaCggJCh0aGlzKS5kYXRhKCAnZ3VpZCcgKSApO1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0JGxpc3RJZHMudmFsKCBpdGVtR3VpZHMuam9pbigpICkubGF5ZXJzX3RyaWdnZXJfY2hhbmdlKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblx0c29ydGFibGUoKTtcblx0JChkb2N1bWVudCkub24oJ3dpZGdldC1hZGRlZCcgLCBmdW5jdGlvbigpe1xuXHRcdHNvcnRhYmxlKCk7XG5cdH0pO1xuXHQkKGRvY3VtZW50KS5vbignY2xpY2snICwgJy53aWRnZXQtbGlzdCAuaWNvbi10cmFzaCcgLCBmdW5jdGlvbihlKXtcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0dmFyICRjb250cm9sID0gJCh0aGlzKTtcblx0XHRpZiggZmFsc2UgPT09IGNvbmZpcm0oIGNvbnRlbnR3aWRnZXRpMThuLmNvbmZpcm1fbWVzc2FnZSApICkgcmV0dXJuO1xuXHRcdHZhciAkd2lkZ2V0TGlzdCA9ICRjb250cm9sLmNsb3Nlc3QoJy53aWRnZXQtbGlzdCcpO1xuXHRcdHZhciAkbGlzdElkcyA9ICQoJyMnICsgJHdpZGdldExpc3QuZGF0YSgnbGlzdC1pZHMtaWQnKSk7XG5cdFx0JGNvbnRyb2wuY2xvc2VzdCggJy5sYXllcnMtYWNjb3JkaW9uLWl0ZW0nICkucmVtb3ZlKCk7XG5cdFx0dmFyIGl0ZW1HdWlkcyA9IFtdO1xuXHRcdCR3aWRnZXRMaXN0LmNoaWxkcmVuKCAnLmxheWVycy1hY2NvcmRpb24taXRlbScgKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRpdGVtR3VpZHMucHVzaCggJCh0aGlzKS5kYXRhKCAnZ3VpZCcgKSApO1xuXHRcdH0pO1xuXHRcdCRsaXN0SWRzLnZhbCggaXRlbUd1aWRzLmpvaW4oKSApLmxheWVyc190cmlnZ2VyX2NoYW5nZSgpO1xuXHRcdHNvcnRhYmxlTGlzdCgkd2lkZ2V0TGlzdCk7XG5cdH0pO1xuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLmFkZC13aWRnZXQtbGlzdC1pdGVtJyAsIGZ1bmN0aW9uKGUpe1xuXHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHR2YXIgJGNvbnRyb2wgPSAkKHRoaXMpO1xuXHRcdHZhciAkd2lkZ2V0TGlzdCA9ICQoJyMnICsgJGNvbnRyb2wuZGF0YSgnbGlzdC1pZCcpKTtcblx0XHR2YXIgJGxpc3RJZHMgPSAkKCcjJyArICRjb250cm9sLmRhdGEoJ2xpc3QtaWRzLWlkJykpO1xuXHRcdHZhciBzZXJpYWxpemVkX2lucHV0cyA9IFtdO1xuXHRcdHZhciAkbGFzdCA9ICR3aWRnZXRMaXN0LmNoaWxkcmVuKCAnLmxheWVycy1hY2NvcmRpb24taXRlbScgKS5sYXN0KCk7XG5cdFx0dmFyICRhbGxMYXN0bElucCA9ICRsYXN0LmZpbmQoICd0ZXh0YXJlYSwgaW5wdXQsIHNlbGVjdCcgKS5ub3QoJ1tpZCQ9XCJfaWRzXCJdJyk7XG5cdFx0dmFyICRleGNsID0gJGxhc3QuZmluZCgnLmxheWVycy1hY2NvcmRpb25zIC5sYXllcnMtYWNjb3JkaW9uLWl0ZW0nKS5maW5kKCAndGV4dGFyZWEsIGlucHV0LCBzZWxlY3QnICk7XG5cdFx0JGFsbExhc3RsSW5wLm5vdCgkZXhjbCkuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0c2VyaWFsaXplZF9pbnB1dHMucHVzaCggZXNjYXBlKCQodGhpcykuYXR0cignbmFtZScpKSArICc9JyArIGVzY2FwZShlc2NhcGUoJCh0aGlzKS52YWwoKSkpICk7XG5cdFx0fSk7XG5cdFx0JGNvbnRyb2wuYWRkQ2xhc3MoJ2xheWVycy1sb2FkaW5nLWJ1dHRvbicpO1xuXHRcdCQucG9zdChcblx0XHRcdGFqYXh1cmwsXG5cdFx0XHR7XHRhY3Rpb246ICdza3JvbGxleF93aWRnZXRfYWN0aW9uJyxcblx0XHRcdFx0cGhwX2NsYXNzOiAkY29udHJvbC5kYXRhKCdwaHAtY2xhc3MnKSxcblx0XHRcdFx0d2lkZ2V0X2FjdGlvbjogJ2FkZCcsXG5cdFx0XHRcdGluc3RhbmNlOiBzZXJpYWxpemVkX2lucHV0cy5qb2luKCAnJicgKSxcblx0XHRcdFx0bGlzdF9pZDogJGNvbnRyb2wuZGF0YSgnbGlzdC1pZCcpLFxuXHRcdFx0XHRsaXN0X25hbWU6ICRjb250cm9sLmRhdGEoJ2xpc3QtbmFtZScpLFxuXHRcdFx0XHRsaXN0X21vZGVsX3BhdGg6ICRjb250cm9sLmRhdGEoJ2xpc3QtbW9kZWwtcGF0aCcpLFxuXHRcdFx0XHQkbGFzdF9saXN0X2l0ZW1fZ3VpZDogKCRsYXN0Lmxlbmd0aCA+IDApID8gJGxhc3QuZGF0YSggJ2d1aWQnICkgOiAnJyxcblx0XHRcdFx0bm9uY2U6IGxheWVyc193aWRnZXRfcGFyYW1zLm5vbmNlLFxuXHRcdFx0fSxcblx0XHRcdGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHR2YXIgJGl0ZW0gPSAkKGRhdGEpO1xuXHRcdFx0XHQkaXRlbS5jaGlsZHJlbignLmxheWVycy1hY2NvcmRpb24tc2VjdGlvbicpLmhpZGUoKTtcblx0XHRcdFx0JHdpZGdldExpc3QuYXBwZW5kKCRpdGVtKTtcblx0XHRcdFx0dmFyIGl0ZW1HdWlkcyA9IFtdO1xuXHRcdFx0XHQkd2lkZ2V0TGlzdC5jaGlsZHJlbiggJy5sYXllcnMtYWNjb3JkaW9uLWl0ZW0nICkuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGl0ZW1HdWlkcy5wdXNoKCAkKHRoaXMpLmRhdGEoICdndWlkJyApICk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkbGlzdElkcy52YWwoIGl0ZW1HdWlkcy5qb2luKCkgKS5sYXllcnNfdHJpZ2dlcl9jaGFuZ2UoKTtcblx0XHRcdFx0JCggZG9jdW1lbnQgKS50cmlnZ2VyKCAnbGF5ZXJzLWludGVyZmFjZS1pbml0JywgJGl0ZW0gKTtcblx0XHRcdFx0JGNvbnRyb2wucmVtb3ZlQ2xhc3MoJ2xheWVycy1sb2FkaW5nLWJ1dHRvbicpO1xuXHRcdFx0XHRzZXRUaW1lb3V0KCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdCRpdGVtLmNoaWxkcmVuKCcubGF5ZXJzLWFjY29yZGlvbi10aXRsZScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0XHRcdH0sIDMwMCApO1xuXHRcdFx0fVxuXHRcdCk7XG5cdH0pO1xuXHQkKCBkb2N1bWVudCApLm9uKCAnbGF5ZXJzLWludGVyZmFjZS1pbml0JywgZnVuY3Rpb24oZSwgZWxlbWVudCl7XG5cdFx0JChlbGVtZW50KS5maW5kKCAnaW1nW2RhdGEtc3JjXScgKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHQkKHRoaXMpLmF0dHIoICdzcmMnLCAkKHRoaXMpLmRhdGEoICdzcmMnICkgKTtcblx0XHR9KTtcblx0fSk7XG59OyJdfQ==
