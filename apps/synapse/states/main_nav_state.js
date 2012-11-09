Synapse.MainNavState = SC.State.extend ({
  
  enterState: function() {
    console.log("Main Nav State");
    var currentSessionID = Synapse.getPath('sessionController.content.sessionID');
    console.log("currentSessionID =  " + currentSessionID);
    var ticketEnd = '&q=SELECT * FROM cmis:folder where cmis:name = \'Company Home\'';
    
 /*   SC.Request.getUrl(Synapse.URL.tmp + currentSessionID + ticketEnd)
      .json(YES)
      .header('X-Version', '1.0')
      // .notify(this, 'didFetchTicket')
      .send();*/
    
  },
  
  cancelAccountUpdate: function() {
    console.log("cancelAccountUpdate");
  },
  
  saveAccountUpdate: function() {
    console.log("saveAccountUpdate");
  },
  
  goToBlogPostState: function() {
    console.log("goToBlogPostState");
    this.gotoState('blogPostState'); 
  },
  
  goToPhotoPostState: function() {
    console.log("goToPhotoPostState");
    this.gotoState('photoPostState'); 
  },
  
  goToVideoPostState: function() {
    console.log("goToVideoPostState");
    this.gotoState('videoPostState'); 
  },
  
  goToWebPostState: function() {
    console.log("goToWebPostState");
    this.gotoState('webPostState'); 
  },
  
  /* tmp */
  /* This is needed because we dont enter the blog post state until we select the blog button */
  /* However, when navigating to the shareView.  The first view showen is the blogView. */
  /* Im not excited about this logic and will change the tabView to something with more control */
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
  
  blogPostState: SC.State.plugin('Synapse.BlogPostState'),
  photoPostState: SC.State.plugin('Synapse.PhotoPostState'),
  videoPostState: SC.State.plugin('Synapse.VideoPostState'),
  webPostState: SC.State.plugin('Synapse.WebPostState')
  
});