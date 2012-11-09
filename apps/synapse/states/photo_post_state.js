Synapse.PhotoPostState = SC.State.extend({

  enterState: function() {
    console.log("Entering Photo Post State");
    Synapse.viewController.set('shareViewNowShowing','SYN.createPhotoView');
  },
  
  cancelPost: function() {
    console.log("cancelPost Photo");
    
    Synapse.photoController.set('title', '');
    Synapse.photoController.set('file', '');
    Synapse.photoController.set('description', '');
    
  },
  
  commitPost: function(ctx) {
    console.log("commitPost Photo");
    
    var dataHash = {
			title: Synapse.photoController.get('title'),
			file: Synapse.photoController.get('file'),
			description: Synapse.photoController.get('description')
		};
		
    SC.Request.postUrl(Synapse.URL.photo)
      .json(YES)
  		.header('X-Version', '1.0')
      .notify(this, 'responseStatus', ctx)
      .send(dataHash);
    
  },
  
  responseStatus: function(response) {
    
    if (SC.$ok(response)) {
     console.log("Photo Post Status = success" ); 
    } else {
      console.log("Photo Post Status = failed"); 
    }
    
  },
  
  exitState: function() {
  
  },
  
});