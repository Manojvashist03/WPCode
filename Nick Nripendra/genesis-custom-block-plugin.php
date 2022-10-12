<?php
/*
    Plugin Name: Genesis Collection
    Plugin URI: genesis-collection
    Description: The Collection for Genesis Blocks
    Version: 0.1.3
    Author: ABC
    Author URI: #
    License: GPLv3
    License URI: http://www.gnu.org/licenses/gpl-3.0.html
    */

// Needed for adding the PHP Template Method blocks from within the plugin
use function Genesis\CustomBlocks\add_block;

define("genesis_PLUGIN_URL", plugin_dir_url(__FILE__));
define("genesis_PLUGIN_DIR", plugin_dir_path(__FILE__));

function plugin_alternate_template_path($path)
{
    unset($path);
    return __DIR__;
}

add_filter('genesis_custom_blocks_template_path', 'plugin_alternate_template_path');

function filter_wpseo_breadcrumb_separator($this_options_breadcrumbs_sep)
{
    return '<img src="' . plugin_dir_url(__FILE__) . 'images/breadcrumb_sep.png' . '">';
}

;
add_filter('wpseo_breadcrumb_separator', 'filter_wpseo_breadcrumb_separator', 10, 1);

// removes the code editor option for users without required roles
function disable_code_editor_mode($block_editor_settings)
{
    $user = wp_get_current_user();
    if (!in_array('administrator', (array)$user->roles)) {
        $block_editor_settings['codeEditingEnabled'] = FALSE;
    }

    return $block_editor_settings;
}

add_filter('block_editor_settings', 'disable_code_editor_mode', 10, 1);

/**
 * Function to add menu locations, so that could call them in navigation module/block
 * Created By: RubicoTech (Harvey Hardeep)
 * @package  Genesis Collection
 */
if (!function_exists('register_genesis_nav')) {
    function register_genesis_nav()
    {
        register_nav_menu('top_nav', __(' Top Menu'));
        register_nav_menu('main_nav', __(' Primary Menu'));
        register_nav_menu('footer_nav', __(' Footer Menu'));
    }

    add_action('init', 'register_genesis_nav');
}

/**
 * Generate custom search form
 * @param string $form Form HTML.
 * @return string Modified form HTML.
 * Created By: RubicoTech (Harvey Hardeep)
 * @package  Genesis Collection
 */
if (!function_exists('genesis_search_form')) {
    function genesis_search_form($form)
    {
        $form = '<form role="search" method="get" id="searchform" class="searchform" action="' . home_url('/') . '" >
    <div><label class="screen-reader-text" for="s">' . __('Search for:') . '</label>
    <div class="search-input-group">
    <input type="search" class="search-field" value="' . get_search_query() . '" name="s" id="s" placeholder="' . esc_attr_x('Enter Keyword', 'placeholder') . '" />
    <img class="search-icon" src="' . esc_url(plugins_url("images/icon_search.svg", __FILE__)) . '" alt="search image" />
    </div>
    <div class="mobile-search-submit"><input type="submit" id="searchsubmit" value="' . esc_attr__('Search') . '" /></div>
    </div>
    </form>';
        return $form;
    }

    add_filter('get_search_form', 'genesis_search_form');
}

