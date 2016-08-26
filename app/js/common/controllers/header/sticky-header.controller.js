/**
 * Created by hlogeon on 8/11/16.
 *
 * Controls sticky header.
 *
 * Can be extended to specify header better (eg. one for events another for venues etc)
 *
 */
import $ from 'jquery';
import BaseHeaderController from './base-header.controller.js';

class StickyHeaderController extends BaseHeaderController {

    constructor () {
        super();
        this.attachScroll();
    }

    
    /**
     * Attach window.scroll event handler to handle display/hide
     * of sticky header
     */
    attachScroll () {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 140) {
                $('.header-sticky').addClass('active');
            } else {
                $('.header-sticky').removeClass('active');
            }
        });
    }


    dateFromConfig () {
        return {
            left: '60%',
            top: '55px'
        };
    }

    dateToConfig () {
        return {
            left: '73%',
            top: '55px'
        };
    }



}

export default StickyHeaderController;