<?php
/**
 * The template for displaying post archives
 *
 */

get_header();
if ( is_active_sidebar( 'skrollex-default-top-area' ) ) {
        dynamic_sidebar( 'skrollex-default-top-area' ); 
}
?>
<?php get_template_part( 'partials/header' , 'page-title' ); ?>
<div class="default-page-wrapper colors-<?php echo esc_attr(layers_get_theme_mod('default_page_colors')); ?>">
<section class="layout-boxed archive">
	<div class="pure-g">
	<?php get_sidebar( 'left' ); ?>

	<?php if( have_posts() ) : ?>
		<div <?php Skrollex_Helper::center_column_class(); ?>>
			<?php while( have_posts() ) : the_post(); ?>
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
<?php get_footer();