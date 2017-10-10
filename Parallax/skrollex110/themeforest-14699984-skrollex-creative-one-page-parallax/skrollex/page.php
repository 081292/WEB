<?php
/**
 * The template for displaying a page
 *
 */

get_header();
if ( is_active_sidebar( 'skrollex-default-top-area' ) ) {
        dynamic_sidebar( 'skrollex-default-top-area' ); 
}
?>
<div class="default-page-wrapper colors-<?php echo esc_attr(layers_get_theme_mod('default_page_colors')); ?>">
<section id="post-<?php the_ID(); ?>" <?php post_class( 'layout-boxed content-main clearfix' ); ?>>
	<?php do_action('layers_before_page_loop'); ?>
    <div class="pure-g">
        <?php if( have_posts() ) : ?>
            <?php while( have_posts() ) : the_post(); ?>
                <article <?php Skrollex_Helper::center_column_class(); ?>>
                    <?php get_template_part( 'partials/content', 'single' ); ?>
                </article>
            <?php endwhile; // while has_post(); ?>
        <?php endif; // if has_post() ?>
    </div>
    <?php do_action('layers_after_page_loop'); ?>
</section>
</div>
<?php get_footer();