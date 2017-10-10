<?php
/**
 * Customized preset import
 */
if( !function_exists( 'skrollex_decode_widget_post_data' ) ) {
	function skrollex_decode_widget_post_data(){
		if(isset($_POST[ 'widget_data' ], $_POST[ 'widget_data' ]['site-settings'])){
			$settings = json_decode(stripslashes($_POST[ 'widget_data' ]['site-settings']), TRUE);
			foreach ($settings as $key => $value){
				set_theme_mod(LAYERS_THEME_SLUG . '-' . $key, $value);
			}
		}
		if(isset($_POST[ 'widget_data' ], $_POST[ 'widget_data' ]['encoded-data'])){
			$_POST[ 'widget_data' ] = json_decode(stripslashes($_POST[ 'widget_data' ]['encoded-data']), TRUE);
		}
	}
	add_action('wp_ajax_layers_import_widgets', 'skrollex_decode_widget_post_data', 5);
	add_action('wp_ajax_layers_create_builder_page_from_preset', 'skrollex_decode_widget_post_data', 5);
}
/**
 * Customized preset export
 */
if( !function_exists( 'skrollex_create_export_file' ) ) {
	function skrollex_create_export_file(){

		$layers_migrator = new Layers_Widget_Migrator();

		// Make sur a post ID exists or return
		if( !isset( $_GET[ 'post' ] ) ) return;

		// Get the post ID
		$post_id = $_GET[ 'post' ];

		$post = get_post( $post_id );

		$widget_data ='{"encoded-data":' . json_encode(json_encode( $layers_migrator->export_data( $post ) )) . '}';

		$filesize = strlen( $widget_data );

		// Headers to prompt "Save As"
		header( 'Content-Type: application/json' );
		header( 'Content-Disposition: attachment; filename=' . $post->post_name .'-' . date( 'Y-m-d' ) . '.json' );
		header( 'Expires: 0' );
		header( 'Cache-Control: must-revalidate' );
		header( 'Pragma: public' );
		header( 'Content-Length: ' . $filesize );

		// Clear buffering just in case
		@ob_end_clean();
		flush();

		// Output file contents
		die( $widget_data );

		// Stop execution
		wp_redirect( admin_url( 'post.php?post=' . $post->ID . '&action=edit'  ) );

	}
	if( isset( $_GET[ 'layers-export' ] ) ) {
		add_action( 'init' , 'skrollex_create_export_file' );
	}
}