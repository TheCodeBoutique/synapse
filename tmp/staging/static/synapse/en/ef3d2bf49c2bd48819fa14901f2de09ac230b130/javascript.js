/* >>>>>>>>>> BEGIN source/core.js */
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

/* >>>>>>>>>> BEGIN source/controllers/auth_controller.js */
// ==========================================================================
// Project:   Synapse.authController
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
Synapse.authController = SC.ObjectController.create(
/** @scope Synapse.authController.prototype */ {

  username: null,
  password: null,
  

});

/* >>>>>>>>>> BEGIN source/controllers/blog_controller.js */
// ==========================================================================
// Project:   Synapse.blogController
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
Synapse.blogController = SC.ArrayController.create(
/** @scope Synapse.blogController.prototype */ {

  // TODO: Add your own code here.

});

/* >>>>>>>>>> BEGIN source/controllers/fileshare_controller.js */
// ==========================================================================
// Project:   Synapse.fileshareController
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  Manages the creation & uploading of new content
  
  @extends SC.ObjectController
*/
Synapse.fileshareController = SC.ObjectController.create(
/** @scope Synapse.fileshareController.prototype */ {

  
  // video, image, blog, website
	fileType: null,

  // binary data for image/file selected for upload
  inputFileData: null,
  

  // from input form, loads data from local
	loadInputFileData: function(inputFile, fileType){

		this.set('fileType', fileType);

		var reader = new FileReader();
		reader.onload = function(e){
			Synapse.fileshareController.set('inputFileData', e.target.result);
		}
		reader.readAsDataURL(inputFile);
	},

});

/* >>>>>>>>>> BEGIN source/controllers/photo_controller.js */
// ==========================================================================
// Project:   Synapse.photoController
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
Synapse.photoController = SC.ArrayController.create(
/** @scope Synapse.photoController.prototype */ {

  // TODO: Add your own code here.

});

/* >>>>>>>>>> BEGIN source/controllers/session_controller.js */
// ==========================================================================
// Project:   Synapse.sessionController
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
Synapse.sessionController = SC.ArrayController.create(
/** @scope Synapse.sessionController.prototype */ {

  /* When we need the sessionID.  Use...
    var currentSessionID = Synapse.getPath('sessionController.content.sessionID');
  */

});

/* >>>>>>>>>> BEGIN source/controllers/user_controller.js */
// ==========================================================================
// Project:   Synapse.userController
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
Synapse.userController = SC.ArrayController.create(
/** @scope Synapse.userController.prototype */ {

  // TODO: Add your own code here.

}) ;

/* >>>>>>>>>> BEGIN source/controllers/video_controller.js */
// ==========================================================================
// Project:   Synapse.videoController
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
Synapse.videoController = SC.ArrayController.create(
/** @scope Synapse.videoController.prototype */ {

  // TODO: Add your own code here.

});

/* >>>>>>>>>> BEGIN source/controllers/view_controller.js */
// ==========================================================================
// Project:   Synapse.viewController
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document Your Controller Here)

  @extends SC.ObjectController
*/
Synapse.viewController = SC.ObjectController.create(
/** @scope Synapse.viewController.prototype */ {

  mainView: '',
  shareViewNowShowing: ''

});

/* >>>>>>>>>> BEGIN source/controllers/website_controller.js */
// ==========================================================================
// Project:   Synapse.websiteController
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
Synapse.websiteController = SC.ArrayController.create(
/** @scope Synapse.websiteController.prototype */ {

  // TODO: Add your own code here.

});

/* >>>>>>>>>> BEGIN source/models/blog_model.js */
// ==========================================================================
// Project:   Synapse.Blog
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Synapse.Blog = SC.Record.extend(
/** @scope Synapse.Blog.prototype */ {

  id: SC.Record.attr(String),
  title: SC.Record.attr(String),
  description: SC.Record.attr(String),
  user:   SC.Record.toOne("Synapse.User", {
    inverse: "blogs",
    isMaster: NO
  })

});

/* >>>>>>>>>> BEGIN source/fixtures/blog_fixtures.js */
// ==========================================================================
// Project:   Synapse.Blog Fixtures
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

sc_require('models/blog_model');

