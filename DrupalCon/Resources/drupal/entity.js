// Include the main Drupal library.
if (!Drupal) {
  Ti.include('/drupal/drupal.js');
}

if (!Drupal.db) {
  Ti.include('/drupal/db.js');
}

/**
 * Define a new library for Drupal Entity storage.
 */
Drupal.entity = {

  sites: {
    main: {
      /**
       * Entity types known to the system.
       *
       * This is a subset of the information provided in hook_entity_info(). We have
       * to specify it again here because we may not be dealing with Drupal 7 on
       * the other end.
       *
       * We're using lower_case variables here instead of camelCase so that they
       * exactly match the PHP variables.  That will make dynamic definition easier
       * later.
       *
       * @todo Make it possible to override this data with a direct pull of
       *       hook_entity_info() from a connected server.
       */
      types: {
        node: {
          label: Ti.Locale.getString('Node'),
          entity_keys: {
            id: 'nid',
            revision: 'vid',
            bundle: 'type',
            label: 'title'
          },
          schema: {},
          requestUrl: function(id) {
            return 'node/' + id;
          }
        },
        user: {
          label: Ti.Locale.getString('User'),
          entity_keys: {
            id: 'uid',
            bundle: null,
            label: 'name'
          },
          schema: {},
          requestUrl: function(id) {
            return 'user/' + id;
          }
        }
      }
    }
  },
  
  /**
   * Creates a new entity storage object.
   *
   * @param string site
   *   A key for the site from which we are mirroring 
   *   content. This corresponds to the database we are
   *   loading.
   * @param string entityType
   *   The type of entity (node, user, etc.) that we are
   *   accessing.
   * @return Drupal.entity.Datastore
   *   A new datastore object for the specified site and entity.
   */
  db: function(site, entityType) {
    var conn = Drupal.db.openConnection(site);
    return new Drupal.entity.Datastore(site, conn, entityType, this.entityInfo(site, entityType));
  },

  /**
   * Retrieves information about a defined entity.
   *
   * @param string site
   *   The site key for which we want information.
   * @param entityType
   *   The type of entity for which we want information.
   * @return Object
   *   The entity definition as an object/associative array,
   *   or null if not found.
   */
  entityInfo: function(site, entityType) {
    if (this.sites[site].types[entityType] !== undefined) {
      return this.sites[site].types[entityType];
    }
    Ti.API.error('Entity type ' + entityType + ' not defined for site ' + site);
  },

  /**
   * Mirror an entity from a remote server.
   *
   * Note that the mirroring process is asynchronous. That is, the entity
   * will not be available locally until sometime after this method returns,
   * depending on network latency.
   *
   * @todo Add an event that fires when mirroring is done.
   *
   * @param site
   *   The site key from which to mirror.
   * @param entityType
   *   The type of entity to be mirrored.
   * @param id
   *   The ID of the entity that is being mirrored.
   */
  mirror: function(site, entityType, id) {
    var service = Drupal.services.createConnection('main');
    service.loadHandler = function() {
      Drupal.entity.db(site, entityType).save(Ti.JSON.parse(this.responseText));
    };

    service.request({query: this.entityInfo(site, entityType).requestUrl(id)});
  }
};

Ti.include('/drupal/entity.datastore.js');


//These kinda sorta serve as a unit test, ish, maybe, for now.

/*
function resetTest() {
  Drupal.db.addConnectionInfo('main');
  
  var conn = Drupal.db.openConnection('main');

  //Reset for testing.
  conn.remove();

  conn.close();
}

resetTest();

var node1 = {
    nid: 1,
    type: 'page',
    title: 'Hello world'
  };

var node2 = {
    nid: 2,
    type: 'page',
    title: 'Goodbye world'
  };

var store = Drupal.entity.db('main', 'node');

// Reset everything.
store.initializeSchema();

var ret;

Ti.API.info('Inserting node.');
ret = store.insert(node1);
Ti.API.info('Insert new entity returned: ' + ret);

ret = store.save(node2);
Ti.API.info('Save on new entity returned: ' + ret);

var count = store.connection.query('SELECT COUNT(*) FROM node').field(0);
Ti.API.info('There should be 2 records.  There are actually: ' + count);

Ti.API.info('Checking for record.');
if (store.exists(1)) {
  Ti.API.info('Record exists.');
}
else {
  Ti.API.info('Record does not exist.');
}

var loaded_node = store.load(1);

Ti.API.info(loaded_node);

Ti.API.info('Trying to load multiple nodes.');
var nodes = store.loadMultiple([2, 1]);

Ti.API.info('Checking returned nodes.');
for (var i = 0; i < nodes.length; i++) {
  Ti.API.info(nodes[i]);
}

var node = store.load(1);
node.title = "Hello, Drupal world.";
ret = store.save(node);
Ti.API.info('Save on existing entity returned: ' + ret);

var nodeB = store.load(1);
Ti.API.info(nodeB);

Ti.API.info('Try to delete a node now.');
ret = store.remove(1);
Ti.API.info('Removing existing entity returned: ' + ret);

var count = store.connection.query('SELECT COUNT(*) FROM node').field(0);
Ti.API.info('There should be 1 record.  There are actually: ' + count);
*/

/*
var store = Drupal.entity.db('site');
var node = store.load('node', id);
var nodes = store.loadMultiple('node', ids);
store.save('node', node);
*/



