<?php

class Payright_Payright_Block_Catalog_Instalments extends Mage_Core_Block_Template
{
    const XML_CONFIG_PREFIX = 'payright/payovertime_installments/';

    protected function _construct()
    {
        // parent::_construct();
        // $this->setTemplate('payright/catalog/instalments.phtml');
    }

    public function renderInstalments()
    {
        $productType = Mage::registry('current_product')->getTypeId();
        $productPrice    = Mage::registry('current_product')->getPrice();
        
        if ($productType == "configurable") {
            $productPrice    = Mage::registry('current_product')->getPrice();
            $installmentText = Mage::helper('payright')->calculateSingleProductInstallment($productPrice);

        } elseif ($productType == "simple") {
            $productPrice    = Mage::registry('current_product')->getPrice();
            $installmentText = Mage::helper('payright')->calculateSingleProductInstallment($productPrice);

        } elseif ($productType == "grouped") {

    
        } elseif ($productType == "bundle") {
            $product         = Mage::getModel('catalog/product');
            $_product        = $product->load(Mage::registry('current_product')->getId());
            $productPrice    = Mage::getModel('bundle/product_price')->getTotalPrices($_product, 'min', 1);
            $installmentText = Mage::helper('payright')->calculateSingleProductInstallment($productPrice);
        }

        return $installmentText;

    }

    public function getHtmlTemplate()
    {
        $result = Mage::getStoreConfig(self::XML_CONFIG_PREFIX . $this->getPageType() . '_html_template');
        $result = str_replace(
            '{skin_url}',
            Mage::app()->getStore()->getBaseUrl(Mage_Core_Model_Store::URL_TYPE_SKIN),
            $result
        );
        return $result;
    }

    public function getProductPrice()
    {
        $product_id = Mage::registry('current_product')->getPrice();
        return $product_id;

    }

    public function getCssSelectors()
    {
        $selectors = Mage::getStoreConfig(self::XML_CONFIG_PREFIX . $this->getPageType() . '_price_block_selectors');
        //print_r($selectors);
        return explode("\n", $selectors);
    }

    public function getStoreConfigEnabled()
    {
        $store = Mage::app()->getStore()->getStoreId();
        if (Mage::getStoreConfig('payment/payrightcheckout/active', $store)) {
            // plugin enabled / disabled
            return 1;
        } else {
            return 0;
        }
    }
    public function getStoreConfigMinAmount()
    {
        $store = Mage::app()->getStore()->getStoreId();
        if (Mage::getStoreConfig('payment/payrightcheckout/min_amount', $store)) {
            return (int)Mage::getStoreConfig('payment/payrightcheckout/min_amount', $store);

        } else {
            return 0;
        }

    }

    public function getJsConfig()
    {
        return array(
            'selectors'        => $this->getCssSelectors(),
            'template'         => $this->getHtmlTemplate(),
            'className'        => 'payright-installments-amount',
            'payrightEnabled'  => $this->getStoreConfigEnabled(),
            'minAmount'        => $this->getStoreConfigMinAmount(),
            

        );
    }

}
