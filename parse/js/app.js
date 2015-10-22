/*
    script for the index.html file
*/

Parse.initialize("7fPRVPWZVAzd5w8qkRSKTTMXqSZ1TCHEYFUvYaOT", "GSmKabF1jDsHTyF3yhPYNSVGncWaRaSwxwFLmSjV");

$(function() {
    'use strict';

    //new Task class for parse
    var Task = Parse.Object.extend('Task');
    //new query that will return all tasks ordered by createAt
    var tasksQuery = new Parse.Query(Task);
    tasksQuery.ascending('createdAt');
    tasksQuery.notEqualTo('done', true);

    //reference to the task list element
    var tasksList = $('#tasks-list');

    //reference to the error message alert
    var errorMessage = $('#error-message');

    //current set of tasks
    var tasks = [];

    var ratingElem = $('#rating');

    function displayError(err) {
        errorMessage.text(err.message);
        errorMessage.fadeIn();
    }

    function clearError() {
        errorMessage.hide();
    }

    function showSpinner() {
        $('.fa-spin').show();
    }

    function hideSpinner() {
        $('.fa-spin').hide();
    }

    function onData(results) {
        tasks = results;
        renderTasks();
    }

    function renderTasks() {
        tasksList.empty();
        tasks.forEach(function(task) {
            var li = $(document.createElement('li'))
                .text(task.get('title'))
                .addClass(task.get('done') ? 'completed-task' : '')
                .appendTo(tasksList)
                .click(function() {
                    task.set('done', !task.get('done'));
                    task.save().then(renderTasks, displayError);
                });

            $(document.createElement('span'))
                .raty({readOnly: true,
                    score: (task.get('rating') || 1),
                    hints: ['crap', 'awful', 'ok', 'nice', 'awesome']})
                .appendTo(li);
        })
    }

    function showMessage(message) {
        message = message || 'Hello';
        alert(message);
    }

    showMessage('World');

    function fetchTasks() {
        showSpinner();
        tasksQuery.find()
            .then(onData, displayError)
            .always(hideSpinner);
    }

    //when the user submits the new task form...
    $('#new-task-form').submit(function(evt) {
        //tell the browser not to do its default behavior
        evt.preventDefault();

        //find the input element in this form
        //with a name attribute set to "title"
        var titleInput = $(this).find('[name="title"]');

        //get the current value
        var title = titleInput.val();

        //create a new Task and set the title
        var task = new Task();
        task.set('title', title);
        task.set('rating', ratingElem.raty('score'));

        //save the new task to your Parse database
        //if save is successful, fetch the tasks again
        //otherwisedisplay the error
        //regardlesss, clear the title title input
        //so the user can enter the next new task
        task.save()
            .then(fetchTasks, displayError)
            .then(function() {
                titleInput.val('');
                ratingElem.raty('set', {});
            });

        //some browsers also require that we return false to
        //prevent the default behavior
        return false;
    });

    //go and fetch tasks from Parse
    fetchTasks();

    ratingElem.raty();

    window.setInterval(fetchTasks, 3000);
});