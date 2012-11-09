Synapse.BlogPostState = SC.State.extend({

  enterState: function() {
    console.log("Entering Blog Post State");
    Synapse.viewController.set('shareViewNowShowing','SYN.createBlogView');
  },
  
  cancelPost: function() {
    console.log("cancelPost Blog");
    
    Synapse.blogController.set('title', '');
    Synapse.blogController.set('description', '');
    
  },
  
  commitPost: function(ctx) {
    console.log("commitPost Blog");
    
    var dataHash = {
			title: Synapse.blogController.get('title'),
			description: Synapse.blogController.get('description')
		};
		
    SC.Request.postUrl(Synapse.URL.blog)
      .json(YES)
  		.header('X-Version', '1.0')
      .notify(this, 'responseStatus', ctx)
      .send(dataHash);
    
  },
  
  responseStatus: function(response) {
    
    if (SC.$ok(response)) {
     console.log("Blog Post Status = success"); 
    } else {
      console.log("Blog Post Status = failed"); 
    }
    
  },
  
  exitState: function() {
  
  },
  
});