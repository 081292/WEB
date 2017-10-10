<?php
/**
 * The template for displaying the header.
 * Displays all of the head element and everything up until the "wrapper-content" div.
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="state2 page-is-gated scroll-bar site-decoration-<?php echo esc_attr(layers_get_theme_mod('site-decoration')); ?>" <?php Skrollex_Helper::data_config(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no">
	<?php wp_head(); ?>
</head>
<body id="skrollex-body" <?php body_class(); ?>>
	<div class="gate colors-<?php echo esc_attr(layers_get_theme_mod('preloader_colors')) ?>">
		<div class="gate-content">
			<div class="gate-bar background-highlight"></div>
			<?php get_template_part( 'includes/lib/art/preloader', 'main' ); ?>
		</div>
	</div>
	<div <?php Skrollex_Helper::page_boder_top_class(array('main-navigation')); ?>></div>
	<div <?php Skrollex_Helper::page_boder_bottom_class(array('main-navigation')); ?>><a href="#top" class="to-top hover-effect"><?php Skrollex_Helper::e_rich(layers_get_theme_mod('site-to-top')); ?></a><a href="#scroll-down" class="scroll-down hover-effect"><?php Skrollex_Helper::e_rich(layers_get_theme_mod('site-scroll-down')); ?></a></div>
	<div <?php Skrollex_Helper::page_boder_left_class(array('main-navigation')); ?>>
		<ul>
			<?php
				if($slink = layers_get_theme_mod( 'social-facebook' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-facebook"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-twitter' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-twitter"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-youtube' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-youtube"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-vimeo' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-vimeo-square"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-soundcloud' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-soundcloud"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-linkedin' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-linkedin"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-github' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-github"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-bitbucket' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-bitbucket"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-instagram' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-instagram"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-flickr' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-flickr"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-google-plus' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-google-plus"></i></a></li>';
				}
				if($slink = layers_get_theme_mod( 'social-vk' )){
					echo '<li><a href="' . esc_url($slink) . '" target="_blank"><i class="fa fa-vk"></i></a></li>';
				}
			?>
		</ul>
	</div>
	<div <?php Skrollex_Helper::page_boder_right_class(array('main-navigation')); ?>></div>
	<?php do_action( 'layers_before_header' ); ?>
	<section id="top-nav" <?php Skrollex_Helper::top_nav_class(array('page-transition', 'main-navigation', 'heading')); ?> data-colors-1="<?php echo esc_attr(Skrollex_Helper::header_colors_1()); ?>" data-colors-2="<?php echo esc_attr(Skrollex_Helper::header_colors_2()); ?>">
		<?php do_action( 'layers_before_header_inner' ); ?>
		<div class="<?php if( 'layout-fullwidth' != layers_get_theme_mod( 'header-width' ) ) echo 'layout-boxed'; ?> top-nav-inner clearfix">
			<?php if ( ($locations = get_nav_menu_locations()) && isset($locations['skrollex-extended']) && has_nav_menu('skrollex-extended') ) { ?>
				<span class="menu-toggle ext-nav-toggle" data-target=".ext-nav"><span></span></span>
			<?php } ?>
			<nav class="nav nav-horizontal">
				<?php do_action( 'layers_before_header_nav' ); ?>
				<?php wp_nav_menu( array( 'theme_location' => 'skrollex-primary' ,'container' => FALSE, 'fallback_cb' => 'layers_menu_fallback', 'walker' => new Skrollex_Walker_Top_Menu() )); ?>
				<?php get_template_part( 'partials/responsive' , 'nav-button' ); ?>
				<?php do_action( 'layers_after_header_nav' ); ?>
			</nav>
			<?php get_template_part( 'partials/header' , 'logo' ); ?>
		</div>
		<?php do_action( 'layers_after_header_inner' ); ?>
	</section>
	<?php do_action( 'layers_after_header' ); ?>
	<ul id="dot-scroll" <?php Skrollex_Helper::dot_skroll_class(array('no-colors-label')); ?>></ul>
	<div class="overlay-window gallery-overlay colors-<?php echo esc_attr(layers_get_theme_mod('overlay_colors')) ?>" data-overlay-zoom=".fg">
		<div class="overlay-control">
			<a class="previos" href=""></a>
			<a class="next" href=""></a>
			<a class="cross" href=""></a>
		</div>
		<div class="overlay-view scroll-bar">
			<div class="layout-boxed overlay-content">	
			</div>
		</div>
		<ul class="loader">
			<li class="background-highlight"></li>
			<li class="background-highlight"></li>
			<li class="background-highlight"></li>
		</ul>
	</div>
	<div class="overlay-window map-overlay colors-<?php echo esc_attr(layers_get_theme_mod('overlay_colors')) ?>">
		<div class="overlay-control">
			<a class="cross" href=""></a>
		</div>
		<div class="overlay-view scroll-bar">
		</div>
	</div>
	<?php do_action( 'layers_before_site_wrapper' ); ?>
	<?php get_sidebar( 'off-canvas'); ?>
	<section <?php layer_site_wrapper_class(); ?>>
		<?php if ( ($locations = get_nav_menu_locations()) && isset($locations['skrollex-extended'])  && has_nav_menu('skrollex-extended') ) {
				$menu = wp_get_nav_menu_object( $locations['skrollex-extended'] );
				if($menu !== false){
					$menu_items = (array) wp_get_nav_menu_items($menu->term_id);
				}else{
					$menu_items = array();
				}
				$menu_count = count($menu_items);
					
		?>
		<div class="ext-nav scroll-bar page-transition heading non-preloading background-<?php echo esc_attr(layers_get_theme_mod('ext_nav_colors_3')) ?>">
			<?php if($menu_count > 0){ ?>
			<div class="view <?php echo ($menu_count > 2 ? 'half-height' : 'full-height'); ?>">
				<?php
				$ext_img = layers_get_theme_mod('background-images-extended-navigation');
				if($ext_img){
				?>
				<img alt class="bg static" src="<?php echo esc_url($ext_img); ?>" />
				<?php
				}
				?>
				<div class="fg no-top-padding no-bottom-padding  full-height">
					<div class="full-height">
						<div class="pure-g full-height">
							<a href="<?php echo esc_url($menu_items[0]->url) ?>" class="position-relative pure-u-1<?php echo ($menu_count === 1 ? '' : ' pure-u-sm-12-24'); ?> colors-<?php echo esc_attr(layers_get_theme_mod('ext_nav_colors_1')) ?> full-height">
								<div>
									<span class="side-label highlight"><?php echo esc_html( $menu_items[0]->post_excerpt ) ?></span>
									<span class="side-title heading"><?php echo esc_html( $menu_items[0]->title ) ?></span>
								</div>
							</a>
							<?php if($menu_count > 1){ ?>
							<a href="<?php echo esc_url($menu_items[1]->url) ?>" class="position-relative pure-u-1 pure-u-sm-12-24 colors-<?php echo esc_attr(layers_get_theme_mod('ext_nav_colors_2')) ?> full-height">
								<div>
									<span class="side-label highlight"><?php echo esc_html( $menu_items[1]->post_excerpt ) ?></span>
									<span class="side-title heading"><?php echo esc_html( $menu_items[1]->title ) ?></span>
								</div>
							</a>
							<?php } ?>
						</div>
					</div>
				</div>
			</div>
				<?php if($menu_count > 2){ ?>
			<div class="half-height">
				<div class="pure-g full-height">
					<?php for($i=2; $i<$menu_count; $i++ ){ ?>
					<a href="<?php echo esc_url($menu_items[$i]->url) ?>" class="position-relative pure-u-1<?php echo ($menu_count === 3 ? '' : ($menu_count === 4 ? ' pure-u-sm-12-24' : ' pure-u-sm-12-24 pure-u-lg-8-24'));   ?> colors-<?php echo esc_attr(layers_get_theme_mod('ext_nav_colors_3')) ?> full-height border-bottom border-right border-lite-<?php echo esc_attr(layers_get_theme_mod('ext_nav_colors_3')) ?>">
						<div>
							<span class="side-label highlight"><?php echo esc_html( $menu_items[$i]->post_excerpt ) ?></span>
							<span class="side-title heading"><?php echo esc_html( $menu_items[$i]->title ) ?></span>
						</div>
					</a>
					<?php } ?>
				</div>
			</div>
				<?php } ?>
			<?php } ?>
		</div>
		<?php } ?>
		<section id="wrapper-content" <?php layers_wrapper_class( 'wrapper_content', 'wrapper-content' ); ?>>