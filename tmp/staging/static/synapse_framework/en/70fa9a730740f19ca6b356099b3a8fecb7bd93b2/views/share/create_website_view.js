// ==========================================================================
// Project:   synapse framework
// View: SYN.createWebSiteView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the shareViews content here.  

SYN.createWebSiteView = SC.View.extend({
	layout: { top: 0, right: 0, bottom: 0, left: 0 },
	childViews: ['postWebsiteView'],
	
	postWebsiteView: SC.View.design ({
	  classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
	  layout: { top: 20, right: 20, bottom: 20, left: 20 },	
    childViews: ['sectionLabel', 'titleField', 'urlField', 'contentField'],
    
    render: function(context){
    	context.push([
    		'<div class="forms-alt blog-title absolute">','</div>',	
    		'<div class="forms-alt share-url absolute">','</div>',	
    		'<div class="forms-alt blog-description absolute">','</div>',
    	].join(''))
    },
    
    sectionLabel: SC.LabelView.extend({
    	layout: { top: 20, left: 20, height: 30, width: 225 },
    	localize: YES,
    	value: 'S.Share.WebSite.PostWebSite'
    }),
    
    titleField: SC.TextFieldView.extend({
    	layout: { top: 62, left: 265, height: 35, width: 271 },
    	type: 'email',
    	localize: YES,
    	hint: 'S.Share.WebSite.Title',
    	valueBinding: 'Synapse.websiteController.title'
    }),
    
    urlField: SC.TextFieldView.extend({
    	layout: { top: 62, right: 32, height: 35, width: 271 },
    	type: 'email',
    	localize: YES,
    	hint: 'S.Share.WebSite.Url',
    	valueBinding: 'Synapse.websiteController.url'
    }),
    
    contentField: SC.TextFieldView.extend({
    	layout: { top: 112, left: 265, bottom: 125, right: 30 },
    	isTextArea: YES,
    	localize: YES,
    	hint: 'S.Share.WebSite.Content',
    	valueBinding: 'Synapse.websiteController.description'
    })
    
  }),
    
});