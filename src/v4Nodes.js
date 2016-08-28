/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
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
/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
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
);
/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
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
