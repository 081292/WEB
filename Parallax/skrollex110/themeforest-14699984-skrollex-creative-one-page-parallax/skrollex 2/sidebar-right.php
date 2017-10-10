<?php /**
* Maybe show the right sidebar
*/

$sidebar_class = apply_filters( 'layers_right_sidebar_class', array('colors-' . layers_get_theme_mod('blog_colors'), 'background-transparent', 'sidebar', 'pure-u-1 pure-u-md-6-24' ) );

layers_maybe_get_sidebar( 'right-sidebar', implode( ' ' , $sidebar_class ) );