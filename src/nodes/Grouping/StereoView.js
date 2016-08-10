/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

/* ### Viewpoint ### */
//	    defineClass(x3dom.nodeTypes.X3DViewpointNode,

x3dom.registerNodeType(
    "StereoView",
    "Grouping",
	defineClass(x3dom.nodeTypes.X3DGroupingNode,
        
        /**
         * Constructor for StereoViewpoint
         * @constructs x3dom.nodeTypes.StereoViewpoint
         * @x3d 4.0
         * @component Grouping
         * @status experimental
         * @extends x3dom.nodeTypes.X3DViewpointNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc Viewpoint provides a specific location and direction where the user may view the scene.
         * The principalPoint extention allows to set asymmetric frustums.
         */
        function (ctx) {
            x3dom.nodeTypes.StereoView.superClass.call(this, ctx);


            /**
             * Indicates mode of this viewpoint. 
             * STEREO indicates display is stereographic. MONO indicates display is monographic
             * @var {x3dom.fields.SFBool} mode
             * @range "STEREO" | "MONO"
             * @memberof x3dom.nodeTypes.StereoViewpoint
             * @initvalue "STEREO"
             * @field V4
             * @instance
             */
            this.addField_SFString(ctx, 'mode', 'STEREO');

            /**
             * Distance between "eyes" for constructing stereographic display
             * Small field of view roughly corresponds to a telephoto lens, large field of view roughly corresponds to a wide-angle lens.
             * Hint: modifying Viewpoint distance to object may be better for zooming.
             * Warning: A value of 0 is essentially a monographic display. A large value may cause significant paralax.
             * @var {x3dom.fields.SFFloat} interpupillaryDistance
             * @range [0, +inf)
             * @memberof x3dom.nodeTypes.StereoViewpoint
             * @initvalue 0.3
             * @field C4
             * @instance
             */
            this.addField_SFFloat(ctx, 'interpupillaryDistance', 0.3);

            /**
             * The Viewpoint to use for this View. 
             * Hint: Best to define the viewpoint then "USE" it here (rquired)
             * @var {x3dom.fields.SFVec3f} viewpointDef
             * @range 
             * @memberof x3dom.nodeTypes.StereoView
             * @initvalue ""
             * @field V4
             * @instance
             */
            this.addField_SFString(ctx, 'viewpointDef', "");

            /**
             * The background to use for this View 
             * Hint: Best to define a Background then "USE" it here (required)
             * @var {x3dom.fields.SFString} backgroundDef
             * @range 
             * @memberof x3dom.nodeTypes.StereoView
             * @initvalue ""
             * @field V4
             * @instance
             */
            this.addField_SFString(ctx, 'backgroundDef', "");

            /**
             * The Group to use for this View. This is the content that is displayed.
             * Hint: Best to define the model then "USE" it here (rquired)
             * @var {x3dom.fields.SFVec3f} groupDef
             * @range 
             * @memberof x3dom.nodeTypes.StereoView
             * @initvalue ""
             * @field V4
             * @instance
             */
            this.addField_SFString(ctx, 'groupDef', "");

            /**
             * Specifies the namespace of the Inline node.
             * @var {x3dom.fields.MFString} nameSpaceName
             * @memberof x3dom.nodeTypes.Inline
             * @initvalue []
             * @field x3dom
             * @instance
             */
            //this.addField_MFString(ctx, 'nameSpaceName', []);

            /**
             * The field that contains all of the expansion nodes
             * Hint: This field should only be used internally
             * @var {x3dom.fields.SFVec3f} groupDef
             * @range 
             * @memberof x3dom.nodeTypes.StereoView
             * @initvalue []
             * @field V4
             * @instance
             */
            //this.addField_SFString(ctx, 'expansion', "");

            /**
             * Each specified URL shall refer to a valid X3D file that contains a list of children nodes, prototypes and routes at the top level. Hint: Strings can have multiple values, so separate each string by quote marks. Warning: strictly match directory and filename capitalization for http links!
             * Hint: This field should only be used internally
             * @var {x3dom.fields.MFString} url
             * @memberof x3dom.nodeTypes.Inline
             * @initvalue []
             * @field x3d
             * @instance
             */
            //this.addField_MFString(ctx, 'url', ['_internal_']);

            this.initDone = false;
        },
        {
            nodeChanged: function () {
                if (!this.initDone) {
                    this.initDone = true;
					this.uniqueDef = '';
                    this.createView();
					this.rootGroupNode = this._nameSpace.defMap[this.uniqueDef+'_Stereo']._xmlNode;
                }
            },

/*
 *	Handles fields that can change. At this time, it is only 'mode'
 */ 
            fieldChanged: function (fieldName) {
                if (fieldName == "mode") {
					var newMode = this._vf.mode;
					newMode = (newMode.toUpperCase() == 'STEREO' || newMode.toUpperCase() == 'MONO') ? newMode.toUpperCase() : '';
//					if (newMode != '' && this.uniqueDef != '') {
//						this.rootGroupNode.setFieldValue('render', newMode);
					if (newMode == 'MONO' && this.rootGroupNode != undefined) {
						//this.rootGroupNode.remove();
						this._xmlNode.removeChild(this.rootGroupNode);
						this.initDone = false;
					} else if (newMode == 'STEREO') {
						this.nodeChanged();
					}
				}
			},

/*
 *	May need to define (i.e., code) the operation when 'mode' changes from 'STEREO' to 'MONO' or vice versa.
 *	I think the best way to do this is to change the 'render' attribute of the first Group node.
 *	Also, some soft of unique name needs to be provided for the generated code. This should derrive from the ID of StereoView
 *		or if one is not present, then randomly generated.
 *	It may be necessary/good-idea to also handle other StereoView fields that have connections to internal values (e.g., interpupillaryDistance)
 *	The *Def fields need to be handled too, at least GroupDef does so different models can be viewed.
 */
			
/*
 *	Use MACRO expansion of embedded code to achieve results
 */
			createView: function() {

                var that = this;
				this.uniqueDef = generateUniqueId (this);

				var code = this.getStereoNodeExpansion(this.uniqueDef);
// use jQuery to append this code as a child of the StereoView node.

				var inlScene = null, xml = null;
				xml = this.parseX3dCode('<Scene>' + code + '</Scene>');

				//TODO; check if exists and FIXME: it's not necessarily the first scene in the doc!
				if (xml !== undefined && xml !== null) {
					inlScene = xml.getElementsByTagName('Scene')[0] || xml.getElementsByTagName('scene')[0];
				} else {
					that.fireEvents("error");
				}

// --> If XML (meaning X3D code) parses, then append the code to this node.
				if (inlScene) {
					$(this._xmlNode).append (code)
                };
				inlScene = null;
				xml = null;
			},
			
// --> Method to provide Node expansion with parameter substitution
			getStereoNodeExpansion: function(uniqueId) {
				var shaderVertexLeft = ' attribute vec3 position;\n attribute vec2 texcoord;\n uniform mat4 modelViewProjectionMatrix;\n varying vec2 fragTexCoord;\n void main() {\n  vec2 pos = sign(position.xy);\n  fragTexCoord = texcoord;\n  gl_Position = vec4((pos.x/2.0)-0.5, pos.y, 0.0, 1.0);\n }\n';
				var shaderVertexRight = ' attribute vec3 position;\n attribute vec2 texcoord;\n uniform mat4 modelViewProjectionMatrix;\n varying vec2 fragTexCoord;\n void main() {\n  vec2 pos = sign(position.xy);\n  fragTexCoord = texcoord;\n  gl_Position = vec4((pos.x + 1.0) / 2.0, pos.y, 0.0, 1.0);\n }\n';
				var shaderFragment = ' #ifdef GL_ES\n  precision highp float;\n #endif\n uniform sampler2D tex;\n uniform float leftEye;\n varying vec2 fragTexCoord;\n void main() {\n  gl_FragColor = texture2D(tex, fragTexCoord);\n }\n';

				var test = '';
				var test2 = "";
				var code = "\
<Group id='StereoRendering' DEF='%uniqueId%_Stereo' render='%render%'>\
	<group DEF='left'>\
		<shape>\
			<appearance>\
				<material id='ShaderLeftMaterial' DEF='ShaderLeftMaterial' diffuseColor='.5 1 0'></material>\
				<renderedTexture interpupillaryDistance='%interpupillaryDistance%' id='rtLeft' stereoMode='LEFT_EYE' update='ALWAYS' dimensions='%displaySize%' repeatS='false' repeatT='false'>\
					<viewpoint USE='%useViewpoint%' containerField='viewpoint'></viewpoint>\
					<background USE='%useBackground%' containerField='background'></background>\
					<group USE='%useGroup%' containerField='scene'></group>\
				</renderedTexture>\
				<composedShader>\
					<field name='tex' type='SFInt32' value='0'></field>\
					<field name='leftEye' type='SFFloat' value='1'></field>\
					<shaderPart id='ShaderVertex1' DEF='ShaderVertex1' type='VERTEX'>\n";
				code = code + shaderVertexLeft + "							</shaderPart>\
					<shaderPart id='frag' DEF='ShaderFrag' type='FRAGMENT'>\n";
				code = code + shaderFragment + "							</shaderPart>\
				</composedShader>\
			</appearance>\
			<plane solid='false'></plane>\
		</shape>\
	</group>\
	<group DEF='right'>\
		<shape>\
			<appearance>\
				<material id='ShaderRightMaterial' DEF='ShaderRightMaterial' diffuseColor='0 1 .5'></material>\
				<renderedTexture interpupillaryDistance='%interpupillaryDistance%' id='rtRight' stereoMode='RIGHT_EYE' update='ALWAYS' dimensions='%displaySize%' repeatS='false' repeatT='false'>\
					<viewpoint USE='%useViewpoint%' containerField='viewpoint'></viewpoint>\
					<background USE='%useBackground%' containerField='background'></background>\
					<group USE='%useGroup%' containerField='scene'></group>\
				</renderedTexture>\
				<composedShader>\
					<field name='tex' type='SFInt32' value='0'></field>\
					<field name='leftEye' type='SFFloat' value='0'></field>\
					<shaderPart id='ShaderVertex2' DEF='ShaderVertex2' type='VERTEX'>\n";
				code = code + shaderVertexRight + "							</shaderPart>\
					<shaderPart id='fragUSE' USE='ShaderFrag' type='FRAGMENT'></shaderPart>\
				</composedShader>\
			</appearance>\
		<plane solid='false'></plane>\
		</shape>\
	</group>\
</Group>";

				var params = {
								'render'					: ((this._vf.mode.toUpperCase() == "STEREO") ? true : false),
								'interpupillaryDistance'	: this._vf.interpupillaryDistance,
								'useViewpoint'				: this._vf.viewpointDef,
								'useBackground'				: this._vf.backgroundDef,
								'useGroup'					: this._vf.groupDef,
								'displaySize'				: '384 384 4',
								'size'						: '.1 .3 10',
								'sizeZ'						: '.1 .3 10',
								'sizeY'						: '.1 10 .3',
								'color'						: '1 .5 0',
								'uniqueId'					: uniqueId
							};
							
				var fields = Object.getOwnPropertyNames(params);
				var mcode = code;
				var re;
				for (var ii=0; ii<fields.length; ii++) {
					re = new RegExp ("\%" + fields[ii] + "\%", "g");
					mcode = mcode.replace(re, params[fields[ii]]);
				}
				
				return mcode;
			},
			
//  --> Parse XML text into DOM
			parseX3dCode(code) {
				var parser = new DOMParser();
				var xml = parser.parseFromString (code, "text/xml");
				return xml;
			}
		}
    )
);

function generateUniqueId (obj) {
	return 's1';
}