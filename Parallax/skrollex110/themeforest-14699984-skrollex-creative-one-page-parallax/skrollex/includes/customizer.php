<?php
/**
 * Set Customizer controls
 */
if( ! function_exists( 'skrollex_customizer_controls' ) ) {	
	function skrollex_customizer_controls($controls) {
		if ( !defined('SKROLLEX_SLUG') ){
			return $controls;
		}
		unset($controls['header-layout']['header-menu-layout']['choices']['header-logo-center-top']);
		unset($controls['header-layout']['header-menu-layout']['choices']['header-logo-top']);
		unset($controls['header-layout']['header-menu-layout']['choices']['header-logo-center']);
		unset($controls['header-layout']['header-layout-break-1']);
		unset($controls['header-layout']['header-position-heading']);
		unset($controls['header-layout']['header-sticky']);
		unset($controls['header-layout']['header-overlay']);
		// Social links on left border
		$controls['site-social-media'] = array(
			'social-facebook' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Facebook URL', 'skrollex'),
				'default' => 'https://www.facebook.com/',
			),
			'social-twitter' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Twitter URL', 'skrollex'),
				'default' => 'https://twitter.com/',
			),
			'social-youtube' => array(
				'type' => 'layers-text',
				'label' => esc_html__('YouTube URL', 'skrollex'),
				'default' => 'http://www.youtube.com/',
			),
			'social-vimeo' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Vimeo URL', 'skrollex'),
				'default' => 'https://vimeo.com/',
			),
			'social-linkedin' => array(
				'type' => 'layers-text',
				'label' => esc_html__('LinkedIn URL', 'skrollex'),
				'default' => 'https://www.linkedin.com/',
			),
			'social-soundcloud' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Soundcloud URL', 'skrollex'),
			),
			'social-github' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Github URL', 'skrollex'),
			),
			'social-bitbucket' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Bitbucket URL', 'skrollex'),
			),
			'social-instagram' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Instagram URL', 'skrollex'),
			),
			'social-flickr' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Flickr URL', 'skrollex'),
			),
			'social-google-plus' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Google Plus URL', 'skrollex'),
			),
			'social-vk' => array(
				'type' => 'layers-text',
				'label' => esc_html__('VK URL', 'skrollex'),
			),
		);
		$controls['site-appearance'] = array(
			'site-decoration' => array(
				'type' => 'layers-select',
				'label' => esc_html__('Site Border', 'skrollex'),
				'default' => 'b',
				'choices' => array(
					'b' => esc_html__( 'Border 1' , 'skrollex' ),
					'a' => esc_html__( 'Border 2' , 'skrollex' )
				)
			),
			'site-to-top' => array(
				'type' => 'layers-text',
				'label' => esc_html__('To Top Navigation Text', 'skrollex'),
				'default' => esc_html__('To [Top]', 'skrollex'),
			),
			'site-scroll-down' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Scroll Down Navigation Text', 'skrollex'),
				'default' => esc_html__('Scroll [Down]', 'skrollex'),
			),
			'background-images-extended-navigation' => array(
				'type' => 'image',
				'label' => esc_html__('Extended Menu Background', 'skrollex'),
				'default' => get_stylesheet_directory_uri() . "/assets/preset-images/bg-john-kraus-2.jpg",
			)
		);
		$controls['site-api-keys'] = array(
			'site-google-maps-api-key' => array(
				'type' => 'layers-text',
				'label' => esc_html__('Google Maps API Key', 'skrollex'),
				'default' => NULL
			)
		);
		return $controls;
	}
}
add_filter('layers_customizer_controls',  'skrollex_customizer_controls', 50);
/**
 * Set Customizer sections
 */
if( ! function_exists( 'skrollex_customizer_sections' ) ) {	
	function skrollex_customizer_sections($sections) {
		if ( !defined('SKROLLEX_SLUG') ){
			return $sections;
		}
		$additional['site-social-media'] = array(
			'title' => esc_html__('Social Media Profiles', 'skrollex'),
			'panel' => 'site-settings',
		);
		$additional['site-appearance'] = array(
			'title' => esc_html__('Appearance', 'skrollex'),
			'panel' => 'site-settings',
		);
		$additional['site-api-keys'] = array(
			'title' => esc_html__('API Keys', 'skrollex'),
			'panel' => 'site-settings',
		);
		$additional['site-performance'] = array(
			'title' => esc_html__('Optimization', 'skrollex'),
			'panel' => 'site-settings',
		);
		$sections = array_merge($sections, $additional);
		return $sections;
	}
}
add_filter('layers_customizer_sections',  'skrollex_customizer_sections', 50);

