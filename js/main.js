var browserSupportFlag;
var mobilelatitude;
var mobilelongitude;

$(document).ready(function () {
    EasyjQuery_Get_IP("get_lat_long","full");
    $("#thanks").hide();
    $('#info').mouseenter(function () {
        $('#info').animate({left: '-150px'});
        $('#info').clearQueue();
    });

    if(navigator.geolocation) {
        browserSupportFlag = true;

        navigator.geolocation.getCurrentPosition( function (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
        });
    }

    $('#info').mouseleave(function () {
        if ($('#message').val() === "") {
            $('#info').animate({left: '-410px'}, function () {
                $('#info').clearQueue();
                $('#thanks').hide();
                $('#message').show();
            });
            $('input').blur();
        }
    });

    $('#message').keypress(function (e) {
        if (e.keyCode == 13) {
            var message = $('#message').val();
            var ip = $('#ip').val();
            var time = new Date().toString();
            $.ajax({
              type: "POST",
              url: "/mail.php",
              data: {"message": message,
                     "ip": ip,
                     "time": time}
            });
            $('#message').hide();
            $('#thanks').show();
            $('#message').attr('value', "");
            $('input').blur();
        }
    });
});



function get_lat_long(json) {
    var latitude = json.cityLatitude;
    var longitude = json.cityLongitude;
    if (browserSupportFlag) {
        longitude = mobilelongitude;
        latitude = mobilelatitude;
    }
    var ip = json.IP;
    $('#ip').attr('value', ip);
    return update(latitude, longitude);
}


function calc_time(today, lt, lg) {
    var year = today.getYear();
    var month = today.getMonth();
    var date = today.getDate();
    var sunrise_sunset = new SunriseSunset(year, month, date, lt, lg);
    var gmt_offset = today.getTimezoneOffset() / 60;
    var sunset_time = sunrise_sunset.sunsetLocalHours(-gmt_offset);
    return sunset_time;
}

function update(lt, lg) {
    var today = new Date();
    sunset_time = calc_time(today, lt, lg);
    var gmt_offset = today.getTimezoneOffset() / 60;
    var cur_time = today.getUTCHours() - gmt_offset + ((today.getUTCSeconds() / 60) + today.getUTCMinutes()) / 60;
    if (cur_time < 0) {
        cur_time += 24;
    }
    var time_til_sunset = sunset_time - cur_time;
    if (time_til_sunset < 0) { //make sure that the time is always positive
        tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        sunset_time = calc_time(tomorrow, lt, lg);
        time_til_sunset = sunset_time + 24 - cur_time;
    }
    var minutes = Math.abs(time_til_sunset * 60);
    var seconds = Math.floor((minutes % 1) * 60)
    var hours = Math.floor(minutes / 60);
    var minutes = Math.floor(minutes % 60);

    var time_string = "";
    minutes = minutes.toString();
    seconds = seconds.toString();
    if (minutes.length < 2) {
        minutes = '0' + minutes
    }
    if (seconds.length < 2) {
        seconds = '0' + seconds
    }
    time_string += hours + " : " + minutes + " : " + seconds;
    $('#time').text(time_string)
    setTimeout("update(" + lt + "," + lg+ ")", 1000);
}