Synapse.Blog.FIXTURES = [

  { guid: 1,
    title: "My awesome blog",
    icon: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/blog_icon.png',
    description: "Sizzle tellivizzle check it out izzle shiz gangsta crazy. In convallizzle, yippiyo izzle gizzle dang, yippiyo lorizzle ma nizzle pede, fizzle blandizzle augue dolor cool ghetto. Phat izzle shizzlin dizzle nec black varizzle i saw beyonces tizzles and my pizzle went crizzle. I saw beyonces tizzles and my pizzle went crizzle owned nisi, pulvinizzle izzle, things eleifend, tincidunt izzle, metizzle. Nunc stuff neque. Lorem shizzlin dizzle dang sizzle break it down, consectetizzle adipiscing izzle. Yo mamma in elit. Nizzle mofo. Vestibulizzle izzle izzle its fo rizzle sure aliquet dictizzle. That's the shizzle facilisizzle fo shizzle sizzle stuff fo shizzle mah nizzle fo rizzle, mah home g-dizzle. Yo commodo. Nunc shizzlin dizzle ante et neque bow wow wow dizzle. Aenizzle non check out this izzle funky fresh ma nizzle. Phat nizzle my shizz, bibendum shizznit, ornare vizzle, imperdiet shizzlin dizzle, lacus. Break it down funky fresh diam at shut the shizzle up adipiscing the bizzle. Curabitur pot nisl shit tellizzle check it out nonummy.",
     user: 1  },

  { guid: 2,
    title: "Two",
    icon: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/blog_icon.png',
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
     user: 2  },

  { guid: 3,
    title: "Tis I the third",
    icon: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/blog_icon.png',
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
     user: 3  },

  { guid: 4,
    title: "Four",
    icon: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/blog_icon.png',
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
     user: 4  },
     
     { guid: 5,
       title: "My fifth blog",
       icon: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/blog_icon.png',
       description: "Sizzle tellivizzle check it out izzle shiz gangsta crazy. In convallizzle, yippiyo izzle gizzle dang, yippiyo lorizzle ma nizzle pede, fizzle blandizzle augue dolor cool ghetto. Phat izzle shizzlin dizzle nec black varizzle i saw beyonces tizzles and my pizzle went crizzle. I saw beyonces tizzles and my pizzle went crizzle owned nisi, pulvinizzle izzle, things eleifend, tincidunt izzle, metizzle. Nunc stuff neque. Lorem shizzlin dizzle dang sizzle break it down, consectetizzle adipiscing izzle. Yo mamma in elit. Nizzle mofo. Vestibulizzle izzle izzle its fo rizzle sure aliquet dictizzle. That's the shizzle facilisizzle fo shizzle sizzle stuff fo shizzle mah nizzle fo rizzle, mah home g-dizzle. Yo commodo. Nunc shizzlin dizzle ante et neque bow wow wow dizzle. Aenizzle non check out this izzle funky fresh ma nizzle. Phat nizzle my shizz, bibendum shizznit, ornare vizzle, imperdiet shizzlin dizzle, lacus. Break it down funky fresh diam at shut the shizzle up adipiscing the bizzle. Curabitur pot nisl shit tellizzle check it out nonummy.",
        user: 5  },

     { guid: 6,
       title: "Six is Six",
       icon: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/blog_icon.png',
       description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
        user: 6  },

     { guid: 7,
       title: "Seven",
       icon: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/blog_icon.png',
       description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
        user: 7  },

     { guid: 8,
       title: "Ran out of sayings",
       icon: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/blog_icon.png',
       description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
        user: 8  },     
    

 

];

/* >>>>>>>>>> BEGIN source/models/photo_model.js */
// ==========================================================================
// Project:   Synapse.Photo
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Synapse.Photo = SC.Record.extend(
/** @scope Synapse.Photo.prototype */ {

  id: SC.Record.attr(String),
  title: SC.Record.attr(String),
  file: SC.Record.attr(String),
  description: SC.Record.attr(String),
  
  user: SC.Record.toOne("Synapse.User", {
    inverse: "photos",
    isMaster: NO
  })

}) ;

/* >>>>>>>>>> BEGIN source/fixtures/photo_fixtures.js */
// ==========================================================================
// Project:   Synapse.Photo Fixtures
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

sc_require('models/photo_model');

