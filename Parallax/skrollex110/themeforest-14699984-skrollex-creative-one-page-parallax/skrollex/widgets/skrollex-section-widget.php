<?php
/**
 * Skrollex Section.
 * Widget for display page sections.
 */
if (!class_exists('Skrollex_Section_Widget') && class_exists('Layers_Widget')) {
	class Skrollex_Section_Widget extends Skrollex_Section_Base {
		/**
		 * Constructor
		 */
		public function Skrollex_Section_Widget() {
			parent::__construct(array(
				'widget_title' => esc_html__('SX Section', 'skrollex'), 
				'widget_id' => SKROLLEX_SLUG . '-section',
				'description' => esc_html__('This widget is used to display your content.', 'skrollex')
			));
		}
		/**
		 * Display widget content
		 */
		public function widget_content($vals){
			if(
					(isset($vals['uptitle']) && '' != $vals['uptitle'])
				||	(isset($vals['htmltitle']) && '' != $vals['htmltitle'])
				||	(isset($vals['header_details']) && '' != $vals['header_details'])
				||	(isset($vals['excerpt']) && '' != $vals['excerpt'])
			){
				?><div class="layout-boxed section-top"><?php	
				
				if (isset($vals['uptitle']) && '' != $vals['uptitle']) {
					self::rte_content($vals['uptitle']);
				}
				if (isset($vals['htmltitle']) && '' != $vals['htmltitle']) {
					self::rte_content($vals['htmltitle']);
				}
				if (isset($vals['header_details']) && '' != $vals['header_details']) {
					self::rte_content($vals['header_details']);
				}
				if (isset($vals['excerpt']) && '' != $vals['excerpt']) {
					self::rte_content($vals['excerpt']);
				}
				?></div><?php
			}
			$this->widget_columns($vals);
		}
		public function widget_columns($vals){
			if(count($vals['columns']) > 0) {
				$column_ids = explode(',', $vals['columns_ids']);
				$filters = array();
				$is_process = false;
				foreach ($column_ids as $column_key) {
					$filterStr = $vals['columns'][$column_key]['design']['display']['filter'];
					if(isset($filterStr) && '' != $filterStr){
						$filters = array_merge($filters, self::getFilters($filterStr));
					}
					$image_att = wp_get_attachment_image_src($vals['columns'][$column_key]['design']['image']['image'], 'full');
					$image = is_array($image_att) ? $image_att[0] : NULL;
					if('process' == $vals['columns'][$column_key]['design']['icon']['icon_layout'] && '' != $vals['columns'][$column_key]['design']['icon']['icon'] && !$image){
						$is_process = true;
					}
				}
				$is_filter = (count($filters) > 0) && ('list-masonry' == $vals['design']['liststyle']['liststyle']);
				if($is_filter){
					?><ul class="filter"><?php
					echo '<li><a class="hover-effect" data-group="all" href="">'. esc_html__( 'All', 'skrollex' ) .'</a></li>';
					foreach ($filters as $key => $value) {
						echo '<li><a class="hover-effect" data-group="' . esc_attr($key) . '" href="">'. esc_html($value) . '</a></li>';
					}
					?></ul><?php
				}
				?>
				<div class="section-cols <?php echo ( ($vals['design']['layout'] === 'layout-boxed' ? 'layout-boxed' : 'layout-fullwidth') . ($is_filter ? ' gallery-grd' : '') ) ?>">
				<?php if('list-masonry' === $vals['design']['liststyle']['liststyle']){ ?>
					<div class="masonry-grd">
				<?php } ?>
				<?php
				if($is_process){
					?><div class="process"><div class="process-row"><?php
				}
				?><div class="pure-g"><?php
				foreach ($column_ids as $column_key) {
					$this->widget_column($vals, $column_key, $is_filter);
				}
				?></div><?php
				if($is_process){
					?></div></div><?php
				}
				?>
				<?php if('list-masonry' === $vals['design']['liststyle']['liststyle']){ ?>
					</div>
				<?php } ?>
				</div>
				<?php
			}
		}
		/**
		 * Display section column
		 */
		public function widget_column($vals, $column_key, $is_filter){
			if (isset($vals['columns'][$column_key])){
				$column = $vals['columns'][$column_key];
				$span_class = $this->column_class[$column['design']['layout']['width']];
				$image_att = wp_get_attachment_image_src($column['design']['image']['image'], 'full');
				$image = is_array($image_att) ? $image_att[0] : NULL;
				$is_gallery_item = $image && $column['design']['image']['layout'] == 'new-window';
				$is_image_hover = $image && $column['design']['image']['layout'] == 'hover';
				$is_image_top = $image && $column['design']['image']['layout'] == 'top';
				$is_parallax_bg = $image && $column['design']['image']['layout'] == 'paralax';
				$is_slider_left = $column['slider_location'] == 'left';
				$is_slider_width = $column['slider_location'] == 'width';
				$is_slider_right = $column['slider_location'] == 'right';
				$is_height = 'auto' != $column['design']['display']['column_height'];
				$icon = $column['design']['icon']['icon'];
				$is_icon = $icon && $column['design']['icon']['icon_layout'] === 'small' && !$is_gallery_item;
				$is_circle_icon = $icon && ($column['design']['icon']['icon_layout'] === 'circle' || $column['design']['icon']['icon_layout'] === 'circle-hard') && !$is_gallery_item;
				$is_process_icon = $icon && $column['design']['icon']['icon_layout'] === 'process' && !$is_gallery_item;
				$column_class = array();
				$column_class[] = $this->id_base . '-' . $column_key;
				$column_class[] = $span_class;
				$column_class[] = 'list-masonry' == $vals['design']['liststyle']['liststyle'] ? 'masonry-item' : '';
				$column_class[] = !isset($vals['design']['liststyle']['gutter']) || 'on' !==  $vals['design']['liststyle']['gutter'] ? '' : 'col-padding';
				if($is_gallery_item){
					$column_class[] = 'gallery-item';
				}
				if($is_filter){
					$column_class[] = 'item';
				}
				if($is_circle_icon){
					$column_class[] = 'circle-icon';
				}
				if($is_process_icon){
					$column_class[] = 'process-step';
				}
				if('simple' != $column['design']['display']['column_style']){
					$column_class[] = 'col-style-' . $column['design']['display']['column_style'];
				}
				if($is_height){
					$column_class[] = 'col-height position-relative';
					$column_class[] = 'height-' . $column['design']['display']['column_height'];
				}
				$anim_str = '';
				if($column['design']['display']['column_animation'] !== 'no'){
					$column_class[] = 'scroll-in-animation';
					if($column['design']['display']['column_animation'] === 'left'){
						$anim_str = ' data-animation="fadeInLeft"';
					}
					if($column['design']['display']['column_animation'] === 'right'){
						$anim_str = ' data-animation="fadeInRight"';
					}
					if($column['design']['display']['column_animation'] === 'up'){
						$anim_str = ' data-animation="fadeInUp"';
					}
					if($column['design']['display']['column_animation'] === 'down'){
						$anim_str = ' data-animation="fadeInDown"';
					}
				}
				$filter_str = '' != $column['design']['display']['filter'] ? ' data-groups="' . esc_attr(implode(' ', array_keys(self::getFilters($column['design']['display']['filter'])))) . '"' : '';
				?>
				<div class="<?php echo esc_attr(implode(' ', $column_class)); ?>"<?php echo $filter_str; ?><?php echo $anim_str; ?>>
				<?php
				if($is_image_top){
					echo '<img class="col-image-top" src="' . esc_url($image) . '" alt="" />';
				}
				if($is_parallax_bg){
					$parallax_height = $is_height ? ' col-height height-' . $column['design']['display']['column_height'] : '';
					?><div class="view"><img class="bg" src="<?php echo esc_url($image) ?>" alt="" /><div class="fg content-box <?php echo esc_attr($parallax_height); ?>"><?php
				}
				if ($is_icon) {
					?>
					<div class="col-icon color-heading">
						<i class="<?php echo esc_attr($column['design']['icon']['icon']); ?>"></i>
					</div>
					<div class="col-content">
					<?php	
				}
				if($is_image_hover){
					?>
					<div class="image-hover">
					<?php
				}
				if($is_height){
					?><div class="position-middle-center"><?php
				}
				if($image){
					if ($is_image_hover) {
						?>
						<div class="hover-overlay">
							<img src="<?php echo esc_url($image); ?>" alt="" />
							<div class="overlay background-<?php echo esc_attr($column['design']['image']['hover_colors']); ?> heading-<?php echo esc_attr($column['design']['image']['hover_colors']); ?> link-heading-<?php echo esc_attr($column['design']['image']['hover_colors']); ?> internal-highlight-<?php echo esc_attr($column['design']['image']['hover_colors']); ?>">
								<div>
									<?php if ($column['excerpt']) { ?>
										<div class="excerpt"><?php self::rte_content($column['excerpt']); ?></div>
									<?php } ?>
								</div>
							</div>
						</div>
						<?php
					}else if ($is_gallery_item){
						?>
						<a href="" class="gallery-link">
							<div class="hover-overlay">
								<img src="<?php echo esc_url($image); ?>" alt="" />
								<div class="overlay background-<?php echo esc_attr($column['design']['image']['hover_colors']); ?> heading-<?php echo esc_attr($column['design']['image']['hover_colors']); ?> link-heading-<?php echo esc_attr($column['design']['image']['hover_colors']); ?> internal-highlight-<?php echo esc_attr($column['design']['image']['hover_colors']); ?>">
									<div>
										<?php
										if($column['title']){
											self::rte_content($column['title']);
										}
										if($column['column_details']){
											self::rte_content($column['column_details']);
										}
										if ($is_icon) {
											echo '<p><i class="' . esc_attr($column['design']['icon']['icon']) . '"></i></p>';
										}
										?>
									</div>
								</div>
							</div>
						</a>
						<?php
					}
				}
				if($column['title'] || $column['column_details'] || $column['excerpt'] || $column['slides_ids']){
					if($is_gallery_item || $is_image_hover){
						?><div class="<?php echo $is_gallery_item ? 'gallery-item-content' : 'col-body'; ?>"><?php
					}
					if($is_circle_icon){
						$border_class = ' border-lite';
						if($column['design']['icon']['icon_layout'] == 'circle-hard'){
							$border_class = '';
						}
						echo '<p class="text-center"><i class="' . esc_attr($column['design']['icon']['icon']) . esc_attr($border_class) . ' circle scroll-in-animation player" data-animation="fadeInUp"></i></p>';
					}
					if($is_process_icon){
						echo '<div class="process-box"><i class="' . esc_attr($column['design']['icon']['icon']) . ' color-heading"></i></div>';
					}
					if($column['title']){
						self::rte_content($column['title']);
					}
					$slides_keys = explode(',', $column['slides_ids']);
					$slides_count = 0;
					foreach ($slides_keys as $slide_key) {
						if (!isset($column['slides'][$slide_key])){
							continue;
						}
						$slide = $column['slides'][$slide_key];
						if (!empty($slide['image'])){
							$slides_count++;
						}
					}
					$is_slider = $slides_count > 0 || '' != $column['media'];
					$slider_span = $is_slider_width ? 'col-padding pure-u-1' : 'col-padding pure-u-1 pure-u-lg-18-24';
					$column_body_span = ($is_slider_width || !$is_slider) ? 'col-padding pure-u-1' : 'col-padding pure-u-1 pure-u-lg-6-24';
					if($is_slider){
						?><div class="row responsive-wide"><?php
					}
					if(!$is_slider_right && $is_slider){
						echo '<div class="' . esc_attr($slider_span) . '">';
						$this->slider($column, $is_gallery_item, $slides_keys, $slides_count);
						echo '</div>';
					}
					if($is_slider){
						?><div class="<?php echo esc_attr($column_body_span); ?>"><?php
					}
					if($column['column_details'] && (!$is_gallery_item)){
						self::rte_content($column['column_details']);
					}
					if($column['excerpt'] && (!$is_image_hover)){
						self::rte_content($column['excerpt']);
					}
					if($is_slider){
						?></div><?php
					}
					if($is_slider_right && $is_slider){
						?><div class="<?php echo esc_attr($slider_span); ?>"><?php
						$this->slider($column, $is_gallery_item, $slides_keys, $slides_count);
						?></div><?php
					}
					if($is_slider){
						?></div><?php
					}
					if($is_gallery_item || $is_image_hover){
						?></div><?php
					}
				}
				if($is_height){
					?></div><?php
				}
				if($is_image_hover){
					?></div><?php
				}
				if ($is_icon) {
					?></div><?php	
				}
				if($is_parallax_bg){
					?></div></div><?php
				}
				?></div><?php
			}
		}
		/**
		 * Display slider
		 */
		public function slider($column, $is_gallery_item, $slides_keys, $slides_count){
			if (!empty($column['slides'])) {
				$slider_height = $column['slider_height']
				?>
<div class="swiper-container default-slider<?php echo ($is_gallery_item ? ' hold' : '') ?>" data-swiper-options="{<?php echo ($slides_count > 1 ? 'loop: true' : 'touchRatio: 0'); ?>, speed: 300}"<?php echo $slider_height ? (' style="height: ' . esc_attr($slider_height) . 'px;"') : '' ?>>
					<div class="swiper-wrapper">
				<?php
					foreach ($slides_keys as $slide_key) {
						if (!isset($column['slides'][$slide_key])){
							continue;
						}
						$slide = $column['slides'][$slide_key];
						if (!empty($slide['image'])){
							$image_img = wp_get_attachment_image_src( $slide['image'] , 'full' );
							if($is_gallery_item && $slider_height){
								?>
								<div class="swiper-slide" data-hold-img="<?php echo esc_url($image_img[0]) ?>" data-as-bg="yes"></div>
								<?php
							}else if($is_gallery_item && !$slider_height){
								?>
								<div class="swiper-slide" data-hold-img="<?php echo esc_url($image_img[0]) ?>" data-as-bg="no"></div>
								<?php
							}else if(!$is_gallery_item && $slider_height){
								?>
								<div class="swiper-slide" style="background-image: url(<?php echo esc_url($image_img[0]) ?>);"></div>
								<?php
							}else if(!$is_gallery_item && !$slider_height){
								?>
								<img class="swiper-slide" alt="" src="<?php echo esc_url($image_img[0]) ?>" />
								<?php
							}
						}
					}
				?>
					</div>
					<?php if($slides_count > 1){ ?>
					<div class="swiper-pagination swiper-pagination-white"></div>
					<div class="swiper-button-prev swiper-button-white"></div>
					<div class="swiper-button-next swiper-button-white"></div>
					<?php } ?>
				</div>
				<?php
			}
			if('' != $column['media']){
				if($is_gallery_item){
					echo preg_replace('/<iframe([^>]*) src=/i', '<iframe$1 data-hold-src=', $column['media']);
				}else{
					echo $column['media'];
				}
			}
		}
	}
	/**
	 * Register this widget
	 */
	register_widget("Skrollex_Section_Widget");
}

