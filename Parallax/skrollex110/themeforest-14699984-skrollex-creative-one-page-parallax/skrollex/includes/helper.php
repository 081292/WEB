<?php
/**
 * Helper Tools
 */
class Skrollex_Helper {
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
		add_filter( 'skrollex_rich', array( $this, 'rich' ), 10 );
		add_filter( 'skrollex_non_rich', array( $this, 'non_rich' ), 10 );
		add_filter( 'wp_title', array( $this, 'non_rich' ), 10 );
		add_filter( 'single_post_title', array( $this, 'non_rich' ), 10 );
		add_filter( 'the_title', array( $this, 'non_rich' ), 10 );
		add_filter( 'bloginfo', array( $this, 'non_rich' ), 10 );	
	}
	/**
	 * Print class for post meta
	 * 
	 * @param string $class
	 */
	public static function  echo_post_meta_class($class = ''){
		$classes = array('post-meta');
		$left_sidebar_active = layers_can_show_sidebar( 'left-sidebar' );
		$right_sidebar_active = layers_can_show_sidebar( 'right-sidebar' );
		if( $left_sidebar_active && $right_sidebar_active ){
			$classes[] = 'pure-u-1';
		} else if( $left_sidebar_active ){
			$classes[] = 'pure-u-1 pure-u-md-6-24';
		} else if( $right_sidebar_active ){
			$classes[] = 'pure-u-1 pure-u-md-6-24 text-right';
		} else {
			$classes[] = 'pure-u-1 pure-u-md-6-24';
		}
		$classes[] = 'background-transparent';
		$classes[] = 'colors-' . layers_get_theme_mod('blog_colors');
		if( '' != $class ) $classes[] = $class;
		$res_arr = array_unique( array_map( 'esc_attr', $classes ) );
		echo 'class="' , join( ' ', $res_arr ) , '"';
	}
	/**
	 * Print class for post body
	 * 
	 * @param string $class
	 */
	public static function  echo_post_body_class($class = array()){
		$classes = array('colors-' . layers_get_theme_mod('post_colors'), 'post-body');
		$left_sidebar_active = layers_can_show_sidebar( 'left-sidebar' );
		$right_sidebar_active = layers_can_show_sidebar( 'right-sidebar' );
		if( ($left_sidebar_active && $right_sidebar_active) || 'post' != get_post_type()){
			$classes[] = 'pure-u-1';
		} else if( $left_sidebar_active ){
			$classes[] = 'pure-u-1 pure-u-md-18-24';
		} else if( $right_sidebar_active ){
			$classes[] = 'pure-u-1 pure-u-md-18-24';
		} else {
			$classes[] = 'pure-u-1 pure-u-md-18-24';
		}
		if( is_home() ) {
			$classes[] = 'article-blog';
		}else if(is_single()){
			$classes[] = 'article-post';
		}else if(is_archive()){
			$classes[] = 'article-archive';
		}else if(is_search()){
			$classes[] = 'article-search';
		}else if(is_author()){
			$classes[] = 'article-author';
		}else if(is_page()){
			$classes[] = 'article-page';
		}else{
			$classes[] = 'article-other';
		}
		$classes = array_merge($classes, $class);
		$res_arr = array_unique( array_map( 'esc_attr', $classes ) );
		echo 'class="' , join( ' ', $res_arr ) , '"';
	}
	/**
	 * Print post meta
	 * 
	 * @param string $class
	 */
	public static function  echo_post_meta($class = ''){
		if('post' != get_post_type()){
			return;
		}
		do_action('layers_before_list_post_meta');
		$left_sidebar_active = layers_can_show_sidebar( 'left-sidebar' );
		$right_sidebar_active = layers_can_show_sidebar( 'right-sidebar' );
		$post_id = get_the_ID();
		$the_categories = get_the_category( $post_id );
		$author = sprintf( wp_kses(__( '<a href="%1$s" title="%2$s" rel="author">%3$s</a>' , 'skrollex'), Skrollex_Ext::trusted_tags() ),
			esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ),
			esc_attr( sprintf( esc_html__( 'View all posts by %s', 'skrollex' ), get_the_author() ) ),
			esc_html( get_the_author() )
		);
		$categories = array();
		if($the_categories){
			foreach ( $the_categories as $category ){
				$categories[] = ' <a href="'.get_category_link( $category->term_id ).'" title="' . esc_attr( sprintf( esc_html__( "View all posts in %s", 'skrollex' ), $category->name ) ) . '">'. esc_html($category->name) .'</a>';
			}
		}
		if(!$left_sidebar_active || !$right_sidebar_active){
		?>
			<div <?php self::echo_post_meta_class($class) ?>>
				<a href="<?php the_permalink(); ?>">
					<div class="post-day heading"><span><?php self::post_day(); ?></span></div>
					<div class="post-year heading"><?php self::post_month(); ?> <?php self::post_year(); ?></div>
				</a>
				<div class="post-author"><i class="fa fa-user"></i> <?php echo $author ?></div>
				<div class="post-comments"><i class="fa fa-comments-o"></i> <?php comments_popup_link(esc_html__('No Comments', 'skrollex'), esc_html__('1 Comment', 'skrollex'), esc_html__('% Comments', 'skrollex')); ?></div>
				<?php
					if($the_categories){
						echo '<div class="post-categories"><i class="l-folder-open-o"></i> ' . implode( esc_html__( ', ' , 'skrollex' ), $categories ) . '</div>';
					}
				?>
				<div class="post-permalink"><i class="fa fa-link"></i> <a href="<?php the_permalink(); ?>" class="page-transition"><?php esc_html_e( 'Permalink' , 'skrollex' ); ?></a></div>
			</div>
		<?php
		}else{
		?>
			<div <?php self::echo_post_meta_class($class ? $class . ' post-meta-top' : 'post-meta-top') ?>>
				<span class="meta-item"><i class="fa fa-clock-o"></i> <?php the_time(get_option( 'date_format' )); ?></span>
				<span class="meta-item"><i class="fa fa-user"></i> <?php echo $author; ?></span>
				<span class="meta-item"><i class="fa fa-comments-o"></i> <?php comments_popup_link(esc_html__('No Comments', 'skrollex'), esc_html__('1 Comment', 'skrollex'), esc_html__('% Comments', 'skrollex')); ?></span>
				<?php
					if($the_categories){
						echo '<span class="meta-item"><i class="l-folder-open-o"></i> ' . implode( esc_html__( ', ' , 'skrollex' ), $categories ) . '</span>';
					}
				?>
				<span class="meta-item"><i class="fa fa-link"></i> <a href="<?php the_permalink(); ?>" class="page-transition"><?php esc_html_e( 'Permalink' , 'skrollex' ); ?></a></span>
			</div>
		<?php
		}
		do_action('layers_after_list_post_meta');
	}
	/**
	 * Return color class for header
	 * 
	 * @return string
	 */
	public static function header_colors_1(){
		return 'colors-' . layers_get_theme_mod('header_colors');
	}
	/**
	 * Return alternative color class for header
	 * 
	 * @return string
	 */
	public static function header_colors_2(){
		return 'colors-' . layers_get_theme_mod('header_colors_2');
	}
	/**
	 * Return color class for preloader
	 * 
	 * @return string
	 */
	public static function preloader_colors(){
		return 'colors-' . layers_get_theme_mod('preloader_colors');
	}
	/**
	 * Print class for top navigation
	 */
	public static function top_nav_class($arr = array()){
		$classes = array_merge( array(), $arr );
		$classes[] = self::header_colors_1();
		$header_align_option = layers_get_theme_mod( 'header-menu-layout' );
		if( 'header-logo-left' == $header_align_option ){
			$classes[] = 'top-nav-logo-left';
		} else if( 'header-logo-right' == $header_align_option ){
			$classes[] = 'top-nav-logo-right';
		}
		echo ('class="' . esc_attr(join(' ', $classes)) . '"');
	}
	/**
	 * Print class for left page border
	 */
	public static function page_boder_left_class($arr = array()){
		$classes = array_merge( array('page-border ', 'heading', 'left', self::header_colors_1()), $arr);
		echo ('class="' . esc_attr(join(' ', $classes)) . '"');
	}
	/**
	 * Print class for right page border
	 */
	public static function  page_boder_right_class($arr = array()){
		$classes = array_merge( array('page-border ', 'heading', 'right', self::header_colors_1()), $arr);
		echo ('class="' . esc_attr(join(' ', $classes)) . '"');
	}
	/**
	 * Print class for bottom page border
	 */
	public static function  page_boder_bottom_class($arr = array()){
		$classes = array_merge( array('page-border ', 'heading', 'bottom', self::header_colors_1()), $arr);
		echo ('class="' . esc_attr(join(' ', $classes)) . '"');
	}
	/**
	 * Print class for top page border
	 */
	public static function  page_boder_top_class($arr = array()){
		$classes = array_merge( array('page-border ', 'heading', 'top', self::header_colors_1()), $arr);
		echo ('class="' . esc_attr(join(' ', $classes)) . '"');
	}
	/**
	 * Print class for dot scroll
	 */
	public static function  dot_skroll_class($arr = array()){
		$classes = array_merge( array(self::header_colors_1()), $arr);
		echo ('class="' . esc_attr(join(' ', $classes)) . '"');
	}
	/**
	 * Display classes for center page column
	 */
	public static function center_column_class($class = ''){
		$classes = array();
		$left_sidebar_active = layers_can_show_sidebar( 'left-sidebar' );
		$right_sidebar_active = layers_can_show_sidebar( 'right-sidebar' );
		// Set classes according to the sidebars
		if( $left_sidebar_active && $right_sidebar_active ){
			$classes[] = 'pure-u-1 pure-u-md-12-24';
		} else if( $left_sidebar_active ){
			$classes[] = 'pure-u-1 pure-u-md-18-24';
		} else if( $right_sidebar_active ){
			$classes[] = 'pure-u-1 pure-u-md-18-24';
		} else {
			$classes[] = 'pure-u-1';
		}
		// Apply any classes passed as parameter
		if( '' != $class ) $classes[] = $class;
		$classes = array_map( 'esc_attr', $classes );
		echo 'class="' . esc_attr(join(' ', array_unique($classes))) . '"';
	}
	/**
	 * Transform shortcodes and squares
	 */
	public static function rich($str){
		return self::squares_to_html(do_shortcode($str));
	}
	/**
	 * Display shortcodes and squares
	 */
	public static function e_rich($str){
		Skrollex_Ext::trusted( self::rich($str) );
	}
	/**
	 * Remove shortcodes, tags and squares
	 */
	public static function non_rich($str){
		return self::squares_to_text(wp_strip_all_tags(strip_shortcodes($str)));
	}
	/**
	 * Remove shortcodes, tags and squares and display it
	 */
	public static function e_non_rich($str){
		echo esc_html( self::non_rich($str) );
	}
	/**
	 * Remove squares
	 */
	public static function squares_to_text($str){
		return self::squares($str, '', '');
	}
	/**
	 * Transform squares to highlight
	 */
	public static function squares_to_html($str){
		return self::squares($str, '<span>', '</span>');
	}
	/**
	 * Transform squares
	 */
	static function squares($str, $astr='', $bstr=''){
		$acount = substr_count($str, '[');
		$bcount = substr_count($str, ']');
		if($acount > 0 && $acount === $bcount){
			return str_replace(']', $bstr, str_replace('[', $astr, $str));
		}else{
			return $str;
		}
	}
	/**
	 * Display post day
	 */
	public static function post_day(){
		the_time('d');
	}
	/**
	 * Display post month
	 */
	public static function post_month(){
		the_time('M');
	}
	/**
	 * Display post year
	 */
	public static function post_year(){
		the_time('Y');
	}
	/**
	 * Returns current URL
	 */
	public static function current_url(){
		global $wp;
		return home_url( $wp->request );
	}
	/**
	 * Add data to HTML needed for javascript
	 */
	public static function data_config(){
		echo 'data-skrollex-config="' . esc_attr('{isInitColorPanel: ' . (is_customize_preview() || is_admin_bar_showing() || isset($_GET['x40customize']) ? 'true' : 'false') . ', isCustomizer: ' . (is_customize_preview() ? 'true' : 'false') . ', adminUrl: \'' . admin_url() . '\', ajaxUrl: \'' . admin_url( 'admin-ajax.php' ) . '\', homeUri: \'' . home_url() . '\', themeUri: \'' . get_stylesheet_directory_uri() . '/\', permalink: \'' .  self::current_url() . '\', colors: \'' . layers_get_theme_mod('colors_css') . '\'}') . '"';
	}
	/**
	 * Display post thumbnail
	 */
	public static function post_thumbnail(){
		if ( has_post_thumbnail() ) {
			the_post_thumbnail();
		}
	}
}

/**
 * Custom walker class for main menu.
 */
class Skrollex_Walker_Top_Menu extends Walker_Nav_Menu {
	public function start_lvl(&$output, $depth = 0, $args = array()) {
		$colLt = layers_get_theme_mod('header_colors');
		$indent = str_repeat("\t", $depth);
		$output .= "\n$indent<ul class=\"sub-menu background-" . $colLt . " heading-" . $colLt . " link-heading-" . $colLt . "\">\n";
	}
}



