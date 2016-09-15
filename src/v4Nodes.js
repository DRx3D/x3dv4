/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * V4 additions (C)2016 Daly Realism, Los Angeles
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

// ### Interpolate ###
x3dom.registerNodeType(
    "Interpolate",
    "Interpolation",
    defineClass(x3dom.nodeTypes.X3DInterpolatorNode,
        
        /**
         * Constructor for Interpolate
         * @constructs x3dom.nodeTypes.Interpolate
         * @x3d 3.3
         * @component Interpolation
         * @status full
         * @extends x3dom.nodeTypes.X3DInterpolatorNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The Interpolate node is a field of Animate that performs all interpolations without using events to trigger the interpolator. The output is determined by the 'space' field... linearly interpolates among a list of 3D vectors to produce an SFVec3f value_changed event. The keyValue field shall contain exactly as many values as in the key field.
         */
        function (ctx) {
            x3dom.nodeTypes.Interpolate.superClass.call(this, ctx);		// Not sure this is required. Not sure how to ensure this node is a child/field of Animate.

/*
            if (ctx)
                ctx.doc._nodeBag.timer.push(this);
            else
                x3dom.debug.logWarning("Animate: No runtime context found!");
*/

            /**
             * Defines the set of data points, that are used for interpolation.
             * @var {x3dom.fields.MFVec3f} keyValue
             * @memberof x3dom.nodeTypes.Interpolate
             * @initvalue []
             * @field x3d
             * @instance
			 *
			 *	Need to make sure 'key' and 'keyValue' are child fields of Interpolate
             */
            this.addField_MFFloat(ctx, 'key', []);
        
            /**
             * Defines the destination node name for the ouput of the interpolation. The node must exist and be DEFed
             * @var {x3dom.fields.MFVec3f} destinationNode
             * @memberof x3dom.nodeTypes.Interpolate
             * @initvalue ''
             * @field x3dv4
             * @instance
             */
            this.addField_SFString(ctx, 'destinationNode', '');
        
            /**
             * Defines the field of the destinationNode that is to be interpolated. The field must be of the datatype of the interpolator
             * @var {x3dom.fields.MFVec3f} destinationField
             * @memberof x3dom.nodeTypes.Interpolate
             * @initvalue ''
             * @field x3dv4
             * @instance
             */
            this.addField_SFString(ctx, 'destinationField', []);
        
            /**
             * Defines the interpolation algorithm
             * @var {x3dom.fields.MFVec3f} algorithm
             * @memberof x3dom.nodeTypes.Interpolate
             * @initvalue 'LINEAR'
             * @field x3dv4
             * @instance
             */
            this.addField_SFString(ctx, 'algorithm', 'LINEAR');
        
            /**
             * Defines the output space of the interpolation
             * @var {x3dom.fields.MFVec3f} space
             * @memberof x3dom.nodeTypes.Interpolate
             * @initvalue '3D'
             * @field x3dv4
             * @instance
			 *
			 *	Options are '3D', '2D', '1D', 'COLOR', 'ROTATION'
             */
            this.addField_SFString(ctx, 'space', '3D');
        
            /**
             * Turns on or off the interpolator
             * @var {x3dom.fields.MFVec3f} enabled
             * @memberof x3dom.nodeTypes.Interpolate
             * @initvalue true
             * @field x3dv4
             * @instance
             */
            this.addField_SFBool(ctx, 'enabled', true);
			
			if (this._vf.space == '1D') {
				this.addField_MFFloat(ctx, 'keyValue', []);
				this.interpolation = function(a,b,t) {
					return (1.0-t)*a + t*b;
				};
			}
			else if (this._vf.space == '3D') {
				this.addField_MFVec3f(ctx, 'keyValue', []);
				this.interpolation = function(a,b,t) {
					return a.multiply(1.0-t).add(b.multiply(t));
				};
			}
			else if (this._vf.space == 'COLOR') {
				this.addField_MFColor(ctx, 'keyValue', []);
				this.interpolation = function(a,b,t) {
					return a.multiply(1.0-t).add(b.multiply(t));
				};
			}
			else if (this._vf.space == 'ROTATION') {
				this.addField_MFRotation(ctx, 'keyValue', []);
				this.interpolation = function(a,b,t) {
					return a.slerp(b, t);
				};
			}

			this.toNodeElement = this._nameSpace.defMap[this._vf.destinationNode]._xmlNode;
        },
		/**
		 *	This is for the incoming event -- which there isn't any. Perhaps a callback needs to be entered into the Animate object
		 *	for each Interpolate node. Then each Animation time tick cycles through the registered callbacks
		 */
		
        {
			doInterpolate: function (ftime) 
			{
                if (!this._vf.enabled) {
                    return false;
                }

				var value = this.linearInterp(ftime, this.interpolation);

				//console.log ('Interpolate ftime: ' + ftime + '; value: ' + value + '\n');
				this.toNodeElement.setFieldValue(this._vf.destinationField, value);
			},
            fieldChanged: function(fieldName)
            {
                if(fieldName === "set_fraction")
                {
                    var value = this.linearInterp(this._vf.set_fraction, function (a, b, t) {
                        return a.multiply(1.0-t).add(b.multiply(t));
                    });

                    this.postMessage('value_changed', value);
                }
            }
        }
    )
);/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * V4 additions (C)2016 Daly Realism, Los Angeles
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

