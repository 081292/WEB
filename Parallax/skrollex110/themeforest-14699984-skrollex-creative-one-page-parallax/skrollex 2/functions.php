<?php
define('SKROLLEX_SLUG', 'skrollex');
require_once get_stylesheet_directory() . '/includes/plugin-activation.php';
require_once get_stylesheet_directory() . '/includes/assets-ver.php';
require_once get_stylesheet_directory() . '/includes/helper.php';
require_once get_stylesheet_directory() . '/includes/migrator-custom.php';
require_once get_stylesheet_directory() . '/includes/customizer.php';
require_once get_stylesheet_directory() . '/includes/extension.php';
/**
 * Localize
 */
if (!function_exists('skrollex_localize')) {
	add_action('after_setup_theme', 'skrollex_localize');
	function skrollex_localize() {
		load_child_theme_textdomain('skrollex', get_stylesheet_directory() . '/languages');
	}
}

/**
 * SetFont and Theme Defaults
 */
add_filter('layers_customizer_control_defaults', 'skrollex_customizer_defaults');
function skrollex_customizer_defaults($defaults) {
	$defaults = array(
		'body-fonts' => 'Raleway',
		'form-fonts' => 'Raleway',
		'heading-fonts' => 'Raleway',
		'header-width' => 'layout-boxed',
		'header-menu-layout' => 'header-logo-left',
		'header-background-color' => '',
		'footer-width' => 'layout-fullwidth',
		'footer-sidebar-count' => '1',
		'show-layers-badge' => false
	);
	return $defaults;
}
/**
 * Add body classes
 */
add_filter('body_class', 'skrollex_body_class');
function skrollex_body_class($classes) {
	$classes[] = 'no-colors-label';
	$classes[] = 'background-' . layers_get_theme_mod('mobile_nav_colors');
	return $classes;
}
/*
 * Load Styles
 */
if( ! function_exists( 'skrollex_child_styles' ) ) {	
	function skrollex_child_styles() {
		wp_enqueue_style('layers-font-awesome');
		wp_enqueue_style('animate.css', get_stylesheet_directory_uri() . '/assets/lib/bower_components/animate.css/animate.min.css', array(), SKROLLEX_ASSETS);
		wp_enqueue_style('purecss', get_stylesheet_directory_uri() . '/assets/lib/pure/pure-min.css', array(), SKROLLEX_ASSETS);
		wp_enqueue_style('purecss-grids-responsive', get_stylesheet_directory_uri() . '/assets/lib/pure/grids-responsive-min.css', array(), SKROLLEX_ASSETS);
		wp_enqueue_style('linecons', get_stylesheet_directory_uri() . '/assets/lib/linecons/style.css', array(), SKROLLEX_ASSETS);
		wp_enqueue_style('custom-mit-code', get_stylesheet_directory_uri() . '/assets/lib/mit-code/style.css', array(), SKROLLEX_ASSETS);
		wp_enqueue_style('custom-gnu-code', get_stylesheet_directory_uri() . '/assets/lib/gnu-code/style.css', array(), SKROLLEX_ASSETS);
		wp_enqueue_style('minicolors', get_stylesheet_directory_uri() . '/assets/lib/bower_components/minicolors/jquery.minicolors.css', array(), SKROLLEX_ASSETS);
		wp_enqueue_style('skrollex_child_styles', get_stylesheet_directory_uri() . '/assets/css/style.css', array(), SKROLLEX_ASSETS);
		$colors_css_file = layers_get_theme_mod('colors_css');
		if($colors_css_file){
			$updir = wp_upload_dir();
			$colors_css_path = ($colors_css_file === 'colors-custom.css') ? $updir['baseurl'] . '/skrollex-data/' : get_stylesheet_directory_uri() . '/assets/css/';
			$colors_css_dir = ($colors_css_file === 'colors-custom.css') ? $updir['basedir'] . '/skrollex-data/' : get_stylesheet_directory() . '/assets/css/';
			wp_enqueue_style('theme-color-schemes', $colors_css_path . rawurlencode($colors_css_file), array(), filemtime($colors_css_dir . $colors_css_file));
		}
	}
}
add_action('wp_enqueue_scripts', 'skrollex_child_styles', 50);
/*
 * Load Admin Styles
 */
