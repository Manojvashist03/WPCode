/* This file handles all of the javascript for our program
* Key elements:

I've setup an inputMe function that passes arrays of options and spits out an input
	n: name
	v: value
	l: label (lowercase L)
	p: placeholder
	d: disable
	h: hidden
	e: explain (adds a div below to explain if a required field is left empty, etc)

i.e. inputMe({n:"the-job-code", v:jobID, l:"Job Code", d:"disabled"})

SQL syntax
	
*/

jQuery( document ).ready(function($) {

    //our main ajax function. Handles pretty much everything
    var anAJAX = function(theOptions){

        //the landing is how we process how to handle data after the call
        var theLanding = theOptions["landing"];

        //Sometimes it's a div, in which case, add some loading feedback
        if($(theLanding)){anticipating(theLanding);}

        //add some default values like URL
        if(!theOptions["url"]){var upUrl = ai_script.ajaxurl;}
        else {var upUrl = theOptions["url"];}

        //data is another array that contains more detailed information to pass
        var data = theOptions["data"];

        //More default values for our data array
        if(!data["action"]){data["action"] = "getReceive";}
        if(!data["command"]){data["command"] = "get";}
        if(!data["type"]){data["type"] = "role";}
        if(!data["orderBy"]){data["orderBy"] = "date_uploaded";}
        if(!data["order"]){data["order"] = "DESC";}

        //sometimes we'll want json type data
        if(!theOptions["dataType"]){var dataType = "html";}
        else {var dataType = theOptions["dataType"];}

        //ajax actions
        var aa = {
            url: upUrl,
            type: 'POST',
            dataType: dataType,
            data: data
        };

        //sometimes we won't be calling to the admin, but rather, uploading a file, etc
        var adminCall = theOptions["theAdmin"];

        //if no adminCall, then give some feedback as to the upload progress
        if(adminCall == "false"){
            aa["cache"] = false;
            aa["contentType"] = false;
            aa["processData"] = false;
            aa["xhr"] = function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    // For handling the progress of the upload
                    myXhr.upload.addEventListener('progress', function (e) {
                        if (e.lengthComputable) {
                            //our progress bar grows!
                            $('progress').attr({
                                value: e.loaded,
                                max: e.total,
                            });
                        }
                    }, false);
                }
                return myXhr;
            }
        }

        //run the actual ajax, and our landing
        $.ajax(aa).done(function(result) {
            landing(theOptions, result);
        });
    }

    //after the ajax call is complete, these are the functions that will run
    //to process and display the results
    var landing = function(theOptions, result){
        var landing = theOptions["landing"];

        //self explanatory. Not all calls need to give feedback
        if(landing == "nothing"){
            console.log(result);
        }

            //this is for editing, deleting, and creating new database entries
        //examples would include changing a job description, or deleting a survey
        else if(landing == "edit-db"){
            //our data returned from the DB is always JSON. The error handling is on the
            //php side
            var parseMe = JSON.parse(result);
            parseMe = parseMe.results[0];
            var uid = parseMe.uid;

            //we already have the career paths and benchmarks added to our table,
            //so why reinvent the wheel when we can just grab it from the HTML?
            var careerPaths = $(".ai-upload-" + uid + " .ai-meta_role_id-count").text();
            var benchmarks = $(".ai-upload-" + uid + " .ai-benchmarks_role_id-count").text();
            var careerDisabled = "";
            var benchmarksDisabled = "";

            //this detects if there are any career paths or benchmarks, and if not, it
            //adds the disabled option to the button
            if(!careerPaths){
                careerDisabled = " disabled";
            }
            if(!benchmarks){
                benchmarksDisabled = " disabled";
            }

            //now we create our popup
            var title = parseMe.title;
            var jobID = parseMe.job_id;
            var description = parseMe.description;
            var date = parseMe.date_uploaded;

            //refer to the guide at the top for reference on the array to pass for inputMe
            var jobTitle = inputMe({n:"the-role-title", v:title, p:"Job Title"});
            var jobCode = inputMe({n:"the-job-code", v:jobID, l:"Job Code", d:"disabled"});
            var theDescription = textAreaMe({n:"the-role-description", v:description, l:"Role Description"});

            //put our popup together...
            var topSection = "<h3>Edit " + title + "</h3>" + jobTitle;
            var leftSide = jobCode + theDescription;
            var rightSide = "<h3>Role Connections</h3><button class='ai-button' id='ai-view-benchmarks'" + benchmarksDisabled + ">View Benchmarks</button><button class='ai-button' id='ai-view-career-paths' data-meta_role_id-count='" + uid + "'" + careerDisabled + ">View Associated Career Paths</button>";
            var hiddenIsh = inputMe({n:"the-uid", v:uid, h:true});

            //our populatePopup function takes the options array and spits out a snazzy popup
            var options = {
                topSection: topSection,
                leftSide: leftSide,
                rightSide: rightSide,
                sendID: "ai-run-internal", //the id that the "submit" button will have
                sendText: "Compare to internal roles", //the text that the submit button will have
                bottomSection: "another button", //this arranges the bottom section to include another button
                extraID: "ai-compare-survey", //the extra button's ID
                extraButton: "Benchmark", //the extra button's text
                extra: "<button class='kick-off' id='ai-add-career-path'>Add to Career Path</button><button class='kick-off' id='ai-update-role'>Save Changes</button>", //we have an option to add even more HTML
                hiddenIsh: hiddenIsh //all of the hidden inputs that will help pass variables
            };

            //remove the "loading" feedback
            unanticipating("#the-results-table");

            //send it to the popup!
            populatePopup(options);
        }

            //when we upload a csv, we have no idea if they are matching the columns to
        //the correct index for our python script. This gives them the option to choose
        else if(landing == "csv-upload"){

            //list type can be surveys or roles and will determin how we process it
            var listType = theOptions["listType"];
            var result = eval(result);

            //we had several hidden inputs in our document. This fills them in to use later
            $('#' + listType + '_file_hidden').val(result[1]);

            //our result from python was split with a pipe
            var theColumns = result[0].split("|");

            //the last pipe was irrelevant, so we can remove it
            theColumns.splice(-1,1);
            var rowCount = theColumns.shift();

            //PHP gave us back the file size and the randomly generated file name
            var fileSize = result[2];
            var fileName = result[3];

            //clear the lightbox
            clearLB();

            //create our popup!
            createColumnPopup(theColumns, listType, fileSize, fileName, rowCount);
        }

        //clean and process a CSV
        else if(landing == "clean-me"){

            //we don't want any duplicate names
            if(result !== "duplicate"){
                clearLB();
                var theD = theOptions["data"];
                var type = theD["survey_role"];

                //our clean CSV function does the heavy lifting
                cleanCSV(type, result);
            }
            else {
                alert("Duplicate survey name");
            }
        }

        else if(landing == "benchmark"){
            console.log("benchmark landing!");
            var o = theOptions["data"];
            var type = o["type"];
            var id = o["id"];
            var cpID = o["cpID"];
            var cpOrder = o["cpOrder"];
            var roleUID = o["roleUID"];
            var hiddenIsh = "";
            var title = o["title"];
            var createCareer = "";
            if(!id){
                id = "select";
            }
            else if(id == "select-career"){
                createCareer = "<button id='ai-create-career-lb'>Create Career Path</button>";
            }
            else {
                hiddenIsh = inputMe({n:"ai-cp-id", v:cpID, h:true}) + inputMe({n:"ai-cp-order", v:cpOrder, h:true}) + inputMe({n:"ai-the-id", v:id, h:true}) + inputMe({n:"ai-role-id", v:roleUID, h:true}) +  inputMe({n:"ai-role-title", v:title, h:true});
            }
            var topSection = "<h3>Choose a " + type + " below</h3>" + createCareer;
            var options = {
                topSection: topSection,
                leftSide: "<div id='the-results-table'>" + result + "</div>",
                rightSide:"",
                sendID: "ai-" + id + "-" + type,
                sendText: "Select " + type,
                hiddenIsh: hiddenIsh
            };
            unanticipating(".ai-wrap-the-buttons");
            populatePopup(options);
        }
        else if(landing == "fill from db"){
            console.log(result);
            //var parseMe = JSON.parse(result);
            var parseMe = result["results"][0];
            console.log(parseMe);
            var uid = parseMe.uid;
            var title = parseMe.title;
            var description = parseMe.description;
            var date = parseMe.date_uploaded;
            var topSection = "<h3>Edit " + title + "</h3>" + inputMe({n:"the-survey-title", l:title, p: "Survey Title", v:title});
            var leftSide = textAreaMe({n:"the-survey-description", v:description, l:"Survey Description"});
            var hiddenIsh = inputMe({n:"the-uid", v:uid, h:true});
            var options = {
                topSection: topSection,
                leftSide: leftSide,
                sendID: "update_upload",
                sendText: "Save Survey",
                hiddenIsh: hiddenIsh
            };
            populatePopup(options);
        }
        else if(landing == "congrats"){
            var o = theOptions["data"];
            var table = o["table"];
            var cpUID = o["cpUID"];
            var title = o["title"];
            var cpTitle = o["cpTitle"];
            if(table == "wp_ai_career_path_meta"){
                var thePage = $(".the-table-results").attr("data-type");
                var addedVerbiage = "";
                if(thePage == "role" || thePage == "career"){
                    var isJson = true;
                    try{
                        var json = $.parseJSON(title);
                    }
                    catch(err){
                        isJson = false;
                    }
                    if(isJson){
                        var first = true;
                        $.each(json, function( index, value ) {
                            if(first){
                                addedVerbiage += "<span class='bold-me'>" + value + "</span>";
                                first = false;
                            }
                            else {
                                addedVerbiage += " and <span class='bold-me'>" + value + "</span>";
                            }
                        });
                    }
                    else {
                        addedVerbiage = "<span class='bold-me'>" + title + "</span>";
                    }
                    var topSection = "<h3>Career Path Added</h3>";
                    var queryString = "?aipage=career&path=" +cpUID;
                    var extra = "<a href='/reporting/" + queryString + "' class='kick-off'>Go to career path</a>";
                    var leftSide = "<div class='ai-explain-action'>" + addedVerbiage + " was added to <span class='bold-me'>" + cpTitle + "</span></div>";
                    var sendText = "Stay on this page";
                    var sendID = "ai-refresh-me";
                    if($("#the-results-table").hasClass("compare-internal-table")){
                        sendID = "ai-close-me";
                    }
                    if(result == "Duplicate entry"){
                        leftSide = "<div class='ai-explain-action'>You've already added this role to this career path</div>";
                        topSection = "<h3>Duplicate Entry</h3>";
                        extra = null;
                        sendText = "Continue";
                        sendID = "ai-lb-goodbye";
                    }

                    var popupArray = {
                        topSection:topSection,
                        sendID:sendID,
                        sendText: sendText,
                        extra:extra,
                        leftSide: leftSide
                    }
                    populatePopup(popupArray);
                }
                else {
                    var cpUID = o["cpUID"];
                    reloadCareer(cpUID);
                    unanticipating("#the-results-table");
                    clearLB(true);
                    alert(result);
                }
            }
            else if(table == "wp_ai_benchmarks"){
                console.log(result);
                var multiple = theOptions["multiple"];
                var entries = $("#benchbark-results-table").attr("data-entries");
                var duplicates = $("#benchbark-results-table").attr("data-duplicates");
                var theAlert = "";
                if(result !== "Duplicate entry"){
                    if(entries){
                        $("#benchbark-results-table").attr("data-entries", ++entries);
                    }
                    else {
                        $("#benchbark-results-table").attr("data-entries", 1);
                    }
                }
                else {
                    if(duplicates){
                        $("#benchbark-results-table").attr("data-duplicates", ++duplicates);
                    }
                    else {
                        $("#benchbark-results-table").attr("data-duplicates", 1);
                    }
                }
                var refreshEntries = $("#benchbark-results-table").attr("data-entries");
                var refreshDuplicates = $("#benchbark-results-table").attr("data-duplicates");
                if(theOptions["end"]){
                    if(refreshEntries){
                        theAlert = refreshEntries + " Benchmarks Added!";
                    }
                    if(refreshDuplicates){
                        if(refreshDuplicates > 1){
                            theAlert += "(" + refreshDuplicates +" duplicates)";
                        }
                        else {
                            theAlert += "(" + refreshDuplicates +" duplicate)";
                        }
                    }
                    $("#benchbark-results-table").attr("data-duplicates", 0);
                    $("#benchbark-results-table").attr("data-entries", 0);
                    alert(theAlert);
                }
                else if(!multiple){
                    if(refreshDuplicates){
                        alert("Duplicate Entry");
                    }
                    else {
                        alert("Benchmark Added Successfully!")
                    }
                    $("#benchbark-results-table").attr("data-duplicates", 0);
                    $("#benchbark-results-table").attr("data-entries", 0);
                }
                clearLB();
            }
            else if(table == "wp_ai_career_path"){
                if($.isNumeric(result)){
                    alert("Added new career!");
                    window.location.href = '/reporting/?aipage=career&path=' + result;
                }
                else {
                    alert(result);
                }
            }
        }
        else if(landing == "refresh"){
            console.log(result);
            if($.trim(result) == "added"){
                alert("Role added!");
                reloadTable();
            }
            else {
                clearLB();
                reloadTable();
            }
        }
        else if(landing == "split view"){
            console.log(result);
            var parseMe = JSON.parse(result);
            if(parseMe[1].results !== "No Results"){
                var raw = parseMe[1].results[0];
                console.log(raw);
                var table = parseMe[0];
                var title, jobID, description, h3;
                if(raw.career_path_id){
                    title = raw.roles_title;
                    jobID = raw.roles_job_id;
                    description = raw.roles_description;
                    h3 = "Career Paths";
                }
                else {
                    jobID = raw.job_id;
                    title = raw.title;
                    description = raw.description;
                    h3 = "Benchmarks";
                }
                var leftSide = "<div class='ai-left-side'><h3 class='bm-title'>" + title + "</h3><div class='bm-job-id'>" + jobID + "</div><div class='bm-description'>" + description + "</div></div>";
                var rightSide = "<div class='ai-right-side'><div id='the-results-table' class='compare-internal-table' data-type='career'><h2>" + h3 + " for " + title + "</h2>" + table + "</div></div>";
                $(".wrap-left-right").html("<div class='wrap-ajax-match'>" + leftSide + rightSide + "</div>");
            }
            else {
                var leftSide = "<div class='ai-left-side'><div class='no-results'>No results</div></div>";
                var rightSide = "<div class='ai-right-side'><div class='no-results'>No results</div></div>";
                $(".wrap-left-right").html("<div class='wrap-ajax-match'>" + leftSide + rightSide + "</div>");
            }
            initiateMe();
        }
        else if(landing == "select me"){
            var landingID = theOptions["data"]["landingID"];
            var parseMe = JSON.parse(result);
            var results = parseMe.results;
            $(landingID).append("<option>Select Report Type</option>");
            $(results).each(function( index ) {
                var title = this.title;
                var uid = this.uid;
                var directory = this.directory;
                $(landingID).append("<option value='" + uid + "' data-directory='" + directory + "'>" + title + "</option>");
            });

            console.log(theOptions);
        }
        else if(landing == "json-me"){
            //console.log(result);
            var landID = theOptions["landID"];
            var display = theOptions["display"];
            var parseMe = JSON.parse(result, true);
            parseMe = parseMe.results[0];
            var displayMe = parseMe[display];
            $("#" + landID).html(displayMe);
        }
        else if(landing == "visualize-me"){
            var landID = theOptions["landID"];
            var display = theOptions["display"];
            var parseMe = JSON.parse(result, true);
            var theResults = parseMe.results[0];
            var all = parseMe["count"];
            var ratio = theResults["count"];
            var remaining = all - ratio;
            var percentage = roundMe(remaining / all, 3);
            console.log(remaining);
            var theHTML = "<div id='with-benchmark' class='ai-circle-graph' data-percentage-1='" + percentage + "'></div>";
            $("#" + landID).html(theHTML);
            createGraph();
            console.log(theHTML);
        }
        else {
            console.log(result);
            $(landing).html(result);
            unanticipating(landing);
            initiateMe();
        }
    }
    var roundMe = function financial(num, to) {
        return Number.parseFloat(num).toFixed(to);
    }
    var reloadTable = function(options = {}){
        console.log("reloaded");
        var type = $(".the-table-results").attr("data-type");
        if(!type){type = "role"}
        var pageLimit = $("#per-page").val();
        if(!pageLimit){pageLimit = 25}
        var pageNum = $(".the-selected-page").attr("data-number");
        if(!pageNum){pageNum = 1}
        var id= $("#ai-the-id").val();
        var offset = (pageNum * pageLimit) - pageLimit;
        if(!offset){
            offset = 0;
        }
        var orderBy = $(".sorted-by-me").attr("data-column-id");
        if(!orderBy){orderBy = "date_uploaded"}
        var landing = options["landing"];
        if(!options["landing"]){
            landing = "#the-results-table";
        }
        if($(".sorted-by-me").hasClass("sort-asc")){
            order = "ASC";
        }
        else {
            order = "DESC";
        }
        options["limit"] = pageLimit;
        options["offset"] = offset;
        options["order"] = order;
        options["orderBy"] = orderBy;
        options["type"] = type;
        options["id"] = id;

        if($("#search-me").val()){
            var where = options["where"];
            if(!where){
                where = setColumns(type);
            }
            var sVal = $("#search-me").val();
            options["command"] = "search";
            options["where"] = where;
            options["is"] = sVal;
        }

        options = tableMe(options);
        var theOptions = {
            data: options,
            landing: landing
        };
        var theQuery = getUrlVars();
        if(theQuery["view"] == "benchmarks"){
            var roleID = theQuery["uid"];
            var table = "wp_ai_benchmarks";
            var where = "role_id";
            var is = roleID;
            var landing = "split view";
            var data = {
                table: table,
                where: where,
                is: is,
                type: "benchmarks",
                orderBy: "title",
                clean: "half clean"
            };
            var tabled = tableMe(data);
            var theOptions = {
                data: tabled,
                landing: landing
            };
            anAJAX(theOptions);
        }
        else if(theQuery["view"] == "careerpaths"){
            var roleID = theQuery["uid"];
            var table = "wp_ai_career_path_meta";
            var where = "role_id";
            var is = roleID;
            var landing = "split view";
            var data = {
                table: table,
                where: where,
                is: is,
                type: "career-paths",
                orderBy: "role_id",
                clean: "half clean"
            };
            var tabled = tableMe(data);
            var theOptions = {
                data: tabled,
                landing: landing
            };
            anAJAX(theOptions);
        }
        else if(theQuery["aipage"] == "reports"){
            var getReportTypes = {
                table: "wp_ai_reports",
                where: "parent",
                is:"0",
                clean:"clean",
                type: "get reports",
                orderBy: "title",
                landingID: "#select-report-type"
            };
            var getReportTypesOptions = {
                data: getReportTypes,
                landing: "select me"
            };
            anAJAX(getReportTypesOptions);
            //getReports();
        }
        else if(theQuery["aipage"] == "home"){
            dashboard();
        }
        else {
            anAJAX(theOptions);
        }
    }
    var dashboard = function(){
        //get total number of internal roles
        var numInternalRoles = {
            type: "Internal Roles",
            table: "wp_ai_roles",
            command: "dynamic"
        };
        data = tableMe(numInternalRoles);
        var nirOptions = {
            data: data,
            landing: "json-me",
            landID: "ai-nir",
            display: "count",
        };
        anAJAX(nirOptions);

        //get roles with no benchmark
        var noBM = {
            type: "no-bm",
            table: "wp_ai_roles",
            command: "dynamic"
        };
        var noBMdata = tableMe(noBM);
        var noBMOptions = {
            data: noBMdata,
            landing: "json-me",
            landID: "ai-rnbm",
            display: "count",
        };
        anAJAX(noBMOptions);

        //get surveys
        var surveys = {
            type: "surveys",
            table: "wp_ai_uploads",
            command: "dynamic"
        };
        var surveyData = tableMe(surveys);
        var surveyOptions = {
            data: surveyData,
            landing: "json-me",
            landID: "ai-nos",
            display: "count",
        };
        anAJAX(surveyOptions);

        //get number of survey roles
        var sroles = {
            type: "sroles",
            table: "wp_ai_uploads",
            command: "dynamic"
        };
        var srolesData = tableMe(sroles);
        var srolesOptions = {
            data: srolesData,
            landing: "json-me",
            landID: "ai-nosr",
            display: "sumit",
        };
        anAJAX(srolesOptions);

        //get number of career paths
        var nocp = {
            type: "nocp",
            table: "wp_ai_career_path",
            command: "dynamic"
        };
        var nocpData = tableMe(nocp);
        var nocpOptions = {
            data: nocpData,
            landing: "json-me",
            landID: "ai-nocp",
            display: "count",
        };
        anAJAX(nocpOptions);

        //get internal roles with a benchmark
        var wBMOptions = {
            data: noBMdata,
            landing: "visualize-me",
            landID: "ai-noirwb",
            display: "count",
        };
        anAJAX(wBMOptions);

        //get number of career paths
        var nocp = {
            type: "nocp",
            table: "wp_ai_career_path",
            command: "dynamic"
        };
        var nocpData = tableMe(nocp);
        var nocpOptions = {
            data: nocpData,
            landing: "json-me",
            landID: "ai-nocp",
            display: "count",
        };
        anAJAX(nocpOptions);
    }
    var createGraph = function(colors = null){
        var circleGraph = $(".ai-circle-graph");
        $(circleGraph).each(function( index ) {
            //for our graphs
            console.log("i exist");
            var percentage = $(this).attr("data-percentage-1");
            var holdPercentage = null;
            if(percentage > 0.5){
                $(this).addClass("above-50");
                holdPercentage = percentage - 0.5;
            }
            else {
                $(this).addClass("below-50");
                holdPercentage = percentage;
            }
            $('<div/>', {
                class: 'a-percentage first-p',
                style: "transform: rotate(" + holdPercentage + "turn);"
            }).appendTo($(this));
            $('<div/>', {
                class: 'a-percentage-title'
            }).html(roundMe(percentage * 100, 1) + "%").appendTo($(this));
        });
    }
    var getReports = function(){
        //benchmarks and career paths
        var BmCpOptions = {
            type: "reports-cp-bm",
            limit: 25,
            offset: 0,
            order: "DESC",
            orderBy: "benchmarks_role_id",
            table: "wp_ai_roles"
        };
        BmCpOptions = tableMe(BmCpOptions);
        var BmCptheOptions = {
            data: BmCpOptions,
            landing: "#bm-and-cp-model"
        };
        $(".column-me").append("<div id='bm-and-cp-model'></div>");
        anticipating("#bm-and-cp-model");
        anAJAX(BmCptheOptions);

        //Career path detail report
        var CpOptions = {
            type: "reports-cp",
            limit: 25,
            offset: 0,
            order: "DESC",
            orderBy: "title",
            table: "wp_ai_career_path"
        };
        CpOptions = tableMe(CpOptions);
        var CptheOptions = {
            data: CpOptions,
            landing: "#cp-model"
        };
        $(".column-me").append("<div id='cp-model'></div>");
        anticipating("#cp-model");
        anAJAX(CptheOptions);
    }
    var getUrlVars = function (){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    var reloadCareer = function(cpID){
        var data = {
            command : "get career path",
            table: "wp_ai_uploads",
            cpUID: cpID,
        };
        var theOptions = {
            data: data,
            landing: ".wrap-career-path"
        };
        anAJAX(theOptions);
    }
    var tableMe = function(theOptions){
        var type = theOptions["type"];
        if(type == "survey"){
            theOptions["columnNames"] = ["Title", "Date Uploaded", "Size", "Status"];
            theOptions["rowData"] = ["title", "date_uploaded", "size", "status", "uid", "file_name"];
        }
        else if(type == "role"){
            theOptions["columnNames"] = ["Title", "Job ID", "Description", "Date Uploaded", "Benchmarks", "Career Paths"];
            theOptions["rowData"] = ["title", "job_id", "description", "date_uploaded", "benchmarks_role_id", "meta_role_id", "uid"];
            theOptions["joinTable"] = "wp_ai_benchmarks";
            theOptions["joinSelect"] = ["role_id"];
            theOptions["joinConnect"] = "role_id";
            theOptions["joinVal"] = "role_id";
            theOptions["joinOn"] = "uid";
            theOptions["join2Table"] = "wp_ai_career_path_meta";
            theOptions["join2Select"] = ["role_id"];
            theOptions["join2Connect"] = "role_id";
            theOptions["join2Val"] = "role_id";
            theOptions["join2On"] = "uid";
            theOptions["select"] = ["uid", "title", "description", "job_id", "date_uploaded"];
        }
        else if(type == "career"){
            theOptions["columnNames"] = ["Title", "Description", "Date Uploaded"];
            theOptions["rowData"] = ["title", "description", "date_uploaded", "uid", "duplicate"];
        }
        else if(type == "benchmarks"){
            theOptions["columnNames"] = ["Title", "Job ID", "Description", "Survey"];
            theOptions["rowData"] = ["title", "job_id", "description", "uploads_title"];
            theOptions["joinTable"] = "wp_ai_uploads";
            theOptions["joinSelect"] = ["title", "uid"];
            theOptions["joinConnect"] = "uid";
            theOptions["joinVal"] = "uid";
            theOptions["joinOn"] = "survey_id";
            theOptions["joinCount"] = "false";
            theOptions["join2Table"] = "wp_ai_roles";
            theOptions["join2Select"] = ["title", "uid", "job_id", "description"];
            theOptions["join2Val"] = "title";
            theOptions["join2Connect"] = "uid";
            theOptions["join2On"] = "role_id";
            theOptions["join2Count"] = "false";
            theOptions["select"] = ["uid", "title", "description", "job_id"];
        }
        else if(type == "career-paths"){
            theOptions["columnNames"] = ["Title", "Description", "Date Created"];
            theOptions["rowData"] = ["path_title", "path_description", "path_date_uploaded", "path_uid"];
            theOptions["joinTable"] = "wp_ai_career_path";
            theOptions["joinSelect"] = ["title", "description", "date_uploaded", "uid"];
            theOptions["joinConnect"] = "uid";
            theOptions["joinVal"] = "title";
            theOptions["joinOn"] = "career_path_id";
            theOptions["joinCount"] = "false";
            theOptions["join2Table"] = "wp_ai_roles";
            theOptions["join2Select"] = ["title", "uid", "job_id", "description"];
            theOptions["join2Val"] = "title";
            theOptions["join2Connect"] = "uid";
            theOptions["join2On"] = "role_id";
            theOptions["join2Count"] = "false";
            theOptions["select"] = ["role_id", "career_path_id"];
        }
        else if(type == "reports-cp-bm"){
            theOptions["columnNames"] = ["Job Code", "Job Title", "Number of Career Paths", "Number of Benchmarks"];
            theOptions["rowData"] = ["job_id", "title", "meta_role_id", "benchmarks_role_id"];
            theOptions["select"] = ["uid", "title", "description", "job_id", "date_uploaded"];
            theOptions["join1Table"] = "wp_ai_benchmarks";
            theOptions["join1Select"] = [
                "role_id",
                {
                    count: true,
                    ifNull:true,
                    value: "role_id",
                    select: true,
                    selectAs: "benchmarks_role_id"
                }
            ];
            theOptions["join1GroupBy"] = "role_id";
            theOptions["join1Value"] = "role_id";
            theOptions["join1OnValue"] = "uid";
            theOptions["join2Table"] = "wp_ai_career_path_meta";
            theOptions["join2Select"] = [
                "role_id",
                {
                    count: true,
                    ifNull:true,
                    value: "role_id",
                    select: true,
                    selectAs: "meta_role_id"
                }
            ];
            theOptions["join2GroupBy"] = "role_id";
            theOptions["join2Value"] = "role_id";
            theOptions["join2OnValue"] = "uid";
            theOptions["where"] = "role_id";
            theOptions["is"] = "IS NOT NULL";
            theOptions["and"] = " OR m.meta_role_id IS NOT NULL";
            theOptions["checkboxme"] = "false";
            theOptions["debug"] = true;
        }
        else if(type == "reports-cp"){
            theOptions["columnNames"] = ["Career Path", "Job Code", "Job Title", "Step", "Main Path"];
            theOptions["rowData"] = ["title", "roles_job_id", "roles_title", "meta_path_order", "meta_pivot"];
            theOptions["select"] = ["title", "uid"];
            theOptions["join1Table"] = "wp_ai_career_path_meta";
            theOptions["join1Select"] = [
                {
                    value: "path_order",
                    select:true,
                    selectAs: "meta_path_order"
                },
                {
                    value: "pivot",
                    select:true,
                    selectAs: "meta_pivot"
                },
                "role_id",
                "career_path_id"
            ];
            theOptions["join1Value"] = "career_path_id";
            theOptions["join1OnValue"] = "uid";
            theOptions["join2Table"] = "wp_ai_roles";
            theOptions["join2Select"] = [
                {
                    value: "title",
                    select:true,
                    selectAs: "roles_title"
                },
                {
                    value: "job_id",
                    select:true,
                    selectAs: "roles_job_id"
                },
                "uid"
            ];
            theOptions["join2Value"] = "uid";
            theOptions["join2OnValue"] = "role_id";
            theOptions["join2OnTable"] = "wp_ai_career_path_meta";
            theOptions["where"] = "path_order";
            theOptions["is"] = "IS NOT NULL";
            theOptions["checkboxme"] = "false";
            theOptions["debug"] = true;
        }
        else if(type == "reports-cps"){
            theOptions["columnNames"] = ["Career Path", "Number of Roles", "Number of Levels", "Number of Lateral Opportunities"];
            theOptions["rowData"] = ["title", "number_of_roles", "levels", "pivots"];

            theOptions["select"] = [{count: true, value: "role_id", select:true, selectAs: "number_of_roles"}];
            theOptions["groupBy"] = "career_path_id";
            theOptions["groupTable"] = "wp_ai_career_path_meta";
            theOptions["join1Table"] = "wp_ai_career_path_meta";
            theOptions["join1Select"] = [
                "uid", {
                    count: true,
                    ifNull:true,
                    value: "role_id",
                    select: true,
                    selectAs: "pivots"
                },
                "career_path_id"
            ];
            theOptions["join1Where"] = "pivot";
            theOptions["join1Is"] = "true";
            theOptions["join1Value"] = "career_path_id";
            theOptions["join1OnValue"] = "career_path_id";
            theOptions["join2Table"] = "wp_ai_career_path";
            theOptions["join2Select"] = ["uid", {value:"title", select:true}];
            theOptions["join2Value"] = "uid";
            theOptions["join2OnValue"] = "career_path_id";
            theOptions["join3Table"] = "wp_ai_career_path_meta";
            theOptions["join3Select"] = [
                "uid", {
                    max: true,
                    ifNull:true,
                    value: "path_order",
                    select:true,
                    selectAs: "levels"
                }
            ];
            theOptions["join3Value"] = "uid";
            theOptions["join3OnValue"] = "career_path_id";
            theOptions["checkboxme"] = "false";
            theOptions["debug"] = true;
        }
        else if(type == "reports-ncp"){
            theOptions["columnNames"] = ["Job Code", "Job Title", "Number of Career Paths"];
            theOptions["rowData"] = ["job_id", "title", "ncp"];
            theOptions["select"] = ["title", "job_id", "uid"];
            theOptions["join1Table"] = "wp_ai_career_path_meta";
            theOptions["join1Select"] = [
                {
                    ifNull:true,
                    value: "role_id",
                    select: true,
                    selectAs: "ncp"
                },
            ];
            theOptions["join1Value"] = "role_id";
            theOptions["join1OnValue"] = "uid";
            theOptions["where"] = "role_id";
            theOptions["is"] = "IS NULL";
            theOptions["checkboxme"] = "false";
            //theOptions["debug"] = true;

            /*

            SELECT r.title, r.job_id, r.uid, m.role_id FROM `wp_ai_roles` r
            LEFT JOIN (
                SELECT role_id
                FROM wp_ai_career_path_meta
            ) m ON m.role_id = r.uid
            WHERE m.role_id IS NULL


            */
        }
        else if(type == "Internal Roles"){
            theOptions["clean"] = "clean";
            theOptions["select"] = [{count: true, value: "*", select:true, selectAs:"count"}];
            //theOptions["debug"] = true;
        }
        else if(type == "surveys"){
            theOptions["clean"] = "clean";
            theOptions["select"] = [{count: true, value: "*", select:true, selectAs:"count"}];
            //theOptions["debug"] = true;
        }
        else if(type == "nocp"){
            theOptions["clean"] = "clean";
            theOptions["select"] = [{count: true, value: "*", select:true, selectAs:"count"}];
            //theOptions["debug"] = true;
        }
        else if(type == "sroles"){
            theOptions["clean"] = "clean";
            theOptions["select"] = [{sum: true, value: "row_count", select:true, selectAs:"sumit"}];
            //theOptions["debug"] = true;
        }
        else if(type == "no-bm"){
            theOptions["clean"] = "clean";
            theOptions["select"] = [{count: true, value: "uid", select:true, selectAs:"count"}];
            theOptions["join1Table"] = "wp_ai_benchmarks";
            theOptions["join1Select"] = [
                {value: "role_id"},
            ];
            theOptions["join1Value"] = "role_id";
            theOptions["join1OnValue"] = "uid";
            theOptions["where"] = "role_id";
            theOptions["is"] = "IS NULL";
            //theOptions["debug"] = true;
        }
        return theOptions;
    }
    var populatePopup = function(options){
        var topSection = options["topSection"];
        var leftSide = options["leftSide"];
        var rightSide = options["rightSide"];
        var sendID = options["sendID"];
        var sendText = options["sendText"];
        var bottomSection = options["bottomSection"];
        var hiddenIsh = options["hiddenIsh"];
        var extrabutton = options["extraButton"];
        var extraID = options["extraID"];
        var extra = options["extra"];
        if(!extra){
            extra = "";
        }
        $(".ai-top-section").html(topSection);
        $(".flex-left-side").html(leftSide);
        if(rightSide){
            $(".flex-right-side").addClass("has-content").html(rightSide);
        }
        else {
            $(".flex-right-side").removeClass("has-content").empty();
        }
        $(".kick-off").attr("id", sendID).text(sendText);
        if(bottomSection == "send left"){
            $(".kick-off").hide().clone().appendTo(".flex-left-side");
            $("#" + sendID).show();
        }
        else if(bottomSection == "another button"){
            $(".ai-bottom-section").html("<button class='kick-off' id='" + extraID + "'>" + extrabutton + "</button><button class='kick-off' id='" + sendID + "'>" + sendText + "</button>" + extra);
            $("#" + extraID).show();
        }
        else if(bottomSection == "nothing"){
            $(".ai-bottom-section").empty();
        }
        else {
            $(".ai-bottom-section").html("<button class='kick-off' id='" + sendID + "'>" + sendText + "</button>" + extra);
        }
        if(hiddenIsh){
            $(".hidden-ish").html(hiddenIsh);
        }
        $(".ai-lightbox-model, .ai-lightbox-back").css("display", "flex");
        initiateMe();
    }
    var createColumnPopup = function(columnArray, listType, fileSize, fileName, rowCount){
        var thePh = "Select column from uploaded CSV";
        var topSection = inputMe({n:"upload-title", p:"Please name your upload", e:true});
        var leftSide = "<h4>Please match the appropriate columns from the uploaded CSV</h4>";
        var rightSide = "<div class='three-me'><div class='three-one'>" +
            selectMe({n:"sort-job-code", o:columnArray, l:"Job Code", p:thePh, dn:"column", dv:"1"}) +
            "</div><div class='three-two'>" +
            selectMe({n:"sort-job-title", o:columnArray, l:"Job Title", p:thePh, dn:"column", dv:"2"}) +
            "</div><div class='three-three'>" +
            selectMe({n:"sort-job-description", o:columnArray, l:"Job Description", p:thePh, dn:"column", dv:"3"}) +
            "</div>";
        var hiddenSection = inputMe({n:"lb-file-size", v:fileSize, h:true}) + inputMe({n:"lb-file-name", v:fileName, h:true}) + inputMe({n:"lb-list-type", v:listType, h:true}) + inputMe({n:"lb-row-count", v:rowCount, h:true});
        var options = {
            topSection: topSection,
            leftSide: leftSide,
            rightSide: rightSide,
            sendID: "select-columns",
            sendText: "Process File",
            hiddenIsh: hiddenSection,
        };
        populatePopup(options);
    }
    var inputMe = function(o = {}){
        var name = o["n"];
        if(!name){name=""}
        var value = o["v"];
        if($.isArray(value)){
            value = JSON.stringify(value)
        }
        if(!value){value=""}
        var label = o["l"];
        if(!label){label=""}
        var placeholder = o["p"];
        if(!placeholder){placeholder=""}
        var disable = o["d"];
        if(!disable){disable=""}
        else{placeholder = " placeholder='" + placeholder + "'"}
        var hidden = o["h"];
        if(!hidden){hidden=""}
        var explain = o["e"];
        if(explain){
            explain = "<div id='explain-" + name + "' class='hide-me'></div>";
        }
        var labelHTML = "";
        if(label){
            labelHTML = "<label for='" + name + "'>" + label + "</label>";
        }
        if(hidden){
            hidden = " type='hidden'";
        }
        var replaceQuotes = value.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        var returnThis = labelHTML + "<input id='" + name + "' id='" + name + "' value='" + replaceQuotes + "'" + placeholder + "" + hidden + " " + disable + ">" + explain;
        return returnThis;
    }
    var selectMe = function(o = {}){
        var name = o["n"];
        if(!name){name=""}
        var theOptions = o["o"];
        if(!theOptions){theOptions=""}
        var label = o["l"];
        if(!label){label=null}
        var placeholder = o["p"];
        if(!placeholder){placeholder=null}
        var dataName = o["dn"];
        if(!dataName){dataName=null}
        var dataVal = o["dv"];
        if(!dataVal){dataVal=null}
        var theSelectItems = "";
        if(placeholder){
            theSelectItems = "<option value=''>" + placeholder + "</option>";
        }
        $.each(theOptions, function( index, value ) {
            theSelectItems += "<option value='" + value + "'>" + value + "</option>";
        });
        var data = "";
        if(dataName && dataVal){
            data = " data-" + dataName + "='" + dataVal + "'";
        }
        if(label){
            label = "<label for='" + name + "'>" + label + "</label>";
        }
        var returnMe = label + "<select id='" + name + "' name='" + name + "'" + data + ">" + theSelectItems + "</select><div id='explain-" + name + "' class='hide-me'></div>";
        return returnMe;
    }
    var textAreaMe = function(o={}){
        var name = o["n"];
        if(!name){name=""}
        var value = o["v"];
        if(!value){value=""}
        var label = o["l"];
        if(!label){label=""}
        var placeholder = o["p"];
        if(!placeholder){placeholder=""}
        var labelHTML = "";
        if(label){
            labelHTML = "<label for='" + name + "'>" + label + "</label>";
        }
        var returnThis = labelHTML + "<textarea id='" + name + "' id='" + name + "' placeholder='" + placeholder + "'>" + value + "</textarea>";
        return returnThis;
    }
    var uploadMe = function(o={}){
        var name = o["n"];
        if(!name){name=""}
        var type = o["t"];
        if(!type){type=""}
        var uploadID = o["u"];
        if(!uploadID){uploadID=""}
        var label = o["l"];
        if(!uploadID){uploadID=null}
        var placeholder = o["p"];
        if(!placeholder){placeholder=null}
        var labelHTML = "";
        if(label){
            labelHTML = "<h3>" + label + "</h3>";
        }
        var returnThis = labelHTML + "<form enctype='multipart/form-data' id='form-the-upload'><input id='" + name + "' name='file' type='file' /><progress></progress><input id='" + uploadID + "' type='button' value='" + placeholder + "' data-upload-type='" + type + "'/></form>";
        return returnThis;
    }
    var setColumns = function(type){
        if(type == "career"){
            return ["title", "description"];
        }
        else if(type == "role"){
            return ["title", "description", "job_id", "notes"];
        }
        else if(type == "survey"){
            return ["title", "description"];
        }
        else {
            return db;
        }
    }
    var selectColumns = function(){
        var type = $("#lb-list-type").val();
        $(".three-me select").each(function(index){
            var column = $(this).attr("data-column");
            var theVal = $("option:selected", this).val();
            $("#" + type + "_file_column_" + column).val(theVal);
        });
        var fileSize = $("#lb-file-size").val();
        var fileName = $("#lb-file-name").val();
        var title = $("#upload-title").val();
        var rowCount = $("#lb-row-count").val();
        var data = {
            action: "saveSurvey",
            uploadSize : fileSize,
            title: title,
            fileName: fileName,
            rowCount: rowCount,
            survey_role: type,
        };
        var theOptions = {
            data: data,
            landing: "clean-me",
        };
        anAJAX(theOptions);
    }
    var cleanCSV = function(type, uid){
        anticipating("#the-results-table");
        var uploadURL = ai_script.upload_url;
        var upUrl = uploadURL + "/clean-upload.php";
        var compareVal = $('#' + type + '_file_hidden').val();
        var compareCol1 = $('#' + type + '_file_column_1').val();
        var compareCol2 = $('#' + type + '_file_column_2').val();
        var compareCol3 = $('#' + type + '_file_column_3').val();
        var roleSurvey = $(".the-table-results").attr("data-type");
        $.post( upUrl, { compare: compareVal, compareCol1: compareCol1, compareCol2: compareCol2, compareCol3: compareCol3, roleSurvey: roleSurvey, uid: uid }).done(function( result ) {
            console.log(result);
        });
        reloadTable();
    }
    var internalRoles = function(benchmark, results){
        var title = benchmark["title"];
        var jobID = benchmark["jobID"];
        var description = benchmark["description"];
        var full = "<h3 class='bm-title'>" + title + "</h3><div class='bm-job-id'>" + jobID + "</div><div class='bm-description'>" + description + "</div>";
        var leftSide = "<div class='ai-left-side'>" + full + "</div>";
        var rightSide = "<div class='ai-right-side'><div id='the-results-table' class='the-table-results compare-internal-table' data-type='career'><button id='ai-add-selected'>Add to career path</button><h2>Internal Role Comparison</h2>" + results + "</div></div>";
        $(".wrap-left-right").html("<div class='wrap-ajax-match'>" + leftSide + rightSide + "</div>");
    }
    var checkJSON = function(theJson){
        var isJson = true;
        try{
            $.parseJSON(theJson);
        }
        catch(err){
            console.log(err);
            isJson = false;
        }
        return isJson;
    }
    var addToCareerPaths = function (that){
        var roleID = $("#ai-role-id").val();
        var isJson = true;
        try{
            var json = $.parseJSON(roleID);
        }
        catch(err){
            console.log(err);
            isJson = false;
        }
        if(isJson){
            roleID = json;
        }
        var cpUID = that.parent().attr("data-file-uid");
        var cpOrder = $("#ai-cp-order").val();
        var roleTitle = $("#ai-role-title").val();
        var cpTitle = that.parent().children("td:eq(1)").text();
        var where = {"career_path_id" : cpUID, "path_order" : cpOrder, "role_id": roleID};
        var data = {
            command : "insert",
            table: "wp_ai_career_path_meta",
            where: where,
            cpUID: cpUID,
            title: roleTitle,
            cpTitle: cpTitle,
            action: "getReceive",
        };
        var theOptions = {
            data: data,
            landing: "congrats"
        };
        anAJAX(theOptions);
        clearLB();
    }
    var sortCP = function(uid, order, pivot){
        var where = {"path_order" : order, "pivot": pivot};
        var data = {
            command : "update",
            table: "wp_ai_career_path_meta",
            where: where,
            is: uid,
        };
        var theOptions = {
            data: data,
            landing: "nothing"
        };
        //console.log(theOptions);
        anAJAX(theOptions);
    }
    var editRole = function(uid, dataType){
        var data = {
            where: "uid",
            is: uid,
            clean: "clean",
            type: dataType
        };
        var theOptions = {
            data: data,
            landing: "edit-db"
        };
        anAJAX(theOptions);
    }
    var anticipating = function(theID = ".the-table-results"){
        $(theID).addClass("anticipating");
    }
    var unanticipating = function (theID){
        $(theID).removeClass("anticipating");
    }
    var clearLB = function(noInitiate = null){
        $(".ai-top-section").empty();
        $(".flex-left-side").empty();
        $(".hidden-ish").empty();
        $(".flex-right-side").removeClass("has-content").empty();
        $(".ai-bottom-section").empty().html("<button class='kick-off'></button>");
        $(".ai-lightbox-model").hide();
        $(".kick-off").show();
        $(".anticipating").removeClass("anticipating");
        if(!noInitiate){
            initiateMe();
        }
    }
    var showHideCheckbox = function(that){
        var showHide = false;
        var addDelete = "delete";
        if(that.hasClass("checkbox-me") || $(".the-table-results").hasClass("benchmark-survey-table")){
            addDelete = "add";
        }
        $(".ai-row-checkbox, .checkbox-me").each(function( index ) {
            if($(this).is(':checked')) {
                showHide = true;
            }
        });
        if(showHide){
            var unique = $(".the-table-results").attr("data-unique");
            $(".wrap-the-table-deets").addClass("flex-space-me");
            $("." + unique + " #ai-" + addDelete + "-selected, ." + unique + " #ai-" + addDelete + "-selected-benchmark").show( "fast", function() {
            });
        }
        else {
            $("#ai-" + addDelete + "-selected").hide("fast", function() {
                $(".wrap-the-table-deets").removeClass("flex-space-me");
            });
        }
    }
    var initiateMe = function(){
        //table manipulation
        $("#per-page").on("change", function(e){
            reloadTable();
        });
        $(".a-sort-th").on("click", function(e){
            var order = "DESC";
            if($(this).hasClass("sort-desc")){
                $(this).removeClass("sort-desc")
                    .addClass("sort-asc");
                var order = "ASC";
            }
            else if($(this).hasClass("sort-asc")){
                $(this).removeClass("sort-asc")
                    .addClass("sort-desc");
                var order = "DESC";
            }
            else {
                $(this).addClass("sort-desc");
            }
            var type = $(".the-table-results").attr("data-type");
            $("." + type + "-table th").removeClass("sorted-by-me");
            $(this).addClass("sorted-by-me");
            reloadTable();
        });
        $(".a-page").on("click", function(e){
            if(!$(this).hasClass("the-selected-page")){
                $(".the-selected-page").removeClass("the-selected-page");
                $(this).addClass("the-selected-page");
                reloadTable();
            }
        });
        $("#launch-search").click( function(e){
            reloadTable();
        });
        var theNot = ":first-of-type, .ai-benchmarks_role_id-count, .ai-meta_role_id-count, .ai-trash-upload";
        $(".the-table-results tbody tr td:not(" + theNot + ")" ).off('click').click( function (e) {
            anticipating(".the-table-results");
            var origin = $(".the-table-results").last();
            var dataType = origin.attr("data-type");
            var uid = $(this).parent().attr("data-file-uid");
            var landing = "edit-db";
            if(origin.hasClass("compare-internal-table")){
                anticipating("#the-results-table");
                var title = $(this).parent().children("td:eq(1)").text();
                var table = "wp_ai_career_path";
                var getUID = $(this).parent().children("td:eq(0)");
                var roleUID = $(".checkbox-me", getUID).attr("data-uid");
                var pageLimit = 25;
                var type = "career";
                var landing = "benchmark";
                var data = {
                    table: table,
                    limit: pageLimit,
                    type: type,
                    orderBy: "date_uploaded",
                    order:"DESC",
                    id: "from-roles",
                    roleUID: roleUID,
                    title: title
                };
                data = tableMe(data);
                var theOptions = {
                    data: data,
                    landing: landing
                };
                anAJAX(theOptions);
            }
            else if(origin.hasClass( "cp-role-table" )){
                var roleID = $(this).parent().attr("data-file-uid");
                var cpUID = $(".flex-align-me").attr("data-cp-id");
                var cpOrder = $("#ai-cp-order").val();
                var where = {"career_path_id" : cpUID, "path_order" : cpOrder, "role_id": roleID, "pivot": false};
                var data = {
                    command : "insert",
                    table: "wp_ai_career_path_meta",
                    where: where,
                    cpUID: cpUID
                };
                var theOptions = {
                    data: data,
                    landing: "congrats"
                };
                anAJAX(theOptions);
                clearLB();
                unanticipating(".wrap-career-path");
            }
            else if(dataType == "career"){
                if(origin.hasClass("from-roles-career-table")){
                    addToCareerPaths($(this));
                }
                else {
                    var fileUID = $(this).parent().attr("data-file-uid");
                    var queryString = "?aipage=career&path=" +fileUID;
                    window.location.href = '/reporting/' + queryString;
                }
            }
            else if($(".the-table-results").last().hasClass("benchmark-" + dataType + "-table")){
                var uid = $(this).parent().attr("data-file-uid");
                if(dataType == "role"){
                    var fileName = $(this).parent().children("td:eq(1)").text();
                    var jobID = $(this).parent().children("td:eq(2)").text();
                    $("#the-" + dataType + "-id").val(uid);
                    $(".ai-" + dataType + "-display-me").html("<div class='a-" + dataType + "-item'>" + fileName + " (" + jobID+")</div>");
                    clearLB();
                }
                else {
                    var fileName = $(this).parent().children("td:eq(1)").text();
                    uid = '["' + uid + '"]';
                    var theUidInput = inputMe({n:"the-survey-uid", v:uid, h:true});
                    $(".ai-wrap-the-buttons").append(theUidInput);
                    $(".ai-survey-display-me").html("<div class='a-survey-item'>" + fileName + "</div>");
                    clearLB();
                }
            }
            else if($(".the-table-results").last().hasClass("survey-table")){
                var uid = $(this).parent().attr("data-file-uid");
                console.log(uid);
                var theType = $(".the-table-results").last().attr("data-type");
                var command = "get";
                var where = "uid";
                var is = uid;
                var data = {
                    action: "getReceive",
                    type: theType,
                    clean: "clean",
                    where: where,
                    is: is
                };
                var theOptions = {
                    data: data,
                    dataType: "JSON",
                    landing: "fill from db"
                };
                anAJAX(theOptions);
            }
            else if(dataType == "role"){
                editRole(uid, dataType);
            }
            else if(dataType == "benchmarks"){
                anticipating("#the-results-table");
                var uid = $(this).parent().attr("data-file-uid");
                console.log(uid);
                var table = "wp_ai_benchmarks";
                var type = "benchmark";
                var landing = "edit-db";
                var data = {
                    table: table,
                    type: type,
                    where: "uid",
                    is: uid,
                    clean:"clean",
                    orderBy: "title"
                };
                //data = tableMe(data);
                var theOptions = {
                    data: data,
                    landing: landing
                };
                anAJAX(theOptions);
            }
            else if(dataType == "career-paths"){
                var queryString = "?aipage=career&path=" + uid;
                window.location.href = '/reporting/' + queryString;
            }
        });
        $(".ai-row-checkbox, .checkbox-me").on("change", function (e) {
            showHideCheckbox($(this));
        });
        $("#ai-delete-selected").on("click", function(e){
            var type = $(".the-table-results").last().attr("data-type");
            if (confirm('Are you sure you want to delete these ' + type + 's?')) {
                anticipating();
                var deleteArray = [];
                $(".ai-row-checkbox").each(function( index ) {
                    if(this.checked) {
                        var theUID = $(this).attr("data-edit-uid");
                        deleteArray.push(theUID);
                    }
                });
                var table = "wp_ai_roles";
                if(type == "survey"){
                    table = "wp_ai_uploads";
                }
                else if(type == "benchmarks"){
                    table = "wp_ai_benchmarks";
                }
                var data = {
                    table: table,
                    where: deleteArray,
                    command: "delete",
                    type: type
                };
                var theOptions = {
                    data: data,
                    landing: "refresh"
                };
                //console.log(theOptions);
                anAJAX(theOptions);
            }

        });
        $(".ai-benchmarks_role_id-count").on("click", function(e){
            var roleID = $(this).attr("data-benchmarks_role_id-count");
            var queryString = "?aipage=upload-roles&view=benchmarks&uid=" + roleID;
            window.location.href = '/reporting/' + queryString;
        });
        $(".ai-meta_role_id-count, #ai-view-career-paths").click(function(e){
            var roleID = $(this).attr("data-meta_role_id-count");
            var queryString = "?aipage=upload-roles&view=careerpaths&uid=" + roleID;
            window.location.href = '/reporting/' + queryString;
        });
        $("#ai-select-all-rows").change(function(e){
            if($(this).hasClass("toggled")){
                $(".the-table-results td input[type=checkbox]").prop('checked', false);
                $(this).removeClass("toggled");
                showHideCheckbox($(this));
            }
            else {
                $(".the-table-results td input[type=checkbox]").prop('checked', true);
                $(this).addClass("toggled");
                showHideCheckbox($(this));
            }

        });

        //Upload
        $('#ai-add-manually, #ai-update-role').click(function () {
            var title = $("#the-role-title").val();
            var jobCode = $("#the-job-code").val();
            var theDescription = $("#the-role-description").val();
            var theCSV = 'Code,Job Title,Description*newline* ' + jobCode +',"' + title + '","' + theDescription + '"';
            var uid = $("#the-uid").val();
            var data = {
                action: "saveRole",
                theCSV : theCSV,
                is: uid
            }
            var theOptions = {
                data: data,
                landing: "refresh"
            };
            clearLB();
            anticipating();
            anAJAX(theOptions);
        });
        $("#select-columns").on("click", function(e){
            var goThrough = ["upload-title", "sort-job-code", "sort-job-title","sort-job-description"];
            var pauseMe = false;
            $.each(goThrough, function(index, value) {
                var theElement = $("#" + value).val();
                if(theElement == "" || !theElement){
                    $("#explain-" + value).html("This cannot be left blank").show();
                    //pauseMe = true;
                }
            });
            if(!pauseMe){
                anticipating();
                selectColumns();
            }
        });
        $(".three-me select").change( function( e ){
            var selectedArray = [];
            $(".three-me option").each(function( index ) {
                $(this).prop("disabled", false);
                if($(this).is(':selected') && $(this).val()){
                    selectedArray.push($( this ).val());
                }
            });
            $(".three-me select").each(function( index ) {
                $("option", this).each(function(index){
                    if($.inArray( $(this).val(), selectedArray ) != -1){
                        $(this).prop("disabled", true);
                    }
                });
            });
        });
        $("#ai-lb-goodbye, .ai-lightbox-back").click(function (e){
            clearLB();
        });

        //Role actions
        $("#ai-compare-survey").on("click", function(e){
            var uid = $("#the-uid").val();
            var title = encodeURI($("#the-role-title").val());
            var queryString = "?aipage=benchmark&roleTitle=" + title + "&role=" + uid;
            window.location.href = '/reporting/' + queryString;
        });
        $("#ai-run-internal").on("click", function(e){
            var uploadURL = ai_script.upload_url;
            var upUrl = uploadURL + "/run-against-db.php";
            var uid = $('#the-uid').val();
            var title = $("#the-role-title").val();
            var jobID = $("#the-job-code").val();
            var description = $("#the-role-description").val();
            var full = {"title" : title, "description" : description, "jobID": jobID};
            clearLB();
            anticipating("#the-results-table");
            $.post( upUrl, { uid: uid}).done(function( result ) {
                internalRoles(full, result);
                initiateMe();
                unanticipating("#the-results-table");
            });
        });
        $("#add-new-path").click(function (e){
            anticipating(".wrap-career-path");
            var cpID = $(this).attr("data-c-id");
            var cpOrder = $(this).attr("data-c-order");
            var pageLimit = 25;
            var type = "role";
            var landing = "benchmark";
            var data = {
                limit: pageLimit,
                type: type,
                orderBy: "date_uploaded",
                order:"DESC",
                id: "cp",
                table: "wp_ai_roles",
                cpID: cpID,
                cpOrder:cpOrder,
                hide_style: true,
            };
            data = tableMe(data);
            var theOptions = {
                data: data,
                landing: landing
            };
            anAJAX(theOptions);
        });
        $("#ai-view-benchmarks").click( function ( e){
            var roleID = $("#the-uid").val();
            var queryString = "?aipage=upload-roles&view=benchmarks&uid=" + roleID;
            window.location.href = '/reporting/' + queryString;
        });

        //Internal Roles Actions
        $("#ai-add-selected, #ai-benchmark-survey").off('click').click( function (e){
            anticipating("#the-results-table");
            if($(".the-table-results").hasClass( "benchmark-survey-table" )){
                var surveyUID = [];
                $(".ai-row-checkbox").each(function( index ) {
                    if(this.checked) {
                        var getUID = $(this).attr("data-edit-uid");
                        surveyUID.push(getUID);
                    }
                });
                surveyUID = JSON.stringify(surveyUID);
                var fileName = "multiple";
                var theUidInput = inputMe({n:"the-survey-uid", v:surveyUID, h:true});
                $(".ai-wrap-the-buttons").append(theUidInput);
                $(".ai-survey-display-me").html("<div class='a-survey-item'>" + fileName + "</div>");
                clearLB();
            }
            else {
                var roleUID = [];
                var title = [];
                $(".checkbox-me").each(function( index ) {
                    if(this.checked) {
                        var getUID = $(this).attr("data-uid");
                        var getTitle = $(this).parent().parent().children("td:eq(1)").text();
                        roleUID.push(getUID);
                        title.push(getTitle);
                    }
                });
                var table = "wp_ai_career_path";
                var pageLimit = 25;
                var type = "career";
                var landing = "benchmark";
                var data = {
                    table: table,
                    limit: pageLimit,
                    type: type,
                    orderBy: "date_uploaded",
                    order:"DESC",
                    action: "getReceive",
                    id: "from-roles",
                    roleUID: roleUID,
                    title:title
                };
                data = tableMe(data);
                var theOptions = {
                    data: data,
                    landing: landing
                };
                anAJAX(theOptions);
            }
        });

        //Survey Actions
        $('#upload-the-csv').off('click').click(function () {
            var theType = $(this).attr("data-upload-type");
            var formData = new FormData($('#form-the-upload')[0]);
            var theOptions = {
                url: ai_script.upload_url + "/clean-csv-progress.php",
                data: formData,
                listType: theType,
                landing: "csv-upload",
                theAdmin: "false"
            };
            if(theType == "role"){
                var theFile = $("#the-upload-form").val();
            }
            else {
                var theFile = $("#the-csv-upload").val();
            }

            var fileExtension = ['csv'];
            if ($.inArray(theFile.split('.').pop().toLowerCase(), fileExtension) == -1) {
                alert("Only formats are allowed : "+fileExtension.join(', '));
                //initiateMe();
            }
            else {
                anAJAX(theOptions);
            }
            console.log($("#the-upload-form").val());

        });
        $(".ai-edit-upload").on("click", function(e){
            var uid = $(this).attr("data-parent");
            var theType = $(".the-table-results").last().attr("data-type");
            var command = "get";
            var where = "uid";
            var is = uid;
            var data = {
                action: "getReceive",
                type: theType,
                clean: "clean",
                where: where,
                is: is
            };
            var theOptions = {
                data: data,
                dataType: "JSON",
                landing: "fill from db"
            };
            anAJAX(theOptions);
        });
        $("#update_upload").on("click", function(e){
            var title = $("#the-survey-title").val();
            var description = $("#the-survey-description").val();
            var where = {"title" : title, "description" : description};
            var uid = $("#the-uid").val();
            var data = {
                command : "update",
                table: "wp_ai_uploads",
                where: where,
                is: uid
            };
            var theOptions = {
                data: data,
                landing: "refresh"
            };
            anAJAX(theOptions);
        });
        $(".ai-trash-upload").on("click", function(e){
            var uid = $(this).attr("data-parent");
            var where = "uid";
            var is = uid;
            var deleteFile = $(".ai-upload-" + uid).attr("data-file-name");
            if (confirm('Are you sure you want to delete this upload?')) {
                var data = {
                    command : "delete",
                    table: "wp_ai_uploads",
                    where: where,
                    is: is,
                    type: "survey",
                    deleteFile: deleteFile
                };
                var theOptions = {
                    data: data,
                    landing: "refresh"
                };
                anAJAX(theOptions);
            }
        });

        //Benchmark Actions
        $("#benchbark-results-table tbody tr td:not(:first-of-type)").off('click').on("click", function(e){
            anticipating("#benchbark-results-table");
            var title = $(this).parent().children("td:eq(1)").text();
            var jobCode = $(this).parent().children("td:eq(2)").text();
            var description = $(this).parent().children("td:eq(3)").text();
            var surveyID = $(this).parent().find(".checkbox-me").attr("data-survey-id");
            var topSection = "<h3>" + title + "</h3>";
            var leftSection = "<div class='ai-bm-desc'>" + description + "</div>" + textAreaMe({n:"ai-bm-notes", l:"Notes"});
            var hiddenIsh = inputMe({n:"survey-id", v:surveyID, h:true}) + inputMe({n:"job-id", v:jobCode, h:true});
            console.log(surveyID);
            var options = {
                topSection: topSection,
                leftSide: leftSection,
                sendID: "ai-add-bm",
                sendText: "Add to Benchmark",
                hiddenIsh: hiddenIsh
            };
            unanticipating("#benchbark-results-table");
            populatePopup(options);
        });
        $("#ai-add-bm").off('click').on("click", function(e){
            var title = $(".ai-top-section").text();
            var description = $(".ai-bm-desc").text();
            var jobID = $("#job-id").val();
            var notes = $("#ai-bm-notes").val();
            var surveyUID = $("#survey-id").val();
            var roleUID = $("#the-role-id").val();
            var where = {
                "title" : title,
                "description" : description,
                "job_id": jobID,
                "notes": notes,
                "survey_id": surveyUID,
                "role_id": roleUID
            };
            var data = {
                command : "insert",
                table: "wp_ai_benchmarks",
                where: where
            };
            var theOptions = {
                data: data,
                landing: "congrats"
            };
            anAJAX(theOptions);
        });
        $("#ai-add-selected-benchmark").off('click').on("click", function(e){
            $("#benchbark-results-table").removeAttr("data-duplicates");
            $("#benchbark-results-table").removeAttr("data-entries");
            anticipating("#benchbark-results-table");
            var bmUID = [];
            var title = [];
            var howMany = $(".checkbox-me:checked").length;
            var iter = 1;
            $(".checkbox-me:checked").each(function( index ) {
                var title = $(this).parent().parent().children("td:eq(1)").text();
                var jobID = $(this).parent().parent().children("td:eq(2)").text();
                var description = $(this).parent().parent().children("td:eq(3)").text();
                var surveyUID = $(this).parent().find(".checkbox-me").attr("data-survey-id");
                var roleUID = $("#the-role-id").val();
                var where = {
                    "title" : title,
                    "description" : description,
                    "job_id": jobID,
                    "survey_id": surveyUID,
                    "role_id": roleUID
                };
                var data = {
                    command : "insert",
                    table: "wp_ai_benchmarks",
                    where: where
                };
                var theOptions = {
                    data: data,
                    landing: "congrats",
                    multiple:true
                };
                if(iter == howMany){
                    theOptions["end"] = true;
                }
                console.log(theOptions);
                iter++;
                anAJAX(theOptions);
            });
        });

        //Career Path Actions
        $("#ai-add-new-career-path").off('click').click(function (e) {
            var title = $("#the-career-title").val();
            var theDescription = $("#the-career-description").val();
            var where = {
                "title" : title,
                "description" : theDescription,
            };
            var data = {
                command : "insert",
                table: "wp_ai_career_path",
                where : where
            }
            var theOptions = {
                data: data,
                landing: "congrats",
            };
            console.log(theOptions);
            anAJAX(theOptions);
        });
        $("#ai-select-cp").click(function (e) {
            anticipating(".wrap-left-right");
            var table = "wp_ai_career_path";
            var pageLimit = 25;
            var type = "career";
            var landing = "benchmark";
            var data = {
                table: table,
                limit: pageLimit,
                type: type,
                orderBy: "date_uploaded",
                order:"DESC",
                id: "select-career"
            };
            data = tableMe(data);
            var theOptions = {
                data: data,
                landing: landing
            };
            anAJAX(theOptions);
        });
        $("#ai-create-career, #ai-create-career-lb").off("click").on("click", function(e){
            var topSection = "<h3>Add a new career path</h3>";
            var leftSide = inputMe({n:"the-career-title", l:"Career Path Title", p:"Career Path Title"}) + textAreaMe({n:"the-career-description", l:"Career Path Description", p:"Career Path Description"});
            var options = {
                topSection: topSection,
                leftSide: leftSide,
                sendID: "ai-add-new-career-path",
                sendText: "Add Career Path"
            };
            populatePopup(options);
        });
        $("#ai-add-career-path").off('click').click(function (e) {
            var title = $("#the-role-title").val();;
            var table = "wp_ai_career_path";
            var roleUID = $("#the-uid").val();
            var pageLimit = 25;
            var type = "career";
            var landing = "benchmark";
            var data = {
                table: table,
                limit: pageLimit,
                type: type,
                orderBy: "date_uploaded",
                order:"DESC",
                action: "getReceive",
                id: "from-roles",
                roleUID: roleUID,
                title: title
            };
            data = tableMe(data);
            var theOptions = {
                data: data,
                landing: landing
            };
            anAJAX(theOptions);
        });

        $("#ai-refresh-me").click(function(e){
            reloadTable();
            clearLB();
        });
        $("#ai-close-me").click(function (e) {
            clearLB();
        });
        $("#change-view").off("change").change(function (e) {
            if(this.value == "wide"){
                var theWidth = 0;
                var startingOrder = 1;
                $( ".a-career-item-row" ).each(function( index ) {
                    theWidth = $(this).width() + theWidth;
                    $(".a-pivot-item-row").eq(index).css({"width": $(this).width(), "order": index});
                    startingOrder++;
                });
                $( ".a-career-item-row" ).each(function( index ) {
                    $(this).css({"order": startingOrder});
                    startingOrder++;
                });
                $(".wrap-career-path, .a-career-path-row").css("width", theWidth);
                $("#the-career-path").addClass("overflow-me");
            }
            else if(this.value == "standard"){
                $(".wrap-career-path, .a-career-path-row").css("width", "");
                var oddOrder = 1;
                var evenOrder = 2;
                $( ".a-pivot-item-row" ).each(function( index ) {
                    $(this).css({"width": "", "order": oddOrder});
                    oddOrder = oddOrder + 2;
                });
                $( ".a-career-item-row" ).each(function( index ) {
                    $(this).css({"order": evenOrder});
                    evenOrder = evenOrder + 2;
                });
                $("#the-career-path").addClass("overflow-me");
            }
            initiateMe();
        });

        $( ".a-career-item-row, .a-pivot-item" ).sortable({
            revert: '100'
        });
        $( ".a-career-path-row" ).on( "sortstop", function( event, ui ){
            $(".a-career-path-item").removeClass("hovering");
            $(".a-career-path-item:not(.add-new-path)").each(function( index ) {
                var pivot = false;
                var order = index;
                if($(this).parent().hasClass("a-pivot-item")){
                    order = $(this).parent().attr("data-path-order");
                    pivot = true;
                }
                var uid = $(this).attr("data-uid");
                console.log(order);
                sortCP(uid, order, pivot);
            });
        });

        //reporting actions
        $(".ai-wrap-the-buttons select").change(function(e){
            var directory = $(this).find(':selected').attr('data-directory');
            if(directory !== "null"){

            }
            else {
                console.log("else");
                if($("#select-sub-type").length == 0){
                    $("#the-selects").append("<label for='select-sub-type'>Select what kind of report you would like to run</label><select id='select-sub-type' name='select-sub-type'></select>");
                }
                var value = this.value;
                var getReportTypes = {
                    table: "wp_ai_reports",
                    where: "parent",
                    is:value,
                    clean:"clean",
                    type: "get reports",
                    orderBy: "title",
                    landingID: "#select-sub-type"
                };
                var getReportTypesOptions = {
                    data: getReportTypes,
                    landing: "select me"
                };
                anAJAX(getReportTypesOptions);
            }
        });
        $("#ai-find-my-matches").click(function(e){
            var theSelect = $("#select-sub-type").find(':selected');
            var theDirectory = JSON.parse(theSelect.attr("data-directory"));
            var type = theDirectory.type;
            var table = theDirectory.table;
            var landing = theDirectory.landing;
            var data = {
                type: type,
                limit: 25,
                offset: 0,
                order: "DESC",
                orderBy: "title",
                table: table,
                command: "dynamic"
            };
            data = tableMe(data);
            var theOptions = {
                data: data,
                landing: "#" + landing
            };
            $(".column-me").html("<div id='" + landing + "'></div>");
            anticipating("#" + landing);
            anAJAX(theOptions);

        });

        $( ".career-path-item, .landing-area" ).sortable({
            revert: '100',
            tolerance: 'pointer',
            connectWith: ".landing-area, .career-path-item",
            over: function( event, ui ) {
                var theCP = $(".a-career-path", this);
                theCP.css({"width":"16.2em", "height": "auto"});
                if($(this).hasClass("landing-area")){
                    $(this).css("background-color", "#edf0f4");
                }
            },
            start: function (e,ui){
                $(".landing-area").fadeTo( "fast" , 1, function() {});
                $(this).css("opacity", 0.5);
            },
            stop: function ( event, ui ) {
                $(this).css("opacity", 1);
            },
            update: function(event, ui){
                if(ui.sender){
                    var theChild = $(".a-career-path", this);
                    var dataID = theChild.attr("data-cp");
                    $(this).addClass("career-path-item").removeClass("landing-area");
                    //$(".landing-area").fadeTo( "fast" , 0, function() {});
                    //$(ui.sender).remove();
                    console.log(theChild.attr("data-cp"));
                }
            },
        });
        $( ".landing-area, .career-path-item" ).on( "sortstop", function( event, ui ){
            var theData = $(ui.item[0]).attr("data-cp");
            //$(".cp-" + theData).remove();
            console.log(ui);
            console.log($(this));
            $(".career-path-item").removeClass("hovering");
            $(".career-path-item:not(.add-new-path)").each(function( index ) {
                var pivot = false;
                var order = index;
                if($(this).parent().hasClass("a-pivot-item")){
                    order = $(this).parent().attr("data-path-order");
                    pivot = true;
                }
                var uid = $(this).attr("data-uid");
                //sortCP(uid, order, pivot);
            });
        });

        $( ".a-career-path-item" ).draggable (
            {
                connectToSortable:".a-career-item-row, .a-pivot-item",
                revertDuration: 100,
                start: function (e,ui){
                    $(".a-pivot-item").addClass( "hovering" );
                },
                stop: function ( event, ui ) {
                    $(".a-pivot-item").removeClass("hovering");
                }
            }
        );
        $( ".a-career-item-row, .a-pivot-item" ).sortable({
            revert: '100'
        });
        $( ".a-career-path-row" ).on( "sortstop", function( event, ui ){
            $(".a-career-path-item").removeClass("hovering");
            $(".a-career-path-item:not(.add-new-path)").each(function( index ) {
                var pivot = false;
                var order = index;
                if($(this).parent().hasClass("a-pivot-item")){
                    order = $(this).parent().attr("data-path-order");
                    pivot = true;
                }
                var uid = $(this).attr("data-uid");
                console.log(order);
                sortCP(uid, order, pivot);
            });
        });
    }
    $("#ai-upload-role").click( function (e){
        var topSection = "<h3>Add a new role</h3>";
        var leftSide = "<h3>Manually add your role here</h3>" + inputMe({n:"the-role-title", l:"Role Title", p:"Role Title"}) + inputMe({n:"the-job-code", l:"Job Code", p:"Job Code"}) + textAreaMe({n:"the-role-description", l:"Role Description", p:"Role Description"});
        var rightSide = uploadMe({n:"the-upload-form", t:"role", u:"upload-the-csv", l:"Or upload a CSV of your role", p:"Upload"});
        var options = {
            topSection: topSection,
            leftSide: leftSide,
            rightSide: rightSide,
            sendID: "ai-add-manually",
            sendText: "Add Role",
            bottomSection: "send left",
        };
        populatePopup(options);
    });
    $("#ai-upload-survey").click(function(e){
        var topSection = "<h3>Upload your job surveys here</h3>";
        var leftSide = uploadMe({n:"the-csv-upload", t:"survey", u:"upload-the-csv", p:"Upload"});
        var options = {
            topSection: topSection,
            leftSide: leftSide,
            bottomSection: "nothing"
        };
        unanticipating("#the-results-table");
        populatePopup(options);
    });
    $(".ai-benchmark-buttons").on("click", function(e){
        var roleSurvey = $(this).attr("data-rs");
        var pageLimit = 25;
        var pageNum = 1;
        var offset = (pageNum * pageLimit) - pageLimit;
        if(!offset){
            offset = 0;
        }
        var orderBy = "date_uploaded";
        var order = "DESC";
        var landing = "benchmark";
        var options = {};
        options["limit"] = pageLimit;
        options["offset"] = offset;
        options["order"] = order;
        options["orderBy"] = orderBy;
        options["type"] = roleSurvey;
        options["id"] = "benchmark";
        options = tableMe(options);
        var theOptions = {
            data: options,
            landing: landing
        };
        anAJAX(theOptions);
    });
    $("#ai-run-matches").on("click", function(e){
        console.log("oh hey");
        var roleVal = $('#the-role-id').val();
        var surveyVal = $('#the-survey-uid').val();
        if(roleVal && surveyVal){
            anticipating("#benchbark-results-table");
            var data = {
                action: "runMatch",
                role : roleVal,
                survey: surveyVal,
            }
            var theOptions = {
                data: data,
                landing: "#benchbark-results-table"
            };
            clearLB();
            anticipating();
            anAJAX(theOptions);
        }
        else {
            if(!roleVal){
                $("#ai-role-explain").show().html("Please choose a role");
            }
            if(!surveyVal){
                $("#ai-survey-explain").show().html("Please choose a survey");
            }
        }
    });

    initiateMe();
    reloadTable();
});
