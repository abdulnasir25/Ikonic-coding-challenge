var skeletonId = 'skeleton';
var contentId = 'content';
var suggestions_count = 0;
var sent_request_count = 0;
var received_request_count = 0;
var connections_count = 0;
var skipCounter = 0;
var takeAmount = 5;
var html = '';
var connection = 'connection';


function getRequests(mode) {
    $('#'+contentId).html( '' );
    $('#'+skeletonId).removeClass( 'd-none' );
    $('#load_more_btn_parent').remove();

    $.ajax({
        url: '/get-requests/'+mode,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.success) {

                $('#'+skeletonId).addClass( 'd-none' );

                data.users.forEach(function(connection) {
                    req_html = '<div class="my-2 shadow  text-white bg-dark p-1" id="user_'+connection.id+'">'+
                                '<div class="d-flex justify-content-between">'+
                                    '<table class="ms-1">'+
                                        '<td class="align-middle">Name</td>'+
                                        '<td class="align-middle"> '+ connection.name +' </td>'+
                                        '<td class="align-middle">Email</td>'+
                                        '<td class="align-middle"> '+ connection.email +' </td>'+
                                    '</table>'+
                                    '<div>';
                                    if (mode == 'sent') {
                                        req_html += '<button id="cancel_request_btn_'+connection.id+'" class="btn btn-danger me-1" onclick="deleteRequest('+connection.id+');">Withdraw Request</button>';
                                    } else {
                                        req_html += '<button id="accept_request_btn_'+connection.id+'" class="btn btn-primary me-1" onclick="acceptRequest('+connection.id+');">Accept</button>';
                                    }
                                    req_html += '</div>'+
                                '</div>'+
                            '</div>';

                    $('#'+contentId).append( req_html );
                });
            }
        },
        error: function(error) {
            console.error('Error loading items:', error);
        }
    });
}

function getMoreRequests(mode) {
  // Optional: Depends on how you handle the "Load more"-Functionality
  // your code here...
}

var con_html = '';
function getConnections() {
    $('#'+contentId).html( '' );
    $('#'+skeletonId).removeClass( 'd-none' );
    $('#load_more_btn_parent').remove();

    $.ajax({
        url: '/connections/'+skipCounter+'/'+takeAmount,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                $('#'+skeletonId).addClass( 'd-none' );

                data.users.forEach(function(user) {
                    con_html += '<div class="my-2 shadow  text-white bg-dark p-1" id="connected_user_'+user.id+'">'+
                                '<div class="d-flex justify-content-between">'+
                                    '<table class="ms-1">'+
                                        '<td class="align-middle">Name</td>'+
                                        '<td class="align-middle"> '+ user.name +' </td>'+
                                        '<td class="align-middle">Email</td>'+
                                        '<td class="align-middle"> '+ user.email +' </td>'+
                                    '</table>'+
                                    '<div>'+
                                        '<button style="width: 220px" id="get_connections_in_common_'+user.id+'" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_'+user.id+'" aria-expanded="false" aria-controls="collapseExample">Connections in common ('+ user.common_connections_count +')</button>'+
                                        '<button id="create_request_btn_'+user.id+'" class="btn btn-danger me-1" onclick="deleteRequest('+user.id+', '+connection+')">Remove Connection</button>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="collapse" id="collapse_'+user.id+'">'+
                                '<div id="content_'+user.id+'" class="p-2">'+
                                  'This section has not done!'+
                                //   '<x-connection_in_common />'+
                                '</div>'+
                                // '<div id="connections_in_common_skeletons_">'+
                                //   '{{-- Paste the loading skeletons here via Jquery before the ajax to get the connections in common --}}'+
                                // '</div>'+
                                // '<div class="d-flex justify-content-center w-100 py-2">'+
                                //   '<button class="btn btn-sm btn-primary" id="load_more_connections_in_common_'+user.id+'">Load more</button>'+
                                // '</div>'+
                              '</div>'+
                            '</div>';

                });

                $('#'+contentId).html( con_html );

                skipCounter += takeAmount;

                if (data.users.length < takeAmount) {
                    // $('#load_more_btn_parent').remove();
                } else {
                    // loadBtn = `<div class="d-flex justify-content-center mt-2 py-3" id="load_more_btn_parent">
                    // <button class="btn btn-primary" onclick="getMoreConnections(`+skipCounter+`, `+takeAmount+`)" id="load_more_btn">Load more</button>
                    // </div>`;

                    // $('.card-body').find('#skeleton').after( loadBtn );
                }
            }
        },
        error: function(error) {
            console.error('Error loading items:', error);
        }
    });
}

