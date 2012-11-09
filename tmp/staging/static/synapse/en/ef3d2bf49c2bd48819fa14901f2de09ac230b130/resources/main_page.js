// ==========================================================================
// Project:   Synapse - mainPage
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

// This page describes the main user interface for your application.  
Synapse.mainPage = SC.Page.design({

  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    classNames: ['base-color'],
  	childViews: ['textureView','mainView'],
    
    textureView: SC.View.design({
      layout: { top: 0, right: 0, bottom: 0, left: 0 },
      classNames: ['base-texture','opacity_none'],
   	}),
   	
   	mainView: SC.ContainerView.design({
   	  layout: { top: 0, right: 0, bottom: 0, left: 0 },
   	  classNames: ['opacity_none'],
      nowShowingBinding: 'Synapse.viewController.mainView'
 	  }),
    
  })

});
