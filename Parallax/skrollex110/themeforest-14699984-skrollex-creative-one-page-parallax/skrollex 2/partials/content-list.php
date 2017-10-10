<?php
/**
 * This template is used for displaying posts in post lists
 */

$left_sidebar_active = layers_can_show_sidebar( 'left-sidebar' );
$right_sidebar_active = layers_can_show_sidebar( 'right-sidebar' );
$meta_on_end = !$right_sidebar_active && $left_sidebar_active;
$post_id = get_the_ID();
?>
 <div class="pure-g">
	<?php 
		if(!$meta_on_end){
			Skrollex_Helper::echo_post_meta();
		}
	?>
	<div <?php Skrollex_Helper::echo_post_body_class(); ?>>
		<article id="post-<?php echo esc_attr($post_id) ?>" <?php post_class(); ?>>
			<?php echo layers_post_featured_media( array( 'postid' => $post_id, 'wrap_class' => 'post-image push-bottom', 'size' => 'large' ) ); ?>
			<?php do_action('layers_before_list_post_title'); ?>
			<?php do_action('layers_before_list_title'); ?>
			<h1 class="post-title"><a href="<?php the_permalink(); ?>"><?php Skrollex_Helper::e_rich( get_post()->post_title ); ?></a></h1>
			<?php do_action('layers_after_list_title'); ?>
			<?php do_action('layers_after_list_post_title'); ?>
			<?php if( '' != get_the_excerpt() || '' != get_the_content() ) { ?>
				<?php do_action('layers_before_list_post_content'); ?>
				<div class="copy">
					<?php the_excerpt(); ?>
				</div>
				<?php do_action('layers_after_list_post_content'); ?>
			<?php } ?>
			<?php do_action('layers_before_list_read_more'); ?>
				<p><a href="<?php the_permalink(); ?>" class="page-transition post-read-more"><?php esc_html_e( 'Read More' , 'skrollex' ); ?>...</a></p>
			<?php do_action('layers_after_list_read_more'); ?>
			<?php
				$the_tags = get_the_tags( $post_id );
				if($the_tags){
					foreach ( $the_tags as $tag ){
						$tags[] = ' <a class="page-transition" href="' . esc_url(get_term_link( $tag )) . '" title="' . esc_attr( sprintf( __( "View all posts tagged %s", 'skrollex' ), $tag->name ) ) . '">'.$tag->name.'</a>';
					}
					echo '<p class="post-tags"><i class="l-tags"></i> ' . implode( esc_html__( ', ' , 'skrollex' ), $tags ) . '</p>';
				}
			?>
		</article>
	</div>
	<?php 
		if($meta_on_end){
			Skrollex_Helper::echo_post_meta();
		}
	?>
</div>