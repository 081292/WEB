<?php
/**
 * The template for displaying the footer.
 * Contains the closing of the "wrapper-content" div and all content after.
 */
?>		</section>

		<?php do_action( 'layers_before_footer' ); ?>

		<footer id="footer" class="animated page-transition non-preloading">
			<?php do_action( 'layers_before_footer_inner' ); ?>
			<div class="footer-widgets <?php if( 'layout-fullwidth' != layers_get_theme_mod( 'footer-width' ) ) echo 'layout-boxed'; ?>  clearfix">
				<?php // Do logic related to the footer widget area count
				$footer_sidebar_count = layers_get_theme_mod( 'footer-sidebar-count' ); ?>

				<?php if( 0 != $footer_sidebar_count ) { ?>
					<?php do_action( 'layers_before_footer_sidebar' ); ?>
					<div class="pure-g">
						<?php // Default Sidebar count to 4
						if( '' == $footer_sidebar_count ) $footer_sidebar_count = 4;

						// Get the sidebar class
						$footer_sidebar_class = floor( 24/$footer_sidebar_count ); ?>
						<?php for( $footer = 1; $footer <= $footer_sidebar_count; $footer++ ) { ?>
							<div class="pure-u-1 pure-u-md-<?php echo esc_attr( $footer_sidebar_class ); ?>-24">
								<?php dynamic_sidebar( 'skrollex-footer-' . $footer ); ?>
							</div>
						<?php } ?>
					</div>
					<?php do_action( 'layers_after_footer_sidebar' ); ?>
				<?php } // if 0 != sidebars ?>
				<?php if( has_nav_menu('skrollex-footer') || '' != layers_get_theme_mod( 'footer-copyright-text' )) {  ?>
				<div class="footer-bottom colors-<?php echo esc_attr(layers_get_theme_mod('footer_colors')) ?>">
					<?php if( has_nav_menu('skrollex-footer') ) {  ?>
						<div class="text-center footer-menu">
							<?php wp_nav_menu( array( 'theme_location' => 'skrollex-footer' , 'container' => 'nav', 'container_class' => 'nav', 'fallback_cb' => false )); ?>
						</div>
					<?php } ?>
					<?php do_action( 'layers_before_footer_copyright' ); ?>
					<?php if( '' != layers_get_theme_mod( 'footer-copyright-text' ) ) {  ?>
					<div class="text-center"><?php Skrollex_Ext::trusted(layers_get_theme_mod( 'footer-copyright-text' )); ?></div>
					<?php } ?>
					<?php do_action( 'layers_after_footer_copyright' ); ?>
				</div>
				<?php } ?>
			</div>
			<?php do_action( 'layers_after_footer_inner' ); ?>

			<?php if( false != layers_get_theme_mod( 'show-layers-badge' ) ) { ?>
				<?php echo wp_kses( __('<a class="created-using-layers" target="_blank" tooltip="Built with Layers" href="http://www.layerswp.com"><span>Built with Layers</span></a>' , 'skrollex'), Skrollex_Ext::trusted_tags()); ?>
			<?php } ?>
		</footer><!-- END / FOOTER -->
		<?php do_action( 'layers_after_footer' ); ?>

	</section><!-- END / MAIN SITE #wrapper -->
	<?php do_action( 'layers_after_site_wrapper' ); ?>
	<?php
		if(is_admin_bar_showing()){
			?>
			<form id="save-custom-css" action="<?php echo esc_attr(admin_url('themes.php?page=skrollex_custom_colors')); ?>" method="post">
				<input type="hidden" id="action" name="command" value="save_custom_css">
				<input type="hidden" id="permalink" name="permalink" value="<?php  echo esc_url(Skrollex_Helper::current_url()) ?>">
			<?php
				wp_nonce_field("n_action", "n_name");
			?>
			</form>
			<?php
		}
	?>
	<?php wp_footer(); ?>
</body>
</html>