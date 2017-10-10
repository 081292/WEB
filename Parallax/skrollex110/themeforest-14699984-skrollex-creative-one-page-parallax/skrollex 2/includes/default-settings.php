<?php
/**
 * Register menus
 */
if (!function_exists('skrollex_register_menu')) {
	function skrollex_register_menu(){
		// In theme used own menus to successfully load predefined items
		// when you first activate the theme.
		unregister_nav_menu(LAYERS_THEME_SLUG . '-secondary-left');
		unregister_nav_menu(LAYERS_THEME_SLUG . '-secondary-right');
		unregister_nav_menu(LAYERS_THEME_SLUG . '-primary-right');
		unregister_nav_menu(LAYERS_THEME_SLUG . '-footer');
		unregister_nav_menu(LAYERS_THEME_SLUG . '-primary');
		register_nav_menu('skrollex-primary', esc_html__('Header Menu', 'skrollex'));
		register_nav_menu('skrollex-extended', esc_html__('Extended Menu', 'skrollex'));
		register_nav_menu('skrollex-footer', esc_html__('Footer Menu', 'skrollex'));
	}
}
add_action('after_setup_theme' , 'skrollex_register_menu', 800);
/**
 * Register sidebars
 */
if (!function_exists('skrollex_register_sidebars')) {
	function skrollex_register_sidebars(){
		register_sidebar(array(
			'id' => 'skrollex-blog-top-area',
			'name' => esc_html__('Blog Page Widgets', 'skrollex'),
			'description' => esc_html__('', 'skrollex'),
			'before_widget' => '',
			'after_widget' => '',
		));
		register_sidebar(array(
			'id' => 'skrollex-post-top-area',
			'name' => esc_html__('Post Page Widgets', 'skrollex'),
			'description' => esc_html__('', 'skrollex'),
			'before_widget' => '',
			'after_widget' => '',
		));
		register_sidebar(array(
			'id' => 'skrollex-default-top-area',
			'name' => esc_html__('Default Page Widgets', 'skrollex'),
			'description' => esc_html__('', 'skrollex'),
			'before_widget' => '',
			'after_widget' => '',
		));
		unregister_sidebar(LAYERS_THEME_SLUG . '-off-canvas-sidebar');
		register_sidebar( array(
			'id'		=> 'skrollex-off-canvas-sidebar',
			'name'		=> esc_html__( 'Mobile Sidebar' , 'skrollex' ),
			'description'	=> esc_html__( 'This sidebar will only appear on mobile devices.' , 'skrollex' ),
			'before_widget'	=> '<aside id="%1$s" class="content-box widget %2$s">',
			'after_widget'	=> '</aside>',
			'before_title'	=> '<h5 class="section-nav-title">',
			'after_title'	=> '</h5>',
		) );
		for( $footer = 1; $footer < 5; $footer++ ) {
			unregister_sidebar(LAYERS_THEME_SLUG . '-footer-' . $footer);
			register_sidebar( array(
				'id'		=> 'skrollex-footer-' . $footer,
				'name'		=> esc_html__( 'Footer ', 'skrollex' ) . $footer,
				'before_widget'	=> '<section id="%1$s" class="widget %2$s">',
				'after_widget'	=> '</section>',
				'before_title'	=> '<h5 class="section-nav-title">',
				'after_title'	=> '</h5>',
			) );
		}
	}
}
add_action('widgets_init' , 'skrollex_register_sidebars', 80);
/**
 * Load predefined settings for contact form
 */
if (!function_exists('skrollex_default_contact_form')) {
	function skrollex_default_contact_form(){
		if(class_exists('WPCF7_ContactForm')){
			$forms = WPCF7_ContactForm::find();
			$foundForm = false;
			foreach($forms as $key => $form){
				if($form->title() === 'Skrollex'){
					$foundForm = true;
					break;
				}
			}
			if(!$foundForm){
				$theid = null;
				$contact_form = wpcf7_contact_form( $theid );
				if ( empty( $contact_form ) ) {
					$contact_form = WPCF7_ContactForm::get_template();
				}
				$contact_form->set_title('Skrollex');
				$properties = $contact_form->get_properties();
				$properties['form'] = "<div><input type=\"hidden\" name=\"your-subject\" value=\"" . esc_html__('Contact Form', 'skrollex') . "\"></div>\n<div class=\"pure-g contact-form-content\">\n<div class=\"pure-u-1 pure-u-sm-12-24\">[text* your-name placeholder \"" . esc_html__('Name', 'skrollex') . "\"]</div>\n<div class=\"pure-u-1 pure-u-sm-12-24\">[email* your-email placeholder \"" . esc_html__('Email', 'skrollex') . "\"]</div>\n<div class=\"pure-u-1\">[textarea your-message placeholder \"" . esc_html__('Message', 'skrollex') . "\"]</div>\n<div class=\"pure-u-1\">[submit class:button \"" . esc_html__('Send', 'skrollex') . "\"]</div>\n</div>";
				$contact_form->set_properties( $properties );
				do_action( 'wpcf7_save_contact_form', $contact_form );
				$form_id = $contact_form->save();
			}
		}
	}
}
add_action( 'after_setup_theme', 'skrollex_default_contact_form', 100);
/**
 * Create Help page
 */
