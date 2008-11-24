YUI.add('plugin', function(Y) {


        /**
         * Plugin provides a base class for all Plugin classes.
         * 
         * @class Plugin 
         * @extends Base
         * @param {Object} config The configuration object for the
         * plugin.
         */
        function Plugin(config) {
            Plugin.superclass.constructor.apply(this, arguments);
        }

        /**
         * Static property provides a string to identify the class.
         *
         * @property Plugin.NAME
         * @type {String}
         * @static
         */
        Plugin.NAME = 'plugin';

        /**
         * Static property provides the namespace the plugin will be
         * registered under.
         *
         * @property Plugin.NS
         * @type {String}
         * @static
         */
        Plugin.NS = 'plugin';

        var proto = {
            _handles: null,

            /**
             * Initializer lifecycle implementation.
             * 
             * @method initializer
             * @param {Object} config Configuration object literal for the plugin
             */
            initializer : function(config) {

                if (config.owner) {
                    this._owner = config.owner;
                } else {
                }

                this._handles = [];

            },

            /**
             * desctructor lifecycle implementation.
             * 
             * Removes any listeners attached by the Plugin and restores
             * and over-ridden methods.
             * 
             * @method destructor
             */
            destructor: function() {
                // remove all handles
                if (this._handles) {
                    for (var i = 0, l = this._handles.length; i < l; i++) {
                       this.detach(this._handles[i]);
                    }
                }
            },

            /**
             * 
             */
            before: function(sFn, fn, context) {
                var owner = this._owner,
                    handle;

                context = context || this;

                if (sFn in owner) { // method
                    handle = Y.Do.before(fn, this._owner, sFn, context);
                } else if (owner.on) { // event
                    handle = owner.on(sFn, fn, context);
                }

                this._handles.push(handle);
                return handle;
            },

            after: function(sFn, fn, context) {
                var owner = this._owner,
                    handle;

                context = context || this;

                if (sFn in owner) { // method
                    handle = Y.Do.after(fn, this._owner, sFn, context);
                } else if (owner.after) { // event
                    handle = owner.after(sFn, fn, context);
                }

                this._handles.push(handle);
                return handle;
            },

            detach: function(handle) {
                if (handle.detach) { // event
                    handle.detach(handle);
                } else { // method
                    Y.Do.detach.apply(Y.Do, arguments);
                }
            },

            toString: function() {
                return this.constructor.NAME + '[' + this.constructor.NS + ']';
            }
        };

        Y.extend(Plugin, Y.Base, proto);
        Y.Plugin = Plugin;



}, '@VERSION@' ,{requires:['base']});