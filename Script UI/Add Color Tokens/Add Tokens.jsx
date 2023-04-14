(function (thisObj) {
    var scriptName = 'Add Color Tokens';
    var scriptVersion = '0.0.3';
    var releaseYear = '2023';
    var author = 'Matthew Sienzant | sienzant@google.com';
    var helpURL = '';
    var thisComp;
    
    
    var mainFunc = function () {
        // Get the selected layers
        var selectedLayers = app.project.activeItem.selectedLayers;

        // Check if any selected properties are color properties
        var anyPropertiesAreColor = false;
        for (var i = 0; i < selectedLayers.length; i++) {
            var selectedLayer = selectedLayers[i];
            var selectedProperties = selectedLayer.selectedProperties;
            for (var j = 0; j < selectedProperties.length; j++) {
                var selectedProperty = selectedProperties[j];
                if (selectedProperty.propertyValueType === PropertyValueType.COLOR) {
                    anyPropertiesAreColor = true;
                    break;
                }
            }
        }

        if (!anyPropertiesAreColor) {
            alert("Select at least one color property and try again.");
        } else {
            // Prompt user for token name
            var tokenName = prompt("Enter a token name:", "");

            // Check if user entered a name or hit escape
            if (tokenName !== null && tokenName !== "") {
                // Create the expression string that references the token
                var expressionString = 'const token = footage("theme.jsx").sourceData; // references the imported JSX\nhexToRgb(token.' + tokenName + ') //converts hex to RGB using token file and token name';

                // Wrap the expression setting code in an undo group
                app.beginUndoGroup('Add Color Tokens');

                // Loop through selected layers and properties and set the expression of each color property
                for (var i = 0; i < selectedLayers.length; i++) {
                    var selectedLayer = selectedLayers[i];
                    var selectedProperties = selectedLayer.selectedProperties;
                    for (var j = 0; j < selectedProperties.length; j++) {
                        var selectedProperty = selectedProperties[j];
                        if (selectedProperty.propertyValueType === PropertyValueType.COLOR) {
                            selectedProperty.expression = expressionString;
                        }
                    }
                }

                // End the undo group
                app.endUndoGroup();
            }
        }
    };

    
    
    
    
    var buildUI = function () {
        
        var buttons = [
            {
                text: 'Add Token',
                func: 'mainFunc()',
                helpTip: 'Theme.jsx and token names required'
            },
        ];
        
        
        
        
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window('palette', scriptName, undefined, { resizeable: true });
        if (myPanel === null)
            return;
        myPanel.orientation = "column";
        myPanel.alignChildren = ["left", "fill"];
        myPanel.preferredSize.width = 240;
        myPanel.spacing = 8;
        myPanel.margins = 12;
        addButtonsToPanel(buttons, myPanel);
        function addButtonsToPanel(buttons, panel) {
            var uiButtons = [];
            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                var newButton = myPanel.add("button", undefined, undefined);
                newButton.text = button.text;
                newButton.helpTip = button.helpTip;
                newButton.alignment = ["fill", "top"];
                newButton.onClick = function () {
                    try {
                        eval(button.func);
                    } catch (e) {
                        alert(e.toString() + "\nError on line: " + e.line.toString());
                    }
                };
                uiButtons.push(newButton);
            };
        }
        var aboutGroup = myPanel.add('group');
        aboutGroup.orientation = "column";
        aboutGroup.spacing = 2;
        aboutGroup.alignment = ['fill', 'bottom'];
        aboutGroup.alignChildren = ['left', 'bottom'];
        var ccYear = function (year) {
            var currentYear = new Date().getFullYear().toString();
            if (!year) {
                return currentYear;
            }
            var ccYear = year;
            if (year != currentYear) {
                ccYear += "-".concat(currentYear);
            }
            return ccYear;
        };
        aboutGroup.add('statictext', undefined, "".concat(scriptName, " - ").concat(scriptVersion));
        var coInfo = aboutGroup.add('group');
        coInfo.alignment = ['fill', 'top'];
        coInfo.add('statictext', undefined, "\u00A9".concat(ccYear(releaseYear), " ").concat(author));
         if (typeof helpURL !== 'undefined') {
            var helpButton = coInfo.add('button', [0, 0, 16, 16], '?');
            helpButton.helpTip = 'The cake is a lie';
            helpButton.alignment = ['right', 'top'];
            
           
            
        }
        myPanel.onResizing = myPanel.onResize = function () {
            myPanel.layout.resize();
        };
        if (myPanel instanceof Window) {
            myPanel.center();
            myPanel.show();
        }
        else {
            myPanel.layout.layout(true);
            myPanel.layout.resize();
        }
    };
    var isKBarRunning = (typeof kbar !== 'undefined');
    if (isKBarRunning && kbar.button) {
        var button = kbar.button;
        switch (button.argument.toLowerCase()) {
            case 'ui':
                buildUI();
                break;
            default:
                mainFunc();
                break;
        }
    }
    else {
        buildUI();
    }
})(this);
