<?php
/**
 * Template Name: Blog
 * The template for displaying post archives
 */

get_header();
if ( is_active_sidebar( 'skrollex-default-top-area' ) ) {
        dynamic_sidebar( 'skrollex-default-top-area' ); 
}
do_action( 'layers_before_blog_template' );
get_template_part( 'partials/header' , 'page-title' ); ?>
<div class="default-page-wrapper colors-<?php echo esc_attr(layers_get_theme_mod('default_page_colors')); ?>">
<section class="layout-boxed archive">
	<div class="pure-g">
	<?php get_sidebar( 'left' ); ?>

	<?php
		$args = array(
			"post_type" => "post",
			"paged" => $paged
		);

		$wp_query = new WP_Query($args);

		if( $wp_query->have_posts() ) : ?>
		<div <?php Skrollex_Helper::center_column_class(); ?>>
			<?php while ( $wp_query->have_posts() ) : $wp_query->the_post(); ?>
				<?php get_template_part( 'partials/content' , 'list' ); ?>
			<?php endwhile; // while has_post(); ?>
		</div>
	<?php endif; // if has_post() ?>

	<?php get_sidebar( 'right' ); ?>
	</div>
	<div class="colors-<?php echo esc_attr(layers_get_theme_mod('blog_colors')) ?> background-transparent">
		<?php the_posts_pagination(); ?>
	</div>
</section>
</div>
<?php do_action( 'layers_after_blog_template' );
get_footer();