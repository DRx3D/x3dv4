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
 *	Use MACRO expansion of embedded code to achieve results
 */
            loadMacro: function ()
            {
                var inlScene = null, newScene = null, nameSpace = null, xml = null;

				var params = {
							};
				var nameSpaceName = 'int';
				var nsName = (this._vf.nameSpaceName.length != 0) ? this._vf.nameSpaceName.toString().replace(' ','') : "";
				var url = this._vf.url.length ? this._vf.url[0] : "";
				var url = new Array ('_internal__');

//				var inlScene = ParseMacro (this._vf.expand, params);
				var newScene = InsertSceneFragment (this._vf.expand, params, nsName, url, this._vf.mapDEFToID, this);
				var that = this;
/*
					if (inlScene) {
                        nameSpace = new x3dom.NodeNameSpace(nsName, that._nameSpace.doc);

                        if ((url[0] === '/') || (url.indexOf(":") >= 0))
                            nameSpace.setBaseURL(url);
                        else
                            nameSpace.setBaseURL(that._nameSpace.baseURL + url);

                        newScene = nameSpace.setupTree(inlScene);
                        that._nameSpace.addSpace(nameSpace);

                        if(that._vf.nameSpaceName.length != 0) {
                            Array.forEach ( inlScene.childNodes, function (childDomNode)
                            {
                                if(childDomNode instanceof Element)
                                {
									x3dom.debug.logInfo('Loading node from Macro: ' + childDomNode + ' (' + childDomNode._x3domNode._DEF + ')');
                                    setNamespace(that._vf.nameSpaceName, childDomNode, that._vf.mapDEFToID);
                                    that._xmlNode.appendChild(childDomNode);
                                }
                            } );
                        }
                    } else {
                        if (xml && xml.localName)
                            x3dom.debug.logError('No Scene in ' + xml.localName);
                        else
                            x3dom.debug.logError('No Scene in resource');
                    }
 */
 
                    // trick to free memory, assigning a property to global object, then deleting it
                    var global = x3dom.getGlobal();

                    if (that._childNodes.length > 0 && that._childNodes[0] && that._childNodes[0]._nameSpace)
                        that._nameSpace.removeSpace(that._childNodes[0]._nameSpace);

                    while (that._childNodes.length !== 0)
                        global['_remover'] = that.removeChild(that._childNodes[0]);

                    delete global['_remover'];

                    if (newScene)
                    {
                        that.addChild(newScene);

                        that.invalidateVolume();
                        //that.invalidateCache();

                        that._nameSpace.doc.downloadCount -= 1;
                        that._nameSpace.doc.needRender = true;
                        x3dom.debug.logInfo('Macro: added ' + that._vf.url[0] + ' to scene.');

                        // recalc changed scene bounding box twice
                        var theScene = that._nameSpace.doc._scene;

                        if (theScene) {
                            theScene.invalidateVolume();
                            //theScene.invalidateCache();

                            window.setTimeout( function() {
                                that.invalidateVolume();
                                //that.invalidateCache();

                                theScene.updateVolume();
                                that._nameSpace.doc.needRender = true;
                            }, 1000 );
                        }

                        that.fireEvents("load");
                    }

                    newScene = null;
                    nameSpace = null;
                    inlScene = null;
                    xml = null;

//                    return xhr;
//                };

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
	var parser = new DOMParser();
	var xml = parser.parseFromString ('<Scene>' + mcode + '</Scene>', "text/xml");
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

function InsertSceneFragment (code, params, nsName, url, mapDEFToID, that) {

	var nameSpace = null, newScene = null, inlScene = null;
	inlScene = ParseMacro (code, params);

/*
 *	Need to create subscene when no namespace is defined -- similar to addChildren event 
 *	so the result goes into the same namespace as the parent node
 */

	if (inlScene) {
		if (nsName != "") {
			nameSpace = new x3dom.NodeNameSpace(nsName, that._nameSpace.doc);

			if ((url[0] === '/') || (url.indexOf(":") >= 0))
				nameSpace.setBaseURL(url);
			else
				nameSpace.setBaseURL(that._nameSpace.baseURL + url);

			newScene = nameSpace.setupTree(inlScene);
			that._nameSpace.addSpace(nameSpace);

			Array.forEach (inlScene.childNodes,
							function (childDomNode) {
								if(childDomNode instanceof Element) {
									x3dom.debug.logInfo('Loading node from Macro: ' + childDomNode.localName + ' (' + childDomNode._x3domNode._DEF + ')');
									if (childDomNode.localName == 'Shape') {
										console.log('Processing Shape node');
									} else if (childDomNode.localName.substr(0,6).toLowerCase() == 'shader') {
										console.log('Processing Shader* node');
									}
									setNamespace(nsName, childDomNode, mapDEFToID);
									that._xmlNode.appendChild(childDomNode);
								}
							}
							);
		} else {
			Array.forEach (inlScene.childNodes,
							function (childDomNode) {
								if(childDomNode instanceof Element) {
									//x3dom.debug.logInfo('Loading node from Macro: ' + childDomNode + ' (' + childDomNode._x3domNode._DEF + ')');
									that._xmlNode.appendChild(childDomNode);
								}
							}
							);
		}
	}
	return newScene;
}


function setNamespace(prefix, childDomNode, mapDEFToID)
{
    if(childDomNode instanceof Element && childDomNode.__setAttribute !== undefined) {

        if(childDomNode.hasAttribute('id') )	{
            childDomNode.__setAttribute('id', prefix.toString().replace(' ','') +'__'+ childDomNode.getAttribute('id'));
        } else if (childDomNode.hasAttribute('DEF') && mapDEFToID){
            childDomNode.__setAttribute('id', prefix.toString().replace(' ','') +'__'+ childDomNode.getAttribute('DEF'));
            // workaround for Safari
            if (!childDomNode.id)
                childDomNode.id = childDomNode.__getAttribute('id');
        }
    }

    if(childDomNode.hasChildNodes()){
        Array.forEach ( childDomNode.childNodes, function (children) {
            setNamespace(prefix, children, mapDEFToID);
        } );
    }
}