Synapse.Photo.FIXTURES = [

  { guid: 1,
    title: "Electric Cars",
    file: "http://www.thecodeboutique.com/bonjour/tesla-model-s.jpg",
    //file: "http://uncrate.com/p/2009/03/tesla-model-s.jpg",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
    user: 1  },

  { guid: 2,
    title: "Italian Bikes",
    file: "http://www.thecodeboutique.com/bonjour/IMG_2495-670-75.jpg",
    //file: "http://cdn.mos.bikeradar.com/images/news/2008/09/07/IMG_2495-670-75.jpg",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
    user: 2  },

  { guid: 3,
    title: "iThin",
    file: "http://www.thecodeboutique.com/bonjour/2013-imac.jpg",
    //file: "http://www.blogcdn.com/www.engadget.com/media/2012/10/2013-imac.jpg",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
    user: 3  },

  { guid: 4,
    title: "Sky me",
    //file: "http://www.gpb.org/files/national/earth_sky_main.jpg",
    file: "http://www.thecodeboutique.com/bonjour/earth_sky_main.jpg",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
    user: 4  },
    
    { guid: 5,
      title: "Electric Cars",
      file: "http://www.thecodeboutique.com/bonjour/tesla-model-s.jpg",
      //file: "http://uncrate.com/p/2009/03/tesla-model-s.jpg",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
      user: 5  },

    { guid: 6,
      title: "Italian Bikes",
      file: "http://www.thecodeboutique.com/bonjour/IMG_2495-670-75.jpg",
      //file: "http://cdn.mos.bikeradar.com/images/news/2008/09/07/IMG_2495-670-75.jpg",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
      user: 6  },

    { guid: 7,
      title: "iThin",
      file: "http://www.thecodeboutique.com/bonjour/2013-imac.jpg",
      //file: "http://www.blogcdn.com/www.engadget.com/media/2012/10/2013-imac.jpg",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
      user: 7  },

    { guid: 8,
      title: "Sky me",
      //file: "http://www.gpb.org/files/national/earth_sky_main.jpg",
      file: "http://www.thecodeboutique.com/bonjour/earth_sky_main.jpg",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
      user: 8  },    

];

/* >>>>>>>>>> BEGIN source/models/session_model.js */
// ==========================================================================
// Project:   Synapse.Session
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Synapse.Session = SC.Record.extend(
/** @scope Synapse.Session.prototype */ {

 
  sessionID: SC.Record.attr(String),

});

/* >>>>>>>>>> BEGIN source/fixtures/session_fixtures.js */
// ==========================================================================
// Project:   Synapse.Session Fixtures
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

sc_require('models/session_model');

Synapse.Session.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

  // { guid: 1,
  //   firstName: "Michael",
  //   lastName: "Scott" },
  //
  // { guid: 2,
  //   firstName: "Dwight",
  //   lastName: "Schrute" },
  //
  // { guid: 3,
  //   firstName: "Jim",
  //   lastName: "Halpert" },
  //
  // { guid: 4,
  //   firstName: "Pam",
  //   lastName: "Beesly" },
  //
  // { guid: 5,
  //   firstName: "Ryan",
  //   lastName: "Howard" }

];

/* >>>>>>>>>> BEGIN source/models/user_model.js */
// ==========================================================================
// Project:   Synapse.User
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Synapse.User = SC.Record.extend(
/** @scope Synapse.User.prototype */ {

  // userID: SC.Record.attr(String), 
  firstName: SC.Record.attr(String),
  lastName: SC.Record.attr(String),
  location: SC.Record.attr(String),
  email: SC.Record.attr(String),
  password: SC.Record.attr(String),
  photo: SC.Record.attr(String),
  
  blogs: SC.Record.toMany("Synapse.Blog", {
    inverse: "user",
    isMaster: YES
  }),
  
  photos: SC.Record.toMany("Synapse.Photo", {
    inverse: "user",
    isMaster: YES
  }),
  
  websites: SC.Record.toMany("Synapse.Website", {
    inverse: "user",
    isMaster: YES
  }),

}) ;

/* >>>>>>>>>> BEGIN source/fixtures/user_fixtures.js */
// ==========================================================================
// Project:   Synapse.User Fixtures
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

sc_require('models/user_model');

