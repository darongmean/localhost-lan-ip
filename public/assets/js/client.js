const commonUrls = [
    {
        original_url: 'http://localhost:3000',
    },
    {
        original_url: 'http://localhost:8000',
    },
    {
        original_url: 'http://localhost:8080',
    }
];


function getUpdatedUrl({ original_url, private_ip, should_replace_hostname }) {
    if (!should_replace_hostname) {
        return original_url;
    }

    var ou = original_url;
    if (ou.indexOf('http://') === -1 && ou.indexOf('https://') === -1) {
        ou = 'http://' + ou;
    }

    try {
        const u = new URL(ou);
        const hn = u.hostname;

        return ou.replace(hn, private_ip);

    } catch (e) {
        return original_url.replace('localhost', private_ip);
    }
}

function getQrcode(text) {
    if (typeof SVGElement !== 'undefined' && typeof SVGElement.prototype !== 'undefined') {
        var qr = QRCode.generateSVG(text, {
            ecclevel: "M",
            fillcolor: "#f5f7ff",
            // textcolor: "#486860",
            // margin: 0.0,
            modulesize: 8
        });
        var XMLS = new XMLSerializer();
        qr = XMLS.serializeToString(qr);
        qr = "data:image/svg+xml;base64," + window.btoa(qr);
    } else {
        var qr = QRCode.generatePNG(text, {
            ecclevel: "M",
            format: "html",
            // fillcolor: "#f5f7ff",
            // textcolor: "#006F94",
            // margin: 0.0,
            modulesize: 8
        });
    }

    return qr;
}

document.addEventListener('alpine:init', () => {
    console.log('alpine:init...');

    Alpine.data('thing', function () {
        const t = this;

        return {
            should_detect_private_ip: t.$persist(false).as('should_detect_private_ip'),
            should_replace_hostname: t.$persist(true).as('should_replace_hostname'),

            private_ip: t.$persist('192.168.0.0.100').as('private_ip'),
            original_url: t.$persist('http://localhost:3000').as('original_url'),

            async detectPrivateIp() {
                this.private_ip = await internalIp();
            },

            get updated_url() {
                return getUpdatedUrl(this);
            },

            get qr_url() {
                return getQrcode(getUpdatedUrl(this));
            },

            original_url_last_changed: 0,
            original_url_last_saved: 0,
            auto_save_idle_period: 5 * 1000,

            original_url_list: t.$persist([]).as('original_url_list'),

            saveOriginalUrl() {
                const th = this;
                const now = Date.now();

                // skip if it's not within idle period
                if (now - th.original_url_last_changed < th.auto_save_idle_period - 1000) {
                    return;
                }

                // skip if it's being saved recently
                if (now - th.original_url_last_saved < th.auto_save_idle_period - 1000) {
                    return;
                }

                th.original_url_last_saved = now;

                const item = { original_url: th.original_url };

                // skip if it's already in the list
                if (th.original_url_list.some(i => i.original_url === item.original_url)) {
                    return;
                }

                // make sure there are at most 9 items
                while (th.original_url_list.length >= 9) {
                    th.original_url_list.pop();
                }

                th.original_url_list.push(item);
            },

            get url_logs() {
                const th = {
                    private_ip: this.private_ip,
                    should_replace_hostname: this.should_replace_hostname,
                };

                var arr = [...this.original_url_list].reverse();
                arr = [...arr, ...commonUrls];

                return arr.map((i) => ({
                    updated_url: getUpdatedUrl({ ...th, ...i }),
                    qr_url: getQrcode(getUpdatedUrl({ ...th, ...i })),
                }));
            },

            init() {
                console.log('init...');

                const th = this;

                // when loading, detect private ip
                if (th.should_detect_private_ip) {
                    th.detectPrivateIp();
                }

                // when network changed, detect private ip
                window.addEventListener('online', () => {
                    console.log('online');

                    if (th.should_detect_private_ip) {
                        th.detectPrivateIp();
                    }
                });

                // when url changed, save history
                t.$watch('original_url', (_value) => {
                    th.original_url_last_changed = Date.now();
                    setTimeout(() => {
                        th.saveOriginalUrl();
                    }, th.auto_save_idle_period);
                })

                console.log('init, done.');
            }
        }
    });

    console.log('alpine:init, done.');
})
