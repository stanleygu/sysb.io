"use strict";angular.module("sysbIoApp",["ngSanitize","ui.bootstrap","ui.ace","infinite-scroll","ngTouch","highcharts-ng","ngRoute","ui.jq","ui.keypress","uiSlider"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/gallery",{templateUrl:"views/gallery.html",controller:"GalleryCtrl"}).when("/load",{templateUrl:"views/loadModal.html",controller:"LoadCtrl"}).when("/version",{templateUrl:"views/version.html",controller:"VersionCtrl"}).when("/version/:githubUserName/:githubRepository/:githubModelName*",{templateUrl:"views/version.html",controller:"VersionCtrl"}).when("/simulate",{templateUrl:"views/simulate.html",controller:"SimulateCtrl"}).when("/simulate/:githubUserName/:githubRepository/:githubModelName*",{templateUrl:"views/simulate.html",controller:"SimulateCtrl"}).when("/modelLayout",{templateUrl:"views/modelLayout.html",controller:"ModelLayoutCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("sysbIoApp").controller("MainCtrl",["$scope","$window","App","$modal","Github",function(a,b,c,d,e){a.App=c,a.loginMessage=function(){return c.data.github.accessToken?"Logged in":"Log in"},a.loginToGithub=function(){c.data.github.accessToken||(b.OAuth.initialize("EFBBdvbz8MYOYgVTBxOG2sg7JGM"),b.OAuth.popup("github",function(b,d){a.$apply(function(){c.setAccessToken(d.access_token)})}))},a.logOutOfGithub=function(){c.removeAccessToken()},a.windowPaneSize="50-50",a.model=c.data.model,c.data.model.sbml?c.rpc("loadModel",{sbml:c.data.model.sbml}):e.getFile("stanley-gu","biomodels_db","curated/BIOMD0000000012.xml",function(a){c.data.model.sbml=a,c.rpc("loadModel",{sbml:a})}),a.startModalLoadModel=function(){d.open({templateUrl:"views/loadModal.html",controller:"LoadModalCtrl"})},a.startModalVersion=function(){d.open({templateUrl:"views/versionModal.html",controller:"VersionCtrl"})},a.exportSbml=function(){d.open({templateUrl:"views/exportModal.html",controller:"ExportModalCtrl"})};var f=function(a){c.rpc("addSpecies",{id:a.id,name:a.name,compartment:a.compartment,initialAmount:a.initialAmount})},g=function(a){c.rpc("addCompartment",{id:a.id,size:a.size,constant:a.constant})};a.newModel=function(){var a=d.open({templateUrl:"views/newModal.html"});a.result.then(function(a){c.rpc("createModel",{level:a.level,version:a.version,id:a.id,name:a.name})})},a.save=c.save,a.unsave=c.unsave,a.addSpeciesDefault=function(){var b="node"+a.model.species.length;0===a.model.compartments.length?(g({id:"compartment0",size:1,constant:!0}),c.rpc("addSpecies",{id:b,name:b,compartment:"compartment0",initialAmount:0})):c.rpc("addSpecies",{id:b,name:b,compartment:a.model.compartments[0].id,initialAmount:0})},a.addReactionDefault=function(){var b="reaction"+a.model.reactions.length;c.rpc("addReaction",{id:b,name:b})},a.addParameter=function(a){c.rpc("addParameter",{id:a.id,value:a.value})},a.addSpecies=function(){f({id:a.newSpeciesId,name:a.newSpeciesName,compartment:a.newSpeciesCompartment,initialAmount:a.newSpeciesInitialAmount})},a.getModel=function(){c.rpc("getModel",{}),c.rpc("getCompartments",{}),c.rpc("getSpecies",{}),c.rpc("getReactions",{}),c.rpc("getModelName",{}),c.rpc("getModelId",{})},a.newReactants=[],a.newProducts=[],a.addReaction=function(){var b=[],d=[];a.newReactants.forEach(function(c,d){c&&b.push(a.model.species[d].id)}),a.newProducts.forEach(function(b,c){b&&d.push(a.model.species[c].id)}),c.rpc("addReaction",{id:a.newReactionId,name:a.newReactionName,reactants:b,products:d}),a.newReactants=[],a.newProducts=[]},a.speciesNodeStyle={shape:"roundrectangle",width:"60",height:"60",content:"data(id)","font-size":18,"text-valign":"center","text-outline-width":4,"text-outline-color":"black","border-color":"black","border-width":5,"background-color":"white",color:"white"},a.reactionNodeStyle={shape:"triangle",width:"60",height:"60",content:"data(id)","font-size":18,"text-valign":"center","text-outline-width":4,"text-outline-color":"black","border-color":"black","border-width":5,"background-color":"white",color:"white"},a.edgeStyle={width:5,"target-arrow-shape":"data(targetArrowShape)","line-color":"black","line-style":"data(lineStyle)","source-arrow-color":"black","target-arrow-color":"black"},a.$watch("speciesNodeStyle",function(){a.updateStyles()},!0),a.$watch("reactionNodeStyle",function(){a.updateStyles()},!0),a.$watch("edgeStyle",function(){a.updateStyles()},!0),a.updateSelectedNodes=function(){if(a.selected=a.cy.elements(":selected"),1===a.selected.length){var b,e=a.selected[0];e.hasClass("species")?(b=d.open({templateUrl:"views/speciesModal.html",controller:"SpeciesModalCtrl",resolve:{id:function(){return e.id()},model:function(){return a.model}}}),b.result.then(function(a){c.rpc("updateSpecies",{id:e.id(),changes:a})})):e.hasClass("reaction")&&(b=d.open({templateUrl:"views/reactionModal.html",controller:"ReactionModalCtrl",resolve:{id:function(){return e.id()},model:function(){return a.model}}}),b.result.then(function(a){c.rpc("updateReaction",{id:e.id(),changes:a})}))}},a.updateNodeStyle=function(a,b,c){try{a.css(b,c)}catch(d){console.log("error",d)}},a.cytConfig={},a.updateStyles=function(){a.cytConfig.style=[{selector:"node.species",css:a.speciesNodeStyle},{selector:"node.reaction",css:a.reactionNodeStyle},{selector:"edge",css:a.edgeStyle},{selector:":selected",css:{"border-color":"red","line-color":"red"}}]},a.layoutName="arbor",a.$watch("layoutName",function(){a.cytConfig.layout={name:a.layoutName,fit:!0}}),a.cyZoom=!1,a.cytConfig.ready=function(){a.cy.zoomingEnabled(!1),a.cy.minZoom(.5),a.cy.maxZoom(5)},a.$watch("cyZoom",function(){a.cy&&a.cy.zoomingEnabled(a.cyZoom)})}]),angular.module("sysbIoApp").controller("LoadCtrl",["$scope","$http","GithubLogin","SbmlModel","Github",function(a,b,c,d,e){a.accessToken=c.getAccessToken(),a.github={},a.$watch("githubUserName",function(){console.log("Detected a change in User Name!"),e.getUserRepos(a.githubUserName,function(b){a.github.repos=b})}),a.$watch("githubRepository",function(){console.log("Detected a change in GitHub Repository Name!"),e.getRepoFiles(a.githubUserName,a.githubRepository,function(b){a.github.files=b})}),a.loadFromGithub=function(){e.getVersionHistory(a.githubUserName,a.githubRepository,a.githubModelName,function(b){a.models=b,d.setRepo(b)})},a.addVersion=function(){a.models.push({name:a.commitMessage,text:a.editorText,checked:!1})},a.loadFromText=function(){a.models=[],a.models.push({name:"SBML model",text:a.sbmlTextToLoad,checked:!1}),d.setRepo(a.models)},a.loadFromFile=function(){}}]),angular.module("sysbIoApp").controller("LoadModalCtrl",["$scope","App","$window","$modal","$modalInstance","$http",function(a,b,c,d,e,f){a.accessToken=b.accessToken;var g=b.github;a.github={},a.$watch("github.userName",function(){console.log("Detected a change in User Name!");var b=g.getUser(a.github.userName);b.repos(function(b,c){a.github.repos=c})}),a.$watch("github.repo",function(){console.log("Detected a change in GitHub Repository Name!");var b=g.getRepo(a.github.userName,a.github.repo);b.getTree("master?recursive=true",function(b,c){a.github.files=c})}),a.loadFromGithub=function(){a.loadingScreen={},a.loadingScreen.title="Loading Model...",a.loadingScreen.body="Hang on!",a.loadingScreen.status="active",d.open({templateUrl:"views/loadingScreenModal.html",scope:a});var c=g.getRepo(a.github.userName,a.github.repo);c.read("master",a.github.file,function(c,d){c?(a.loadingScreen.status="danger",a.loadingScreen.body="Sorry, could not load the model.",a.$apply()):b.saveSbml(d,function(b,c){b?(a.loadingScreen.status="danger",a.loadingScreen.body="Sorry, SBML is invalid."):c&&(a.loadingScreen.status="success",a.loadingScreen.body="Done!"),a.$apply()})})},a.addVersion=function(){a.models.push({name:a.commitMessage,text:a.editorText,checked:!1})},a.loadFromText=function(c){a.loadingScreen={},a.loadingScreen.title="Loading Model...",a.loadingScreen.body="Hang on!",a.loadingScreen.status="active",d.open({templateUrl:"views/loadingScreenModal.html",scope:a}),b.saveSbml(c,function(b,c){b?(a.loadingScreen.status="danger",a.loadingScreen.body="Sorry, SBML is invalid."):c&&(a.loadingScreen.status="success",a.loadingScreen.body="Done!"),a.$apply()})},a.loadFromUrl=function(a){f.jsonp(a+"?callback=jsonpCallback")},a.dropzoneConfig={url:"/",drop:function(b){console.log("dropped!"),console.log(b.dataTransfer.items[0]);var c=b.dataTransfer.items[0].getAsFile(),d=this,e=new FileReader;e.onload=function(){d.emit("success",c,"done",b),d.emit("complete",c,"done",b),a.loadFromText(e.result)},e.readAsText(c)},autoProcessQueue:!1,error:function(a,b,c){console.log("Error! ",c)}},a.cancel=function(){e.close()},a.ok=function(){e.close()}}]),angular.module("sysbIoApp").controller("ExportModalCtrl",["$scope","App",function(a,b){a.data=b.data,b.rpc("getMatlab",{})}]),angular.module("sysbIoApp").controller("SpeciesModalCtrl",["$scope","$modalInstance","App","id","model",function(a,b,c,d,e){a.id=d,a.model=e,a.species={};var f={};a.model.species.forEach(function(a){f[a.id]=a}),a.name=f[d].name,a.initialAmount=f[d].initialAmount}]),angular.module("sysbIoApp").controller("ReactionModalCtrl",["$scope","$modalInstance","App","id","model",function(a,b,c,d,e){a.id=d,a.model=e;var f={};a.model.reactions.forEach(function(a){f[a.id]=a});var g=f[d];a.reaction={},a.reaction.species=[],a.model.species.forEach(function(b,c){var d=b.id;a.reaction.species.push({id:d}),a.reaction.species[c].reactant=g.reactants.indexOf(d)>-1?!0:!1,a.reaction.species[c].product=g.products.indexOf(d)>-1?!0:!1}),a.name=g.name,a.kineticLaw=g.kineticLaw,a.save=function(){b.close(a.reaction)}}]),angular.module("sysbIoApp").controller("VersionCtrl",["$scope","SbmlModel","$http","SbmlDiff","$window","Github","$routeParams",function(a,b,c,d,e,f,g){var h=function(){a.models=b.getRepo(),a.bivesUrl="https://node-bives-c9-stanley-gu.c9.io",a.previewGraphml=b.getCurrentGraphml();var c=new XMLSerializer;a.previewSbml=c.serializeToString(b.getCurrentModel().sbml),a.loadVersion=function(d){b.setCurrentIndex(d),a.previewSbml=c.serializeToString(b.getCurrentModel().sbml)},a.compareVersions=function(){var b=[],c=0;return a.models.forEach(function(a,d){a.checked&&(c+=1,b.push(d))}),c>2?(e.alert("Please check only 2 versions to compare."),void 0):(2===c&&d.getDiff(a.models[b[0]].text,a.models[b[1]].text,"compareVersions",function(b){a.modelDiff=b.diff,a.graphml=b.graphml,a.$apply()}),void 0)}};g.githubUserName?f.getVersionHistory(g.githubUserName,g.githubRepository,g.githubModelName,function(c){b.setRepo(c),a.models=b.getRepo(),h()}):h()}]),angular.module("sysbIoApp").controller("SimulateCtrl",["$scope","$window","App",function(a,b,c){a.App=c,a.sim=c.data.model.sim,a.model=c.data.model,a.chartConfig={options:{chart:{type:"line",zoomType:"x"},plotOptions:{series:{marker:{enabled:!1}}},credits:{enabled:!1}},series:[{data:[]}],title:{text:"Simulation Results"},loading:!1,xAxis:{currentMin:0,currentMax:20,title:{text:"Time (s)"}},useHighStocks:!1,navigator:{adaptToUpdatedData:!1}},a.$watch("App.data.model.sim.result",function(){a.chartConfig.series=c.data.model.sim.result},!0),a.$watch("sim.time.start + sim.time.end + sim.time.steps",function(){a.chartConfig.xAxis.currentMin=a.sim.time.start,a.chartConfig.xAxis.currentMax=a.sim.time.end,c.simulate()}),a.paramUpdate=function(b){c.rpc("setParameterValueById",{id:a.model.parameters[b].id,value:a.model.parameters[b].value})}}]),angular.module("sysbIoApp").service("GithubLogin",["$window",function(a){this.getAccessToken=function(){return a.localStorage.getItem("accessToken")?a.localStorage.getItem("accessToken"):null},this.setAccessToken=function(b){a.localStorage.setItem("accessToken",b)},this.removeAccessToken=function(){a.localStorage.removeItem("accessToken")}}]),angular.module("sysbIoApp").service("SbmlModel",["$window","Sbml",function(a,b){var c=new XMLSerializer;this.getModelName=function(){this.repo=this.getRepo(),this.model=this.getCurrentModel(),this.text=this.repo[this.getCurrentIndex()].text},this.getModelSbml=function(){var a=this.getCurrentModel();if(a)return c.serializeToString(a.sbml);throw"SBML Model Not Loaded"},this.setRepo=function(b){b.forEach(function(a){a.model&&delete a.model}),a.localStorage.setItem("sbmlRepo",JSON.stringify(b))},this.getRepo=function(){if(this.repo)return this.repo;if(this.repo=JSON.parse(a.localStorage.getItem("sbmlRepo")),this.repo)return this.repo.forEach(function(a){a.model=b.loadSbml(a.text)}),this.repo;throw"No repo in localStorage"},this.updateModel=function(a){if(this.repo){var c=this.getCurrentIndex();this.repo[c].text=a,this.repo[c].model=b.loadSbml(a)}},this.saveModel=function(){this.setRepo(this.repo)},this.setCurrentIndex=function(b){a.localStorage.setItem("repoIndex",b)},this.getCurrentIndex=function(){return a.localStorage.getItem("repoIndex")},this.getCurrentModel=function(){var a;if(this.repo&&this.getCurrentIndex())return a=this.getCurrentIndex(),a=0,this.repo[a].model;if(this.repo=this.getRepo(),a=this.getCurrentIndex()||this.repo.length-1,a=0,this.repo)return this.model=this.repo[a].model,this.repo[a].model;throw"Repo not loaded"},this.setTwoDiffIndices=function(b){2===b.length&&a.localStorage.setItem("sbmlDiffIndices",JSON.stringify(b))},this.getTwoDiffIndices=function(){return JSON.parse(a.localStorage.getItem("sbmlDiffIndices"))},this.setCurrentGraphml=function(b){a.localStorage.setItem("sbmlGraphml",b)},this.getCurrentGraphml=function(){return a.localStorage.getItem("sbmlGraphml")}}]),angular.module("sysbIoApp").service("SbmlDiff",["$http","$window",function(a,b){this.bivesUrl="http://sysb.io:8002",this.getDiff=function(a,c,d,e){var f=b.io.connect(this.bivesUrl);f.emit("getDiff",{first:a,second:c,responseId:d}),f.on(d,function(a){e(a)})}}]),angular.module("sysbIoApp").service("Simulator",["$window",function(a){this.socket=a.io.connect("http://sysb.io:8003"),this.socket.on("connect",function(){console.log("connected to simulator")})}]),angular.module("sysbIoApp").service("Github",["$http","GithubLogin",function(a,b){function c(a){this.name="GithubError",this.message=a}var d=b.getAccessToken();this.getFile=function(b,c,e,f){a.defaults.headers.common.Accept=a.defaults.headers.common.Accept+", application/vnd.github.VERSION.raw";var g="https://api.github.com/repos/"+b+"/"+c+"/contents/"+e;d&&(g+="?access_token="+d),a.get(g).then(function(a){f(a.data)})},this.getUserRepos=function(b,c){var e="https://api.github.com/users/"+b+"/repos";d&&(e+="?access_token="+d+"&per_page=100"),a.get(e).then(function(a){var b=[];a.data.forEach(function(a){b.push(a.name)}),c(b)})},this.getRepoFiles=function(b,c,e){var f="https://api.github.com/repos/"+b+"/"+c+"/branches/master";d&&(f+="?access_token="+d),a.get(f).then(function(f){var g="https://api.github.com/repos/"+b+"/"+c+"/git/trees/"+f.data.commit.sha+"?recursive=1";d&&(g+="&access_token="+d),a.get(g).then(function(a){var b=[];a.data.tree.forEach(function(a){b.push(a.path)}),e(b)})})},this.getVersionHistory=function(b,c,e,f){a.defaults.headers.common.Accept=a.defaults.headers.common.Accept+", application/vnd.github.VERSION.raw";var g="https://api.github.com/repos/"+b+"/"+c+"/commits?path="+e;d&&(g+="&access_token="+d),a.get(g).then(function(g){g.data.forEach(function(a){console.log(a.commit.message)});var h=g.data,i=[],j=h.length,k=0;h.forEach(function(g,h,l){var m="https://api.github.com/repos/"+b+"/"+c+"/contents/"+e;d&&(m+="?access_token="+d),a.get(m,{params:{ref:g.sha}}).then(function(a){console.log(h),console.log(g.commit.message),k+=1,i[l.length-1-h]={name:g.commit.message,text:a.data,checked:!1},k===j&&f(i)})})})},this.createRepository=function(b,e,f){var g="https://api.github.com/user/repos";if(!d)throw new c("Need an access token to create a repo.");g+="?access_token="+d,a.post(g,{name:e,description:f}).then(function(a){console.log(a)})},this.createFile=function(b,e,f){var g="https://api.github.com/repos/"+b+"/"+e+"/contents/"+f;if(!d)throw new c("Need an access token to create a file.");g+="?access_token="+d,a.put(g,{message:"first commit",content:btoa("hello world")}).then(function(a){console.log(a)})}}]),angular.module("sysbIoApp").service("Rpc",["$window",function(a){this.socket=a.io.connect("http://service.sysb.io:8080"),this.socket.on("connect",function(){console.log("connected to RPC server")})}]),angular.module("sysbIoApp").factory("App",["Rpc","GithubLogin","Github","$window","$rootScope",function(a,b,c,d,e){var f="sysbio",g={model:{sim:{time:{start:0,end:100,steps:100}}},github:{},settings:{view:{windowPane:{"90-10":{left:"col-md-11",right:"col-md-1"},"75-25":{left:"col-md-9",right:"col-md-3"},"50-50":{left:"col-md-6",right:"col-md-6"},"25-75":{left:"col-md-3",right:"col-md-9"},"10-90":{left:"col-md-1",right:"col-md-11"}},toolbar:{nodeStyles:{visible:!1},editModel:{visible:!1},simulate:{visible:!0}}}}},h={data:{},save:function(){d.localStorage[f]=angular.toJson(h.data)},unsave:function(){delete d.localStorage[f]},restore:function(){return h.data=angular.fromJson(d.localStorage[f])||g,h.data},loginToGithub:function(){h.data.github.accessToken&&(h.github=new d.Github({token:h.data.github.accessToken}),h.github.getUser(void 0,function(a,b){a||(h.github.user=b)}),h.save())},setAccessToken:function(a){h.data.github.accessToken=a,h.loginToGithub()},removeAccessToken:function(){h.data.github.accessToken=null},saveSbml:function(a,b){h.loadSbml(a,function(c,d){c||(h.data.model.sbml=a,e.$apply()),b(c,d)})},loadSbml:function(b,c){h.rpc("loadModel",{sbml:b});var d=function(b){b.id===a.socket.socket.sessionid&&"loadModel"===b.method&&(c(b.error,b.response),a.socket.removeListener("output",d))};a.socket.on("output",d)},rpc:function(b,c){a.socket.emit("run",{method:b,params:c})},rpcUpdate:function(){h.rpc("getModel",{}),h.rpc("getCompartments",{}),h.rpc("getParameters",{}),h.rpc("getSpecies",{}),h.rpc("getReactions",{}),h.rpc("getModelName",{}),h.rpc("getModelId",{})},simulate:function(){h.rpc("simulate",{timeStart:h.data.model.sim.time.start,timeEnd:h.data.model.sim.time.end,numPoints:h.data.model.sim.time.steps})}};return a.socket.on("output",function(b){if(b.id===a.socket.socket.sessionid){if(b.error)console.log("RPC Error: ",b.error);else if("getModel"===b.method)h.data.model.sbml=b.response,h.simulate();else if("loadModel"===b.method)h.rpcUpdate();else if("createModel"===b.method)h.rpc("getModel",{});else if("addSpecies"===b.method)h.rpc("getSpecies",{}),h.rpc("getModel",{});else if("updateSpecies"===b.method)h.rpc("getSpecies",{}),h.rpc("getModel",{});else if("addCompartment"===b.method)h.rpc("getCompartments",{}),h.rpc("getModel",{});else if("addReaction"===b.method)h.rpc("getReactions",{}),h.rpc("getModel",{});else if("addParameter"===b.method)h.rpc("getModel",{}),h.rpc("getParameters",{});else if("setParameterValueById"===b.method)h.rpc("getModel",{}),h.rpc("getParameters",{});else if("updateReaction"===b.method)h.rpc("getReactions",{}),h.rpc("getModel",{});else if("getMatlab"===b.method)h.data.model.matlab=b.response;else if("getCompartments"===b.method)h.data.model.compartments=b.response;else if("getSpecies"===b.method)h.data.model.species=b.response;else if("getReactions"===b.method)h.data.model.reactions=b.response;else if("getModelName"===b.method)h.data.model.name=b.response;else if("getModelId"===b.method)h.data.model.id=b.response;else if("simulate"===b.method){var c,f,g,i,j,k=b.response;for(i=k[0].length-1,j=[],c=0;i>c;c+=1){for(g={},g.name=h.data.model.species[c].id,g.data=[],f=0;f<k.length;f+=1)g.data.push({x:k[f][0],y:k[f][c+1]});g.index=c,g.color=d.Highcharts.getOptions().colors[c%10],j.push(g)}h.data.model.sim.result=j}else if(b.method.indexOf("getParameters")>-1){var l=b.response.values,m=b.response.ids,n=[];m.length?m.forEach(function(a,b){n.push({id:a,value:l[b]})}):n.push({id:m,value:l}),h.data.model.parameters=n}e.$apply()}}),h.restore(),h}]),angular.module("sysbIoApp").service("Sbml",function(){function a(a){var b=new DOMParser,c=b.parseFromString(a,"text/xml");this.sbml=c}a.prototype.setGithubInfo=function(a,b,c){this.github={},this.github.user=a,this.github.repo=b,this.github.file=c},a.prototype.attributesToHash=function(a){for(var b={},c=a.attributes,d=0;d<c.length;d++){var e=c[d];b[e.nodeName]=e.nodeValue}return b},a.prototype.addAttributesToArray=function(a,b,c,d){var e=this;Array.prototype.forEach.call(a,function(a){var f=e.attributesToHash(a);if(c){var g=Object.keys(c);g.forEach(function(a){f[a]=c[a]})}d?b.push(d(f,a)):b.push(f)})},a.prototype.addReactionsToArray=function(a,b,c,d){var e=this.sbml.querySelectorAll("reaction");Array.prototype.forEach.call(e,function(e){var f=e.querySelector("listOfProducts");if(f){var g=f.querySelectorAll("speciesReference");Array.prototype.forEach.call(g,function(c){a.push(b(c,e))})}var h=e.querySelector("listOfReactants");if(h){var i=h.querySelectorAll("speciesReference");Array.prototype.forEach.call(i,function(b){a.push(c(b,e))})}var j=e.querySelector("listOfModifiers");if(j){var k=j.querySelectorAll("modifierSpeciesReference");Array.prototype.forEach.call(k,function(b){a.push(d(b,e))})}})},a.prototype.getString=function(){var a=new XMLSerializer;return a.serializeToString(this.sbml)},this.loadSbml=function(b){var c=new a(b);return c}}),angular.module("sysbIoApp").controller("GalleryCtrl",["$scope","$http","$window","Github","GithubLogin","SbmlDiff","SbmlModel","Sbml",function(a,b,c,d,e,f,g,h){a.bivesUrl="https://node-bives-c9-stanley-gu.c9.io",a.gallery=[],a.notes=[];var i=0;c.localStorage.getItem("galleryRepos")&&c.localStorage.getItem("galleryRepos").length>=12?a.galleryRepos=JSON.parse(c.localStorage.getItem("galleryRepos")):(a.galleryRepos=[],d.getFile("sysb-io","sysbio-gallery","list.txt",function(b){var e=b.split("\n");e.pop(),e.forEach(function(b){b=b.split(":");var e=b[0].split("/"),f=e[0],g=e[1],h=b[1];d.getFile(f,g,h,function(b){a.galleryRepos.push({user:f,repo:g,file:h,sbml:b}),0===i&&(a.loadMore(),i+=1),c.localStorage.setItem("galleryRepos",JSON.stringify(a.galleryRepos))})})})),a.loadingText="Loading more models.",a.loadMore=function(){if(i<a.galleryRepos.length){var b=a.galleryRepos[i],c=h.loadSbml(b.sbml);c.setGithubInfo(b.user,b.repo,b.file),a.gallery.push(c);var d="";try{var e=c.sbml.querySelector("body").cloneNode(!0);d=e.innerHTML}catch(f){}a.notes.push(d),i+=1}else a.loadingText=""},a.loadMore(),a.loadGalleryRepo=function(b){d.getVersionHistory(a.galleryRepos[b].user,a.galleryRepos[b].repo,a.galleryRepos[b].file,function(a){g.setRepo(a)})}}]),angular.module("sysbIoApp").directive("help",function(){return{transclude:!0,template:"<div ng-transclude></div>",restrict:"E",link:function(a,b){b.click(function(a){a.stopPropagation(),$("body").chardinJs("start")}),$(document).on("chardinJs:start",function(){$(".chardinjs-overlay").on("click",function(a){a.stopPropagation()})})}}}),angular.module("sysbIoApp").directive("cyt",["Sbml",function(a){return{template:"<div></div>",restrict:"E",scope:{sbml:"=",config:"=?",cy:"=?"},link:function(b,c){b.$watch("sbml",function(d){var e=a.loadSbml(d);c.css("height","100%"),c.css("width","100%"),c.css("position","absolute");var f=function(){var a=[],b=e.sbml.querySelectorAll("species"),c=e.sbml.querySelectorAll("reaction");return e.addAttributesToArray(b,a,void 0,function(a){return{data:a,classes:"species"}}),e.addAttributesToArray(c,a,{faveShape:"rectangle"},function(a){return{data:a,classes:"reaction"}}),a},g=function(){var a=[];return e.addReactionsToArray(a,function(a,b){return{data:{source:b.id,target:a.getAttribute("species"),targetArrowShape:"triangle"}}},function(a,b){return{data:{source:a.getAttribute("species"),target:b.id,targetArrowShape:"triangle"}}},function(a,b){return{data:{source:a.getAttribute("species"),target:b.id,lineStyle:"dotted",targetArrowShape:"circle"}}}),a},h=f(),i=g();$(c).cytoscape({elements:{nodes:h,edges:i},showOverlay:!1,ready:function(){b.cy=this,b.$apply(),b.$watch("config.style",function(a){a&&a.length&&b.cy.style().fromJson(a).update()}),b.$watch("config.layout",function(a){a&&b.cy.layout(a)}),b.config.ready&&b.config.ready()}})})}}}]),angular.module("sysbIoApp").controller("NavCtrl",["$scope","$location",function(a,b){a.isCurrentRoute=function(a){return b.path()===a}}]);