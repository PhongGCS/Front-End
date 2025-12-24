<?php
if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class Element_Heka_Video extends \Bricks\Element {
	public $category = 'media';
	public $name = 'heka-video';
	public $icon = 'ti-control-play';
	public $css_selector = '.video-section-heka';
	public $scripts = [ 'hekaVideoScript' ];

	public function get_label() {
		return esc_html__( 'Heka Video', 'bricks' );
	}

	public function set_controls() {
		$this->controls['hls_url'] = [
			'tab' => 'content',
			'label' => esc_html__( 'HLS Video URL (.m3u8)', 'bricks' ),
			'type' => 'text',
			'placeholder' => 'https://example.com/video.m3u8',
			'default' => 'https://pub-c25f583359a74339b1ccb56b497f21bd.r2.dev/heka/index.m3u8',
		];

        $this->controls['introText'] = [
			'tab' => 'content',
			'label' => esc_html__( 'Intro Section Text', 'bricks' ),
			'type' => 'text',
			'default' => 'Scroll down to watch the video (7 segments)',
		];

        $this->controls['outroText'] = [
			'tab' => 'content',
			'label' => esc_html__( 'Outro Section Text', 'bricks' ),
			'type' => 'text',
			'default' => 'Congratulations! You have finished all 7 scrolls.',
		];
	}

	public function enqueue_scripts() {
        // Enqueue 3rd-party scripts
		wp_enqueue_script( 'gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', [], '3.12.2', true );
		wp_enqueue_script( 'gsap-scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', ['gsap'], '3.12.2', true );
		wp_enqueue_script( 'hls-js', 'https://cdn.jsdelivr.net/npm/hls.js@latest', [], null, true );
        
        // Register our custom script
        wp_register_script(
            'heka-video-script',
            get_stylesheet_directory_uri() . '/assets/js/heka-video.js',
            ['gsap', 'gsap-scrolltrigger', 'hls-js'],
            filemtime( get_stylesheet_directory() . '/assets/js/heka-video.js' ),
            true
        );

        // Enqueue our custom stylesheet
        wp_enqueue_style(
            'heka-video-style',
            get_stylesheet_directory_uri() . '/assets/css/heka-video.css',
            [],
            filemtime( get_stylesheet_directory() . '/assets/css/heka-video.css' )
        );
	}

	public function render() {
		$settings = $this->get_settings();
        $root_classes = $this->get_root_classes(); // Gets default classes like 'brx-heka-video'

        // Intro section
        echo '<div class="h-screen flex items-center justify-center bg-blue-600">';
        echo '<h1 class="text-4xl font-bold">' . esc_html( $settings['introText'] ?? '' ) . '</h1>';
        echo '</div>';
        
        // Main video section
		echo "<div id='{$this->id}' class='{$root_classes} video-section-heka h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black' data-hls-url='" . esc_attr( $settings['hls_url'] ?? '' ) . "'>";
        
        echo '<div class="absolute top-10 left-10 z-10">';
        echo '<span class="counter-heka bg-red-600 px-4 py-2 rounded-full text-xl font-bold text-white">Segment: 0/7</span>';
        echo '</div>';

        echo '<video class="video-heka w-full max-w-4xl shadow-2xl" muted playsinline></video>';

        echo '<div class="mt-4 text-gray-400 text-center">';
        echo '<div>The video must finish before you can scroll again</div>';
        echo '<div class="text-sm mt-2">Fast scrolling will be blocked until the video is done</div>';
        echo '</div>';

		echo "</div>";

        // Outro section
        echo '<div class="h-screen flex items-center justify-center bg-green-600">';
        echo '<h1 class="text-4xl font-bold">' . esc_html( $settings['outroText'] ?? '' ) . '</h1>';
        echo '</div>';
	}
}
