<?php
/**
 * Standard blog index page
 */

get_header();
$left_sidebar_active = layers_can_show_sidebar( 'left-sidebar' );
if ( is_active_sidebar( 'skrollex-blog-top-area' ) ) {
	dynamic_sidebar( 'skrollex-blog-top-area' ); 
}
?>
<div class="default-page-wrapper background-<?php echo esc_attr(layers_get_theme_mod('blog_colors')) ?>">
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