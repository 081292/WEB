<?php
/**
 * Widget for display image as page background.
 */
if (!class_exists('Skrollex_Image_Bg_Widget') && class_exists('Layers_Widget')) {
	class Skrollex_Image_Bg_Widget extends Skrollex_Widget {
		/**
		 * Constructor
		 */
		function Skrollex_Image_Bg_Widget() {
			parent::__construct(array(
				'widget_title' => esc_html__('SX Background Image', 'skrollex'), 
				'widget_id' => SKROLLEX_SLUG . '-image-bg',
				'description' => esc_html__('This widget is used to display background image.', 'skrollex')
			));
			// Widget structure
			$this->model = array(
				array(
					'type' => 'root'
				),
				'wrapper_for_migrator' => array(
					array(
						'type' => 'group'
					),
					'image' => array(
						array(
							'type' => 'field-layers-input',
							'params' => array(
								'type' => 'image',
							),
							'default' => NULL,
							'label' => esc_html__( 'Background Image' , 'skrollex' )
						)
					)
				)
			);
		}
		/**
		 * Display widget
		 */
		function widget($args, $instance) {
			$vals = self::vals($this->model, $instance);
			if(isset($vals['wrapper_for_migrator']) && $vals['wrapper_for_migrator']['image'] !== NULL){
				$img = wp_get_attachment_image_src( $vals['wrapper_for_migrator']['image'] , 'full' );
				?>
				<img class="bg" src="<?php echo esc_url($img[0]); ?>" alt="" />
				<?php
			}
		}
	}
	/**
	 * Register this widget
	 */
	register_widget("Skrollex_Image_Bg_Widget");
}

