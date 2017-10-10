<?php
function skrollex_svg_overlay($args, $overlay){
	switch ( $overlay ) {
		case 'svg-overlay-10':
			$prefix =  $args['widget_id'] . '-' . $overlay;
			$overlay_class = "flask svg-overlay left-bottom fixed flask-scene-visibility";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-flask.php';
			$overlay_class = "lamp-scene-visibility svg-overlay right-top fixed";
			$lamp_light_class = "fill-background";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-lamp.php';
			$overlay_class = "flask-bubbles from-bottom svg-overlay right-bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-bubbles.php';
			break;
		case 'svg-overlay-14':
			$prefix =  $args['widget_id'] . '-' . $overlay;
			$overlay_class = "flask svg-overlay left-bottom fixed flask-scene-visibility";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-flask.php';
			$overlay_class = "lamp-scene-visibility svg-overlay right-top";
			$lamp_light_class = "fill-background";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-lamp.php';
			$overlay_class = "arrow-scroll svg-overlay bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-scroll.php';
			$overlay_class = "flask-bubbles from-bottom svg-overlay bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-bubbles.php';
			break;
		case 'svg-overlay-16':
			$prefix =  $args['widget_id'] . '-' . $overlay;
			$overlay_class = "flask svg-overlay left-bottom fixed flask-scene-visibility";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-flask.php';
			$overlay_class = "arrow-scroll svg-overlay bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-scroll.php';
			$overlay_class = "flask-bubbles from-bottom svg-overlay bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-bubbles.php';
			break;
		case 'svg-overlay-17':
			$prefix =  $args['widget_id'] . '-' . $overlay;
			$overlay_class = "flask svg-overlay left-bottom fixed flask-scene-visibility";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-flask.php';
			$overlay_class = "arrow-scroll svg-overlay right-bottom fixed";
			require get_stylesheet_directory() . '/item-scroll.php';
			$overlay_class = "flask-bubbles from-bottom svg-overlay right-bottom fixed";
			require get_stylesheet_directory() . '/item-bubbles.php';
			break;
		case 'svg-overlay-9':
			$prefix =  $args['widget_id'] . '-' . $overlay;
			$overlay_class = "lamp-scene-visibility svg-overlay right-top";
			$lamp_light_class = "fill-background";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-lamp.php';
			$overlay_class = "arrow-scroll svg-overlay bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-scroll.php';
			$overlay_class = "flask-bubbles from-bottom svg-overlay bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-bubbles.php';
			$prefix =  $args['widget_id'] . '-2-' . $overlay;
			$overlay_class = "flask-bubbles from-bottom svg-overlay right-bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-bubbles.php';
			break;
		case 'svg-overlay-lamp':
			$prefix =  $args['widget_id'] . '-' . $overlay;
			$overlay_class = "lamp-scene-visibility svg-overlay right-top";
			$lamp_light_class = "fill-background";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-lamp.php';
			$overlay_class = "flask-bubbles from-bottom svg-overlay right-bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-bubbles.php';
			break;
		case 'svg-overlay-scroll-right':
			$overlay_class = "arrow-scroll svg-overlay right-bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-scroll.php';
			$overlay_class = "flask-bubbles from-bottom svg-overlay right-bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-bubbles.php';
			break;
		case 'svg-overlay-scroll':
			$overlay_class = "arrow-scroll svg-overlay bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-scroll.php';
			$overlay_class = "flask-bubbles from-bottom svg-overlay bottom fixed";
			require get_stylesheet_directory() . '/includes/lib/overlays/item-bubbles.php';
			break;
	}
}
?>
