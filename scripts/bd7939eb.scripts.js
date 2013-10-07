"use strict";angular.module("sysbIoApp",["ngSanitize","ui.bootstrap","ui.ace","stanleygu.cytoscapeweb","stanley-gu.angular-rickshaw","blueimp.fileupload","ngCytoscape.js"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/gallery.html",controller:"GalleryCtrl"}).when("/load",{templateUrl:"views/load.html",controller:"LoadCtrl"}).when("/version",{templateUrl:"views/version.html",controller:"VersionCtrl"}).when("/version/:githubUserName/:githubRepository/:githubModelName",{templateUrl:"views/version.html",controller:"VersionCtrl"}).when("/simulate",{templateUrl:"views/simulate.html",controller:"SimulateCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("sysbIoApp").controller("MainCtrl",["$scope","$window","GithubLogin",function(a,b,c){c.getAccessToken()?(a.classGithubLoginButton="btn btn-success",a.loginMessage="Connected to GitHub!"):(a.classGithubLoginButton="btn btn-danger",a.loginMessage="Log in to GitHub"),a.loginToGithub=function(){c.getAccessToken()||(b.OAuth.initialize("EFBBdvbz8MYOYgVTBxOG2sg7JGM"),b.OAuth.popup("github",function(b,d){a.$apply(function(){c.setAccessToken(d.access_token),a.classGithubLoginButton="btn btn-success",a.loginMessage="Logged in to GitHub"})}))}}]),angular.module("sysbIoApp").controller("LoadCtrl",["$scope","$http","GithubLogin","SbmlModel","Github",function(a,b,c,d,e){a.accessToken=c.getAccessToken(),a.github={},a.$watch("githubUserName",function(){console.log("Detected a change in User Name!"),e.getUserRepos(a.githubUserName,function(b){a.github.repos=b})}),a.$watch("githubRepository",function(){console.log("Detected a change in GitHub Repository Name!"),e.getRepoFiles(a.githubUserName,a.githubRepository,function(b){a.github.files=b})}),a.loadFromGithub=function(){e.getVersionHistory(a.githubUserName,a.githubRepository,a.githubModelName,function(b){a.models=b,d.setRepo(b)})},a.addVersion=function(){a.models.push({name:a.commitMessage,text:a.editorText,checked:!1})},a.loadFromText=function(){a.models=[],a.models.push({name:"SBML model",text:a.sbmlTextToLoad,checked:!1}),d.setRepo(a.models)},a.loadFromFile=function(){}}]),angular.module("sysbIoApp").controller("VersionCtrl",["$scope","SbmlModel","$http","SbmlDiff","$window",function(a,b,c,d,e){a.models=b.getRepo(),a.bivesUrl="https://node-bives-c9-stanley-gu.c9.io",a.previewGraphml=b.getCurrentGraphml(),a.loadVersion=function(c){b.setCurrentIndex(c),d.getDiff(b.getCurrentModel(),b.getCurrentModel(),"loadVersion",function(c){b.setCurrentGraphml(c.graphml),a.previewGraphml=b.getCurrentGraphml()})},a.compareVersions=function(){var b=[],c=0;return a.models.forEach(function(a,d){a.checked&&(c+=1,b.push(d))}),c>2?(e.alert("Please check only 2 versions to compare."),void 0):(2===c&&d.getDiff(a.models[b[0]].text,a.models[b[1]].text,"compareVersions",function(b){a.modelDiff=b.diff,a.graphml=b.graphml,a.$apply()}),void 0)}}]),angular.module("sysbIoApp").controller("SimulateCtrl",["$scope","$window","SbmlModel","Simulator",function(a,b,c,d){a.currentModel=c.getCurrentModel(),a.simGraphml=c.getCurrentGraphml(),a.simStartTime=0,a.simEndTime=100,a.simNumSteps=100,a.params=[],a.$watch("simStartTime + simEndTime + simNumSteps",function(){d.socket.emit("run",{method:"simulateEx",params:[a.simStartTime,a.simEndTime,a.simNumSteps]})}),a.paramUpdate=function(b){console.log("parameter updated!"),d.socket.emit("run",{method:"setGlobalParameterByIndex",params:[b,a.params[b].value]}),d.socket.emit("run",{method:"simulateEx",params:[a.simStartTime,a.simEndTime,a.simNumSteps]})},d.socket.emit("run",{method:"loadSBML",params:[a.currentModel]}),d.socket.emit("run",{method:"getGlobalParameterIds",params:[],postProcess:"stringArrayToString",freeMem:"freeStringArray"}),d.socket.emit("run",{method:"getGlobalParameterValues",params:[],postProcess:"vectorToString",freeMem:"freeVector"}),d.socket.on("response",function(c){if(console.log(c),c.method.indexOf("simulate")>-1){var d,e,f,g,h,i,j;for(i=new b.Rickshaw.Color.Palette({scheme:"classic9"}),c=c.output,g=c[0],h=c[0].length-1,j=[],d=0;h>d;d+=1){for(f={},f.name=g[d+1],f.data=[],f.color=i.color(),e=1;e<c.length;e+=1)f.data.push({x:parseInt(c[e][0],10),y:parseInt(c[e][d+1],10)});j.push(f)}a.simData=j,a.$apply()}else c.method.indexOf("getGlobalParameterValues")>-1?(a.paramValues=c.output.split("	"),a.paramValues.pop(),a.paramValues.forEach(function(b,c){a.params[c]||a.params.push({}),a.params[c].value=parseFloat(b),a.$apply()})):c.method.indexOf("getGlobalParameterIds")>-1&&(a.paramIds=c.output.split(" "),a.paramIds.forEach(function(b,c){a.params[c]||a.params.push({}),a.params[c].id=b,a.params[c].value=null,a.$apply()}))})}]),angular.module("sysbIoApp").service("GithubLogin",["$window",function(a){this.getAccessToken=function(){return a.localStorage.getItem("accessToken")?a.localStorage.getItem("accessToken"):null},this.setAccessToken=function(b){a.localStorage.setItem("accessToken",b)}}]),angular.module("sysbIoApp").service("SbmlModel",["$window",function(a){this.setRepo=function(b){a.localStorage.setItem("sbmlRepo",JSON.stringify(b))},this.getRepo=function(){return JSON.parse(a.localStorage.getItem("sbmlRepo"))},this.setCurrentIndex=function(b){a.localStorage.setItem("sbmlIndex",b)},this.getCurrentIndex=function(){return a.localStorage.getItem("sbmlIndex")},this.getCurrentModel=function(){var a=this.getCurrentIndex(),b=this.getRepo();return a&&b?b[a].text:null},this.setTwoDiffIndices=function(b){2===b.length&&a.localStorage.setItem("sbmlDiffIndices",JSON.stringify(b))},this.getTwoDiffIndices=function(){return JSON.parse(a.localStorage.getItem("sbmlDiffIndices"))},this.setCurrentGraphml=function(b){a.localStorage.setItem("sbmlGraphml",b)},this.getCurrentGraphml=function(){return a.localStorage.getItem("sbmlGraphml")}}]),angular.module("sysbIoApp").service("SbmlDiff",["$http","$window",function(a,b){this.bivesUrl="http://sysb.io:8002",this.getDiff=function(a,c,d,e){var f=b.io.connect(this.bivesUrl);f.emit("getDiff",{first:a,second:c,responseId:d}),f.on(d,function(a){e(a)})}}]),angular.module("sysbIoApp").service("Simulator",["$window",function(a){this.socket=a.io.connect("http://sysb.io:8003"),this.socket.on("connect",function(){console.log("connected to simulator")})}]),angular.module("sysbIoApp").service("Github",["$http","GithubLogin",function(a,b){var c=b.getAccessToken();this.getFile=function(b,d,e,f){a.defaults.headers.common.Accept=a.defaults.headers.common.Accept+", application/vnd.github.VERSION.raw";var g="https://api.github.com/repos/"+b+"/"+d+"/contents/"+e;c&&(g+="?access_token="+c),a.get(g).then(function(a){f(a.data)})},this.getUserRepos=function(b,d){var e="https://api.github.com/users/"+b+"/repos";c&&(e+="?access_token="+c+"&per_page=100"),a.get(e).then(function(a){var b=[];a.data.forEach(function(a){b.push(a.name)}),d(b)})},this.getRepoFiles=function(b,d,e){var f="https://api.github.com/repos/"+b+"/"+d+"/branches/master";c&&(f+="?access_token="+c),a.get(f).then(function(f){var g="https://api.github.com/repos/"+b+"/"+d+"/git/trees/"+f.data.commit.sha+"?recursive=1";c&&(g+="&access_token="+c),a.get(g).then(function(a){var b=[];a.data.tree.forEach(function(a){b.push(a.path)}),e(b)})})},this.getVersionHistory=function(b,d,e,f){a.defaults.headers.common.Accept=a.defaults.headers.common.Accept+", application/vnd.github.VERSION.raw";var g="https://api.github.com/repos/"+b+"/"+d+"/commits?path="+e;c&&(g+="&access_token="+c),a.get(g).then(function(g){g.data.forEach(function(a){console.log(a.commit.message)});var h=g.data,i=[],j=h.length,k=0;h.forEach(function(g,h,l){var m="https://api.github.com/repos/"+b+"/"+d+"/contents/"+e;c&&(m+="?access_token="+c),a.get(m,{params:{ref:g.sha}}).then(function(a){console.log(h),console.log(g.commit.message),k+=1,i[l.length-1-h]={name:g.commit.message,text:a.data,checked:!1},k===j&&f(i)})})})}}]),angular.module("sysbIoApp").controller("GalleryCtrl",["$scope","$http","$window","Github","GithubLogin","SbmlDiff","SbmlModel","Sbml",function(a,b,c,d,e,f,g,h){a.bivesUrl="https://node-bives-c9-stanley-gu.c9.io",c.localStorage.getItem("galleryRepos")&&c.localStorage.getItem("galleryRepos").length>=6?(a.galleryRepos=JSON.parse(c.localStorage.getItem("galleryRepos")),a.gallery=[],a.galleryRepos.forEach(function(b){a.gallery.push(h.loadSbml(b.sbml))})):(a.galleryRepos=[],a.gallery=[],d.getFile("sysb-io","sysbio-gallery","list.txt",function(b){var e=b.split("\n");e.pop(),e.forEach(function(b){b=b.split(":");var e=b[0].split("/"),f=e[0],g=e[1],i=b[1];d.getFile(f,g,i,function(b){a.galleryRepos.push({user:f,repo:g,file:i,sbml:b}),c.localStorage.setItem("galleryRepos",JSON.stringify(a.galleryRepos)),a.gallery.push(h.loadSbml(b)),a.$apply()})})})),a.notes=a.gallery.map(function(a){var b="";try{var c=a.sbml.querySelector("body").cloneNode(!0);b=c.innerHTML}catch(d){}return b}),a.loadGalleryRepo=function(b){d.getVersionHistory(a.galleryRepos[b].user,a.galleryRepos[b].repo,a.galleryRepos[b].file,function(c){g.setRepo(c),g.setCurrentGraphml(a.galleryRepos[b].graphml),g.setCurrentIndex(0)})}}]),angular.module("sysbIoApp").directive("help",function(){return{transclude:!0,template:"<div ng-transclude></div>",restrict:"E",link:function(a,b){b.click(function(){$("body").chardinJs("start")})}}});