// ### Macro ###
x3dom.registerNodeType(
    "Macro",
    "Networking",
    defineClass(x3dom.nodeTypes.X3DGroupingNode,
        
        /**
         * Constructor for Macro
		 * Definition: http://tools.realism.com/specification/x3d-v40/abstract-specification/changes-additions-x3d-v33/macro
         * @constructs x3dom.nodeTypes.Macro
         * @x3d 3.3
         * @component Networking
         * @status full
         * @extends x3dom.nodeTypes.X3DGroupingNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc Macro is a Grouping node that can load nodes from another X3D scene via url.
         */
        function (ctx) {
            x3dom.nodeTypes.Macro.superClass.call(this, ctx);


            /**
             * Each specified URL shall refer to a valid X3D file that contains a list of children nodes, prototypes and routes at the top level. Hint: Strings can have multiple values, so separate each string by quote marks. Warning: strictly match directory and filename capitalization for http links!
             * @var {x3dom.fields.MFString} url
             * @memberof x3dom.nodeTypes.Macro
             * @initvalue []
             * @field x3d
             * @instance
             */
            this.addField_MFString(ctx, 'url', []);

            /**
             * The X3D node string to insert into the scene graph. This must be a valid X3D fragment that contains a list of children nodes and routes at the top level. 
             * @var {x3dom.fields.SFString} expand
             * @memberof x3dom.nodeTypes.Macro
             * @initvalue ""
             * @field x3d
             * @instance
             */
            this.addField_MFString(ctx, 'expand', "");

            /**
             * Specifies whether the X3D file specified by the url field is loaded. Hint: use LoadSensor to detect when loading is complete. TRUE: load immediately (it's also possible to load the URL at a later time by sending a TRUE event to the load field); FALSE: no action is taken (by sending a FALSE event to the load field of a previously loaded Macro, the contents of the Macro will be unloaded from the scene graph)
             * @var {x3dom.fields.SFBool} load
             * @memberof x3dom.nodeTypes.Macro
             * @initvalue true
             * @field x3d
             * @instance
             */
            this.addField_SFBool(ctx, 'load', true);

            /**
             * Specifies the namespace of the Macro node.
             * @var {x3dom.fields.MFString} nameSpaceName
             * @memberof x3dom.nodeTypes.Macro
             * @initvalue []
             * @field x3dom
             * @instance
             */
            this.addField_MFString(ctx, 'nameSpaceName', ['_internal']);

            /**
             * Specifies the substituion parameters of the Macro node.
             * @var {x3dom.fields.MFString} params
             * @memberof x3dom.nodeTypes.Macro
             * @initvalue []
             * @field x3dom
             * @instance
             */
            this.addField_MFString(ctx, 'params', []);

            /**
             * Specifies whether the DEF value is used as id when no other id is set.
             * @var {x3dom.fields.SFBool} mapDEFToID
             * @memberof x3dom.nodeTypes.Macro
             * @initvalue false
             * @field x3dom
             * @instance
             */
            this.addField_SFBool(ctx, 'mapDEFToID', false);

            this.initDone = false;
            this.count = 0;
            this.numRetries = x3dom.nodeTypes.Macro.MaximumRetries;
        
        },
        {
            fieldChanged: function (fieldName)
            {
                if (fieldName == "url") {

                    //Remove the childs of the x3domNode
                    for (var i=0; i<this._childNodes.length; i++)
                    {
                        this.removeChild(this._childNodes[i]);
                    }

                    //if reflected to DOM remove the childs of the domNode
                    if (this._vf.nameSpaceName.length != 0) {
                        var node = this._xmlNode;
                        if (node && node.hasChildNodes())
                        {
                            while ( node.childNodes.length >= 1 )
                            {
                                node.removeChild( node.firstChild );
                            }
                        }
                    }
                    this.loadMacro();
                }
                else if (fieldName == "render") {
                    this.invalidateVolume();
                    //this.invalidateCache();
                }
            },

            nodeChanged: function ()
            {
                if (!this.initDone) {
                    this.initDone = true;
                    this.loadMacro();
                }
            },

            fireEvents: function(eventType)
            {
                if ( this._xmlNode &&
                    (this._xmlNode['on'+eventType] ||
                        this._xmlNode.hasAttribute('on'+eventType) ||
                        this._listeners[eventType]) )
                {
                    var event = {
                        target: this._xmlNode,
                        type: eventType,
                        error: (eventType == "error") ? "XMLHttpRequest Error" : "",
                        cancelBubble: false,
                        stopPropagation: function() { this.cancelBubble = true; }
                    };

                    try {
                        var attrib = this._xmlNode["on" + eventType];

                        if (typeof(attrib) === "function") {
                            attrib.call(this._xmlNode, event);
                        }
                        else {
                            var funcStr = this._xmlNode.getAttribute("on" + eventType);
                            var func = new Function('event', funcStr);
                            func.call(this._xmlNode, event);
                        }

                        var list = this._listeners[eventType];
                        if (list) {
                            for (var i = 0; i < list.length; i++) {
                                list[i].call(this._xmlNode, event);
                            }
                        }
                    }
                    catch(ex) {
                        x3dom.debug.logException(ex);
                    }
                }
            },

/*
 * Loads a external Xml resource into a string
 */
            loadExternalXml: function ()
            {
                var that = this;

                var xhr = new window.XMLHttpRequest();
                if (xhr.overrideMimeType)
                    xhr.overrideMimeType('text/xml');   //application/xhtml+xml
				//xhr.resultSuccess = success;

                xhr.onreadystatechange = function ()
                {
                    if (xhr.readyState != 4) {
                        // still loading
                        //x3dom.debug.logInfo('Loading inlined data... (readyState: ' + xhr.readyState + ')');
                        return xhr;
                    }

                    if (xhr.status === x3dom.nodeTypes.Inline.AwaitTranscoding) {
                        if (that.count < that.numRetries)
                        {
                            that.count++;
                            var refreshTime = +xhr.getResponseHeader("Refresh") || 5;
                            x3dom.debug.logInfo('XHR status: ' + xhr.status + ' - Await Transcoding (' + that.count + '/' + that.numRetries + '): ' + 
                                                'Next request in ' + refreshTime + ' seconds');
                      
                            window.setTimeout(function() {
                                that._nameSpace.doc.downloadCount -= 1;
                                that.loadExternalXml();
                            }, refreshTime * 1000);
                            return xhr;
                        }
                        else
                        {
                            x3dom.debug.logError('XHR status: ' + xhr.status + ' - Await Transcoding (' + that.count + '/' + that.numRetries + '): ' + 
                                                 'No Retries left');
                            that._nameSpace.doc.downloadCount -= 1;
                            that.count = 0;
                            return xhr;
                        }
                    }
                    else if ((xhr.status !== 200) && (xhr.status !== 0)) {
                        that.fireEvents("error");
                        x3dom.debug.logError('XHR status: ' + xhr.status + ' - XMLHttpRequest requires web server running!');

                        that._nameSpace.doc.downloadCount -= 1;
                        that.count = 0;
                        return xhr;
                    }
                    else if ((xhr.status == 200) || (xhr.status == 0)) {
                        that.count = 0;
                    }

                    x3dom.debug.logInfo('Inline: downloading '+that._vf.url[0]+' done.');

					that.loadExternalSuccess(xhr);
					that._nameSpace.doc.downloadCount -= 1;
					that.fireEvents("load");
                    return xhr;
                };

                if (this._vf.url.length && this._vf.url[0].length)
                {
                    var xhrURI = this._nameSpace.getURL(this._vf.url[0]);
                    xhr.open('GET', xhrURI, true);
                    this._nameSpace.doc.downloadCount += 1;
                    try {
                        xhr.send(null);
                    }
                    catch(ex) {
                        this.fireEvents("error");
                        x3dom.debug.logError(this._vf.url[0] + ": " + ex);
                    }
                }
            },


/*
 *	Use MACRO expansion of embedded code to achieve results
 *
 *	Grab namespaceName and params from fields
 *	Supplied function does all work of inserting nodes into DOM/X3D-scenegraph
 *
 *	loadExternalXml probably should be method in Networking class and used by Networking nodes
 *	InsertSceneFragment should be a x3dom library method
 */
			loadExternalSuccess: function (xhr) 
			{
				x3dom.debug.logInfo ('loadExternal success routine');
				x3dom.debug.logInfo ('NamespaceName = ' + this._vf.nameSpaceName.toString());
				x3dom.debug.logInfo ('Parameters = ' + this._vf.params.toString());
				var params = [];
				var pieces = [];
				for (var ii=0; ii<this._vf.params.length; ii++) {
					pieces = this._vf.params[ii].toString().split('=');
					params[pieces[0]] = pieces[1];
				}
				x3dom.debug.logInfo ('Creating NV arry complete');
				var inlMarkup = ParseMacro (xhr.responseText, params);
				
//  --> Get XML markup inside the first Scene element
//				var inlScene = this.getInlineSceneNodes (inlMarkup);
				var inlScene = MarkupToXml (inlMarkup);

// --> If XML (meaning X3D code) parses, then append the code to this node.
				if (inlScene !== undefined && inlScene !== null) {
					this._xmlNode.appendChild (inlScene);
				} else {
					that.fireEvents("error");
                };
				inlScene = null;

			},

// --> Parse X3D code from string to XML
			getInlineScene(code) {
				var parser = new DOMParser();
				var xml = parser.parseFromString (code, "text/xml");
				if (xml !== undefined && xml !== null) {
					var inlScene = xml.getElementsByTagName('Scene')[0] || xml.getElementsByTagName('scene')[0];
					var subthis = new Array();
					subthis.serializer = new XMLSerializer();
					subthis.code = '';
					Array.forEach ( inlScene.childNodes, function (childDomNode)
						{
							if (childDomNode instanceof Element) {
								this['code'] += this.serializer.serializeToString(childDomNode);
							}
						}, subthis);
					return subthis.code;
				}
				return '';
			},
			
			
            loadMacro: function ()
            {
				this.loadExternalXml ();
                var inlScene = null, newScene = null, nameSpace = null, xml = null;
				return;
            }
        }
    )
);

