class BalloonController
{
    constructor(body) {
        this._data = {};

        // DOM elements
        this._body = $(body);
        this._loading = $(body.find('#loading')[0]);
        this._form = $(body.find('#form')[0]);
        this._min = $(body.find('#form-min')[0]);
        this._max = $(body.find('#form-max')[0]);
        this._disable = $(body.find('#disable')[0]);

        this.getSettingsFromLocalStorage();
    }

    init() {
        this.setMinField(this._data.min);
        this.setMaxField(this._data.max);
        this.setEnabledButton(this._data.enabled);

        this.loadEnableButton();
    }

    loadEnableButton() {
        if (this._data.enabled) {
            this._disable.addClass('btn-success');
            this._disable.removeClass('btn-danger');
            this._disable.html('<i class="la la-check"></i> enabled');
        } else {
            this._disable.addClass('btn-danger');
            this._disable.removeClass('btn-success');
            this._disable.html('<i class="la la-ban"></i> disabled');
        }
    }

    getSettingsFromLocalStorage() {
        var controller = this;
        let getting = browser.storage.local.get('settings');
        getting.then(function(val) {
            console.log('getSettingsFromLocalStorage');
            if (controller.isEmpty(val)) {
                console.log('NOOK - empty');
                controller.setDefaultStorage(function(val) {
                    controller._data = val.settings;
                    controller.init();
                });
            } else {
                controller._data = val.settings;
                controller.init();

                console.log('OK');
                console.log(controller._data);
            }

        }, controller.onError);
    }

    storeSettingsToLocalStorage(callback) {
        var controller = this;
        let setting = browser.storage.local.set({
            settings: controller._data
        });

        setting.then(callback, this.onError);
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

    setMin(value) {
        this._data.min = value;
    }

    setMax(value) {
        this._data.max = value;
    }

    toggleEnable() {
        console.log('toggleEnable');
        this._data.enabled = !this._data.enabled;
        this.storeSettingsToLocalStorage();
        this._body.toggleClass('animate');
        this.loadEnableButton();
    }

    setMinField(value) {
        this._min.val(value);
    }

    setMaxField(value) {
        this._max.val(value);
    }

    setEnabledButton(value) {
        if (value === true) {
            this._body.addClass('animate');
        } else {
            this._body.removeClass('animate');
        }
    }

    onError(error) {
        console.log('Error: ${error}');
    }

    isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

}