function previewContent() {
    $.get('preview_content', {
        content: $('#content').val()
    }, function(data) {
        $('#preview').html(data);
    });
}

function toggleSidebar() {
    $('body').toggleClass('collapsed');
    $('#sideNav').toggleClass('collapsed');
}