// Add PHP Template Method blocks from within the plugin
function add_genesis_manual_blocks()
{
    //Include add-block-hooks function's files here from add-block-hooks folder.
    //Demo Block Section - Testing only Collection. We will remove this section after some time
    require_once(__DIR__ . '/add-block-hooks/contact-form.php');
    require_once(__DIR__ . '/add-block-hooks/contact-form-accessibility-policy.php');
    require_once(__DIR__ . '/add-block-hooks/stat-panel.php');
    require_once(__DIR__ . '/add-block-hooks/tabbed-testimonial.php');
    require_once(__DIR__ . '/add-block-hooks/location-service-finder.php');
    //Demo Block Section End Here
    require_once(__DIR__ . '/add-block-hooks/hero-with-image.php');
    require_once(__DIR__ . '/add-block-hooks/persona-self-selector.php');
    require_once(__DIR__ . '/add-block-hooks/our-services.php');
    require_once(__DIR__ . '/add-block-hooks/text-and-photo.php');
    require_once(__DIR__ . '/add-block-hooks/navigation.php');

    //approach page
    require_once(__DIR__ . '/add-block-hooks/testimonial-slider.php');
    require_once(__DIR__ . '/add-block-hooks/call-to-action.php');
    require_once(__DIR__ . '/add-block-hooks/featured-resource.php');
    require_once(__DIR__ . '/add-block-hooks/brand-narrative.php');
    
    //Patients & loved ones
    require_once(__DIR__ . '/add-block-hooks/2-column-text-and-photo.php');
    require_once(__DIR__ . '/add-block-hooks/enhanced-featured-resource.php');
    //footer

    //Careers Page
    require_once(__DIR__ . '/add-block-hooks/full-width-cta-with-optional-image.php');
    require_once(__DIR__ . '/add-block-hooks/four_cards_text.php');

    //About Page
    require_once(__DIR__ . '/add-block-hooks/2-column-text-and-video.php');
    require_once(__DIR__ . '/add-block-hooks/stat-panel-5.php');
    require_once(__DIR__ . '/add-block-hooks/patient-centered-care.php');
    require_once(__DIR__ . '/add-block-hooks/compact-testimonial-slider.php');

    //Getting Started
    require_once(__DIR__ . '/add-block-hooks/l2-hero.php');
    require_once(__DIR__ . '/add-block-hooks/process-module.php');

    //Strategic Partners
    require_once(__DIR__ . '/add-block-hooks/cards-text-module.php');
    require_once(__DIR__ . '/add-block-hooks/leadership-team.php');
    //Pressroom Page
    require_once(__DIR__ . '/add-block-hooks/press-and-news.php');
    require_once(__DIR__ . '/add-block-hooks/quicklinks.php');
    //Our Stories Page
    require_once(__DIR__ . '/add-block-hooks/focus-cards.php');
    require_once(__DIR__ . '/add-block-hooks/focus-cards-resource.php');

    //Our People 
    require_once(__DIR__ . '/add-block-hooks/text-and-quote-card.php');
    //Resource Article
    require_once(__DIR__ . '/add-block-hooks/large-quote-card.php');
    require_once(__DIR__ . '/add-block-hooks/social-share.php');

    //Featured Cards & Related Resources
    require_once(__DIR__ . '/add-block-hooks/featured-cards.php');
    require_once(__DIR__ . '/add-block-hooks/related-resources.php');
    require_once(__DIR__ . '/add-block-hooks/3-featured-text.php');
    require_once(__DIR__ . '/add-block-hooks/title-with-bullet-card.php');
    require_once(__DIR__ . '/add-block-hooks/resource-articles.php');
    require_once(__DIR__ . '/add-block-hooks/resource-category.php');

    //volunteer Page
    require_once(__DIR__ . '/add-block-hooks/media-with-subheading-repeater.php');
    //Press and News : Paginate Post List
    require_once(__DIR__ . '/add-block-hooks/paginated-post-list.php');
    require_once(__DIR__ . '/add-block-hooks/url-list.php');
}

add_action('genesis_custom_blocks_add_blocks', 'add_genesis_manual_blocks');

