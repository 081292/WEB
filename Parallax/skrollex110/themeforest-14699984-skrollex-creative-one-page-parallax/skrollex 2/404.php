<?php
/**
 * The template for displaying the 404 page
 */

get_header();
if ( is_active_sidebar( 'skrollex-default-top-area' ) ) {
        dynamic_sidebar( 'skrollex-default-top-area' ); 
}
?>
<div class="default-page-wrapper colors-<?php echo esc_attr(layers_get_theme_mod('default_page_colors')); ?>">
<section class="post content-main clearfix layout-boxed">
    <div class="pure-g">

        <?php get_sidebar( 'left' ); ?>

        <article <?php Skrollex_Helper::center_column_class(); ?>>
            <?php get_template_part( 'partials/content', 'empty' ); ?>
        </article>

        <?php get_sidebar( 'right' ); ?>
    </div>
</section>
</div>
<?php get_footer();