<div class="wrapper invert off-canvas-right scroll-bar colors-<?php echo esc_attr(layers_get_theme_mod('mobile_nav_colors')); ?>" id="off-canvas-right">
    <a class="close-canvas" data-toggle="#off-canvas-right" data-toggle-class="open">
        <i class="l-close"></i>
        Close
    </a>

    <div class="content-box nav-mobile page-transition">
        <?php wp_nav_menu( array( 'theme_location' => 'skrollex-primary' ,'container' => 'nav', 'container_class' => 'nav nav-vertical', 'fallback_cb' => create_function('', 'echo "&nbsp";') ) ); ?>
    </div>
    <?php dynamic_sidebar( 'skrollex-off-canvas-sidebar' ); ?>
</div>