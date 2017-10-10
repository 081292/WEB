<?php
/*
This file is distributed under the MIT license. The file is designed by X40 
using this code:
	http://codepen.io/MAW/pen/domwyb

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

<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="<?php echo esc_attr($overlay_class); ?>" viewBox="0 -80 407.9 670" width="407.9" height="650" preserveAspectRatio="xMaxYMax">
	<defs>
		<linearGradient class="light" id="<?php echo esc_attr($prefix); ?>-grad-light" gradientUnits="userSpaceOnUse" x1="203.9277" y1="569.7373" x2="203.9277" y2="203.0005">
			<stop offset="0" style="stop-color:#ffffff;stop-opacity:0"></stop>
			<stop offset="1" style="stop-color:#ffffff;stop-opacity:0.72"></stop>
		</linearGradient>
		<mask x="0" y="0" width="100%" height="100%" id="<?php echo esc_attr($prefix); ?>-mask-light">
			<polygon points="407.9,569.7 259,226 204,226 150.7,226 2,569.5 " fill="url('#<?php echo esc_attr($prefix); ?>-grad-light')"></polygon>
		</mask>
		<mask x="0" y="0" width="100%" height="100%" id="<?php echo esc_attr($prefix); ?>-mask-pano">
			<rect fill="#000000" width="100%" height="100%"/>
			<circle fill="#000000" stroke="#ffffff" stroke-width="4" cx="204.95001" cy="226.37499" r="56.72436"/>
		</mask>
		<mask x="0" y="0" width="100%" height="100%" id="<?php echo esc_attr($prefix); ?>-mask-pano-int">
			<rect fill="#000000" width="100%" height="100%"/>
			<circle fill="#777777" stroke="#000000" stroke-width="4" cx="204.95001" cy="226.37499" r="56.72436"/>
		</mask>
		<filter id="<?php echo esc_attr($prefix); ?>-glow" x="-50%" y="-50%" height="300%" width="300%">
			<feGaussianBlur stdDeviation="15" result="coloredBlur"></feGaussianBlur>
			<feMerge><feMergeNode in="coloredBlur"></feMergeNode>
			<feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
		</filter>
	</defs>
	<rect width="100%" height="100%" class="<?php echo esc_attr($lamp_light_class); ?>" mask="url('#<?php echo esc_attr($prefix); ?>-mask-light')"/>
	<g>
		<line y2="170" x2="204.86143" y1="189.29198" x1="204.86143" stroke-width="7" class="stroke-text" stroke-opacity="1" fill="none" stroke="null"/>
		<path filter="url('#<?php echo esc_attr($prefix); ?>-glow')" stroke="null" fill-opacity="1" class="fill-heading" d="m204.85985,244.18162c10.12762,0 18.33815,-8.20948 18.33815,-18.3371c0,-4.27359 -2.51853,-8.19637 -4.97414,-11.31059c-2.59981,-3.29564 -3.94009,-6.16236 -5.47911,-8.78733l-15.76718,0c-1.55632,2.65225 -2.86094,5.46442 -5.4812,8.78943c-2.45299,3.11316 -4.97257,7.03647 -4.97257,11.30849c0.00052,10.12762 8.21053,18.3371 18.33605,18.3371z"/>
		<line class="stroke-heading" stroke-width="4" stroke-linecap="round" stroke-miterlimit="10" x1="197.84435" y1="202.35186" x2="211.96974" y2="202.35186"/>
		<line class="stroke-heading" stroke-width="4" stroke-linecap="round" stroke-miterlimit="10" x1="197.84435" y1="197.18737" x2="211.96974" y2="197.18737"/>
		<line class="stroke-heading" stroke-width="4" stroke-linecap="round" stroke-miterlimit="10" x1="199.69222" y1="191.93374" x2="210.12187" y2="191.93374"/>
		<line class="stroke-heading" stroke-width="4" stroke-linecap="round" stroke-miterlimit="10" x1="202.40582" y1="189.31191" x2="207.40775" y2="189.31191"/>
		<path d="m204.90705,237.7272c6.51001,0 11.80402,-5.29453 11.80402,-11.80244" stroke-miterlimit="10" stroke-linecap="round" stroke-width="7" stroke-opacity="0.2" class="stroke-text" fill="none" stroke="null"/>
	</g>
	<g>
		<rect width="100%" height="226.37499" class="fill-heading" mask="url('#<?php echo esc_attr($prefix); ?>-mask-pano')"/>
		<rect width="100%" height="226.37499" class="fill-text" mask="url('#<?php echo esc_attr($prefix); ?>-mask-pano-int')"/>
		<polyline points="204.86143,165 250,100 590,300" fill="none" class="stroke-heading" stroke-width="6" />
		<polyline points="196.86143,166 212.86143,166" fill="none" class="stroke-heading" stroke-width="5" stroke-linecap="round"/>
		<circle class="fill-heading" stroke="none" stroke-width="5" cx="250" cy="100" r="8"/>
		<circle class="fill-heading" stroke="none" stroke-width="5" cx="204.86143" cy="165" r="8"/>
	</g>
</svg>