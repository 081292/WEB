<?php do_action( 'layers_before_logo' ); ?>
<div class="logo">
    <?php do_action( 'layers_before_logo_inner' ); ?>

    <?php 
	/**
     * Display Site Logo
     */
	if(get_theme_mod( 'custom_logo' )){
		if ( function_exists( 'the_custom_logo' ) ) {
			the_custom_logo();
		} elseif( function_exists( 'jetpack_the_site_logo' ) ) {
			jetpack_the_site_logo();
		}
	}
	?>

    <?php if('blank' != get_theme_mod('header_textcolor') ) { ?>
        <div class="site-description">
            <h3 class="sitename sitetitle"><a href="<?php echo esc_url(home_url()); ?>"><?php Skrollex_Helper::e_rich(get_bloginfo('title')); ?></a></h3>
        </div>
    <?php } ?>

    <?php do_action( 'layers_after_logo_inner' ); ?>
</div>
<?php do_action( 'layers_after_logo' ); ?>