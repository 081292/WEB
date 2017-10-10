<?php
/**
 * This partial is used for displaying single post (or page) content
 *
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
<?php
do_action('layers_before_single_post');
echo layers_post_featured_media( array( 'postid' => $post_id, 'wrap_class' => 'post-image push-bottom', 'size' => 'large' ) );
?>
<?php do_action('layers_before_single_post_title'); ?>
<h1 class="post-title"><?php Skrollex_Helper::e_rich(get_post()->post_title); ?></h1>
<?php do_action('layers_after_single_post_title'); ?>
<?php
if ( '' != get_the_content() ) { ?>
	<?php do_action('layers_before_single_content'); ?>

	<?php /**
	* Display the Content
	*/
	the_content(); ?>

	<?php /**
	* Display In-Post Pagination
	*/
	wp_link_pages( array(
		'link_before'   => '<span>',
		'link_after'    => '</span>',
		'before'        => '<p class="inner-post-pagination fa-lg">' . wp_kses(__('<span><i class="fa fa-files-o"></i></span>', 'skrollex'), Skrollex_Ext::trusted_tags()),
		'after'     => '</p>'
	)); ?>

	<?php do_action('layers_after_single_content'); ?>
<?php } // '' != get_the_content()

/**
* Display the Post Comments
*/
comments_template();

do_action('layers_after_single_post');
?>
	</div>
<?php
if($meta_on_end){
	Skrollex_Helper::echo_post_meta();
}
?>
</div>