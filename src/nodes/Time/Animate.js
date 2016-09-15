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