<?php
/**
 * Widget for display video background
 */
if (!class_exists('Skrollex_Video_Bg_Widget') && class_exists('Layers_Widget')) {
	class Skrollex_Video_Bg_Widget extends Skrollex_Widget {
		/**
		 * Constructor
		 */
		function Skrollex_Video_Bg_Widget() {
			parent::__construct(array(
				'widget_title' => esc_html__('SX Background Video', 'skrollex'), 
				'widget_id' => SKROLLEX_SLUG . '-video-bg',
				'description' => esc_html__('This widget is used to display background video.', 'skrollex')
			));
			// Widget structure
			$this->model = array(
				array(
					'type' => 'root'
				),
				'type' => array(
					array(
						'type' => 'field-layers-input',
						'params' => array(
							'type' => 'select',
							'options' => array(
								'youtube' => esc_html__('YouTube' , 'skrollex'),
								'vimeo' => esc_html__('Vimeo' , 'skrollex'),
								'video' => esc_html__('Video File' , 'skrollex'),
							)
						),
						'default' => 'youtube',
						'label' => esc_html__( 'Type' , 'skrollex' )
					)
				),
				'video' => array(
					array(
						'type' => 'field-layers-input',
						'params' => array(
							'type' => 'text',
							'placeholder' => esc_html__( 'See examples below' , 'skrollex' ),
						),
						'default' => '',
						'label' => esc_html__( 'ID (for YouTube and Vimeo) or URL (for file)' , 'skrollex' )
					)
				),
				'volume' => array(
					array(
						'type' => 'field-layers-input',
						'params' => array(
							'type' => 'number',
						),
						'default' => '0',
						'label' => esc_html__( 'Volume (%)' , 'skrollex' )
					)
				),
				'wrapper_for_migrator' => array(
					array(
						'type' => 'group',
					),
					'image' => array(
						array(
							'type' => 'field-layers-input',
							'params' => array(
								'type' => 'image',
							),
							'default' => NULL,
							'label' => esc_html__( 'Alternative image' , 'skrollex' )
						)
					)
				),
				'example' => array(
					array(
						'type' => 'form-content',
						'params' => array(
							'content' => '<p>' .
								esc_html__('Set ID for YouTube and Vimeo or URL for video file.', 'skrollex') .
								'</p><p>http://www.youtube.com/watch?v=qhzPKbPgJY8<br>' .
								esc_html__('ID:', 'skrollex') .
								' qhzPKbPgJY8</p><p>https://vimeo.com/129868229<br>' .
								esc_html__('ID:', 'skrollex') .
								' 129868229</p><p>https://yourdomain.com/path/file.mp4<br>' .
								esc_html__('URL:', 'skrollex') .
								' https://yourdomain.com/path/file.mp4</p>',
						),
						'default' => NULL,
					)
				)
			);
		}
		/**
		 * Display widget
		 */
		function widget($args, $instance) {
			$vals = self::vals($this->model, $instance);
			$alternative_img = (!isset($vals['wrapper_for_migrator']) || !isset($vals['wrapper_for_migrator']['image'])) ? '' : wp_get_attachment_image_src( $vals['wrapper_for_migrator']['image'] , 'full' );
			$alternative_str = $alternative_img =='' ? '' : ' data-alternative="' . esc_url($alternative_img[0]) . '"';
			$mute_str = $vals['type'] == 'vimeo' ? '' : (' data-mute="' . ($vals['volume']==0 ? 'yes' : 'no') . '"');
			if($vals['video'] != ''){
			?>
				<div class="x40-widget <?php echo esc_attr($vals['type']); ?>-bg" data-video="<?php echo esc_attr($vals['video']); ?>"<?php echo $mute_str ?> data-volume="<?php echo esc_attr($vals['volume']); ?>"<?php echo $alternative_str; ?>></div>
			<?php
			}
		}
	}
	/**
	 * Register this widget
	 */
	register_widget("Skrollex_Video_Bg_Widget");
}

