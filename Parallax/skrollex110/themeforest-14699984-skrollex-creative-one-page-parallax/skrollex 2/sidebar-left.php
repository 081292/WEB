<?php /**
* Maybe show the left sidebar
*/

$sidebar_class = apply_filters( 'layers_left_sidebar_class', array( 'colors-' . layers_get_theme_mod('blog_colors'), 'background-transparent', 'float-left',  'sidebar', 'pure-u-1 pure-u-md-6-24' ) );

layers_maybe_get_sidebar( 'left-sidebar', implode( ' ' , $sidebar_class ) );