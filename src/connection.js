// Server and POST values
//var SCANDALOH_SERVER_URL = "http://host.scandaloh.com";
//var SCANDALOH_SERVER_URL = "http://ec2-54-225-46-222.compute-1.amazonaws.com";
var SCANDALOH_SERVER_URL = "http://192.168.1.111:8001";

var POST_SERVICES = {
    'login': "/api/v1/user/login/",
    'send_scandaloh': "/api/v1/photo/",
    'send_comment': "/api/v1/comment/",
    'preview_url': "/api/v1/photo/preview-url/"
};

// Plugin version
PLUGIN_VERSION = "1";
