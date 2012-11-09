// ==========================================================================
// Project:   Synapse
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Synapse.main = function main() {

  // Step 1: Tell your app it will load via states
  var statechart = Synapse.statechart;
  SC.RootResponder.responder.set('defaultResponder', statechart); 
  statechart.initStatechart();
  
  
  // Used for tmp fixtures.  Testing streamView //
  var users = Synapse.store.find(Synapse.User);
  Synapse.userController.set('content', users);
  
  var blogs = Synapse.store.find(Synapse.Blog);
   Synapse.blogController.set('content', blogs);
  
  var photos = Synapse.store.find(Synapse.Photo);
  Synapse.photoController.set('content', photos);
  
  var videos = Synapse.store.find(Synapse.Video);
  Synapse.videoController.set('content', videos);
  
  var websites = Synapse.store.find(Synapse.Website);
  Synapse.websiteController.set('content', websites);

};

function main() { Synapse.main(); }
