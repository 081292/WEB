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