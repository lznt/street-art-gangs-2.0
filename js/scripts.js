/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}


var make_base_auth= function(user, password) {
    var tok = user + ':' + password;
    var hash = Base64.encode(tok);
    return "Basic " + hash;
}


/**
*   getCategory
*   Returns the full name for the selected category
*
**/

var getCategory = function (val) {

    switch (val) {
      case 'Ou':
        return 'Great Outdoors';
        break;
      case 'Ni':
        return 'Nightlife Spots';
        break;
      case 'Ar':
        return 'Arts & Entertainment';
        break;
      case 'Ed':
        return 'Education';
        break;
      case 'Fo':
        return 'Food';
        break;
      case 'Ot':
        return 'Other Places';
        break;
      case 'Sh':
        return 'Shops & Services';
        break;
      case 'Tr':
        return 'Travel & Transport';
        break;
    }
}


/**
*   getCategoryClass
*   Returns the category for the selected category
*
**/
var getCategoryClass = function (val) {

    switch (val) {
      case 'Ou':
        return 'icon-sun';
        break;
      case 'Ni':
        return 'icon-moon';
        break;
      case 'Ar':
        return 'icon-ticket';
        break;
      case 'Ed':
        return 'icon-graduation';
        break;
      case 'Fo':
        return 'icon-food';
        break;
      case 'Ot':
        return 'icon-other-places';
        break;
      case 'Sh':
        return 'icon-cart';
        break;
      case 'Tr':
        return 'icon-rocket';
        break;
    }
}


/**
*
* updateUserPosition
* Shared function to update the position of the user
*
*/

var updateUserPosition = function(latitude, longitude) {

        var authorization=localStorage.authorization;
        var gangster = localStorage.gangster;
        var endpoint = "http://vm0063.virtues.fi/gangsters/"+gangster+"/";
        var now = moment().format();
        var data =  {
                latitude: latitude,
                longitude: longitude,
                last_action: now
            }

        $.ajax({
          type: "PATCH",
          url: endpoint,
          dataType: 'json',
          data: data,
          beforeSend: function (xhr) {
            xhr.setRequestHeader ("Authorization", authorization);
          }
        }).done(function( data ) {


        }).fail(function( jqXHR, textStatus ) {
        //TODO fix this
          alert("Error: something went wrong while updating the location: "+ textStatus);
        });


}
