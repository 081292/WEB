<?php
/**
 * Base class for page sections
 */
if (!class_exists('Skrollex_Section_Base')) {
	class Skrollex_Section_Base extends Skrollex_Widget {
		/**
		 * Constructor
		 */
		public function Skrollex_Section_Base($opt) {
			parent::__construct($opt);
			// Default section structure
			$this->model = array(
				array(
					'type' => 'root'
				),
				'design' => array(
					array(
						'type' => 'design-bar',
						'layout' => 'side',
						'params' => array(
						),
						'components' => array('layout', 'custom')
					),
					'layout' => array(
						array(
							'type' => 'layers-menu-item',
							'default' => 'layout-boxed'
						)
					),
					'display' => array(
						array(
							'type' => 'menu',
							'params' => array(
								'icon-css' => 'icon-display',
								'label' => esc_html__( 'Display', 'skrollex' )
							)
						),
						'colors' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'select',
									'label' => esc_html__( 'Color Scheme' , 'skrollex' ),
									'options' => Skrollex_Ext::colors()
								),
								'default' => 'd'
							)
						),
						'section_height' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'select',
									'label' => esc_html__( 'Section Height' , 'skrollex' ),
									'options' => array(
										'normal-size' => esc_html__('Normal' , 'skrollex'),
										'full-size' =>  esc_html__('Full Screen' , 'skrollex'),
										'half-size' =>  esc_html__('Half Screen' , 'skrollex'),
										'one-third-size' =>  esc_html__('One Third Screen' , 'skrollex')
									)
								),
								'default' => 'normal-size'
							)
						),
						'top_padding' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'select',
									'label' => esc_html__( 'Top Padding' , 'skrollex' ),
									'options' => array(
										'yes' =>  esc_html__('Yes', 'skrollex' ),
										'no' =>  esc_html__('No',  'skrollex' )
									)
								),
								'default' => 'yes'
							)
						),
						'bottom_padding' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'select',
									'label' => esc_html__( 'Bottom Padding' , 'skrollex' ),
									'options' => array(
										'yes' =>  esc_html__('Yes', 'skrollex' ),
										'no' => esc_html__('No',  'skrollex' )
									)
								),
								'default' => 'yes'
							)
						),
						'hide_on_small' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'select',
									'label' => esc_html__( 'Hide on Small Devices' , 'skrollex' ),
									'options' => array(
										'no' => esc_html__('No',  'skrollex' ),
										'yes' => esc_html__('Yes', 'skrollex' )
									)
								),
								'default' => 'no'
							)
						)
					),
					'overlay' => array(
						array(
							'type' => 'menu',
							'params' => array(
								'icon-css' => 'fa fa-flask fa-2x',
								'label' => esc_html__( 'Parallax Objects', 'skrollex' )
							)
						),
						'overlay' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'select',
									'label' => esc_html__( 'SVG Objects' , 'skrollex' ),
									'options' => array(
										'no' => esc_html__('No', 'skrollex'),
										'svg-overlay-scroll' => esc_html__('Scroll', 'skrollex'),
										'svg-overlay-scroll-right' => esc_html__('Scroll Right', 'skrollex'),
										'svg-overlay-lamp' => esc_html__('Lamp', 'skrollex'),
										'svg-overlay-14' => esc_html__('Flask, Scroll, Lamp', 'skrollex'),
										'svg-overlay-9' => esc_html__('Scroll, Lamp', 'skrollex'),
										'svg-overlay-16' => esc_html__('Flask, Scroll', 'skrollex'),
										'svg-overlay-17' => esc_html__('Flask, Scroll Right', 'skrollex'),
										'svg-overlay-10' => esc_html__('Flask, Lamp', 'skrollex'),
									)
								),
								'default' => 'no'
							)
						),
						'pattern' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'select',
									'label' => esc_html__( 'Pattern' , 'skrollex' ),
									'options' => array(
										'no' => esc_html__('No', 'skrollex'),
										'pattern-1-dark' => esc_html__('Pattern 1 Dark', 'skrollex'),
										'pattern-1-light' => esc_html__('Pattern 1 Light', 'skrollex'),
										'pattern-2-dark' => esc_html__('Pattern 2 Dark', 'skrollex'),
										'pattern-2-light' => esc_html__('Pattern 2 Light', 'skrollex'),
										'pattern-3-dark' => esc_html__('Pattern 3 Dark', 'skrollex'),
										'pattern-3-light' => esc_html__('Pattern 3 Light', 'skrollex'),
										'pattern-4-dark' => esc_html__('Pattern 4 Dark', 'skrollex'),
										'pattern-4-light' => esc_html__('Pattern 4 Light', 'skrollex'),
									)
								),
								'default' => 'no'
							)
						),
						'image' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'image',
									'label' => esc_html__( 'Mask' , 'skrollex' )
								),
								'default' => NULL
							)
						),
						'to_front' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'select',
									'label' => esc_html__( 'To Front' , 'skrollex' ),
									'options' => array(
										'no' => esc_html__('No', 'skrollex'),
										'yes' => esc_html__('Yes', 'skrollex'),
									),
								),
								'default' => 'no'
							)
						),
					),
					'effect' => array(
						array(
							'type' => 'menu',
							'params' => array(
								'icon-css' => 'fa fa-magic fa-2x',
								'label' => esc_html__( 'Header Effect', 'skrollex' )
							)
						),
						'header_effect' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'select',
									'label' => esc_html__( 'Header Effect' , 'skrollex' ),
									'options' => array(
										'no' => esc_html__('No' , 'skrollex'),
										'effect-a-static' =>  esc_html__('Effect A - Static' , 'skrollex'),
										'effect-a-animated' =>  esc_html__('Effect A - Animated' , 'skrollex'),
										'effect-b-static' =>  esc_html__('Effect B - Static' , 'skrollex'),
										'effect-b-animated' =>  esc_html__('Effect B - Animated' , 'skrollex'),
										'custom-static' =>  esc_html__('Custom Pattern - Static' , 'skrollex'),
										'custom-animated' =>  esc_html__('Custom Pattern - Animated' , 'skrollex'),
										'fullscreen' =>  esc_html__('Fullscreen Overlay' , 'skrollex'),
										'fit-text' =>  esc_html__('Fit Text' , 'skrollex'),
										'custom-circle' =>  esc_html__('Custom Pattern - Circle' , 'skrollex'),
									)
								),
								'default' => 'no'
							)
						),
						'image' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'image',
									'label' => esc_html__( 'Custom Pattern' , 'skrollex' )
								),
								'default' => NULL
							)
						),
						'header_background_selector' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'text',
									'label' => esc_html__( 'Header Effect Selector' , 'skrollex' )
								),
								'default' => 'h1,h2,h3,h4'
							)
						),
					),
					'liststyle' => array(
						array(
							'type' => 'menu',
							'params' => array(
								'icon-css' => 'icon-list-masonry',
								'label' => esc_html__('List Style', 'skrollex'),
								'wrapper-class' => 'layers-small to layers-pop-menu-wrapper layers-animate'
							)
						),
						'liststyle' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'select-icons',
									'options' => array(
										'list-grid' => esc_html__('Grid', 'skrollex'),
										'list-masonry' => esc_html__('Masonry', 'skrollex')
									)
								),
								'default' => 'list-grid'
							)
						),
						'gutter' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'checkbox',
									'label' => esc_html__('Gutter', 'skrollex')
								),
								'default' => 'on' // 'on' or null
							)
						)
					),
					'advanced' => array(
						array(
							'type' => 'menu',
							'params' => array(
								'icon-css' => 'icon-settings',
								'label' => esc_html__( 'Advanced', 'skrollex' )
							)
						),
						'customclass' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'text',
									'label' => esc_html__( 'Custom Class(es)' , 'skrollex' ),
									'placeholder' => 'example-class',
								),
								'default' => ''
							)
						),
						'customcss' => array(
							array(
								'type' => 'menu-item',
								'params' => array(
									'type' => 'textarea',
									'label' => esc_html__( 'Custom CSS' , 'skrollex' ),
									'placeholder' => '.classname{color: #333;}',
								),
								'default' => ''
							)
						)
					)
				),
				'anchor_id' => array(
					array(
						'type' => 'field-layers-input',
						'params' => array(
							'type' => 'text',
							'placeholder' => esc_html__( 'Enter anchor ID (without #)' , 'skrollex' ),
							'class' => 'anchor-id-field'
						),
						'default' => '',
						'label' => wp_kses(__('Anchor ID for links (<span class="text-transform-none">http://domain.com/some-page#<span class="highlight-text">some-anchor-id</span>)</span>', 'skrollex'), Skrollex_Ext::trusted_tags())
					)
				),
				'title' => array(
					array(
						'type' => 'field-layers-input',
						'params' => array(
							'type' => 'hidden',
							'class' => 'texttitle'
						),
						'default' => '',
					)
				),
				'htmltitle' => array(
					array(
						'type' => 'field-rte',
						'params' => array(
							'class' => 'section-top small-editor htmltitle'
						),
						'default' => '<h3 class="heading-section-title">' . wp_kses(__('Section <span>Title</span>', 'skrollex'), Skrollex_Ext::trusted_tags()) . '</h3>'
					)
				),
				'header_details' => array(
					array(
						'type' => 'field-rte',
						'params' => array(
							'class' => 'section-top small-editor'
						),
						'default' => '<p class="header-details">' . wp_kses(__('<span>Header</span> Details', 'skrollex'), Skrollex_Ext::trusted_tags()) . '</p>'
					)
				),
				'excerpt' => array(
					array(
						'type' => 'field-rte',
						'params' => array(
							'class' => 'section-top area-editor'
						),
						'default' => '<p class="lead">' . wp_kses(__('Lead Content', 'skrollex'), Skrollex_Ext::trusted_tags()) . '.</p>'
					)
				),
				'columns' => array(
					array(
						'type' => 'list',
						'control_title' => esc_html__( 'Column' , 'skrollex' ),
						'add_label' => esc_html__( 'Add Column' , 'skrollex' ),
						'default_count' => 3
					),
					'design' => array(
						array(
							'type' => 'design-bar',
							'layout' => 'top',
							'params' => array(
								'show_trash' => true
							),
							'components' => array('custom')
						),
						'layout' => array(
							array(
								'type' => 'menu',
								'params' => array(
									'icon-css' => 'icon-columns',
									'label' => esc_html__( 'Column Width', 'skrollex' )
								)
							),
							'width' => array(
								array(
									'type' => 'menu-item',
									'params' => array(
										'type' => 'select',
										'label' => '',
										'options' => array(
											'1-5'	=> esc_html__('1 of 5 columns', 'skrollex'),
											'2-5'	=> esc_html__('1 of 5 columns', 'skrollex'),
											'3-5'	=> esc_html__('1 of 5 columns', 'skrollex'),
											'4-5'	=> esc_html__('1 of 5 columns', 'skrollex'),
											'0.5'	=> esc_html__('1 of 24 columns', 'skrollex'),
											'1'		=> esc_html__('2 of 24 columns', 'skrollex'),
											'1.5'	=> esc_html__('3 of 24 columns', 'skrollex'),
											'2'		=> esc_html__('4 of 24 columns', 'skrollex'),
											'2.5'	=> esc_html__('5 of 24 columns', 'skrollex'),
											'3'		=> esc_html__('6 of 24 columns', 'skrollex'),
											'3.5'	=> esc_html__('7 of 24 columns', 'skrollex'),
											'4'		=> esc_html__('8 of 24 columns', 'skrollex'),
											'4.5'	=> esc_html__('9 of 24 columns', 'skrollex'),
											'5'		=> esc_html__('10 of 24 columns', 'skrollex'),
											'5.5'	=> esc_html__('11 of 24 columns', 'skrollex'),
											'6'		=> esc_html__('12 of 24 columns', 'skrollex'),
											'6.5'	=> esc_html__('13 of 24 columns', 'skrollex'),
											'7'		=> esc_html__('14 of 24 columns', 'skrollex'),
											'7.5'	=> esc_html__('15 of 24 columns', 'skrollex'),
											'8'		=> esc_html__('16 of 24 columns', 'skrollex'),
											'8.5'	=> esc_html__('17 of 24 columns', 'skrollex'),
											'9'		=> esc_html__('18 of 24 columns', 'skrollex'),
											'9.5'	=> esc_html__('19 of 24 columns', 'skrollex'),
											'10'	=> esc_html__('20 of 24 columns', 'skrollex'),
											'10.5'	=> esc_html__('21 of 24 columns', 'skrollex'),
											'11'	=> esc_html__('22 of 24 columns', 'skrollex'),
											'11.5'	=> esc_html__('23 of 24 columns', 'skrollex'),
											'12'	=> esc_html__('24 of 24 columns', 'skrollex')
										)
									),
									'default' => '4'
								)
							),
						),
						'display' => array(
							array(
								'type' => 'menu',
								'params' => array(
									'icon-css' => 'icon-display',
									'label' => esc_html__( 'Display', 'skrollex' )
								)
							),
							'column_style' => array(
								array(
									'type' => 'menu-item',
									'params' => array(
										'type' => 'select',
										'label' => esc_html__( 'Column Style' , 'skrollex' ),
										'options' => array(
											'simple' => esc_html__('Simple', 'skrollex'),
											'decorated' => esc_html__('Decorated', 'skrollex')
										)
									),
									'default' => 'simple'
								)
							),
							'column_height' => array(
								array(
									'type' => 'menu-item',
									'params' => array(
										'type' => 'select',
										'label' => esc_html__( 'Column Height' , 'skrollex' ),
										'options' => array(
											'auto' => esc_html__('Auto', 'skrollex'),
											'100' => esc_html__('100px', 'skrollex'),
											'200' => esc_html__('200px', 'skrollex'),
											'300' => esc_html__('300px', 'skrollex'),
											'400' => esc_html__('400px', 'skrollex'),
											'500' => esc_html__('500px', 'skrollex'),
											'600' => esc_html__('600px', 'skrollex'),
											'700' => esc_html__('700px', 'skrollex'),
											'800' => esc_html__('800px', 'skrollex'),
											'900' => esc_html__('900px', 'skrollex'),
											'1000' => esc_html__('1000px', 'skrollex')
										)
									),
									'default' => 'auto'
								)
							),
							'column_animation' => array(
								array(
									'type' => 'menu-item',
									'params' => array(
										'type' => 'select',
										'label' => esc_html__( 'Column Animation' , 'skrollex' ),
										'options' => array(
											'no' => esc_html__('No', 'skrollex'),
											'left' => esc_html__('Left', 'skrollex'),
											'right' => esc_html__('Right', 'skrollex'),
											'up' => esc_html__('Up', 'skrollex'),
											'down' => esc_html__('Down', 'skrollex')
										)
									),
									'default' => 'no'
								)
							),
							'filter' => array(
								array(
									'type' => 'menu-item',
									'params' => array(
										'type' => 'text',
										'label' => esc_html__( 'Filters (Only for masonry, comma separated)' , 'skrollex' ),
										'placeholder' => esc_html__('Example: Web Sites, Art', 'skrollex')
									),
									'default' => ''
								)
							)
						),
						'icon' => array(
							array(
								'type' => 'menu',
								'params' => array(
									'icon-css' => 'icon-layers-logo',
									'label' => esc_html__( 'Column Icon', 'skrollex' )
								)
							),
							'icon' => array(
								array(
									'type' => 'menu-item',
									'params' => array(
										'type' => 'text',
										'label' => esc_html__( 'Column Icon Class' , 'skrollex' ),
										'placeholder' => esc_html__("Examples: 'fa fa-car', 'li_tv'", 'skrollex')
									),
									'default' => '',
								)
							),
							'icon_layout' => array(
								array(
									'type' => 'menu-item',
									'params' => array(
										'type' => 'select',
										'label' => esc_html__( 'Column Icon Layout' , 'skrollex' ),
										'options' => array(
											'small' => esc_html__( 'Small', 'skrollex' ),
											'circle' => esc_html__( 'Big Circle', 'skrollex' ),
											'circle-hard' => esc_html__( 'Big Circle Hard', 'skrollex' ),
											'process' => esc_html__( 'Process', 'skrollex' )
										)
									),
									'default' => 'small'
								)
							),
						),
						'image' => array(
							array(
								'type' => 'menu',
								'params' => array(
									'icon-css' => 'icon-featured-image',
									'label' => esc_html__( 'Column Image', 'skrollex' )
								)
							),
							'image' => array(
								array(
									'type' => 'menu-item',
									'params' => array(
										'type' => 'image',
										'label' => esc_html__('Column Image' , 'skrollex')
									),
									'default' => NULL
								)
							),
							'layout' => array(
								array(
									'type' => 'menu-item',
									'params' => array(
										'type' => 'select',
										'label' => esc_html__( 'Layout' , 'skrollex' ),
										'options' => array(
											'new-window' => esc_html__('New Window (like gallery item)' , 'skrollex'),
											'hover' => esc_html__('Hover (like team member)' , 'skrollex'),
											'paralax' => esc_html__('Parallax Background' , 'skrollex'),
											'top' => esc_html__('Image On Top' , 'skrollex'),
										)
									),
									'default' => 'new-window'
								)
							),
							'hover_colors' => array(
								array(
									'type' => 'menu-item',
									'params' => array(
										'type' => 'select',
										'label' => esc_html__( 'Hover Colors' , 'skrollex' ),
										'options' => Skrollex_Ext::colors()
									),
									'default' => 'a'
								)
							)
						)
					),
					'title' => array(
						array(
							'type' => 'field-rte',
							'params' => array(
								'class' => 'col-header small-editor'
							),
							'default' => '<h5 class="heading-col-title">' . wp_kses(__('Column <span>Title</span>', 'skrollex'), Skrollex_Ext::trusted_tags()) . '</h5>'
						)
					),
					'column_details' => array(
						array(
							'type' => 'field-rte',
							'params' => array(
								'class' => 'col-details small-editor'
							),
							'default' => '<p class="col-details">' . wp_kses(__('Column <span>Details</span>', 'skrollex'), Skrollex_Ext::trusted_tags()) . '</p>',
						)
					),
					'excerpt' => array(
						array(
							'type' => 'field-rte',
							'params' => array(
								'class' => 'col-excerpt area-editor'
							),
							'default' => '<p>' . wp_kses(__('Column Content', 'skrollex'), Skrollex_Ext::trusted_tags()) . '.</p>'
						)
					),
					'slider_location' => array(
						array(
							'type' => 'field-layers-input',
							'params' => array(
								'type' => 'select',
								'options' => array('width' =>  esc_html__('Width', 'skrollex'), 'left' =>  esc_html__('Left', 'skrollex'), 'right' =>  esc_html__('Right', 'skrollex'))
							),
							'default' => 'width',
							'span' => '6',
							'label' => esc_html__('Media Block Location', 'skrollex')
						) 
					),
					'slider_height' => array(
						array(
							'type' => 'field-layers-input',
							'params' => array(
								'type' => 'number',
								'placeholder' => esc_html__( 'If empty then auto' , 'skrollex' ),
							),
							'default' => '',
							'span' => '6',
							'label' => esc_html__('Image/Slider Height, px', 'skrollex')
						)
					),
					'slides' => array(
						array(
							'type' => 'list',
							'control_title' => esc_html__( 'Media Block Image' , 'skrollex' ),
							'add_label' => esc_html__( 'Add Image (If multiple then slider)' , 'skrollex' ),
							'default_count' => 0
						),
						'design' => array(
							array(
								'type' => 'design-bar',
								'layout' => 'top',
								'params' => array(
									'show_trash' => true
								),
								'components' => array('custom')
							)
						),
						'image' => array(
							array(
								'type' => 'field-layers-input',
								'params' => array(
									'type' => 'image',
									'label' => esc_html__( 'Image' , 'skrollex' )
								),
								'default' => NULL
							)
						)
					),
					'media' => array(
						array(
							'type' => 'field-rte',
							'params' => array(
								'class' => 'col-excerpt small-editor'
							),
							'default' => '',
							'label' => esc_html__('Media Block Content (useful for video or text)', 'skrollex')
						)
					),
				),
				'bgs' => array(
					array(
						'type' => 'list',
						'control_title' => esc_html__( 'Background' , 'skrollex' ),
						'add_label' => esc_html__( 'Add Background (if multiple then animated)' , 'skrollex' ),
						'default_count' => 3
					),
					'design' => array(
						array(
							'type' => 'design-bar',
							'layout' => 'top',
							'params' => array(
								'show_trash' => true
							),
							'components' => array('custom')
						)
					),
					'image' => array(
						array(
							'type' => 'field-layers-input',
							'params' => array(
								'type' => 'image',
								'label' => esc_html__( 'Image' , 'skrollex' )
							),
							'default' => NULL
						)
					)
				)
			);
			$this->column_class = array(
					'1-5'	=> 'pure-u-12-24 pure-u-lg-1-5',
					'2-5'	=> 'pure-u-12-24 pure-u-lg-2-5',
					'3-5'	=> 'pure-u-1 pure-u-lg-3-5',
					'4-5'	=> 'pure-u-1 pure-u-lg-4-5',
					'0.5'	=> 'pure-u-12-24 pure-u-md-1-24',
					'1'		=> 'pure-u-12-24 pure-u-md-2-24',
					'1.5'	=> 'pure-u-12-24 pure-u-md-3-24',
					'2'		=> 'pure-u-12-24 pure-u-md-4-24',
					'2.5'	=> 'pure-u-12-24 pure-u-md-5-24',
					'3'		=> 'pure-u-12-24 pure-u-md-6-24',
					'3.5'	=> 'pure-u-12-24 pure-u-md-7-24',
					'4'		=> 'pure-u-1 pure-u-md-8-24',
					'4.5'	=> 'pure-u-12-24 pure-u-md-9-24',
					'5'		=> 'pure-u-12-24 pure-u-md-10-24',
					'5.5'	=> 'pure-u-12-24 pure-u-md-11-24',
					'6'		=> 'pure-u-1 pure-u-lg-12-24',
					'6.5'	=> 'pure-u-1 pure-u-lg-13-24',
					'7'		=> 'pure-u-1 pure-u-lg-14-24',
					'7.5'	=> 'pure-u-1 pure-u-lg-15-24',
					'8'		=> 'pure-u-1 pure-u-lg-16-24',
					'8.5'	=> 'pure-u-1 pure-u-lg-17-24',
					'9'		=> 'pure-u-1 pure-u-lg-18-24',
					'9.5'	=> 'pure-u-1 pure-u-lg-19-24',
					'10'	=> 'pure-u-1 pure-u-lg-20-24',
					'10.5'	=> 'pure-u-1 pure-u-lg-21-24',
					'11'	=> 'pure-u-1 pure-u-lg-22-24',
					'11.5'	=> 'pure-u-1 pure-u-lg-23-24',
					'12'	=> 'pure-u-1 pure-u-lg-24-24'
				);
		}
		/**
		 * Display widget
		 */
		public function widget($args, $instance) {
			$cach_id = $this->widget_id . '-' . $args['widget_id'];
			if ( ! $this->is_preview() ) {
				$cached = wp_cache_get( $cach_id );
				if ( ! empty( $cached ) ) {
					echo $cached;
					return;
				}
				ob_start();
			}
			$vals = self::vals($this->model, $instance);
			$this->apply_widget_advanced_styling($args['widget_id'], $vals);
			$widget_container_class = array();
			$widget_container_class[] = 'widget';
			if(isset($vals['design'],$vals['design']['advanced'],$vals['design']['advanced']['customclass'])){
				$widget_container_class[] = $vals['design']['advanced']['customclass'];
			}
			$widget_container_class[] = $this->get_widget_spacing_class($vals);
			if($vals['design']['display']['hide_on_small'] === 'yes'){
				$widget_container_class[] = 'hide-on-small-devices';
			}
			$data_header_background = '';
			if($vals['design']['overlay']['to_front'] === 'yes'){
				$widget_container_class[] = 'overlay-to-front';
			}
			if(
					isset($vals['design']['effect']['header_effect'])
					&& $vals['design']['effect']['header_effect']!=='no'
					&& !empty($vals['design']['effect']['header_background_selector'])
			){
				if($vals['design']['effect']['header_effect'] === 'custom-circle'){
					$widget_container_class[] = 'text-mask';
				}else if($vals['design']['effect']['header_effect'] === 'fullscreen'){
					$widget_container_class[] = 'text-fullscreen';
				}else if($vals['design']['effect']['header_effect'] === 'fit-text'){
					$widget_container_class[] = 'text-fit';
				}else{
					$widget_container_class[] = 'text-bg';
				}
				$data_header_background .= ' data-text-effect-selector="' . $vals['design']['effect']['header_background_selector'] . '" data-text-effect="' . $vals['design']['effect']['header_effect'] . '"';
			}
			if(!empty($vals['design']['effect']['image'])){
				$hb = wp_get_attachment_image_src($vals['design']['effect']['image'], 'full');
				$data_header_background .= ' data-text-bg="' . esc_url($hb[0]) . '"';
			}
			$widget_container_class_str = implode(' ', apply_filters('skrollex_content_widget_container_class', $widget_container_class));
			?>
			<div class="view x40-widget <?php echo esc_attr($widget_container_class_str); ?>" id="<?php echo esc_attr($args['widget_id']); ?>"<?php echo $data_header_background;  ?>>
				<?php
				if (!empty($vals['bgs'])) { 
					foreach ( array_reverse( explode(',', $vals['bgs_ids']) ) as $bg_key ) {
						if (!isset($vals['bgs'][$bg_key]))
							continue;
						$bg = $vals['bgs'][$bg_key];
						if (!empty($bg['image'])){
							$bg_img = wp_get_attachment_image_src( $bg['image'] , 'full' );
							?>
							<div data-src="<?php echo esc_url($bg_img[0]) ?>" class="bg-holder"></div>
							<?php
						}
					}
				}
				$fg_colors = 'colors-' . $vals['design']['display']['colors'];
				$fg_section_height = $vals['design']['display']['section_height'];
				$fg_top_padding = $vals['design']['display']['top_padding'];
				$fg_bottom_padding = $vals['design']['display']['bottom_padding'];
				$id_str = '' != $vals['anchor_id'] ? (' id="' . esc_attr($vals['anchor_id']) . '"') : '';
				$fg_transp = '';
				if(!empty($vals['design']['overlay']['image'])){
					$fg_transp = 'background-transparent ';
				}
				?>
				<div<?php echo $id_str ?> class="fg <?php echo esc_attr($fg_transp); ?><?php echo esc_attr($fg_colors) ?> <?php echo ('normal-size' != $fg_section_height ? (' ' . esc_attr($fg_section_height)) : '') ?><?php echo ($fg_top_padding == 'no' ? (' no-top-padding') : '') ?><?php echo ($fg_bottom_padding == 'no' ? (' no-bottom-padding') : '') ?>">
					<?php if($vals['design']['overlay']['pattern'] !== 'no'){ ?>
						<div class="image-overlay <?php echo esc_attr($vals['design']['overlay']['pattern']) ?>"></div>
					<?php } ?>
					<?php
					if(!empty($vals['design']['overlay']['image'])){
						get_template_part( 'includes/lib/overlays/custom', 'mask' );
					}
					if($vals['design']['overlay']['overlay'] !== 'no'){
						skrollex_svg_overlay($args, $vals['design']['overlay']['overlay']);
					}
					?>
				<?php $this->widget_content($vals); ?>
				</div>
			</div>
			<?php
			if ( ! $this->is_preview() ) {
				$cached = ob_get_flush();
				wp_cache_set( $cach_id, $cached );
			}
		}
		/**
		 * Display widget content. Empty by default.
		 */
		public function widget_content($vals){
		}
	}
}

