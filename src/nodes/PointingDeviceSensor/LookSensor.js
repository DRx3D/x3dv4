/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * V4 additions (C)2016 Daly Realism, Los Angeles
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

x3dom.registerNodeType(
    "LookSensor",
    "PointingDeviceSensor",
    defineClass(x3dom.nodeTypes.X3DTouchSensorNode,

        /**
         * Constructor for LookSensor
         * @constructs x3dom.nodeTypes.LookSensor
         * @x3d 4.0 proposed
         * @component PointingDeviceSensor
         * @status experimental
         * @extends x3dom.nodeTypes.X3DDragSensorNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc LookSensor tracks objects at scene center and determines if any allowed object remains at the
		 * center long enough. If so, it triggers an onclick event for that [Shape] node
		 *
		 *	This node works by occasionally polling to see if there is a Shape node with the class with the specified value located
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
             * The description of the node. Currently unimplemented
             * @var {x3dom.fields.SFString} description
             * @range String
             * @memberof x3dom.nodeTypes.LookSensor
             * @initvalue ""
             * @field x3d
             * @instance
             */
            this.addField_SFString(ctx, 'objectClass', "");

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
			this.countdownInterval = 500;	// >0 & in milliseconds
			this.pollInterval = 200;		// >0 & in milliseconds
			this.regionSize = 14;			// Needs to be consistent with CSS
			


            //---------------------------------------
            // PROPERTIES
            //---------------------------------------
        },
        {
            //----------------------------------------------------------------------------------------------------------------------
            // PUBLIC FUNCTIONS
            //----------------------------------------------------------------------------------------------------------------------

// --> Important not to initialze until all fields are defined. Also any change to the display
//		size needs to cause a reinitialization. Somehow that needs to be balanced against a
//		current countdown. Probably reset countdown in that case.

//		Changing certain fields during a countdown will not have an effect on the countdown (e.g., countdownTime)
//		Changes to the following fields resets the countdown
//			* objectClass
//			* enabled
//
//		The target is only displayed when this node is enabled
//		Only one LookSensor can be enabled. If another LookSensor is enabled, this one is disabled.
//		
//		Logic for determining objects at scene center is wrong it needs to be similar to the following:
//		1) Initial targeting
//			a) get list of objects at scene center
//			b) discard any that don't match the objectClass field value
//			c) Save list of matching objects
//		2) Subsequent tracking (countdown)
//			a) get list of objects at scene center
//			b) keep going if any one of these matches the saved list
//			c) reset if no match
//
            nodeChanged: function () {
				if (!this.initDone) {
					if (x3dom.singleUse === undefined) {
						x3dom.singleUse = new Object();
					}
					if (x3dom.singleUse.LookSensor === undefined) {
						x3dom.singleUse.LookSensor = {
														'worldId' :				this.findX3DDoc()._x3dElem.id,
														'x3dElement' :			document.getElementById(this.findX3DDoc()._x3dElem.id),
														'enabledLookSensor' : 	new Object(),
														'timerId' :				0,
														'state' :				'INIT',
														'counter' :				0,
														'watching' :			[],
														'display' : 			
															{
																'height' :		0,
																'width' :		0,
																'center' :		[0,0],
																'topLeft' :		[0,0],
																'bottomRight' :	[0,0],
																'targetId' : 	'x3dom_LookSensor_target',
																'targetTimeIds' : ['x3dom_LookSensor_t1', 'x3dom_LookSensor_t2', 'x3dom_LookSensor_t3'],
																'targetTimeElements' : []
															},
/*
 *	Get and save list of objects with matching class attributes
 *	If there are matching objects, then start countdown
 *	Otherwise, setup for future poll
 */
														'pollScene' :	function()
															{
																x3dom.singleUse.LookSensor.watching = x3dom.singleUse.LookSensor.getObjectsClass(x3dom.singleUse.LookSensor.display.topLeft, x3dom.singleUse.LookSensor.display.bottomRight, x3dom.singleUse.LookSensor.enabledLookSensor._vf.objectClass);
																if (x3dom.singleUse.LookSensor.watching.length > 0) {
																	//jQuery('#log_debug').prepend('<div>Watching ' + x3dom.singleUse.LookSensor.watching.length + ' objects</div>');
																	x3dom.singleUse.LookSensor.countdown();
																} else {
																	//jQuery('#log_debug').prepend('<div>Clear watch</div>');
																	x3dom.singleUse.LookSensor.reset();
																	x3dom.singleUse.LookSensor.timerId = window.setTimeout('x3dom.singleUse.LookSensor.pollScene();', x3dom.singleUse.LookSensor.enabledLookSensor.pollInterval);
																	x3dom.singleUse.LookSensor.state = 'POLL';
																}
															},
														'getObjectsClass' :	function(topLeft, bottomRight, cls)
															{
																var centerObjects = x3dom.singleUse.LookSensor.x3dElement.runtime.pickRect
																	(topLeft[0], topLeft[1], bottomRight[0], bottomRight[1]);
																if (centerObjects.length == 0) {return [];}
																if (cls == '') {return centerObjects;}
																var matchingObjs = [];
																for (var ii=0; ii<centerObjects.length; ii++) {
																	for (var jj=0; jj<centerObjects[ii].classList.length; jj++) {
																		if (cls == centerObjects[ii].classList[jj]) {
																			matchingObjs[matchingObjs.length] = centerObjects[ii];
																		}
																	}
																}
																return matchingObjs;
															},

														'countdown' :	function() 
															{
																var currentObjects = x3dom.singleUse.LookSensor.getObjectsClass(x3dom.singleUse.LookSensor.display.topLeft, x3dom.singleUse.LookSensor.display.bottomRight, x3dom.singleUse.LookSensor.enabledLookSensor._vf.objectClass);
																if (currentObjects.length == 0 || currentObjects[0] != x3dom.singleUse.LookSensor.watching[0]) {
																	x3dom.singleUse.LookSensor.reset();
																	x3dom.singleUse.LookSensor.counter = 0;
																	x3dom.singleUse.LookSensor.pollScene();
																} else if (x3dom.singleUse.LookSensor.counter == 3) {
																	x3dom.singleUse.LookSensor.reset();
																	x3dom.singleUse.LookSensor.select(currentObjects[0]);
																	x3dom.singleUse.LookSensor.counter = 0;
																	x3dom.singleUse.LookSensor.pollScene();
																} else {
																	var e = x3dom.singleUse.LookSensor.display.targetTimeElements[x3dom.singleUse.LookSensor.counter];
																	e.style.display = 'block';
																	x3dom.singleUse.LookSensor.counter++;
																	x3dom.singleUse.LookSensor.timerId = window.setTimeout('x3dom.singleUse.LookSensor.countdown();', x3dom.singleUse.LookSensor.enabledLookSensor.countdownInterval);
																	x3dom.singleUse.LookSensor.state = 'CDWN';
																}
																//jQuery('#log_debug').prepend('<div>...' + x3dom.singleUse.LookSensor.counter + '</div>');
															},
														'reset' :		function() 
															{
																window.clearTimeout(x3dom.singleUse.LookSensor.timerId);
																x3dom.singleUse.LookSensor.timerId = 0;
																x3dom.singleUse.LookSensor.state = 'INIT';
																for (var ii=0; ii<x3dom.singleUse.LookSensor.display.targetTimeElements.length; ii++) {
																	x3dom.singleUse.LookSensor.display.targetTimeElements[ii].style.display = 'none';
																}
															},
														'select' :		function (obj)
															{
																this.x3dElement.runtime.canvas.doc.onMousePress
																	(
																		this.x3dElement.runtime.canvas.gl,
																		x3dom.singleUse.LookSensor.display.center[0],
																		x3dom.singleUse.LookSensor.display.center[1],
																		1
																	);
																this.x3dElement.runtime.canvas.doc.onMouseRelease
																	(
																		this.x3dElement.runtime.canvas.gl,
																		x3dom.singleUse.LookSensor.display.center[0],
																		x3dom.singleUse.LookSensor.display.center[1],
																		1, 1
																	);
															}
													};
						var targetHtml = "<div id='x3dom_LookSensor_target' style='display:none; position:relative; z-index:32000;'><div class='x3dom_LookSensor_border1'><div class='x3dom_LookSensor_border2'>";
						var tmpHtml = '', ii=0;
						for (ii=x3dom.singleUse.LookSensor.display.targetTimeIds.length-1; ii>=0; ii--) {
							tmpHtml = "<div id='" + x3dom.singleUse.LookSensor.display.targetTimeIds[ii] + "' class='x3dom_LookSensor_time" + (ii+1) + "' style='display:none;'>" + tmpHtml + "</div>";
						}
						targetHtml += tmpHtml + "</div></div>";
						var targetElement = document.createElement('template');
						targetElement.innerHTML = targetHtml;
						x3dom.singleUse.LookSensor.x3dElement.appendChild(targetElement.content.firstChild);
						for (ii=0; ii<x3dom.singleUse.LookSensor.display.targetTimeIds.length; ii++) {
							x3dom.singleUse.LookSensor.display.targetTimeElements[ii] = document.getElementById(x3dom.singleUse.LookSensor.display.targetTimeIds[ii]);
						}
					}
					
					if (this._vf.enabled) {
						this.setupLook ();
					}
					this.initDone = true;
				}
			},
			setupLook: function() {
				x3dom.singleUse.LookSensor.enabledLookSensor = this;
				x3dom.singleUse.LookSensor.display.height	= x3dom.singleUse.LookSensor.x3dElement.offsetHeight;
				x3dom.singleUse.LookSensor.display.width	= x3dom.singleUse.LookSensor.x3dElement.offsetWidth;
				x3dom.singleUse.LookSensor.display.center	= [x3dom.singleUse.LookSensor.display.width/2, x3dom.singleUse.LookSensor.display.height/2];
				x3dom.singleUse.LookSensor.display.topLeft	= [x3dom.singleUse.LookSensor.display.center[0]-this.regionSize/2, x3dom.singleUse.LookSensor.display.center[1]-this.regionSize/2];
				x3dom.singleUse.LookSensor.display.bottomRight = [x3dom.singleUse.LookSensor.display.center[0]+this.regionSize, x3dom.singleUse.LookSensor.display.center[1]+this.regionSize];
				var targetElement = document.getElementById('x3dom_LookSensor_target');
				targetElement.style.top = x3dom.singleUse.LookSensor.display.topLeft[1];
				targetElement.style.left = x3dom.singleUse.LookSensor.display.topLeft[0];
				targetElement.style.display = 'block';
				x3dom.singleUse.LookSensor.pollScene();
			}
        }
    )
);
