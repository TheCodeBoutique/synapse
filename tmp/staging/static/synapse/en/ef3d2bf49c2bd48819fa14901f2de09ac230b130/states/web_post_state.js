Synapse.WebPostState = SC.State.extend({

  enterState: function() {
    console.log("Entering Web Post State");
    Synapse.viewController.set('shareViewNowShowing','SYN.createWebSiteView');
  },
  
  cancelPost: function() {
    console.log("cancelPost Web");
    
    Synapse.websiteController.set('title', '');
    Synapse.websiteController.set('url', '');
    Synapse.websiteController.set('description', '');
    
  },
  
  commitPost: function(ctx) {
    console.log("commitPost Web");
    
    var dataHash = {
			title: Synapse.websiteController.get('title'),
			url: Synapse.websiteController.get('url'),
			description: Synapse.websiteController.get('description')
		};
		
    SC.Request.postUrl(Synapse.URL.website)
      .json(YES)
  		.header('X-Version', '1.0')
      .notify(this, 'responseStatus', ctx)
      .send(dataHash);
    
  },
  
  responseStatus: function(response) {
    
    if (SC.$ok(response)) {
     console.log("Web Post Status = success"); 
    } else {
      console.log("Web Post Status = failed"); 
    }
    
  },
  
  exitState: function() {
  
  },
  
});