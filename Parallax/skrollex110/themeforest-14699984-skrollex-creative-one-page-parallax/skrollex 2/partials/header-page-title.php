<?php
/**
 * This partial is used for displaying the Header in archive and
 * search pages
 *
 */

/**
* Fetch the site title array
*/
$details = layers_get_page_title();

if( isset( $details[ 'title' ] ) || isset( $details[ 'excerpt' ] ) ) { ?>
<div class="header-page-title-container colors-<?php echo esc_attr(layers_get_theme_mod('default_header_colors')) ?>">
		<?php do_action('layers_before_header_page_title'); ?>
		<div class="title">
			<?php /**
			* Display Breadcrumbs
			*/
			layers_bread_crumbs();

			if( isset( $details[ 'title' ] ) && '' != $details[ 'title' ] ) { ?>
				<?php do_action('layers_before_title_heading'); ?>
				<h3 class="heading"><?php echo $details[ 'title' ]; ?></h3>
				<?php do_action('layers_after_title_heading'); ?>
			<?php } // if isset $title

			if( isset( $details[ 'excerpt' ] ) && '' != $details[ 'excerpt' ] ) { ?>
				<?php do_action('layers_before_title_excerpt'); ?>
				<div class="excerpt"><?php echo $details[ 'excerpt' ]; ?></div>
				<?php do_action('layers_after_title_excerpt'); ?>
			<?php } // if isset $excerpt ?>
		</div>
		<?php do_action('layers_after_header_page_title'); ?>
	</div>
<?php }