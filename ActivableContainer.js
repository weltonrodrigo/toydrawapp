/*jslint browser: true*/
/*global $, jQuery, alert, createjs, SelectionBox, window*/
(function () {
    'use strict';

    function ActivableContainer() {
        this.Container_constructor();

        this._selectionBox = new SelectionBox();

        this.Container_addChild(this._selectionBox);

        this.mouseChildren = false;
    }

    var p = createjs.extend(ActivableContainer, createjs.Container);

    // Do this contains any child? We must know that in order to keep the selectionBox
    // state valid.
    p._occupied = false;

    // Is this in the "active" state?
    p._active = false;

    // Make this objects activate the "selected" behaviour.
    p.setActive = function (boolean) {
        this._active = boolean;
        this._selectionBox.visible = boolean;
    };

    p.getActive = function () {
        return this._active;
    };

    // This may receive several displayObjects
    // Ex: addChild(ShapeObject, ContainerObject, TextObject)
    p.addChild = function (child) {

        // Several arguments get added one-by-one.
        var l = arguments.length, i;
        if (l > 1) {
            for (i = 0; i < l; i += 1) {
                this.addChild(arguments[i]);
            }
            return arguments[l - 1];
        }

        //The last child of this container must always be the
        //selectionBox. Otherwise, it would be draw _BELOW_ the other children.
        this.addChildAt(child, this.children.length - 1);

        // If this is the first child we see, attach the selectionBox.
        if (this._occupied === false) {
            this._selectionBox.attach(this);
            this._occupied = true;
        }
    };

    // We must take care to deactivate the selection box when the last
    // child is removed.
    p.removeChild = function (child) {
        this.Container_removeChild(child);
        if (this.children.length == 0) {
            this.setActive(false);
        }
    };

    p.toString = function () {
        return "[ActivableContainer(name=" + this.name + ")]";
    };

    window.ActivableContainer = createjs.promote(ActivableContainer, "Container");
}());