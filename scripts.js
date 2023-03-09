var empty = {
    options: [],
    args: [],
};

var commands = {
    'help': {
        desc: "This is the command that you see right now!  It'll show you information about all of the available " +
            "commands and their syntax if available.",
        empty,
    },
    'cd': {
        desc: "Used to navigate between the pages on this portfolio.  Syntax for command: 'cd page_to_navigate_to'",
        args: ['home', 'about_me', 'experience', 'contact'],
    },
    'goto': {
        desc: "Used to navigate to some of my links.  Syntax for command: 'goto link'",
        args: ['linkedin', 'github', 'cv'],
    }
};

var greeting = function() {
    this.echo(greeting_template.innerHTML);
    $(menu_template.innerHTML).appendTo("div.terminal");
};

var help = function() {
    this.echo("Here's help:")
    for (const [key, value] of Object.entries(commands)) {
        this.echo(key.padEnd(10) + value.desc)
    }
};

var cd = function(page) {
    if (page === "home") {
        window.location.replace("./index.html");
    } else {
        window.location.replace("./" + page + ".html");
    }
};

var goto = function(link) {
    switch (link) {
        case "linkedin":
            window.open("https://www.linkedin.com/in/lucasocampos/", '_blank').focus();
            break;
        case "github":
            window.open("https://github.com/lucasocampos/", '_blank').focus();
            break;
        case "cv":
            window.open("./Lucas Vazquez Ocampos CV.pdf", '_blank').focus();
            break;
    }
};

var term = $('body').terminal({
    cd,
    help,
    goto,
}, {
    greetings: false,
    onInit: greeting,
    autocompleteMenu: true,
    completion: function() {
        var term = this;
        return new Promise(function(resolve) {
            var command = term.get_command();
            var name = command.match(/^([^\s]*)/)[0];
            var list = [];
            if (name) {
                var word = term.before_cursor(true);
                var regex = new RegExp('^' + $.terminal.escape_regex(word));
                if (name == word) {
                    list = Object.keys(commands);
                } else if (command.match(/\s/)) {
                    if (commands[name]) {
                        if (word.match(/^--/)) {
                            list = commands[name].options.map(function(option) {
                                return '--' + option;
                            });

                        } else {
                            list = commands[name].args;
                        }
                    }
                }
            }
            resolve(list);
        });
    }
});