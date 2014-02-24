// Server and POST values
//var MNOPI_SERVER_URL = "http://192.168.1.38:8000/";
//var MNOPI_SERVER_URL = "https://ec2-54-197-231-98.compute-1.amazonaws.com/"
var SCANDALOH_SERVER_URL = "http://ec2-54-225-46-222.compute-1.amazonaws.com";
//var SCANDALOH_SERVER_URL = "http://192.168.1.111:8000";

var POST_SERVICES = {
    'login': "/api/v1/user/login/",
    'send_scandaloh': "/api/v1/photo/",
    'send_comment': "/api/v1/comment/"
};

// Plugin version
PLUGIN_VERSION = "alpha1";
