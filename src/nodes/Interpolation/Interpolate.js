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