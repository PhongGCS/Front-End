<?php
/**
 * Bricks Child Theme Functions
 *
 * @package Bricks
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue scripts and styles.
 */
add_action( 'wp_enqueue_scripts', function() {
	// The main stylesheet for the child theme.
	wp_enqueue_style( 'bricks-child-style', get_stylesheet_uri(), ['bricks-frontend'], filemtime( get_stylesheet_directory() . '/style.css' ) );
} );

/**
 * Register custom elements.
 *
 * You can hook into 'bricks/elements/register' to register your
 * custom elements.
 *
 * @see https://academy.bricksbuilder.io/article/create-your-own-elements/
 */
add_action( 'init', function() {
	$element_files = [
		__DIR__ . '/elements/heka-video.php',
	];

	foreach ( $element_files as $file ) {
		// In Bricks 1.8+, you should use `\Bricks\Elements::register_element()`
		if ( class_exists( '\Bricks\Elements' ) ) {
			\Bricks\Elements::register_element( $file );
		}
	}
}, 11 );