Synapse.User.FIXTURES = [

  /* 
    User model:
    firstName: SC.Record.attr(String),
    lastName: SC.Record.attr(String),
    location: SC.Record.attr(String),
    email: SC.Record.attr(String),
    password: SC.Record.attr(String),
    photo: SC.Record.attr(String)
  */

  { guid: 1,
    firstName: "Chad",
    lastName: "Eubanks",
    location: "So.Cal" ,
    email: "chad@appnovation.com", 
    password: "somepassword", 
    userIconSmall: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_50_50/p/3/000/11c/00a/3eb3900.jpg",
    userIconNorm: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_150_150/p/3/000/11c/00a/3eb3900.jpg",
    blogs: [1],
    photos: [1],
    websites: [1]},
    
  { guid: 2,
    firstName: "Chad",
    lastName: "Eubanks",
    location: "So.Cal", 
    email: "chad@appnovation.com",
    password: "somepassword", 
    userIconSmall: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_50_50/p/4/000/187/087/1a11de2.jpg",
    userIconNorm: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_150_150/p/4/000/187/087/1a11de2.jpg",
    blogs: [2],
    photos: [2],
    websites: [2]},
      
  { guid: 3,
    firstName: "Chad",
    lastName: "Eubanks",
    location: "So.Cal", 
    email: "chad@appnovation.com",
    password: "somepassword", 
    userIconSmall: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_50_50/p/2/000/196/13d/137b700.jpg",
    userIconNorm: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_150_150/p/2/000/196/13d/137b700.jpg",
    blogs: [3],
    photos: [3],
    websites: [3]},

   { guid: 4,
     firstName: "Chad",
     lastName: "Eubanks",
     location: "So.Cal",
     email: "chad@appnovation.com",
     password: "somepassword",
     userIconSmall: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_50_50/p/2/000/078/1ea/0eaaf03.jpg",
     userIconNorm: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_150_150/p/2/000/078/1ea/0eaaf03.jpg",
     blogs: [4],
     photos: [4],
     websites: [4]},
     
   { guid: 5,
     firstName: "Chad",
     lastName: "Eubanks",
     location: "So.Cal",
     email: "chad@appnovation.com",
     password: "somepassword",
     userIconSmall: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_50_50/p/1/000/0e6/1d2/39d62f0.jpg",
     userIconNorm: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_150_150/p/1/000/0e6/1d2/39d62f0.jpg",
     blogs: [5],
     photos: [5],
     websites: [5]},
   
   { guid: 6,
     firstName: "Chad",
     lastName: "Eubanks",
     location: "So.Cal",
     email: "chad@appnovation.com",
     password: "somepassword", 
     userIconSmall: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_50_50/p/2/000/001/1fc/175b695.jpg",
     userIconNorm: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_150_150/p/2/000/001/1fc/175b695.jpg",
     blogs: [6],
     photos: [6],
     websites: [6]},
   
   { guid: 7,
     firstName: "Chad",
     lastName: "Eubanks",
     location: "So.Cal", 
     email: "chad@appnovation.com", 
     password: "somepassword", 
     userIconSmall: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_50_50/p/1/000/01a/0cf/129597d.jpg",
     userIconNorm: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_150_150/p/1/000/01a/0cf/129597d.jpg",
     blogs: [7],
     photos: [7],
     websites: [7]},
   
    { guid: 8,
      firstName: "Chad",
      lastName: "Eubanks",
      location: "So.Cal", 
      email: "chad@appnovation.com",
      password: "somepassword", 
      userIconSmall: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_50_50/p/2/000/045/266/233a045.jpg",
      userIconNorm: "http://m.c.lnkd.licdn.com/mpr/mpr/shrink_150_150/p/2/000/045/266/233a045.jpg",
      blogs: [8],
      photos: [8],
      websites: [8]},

];

/* >>>>>>>>>> BEGIN source/models/video_model.js */
// ==========================================================================
// Project:   Synapse.Video
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Synapse.Video = SC.Record.extend(
/** @scope Synapse.Video.prototype */ {

  id: SC.Record.attr(String),
  title: SC.Record.attr(String),
  file: SC.Record.attr(String),
  description: SC.Record.attr(String)

}) ;

/* >>>>>>>>>> BEGIN source/fixtures/video_fixtures.js */
// ==========================================================================
// Project:   Synapse.Video Fixtures
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

sc_require('models/video_model');

