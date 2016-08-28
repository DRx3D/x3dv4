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
