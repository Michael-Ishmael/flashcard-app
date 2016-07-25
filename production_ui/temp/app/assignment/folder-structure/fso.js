"use strict";
var Fso = (function () {
    function Fso(name, path, childFolders, files, selected, expanded) {
        this.name = name;
        this.path = path;
        this.childFolders = childFolders;
        this.files = files;
        this.selected = selected;
        this.expanded = expanded;
    }
    return Fso;
}());
exports.Fso = Fso;
//# sourceMappingURL=fso.js.map