Synapse.Video.FIXTURES = [

  { guid: 1,
    title: "Interface Builder",
    file: "http://www.thecodeboutique.com/bonjour/Artifex%20Demo.mov",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit."  },

  { guid: 2,
    title: "Community App",
    file: "http://www.thecodeboutique.com/bonjour/SC-Community-App.mov",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit."  },

  { guid: 3,
    title: "Big Buck Bunny",
    file: "http://download.blender.org/peach/trailer/trailer_480p.mov",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit."  },

  { guid: 4,
    title: "The Big Bug",
    file: "http://www.thecodeboutique.com/bonjour/Screen%20Recording%20-%20Wi-Fi.m4v",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit."  },
    
    { guid: 5,
      title: "Interface Builder",
      file: "http://www.thecodeboutique.com/bonjour/Artifex%20Demo.mov",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit."  },

    { guid: 6,
      title: "Community App",
      file: "http://www.thecodeboutique.com/bonjour/SC-Community-App.mov",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit."  },

    { guid: 7,
      title: "Big Buck Bunny",
      file: "http://download.blender.org/peach/trailer/trailer_480p.mov",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit."  },

    { guid: 8,
      title: "The Big Bug",
      file: "http://www.thecodeboutique.com/bonjour/Screen%20Recording%20-%20Wi-Fi.m4v",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit."  },    
  

];

/* >>>>>>>>>> BEGIN source/models/website_model.js */
// ==========================================================================
// Project:   Synapse.Website
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Synapse.Website = SC.Record.extend(
/** @scope Synapse.Website.prototype */ {

  id: SC.Record.attr(String),
  title: SC.Record.attr(String),
  url: SC.Record.attr(String),
  description: SC.Record.attr(String),
  
  user: SC.Record.toOne("Synapse.User", {
    inverse: "websites",
    isMaster: NO
  })

}) ;

/* >>>>>>>>>> BEGIN source/fixtures/website_fixtures.js */
// ==========================================================================
// Project:   Synapse.Website Fixtures
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals Synapse */

sc_require('models/website_model');

Synapse.Website.FIXTURES = [

  { guid: 1,
    title: "The Code Boutique",
    url: "http://www.thecodeboutique.com",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
    user: 1  }, 

  { guid: 2,
    title: "Buy some cool tech here",
    url: "http://www.thecodeboutique.com",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
    user: 2  }, 

  { guid: 3,
    title: "News from all over",
    url: "http://www.thecodeboutique.com",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
    user: 3  }, 

  { guid: 4,
    title: "Sexy Bikes",
    url: "http://www.thecodeboutique.com",
    description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
    user: 4  }, 
    
    { guid: 5,
      title: "The Code Boutique",
      url: "http://www.thecodeboutique.com",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
      user: 5  }, 

    { guid: 6,
      title: "Buy some cool tech here",
      url: "http://www.thecodeboutique.com",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
      user: 6  }, 

    { guid: 7,
      title: "News from all over",
      url: "http://www.thecodeboutique.com",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
      user: 7  }, 

    { guid: 8,
      title: "Sexy Bikes",
      url: "http://www.thecodeboutique.com",
      description: "Nunc et velit ac sem porta venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam vestibulum dictum egestas. Ut tempus condimentum nibh vitae tincidunt. Cras id mattis odio. Proin faucibus scelerisque sollicitudin. In venenatis, odio sit amet placerat posuere, sem diam fermentum diam, id aliquet ante magna in est. Fusce sollicitudin vehicula nunc, a accumsan libero fringilla nec. Duis ligula arcu, placerat ut rutrum mollis, adipiscing at massa. Duis placerat tortor sit amet nunc aliquet ac ultrices lorem suscipit.",
      user: 8  }, 
  
];

/* >>>>>>>>>> BEGIN source/statechart.js */
Synapse.statechart = SC.Statechart.create({

  initialState: 'setupState',
  
  setupState: SC.State.plugin('Synapse.SetupState'),
  unauthenticatedState: SC.State.plugin('Synapse.UnauthenticatedState'),
  authenticatedState: SC.State.plugin('Synapse.AuthenticatedState')

});
/* >>>>>>>>>> BEGIN source/states/authenticated_state.js */
Synapse.AuthenticatedState = SC.State.extend({

  enterState: function() {
    console.log("Entering Authenticated State");  
    Synapse.viewController.set('mainView','SYN.MainApplicationView');
    Synapse.viewController.set('shareViewNowShowing','SYN.createBlogView');
    
    var userName = Synapse.authController.get('username');
    var passWord = Synapse.authController.get('password');
    var ticket = Synapse.URL.login + '?u=' + userName + '&pw=' + passWord;
  
    SC.Request.getUrl(ticket)
      .json(YES)
      .header('X-Version', '1.0')
      .notify(this, 'didFetchTicket')
      .send();
    
  },
  
  didFetchTicket: function(response) {
    if (SC.$ok(response)) {
      console.log("we are all good for the Ticket API");
      
      var rawRequest = response.rawRequest.response;
       console.log("rawRequest =" + rawRequest);
      
      var xmlDOC = $.parseXML(rawRequest);
       console.log("xmlDOC =" + xmlDOC);
      
      var xmlContent = $(xmlDOC);
       console.log("xmlContent = " + xmlContent);
      
      var contentTicket = xmlContent.find("ticket").text();
       console.log("contentTicket = " + contentTicket);
      
      var content = Synapse.store.createRecord(Synapse.Session,{
        sessionID: contentTicket 
      })
      console.log("content = " + content);
      
      Synapse.sessionController.set('content', content);
      
      this.gotoState('mainNavState');
      
    } else {
      console.log("Ticket API error");
    }
    
  },
  
  exitState: function() {
    
  },
  
  mainNavState: SC.State.plugin('Synapse.MainNavState')
  
});
/* >>>>>>>>>> BEGIN source/states/blog_post_state.js */
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
/* >>>>>>>>>> BEGIN source/states/main_nav_state.js */
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
/* >>>>>>>>>> BEGIN source/states/photo_post_state.js */
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
/* >>>>>>>>>> BEGIN source/states/setup_state.js */
Synapse.SetupState = SC.State.extend({ 
  
  enterState: function() {
    Synapse.getPath('mainPage.mainPane').append();
    this.invokeLater(this.fadeIn, 500);
  },

	fadeIn: function() {
	  Synapse.getPath('mainPage.mainPane.textureView').animate('opacity', 0.3, {duration: 0.8,timing:'ease-in-out'});
	  Synapse.getPath('mainPage.mainPane.mainView').animate('opacity', 1.0, {duration: 0.8,timing:'ease-in-out'});
		this.invokeLater(this.goToUnauthenticatedState, 100);
	},  
	
	goToUnauthenticatedState: function() {
		this.gotoState('unauthenticatedState');
	},

  exitState: function() {
  }

});


/* >>>>>>>>>> BEGIN source/states/unauthenticatedState.js */
Synapse.UnauthenticatedState = SC.State.extend({ 
  
  enterState: function() {
    console.log("Entering Unauthenticated State");
    Synapse.authController.set('username', '');
	  Synapse.authController.set('password', '');
		Synapse.viewController.set('mainView','SYN.LoginView');
  },
  
  ignoreAuth: function() {
    Synapse.viewController.set('mainView','SYN.MainApplicationView');
    Synapse.viewController.set('shareViewNowShowing','SYN.createBlogView');
    this.gotoState('mainNavState');
  },
  
  checkingAuthentication: function(ctx) {
    Synapse.statechart.gotoState('authenticatedState');
    
    var dataHash = {
			username: Synapse.authController.get('username'),
			password: Synapse.authController.get('password')
		};
		
    SC.Request.postUrl(Synapse.URL.login)
      .json(YES)
  		.header('X-Version', '1.0')
      .notify(this, 'responseStatus', ctx)
      .send(dataHash);
  },
  
  responseStatus: function(response, ctx) {
    if (SC.$ok(response)) {
      Synapse.statechart.gotoState('authenticatedState');
    } else {
      // Synapse.authController.set('password', '');
    }
  },
  
  exitState: function() {
    
  },
  
  // tmp
  mainNavState: SC.State.plugin('Synapse.MainNavState')

});


/* >>>>>>>>>> BEGIN source/states/video_post_state.js */
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
/* >>>>>>>>>> BEGIN source/states/web_post_state.js */
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
/* >>>>>>>>>> BEGIN source/resources/main_page.js */
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

/* >>>>>>>>>> BEGIN source/main.js */
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

