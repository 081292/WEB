<?php
/**
 * Template Name: Blank Page
 *
 * The template for displaying a full width, unstyled page
 */

get_header();
if ( is_active_sidebar( 'skrollex-default-top-area' ) ) {
        dynamic_sidebar( 'skrollex-default-top-area' ); 
}
?>

<?php get_template_part( 'partials/header' , 'page-title' ); ?>
<div class="default-page-wrapper colors-<?php echo esc_attr(layers_get_theme_mod('default_page_colors')); ?>">
<section id="post-<?php the_ID(); ?>" <?php post_class( 'layout-boxed clearfix' ); ?>>
    <?php if( have_posts() ) : ?>
        <?php while( have_posts() ) : the_post(); ?>
            <div class="pure-g">
                <article class="pure-u-1">
                    <?php get_template_part( 'partials/content', 'single' ); ?>
                </article>
            </div>
        <?php endwhile; // while has_post(); ?>
    <?php endif; // if has_post() ?>
</section>
</div>
<?php get_footer();