x3dom.nodeTypes.Macro.AwaitTranscoding = 202;      // Parameterizable retry state for Transcoder
x3dom.nodeTypes.Macro.MaximumRetries = 15;         // Parameterizable maximum number of retries

/*
 *	Macro expansion code. This eventually will become a new "node"
 */
function ParseMacro (code, params) {
	var xml = null, inlScene = null;
	var fields = Object.getOwnPropertyNames(params);
	var mcode = code;
	var re;
	for (var ii=0; ii<fields.length; ii++) {
		re = new RegExp ("\%" + fields[ii] + "\%", "g");
		mcode = mcode.replace(re, params[fields[ii]]);
	}
	return mcode;
}
function MarkupToXml (markup) {
	var parser = new DOMParser();
//	var xml = parser.parseFromString ('<Scene>' + markup + '</Scene>', "text/xml");
	var xml = parser.parseFromString (markup, "text/xml");
	if (xml !== undefined && xml !== null) {
		inlScene = xml.getElementsByTagName('Scene')[0] || xml.getElementsByTagName('scene')[0];

	} else {
		if (xml && xml.localName)
			x3dom.debug.logError('No Scene in ' + xml.localName);
		else
			x3dom.debug.logError('No Scene in resource');
	}

	return inlScene;
}
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

