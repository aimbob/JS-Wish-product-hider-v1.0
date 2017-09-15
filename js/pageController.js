class PageController
{
    constructor(document) {
        this.doc = document;
        this.defaultPriceFloor = 1;
        this.defaultPriceLimit = 100;
        this.enabled = false;

        this.retrieveSettingsFromLocalStorage();
    }

    init(val) {
        console.log('init');
        this.defaultPriceFloor = val.settings.min;
        this.defaultPriceLimit = val.settings.max;
        this.enabled = val.settings.enabled;
        console.log(this);

        if (this.enabled == true) {
            this.checkInitialProducts();
            this.attachListeners();
        }
    }

    checkInitialProducts() {
        var controller = this;
        console.log('checkInitialProducts');
        jQuery.each($('#feed-grid > div'), function(index, val) {
            var item = $(this);
            var price = parseInt(item.find('.feed-actual-price').text().replace('€', '').trim());

            if (!(price >= controller.defaultPriceFloor && price <= controller.defaultPriceLimit)) {
                console.log('INITIAL ITEM (€' + price + ') REMOVED: [' + controller.defaultPriceFloor + '-' + controller.defaultPriceLimit + ']');
                item.remove();
            }
        });
    }

    retrieveSettingsFromLocalStorage() {
        var controller = this;

        browser.storage.local.get('settings').then(function(val) {
            if (controller.isEmpty(val)) {
                controller.setDefaultStorage(function(val) {
                    controller.init(val);
                });
            } else {
                controller.init(val);
            }
        }, controller.onError);
    }

    setDefaultStorage(callback) {
        let setting = browser.storage.local.set({
            settings: {
                'enabled': false,
                'min': 0,
                'max': 100
            }
        });

        setting.then(callback, this.onError);
    }

    attachListeners() {
        var controller = this;
        var feedElement = document.getElementById("feed-grid");
        feedElement.addEventListener("DOMNodeInserted", function(event) {
            if (event.relatedNode == feedElement) {
                var item = $(event.target);
                var price = parseInt(item.find('.feed-actual-price').text().replace('€', '').trim());

                if (!(price >= controller.defaultPriceFloor && price <= controller.defaultPriceLimit)) {
                    console.log('ITEM (€' + price + ') REMOVED: [' + controller.defaultPriceFloor + '-' + controller.defaultPriceLimit + ']');
                    item.remove();
                }
            }
        });
    }

    onError(error) {
        console.log('Error: ${error}');
    }

    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
}