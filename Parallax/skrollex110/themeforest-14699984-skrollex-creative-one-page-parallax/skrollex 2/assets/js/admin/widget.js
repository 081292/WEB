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