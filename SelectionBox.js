/*jslint browser: true*/
/*global $, jQuery, alert, window, createjs*/

(function () {
    'use strict';

    function SelectionBox() {
        this.Container_constructor();

        this.arc = (2 * Math.PI) / this._sides;

        // The object this is attached to.
        this._attachedObject = null;

    }

    var p = createjs.extend(SelectionBox, createjs.Container);

    // Number of selection rectangles to show
    p._sides = 8;

    // Size of controls.
    p._controlSize = 6;

    // Attach this to an object
    p.attach = function (displayObject) {
        var bounds = displayObject.getBounds();
        if (bounds === null) {
            throw ("Object: " + displayObject + " must have valid bounds.");
        } else {
            this._attachedObject = displayObject;
            this.y = displayObject.y;
            this.x = displayObject.x;
            this.updateDimensions();
        }
    };

    // utility Method
    p._rbc = function (shape, size) {
        var m = shape.getMatrix();
        shape.setTransform(m.tx - size / 2, m.ty - size / 2);
        shape.graphics.drawRect(0, 0, size, size);
    };

    // Utility method to quickly transform a matrix
    SelectionBox._trans = function (displayObject, tx, ty) {
        var m = displayObject.getMatrix();
        displayObject.setTransform(m.tx + tx, m.ty + ty);
    };

    p.updateDimensions = function () {
        var bounds = this._attachedObject.getBounds();

        // Should we use the width with the controls?
        this.width = bounds.width;
        this.height = bounds.height;

        this.setBounds(
            0 - this._controlSize,               //x
            0 - this._controlSize,               //y
            this.width + this._controlSize,      //width
            this.height + this._controlSize      //height
        );

        // Setup or update the visuals.
        this._setupRectangle();
        this._setupControls();

        // this.cache(this.getBounds());

    };

    // Create the dashed rectangle.
    p._setupRectangle = function () {
        // The dashed rectangle.
        this.selRect = new createjs.Shape();
        this.selRect.graphics.beginStroke('green');
        this.selRect.graphics.setStrokeDash([1, 3], 0).drawRect(0, 0, this.width, this.height);
        this.addChild(this.selRect);
    };

    // Position the little rects on the sides of the rectangle.
    p._setupControls = function () {

        var s, sin, cos, x, y, i;

        // The little rectangle controls. Normally 8, unless changed.
        this.controls = [];

        // Create the little thingys and
        // position them relative to the this container
        for (i = 0; i < this._sides; i += 1) {

            s = new createjs.Shape();
            s.graphics.beginStroke('green').setStrokeStyle(1);

            // Center the control's (0,0) on this container's center.
            SelectionBox._trans(s, this.width / 2, this.height / 2);

            // Now find the place and put it;
            sin = Math.sin(i * this.arc);
            cos = Math.cos(i * this.arc);
            x = this.width / 2 * (Math.abs(cos) * cos + Math.abs(sin) * sin);
            y = this.height / 2 * (Math.abs(cos) * cos - Math.abs(sin) * sin);
            SelectionBox._trans(s, x, y);

            // Draws it
            this._rbc(s, this._controlSize);

            // TODO: How to test for mouseevents on a transparent displayObject?
            this.addChild(s);
            this.controls[i] = s;
        }
    };

    p.toString = function () {
        return "[SelectionBox(name=" + this.name + ")]";
    };

    window.SelectionBox = createjs.promote(SelectionBox, "Container");
}());