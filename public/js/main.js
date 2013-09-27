var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "assets"	: "list",
        "assets/page/:page"	: "list",
        "assets/add"         : "addAsset",
        "assets/:id"         : "assetDetails",
        "about"             : "about",
        "location/assets/:location" : "list"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var assetList = new AssetCollection();
        console.log('in Asset Add');
        assetList.fetch({success: function(){
            $("#content").html(new AssetListView({model: assetList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    assetDetails: function (id) {
        var asset = new Asset({_id: id});
        console.log("In asset detail");
        asset.fetch({success: function(){
            $("#content").html(new AssetView({model: asset}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addAsset: function() {
        console.log("In Add Asset form");
        var asset = new Asset();
        $('#content').html(new AssetView({model: asset}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'AssetView', 'AssetListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});
