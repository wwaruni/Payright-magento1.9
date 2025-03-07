/**
 * Payright Installments JS library
 *
 * @package   Payright_Payright
 * @author    VEN Development Team <info@ven.com>
 * @copyright Copyright (c) 2015 VEN Commerce Ltd (http://www.ven.com)
 *
 * How to use:
 *
 * Define configuration (@see Payright_Payright_Block_Catalog_Installments::getJsConfig() for detail):
 * Payright.Installments.config = { ... }
 *
 * Render installments amount on page:
 * Payright.Installments.render();
 *
 * @see app/design/frontend/base/default/template/Payright/catalog/installments.phtml
 */
;
(function(Prototype, Element, Product, console) {
    // window.console fallback
    if (!console) {
        var f = function() {};
        console = {
            log: f,
            info: f,
            warn: f,
            debug: f,
            error: f
        };
    }
    var Payright = window.Payright = window.Payright || {};
    Payright.Installments = Payright.Installments || {};
    Payright.ProductPrice = Payright.ProductPrice || {};
    /** @see Payright_Payright_Block_Catalog_Installments::getJsConfig() for details */
    Payright.Installments.config = null;
    Payright.Installments.productprice = function() {
        // check all pre-requisites
        if (!Prototype || !Element) {
            console.warn('Payright: window.Prototype or window.Element is not defined, cannot render installments amount');
            return;
        }
        if (!Product) {
            console.warn('Payright: window.Product is not defined, cannot render installments amount');
            return;
        }
        if (!this.config instanceof Object) {
            console.warn('Payright: Payright.Installments.config is not set, cannot render installments amount');
            return;
        }
        // find all price-box elements (according to configured selectors)
        this.config.selectors = this.config.selectors.filter(function(str) {
            return str.replace(/\s/g, '').length;
        });
        var priceBoxes = Prototype.Selector.select(this.config.selectors.join(','), document);
        for (var i = 0; i < priceBoxes.length; i++) {
            try {
                // if price-box is visible
                if (!priceBoxes[i].offsetWidth || !priceBoxes[i].offsetHeight) {
                    continue;
                }
                // find 'price' elements and take value from 1st not empty one if there are several of them
                // 1st priority - "special price"
                var priceElements = Prototype.Selector.select('.special-price .price', priceBoxes[i]);
                priceElements = priceElements.concat(Prototype.Selector.select('.price', priceBoxes[i]));
                var price = null;
                for (var j = 0; j < priceElements.length; j++) {
                    price = parseFloat(priceElements[j].textContent.replace(/[^\d.]/g, ''));
                    if (price != NaN) {
                        break;
                    }
                }
                Payright.ProductPrice = price;
            } catch (e) {
                console.log('Payright: Error on processing price-box element: ', e);
            }
        }
    };
    Payright.Installments.render = function(installmentTextobj) {

        if(installmentTextobj == 'API Error')
        {
            console.warn("Payright API Authentication issue. Please make sure your auth credentials are correct.");
            return;
        }
        if(installmentTextobj == 'exceed_amount')
        {
            console.warn("Payright instalments cannot be rendered, please make sure the merchant credentials are correct");
            return;
        }
        // check all pre-requisites
        if (!Prototype || !Element) {
            console.warn('Payright: window.Prototype or window.Element is not defined, cannot render installments amount');
            return;
        }
        if (!Product) {
            console.warn('Payright: window.Product is not defined, cannot render installments amount');
            return;
        }
        if (!this.config instanceof Object) {
            console.warn('Payright: Payright.Installments.config is not set, cannot render installments amount');
            return;
        }
        // find all price-box elements (according to configured selectors)
        this.config.selectors = this.config.selectors.filter(function(str) {
            return str.replace(/\s/g, '').length;
        });
        // var related = Prototype.Selector.select(this.config.selectors.join(','), document);
        var priceBoxes = Prototype.Selector.select(this.config.selectors.join(','), document);
     
        for (var i = 0; i < priceBoxes.length; i++) {
            try {
                // if price-box is visible
                if (!priceBoxes[i].offsetWidth || !priceBoxes[i].offsetHeight) {
                    continue;
                }
             
                // find 'price' elements and take value from 1st not empty one if there are several of them
                // 1st priority - "special price"
                var priceElements = Prototype.Selector.select('.special-price .price', priceBoxes[i]);
                priceElements = priceElements.concat(Prototype.Selector.select('.price', priceBoxes[i]));
                var price = null;
                for (var j = 0; j < priceElements.length; j++) {
                    price = parseFloat(priceElements[j].textContent.replace(/[^\d.]/g, ''));
                    if (price != NaN) {
                        break;
                    }
                }
                // if price isn't empty and min/max order total condition is satisfied then render installments amount
                if (price
                    && (price >= this.config.minAmount)
                    && (this.config.payrightEnabled)) {
                    var oldElement = priceBoxes[i].nextSibling;
                    if (oldElement && oldElement instanceof Element && Element.hasClassName(oldElement, this.config.className)) {
                        oldElement.parentNode.removeChild(oldElement);
                    }
               
                    Element.insert(priceBoxes[i], {
                        after: "<div class='payright'>Or " + installmentTextobj.noofrepayments + " " + installmentTextobj.repaymentfrequency + " payments at $" + installmentTextobj.LoanAmountPerPayment + " with " + Payright.Installments.config.template + " </div>"
                    });
                    // Element.addClassName(priceBoxes[i].nextSibling, this.config.className);
                } else {
    
                    var oldElement = priceBoxes[i].nextSibling;
                    if (oldElement && oldElement instanceof Element && Element.hasClassName(oldElement, this.config.className)) {
                        oldElement.parentNode.removeChild(oldElement);
                    }
                }
            } catch (e) {
                console.log('Payright: Error on processing price-box element: ', e);
            }

        }
    };
})(window.Prototype, window.Element, window.Product, window.console);