function getMoreConnections(skip_counter, take_amount) {
    skipCounter = skip_counter;
    takeAmount = take_amount;

    getConnections();
}

function getConnectionsInCommon(userId, connectionId) {
  // your code here...
}

function getMoreConnectionsInCommon(userId, connectionId) {
  // Optional: Depends on how you handle the "Load more"-Functionality
  // your code here...
}

function getSuggestions() {
    $('#'+contentId).html( '' );
    $('#'+skeletonId).removeClass( 'd-none' );
    $('#load_more_btn_parent').remove();

    $.ajax({
        url: '/users/'+skipCounter+'/'+takeAmount,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                suggestions_count += data.suggestions_count;
                $('#suggestions_count').text(suggestions_count);

                sent_request_count = data.sent_request_count;
                $('#sent_request_count').text(sent_request_count);

                received_request_count = data.received_request_count;
                $('#received_request_count').text(received_request_count);

                connections_count = data.connections_count;
                $('#connections_count').text(connections_count);

                $('#'+skeletonId).addClass( 'd-none' );

                data.users.forEach(function(user) {
                    html += '<div class="my-2 shadow  text-white bg-dark p-1" id="user_'+user.id+'">'+
                                '<div class="d-flex justify-content-between">'+
                                    '<table class="ms-1">'+
                                        '<td class="align-middle">Name</td>'+
                                        '<td class="align-middle"> '+ user.name +' </td>'+
                                        '<td class="align-middle">Email</td>'+
                                        '<td class="align-middle"> '+ user.email +' </td>'+
                                    '</table>'+
                                    '<div>'+
                                        '<button id="create_request_btn_'+user.id+'" class="btn btn-primary me-1" onclick="sendRequest('+user.id+');">Connect</button>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';

                });

                $('#'+contentId).append( html );

                skipCounter += takeAmount;

                if (data.users.length < takeAmount) {
                    $('#load_more_btn_parent').remove();
                } else {
                    loadBtn = `<div class="d-flex justify-content-center mt-2 py-3" id="load_more_btn_parent">
                    <button class="btn btn-primary" onclick="getMoreSuggestions(`+skipCounter+`, `+takeAmount+`)" id="load_more_btn">Load more</button>
                    </div>`;

                    $('.card-body').find('#skeleton').after( loadBtn );
                }
            }
        },
        error: function(error) {
            console.error('Error loading items:', error);
        }
    });
}

function getMoreSuggestions(skip_counter, take_amount) {
    skipCounter = skip_counter;
    takeAmount = take_amount;

    getSuggestions();
}

function sendRequest(user_id) {
    $.ajax({
        url: '/send-request/'+user_id,
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            if (data.success) {
                // remove the element
                $('#user_'+user_id).remove();

                suggestions_count -= 1;
                $('#suggestions_count').text(suggestions_count);

                sent_request_count += 1;
                $('#sent_request_count').text(sent_request_count);
            }
        },
        error: function(error) {
            console.error('Error loading items:', error);
        }
    });
}

function deleteRequest(connection_id, mode = 'request') {
    $.ajax({
        url: '/delete/'+mode+'/'+connection_id,
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            if (data.success) {
                // remove the element
                if (data.mode == 'connection') {
                    $('#connected_user_'+connection_id).remove();
                } else {
                    $('#user_'+connection_id).remove();
                }
            }
        },
        error: function(error) {
            console.error('Error loading items:', error);
        }
    });
}

function acceptRequest(connection_id) {
    $.ajax({
        url: '/accept-request/'+connection_id,
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            if (data.success) {
                // remove the element
                $('#user_'+connection_id).remove();

                received_request_count -= 1;
                $('#received_request_count').text(received_request_count);

                connections_count += 1;
                $('#connections_count').text(connections_count);
            }
        },
        error: function(error) {
            console.error('Error loading items:', error);
        }
    });
}

function removeConnection(userId, connectionId) {
  // your code here...
}

$(function () {
    getSuggestions();
});