// Add/include Collection from collection-hooks/layouts folder here
function genesis_collection()
{
    // Ensure a proper version of Genesis Blocks is active before continuing.
    if (!function_exists('genesis_blocks_register_layout_component')) {
        return;
    }
    //Demo Block Section - Testing only Collection. We will remove this section after some time
    require_once('collection-hooks/add-all-section.php');
    require_once('collection-hooks/add-all-layout.php');

    // Load general setup file for Enhabit to add custom functions
    require_once('includes/functions-setup.php');

    require_once('includes/ajax-location-finder.php');
    require_once('includes/ajax-resource-article.php');

    // Load plugin css and scripts for frontend
    function genesis_collections_plugin_script()
    {
        // Add plugin specific js
        wp_register_script('genesis-slick-js', plugins_url('/js/slick.min.js', __FILE__), array('jquery'));
        wp_enqueue_script('genesis-slick-js');
        wp_register_script('genesis-slick-lightbox-js', plugins_url('/js/slick-lightbox.min.js', __FILE__), array('jquery'));
        wp_enqueue_script('genesis-slick-lightbox-js');
        wp_register_script('genesis-collections-js', plugins_url('/js/custom.js', __FILE__), array('jquery'));
        wp_register_script('genesis-resource-articles-js', plugins_url('/js/resource-article.js', __FILE__), array('jquery'));
        wp_enqueue_script('genesis-resource-articles-js');
        wp_enqueue_script('genesis-collections-js');
        wp_localize_script('genesis-collections-js', 'admin', array(
                'ajaxurl' => admin_url('admin-ajax.php'))
        );
        // Add plugin specific js

        wp_localize_script('genesis-collections-post-filter', 'genesis_ajax', array(
                'ajax_url' => admin_url('admin-ajax.php'))
        );

        // Add plugin specific css
        wp_enqueue_style('genesis-collections-css-material-icon', 'https://fonts.googleapis.com/css2?family=Material+Icons');
        wp_enqueue_style('genesis-collections-css-variables', plugins_url('/css/variables.css', __FILE__));
        wp_enqueue_style('genesis-collections-styles', plugins_url('/css/custom.css', __FILE__));
    }

    add_action('wp_enqueue_scripts', 'genesis_collections_plugin_script');
    add_action('admin_enqueue_scripts', 'genesis_collections_plugin_script', 0);

    // Remove other collections
    function non_brand_collection_remover()
    {
        // Clean up other collections and only show the  genesis collection and sections
        add_filter(
            'genesis_blocks_allowed_layout_components',
            function ($layouts) {
                // Return an array of unique section/layout keys that are allowed.
                return [
                    'genesis_home',
                    'genesis_enhabit_resource_landing',
                    'genesis_enhabit_resource_article_two_column',
                    'genesis_enhabit_resource_article_full_width',
                    'genesis_enhabit_home',
                    'genesis_call_to_action',
                    'genesis_hero_with_image',
                    'genesis_persona_self_selector',
                    'genesis_three_feature_text',
                    'genesis_our_services',
                    'genesis_text_and_photo',
                    'genesis_in_home_health',
                    'genesis_stat_panel',
                    'genesis_location_service_finder',
                    'genesis_contact_form',
                    'genesis_contact_form_accessibility_policy',
                    'genesis_navigation',
                    'genesis_tabbed_testimonial',
                    'genesis_testimonial_slider',
                    'genesis_featured_resource',
                    'genesis_enhanced_2_column_text_and_photo',
                    'genesis_enhanced_featured_resource',
                    'genesis_enhanced_featured_cards',
                    'genesis_full_width_cta_with_optional_image',
                    'genesis_four_cards_text',
                    'genesis_2_column_text_and_video',
                    'genesis_brand_narrative',
                    'genesis_stat_panel_5',
                    'genesis_patient_centered_care',
                    'genesis_compact_testimonial_slider',
                    'genesis_l2_hero',
                    'genesis_process_module',
                    'genesis_cards_text_module',
                    'genesis_leadership_team',
                    'genesis_press_and_news',
                    'genesis_text_and_quote_card',
                    'genesis_focus_cards',
                    'genesis_quicklinks',
                    'genesis_large_quote_card',
                    'genesis_social_share',
                    'genesis_resource_articles',
                    'genesis_media_with_subheading_repeater',
                    'genesis_title_with_bullet_card',
                    'genesis_feature_card',
                    'genesis_enhabit_story_page',
                    'genesis_enhabit_story_page_l2',
                    'genesis_enhabit_our_people_l2',
                    'genesis_enhabit_large_pressroom',
                    'genesis_enhabit_l2_culture',
                    'genesis_enhabit_our_approach',
                    'genesis_enhabit_about_us',
                    'genesis_enhabit_contact_us',
                    'genesis_enhabit_strategic_partners',
                    'genesis_enhabit_healthcare_providers',
                    'genesis_enhabit_getting_started',
                    'genesis_enhabit_our_innovations',
                    'genesis_enhabit_our_services',
                    'genesis_quote_and_card',
                    'genesis_enhabit_patient_and_loved_one',
                    'genesis_enhabit_our-stories_overflow',
                    'genesis-paginated-post-list',
                    'genesis_paginated_post_list',
                    'genesis_enhabit_press_room_overflow',
                    'genesis_url_list',
                ];
            }
        );
    }

    add_action('plugins_loaded', 'non_brand_collection_remover', 13);
}

add_action('plugins_loaded', 'genesis_collection', 12);

if(!isset($locale)){
    $locale ='';
}

$allTextDomains = require __DIR__ . '/textDomains.php';
$mo_file_path = sprintf(
    '%s/%s-%s.mo',
    genesis_PLUGIN_DIR . 'languages',
    'genesis-collections',
    $locale
);
$domain_path = path_join(genesis_PLUGIN_DIR, 'languages');

foreach ($allTextDomains as $textDomain):
    load_textdomain($textDomain, path_join($domain_path, $mo_file_path));
endforeach;