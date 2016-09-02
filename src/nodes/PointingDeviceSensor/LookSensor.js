/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

x3dom.registerNodeType(
    "LookSensor",
    "PointingDeviceSensor",
    defineClass(x3dom.nodeTypes.X3DTouchSensorNode,

        /**
         * Constructor for TouchSensor
         * @constructs x3dom.nodeTypes.TouchSensor
         * @x3d 3.3
         * @component PointingDeviceSensor
         * @status experimental
         * @extends x3dom.nodeTypes.X3DDragSensorNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc TouchSensor tracks location and state of the pointing device, and detects when user points at
         * geometry. Hint: X3DOM, running in an HTML environment, you actually don't need this node, as you can
         * simply use HTML events (like onclick) on your nodes. However, this node is implemented to complete the
         * pointing device sensor component, and it may be useful to ensure compatibility with older X3D scene content.
		 *
		 *	This node works by occasionally polling to see if there is a Shape node with the class property 'X3D-LookFind' located
		 *	in a small region at display center. If so, the first object is identified and checked at regular intervales until
		 *	countdownTime seconds after first detection. As long as that Shape node is the first object at the checks, then 
		 *	an onclick DOM event is fired at the end of the countdownTime. It is up to the Shape (or parent) node to handle the
		 *	onclick DOM event. Alternatively, the lookTime X3D event can be handled.
         */
        function (ctx)
        {
            x3dom.nodeTypes.TouchSensor.superClass.call(this, ctx);

            //---------------------------------------
            // FIELDS
            //---------------------------------------

            /**
             * The description of the node. Currently unimplemented
             * @var {x3dom.fields.SFString} description
             * @range String
             * @memberof x3dom.nodeTypes.LookSensor
             * @initvalue ""
             * @field x3d
             * @instance
             */
            this.addField_SFString(ctx, 'description', "");


            /**
             * Indicates if the node is enabled. An enabled node places a marker on the display. There can be only one LookSensor per scene.
             * @var {x3dom.fields.SFBool} enabled
             * @range [TRUE | FALSE]
             * @memberof x3dom.nodeTypes.LookSensor
             * @initvalue 1
             * @field x3d
             * @instance
             */
            this.addField_SFBool(ctx, 'enabled', true);


            /**
             * While the LookSensor is counting down before the selection of the Shape node, isCountdown is TRUE.
             * @var {x3dom.fields.SFBool} isCountdown
             * @range [TRUE | FALSE]
             * @memberof x3dom.nodeTypes.LookSensor
             * @initvalue FALSE
             * @field x3d
             * @instance
             */
            this.addField_SFBool(ctx, 'isCountdown', false);


            /**
             * The X3D time when the LookSensor "fires".
             * @var {x3dom.fields.SFTime} lookTime
             * @range [0, inf]
             * @memberof x3dom.nodeTypes.LookSensor
             * @initvalue 0
             * @field x3d
             * @instance
             */
            this.addField_SFTime(ctx, 'lookTime', 0);


            /**
             * The number of seconds the LookSensor uses from first look until "fire". This field is not yet implemented.
             * @var {x3dom.fields.SFTime} countdownTime
             * @range [0, inf]
             * @memberof x3dom.nodeTypes.LookSensor
             * @initvalue 2
             * @field x3d
             * @instance
             */
            this.addField_SFTime(ctx, 'countdownTime', 2);


			this.initDone = false;
			this.onTargetDuration = 2000;
			this.onTargetIncrement = 500;
			this.pollInterval = 200;
			this.regionSize = 14;
			this.timerId = 0;
			this.ShapeNode = null;
			this.currentLevel = 0;
			this.fireLevel = 4;
			


            //route-able output fields
            //this.addField_SFVec3f(ctx, 'hitNormal_changed',   0 0 0);
            //this.addField_SFVec3f(ctx, 'hitPoint_changed',    0 0 0);
            //this.addField_SFVec2f(ctx, 'hitTexCoord_changed', 0 0);


            //---------------------------------------
            // PROPERTIES
            //---------------------------------------
        },
        {
            //----------------------------------------------------------------------------------------------------------------------
            // PUBLIC FUNCTIONS
            //----------------------------------------------------------------------------------------------------------------------

            nodeChanged: function () {
				if (!this.initDone) {
					var worldId = this.findX3DDoc()._x3dElem.id;
					this.displayHeight = jQuery('#'+worldId).height();
					this.displayWidth = jQuery('#'+worldId).width();
					this.xCenter = this.displayWidth/2;
					this.yCenter = this.displayHeight/2;
					this.xTopLeft = this.xCenter - this.regionSize / 2;
					this.yTopLeft = this.yCenter - this.regionSize / 2;
					this.xBottomRight = this.xTopLeft + this.regionSize;
					this.yBottomRight = this.yTopLeft + this.regionSize;
					this.htmlAppend = "<div id='m0w' style='top:"+this.yTopLeft+"px; left:"+this.xTopLeft+"px; '><div id='m0b'><div id='m1'><div id='m2'><div id='m3'></div></div></div></div></div>";
					
					lookSensor = new ExternalLookSensor (worldId, this.xTopLeft, this.yTopLeft, this.xBottomRight, this.yBottomRight, 
															this.htmlAppend, 
															this.pollInterval, this.onTargetIncrement);
					this.initDone = true;
				}
			}
        }
    )
);


/*
 *	This is all the wrong way to do this. It needs to be embedded in the x3dom.runtime someplace/somehow,
 *	but that is to be done later. This works
 */


var watcher, world;
function ExternalLookSensor (x3dId, xtl, ytl, xbr, ybr, html, interval, increment) {
	world = document.getElementById(x3dId);
	watcher = new Picker (world, xtl, ytl, xbr, ybr, html, interval, increment);
	ExternalGetCenterObject();
};
function ExternalGetCenterObject () {
	var objects = world.runtime.pickRect(watcher.xTopLeft,watcher.yTopLeft, watcher.xBottomRight, watcher.yBottomRight);
	if (objects.length > 0) {
		watcher.selecting = objects;
		watcher.start();
	} else {
		watcher.reset();
	}
	window.setTimeout('ExternalGetCenterObject();', watcher.checkInterval);
}

	
	
Picker = function (we, xtl, ytl, xbr, ybr, html, interval, increment) {
	this.timerId = 0;
	this.xTopLeft = xtl;
	this.yTopLeft = ytl;
	this.xBottomRight = xbr;
	this.yBottomRight = ybr;
	this.duration = increment;
	this.checkInterval = interval;
	jQuery(we).append(html);
}
Picker.prototype.start = function (level) {
	if (level === undefined) {
		if (this.timerId != 0) {return; }
		level = 0;
	} else if (level == 3) {
		this.select();
		this.reset();
		return;
	}
	level++;
	var idString = '#m' + level;
	jQuery(idString).show();
	var cmdString = "watcher.start("+level+");"
	this.timerId = window.setTimeout(cmdString, this.duration);
}
Picker.prototype.reset = function () {
	window.clearTimeout(this.timerId);
	this.timerId = 0;
	jQuery('#m1').hide();
	jQuery('#m2').hide();
	jQuery('#m3').hide();
}
Picker.prototype.select = function () {
	var selectedId = this.selecting[0]._x3domNode._xmlNode.id;
	jQuery('#ResultDisplay').append('Node shape#'+selectedId+' look-clicked\n');
}
