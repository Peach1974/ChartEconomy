<?php
/**
 * Plugin Name: My Custom Functions
 * Plugin URI: http://brookfieldshow.com.au/my-custom-functions
 * Description: A custom plugin for specific customizations.
 * Version: 1.0
 * Author: Your Dan Petrie
 * Author URI: http://brookfieldshow.com.au
 */
add_action( 'woocommerce_thankyou', 'auto_complete_virtual_orders', 10, 1 );
function auto_complete_virtual_orders( $order_id ) {
    if ( ! $order_id ) {
        return;
    }

    $order = wc_get_order( $order_id );
    $all_virtual = true;

    foreach ( $order->get_items() as $item ) {
        $product = $item->get_product();
        if ( ! $product->is_virtual() ) {
            $all_virtual = false;
            break;
        }
    }

    if ( $all_virtual ) {
        $order->update_status( 'completed' );
    }
}