if (!function_exists('skrollex_create_help')) {
	function skrollex_create_help(){
		$doc_page_id = get_theme_mod('doc_page_id');
		if($doc_page_id === FALSE || null == get_post($doc_page_id)){
			$doc['post_type']    = 'page';
			$doc['post_content'] = '[sx_content file="includes/content/help.html"]';
			$doc['post_parent']  = 0;
			$doc['post_status']  = 'publish';
			$doc['post_title']   = esc_html__('Theme [Help]', 'skrollex');
			$new_docid = wp_insert_post($doc);
			set_theme_mod('doc_page_id', $new_docid);
		}
	}
}
add_action('after_setup_theme' , 'skrollex_create_help', 800);
/**
 * Load predefined menu items when you first activate the theme.
 */
if(current_user_can('administrator')){
	if (!function_exists('skrollex_default_settings')) {
		function skrollex_default_settings(){
			if ( isset($_GET['activated']) || isset($_GET['reset_default_settings']) ) {
				if( function_exists('skrollex_default_sidebars') ) {
					skrollex_default_sidebars();
				}
				// Main menu
				$header_menu_name = 'Skrollex Menu 1';
				$header_menu_exists = wp_get_nav_menu_object($header_menu_name);
				if (!$header_menu_exists) {
					$header_menu_id = wp_create_nav_menu($header_menu_name);
					wp_update_nav_menu_item($header_menu_id, 0, array(
						'menu-item-title' => esc_html__('Home', 'skrollex'),
						'menu-item-url' => home_url('/#home'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($header_menu_id, 0, array(
						'menu-item-title' => esc_html__('About', 'skrollex'),
						'menu-item-url' => home_url('/#about'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($header_menu_id, 0, array(
						'menu-item-title' => esc_html__('Team', 'skrollex'),
						'menu-item-url' => home_url('/#team'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($header_menu_id, 0, array(
						'menu-item-title' => esc_html__('Services', 'skrollex'),
						'menu-item-url' => home_url('/#services'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($header_menu_id, 0, array(
						'menu-item-title' => esc_html__('Work', 'skrollex'),
						'menu-item-url' => home_url('/#work'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($header_menu_id, 0, array(
						'menu-item-title' => esc_html__('Skills', 'skrollex'),
						'menu-item-url' => home_url('/#skills'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($header_menu_id, 0, array(
						'menu-item-title' => esc_html__('Blog', 'skrollex'),
						'menu-item-url' => home_url('/blog/'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($header_menu_id, 0, array(
						'menu-item-title' => esc_html__('Contact', 'skrollex'),
						'menu-item-url' => home_url('/#contact'),
						'menu-item-status' => 'publish'
					));
				}
				// Extended menu
				$extended_menu_name = 'Skrollex Menu 2';
				$extended_menu_exists = wp_get_nav_menu_object($extended_menu_name);
				if (!$extended_menu_exists) {
					$extended_menu_id = wp_create_nav_menu($extended_menu_name);
					$doc_page_id = get_theme_mod('doc_page_id');
					wp_update_nav_menu_item($extended_menu_id, 0, array(
						'menu-item-title' => esc_html__('Help', 'skrollex'),
						'menu-item-attr-title' => esc_html__('Manual', 'skrollex'),
						'menu-item-url' => $doc_page_id ? get_permalink($doc_page_id) : home_url('/theme-help'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($extended_menu_id, 0, array(
						'menu-item-title' => esc_html__('Process', 'skrollex'),
						'menu-item-attr-title' => esc_html__('Our Workflow', 'skrollex'),
						'menu-item-url' => home_url('/#process'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($extended_menu_id, 0, array(
						'menu-item-title' => esc_html__('Numbers', 'skrollex'),
						'menu-item-attr-title' => esc_html__('Some Facts', 'skrollex'),
						'menu-item-url' => home_url('/#numbers'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($extended_menu_id, 0, array(
						'menu-item-title' => esc_html__('How We Work', 'skrollex'),
						'menu-item-attr-title' => esc_html__('Awesome', 'skrollex'),
						'menu-item-url' => home_url('/#how-we-work'),
						'menu-item-status' => 'publish'
					));
					wp_update_nav_menu_item($extended_menu_id, 0, array(
						'menu-item-title' => esc_html__('Who We Are', 'skrollex'),
						'menu-item-attr-title' => esc_html__('We Are Designers', 'skrollex'),
						'menu-item-url' => home_url('/#who-we-are'),
						'menu-item-status' => 'publish'
					));
				}
				$curLoc = get_theme_mod('nav_menu_locations');
				if(!isset($curLoc['skrollex-primary']) || !$curLoc['skrollex-primary'] || !wp_get_nav_menu_object($curLoc['skrollex-primary'])){
					$curLoc['skrollex-primary'] = wp_get_nav_menu_object($header_menu_name)->term_id;
				}
				if(!isset($curLoc['skrollex-extended']) || !$curLoc['skrollex-extended'] || !wp_get_nav_menu_object($curLoc['skrollex-extended'])){
					$curLoc['skrollex-extended'] = wp_get_nav_menu_object($extended_menu_name)->term_id;
				}
				set_theme_mod('nav_menu_locations', $curLoc);
				if(get_page_by_path('blog') === NULL){
					wp_insert_post(array(
						'post_title'  => esc_html__('Blog', 'skrollex'),
						'post_type' => 'page',
						'post_status' => 'publish'
					));
				}
				$blog   = get_page_by_path( 'blog' );
				update_option( 'page_for_posts', $blog->ID );
			}
		}
	}
	add_action( 'load-themes.php', 'skrollex_default_settings');
}