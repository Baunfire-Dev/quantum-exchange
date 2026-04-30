// jQuery(document).ready(function () {
//     window.baunfire.ready();
// });

// jQuery(window).on("load", function () {
//     // window.baunfire.load();
// });


document.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            window.baunfire.ready();
        });
    });
});