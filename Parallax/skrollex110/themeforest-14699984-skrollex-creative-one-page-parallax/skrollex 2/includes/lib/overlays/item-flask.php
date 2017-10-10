<?php
/*
This file is distributed under the MIT license. The file is designed by X40 
using this code:
	http://codepen.io/joeyclouvel/pen/gxKJp

Copyright (c) 2016 by X40 (http://www.x40.ru/)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
?>

<a href="#scroll-down" class="<?php echo esc_attr($overlay_class); ?> hide-on-mobile">
	<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 113 130">
		<defs>
			<mask x="0" y="0" width="100%" height="100%" id="<?php echo esc_attr($prefix); ?>-mask-out">
				<rect class="flask-fill" fill="#777777" width="100%" height="150"/>
				<rect class="background" fill="#000000" width="100%" height="74"/>
				<path fill="#000000" d="M0,0v130h113.084L113,0H0z M94.75,128C71,128,56,128,56,128s-14.873,0-38.623,0s-13.945-19.422-6.33-35.945S40,41.25,40,41.25V3h16h11v38.25c0,0,23.901,34.283,31.517,50.805S118.5,128,94.75,128z"/>
			</mask>
		</defs>
		<g>
			<rect  width="100%" height="150" class="fill-heading" mask="url('#<?php echo esc_attr($prefix); ?>-mask-out')"/>
			<path fill="none" class="stroke-heading" stroke-width="5" stroke-miterlimit="10" d="M56,127.5c0,0-14.873,0-38.623,0s-13.695-19.172-6.08-35.695C18.912,75.283,40.5,41.25,40.5,41.25V2.5h-9H56h19.5h-8v38.75c0,0,23.651,34.033,31.267,50.555c7.615,16.523,19.733,35.695-4.017,35.695S56,127.5,56,127.5z"/>
		</g>
	</svg>
	<div class="flask-bubbles">
		<div class="background-heading bubble b0"></div>
		<div class="background-heading bubble b1"></div>
		<div class="background-heading bubble b2"></div>
		<div class="background-heading bubble b3"></div>
		<div class="background-heading bubble b4"></div>
		<div class="background-heading bubble b5"></div>
		<div class="background-heading bubble b6"></div>
		<div class="background-heading bubble b7"></div>
		<div class="background-heading bubble b8"></div>
		<div class="background-heading bubble b9"></div>

		<div class="background-heading swirl s0"></div>
		<div class="background-heading swirl s1"></div>
		<div class="background-heading swirl s2"></div>
		<div class="background-heading swirl s3"></div>
		<div class="background-heading swirl s4"></div>
		<div class="background-heading swirl s5"></div>
	</div>
</a>