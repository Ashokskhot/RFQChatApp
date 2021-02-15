
jQuery(document).ready(function($) {
    let profileImageUrl = 'https://microntec.in/admin/images/user-image/';
    let defaultHazardImageUrl = 'https://microntec.in/admin/hazard-icon/';
    "use strict";
    var socket;
    var connectChatServer = function(id) {
        socket = io('https://skillful-noble-concavenator.glitch.me/');
        var obj = {
            name: "Admin",
            room: id,
        }
        socket.emit('add-user', obj);
    };

    var getDiffTime = function(date) {
        const now = new Date();
        const postDate = new Date(date);
        // @ts-ignore
        const diffMs = (now - postDate); // milliseconds
        // const diffMonths = Math.floor(diffMs / 2592000000); // days
        const diffYears = Math.floor(diffMs / (86400000 * 365)); // days
        const diffMonths = Math.floor(diffMs / (86400000 * 30)); // days
        const diffDays = Math.floor(diffMs / 86400000); // days
        const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        if (diffYears > 0 ) {
            return diffYears + ((diffYears > 1) ? ' years' : ' year') + ' ago';
        } else if (diffMonths > 0 ) {
            return diffMonths + ((diffMonths > 1) ? ' months' : ' month') + ' ago';
        } else if (diffDays > 0 ) {
            return diffDays + ((diffDays > 1) ? ' days' : ' day') + ' ago';
        } else if (diffHrs > 0) {
            return diffHrs + ((diffHrs > 1) ? ' hours' : ' hour') + ' ago';
        } else if (diffMins > 0) {
            return diffMins + ((diffMins > 1) ? ' mins' : ' min') + ' ago';
        } else {
            return 'now';
        }
    }

    $('#posts_table').DataTable( {

        // "order": [[ 0, "desc" ]],

        dom: 'fBlrtip',
        lengthMenu: [
            [ 10, 25, 50, -1 ],
            [ '10', '25', '50', 'All' ]
        ],
        language: {
            search: "_INPUT_",
            searchPlaceholder: "Search Here..."
        },
        buttons: [
            {
                extend:    'csvHtml5',
                text:      '<i class="fa fa-download" aria-hidden="true"> CSV</i>',
                titleAttr: 'CSV',
                exportOptions: {
                    columns: ":not(.noExport)"
                }
            },
        ],
    } );

    var table = $('#posts_table').DataTable();

    $("#nav-profile-tab").click(function() {
        $.fn.dataTable.ext.search.pop();
        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                return $(table.row(dataIndex).node()).attr('data-user') == "Active";
            }
        );
        table.draw();
    });

    $("#nav-contact-tab").click(function() {
        $.fn.dataTable.ext.search.pop();
        $.fn.dataTable.ext.search.push(
            function(settings, data, dataIndex) {
                return $(table.row(dataIndex).node()).attr('data-user') == "Blocked";
            }
        );
        table.draw();
    });

    $("#nav-home-tab").click(function() {
        $.fn.dataTable.ext.search.pop();
        table.draw();
    });

    $(document).on('click', '.fa-eye', function(){
        // alert("Hi");
        var post_id = $(this).attr("data-hazard_id");
        var hazard_type = $(this).attr("data-hazard_type");
        var hazard_icon = $(this).attr("data-hazard_icon");
        var user_image = $(this).attr("data-user_image");
        var hazard_name = $(this).attr("data-hazard_name");
        var hazard_color = $(this).attr("data-hazard_color");
        var hazard_title = $(this).attr("data-hazard_title");
        var intensity_level = $(this).attr("data-intensity_level");
        var hazard_location = $(this).attr("data-hazard_location");
        var created_on = $(this).attr("data-created_on");
        var updated_on = $(this).attr("data-updated_on");
        var first_name = $(this).attr("data-first_name");
        var last_name = $(this).attr("data-last_name");
        var hazard_status = $(this).attr("data-hazard_status");
        var hazard_views = $(this).attr("data-hazard_views");
        var hazard_description = $(this).attr("data-hazard_description");
        var fullname = first_name + ' ' + last_name;

        $(".post-icon").attr("src", hazard_icon);

        $('#post_id').val(post_id);
        $('#hazard_type').val(hazard_type);
        $('#hazard_icon').val(hazard_icon);
        $('#user_image').val(user_image);
        $('#hazard_name').val(hazard_name);
        $('#hazard_color').val(hazard_color);
        $('#hazard_title').val(hazard_title);
        $('#intensity_level').val(intensity_level);
        $('#hazard_location').val(hazard_location);
        $('#created_on').val(created_on);
        $('#updated_on').val(updated_on);
        $('#fullname').val(fullname);
        $('#hazard_status').val(hazard_status);
        $('#hazard_views').html('<img src="images/png-icons/eye.png" class="text-secondary" style="height:20px; width:20px; margin:0;"> ' + hazard_views);
        $('#hazard_description').val(hazard_description);

        $( ".post_id" ).html(post_id);
        $( ".hazard_type" ).html(hazard_type);
        $( ".hazard_icon" ).html(hazard_icon);
        $(".user_image").attr('src',user_image);
        $( ".hazard_name" ).html(hazard_name);
        $(".hazard_color").attr("style", hazard_color);
        $( ".hazard_title" ).html(hazard_title);
        $( ".intensity_level" ).html(intensity_level);
        $( ".hazard_location" ).html(hazard_location);
        $( ".created_on" ).html(created_on);
        $( ".updated_on" ).html(updated_on);
        $( ".fullname" ).html(fullname);
        $( ".hazard_status" ).html(hazard_status);

        $('.hazard_description').html(hazard_description);
        // alert(hazard_views);
        $.ajax({
            url:'backend/post-image.php',
            type:'post',
            data:{'post_id':post_id},
            dataType: 'json',
            success:function(data){
                console.log(data);
                $(".post_img").html("");
                if((Object.keys(data).length)==0){
                    $(".post_img").append('<div><p class="text-center font-weight-bold text-danger m-4"> No images </p></div>');
                }else{
                    for(var i in data) {
                        $(".post_img").append('<img class="img img-responsive p-img" src="images/post-images/'+data[i].image+'">');
                    }
                }
            },
            error: function(jqXHR, exception) {
                toastr.error(exception);
            }
        });
    });

    // $(".ban_btn").click(function(){
    //     var post_id = $(this).attr("data-hazard_id");
    //     var hazard_name = $(this).attr("data-hazard_name");
    //      $('#post_id').val(post_id);
    //      $('#hazard_name').val(hazard_name);
    //      $( ".post_id" ).html(post_id);
    //     $( ".hazard_name" ).html(hazard_name);
    //     $( ".hazard_color" ).html(hazard_color);

    // });


    $(document).on('click', '#block_user_btn', function(){
        var id = $("#post_id").val();
        $.ajax({
            url:'backend/update-posts.php',
            type:'post',
            data:{'id':id},
            dataType: 'json',
            success:function(response){
                //console.log(response);
                if(response){
                    $('.modal').modal('hide');
                    toastr.success(response.message);
                    setTimeout(function(){
                        location.reload();
                    },1000);
                }
                else
                {
                    toastr.error(response.message);
                }
            },
            error: function(jqXHR, exception) {
                toastr.error(exception);
            }
        });
    });




    $(document).on('click', '.statusban', function(){
        var id = $("#post_id").val();
        $.ajax({
            url:'backend/post-block.php',
            type:'post',
            data:{'id':id},
            dataType: 'json',
            success:function(response){
                //console.log(response);
                if(response){
                    $(".statusban").attr('disabled','disabled');
                    var span = $('#statusid');
                    span.removeAttr('class');
                    span.addClass('badge badge-danger');
                    span.html("blocked");
                    $('.modal').modal('hide');
                    toastr.success(response.message);
                    setTimeout(function(){
                        location.reload();
                    },1000);
                }
                else
                {
                    toastr.error(response.message);
                }
            },
            error: function(jqXHR, exception) {
                toastr.error(exception);
            }
        });
    });


    $(document).on('click', '.switch_1', function(){
        var status = $(this).attr("data-hazard_status");
        var id = $(this).attr("data-hazard_id");
        if(status==="0"){
            $.ajax({
                url:'backend/update-posts.php',
                type:'post',
                data:{'status':status,'id':id},
                dataType: 'json',
                success:function(response){
                    //console.log(response);
                    if(response){
                        $(".statusban").attr('disabled','enabled');
                        var span = $('#statusid');
                        span.removeAttr('class');
                        span.addClass('badge badge-primary');
                        span.html("avtive");
                        toastr.success(response.message);
                        setTimeout(function(){
                            location.reload();
                        },1000);
                    }
                    else
                    {
                        toastr.error(response.message);
                    }
                },
                error: function(jqXHR, exception) {
                    toastr.error(exception);
                }
            });
        }else if(status === '1'){
            $.ajax({
                url:'backend/update-posts.php',
                type:'post',
                data:{'status':status,'id':id},
                dataType: 'json',
                success:function(response){
                    //console.log(response);
                    if(response){
                        $(".statusban").attr('disabled','disabled');
                        var span = $('#statusid');
                        span.removeAttr('class');
                        span.addClass('badge badge-danger');
                        span.html("blocked");
                        toastr.success(response.message);
                        setTimeout(function(){
                            location.reload();
                        },1000);
                    }
                    else
                    {
                        toastr.error(response.message);
                    }
                },
                error: function(jqXHR, exception) {
                    toastr.error(exception);
                }
            });
        }

    });


    var getImageSource = function(profile) {
        if (profile !== null) {
            if (profile.substring(0, 8) === 'https://') {
                return profile;
            } else if (profile === '') {
                return defaultHazardImageUrl;
            } else if (profile.substring(0, 8) !== 'https://') {
                return profileImageUrl + profile;
            }
        } else {
            return defaultHazardImageUrl;
        }
    }


    $(document).on('click', '.get_status', function(){
        var id = $("#post_id").val();
        connectChatServer(id);
        socket.on('connected', function(msg) {
            console.log(msg);
        });
        socket.on('user-connected', function(msg) {
            console.log(msg);
        });
        socket.on('message', function(msg){
            console.log(msg);
            if (msg.user_type == 'User') {
                var profile = getImageSource(msg.profile);
                $(".scroll_down").append('<div class="display_receive_message"><li> <div class="msg-received msg-container"><div class="avatar"><img src="'+ profile +'" alt="" style="height:60px; width:60px;"><div class="send-time">' + getDiffTime(msg.created_on) +'</div></div><div class="msg-box"><div class="inner-box"><div class="name"><b>' + msg.name +'</b><div class="meg">' + msg.comment +'</div></div><div class="react mt-1"></div></div><div class="text-black" style="font-size: 15px;"><a href="#" class="m-2"><!-- <i class="fa fa-thumbs-o-up m-2" style="font-size:20px;"></i> --></a></div></div></li></div>');
                $(".scroll_down").scrollTop($(".scroll_down")[0].scrollHeight);
            }
        });

        $.ajax({
            url:'backend/get-status.php',
            type:'post',
            data:{'id':id},
            dataType: 'json',
            success:function(data){
                //console.log(data);
                /*for(var i in data) {
                console.log(i, data[i]);*/
                var x = data[0];
                /*}*/
                if(x.status == 0){
                    $(".statusban").attr('disabled','disabled');

                }else{
                    $(".statusban").removeAttr('disabled');
                }
                if(x.intensity_level == "must know"){
                    var span = $('#intensitylevel')
                    span.removeAttr('class');
                    span.addClass('badge badge-info bg-white text-info border border-info p-1');
                    span.html("Must know");
                }
                else if(x.intensity_level == "warning"){
                    var span = $('#intensitylevel')
                    span.removeAttr('class');
                    span.addClass('badge bg-white border p-1 badge-warning text-warning border-warning');
                    span.html("Warning");
                }
                else if(x.intensity_level == "Be aware"){
                    var span = $('#intensitylevel')
                    span.removeAttr('class');
                    span.addClass('badge bg-white border p-1 badge-danger text-danger border-danger');
                    span.html("Be aware");
                }
                else{
                    var span = $('#intensitylevel')
                    span.removeAttr('class');
                    span.addClass('badge bg-white border p-1 badge-secondary text-secondary border-secondary');
                    span.html(x.intensity_level);
                }
                if(x.report_status == 1 && x.status == 1){
                    var span = $('#statusid');
                    span.removeAttr('class');
                    span.addClass('badge badge-info');
                    span.html("Active");
                }if(x.report_status == 2 && x.status == 1){
                    var span = $('#statusid');
                    span.removeAttr('class');
                    span.addClass('badge badge-primary');
                    span.html("Sorted");
                }if(x.report_status == 3 && x.status == 1){
                    var span = $('#statusid');
                    span.removeAttr('class');
                    span.addClass('badge badge-secondary');
                    span.html("Abuse");
                }
                if(x.report_status == 4 && x.status == 1){
                    var span = $('#statusid');
                    span.removeAttr('class');
                    span.addClass('badge badge-success');
                    span.html("Closed");
                }
                if(x.report_status == 1 && x.status == 0){
                    var span = $('#statusid');
                    span.removeAttr('class');
                    span.addClass('badge badge-danger');
                    span.html("Blocked");
                }

                if(x.report_status == 2 && x.status == 0){
                    var span = $('#statusid');
                    span.removeAttr('class');
                    span.addClass('badge badge-danger');
                    span.html("Blocked");
                }

                if(x.report_status == 3 && x.status == 0){
                    var span = $('#statusid');
                    span.removeAttr('class');
                    span.addClass('badge badge-danger');
                    span.html("Blocked");
                }
                if(x.report_status == 4 && x.status == 0){
                    var span = $('#statusid');
                    span.removeAttr('class');
                    span.addClass('badge badge-danger');
                    span.html("Blocked");
                }
            }
        });
    });

    $(document).on('click', '.get_status', function(){
        var id = $("#post_id").val();
        var admin_user_id = $(this).attr('data-admin_user_id');
        $.ajax({
            url:'backend/get-likes.php',
            type:'post',
            data:{'id':id},
            dataType: 'json',
            success:function(data){
                console.log(data);
                $(".display_sent_message").html('');
                $(".display_receive_message").html('');
                if(data){
                    $("#count_likes").html('<i class="fa fa-thumbs-o-up text-secondary"></i> ' + data.response[0].likes);
                    $("#count_dislikes").html('<i class="fa fa-thumbs-o-down text-secondary"></i> ' + data.response[0].dislikes);
                    $("#count_comments").html('<i class="fa fa-comment-o text-secondary"></i> ' + data.response[0].comments.length);
                    for(var i in data.response[0].comments) {
                        var image_Name = data.response[0].comments[i].user_image;
                        if(image_Name ===""){
                            var default_image = "images/user-image/avatar.jpg";
                        } else {
                            var subImage = image_Name.substr(0, 8);
                            if(subImage=="https://") {
                                var default_image= image_Name;
                            } else {
                                var default_image= "images/user-image/" + image_Name ;
                            }
                        }

                        var date = getDiffTime(data.response[0].comments[i].created_on);
                        // alert(date);
                        if((data.response[0].comments[i].user_id) != admin_user_id){
                            $(".scroll_down").append('<div class="display_receive_message"><li> <div class="msg-received msg-container"><div class="avatar"><img src="' + default_image +'" alt=""><div class="send-time">' + date +'</div></div><div class="msg-box"><div class="inner-box"><div class="name"><b>' + data.response[0].comments[i].first_name +' ' + data.response[0].comments[i].last_name +'</b><div class="meg">' + data.response[0].comments[i].comment +'</div></div><div class="react mt-1"></div></div><div class="text-black" style="font-size: 15px;"><a href="#" class="m-2"><!-- <i class="fa fa-thumbs-o-up m-2" style="font-size:20px;"></i> --></a></div></div></li></div>');
                        }else{
                            $('.scroll_down').append('<div class="display_sent_message"><li><div class="msg-send msg-container"><div class="msg-box "> <div class="inner-box"> <div class="name"><b>' + data.response[0].comments[i].first_name +' ' + data.response[0].comments[i].last_name +'</b></div> <div class="meg sent_msg">' + data.response[0].comments[i].comment +'</div></div></div><div class="avatar2"><img src="images/admin.png" alt=""><div class="send-time">' + date +'</div></div></div></li></div>');
                        }
                        $(".scroll_down").scrollTop($(".scroll_down")[0].scrollHeight);
                    }
                }
            }
        });
    });


    $(document).on('click', '#send_msg', function(){
        var id = $("#post_id").val();
        var msg = $("#text_msg").val();
        var messageobj = {
            name:'Admin',
            profile:'https://microntec.in/admin/images/admin.png',
            id: 0,
            comment: msg,
            post_id: id,
            user_id: 10002,
            replied_to: 0,
            status: 1,
            user_type: 'Admin',
            created_on: new Date(),
            updated_on: new Date()
        }
        socket.emit('add-message', messageobj);
        var admin_user_id = $('.get_status').attr('data-admin_user_id');

        if (msg != ''){
            $(".scroll_down").append('<div class="display_receive_message"><li><div class="msg-send msg-container"><div class="msg-box "> <div class="inner-box"> <div class="name"><b>You</b></div> <div class="meg sent_msg">' + msg + '</div></div></div><div class="avatar2"><img src="images/admin.png" alt=""><div class="send-time">Now</div></div></div></li></div>');
            // $(".display_sent_message").animate({ scrollTop: $(document).height() }, "slow");
            $(".scroll_down").scrollTop($(".scroll_down")[0].scrollHeight);
        }
        $.ajax({
            url:'backend/insert-comment.php',
            type:'post',
            data:{'id':id, 'user_id':admin_user_id, 'msg':msg, 'created_on':moment().format(), 'updated_on':moment().format()},
            //dataType: 'json',
            success:function(data){
                console.log(data);
                $("#text_msg").val('');
            }
        });
    });


    // $("#block_user_btn").click(function(){
    //     var id = $("#post_id").val();
    //     $.ajax({
    //         url:'backend/update-posts.php',
    //         type:'post',
    //         data:{'id':id},
    //         dataType: 'json',
    //         success:function(response){
    //             //console.log(response);
    //             if(response){
    //                 $('.modal').modal('hide');
    //                 toastr.success(response.message);
    //                 setTimeout(function(){
    //                     location.reload();
    //                 },1000);
    //             }
    //             else
    //             {
    //                 toastr.error(response.message);
    //             }
    //         },
    //         error: function(jqXHR, exception) {
    //             toastr.error(exception);
    //         }
    //     });
    // });
});

