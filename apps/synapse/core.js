// ==========================================================================
// Project:   Synapse
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
Synapse = SC.Application.create(
  /** @scope Synapse.prototype */ {

  NAMESPACE: 'Synapse',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
   store: SC.Store.create().from(SC.Record.fixtures)
  
/*  store: SC.Store.create(),

    URL: {
      login: '/alfresco/service/api/login',
      blog: '/alfresco/service/api/blog',
      photo: '/alfresco/service/api/photo',
      video: '/alfresco/service/api/video',
      website: '/alfresco/service/api/website',
      logout: '/alfresco/service/api/logout',
      tmp: 'alfresco/service/cmis/query?ticket='
    }*/

});

S = Synapse;
