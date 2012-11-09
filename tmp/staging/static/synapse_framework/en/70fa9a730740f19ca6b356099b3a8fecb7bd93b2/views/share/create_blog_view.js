// ==========================================================================
// Project:   synapse framework
// View: SYN.createBlogView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the shareViews content here.  

SYN.createBlogView = SC.View.extend({
	layout: { top: 0, right: 0, bottom: 0, left: 0 },
	childViews: ['postBlogView'],
	
	postBlogView: SC.View.design ({
	  classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
	  layout: { top: 20, right: 20, bottom: 20, left: 20 },	
    childViews: ['sectionLabel', 'titleField', 'contentField'],
    
    render: function(context){
    	context.push([
    		'<div class="forms-alt blog-title absolute">','</div>',	
    		'<div class="forms-alt blog-description absolute">','</div>',
    	].join(''))
    },
    
    sectionLabel: SC.LabelView.design ({
    	layout: { top: 20, left: 20, height: 30, width: 225 },
    	localize: YES,
    	value: 'S.Share.Blog.PostBlog'
    }),
    
    titleField: SC.TextFieldView.design ({
      classNames: ['text_field_signin'],
    	layout: { top: 62, left: 265, height: 35, width: 271 },
    	type: 'email',
    	localize: YES,
    	hint: 'S.Share.Blog.Title',
    	valueBinding: 'Synapse.blogController.title'
    }),
    
    contentField: SC.TextFieldView.design ({
      classNames: ['text_field_signin'],
    	layout: { top: 112, left: 265, bottom: 125, right: 30 },
    	isTextArea: YES,
    	localize: YES,
    	hint: 'S.Share.Blog.Content',
    	valueBinding: 'Synapse.blogController.description'
    })
    
  }),
    
});