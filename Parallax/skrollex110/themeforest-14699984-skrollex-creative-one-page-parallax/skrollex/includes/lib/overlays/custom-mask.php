<?php
$prefix =  $args['widget_id'] . '-' . basename(__FILE__, '.php');
$att = wp_get_attachment_image_src($vals['design']['overlay']['custom_image'], 'full');
$image = $att[0];
$image_w = $att[1];
$image_h = $att[2];
?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="svg-overlay fixed" viewBox="0 0 <?php echo esc_attr($image_w); ?> <?php echo esc_attr($image_h); ?>">
	<defs>
		<mask x="0" y="0" width="100%" height="100%" id="<?php echo esc_attr($prefix); ?>-mask">
			<image xlink:href="<?php echo esc_url($image); ?>" x="0" y="0" width="<?php echo esc_attr($image_w); ?>px" height="<?php echo esc_attr($image_h); ?>px"/>
		</mask>
	</defs>
	<rect  width="<?php echo esc_attr($image_w); ?>" height="<?php echo esc_attr($image_h); ?>" class="fill-bg" mask="url('#<?php echo esc_url($prefix); ?>-mask')"/>
</svg>