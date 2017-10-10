<?php
/**
 * Used in theme building process for generating presets from pages
 */
// Generate code for sidebars
if( isset($_REQUEST[ 'skrollex_sidebars' ]) ) {
	function skrollex_gen_sidebars(){
		$file_data = "<?php\r\n//Serialized default sidebars. Used in includes/presets.php\r\n\$gen_sidebars = array(";
		$sidebars_widgets = get_option( 'sidebars_widgets' );
		$migrator = Layers_Widget_Migrator::get_instance();
		$widget_instances = $migrator->get_widget_instances();
		foreach ($sidebars_widgets as $sidebar_id => $widgets_ids) {
			if(FALSE === strpos( $sidebar_id , 'obox-layers-builder-' ) && count($widgets_ids) > 0){
				$wdts = array();
				$wdts[$sidebar_id] = array();
				if ( ! is_array( $widgets_ids ) ) {
					continue;
				}
				foreach ($widgets_ids as $widget_id) {
					if ( isset($widget_instances[$widget_id]) ) {
						$wdts[$sidebar_id][$widget_id] = $widget_instances[$widget_id];
					}
				}
				$file_data .= "\r\n\t'" . $sidebar_id . "' => '" . str_replace("'","\'",json_encode($migrator->validate_data($wdts))) . "',";
			}
		}
		$file_data .= "\r\n);\r\n?>";

		$content_type = 'text/plain';
		$file_name = 'presets.txt';
		$filesize = strlen( $file_data );
		header( 'Content-Type: ' .  $content_type);
		header( 'Content-Disposition: attachment; filename=' . $file_name );
		header( 'Expires: 0' );
		header( 'Cache-Control: must-revalidate' );
		header( 'Pragma: public' );
		header( 'Content-Length: ' . $filesize );
		@ob_end_clean();
		flush();
		die($file_data);
	}
	add_action( 'init' , 'skrollex_gen_sidebars' );
}
// Generate code for page preset
if( isset($_REQUEST[ 'skrollex_page' ]) && $_REQUEST[ 'skrollex_page' ] ) {
	function skrollex_gen_page(){
		$sidebar_id = $_REQUEST[ 'skrollex_page' ];
		$file_data = "<?php\r\n//Serialized page preset. Used in includes/presets.php\r\n\$page = ";
		$sidebars_widgets = get_option( 'sidebars_widgets' );
		$migrator = Layers_Widget_Migrator::get_instance();
		$widget_instances = $migrator->get_widget_instances();
		if($sidebars_widgets[$sidebar_id]){
				$wdts = array();
				$widgets_ids = $sidebars_widgets[$sidebar_id];
				$wdts[$sidebar_id] = array();
				if ( is_array( $widgets_ids ) ) {
					foreach ($widgets_ids as $widget_id) {
						if ( isset($widget_instances[$widget_id]) ) {
							$wdts[$sidebar_id][$widget_id] = $widget_instances[$widget_id];
						}
					}
					$file_data .= str_replace("ifram", "fiiiram",
						json_encode(json_encode($migrator->validate_data($wdts)))
					);
				}
		}
		$file_data .= ";\r\n";
		$file_data .= "\$settings = ";
		
		$defs = array();
		
		$defs1 = skrollex_customizer_defaults(array());
		$defs['body-fonts'] = $defs1['body-fonts'];
		$defs['heading-fonts'] = $defs1['heading-fonts'];
		$defs['form-fonts'] = $defs1['form-fonts'];
		
		$defs2 = skrollex_customizer_controls(array());
		$defs['site-decoration'] = $defs2['site-appearance']['site-decoration']['default'];
		
		$defs3 = Skrollex_Ext::customizer_controls(array());
		foreach ($defs3['site-colors'] as $key => $value){
			$defs[$key] = $defs3['site-colors'][$key]['default'];
		}
		
		$settings = array();
		foreach ($defs as $key => $value){
			$tm = layers_get_theme_mod($key);
			if($tm){
				$settings[$key] = $tm;
			}else{
				$settings[$key] = $value;
			}
		}
		$file_data .= json_encode(json_encode($settings));
		$file_data .= ";\r\n?>";

		$content_type = 'text/plain';
		$file_name = 'presets.txt';
		$filesize = strlen( $file_data );
		header( 'Content-Type: ' .  $content_type);
		header( 'Content-Disposition: attachment; filename=' . $file_name );
		header( 'Expires: 0' );
		header( 'Cache-Control: must-revalidate' );
		header( 'Pragma: public' );
		header( 'Content-Length: ' . $filesize );
		@ob_end_clean();
		flush();
		die($file_data);
	}
	add_action( 'init' , 'skrollex_gen_page' );
}