if( ! function_exists( 'skrollex_child_admin_styles' ) ) {	
	function skrollex_child_admin_styles() {
		if ( is_customize_preview() ) {
			wp_enqueue_style('skrollex_child_admin_customizer_styles', get_stylesheet_directory_uri() . '/assets/css/admin/admin-customizer.css', array(), SKROLLEX_ASSETS);
		}else{
			wp_enqueue_style('skrollex_child_admin_styles', get_stylesheet_directory_uri() . '/assets/css/admin/admin.css', array(), SKROLLEX_ASSETS);
		}
	}
}
add_action('admin_enqueue_scripts', 'skrollex_child_admin_styles', 50);
/**
 * Load Scripts
 */	
if( ! function_exists( 'skrollex_child_scripts' ) ) {
	function skrollex_child_scripts() {
		wp_enqueue_script('jquery-cookie', get_stylesheet_directory_uri() . '/assets/lib/bower_components/jquery-cookie/jquery.cookie.js', array('jquery'), SKROLLEX_ASSETS, true);
		wp_enqueue_script('masonry');
		wp_enqueue_script('less', get_stylesheet_directory_uri() . '/assets/lib/bower_components/less.js/dist/less.min.js', array(), SKROLLEX_ASSETS, true);
		wp_enqueue_script('tween.js', get_stylesheet_directory_uri() . '/assets/lib/tween/tween.min.js', array(), SKROLLEX_ASSETS, true);
		wp_enqueue_script('modernizr', get_stylesheet_directory_uri() . '/assets/lib/bower_components/modernizr/modernizr.js', array(), SKROLLEX_ASSETS, true);
		wp_enqueue_script('snap.svg', get_stylesheet_directory_uri() . '/assets/lib/bower_components/snap.svg/dist/snap.svg-min.js', array(), SKROLLEX_ASSETS, true);
		wp_enqueue_script('minicolors', get_stylesheet_directory_uri() . '/assets/lib/bower_components/minicolors/jquery.minicolors.min.js', array('jquery'), SKROLLEX_ASSETS, true);
		wp_enqueue_script('lettering', get_stylesheet_directory_uri() . '/assets/lib/bower_components/textillate/assets/jquery.lettering.js', array(), SKROLLEX_ASSETS, true);
		wp_enqueue_script('fittext', get_stylesheet_directory_uri() . '/assets/lib/bower_components/textillate/assets/jquery.fittext.js', array(), SKROLLEX_ASSETS, true);
		wp_enqueue_script('textillate', get_stylesheet_directory_uri() . '/assets/lib/bower_components/textillate/jquery.textillate.js', array('lettering', 'fittext'), SKROLLEX_ASSETS, true);
		$gmak = defined('GOOGLE_MAPS_API_KEY') ? GOOGLE_MAPS_API_KEY :  layers_get_theme_mod('site-google-maps-api-key');
		$gmaks = isset($gmak) ? ('?key=' . $gmak) : '';
		wp_enqueue_script( LAYERS_THEME_SLUG . " -map-api","//maps.googleapis.com/maps/api/js" . $gmaks, array(), SKROLLEX_ASSETS, true);
		wp_enqueue_script('base64', get_stylesheet_directory_uri() . '/assets/lib/stringencoders-v3.10.3/javascript/base64.js', array(), SKROLLEX_ASSETS, true);
		wp_enqueue_script('layers-skrollex-script-bundle', get_stylesheet_directory_uri() . '/assets/js/script-bundle.min.js', array('jquery','masonry'), SKROLLEX_ASSETS, true);
	}
}
add_action('wp_enqueue_scripts', 'skrollex_child_scripts');
/**
 * Load Admin Scripts
 */	
