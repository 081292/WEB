<?php
/**
 * Template for displaying Comments
 *
 */
?>

			<div id="comments" class="non-preloading">
<?php if ( post_password_required() ) : ?>
				<p class="nopassword"><?php esc_html_e( 'This post is password protected. Enter the password to view any comments.', 'skrollex' ); ?></p>
			</div><!-- #comments -->
<?php
		return;
	endif;
?>

<?php if ( have_comments() ) : ?>
			<h3 id="comments-title"><?php
			printf( _n( 'One Response to %2$s', '%1$s Responses to %2$s', get_comments_number(), 'skrollex' ),
			number_format_i18n( get_comments_number() ), '<em>' . get_the_title() . '</em>' );
			?></h3>

<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // Are there comments to navigate through? ?>
			<div class="navigation">
				<div class="nav-previous"><?php previous_comments_link( wp_kses(__( '<span class="meta-nav">&larr;</span> Older Comments', 'skrollex'), Skrollex_Ext::trusted_tags() ) ); ?></div>
				<div class="nav-next"><?php next_comments_link( wp_kses(__( 'Newer Comments <span class="meta-nav">&rarr;</span>', 'skrollex'), Skrollex_Ext::trusted_tags() ) ); ?></div>
			</div> <!-- .navigation -->
<?php endif; // check for comment navigation ?>

			<ol class="commentlist">
				<?php
					wp_list_comments( array( 'callback' => 'skrollex_comment' ) );
				?>
			</ol>

<?php if ( get_comment_pages_count() > 1 && get_option( 'page_comments' ) ) : // Are there comments to navigate through? ?>
			<div class="navigation">
				<div class="nav-previous"><?php previous_comments_link( wp_kses(__( '<span class="meta-nav">&larr;</span> Older Comments', 'skrollex'), Skrollex_Ext::trusted_tags() ) ); ?></div>
				<div class="nav-next"><?php next_comments_link( wp_kses(__( 'Newer Comments <span class="meta-nav">&rarr;</span>', 'skrollex'), Skrollex_Ext::trusted_tags() ) ); ?></div>
			</div><!-- .navigation -->
<?php endif; // check for comment navigation ?>

	<?php
	if ( ! comments_open() && get_comments_number() ) : ?>
		<p class="nocomments"><?php esc_html_e( 'Comments are closed.' , 'skrollex' ); ?></p>
	<?php endif;  ?>

<?php endif; // end have_comments() ?>

<?php comment_form(); ?>

</div><!-- #comments -->