/*
 *	Countdown timer on the selected object
 *	Makes sure that the first initially found object is
 *	still the first object; otherwise reset
 *	Generate event if at final stage
 *	Otherwise increment countdown stage
 */
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
/*
 * this.x3dElement.context.runtime.canvas.canvas is the canvas
 * this.x3dElement.context.runtime.canvas.doc is the is needed for accessing various things
 * this.x3dElement.context.runtime.canvas.doc._viewarea is the is the Viewarea
 *	x3dom.X3DDocument.prototype.onMouseRelease = function (ctx, x, y, buttonState, prevButton) {...}
 *
 *	this.x3dElement.runtime.canvas.doc.onMouseRelease (
 *		this.x3dElement.runtime.canvas.gl,
 *		x, y, 1, 1);	// for "left" button press & release
 */
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
/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * V4 additions (C)2016 Daly Realism, Los Angeles
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

// ### Animate ###
x3dom.registerNodeType(
    "Animate",
    "Time",
    defineClass(x3dom.nodeTypes.X3DSensorNode,
        
        /**
         * Constructor for Animate
         * @constructs x3dom.nodeTypes.Animate
         * @x3d 3.3
         * @component Time
         * @status full
         * @extends x3dom.nodeTypes.X3DSensorNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc Animate nodes generate events as time passes.
         */
        function (ctx) {
            x3dom.nodeTypes.Animate.superClass.call(this, ctx);

            if (ctx)
                ctx.doc._nodeBag.timer.push(this);
            else
                x3dom.debug.logWarning("Animate: No runtime context found!");


            /**
             * The "cycle" of a Animate node lasts for cycleInterval seconds. The value of cycleInterval shall be greater than zero.
             * @var {x3dom.fields.SFTime} cycleInterval
             * @range [0, inf]
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 1
             * @field x3d
             * @instance
             */
            this.addField_SFTime(ctx, 'cycleInterval', 1);


            /**
             * Specifies whether the timer cycle loops.
             * @var {x3dom.fields.SFBool} loop
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue false
             * @field x3d
             * @instance
             */
            this.addField_SFBool(ctx, 'loop', false);

            /**
             * Sets the startTime for the cycle.
             * @var {x3dom.fields.SFTime} startTime
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 0
             * @field x3d
             * @instance
             */
            this.addField_SFTime(ctx, 'startTime', 0);

            /**
             * Sets a time for the timer to stop.
             * @var {x3dom.fields.SFTime} stopTime
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 0
             * @field x3d
             * @instance
             */
            this.addField_SFTime(ctx, 'stopTime', 0);

            /**
             * Sets a time for the timer to pause.
             * @var {x3dom.fields.SFTime} pauseTime
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 0
             * @field x3d
             * @instance
             */
            this.addField_SFTime(ctx, 'pauseTime', 0);

            /**
             * Sets a time for the timer to resume from pause.
             * @var {x3dom.fields.SFTime} resumeTime
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 0
             * @field x3d
             * @instance
             */
            this.addField_SFTime(ctx, 'resumeTime', 0);


            /**
             * A cycleTime outputOnly field can be used for synchronization purposes such as sound with animation.
             * The value of a cycleTime event will be equal to the time at the beginning of the current cycle. A cycleTime event is generated at the beginning of every cycle, including the cycle starting at startTime.
             * The first cycleTime event for a Animate node can be used as an alarm (single pulse at a specified time).
             * @var {x3dom.fields.SFTime} cycleTime
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 0
             * @field x3d
             * @instance
			 *
			 *	Not a field (event) for Animation. Leftover from TimeSensor.
             */
            //this.addField_SFTime(ctx, 'cycleTime', 0);

            /**
             * The elapsedTime outputOnly field delivers the current elapsed time since the Animate was activated and running, cumulative in seconds and not counting any time while in a paused state.
             * @var {x3dom.fields.SFTime} elapsedTime
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 0
             * @field x3d
             * @instance
			 *
			 *	Not a field (event) for Animation. Leftover from TimeSensor.
             */
            //this.addField_SFTime(ctx, 'elapsedTime', 0);

            /**
             * fraction_changed events output a floating point value in the closed interval [0, 1]. At startTime the value of fraction_changed is 0. After startTime, the value of fraction_changed in any cycle will progress through the range (0.0, 1.0].
             * @var {x3dom.fields.SFFloat} fraction_changed
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 0
             * @field x3d
             * @instance
			 *
			 *	Not a field (event) for Animation. Leftover from TimeSensor.
             */
            //this.addField_SFFloat(ctx, 'fraction_changed', 0);

            /**
             * Outputs whether the timer is active.
             * @var {x3dom.fields.SFBool} isActive
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue false
             * @field x3d
             * @instance
             */
            this.addField_SFBool(ctx, 'isActive', false);

            /**
             * Outputs whether the timer is paused.
             * @var {x3dom.fields.SFBool} isPaused
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue false
             * @field x3d
             * @instance
             */
            this.addField_SFBool(ctx, 'isPaused', false);

            /**
             * The time event sends the absolute time for a given tick of the Animate node.
             * @var {x3dom.fields.SFTime} time
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 0
             * @field x3d
             * @instance
			 *
			 *	Field (event) not implemented for Animation. May not exist in final form.
             */
            //this.addField_SFTime(ctx, 'time', 0);

            /**
             * Starts Animate -- inputOnly
             * @var {x3dom.fields.SFBool} start
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue true
             * @field x3dv4
             * @instance
             */
            this.addField_SFBool(ctx, 'start', true);

            /**
             * Stop Animate -- inputOnly
             * @var {x3dom.fields.SFBool} stop
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue false
             * @field x3dv4
             * @instance
             */
            this.addField_SFBool(ctx, 'stop', false);

            /**
             * Animation maximum frame rate (frames per second)
             * @var {x3dom.fields.SFBool} maxFrameRate
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 30
             * @field x3dv4
             * @instance
             */
            this.addField_SFFloat(ctx, 'maxFrameRate', 30);

            /**
             * Interpolator nodes
             * @var {x3dom.fields.SFBool} interpolate
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue []
             * @field x3dv4
             * @instance
             */
            this.addField_MFNode('interpolate', x3dom.nodeTypes.X3DInterpolatorNode);

            /**
             *
             * @var {x3dom.fields.SFBool} first
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue true
             * @field x3dom
             * @instance
             */
            this.addField_SFBool(ctx,'first', true);

            /**
             *
             * @var {x3dom.fields.SFFloat} firstCycle
             * @memberof x3dom.nodeTypes.Animate
             * @initvalue 0.0
             * @field x3dom
             * @instance
             */
            this.addField_SFFloat(ctx,'firstCycle', 0.0);

            this._prevCycle = -1;
            this._lastTime = 0;
            this._cycleStopTime = 0;
            this._activatedTime = 0;

            if (this._vf.startTime > 0) {
                this._updateCycleStopTime();
            }

            this._backupStartTime = this._vf.startTime;
            this._backupStopTime = this._vf.stopTime;
            this._backupCycleInterval = this._vf.cycleInterval;
			this._frameInterval = 1.0/Math.max(1.0, Math.min(1000.0, this._vf.maxFrameRate));
        
        },
        {
            tick: function (time)
            {
                if (!this._vf.enabled) {
                    this._lastTime = time;
                    return false;
                }
				
				delta = time-this._lastRenderedTime;
//				console.log ('Delta = ' + delta + '; min Interval = ' + this._frameInterval + '\n');
				if (delta < this._frameInterval) {
					return false;
				}
//				console.log ('Animate at time ' + time+'\n');
				this._lastRenderedTime = time;

                var isActive = ( this._vf.cycleInterval > 0 &&
                    time >= this._vf.startTime &&
                    (time < this._vf.stopTime || this._vf.stopTime <= this._vf.startTime) &&
                    (this._vf.loop == true || (this._vf.loop == false && time < this._cycleStopTime)) );

                if (isActive && !this._vf.isActive) {
                    this.postMessage('isActive', true);
                    this._activatedTime = time;
                }

                // Checking for this._vf.isActive allows the dispatch of 'final events' (before deactivation)
                if (isActive || this._vf.isActive) {
                    //this.postMessage('elapsedTime', time - this._activatedTime);

                    var isPaused = ( time >= this._vf.pauseTime && this._vf.pauseTime > this._vf.resumeTime );

                    if (isPaused && !this._vf.isPaused) {
                        this.postMessage('isPaused', true);
                        //this.postMessage('pauseTime', time);
                    } else if (!isPaused && this._vf.isPaused) {
                        this.postMessage('isPaused', false);
                        //this.postMessage('resumeTime', time);
                    }

                    if (!isPaused) {
                        var cycleFrac = this._getCycleAt(time);
                        var cycle = Math.floor(cycleFrac);

                        var cycleTime = this._vf.startTime + cycle*this._vf.cycleInterval;
                        var adjustTime = 0;

                        if (this._vf.stopTime > this._vf.startTime &&
                            this._lastTime < this._vf.stopTime && time >= this._vf.stopTime)
                            adjustTime = this._vf.stopTime;
                        else if (this._lastTime < cycleTime && time >= cycleTime)
                            adjustTime = cycleTime;

                        if( adjustTime > 0 ) {
                            time = adjustTime;
                            cycleFrac = this._getCycleAt(time);
                            cycle = Math.floor(cycleFrac);
                        }

                        var fraction = cycleFrac - cycle;
						//console.log ('Animate at time ' + time + ' -- ' + fraction + '\n');
						
						for (ii=0; ii<this._cf.interpolate.nodes.length; ii++) {
							this._cf.interpolate.nodes[ii].doInterpolate(fraction);
						}

                        if (fraction < x3dom.fields.Eps) {
                            fraction = ( this._lastTime < this._vf.startTime ? 0.0 : 1.0 );
                            //this.postMessage('cycleTime', time);
                        }

                        //this.postMessage('fraction_changed', fraction);
                        //this.postMessage('time', time);
                    }
                }

                if (!isActive && this._vf.isActive)
                    this.postMessage('isActive', false);

                this._lastTime = time;

                return true;
            },

            fieldChanged: function(fieldName)
            {
                if (fieldName == "enabled") {
                    // TODO; eval other relevant outputs
                    if (!this._vf.enabled && this._vf.isActive) {
                        this.postMessage('isActive', false);
                    }
                }
                else if (fieldName == "startTime") {
                    // Spec: Should be ignored when active. (Restore old value)
                    if (this._vf.isActive) {
                        this._vf.startTime = this._backupStartTime;
                        return;
                    }

                    this._backupStartTime = this._vf.startTime;
                    this._updateCycleStopTime();
                }
                else if (fieldName == "stopTime") {
                    // Spec: Should be ignored when active and less than startTime. (Restore old value)
                    if (this._vf.isActive && this._vf.stopTime <= this._vf.startTime) {
                        this._vf.stopTime = this._backupStopTime;
                        return;
                    }

                    this._backupStopTime = this._vf.stopTime;
                }
                else if (fieldName == "cycleInterval") {
                    // Spec: Should be ignored when active. (Restore old value)
                    if (this._vf.isActive) {
                        this._vf.cycleInterval = this._backupCycleInterval;
                        return;
                    }

                    this._backupCycleInterval = this._vf.cycleInterval;
                }
                else if (fieldName == "loop") {
                    this._updateCycleStopTime();
                }
            },

            parentRemoved: function(parent)
            {
                if (this._parentNodes.length === 0) {
                    var doc = this.findX3DDoc();

                    for (var i=0, n=doc._nodeBag.timer.length; i<n; i++) {
                        if (doc._nodeBag.timer[i] === this) {
                            doc._nodeBag.timer.splice(i, 1);
                        }
                    }
                }
            },

            _getCycleAt: function(time)
            {
                return Math.max( 0.0, time - this._vf.startTime ) / this._vf.cycleInterval;
            },

            _updateCycleStopTime: function()
            {
                if (this._vf.loop == false) {
                    var now = new Date().getTime() / 1000;
                    var cycleToStop = Math.floor(this._getCycleAt(now)) + 1;

                    this._cycleStopTime = this._vf.startTime + cycleToStop*this._vf.cycleInterval;
                }
                else {
                    this._cycleStopTime = 0;
                }
            }
        }
    )
);