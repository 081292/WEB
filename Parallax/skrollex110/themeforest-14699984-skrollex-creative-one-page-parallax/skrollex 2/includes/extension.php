<?php
/**
 * Scrollex Widgets main class
 */
class Skrollex_Ext {
	/**
	 * Create or get instance
	 */
	private static $instance;
	public static function get_instance() {
		if (!self::$instance) {
			self::$instance = new self();
		}
		return self::$instance;
	}
	/**
	 * Constructor
	 */
    private function __construct() {
		// Add actions
		add_action('widgets_init' , array($this, 'widgets_init'), 50 );
		add_action('wp_ajax_skrollex_widget_action', array($this, 'widget_action'));
		add_action('admin_menu', array($this, 'admin_menu'));
		if(defined('SKROLLEX_DO_CLEAN')) {
			add_action('admin_init', array($this, 'do_clean'));
		}
		// Add filters
		add_filter( 'layers_customizer_controls', array( $this, 'customizer_controls' ), 50 );
	}
	/**
	 * Utility function. Display rich text editor
	 */
	static function rte_input($opt){
		$val = isset($opt['value']) ? $opt['value'] : '';
		?>
		<textarea  <?php echo ('class="hidden-field"'	.	' id="' . esc_attr($opt['id']) . '"' .	( isset($opt['name']) ? (' name="' . esc_attr($opt['name']) . '"') : '' ) ); ?>><?php echo esc_textarea($val); ?></textarea>
		<div <?php echo ('class="content-editor' . ($opt['class'] ? (' ' . esc_attr($opt['class'])) : '') . '"' .	' data-editor-content="' . htmlspecialchars($val) . '"'); ?>></div>
		<?php
	}
	/**
	 * Utility function. Find css files for color schemes
	 */
	static function colors_csses(){
		$res = array();
		$dir = get_stylesheet_directory() . '/assets/css';
		if(is_readable($dir)){
			$files = scandir($dir);
			foreach ($files as $filename) {
				if(substr($filename, -4) === '.css' && $filename !== 'style.css' && $filename !== 'style.min.css'){
					$res[$filename] = $filename;
				}
			}
		}
		$updir = wp_upload_dir();
		$dir2 = $updir['basedir'] . '/skrollex-data';
		if(is_readable($dir2)){
			$files2 = scandir($dir2);
			foreach ($files2 as $filename2) {
				if($filename2 === 'colors-custom.css'){
					$res[$filename2] = $filename2;
				}
			}
		}
		return $res;
	}
	/**
	 * Utility function. Return color schemes for tag select
	 */
	public static function colors(){
		return array(
			'a' => 'A',
			'b' => 'B',
			'c' => 'C',
			'd' => 'D',
			'e' => 'E',
			'f' => 'F',
			'g' => 'G',
			'h' => 'H',
			'i' => 'I',
			'j' => 'J',
			'k' => 'K',
			'l' => 'L',
			'm' => 'M',
			'n' => 'N',
			'o' => 'O',
			'p' => 'P',
			'q' => 'Q',
			'r' => 'R',
			's' => 'S',
			't' => 'T',
			'u' => 'U',
			'v' => 'V',
			'w' => 'W',
			'x' => 'X',
			'y' => 'Y',
			'z' => 'Z',
			'none' => esc_html__('None', 'skrollex')
		);
	}
	/**
	 * Add admin pages.
	 */
	function admin_menu(){
		add_theme_page( esc_html__('Custom Colors', 'skrollex'), esc_html__('Custom Colors', 'skrollex'), 'edit_themes', 'skrollex_custom_colors', array($this, 'save_custom_css') );
	}
	/**
	 * Save color scheme.
	 */
	function save_custom_css() {
		global $wp_filesystem;
		if(isset($_REQUEST['command']) && $_REQUEST['command'] === 'save_custom_css'){
			if(current_user_can('administrator')){
				$updir = wp_upload_dir();
				$file_dir = $updir['basedir'] . '/skrollex-data';
				$file_name = 'colors-custom.css';
				$file_path = $file_dir . '/' . $file_name;
				$url = wp_nonce_url(admin_url('themes.php?page=skrollex_custom_colors'), "n_action", "n_name");
				$fields = array('command', 'content', 'permalink');
				$type = '';
				if(false === ($creds = request_filesystem_credentials($url, $type, false, $updir['basedir'], $fields))) {
					return;
				}
				if ( ! WP_Filesystem($creds) ) {
					request_filesystem_credentials($url, $type, true, $updir['basedir'], $fields);
					return;
				}
				$dir_ok = $wp_filesystem->is_dir($file_dir);
				if(!$dir_ok){
					$dir_ok = $wp_filesystem->mkdir($file_dir);
				}
				if(!$dir_ok){
					echo esc_html(__('Unable to create directory:', 'skrollex') . ' ' . $file_dir);
					wp_die();
				}else if($wp_filesystem->put_contents($file_path, $_REQUEST['content'])){
					set_theme_mod(LAYERS_THEME_SLUG . '-colors_css', $file_name);
					wp_redirect($_REQUEST['permalink']);
					echo '<div class="redirect" data-url="' . esc_url($_REQUEST['permalink']) . '"></div>';
				}else{
					echo esc_html(__('File is not writable:', 'skrollex') . ' ' . $file_path);
					wp_die();
				}
			}else{
				echo esc_html(__('Access Denied', 'skrollex'));
				wp_die();
			}
		}else{
			wp_redirect(add_query_arg('show-color-panel', 'yes', get_home_url()));
			echo '<div class="redirect" data-url="' . esc_url(add_query_arg('show-color-panel', 'yes', get_home_url())) . '"></div>';
		}
	}
	/**
	 * Remove garbage from database.
	 * At failures in the database may be unnecessary widgets. This greatly
	 * reduces performance and can lead to exceeding the specified limits.
	 */
	function do_clean() {
		if(SKROLLEX_EXTENSION_IS_LAYERS){
			$sidebars_widgets = get_option('sidebars_widgets');
			$sidebars_widgets['wp_inactive_widgets'] = array();
			foreach ($sidebars_widgets as $key => $value) {
				$needle = 'orphaned_widgets_';
				if(substr($key, 0, strlen($needle))==$needle){
					unset($sidebars_widgets[$key]);
				}
				$needle = 'obox-layers-builder-';
				$nln = strlen($needle);
				if(substr($key, 0, $nln)==$needle){
					$num = (int)substr($key, $nln);
					if(!get_post($num)){
						unset($sidebars_widgets[$key]);
					}
				}
			}
			update_option('sidebars_widgets', $sidebars_widgets);
			foreach ($GLOBALS['wp_widget_factory']->widgets as $fw_key => $fw_value) {
				$w_id_base = $fw_value->id_base;
				if($w_id_base === 'monster'){
					continue;
				}
				$opt_key = 'widget_' . $w_id_base;
				$opt_value = get_option($opt_key);
				if(!is_array($opt_value)){
					continue;
				}
				$tested_num = 0;
				$deleted_num = 0;
				foreach ($opt_value as $num_key => $num_value) {
					if(!is_array($num_value) || !is_numeric($num_key)){
						continue;
					}
					$tested_num++;
					$found = FALSE;
					$w_id = $w_id_base . '-' . $num_key;
					foreach ($sidebars_widgets as $sb_key => $sb_value) {
						if(!is_array($sb_value)){
							continue;
						}
						foreach ($sb_value as $w_key => $w_id_found) {
							if($w_id_found == $w_id){
								$found = TRUE;
								break;
							}
						}
						if($found){
							break;
						}
					}
					if(!$found){
						unset($opt_value[$num_key]);
						$deleted_num++;
					}
				}
				if($tested_num > 0 && $tested_num === $deleted_num){
					delete_option($opt_key);
				}else{
					update_option($opt_key, $opt_value);
				}
			}
		}
	}
	/**
	 * Init widgets
	 */
	function widgets_init() {
		require_once get_stylesheet_directory() . '/includes/lib/overlays/svg-overlay.php';
		require_once get_stylesheet_directory() . '/widgets/skrollex-widget.php';
		require_once get_stylesheet_directory() . '/widgets/skrollex-section-base.php';
		require_once get_stylesheet_directory() . '/widgets/skrollex-section-widget.php';
		require_once get_stylesheet_directory() . '/widgets/skrollex-video-bg-widget.php';
		require_once get_stylesheet_directory() . '/widgets/skrollex-image-bg-widget.php';
	}
	/**
	 * Ajax handler
	 */
	public function widget_action(){
		$class = new ReflectionClass($_POST[ 'php_class']);
		$widget = $class->newInstanceArgs(array());
		$widget->ajax();
	}
	/**
	* Set Customizer controls
	*/
	public static function customizer_controls($controls){
		$colors_csses = self::colors_csses();
		$colors_csses_keys = array_keys($colors_csses);
		$colors = self::colors();
		$colors_keys = array_keys($colors);
		// Site Colors
		$colors = array(
			'colors_css' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Color Schemes' , 'skrollex' ),
				'default' => $colors_csses_keys[0],
				'choices' => $colors_csses
			),
			'header_colors_2' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Navigation Color Scheme 1' , 'skrollex' ),
				'default' => 'b',
				'choices' => $colors
			),
			'header_colors' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Navigation Color Scheme 2' , 'skrollex' ),
				'default' => 'a',
				'choices' => $colors
			),
			'footer_colors' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Footer Color Scheme' , 'skrollex' ),
				'default' => 'p',
				'choices' => $colors
			),
			'overlay_colors' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Overlay Window Color Scheme' , 'skrollex' ),
				'default' => 'q',
				'choices' => $colors
			),
			'preloader_colors' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Preloader Color Scheme' , 'skrollex' ),
				'default' => 'o',
				'choices' => $colors
			),
			'ext_nav_colors_1' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Extended Menu Color Scheme 1' , 'skrollex' ),
				'default' => 'r',
				'choices' => $colors
			),
			'ext_nav_colors_2' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Extended Menu Color Scheme 2' , 'skrollex' ),
				'default' => 's',
				'choices' => $colors
			),
			'ext_nav_colors_3' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Extended Menu Color Scheme 3' , 'skrollex' ),
				'default' => 't',
				'choices' => $colors
			),
			'mobile_nav_colors' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Mobile Menu Color Scheme' , 'skrollex' ),
				'default' => 'k',
				'choices' => $colors
			),
			'blog_colors' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Blog Color Scheme' , 'skrollex' ),
				'default' => 'v',
				'choices' => $colors
			),
			'post_colors' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Post Color Scheme' , 'skrollex' ),
				'default' => 'w',
				'choices' => $colors
			),
			'default_page_colors' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Default Page Color Scheme' , 'skrollex' ),
				'default' => 'v',
				'choices' => $colors
			),
			'default_header_colors' => array(
				'type'     => 'layers-select',
				'label'    => esc_html__( 'Default Page Header Color Scheme' , 'skrollex' ),
				'default' => 'd',
				'choices' => $colors
			)
		);
		$controls['site-colors'] = $colors;
		return $controls;
	}
	/**
	 * Allowed HTML tags for user interface
	 */
	public static function trusted_tags() {
		$tags = array(
			'address' => array(),
			'a' => array(
				'href' => true,
				'rel' => true,
				'rev' => true,
				'name' => true,
				'target' => true,
			),
			'abbr' => array(),
			'acronym' => array(),
			'area' => array(
				'alt' => true,
				'coords' => true,
				'href' => true,
				'nohref' => true,
				'shape' => true,
				'target' => true,
			),
			'article' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'aside' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'audio' => array(
				'autoplay' => true,
				'controls' => true,
				'loop' => true,
				'muted' => true,
				'preload' => true,
				'src' => true,
			),
			'b' => array(),
			'bdo' => array(
				'dir' => true,
			),
			'big' => array(),
			'blockquote' => array(
				'cite' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'br' => array(),
			'button' => array(
				'disabled' => true,
				'name' => true,
				'type' => true,
				'value' => true,
			),
			'caption' => array(
				'align' => true,
			),
			'cite' => array(
				'dir' => true,
				'lang' => true,
			),
			'code' => array(),
			'col' => array(
				'align' => true,
				'char' => true,
				'charoff' => true,
				'span' => true,
				'dir' => true,
				'valign' => true,
				'width' => true,
			),
			'colgroup' => array(
				'align' => true,
				'char' => true,
				'charoff' => true,
				'span' => true,
				'valign' => true,
				'width' => true,
			),
			'del' => array(
				'datetime' => true,
			),
			'dd' => array(),
			'dfn' => array(),
			'details' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'open' => true,
				'xml:lang' => true,
			),
			'div' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'dl' => array(),
			'dt' => array(),
			'em' => array(),
			'fieldset' => array(),
			'figure' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'figcaption' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'font' => array(
				'color' => true,
				'face' => true,
				'size' => true,
			),
			'footer' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'form' => array(
				'action' => true,
				'accept' => true,
				'accept-charset' => true,
				'enctype' => true,
				'method' => true,
				'name' => true,
				'target' => true,
			),
			'h1' => array(
				'align' => true,
			),
			'h2' => array(
				'align' => true,
			),
			'h3' => array(
				'align' => true,
			),
			'h4' => array(
				'align' => true,
			),
			'h5' => array(
				'align' => true,
			),
			'h6' => array(
				'align' => true,
			),
			'header' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'hgroup' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'hr' => array(
				'align' => true,
				'noshade' => true,
				'size' => true,
				'width' => true,
			),
			'i' => array(),
			'img' => array(
				'alt' => true,
				'align' => true,
				'border' => true,
				'height' => true,
				'hspace' => true,
				'longdesc' => true,
				'vspace' => true,
				'src' => true,
				'usemap' => true,
				'width' => true,
			),
			'ins' => array(
				'datetime' => true,
				'cite' => true,
			),
			'kbd' => array(),
			'label' => array(
				'for' => true,
			),
			'legend' => array(
				'align' => true,
			),
			'li' => array(
				'align' => true,
				'value' => true,
			),
			'map' => array(
				'name' => true,
			),
			'mark' => array(),
			'menu' => array(
				'type' => true,
			),
			'nav' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'p' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'pre' => array(
				'width' => true,
			),
			'q' => array(
				'cite' => true,
			),
			's' => array(),
			'samp' => array(),
			'span' => array(
				'dir' => true,
				'align' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'section' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'small' => array(),
			'strike' => array(),
			'strong' => array(),
			'sub' => array(),
			'summary' => array(
				'align' => true,
				'dir' => true,
				'lang' => true,
				'xml:lang' => true,
			),
			'sup' => array(),
			'table' => array(
				'align' => true,
				'bgcolor' => true,
				'border' => true,
				'cellpadding' => true,
				'cellspacing' => true,
				'dir' => true,
				'rules' => true,
				'summary' => true,
				'width' => true,
			),
			'tbody' => array(
				'align' => true,
				'char' => true,
				'charoff' => true,
				'valign' => true,
			),
			'td' => array(
				'abbr' => true,
				'align' => true,
				'axis' => true,
				'bgcolor' => true,
				'char' => true,
				'charoff' => true,
				'colspan' => true,
				'dir' => true,
				'headers' => true,
				'height' => true,
				'nowrap' => true,
				'rowspan' => true,
				'scope' => true,
				'valign' => true,
				'width' => true,
			),
			'textarea' => array(
				'cols' => true,
				'rows' => true,
				'disabled' => true,
				'name' => true,
				'readonly' => true,
			),
			'tfoot' => array(
				'align' => true,
				'char' => true,
				'charoff' => true,
				'valign' => true,
			),
			'th' => array(
				'abbr' => true,
				'align' => true,
				'axis' => true,
				'bgcolor' => true,
				'char' => true,
				'charoff' => true,
				'colspan' => true,
				'headers' => true,
				'height' => true,
				'nowrap' => true,
				'rowspan' => true,
				'scope' => true,
				'valign' => true,
				'width' => true,
			),
			'thead' => array(
				'align' => true,
				'char' => true,
				'charoff' => true,
				'valign' => true,
			),
			'title' => array(),
			'tr' => array(
				'align' => true,
				'bgcolor' => true,
				'char' => true,
				'charoff' => true,
				'valign' => true,
			),
			'track' => array(
				'default' => true,
				'kind' => true,
				'label' => true,
				'src' => true,
				'srclang' => true,
			),
			'tt' => array(),
			'u' => array(),
			'ul' => array(
				'type' => true,
			),
			'ol' => array(
				'start' => true,
				'type' => true,
				'reversed' => true,
			),
			'var' => array(),
			'video' => array(
				'autoplay' => true,
				'controls' => true,
				'height' => true,
				'loop' => true,
				'muted' => true,
				'poster' => true,
				'preload' => true,
				'src' => true,
				'width' => true,
			),
		);
		$tags = array_map(array('self', 'add_global_attributes'), $tags);
		return $tags;
	}
	/**
	 * Add common attributes to tag list
	 */
	public static function add_global_attributes($value) {
		$global_attributes = array(
			'class' => true,
			'id' => true,
			'style' => true,
			'title' => true,
			'role' => true,
		);

		if ( true === $value )
			$value = array();

		if ( is_array( $value ) )
			return array_merge( $value, $global_attributes );

		return $value;
	}
	/**
	 * Echo trusted HTML
	 */
	public static function trusted($content) {
		echo wp_kses($content, self::trusted_tags());
	}

}
