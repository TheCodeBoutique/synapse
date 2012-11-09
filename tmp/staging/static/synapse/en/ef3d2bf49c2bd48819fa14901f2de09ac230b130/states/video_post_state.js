Synapse.VideoPostState = SC.State.extend({

  enterState: function() {
    console.log("Entering Video Post State");
    Synapse.viewController.set('shareViewNowShowing','SYN.createVideoView');
  },
  
  cancelPost: function() {
    console.log("cancelPost Video");
    
    Synapse.videoController.set('title', '');
    Synapse.videoController.set('file', '');
    Synapse.videoController.set('description', '');
    
  },
  
  commitPost: function(ctx) {
    console.log("commitPost Video");
    
    var dataHash = {
			title: Synapse.videoController.get('title'),
			file: Synapse.videoController.get('file'),
			description: Synapse.videoController.get('description')
		};
		
    SC.Request.postUrl(Synapse.URL.video)
      .json(YES)
  		.header('X-Version', '1.0')
      .notify(this, 'responseStatus', ctx)
      .send(dataHash);
    
  },
  
  responseStatus: function(response) {
    
    if (SC.$ok(response)) {
     console.log("Video Post Status = success"); 
    } else {
      console.log("Video Post Status = failed"); 
    }
    
  },
  
  exitState: function() {
  
  },
  
});