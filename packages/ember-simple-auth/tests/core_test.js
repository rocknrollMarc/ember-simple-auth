var container;

module('Ember.SimpleAuth', {
  setup: function() {
    container = Ember.Object.extend({
      init: function() {
        this._super();
        this.registrations = [];
        this.injections = [];
      },
      register: function(name, factory, options) {
        this.registrations.push({
          name:    name,
          factory: factory,
          options: options
        });
      },
      inject: function(target, property, name) {
        var registration = Ember.$.grep(this.registrations, function(registration, i) {
          return registration.name === name;
        })[0];
        if (registration) {
          this.injections.push({
            target:   target,
            property: property,
            object:   registration.factory
          });
        }
      }
    }).create();
  }
});

test('injects a session object in models, views, controllers and routes', function() {
  Ember.SimpleAuth.setup(container);

  Ember.$.each(['model', 'view', 'controller', 'view'], function(i, component) {
    var injection = Ember.$.grep(container.injections, function(injection) {
      return injection.target === component;
    })[0];

    equal(injection.property, 'session', 'Ember.SimpleAuth injects a session into ' + component);
    equal(injection.object.constructor, Ember.SimpleAuth.Session, 'Ember.SimpleAuth injects a session into ' + component);
  });
});
