<?php
/**
 * Template Name: Right Sidebar
 *
 * The template for displaying a full width page
 */

get_header();
if ( is_active_sidebar( 'skrollex-default-top-area' ) ) {
        dynamic_sidebar( 'skrollex-default-top-area' ); 
}
?>
<div class="default-page-wrapper colors-<?php echo esc_attr(layers_get_theme_mod('default_page_colors')); ?>">
<section id="post-<?php the_ID(); ?>" <?php post_class( 'layout-boxed content-main clearfix' ); ?>>
    <div class="pure-g">
        <article <?php Skrollex_Helper::center_column_class(); ?>>
            <?php if( have_posts() ) : ?>
                <?php while( have_posts() ) : the_post(); ?>
                    <?php get_template_part( 'partials/content', 'single' ); ?>
                <?php endwhile; // while has_post(); ?>
            <?php endif; // if has_post() ?>
        </article>

        <?php get_sidebar( 'right' ); ?>
    </div>
</section>
</div>
<?php get_footer();