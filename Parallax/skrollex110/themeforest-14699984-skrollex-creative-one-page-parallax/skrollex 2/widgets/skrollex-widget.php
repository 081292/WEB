<?php
/**
 * Base class for widgets
 */
if (!class_exists('Skrollex_Widget')) {
	class Skrollex_Widget extends Layers_Widget {
		/**
		 * Constructor
		 */
		public function Skrollex_Widget($opt) {
			$this->widget_title = $opt['widget_title'];
			$this->widget_id = $opt['widget_id'];
			$this->post_type = '';
			$this->taxonomy = '';
			$this->checkboxes = array();
			$widget_ops = array('classname' => 'layers-' . $this->widget_id . '-widget', 'description' => $opt['description']);
			$control_ops = array('width' => LAYERS_WIDGET_WIDTH_LARGE, 'height' => NULL, 'id_base' => LAYERS_THEME_SLUG . '-widget-' . $this->widget_id);
			parent::__construct(LAYERS_THEME_SLUG . '-widget-' . $this->widget_id , $this->widget_title, $widget_ops, $control_ops);
		}
		/**
		 * Update widget
		 */
		public function update($new_instance, $old_instance) {
			if (isset($this->checkboxes)) {
				foreach ($this->checkboxes as $cb) {
					if (isset($old_instance[$cb])) {
						$old_instance[$cb] = strip_tags($new_instance[$cb]);
					}
				}
			}
			return $new_instance;
		}
		/**
		 * Recursive function for display form elements in Customizer.
		 * It passes the widget structure (tree).
		 */
		function form_layer($point, $model_path, $vals, $id_prefix, $name_prefix){
			// Find elements from design bar
			foreach ($point as $design_name => $design_elem) {
				if(self::elemOpt($design_elem, 'type') == 'design-bar'){
					$design_params = self::elemOpt($design_elem, 'params');
					$design_params['name'] = self::make_field_name($name_prefix, $design_name);
					$design_params['id'] = self::make_field_id($id_prefix, $design_name);
					$design_params['number'] = $this->number;
					$custom_components = array();
					foreach ($design_elem as $menu_name => $menu_elem) {
						if(self::elemOpt($menu_elem, 'type') == 'menu'){
							$custom_components[$menu_name] = self::elemOpt($menu_elem, 'params');
							$custom_components[$menu_name]['elements'] = array();
							$item_id_prefix = self::make_field_id($design_params['id'], $menu_name);
							$item_name_prefix = self::make_field_name($design_params['name'], $menu_name);
							foreach ($menu_elem as $item_name => $item_elem) {
								if(self::elemOpt($item_elem, 'type') == 'menu-item'){
									$item_params = self::elemOpt($item_elem, 'params');
									$item_params['id'] = self::make_field_id($item_id_prefix, $item_name);
									$item_params['name'] = self::make_field_name($item_name_prefix, $item_name);
									$item_params['value'] = (isset($vals[$design_name]) && isset($vals[$design_name][$menu_name]) && isset($vals[$design_name][$menu_name][$item_name])) ? $vals[$design_name][$menu_name][$item_name] : NULL;
									$custom_components[$menu_name]['elements'][$item_name] = $item_params;
								}
							}
						}
					}
					$this->design_bar(
						self::elemOpt($design_elem, 'layout'),
						$design_params,
						$vals,
						self::elemOpt($design_elem, 'components'),
						$custom_components
					);
				}
			}
			$pointType = self::elemOpt($point, 'type');
			if($pointType == 'root'){
				?>
				<div class="layers-container-large skrollex-widget" id="<?php echo esc_attr($id_prefix); ?>">
				<?php
				$this->form_elements()->header(array(
					'title' => $this->widget_title,
					'icon_class' => 'text'
				));
				?>
					<section class="layers-accordion-section layers-content layers-row">
				<?php
			}
			// Find other elements
			foreach ($point as $element_name => $element) {
				$type = self::elemOpt($element, 'type');
				if(isset($type)){
					if(substr($type, 0, 6) == 'field-'){
						$span = self::elemOpt($element, 'span');
						if(!isset($span)){
							$span = '12';
						}
						$params = self::elemOpt($element, 'params');
						$is_hidden_field = isset($params) && isset($params['type']) && $params['type'] == 'hidden';
						$label = self::elemOpt($element, 'label');
						$field_id = self::make_field_id($id_prefix, $element_name);
						$field_name = self::make_field_name($name_prefix, $element_name);
						if(!$is_hidden_field){
							echo '<div class="widget-form-item layers-column layers-span-' . esc_attr($span) . '">';
						}
						if(isset($label)){
							echo '<label for="' . esc_attr($field_id) . '">' . wp_kses($label, Skrollex_Ext::trusted_tags()) . '</label>';
						}
						$this->field($element, isset($vals[$element_name]) ? $vals[$element_name] : NULL, $field_id, $field_name);
						if(!$is_hidden_field){
							echo '</div>';
						}
					}else if($type == 'form-content'){
						$params = self::elemOpt($element, 'params');
						Skrollex_Ext::trusted($params['content']);
					}else if($type == 'list'){
						$ids_name = $element_name . '_ids';
						$list_id = self::make_field_id($id_prefix, $element_name);
						$list_ids_id = self::make_field_id($id_prefix, $ids_name);
						$list_name = self::make_field_name($name_prefix, $element_name);
						$list_ids_name = self::make_field_name($name_prefix, $ids_name);
						$list_vals = isset($vals[$element_name]) ? $vals[$element_name] : array();
						$this->form_elements()->input(array(
							'type' => 'hidden',
							'name' => $list_ids_name,
							'id' => $list_ids_id,
							'value' => ( isset( $vals[$ids_name] ) ) ? $vals[$ids_name] : NULL
						));
						?>
						<ul id="<?php echo esc_attr($list_id); ?>" class="widget-list layers-accordions layers-column layers-span-12" data-list-ids-id="<?php echo esc_attr($list_ids_id); ?>">
						<?php
							$list_item_guids = (isset($vals[$ids_name]) && $vals[$ids_name] != '') ? explode(',', $vals[$ids_name]) : array();
							$list_model_path = $model_path . '[' . $element_name . ']';
							foreach($list_item_guids as $list_item_guid){
								$list_item_vals = $list_vals[$list_item_guid];
								$this->list_item($element, $list_model_path, $list_id, $list_name, $list_item_guid, $list_item_vals);
							}
						?>
						</ul>
						<div class="layers-push-bottom layers-column layers-span-12">
							<button class="layers-button btn-full add-new-widget add-widget-list-item" data-list-model-path="<?php echo esc_attr($list_model_path); ?>" data-list-id="<?php echo esc_attr($list_id); ?>" data-list-name="<?php echo esc_attr($list_name); ?>" data-list-ids-id="<?php echo esc_attr($list_ids_id); ?>" data-php-class="<?php echo esc_attr(get_class($this)); ?>"><?php echo esc_html(self::elemOpt($element, 'add_label')); ?></button>
						</div>
						<?php
					}else if($type == 'group'){
						$this->form_layer($element, $model_path . '[' . $element_name . ']', $vals[$element_name], self::make_field_id($id_prefix, $element_name), self::make_field_name($name_prefix, $element_name));
					}
				}
			}
			if($pointType == 'root'){
				?>
					</section>
				</div>
				<?php
			}
		}
		/**
		 * Display item in accordion list in Customizer
		 */
		function list_item($list_element, $list_model_path, $list_id, $list_name, $list_item_guid, $list_item_vals){
			$list_item_id = self::make_field_id($list_id, $list_item_guid);
			$list_item_name = self::make_field_name($list_name, $list_item_guid);
			?>
			<li class="layers-accordion-item" id="<?php echo esc_attr($list_item_id); ?>" data-guid="<?php echo esc_attr($list_item_guid) ?>">
				<a class="layers-accordion-title <?php echo esc_attr($list_id) ?>-handle">
					<span>
						<?php
						echo esc_html(self::elemOpt($list_element, 'control_title'));
						echo '<span class="layers-detail">';
						$list_item_title = isset($list_item_vals['title']) ? $list_item_vals['title'] : '';
						if($list_item_title){
							$list_item_title_text = stripslashes(strip_tags(preg_replace( '~\[[^\]]+\]~', '', $list_item_title)));
							echo ( $list_item_title != '' ? ': ' . esc_html(substr($list_item_title_text, 0, 50)) : NULL );
							echo ( strlen($list_item_title_text) > 50 ? '...' : NULL ); 
						}
						echo '</span>';
						?>
					</span>
				</a>
				<section class="layers-accordion-section layers-content layers-row">
					<?php $this->form_layer($list_element, $list_model_path, $list_item_vals, $list_item_id, $list_item_name) ?>
				</section>
			</li>
			<?php
		}
		/**
		 * Display widget form in Customizer
		 */
		public function form($instance) {
			$this->form_layer(
					$this->model,
					'',
					self::vals($this->model, $instance, TRUE),
					'widget-' . $this->id_base . '-' . $this->number,
					'widget-' . $this->id_base . '[' . $this->number . ']'
			);
		}
		/**
		 * Extract value from structure
		 */
		static function varByPath($base, $name){
			$keys = explode('[', str_replace(']', '', $name));
			$cur = $base;
			foreach ($keys as $key){
				if($key !== ''){
					$cur = $cur[$key];
				}
			}
			return $cur;
		}
		/**
		 * Create field id
		 */
		static function make_field_id($prefix, $name){
			return $prefix . '-' . $name;
		}
		/**
		 * Create field name
		 */
		static function make_field_name($prefix, $name){
			return $prefix . '[' . $name . ']';
		}
		/**
		 * Fill widget instance. Set default values if not defined.
		 */
		static function vals($point, $instance, $is_editor = FALSE){
			$vals = array();
			if(!isset($instance) || !is_array($instance)){
				$instance = array();
			}
			foreach ($instance as $name => $val) {
				$vals[$name] = $val;
			}
			foreach ($point as $name => $val) {
				$type = self::elemOpt($val, 'type');
				if($type === 'design-bar' || $type === 'menu' || $type === 'group'){
					if(!isset($instance[$name])){
						$instance[$name] = array();
					}
					$vals[$name] = self::vals($point[$name], $instance[$name], $is_editor);
				}else if($type === 'list'){
					if(!isset($instance[$name]) && !isset($instance[$name . '_ids'])){
						$def_count = self::elemOpt($val, 'default_count');
						$instance[$name] = array();
						for($i=0; $i<$def_count; $i++){
							$instance[$name][self::guid()] = array();
						}
					}
					$ids_names = '';
					$vals[$name] = array();
					if(isset($instance[$name])){
						foreach ($instance[$name] as $item_guid => $item_val) {
							$ids_names .= ($ids_names !== '' ? ',' : '') . $item_guid;
							$vals[$name][$item_guid] = self::vals($point[$name], $item_val, $is_editor);
						}
					}
					$vals[$name . '_ids'] = $ids_names;
				}else{
					$params = self::elemOpt($val, 'params');
					if(!isset($params['type']) || $params['type'] !== 'checkbox'){
						if($is_editor){
							if(!isset($vals[$name])){
								$def = self::elemOpt($val, 'default');
								if(isset($def)){
									$vals[$name] = $def;
								}
							}else if($vals[$name] === ''){
								$def = self::elemOpt($val, 'default');
								if(isset($def)){
									$strip = preg_replace('#(<.*?>).*(</.*?>)#', '$1$2', $def);
									$vals[$name] = $strip;
								}
							}
						}else{
							if(!isset($vals[$name])){
								$def = self::elemOpt($val, 'default');
								$striped_def = isset($def) ? strip_tags($def) : '';
								if(isset($def) && $striped_def !==''){
									$vals[$name] = $def;
								}else if(isset($def) && $striped_def ===''){
									$vals[$name] = '';
								}else{
									$vals[$name] = NULL;
								}
							}else if(strip_tags($vals[$name]) === ''){
								$vals[$name] = '';
							}else if($type === 'field-rte'){
								$vals[$name] = preg_replace('/<iframe([^>]*) allowfullscreen="true"/i', '<iframe$1 allowfullscreen', $vals[$name]);
								$vals[$name] = preg_replace('/<iframe([^>]*) mozallowfullscreen="true"/i', '<iframe$1', $vals[$name]);
								$vals[$name] = preg_replace('/<iframe([^>]*) webkitallowfullscreen="true"/i', '<iframe$1', $vals[$name]);
								$vals[$name] = preg_replace('/<iframe([^>]*) frameborder="0"/i', '<iframe$1', $vals[$name]);
							}
						}
					}else{
						if(!isset($vals[$name]) && count($instance) === 0){
							$def = self::elemOpt($val, 'default');
							if(isset($def)){
								$vals[$name] = $def;
							}
						}
					}
				}
			}
			return $vals;
		}
		/**
		 * Extract option from element of widget structure
		 */
		static function elemOpt($elem, $name){
			return isset($elem[0]) ? (isset($elem[0][$name]) ? $elem[0][$name] : NULL) : NULL;
		}
		/**
		 * Display widget field Customizer form
		 */
		function field($elem, $value, $field_id, $field_name){
			$type = self::elemOpt($elem, 'type');
			$params = self::elemOpt($elem, 'params');
			$params['name'] = $field_name;
			$params['id'] = $field_id;
			$params['value'] = $value;
			if($type == 'field-rte'){
				Skrollex_Ext::rte_input($params);
			}else if($type == 'field-layers-input'){
				echo $this->form_elements()->input($params);
			}
		}
		/**
		 * Decode index from ajax
		 */
		static function ajax_decode_instance($data){
			$res = array();
			foreach ($data as $key => $value){
				if(is_array($value)){
					$res[$key] = self::ajax_decode_instance($value);
				}else{
					$res[$key] = urldecode($value);
				}
			}
			return $res;
		}
		/**
		 * Handler for ajax action
		 */
		public function ajax(){
			if( !check_ajax_referer( 'layers-widget-actions', 'nonce', false ) ) die( 'You threw a Nonce exception' ); // Nonce
			if( 'add' == $_POST['widget_action'] ) {
				parse_str(
					urldecode( stripslashes( $_POST[ 'instance' ] ) ),
					$wdata
				);
				$data = self::ajax_decode_instance($wdata);
				$list_model_path =  $_POST[ 'list_model_path' ];
				$list_id =  $_POST[ 'list_id' ];
				$list_name =  $_POST[ 'list_name' ];
				$last_list_item_guid =  $_POST['$last_list_item_guid'];
				$list_item_guid = self::guid();
				$base = 'widget-' . $this->id_base;
				$list_element = self::varByPath($this->model, $list_model_path);
				if( isset( $last_list_item_guid ) && $last_list_item_guid !== '' ) {
					$list_instance = self::varByPath($data, $list_name);
					$list_item_instance = $list_instance[$last_list_item_guid];
					$list_item_vals = self::vals($list_element, $list_item_instance, TRUE);
				} else {
					$list_item_vals = array();
				}
				$this->list_item($list_element, $list_model_path, $list_id, $list_name, $list_item_guid, $list_item_vals);
			}
			die();
		}
		/**
		 * Generate id
		 */
		static function guid(){
			return str_replace('.', '', uniqid('', true));
		}
		/**
		 * Convert filters from string to array
		 * @param string $str
		 * @return array
		 */
		static function getFilters($str){
			$filt = explode(',',
				str_replace(' ,', ',', 
					str_replace(', ', ',', 
						preg_replace('/\s+/', ' ', trim($str))
					)
				)
			);
			$res = array();
			foreach ($filt as $value){
				$res[str_replace(' ', '_', strtolower($value))] = $value;
			}
			return $res;
		}
		/**
		 * Apply WordPress filters for content
		 */
		static function ck_editor_content($content){
			//Used only in widgets with CKEditor (rich text editor). Otherwise, the content of CKEditor is not displayed correctly.
			remove_filter( 'the_content', 'wpautop' ); /* Necessary for CKEditor */
			$res = apply_filters( 'the_content', $content );
			add_filter( 'the_content', 'wpautop' ); /* Restor */
			return $res;
		}
		/**
		 * Display content of Rich Text Editor
		 */
		static function rte_content($content){
			echo self::ck_editor_content($content);
		}
	}
}

