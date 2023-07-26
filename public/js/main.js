var skeletonId = 'skeleton';
var contentId = 'content';
var suggestions_count = 0;
var sent_request_count = 0;
var received_request_count = 0;
var connections_count = 0;
var skipCounter = 0;
var takeAmount = 5;


function getRequests(mode) {
    $('#'+contentId).html( '' );
    $('#'+skeletonId).removeClass( 'd-none' );
    $('#load_more_btn_parent').remove();

    $.ajax({
        url: '/users/get-requests/'+mode,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.success) {

                $('#'+skeletonId).addClass( 'd-none' );

                data.users.forEach(function(connection) {
                    html = '<div class="my-2 shadow  text-white bg-dark p-1" id="user_'+connection.id+'">'+
                                '<div class="d-flex justify-content-between">'+
                                    '<table class="ms-1">'+
                                        '<td class="align-middle">Name</td>'+
                                        '<td class="align-middle"> '+ connection.name +' </td>'+
                                        '<td class="align-middle">Email</td>'+
                                        '<td class="align-middle"> '+ connection.email +' </td>'+
                                    '</table>'+
                                    '<div>';
                                    if (mode == 'sent') {
                                        html += '<button id="cancel_request_btn_'+connection.id+'" class="btn btn-danger me-1" onclick="deleteRequest('+connection.id+');">Withdraw Request</button>';
                                    } else {
                                        html += '<button id="accept_request_btn_'+connection.id+'" class="btn btn-primary me-1" onclick="acceptRequest('+connection.id+');">Accept</button>';
                                    }
                                    html += '</div>'+
                                '</div>'+
                            '</div>';

                    $('#'+contentId).append( html );
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

function getConnections() {
    $('#'+contentId).html( '' );
    $('#'+skeletonId).removeClass( 'd-none' );
    $('#load_more_btn_parent').remove();

    $.ajax({
        url: '/users/connections',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                $('#'+skeletonId).addClass( 'd-none' );

                data.users.forEach(function(user) {
                    html = '<div class="my-2 shadow  text-white bg-dark p-1" id="user_'+user.user_id+'">'+
                                '<div class="d-flex justify-content-between">'+
                                    '<table class="ms-1">'+
                                        '<td class="align-middle">Name</td>'+
                                        '<td class="align-middle"> '+ user.user_name +' </td>'+
                                        '<td class="align-middle">Email</td>'+
                                        '<td class="align-middle"> '+ user.user_email +' </td>'+
                                    '</table>'+
                                    '<div>'+
                                        '<button style="width: 220px" id="get_connections_in_common_'+user.user_id+'" class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_'+user.user_id+'" aria-expanded="false" aria-controls="collapseExample">Connections in common ('+ user.mutual_connections +')</button>'+
                                        '<button id="create_request_btn_'+user.user_id+'" class="btn btn-danger me-1">Remove Connection</button>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="collapse" id="collapse_'+user.user_id+'">'+
                                '<div id="content_'+user.user_id+'" class="p-2">'+
                                //   '{{-- Display data here --}}'+
                                //   '<x-connection_in_common />'+
                                '</div>'+
                                '<div id="connections_in_common_skeletons_">'+
                                //   '{{-- Paste the loading skeletons here via Jquery before the ajax to get the connections in common --}}'+
                                '</div>'+
                                '<div class="d-flex justify-content-center w-100 py-2">'+
                                  '<button class="btn btn-sm btn-primary" id="load_more_connections_in_common_'+user.user_id+'">Load more</button>'+
                                '</div>'+
                              '</div>'+
                            '</div>';

                    $('#'+contentId).append( html );
                });
            }
        },
        error: function(error) {
            console.error('Error loading items:', error);
        }
    });
}

function getMoreConnections() {
  // Optional: Depends on how you handle the "Load more"-Functionality
  // your code here...
}

function getConnectionsInCommon(userId, connectionId) {
  // your code here...
}

function getMoreConnectionsInCommon(userId, connectionId) {
  // Optional: Depends on how you handle the "Load more"-Functionality
  // your code here...
}

html = '';
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
        url: '/users/send-request/'+user_id,
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

function deleteRequest(connection_id) {
    $.ajax({
        url: '/users/delete/'+connection_id,
        method: 'DELETE',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success: function(data) {
            if (data.success) {
                // remove the element
                $('#user_'+connection_id).remove();
            }
        },
        error: function(error) {
            console.error('Error loading items:', error);
        }
    });
}

function acceptRequest(connection_id) {
    $.ajax({
        url: '/users/accept-request/'+connection_id,
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
