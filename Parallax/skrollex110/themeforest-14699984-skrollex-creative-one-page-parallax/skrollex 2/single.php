<?php
/**
 * The template for displaying a single post
 */

get_header();
if ( is_active_sidebar( 'skrollex-post-top-area' ) ) {
        dynamic_sidebar( 'skrollex-post-top-area' ); 
}
?>
<div class="post-page-wrapper colors-<?php echo esc_attr(layers_get_theme_mod('blog_colors')); ?>">
<section id="post-<?php the_ID(); ?>" <?php post_class( 'content-blog clearfix'); ?>>
	<?php do_action('layers_before_post_loop'); ?>
	<div class="pure-g">

		<?php get_sidebar( 'left' ); ?>

		<?php if( have_posts() ) : ?>

			<?php while( have_posts() ) : the_post(); ?>
				<article <?php Skrollex_Helper::center_column_class(); ?>>
					<?php get_template_part( 'partials/content', 'single' ); ?>
				</article>
			<?php endwhile; ?>

		<?php endif; ?>

		<?php get_sidebar( 'right' ); ?>
	</div>
	<?php do_action('layers_after_post_loop'); ?>
</section>
</div>

<?php get_footer();