if( ! function_exists( 'skrollex_child_admin_scripts' ) ) {
	function skrollex_child_admin_scripts() {
		wp_enqueue_script('ckeditor', get_stylesheet_directory_uri() . '/assets/lib/ckeditor/ckeditor.js', array(), SKROLLEX_ASSETS, true);
		wp_enqueue_script('skrollex-admin-script', get_stylesheet_directory_uri() . '/assets/js/admin-bundle.min.js', array(), SKROLLEX_ASSETS, true);
	}
}
add_action('admin_enqueue_scripts', 'skrollex_child_admin_scripts');
/**
 * Add comment as customize control
 */
if (!function_exists('skrollex_customize_register')) {
	function skrollex_customize_register($wp_customize){
		class Skrollex_Logo_Comment_Control extends WP_Customize_Control {
			public function render_content() {
				Skrollex_Ext::trusted( $this->label );
			}
		}
		$wp_customize->add_setting( 'site_logo_header_comment', array('sanitize_callback' => NULL) );
		$wp_customize->add_control( new Skrollex_Logo_Comment_Control( $wp_customize, 'site_logo_header_comment', array(
			    'label'    => wp_kses(__( 'Use [ ] in Site Title for highlighting. For example: Comp[any] for Comp<span class="highlight-text">any</span>' , 'skrollex'), Skrollex_Ext::trusted_tags() ),
			    'section'  => 'title_tagline',
			    'settings' => 'site_logo_header_comment'
			) ) );
	}
}
add_action( 'customize_register', 'skrollex_customize_register', 1);
/**
 * Load default settings
 */
require_once get_stylesheet_directory() . '/includes/default-settings.php';

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

// Comment this line if presets in includes/generated is cleared or has wrong content
require_once get_stylesheet_directory() . '/includes/presets.php';

require_once get_stylesheet_directory() . '/includes/preset-generator.php';

if ( ! function_exists( 'skrollex_comment' ) ) :
/**
 * Template for comments and pingbacks.
 * Used as a callback by wp_list_comments() for displaying the comments.
 */
function skrollex_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;
	switch ( $comment->comment_type ) :
		case '' :
	?>
	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">
		<div id="comment-<?php comment_ID(); ?>">
			<div class="comment-author vcard">
				<?php echo get_avatar( $comment, 56 ); ?>
				<?php printf( wp_kses(__( '%s', 'skrollex'), Skrollex_Ext::trusted_tags() ), sprintf( '<cite class="fn">%s</cite>', get_comment_author_link() ) ); ?>
			</div>
			<?php if ( $comment->comment_approved == '0' ) : ?>
				<em class="comment-awaiting-moderation"><?php esc_html_e( 'Your comment is awaiting moderation.', 'skrollex' ); ?></em>
				<br />
			<?php endif; ?>

			<div class="comment-meta commentmetadata"><a href="<?php echo esc_url( get_comment_link( $comment->comment_ID ) ); ?>">
				<?php
					printf( wp_kses(__( '%1$s at %2$s', 'skrollex'), Skrollex_Ext::trusted_tags() ), get_comment_date(),  get_comment_time() ); ?></a><?php edit_comment_link( wp_kses(__( '(Edit)', 'skrollex'), Skrollex_Ext::trusted_tags() ), ' ' );
				?>
			</div>

			<div class="comment-body"><?php comment_text(); ?></div>

			<div class="reply">
				<?php comment_reply_link( array_merge( $args, array( 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
			</div>
		</div>

	<?php
			break;
		case 'pingback'  :
		case 'trackback' :
	?>
	<li class="post pingback">
		<p><?php esc_html_e( 'Pingback:', 'skrollex' ); ?> <?php comment_author_link(); ?><?php edit_comment_link( wp_kses(__( '(Edit)', 'skrollex'), Skrollex_Ext::trusted_tags() ), ' ' ); ?></p>
	<?php
			break;
	endswitch;
}
endif;
// Init Skrollex_Helper
Skrollex_Helper::get_instance();
// Init Skrollex_Ext
Skrollex_Ext::get_instance();
