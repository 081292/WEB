<?php
/**
 * Theme presets
 */
function skrollex_preset(&$layers_child_presets, $id, $withSettings = TRUE, $dispName = NULL){
	require get_stylesheet_directory() . '/includes/generated/page_' . $id . '.php';
	$title = isset($dispName) ? $dispName : (strtoupper($id) . ($withSettings ? (': ' . esc_html__('Page + Site Settings', 'skrollex')) : esc_html__('Page Only', 'skrollex')));
	$screenshot = ($withSettings ? '' : 'content-') . $id . '.png';
	$pagePr = str_replace("fiiiram", "ifram",
			json_encode($page)
	);
	$settingsPr = $withSettings ? json_encode($settings) : NULL;
	$layers_child_presets[ 'skrollex-' . $id . ($withSettings ? '-withsettings' : '') ] = array(
		'title' => $title,
		'screenshot' => get_stylesheet_directory_uri().'/assets/preset-images/screenshots/' . $screenshot,
		'screenshot_type' => 'png',
		'json' => esc_attr('{"encoded-data":' . $pagePr . ($settingsPr!==NULL ? ', "site-settings":' . $settingsPr : '' ) . '}')
	);
}
/**
 * Add theme presets to preset page
 * 
 * @param array $layers_preset_layouts
 * @return array
 */
function skrollex_child_presets($layers_preset_layouts){
	$layers_child_presets = array();
	skrollex_preset($layers_child_presets, 'alice');
	skrollex_preset($layers_child_presets, 'nina');
	skrollex_preset($layers_child_presets, 'nora');
	skrollex_preset($layers_child_presets, 'lynda');
	skrollex_preset($layers_child_presets, 'clara');
	skrollex_preset($layers_child_presets, 'mary');
	skrollex_preset($layers_child_presets, 'zoe');
	skrollex_preset($layers_child_presets, 'julia');
	skrollex_preset($layers_child_presets, 'anna');
	skrollex_preset($layers_child_presets, 'nadya');
	skrollex_preset($layers_child_presets, 'bella');
	skrollex_preset($layers_child_presets, 'sophia');
	skrollex_preset($layers_child_presets, 'lena');
	skrollex_preset($layers_child_presets, 'tanya');
	skrollex_preset($layers_child_presets, 'mila');
	skrollex_preset($layers_child_presets, 'eva');
	skrollex_preset($layers_child_presets, 'rosa');
	skrollex_preset($layers_child_presets, 'viki');
	skrollex_preset($layers_child_presets, 'luiza');
	skrollex_preset($layers_child_presets, 'aria');
	skrollex_preset($layers_child_presets, 'olga');
	skrollex_preset($layers_child_presets, 'suzi');
	skrollex_preset($layers_child_presets, 'polly');
	skrollex_preset($layers_child_presets, 'maya');
	
	skrollex_preset($layers_child_presets, 'alice', FALSE,  'Layout 1: Page Only');
	skrollex_preset($layers_child_presets, 'nina', FALSE,  'Layout 2: Page Only');
	skrollex_preset($layers_child_presets, 'nora', FALSE,  'Layout 3: Page Only');
	skrollex_preset($layers_child_presets, 'lynda', FALSE,  'Layout 4: Page Only');	
	skrollex_preset($layers_child_presets, 'clara', FALSE,  'Layout 5: Page Only');		
	skrollex_preset($layers_child_presets, 'sophia', FALSE,  'Layout 6: Page Only');
	skrollex_preset($layers_child_presets, 'maya', FALSE,  'Layout 7: Page Only');	

	return array_merge( $layers_child_presets, $layers_preset_layouts );
}
add_filter( 'layers_preset_layouts', 'skrollex_child_presets', 0 );
/**
 * Predefined sidebars
 */
if( ! function_exists( 'skrollex_default_sidebars' ) ) {
	function skrollex_default_sidebars(){
		require get_stylesheet_directory() . '/includes/generated/sidebars.php';
		$sbw = get_option('sidebars_widgets');
		$migrator = Layers_Widget_Migrator::get_instance();
		if(		(!isset($sbw['skrollex-footer-1']) || count($sbw['skrollex-footer-1']) < 1)
			&&	(!isset($sbw['skrollex-footer-2']) || count($sbw['skrollex-footer-2']) < 1)
			&&	(!isset($sbw['skrollex-footer-3']) || count($sbw['skrollex-footer-3']) < 1)
			&&	(!isset($sbw['skrollex-footer-4']) || count($sbw['skrollex-footer-4']) < 1)
		){
			remove_theme_mod('footer-sidebar-count');
			$migrator->import(array(
				'widget_data' => json_decode($gen_sidebars['skrollex-footer-1'], true)
			));
		}
		if(!isset($sbw['skrollex-blog-top-area']) || count($sbw['skrollex-blog-top-area']) < 1){
			$migrator->import(array(
				'widget_data' => json_decode($gen_sidebars['skrollex-blog-top-area'], true)
			));
		}
		if(!isset($sbw['skrollex-post-top-area']) || count($sbw['skrollex-post-top-area']) < 1){
			$migrator->import(array(
				'widget_data' => json_decode($gen_sidebars['skrollex-post-top-area'], true)
			));
		}
		if(!isset($sbw['skrollex-default-top-area']) || count($sbw['skrollex-default-top-area']) < 1){
			$migrator->import(array(
				'widget_data' => json_decode($gen_sidebars['skrollex-default-top-area'], true)
			));
		}
		if(!isset($sbw['layers-left-sidebar']) || count($sbw['layers-left-sidebar']) < 1){
			$migrator->import(array(
				'widget_data' => json_decode($gen_sidebars['layers-left-sidebar'], true)
			));
		}
		if(!isset($sbw['layers-right-sidebar']) || count($sbw['layers-right-sidebar']) < 1){
			$migrator->import(array(
				'widget_data' => json_decode($gen_sidebars['layers-right-sidebar'], true)
			));
		}
	}
}