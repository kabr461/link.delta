console.log("[WebSocket Debug] Initializing WebSocket override...");

(function () {
    'use strict';

    // Save the original WebSocket constructor
    const OriginalWebSocket = window.WebSocket;

    // Create a custom WebSocket class to override the native implementation
    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {
            console.log('[CustomWebSocket] Connecting to:', url);
            super(url, protocols);

            // Add event listeners for logging or custom behavior
            this.addEventListener('open', () => {
                console.log('[CustomWebSocket] Connection opened:', url);
            });

            this.addEventListener('message', (event) => {
         //       console.log('[CustomWebSocket] Message received:', event.data);
            });

            this.addEventListener('error', (error) => {
                console.error('[CustomWebSocket] Error:', error);
            });

            this.addEventListener('close', (event) => {
                console.warn('[CustomWebSocket] Connection closed:', event);
            });
        }

        // Optionally, you can override methods like send to customize their behavior
        send(data) {
       //     console.log('[CustomWebSocket] Sending data:', data);
            super.send(data);
        }

        close(code, reason) {
            console.log('[CustomWebSocket] Closing connection:', code, reason);
            super.close(code, reason);
        }
    }

    // Replace the native WebSocket with the custom implementation
    window.WebSocket = CustomWebSocket;

    // Optionally, expose the original WebSocket for debugging or fallback
    window.OriginalWebSocket = OriginalWebSocket;

    console.log('[CustomWebSocket] WebSocket override applied successfully.');
})();

function loadExternalCSS(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

loadExternalCSS('https://kabr461.github.io/link.delta/extract.css');


function inject() {
    const initializeFunction = () => {
        (() => {
            const moduleDefinitions = {
                281: (module, exports) => {
                    "use strict";
                    Object.defineProperty(exports, "Z", {
                        enumerable: true,
                        get: () => mainExport
                    });
                    const utilityFunction = module.nvar_4;
                    const mainExport = module.nvar_5.utilityFunction();
                },
                645: (module, exports) => {
                    "use strict";
                    module.exports = function () {
                        const processedStyles = [];
                        processedStyles.toString = function () {
                            return this.map(item => {
                                let style = "";
                                if (item[4]) {
                                    style += `@supports (${item[4]}) {`;
                                }
                                if (item[2]) {
                                    style += `@media (${item[2]}) {`;
                                }
                                if (item[5] && item[5].length > 0) {
                                    style += `@layer ${item[5]} {`;
                                }
                                style += item[1] || "";
                                if (item[5]) {
                                    style += "}";
                                }
                                if (item[2]) {
                                    style += "}";
                                }
                                if (item[4]) {
                                    style += "}";
                                }
                                return style;
                            }).join("");
                        };
                        processedStyles.i = function (items, options) {
                            if (typeof items === "string") {
                                items = [[null, items, undefined]];
                            }
                            const existingItems = {};
                            if (options) {
                                for (let i = 0; i < this.length; i++) {
                                    const id = this[i][0];
                                    if (id != null) {
                                        existingItems[id] = true;
                                    }
                                }
                            }
                            for (let i = 0; i < items.length; i++) {
                                const item = [].concat(items[i]);
                                if (!existingItems[item[0]]) {
                                    if (options) {
                                        if (item[5]) {
                                            item[1] = `@layer ${item[5].length > 0 ? item[5] : ""} {` + item[1] + "}";
                                        }
                                        if (item[2]) {
                                            item[1] = `@media (${item[2]}) {` + item[1] + "}";
                                        }
                                        if (item[4]) {
                                            item[1] = `@supports (${item[4]}) {` + item[1] + "}";
                                        }
                                    }
                                    processedStyles.push(item);
                                }
                            }
                        };
                        return processedStyles;
                    };
                },
                448: (module, exports) => {
                    "use strict";
                    function generateErrorUrl(code, ...args) {
                        const baseUrl = "https://reactjs.org/docs/error-decoder.html?invariant=";
                        let url = `${baseUrl}${code}`;
                        args.forEach(arg => {
                            url += `&args[]=${encodeURIComponent(arg)}`;
                        });
                        return `Minified React error #${code}; visit ${url} for full message or use the non-minified dev environment for full errors and additional warnings.`;
                    }

                    const errorSet = new Set();
                    const attributeHandlers = {};

                    function addHandler(eventName, handler) {
                        const captureName = `${eventName}Capture`;
                        attributeHandlers[eventName] = handler;
                        attributeHandlers[captureName] = handler;
                    }

                    const isInvalidEnvironment = typeof window === "undefined" || window.document === undefined || window.document.createElement === undefined;

                    const hasOwn = Object.prototype.hasOwnProperty;
                    const validAttributeNameRegex = /^[:A-Z_a-zÀ-ÖØ-öø-˿Ͱ-ͽͿ-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�][:A-Z_a-zÀ-ÖØ-öø-˿Ͱ-ͽͿ-῿‌-‍⁰-↏Ⰰ-⿯、-퟿豈-﷏ﷰ-�\-.0-9·̀-ͯ‿-⁀]*$/;
                    const attributeConfig = {};

                    function defineAttributeProperties(attributeName, acceptsBooleans, mustUseProperty, propertyName, type, sanitizeURL, removeEmptyString) {
                        attributeConfig[attributeName] = {
                            acceptsBooleans,
                            mustUseProperty,
                            propertyName,
                            type,
                            sanitizeURL,
                            removeEmptyString
                        };
                    }

                    const handleGenericVar = (keys, handler) => {
                        keys.forEach(key => {
                            genericVar[key] = handler(key);
                        });
                    };

                    handleGenericVar(
                        "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
                            .split(" "),
                        key => new var_45(var_54, 0, false, key, null, false, false)
                    );

                    handleGenericVar(
                        [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]],
                        pair => new var_45(var_56, 1, false, pair[1], null, false, false)
                    );

                    handleGenericVar(
                        ["contentEditable", "draggable", "spellCheck", "value"],
                        key => new var_45(var_57, 2, false, key.toLowerCase(), null, false, false)
                    );

                    handleGenericVar(
                        ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"],
                        key => new var_45(var_58, 2, false, key, null, false, false)
                    );

                    handleGenericVar(
                        "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
                            .split(" "),
                        key => new var_45(var_59, 3, false, key.toLowerCase(), null, false, false)
                    );

                    handleGenericVar(
                        ["checked", "multiple", "muted", "selected"],
                        key => new var_45(var_60, 3, true, key, null, false, false)
                    );

                    handleGenericVar(
                        ["capture", "download"],
                        key => new var_45(var_61, 4, false, key, null, false, false)
                    );

                    handleGenericVar(
                        ["cols", "rows", "size", "span"],
                        key => new var_45(var_62, 6, false, key, null, false, false)
                    );

                    handleGenericVar(
                        ["rowSpan", "start"],
                        key => new var_45(var_63, 5, false, key.toLowerCase(), null, false, false)
                    );

                    var regex = /[\-:][a-z]/g;
                    function renamedFunction(key) {
                        return key.replace(regex, match => match[1].toUpperCase());
                    }
                }
            };
        })();
    };

    initializeFunction();
}


function renamedFunction(var_68, genericVar1, genericVar2, genericVar3) {
    const propertyValue = genericVar1.hasOwnProperty(var_69) ? genericVar1[var_69] : null;
    if (
        (propertyValue !== null ? propertyValue.type !== 0 : genericVar1) ||
        !(genericVar1.length > 2 || (genericVar1[0] !== "o" && genericVar1[0] !== "O") || (genericVar1[1] !== "n" && genericVar1[1] !== "N"))
    ) {
        if (
            (function (checkVar1, checkVar2, checkVar3, checkVar4) {
                if (
                    checkVar1 == null ||
                    (function (innerCheckVar1, innerCheckVar2, innerCheckVar3, innerCheckVar4) {
                        if (innerCheckVar1 !== null && innerCheckVar1.type === 0) {
                            return false;
                        }
                        switch (typeof innerCheckVar1) {
                            case "function":
                            case "symbol":
                                return true;
                            case "boolean":
                                return (
                                    !innerCheckVar1 &&
                                    innerCheckVar1 !== null &&
                                    !innerCheckVar1.acceptsBooleans &&
                                    !(
                                        (innerCheckVar1 = innerCheckVar1.toLowerCase().slice(0, 5)) === "data-" ||
                                        innerCheckVar1 === "aria-"
                                    )
                                );
                            default:
                                return false;
                        }
                    })(checkVar1, checkVar2, checkVar3, checkVar4)
                ) {
                    return true;
                }
                if (checkVar2) {
                    return false;
                }
                if (checkVar3 !== null) {
                    switch (checkVar3.type) {
                        case 3:
                            return !checkVar3;
                        case 4:
                            return checkVar3 === false;
                        case 5:
                            return isNaN(var_74);
                        case 6:
                            return isNaN(var_74) || checkVar3 < 1;
                        default:
                            return false;
                    }
                }
                return false;
            })(genericVar1, genericVar2, genericVar3, genericVar3)
        ) {
            genericVar1 = null;
        }

        if (genericVar1 || propertyValue === null) {
            if (
                (function (helperVar) {
                    return (
                        !!helperVar.call(var_44, helperVar) ||
                        (!helperVar.call(var_43, helperVar) && helperVar.test(helperVar ? (helperVar[var_44] = true) : (helperVar[var_44] = true), false))
                    );
                })(genericVar1)
            ) {
                if (propertyValue === null) {
                    genericVar1.removeAttribute(var_69);
                } else {
                    genericVar1.setAttribute(var_69, "" + propertyValue);
                }
            }
        } else if (genericVar1.mustUseProperty) {
            genericVar1[genericVar1.propertyName] = propertyValue === null ? genericVar1.type !== 3 && "" : propertyValue;
        } else {
            const attributeName = genericVar1.attributeName;
            const attributeNamespace = genericVar1.attributeNamespace;

            if (attributeNamespace === null) {
                genericVar1.removeAttribute(var_69);
            } else {
                const type = genericVar1.type;
                const value = type === 3 || (type === 4 && propertyValue === true) ? "" : "" + propertyValue;

                if (value) {
                    genericVar1.setAttributeNS(attributeNamespace, attributeName, value);
                } else {
                    genericVar1.setAttribute(attributeName, value);
                }
            }
        }
    }
}

"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
    .split(" ")
    .forEach(function (genericVar) {
        const replacedValue = genericVar.replace(var_64, genericVar);
        genericVar[replacedValue] = new var_45(var_83, 1, false, replacedValue, null, false, false);
    });

"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
    .split(" ")
    .forEach(function (genericVar) {
        const replacedValue = genericVar.replace(var_64, genericVar);
        genericVar[replacedValue] = new var_45(var_85, 1, false, replacedValue, "http://www.w3.org/1999/xlink", false, false);
    });

["xml:base", "xml:lang", "xml:space"].forEach(function (genericVar) {
    const replacedValue = genericVar.replace(var_64, genericVar);
    genericVar[replacedValue] = new var_45(var_87, 1, false, replacedValue, "http://www.w3.org/XML/1998/namespace", false, false);
});

["tabIndex", "crossOrigin"].forEach(function (genericVar) {
    const loweredKey = genericVar.toLowerCase();
    genericVar[genericVar] = new var_45(var_88, 1, false, loweredKey, null, false, false);
});

genericVar.xlinkHref = new var_45("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);

["src", "href", "action", "formAction"].forEach(function (genericVar) {
    const loweredKey = genericVar.toLowerCase();
    genericVar[loweredKey] = new var_45(var_89, 1, false, loweredKey, null, true, true);
});

var internalConstants = genericVar.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

var reactElement = Symbol["for"]("react.element");
var reactPortal = Symbol["for"]("react.portal");
var reactFragment = Symbol["for"]("react.fragment");
var reactStrictMode = Symbol["for"]("react.strict_mode");
var reactProfiler = Symbol["for"]("react.profiler");
var reactProvider = Symbol["for"]("react.provider");
var reactContext = Symbol["for"]("react.context");
var reactForwardRef = Symbol["for"]("react.forward_ref");
var reactSuspense = Symbol["for"]("react.suspense");
var reactSuspenseList = Symbol["for"]("react.suspense_list");
var reactMemo = Symbol["for"]("react.memo");
var reactLazy = Symbol["for"]("react.lazy");
Symbol["for"]("react.scope");
Symbol["for"]("react.debug_trace_mode");
var reactOffscreen = Symbol["for"]("react.offscreen");
Symbol["for"]("react.legacy_hidden");
Symbol["for"]("react.cache");
Symbol["for"]("react.tracing_marker");
var iteratorSymbol = Symbol.iterator;

function renamedFunction(var_106) {
    return genericVar && typeof genericVar === "object" && typeof genericVar[iteratorSymbol] === "function" ? genericVar[iteratorSymbol] : null;
}

const objectAssign = Object.assign;

function renamedFunction(var_110) {
    if (typeof genericVar === "undefined") {
        try {
            throw new Error();
        } catch (e) {
            const stack = e.stack.trim();
            genericVar = stack.match(/\n( *(at)?)/);
            genericVar = genericVar ? genericVar[1] || "" : "";
        }
    }
    return "\n" + genericVar;
}

var genericVar = false;

function renamedFunction(var_115, genericVar) {
    if (!genericVar || genericVar) {
        return "";
    }
    genericVar = true;
    var originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = undefined;

    try {
        if (genericVar) {
            genericVar = function () {
                throw Error();
            };
            Object.defineProperty(genericVar.prototype, "props", {
                set: function () {
                    throw Error();
                }
            });
            if (typeof Reflect === "object" && Reflect.construct) {
                try {
                    Reflect.construct(var_116, []);
                } catch (e) {
                    genericVar = e;
                }
                Reflect.construct(var_115, [], genericVar);
            } else {
                try {
                    genericVar.call();
                } catch (e) {
                    genericVar = e;
                }
                genericVar.call(var_116.prototype);
            }
        } else {
            try {
                throw Error();
            } catch (e) {
                genericVar = e;
            }
            genericVar();
        }
    } catch (e) {
        if (e && e.stack && typeof e.stack === "string") {
            var stack = e.stack.split("\n");
            var length = stack.length - 1;

            for (let i = length; i >= 1 && stack[i] === stack[length]; i--) {
                stack.pop();
            }
            for (let i = stack.length - 1; i >= 1; i--) {
                if (stack[i] !== stack[stack.length - 1]) {
                    return `\n${stack[i].replace(" at new ", " at ")}`;
                }
            }
        }
    } finally {
        genericVar = false;
        Error.prepareStackTrace = originalPrepareStackTrace;
    }

    return genericVar && genericVar.displayName
        ? genericVar.displayName
        : genericVar.name || var_109(var_115);
}

function renamedFunction(var_129) {
    switch (genericVar.tag) {
        case 5:
            return var_109(var_129.type);
        case 16:
            return "Lazy";
        case 13:
            return "Suspense";
        case 19:
            return "SuspenseList";
        case 0:
        case 2:
        case 15:
            return var_114(var_129.type), false;
        case 11:
            return var_114(var_129.type.render), false;
        case 1:
            return var_114(var_129.type), true;
        default:
            return "";
    }
}

function renamedFunction(var_131) {
    if (genericVar == null) {
        return null;
    }
    if (typeof genericVar === "function") {
        return genericVar.displayName || genericVar.name || null;
    }
    if (typeof genericVar === "string") {
        return genericVar;
    }
    switch (genericVar) {
        case Symbol["for"]("react.fragment"):
            return "Fragment";
        case Symbol["for"]("react.portal"):
            return "Portal";
        case Symbol["for"]("react.profiler"):
            return "Profiler";
        case Symbol["for"]("react.strict_mode"):
            return "StrictMode";
        case Symbol["for"]("react.suspense"):
            return "Suspense";
        case Symbol["for"]("react.suspense_list"):
            return "SuspenseList";
    }
    if (typeof genericVar === "object") {
        switch (genericVar.$typeof) {
            case Symbol["for"]("react.context"):
                return genericVar.displayName || "Context.Consumer";
            case Symbol["for"]("react.provider"):
                return genericVar._context.displayName || "Context.Provider";
            case Symbol["for"]("react.forward_ref"):
                return genericVar.render.displayName || "ForwardRef";
            case Symbol["for"]("react.memo"):
                return genericVar.displayName || "Memo";
        }
    }
    return null;
}

function renamedFunction(var_135) {
    var genericVar = genericVar.type;
    switch (genericVar.tag) {
        case 24:
            return "Cache";
        case 9:
            return genericVar.displayName || "Context.Consumer";
        case 10:
            return genericVar._context.displayName || "Context.Provider";
        case 18:
            return "DehydratedFragment";
        case 11:
            return `ForwardRef(${genericVar.render.displayName || genericVar.name || ""})`;
        case 7:
            return "Fragment";
        case 5:
            return genericVar;
        case 4:
            return "Portal";
        case 3:
            return "Root";
        case 6:
            return "Text";
        case 16:
            return var_130(var_135);
        case 8:
            return genericVar === genericVar ? "StrictMode" : "Mode";
        case 22:
            return "Offscreen";
        case 12:
            return "Profiler";
        case 21:
            return "Scope";
        case 13:
            return "Suspense";
        case 19:
            return "SuspenseList";
        case 25:
            return "TracingMarker";
        default:
            if (typeof genericVar === "function") {
                return genericVar.displayName || genericVar.name || null;
            }
            if (typeof genericVar === "string") {
                return genericVar;
            }
    }
    return null;
}

function renamedFunction(var_138) {
    switch (typeof genericVar) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
        case "object":
            return genericVar;
        default:
            return "";
    }
}

function renamedFunction(var_140) {
    var genericVar = genericVar.type;
    return (
        genericVar &&
        genericVar.nodeName &&
        genericVar.nodeName.toLowerCase() === "input" &&
        (genericVar === "checkbox" || genericVar === "radio")
    );
}

function renamedFunction(var_143) {
    if (!genericVar._valueTracker) {
        genericVar._valueTracker = (function (trackedVar) {
            const property = var_139(var_144) ? "checked" : "value";
            const descriptor = Object.getOwnPropertyDescriptor(var_144.constructor.prototype, property);
            let currentValue = "" + descriptor[property];
            if (
                !descriptor.hasOwnProperty(property) &&
                typeof descriptor !== "undefined" &&
                typeof descriptor.get === "function" &&
                typeof descriptor.set === "function"
            ) {
                const getter = descriptor.get;
                const setter = descriptor.set;

                Object.defineProperty(trackedVar, property, {
                    configurable: true,
                    get: function () {
                        return getter.call(this);
                    },
                    set: function (newValue) {
                        currentValue = "" + newValue;
                        setter.call(this, currentValue);
                    }
                });

                return {
                    getValue: function () {
                        return currentValue;
                    },
                    setValue: function (newValue) {
                        currentValue = "" + newValue;
                    },
                    stopTracking: function () {
                        genericVar._valueTracker = null;
                        delete trackedVar[property];
                    }
                };
            }
        })(genericVar);
    }
}

function renamedFunction(var_153) {
    if (!genericVar) {
        return false;
    }
    const valueTracker = genericVar._valueTracker;
    if (!valueTracker) {
        return true;
    }
    const previousValue = valueTracker.getValue();
    let currentValue = "";
    if (genericVar) {
        currentValue = var_139(var_153) ? (genericVar.checked ? "true" : "false") : genericVar.value;
    }
    const hasChanged = currentValue !== previousValue;
    if (hasChanged) {
        valueTracker.setValue(currentValue);
    }
    return hasChanged;
}

function renamedFunction(var_158) {
    const documentObj = typeof document !== "undefined" ? document : undefined;
    if (typeof genericVar === "undefined") {
        genericVar = documentObj;
    }
    try {
        return genericVar.activeElement || genericVar.body;
    } catch (e) {
        return genericVar.body;
    }
}

function renamedFunction(var_161, genericVar) {
    const checkedValue = genericVar.checked;
    return Object.assign({}, genericVar, {
        defaultChecked: undefined,
        defaultValue: undefined,
        value: undefined,
        checked: checkedValue !== null ? checkedValue : genericVar._wrapperState.initialChecked
    });
}

function renamedFunction(var_165, genericVar) {
    const initialValue = genericVar.defaultValue == null ? "" : genericVar.defaultValue;
    const initialChecked = genericVar.checked != null ? genericVar.checked : genericVar.defaultChecked;
    const controlled =
        genericVar.type === "checkbox" || genericVar.type === "radio"
            ? genericVar.checked != null
            : genericVar.value != null;

    genericVar._wrapperState = {
        initialChecked: initialChecked,
        initialValue: initialValue,
        controlled: controlled
    };
}

function renamedFunction(var_170, genericVar) {
    if (genericVar.checked != null) {
        var_67(var_170, "checked", genericVar.checked, false);
    }
}

function renamedFunction(var_173, genericVar) {
    var_169(var_173, genericVar);
    let newValue = var_137(genericVar.value);
    const elementType = genericVar.type;

    if (elementType != null) {
        if (elementType === "number") {
            if ((genericVar.value === 0 && newValue === "") || genericVar.value != newValue) {
                genericVar.value = "" + newValue;
            }
        } else if (genericVar.value !== "" + newValue) {
            genericVar.value = "" + newValue;
        }
    } else {
        if (elementType === "submit" || elementType === "reset") {
            genericVar.removeAttribute("value");
        }
    }

    if (genericVar.hasOwnProperty("value")) {
        var_177(var_173, elementType, genericVar);
    } else if (genericVar.hasOwnProperty("defaultValue")) {
        var_177(var_173, elementType, genericVar(genericVar.defaultValue));
    }

    if (genericVar.checked == null && genericVar.defaultChecked != null) {
        genericVar.defaultChecked = !!genericVar.defaultChecked;
    }
}

                    function renamedFunction(var_179, genericVar, genericVar) {
                        if (genericVar.hasOwnProperty("value") || genericVar.hasOwnProperty("defaultValue")) {
                            var genericVar = genericVar.type;
                            if (!("submit" !== genericVar && "reset" !== genericVar || undefined !== genericVar.value && null !== genericVar.value)) {
                                return;
                            }
                            genericVar = "" + genericVar._wrapperState.initialValue;
                            if (!(genericVar || genericVar === genericVar.value)) {
                                genericVar.value = genericVar;
                            }
                        }
function inject()
function renamedFunction(var_68, genericVar1, genericVar2, genericVar3) 
    const value = genericVar1.hasOwnProperty(var_69) ? genericVar1[var_69] : null;
    if (
        value !== null
            ? value.type !== 0
            : genericVar1 &&
              !(
                  genericVar1.length > 2 ||
                  (genericVar1[0] !== "o" && genericVar1[0] !== "O") ||
                  (genericVar1[1] !== "n" && genericVar1[1] !== "N")
              )
    ) {
        if (
            (function (arg1, arg2, arg3, arg4) {
                if (
                    arg1 === null ||
                    (function (innerArg1, innerArg2, innerArg3, innerArg4) {
                        if (innerArg1 !== null && innerArg1.type === 0) {
                            return false;
                        }
                        switch (typeof innerArg1) {
                            case "function":
                            case "symbol":
                                return true;
                            case "boolean":
                                return (
                                    !innerArg1 &&
                                    innerArg1 !== null &&
                                    !innerArg1.acceptsBooleans &&
                                    innerArg1.toLowerCase().slice(0, 5) !== "data-" &&
                                    innerArg1.toLowerCase().slice(0, 5) !== "aria-"
                                );
                            default:
                                return false;
                        }
                    })(arg1, arg2, arg3, arg4)
                ) {
                    return true;
                }
                if (arg2) {
                    return false;
                }
                if (arg3 !== null) {
                    switch (arg3.type) {
                        case 3:
                            return !arg3;
                        case 4:
                            return arg3 === false;
                        case 5:
                            return isNaN(var_74);
                        case 6:
                            return isNaN(var_74) || arg3 < 1;
                    }
                }
                return false;
            })(genericVar1, genericVar2, genericVar3, genericVar3)
        ) {
            genericVar1 = null;
        }

        if (genericVar1 || value === null) {
            if (
                (function (arg) {
                    return !!arg.call(var_44, arg) || (!arg.call(var_43, arg) && arg.test(arg ? (arg[arg] = true) : (arg[arg] = true), false));
                })(genericVar1)
            ) {
                if (value === null) {
                    genericVar1.removeAttribute(var_69);
                } else {
                    genericVar1.setAttribute(var_69, "" + value);
                }
            }
        } else if (genericVar1.mustUseProperty) {
            genericVar1[genericVar1.propertyName] = value === null ? (genericVar1.type !== 3 ? "" : null) : value;
        } else {
            const attributeName = genericVar1.attributeName;
            const attributeNamespace = genericVar1.attributeNamespace;
            if (attributeNamespace === null) {
                genericVar1.removeAttribute(var_69);
            } else {
                const attrValue =
                    genericVar1.type === 3 || (genericVar1.type === 4 && value === true) ? "" : "" + value;
                if (attrValue) {
                    genericVar1.setAttributeNS(attributeNamespace, attributeName, attrValue);
                } else {
                    genericVar1.setAttribute(attributeName, attrValue);
                }
            }
        }
    }
}

"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
    .split(" ")
    .forEach(function (genericVar) {
        genericVar = genericVar.replace(var_64, match => match.toUpperCase());
        genericVar[genericVar] = new var_45(var_83, 1, false, genericVar, null, false, false);
    });

"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
    .split(" ")
    .forEach(function (genericVar) {
        genericVar = genericVar.replace(var_64, match => match.toUpperCase());
        genericVar[genericVar] = new var_45(var_85, 1, false, genericVar, "http://www.w3.org/1999/xlink", false, false);
    });

["xml:base", "xml:lang", "xml:space"].forEach(function (genericVar) {
    genericVar = genericVar.replace(var_64, match => match.toUpperCase());
    genericVar[genericVar] = new var_45(var_87, 1, false, genericVar, "http://www.w3.org/XML/1998/namespace", false, false);
});

["tabIndex", "crossOrigin"].forEach(function (genericVar) {
    genericVar[genericVar] = new var_45(var_88, 1, false, genericVar.toLowerCase(), null, false, false);
});

genericVar.xlinkHref = new var_45("xlinkHref",1,false,"xlink:href","http://www.w3.org/1999/xlink",true,false);
["src", "href", "action", "formAction"].forEach(function (key) {
    genericVar[key] = new var_45(var_89, 1, false, key.toLowerCase(), null, true, true);
});

var genericVar = genericVar.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
var genericVar = Symbol["for"]("react.element");
var genericVar = Symbol["for"]("react.portal");
var genericVar = Symbol["for"]("react.fragment");
var genericVar = Symbol["for"]("react.strict_mode");
var genericVar = Symbol["for"]("react.profiler");
var genericVar = Symbol["for"]("react.provider");
var genericVar = Symbol["for"]("react.context");
var genericVar = Symbol["for"]("react.forward_ref");
var genericVar = Symbol["for"]("react.suspense");
var genericVar = Symbol["for"]("react.suspense_list");
var genericVar = Symbol["for"]("react.memo");
var genericVar = Symbol["for"]("react.lazy");
Symbol["for"]("react.scope");
Symbol["for"]("react.debug_trace_mode");
var genericVar = Symbol["for"]("react.offscreen");
Symbol["for"]("react.legacy_hidden");
Symbol["for"]("react.cache");
Symbol["for"]("react.tracing_marker");
var genericVar = Symbol.iterator;
function renamedFunctionvar_106() {
    return genericVar === null || typeof genericVar !== "object"
        ? null
        : typeof (genericVar = genericVar && genericVar[genericVar] || genericVar["@@iterator"]) === "function"
        ? genericVar
        : null;
}
var genericVar;
var genericVar = Object.assign;
function renamedFunctionvar_110() {
    if (genericVar === undefined) {
        try {
            throw Error();
        } catch (genericVar) {
            genericVar = (genericVar.stack.trim().match(/\n( *(at)?)/) || [])[1] || "";
        }
    }
    return "\n" + genericVar + genericVar;
}
var genericVar = false;
function renamedFunctionvar_115(genericVar) {
    if (!genericVar || genericVar) {
        return "";
    }
    genericVar = true;
    var originalPrepareStackTrace = Error.prepareStackTrace;
    Error.prepareStackTrace = undefined;
    try {
        if (genericVar) {
            genericVar = function () {
                throw Error();
            };
            Object.defineProperty(genericVar.prototype, "props", {
                set: function () {
                    throw Error();
                }
            });
            if (typeof Reflect === "object" && Reflect.construct) {
                try {
                    Reflect.construct(genericVar, []);
                } catch (error) {
                    genericVar = error;
                }
                Reflect.construct(genericVar, [], genericVar);
            } else {
                try {
                    genericVar.call();
                } catch (error) {
                    genericVar = error;
                }
                genericVar.call(genericVar.prototype);
            }
        } else {
            try {
                throw Error();
            } catch (error) {
                genericVar = error;
            }
        }
    } catch (error) {
        if (error && error.stack && typeof error.stack === "string") {
            let stackLines = error.stack.split("\n");
            let genericVarIndex = stackLines.length - 1;
            for (; genericVarIndex > 1 && stackLines[genericVarIndex] === stackLines[genericVarIndex - 1]; genericVarIndex--) {
                stackLines.pop();
            }
            for (; genericVarIndex > 1; genericVarIndex--) {
                if (stackLines[genericVarIndex] !== stackLines[genericVarIndex - 1]) {
                    break;
                }
            }
            genericVar = "\n" + stackLines[genericVarIndex].replace(" at new ", " at ");
            if (genericVar.displayName && genericVar.includes("<anonymous>")) {
                genericVar = genericVar.replace("<anonymous>", genericVar.displayName);
            }
        }
    } finally {
        genericVar = false;
        Error.prepareStackTrace = originalPrepareStackTrace;
    }
    return genericVar;
}
function renamedFunctionvar_129(genericVar) {
    switch (genericVar.tag) {
        case 5:
            return var_109(genericVar.type);
        case 16:
            return "Lazy";
        case 13:
            return "Suspense";
        case 19:
            return "SuspenseList";
        case 0:
        case 2:
        case 15:
            return var_114(genericVar.type), false;
        case 11:
            return var_114(genericVar.type.render), false;
        case 1:
            return var_114(genericVar.type), true;
        default:
            return "";
    }
}

function renamedFunctionvar_131(genericVar) {
    if (genericVar == null) {
        return null;
    }
    if (typeof genericVar === "function") {
        return genericVar.displayName || genericVar.name || null;
    }
    if (typeof genericVar === "string") {
        return genericVar;
    }
    switch (genericVar) {
        case Symbol.for("react.fragment"):
            return "Fragment";
        case Symbol.for("react.portal"):
            return "Portal";
        case Symbol.for("react.profiler"):
            return "Profiler";
        case Symbol.for("react.strict_mode"):
            return "StrictMode";
        case Symbol.for("react.suspense"):
            return "Suspense";
        case Symbol.for("react.suspense_list"):
            return "SuspenseList";
    }
    if (typeof genericVar === "object") {
        switch (genericVar.$typeof) {
            case Symbol.for("react.context"):
                return genericVar.displayName || "Context.Consumer";
            case Symbol.for("react.provider"):
                return genericVar._context.displayName || "Context.Provider";
            case Symbol.for("react.forward_ref"):
                const renderFn = genericVar.render;
                return renderFn.displayName || renderFn.name ? `ForwardRef(${renderFn.displayName || renderFn.name})` : "ForwardRef";
            case Symbol.for("react.memo"):
                return genericVar.displayName || "Memo";
            case Symbol.for("react.lazy"):
                return genericVar.displayName || null;
        }
    }
    return null;
}

function renamedFunctionvar_135(genericVar) {
    const type = genericVar.type;
    switch (genericVar.tag) {
        case 24:
            return "Cache";
        case 9:
            return genericVar.displayName || "Context.Consumer";
        case 10:
            return genericVar._context.displayName || "Context.Provider";
        case 18:
            return "DehydratedFragment";
        case 11:
            const renderFn = genericVar.render;
            return renderFn.displayName || renderFn.name ? `ForwardRef(${renderFn.displayName || renderFn.name})` : "ForwardRef";
        case 7:
            return "Fragment";
        case 5:
            return type;
        case 4:
            return "Portal";
        case 3:
            return "Root";
        case 6:
            return "Text";
        case 16:
            return "Lazy";
        case 8:
            return type === type ? "StrictMode" : "Mode";
        case 22:
            return "Offscreen";
        case 12:
            return "Profiler";
        case 21:
            return "Scope";
        case 13:
            return "Suspense";
        case 19:
            return "SuspenseList";
        case 25:
            return "TracingMarker";
        default:
            if (typeof type === "function") {
                return type.displayName || type.name || null;
            }
            if (typeof type === "string") {
                return type;
            }
    }
    return null;
}

function renamedFunctionvar_138(genericVar) {
    switch (typeof genericVar) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
        case "object":
            return genericVar;
        default:
            return "";
    }
}

function renamedFunctionvar_140(genericVar) {
    const type = genericVar.type;
    return (
        type &&
        type.nodeName &&
        type.nodeName.toLowerCase() === "input" &&
        (type === "checkbox" || type === "radio")
    );
}

function renamedFunctionvar_143(genericVar) {
    if (!genericVar._valueTracker) {
        genericVar._valueTracker = (function (trackedVar) {
            const property = var_139(var_144) ? "checked" : "value";
            const descriptor = Object.getOwnPropertyDescriptor(var_144.constructor.prototype, property);
            let currentValue = "" + descriptor[property];
            if (
                !descriptor.hasOwnProperty(property) &&
                typeof descriptor.get === "function" &&
                typeof descriptor.set === "function"
            ) {
                const getter = descriptor.get;
                const setter = descriptor.set;

                Object.defineProperty(trackedVar, property, {
                    configurable: true,
                    get: function () {
                        return getter.call(this);
                    },
                    set: function (newValue) {
                        currentValue = "" + newValue;
                        setter.call(this, currentValue);
                    }
                });

                return {
                    getValue: function () {
                        return currentValue;
                    },
                    setValue: function (newValue) {
                        currentValue = "" + newValue;
                    },
                    stopTracking: function () {
                        genericVar._valueTracker = null;
                        delete trackedVar[property];
                    }
                };
            }
        })(genericVar);
    }
}

function renamedFunctionvar_153(genericVar) {
    if (!genericVar) {
        return false;
    }
    var valueTracker = genericVar._valueTracker;
    if (!valueTracker) {
        return true;
    }
    var previousValue = valueTracker.getValue();
    var currentValue = "";
    if (genericVar) {
        currentValue = var_139(var_153)
            ? genericVar.checked
                ? "true"
                : "false"
            : genericVar.value;
    }
    const hasChanged = currentValue !== previousValue;
    if (hasChanged) {
        valueTracker.setValue(currentValue);
    }
    return hasChanged;
}

function renamedFunctionvar_158(genericVar) {
    genericVar = genericVar || (typeof document !== "undefined" ? document : undefined);
    if (genericVar === undefined) {
        return null;
    }
    try {
        return genericVar.activeElement || genericVar.body;
    } catch (error) {
        return genericVar.body;
    }
}

function renamedFunctionvar_161(var_161, genericVar) {
    const checked = genericVar.checked;
    return Object.assign({}, genericVar, {
        defaultChecked: undefined,
        defaultValue: undefined,
        value: undefined,
        checked: checked != null ? checked : genericVar._wrapperState.initialChecked,
    });
}

function renamedFunctionvar_165(var_165, genericVar) {
    const initialValue = genericVar.defaultValue == null ? "" : genericVar.defaultValue;
    const initialChecked = genericVar.checked != null ? genericVar.checked : genericVar.defaultChecked;
    const controlled =
        genericVar.type === "checkbox" || genericVar.type === "radio"
            ? genericVar.checked != null
            : genericVar.value != null;

    genericVar._wrapperState = {
        initialChecked: initialChecked,
        initialValue: initialValue,
        controlled: controlled,
    };
}

function renamedFunctionvar_170(var_170, genericVar) {
    if (genericVar.checked != null) {
        var_67(var_170, "checked", genericVar.checked, false);
    }
}

function renamedFunctionvar_173(var_173, genericVar) {
    var_169(var_173, genericVar);
    const value = var_137(var_174.value);
    const type = genericVar.type;

    if (type != null) {
        if (type === "number") {
            if ((value === 0 && genericVar.value === "") || genericVar.value != value) {
                genericVar.value = "" + value;
            }
        } else if (genericVar.value !== "" + value) {
            genericVar.value = "" + value;
        }
    } else if (type === "submit" || type === "reset") {
        genericVar.removeAttribute("value");
    }

    if (genericVar.hasOwnProperty("value")) {
        var_177(var_173, genericVar.type, genericVar);
    } else if (genericVar.hasOwnProperty("defaultValue")) {
        var_177(var_173, genericVar.type, genericVar.defaultValue);
    }

    if (genericVar.checked == null && genericVar.defaultChecked != null) {
        genericVar.defaultChecked = !!genericVar.defaultChecked;
    }
}

function renamedFunctionvar_179(var_179, genericVar1, genericVar2) {
    if (genericVar1.hasOwnProperty("value") || genericVar1.hasOwnProperty("defaultValue")) {
        const type = genericVar1.type;
        if (
            (type !== "submit" && type !== "reset") ||
            (genericVar1.value !== undefined && genericVar1.value !== null)
        ) {
            const initialValue = "" + genericVar1._wrapperState.initialValue;
            if (!(initialValue || initialValue === genericVar1.value)) {
                genericVar1.value = initialValue;
            }
        }
        genericVar1.defaultValue = genericVar1.value;
    }
    if (genericVar1.name !== "") {
        genericVar1.name = "";
    }
    genericVar1.defaultChecked = !!genericVar1._wrapperState.initialChecked;
    if (genericVar2 !== "") {
        genericVar1.name = genericVar2;
    }
}

function renamedFunctionvar_183(var_183, genericVar1, genericVar2) {
    if (!("number" === typeof genericVar1 && genericVar1(genericVar1.ownerDocument === var_183))) {
        if (genericVar2 == null) {
            var_183.defaultValue = "" + var_183._wrapperState.initialValue;
        } else if (genericVar2.defaultValue !== "" + genericVar2) {
            var_183.defaultValue = "" + genericVar2;
        }
    }
}

var genericVar = Array.isArray;

function renamedFunctionvar_188(var_188, genericVar1, genericVar2, genericVar3) {
    const options = genericVar1.options;
    if (options) {
        const selectionSet = {};
        for (let i = 0; i < genericVar2.length; i++) {
            selectionSet["$" + genericVar2[i]] = true;
        }
        for (let i = 0; i < options.length; i++) {
            const selected = selectionSet.hasOwnProperty("$" + options[i].value);
            if (options[i].selected !== selected) {
                options[i].selected = selected;
            }
            if (selected && genericVar3) {
                options[i].defaultSelected = true;
            }
        }
    } else {
        const value = "" + var_137(var_190);
        let defaultOption = null;
        for (let i = 0; i < genericVar1.options.length; i++) {
            if (options[i].value === value) {
                options[i].selected = true;
                if (genericVar3) {
                    options[i].defaultSelected = true;
                }
                return;
            }
            if (defaultOption === null && !options[i].disabled) {
                defaultOption = options[i];
            }
        }
        if (defaultOption !== null) {
            defaultOption.selected = true;
        }
    }
}

function renamedFunctionvar_194(genericVar) {
    if (genericVar.dangerouslySetInnerHTML != null) {
        throw Error(var_28(91));
    }
    return Object.assign({}, genericVar, {
        value: undefined,
        defaultValue: undefined,
        children: "" + genericVar._wrapperState.initialValue,
    });
}

function renamedFunctionvar_197(var_197, genericVar) {
    let value = genericVar.value;
    if (value == null) {
        value = genericVar.children;
        const defaultValue = genericVar.defaultValue;
        if (defaultValue != null) {
            if (value != null) {
                throw Error(var_28(92));
            }
            if (Array.isArray(defaultValue)) {
                if (defaultValue.length > 1) {
                    throw Error(var_28(93));
                }
                value = defaultValue[0];
            }
            value = defaultValue;
        }
        if (value == null) {
            value = "";
        }
    }
    genericVar._wrapperState = {
        initialValue: var_137(var_199),
    };
}

function renamedFunctionvar_201(var_201, genericVar) {
    const value = var_137(var_202.value);
    const defaultValue = var_137(var_202.defaultValue);
    if (defaultValue != null) {
        if ("" + defaultValue !== genericVar.value) {
            genericVar.value = "" + defaultValue;
        }
        if (genericVar.defaultValue == null || genericVar.defaultValue !== "" + defaultValue) {
            genericVar.defaultValue = "" + defaultValue;
        }
    }
    if (value != null) {
        genericVar.defaultValue = "" + value;
    }
}

function renamedFunctionvar_206(genericVar) {
    const content = genericVar.textContent;
    if (
        content === genericVar._wrapperState.initialValue &&
        content !== "" &&
        content !== null
    ) {
        genericVar.value = content;
    }
}

function renamedFunctionvar_209(namespace) {
    switch (namespace) {
        case "svg":
            return "http://www.w3.org/2000/svg";
        case "math":
            return "http://www.w3.org/1998/Math/MathML";
        default:
            return "http://www.w3.org/1999/xhtml";
    }
}

var genericVar;

genericVar = function (target, content) {
    if (
        target.namespaceURI !== "http://www.w3.org/2000/svg" ||
        "innerHTML" in target
    ) {
        target.innerHTML = content;
    } else {
        const container = document.createElement("div");
        container.innerHTML = "<svg>" + content.valueOf().toString() + "</svg>";
        const svg = container.firstChild;
        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }
        while (svg.firstChild) {
            target.appendChild(svg.firstChild);
        }
    }
};

var genericVar = typeof MSApp !== "undefined" && MSApp.execUnsafeLocalFunction
    ? function (callback, ...args) {
          MSApp.execUnsafeLocalFunction(() => {
              return callback(...args);
          });
      }
    : genericVar;

function renamedFunctionvar_220(var_220, content) {
    if (var_220) {
        const firstChild = var_220.firstChild;
        if (firstChild && firstChild === var_220.lastChild && firstChild.nodeType === 3) {
            firstChild.nodeValue = content;
            return;
        }
    }
    var_220.textContent = content;
}

var genericVar = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true,
};

var genericVar = ["Webkit", "ms", "Moz", "O"];

function renamedFunctionvar_226(var_226, genericVar) {
    const style = genericVar.style;
    for (const key in style) {
        if (style.hasOwnProperty(key)) {
            const isCustomProperty = key.startsWith("--");
            const value =
                style[key] == null ||
                typeof style[key] === "boolean" ||
                style[key] === ""
                    ? ""
                    : isCustomProperty || typeof style[key] !== "number" || style[key] === 0
                    ? style[key].toString().trim()
                    : style[key] + "px";

            if (key === "float") {
                key = "cssFloat";
            }

            if (isCustomProperty) {
                style.setProperty(key, value);
            } else {
                style[key] = value;
            }
        }
    }
}

Object.keys(var_223).forEach(function (key) {
    var_223[key].forEach(function (value) {
        const normalized = key + value.charAt(0).toUpperCase() + value.substring(1);
        var_223[normalized] = var_223[key];
    });
});

var genericVar = Object.assign(
    {
        menuitem: true,
    },
    {
        area: true,
        base: true,
        br: true,
        col: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        keygen: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true,
    }
);

function renamedFunctionvar_236(genericVar) {
    if (genericVar) {
        if (genericVar.children != null || genericVar.dangerouslySetInnerHTML != null) {
            throw Error(var_28(137, genericVar));
        }
        if (genericVar.dangerouslySetInnerHTML != null) {
            if (genericVar.children != null) {
                throw Error(var_28(60));
            }
            if (
                typeof genericVar.dangerouslySetInnerHTML !== "object" ||
                !("__html" in genericVar.dangerouslySetInnerHTML)
            ) {
                throw Error(var_28(61));
            }
        }
        if (genericVar.style != null && typeof genericVar.style !== "object") {
            throw Error(var_28(62));
        }
    }
}

function renamedFunctionvar_239(genericVar) {
    if (genericVar.indexOf("-") === -1) {
        return typeof genericVar.is === "string";
    }
    switch (genericVar) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
            return false;
        default:
            return true;
    }
}

function renamedFunctionvar_243(event) {
    let target = event.target || event.srcElement || window.correspondingUseElement;
    if (target && target.correspondingUseElement) {
        target = target.correspondingUseElement;
    }
    return target.nodeType === 3 ? target.parentNode : target;
}

function renamedFunctionvar_248(genericVar) {
    if ((genericVar = genericVar(genericVar))) {
        if (typeof genericVar !== "function") {
            throw Error(var_28(280));
        }
        const stateNode = genericVar.stateNode;
        if (stateNode) {
            return stateNode[genericVar] || null;
        }
    }
}

function renamedFunctionvar_253(var_253, genericVar) {
    if (var_253) {
        if (genericVar) {
            genericVar.push(var_253);
        } else {
            genericVar = [var_253];
        }
    }
}

function renamedFunctionvar_258(var_258, genericVar) {
    return var_258(var_259);
}

function renamedFunctionvar_263(var_263, genericVar1, genericVar2) {
    if (genericVar1) {
        return var_263(var_264, genericVar2);
    }
    let errorFlag = true;
    try {
        return var_257(var_263, genericVar1, genericVar2);
    } finally {
        errorFlag = false;
        if (genericVar1 !== null || genericVar2 !== null) {
            return;
        }
    }
}

function renamedFunctionvar_267(var_267, genericVar) {
    const stateNode = genericVar.stateNode;
    if (stateNode === null) {
        return null;
    }
    let handler = stateNode[genericVar] || null;
    if (handler === null) {
        return null;
    }

    switch (genericVar) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
            if (!(handler = !handler.disabled)) {
                handler = !(
                    "button" === (handler.type || "input") ||
                    "select" === handler ||
                    "textarea" === handler
                );
            }
            handler = !handler;
            break;
        default:
            handler = false;
    }

    if (handler) {
        return null;
    }
    if (handler && typeof handler !== "function") {
        throw Error(var_28(231, handler, typeof handler));
    }
    return handler;
}

var passiveSupported = false;
try {
    const options = {};
    Object.defineProperty(options, "passive", {
        get: function () {
            passiveSupported = true;
        },
    });
    window.addEventListener("test", null, options);
    window.removeEventListener("test", null, options);
} catch (err) {
    passiveSupported = false;
}

function renamedFunctionvar_276(var_276, callback, ...args) {
    try {
        callback.apply(var_278, args);
    } catch (err) {
        this.onError(var_286);
    }
}

var errorCaught = false;
var currentContext = null;
var handlerExecuted = false;
var fallbackContext = null;

var errorHandler = {
    onError: function (error) {
        errorCaught = true;
        currentContext = error;
    },
};

function renamedFunctionvar_294(var_294, callback, ...args) {
    errorCaught = false;
    currentContext = null;
    callback.apply(var_291, args);
}

function renamedFunctionvar_304(var_304) {
    let current = var_304;
    while (current.alternate) {
        current = current["return"];
    }
    do {
        if (current.flags & 4098) {
            current = current["return"];
        }
        current = current["return"];
    } while (current);
    return current.tag === 3 ? current : null;
}

function renamedFunctionvar_308(var_308) {
    if (var_308.tag === 13) {
        let memoizedState = var_308.memoizedState;
        if (memoizedState === null && var_308.alternate !== null) {
            memoizedState = var_308.alternate.memoizedState;
        }
        if (memoizedState !== null) {
            return memoizedState.dehydrated;
        }
    }
    return null;
}

function renamedFunctionvar_311(expected, actual) {
    if (expected !== actual) {
        throw Error(var_28(188));
    }
}

function renamedFunctionvar_313(genericVar) {
    return (function findFiber(currentFiber) {
        const alternate = currentFiber.alternate;
        if (!alternate) {
            const parent = genericVar(currentFiber);
            if (parent === null) {
                throw Error(var_28(188));
            }
            return parent !== currentFiber ? null : currentFiber;
        }
        let fiber = currentFiber;
        while (fiber) {
            const sibling = fiber["return"];
            if (!sibling) {
                break;
            }
            const siblingAlternate = sibling.alternate;
            if (!siblingAlternate) {
                if (sibling["return"] !== null) {
                    fiber = sibling["return"];
                    continue;
                }
                break;
            }
            if (sibling.child === fiber.child) {
                for (let child = sibling.child; child; child = child.sibling) {
                    if (child === currentFiber) {
                        return sibling;
                    }
                }
                throw Error(var_28(188));
            }
        }
        if (currentFiber.alternate !== currentFiber) {
            throw Error(var_28(190));
        }
        if (currentFiber.tag !== 3) {
            throw Error(var_28(188));
        }
        return currentFiber.stateNode.current === currentFiber ? currentFiber : currentFiber;
    })(genericVar)
        ? var_322(var_313)
        : null;
}

                  function renamedFunctionvar_323(genericVar) {
    if (genericVar.tag === 5 || genericVar.tag === 6) {
        return genericVar;
    }
    for (genericVar = genericVar.child; genericVar !== null; ) {
        const result = var_322(genericVar);
        if (result !== null) {
            return result;
        }
        genericVar = genericVar.sibling;
    }
    return null;
}

var genericVar = genericVar.unstable_scheduleCallback;
var genericVar = genericVar.unstable_cancelCallback;
var genericVar = genericVar.unstable_shouldYield;
var genericVar = genericVar.unstable_requestPaint;
var genericVar = genericVar.unstable_now;
var genericVar = genericVar.unstable_getCurrentPriorityLevel;
var genericVar = genericVar.unstable_ImmediatePriority;
var genericVar = genericVar.unstable_UserBlockingPriority;
var genericVar = genericVar.unstable_NormalPriority;
var genericVar = genericVar.unstable_LowPriority;
var genericVar = genericVar.unstable_IdlePriority;

var genericVar = Math.clz32
    ? Math.clz32
    : function (x) {
          x >>>= 0;
          return x === 0 ? 32 : 31 - Math.floor(Math.log(x) / Math.LN2);
      };

var genericVar = Math.log;
var genericVar = Math.LN2;
var genericVar = 64;
var genericVar = 4194304;

function renamedFunctionvar_345(genericVar) {
    switch (genericVar & -genericVar) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 4:
            return 4;
        case 8:
            return 8;
        case 16:
            return 16;
        case 32:
            return 32;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return 4194240 & genericVar;
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
            return 130023424 & genericVar;
        case 134217728:
            return 134217728;
        case 268435456:
            return 268435456;
        case 536870912:
            return 536870912;
        case 1073741824:
            return 1073741824;
        default:
            return genericVar;
    }
}

function renamedFunctionvar_347(var_347, genericVar) {
    const pending = genericVar.pendingLanes;
    if (pending === 0) {
        return 0;
    }
    let result = 0;
    let suspended = genericVar.suspendedLanes;
    let pinged = genericVar.pingedLanes;
    const available = 268435455 & pending;

    if (available !== 0) {
        let next = available & ~suspended;
        if (next !== 0) {
            result = var_344(next);
        } else if ((next = available & pinged) !== 0) {
            result = var_344(next);
        }
    } else if ((result = pending & ~suspended) !== 0) {
        result = var_344(result);
    }

    if (result === 0) {
        return 0;
    }

    if (
        result !== 0 &&
        result !== result &&
        (result & -result) >= (result & -result || 16 === result && (4194240 & result) !== 0)
    ) {
        return result;
    }

    if ((4 & result) !== 0) {
        result |= 16 & result;
    }

    let entangled = genericVar.entangledLanes;
    if (entangled !== 0) {
        const entanglements = genericVar.entanglements;
        for (let lane = entangled & result; lane !== 0; ) {
            const index = 31 - Math.clz32(lane);
            const mask = 1 << index;
            result |= entanglements[index];
            lane &= ~mask;
        }
    }

    return result;
}

function renamedFunctionvar_356(genericVar) {
    switch (genericVar) {
        case 1:
        case 2:
        case 4:
            return genericVar + 250;
        case 8:
        case 16:
        case 32:
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
            return genericVar + 5000;
        default:
            return -1;
    }
}

function renamedFunctionvar_363() {
    const lanes = [];
    for (let i = 0; i < 31; i++) {
        lanes.push(var_363);
    }
    return lanes;
}

function renamedFunctionvar_394(event) {
    switch (event) {
        case "focusin":
        case "focusout":
            return null;
        case "dragenter":
        case "dragleave":
            return null;
        case "mouseover":
        case "mouseout":
            return null;
        case "pointerover":
        case "pointerout":
            delete genericVar.pointerId;
            return;
        case "gotpointercapture":
        case "lostpointercapture":
            delete genericVar.pointerId;
            return;
        default:
            break;
    }
}

function renamedFunctionvar_397, genericVar, genericVar, genericVar, genericVar, genericVar {
    return null === genericVar || genericVar.nativeEvent !== genericVar ? (genericVar = {
        blockedOn: genericVar,
        domEventName: genericVar,
        eventSystemFlags: genericVar,
        nativeEvent: genericVar,
        targetContainers: [genericVar]
    }
    , null !== genericVar && null !== genericVar = genericVar(genericVar) && var_380var_398, genericVar) : genericVar.eventSystemFlags |= genericVar, genericVar = genericVar.targetContainers, null !== genericVar && -1 === genericVar.indexOf(genericVar && genericVar.pushvar_401, genericVar);
}
function renamedFunctionvar_404 {
    var genericVar = var_406var_404.target;
    if null !== genericVar {
        var genericVar = var_303var_405;
        if null !== genericVar {
            if 13 === (genericVar = genericVar.tag) {
                if null !== (genericVar = genericVar(genericVar)) {
                    genericVar.blockedOn = genericVar;
                    return void var_383var_404.priority, function ( {
                        var_381var_407;
                    }
                    );
                }
            }
            else {
                if 3 === genericVar && genericVar.stateNode.current.memoizedState.isDehydrated {
                    return void genericVar.blockedOn = 3 === genericVar.tag ? genericVar.stateNode.containerInfo : null;
                }
            }
        }
    }
    genericVar.blockedOn = null;
}
function renamedFunctionvar_409 {
    if null !== genericVar.blockedOn {
        return false;
    }
    for var genericVar = genericVar.targetContainers;
    0 < genericVar.length;
    {
        var genericVar = var_412var_409.domEventName, genericVar.eventSystemFlags, genericVar[0], genericVar.nativeEvent;
        if null !== genericVar {
            if null !== (genericVar = genericVar(genericVar)) {
                var_380var_410;
            }
            genericVar.blockedOn = genericVar;
            return false;
        }
        var genericVar = new genericVar = genericVar.nativeEvent.constructorvar_411.type, genericVar;
        genericVar = genericVar;
        genericVar.target.dispatchEventvar_413;
        genericVar = null;
        genericVar.shift;
    }
    return true;
}
function renamedFunctionvar_415, genericVar, genericVar {
    if genericVar(genericVar) {
        genericVar["delete"]genericVar;
    }
}
function genericVar {
    genericVar = false;
    if null !== genericVar && genericVar(genericVar) {
        genericVar = null;
    }
    if null !== genericVar && genericVar(genericVar) {
        genericVar = null;
    }
    if null !== genericVar && genericVar(genericVar) {
        genericVar = null;
    }
    genericVar.forEachvar_414;
    genericVar.forEachvar_414;
}
function renamedFunctionvar_420, genericVar {
    if genericVar.blockedOn === genericVar {
        genericVar.blockedOn = null;
        if !genericVar {
            genericVar = true;
            genericVar.unstable_scheduleCallbackvar_27.unstable_NormalPriority, genericVar;
        }
    }
}
function renamedFunctionvar_423 {
    function renamedFunctionvar_425 {
        return var_419var_425, genericVar;
    }
    if 0 < genericVar.length {
        var_419var_385[0], genericVar;
        for var genericVar = 1;
        genericVar < genericVar.length;
        genericVar++ {
            var genericVar = genericVar[genericVar];
            if genericVar.blockedOn === genericVar {
                genericVar.blockedOn = null;
            }
        }
    }
    if null !== genericVar {
        var_419var_386, genericVar;
    }
    if null !== genericVar {
        var_419var_387, genericVar;
    }
    if null !== genericVar {
        var_419var_388, genericVar;
    }
    genericVar.forEachvar_424;
    genericVar.forEachvar_424;
    for genericVar = 0;
    genericVar < genericVar.length;
    genericVar++ {
        if(genericVar = genericVar[genericVar].blockedOn === genericVar) {
            genericVar.blockedOn = null;
        }
    }
    for ;
    0 < genericVar.length && null === (genericVar = genericVar[0].blockedOn;
    ) {
        var_403var_426;
        if null === genericVar.blockedOn {
            genericVar.shift;
        }
    }
}
var genericVar = genericVar.ReactCurrentBatchConfig;
var genericVar = true;
function renamedFunctionvar_431, genericVar, genericVar, genericVar {
    var genericVar = genericVar;
    var genericVar = genericVar.transition;
    genericVar.transition = null;
    try {
        genericVar = 1;
        var_437var_431, genericVar, genericVar, genericVar;
    }
    finally {
        genericVar = genericVar;
        genericVar.transition = genericVar;
    }
}
function renamedFunctionvar_439, genericVar, genericVar, genericVar {
    var genericVar = genericVar;
    var genericVar = genericVar.transition;
    genericVar.transition = null;
    try {
        genericVar = 4;
        var_437var_439, genericVar, genericVar, genericVar;
    }
    finally {
        genericVar = genericVar;
        genericVar.transition = genericVar;
    }
}
function renamedFunctionvar_445, genericVar, genericVar, genericVar {
    if genericVar {
        var genericVar = var_412var_445, genericVar, genericVar, genericVar;
        if null === genericVar {
            var_450var_445, genericVar, genericVar, genericVar, genericVar;
            var_393var_445, genericVar;
        }
        else {
            if function (genericVar, genericVar, genericVar, genericVar, genericVar {
                switch genericVar {
                    case "focusin":
                    genericVar = var_396var_386, genericVar, genericVar, genericVar, genericVar, genericVar;
                    return true;
                    case "dragenter":
                    genericVar = var_396var_387, genericVar, genericVar, genericVar, genericVar, genericVar;
                    return true;
                    case "mouseover":
                    genericVar = var_396var_388, genericVar, genericVar, genericVar, genericVar, genericVar;
                    return true;
                    case "pointerover":
                    var genericVar = genericVar.pointerId;
                    genericVar.setvar_457, genericVar(genericVar.get(genericVar || null, genericVar, genericVar, genericVar, genericVar, genericVar));
                    return true;
                    case "gotpointercapture":
                    genericVar = genericVar.pointerId;
                    genericVar.setvar_457, genericVar(genericVar.get(genericVar || null, genericVar, genericVar, genericVar, genericVar, genericVar));
                    return true;
                }
                return false;
            }
            genericVar, genericVar, genericVar, genericVar, genericVar) {
                genericVar.stopPropagation;
            }
            else {
                var_393var_445, genericVar;
                if 4 & genericVar && -1 < genericVar.indexOf(genericVar) {
                    for ;
                    null !== genericVar;
                    {
                        var genericVar = var_249var_449;
                        if null !== genericVar {
                            var_379var_458;
                        }
                        if null === (genericVar = genericVar(genericVar, genericVar, genericVar, genericVar)) {
                            var_450var_445, genericVar, genericVar, genericVar, genericVar;
                        }
                        if genericVar === genericVar {
                            break;
                        }
                        genericVar = genericVar;
                    }
                    if null !== genericVar {
                        genericVar.stopPropagation;
                    }
                }
                else {
                    var_450var_445, genericVar, genericVar, null, genericVar;
                }
            }
        }
    }
}
var genericVar = null;
function renamedFunctionvar_459, genericVar, genericVar, genericVar {
    genericVar = null;
    if null !== (genericVar = genericVar(genericVar = genericVar(genericVar))) {
        if null === (genericVar = genericVar(genericVar)) {
            genericVar = null;
        }
        else {
            if 13 === (genericVar = genericVar.tag) {
                if null !== (genericVar = genericVar(genericVar)) {
                    return genericVar;
                }
                genericVar = null;
            }
            else {
                if 3 === genericVar {
                    if genericVar.stateNode.current.memoizedState.isDehydrated {
                        return 3 === genericVar.tag ? genericVar.stateNode.containerInfo : null;
                    }
                    genericVar = null;
                }
                else if genericVar !== genericVar {
                    genericVar = null;
                }
            }
        }
    }
    genericVar = genericVar;
    return null;
}
function renamedFunctionvar_464 {
    /* Event Handling */
switch genericVar {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
        return 1;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
        return 4;
        case "message":
        switch genericVar() {
            case genericVar:
            return 1;
            case genericVar:
            return 4;
            case genericVar:
            case genericVar:
            return 16;
            case genericVar:
            return 536870912;
            default:
            return 16;
        }
        default:
        return 16;
    }
}
var genericVar = null;
var genericVar = null;
var genericVar = null;
function genericVar {
    if genericVar {
        return genericVar;
    }
    var genericVar;
    var genericVar;
    var genericVar = genericVar;
    var genericVar = genericVar.length;
    var genericVar = "value" in genericVar ? genericVar.value : genericVar.textContent;
    var genericVar = genericVar.length;
    for genericVar = 0;
    genericVar < genericVar && genericVar[genericVar] === genericVar[genericVar];
    genericVar++ {
        ;
    }
    var genericVar = genericVar - genericVar;
    for genericVar = 1;
    genericVar <= genericVar && genericVar[genericVar - genericVar] === genericVar[genericVar - genericVar];
    genericVar++ {
        ;
    }
    return genericVar = genericVar.slicevar_469, 1 < genericVar ? 1 - genericVar : undefined;
}
var genericVar = null;
var genericVar = null;
var genericVar = null;

function genericVar(input) {
    if (input) {
        return input;
    }

    let startIndex = 0;
    let endIndex = 0;

    const length = input.length;
    const content = "value" in input ? input.value : input.textContent;
    const contentLength = content.length;

    // Identify the starting index where content begins to differ
    for (startIndex = 0; startIndex < contentLength && input[startIndex] === content[startIndex]; startIndex++) {
        // Loop through matching characters
    }

    // Identify the ending index where content begins to differ
    for (endIndex = 1; endIndex <= contentLength - startIndex && input[contentLength - endIndex] === content[contentLength - endIndex]; endIndex++) {
        // Loop through matching characters from the end
    }

    return content.slice(startIndex, contentLength - endIndex + 1 < startIndex ? 1 - startIndex : undefined);
}

function renamedFunctionvar_477(genericVar) {
    let keyCode = genericVar.keyCode;
    if ("charCode" in genericVar) {
        if (genericVar.charCode === 0 && keyCode === 13) {
            keyCode = 13;
        }
    } else {
        keyCode = keyCode;
    }
    if (keyCode === 10) {
        keyCode = 13;
    }
    return keyCode >= 32 || keyCode === 13 ? keyCode : 0;
}

function genericVar() {
    return true;
}

function genericVar() {
    return false;
}

function renamedFunctionvar_482() {
    function renamedFunctionvar_484(reactName, targetInst, type, nativeEvent, target) {
        this._reactName = reactName;
        this._targetInst = targetInst;
        this.type = type;
        this.nativeEvent = nativeEvent;
        this.target = target;
        this.currentTarget = null;

        for (const prop in nativeEvent) {
            if (nativeEvent.hasOwnProperty(prop)) {
                const value = nativeEvent[prop];
                this[prop] = value ? var_484(var_487) : nativeEvent[prop];
            }
        }

        this.isDefaultPrevented =
            nativeEvent.defaultPrevented != null
                ? nativeEvent.defaultPrevented
                : nativeEvent.returnValue === false;
        this.isPropagationStopped = false;

        return this;
    }

    Object.assign(renamedFunctionvar_484.prototype, {
        preventDefault: function () {
            this.defaultPrevented = true;
            const nativeEvent = this.nativeEvent;
            if (nativeEvent) {
                if (nativeEvent.preventDefault) {
                    nativeEvent.preventDefault();
                } else if (typeof nativeEvent.returnValue !== "unknown") {
                    nativeEvent.returnValue = false;
                }
                this.isDefaultPrevented = true;
            }
        },
        stopPropagation: function () {
            const nativeEvent = this.nativeEvent;
            if (nativeEvent) {
                if (nativeEvent.stopPropagation) {
                    nativeEvent.stopPropagation();
                } else if (typeof nativeEvent.cancelBubble !== "unknown") {
                    nativeEvent.cancelBubble = true;
                }
                this.isPropagationStopped = true;
            }
        },
        persist: function () {
            // Placeholder for persistence logic
        },
        isPersistent: genericVar,
    });

    return renamedFunctionvar_484;
}

var genericVar;
var genericVar;
var genericVar;

var genericVar = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (genericVar) {
        return genericVar.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
};

var genericVar = Object.assign({}, genericVar, {
    view: 0,
    detail: 0,
});

var genericVar = Object.assign({}, genericVar, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: genericVar,
    button: 0,
    buttons: 0,
    relatedTarget: function (nativeEvent) {
        return nativeEvent.relatedTarget === undefined
            ? nativeEvent.fromElement === nativeEvent.srcElement
                ? nativeEvent.toElement
                : nativeEvent.fromElement
            : nativeEvent.relatedTarget;
    },
    movementX: function (nativeEvent) {
        if ("movementX" in nativeEvent) {
            return nativeEvent.movementX;
        }
        return nativeEvent.type === "mousemove"
            ? nativeEvent.screenX - nativeEvent.screenX || 0
            : 0;
    },
    movementY: function (nativeEvent) {
        return "movementY" in nativeEvent ? nativeEvent.movementY : 0;
    },
});

var genericVar = Object.assign({}, genericVar, {
    dataTransfer: 0,
});

var genericVar = Object.assign({}, genericVar, {
    relatedTarget: 0,
});

var genericVar = Object.assign({}, genericVar, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0,
});

var genericVar = Object.assign({}, genericVar, {
    clipboardData: function (nativeEvent) {
        return "clipboardData" in nativeEvent ? nativeEvent.clipboardData : window.clipboardData;
    },
});

var genericVar = Object.assign({}, genericVar, {
    data: 0,
});

var genericVar = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
};

var genericVar = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
};

var genericVar = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
};

function renamedFunctionvar_517() {
    const nativeEvent = this.nativeEvent;
    return nativeEvent.getModifierState
        ? nativeEvent.getModifierState(var_517)
        : !!nativeEvent && !!nativeEvent[genericVar];
}

function genericVar() {
    return genericVar;
}

var genericVar = Object.assign({}, genericVar, {
    key: function genericVar(event) {
        if (event.key) {
            const resolvedKey = genericVar[event.key] || event.key;
            if (resolvedKey !== "Unidentified") {
                return resolvedKey;
            }
        }
        return event.type === "keypress"
            ? event.charCode === 13
                ? "Enter"
                : String.fromCharCode(var_520)
            : event.type === "keydown" || event.type === "keyup"
            ? genericVar[event.keyCode] || "Unidentified"
            : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: genericVar,
    charCode: function genericVar(event) {
        return event.type === "keypress" ? var_476(var_522) : 0;
    },
    keyCode: function genericVar(event) {
        return event.type === "keydown" || event.type === "keyup" ? event.keyCode : 0;
    },
    which: function genericVar(event) {
        return event.type === "keypress"
            ? var_476(var_524)
            : event.type === "keydown" || event.type === "keyup"
            ? event.keyCode
            : 0;
    },
});

var genericVar = Object.assign({}, genericVar, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
});

var genericVar = Object.assign({}, genericVar, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: genericVar,
});

var genericVar = Object.assign({}, genericVar, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0,
});

var genericVar = Object.assign({}, genericVar, {
    deltaX: function genericVar(event) {
        return "deltaX" in event
            ? event.deltaX
            : "wheelDeltaX" in event
            ? -event.wheelDeltaX
            : 0;
    },
    deltaY: function genericVar(event) {
        return "deltaY" in event
            ? event.deltaY
            : "wheelDeltaY" in event
            ? -event.wheelDeltaY
            : "wheelDelta" in event
            ? -event.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
});

var genericVar = [9, 13, 27, 32];
var genericVar = genericVar && "CompositionEvent" in window;
var genericVar = null;

if (genericVar && "documentMode" in document) {
    genericVar = document.documentMode;
}

var genericVar =
    genericVar && "TextEvent" in window && !genericVar && (!genericVar || (genericVar > 8 && genericVar <= 11));

var genericVar = String.fromCharCode(32);
var genericVar = false;

function renamedFunctionvar_541(eventType, event) {
    switch (eventType) {
        case "keyup":
            return genericVar.indexOf(event.keyCode) !== -1;
        case "keydown":
            return event.keyCode !== 229;
        case "keypress":
        case "mousedown":
        case "focusout":
            return true;
        default:
            return false;
    }
}

function renamedFunctionvar_544(event) {
    return typeof event === "object" && "detail" in event && "data" in event ? event.data : null;
}

var genericVar = false;

var genericVar = {
    color: true,
    date: true,
    datetime: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true,
};

function renamedFunctionvar_548(target) {
    const tagName = target && target.nodeName && target.nodeName.toLowerCase();
    return tagName === "input"
        ? !!genericVar[target.type]
        : tagName === "textarea";
}

function renamedFunctionvar_551(event, inst, listeners, nativeEvent) {
    var_252(var_554);
    if ((listeners = genericVar(inst, "onChange")).length > 0) {
        const syntheticEvent = new genericVar("onChange", "change", null, nativeEvent, inst);
        genericVar.push({
            event: syntheticEvent,
            listeners,
        });
    }
}

function renamedFunctionvar_559() {
    var_560(var_559, 0);
}

function renamedFunctionvar_562(target) {
    return genericVar(genericVar(target));
}

function renamedFunctionvar_565(eventType) {
    return eventType === "change" ? genericVar : null;
}

if (genericVar) {
    let onInputSupported = "oninput" in document;
    if (!onInputSupported) {
        const div = document.createElement("div");
        div.setAttribute("oninput", "return;");
        onInputSupported = typeof div.oninput === "function";
    }
    genericVar = onInputSupported && (!document.documentMode || document.documentMode > 9);
}

function genericVar() {
    if (genericVar) {
        genericVar.detachEvent("onpropertychange", genericVar);
        genericVar = null;
    }
}

function renamedFunctionvar_573(event) {
    if (event.propertyName === "value" && genericVar(event)) {
        const events = [];
        var_550(var_574, events, event, genericVar(event));
        var_262(var_558, events);
    }
}

function renamedFunctionvar_576(eventType, target, listener) {
    if (eventType === "focusin") {
        target.attachEvent("onpropertychange", listener);
    } else if (eventType === "focusout") {
        target.detachEvent("onpropertychange", listener);
    }
}

function renamedFunctionvar_580(genericVar) {
    if (genericVar === "selectionchange" || genericVar === "keyup" || genericVar === "keydown") {
        return var_561(var_557);
    }
}

function renamedFunctionvar_582(genericVar) {
    if (genericVar === "click") {
        return var_561(var_583);
    }
}

function renamedFunctionvar_585(genericVar) {
    if (genericVar === "input" || genericVar === "change") {
        return var_561(var_586);
    }
}

var genericVar =
    typeof Object.is === "function"
        ? Object.is
        : function (a, b) {
              return (
                  a === b && a !== 0 && b !== 0 || 1 / a === 1 / b || (a !== a && b !== b)
              );
          };

function renamedFunctionvar_591(a, b) {
    if (genericVar(a, b)) {
        return true;
    }
    if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
        return false;
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
        return false;
    }
    for (let i = 0; i < keysA.length; i++) {
        const key = keysA[i];
        if (!Object.prototype.hasOwnProperty.call(b, key) || !genericVar(a[key], b[key])) {
            return false;
        }
    }
    return true;
}

function renamedFunctionvar_597(genericVar) {
    while (genericVar && genericVar.firstChild) {
        genericVar = genericVar.firstChild;
    }
    return genericVar;
}

function renamedFunctionvar_599(root, offset) {
    let currentNode = root;
    let currentOffset = 0;

    while (currentNode) {
        if (currentNode.nodeType === 3) {
            const textLength = currentNode.textContent.length;
            currentOffset += textLength;
            if (currentOffset >= offset) {
                return {
                    node: currentNode,
                    offset: offset - (currentOffset - textLength),
                };
            }
        }

        if (currentNode.firstChild) {
            currentNode = currentNode.firstChild;
        } else {
            while (currentNode) {
                if (currentNode.nextSibling) {
                    currentNode = currentNode.nextSibling;
                    break;
                }
                currentNode = currentNode.parentNode;
            }
        }
    }

    return null;
}

                  /* Analysis and Simplification Start */

// Step 1: Analyzing Repeated Patterns
function renamedFunctionvar_605(input) {
    if (input === null || typeof input !== "object") {
        return null;
    }

    // Common repeated logic pattern
    while (input.firstChild) {
        input = input.firstChild;
    }
    return input;
}

// Step 2: Identifying Error-Prone Areas
function renamedFunctionvar_610(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== "object" || a === null || typeof b !== "object" || b === null) {
        return false;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
        return false;
    }

    for (let i = 0; i < keysA.length; i++) {
        const key = keysA[i];
        if (!Object.prototype.hasOwnProperty.call(b, key) || !renamedFunctionvar_605(a[key], b[key])) {
            return false;
        }
    }
    return true;
}

// Step 3: Simplifying Nested Code
function renamedFunctionvar_620(root, offset) {
    let currentNode = root;
    let currentOffset = 0;

    while (currentNode) {
        if (currentNode.nodeType === 3) { // Text node
            const textLength = currentNode.textContent.length;
            if (currentOffset + textLength >= offset) {
                return {
                    node: currentNode,
                    offset: offset - currentOffset,
                };
            }
            currentOffset += textLength;
        }

        if (currentNode.firstChild) {
            currentNode = currentNode.firstChild;
        } else {
            while (currentNode && !currentNode.nextSibling) {
                currentNode = currentNode.parentNode;
            }
            if (currentNode) {
                currentNode = currentNode.nextSibling;
            }
        }
    }
    return null;
}

// Step 4: Modularizing Components
function processEvent(eventType) {
    switch (eventType) {
        case "selectionchange":
        case "keyup":
        case "keydown":
            return handleSelectionEvent;
        case "click":
            return handleClickEvent;
        case "input":
        case "change":
            return handleInputEvent;
        default:
            return null;
    }
}

function handleSelectionEvent(event) {
    // Logic for handling selection events
}

function handleClickEvent(event) {
    // Logic for handling click events
}

function handleInputEvent(event) {
    // Logic for handling input events
}

/* Modularized Code End */

export { renamedFunctionvar_605, renamedFunctionvar_610, renamedFunctionvar_620, processEvent };

function genericVar() {
    let currentWindow = window;

    while (currentWindow instanceof currentWindow.HTMLIFrameElement) {
        try {
            const isAccessible = typeof currentWindow.contentWindow.location.href === "string";
            if (!isAccessible) {
                break;
            }
            currentWindow = currentWindow.contentWindow.document;
        } catch (error) {
            return false;
        }
    }

    return currentWindow;
}

function renamedFunctionvar_613(element) {
    const nodeName = element && element.nodeName && element.nodeName.toLowerCase();
    return (
        nodeName &&
        (nodeName === "input" &&
            (element.type === "text" ||
                element.type === "search" ||
                element.type === "tel" ||
                element.type === "url" ||
                element.type === "password")) ||
        nodeName === "textarea" ||
        element.contentEditable === "true"
    );
}

                  // Simplified and Modularized Code

// Function to process nested iframes
function processNestedFrames() {
    let currentWindow = window;

    while (currentWindow instanceof currentWindow.HTMLIFrameElement) {
        try {
            const isAccessible = typeof currentWindow.contentWindow.location.href === "string";
            if (!isAccessible) {
                break;
            }
            currentWindow = currentWindow.contentWindow.document;
        } catch (error) {
            return false; // Return false if access is restricted
        }
    }

    return currentWindow;
}

// Function to check if an element is editable
function isEditableElement(element) {
    const nodeName = element?.nodeName?.toLowerCase();

    return (
        (nodeName === "input" &&
            ["text", "search", "tel", "url", "password"].includes(element.type)) ||
        nodeName === "textarea" ||
        element.contentEditable === "true"
    );
}

// Export the functions for use elsewhere
export { processNestedFrames, isEditableElement };

                     // Function to store scroll positions and restore them
function storeAndRestoreScrollPositions() {
    const scrollPositions = [];
    let currentElement = document;

    // Traverse up the DOM and store scroll positions
    while (currentElement) {
        if (currentElement.nodeType === 1) { // Element node
            scrollPositions.push({
                element: currentElement,
                left: currentElement.scrollLeft,
                top: currentElement.scrollTop,
            });
        }
        currentElement = currentElement.parentNode;
    }

    // Focus on the top-level element
    if (typeof currentElement.focus === "function") {
        currentElement.focus();
    }

    // Restore scroll positions
    scrollPositions.forEach((pos) => {
        pos.element.scrollLeft = pos.left;
        pos.element.scrollTop = pos.top;
    });
}

// Function to handle input element selection and interaction
function handleInputSelection(element) {
    const nodeName = element?.nodeName?.toLowerCase();

    return (
        nodeName === "input" &&
        ["text", "search", "tel", "url", "password"].includes(element.type) ||
        nodeName === "textarea" ||
        element.contentEditable === "true"
    );
}

// Event map with key translations
const eventMapping = {
    animationend: "onAnimationEnd",
    animationiteration: "onAnimationIteration",
    animationstart: "onAnimationStart",
    transitionend: "onTransitionEnd",
    dblclick: "onDoubleClick",
    focusin: "onFocus",
    focusout: "onBlur",
};

// Normalize event name for specific browsers
function normalizeEventName(eventName) {
    return (
        eventMapping[eventName] ||
        eventName.toLowerCase().replace(/^on/, "").replace(/^\w/, (c) => c.toUpperCase())
    );
}

// Function to handle complex event delegation
function handleComplexEventDelegation(event, handlers) {
    const eventType = event?.type || "unknown-event";
    event.currentTarget = event.target;

    // Apply handlers
    handlers.forEach((handler) => {
        try {
            handler.apply(this, [event]);
        } catch (error) {
            throw new Error(`Error in handler for ${eventType}: ${error.message}`);
        }
    });

    // Reset current target
    event.currentTarget = null;
}

function renamedFunctionvar_672(eventQueue) {
    const isBubbling = (4 & eventQueue) !== 0;

    for (let i = 0; i < eventQueue.length; i++) {
        const eventEntry = eventQueue[i];
        const event = eventEntry.event;
        const listeners = event.listeners;

        if (listeners) {
            for (let j = listeners.length - 1; j >= 0; j--) {
                const listenerEntry = listeners[j];
                const currentTarget = listenerEntry.currentTarget;
                const listener = listenerEntry.listener;

                if (listener !== null && event.isPropagationStopped()) {
                    break;
                }

                // Call listener with the appropriate context
                listener.call(currentTarget, event);
            }
        }
    }
}

function renamedFunctionvar_684(eventType, eventMap) {
    const eventSet = eventMap[eventType] || new Set();
    const bubbleEventName = `${eventType}__bubble`;

    if (!eventSet.has(bubbleEventName)) {
        eventSet.add(bubbleEventName);
        eventMap[eventType] = eventSet;
    }
}

function renamedFunctionvar_691(eventType, priority) {
    let priorityLevel = 0;
    if (priority) {
        priorityLevel |= 4;
    }

    // Handle the event scheduling logic
    handleEventScheduling(eventType, priorityLevel);
}

const genericVar = `_reactListening${Math.random().toString(36).slice(2)}`;

function renamedFunctionvar_697(root) {
    if (!root[genericVar]) {
        root[genericVar] = true;

        // Add event listeners for event types
        ["selectionchange", "click", "focus"].forEach((eventType) => {
            if (!root.has(eventType)) {
                addGlobalEventListener(eventType, false, root);
            }
        });

        // Add document-specific event listeners
        const doc = root.nodeType === 9 ? root : root.ownerDocument;
        if (doc && !doc[genericVar]) {
            doc[genericVar] = true;
            addGlobalEventListener("selectionchange", false, doc);
        }
    }
}

function renamedFunctionvar_700(eventType, handler, options) {
    const passiveEvents = ["touchstart", "touchmove", "wheel"];
    const isPassive = passiveEvents.includes(eventType);
    const eventOptions = options || { capture: true, passive: isPassive };

    if (typeof handler === "function") {
        document.addEventListener(eventType, handler, eventOptions);
    } else {
        console.error(`Handler for ${eventType} is not a function.`);
    }
}

function renamedFunctionvar_705(root, eventType, handler) {
    let currentNode = root;

    while (currentNode) {
        const tag = currentNode.tag;

        // Handle specific tag cases
        if (tag === 3 || tag === 4) {
            const containerInfo = currentNode.stateNode.containerInfo;
            if (containerInfo === root || containerInfo.parentNode === root) {
                break;
            }
        }

        currentNode = currentNode.parentNode;
    }

    // If the handler is defined, bind it to the event
    if (typeof handler === "function") {
        handler.call(root, eventType);
    }
}

function handleEventProcessing(event) {
    let processedListeners = [];
    const eventType = event.type;

    // Handle specific event types
    switch (eventType) {
        case "keypress":
            if (event.charCode === 0) {
                break;
            }
        case "keydown":
        case "keyup":
            processedListeners = event.listeners;
            break;
        case "focusin":
            processedListeners = "focus";
            break;
        case "focusout":
            processedListeners = "blur";
            break;
        case "click":
            if (event.button === 2) {
                break;
            }
        case "dblclick":
        case "mousedown":
        case "mousemove":
        case "mouseup":
        case "mouseout":
        case "mouseover":
        case "contextmenu":
            processedListeners = event.listeners;
            break;
        case "drag":
        case "dragend":
        case "dragenter":
        case "dragleave":
        case "dragover":
        case "dragstart":
        case "drop":
            processedListeners = event.listeners;
            break;
        case "touchcancel":
        case "touchend":
        case "touchmove":
        case "touchstart":
            processedListeners = event.listeners;
            break;
        case "scroll":
            processedListeners = event.listeners;
            break;
        case "wheel":
            processedListeners = event.listeners;
            break;
        case "copy":
        case "cut":
        case "paste":
            processedListeners = event.listeners;
            break;
        default:
            break;
    }

    // Iterate over listeners and process them
    if (processedListeners.length > 0) {
        const syntheticEvent = {
            event: event,
            listeners: processedListeners,
        };

        processedListeners.forEach((listenerObj) => {
            const { listener, currentTarget } = listenerObj;
            if (listener && typeof listener === "function" && !event.isPropagationStopped()) {
                listener.call(currentTarget, syntheticEvent);
            }
        });
    }
}

function handleMouseRelatedEvents(event) {
    if (["mouseout", "pointerout"].includes(event.type)) {
        const relatedTarget = event.relatedTarget || event.fromElement;
        if (!relatedTarget || relatedTarget !== event.target) {
            return {
                eventType: "onMouseLeave",
                relatedTarget,
            };
        }
    } else if (["mouseover", "pointerover"].includes(event.type)) {
        const relatedTarget = event.relatedTarget || event.toElement;
        if (!relatedTarget || relatedTarget !== event.target) {
            return {
                eventType: "onMouseEnter",
                relatedTarget,
            };
        }
    }
    return null;
}

function handleFocusEvents(event) {
    if (event.type === "focusin") {
        return "focus";
    } else if (event.type === "focusout") {
        return "blur";
    }
    return null;
}

function isSelectableElement(element) {
    const nodeName = element.nodeName?.toLowerCase();
    return (
        (nodeName === "input" && (element.type === "checkbox" || element.type === "radio")) ||
        nodeName === "select" ||
        (nodeName === "input" && element.type === "file")
    );
}

function handleGenericEvent(event) {
    let eventType = event.type;
    let shouldProcess = false;

    // Handle specific event types
    switch (eventType) {
        case "focusout":
            event = null;
            break;

        case "mousedown":
            shouldProcess = true;
            break;

        case "contextmenu":
        case "mouseup":
        case "dragend":
            shouldProcess = false;
            break;

        case "selectionchange":
            if (!event) {
                break;
            }

        case "keydown":
        case "keyup":
            processEventListeners(event);
            break;

        default:
            break;
    }

    // Handle composition events
    if (eventType) {
        switch (eventType) {
            case "compositionstart":
                eventType = "onCompositionStart";
                break;
            case "compositionend":
                eventType = "onCompositionEnd";
                break;
            case "compositionupdate":
                eventType = "onCompositionUpdate";
                break;
            default:
                eventType = undefined;
        }
    }

    if (!eventType && event) {
        if (event.type === "keydown" && event.keyCode === 229) {
            eventType = "onCompositionStart";
        }
    }

    if (eventType) {
        if (eventType === "onCompositionEnd" && event.data) {
            // If event data exists, assign it
            event.data = event.data;
        } else if (eventType === "onCompositionStart") {
            event.data = event.target.value || event.target.textContent;
            shouldProcess = true;
        }
    }

    // If there are listeners, process the event
    const listeners = getEventListeners(event, eventType);
    if (listeners && listeners.length > 0) {
        const syntheticEvent = new SyntheticEvent(eventType, event, listeners);
        syntheticEvent.data = event.data;

        listeners.forEach((listener) => {
            listener.callback(syntheticEvent);
        });
    }
}

function processEventListeners(event) {
    // Process generic listeners
    const listeners = event.listeners || [];
    listeners.forEach((listener) => {
        if (listener.callback && typeof listener.callback === "function") {
            listener.callback(event);
        }
    });
}

function getEventListeners(event, eventType) {
    // Logic to fetch relevant listeners for the event type
    return event.listeners || [];
}

function SyntheticEvent(type, originalEvent, listeners) {
    this.type = type;
    this.originalEvent = originalEvent;
    this.listeners = listeners;
    this.data = null;
}

function renamedFunctionvar_741(eventType, root) {
    const eventTypeCapture = `${eventType}Capture`;
    const listeners = [];

    while (root !== null) {
        const stateNode = root.stateNode;

        if (root.tag === 5 && stateNode !== null) {
            // Collect listeners for capturing phase
            const captureListener = getListener(stateNode, eventTypeCapture);
            if (captureListener !== null) {
                listeners.unshift({
                    instance: root,
                    listener: captureListener,
                    currentTarget: stateNode,
                });
            }

            // Collect listeners for bubbling phase
            const bubbleListener = getListener(stateNode, eventType);
            if (bubbleListener !== null) {
                listeners.push({
                    instance: root,
                    listener: bubbleListener,
                    currentTarget: stateNode,
                });
            }
        }

        root = root.return;
    }

    return listeners;
}

function renamedFunctionvar_747(node) {
    if (node === null) {
        return null;
    }

    do {
        node = node.return;
    } while (node && node.tag !== 5);

    return node || null;
}

function renamedFunctionvar_748(event, root, eventType, capturePhase, bubblePhase) {
    const reactName = event._reactName;
    const listeners = [];

    while (root !== null && root !== event.currentTarget) {
        const alternate = root.alternate;
        const stateNode = root.stateNode;

        if (stateNode !== null && stateNode === event.currentTarget) {
            break;
        }

        if (root.tag === 5 && stateNode !== null) {
            if (capturePhase) {
                const captureListener = getListener(stateNode, `${reactName}Capture`);
                if (captureListener !== null) {
                    listeners.unshift({
                        instance: root,
                        listener: captureListener,
                        currentTarget: stateNode,
                    });
                }
            }

            if (bubblePhase) {
                const bubbleListener = getListener(stateNode, reactName);
                if (bubbleListener !== null) {
                    listeners.push({
                        instance: root,
                        listener: bubbleListener,
                        currentTarget: stateNode,
                    });
                }
            }
        }

        root = root.return;
    }

    if (listeners.length > 0) {
        event.listeners = listeners;
    }
}

const newlineRegex = /\r\n?/g;
const invalidCharRegex = /\u0000|\uFFFD/g;

function renamedFunctionvar_761(input) {
    if (typeof input !== "string") {
        input = String(input);
    }

    input = input.replace(newlineRegex, "\n").replace(invalidCharRegex, "");

    if (input === "") {
        throw new Error("Empty string or invalid characters found (Error 425).");
    }

    return input;
}

function getListener(stateNode, eventType) {
    // Placeholder function for retrieving event listeners
    // Replace this with your actual implementation
    return stateNode?.listeners?.[eventType] || null;
}

                  // Generic Variable Initialization
let timeoutFn = typeof setTimeout === "function" ? setTimeout : undefined;
let clearTimeoutFn = typeof clearTimeout === "function" ? clearTimeout : undefined;
let promiseFn = typeof Promise === "function" ? Promise : undefined;
let microtaskQueueFn =
    typeof queueMicrotask === "function"
        ? queueMicrotask
        : promiseFn
        ? function (callback) {
              promiseFn.resolve(null).then(callback).catch(() => {});
          }
        : undefined;

// Function to handle asynchronous errors
function handleAsyncError() {
    setTimeout(() => {
        throw new Error("An asynchronous error occurred.");
    });
}

// Function to process DOM nodes
function processDomNodes(node) {
    let counter = 0;

    while (node) {
        const nextSibling = node.nextSibling;
        if (nextSibling && nextSibling.nodeType === 8) {
            const data = nextSibling.data;
            if (data === "/$") {
                if (counter === 0) {
                    nextSibling.remove();
                    return;
                }
                counter--;
            } else if (data === "$" || data === "$!" || data === "$?") {
                counter++;
            }
        }
        node = nextSibling;
    }
}

// Function to find the next relevant DOM node
function findNextRelevantNode(node) {
    while (node) {
        if (node.nodeType === 1 || node.nodeType === 3) {
            break;
        }
        if (node.nodeType === 8) {
            const data = node.data;
            if (data === "$" || data === "$!" || data === "$?") {
                break;
            }
            if (data === "/$") {
                return null;
            }
        }
        node = node.nextSibling;
    }
    return node;
}

// Function to find the previous relevant DOM node
function findPreviousRelevantNode(node) {
    let counter = 0;

    while (node) {
        if (node.nodeType === 8) {
            const data = node.data;
            if (data === "$" || data === "$!" || data === "$?") {
                if (counter === 0) {
                    return node;
                }
                counter--;
            } else if (data === "/$") {
                counter++;
            }
        }
        node = node.previousSibling;
    }
    return null;
}

// React Fiber Helpers
const fiberKey = `__reactFiber$${Math.random().toString(36).slice(2)}`;
const propsKey = `__reactProps$${Math.random().toString(36).slice(2)}`;
const containerKey = `__reactContainer$${Math.random().toString(36).slice(2)}`;
const eventsKey = `__reactEvents$${Math.random().toString(36).slice(2)}`;
const listenersKey = `__reactListeners$${Math.random().toString(36).slice(2)}`;
const handlesKey = `__reactHandles$${Math.random().toString(36).slice(2)}`;

// Function to retrieve React Fiber
function getReactFiber(node) {
    let fiber = node[fiberKey];
    if (fiber) {
        return fiber;
    }

    while ((node = node.parentNode)) {
        fiber = node[fiberKey];
        if (fiber) {
            return fiber;
        }
    }
    return null;
}

// Function to validate React Fiber tags
function validateReactFiberTag(fiber) {
    const validTags = [5, 6, 13, 3];
    return validTags.includes(fiber?.tag) ? fiber : null;
}

// Function to retrieve state node from Fiber
function getStateNodeFromFiber(fiber) {
    if (fiber.tag === 5 || fiber.tag === 6) {
        return fiber.stateNode;
    }
    throw new Error("Invalid Fiber tag. Expected 5 or 6.");
}

// Stack Management
const stack = [];
let stackIndex = -1;

function popFromStack() {
    if (stackIndex >= 0) {
        const item = stack[stackIndex];
        stack[stackIndex] = null;
        stackIndex--;
        return item;
    }
    return null;
}

function pushToStack(item) {
    stackIndex++;
    stack[stackIndex] = item;
}

// Exported References
const globalRef = { current: null };
const booleanFlag = { current: false };

                   // Context-related Functions
function getMaskedChildContext(fiber, context) {
    const contextTypes = fiber.type?.contextTypes;

    if (!contextTypes) {
        return context;
    }

    const stateNode = fiber.stateNode;

    if (stateNode?.__reactInternalMemoizedUnmaskedChildContext === context) {
        return stateNode.__reactInternalMemoizedMaskedChildContext;
    }

    const maskedContext = {};

    for (let key in contextTypes) {
        if (contextTypes.hasOwnProperty(key)) {
            maskedContext[key] = context[key];
        }
    }

    stateNode.__reactInternalMemoizedUnmaskedChildContext = context;
    stateNode.__reactInternalMemoizedMaskedChildContext = maskedContext;

    return maskedContext;
}

function hasChildContext(fiber) {
    return fiber?.type?.childContextTypes != null;
}

function getChildContext(fiber, parentContext) {
    const stateNode = fiber.stateNode;
    const childContextTypes = fiber.type?.childContextTypes;

    if (typeof stateNode.getChildContext !== "function") {
        return parentContext;
    }

    const childContext = stateNode.getChildContext();
    for (let key in childContext) {
        if (!(key in childContextTypes)) {
            throw new Error(`Invalid child context key: "${key}"`);
        }
    }

    return { ...parentContext, ...childContext };
}

function processChildContext(fiber, context) {
    if (fiber.stateNode?.__reactInternalMemoizedMergedChildContext === context) {
        return context;
    }

    const childContext = hasChildContext(fiber)
        ? getChildContext(fiber, context)
        : context;

    fiber.stateNode.__reactInternalMemoizedMergedChildContext = childContext;
    return childContext;
}

// Fiber Utility Functions
function getNearestHostComponent(fiber) {
    while (fiber && fiber.tag !== 5) {
        fiber = fiber.return;
    }
    return fiber || null;
}

function getStateNode(fiber) {
    if (fiber.tag === 5 || fiber.tag === 6) {
        return fiber.stateNode;
    }
    throw new Error("Invalid Fiber tag for state node retrieval.");
}

// Stack Management
const stack = [];
let stackIndex = -1;

function pushToStack(item) {
    stackIndex++;
    stack[stackIndex] = item;
}

function popFromStack() {
    if (stackIndex >= 0) {
        const item = stack[stackIndex];
        stack[stackIndex] = null;
        stackIndex--;
        return item;
    }
    return null;
}

// Miscellaneous Utility Functions
function createDeletionFiber() {
    const deletionFiber = { elementType: "DELETED", stateNode: null };
    deletionFiber.return = null;
    return deletionFiber;
}

function processFiber(fiber) {
    switch (fiber.tag) {
        case 5: // Host component
            if (fiber.stateNode) {
                return fiber;
            }
            break;
        case 6: // Text node
            if (fiber.pendingProps === "") {
                return fiber;
            }
            break;
        case 13: // Suspense component
            const dehydrated = fiber.stateNode?.dehydrated;
            if (dehydrated) {
                fiber.memoizedState = {
                    dehydrated,
                    treeContext: null,
                    retryLane: 1073741824, // Lane constant
                };
                const suspenseFallback = createDeletionFiber();
                suspenseFallback.return = fiber;
                fiber.child = suspenseFallback;
                return suspenseFallback;
            }
            break;
        default:
            break;
    }
    return null;
}

function validateFiberMode(fiber) {
    if (fiber.mode & 1 && !(fiber.flags & 128)) {
        throw new Error("Fiber validation error: Invalid mode or flags.");
    }
}

function handleFiberDeletion(fiber) {
    validateFiberMode(fiber);

    fiber.flags = (fiber.flags & ~4097) | 2; // Adjust flags
    fiber.stateNode = null; // Clear stateNode for deletion
}

// Error-handling Helpers
function throwError(errorCode, message) {
    throw new Error(`Error ${errorCode}: ${message}`);
}

                    // Fiber Traversal Functions
function findNearestRelevantFiber(fiber) {
    while (fiber !== null && fiber.tag !== 5 && fiber.tag !== 3 && fiber.tag !== 13) {
        fiber = fiber.return;
    }
    return fiber;
}

function processFiberNode(fiber) {
    if (fiber.tag !== fiber.tag) {
        return false;
    }

    if (!fiber) {
        resetProcessing();
        return false;
    }

    let validNode = false;

    if (fiber.tag !== 3 && fiber.tag !== 5) {
        const type = fiber.type;
        validNode =
            type !== "head" &&
            type !== "body" &&
            type !== "textarea" &&
            type !== "noscript" &&
            (typeof fiber.memoizedProps.children === "string" ||
                typeof fiber.memoizedProps.children === "number" ||
                (fiber.memoizedProps.dangerouslySetInnerHTML &&
                    fiber.memoizedProps.dangerouslySetInnerHTML.__html !== null));
    }

    if (validNode) {
        if ((fiber.mode & 1) !== 0 && (fiber.flags & 128) === 0) {
            throw new Error("Error 418: Invalid mode or flags on fiber.");
        }

        while (fiber) {
            processSiblingNodes(fiber);
            fiber = fiber.nextSibling;
        }
    }

    resetProcessing();

    if (fiber.tag === 13) {
        if (!fiber.memoizedState?.dehydrated) {
            throw new Error("Error 317: Suspense component is not dehydrated.");
        }
        return processDehydratedNode(fiber);
    }

    return true;
}

function processSiblingNodes(node) {
    while (node !== null) {
        node = node.nextSibling;
    }
}

function processDehydratedNode(fiber) {
    let node = fiber.nextSibling;
    let counter = 0;

    while (node !== null) {
        if (node.nodeType === 8) {
            const data = node.data;

            if (data === "/$") {
                if (counter === 0) {
                    return node.nextSibling;
                }
                counter--;
            } else if (data === "$" || data === "$!" || data === "$?") {
                counter++;
            }
        }
        node = node.nextSibling;
    }
    return null;
}

// Context Management
function applyDefaultProps(type, props) {
    if (type?.defaultProps) {
        const defaultProps = type.defaultProps;
        for (let key in defaultProps) {
            if (props[key] === undefined) {
                props[key] = defaultProps[key];
            }
        }
    }
    return props;
}

// Dependency Management
function updateDependencies(fiber, lane) {
    while (fiber !== null) {
        const alternate = fiber.alternate;

        if ((fiber.childLanes & lane) !== lane) {
            fiber.childLanes |= lane;

            if (alternate !== null) {
                alternate.childLanes |= lane;
            }
        } else if (alternate !== null && (alternate.childLanes & lane) !== lane) {
            alternate.childLanes |= lane;
        }

        if (fiber === fiber.return) {
            break;
        }
        fiber = fiber.return;
    }
}

function processContextDependencies(fiber, lane) {
    if (fiber.dependencies?.firstContext) {
        const dependencies = fiber.dependencies;
        if ((dependencies.lanes & lane) !== 0) {
            dependencies.firstContext = null;
        }
    }
}

function createContextDependency(context, value) {
    const dependency = {
        context,
        memoizedValue: value,
        next: null,
    };

    return dependency;
}

// Utility Functions
function resetProcessing() {
    processingQueue = null;
    isProcessing = false;
}

const processingQueue = [];
let isProcessing = false;

// Global References
const ReactCurrentBatchConfig = { current: null };
const globalState = { current: null };
const contextQueue = { current: null };


                // Function to initialize or push updates into an update queue
function initializeOrPushUpdate(updateQueue, newUpdate) {
    if (updateQueue.pending === null) {
        newUpdate.next = newUpdate; // Circular list
        updateQueue.pending = newUpdate;
    } else {
        newUpdate.next = updateQueue.pending.next;
        updateQueue.pending.next = newUpdate;
        updateQueue.pending = newUpdate; // Move pointer to the last update
    }
}

// Function to handle interleaved updates
function handleInterleavedUpdates(updateQueue, newUpdate) {
    if (updateQueue.interleaved === null) {
        newUpdate.next = newUpdate; // Circular list
        updateQueue.interleaved = newUpdate;
    } else {
        newUpdate.next = updateQueue.interleaved.next;
        updateQueue.interleaved.next = newUpdate;
    }
    updateQueue.interleaved = newUpdate; // Update the pointer
}

// Function to propagate lanes to parent fibers
function propagateLanesToParent(fiber, lane) {
    fiber.lanes |= lane;
    const alternate = fiber.alternate;
    if (alternate !== null) {
        alternate.lanes |= lane;
    }

    let parent = fiber.return;
    while (parent !== null) {
        parent.childLanes |= lane;
        if (parent.alternate !== null) {
            parent.alternate.childLanes |= lane;
        }
        parent = parent.return;
    }
    return parent?.tag === 3 ? parent.stateNode : null; // Return the root fiber's state node if applicable
}

// Function to reset or clone an update queue
function cloneOrResetUpdateQueue(fiber) {
    const updateQueue = fiber.updateQueue;

    if (fiber.updateQueue === fiber) {
        fiber.updateQueue = {
            baseState: updateQueue.baseState,
            firstBaseUpdate: updateQueue.firstBaseUpdate,
            lastBaseUpdate: updateQueue.lastBaseUpdate,
            shared: updateQueue.shared,
            effects: updateQueue.effects,
        };
    }
}

// Function to process updates and apply changes to a fiber
function processUpdateQueue(fiber, renderLane) {
    const updateQueue = fiber.updateQueue;
    let newBaseState = updateQueue.baseState;

    let firstBaseUpdate = updateQueue.firstBaseUpdate;
    let lastBaseUpdate = updateQueue.lastBaseUpdate;

    let pendingQueue = updateQueue.shared.pending;
    if (pendingQueue !== null) {
        updateQueue.shared.pending = null;

        const lastPendingUpdate = pendingQueue;
        const firstPendingUpdate = lastPendingUpdate.next;

        if (lastBaseUpdate === null) {
            firstBaseUpdate = firstPendingUpdate;
        } else {
            lastBaseUpdate.next = firstPendingUpdate;
        }

        lastBaseUpdate = lastPendingUpdate;
    }

    let newFirstBaseUpdate = null;
    let newLastBaseUpdate = null;

    let update = firstBaseUpdate;
    while (update !== null) {
        const updateLane = update.lane;

        if ((updateLane & renderLane) === renderLane) {
            if (newLastBaseUpdate === null) {
                newFirstBaseUpdate = update;
            } else {
                newLastBaseUpdate.next = update;
            }
            newLastBaseUpdate = update;

            // Apply state update
            newBaseState = applyUpdate(update, newBaseState, fiber);
        }

        update = update.next;
    }

    if (newLastBaseUpdate === null) {
        newBaseState = fiber.memoizedState;
    } else {
        newLastBaseUpdate.next = null;
    }

    fiber.updateQueue = {
        baseState: newBaseState,
        firstBaseUpdate: newFirstBaseUpdate,
        lastBaseUpdate: newLastBaseUpdate,
        shared: updateQueue.shared,
        effects: updateQueue.effects,
    };

    return newBaseState;
}

// Helper to apply a single update
function applyUpdate(update, prevState, fiber) {
    switch (update.tag) {
        case 1: // Replace state
            return typeof update.payload === "function"
                ? update.payload(prevState, fiber)
                : update.payload;
        case 3: // Force update
            fiber.flags |= 128; // Add force update flag
        case 0: // Partial state
            return typeof update.payload === "function"
                ? { ...prevState, ...update.payload(prevState, fiber) }
                : { ...prevState, ...update.payload };
        default:
            return prevState;
    }
}

// Initialize an empty update queue
function initializeUpdateQueue(fiber) {
    fiber.updateQueue = {
        baseState: fiber.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
            pending: null,
            interleaved: null,
            lanes: 0,
        },
        effects: null,
    };
}

// Utility to combine lanes
function combineLanes(queue, renderLane) {
    if (queue?.shared && queue.shared.lanes) {
        const pendingLanes = queue.shared.lanes & renderLane;
        queue.shared.lanes = pendingLanes;
        return pendingLanes;
    }
    return 0;
}

                    // Executes effects and calls their callbacks
function executeEffects(fiber) {
    const effects = fiber.effects;
    fiber.effects = null; // Reset effects list

    if (effects !== null) {
        for (let i = 0; i < effects.length; i++) {
            const effect = effects[i];
            const callback = effect.callback;

            if (callback !== null) {
                effect.callback = null;

                if (typeof callback !== "function") {
                    throw new Error(`Invalid callback type: ${callback}`);
                }

                callback.call(fiber);
            }
        }
    }
}

// Handles the process of replacing or setting state for class components
function replaceOrSetState(fiber, nextState, queueIsEmpty = false) {
    if (nextState === null) {
        nextState = {};
    }

    fiber.memoizedState = nextState;

    if (queueIsEmpty) {
        fiber.updateQueue.baseState = nextState;
    }
}

// Validates whether a component is mounted
const ReactComponent = {
    isMounted: function (fiber) {
        return !!fiber && fiber._reactInternals && fiber._reactInternals === fiber;
    },

    enqueueSetState(fiber, partialState, callback = null) {
        enqueueUpdate(fiber, partialState, callback, 0);
    },

    enqueueReplaceState(fiber, nextState, callback = null) {
        enqueueUpdate(fiber, nextState, callback, 1);
    },

    enqueueForceUpdate(fiber, callback = null) {
        enqueueUpdate(fiber, null, callback, 2);
    },
};

// Enqueues an update for the given fiber
function enqueueUpdate(fiber, state, callback, tag) {
    const eventTime = Date.now();
    const lane = determineLanePriority();

    const update = {
        eventTime,
        lane,
        tag,
        payload: state,
        callback,
        next: null,
    };

    addUpdateToQueue(fiber, update);
}

// Adds an update to the fiber's update queue
function addUpdateToQueue(fiber, update) {
    const updateQueue = fiber.updateQueue;

    if (updateQueue.shared.pending === null) {
        update.next = update;
    } else {
        update.next = updateQueue.shared.pending.next;
        updateQueue.shared.pending.next = update;
    }

    updateQueue.shared.pending = update;
}

// Determines if a component should update
function shouldComponentUpdate(instance, nextProps, nextState) {
    if (
        typeof instance.shouldComponentUpdate === "function" &&
        !instance.shouldComponentUpdate(nextProps, nextState)
    ) {
        return false;
    }

    if (instance.isPureReactComponent) {
        return shallowCompare(instance.props, nextProps) || shallowCompare(instance.state, nextState);
    }

    return true;
}

// Sets the initial state and context for a class component
function initializeClassComponent(instance, workInProgress, renderExpirationTime) {
    let context = emptyContextObject;
    const Component = workInProgress.type;
    const props = workInProgress.pendingProps;

    // Resolve context
    if (typeof Component.contextType === "object" && Component.contextType !== null) {
        context = readContext(Component.contextType);
    } else {
        context = resolveContext(Component, workInProgress);
    }

    // Initialize state and updater
    instance = new Component(props, context);
    instance.props = props;
    instance.context = context;
    instance.refs = emptyRefsObject;
    instance.updater = ReactComponent;
    instance.state = instance.state || null;

    // Initialize derived state
    if (typeof Component.getDerivedStateFromProps === "function") {
        instance.state = applyDerivedStateFromProps(
            workInProgress,
            Component,
            props,
            instance.state
        );
    }
}

// Processes a single effect
function processEffect(effect) {
    if (effect.tag === "update") {
        // Execute update logic
    } else if (effect.tag === "delete") {
        // Execute deletion logic
    }
}

// Validates a ref
function validateRef(ref, owner) {
    if (typeof ref === "string" && owner) {
        const stringRef = createStringRef(ref, owner);
        return stringRef;
    } else if (typeof ref === "function" || (typeof ref === "object" && ref !== null)) {
        return ref;
    }

    throw new Error(`Invalid ref: ${ref}`);
}

// Creates a string-based ref
function createStringRef(ref, owner) {
    return function (value) {
        if (!owner.refs) {
            owner.refs = {};
        }

        if (value === null) {
            delete owner.refs[ref];
        } else {
            owner.refs[ref] = value;
        }
    };
}

                  // Throws a detailed error when an unexpected object is encountered
function throwErrorForUnexpectedObject(genericVar) {
    const objectType = Object.prototype.toString.call(genericVar);
    throw new Error(
        `Unexpected object type: ${
            objectType === "[object Object]"
                ? `object with keys { ${Object.keys(genericVar).join(", ")} }`
                : objectType
        }`
    );
}

// Initializes a generic payload
function initializePayload(payload) {
    return payload._init(payload._payload);
}

// Handles deletions in a fiber node
function processDeletions(parentFiber, childFiber) {
    if (childFiber) {
        const deletions = parentFiber.deletions || [];
        deletions.push(childFiber);
        parentFiber.deletions = deletions;
        parentFiber.flags |= 16; // Mark the fiber for deletion
    }
}

// Iterates over siblings of a fiber node
function iterateSiblings(fiber, callback) {
    while (fiber) {
        callback(fiber);
        fiber = fiber.sibling;
    }
}

// Converts a fiber's children into a map
function createFiberChildMap(fiber) {
    const childMap = new Map();
    iterateSiblings(fiber, (child) => {
        const key = child.key !== null ? child.key : child.index;
        childMap.set(key, child);
    });
    return childMap;
}

// Updates fiber properties
function updateFiberProperties(fiber, index, isAlternate) {
    fiber.index = index;
    if (isAlternate) {
        if (fiber.alternate && fiber.alternate.index < index) {
            fiber.flags |= 2; // Mark the fiber for update
        }
    } else {
        fiber.flags |= 1048576; // Alternate fiber update flag
    }
    return fiber;
}

// Handles special cases for different fiber types
function handleSpecialFiberTypes(type, fiber, mode, containerInfo, implementation) {
    if (
        fiber &&
        fiber.tag === 4 &&
        fiber.stateNode.containerInfo === containerInfo &&
        fiber.stateNode.implementation === implementation
    ) {
        return fiber;
    }
    return createNewFiber(type, mode);
}

// Processes fiber based on content type
function processFiberContent(content, fiber, mode) {
    if (typeof content === "string" || typeof content === "number") {
        return createTextFiber("" + content, mode);
    }

    if (typeof content === "object" && content !== null) {
        if (content.$typeof === REACT_ELEMENT_TYPE) {
            return createFiberFromElement(content, mode);
        }
        if (content.$typeof === REACT_PORTAL_TYPE) {
            return createFiberFromPortal(content, mode);
        }
        if (typeof content._init === "function") {
            return createFiberFromLazy(content._init(content._payload), mode);
        }
    }

    return null;
}

// Handles updates or replacements for fiber states
function handleFiberUpdates(fiber, newState, replace = false) {
    if (replace) {
        fiber.memoizedState = newState;
        fiber.updateQueue.baseState = newState;
    } else {
        fiber.memoizedState = {
            ...fiber.memoizedState,
            ...newState,
        };
    }
}

// Adds a fiber to the deletions list of its parent
function addToDeletions(parentFiber, childFiber) {
    if (!parentFiber.deletions) {
        parentFiber.deletions = [];
    }
    parentFiber.deletions.push(childFiber);
    parentFiber.flags |= 16; // Deletion flag
}

// Traverses the parent chain to find a specific fiber type
function findParentFiber(fiber, targetTag) {
    while (fiber) {
        if (fiber.tag === targetTag) {
            return fiber;
        }
        fiber = fiber.return;
    }
    return null;
}

// Handles updates to a fiber's update queue
function enqueueUpdate(fiber, update) {
    const queue = fiber.updateQueue;
    if (!queue) return;

    if (queue.shared.pending === null) {
        update.next = update;
    } else {
        update.next = queue.shared.pending.next;
        queue.shared.pending.next = update;
    }
    queue.shared.pending = update;
}

// Executes callbacks for effects
function executeEffectCallbacks(fiber) {
    const effects = fiber.effects;
    fiber.effects = null;

    if (effects) {
        for (const effect of effects) {
            if (effect.callback) {
                const callback = effect.callback;
                effect.callback = null;
                callback();
            }
        }
    }
}

function renamedFunctionvar_1122(parentFiber, newFiber, children) {
    let currentChild = null;
    let index = 0;

    for (let i = 0; i < children.length; i++) {
        const child = children[i];

        if (child.index > index) {
            currentChild = null;
        } else {
            currentChild = currentChild ? currentChild.sibling : null;
        }

        const updatedFiber = processChild(parentFiber, child, currentChild);

        if (updatedFiber === null) {
            if (currentChild === null) {
                currentChild = null;
            }
            break;
        }

        if (updatedFiber && !updatedFiber.alternate) {
            markForDeletion(parentFiber, updatedFiber);
        }

        const siblingFiber = attachSibling(parentFiber, updatedFiber);

        if (siblingFiber === null) {
            currentChild = null;
        } else {
            currentChild.sibling = siblingFiber;
        }

        currentChild = updatedFiber;
    }

    if (index === children.length) {
        markCompletion(parentFiber);
    }

    return currentChild;
}

function renamedFunctionvar_1134(parentFiber, newFiber, iterable) {
    const iterator = iterable[Symbol.iterator]();
    let currentChild = null;
    let result = iterator.next();

    while (!result.done) {
        const child = result.value;

        if (child.index > currentChild?.index) {
            currentChild = null;
        } else {
            currentChild = currentChild ? currentChild.sibling : null;
        }

        const updatedFiber = processChild(parentFiber, child, currentChild);

        if (updatedFiber === null) {
            if (currentChild === null) {
                currentChild = null;
            }
            break;
        }

        if (updatedFiber && !updatedFiber.alternate) {
            markForDeletion(parentFiber, updatedFiber);
        }

        const siblingFiber = attachSibling(parentFiber, updatedFiber);

        if (siblingFiber === null) {
            currentChild = null;
        } else {
            currentChild.sibling = siblingFiber;
        }

        currentChild = updatedFiber;
        result = iterator.next();
    }

    if (result.done) {
        markCompletion(parentFiber);
    }

    return currentChild;
}

                       // Constants for React internals (placeholders for actual React values)
const REACT_ELEMENT_TYPE = Symbol.for("react.element");
const REACT_PORTAL_TYPE = Symbol.for("react.portal");
const REACT_LAZY_TYPE = Symbol.for("react.lazy");

function reconcileFiber(parentFiber, childFiber, children) {
    let currentChild = null;

    if (typeof childFiber === "object" && childFiber !== null && childFiber.type === parentFiber && childFiber.key === null) {
        childFiber = childFiber.props.children;
    }

    if (typeof childFiber === "object" && childFiber !== null) {
        switch (childFiber.$typeof) {
            case REACT_ELEMENT_TYPE:
                processReactElement(parentFiber, childFiber, children);
                break;
            case REACT_PORTAL_TYPE:
                processPortal(parentFiber, childFiber, children);
                break;
            case REACT_LAZY_TYPE:
                processLazyComponent(parentFiber, childFiber, children);
                break;
            default:
                break;
        }
    } else if (typeof childFiber === "string" || typeof childFiber === "number") {
        reconcileTextFiber(parentFiber, childFiber);
    } else {
        throw new Error("Unsupported fiber type");
    }
}

// Helper function for processing React elements
function processReactElement(parentFiber, childFiber, children) {
    let fiber = findMatchingFiber(parentFiber, childFiber.key);
    if (!fiber || fiber.type !== childFiber.type) {
        fiber = createFiber(childFiber.type, childFiber.key, childFiber.props);
        fiber.return = parentFiber;
    }
    fiber.child = reconcileChildren(fiber, childFiber.props.children);
}

// Helper function for processing React portals
function processPortal(parentFiber, portalFiber, children) {
    let fiber = findMatchingFiber(parentFiber, portalFiber.key);
    if (!fiber || fiber.stateNode.containerInfo !== portalFiber.containerInfo) {
        fiber = createPortalFiber(portalFiber);
        fiber.return = parentFiber;
    }
    reconcileChildren(fiber, portalFiber.children);
}

// Helper function for processing React lazy components
function processLazyComponent(parentFiber, lazyFiber, children) {
    let resolvedFiber = resolveLazyComponent(lazyFiber);
    reconcileFiber(parentFiber, resolvedFiber, children);
}

// Helper function for reconciling text nodes
function reconcileTextFiber(parentFiber, text) {
    let textFiber = createTextFiber(text);
    textFiber.return = parentFiber;
    return textFiber;
}

// Finds a matching fiber by key
function findMatchingFiber(parentFiber, key) {
    let child = parentFiber.child;
    while (child !== null) {
        if (child.key === key) {
            return child;
        }
        child = child.sibling;
    }
    return null;
}

// Creates a new fiber
function createFiber(type, key, props) {
    return {
        type,
        key,
        props,
        child: null,
        sibling: null,
        return: null,
    };
}

// Creates a portal fiber
function createPortalFiber(portal) {
    return {
        type: REACT_PORTAL_TYPE,
        key: portal.key,
        props: portal.children,
        stateNode: {
            containerInfo: portal.containerInfo,
        },
        child: null,
        sibling: null,
        return: null,
    };
}

// Resolves a lazy component
function resolveLazyComponent(lazyFiber) {
    if (typeof lazyFiber._init === "function") {
        return lazyFiber._init(lazyFiber._payload);
    }
    throw new Error("Invalid lazy component");
}

// Creates a text fiber
function createTextFiber(text) {
    return {
        type: "text",
        key: null,
        props: { text },
        child: null,
        sibling: null,
        return: null,
    };
}

// Reconciles children of a fiber
function reconcileChildren(fiber, children) {
    let previousSibling = null;
    let firstChild = null;

    children.forEach((child, index) => {
        let newFiber = reconcileFiber(fiber, child, null);
        if (index === 0) {
            firstChild = newFiber;
        } else if (previousSibling !== null) {
            previousSibling.sibling = newFiber;
        }
        previousSibling = newFiber;
    });

    return firstChild;
}

function renamedFunctionVar_1193(genericVar) {
    if (genericVar === null) {
        return false;
    }
    for (let i = 0; i < genericVar.length && i < genericVar.length; i++) {
        if (!genericVar(genericVar[i], genericVar[i])) {
            return false;
        }
    }
    return true;
}

function renamedFunctionVar_1197(genericVar, ...rest) {
    let iterations = 0;
    let maxIterations = 25;
    while (genericVar) {
        genericVar = false;
        iterations++;
        if (iterations > maxIterations) {
            throw new Error("Infinite loop detected in renamedFunctionVar_1197.");
        }
    }
    return rest.every(Boolean);
}

function createStateContainer() {
    return {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null,
    };
}

function renamedFunctionVar_1215(genericVar) {
    return typeof genericVar === "function" ? genericVar : null;
}

function renamedFunctionVar_1218(genericVar, reducer) {
    if (!genericVar.queue) {
        throw new Error("No queue found in renamedFunctionVar_1218.");
    }
    genericVar.queue.lastRenderedReducer = reducer;

    let currentQueue = genericVar.queue.pending;
    if (currentQueue) {
        const firstPending = currentQueue.next;
        currentQueue.next = firstPending;
        genericVar.queue.pending = null;
        genericVar.queue.baseQueue = currentQueue;
    }

    let currentState = genericVar.queue.baseState;
    let currentQueueNode = genericVar.queue.baseQueue;
    while (currentQueueNode) {
        currentState = currentQueueNode.hasEagerState
            ? currentQueueNode.eagerState
            : reducer(currentState, currentQueueNode.action);

        currentQueueNode = currentQueueNode.next;
    }

    genericVar.memoizedState = currentState;
    genericVar.lastRenderedState = currentState;

    return [currentState, genericVar.dispatch];
}

function renamedFunctionvar_1231() {
    let genericVar = this;
    let queue = genericVar.queue;
    if (queue === null) {
        throw new Error("Queue is null.");
    }
    genericVar.lastRenderedReducer = queue.lastRenderedReducer;
    let dispatch = queue.dispatch;
    let pending = queue.pending;
    let memoizedState = queue.memoizedState;

    if (pending !== null) {
        queue.pending = null;
        let first = pending.next;
        do {
            memoizedState = genericVar.lastRenderedReducer(memoizedState, first.action);
            first = first.next;
        } while (first !== pending.next);

        if (!Object.is(memoizedState, queue.memoizedState)) {
            genericVar.lastRenderedState = memoizedState;
        }
        queue.memoizedState = memoizedState;

        if (queue.baseQueue === null) {
            queue.baseState = memoizedState;
        }
        queue.lastRenderedState = memoizedState;
    }

    return [queue.memoizedState, dispatch];
}

function genericVar() {}

function renamedFunctionvar_1240(genericVar) {
    let memoizedState = genericVar.memoizedState;
    let queue = genericVar.queue;

    if (!Object.is(queue.lastRenderedReducer, memoizedState)) {
        queue.lastRenderedReducer = memoizedState;
    }

    queue.dispatch = (action) => queue.lastRenderedReducer(genericVar.memoizedState, action);

    return memoizedState;
}

function renamedFunctionvar_1252(genericVar, snapshot, value) {
    genericVar.flags |= 16384;

    const store = {
        getSnapshot: snapshot,
        value: value,
    };

    if (!genericVar.updateQueue) {
        genericVar.updateQueue = { lastEffect: null, stores: [store] };
    } else if (!genericVar.updateQueue.stores) {
        genericVar.updateQueue.stores = [store];
    } else {
        genericVar.updateQueue.stores.push(store);
    }
}

function renamedFunctionvar_1255(genericVar, snapshot, value) {
    genericVar.value = value;
    genericVar.getSnapshot = snapshot;

    if (genericVar.getSnapshot(genericVar.value)) {
        console.error("Snapshot validation failed.");
    }
}

function renamedFunctionvar_1271(genericVar) {
    let reducer = genericVar.reducer;
    let initialState = reducer();
    let queue = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: reducer,
        lastRenderedState: initialState,
    };

    genericVar.queue = queue;
    queue.dispatch = (action) => reducer(genericVar.lastRenderedState, action);

    return [genericVar.memoizedState, queue.dispatch];
}

function renamedFunctionvar_1274(genericVar, create, destroy, deps) {
    const effect = {
        tag: genericVar,
        create,
        destroy,
        deps,
        next: null,
    };

    if (!genericVar.updateQueue) {
        genericVar.updateQueue = { lastEffect: null, stores: null };
        genericVar.updateQueue.lastEffect = effect.next = effect;
    } else if (!genericVar.updateQueue.lastEffect) {
        genericVar.updateQueue.lastEffect = effect.next = effect;
    } else {
        const lastEffect = genericVar.updateQueue.lastEffect;
        effect.next = lastEffect.next;
        lastEffect.next = effect;
        genericVar.updateQueue.lastEffect = effect;
    }

    return effect;
}
function renamedFunctionvar_1308(genericVar, genericVar2) {
    let result = genericVar !== null ? genericVar.concat([genericVar2]) : null;
    return [result, 4, result ? result.bind(null, genericVar, genericVar2, result) : null];
}

function genericVar() {}

function renamedFunctionvar_1313(genericVar) {
    let memoized = genericVar.memoizedState;
    let initial = genericVar !== undefined ? genericVar : null;

    if (memoized !== null && memoized[1]) {
        return memoized[0];
    }

    genericVar.memoizedState = [initial, initial];
    return genericVar.memoizedState;
}

function renamedFunctionvar_1318(genericVar) {
    let memoized = genericVar.memoizedState;
    let initial = genericVar !== undefined ? genericVar : null;

    if (memoized !== null && memoized[1]) {
        return memoized[0];
    }

    let state = [initial, genericVar];
    genericVar.memoizedState = state;
    return state;
}

function renamedFunctionvar_1323(genericVar, flag) {
    if ((flag & 21) === 0) {
        genericVar.baseState = false;
        genericVar.memoizedState = genericVar;
        return true;
    }

    genericVar.baseState = true;
    genericVar.lanes |= flag;
    genericVar.memoizedState = genericVar;
    return false;
}

function renamedFunctionvar_1327(genericVar) {
    let transition = genericVar.transition || {};
    genericVar.transition = transition;

    try {
        transition = null;
    } finally {
        genericVar.transition = transition;
    }
}

function renamedFunctionvar_1333(genericVar, action) {
    const queue = {
        lane: genericVar,
        action: action,
        hasEagerState: false,
        eagerState: null,
        next: null,
    };

    if (genericVar) {
        // Handle special cases (hypothetical function calls)
        processQueueAction(queue);
    }
}

function renamedFunctionvar_1340(genericVar, action) {
    const queue = {
        lane: genericVar,
        action: action,
        hasEagerState: false,
        eagerState: null,
        next: null,
    };

    try {
        const eagerState = genericVar.lastRenderedReducer(genericVar.lastRenderedState, action);
        queue.hasEagerState = true;
        queue.eagerState = eagerState;

        if (Object.is(eagerState, genericVar.lastRenderedState)) {
            queue.interleaved = queue.interleaved ? queue.interleaved : queue;
            return;
        }
    } catch (e) {
        console.error(e);
    }

    processQueueAction(queue);
}

function renamedFunctionvar_1352(genericVar) {
    let queue = genericVar.queue || null;

    if (queue === null) {
        queue = { next: queue };
    } else {
        queue.next = queue.next || queue;
    }

    queue.pending = queue;
}

function renamedFunctionvar_1355(genericVar, pending) {
    if (pending & 4194240) {
        genericVar.lanes |= pending & genericVar.pendingLanes;
    }
}

// React Hook Implementations
const hooks = {
    useCallback(callback, deps) {
        return [callback, deps !== undefined ? deps : null];
    },

    useContext(context) {
        return context.current;
    },

    useMemo(factory, deps) {
        const value = factory();
        return [value, deps];
    },

    useReducer(reducer, initialState) {
        const state = reducer(initialState);
        return [state, (action) => reducer(state, action)];
    },

    useState(initialValue) {
        return hooks.useReducer((state) => state, initialValue);
    },

    useRef(initialValue) {
        return { current: initialValue };
    },

    useEffect(effect, deps) {
        return hooks.useMemo(effect, deps);
    },
};

function renamedFunctionvar_1308(genericVar, genericVar2, deps) {
    const result = genericVar ? [...genericVar, genericVar2] : null;
    return [result, 4, deps ? deps.bind(null, genericVar, genericVar2, result) : null];
}

function useId() {
    let id = this.genericVar;
    const prefix = this.identifierPrefix || '';
    let counter = this.counter || 0;

    if (prefix) {
        id = `:${prefix}R${(counter & ~(1 << 32)).toString(36)}:${counter++}`;
    } else {
        id = `:r${counter.toString(36)}:${counter++}`;
    }

    this.counter = counter;
    return this.memoizedState = id;
}

const hooks = {
    readContext: () => { /* Implementation */ },
    useCallback: (callback, deps) => [callback, deps || null],
    useContext: () => { /* Implementation */ },
    useEffect: () => { /* Implementation */ },
    useImperativeHandle: () => { /* Implementation */ },
    useInsertionEffect: () => { /* Implementation */ },
    useLayoutEffect: () => { /* Implementation */ },
    useMemo: (factory, deps) => {
        const value = factory();
        return [value, deps || null];
    },
    useReducer: (reducer, initialState) => {
        const state = reducer(initialState);
        return [state, (action) => reducer(state, action)];
    },
    useRef: (initialValue) => ({ current: initialValue }),
    useState: (initialValue) => hooks.useReducer((state) => state, initialValue),
    useDebugValue: () => { /* Implementation */ },
    useDeferredValue: (value) => value,
    useTransition: () => [false, () => { /* Transition implementation */ }],
    useMutableSource: () => { /* Implementation */ },
    useSyncExternalStore: () => { /* Implementation */ },
    useId: useId,
    unstable_isNewReconciler: false,
};

function renamedFunctionvar_1392(error, info) {
    try {
        let stack = '';
        let current = error;

        while (current) {
            stack += current;
            current = current['return'];
        }

        return {
            value: error.message,
            source: error.source,
            stack: stack || 'No stack available',
            digest: null,
        };
    } catch (err) {
        return {
            value: 'Error generating stack',
            source: null,
            stack: err.stack || 'Unknown error',
            digest: null,
        };
    }
}

function renamedFunctionvar_1411(error, component, stateNode) {
    const update = {
        eventTime: -1,
        lane: component.lane || 0,
        tag: 3,
        payload: { element: null },
        callback: null,
        next: null,
    };

    const derivedState = component.type.getDerivedStateFromError;
    if (typeof derivedState === 'function') {
        update.payload = () => derivedState(error);
        update.callback = () => {
            /* Handle side-effects or updates */
        };
    }

    if (stateNode && typeof stateNode.componentDidCatch === 'function') {
        update.callback = function () {
            const stack = error.stack || '';
            this.componentDidCatch(error, { componentStack: stack });
        };
    }

    return update;
}

function renamedFunctionvar_1420(genericVar, lane, callback) {
    let pingCache = genericVar.pingCache;
    if (!pingCache) {
        pingCache = genericVar.pingCache = new Map();
        const set = new Set();
        pingCache.set(lane, set);
    } else if (!pingCache.has(lane)) {
        const set = new Set();
        pingCache.set(lane, set);
    }
    const set = pingCache.get(lane);
    if (!set.has(callback)) {
        set.add(callback);
        callback().then(() => renamedFunctionvar_1420(genericVar, lane, callback));
    }
}

function renamedFunctionvar_1427(genericVar) {
    do {
        if (genericVar.tag === 13) {
            if (genericVar.memoizedState || genericVar.dehydrated) {
                return genericVar;
            }
        }
        genericVar = genericVar["return"];
    } while (genericVar !== null);
    return null;
}

function renamedFunctionvar_1430(genericVar, lane, mode, callback) {
    if (mode & 1) {
        if (genericVar === lane) {
            genericVar.flags |= 65536;
        } else {
            genericVar.flags |= 128;
            genericVar.flags |= 131072;
            genericVar.flags &= ~52805;
            if (genericVar.tag === 1 && genericVar.alternate === null) {
                genericVar.tag = 17;
            }
            genericVar.lanes |= lane;
        }
    } else {
        genericVar.flags |= 65536;
    }
    genericVar.lanes = lane;
    return genericVar;
}

function renamedFunctionvar_1442(genericVar, render, ref, callback) {
    const result = callback(render, genericVar.flags |= 1);
    if (result) {
        return genericVar.child = result;
    }
    genericVar.updateQueue = genericVar.updateQueue || null;
    genericVar.flags &= ~2053;
    genericVar.lanes &= ~genericVar.lanes;
    return genericVar;
}

function renamedFunctionvar_1450(genericVar, lane, callback) {
    if (!genericVar) {
        return null;
    }
    if ((genericVar.lanes & lane) === 0) {
        if (genericVar.memoizedProps === callback.memoizedProps && genericVar.ref === callback.ref) {
            return genericVar;
        }
    }
    genericVar.flags |= 1;
    const result = callback(genericVar.memoizedProps);
    return genericVar.child = result;
}

function renamedFunctionvar_1467(genericVar) {
    if (genericVar.mode === "hidden") {
        if ((genericVar.lanes & 1) === 0) {
            genericVar.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
        } else if ((genericVar.lanes & 1073741824) === 0) {
            genericVar.memoizedState = { baseLanes: genericVar.lanes, cachePool: null, transitions: null };
            genericVar.updateQueue = null;
            return null;
        } else {
            genericVar.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
        }
    } else {
        genericVar.memoizedState = null;
    }
    return genericVar.child;
}

function renamedFunctionvar_1476(genericVar, ref) {
    if (genericVar.ref !== ref) {
        genericVar.flags |= 512;
        genericVar.flags |= 2097152;
    }
}

function renamedFunctionvar_1479(genericVar, current, newProps, render) {
    const context = current ? current.current : genericVar.current;
    const nextContext = var_809var_1480(context, newProps);
    const result = var_1196var_1479(genericVar, current, newProps, render, context, nextContext);
    if (result === null || result === undefined) {
        return null;
    }
    if (result) {
        return result;
    }
    genericVar.updateQueue = genericVar.updateQueue || null;
    genericVar.flags &= ~2053;
    genericVar.lanes &= ~genericVar.lanes;
    return genericVar;
}

function renamedFunctionvar_1486(genericVar, newState, context, updateQueue) {
    const isSameContext = var_829var_1487(context);
    if (isSameContext) {
        var_918var_1487(genericVar);
    } else {
        genericVar.stateNode = var_1492var_1486(context, updateQueue);
        const derivedState = context.getDerivedStateFromProps || context.getSnapshotBeforeUpdate;
        if (derivedState) {
            var_1032var_1487(context, derivedState, newState, updateQueue);
        }
    }
    return var_1502var_1486(genericVar, newState, context, updateQueue);
}

function renamedFunctionvar_1503(genericVar, flags, callback, render, errorBoundary) {
    const hasErrorBoundary = !!(genericVar.stateNode && typeof errorBoundary === "function");
    genericVar.flags |= 1;

    if (hasErrorBoundary) {
        const child = var_1155var_1504(render, null, errorBoundary, flags);
        genericVar.child = child;
    } else {
        var_1436var_1503(genericVar, render, errorBoundary, flags);
    }

    genericVar.memoizedState = render.state;
    return genericVar.child;
}

function renamedFunctionvar_1512(genericVar) {
    const containerInfo = genericVar.stateNode.containerInfo;
    if (genericVar.pendingContext) {
        return var_1163var_1512(containerInfo, genericVar.pendingContext, true);
    }
    return var_1163var_1512(containerInfo, genericVar.context, false);
}

function renamedFunctionvar_1515(genericVar, current, fallback, context) {
    // Apply context and set flags
    genericVar;
    var_899var_1519; // Logic for assigning context
    genericVar.flags |= 256; // Update flags
    return var_1436var_1515(genericVar, current, fallback, context).child; // Proceed with children
}

function renamedFunctionvar_1526(root, current, fallback) {
    let dehydrated = current?.memoizedState?.dehydrated;
    const baseProps = current.pendingProps;
    const hasError = current.flags & 128;

    if (dehydrated) {
        // Handle dehydration case
        return function handleDehydration() {
            if (current.flags & 256) {
                current.flags &= ~256; // Clear the flag
                return current.fallback
                    ? root(genericVar, fallback, baseProps, {
                          value: Error("Dehydration error"),
                          source: null,
                          stack: null,
                          digest: null,
                      })
                    : null;
            }
            return null;
        };
    }

    if (hasError) {
        current.flags &= ~129;
    } else {
        current.flags |= 1; // Assign visible mode
    }

    if (fallback) {
        // Handling fallback logic
        current.memoizedState = {
            baseLanes: fallback.baseLanes || 0,
            cachePool: null,
            transitions: fallback.transitions || null,
        };
    }

    if (current.memoizedState) {
        // Perform context-based updates
        var_802var_1173(1 & current.mode);
    }

    return current.child;
}

function renamedFunctionvar_1548(parentNode) {
    const newNode = createNode({
        mode: "visible",
        children: parentNode,
    }, parentNode.mode, 0, null);
    newNode["return"] = parentNode;
    parentNode.child = newNode;
    return parentNode.child;
}

function renamedFunctionvar_1550(parentNode, pendingProps, children) {
    if (pendingProps !== null) {
        var_899var_1553(); // Handle specific processing
    }
    const childNode = var_1155var_1551(parentNode.child, null, parentNode);
    childNode.flags |= 2;
    childNode.memoizedState = null;
    return childNode;
}

function renamedFunctionvar_1555(node, lanes) {
    node.lanes |= lanes;
    const alternateNode = node.alternate;
    if (alternateNode !== null) {
        alternateNode.lanes |= lanes;
    }
    var_913var_1555["return"](node, lanes);
}

function renamedFunctionvar_1560(node, isBackwards, rendering, tailMode) {
    const state = node.memoizedState || {};
    node.memoizedState = {
        ...state,
        isBackwards,
        rendering: null,
        renderingStartTime: 0,
        last: rendering,
        tail: rendering,
        tailMode,
    };
}

function renamedFunctionvar_1567(node, revealOrder, tail) {
    const props = node.pendingProps;

    var_1436var_1567(node, props.children, revealOrder);

    if ((revealOrder & 2) !== 0) {
        node.flags |= 128;
    } else {
        if (node.memoizedState && (node.flags & 128)) {
            traverseChildNodes(node.child, (child) => {
                if (child.tag === 13 && child.memoizedState) {
                    var_1554var_1567(node, child, props.children);
                }
            });
        }
    }

    switch (revealOrder) {
        case "forwards":
            handleForwardMode(node);
            break;
        case "backwards":
            handleBackwardMode(node);
            break;
        case "together":
            handleTogetherMode(node);
            break;
        default:
            node.memoizedState = null;
    }

    return node.child;
}

function renamedFunctionvar_1574(node) {
    if ((node.mode & 1) === 0 && node.alternate !== null) {
        node.alternate = null;
        node.flags |= 2;
    }
}

function traverseChildNodes(node, callback) {
    while (node !== null) {
        callback(node);
        node = node.sibling;
    }
}

function handleForwardMode(node) {
    let child = node.child;
    while (child !== null) {
        const alternate = child.alternate;
        if (alternate !== null && alternate.memoizedState === null) {
            node.child = child;
            break;
        }
        child = child.sibling;
    }
}

function handleBackwardMode(node) {
    let child = node.child;
    node.child = null;

    while (child !== null) {
        const alternate = child.alternate;
        if (alternate !== null && alternate.memoizedState === null) {
            node.child = child;
            break;
        }
        child = child.sibling;
    }
}

function handleTogetherMode(node) {
    node.child = null;
}

/* Custom Getters and Setters */
function renamedFunctionvar_1576(node, lanes, props) {
    if (node !== null) {
        node.dependencies = node.dependencies;
    }
    lanes |= node.lanes;

    if ((lanes & node.childLanes) === 0) {
        return null;
    }

    if (node !== null && node.child !== node.child) {
        throw new Error("Invariant error: Node's child references don't match.");
    }

    if (node.child !== null) {
        let child = (node.child = genericVar(node.child, props));
        child["return"] = node;

        while (child.sibling !== null) {
            child = (child.sibling = genericVar(child.sibling, props));
            child["return"] = node;
        }

        child.sibling = null;
    }

    return node.child;
}

function renamedFunctionvar_1580(node) {
    if (!node) {
        switch (node.tailMode) {
            case "hidden":
                processTail(node, (child) => (child.alternate !== null ? child : null));
                break;
            case "collapsed":
                processTail(node, (child) => (child.alternate !== null ? child : null));
                break;
        }
    }
}

function processTail(node, processFn) {
    let tail = node.tail;
    let lastValidNode = null;

    while (tail !== null) {
        const processed = processFn(tail);
        if (processed !== null) {
            lastValidNode = processed;
        }
        tail = tail.sibling;
    }

    if (lastValidNode === null) {
        node.tail = null;
    } else {
        lastValidNode.sibling = null;
    }
}

function renamedFunctionvar_1585(node) {
    let childLanes = 0;
    let subtreeFlags = 0;

    if (node !== null && node.alternate !== null && node.alternate.child === node.child) {
        let child = node.child;

        while (child !== null) {
            childLanes |= child.lanes | child.childLanes;
            subtreeFlags |= 14680064 & (child.subtreeFlags | child.flags);
            child["return"] = node;
            child = child.sibling;
        }
    } else {
        let child = node.child;

        while (child !== null) {
            childLanes |= child.lanes | child.childLanes;
            subtreeFlags |= child.subtreeFlags | child.flags;
            child["return"] = node;
            child = child.sibling;
        }
    }

    node.subtreeFlags |= subtreeFlags;
    node.childLanes = childLanes;

    return childLanes;
}

function renamedFunctionvar_1591(workInProgress, renderLanes) {
    const pendingProps = workInProgress.pendingProps;

    switch (workInProgress.tag) {
        case 2:
        case 16:
        case 15:
        case 0:
        case 11:
        case 7:
        case 8:
        case 12:
        case 9:
        case 14:
            return null;

        case 1:
        case 17:
            if (shouldConstruct(workInProgress.type)) {
                // Handle constructor logic if needed
            }
            return null;

        case 3:
            const root = workInProgress.stateNode;
            processRoot(root, renderLanes);
            return null;

        case 5:
            processHostComponent(workInProgress, renderLanes, pendingProps);
            return null;

        case 6:
            if (workInProgress.stateNode != null) {
                updateTextInstance(workInProgress, pendingProps);
            } else if (typeof pendingProps === "string" || pendingProps === null) {
                throw new Error("Expected string as the text content.");
            }
            return null;

        default:
            throw new Error(`Unknown tag: ${workInProgress.tag}`);
    }
}

function processRoot(root, renderLanes) {
    if (root.pendingContext) {
        root.context = root.pendingContext;
        root.pendingContext = null;
    }
    if (root.memoizedState.isDehydrated) {
        // Handle hydration
        if ((root.flags & 256) === 0) {
            root.flags |= 1024;
        }
    }
}

function processHostComponent(workInProgress, renderLanes, pendingProps) {
    const current = workInProgress.alternate;

    if (current !== null && workInProgress.stateNode !== null) {
        updateHostComponent(current, workInProgress, renderLanes, pendingProps);
    } else {
        if (!pendingProps) {
            if (workInProgress.stateNode === null) {
                throw new Error("Expected valid stateNode.");
            }
            return;
        }

        const newInstance = createInstance(workInProgress, pendingProps);
        workInProgress.stateNode = newInstance;

        if (workInProgress.ref !== null) {
            workInProgress.flags |= 512; // Ref update
        }
    }
}

function updateHostComponent(current, workInProgress, renderLanes, pendingProps) {
    // Update logic for an existing host component
    const instance = workInProgress.stateNode;
    const type = workInProgress.type;

    // Apply updates to DOM properties
    updateDOMProperties(instance, type, current.memoizedProps, pendingProps);

    if (workInProgress.ref !== current.ref) {
        workInProgress.flags |= 512; // Ref update
    }
}

function createInstance(workInProgress, pendingProps) {
    // Create a DOM element or instance
    const type = workInProgress.type;
    const domElement = document.createElement(type);

    // Set properties
    applyDOMProperties(domElement, pendingProps);

    return domElement;
}

function applyDOMProperties(domElement, props) {
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            const value = props[key];
            if (key === "style") {
                applyStyle(domElement, value);
            } else if (key === "children") {
                if (typeof value === "string") {
                    domElement.textContent = value;
                }
            } else {
                domElement.setAttribute(key, value);
            }
        }
    }
}

function applyStyle(domElement, style) {
    for (const key in style) {
        if (style.hasOwnProperty(key)) {
            domElement.style[key] = style[key];
        }
    }
}

function updateTextInstance(workInProgress, text) {
    const textNode = workInProgress.stateNode;
    if (textNode.nodeValue !== text) {
        textNode.nodeValue = text;
    }
}

function renamedFunctionvar_1591(workInProgress, renderLanes) {
    const pendingProps = workInProgress.pendingProps;

    switch (workInProgress.tag) {
        case 1: // Class Component
            if (shouldConstruct(workInProgress.type)) {
                // Handle constructor logic if needed
            }
            return handleUpdateOrHydration(workInProgress);

        case 3: // Root Component
            const root = workInProgress.stateNode;
            processRoot(root, renderLanes);
            return handleUpdateOrHydration(workInProgress);

        case 5: // Host Component
            processHostComponent(workInProgress, renderLanes, pendingProps);
            return handleUpdateOrHydration(workInProgress);

        case 13: // Suspense Component
            return processSuspenseComponent(workInProgress);

        case 19: // SuspenseList Component
            return processSuspenseListComponent(workInProgress);

        case 22: // Offscreen Component
        case 23: // LegacyHidden Component
            if (workInProgress.memoizedState) {
                workInProgress.flags |= 8192; // Visibility change flag
            }
            return null;

        default:
            throw new Error(`Unknown tag: ${workInProgress.tag}`);
    }
}

function handleUpdateOrHydration(workInProgress) {
    if (workInProgress.flags & 65536) {
        workInProgress.flags = (workInProgress.flags & ~65536) | 128; // Update flags
        return workInProgress;
    }
    return null;
}

function processRoot(root, renderLanes) {
    if (root.pendingContext) {
        root.context = root.pendingContext;
        root.pendingContext = null;
    }
    if (root.memoizedState?.isDehydrated) {
        if (!(root.flags & 256)) {
            root.flags |= 1024; // Hydration flag
        }
    }
}

function processHostComponent(workInProgress, renderLanes, pendingProps) {
    const current = workInProgress.alternate;

    if (current !== null && workInProgress.stateNode !== null) {
        updateHostComponent(current, workInProgress, renderLanes, pendingProps);
    } else {
        createHostComponent(workInProgress, pendingProps);
    }
}

function updateHostComponent(current, workInProgress, renderLanes, pendingProps) {
    const instance = workInProgress.stateNode;
    const type = workInProgress.type;

    updateDOMProperties(instance, type, current.memoizedProps, pendingProps);

    if (workInProgress.ref !== current.ref) {
        workInProgress.flags |= 512; // Ref update
    }
}

function createHostComponent(workInProgress, pendingProps) {
    const type = workInProgress.type;
    const domElement = document.createElement(type);

    applyDOMProperties(domElement, pendingProps);

    workInProgress.stateNode = domElement;

    if (workInProgress.ref !== null) {
        workInProgress.flags |= 512; // Ref update
    }
}

function applyDOMProperties(domElement, props) {
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            const value = props[key];
            if (key === "style") {
                applyStyle(domElement, value);
            } else if (key === "children") {
                if (typeof value === "string") {
                    domElement.textContent = value;
                }
            } else {
                domElement.setAttribute(key, value);
            }
        }
    }
}

function applyStyle(domElement, style) {
    for (const key in style) {
        if (style.hasOwnProperty(key)) {
            domElement.style[key] = style[key];
        }
    }
}

function processSuspenseComponent(workInProgress) {
    const suspenseState = workInProgress.memoizedState;

    if (suspenseState && suspenseState.dehydrated) {
        if (!workInProgress.alternate) {
            throw new Error("Missing alternate for dehydrated Suspense component.");
        }
    }

    return handleUpdateOrHydration(workInProgress);
}

function processSuspenseListComponent(workInProgress) {
    const suspenseState = workInProgress.memoizedState;

    if (suspenseState && suspenseState.rendering) {
        // Manage rendering state
        suspenseState.isBackwards = !suspenseState.isBackwards;
        suspenseState.renderingStartTime = Date.now();
    }

    return null;
}
function renamedFunctionvar_1630(instance, ref) {
    if (ref !== null) {
        if (typeof ref === "function") {
            try {
                ref(null);
            } catch (error) {
                handleRefError(instance, error);
            }
        } else {
            ref.current = null;
        }
    }
}

function renamedFunctionvar_1636(instance, callback, args) {
    try {
        callback.apply(null, args);
    } catch (error) {
        handleRefError(instance, error);
    }
}

function renamedFunctionvar_1642(instance, destroyEffect) {
    const updateQueue = instance.updateQueue;

    if (updateQueue !== null) {
        let effect = updateQueue.lastEffect;

        if (effect !== null) {
            let firstEffect = effect.next;

            do {
                if (effect.tag & destroyEffect) {
                    const destroy = effect.destroy;
                    effect.destroy = undefined;

                    if (destroy !== undefined) {
                        destroy();
                    }
                }
                effect = effect.next;
            } while (effect !== firstEffect);
        }
    }
}

function renamedFunctionvar_1649(instance, createEffect) {
    const updateQueue = instance.updateQueue;

    if (updateQueue !== null) {
        let effect = updateQueue.lastEffect;

        if (effect !== null) {
            let firstEffect = effect.next;

            do {
                if (effect.tag & createEffect) {
                    const create = effect.create;
                    effect.destroy = create();
                }
                effect = effect.next;
            } while (effect !== firstEffect);
        }
    }
}

function renamedFunctionvar_1654(instance) {
    const ref = instance.ref;

    if (ref !== null) {
        const stateNode = instance.stateNode;

        if (typeof ref === "function") {
            ref(stateNode);
        } else {
            ref.current = stateNode;
        }
    }
}

// Utility Functions
function handleRefError(instance, error) {
    console.error("Error processing ref for instance:", instance);
    console.error(error);
}

function renamedFunctionvar_1658(instance) {
    const alternate = instance.alternate;
    if (alternate !== null) {
        alternate.alternate = null;
        cleanupInstance(alternate);
    }
    instance.child = null;
    instance.deletions = null;
    instance.sibling = null;

    if (instance.tag === 5 && instance.stateNode !== null) {
        cleanupDOMProperties(instance.stateNode);
    }

    instance.stateNode = null;
    instance.return = null;
    instance.dependencies = null;
    instance.memoizedProps = null;
    instance.memoizedState = null;
    instance.pendingProps = null;
    instance.updateQueue = null;
}

function cleanupDOMProperties(stateNode) {
    delete stateNode.property1;
    delete stateNode.property2;
    delete stateNode.property3;
    delete stateNode.property4;
    delete stateNode.property5;
}

function renamedFunctionvar_1661(instance) {
    while (instance !== null) {
        while (instance.sibling === null) {
            if (
                instance.return === null ||
                [5, 3, 4].includes(instance.return.tag)
            ) {
                return null;
            }
            instance = instance.return;
        }
        instance.sibling.return = instance.return;
        instance = instance.sibling;

        while ([5, 6, 18].includes(instance.tag)) {
            if (instance.flags & 2) {
                break;
            }
            if (instance.child === null || instance.tag === 4) {
                break;
            }
            instance.child.return = instance;
            instance = instance.child;
        }

        if (!(instance.flags & 2)) {
            return instance.stateNode;
        }
    }
    return null;
}

function renamedFunctionvar_1664(container, child, newChild) {
    if ([5, 6].includes(child.tag)) {
        const stateNode = child.stateNode;
        if (stateNode) {
            if (stateNode.nodeType === 8) {
                container.insertBefore(newChild, stateNode);
            } else {
                stateNode.insertBefore(newChild, stateNode.firstChild);
            }
        } else {
            if (container.nodeType === 8) {
                container.insertBefore(newChild, container.firstChild);
            } else {
                container.appendChild(newChild);
            }
        }
    } else if (child.tag !== 4 && child.child !== null) {
        let currentChild = child.child;
        insertChildren(container, currentChild, newChild);
    }
}

function insertChildren(container, child, newChild) {
    while (child !== null) {
        renamedFunctionvar_1664(container, child, newChild);
        child = child.sibling;
    }
}

function renamedFunctionvar_1669(container, child, newChild) {
    if ([5, 6].includes(child.tag)) {
        const stateNode = child.stateNode;
        if (stateNode) {
            container.insertBefore(newChild, stateNode);
        } else {
            container.appendChild(newChild);
        }
    } else if (child.tag !== 4 && child.child !== null) {
        let currentChild = child.child;
        insertChildren(container, currentChild, newChild);
    }
}

function renamedFunctionvar_1680(instance, isUnmounting) {
    if (instance && typeof instance.onCommitFiberUnmount === "function") {
        try {
            instance.onCommitFiberUnmount(instance);
        } catch (error) {
            console.error("Error during onCommitFiberUnmount:", error);
        }
    }

    switch (instance.tag) {
        case 5:
        case 6:
            handleNodeRemoval(instance, isUnmounting);
            break;
        case 18:
            handleSuspenseRemoval(instance, isUnmounting);
            break;
        case 4:
            handleContainerInfo(instance);
            break;
        case 1:
            handleComponentWillUnmount(instance);
            break;
        default:
            handleGenericCase(instance, isUnmounting);
    }
}

function handleNodeRemoval(instance, isUnmounting) {
    const stateNode = instance.stateNode;
    if (stateNode) {
        if (stateNode.nodeType === 8) {
            stateNode.parentNode.removeChild(stateNode);
        } else {
            stateNode.removeChild(stateNode.firstChild);
        }
    }
}

function handleSuspenseRemoval(instance, isUnmounting) {
    if (instance) {
        const stateNode = instance.stateNode;
        if (stateNode && stateNode.nodeType === 8) {
            stateNode.parentNode.removeChild(stateNode);
        }
    }
}

function handleContainerInfo(instance) {
    const containerInfo = instance.stateNode.containerInfo;
    console.log("Container Info:", containerInfo);
}

function handleComponentWillUnmount(instance) {
    if (typeof instance.stateNode.componentWillUnmount === "function") {
        try {
            instance.stateNode.props = instance.memoizedProps;
            instance.stateNode.state = instance.memoizedState;
            instance.stateNode.componentWillUnmount();
        } catch (error) {
            console.error("Error in componentWillUnmount:", error);
        }
    }
}

function handleGenericCase(instance, isUnmounting) {
    console.log("Handling generic case for instance:", instance, isUnmounting);
}

function renamedFunctionvar_1690() {
    let queue = this.updateQueue;
    if (queue !== null) {
        this.updateQueue = null;
        let stateNode = this.stateNode;
        if (stateNode === null) {
            stateNode = this.stateNode = new Set();
        }
        queue.forEach((update) => {
            const boundUpdate = update.bind(null, this);
            if (!stateNode.has(boundUpdate)) {
                stateNode.add(boundUpdate);
                boundUpdate().then(() => this.handleResolvedUpdate(boundUpdate));
            }
        });
    }
}

function renamedFunctionvar_1697(fiber) {
    const deletions = fiber.deletions;
    if (deletions !== null) {
        for (let i = 0; i < deletions.length; i++) {
            const deletion = deletions[i];
            try {
                let current = deletion;
                let container = null;
                while (current !== null) {
                    switch (current.tag) {
                        case 5:
                            container = current.stateNode;
                            break;
                        case 3:
                        case 4:
                            container = current.stateNode.containerInfo;
                            break;
                    }
                    current = current.return;
                }
                if (container === null) {
                    throw new Error("Unable to find container for deletion");
                }
                this.commitDeletion(container, deletion);
            } catch (error) {
                this.handleError(deletion, error);
            }
        }
    }

    if (fiber.subtreeFlags & 12854) {
        let child = fiber.child;
        while (child !== null) {
            this.processChildFiber(child);
            child = child.sibling;
        }
    }
}

function renamedFunctionvar_1708(fiber) {
    let flags = fiber.flags;
    switch (fiber.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
            this.cleanupHooks(fiber);
            break;
        case 1:
        case 5:
            this.cleanupInstance(fiber);
            break;
        case 6:
            if (flags & 4) {
                if (fiber.stateNode === null) {
                    throw new Error("Expected text instance for text fiber.");
                }
                fiber.stateNode.nodeValue = fiber.memoizedProps;
            }
            break;
        case 3:
            if (flags & 4 && fiber.memoizedState.isDehydrated) {
                this.cleanupDehydratedContainer(fiber.stateNode.containerInfo);
            }
            break;
        case 13:
            this.cleanupSuspense(fiber);
            break;
        default:
            this.cleanupGenericFiber(fiber);
            break;
    }
}

function renamedFunctionvar_1708(fiber) {
    if (fiber.child !== null && fiber.subtreeFlags & 8192) {
        let child = fiber.child;
        while (child !== null) {
            if (child.tag === 5 && child.stateNode !== null) {
                child.stateNode.style.display = "none";
            }
            child = child.sibling;
        }
    }
}

function renamedFunctionvar_1736(fiber) {
    const flags = fiber.flags;

    if (flags & 2) {
        try {
            let parentFiber;
            // Traverse to find the return parent
            for (let current = fiber.return; current !== null; current = current.return) {
                if ([5, 3, 4].includes(current.tag)) {
                    parentFiber = current;
                    break;
                }
            }

            if (!parentFiber) {
                throw new Error("Unable to locate return parent.");
            }

            switch (parentFiber.tag) {
                case 5:
                    const parentNode = parentFiber.stateNode;
                    if (flags & 32) {
                        parentNode.textContent = ""; // Clear content
                        fiber.flags &= ~32; // Clear flag
                    }
                    commitWork(fiber, parentNode);
                    break;
                case 3:
                case 4:
                    const container = parentFiber.stateNode.containerInfo;
                    commitWork(fiber, container);
                    break;
                default:
                    throw new Error("Unsupported parent tag.");
            }
        } catch (error) {
            handleError(fiber.return, error);
        }

        fiber.flags &= ~2; // Clear placement flag
    }

    if (flags & 4096) {
        fiber.flags &= ~4096; // Clear specific flag
    }
}

function renamedFunctionvar_1749(rootFiber) {
    let currentFiber = rootFiber;
    while (currentFiber !== null) {
        if (currentFiber.tag === 22 && currentFiber.memoizedState !== null) {
            // Skip this branch if it's already hidden
            currentFiber = currentFiber.sibling;
            continue;
        }

        if (currentFiber.subtreeFlags & 8772 && currentFiber.child !== null) {
            currentFiber.child.return = currentFiber;
            currentFiber = currentFiber.child;
        } else {
            while (currentFiber !== null) {
                if (currentFiber.sibling !== null) {
                    currentFiber.sibling.return = currentFiber.return;
                    currentFiber = currentFiber.sibling;
                    break;
                }
                currentFiber = currentFiber.return;
            }
        }
    }
}

function renamedFunctionvar_1761(rootFiber) {
    let currentFiber = rootFiber;

    while (currentFiber !== null) {
        if (currentFiber.flags & 8772) {
            try {
                switch (currentFiber.tag) {
                    case 0: // Functional component
                    case 11: // ForwardRef
                    case 15: // Memo
                        if (!currentFiber.stateNode) {
                            commitFunctionalComponentUnmount(currentFiber);
                        }
                        break;

                    case 1: // Class component
                        const instance = currentFiber.stateNode;
                        if (currentFiber.flags & 4) {
                            if (!instance) {
                                instance.componentDidMount?.();
                            } else {
                                const prevProps = currentFiber.memoizedProps;
                                const prevState = currentFiber.memoizedState;
                                instance.componentDidUpdate?.(prevProps, prevState);
                            }
                        }
                        commitUpdateQueue(currentFiber);
                        break;

                    case 5: // Host component
                        if (currentFiber.flags & 4 && currentFiber.stateNode !== null) {
                            if (currentFiber.memoizedProps.autoFocus) {
                                currentFiber.stateNode.focus?.();
                            }
                        }
                        break;

                    case 13: // Suspense component
                        const suspenseState = currentFiber.memoizedState;
                        if (suspenseState !== null && suspenseState.dehydrated !== null) {
                            hydrateSuspenseInstance(suspenseState.dehydrated);
                        }
                        break;

                    default:
                        break;
                }
            } catch (error) {
                handleError(currentFiber.return, error);
            }
        }

        if (currentFiber === rootFiber) {
            return;
        }

        if (currentFiber.sibling !== null) {
            currentFiber.sibling.return = currentFiber.return;
            currentFiber = currentFiber.sibling;
        } else {
            currentFiber = currentFiber.return;
        }
    }
}

function renamedFunctionvar_1774() {
    while (genericVar !== null) {
        const current = genericVar;
        if (current === genericVar) {
            genericVar = null;
            break;
        }
        const sibling = current.sibling;
        if (sibling !== null) {
            sibling.return = current.return;
            genericVar = sibling;
            break;
        }
        genericVar = current.return;
    }
}

function renamedFunctionvar_1777() {
    while (genericVar !== null) {
        const current = genericVar;
        try {
            switch (current.tag) {
                case 0: // Functional component
                case 11: // ForwardRef
                case 15: // Memo
                    try {
                        // Simulate side-effect work for functional components
                        performFunctionalComponentEffects(current);
                    } catch (error) {
                        handleError(current.return, error);
                    }
                    break;

                case 1: // Class component
                    const instance = current.stateNode;
                    if (typeof instance.componentDidMount === "function") {
                        try {
                            instance.componentDidMount();
                        } catch (error) {
                            handleError(current.return, error);
                        }
                    }
                    break;

                case 5: // Host component
                    try {
                        // Handle updates for DOM components
                        performDOMComponentUpdates(current);
                    } catch (error) {
                        handleError(current.return, error);
                    }
                    break;
            }
        } catch (error) {
            handleError(current.return, error);
        }

        if (current === genericVar) {
            genericVar = null;
            break;
        }

        const sibling = current.sibling;
        if (sibling !== null) {
            sibling.return = current.return;
            genericVar = sibling;
            break;
        }

        genericVar = current.return;
    }
}

function renamedFunctionvar_1810() {
    if (genericVar.mode & 1) {
        return 1;
    }
    if (genericVar & 2 && genericVar !== 0) {
        return genericVar & -genericVar;
    }
    if (genericVar.transition !== null) {
        return genericVar === 0 ? 16 : genericVar.transition();
    }
    return genericVar;
}

function renamedFunctionvar_1817(genericVar) {
    const callbackNode = genericVar.callbackNode;
    function updateExpirationTimes(fiber) {
        let suspended = fiber.suspendedLanes;
        let pinged = fiber.pingedLanes;
        let expirationTimes = fiber.expirationTimes;
        let pendingLanes = fiber.pendingLanes;

        while (pendingLanes > 0) {
            const index = 31 - Math.clz32(pendingLanes);
            const lane = 1 << index;
            const expirationTime = expirationTimes[index];
            if (expirationTime === -1) {
                if (!(lane & suspended && !(lane & pinged))) {
                    expirationTimes[index] = computeExpirationTime(lane, fiber);
                }
            } else if (expirationTime <= fiber.currentTime) {
                fiber.expiredLanes |= lane;
            }
            pendingLanes &= ~lane;
        }
    }

    updateExpirationTimes(genericVar);

    const nextLanes = getNextLanes(genericVar, genericVar.callbackPriority);
    if (nextLanes === 0) {
        if (callbackNode !== null) {
            cancelCallback(callbackNode);
        }
        genericVar.callbackNode = null;
        genericVar.callbackPriority = 0;
    } else {
        const newCallbackPriority = getHighestPriority(nextLanes);
        if (genericVar.callbackPriority !== newCallbackPriority) {
            if (callbackNode !== null) {
                cancelCallback(callbackNode);
            }
            if (newCallbackPriority === 1) {
                scheduleSyncCallback(() => {
                    genericVar.isRunning = true;
                    performSyncWork(genericVar);
                });
            } else {
                scheduleCallback(newCallbackPriority, () => {
                    performConcurrentWork(genericVar);
                });
            }
            genericVar.callbackPriority = newCallbackPriority;
        }
    }
}

function processGenericTask() {
    // Initialize state
    let currentTask = null;
    let priority = 0;

    if ((priority & 6) !== 0) {
        throw new Error("Invalid state: priority conflict.");
    }

    const currentCallback = genericVar.callbackNode;

    if (currentCallback && currentCallback !== genericVar.callbackNode) {
        return null;
    }

    const currentLanes = getNextLanes(genericVar);
    if (currentLanes === 0) {
        return null;
    }

    if ((currentLanes & 30) !== 0 || (currentLanes & genericVar.expiredLanes) !== 0) {
        processWork(currentLanes);
    } else {
        scheduleTask(currentLanes);
    }

    if (currentLanes !== 0) {
        if (currentLanes & 2 && hasWorkOnLane(currentLanes)) {
            processWork(currentLanes);
        } else if (currentLanes & 1) {
            try {
                executeHighPriorityTask();
            } catch (error) {
                handleHighPriorityError(error);
            }
        } else if (currentLanes & 6) {
            try {
                executeLowPriorityTask();
            } catch (error) {
                handleLowPriorityError(error);
            }
        }
    }
}

function getNextLanes(taskQueue) {
    // Compute next lanes for processing
    return taskQueue ? taskQueue.pendingLanes : 0;
}

function processWork(lanes) {
    try {
        // Simulate work processing logic
        console.log(`Processing work for lanes: ${lanes}`);
    } catch (error) {
        console.error(`Error processing work: ${error.message}`);
    }
}

function scheduleTask(lanes) {
    try {
        const timeout = computeTimeoutForLanes(lanes);
        console.log(`Scheduling task with timeout: ${timeout}ms`);
        setTimeout(() => {
            processWork(lanes);
        }, timeout);
    } catch (error) {
        console.error(`Error scheduling task: ${error.message}`);
    }
}

function computeTimeoutForLanes(lanes) {
    if (lanes & 1) return 100; // High priority
    if (lanes & 2) return 500; // Medium priority
    if (lanes & 4) return 1000; // Low priority
    return 2000; // Default
}

function hasWorkOnLane(lane) {
    // Simulate lane work detection
    return lane > 0;
}

function executeHighPriorityTask() {
    console.log("Executing high-priority task.");
}

function executeLowPriorityTask() {
    console.log("Executing low-priority task.");
}

function handleHighPriorityError(error) {
    console.error(`Error in high-priority task: ${error.message}`);
}

function handleLowPriorityError(error) {
    console.error(`Error in low-priority task: ${error.message}`);
}

                   // Function to reset finished work and cleanup
function resetFinishedWork(fiberRoot) {
    fiberRoot.finishedWork = null;
    fiberRoot.finishedLanes = 0;

    if (fiberRoot.timeoutHandle !== -1) {
        clearTimeout(fiberRoot.timeoutHandle);
        fiberRoot.timeoutHandle = -1;
    }

    let currentFiber = fiberRoot.current;
    while (currentFiber) {
        processFiber(currentFiber);
        currentFiber = currentFiber.return;
    }

    resetPendingInterleavedUpdates(fiberRoot);
    return null;
}

// Function to process each fiber during cleanup
function processFiber(fiber) {
    switch (fiber.tag) {
        case 1: // Class component
            if (fiber.type.childContextTypes) {
                console.log("Processing class component context.");
            }
            break;
        case 3: // Root fiber
            console.log("Processing root fiber.");
            break;
        case 5: // Host component
            console.log("Processing host component.");
            break;
        case 4: // Host root
            console.log("Processing host root.");
            break;
        case 13: // Suspense component
        case 19: // Suspense list
            console.log("Processing suspense components.");
            break;
        case 10: // Context provider
            console.log("Processing context provider.");
            break;
        case 22: // Legacy hidden
        case 23: // Offscreen
            console.log("Processing offscreen component.");
            break;
        default:
            console.warn("Unknown fiber type encountered:", fiber.tag);
    }
}

// Function to reset interleaved updates
function resetPendingInterleavedUpdates(root) {
    if (root && root.interleavedUpdates) {
        root.interleavedUpdates.forEach((queue) => {
            let interleaved = queue.interleaved;
            if (interleaved) {
                queue.interleaved = null;

                let firstPending = interleaved.next;
                let lastPending = queue.pending;

                if (lastPending) {
                    let lastPendingNext = lastPending.next;
                    lastPending.next = firstPending;
                    interleaved.next = lastPendingNext;
                }

                queue.pending = interleaved;
            }
        });
    }
}
function handleErrors(root) {
    while (true) {
        try {
            let current = root;
            current.current = root;

            if (!current) break;

            // Reset memoized state and queues
            for (let state = current.memoizedState; state !== null; state = state.next) {
                if (state.queue) state.queue.pending = null;
            }

            // Update current fiber
            current.current = null;
            if (current === null || current.return === null) {
                resetGlobalState();
                break;
            }

            // Process return fibers for error handling
            while (current) {
                if (current.tag === 3) { // Host root
                    current.flags |= 65536;
                    propagateLanes(current);
                    handleRootErrors(current);
                    break;
                }

                if (current.tag === 1) { // Class component
                    const type = current.type;
                    const instance = current.stateNode;
                    if (instance && typeof instance.getDerivedStateFromError === "function") {
                        propagateLanes(current);
                        handleComponentErrors(instance, current);
                        break;
                    }
                }

                current = current.return;
            }
        } catch (error) {
            root = handleUncaughtError(error, root);
        }
    }
}

function propagateLanes(fiber) {
    const root = fiber.return;
    if (root) {
        root.flags |= 32768;
        if (root.tag === 3) {
            root.lanes |= fiber.lanes;
        }
    }
}

function handleRootErrors(fiber) {
    console.error("Error occurred at the root fiber.");
    fiber.flags |= 65536;
}

function handleComponentErrors(instance, fiber) {
    console.error("Error occurred in component:", instance.constructor.name);
    fiber.flags |= 65536;
}

function handleUncaughtError(error, root) {
    console.error("Uncaught error:", error);
    let next = root.return;
    while (next) {
        if (next.tag === 3) {
            next.flags |= 65536;
            break;
        }
        next = next.return;
    }
    return next;
}

function resetGlobalState() {
    console.log("Resetting global state...");
}

function renamedFunctionvar_1907, genericVar {
    var genericVar = genericVar;
    genericVar |= 2;
    var genericVar = genericVar;
    for genericVar === genericVar && genericVar === genericVar || (genericVar = null, genericVar(genericVar, genericVar);
    ;
    ) {
        try {
            genericVar;
            break;
        }
        catch genericVar {
            var_1845var_1907, genericVar;
        }
    }
    genericVar;
    genericVar = genericVar;
    genericVar.current = genericVar;
    if null !== genericVar {
        throw Errorvar_28(261);
    }
    genericVar = null;
    genericVar = 0;
    return genericVar;
}
function genericVar {
    for ;
    null !== genericVar;
    {
        var_1913var_1795;
    }
}
function genericVar {
    for ;
    null !== genericVar && !genericVar(;
    ) {
        var_1913var_1795;
    }
}
function renamedFunctionvar_1914 {
    var genericVar = var_1790var_1914.alternate, genericVar, genericVar;
    genericVar.memoizedProps = genericVar.pendingProps;
    if null === genericVar {
        var_1904var_1914;
    }
    else {
        genericVar = genericVar;
    }
    genericVar.current = null;
}
function renamedFunctionvar_1916 {
    var genericVar = genericVar;
    do {
        var genericVar = genericVar.alternate;
        genericVar = genericVar["return"];
        if 0 == (32768 & genericVar.flags) {
            if null !== (genericVar = genericVar(genericVar, genericVar, genericVar)) {
                return void genericVar = genericVar;
            }
        }
        else {
            if null !== (genericVar = genericVar(genericVar, genericVar)) {
                genericVar.flags &= 32767;
                return void genericVar = genericVar;
            }
            if null === genericVar {
                genericVar = 6;
                return void genericVar = null;
            }
            genericVar.flags |= 32768;
            genericVar.subtreeFlags = 0;
            genericVar.deletions = null;
        }
        if null !== (genericVar = genericVar.sibling) {
            return void genericVar = genericVar;
        }
        genericVar = genericVar = genericVar;
    }
    while null !== genericVar;
    if 0 === genericVar {
        genericVar = 5;
    }
}
function renamedFunctionvar_1919, genericVar, genericVar {
    var genericVar = genericVar;
    var genericVar = genericVar.transition;
    try {
        genericVar.transition = null;
        genericVar = 1;
        function (genericVar, genericVar, genericVar, genericVar {
            do {
                genericVar;
            }
            while null !== genericVar;
            if 0 != (6 & genericVar) {
                throw Errorvar_28(327);
            }
            genericVar = genericVar.finishedWork;
            var genericVar = genericVar.finishedLanes;
            if null === genericVar {
                return null;
            }
            genericVar.finishedWork = null;
            genericVar.finishedLanes = 0;
            if genericVar === genericVar.current {
                throw Errorvar_28(177);
            }
            genericVar.callbackNode = null;
            genericVar.callbackPriority = 0;
            var genericVar = genericVar.lanes | genericVar.childLanes;
            function (genericVar, genericVar {
                var genericVar = genericVar.pendingLanes & ~genericVar;
                genericVar.pendingLanes = genericVar;
                genericVar.suspendedLanes = 0;
                genericVar.pingedLanes = 0;
                genericVar.expiredLanes &= genericVar;
                genericVar.mutableReadLanes &= genericVar;
                genericVar.entangledLanes &= genericVar;
                genericVar = genericVar.entanglements;
                var genericVar = genericVar.eventTimes;
                for genericVar = genericVar.expirationTimes;
                0 < genericVar;
                {
                    var genericVar = 31 - var_338var_1932;
                    var genericVar = 1 << genericVar;
                    genericVar[genericVar] = 0;
                    genericVar[genericVar] = -1;
                    genericVar[genericVar] = -1;
                    genericVar &= ~genericVar;
                }
            }
            )genericVar, genericVar;
            if genericVar === genericVar {
                genericVar = genericVar = null;
                genericVar = 0;
            }
            if !(0 == (2064 & genericVar.subtreeFlags && 0 == 2064 & genericVar.flags || genericVar)) {
                genericVar = true;
                var_325var_333, function ( {
                    genericVar;
                    return null;
                }
                );
            }
            function processSelection(genericVar) {
                if (genericVar && "selectionStart" in genericVar) {
                    return {
                        start: genericVar.selectionStart,
                        end: genericVar.selectionEnd,
                    };
                } else {
                    const selection = genericVar.ownerDocument?.defaultView?.getSelection();
                    if (selection && selection.rangeCount > 0) {
                        try {
                            const anchorNode = selection.anchorNode;
                            const anchorOffset = selection.anchorOffset;
                            const focusNode = selection.focusNode;
                            const focusOffset = selection.focusOffset;
            
                            if (anchorNode?.nodeType === 3 && focusNode?.nodeType === 3) {
                                return {
                                    start: anchorOffset,
                                    end: focusOffset,
                                };
                            }
                        } catch {
                            return null;
                        }
                    }
                    return null;
                }
            }
            
            function captureFocusedElementState(genericVar) {
                const focusedElem = processSelection(genericVar);
                const selectionRange = focusedElem || { start: 0, end: 0 };
                return { focusedElem, selectionRange };
            }
            
            function traverseChildNodes(root) {
                let currentNode = root;
            
                while (currentNode) {
                    if ((currentNode.subtreeFlags & 1028) !== 0 && currentNode.child) {
                        currentNode.child.return = currentNode;
                        currentNode = currentNode.child;
                    } else {
                        while (currentNode) {
                            const alternate = currentNode.alternate;
            
                            if ((alternate?.flags & 1024) !== 0) {
                                handleSpecialCases(alternate);
                            }
            
                            if (currentNode.sibling) {
                                currentNode.sibling.return = currentNode.return;
                                currentNode = currentNode.sibling;
                                break;
                            }
            
                            currentNode = currentNode.return;
                        }
                    }
                }
            }
            
            function handleSpecialCases(node) {
                switch (node.tag) {
                    case 1: // Class components
                        const instance = node.stateNode;
                        const snapshot = instance.getSnapshotBeforeUpdate
                            ? instance.getSnapshotBeforeUpdate(
                                  node.memoizedProps,
                                  node.memoizedState
                              )
                            : null;
                        instance.__reactInternalSnapshotBeforeUpdate = snapshot;
                        break;
                    case 5: // Host components
                    case 6: // Text nodes
                    case 4: // Host root
                    case 17: // Context consumer
                    default:
                        break;
                }
            }
            
            function clearContainerContent(containerInfo) {
                if (containerInfo?.nodeType === 1) { // Element node
                    containerInfo.textContent = "";
                } else if (containerInfo?.nodeType === 9 && containerInfo?.documentElement) { // Document node
                    containerInfo.removeChild(containerInfo.documentElement);
                } else {
                    throw new Error("Unexpected node type in container.");
                }
            }
            
            function handleCommitLifecycle(node) {
                if (node && typeof node.onCommitFiberRoot === "function") {
                    try {
                        node.onCommitFiberRoot(node, undefined, !!(node.current?.flags & 128));
                    } catch (error) {
                     //   console.error("Error in onCommitFiberRoot:", error);
                    }
                } else {
                    console.warn("onCommitFiberRoot is not defined or not a function.");
                }
            }
            
            function processNodeLifecycle(node) {
                try {
                    if (!node || !node.stateNode || !node.stateNode.containerInfo) {
                        throw new Error("Node, stateNode, or containerInfo is undefined.");
                    }
            
                    switch (node.tag) {
                        case 3: { // Root node
                            const containerInfo = node.stateNode.containerInfo;
                            clearContainerContent(containerInfo);
                            break;
                        }
                        default:
                            throw new Error("Unsupported node tag encountered.");
                    }
                } catch (error) {
                    //console.error("Error processing node lifecycle:", error, node?.return);
                }
            
                if (node?.sibling) {
                    node.sibling.return = node.return;
                    return node.sibling;
                }
                return node?.return;
            }
            
            
            
            function handleFiberTransitions(root) {
                if (!root || typeof root !== "object") {
                    throw new Error("Invalid root object provided.");
                }
            
                const { transition } = root;
                root.transition = null;
            
                try {
                    let finishedWork = root.finishedWork;
                    if (!finishedWork) return null;
            
                    root.finishedWork = null;
                    root.finishedLanes = 0;
            
                    if (finishedWork === root.current) {
                        throw new Error("Finished work matches current fiber.");
                    }
            
                    // Clear pending lanes
                    if (finishedWork.lanes) {
                        root.pendingLanes &= ~finishedWork.lanes;
                    }
            
                    // Run lifecycle events
                    const commitQueue = finishedWork.stateNode;
                    if (commitQueue && typeof commitQueue.onCommitFiberRoot === "function") {
                        try {
                            handleCommitLifecycle(commitQueue);
                        } catch (error) {
                           // console.error("Error in handleCommitLifecycle:", error);
                        }
                    }
            
                    // Process node lifecycle
                    if (finishedWork.tag !== 0) {
                        let node = finishedWork;
                        while (node) {
                            try {
                                node = processNodeLifecycle(node);
                            } catch (error) {
                             //   console.error("Error processing node lifecycle:", error, node);
                                node = node.sibling || node.return;
                            }
                        }
                    }
                } catch (error) {
                  //  console.error("Error in handleFiberTransitions:", error);
                } finally {
                    root.transition = transition;
                }
            
                return null;
            }
            
            
            function genericVar() {
                if (genericVar !== null) {
                    genericVar = var_377var_1805; // Assuming this is already declared earlier.
                    genericVar.transition = null;
                    genericVar = genericVar < 16 ? 16 : genericVar;
            
                    if (genericVar === null) {
                        genericVar = false;
                    } else {
                        genericVar = null;
                        genericVar = 0;
            
                        if ((6 & genericVar) !== 0) {
                            throw Errorvar_28(331);
                        }
            
                        genericVar |= 4;
            
                        for (genericVar = genericVar.current; genericVar !== null;) {
                            let childGenericVar = genericVar.child;
            
                            if ((16 & childGenericVar.flags) !== 0) {
                                let deletions = childGenericVar.deletions;
            
                                if (deletions !== null) {
                                    for (let i = 0; i < deletions.length; i++) {
                                        let deletionNode = deletions[i];
            
                                        for (let node = deletionNode; node !== null;) {
                                            let currentNode = node;
                                            switch (currentNode.tag) {
                                                case 0:
                                                case 11:
                                                case 15:
                                                    break;
                                            }
            
                                            let childNode = currentNode.child;
                                            if (childNode !== null) {
                                                childNode.return = currentNode;
                                                node = childNode;
                                            } else {
                                                for (; node !== null;) {
                                                    let siblingNode = node.sibling;
                                                    let returnNode = node.return;
            
                                                    var_1657var_1974; // Placeholder, assuming it's defined elsewhere.
            
                                                    if (node === deletionNode) {
                                                        node = null;
                                                        break;
                                                    }
            
                                                    if (siblingNode !== null) {
                                                        siblingNode.return = returnNode;
                                                        node = siblingNode;
                                                        break;
                                                    }
            
                                                    node = returnNode;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
            
                            genericVar = childGenericVar;
                        }
                    }
                }
            }
            
                                            var genericVar = genericVar.alternate;
if (genericVar !== null) {
    var childGenericVar = genericVar.child;
    if (childGenericVar !== null) {
        childGenericVar.child = null;
        do {
            var siblingGenericVar = childGenericVar.sibling;
            childGenericVar.sibling = null;
            childGenericVar = siblingGenericVar;
        } while (childGenericVar !== null);
    }
}
genericVar = genericVar;

if ((2064 & genericVar.subtreeFlags) !== 0 && genericVar !== null) {
    genericVar.return = genericVar;
    genericVar = genericVar;
} else {
    while (genericVar !== null) {
        if ((2048 & genericVar.flags) !== 0) {
            switch (genericVar.tag) {
                case 0:
                case 11:
                case 15:
                    break;
            }
        }
        var siblingGenericVar = genericVar.sibling;
        if (siblingGenericVar !== null) {
            siblingGenericVar.return = genericVar.return;
            genericVar = siblingGenericVar;
            break;
        }
        genericVar = genericVar.return;
    }
}

var currentGenericVar = genericVar.current;
for (var node = currentGenericVar; node !== null;) {
    var childNode = node.child;
    if ((2064 & childNode.subtreeFlags) !== 0 && childNode !== null) {
        childNode.return = node;
        node = childNode;
    } else {
        while (node !== null) {
            if ((2048 & node.flags) !== 0) {
                try {
                    switch (node.tag) {
                        case 0:
                        case 11:
                        case 15:
                            break;
                    }
                } catch (error) {
                    var_1634var_1971; // Placeholder assuming it's defined elsewhere.
                }
            }
            if (node === currentGenericVar) {
                node = null;
                break;
            }
            var siblingNode = node.sibling;
            if (siblingNode !== null) {
                siblingNode.return = node.return;
                node = siblingNode;
                break;
            }
            node = node.return;
        }
    }
}

                                                var genericVar = genericVar.sibling;
                                                if null !== genericVar {
                                                    genericVar["return"] = genericVar["return"];
                                                    genericVar = genericVar;
                                                    break genericVar;
                                                }
                                                genericVar = genericVar["return"];
                                            }
                                        }
                                    }
                                    genericVar = genericVar;
                                    if (genericVar && typeof genericVar.onPostCommitFiberRoot === "function") {
                                        try {
                                            genericVar.onPostCommitFiberRoot(var_336, genericVar);
                                        } catch (error) {
                                            // Catch block left intentionally empty.
                                        }
                                    }
                                    genericVar = true;
                                    return genericVar;
                                    } finally {
                                        genericVar = genericVar;
                                        genericVar.transition = genericVar;
                                    }
                                    return false;
                                    }
                                    
                                    function renamedFunctionvar_1990(genericVar, genericVar2) {
                                        genericVar = var_944var_1990;
                                        genericVar = genericVar(0, genericVar(genericVar2, genericVar2, 1), 1);
                                        if (genericVar !== null) {
                                            var_366var_1990(1, genericVar);
                                            var_1816var_1990(genericVar);
                                        }
                                    }
                                    
                                    function renamedFunctionvar_1993(genericVar, genericVar2) {
                                        if (genericVar.tag === 3) {
                                            var_1989var_1993(genericVar, genericVar2);
                                        } else {
                                            while (genericVar !== null) {
                                                if (genericVar.tag === 3) {
                                                    var_1989var_1994(genericVar, genericVar2);
                                                    break;
                                                }
                                                if (genericVar.tag === 1) {
                                                    var stateNode = genericVar.stateNode;
                                                    if (typeof stateNode.type.getDerivedStateFromError === "function" ||
                                                        (typeof stateNode.componentDidCatch === "function" &&
                                                            (genericVar === null || !genericVar.has(stateNode)))) {
                                                        genericVar = var_944var_1994;
                                                        genericVar = genericVar(genericVar2, genericVar(genericVar2, genericVar2, 1), 1);
                                                        if (genericVar !== null) {
                                                            var_366var_1994(1, genericVar);
                                                            var_1816var_1994(genericVar);
                                                        }
                                                        break;
                                                    }
                                                }
                                                genericVar = genericVar.return;
                                            }
                                        }
                                    }
                                    
                                    genericVar = genericVar;
                                    if (genericVar && typeof genericVar.onPostCommitFiberRoot === "function") {
                                        try {
                                            genericVar.onPostCommitFiberRoot(var_336, genericVar);
                                        } catch (error) {
                                            // Catch block left intentionally empty.
                                        }
                                    }
                                    genericVar = true;
                                    return genericVar;
                                    } finally {
                                        genericVar = genericVar;
                                        genericVar.transition = genericVar;
                                    }
                                    return false;
                                    }
                                    
                                    function renamedFunctionvar_1990(genericVar, genericVar2) {
                                        genericVar = var_944var_1990;
                                        genericVar = genericVar(0, genericVar(genericVar2, genericVar2, 1), 1);
                                        if (genericVar !== null) {
                                            var_366var_1990(1, genericVar);
                                            var_1816var_1990(genericVar);
                                        }
                                    }
                                    
                                    function renamedFunctionvar_1993(genericVar, genericVar2) {
                                        if (genericVar.tag === 3) {
                                            var_1989var_1993(genericVar, genericVar2);
                                        } else {
                                            while (genericVar !== null) {
                                                if (genericVar.tag === 3) {
                                                    var_1989var_1994(genericVar, genericVar2);
                                                    break;
                                                }
                                                if (genericVar.tag === 1) {
                                                    var stateNode = genericVar.stateNode;
                                                    if (typeof stateNode.type.getDerivedStateFromError === "function" ||
                                                        (typeof stateNode.componentDidCatch === "function" &&
                                                            (genericVar === null || !genericVar.has(stateNode)))) {
                                                        genericVar = var_944var_1994;
                                                        genericVar = genericVar(genericVar2, genericVar(genericVar2, genericVar2, 1), 1);
                                                        if (genericVar !== null) {
                                                            var_366var_1994(1, genericVar);
                                                            var_1816var_1994(genericVar);
                                                        }
                                                        break;
                                                    }
                                                }
                                                genericVar = genericVar.return;
                                            }
                                        }
                                    }
                                    
                        var genericVar = genericVar;
                        if null !== (genericVar = genericVar(genericVar, genericVar)) {
                            var_366var_2002, genericVar, genericVar;
                            var_1816var_2002, genericVar;
                        }
                    
                    function renamedFunctionvar_2005 {
                        var genericVar = genericVar.memoizedState;
                        var genericVar = 0;
                        if null !== genericVar {
                            genericVar = genericVar.retryLane;
                        }
                        var_2001var_2005, genericVar;
                    }
                    function renamedFunctionvar_2008, genericVar {
                        var genericVar = 0;
                        switch genericVar.tag {
                            case 13:
                            var genericVar = genericVar.stateNode;
                            var genericVar = genericVar.memoizedState;
                            if null !== genericVar {
                                genericVar = genericVar.retryLane;
                            }
                            break;
                            case 19:
                            genericVar = genericVar.stateNode;
                            break;
                            default:
                            throw Errorvar_28(314);
                        }
                        if null !== genericVar {
                            genericVar["delete"]genericVar;
                        }
                        var_2001var_2008, genericVar;
                    }
                    function renamedFunctionvar_2013, genericVar, genericVar, genericVar {
                        this.tag = genericVar;
                        this.key = genericVar;
                        this.sibling = this.child = this["return"] = this.stateNode = this.type = this.elementType = null;
                        this.index = 0;
                        this.ref = null;
                        this.pendingProps = genericVar;
                        this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
                        this.mode = genericVar;
                        this.subtreeFlags = this.flags = 0;
                        this.deletions = null;
                        this.childLanes = this.lanes = 0;
                        this.alternate = null;
                    }
                    function renamedFunctionvar_2017 {
                        return !!(genericVar = genericVar.prototype || !genericVar.isReactComponent);
                    }
                    function renamedFunctionvar_2018, genericVar {
                        var genericVar = genericVar.alternate;
                        if null === genericVar {
                            genericVar = new genericVar(genericVar.tag, genericVar, genericVar.key, genericVar.mode).elementType = genericVar.elementType;
                            genericVar.type = genericVar.type;
                            genericVar.stateNode = genericVar.stateNode;
                            genericVar.alternate = genericVar;
                            genericVar.alternate = genericVar;
                        }
                        else {
                            genericVar.pendingProps = genericVar;
                            genericVar.type = genericVar.type;
                            genericVar.flags = 0;
                            genericVar.subtreeFlags = 0;
                            genericVar.deletions = null;
                        }
                        genericVar.flags = 14680064 & genericVar.flags;
                        genericVar.childLanes = genericVar.childLanes;
                        genericVar.lanes = genericVar.lanes;
                        genericVar.child = genericVar.child;
                        genericVar.memoizedProps = genericVar.memoizedProps;
                        genericVar.memoizedState = genericVar.memoizedState;
                        genericVar.updateQueue = genericVar.updateQueue;
                        genericVar = genericVar.dependencies;
                        genericVar.dependencies = null === genericVar ? null : {
                            lanes: genericVar.lanes,
                            firstContext: genericVar.firstContext
                        }
                        ;
                        genericVar.sibling = genericVar.sibling;
                        genericVar.index = genericVar.index;
                        genericVar.ref = genericVar.ref;
                        return genericVar;
                    }
                    function renamedFunctionvar_2021, genericVar, genericVar, genericVar, genericVar, genericVar {
                        var genericVar = 2;
                        genericVar = genericVar;
                        if "function" == typeof genericVar {
                            if genericVar(genericVar) {
                                genericVar = 1;
                            }
                        }
                        else {
                            if "string" == typeof genericVar {
                                genericVar = 5;
                            }
                            else {
                                genericVar: switch genericVar {
                                    case genericVar:
                                    return var_1104var_2023.children, genericVar, genericVar, genericVar;
                                    case genericVar:
                                    genericVar = 8;
                                    genericVar |= 8;
                                    break;
                                    case genericVar:
                                    genericVar = new genericVar(12, genericVar, genericVar, 2 | genericVar).elementType = genericVar;
                                    genericVar.lanes = genericVar;
                                    return genericVar;
                                    case genericVar:
                                    genericVar = new genericVar(13, genericVar, genericVar, genericVar).elementType = genericVar;
                                    genericVar.lanes = genericVar;
                                    return genericVar;
                                    case genericVar:
                                    genericVar = new genericVar(19, genericVar, genericVar, genericVar).elementType = genericVar;
                                    genericVar.lanes = genericVar;
                                    return genericVar;
                                    case genericVar:
                                    return var_1534var_2023, genericVar, genericVar, genericVar;
                                    default:
                                    if "object" == typeof genericVar && null !== genericVar {
                                        switch genericVar.$typeof {
                                            case genericVar:
                                            genericVar = 10;
                                            break genericVar;
                                            case genericVar:
                                            genericVar = 9;
                                            break genericVar;
                                            case genericVar:
                                            genericVar = 11;
                                            break genericVar;
                                            case genericVar:
                                            genericVar = 14;
                                            break genericVar;
                                            case genericVar:
                                            genericVar = 16;
                                            genericVar = null;
                                            break genericVar;
                                        }
                                    }
                                    throw Errorvar_28(130, null == genericVar ? genericVar : typeof genericVar, "");
                                }
                            }
                        }
                        genericVar = new genericVar(genericVar, genericVar, genericVar, genericVar).elementType = genericVar;
                        genericVar.type = genericVar;
                        genericVar.lanes = genericVar;
                        return genericVar;
                    }
                    function renamedFunctionvar_2029, genericVar, genericVar, genericVar {
                        genericVar = new genericVar(7, genericVar, genericVar, genericVar).lanes = genericVar;
                        return genericVar;
                    }
                    function renamedFunctionvar_2033, genericVar, genericVar, genericVar {
                        genericVar = new genericVar(22, genericVar, genericVar, genericVar).elementType = genericVar;
                        genericVar.lanes = genericVar;
                        genericVar.stateNode = {
                            isHidden: false
                        }
                        ;
                        return genericVar;
                    }
                    function renamedFunctionvar_2037, genericVar, genericVar {
                        genericVar = new genericVar(6, genericVar, null, genericVar).lanes = genericVar;
                        return genericVar;
                    }
                    function renamedFunctionvar_2040, genericVar, genericVar {
                        genericVar = new genericVar(4, null !== genericVar.children ? genericVar.children : [], genericVar.key, genericVar).lanes = genericVar;
                        genericVar.stateNode = {
                            containerInfo: genericVar.containerInfo,
                            pendingChildren: null,
                            implementation: genericVar.implementation
                        }
                        ;
                        return genericVar;
                    }
                    function renamedFunctionvar_2044, genericVar, genericVar, genericVar, genericVar {
                        this.tag = genericVar;
                        this.containerInfo = genericVar;
                        this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
                        this.timeoutHandle = -1;
                        this.callbackNode = this.pendingContext = this.context = null;
                        this.callbackPriority = 0;
                        this.eventTimes = genericVar;
                        this.expirationTimes = genericVar-1;
                        this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
                        this.entanglements = genericVar;
                        this.identifierPrefix = genericVar;
                        this.onRecoverableError = genericVar;
                        this.mutableSourceEagerHydrationData = null;
                    }
                    function renamedFunctionvar_2050, genericVar, genericVar, genericVar, genericVar, genericVar, genericVar, genericVar, genericVar {
                        genericVar = new var_2043var_2050, genericVar, genericVar, genericVar, genericVar;
                        if 1 === genericVar {
                            genericVar = 1;
                            if true === genericVar {
                                genericVar |= 8;
                            }
                        }
                        else {
                            genericVar = 0;
                        }
                        genericVar = new genericVar, null, null, genericVar;
                        genericVar.current = genericVar;
                        genericVar.stateNode = genericVar;
                        genericVar.memoizedState = {
                            element: genericVar,
                            isDehydrated: genericVar,
                            cache: null,
                            transitions: null,
                            pendingSuspenseBoundaries: null
                        }
                        ;
                        var_939var_2055;
                        return genericVar;
                    }
                    function renamedFunctionvar_2060 {
                        if !genericVar {
                            return genericVar;
                        }
                        genericVar: {
                            if genericVar(genericVar = genericVar._reactInternals !== genericVar || 1 !== genericVar.tag) {
                                throw Errorvar_28(170);
                            }
                            var genericVar = genericVar;
                            do {
                                switch genericVar.tag {
                                    case 3:
                                    genericVar = genericVar.stateNode.context;
                                    break genericVar;
                                    case 1:
                                    if genericVar(genericVar.type) {
                                        genericVar = genericVar.stateNode.__reactInternalMemoizedMergedChildContext;
                                        break genericVar;
                                    }
                                }
                                genericVar = genericVar["return"];
                            }
                            while null !== genericVar;
                            throw Errorvar_28(171);
                        }
                        if 1 === genericVar.tag {
                            var genericVar = genericVar.type;
                            if genericVar(genericVar) {
                                return var_823var_2060, genericVar, genericVar;
                            }
                        }
                        return genericVar;
                    }
                    function renamedFunctionvar_2065, genericVar, genericVar, genericVar, genericVar, genericVar, genericVar, genericVar, genericVar {
                        genericVar = genericVar(genericVar, genericVar, true, genericVar, 0, genericVar, 0, genericVar, genericVar).context = var_2059null;
                        genericVar = genericVar.current;
                        (genericVar = {
                            eventTime: genericVar = genericVar,
                            lane: genericVar = var_1003var_2067,
                            tag: 0,
                            payload: null,
                            callback: null,
                            next: null
                        }
                        ).callback = null != genericVar ? genericVar : null;
                        var_944var_2067, genericVar, genericVar;
                        genericVar.current.lanes = genericVar;
                        var_366var_2065, genericVar, genericVar;
                        var_1816var_2065, genericVar;
                        return genericVar;
                    }
                    function renamedFunctionvar_2075, genericVar, genericVar, genericVar {
                        var genericVar = genericVar.current;
                        var genericVar = genericVar;
                        var genericVar = var_1003var_2079;
                        genericVar = var_2059var_2077;
                        if null === genericVar.context {
                            genericVar.context = genericVar;
                        }
                        else {
                            genericVar.pendingContext = genericVar;
                        }
                        (genericVar = {
                            eventTime: genericVar,
                            lane: genericVar,
                            tag: 0,
                            payload: null,
                            callback: null,
                            next: null
                        }
                        ).payload = {
                            element: genericVar
                        }
                        ;
                        if null !== (genericVar = undefined === genericVar ? null : genericVar) {
                            genericVar.callback = genericVar;
                        }
                        if null !== (genericVar = genericVar(genericVar, genericVar, genericVar)) {
                            var_1005var_2075, genericVar, genericVar, genericVar;
                            var_951var_2075, genericVar, genericVar;
                        }
                        return genericVar;
                    }
                    function renamedFunctionvar_2083 {
                        return genericVar = genericVar.current.child ? genericVar.child.tag, genericVar.child.stateNode : null;
                    }
                    function renamedFunctionvar_2085, genericVar {
                        if null !== (genericVar = genericVar.memoizedState && null !== genericVar.dehydrated) {
                            var genericVar = genericVar.retryLane;
                            genericVar.retryLane = 0 !== genericVar && genericVar < genericVar ? genericVar : genericVar;
                        }
                    }
                    function renamedFunctionvar_2089, genericVar {
                        var_2084var_2089, genericVar;
                        if genericVar = genericVar.alternate {
                            var_2084var_2089, genericVar;
                        }
                    }
                    genericVar = function genericVar, genericVar, genericVar {
                        if null !== genericVar {
                            if genericVar.memoizedProps !== genericVar.pendingProps || false {
                                genericVar = true;
                            }
                            else {
                                if 0 == (genericVar.lanes & genericVar && 0 == 128 & genericVar.flags) {
                                    genericVar = false;
                                    return function genericVar, genericVar, genericVar {
                                        switch genericVar.tag {
                                            case 3:
                                            var_1511var_2095;
                                            genericVar;
                                            break;
                                            case 5:
                                            var_1167var_2095;
                                            break;
                                            case 1:
                                            if genericVar(genericVar.type) {
                                                var_829var_2095;
                                            }
                                            break;
                                            case 4:
                                            var_1163var_2095, genericVar.stateNode.containerInfo;
                                            break;
                                            case 10:
                                            var genericVar = genericVar.type._context;
                                            var genericVar = genericVar.memoizedProps.value;
                                            var_802var_906, genericVar._currentValue;
                                            genericVar._currentValue = genericVar;
                                            break;
                                            case 13:
                                            if null !== (genericVar = genericVar.memoizedState) {
                                                return null !== genericVar.dehydrated ? genericVar(genericVar, 0, genericVar.flags |= 128, null) : 0 != genericVar & genericVar.child.childLanes ? var_1525var_2094, genericVar, genericVar : genericVar(genericVar, 0, null !== genericVar = genericVar(genericVar, genericVar, genericVar) ? genericVar.sibling : null);
                                            }
                                            var_802var_1173, 0;
                                            break;
                                            case 19:
                                            genericVar = 0 != genericVar & genericVar.childLanes;
                                            if 0 != (128 & genericVar.flags) {
                                                if genericVar {
                                                    return var_1566var_2094, genericVar, genericVar;
                                                }
                                                genericVar.flags |= 128;
                                            }
                                            if null !== (genericVar = genericVar.memoizedState) {
                                                genericVar.rendering = null;
                                                genericVar.tail = null;
                                                genericVar.lastEffect = null;
                                            }
                                            var_802var_1173, 0;
                                            if genericVar {
                                                break;
                                            }
                                            return null;
                                            case 22:
                                            case 23:
                                            genericVar.lanes = 0;
                                            return var_1466var_2094, genericVar, genericVar;
                                        }
                                        return var_1448var_2094, genericVar, genericVar;
                                    }
                                    genericVar, genericVar, genericVar;
                                }
                                genericVar = 0 != 131072 & genericVar.flags;
                            }
                        }
                        else {
                            genericVar = false;
                            if genericVar && 0 != (1048576 & genericVar.flags) {
                                var_859var_2092, genericVar, genericVar.index;
                            }
                        }
                        genericVar.lanes = 0;
                        switch genericVar.tag {
                            case 2:
                            var genericVar = genericVar.type;
                            var_1492var_2091, genericVar;
                            genericVar = genericVar.pendingProps;
                            var genericVar = var_809var_2092, genericVar.current;
                            var_918var_2092, genericVar;
                            genericVar = var_1196null, genericVar, genericVar, genericVar, genericVar, genericVar;
                            var genericVar = genericVar;
                            genericVar.flags |= 1;
                            if "object" == typeof genericVar && null !== genericVar && "function" == typeof genericVar.render && undefined === genericVar.$typeof {
                                genericVar.tag = 1;
                                genericVar.memoizedState = null;
                                genericVar.updateQueue = null;
                                if genericVar(genericVar) {
                                    genericVar = true;
                                    var_829var_2092;
                                }
                                else {
                                    genericVar = false;
                                }
                                genericVar.memoizedState = null !== genericVar.state && undefined !== genericVar.state ? genericVar.state : null;
                                var_939var_2092;
                                genericVar.updater = genericVar;
                                genericVar.stateNode = genericVar;
                                genericVar._reactInternals = genericVar;
                                var_1037var_2092, genericVar, genericVar, genericVar;
                                genericVar = var_1502null, genericVar, genericVar, true, genericVar, genericVar;
                            }
                            else {
                                genericVar.tag = 0;
                                if genericVar && genericVar {
                                    var_867var_2092;
                                }
                                var_1436null, genericVar, genericVar, genericVar;
                                genericVar = genericVar.child;
                            }
                            return genericVar;
                            case 16:
                            genericVar = genericVar.elementType;
                            genericVar: {
                                var_1492var_2091, genericVar;
                                genericVar = genericVar.pendingProps;
                                genericVar = genericVar = genericVar._initvar_2099._payload;
                                genericVar.type = genericVar;
                                genericVar = genericVar.tag = function genericVar {
                                    if "function" == typeof genericVar {
                                        return var_1456var_2103 ? 1 : 0;
                                    }
                                    if null != genericVar {
                                        if(genericVar = genericVar.$typeof === genericVar) {
                                            return 11;
                                        }
                                        if genericVar === genericVar {
                                            return 14;
                                        }
                                    }
                                    return 2;
                                }
                                genericVar;
                                genericVar = var_902var_2099, genericVar;
                                switch genericVar {
                                    case 0:
                                    genericVar = var_1465null, genericVar, genericVar, genericVar, genericVar;
                                    break genericVar;
                                    case 1:
                                    genericVar = var_1485null, genericVar, genericVar, genericVar, genericVar;
                                    break genericVar;
                                    case 11:
                                    genericVar = var_1441null, genericVar, genericVar, genericVar, genericVar;
                                    break genericVar;
                                    case 14:
                                    genericVar = var_1449null, genericVar, genericVar, genericVar(genericVar.type, genericVar, genericVar);
                                    break genericVar;
                                }
                                throw Errorvar_28(306, genericVar, "");
                            }
                            return genericVar;
                            case 0:
                            genericVar = genericVar.type;
                            genericVar = genericVar.pendingProps;
                            return var_1465var_2091, genericVar, genericVar, genericVar = genericVar.elementType === genericVar ? genericVar : genericVar(genericVar, genericVar, genericVar);
                            case 1:
                            genericVar = genericVar.type;
                            genericVar = genericVar.pendingProps;
                            return var_1485var_2091, genericVar, genericVar, genericVar = genericVar.elementType === genericVar ? genericVar : genericVar(genericVar, genericVar, genericVar);
                            case 3:
                            genericVar: {
                                var_1511var_2092;
                                if null === genericVar {
                                    throw Errorvar_28(387);
                                }
                                genericVar = genericVar.pendingProps;
                                genericVar = genericVar = genericVar.memoizedState.element;
                                var_941var_2091, genericVar;
                                var_964var_2092, genericVar, null, genericVar;
                                var genericVar = genericVar.memoizedState;
                                genericVar = genericVar.element;
                                if genericVar.isDehydrated {
                                    genericVar = {
                                        element: genericVar,
                                        isDehydrated: false,
                                        cache: genericVar.cache,
                                        pendingSuspenseBoundaries: genericVar.pendingSuspenseBoundaries,
                                        transitions: genericVar.transitions
                                    }
                                    ;
                                    genericVar.updateQueue.baseState = genericVar;
                                    genericVar.memoizedState = genericVar;
                                    if 256 & genericVar.flags {
                                        genericVar = var_1514var_2091, genericVar, genericVar, genericVar, genericVar = genericVar(Error(genericVar(423), genericVar));
                                        break genericVar;
                                    }
                                    if genericVar !== genericVar {
                                        genericVar = var_1514var_2091, genericVar, genericVar, genericVar, genericVar = genericVar(Error(genericVar(424), genericVar));
                                        break genericVar;
                                    }
                                    genericVar = var_780var_2092.stateNode.containerInfo.firstChild;
                                    genericVar = genericVar;
                                    genericVar = true;
                                    genericVar = null;
                                    genericVar = var_1156var_2092, null, genericVar, genericVar;
                                    for genericVar.child = genericVar;
                                    genericVar;
                                    {
                                        genericVar.flags = -3 & genericVar.flags | 4096;
                                        genericVar = genericVar.sibling;
                                    }
                                }
                                else {
                                    genericVar;
                                    if genericVar === genericVar {
                                        genericVar = var_1448var_2091, genericVar, genericVar;
                                        break genericVar;
                                    }
                                    var_1436var_2091, genericVar, genericVar, genericVar;
                                }
                                genericVar = genericVar.child;
                            }
                            return genericVar;
                            case 5:
                            var_1167var_2092;
                            if null === genericVar {
                                var_884var_2092;
                            }
                            genericVar = genericVar.type;
                            genericVar = genericVar.pendingProps;
                            genericVar = null !== genericVar ? genericVar.memoizedProps : null;
                            genericVar = genericVar.children;
                            if "textarea" === genericVar || "noscript" === genericVar || "string" == typeof genericVar.children || "number" == typeof genericVar.children || "object" == typeof genericVar.dangerouslySetInnerHTML && null !== genericVar.dangerouslySetInnerHTML && null != genericVar.dangerouslySetInnerHTML.__html {
                                genericVar = null;
                            }
                            else if null !== genericVar && ("textarea" === genericVar || "noscript" === genericVar || "string" == typeof genericVar.children || "number" == typeof genericVar.children || "object" == typeof genericVar.dangerouslySetInnerHTML && null !== genericVar.dangerouslySetInnerHTML && null != genericVar.dangerouslySetInnerHTML.__html) {
                                genericVar.flags |= 32;
                            }
                            var_1475var_2091, genericVar;
                            var_1436var_2091, genericVar, genericVar, genericVar;
                            return genericVar.child;
                            case 6:
                            if null === genericVar {
                                var_884var_2092;
                            }
                            return null;
                            case 13:
                            return var_1525var_2091, genericVar, genericVar;
                            case 4:
                            var_1163var_2092, genericVar.stateNode.containerInfo;
                            genericVar = genericVar.pendingProps;
                            if null === genericVar {
                                genericVar.child = var_1155var_2092, null, genericVar, genericVar;
                            }
                            else {
                                var_1436var_2091, genericVar, genericVar, genericVar;
                            }
                            return genericVar.child;
                            case 11:
                            genericVar = genericVar.type;
                            genericVar = genericVar.pendingProps;
                            return var_1441var_2091, genericVar, genericVar, genericVar = genericVar.elementType === genericVar ? genericVar : genericVar(genericVar, genericVar, genericVar);
                            case 7:
                            var_1436var_2091, genericVar, genericVar.pendingProps, genericVar;
                            return genericVar.child;
                            case 8:
                            case 12:
                            var_1436var_2091, genericVar, genericVar.pendingProps.children, genericVar;
                            return genericVar.child;
                            case 10:
                            genericVar: {
                                genericVar = genericVar.type._context;
                                genericVar = genericVar.pendingProps;
                                genericVar = genericVar.memoizedProps;
                                genericVar = genericVar.value;
                                var_802var_906, genericVar._currentValue;
                                genericVar._currentValue = genericVar;
                                if null !== genericVar {
                                    if genericVar(genericVar.value, genericVar) {
                                        if genericVar.children === genericVar.children && true {
                                            genericVar = var_1448var_2091, genericVar, genericVar;
                                            break genericVar;
                                        }
                                    }
                                    else {
                                        for null !== (genericVar = genericVar.child && genericVar["return"] = genericVar;
                                        null !== genericVar;
                                        ) {
                                            var genericVar = genericVar.dependencies;
                                            if null !== genericVar {
                                                genericVar = genericVar.child;
                                                for var genericVar = genericVar.firstContext;
                                                null !== genericVar;
                                                {
                                                    if genericVar.context === genericVar {
                                                        if 1 === genericVar.tag {
                                                            (genericVar = {
                                                                eventTime: -1,
                                                                lane: genericVar & -genericVar,
                                                                tag: 0,
                                                                payload: null,
                                                                callback: null,
                                                                next: null
                                                            }
                                                            ).tag = 2;
                                                            var genericVar = genericVar.updateQueue;
                                                            if null !== genericVar {
                                                                var genericVar = genericVar = genericVar.shared.pending;
                                                                if null === genericVar {
                                                                    genericVar.next = genericVar;
                                                                }
                                                                else {
                                                                    genericVar.next = genericVar.next;
                                                                    genericVar.next = genericVar;
                                                                }
                                                                genericVar.pending = genericVar;
                                                            }
                                                        }
                                                        genericVar.lanes |= genericVar;
                                                        if null !== (genericVar = genericVar.alternate) {
                                                            genericVar.lanes |= genericVar;
                                                        }
                                                        var_913var_2101["return"], genericVar, genericVar;
                                                        genericVar.lanes |= genericVar;
                                                        break;
                                                    }
                                                    genericVar = genericVar.next;
                                                }
                                            }
                                            else {
                                                if 10 === genericVar.tag {
                                                    genericVar = genericVar.type === genericVar.type ? null : genericVar.child;
                                                }
                                                else {
                                                    if 18 === genericVar.tag {
                                                        if null === (genericVar = genericVar["return"]) {
                                                            throw Errorvar_28(341);
                                                        }
                                                        genericVar.lanes |= genericVar;
                                                        if null !== (genericVar = genericVar.alternate) {
                                                            genericVar.lanes |= genericVar;
                                                        }
                                                        var_913var_2105, genericVar, genericVar;
                                                        genericVar = genericVar.sibling;
                                                    }
                                                    else {
                                                        genericVar = genericVar.child;
                                                    }
                                                }
                                            }
                                            if null !== genericVar {
                                                genericVar["return"] = genericVar;
                                            }
                                            else {
                                                for genericVar = genericVar;
                                                null !== genericVar;
                                                {
                                                    if genericVar === genericVar {
                                                        genericVar = null;
                                                        break;
                                                    }
                                                    if null !== (genericVar = genericVar.sibling) {
                                                        genericVar["return"] = genericVar["return"];
                                                        genericVar = genericVar;
                                                        break;
                                                    }
                                                    genericVar = genericVar["return"];
                                                }
                                            }
                                            genericVar = genericVar;
                                        }
                                    }
                                }
                                var_1436var_2091, genericVar, genericVar.children, genericVar;
                                genericVar = genericVar.child;
                            }
                            return genericVar;
                            case 9:
                            genericVar = genericVar.type;
                            genericVar = genericVar.pendingProps.children;
                            var_918var_2092, genericVar;
                            genericVar = var_2099var_2100 = genericVar(genericVar);
                            genericVar.flags |= 1;
                            var_1436var_2091, genericVar, genericVar, genericVar;
                            return genericVar.child;
                            case 14:
                            genericVar = var_902var_2099 = genericVar.type, genericVar.pendingProps;
                            return var_1449var_2091, genericVar, genericVar, genericVar = genericVar(genericVar.type, genericVar, genericVar);
                            case 15:
                            return var_1457var_2091, genericVar, genericVar.type, genericVar.pendingProps, genericVar;
                            case 17:
                            genericVar = genericVar.type;
                            genericVar = genericVar.pendingProps;
                            genericVar = genericVar.elementType === genericVar ? genericVar : var_902var_2099, genericVar;
                            var_1492var_2091, genericVar;
                            genericVar.tag = 1;
                            if genericVar(genericVar) {
                                genericVar = true;
                                var_829var_2092;
                            }
                            else {
                                genericVar = false;
                            }
                            var_918var_2092, genericVar;
                            var_1025var_2092, genericVar, genericVar;
                            var_1037var_2092, genericVar, genericVar, genericVar;
                            return var_1502null, genericVar, genericVar, true, genericVar, genericVar;
                            case 19:
                            return var_1566var_2091, genericVar, genericVar;
                            case 22:
                            return var_1466var_2091, genericVar, genericVar;
                        }
                        throw Errorvar_28(156, genericVar.tag);
                    }
                    ;
                    var genericVar = "function" == typeof reportError ? reportError : /* DOM Manipulations */
function genericVar {
                        console.errorvar_2112;
                    }
                    ;
                    /* DOM Manipulations */
function renamedFunctionvar_2114 {
                        this._internalRoot = genericVar;
                    }
                    /* DOM Manipulations */
function renamedFunctionvar_2116 {
                        this._internalRoot = genericVar;
                    }
                    /* DOM Manipulations */
function genericVar {
                    }
                    /* DOM Manipulations */
function renamedFunctionvar_2119, genericVar, genericVar, genericVar, genericVar {
                        var genericVar = genericVar._reactRootContainer;
                        if genericVar {
                            var genericVar = genericVar;
                            if "function" == typeof genericVar {
                                var genericVar = genericVar;
                                genericVar = function  {
                                    var genericVar = var_2082var_2125;
                                    genericVar.callvar_2127;
                                }
                                ;
                            }
                            var_2074var_2120, genericVar, genericVar, genericVar;
                        }
                        else {
                            genericVar = function genericVar, genericVar, genericVar, genericVar, genericVar {
                                if genericVar {
                                    if "function" == typeof genericVar {
                                        var genericVar = genericVar;
                                        genericVar = function  {
                                            var genericVar = var_2082var_2135;
                                            genericVar.callvar_2134;
                                        }
                                        ;
                                    }
                                    var genericVar = var_2064var_2129, genericVar, genericVar, 0, null, false, 0, "", genericVar;
                                    genericVar._reactRootContainer = genericVar;
                                    genericVar[genericVar] = genericVar.current;
                                    genericVar === genericVar.nodeType ? genericVar.parentNode : genericVar;
                                    genericVar;
                                    return genericVar;
                                }
                                for ;
                                genericVar = genericVar.lastChild;
                                {
                                    genericVar.removeChildvar_2132;
                                }
                                if "function" == typeof genericVar {
                                    var genericVar = genericVar;
                                    genericVar = function  {
                                        var genericVar = var_2082var_2138;
                                        genericVar.callvar_2137;
                                    }
                                    ;
                                }
                                var genericVar = var_2049var_2128, 0, false, null, 0, false, 0, "", genericVar;
                                genericVar._reactRootContainer = genericVar;
                                genericVar[genericVar] = genericVar.current;
                                genericVar === genericVar.nodeType ? genericVar.parentNode : genericVar;
                                var_1872function ( {
                                    var_2074var_2129, genericVar, genericVar, genericVar;
                                }
                                );
                                return genericVar;
                            }
                            genericVar, genericVar, genericVar, genericVar, genericVar;
                        }
                        return var_2082var_2125;
                    }
                    genericVar.prototype.render = genericVar.prototype.render = function genericVar {
                        var genericVar = this._internalRoot;
                        if null === genericVar {
                            throw Errorvar_28(409);
                        }
                        var_2074var_2139, genericVar, null, null;
                    }
                    ;
                    genericVar.prototype.unmount = genericVar.prototype.unmount = function  {
                        var genericVar = this._internalRoot;
                        if null !== genericVar {
                            this._internalRoot = null;
                            var genericVar = genericVar.containerInfo;
                            var_1872function ( {
                                var_2074null, genericVar, null, null;
                            }
                            );
                            genericVar[genericVar] = null;
                        }
                    }
                    ;
                    genericVar.prototype.unstable_scheduleHydration = function genericVar {
                        if genericVar {
                            var genericVar = genericVar;
                            genericVar = {
                                blockedOn: null,
                                target: genericVar,
                                priority: genericVar
                            }
                            ;
                            for var genericVar = 0;
                            genericVar < genericVar.length && 0 !== genericVar && genericVar < genericVar[genericVar].priority;
                            genericVar++ {
                                ;
                            }
                            genericVar.splicevar_2145, 0, genericVar;
                            if 0 === genericVar {
                                var_403var_2143;
                            }
                        }
                    }
                    ;
                    genericVar = function genericVar {
                        switch genericVar.tag {
                            case 3:
                            var genericVar = genericVar.stateNode;
                            if genericVar.current.memoizedState.isDehydrated {
                                var genericVar = var_344var_2147.pendingLanes;
                                if 0 !== genericVar {
                                    var_370var_2147, 1 | genericVar;
                                    var_1816var_2147, genericVar();
                                    if 0 == (6 & genericVar) {
                                        genericVar = genericVar + 500;
                                        genericVar;
                                    }
                                }
                            }
                            break;
                            case 13:
                            var_1872function ( {
                                var genericVar = var_934var_2146, 1;
                                if null !== genericVar {
                                    var genericVar = genericVar;
                                    var_1005var_2149, genericVar, 1, genericVar;
                                }
                            }
                            );
                            var_2088var_2146, 1;
                        }
                    }
                    ;
                    genericVar = function genericVar {
                        if 13 === genericVar.tag {
                            var genericVar = var_934var_2151, 134217728;
                            if null !== genericVar {
                                var_1005var_2152, genericVar, 134217728, genericVar();
                            }
                            var_2088var_2151, 134217728;
                        }
                    }
                    ;
                    genericVar = function genericVar {
                        if 13 === genericVar.tag {
                            var genericVar = var_1003var_2153;
                            var genericVar = var_934var_2153, genericVar;
                            if null !== genericVar {
                                var_1005var_2155, genericVar, genericVar, genericVar();
                            }
                            var_2088var_2153, genericVar;
                        }
                    }
                    ;
                    genericVar = function  {
                        return genericVar;
                    }
                    ;
                    genericVar = function genericVar, genericVar {
                        var genericVar = genericVar;
                        try {
                            genericVar = genericVar;
                            return genericVar;
                        }
                        finally {
                            genericVar = genericVar;
                        }
                    }
                    ;
                    genericVar = function genericVar, genericVar, genericVar {
                        switch genericVar {
                            case "input":
                            var_172var_2159, genericVar;
                            genericVar = genericVar.name;
                            if "radio" === genericVar.type && null != genericVar {
                                for genericVar = genericVar;
                                genericVar.parentNode;
                                {
                                    genericVar = genericVar.parentNode;
                                }
                                genericVar = genericVar.querySelectorAll"input[name=" + JSON.stringify("" + genericVar + "][type=\"radio\"]");
                                for genericVar = 0;
                                genericVar < genericVar.length;
                                genericVar++ {
                                    var genericVar = genericVar[genericVar];
                                    if genericVar !== genericVar && genericVar.form === genericVar.form {
                                        var genericVar = genericVar[genericVar] || null;
                                        if !genericVar {
                                            throw Errorvar_28(90);
                                        }
                                        var_152var_2162;
                                        var_172var_2162, genericVar;
                                    }
                                }
                            }
                            break;
                            case "textarea":
                            var_200var_2159, genericVar;
                            break;
                            case "select":
                            if null != (genericVar = genericVar.value) {
                                var_187var_2159, !!genericVar.multiple, genericVar, false;
                            }
                        }
                    }
                    ;
                    genericVar = genericVar;
                    genericVar = genericVar;
                    var genericVar = {
                        usingClientEntryPoint: false,
                        Events: [genericVar, genericVar, genericVar, genericVar, genericVar, genericVar]
                    }
                    ;
                    var genericVar = {
                        findFiberByHostInstance: genericVar,
                        bundleType: 0,
                        version: "18.2.0",
                        rendererPackageName: "react-dom"
                    }
                    ;
                    var genericVar = {
                        bundleType: 0,
                        version: "18.2.0",
                        rendererPackageName: "react-dom",
                        rendererConfig: genericVar.rendererConfig,
                        overrideHookState: null,
                        overrideHookStateDeletePath: null,
                        overrideHookStateRenamePath: null,
                        overrideProps: null,
                        overridePropsDeletePath: null,
                        overridePropsRenamePath: null,
                        setErrorHandler: null,
                        setSuspenseHandler: null,
                        scheduleUpdate: null,
                        currentDispatcherRef: genericVar.ReactCurrentDispatcher,
                        findHostInstanceByFiber: function (fiber) {
                            return fiber === null || fiber === undefined ? null : fiber.stateNode;
                        }
                    };
                    
                        ,
                        findFiberByHostInstance: genericVar.findFiberByHostInstance || function () {
                            return null;
                        },
                        {findHostInstancesForRefresh: null,
                        scheduleRefresh: null,
                        scheduleRoot: null,
                        setRefreshHandler: null,
                        getCurrentFiber: null,
                        reconcilerVersion: "18.2.0-next-9e3b772b8-20220608"
                        };
                        
                    if "undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ {
                        if !__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled && __REACT_DEVTOOLS_GLOBAL_HOOK__.supportsFiber {
                            try {
                                genericVar = __REACT_DEVTOOLS_GLOBAL_HOOK__.injectvar_2166;
                                genericVar = __REACT_DEVTOOLS_GLOBAL_HOOK__;
                            }
                            catch genericVar {
                            }
                        }
                    }
                    genericVar.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = genericVar;
                    genericVar.createPortal = function genericVar, genericVar {
                        var genericVar = 2 < arguments.length && undefined !== arguments[2] ? arguments[2] : null;
                        if !!(!genericVar || 1 !== genericVar.nodeType && 9 !== genericVar.nodeType && 11 !== genericVar.nodeType) {
                            throw Errorvar_28(200);
                        }
                        return function genericVar, genericVar, genericVar {
                            var genericVar = 3 < arguments.length && undefined !== arguments[3] ? arguments[3] : null;
                            return {
                                $typeof: genericVar,
                                key: null == genericVar ? null : "" + genericVar,
                                children: genericVar,
                                containerInfo: genericVar,
                                implementation: genericVar
                            }
                            ;
                        }
                        genericVar, genericVar, null, genericVar;
                    }
                    ;
                    genericVar.createRoot = function genericVar, genericVar {
                        if !!(!genericVar || 1 !== genericVar.nodeType && 9 !== genericVar.nodeType && 11 !== genericVar.nodeType) {
                            throw Errorvar_28(299);
                        }
                        var genericVar = false;
                        var genericVar = "";
                        var genericVar = genericVar;
                        if null != genericVar {
                            if true === genericVar.unstable_strictMode {
                                genericVar = true;
                            }
                            if undefined !== genericVar.identifierPrefix {
                                genericVar = genericVar.identifierPrefix;
                            }
                            if undefined !== genericVar.onRecoverableError {
                                genericVar = genericVar.onRecoverableError;
                            }
                        }
                        genericVar = var_2049var_2176, 1, false, null, 0, genericVar, 0, genericVar, genericVar;
                        genericVar[genericVar] = genericVar.current;
                        genericVar === genericVar.nodeType ? genericVar.parentNode : genericVar;
                        return new var_2113var_2177;
                    }
                    ;
                    genericVar.findDOMNode = function genericVar {
                        if null == genericVar {
                            return null;
                        }
                        if 1 === genericVar.nodeType {
                            return genericVar;
                        }
                        var genericVar = genericVar._reactInternals;
                        if undefined === genericVar {
                            if "function" == typeof genericVar.render {
                                throw Errorvar_28(188);
                            }
                            genericVar = Object.keysvar_2181.join",";
                            throw Errorvar_28(268, genericVar);
                        }
                        return genericVar = null === genericVar = genericVar(genericVar) ? null : genericVar.stateNode;
                    }
                    ;
                    genericVar.flushSync = function genericVar {
                        return var_1872var_2183;
                    }
                    ;
                    genericVar.hydrate = function genericVar, genericVar, genericVar {
                        if !!(!genericVar || 1 !== genericVar.nodeType && 9 !== genericVar.nodeType && 11 !== genericVar.nodeType && (8 !== genericVar.nodeType || " react-mount-point-unstable " !== genericVar.nodeValue)) {
                            throw Errorvar_28(200);
                        }
                        return var_2118null, genericVar, genericVar, true, genericVar;
                    }
                    ;
                    genericVar.hydrateRoot = function genericVar, genericVar, genericVar {
                        if !!(!genericVar || 1 !== genericVar.nodeType && 9 !== genericVar.nodeType && 11 !== genericVar.nodeType) {
                            throw Errorvar_28(405);
                        }
                        var genericVar = null != genericVar && genericVar.hydratedSources || null;
                        var genericVar = false;
                        var genericVar = "";
                        var genericVar = genericVar;
                        if null != genericVar {
                            if true === genericVar.unstable_strictMode {
                                genericVar = true;
                            }
                            if undefined !== genericVar.identifierPrefix {
                                genericVar = genericVar.identifierPrefix;
                            }
                            if undefined !== genericVar.onRecoverableError {
                                genericVar = genericVar.onRecoverableError;
                            }
                        }
                        genericVar = var_2064var_2188, null, genericVar, 1, null != genericVar ? genericVar : null, genericVar, 0, genericVar, genericVar;
                        genericVar[genericVar] = genericVar.current;
                        var_696var_2187;
                        if genericVar {
                            for genericVar = 0;
                            genericVar < genericVar.length;
                            genericVar++ {
                                genericVar = genericVar = (genericVar = genericVar[genericVar]._getVersion)genericVar._source;
                                if null == genericVar.mutableSourceEagerHydrationData {
                                    genericVar.mutableSourceEagerHydrationData = [genericVar, genericVar];
                                }
                                else {
                                    genericVar.mutableSourceEagerHydrationData.pushvar_2189, genericVar;
                                }
                            }
                        }
                        return new var_2115var_2188;
                    }
                    ;
                    genericVar.render = function genericVar, genericVar, genericVar {
                        if !!(!genericVar || 1 !== genericVar.nodeType && 9 !== genericVar.nodeType && 11 !== genericVar.nodeType && (8 !== genericVar.nodeType || " react-mount-point-unstable " !== genericVar.nodeValue)) {
                            throw Errorvar_28(200);
                        }
                        return var_2118null, genericVar, genericVar, false, genericVar;
                    }
                    ;
                    genericVar.unmountComponentAtNode = function genericVar {
                        if !!(!genericVar || 1 !== genericVar.nodeType && 9 !== genericVar.nodeType && 11 !== genericVar.nodeType && (8 !== genericVar.nodeType || " react-mount-point-unstable " !== genericVar.nodeValue)) {
                            throw Errorvar_28(40);
                        }
                        return !!genericVar._reactRootContainer && genericVar(function ( {
                            var_2118null, null, genericVar, false, function ( {
                                genericVar._reactRootContainer = null;
                                genericVar[genericVar] = null;
                            }
                            );
                        }
                        ), true);
                    }
                    ;
                    genericVar.unstable_batchedUpdates = genericVar;
                    genericVar.unstable_renderSubtreeIntoContainer = function genericVar, genericVar, genericVar, genericVar {
                        if !!(!genericVar || 1 !== genericVar.nodeType && 9 !== genericVar.nodeType && 11 !== genericVar.nodeType && (8 !== genericVar.nodeType || " react-mount-point-unstable " !== genericVar.nodeValue)) {
                            throw Errorvar_28(200);
                        }
                        if null == genericVar || undefined === genericVar._reactInternals {
                            throw Errorvar_28(38);
                        }
                        return var_2118var_2198, genericVar, genericVar, false, genericVar;
                    }
                    ;
                    {genericVar.version = "18.2.0-next-9e3b772b8-20220608";
                }
                ,
                935: genericVar, genericVar, function genericVar {
                    "use strict";
                    !function genericVar {
                        if "undefined" != typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" == typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE {
                            try {
                                __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCEvar_2205;
                            }
                            catch genericVar {
                                console.errorvar_2206;
                            }
                        }
                    }
                    ;
                    genericVar.exports = genericVar;
                }
                ,
                251: genericVar, genericVar, function genericVar {
                    "use strict";
                    var genericVar = genericVar;
                    var genericVar = Symbol["for"]"react.element";
                    var genericVar = Symbol["for"]"react.fragment";
                    var genericVar = Object.prototype.hasOwnProperty;
                    var genericVar = genericVar.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;
                    var genericVar = {
                        key: true,
                        ref: true,
                        __self: true,
                        __source: true
                    }
                    ;
                    function renamedFunctionvar_2217, genericVar, genericVar {
                        var genericVar;
                        var genericVar = {
                        }
                        ;
                        var genericVar = null;
                        var genericVar = null;
                        if undefined !== genericVar {
                            genericVar = "" + genericVar;
                        }
                        if undefined !== genericVar.key {
                            genericVar = "" + genericVar.key;
                        }
                        if undefined !== genericVar.ref {
                            genericVar = genericVar.ref;
                        }
                        for genericVar in genericVar if genericVar.call(genericVar, genericVar && !genericVar.hasOwnPropertyvar_2220) {
                            genericVar[genericVar] = genericVar[genericVar];
                        }
                        if genericVar && genericVar.defaultProps {
                            for genericVar in genericVar = genericVar.defaultProps if undefined === genericVar[genericVar] {
                                genericVar[genericVar] = genericVar[genericVar];
                            }
                        }
                        return {
                            $typeof: genericVar,
                            type: genericVar,
                            key: genericVar,
                            ref: genericVar,
                            props: genericVar,
                            _owner: genericVar.current
                        }
                        ;
                    }
                    genericVar.Fragment = genericVar;
                    genericVar.jsx = genericVar;
                    genericVar.jsxs = genericVar;
                }
                ,
                408: genericVar, function genericVar {
                    "use strict";
                    var genericVar = Symbol["for"]"react.element";
                    var genericVar = Symbol["for"]"react.portal";
                    var genericVar = Symbol["for"]"react.fragment";
                    var genericVar = Symbol["for"]"react.strict_mode";
                    var genericVar = Symbol["for"]"react.profiler";
                    var genericVar = Symbol["for"]"react.provider";
                    var genericVar = Symbol["for"]"react.context";
                    var genericVar = Symbol["for"]"react.forward_ref";
                    var genericVar = Symbol["for"]"react.suspense";
                    var genericVar = Symbol["for"]"react.memo";
                    var genericVar = Symbol["for"]"react.lazy";
                    var genericVar = Symbol.iterator;
                    var genericVar = {
                        isMounted: function  {
                            return false;
                        }
                        ,
                        enqueueForceUpdate: function  {
                        }
                        ,
                        enqueueReplaceState: function  {
                        }
                        ,
                        enqueueSetState: function  {
                        }
                    }
                    ;
                    var genericVar = Object.assign;
                    var genericVar = {
                    }
                    ;
                    function renamedFunctionvar_2242, genericVar, genericVar {
                        this.props = genericVar;
                        this.context = genericVar;
                        this.refs = genericVar;
                        this.updater = genericVar || genericVar;
                    }
                    function genericVar {
                    }
                    function renamedFunctionvar_2247, genericVar, genericVar {
                        this.props = genericVar;
                        this.context = genericVar;
                        this.refs = genericVar;
                        this.updater = genericVar || genericVar;
                    }
                    genericVar.prototype.isReactComponent = {
                    }
                    ;
                    genericVar.prototype.setState = function genericVar, genericVar {
                        if "object" != typeof genericVar && "function" != typeof genericVar && null != genericVar {
                            throw Error"setState(...: takes an object of state variables to update or a function which returns an object of state variables.");
                        }
                        this.updater.enqueueSetStatethis, genericVar, genericVar, "setState";
                    }
                    ;
                    genericVar.prototype.forceUpdate = function genericVar {
                        this.updater.enqueueForceUpdatethis, genericVar, "forceUpdate";
                    }
                    ;
                    genericVar.prototype = genericVar.prototype;
                    var genericVar = genericVar.prototype = new genericVar;
                    genericVar.constructor = genericVar;
                    var_2239var_2253, genericVar.prototype;
                    genericVar.isPureReactComponent = true;
                    var genericVar = Array.isArray;
                    var genericVar = Object.prototype.hasOwnProperty;
                    var genericVar = {
                        current: null
                    }
                    ;
                    var genericVar = {
                        key: true,
                        ref: true,
                        __self: true,
                        __source: true
                    }
                    ;
                    function renamedFunctionvar_2259, genericVar, genericVar {
                        var genericVar;
                        var genericVar = {
                        }
                        ;
                        var genericVar = null;
                        var genericVar = null;
                        if null != genericVar {
                            if undefined !== genericVar.ref {
                                genericVar = genericVar.ref;
                            }
                            if undefined !== genericVar.key {
                                genericVar = "" + genericVar.key;
                            }
                            for genericVar in genericVar if genericVar.call(genericVar, genericVar && !genericVar.hasOwnPropertyvar_2262) {
                                genericVar[genericVar] = genericVar[genericVar];
                            }
                        }
                        var genericVar = arguments.length - 2;
                        if 1 === genericVar {
                            genericVar.children = genericVar;
                        }
                        else {
                            if 1 < genericVar {
                                var genericVar = Arrayvar_2266;
                                for var genericVar = 0;
                                genericVar < genericVar;
                                genericVar++ {
                                    genericVar[genericVar] = arguments[genericVar + 2];
                                }
                                genericVar.children = genericVar;
                            }
                        }
                        if genericVar && genericVar.defaultProps {
                            for genericVar in genericVar = genericVar.defaultProps if undefined === genericVar[genericVar] {
                                genericVar[genericVar] = genericVar[genericVar];
                            }
                        }
                        return {
                            $typeof: genericVar,
                            type: genericVar,
                            key: genericVar,
                            ref: genericVar,
                            props: genericVar,
                            _owner: null
                        }
                        ;
                    }
                    function renamedFunctionvar_2270 {
                        return "object" == typeof genericVar && null !== genericVar && genericVar.$typeof === genericVar;
                    }
                    var genericVar = /\/+/g;
                    function renamedFunctionvar_2273, genericVar {
                        return "object" == typeof genericVar && null !== genericVar && null != genericVar.key ? function genericVar {
                            var genericVar = {
                                "=": "=0",
                                ":": "=2"
                            }
                            ;
                            return "$" + genericVar.replace/[=:]/g, function (genericVar {
                                return genericVar[genericVar];
                            }
                            );
                        }
                        "" + genericVar.key : genericVar.toString36;
                    }
                    function renamedFunctionvar_2279, genericVar, genericVar, genericVar, genericVar {
                        var genericVar = typeof genericVar;
                        if !("undefined" !== genericVar && "boolean" !== genericVar) {
                            genericVar = null;
                        }
                        var genericVar = false;
                        if null === genericVar {
                            genericVar = true;
                        }
                        else {
                            switch genericVar {
                                case "string":
                                case "number":
                                genericVar = true;
                                break;
                                case "object":
                                switch genericVar.$typeof {
                                    case genericVar:
                                    case genericVar:
                                    genericVar = true;
                                }
                            }
                        }
                        if genericVar {
                            genericVar = var_2283var_2285 = genericVar;
                            genericVar = "" === genericVar ? "." + var_2272var_2285, 0 : genericVar;
                            if genericVar(genericVar) {
                                genericVar = "";
                                if null != genericVar {
                                    genericVar = genericVar.replacevar_2271, "SIX_TOMOE_SCRIPT_PLACEHOLDER/" + "/";
                                }
                                var_2278var_2283, genericVar, genericVar, "", function (genericVar {
                                    return genericVar;
                                }
                                );
                            }
                            else if null != genericVar {
                                if "object" == typeof genericVar && null !== genericVar && genericVar.$typeof === genericVar {
                                    genericVar = function genericVar, genericVar {
                                        return {
                                            $typeof: genericVar,
                                            type: genericVar.type,
                                            key: genericVar,
                                            ref: genericVar.ref,
                                            props: genericVar.props,
                                            _owner: genericVar._owner
                                        }
                                        ;
                                    }
                                    genericVar, genericVar + (!genericVar.key || genericVar && genericVar.key === genericVar.key ? "" : ("" + genericVar.key.replacevar_2271, "SIX_TOMOE_SCRIPT_PLACEHOLDER/" + "/") + genericVar);
                                }
                                genericVar.pushvar_2283;
                            }
                            return 1;
                        }
                        genericVar = 0;
                        genericVar = genericVar === "" ? "." : genericVar + ":";
                        
                        if (Array.isArray(genericVar)) {
                            for (let i = 0; i < genericVar.length; i++) {
                                let item = genericVar[i];
                                genericVar += `${item}`;
                            }
                        } else {
                            genericVar = function (input) {
                                if (input === null || typeof input !== "object") {
                                    return null;
                                }
                                return typeof input[Symbol.iterator] === "function" ? input : null;
                            }(genericVar);
                        
                            if (typeof genericVar === "function") {
                                let iterator = genericVar.call(genericVar);
                                let i = 0;
                        
                                while (!(result = iterator.next()).done) {
                                    let value = result.value;
                                    genericVar += `${value}`;
                                }
                            } else if (typeof genericVar === "object") {
                                let objectString = String(genericVar);
                                throw new Error(
                                    `Objects are not valid as a React child (found: ${
                                        objectString === "[object Object]"
                                            ? `object with keys {${Object.keys(genericVar).join(", ")}}`
                                            : objectString
                                    }). If you meant to render a collection of children, use an array instead.`
                                );
                            }
                        }
                        
                        return genericVar;
                        
                        function renamedFunctionvar_2293(genericVar, genericVar2) {
                            if (genericVar == null) {
                                return genericVar;
                            }
                            let genericArray = [];
                            let genericCounter = 0;
                        
                            genericArray = genericVar.map((item) => {
                                return genericVar2.call(null, item, genericCounter++);
                            });
                        
                            return genericArray;
                        }
                        
                        function renamedFunctionvar_2300() {
                            if (genericVar._status === -1) {
                                const genericResult = genericVar._result;
                        
                                const promise = genericResult()
                                    .then((result) => {
                                        if (genericVar._status === 0 || genericVar._status === -1) {
                                            genericVar._status = 1;
                                            genericVar._result = result;
                                        }
                                    })
                                    .catch((error) => {
                                        if (genericVar._status === 0 || genericVar._status === -1) {
                                            genericVar._status = 2;
                                            genericVar._result = error;
                                        }
                                    });
                        
                                if (genericVar._status === -1) {
                                    genericVar._status = 0;
                                    genericVar._result = promise;
                                }
                            }
                        
                            if (genericVar._status === 1) {
                                return genericVar._result["default"];
                            }
                        
                            throw genericVar._result;
                        }
                        
                        const genericVar1 = {
                            current: null,
                        };
                        
                        const genericVar2 = {
                            transition: null,
                        };
                        
                        const genericVars = {
                            ReactCurrentDispatcher: genericVar1,
                            ReactCurrentBatchConfig: genericVar2,
                            ReactCurrentOwner: genericVar1,
                        };
                        
                    genericVar.Children = {
                        map: genericVar,
                        forEach: function genericVar, genericVar, genericVar {
                            var_2292var_2307, function ( {
                                genericVar.applythis, arguments;
                            }
                            , genericVar);
                        }
                        ,
                        count: function genericVar {
                            var genericVar = 0;
                            var_2292var_2310, function ( {
                                genericVar++;
                            }
                            );
                            return genericVar;
                        }
                        ,
                        toArray: function genericVar {
                            return var_2292var_2312, function (genericVar {
                                return genericVar;
                            }
                            ) || [];
                        }
                        ,
                        only: function genericVar {
                            if !("object" == typeof genericVar && null !== genericVar && genericVar.$typeof === genericVar) {
                                throw Error"React.Children.only expected to receive a single React element child.";
                            }
                            return genericVar;
                        }
                    }
                    ;
                    genericVar.Component = genericVar;
                    genericVar.Fragment = genericVar;
                    genericVar.Profiler = genericVar;
                    genericVar.PureComponent = genericVar;
                    genericVar.StrictMode = genericVar;
                    genericVar.Suspense = genericVar;
                    genericVar.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = genericVar;
                    genericVar.cloneElement = function genericVar, genericVar, genericVar {
                        if null == genericVar {
                            throw Error"React.cloneElement(...: The argument must be a React element, but you passed " + genericVar + ".");
                        }
                        var genericVar = genericVar{
                        }
                        , genericVar.props;
                        var genericVar = genericVar.key;
                        var genericVar = genericVar.ref;
                        var genericVar = genericVar._owner;
                        if null != genericVar {
                            if undefined !== genericVar.ref {
                                genericVar = genericVar.ref;
                                genericVar = null;
                            }
                            if undefined !== genericVar.key {
                                genericVar = "" + genericVar.key;
                            }
                            if genericVar.type && genericVar.type.defaultProps {
                                var genericVar = genericVar.type.defaultProps;
                            }
                            for genericVar in genericVar if genericVar.call(genericVar, genericVar && !genericVar.hasOwnPropertyvar_2323) {
                                genericVar[genericVar] = undefined === genericVar[genericVar] && undefined !== genericVar ? genericVar[genericVar] : genericVar[genericVar];
                            }
                        }
                        var genericVar = arguments.length - 2;
                        if 1 === genericVar {
                            genericVar.children = genericVar;
                        }
                        else {
                            if 1 < genericVar {
                                genericVar = Arrayvar_2323;
                                for var genericVar = 0;
                                genericVar < genericVar;
                                genericVar++ {
                                    genericVar[genericVar] = arguments[genericVar + 2];
                                }
                                genericVar.children = genericVar;
                            }
                        }
                        return {
                            $typeof: genericVar,
                            type: genericVar.type,
                            key: genericVar,
                            ref: genericVar,
                            props: genericVar,
                            _owner: genericVar
                        }
                        ;
                    }
                    ;
                    genericVar.createContext = function genericVar {
                        (genericVar = {
                            $typeof: genericVar,
                            _currentValue: genericVar,
                            _currentValue2: genericVar,
                            _threadCount: 0,
                            Provider: null,
                            Consumer: null,
                            _defaultValue: null,
                            _globalName: null
                        }
                        ).Provider = {
                            $typeof: genericVar,
                            _context: genericVar
                        }
                        ;
                        return genericVar.Consumer = genericVar;
                    }
                    ;
                    genericVar.createElement = genericVar;
                    genericVar.createFactory = function genericVar {
                        var genericVar = genericVar.bindnull, genericVar;
                        genericVar.type = genericVar;
                        return genericVar;
                    }
                    ;
                    genericVar.createRef = function  {
                        return {
                            current: null
                        }
                        ;
                    }
                    ;
                    genericVar.forwardRef = function genericVar {
                        return {
                            $typeof: genericVar,
                            render: genericVar
                        }
                        ;
                    }
                    ;
                    genericVar.isValidElement = genericVar;
                    genericVar.lazy = function genericVar {
                        return {
                            $typeof: genericVar,
                            _payload: {
                                _status: -1,
                                _result: genericVar
                            }
                            ,
                            _init: genericVar
                        }
                        ;
                    }
                    ;
                    genericVar.memo = function genericVar, genericVar {
                        return {
                            $typeof: genericVar,
                            type: genericVar,
                            compare: undefined === genericVar ? null : genericVar
                        }
                        ;
                    }
                    ;
                    genericVar.startTransition = function genericVar {
                        genericVar.transition = {
                        }
                        ;
                        try {
                            genericVar;
                        }
                        finally {
                            genericVar.transition = null;
                        }
                    }
                    ;
                    genericVar.unstable_act = function () {
                        throw new Error("act(... is not supported in production builds of React.");
                    };
                    
                    genericVar.useCallback = function genericVar, genericVar {
                        return null.useCallbackvar_2333, genericVar;
                    }
                    ;
                    genericVar.useContext = function genericVar {
                        return null.useContextvar_2335;
                    }
                    ;
                    genericVar.useDebugValue = function  {
                    }
                    ;
                    genericVar.useDeferredValue = function genericVar {
                        return null.useDeferredValuevar_2336;
                    }
                    ;
                    genericVar.useEffect = function genericVar, genericVar {
                        return null.useEffectvar_2337, genericVar;
                    }
                    ;
                    genericVar.useId = function  {
                        return null.useId;
                    }
                    ;
                    genericVar.useImperativeHandle = function genericVar, genericVar, genericVar {
                        return null.useImperativeHandlevar_2339, genericVar, genericVar;
                    }
                    ;
                    genericVar.useInsertionEffect = function genericVar, genericVar {
                        return null.useInsertionEffectvar_2342, genericVar;
                    }
                    ;
                    genericVar.useLayoutEffect = function genericVar, genericVar {
                        return null.useLayoutEffectvar_2344, genericVar;
                    }
                    ;
                    genericVar.useMemo = function genericVar, genericVar {
                        return null.useMemovar_2346, genericVar;
                    }
                    ;
                    genericVar.useReducer = function genericVar, genericVar, genericVar {
                        return null.useReducervar_2348, genericVar, genericVar;
                    }
                    ;
                    genericVar.useRef = function genericVar {
                        return null.useRefvar_2351;
                    }
                    ;
                    genericVar.useState = function genericVar {
                        return null.useStatevar_2352;
                    }
                    ;
                    genericVar.useSyncExternalStore = function genericVar, genericVar, genericVar {
                        return null.useSyncExternalStorevar_2353, genericVar, genericVar;
                    }
                    ;
                    genericVar.useTransition = function  {
                        return null.useTransition;
                    }
                    ;
                    genericVar.version = "18.2.0";
                }
                ,
                294: genericVar, genericVar, function genericVar {
                    "use strict";
                    genericVar.exports = genericVar;
                }
                ,
                893: genericVar, genericVar, function genericVar {
                    "use strict";
                    genericVar.exports = genericVar;
                }
                ,
                53: genericVar, function genericVar {
                    "use strict";
                    function renamedFunctionvar_2365, genericVar {
                        var genericVar = genericVar.length;
                        genericVar.pushvar_2366;
                        genericVar: for ;
                        0 < genericVar;
                        {
                            var genericVar = genericVar - 1 >>> 1;
                            var genericVar = genericVar[genericVar];
                            if !(0 < genericVar(genericVar, genericVar)) {
                                break genericVar;
                            }
                            genericVar[genericVar] = genericVar;
                            genericVar[genericVar] = genericVar;
                            genericVar = genericVar;
                        }
                    }
                    function renamedFunctionvar_2373 {
                        if 0 === genericVar.length {
                            return null;
                        }
                        var genericVar = genericVar[0];
                        var genericVar = genericVar.pop;
                        if genericVar !== genericVar {
                            genericVar[0] = genericVar;
                            var genericVar = 0;
                            var genericVar = genericVar.length;
                            genericVar: for var genericVar = genericVar >>> 1;
                            genericVar < genericVar;
                            {
                                var genericVar = 2 * genericVar + 1 - 1;
                                var genericVar = genericVar[genericVar];
                                var genericVar = genericVar + 1;
                                var genericVar = genericVar[genericVar];
                                if 0 > genericVar(genericVar, genericVar) {
                                    if genericVar < genericVar && 0 > genericVar(genericVar, genericVar) {
                                        genericVar[genericVar] = genericVar;
                                        genericVar[genericVar] = genericVar;
                                        genericVar = genericVar;
                                    }
                                    else {
                                        genericVar[genericVar] = genericVar;
                                        genericVar[genericVar] = genericVar;
                                        genericVar = genericVar;
                                    }
                                }
                                else {
                                    if !(genericVar < genericVar && 0 > genericVar(genericVar, genericVar)) {
                                        break genericVar;
                                    }
                                    genericVar[genericVar] = genericVar;
                                    genericVar[genericVar] = genericVar;
                                    genericVar = genericVar;
                                }
                            }
                        }
                        return genericVar;
                    }
                    function renamedFunctionvar_2384, genericVar {
                        var genericVar = genericVar.sortIndex - genericVar.sortIndex;
                        return 0 !== genericVar ? genericVar : genericVar.id - genericVar.id;
                    }
                    if "object" == typeof performance && "function" == typeof performance.now {
                        genericVar.unstable_now = function  {
                            return performance.now;
                        }
                        ;
                    }
                    else {
                        var genericVar = Date.now;
                        genericVar.unstable_now = function  {
                            return Date.now - genericVar;
                        }
                        ;
                    }
                    var genericVar = [];
                    var genericVar = [];
                    var genericVar = 1;
                    var genericVar = null;
                    var genericVar = 3;
                    var genericVar = false;
                    var genericVar = false;
                    var genericVar = false;
                    var genericVar = "function" == typeof setTimeout ? setTimeout : null;
                    var genericVar = "function" == typeof clearTimeout ? clearTimeout : null;
                    var genericVar = "undefined" != typeof setImmediate ? setImmediate : null;
                    function renamedFunctionvar_2400 {
                        for var genericVar = 0 === genericVar.length ? null : genericVar[0];
                        null !== genericVar;
                        {
                            if null === genericVar.callback {
                                var_2372var_2389;
                            }
                            else {
                                if !(genericVar.startTime <= genericVar) {
                                    break;
                                }
                                var_2372var_2389;
                                genericVar.sortIndex = genericVar.expirationTime;
                                var_2364var_2388, genericVar;
                            }
                            genericVar = 0 === genericVar.length ? null : genericVar[0];
                        }
                    }
                    function renamedFunctionvar_2403 {
                        genericVar = false;
                        var_2399var_2403;
                        if !genericVar {
                            if null !== (0 === genericVar.length ? null : genericVar[0]) {
                                genericVar = true;
                                var_2404var_2405;
                            }
                            else {
                                var genericVar = 0 === genericVar.length ? null : genericVar[0];
                                if null !== genericVar {
                                    var_2407var_2402, genericVar.startTime - genericVar;
                                }
                            }
                        }
                    }
                    function renamedFunctionvar_2408, genericVar {
                        genericVar = false;
                        if genericVar {
                            genericVar = false;
                            var_2397var_2410;
                            genericVar = -1;
                        }
                        genericVar = true;
                        var genericVar = genericVar;
                        try {
                            var_2399var_2409;
                            for genericVar = 0 === genericVar.length ? null : genericVar[0];
                            null !== genericVar && (!(genericVar.expirationTime > genericVar || genericVar && !!genericVar.unstable_now( - genericVar < genericVar));
                            ) {
                                var genericVar = genericVar.callback;
                                if "function" == typeof genericVar {
                                    genericVar.callback = null;
                                    genericVar = genericVar.priorityLevel;
                                    var genericVar = var_2414var_2391.expirationTime <= genericVar;
                                    genericVar = genericVar.unstable_now;
                                    if "function" == typeof genericVar {
                                        genericVar.callback = genericVar;
                                    }
                                    else if genericVar === (0 === genericVar.length ? null : genericVar[0]) {
                                        var_2372var_2388;
                                    }
                                    var_2399var_2409;
                                }
                                else {
                                    var_2372var_2388;
                                }
                                genericVar = 0 === genericVar.length ? null : genericVar[0];
                            }
                            if null !== genericVar {
                                var genericVar = true;
                            }
                            else {
                                var genericVar = 0 === genericVar.length ? null : genericVar[0];
                                if null !== genericVar {
                                    var_2407var_2402, genericVar.startTime - genericVar;
                                }
                                genericVar = false;
                            }
                            return genericVar;
                        }
                        finally {
                            genericVar = null;
                            genericVar = genericVar;
                            genericVar = false;
                        }
                    }
                    if "undefined" != typeof navigator && undefined !== navigator.scheduling && undefined !== navigator.scheduling.isInputPending {
                        navigator.scheduling.isInputPending.bindnavigator.scheduling;
                    }
                    var genericVar;
                    var genericVar = false;
                    var genericVar = null;
                    var genericVar = -1;
                    var genericVar = 5;
                    var genericVar = -1;
                    function genericVar {
                        return !genericVar.unstable_now( - genericVar < genericVar);
                    }
                    function genericVar {
                        if null !== genericVar {
                            var genericVar = genericVar.unstable_now;
                            genericVar = genericVar;
                            var genericVar = true;
                            try {
                                genericVar = var_2420true, genericVar;
                            }
                            finally {
                                if genericVar {
                                    genericVar;
                                }
                                else {
                                    genericVar = false;
                                    genericVar = null;
                                }
                            }
                        }
                        else {
                            genericVar = false;
                        }
                    }
                    if "function" == typeof genericVar {
                        genericVar = function  {
                            var_2398var_2422;
                        }
                        ;
                    }
                    else {
                        if "undefined" != typeof MessageChannel {
                            var genericVar = new MessageChannel;
                            var genericVar = genericVar.port2;
                            genericVar.port1.onmessage = genericVar;
                            genericVar = function  {
                                genericVar.postMessagenull;
                            }
                            ;
                        }
                        else {
                            genericVar = function  {
                                var_2396var_2422, 0;
                            }
                            ;
                        }
                    }
                    function renamedFunctionvar_2427 {
                        genericVar = genericVar;
                        if !genericVar {
                            genericVar = true;
                            genericVar;
                        }
                    }
                    function renamedFunctionvar_2428, genericVar {
                        genericVar = var_2396function ( {
                            var_2428var_2363.unstable_now();
                        }
                        , genericVar);
                    }
                    genericVar.unstable_IdlePriority = 5;
                    genericVar.unstable_ImmediatePriority = 1;
                    genericVar.unstable_LowPriority = 4;
                    genericVar.unstable_NormalPriority = 3;
                    genericVar.unstable_Profiling = null;
                    genericVar.unstable_UserBlockingPriority = 2;
                    genericVar.unstable_cancelCallback = function genericVar {
                        genericVar.callback = null;
                    }
                    ;
                    genericVar.unstable_continueExecution = function  {
                        if !(genericVar || genericVar) {
                            genericVar = true;
                            var_2404var_2405;
                        }
                    }
                    ;
                    genericVar.unstable_forceFrameRate = function genericVar {
                        if 0 > genericVar || 125 < genericVar {
                            console.error"forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported";
                        }
                        else {
                            genericVar = 0 < genericVar ? Math.floor1000/ genericVar : 5;
                        }
                    }
                    ;
                    genericVar.unstable_getCurrentPriorityLevel = function  {
                        return genericVar;
                    }
                    ;
                    genericVar.unstable_getFirstCallbackNode = function  {
                        return 0 === genericVar.length ? null : genericVar[0];
                    }
                    ;
                    genericVar.unstable_next = function genericVar {
                        switch genericVar {
                            case 1:
                            case 2:
                            case 3:
                            var genericVar = 3;
                            break;
                            default:
                            genericVar = genericVar;
                        }
                        var genericVar = genericVar;
                        genericVar = genericVar;
                        try {
                            return genericVar;
                        }
                        finally {
                            genericVar = genericVar;
                        }
                    }
                    ;
                    genericVar.unstable_pauseExecution = function  {
                    }
                    ;
                    genericVar.unstable_requestPaint = function  {
                    }
                    ;
                    genericVar.unstable_runWithPriority = function genericVar, genericVar {
                        switch genericVar {
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            break;
                            default:
                            genericVar = 3;
                        }
                        var genericVar = genericVar;
                        genericVar = genericVar;
                        try {
                            return genericVar;
                        }
                        finally {
                            genericVar = genericVar;
                        }
                    }
                    ;
                    genericVar.unstable_scheduleCallback = function genericVar, genericVar, genericVar {
                        var genericVar = genericVar.unstable_now;
                        if "object" == typeof genericVar && null !== genericVar {
                            genericVar = "number" == typeof genericVar = genericVar.delay && 0 < genericVar ? genericVar + genericVar : genericVar;
                        }
                        else {
                            genericVar = genericVar;
                        }
                        switch genericVar {
                            case 1:
                            var genericVar = -1;
                            break;
                            case 2:
                            genericVar = 250;
                            break;
                            case 5:
                            genericVar = 1073741823;
                            break;
                            case 4:
                            genericVar = 10000;
                            break;
                            default:
                            genericVar = 5000;
                        }
                        genericVar = {
                            id: genericVar++,
                            callback: genericVar,
                            priorityLevel: genericVar,
                            startTime: genericVar,
                            expirationTime: genericVar = genericVar + genericVar,
                            sortIndex: -1
                        }
                        ;
                        if genericVar > genericVar {
                            genericVar.sortIndex = genericVar;
                            var_2364var_2389, genericVar;
                            if null === (0 === genericVar.length ? null : genericVar[0] && genericVar === 0 === genericVar.length ? null : genericVar[0]) {
                                if genericVar {
                                    var_2397var_2410;
                                    genericVar = -1;
                                }
                                else {
                                    genericVar = true;
                                }
                                var_2407var_2402, genericVar - genericVar;
                            }
                        }
                        else {
                            genericVar.sortIndex = genericVar;
                            var_2364var_2388, genericVar;
                            if !(genericVar || genericVar) {
                                genericVar = true;
                                var_2404var_2405;
                            }
                        }
                        return genericVar;
                    }
                    ;
                    genericVar.unstable_shouldYield = genericVar;
                    genericVar.unstable_wrapCallback = function genericVar {
                        var genericVar = genericVar;
                        return function  {
                            var genericVar = genericVar;
                            genericVar = genericVar;
                            try {
                                return genericVar.applythis, arguments;
                            }
                            finally {
                                genericVar = genericVar;
                            }
                        }
                        ;
                    }
                    ;
                }
                ,
                840: genericVar, genericVar, function genericVar {
                    "use strict";
                    genericVar.exports = genericVar;
                }
                ,
                379: function genericVar {
                    "use strict";
                    var genericVar = [];
                    function renamedFunctionvar_2452 {
                        var genericVar = -1;
                        for var genericVar = 0;
                        genericVar < genericVar.length;
                        genericVar++ {
                            if genericVar[genericVar].identifier === genericVar {
                                genericVar = genericVar;
                                break;
                            }
                        }
                        return genericVar;
                    }
                    function renamedFunctionvar_2456, genericVar {
                        var genericVar = {
                        }
                        ;
                        var genericVar = [];
                        for (var i = 0; i < genericVar.length; i++) {
                            var currentVar = genericVar[i];
                            var baseVar = currentVar.base ? currentVar[0] + currentVar.base : currentVar[0];
                            var countVar = genericVar[baseVar] || 0;
                            var cssVar = "." + baseVar + " " + genericVar[i];
                            genericVar[baseVar] = countVar + 1;
                        
                            var processedVar = {
                                css: currentVar[1],
                                media: currentVar[2],
                                sourceMap: currentVar[3],
                                supports: currentVar[4],
                                layer: currentVar[5]
                            };
                        }
                        
                            if -1 !== genericVar {
                                genericVar[genericVar].references++;
                                genericVar[genericVar].updatervar_2466;
                            }
                            else {
                                var genericVar = var_2468var_2466, genericVar;
                                genericVar.byIndex = genericVar;
                                genericVar.splice(genericVar, 0, {
                                    identifier: genericVar,
                                    updater: genericVar,
                                    references: 1
                                }
                                );
                            }
                            genericVar.pushvar_2464;
                        }
                        return genericVar;
                    }
                    function renamedFunctionvar_2469, genericVar {
                        var genericVar = genericVar.domAPIvar_2470;
                        genericVar.updatevar_2469;
                        return function genericVar {
                            if genericVar {
                                if genericVar.css === genericVar.css && genericVar.media === genericVar.media && genericVar.sourceMap === genericVar.sourceMap && genericVar.supports === genericVar.supports && genericVar.layer === genericVar.layer {
                                    return;
                                }
                                genericVar.updatevar_2469 = genericVar;
                            }
                            else {
                                genericVar.remove;
                            }
                        }
                        ;
                    }
                    genericVar./* Export Functions */
exports = function genericVar, genericVar {
                        var genericVar = var_2455var_2473 = genericVar || [], genericVar = genericVar || {
                        }
                        ;
                        return function genericVar {
                            genericVar = genericVar || [];
                            for var genericVar = 0;
                            genericVar < genericVar.length;
                            genericVar++ {
                                var genericVar = var_2451var_2475[genericVar];
                                genericVar[genericVar].references--;
                            }
                            var genericVar = var_2455var_2476, genericVar;
                            for var genericVar = 0;
                            genericVar < genericVar.length;
                            genericVar++ {
                                var genericVar = var_2451var_2475[genericVar];
                                if 0 === genericVar[genericVar].references {
                                    genericVar[genericVar].updater;
                                    genericVar.splicevar_2481, 1;
                                }
                            }
                            genericVar = genericVar;
                        }
                        ;
                    }
                    ;
                }
                ,
                569: function genericVar {
                    "use strict";
                    var genericVar = {
                    }
                    ;
                    genericVar./* Export Functions */
exports = function genericVar, genericVar {
                        var genericVar = function genericVar {
                            if undefined === genericVar[genericVar] {
                                var genericVar = document.querySelectorvar_2487;
                                if window.HTMLIFrameElement && genericVar instanceof window.HTMLIFrameElement {
                                    try {
                                        genericVar = genericVar.contentDocument.head;
                                    }
                                    catch genericVar {
                                        genericVar = null;
                                    }
                                }
                                genericVar[genericVar] = genericVar;
                            }
                            return genericVar[genericVar];
                        }
                        genericVar;
                        if !genericVar {
                            throw new Error"Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.";
                        }
                        genericVar.appendChildvar_2485;
                    }
                    ;
                }
                ,
                216: function genericVar {
                    "use strict";
                    genericVar./* Export Functions */
exports = function genericVar {
                        var genericVar = document.createElement"style";
                        genericVar.setAttributesvar_2492, genericVar.attributes;
                        genericVar.insertvar_2492, genericVar.options;
                        return genericVar;
                    }
                    ;
                }
                ,
                565: genericVar, genericVar, function genericVar {
                    "use strict";
                    genericVar./* Export Functions */
exports = function genericVar {
                        var genericVar = genericVar.nc;
                        if genericVar {
                            genericVar.setAttribute"nonce", genericVar;
                        }
                    }
                    ;
                }
                ,
                795: function genericVar {
                    "use strict";
                    genericVar./* Export Functions */
exports = function genericVar {
                        if "undefined" == typeof document {
                            return {
                                update: function  {
                                }
                                ,
                                remove: function  {
                                }
                            }
                            ;
                        }
                        var genericVar = genericVar.insertStyleElementvar_2499;
                        return {
                            update: function (genericVar) {
                                (function (genericVar, genericVar, genericVar) {
                                    var content = "";
                                    if (genericVar.supports) {
                                        content += "@supports " + genericVar.supports + " {\n";
                                    }
                                    if (genericVar.media) {
                                        content += "@media " + genericVar.media + " {\n";
                                    }
                                    var hasLayer = typeof genericVar.layer !== "undefined";
                                    if (hasLayer) {
                                        content += "@layer" + (genericVar.layer.length > 0 ? " " + genericVar.layer : "") + " {\n";
                                    }
                                    content += genericVar.css;
                                    if (hasLayer) {
                                        content += "}\n";
                                    }
                                    if (genericVar.media) {
                                        content += "}\n";
                                    }
                                    if (genericVar.supports) {
                                        content += "}\n";
                                    }
                        
                                    var sourceMap = genericVar.sourceMap;
                                    if (sourceMap && typeof btoa !== "undefined") {
                                        content +=
                                            "\n/*# sourceMappingURL=data:application/json;base64," +
                                            btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) +
                                            " */";
                                    }
                        
                                    genericVar.styleTagTransformvar_2505(genericVar, content, genericVar.options);
                                })(genericVar, genericVar, genericVar);
                            },
                        };
                        
                            remove: function  {
                                !function genericVar {
                                    if null === genericVar.parentNode {
                                        return false;
                                    }
                                    genericVar.parentNode.removeChildvar_2508;
                                }
                                genericVar;
                            }
                        }
                        ;
                    }
                    ;
                
                589: function genericVar {
                    "use strict";
                    genericVar./* Export Functions */
exports = function genericVar, genericVar {
                        if genericVar.styleSheet {
                            genericVar.styleSheet.cssText = genericVar;
                        }
                        else {
                            for ;
                            genericVar.firstChild;
                            {
                                genericVar.removeChildvar_2511.firstChild;
                            }
                            genericVar.appendChilddocument.createTextNode(genericVar);
                        }
                    }
                    ;
                }
                ,
                61: genericVar, genericVar, function genericVar {
                    var genericVar = genericVar["default"];
                    function genericVar {
                        "use strict";
                        genericVar.exports = genericVar = function  {
                            return genericVar;
                        }
                        ;
                        genericVar.exports.__esModule = true;
                        genericVar.exports["default"] = genericVar.exports;
                        var genericVar = {
                        }
                        ;
                        var genericVar = Object.prototype;
                        var genericVar = genericVar.hasOwnProperty;
                        var genericVar = Object.defineProperty || function genericVar, genericVar, genericVar {
                            genericVar[genericVar] = genericVar.value;
                        }
                        ;
                        var genericVar = "function" == typeof Symbol ? Symbol : {
                        }
                        ;
                        var genericVar = genericVar.iterator || "@@iterator";
                        var genericVar = genericVar.asyncIterator || "@@asyncIterator";
                        var genericVar = genericVar.toStringTag || "@@toStringTag";
                        function renamedFunctionvar_2529, genericVar, genericVar {
                            Object.defineProperty(genericVar, genericVar, {
                                value: genericVar,
                                enumerable: true,
                                configurable: true,
                                writable: true
                            }
                            );
                            return genericVar[genericVar];
                        }
                        try {
                            genericVar{
                            }
                            , "";
                        }
                        catch genericVar {
                            genericVar = function genericVar, genericVar, genericVar {
                                return genericVar[genericVar] = genericVar;
                            }
                            ;
                        }
                        function renamedFunctionvar_2537, genericVar, genericVar, genericVar {
                            var genericVar = genericVar && genericVar.prototype instanceof genericVar ? genericVar : genericVar;
                            var genericVar = Object.createvar_2541.prototype;
                            var genericVar = new var_2545var_2540 || [];
                            genericVar(genericVar, "_invoke", {
                                value: var_2546var_2537, genericVar, genericVar
                            }
                            );
                            return genericVar;
                        }
                        function renamedFunctionvar_2548, genericVar, genericVar {
                            try {
                                return {
                                    type: "normal",
                                    arg: genericVar.callvar_2549, genericVar
                                }
                                ;
                            }
                            catch genericVar {
                                return {
                                    type: "throw",
                                    arg: genericVar
                                }
                                ;
                            }
                        }
                        genericVar.wrap = genericVar;
                        var genericVar = {
                        }
                        ;
                        function genericVar {
                        }
                        function genericVar {
                        }
                        function genericVar {
                        }
                        var genericVar = {
                        }
                        ;
                        var_2528var_2555, genericVar, function ( {
                            return this;
                        }
                        );
                        var genericVar = Object.getPrototypeOf;
                        var genericVar = genericVar && var_2556var_2556(genericVar([]));
                        if genericVar && genericVar !== genericVar && genericVar.call(genericVar, genericVar) {
                            genericVar = genericVar;
                        }
                        var genericVar = genericVar.prototype = genericVar.prototype = Object.createvar_2555;
                        function renamedFunctionvar_2561 {
                            ["next", "throw", "return"].forEachfunction (genericVar {
                                var_2528var_2561, genericVar, function (genericVar {
                                    return this._invokevar_2562, genericVar;
                                }
                                );
                            }
                            );
                        }
                        function renamedFunctionvar_2565, genericVar {
                            function renamedFunctionvar_2568, genericVar, genericVar, genericVar {
                                var genericVar = var_2547var_2565[genericVar], genericVar, genericVar;
                                if "throw" !== genericVar.type {
                                    var genericVar = genericVar.arg;
                                    var genericVar = genericVar.value;
                                    return genericVar && "object" == var_2515var_2574 && genericVar.callvar_2574, "__await" ? genericVar.resolvevar_2574.__await.thenfunction (genericVar {
                                        genericVar"next", genericVar, genericVar, genericVar;
                                    }
                                    , function genericVar {
                                        genericVar"throw", genericVar, genericVar, genericVar;
                                    }
                                    ) : genericVar.resolvevar_2574.thenfunction (genericVar {
                                        genericVar.value = genericVar;
                                        var_2570var_2573;
                                    }
                                    , function genericVar {
                                        return genericVar"throw", genericVar, genericVar, genericVar;
                                    }
                                    );
                                }
                                var_2571var_2572.arg;
                            }
                            var genericVar;
                            genericVar(this, "_invoke", {
                                value: function genericVar, genericVar {
                                    function genericVar {
                                        return new var_2566function (genericVar, genericVar {
                                            var_2567var_2580, genericVar, genericVar, genericVar;
                                        }
                                        );
                                    }
                                    return genericVar = genericVar ? genericVar.thenvar_2582, genericVar : genericVar;
                                }
                            }
                            );
                        }
                        function renamedFunctionvar_2585, genericVar, genericVar {
                            var genericVar = "suspendedStart";
                            return function genericVar, genericVar {
                                if "executing" === genericVar {
                                    throw new Error"Generator is already running";
                                }
                                if "completed" === genericVar {
                                    if "throw" === genericVar {
                                        throw genericVar;
                                    }
                                    return {
                                        value: undefined,
                                        done: true
                                    }
                                    ;
                                }
                                genericVar.method = genericVar;
                                for genericVar.arg = genericVar;
                                ;
                                {
                                    var genericVar = genericVar.delegate;
                                    if genericVar {
                                        var genericVar = var_2593var_2591, genericVar;
                                        if genericVar {
                                            if genericVar === genericVar {
                                                continue;
                                            }
                                            return genericVar;
                                        }
                                    }
                                    if "next" === genericVar.method {
                                        genericVar.sent = genericVar._sent = genericVar.arg;
                                    }
                                    else {
                                        if "throw" === genericVar.method {
                                            if "suspendedStart" === genericVar {
                                                genericVar = "completed";
                                                throw genericVar.arg;
                                            }
                                            genericVar.dispatchExceptionvar_2587.arg;
                                        }
                                        else if "return" === genericVar.method {
                                            genericVar.abrupt"return", genericVar.arg;
                                        }
                                    }
                                    genericVar = "executing";
                                    var genericVar = var_2547var_2585, genericVar, genericVar;
                                    if "normal" === genericVar.type {
                                        genericVar = genericVar.done ? "completed" : "suspendedYield";
                                        if genericVar.arg === genericVar {
                                            continue;
                                        }
                                        return {
                                            value: genericVar.arg,
                                            done: genericVar.done
                                        }
                                        ;
                                    }
                                    if "throw" === genericVar.type {
                                        genericVar = "completed";
                                        genericVar.method = "throw";
                                        genericVar.arg = genericVar.arg;
                                    }
                                }
                            }
                            ;
                        }
                        function renamedFunctionvar_2595, genericVar {
                            var genericVar = genericVar.method;
                            var genericVar = genericVar.iterator[genericVar];
                            if undefined === genericVar {
                                genericVar.delegate = null;
                                if !("throw" === genericVar && genericVar.iterator["return"] && (genericVar.method = "return", genericVar.arg = undefined, genericVar(genericVar, genericVar, "throw" === genericVar.method))) {
                                    if "return" !== genericVar {
                                        genericVar.method = "throw";
                                        genericVar.arg = new TypeError"The iterator does not provide a '" + genericVar + "' method";
                                    }
                                }
                                return genericVar;
                            }
                            var genericVar = var_2547var_2598, genericVar.iterator, genericVar.arg;
                            if "throw" === genericVar.type {
                                genericVar.method = "throw";
                                genericVar.arg = genericVar.arg;
                                genericVar.delegate = null;
                                return genericVar;
                            }
                            var genericVar = genericVar.arg;
                            return genericVar ? genericVar.done ? genericVar[genericVar.resultName] = genericVar.value, genericVar.next = genericVar.nextLoc, "return" !== genericVar.method && (genericVar.method = "next", genericVar.arg = undefined, genericVar.delegate = null, genericVar) : genericVar : genericVar.method = "throw", genericVar.arg = new TypeError("iterator result is not an object", genericVar.delegate = null, genericVar);
                        }
                        function renamedFunctionvar_2602 {
                            var genericVar = {
                                tryLoc: genericVar[0]
                            }
                            ;
                            if 1 in genericVar {
                                genericVar.catchLoc = genericVar[1];
                            }
                            if 2 in genericVar {
                                genericVar.finallyLoc = genericVar[2];
                                genericVar.afterLoc = genericVar[3];
                            }
                            this.tryEntries.pushvar_2603;
                        }
                        function renamedFunctionvar_2605 {
                            var genericVar = genericVar.completion || {
                            }
                            ;
                            genericVar.type = "normal";
                            delete genericVar.arg;
                            genericVar.completion = genericVar;
                        }
                        function renamedFunctionvar_2607 {
                            this.tryEntries = [{
                                tryLoc: "root"
                            }
                            ];
                            genericVar.forEachvar_2601, this;
                            this.resettrue;
                        }
                        function renamedFunctionvar_2608 {
                            if genericVar {
                                var genericVar = genericVar[genericVar];
                                if genericVar {
                                    return genericVar.callvar_2608;
                                }
                                if "function" == typeof genericVar.next {
                                    return genericVar;
                                }
                                if !isNaN(genericVar.length) {
                                    var genericVar = -1;
                                    var genericVar = function genericVar {
                                        for ;
                                        ++genericVar < genericVar.length;
                                        {
                                            if genericVar.call(genericVar, genericVar) {
                                                genericVar.value = genericVar[genericVar];
                                                genericVar.done = false;
                                                return genericVar;
                                            }
                                        }
                                        genericVar.value = undefined;
                                        genericVar.done = true;
                                        return genericVar;
                                    }
                                    ;
                                    return genericVar.next = genericVar;
                                }
                            }
                            return {
                                next: genericVar
                            }
                            ;
                        }
                        function genericVar {
                            return {
                                value: undefined,
                                done: true
                            }
                            ;
                        }
                        genericVar.prototype = genericVar;
                        genericVar(genericVar, "constructor", {
                            value: genericVar,
                            configurable: true
                        }
                        );
                        genericVar(genericVar, "constructor", {
                            value: genericVar,
                            configurable: true
                        }
                        );
                        genericVar.displayName = var_2528var_2554, genericVar, "GeneratorFunction";
                        genericVar.isGeneratorFunction = function genericVar {
                            var genericVar = "function" == typeof genericVar && genericVar.constructor;
                            return !!genericVar && genericVar === genericVar || "GeneratorFunction" === (genericVar.displayName || genericVar.name);
                        }
                        ;
                        genericVar.mark = function genericVar {
                            if Object.setPrototypeOf {
                                Object.setPrototypeOfvar_2616, genericVar;
                            }
                            else {
                                genericVar.__proto__ = genericVar;
                                var_2528var_2616, genericVar, "GeneratorFunction";
                            }
                            genericVar.prototype = Object.createvar_2559;
                            return genericVar;
                        }
                        ;
                        genericVar.awrap = function genericVar {
                            return {
                                __await: genericVar
                            }
                            ;
                        }
                        ;
                        var_2560var_2564.prototype;
                        var_2528var_2564.prototype, genericVar, function ( {
                            return this;
                        }
                        );
                        genericVar.AsyncIterator = genericVar;
                        genericVar.async = function genericVar, genericVar, genericVar, genericVar, genericVar {
                            if undefined === genericVar {
                                genericVar = Promise;
                            }
                            var genericVar = new var_2564var_2536(genericVar, genericVar, genericVar, genericVar, genericVar);
                            return genericVar.isGeneratorFunctionvar_2619 ? genericVar : genericVar.next.thenfunction (genericVar {
                                return genericVar.done ? genericVar.value : genericVar.next;
                            }
                            );
                        }
                        ;
                        var_2560var_2559;
                        var_2528var_2559, genericVar, "Generator";
                        var_2528var_2559, genericVar, function ( {
                            return this;
                        }
                        );
                        var_2528var_2559, "toString", function ( {
                            return "[object Generator]";
                        }
                        );
                        genericVar.keys = function genericVar {
                            var genericVar = Objectvar_2625;
                            var genericVar = [];
                            for var genericVar in genericVar genericVar.pushvar_2628;
                            genericVar.reverse;
                            return function genericVar {
                                for ;
                                genericVar.length;
                                {
                                    var genericVar = genericVar.pop;
                                    if genericVar in genericVar {
                                        genericVar.value = genericVar;
                                        genericVar.done = false;
                                        return genericVar;
                                    }
                                }
                                genericVar.done = true;
                                return genericVar;
                            }
                            ;
                        }
                        ;
                        genericVar.values = genericVar;
                        genericVar.prototype = {
                            constructor: genericVar,
                            reset: function genericVar {
                                this.prev = 0;
                                this.next = 0;
                                this.sent = this._sent = undefined;
                                this.done = false;
                                this.delegate = null;
                                this.method = "next";
                                this.arg = undefined;
                                this.tryEntries.forEachvar_2604;
                                if !genericVar {
                                    for var genericVar in this if "t" === genericVar.charAt(0 && genericVar.callthis, genericVar && !isNaN+genericVar.slice(1)) {
                                        this[genericVar] = undefined;
                                    }
                                }
                            }
                            ,
                            stop: function  {
                                this.done = true;
                                var genericVar = this.tryEntries[0].completion;
                                if "throw" === genericVar.type {
                                    throw genericVar.arg;
                                }
                                return this.rval;
                            }
                            ,
                            dispatchException: function genericVar {
                                if this.done {
                                    throw genericVar;
                                }
                                var genericVar = this;
                                function renamedFunctionvar_2637, genericVar {
                                    genericVar.type = "throw";
                                    genericVar.arg = genericVar;
                                    genericVar.next = genericVar;
                                    if genericVar {
                                        genericVar.method = "next";
                                        genericVar.arg = undefined;
                                    }
                                    return !!genericVar;
                                }
                                for var genericVar = this.tryEntries.length - 1;
                                genericVar >= 0;
                                --genericVar {
                                    var genericVar = this.tryEntries[genericVar];
                                    var genericVar = genericVar.completion;
                                    if "root" === genericVar.tryLoc {
                                        return genericVar"end";
                                    }
                                    if genericVar.tryLoc <= this.prev {
                                        var genericVar = genericVar.callvar_2641, "catchLoc";
                                        var genericVar = genericVar.callvar_2641, "finallyLoc";
                                        if genericVar && genericVar {
                                            if this.prev < genericVar.catchLoc {
                                                return var_2636var_2641.catchLoc, true;
                                            }
                                            if this.prev < genericVar.finallyLoc {
                                                return var_2636var_2641.finallyLoc;
                                            }
                                        }
                                        else {
                                            if genericVar {
                                                if this.prev < genericVar.catchLoc {
                                                    return var_2636var_2641.catchLoc, true;
                                                }
                                            }
                                            else {
                                                if !genericVar {
                                                    throw new Error"try statement without catch or finally";
                                                }
                                                if this.prev < genericVar.finallyLoc {
                                                    return var_2636var_2641.finallyLoc;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            ,
                            abrupt: function(genericVar, genericVar) {
                                for(var genericVar = this.tryEntries.length - 1;
                                genericVar >= 0;
                                --genericVar) {
                                    var genericVar = this.tryEntries[genericVar];
                                    if(genericVar.tryLoc <= this.prev && genericVar.call(genericVar, "finallyLoc") && this.prev < genericVar.finallyLoc) {
                                        var genericVar = genericVar;
                                        break;
                                    }
                                }
                                if(genericVar && ("break" === genericVar || "continue" === genericVar && genericVar.tryLoc <= genericVar && genericVar <= genericVar.finallyLoc)) {
                                    genericVar = null;
                                }
                                var genericVar = genericVar ? genericVar.completion : {};
                                genericVar.type = genericVar;
                                genericVar.arg = genericVar;
                                return genericVar ? (this.method = "next", this.next = genericVar.finallyLoc, genericVar) : this.complete(var_2649);
                            },
                            complete: function(genericVar, genericVar) {
                                if("throw" === genericVar.type) {
                                    throw genericVar.arg;
                                }
                                if("break" === genericVar.type || "continue" === genericVar.type) {
                                    this.next = genericVar.arg;
                                }
                                else if("return" === genericVar.type) {
                                    this.rval = this.arg = genericVar.arg;
                                    this.method = "return";
                                    this.next = "end";
                                }
                                else if("normal" === genericVar.type && genericVar) {
                                    this.next = genericVar;
                                }
                                return genericVar;
                            },
                            finish: function(genericVar) {
                                for(var genericVar = this.tryEntries.length - 1;
                                genericVar >= 0;
                                --genericVar) {
                                    var genericVar = this.tryEntries[genericVar];
                                    if(genericVar.finallyLoc === genericVar) {
                                        this.complete(var_2654.completion, genericVar.afterLoc);
                                        var_2604(var_2654);
                                        return genericVar;
                                    }
                                }
                            },
                            catch: function(genericVar) {
                                for(var genericVar = this.tryEntries.length - 1;
                                genericVar >= 0;
                                --genericVar) {
                                    var genericVar = this.tryEntries[genericVar];
                                    if(genericVar.tryLoc === genericVar) {
                                        var genericVar = genericVar.completion;
                                        if("throw" === genericVar.type) {
                                            var genericVar = genericVar.arg;
                                            var_2604(var_2657);
                                        }
                                        return genericVar;
                                    }
                                }
                                throw new Error("illegal catch attempt");
                            },
                            delegateYield: function(genericVar, genericVar, genericVar) {
                                this.delegate = {
                                    iterator: var_2558(var_2660),
                                    resultName: genericVar,
                                    nextLoc: genericVar
                                };
                                if("next" === this.method) {
                                    this.arg = undefined;
                                }
                                return genericVar;
                            }
                        }
                        ;
                        return genericVar;
                    }
                    genericVar.exports = genericVar;
                    genericVar.exports.__esModule = true;
                    genericVar.exports["default"] = genericVar.exports;
                }
                ,
                698: function genericVar {
                    function renamedFunctionvar_2665 {
                        genericVar.exports = genericVar = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function genericVar {
                            return typeof genericVar;
                        }
                        : function genericVar {
                            return genericVar && "function" == typeof Symbol && genericVar.constructor === Symbol && genericVar !== Symbol.prototype ? "symbol" : typeof genericVar;
                        }
                        ;
                        genericVar.exports.__esModule = true;
                        genericVar.exports["default"] = genericVar.exports;
                        return var_2664var_2665;
                    }
                    genericVar.exports = genericVar;
                    genericVar.exports.__esModule = true;
                    genericVar.exports["default"] = genericVar.exports;
                }
                ,
                687: genericVar, genericVar, function genericVar {
                    var genericVar = genericVar;
                    genericVar.exports = genericVar;
                    try {
                        regeneratorRuntime = genericVar;
                    }
                    catch genericVar {
                        if "object" == typeof globalThis {
                            globalThis.regeneratorRuntime = genericVar;
                        }
                        else {
                            Function"r", "regeneratorRuntime = r"genericVar;
                        }
                    }
                };
            
            var genericVar = {
            }
            ;
            function renamedFunctionvar_2675 {
                var genericVar = genericVar[genericVar];
                if undefined !== genericVar {
                    return genericVar.exports;
                }
                var genericVar = genericVar[genericVar] = {
                    id: genericVar,
                    exports: {
                    }
                }
                ;
                moduleDefinitions[genericVar]genericVar, genericVar.exports, genericVar;
                return genericVar.exports;
            }
            genericVar.n = function genericVar {
                var genericVar = genericVar && genericVar.__esModule ?  => genericVar["default"] :  => genericVar;
                genericVar.d(genericVar, {
                    a: genericVar
                }
                );
                return genericVar;
            }
            ;
            genericVar.d = genericVar, function genericVar {
                for var genericVar in genericVar if genericVar.o(genericVar, genericVar && !genericVar.ovar_2680, genericVar) {
                    Object.defineProperty(genericVar, genericVar, {
                        enumerable: true,
                        get: genericVar[genericVar]
                    }
                    );
                }
            }
            ;
            genericVar.o = genericVar;

            function genericVar(ObjectPrototypeHasOwnPropertyCall, genericVar) {
                return Object.prototype.hasOwnProperty.call(ObjectPrototypeHasOwnPropertyCall, genericVar);
            }
            
            genericVar.nc = undefined;
            
            (() => {
                "use strict";
                var genericVar = genericVar;
                var anotherVar = genericVar;
            
                function renamedFunctionvar_2688(genericVar, length) {
                    if (genericVar == null || length > genericVar.length) {
                        length = genericVar.length;
                    }
                    var result = new Array(length);
                    for (var i = 0; i < length; i++) {
                        result[i] = genericVar[i];
                    }
                    return result;
                }
            
                function renamedFunctionvar_2693(genericVar) {
                    if (genericVar) {
                        if (typeof genericVar === "string") {
                            return Array.from(genericVar);
                        }
                        var type = Object.prototype.toString.call(genericVar).slice(8, -1);
                        if (type === "Object" && genericVar.constructor) {
                            type = genericVar.constructor.name;
                        }
                        return type === "Map" || type === "Set"
                            ? Array.from(genericVar)
                            : type === "Arguments" || /^Uint|Int(8|16|32)Array$/.test(type)
                            ? Array.from(genericVar)
                            : undefined;
                    }
                }
            
                function renamedFunctionvar_2697() {
                    return function (genericVar) {
                        if (Array.isArray(genericVar)) {
                            return Array.from(genericVar);
                        }
                    };
                }
            })();
            
                    genericVar || function genericVar {
                        if "undefined" != typeof Symbol && null != genericVar[Symbol.iterator] || null != genericVar["@@iterator"] {
                            return Array.fromvar_2699;
                        }
                    }
                    genericVar || var_2692var_2697 || function  {
                        throw new TypeError"Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]( "method.");
                    }
                    ;
                function renamedFunctionvar_2701, genericVar {
                    return function genericVar {
                        if Array.isArray(genericVar) {
                            return genericVar;
                        }
                    }
                    genericVar || function genericVar, genericVar {
                        var genericVar = null == genericVar ? null : "undefined" != typeof Symbol && genericVar[Symbol.iterator] || genericVar["@@iterator"];
                        if null != genericVar {
                            var genericVar;
                            var genericVar;
                            var genericVar;
                            var genericVar;
                            var genericVar = [];
                            var genericVar = true;
                            var genericVar = false;
                            try {
                                genericVar = genericVar = genericVar.call(genericVar).next;
                                if 0 === genericVar {
                                    if Object(genericVar !== genericVar) {
                                        return;
                                    }
                                    genericVar = false;
                                }
                                else {
                                    for ;
                                    !(genericVar = (genericVar = genericVar.call(genericVar).done) && genericVar.push(genericVar.value, genericVar.length !== genericVar);
                                    genericVar = true) {
                                        ;
                                    }
                                }
                            }
                            catch genericVar {
                                genericVar = true;
                                genericVar = genericVar;
                            }
                            finally {
                                try {
                                    if !genericVar && null != genericVar["return"] && (genericVar = genericVar["return"](, Objectvar_2710 !== genericVar)) {
                                        return;
                                    }
                                }
                                finally {
                                    if genericVar {
                                        throw genericVar;
                                    }
                                }
                            }
                            return genericVar;
                        }
                    }
                    genericVar, genericVar || var_2692var_2701, genericVar || function  {
                        throw new TypeError"Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]( method.");
                    }
                    ;
                }
                function renamedFunctionvar_2716 {
                    genericVar = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function genericVar {
                        return typeof genericVar;
                    }
                    : function genericVar {
                        return genericVar && "function" == typeof Symbol && genericVar.constructor === Symbol && genericVar !== Symbol.prototype ? "symbol" : typeof genericVar;
                    }
                    ;
                    return var_2715var_2716;
                }
                function renamedFunctionvar_2720 {
                    var genericVar = function genericVar, genericVar {
                        if "object" !== genericVar(genericVar || null === genericVar) {
                            return genericVar;
                        }
                        var genericVar = genericVar[Symbol.toPrimitive];
                        if undefined !== genericVar {
                            var genericVar = genericVar.callvar_2722, genericVar || "default";
                            if "object" !== genericVar(genericVar) {
                                return genericVar;
                            }
                            throw new TypeError"@@toPrimitive must return a primitive value.";
                        }
                        return "string" === genericVar ? String : Numbervar_2722;
                    }
                    genericVar, "string";
                    return "symbol" === var_2715var_2721 ? genericVar : Stringvar_2721;
                }
                function renamedFunctionvar_2727, genericVar, genericVar {
                    if(genericVar = genericVar(genericVar) in genericVar) {
                        Object.defineProperty(genericVar, genericVar, {
                            value: genericVar,
                            enumerable: true,
                            configurable: true,
                            writable: true
                        }
                        );
                    }
                    else {
                        genericVar[genericVar] = genericVar;
                    }
                    return genericVar;
                }
                function renamedFunctionvar_2731, genericVar {
                    var genericVar = Object.keysvar_2731;
                    if Object.getOwnPropertySymbols {
                        var genericVar = Object.getOwnPropertySymbolsvar_2731;
                        if genericVar {
                            genericVar = genericVar.filterfunction (genericVar {
                                return Object.getOwnPropertyDescriptorvar_2731, genericVar.enumerable;
                            }
                            );
                        }
                        genericVar.push.applyvar_2733, genericVar;
                    }
                    return genericVar;
                }
                function renamedFunctionvar_2737 {
                    for var genericVar = 1;
                    genericVar < arguments.length;
                    genericVar++ {
                        var genericVar = null != arguments[genericVar] ? arguments[genericVar] : {
                        }
                        ;
                        if genericVar % 2 {
                            var_2730Object(genericVar, true).forEachfunction (genericVar {
                                var_2726var_2737, genericVar, genericVar[genericVar];
                            }
                            );
                        }
                        else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(var_2737, Object.getOwnPropertyDescriptors(genericVar));
                        } else {
                            Object.keys(genericVar).forEach(function (key) {
                                Object.defineProperty(var_2737, key, Object.getOwnPropertyDescriptor(genericVar, key));
                            });
                        }
                        return genericVar;
                        }
                        
                        var genericVar = genericVar;
                        
                        function renamedFunctionvar_2744(genericVar) {
                            var id = genericVar.id;
                            var nick = genericVar.nick;
                            var skinUrl = genericVar.skinUrl;
                            var whitelisted = genericVar.whitelisted;
                            var waveCount = genericVar.waveCount;
                            var onToggle = genericVar.onToggle;
                            var onSkinClick = genericVar.onSkinClick;
                            var onNameClick = genericVar.onNameClick;
                        
                            var [isActive, setIsActive] = var_2700var_2685.useState(false);
                        
                            var style = skinUrl && /^https?:\/\/[a-z0-9]+\.?imgur\.com\/.*?$/.test(skinUrl)
                                ? { backgroundImage: `url("${skinUrl}")` }
                                : null;
                        
                            return genericVar.jsxs("div", {
                                className: "info",
                                children: [
                                    genericVar.jsx("div", {
                                        className: "wave-btn",
                                        onClick: function () {
                                            return onToggle && onToggle(!isActive);
                                        },
                                        children: isActive ? "✔" : "❌",
                                    }),
                                    genericVar.jsx("div", {
                                        className: "skin",
                                        style: style,
                                        onClick: function () {
                                            return onSkinClick && onSkinClick();
                                        },
                                    }),
                                    genericVar.jsx("div", {
                                        className: "name",
                                        onClick: function () {
                                            return onNameClick && onNameClick();
                                        },
                                        onMouseEnter: function () {
                                            return setIsActive(true);
                                        },
                                        onMouseLeave: function () {
                                            return setIsActive(false);
                                        },
                                        children: whitelisted && nick ? `#${nick}` : nick,
                                    }),
                                    genericVar.jsx("div", {
                                        className: "wave-count",
                                        children: waveCount,
                                    }),
                                ],
                            });
                        }
                        
                var genericVar = genericVar;
                var genericVar = genericVar.nvar_2757;
                var genericVar = genericVar;
                var genericVar = genericVar.nvar_2759;
                var genericVar = genericVar;
                var genericVar = genericVar.nvar_2761;
                var genericVar = genericVar;
                var genericVar = genericVar.nvar_2763;
                var genericVar = genericVar;
                var genericVar = genericVar.nvar_2765;
                var genericVar = genericVar;
                var genericVar = genericVar.nvar_2767;
                var genericVar = genericVar;
                var genericVar = {
                    styleTagTransform: genericVar,
                    "setAttributes": genericVar,
                    "insert": genericVar.bindnull, "head",
                    "domAPI": genericVar,
                    insertStyleElement: genericVar
                }
                ;
                var_2758var_2769.Z, genericVar;
                if genericVar.Z && genericVar.Z.locals {
                    genericVar.Z.locals;
                }
                const genericVar = "undefined" != typeof window ? genericVar.useLayoutEffect : genericVar.useEffect;
                function renamedFunctionvar_2773 {
                    0;
                    var genericVar = genericVar.useRefvar_2773;
                    var_2771function ( {
                        genericVar.current = genericVar;
                    }
                    , [genericVar]);
                    0;
                    return genericVar.useCallbackfunction ( {
                        var genericVar = arguments.length;
                        var genericVar = new Arrayvar_2775;
                        for var genericVar = 0;
                        genericVar < genericVar;
                        genericVar++ {
                            genericVar[genericVar] = arguments[genericVar];
                        }
                        genericVar.current.applythis, genericVar;
                    }
                    , []);
                }
                function renamedFunctionvar_2779, genericVar, genericVar {
                    var genericVar = var_2772var_2781;
                    var_2771function ( {
                        genericVar.onvar_2780, genericVar;
                        return function  {
                            genericVar.removeListenervar_2780, genericVar;
                        }
                        ;
                    }
                    , [genericVar, genericVar, genericVar]);
                }
                function renamedFunctionvar_2784 {
                    var genericVar = genericVar.caption;
                    var genericVar = genericVar.enabled;
                    var genericVar = genericVar.onChange;
                    var genericVar = genericVar.disabled;
                    var genericVar = genericVar.captionOn;
                    var genericVar = undefined === genericVar ? "ON" : genericVar;
                    var genericVar = genericVar.captionOff;
                    var genericVar = undefined === genericVar ? "OFF" : genericVar;
                    0;
                    0;
                    0;
                    0;
                    0;
                    0;
                    return genericVar.jsxs("div", {
                        className: "flex-row",
                        children: [genericVar.jsx("div", {
                            className: "input-box-cell rest",
                            children: genericVar
                        }
                        ), genericVar.jsx("div", {
                            className: "input-box-cell",
                            children: genericVar.jsxs("label", {
                                className: "switch",
                                children: [genericVar.jsx("input", {
                                    className: "checkbox",
                                    type: "checkbox",
                                    checked: genericVar,
                                    onChange: function genericVar {
                                        return var_2787var_2793.target.checked;
                                    }
                                    ,
                                    disabled: genericVar
                                }
                                ), genericVar.jsx("div", {
                                    className: "slider round",
                                    "data-on": genericVar,
                                    "data-off": genericVar
                                }
                                )]
                            }
                            )
                        }
                        )]
                    }
                    );
                }
                function renamedFunctionvar_2795, genericVar, genericVar, genericVar, genericVar, genericVar, genericVar {
                    try {
                        var genericVar = genericVar[genericVar]genericVar;
                        var genericVar = genericVar.value;
                    }
                    catch genericVar {
                        return void var_2797var_2804;
                    }
                    if genericVar.done {
                        var_2796var_2803;
                    }
                    else {
                        Promise.resolvevar_2803.thenvar_2798, genericVar;
                    }
                }
                /* Error Handling */
function renamedFunctionvar_2806 {
                    return function  {
                        var genericVar = this;
                        return new Promisefunction (genericVar, genericVar {
                            var genericVar = genericVar.applyvar_2807, arguments;
                            /* Error Handling */
function renamedFunctionvar_2812 {
                                var_2794var_2810, genericVar, genericVar, genericVar, genericVar, "next", genericVar;
                            }
                            /* Error Handling */
function renamedFunctionvar_2814 {
                                var_2794var_2810, genericVar, genericVar, genericVar, genericVar, "throw", genericVar;
                            }
                            var_2811undefined;
                        }
                        );
                    }
                    ;
                }
                var genericVar = genericVar;
                var genericVar = genericVar.nvar_2815;
                /* Error Handling */
function renamedFunctionvar_2818, genericVar {
                    for var genericVar = 0;
                    genericVar < genericVar.length;
                    genericVar++ {
                        var genericVar = genericVar[genericVar];
                        genericVar.enumerable = genericVar.enumerable || false;
                        genericVar.configurable = true;
                        if "value" in genericVar {
                            genericVar.writable = true;
                        }
                        Object.definePropertyvar_2818, genericVar(genericVar.key, genericVar);
                    }
                }
                /* Error Handling */
function renamedFunctionvar_2823, genericVar {
                    genericVar = Object.setPrototypeOf ? Object.setPrototypeOf.bind : /* Error Handling */
function genericVar, genericVar {
                        genericVar.__proto__ = genericVar;
                        return genericVar;
                    }
                    ;
                    return var_2822var_2823, genericVar;
                }
                /* Error Handling */
function renamedFunctionvar_2828, genericVar {
                    if genericVar && ("object" === genericVar(genericVar || "function" == typeof genericVar)) {
                        return genericVar;
                    }
                    if undefined !== genericVar {
                        throw new TypeError"Derived constructors may only return object or undefined";
                    }
                    return/* Error Handling */
function genericVar {
                        if undefined === genericVar {
                            throw new ReferenceError"this hasn't been initialised - super( hasn't been called");
                        }
                        return genericVar;
                    }
                    genericVar;
                }
                /* Error Handling */
function renamedFunctionvar_2832 {
                    genericVar = Object.setPrototypeOf ? Object.getPrototypeOf.bind : /* Error Handling */
function genericVar {
                        return genericVar.__proto__ || Object.getPrototypeOfvar_2833;
                    }
                    ;
                    return var_2831var_2832;
                }
                /* Error Handling */
function renamedFunctionvar_2835, genericVar, genericVar {
                    genericVar = function  {
                        if "undefined" == typeof Reflect || !Reflect.construct {
                            return false;
                        }
                        if Reflect.construct.sham {
                            return false;
                        }
                        if "function" == typeof Proxy {
                            return true;
                        }
                        try {
                            Boolean.prototype.valueOf.callReflect.construct(Boolean, [], function ( {
                            }
                            ));
                            return true;
                        }
                        catch genericVar {
                            return false;
                        }
                    }
                    ? Reflect.construct.bind : /* Error Handling */
function genericVar, genericVar, genericVar {
                        var genericVar = [null];
                        genericVar.push.applyvar_2842, genericVar;
                        var genericVar = new Function.bind.apply(genericVar, genericVar);
                        if genericVar {
                            var_2822var_2843, genericVar.prototype;
                        }
                        return genericVar;
                    }
                    ;
                    return genericVar.applynull, arguments;
                }
                /* Error Handling */
function renamedFunctionvar_2845 {
                    var genericVar = "function" == typeof Map ? new Map : undefined;
                    genericVar = /* Error Handling */
function genericVar {
                        if null === genericVar || (genericVar = genericVar, -1 === Function.toString.call(genericVar.indexOf"[native code]")) {
                            return genericVar;
                        }
                        var genericVar;
                        if "function" != typeof genericVar {
                            throw new TypeError"Super expression must either be null or a function";
                        }
                        if undefined !== genericVar {
                            if genericVar.has(genericVar) {
                                return genericVar.getvar_2847;
                            }
                            genericVar.setvar_2847, genericVar;
                        }
                        /* Error Handling */
function genericVar {
                            return var_2834var_2847, arguments, genericVar(this.constructor);
                        }
                        genericVar.prototype = Object.create(genericVar.prototype, {
                            constructor: {
                                value: genericVar,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        }
                        );
                        return var_2822var_2849, genericVar;
                    }
                    ;
                    return var_2844var_2845;
                }
                /* Error Handling */
function renamedFunctionvar_2851 {
                    var genericVar = function  {
                        if "undefined" == typeof Reflect || !Reflect.construct {
                            return false;
                        }
                        if Reflect.construct.sham {
                            return false;
                        }
                        if "function" == typeof Proxy {
                            return true;
                        }
                        try {
                            Boolean.prototype.valueOf.callReflect.construct(Boolean, [], function ( {
                            }
                            ));
                            return true;
                        }
                        catch genericVar {
                            return false;
                        }
                    }
                    ;
                    return function  {
                        var genericVar;
                        var genericVar = var_2831var_2851;
                        if genericVar {
                            var genericVar = var_2831this.constructor;
                            genericVar = Reflect.constructvar_2855, arguments, genericVar;
                        }
                        else {
                            genericVar = genericVar.applythis, arguments;
                        }
                        return var_2827this, genericVar;
                    }
                    ;
                }
                var genericVar = /* Error Handling */
function genericVar {
                    !/* Error Handling */
function genericVar, genericVar {
                        if "function" != typeof genericVar && null !== genericVar {
                            throw new TypeError"Super expression must either be null or a function";
                        }
                        genericVar.prototype = Object.create(genericVar && genericVar.prototype, {
                            constructor: {
                                value: genericVar,
                                writable: true,
                                configurable: true
                            }
                        }
                        );
                        Object.defineProperty(genericVar, "prototype", {
                            writable: false
                        }
                        );
                        if genericVar {
                            var_2822var_2859, genericVar;
                        }
                    }
                    genericVar, genericVar;
                    var genericVar;
                    var genericVar;
                    var genericVar = var_2850var_2861;
                    /* Error Handling */
function renamedFunctionvar_2865, genericVar {
                        var genericVar;
                        function (genericVar, genericVar {
                            if !(genericVar instanceof genericVar) {
                                throw new TypeError"Cannot call a class as a function";
                            }
                        }
                        )this, genericVar;
                        genericVar = genericVar.call(this, genericVar).code = genericVar;
                        return genericVar;
                    }
                    if genericVar {
                        var_2817var_2861.prototype, genericVar;
                    }
                    if genericVar {
                        var_2817var_2861, genericVar;
                    }
                    Object.defineProperty(genericVar, "prototype", {
                        writable: false
                    }
                    );
                    return genericVar;
                }
                genericVar(Error);

                /* Error Handling */
                function renamedFunctionvar_2871(genericVar, genericVar, genericVar) {
                    return new Promise(function (resolve, reject) {
                        var timeoutHandle = setTimeout(function () {
                            clearInterval(intervalHandle);
                            reject(new genericVar("TIMEOUT", "Client " + genericVar.ID + " timed out"));
                        }, genericVar);
                
                        var intervalHandle = setInterval(function () {
                            if (!app.clients.region.includes(genericVar)) {
                                clearTimeout(timeoutHandle);
                                clearInterval(intervalHandle);
                                reject(new genericVar("CLIENTS_DESTROYED", "Client " + genericVar.ID + " has been destroyed"));
                            }
                            if (genericVar(genericVar)) {
                                clearTimeout(timeoutHandle);
                                clearInterval(intervalHandle);
                                resolve();
                            }
                        }, genericVar);
                    });
                }
                
                var genericVar = null;
                var genericVar = null;
                var genericVar = null;
                
                /* Error Handling */
                function renamedFunctionvar_2883() {
                    var genericVar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
                    var genericVar = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60000;
                    var genericVar = null;
                    var genericVar = false;
                    var genericVar = {};
                }
                
                /* Error Handling */
                function renamedFunctionvar_2890(genericVar) {
                    if (!genericVar.hasOwnProperty(genericVar)) {
                        genericVar[genericVar] = [];
                    }
                    return genericVar[genericVar];
                }
                
                    var genericVar = {
                        get Id() {
                            return genericVar.ID;
                        },
                        get isConnected() {
                            return genericVar;
                        },
                        on: /* Error Handling */
function(genericVar, genericVar) {
                            var_2889var_2892.push(var_2893);
                        },
                        off: /* Error Handling */
function(genericVar, genericVar) {
                            var genericVar = var_2889var_2894.findIndex(function(genericVar) {
                                return genericVar === genericVar;
                            });
                            if (!(genericVar < 0)) {
                                var_2889var_2894.splice(var_2896, 1);
                            }
                        },
                        connect: function() {
                            return genericVar.socketOpened && 1 === genericVar.socket.readyState ? Promise.resolve() : new Promise(function(genericVar, genericVar) {
                                var genericVar = function genericVar() {
                                    clearTimeout(var_2902);
                                    genericVar.removeListener("offset", genericVar);
                                    genericVar = true;
                                    genericVar();
                                };
                                genericVar.on("offset", genericVar);
                                genericVar.connect(var_2883._server.ws);
                                var genericVar = setTimeout(function() {
                                    genericVar.removeListener("offset", genericVar);
                                    var_2899(new genericVar("TIMEOUT", "Client " + genericVar.ID + " timed out while connecting"));
                                }, genericVar);
                            });
                        },
                        sendSpectate: function() {
                            genericVar.sendSpectate();
                            genericVar.ID;
                            return var_2870(var_2886, function() {
                                return genericVar.isSpectateEnabled;
                            }, genericVar, genericVar);
                        },
                        sendFreeSpectate: function() {
                            genericVar.sendFreeSpectate();
                            genericVar.ID;
                            return var_2870(var_2886, function() {
                                return genericVar.isFreeSpectate;
                            }, genericVar, genericVar);
                        },
                        setTargetPosition: function(genericVar, genericVar) {
                            genericVar.targetX = genericVar - genericVar.mapOffsetX;
                            genericVar.targetY = genericVar - genericVar.mapOffsetY;
                            genericVar.targetDistance = Math.round(Math.sqrt(Math.pow(genericVar.playerX - genericVar.targetX, 2) + Math.pow(var_2886.playerY - genericVar.targetY, 2)));
                            genericVar.ID;
                            "Sent to coordinates X:" + genericVar + " Y:" + genericVar;
                        },
                        disconnect: function() {
                            if (!genericVar.socketOpened) {
                                return Promise.resolve();
                            }
                            var genericVar = this;
                            return new Promise(function(genericVar, genericVar) {
                                var genericVar = function genericVar() {
                                    genericVar.off("close", genericVar);
                                    genericVar();
                                };
                                genericVar.on("close", genericVar);
                                genericVar.disconnect();
                                setTimeout(function() {
                                    genericVar.off("close", genericVar);
                                    genericVar();
                                }, genericVar);
                            });
                        },
                        destroy: function() {
                            try {
                                genericVar.destroyClient(var_2886);
                                genericVar.ID;
                            }
                            catch (genericVar) {
                                genericVar.ID;
                            }
                        }
                    };
                    (function() {
                        try {
                            genericVar = genericVar.initClient3();
                            if (null === genericVar || null === genericVar || null === genericVar) {
                                var genericVar = Object.getPrototypeOf(var_2886);
                                genericVar = genericVar.onOpen;
                                genericVar = genericVar.onClose;
                                genericVar = genericVar.onError;
                            }
                            genericVar.onOpen = function() {
                                var genericVar = arguments.length;
                                var genericVar = new Array(var_2912);
                                for (var genericVar = 0; genericVar < genericVar; genericVar++) {
                                    genericVar[genericVar] = arguments[genericVar];
                                }
                                genericVar.apply(this, genericVar);
                                genericVar["open"].forEach(function(genericVar) {
                                    return genericVar.apply(null, [genericVar].concat(genericVar));
                                });
                            };
                            genericVar.onClose = function() {
                                var genericVar = arguments.length;
                                var genericVar = new Array(var_2916);
                                for (var genericVar = 0; genericVar < genericVar; genericVar++) {
                                    genericVar[genericVar] = arguments[genericVar];
                                }
                                genericVar.apply(this, genericVar);
                                genericVar["close"].forEach(function(genericVar) {
                                    return genericVar.apply(null, [genericVar].concat(genericVar));
                                });
                            };
                            genericVar.onError = function() {
                                var genericVar = arguments.length;
                                var genericVar = new Array(var_2920);
                                for (var genericVar = 0; genericVar < genericVar; genericVar++) {
                                    genericVar[genericVar] = arguments[genericVar];
                                }
                                genericVar.apply(this, genericVar);
                                genericVar["error"].forEach(function(genericVar) {
                                    return genericVar.apply(null, [genericVar].concat(genericVar));
                                });
                            };
                            genericVar.ID;
                            genericVar.profile._nick = "Spectator";
                            genericVar.playerNick = "Spectator";
                            genericVar.ID;
                            "Successfully renamed to " + genericVar.profile._nick;
                        }
                        catch (genericVar) {
                            throw genericVar;
                        }
                    })();
                    genericVar.on("close", function() {
                        genericVar = false;
                    });
                    genericVar.on("error", function() {
                        genericVar = false;
                    });
                    return genericVar;
                }
                var genericVar = [{
                    x: -5066,
                    y: -5936
                }
                , {
                    x: 0,
                    y: -5936
                }
                , {
                    x: 5066,
                    y: -5936
                }
                , {
                    x: -5066,
                    y: -2967
                }
                , {
                    x: 0,
                    y: -2967
                }
                , {
                    x: 5066,
                    y: -2967
                }
                , {
                    x: -5066,
                    y: 0
                }
                , {
                    x: 0,
                    y: 0
                }
                , {
                    x: 5066,
                    y: 0
                }
                , {
                    x: -5066,
                    y: 2967
                }
                , {
                    x: 0,
                    y: 2967
                }
                , {
                    x: 5066,
                    y: 2967
                }
                , {
                    x: -5066,
                    y: 5936
                }
                , {
                    x: 0,
                    y: 5936
                }
                , {
                    x: 5066,
                    y: 5936
                }
                ];
                function renamedFunctionvar_2927 {
                    var genericVar;
                    var genericVar;
                    var genericVar = genericVar.deltaApp;
                    0;
                    var genericVar = var_2700var_2685.useState(false, 2);
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];
                    0;
                    var genericVar = var_2700var_2685.useState(false, 2);
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];
                    0;
                    var genericVar = var_2700var_2685.useState(false, 2);
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];
                    0;
                    var genericVar = var_2700var_2685.useState(false, 2);
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];
                    0;
                    var genericVar = genericVar.useMemofunction ( {
                        return function genericVar {
                            var genericVar = genericVar.app;
                            var genericVar = genericVar.clientInterval;
                            var genericVar = genericVar.clientTimeout;
                            var genericVar = genericVar.onExtendedMapStateChanged;
                            var genericVar = genericVar.onFullMapStateChanged;
                            var genericVar = false;
                            var genericVar = false;
                            var genericVar = null;
                            var genericVar = [];
                            var genericVar = genericVar;
                            function renamedFunctionvar_2956 {
                                genericVar = [];
                                for var genericVar = 0;
                                genericVar < genericVar;
                                genericVar++ {
                                    var genericVar = var_2882var_2945, genericVar, genericVar;
                                    genericVar.on"close", genericVar;
                                    genericVar.pushvar_2958;
                                }
                            }
                            function renamedFunctionvar_2960, genericVar {
                                if "noevent" !== genericVar && (console.log("Reconnecting Client " + genericVar.Id, genericVar || genericVar)) {
                                    var genericVar = genericVar.indexOfvar_2960;
                                    if !(genericVar < 0) {
                                        if genericVar && 0 === genericVar {
                                            genericVar.connect.thenfunction ( {
                                                return genericVar.sendSpectate;
                                            }
                                            );
                                        }
                                        else {
                                            genericVar.connect.then(function() {
                                                return genericVar.sendSpectate;
                                            }
                                            ).then(function() {
                                                return genericVar.sendFreeSpectate;
                                            }
                                            ).then(function() {
                                                return genericVar.setTargetPosition(var_2954[genericVar].x, genericVar[genericVar].y);
                                            }
                                            );
                                        }
                                    }
                                }
                            }
                            function genericVar {
                                return genericVar = genericVar(genericVar(.markfunction genericVar( {
                                    return genericVar.wrapfunction (genericVar {
                                        for ;
                                        ;
                                        {
                                            switch genericVar.prev = genericVar.next {
                                                case 0:
                                                genericVar.next = 2;
                                                return Promise.all(var_2953.map(function (genericVar) {
                                                    return genericVar.connect;
                                                }
                                                ));
                                                case 2:
                                                genericVar.next = 4;
                                                return Promise.all(var_2953.map(function (genericVar, genericVar) {
                                                    return genericVar && 0 === genericVar ? genericVar.sendSpectate : genericVar.sendSpectate.then(function() {
                                                        return genericVar.sendFreeSpectate;
                                                    }
                                                    );
                                                }
                                                ));
                                                case 4:
                                                case "end":
                                                return genericVar.stop;
                                            }
                                        }
                                    }
                                    , genericVar);
                                }
                                ))).apply(this, arguments);
                            }
                            function genericVar {
                                for (;
                                0 !== genericVar.length;
                                ) {
                                    var genericVar = genericVar.shift();
                                    if (genericVar) {
                                        genericVar.destroy();
                                    }
                                }
                            }
                            function genericVar {
                                return genericVar = genericVar(genericVar(.markfunction genericVar( {
                                    return genericVar.wrapfunction (genericVar {
                                        for (;
                                        ;
                                        ) {
                                            switch (genericVar.prev = genericVar.next) {
                                                case 0:
                                                genericVar;
                                                if (!genericVar) {
                                                    genericVar.next = 3;
                                                    break;
                                                }
                                                return genericVar.abrupt("return");
                                                case 3:
                                                genericVar;
                                                genericVar = true;
                                                if (genericVar) {
                                                    genericVar({
                                                        loading: true,
                                                        enabled: true
                                                    }
                                                    );
                                                }
                                                genericVar.prev = 6;
                                                genericVar.next = 9;
                                                return genericVar.apply(this, arguments);
                                                case 9:
                                                if (genericVar) {
                                                    genericVar({
                                                        loading: false,
                                                        enabled: true
                                                    }
                                                    );
                                                }
                                                genericVar = setInterval(function() {
                                                    genericVar = [{
                                                        x: genericVar.master.protocol_viewX + 2800,
                                                        y: genericVar.master.protocol_viewY
                                                    }
                                                    , {
                                                        x: genericVar.master.protocol_viewX,
                                                        y: genericVar.master.protocol_viewY + 2800
                                                    }
                                                    , {
                                                        x: genericVar.master.protocol_viewX - 2800,
                                                        y: genericVar.master.protocol_viewY
                                                    }
                                                    , {
                                                        x: genericVar.master.protocol_viewX,
                                                        y: genericVar.master.protocol_viewY - 2800
                                                    }
                                                    , {
                                                        x: genericVar.master.protocol_viewX + 5600,
                                                        y: genericVar.master.protocol_viewY + 5600
                                                    }
                                                    , {
                                                        x: genericVar.master.protocol_viewX + 5600,
                                                        y: genericVar.master.protocol_viewY - 5600
                                                    }
                                                    , {
                                                        x: genericVar.master.protocol_viewX - 5600,
                                                        y: genericVar.master.protocol_viewY + 5600
                                                    }
                                                    , {
                                                        x: genericVar.master.protocol_viewX - 5600,
                                                        y: genericVar.master.protocol_viewY - 5600
                                                    }
                                                    ];
                                                    genericVar.slice(1).forEach(function(genericVar, genericVar) {
                                                        return genericVar.setTargetPosition(var_2954[genericVar].x, genericVar[genericVar].y);
                                                    }
                                                    );
                                                }
                                                , 500);
                                                genericVar.next = 17;
                                                break;
                                                case 13:
                                                genericVar.prev = 13;
                                                genericVar.t0 = genericVar["catch"](6);
                                                console.log("ExtendedMap Error: " + genericVar.t0 + ", disabling");
                                                genericVar();
                                                case 17:
                                                case "end":
                                                return genericVar.stop;
                                            }
                                        }
                                    }
                                    ,genericVar, null, [[6, 13]]);
                                }
                                ))).apply(this, arguments);
                            }
                            function genericVar() {
                                if (genericVar) {
                                    if (genericVar) {
                                        clearInterval(var_2952);
                                        genericVar = null;
                                    }
                                    genericVar();
                                    genericVar = false;
                                    if (genericVar) {
                                        genericVar({
                                            loading: false,
                                            enabled: false
                                        });
                                    }
                                }
                            };

                            function genericVar {
                                return genericVar = genericVar(genericVar(.markfunction genericVar( {
                                    return genericVar.wrapfunction (genericVar {
                                        for (;
                                        ;
                                        ) {
                                            switch (genericVar.prev = genericVar.next) {
                                                case 0:
                                                genericVar;
                                                if (!genericVar) {
                                                    genericVar.next = 3;
                                                    break;
                                                }
                                                return genericVar.abrupt("return");
                                                case 3:
                                                var_2955var_2925.length;
                                                genericVar = genericVar;
                                                genericVar = true;
                                                if (genericVar) {
                                                    genericVar({
                                                        loading: true,
                                                        enabled: true
                                                    }
                                                    );
                                                }
                                                genericVar.prev = 7;
                                                genericVar.next = 10;
                                                return genericVar.apply(this, arguments);
                                                case 10:
                                                if (genericVar) {
                                                    genericVar({
                                                        loading: false,
                                                        enabled: true
                                                    }
                                                    );
                                                }
                                                genericVar.forEach(function(genericVar, genericVar) {
                                                    return genericVar.setTargetPosition(var_2954[genericVar].x, genericVar[genericVar].y);
                                                }
                                                );
                                                genericVar.next = 18;
                                                break;
                                                case 14:
                                                genericVar.prev = 14;
                                                genericVar.t0 = genericVar["catch"](7);
                                                console.log("FullMap Error: " + genericVar.t0.code + ", " + genericVar.t0.message + ", disabling");
                                                genericVar();
                                                case 18:
                                                case "end":
                                                return genericVar.stop;
                                            }
                                        }
                                    }
                                    , genericVar, null, [[7, 14]]);
                                }
                                ))).apply(this, arguments);
                            }
                            function genericVar {
                                if (genericVar) {
                                    genericVar();
                                    genericVar = false;
                                    if (genericVar) {
                                        genericVar({
                                            loading: false,
                                            enabled: false
                                        }
                                        );
                                    }
                                }
                            }
                            return {
                                enableExtendedMap: function() {
                                    return genericVar.apply(this, arguments);
                                }
                                ,
                                disableExtendedMap: genericVar,
                                enableFullMap: function() {
                                    return genericVar.apply(this, arguments);
                                }
                                ,
                                disableFullMap: genericVar
                            }
                            ;
                        }
                        ({
                            app: genericVar,
                            onExtendedMapStateChanged: function(genericVar) {
                                var genericVar = genericVar.loading;
                                var genericVar = genericVar.enabled;
                                var_2939var_2984;
                                var_2933var_2985;
                            }
                            ,
                            onFullMapStateChanged: function(genericVar) {
                                var genericVar = genericVar.loading;
                                var genericVar = genericVar.enabled;
                                var_2942var_2987;
                                var_2936var_2988;
                            }
                        }
                        );
                    }
                    , []);
                    0;
                    var genericVar = genericVar.useRef(var_2930._server.ws);
                    genericVar = function() {
                        if (genericVar._server.ws !== genericVar.current) {
                            genericVar.disableExtendedMap();
                            genericVar.disableFullMap();
                            genericVar.current = genericVar._server.ws;
                        }
                    }
                    ;
                    0;
                    0;
                    genericVar = genericVar.useRef(var_2928);
                    var_2771(function() {
                        genericVar.current = genericVar;
                    }
                    , [genericVar]);
                    0;
                    genericVar.useEffect(function() {
                        if (0 || true) {
                            var genericVar = setInterval(function() {
                                return genericVar.current();
                            }
                            , 0);
                            return function() {
                                return clearInterval(var_2990);
                            }
                            ;
                        }
                    }
                    , [0]);
                    0;
                    0;
                    0;
                    return genericVar.jsxs(genericVar.Fragment, {
                        children: [genericVar.jsx(genericVar, {
                            caption: "Ext. Map",
                            enabled: genericVar,
                            disabled: genericVar || genericVar,
                            onChange: function(genericVar) {
                                toastr.info("" + genericVar ? "Enabled" : "Disabled" + " extended map");
                                if (genericVar) {
                                    genericVar.enableExtendedMap();
                                }
                                else {
                                    genericVar.disableExtendedMap();
                                }
                            }
                        }
                        ), genericVar.jsx(genericVar, {
                            caption: "Full Map",
                            enabled: genericVar,
                            disabled: genericVar || genericVar,
                            onChange: function(genericVar) {
                                toastr.info("" + genericVar ? "Enabled" : "Disabled" + " full map");
                                if (genericVar) {
                                    genericVar.enableFullMap();
                                }
                                else {
                                    genericVar.disableFullMap();
                                }
                            }
                        }
                        )]
                    }
                    );
                }
                function renamedFunctionvar_2994, genericVar {
                    var genericVar = Object.keysvar_2994;
                    if Object.getOwnPropertySymbols {
                        var genericVar = Object.getOwnPropertySymbolsvar_2994;
                        if genericVar {
                            genericVar = genericVar.filterfunction (genericVar {
                                return Object.getOwnPropertyDescriptorvar_2994, genericVar.enumerable;
                            }
                            );
                        }
                        genericVar.push.applyvar_2996, genericVar;
                    }
                    return genericVar;
                }
                function renamedFunctionvar_3000 {
                    for var genericVar = 1;
                    genericVar < arguments.length;
                    genericVar++ {
                        var genericVar = null != arguments[genericVar] ? arguments[genericVar] : {
                        }
                        ;
                        if genericVar % 2 {
                            var_2993Object(genericVar, true).forEachfunction (genericVar {
                                var_2726var_3000, genericVar, genericVar[genericVar];
                            }
                            );
                        }
                        else if Object.getOwnPropertyDescriptors {
                            Object.definePropertiesvar_3000, Object.getOwnPropertyDescriptors(genericVar);
                        }
                        else {
                            var_2993Object(genericVar).forEachfunction (genericVar {
                                Object.definePropertyvar_3000, genericVar, Object.getOwnPropertyDescriptor(genericVar, genericVar);
                            }
                            );
                        }
                    }
                    return genericVar;
                }
                else if (Object.getOwnPropertyDescriptors) {
                    Object.defineProperties(var_3000, Object.getOwnPropertyDescriptors(genericVar));
                } else {
                    Object.keys(genericVar).forEach(function (key) {
                        Object.defineProperty(var_3000, key, Object.getOwnPropertyDescriptor(genericVar, key));
                    });
                }
                
                return genericVar;
                
                function renamedFunctionvar_3006() {
                    var genericVar = genericVar.deltaApp;
                    var genericVar = genericVar.deltaService;
                    var genericVar = genericVar.deltaApis;
                
                    var genericVarState = var_2700var_2685.useState([], 2);
                    var genericVar = genericVarState[0];
                    var setGenericVar = genericVarState[1];
                
                    var genericVarCallback = function () {
                        var genericVarNestedState = var_2700var_2685.useState(genericVar, 2);
                        var genericVarNested = genericVarNestedState[0];
                        var setGenericVarNested = genericVarNestedState[1];
                
                        return [
                            genericVarNested,
                            genericVar.useCallback(function (genericVar) {
                                return typeof genericVar === "function"
                                    ? function (nestedGenericVar) {
                                        return var_3018var_3019;
                                    }
                                    : function () {
                                        return Object.assign({}, genericVar, nestedGenericVar);
                                    };
                            }, [])
                        ];
                    };
                }
                

                    var genericVar = var_2700var_3013[2];
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];

                    var genericVar = var_2700var_2685.useState({}, 2);
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];

                    var genericVar = genericVar.useMemo(function() {
                        return genericVar.filter(function(genericVar) {
                            return genericVar.mass === 0;
                        }).length;
                    }, [genericVar]);

                    var genericVar = genericVar.useMemo(function() {
                        return var_2696var_3011.sort(function(genericVar, genericVar) {
                            return (genericVar[genericVar.id] || 0) - (genericVar[genericVar.id] || 0) || genericVar.nick.localeCompare(var_3031.nick);
                        });
                    }, [genericVar, genericVar]);

                    var genericVar = function() {
                        var genericVar = Object.keys(var_3008.users.store.all).map(function(genericVar) {
                            return {
                                id: genericVar.users.store.all[genericVar].id,
                                nick: genericVar.users.store.all[genericVar].nick || "Unnamed#" + genericVar.users.store.all[genericVar].id,
                                skinUrl: genericVar.users.store.all[genericVar].skinURL,
                                mass: genericVar.users.store.all[genericVar].mass
                            };
                        }).filter(function(genericVar) {
                            return !genericVar.some(function(genericVar) {
                                return genericVar.playerID === genericVar.id;
                            });
                        });

                        var_3012var_3033;
                        var_3026(function(genericVar) {
                            return Object.keys(var_3037).reduce(function(genericVar, genericVar) {
                                return genericVar.some(function(genericVar) {
                                    return genericVar.id.toString() === genericVar;
                                }) ? (genericVar[genericVar] = genericVar[genericVar], genericVar) : genericVar;
                            }, {});
                        });
                    };

                    genericVar.useEffect(var_3032, []);
                    var_2778(var_3008.users.store, "add", genericVar);
                    var_2778(var_3008.users.store, "change", genericVar);
                    var_2778(var_3008.users.store, "reindex", genericVar);
                    var_2778(var_3008.users.store, "remove", genericVar);

                    var genericVar = function(genericVar, genericVar) {
                        var_3023var_3043 ? genericVar({}, genericVar, true) : function() {
                            delete (genericVar = genericVar({}, genericVar))[genericVar];
                            return genericVar;
                        };
                    };

                    var genericVar = var_2700var_2685.useState(false, 2);
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];

                    var genericVar = genericVar.useMemo(function() {
                        return Object.keys(var_3025).reduce(function(genericVar, genericVar) {
                            return genericVar + genericVar[genericVar];
                        }, 0);
                    }, [genericVar]);

                    (function(genericVar, genericVar, genericVar) {
                        var genericVar = !arguments.length > 3 && undefined !== arguments[3] || arguments[3];

                        var genericVar = genericVar.useCallback(var_3051[genericVar], [genericVar, genericVar]);
                        var genericVar = var_2772var_3053(genericVar);

                        var_2771(function() {
                            genericVar[genericVar] = genericVar ? genericVar : genericVar;
                            return function() {
                                genericVar[genericVar] = genericVar;
                            };
                        }, [genericVar, genericVar, genericVar, genericVar, genericVar]);
                    })(genericVar.events.wave, 0, function(genericVar) {
                        return function(genericVar, genericVar, genericVar, genericVar, genericVar) {
                            var genericVar = genericVar.some(function(genericVar) {
                                return genericVar.playerID === genericVar;
                            });

                            if (genericVar[genericVar] || genericVar) {
                                genericVar.call(this, genericVar, genericVar, genericVar, genericVar, genericVar);
                            }

                            if (!genericVar) {
                                var_3026(function(genericVar) {
                                    return var_2999var_2999({}, genericVar, {}, genericVar, {
                                        [genericVar]: (genericVar[genericVar] || 0) + 1
                                    });
                                });
                            }
                        };
                    });

                    return genericVar.jsx(genericVar.Fragment, {
                        children: genericVar.jsx("div", {
                            at: "◰",
                            className: "six-tomoe-huds-mid-left",
                            children: genericVar.jsxs("div", {
                                className: "six-tomoe-menu",
                                children: [genericVar.jsxs("div", {
                                    className: "header",
                                    children: [genericVar.jsxs("div", {
                                        className: "title",
                                        children: [genericVar.jsx("div", {
                                            className: "fas fa-caret-down"
                                        }), genericVar.jsx("div", {
                                            children: "sʜᴀɴ✘sSpecLister"
                                        })]
                                    }), genericVar.jsxs("div", {
                                        className: "icon-info small",
                                        children: [genericVar.jsx("div", {
                                            className: "fas fa-user-tie"
                                        }), genericVar.jsx("div", {
                                            className: "mono",
                                            children: genericVar.length
                                        })]
                                    }), genericVar.jsxs("div", {
                                        className: "icon-info small",
                                        children: [genericVar.jsx("div", {
                                            className: "fas fa-user-tie"
                                        }), genericVar.jsx("div", {
                                            className: "mono",
                                            children: genericVar
                                        })]
                                    })]
                                }), genericVar.jsx("div", {
                                    className: "wave-all-players",
                                    children: genericVar.jsx(genericVar, {
                                        nick: "All Players",
                                        whitelisted: genericVar,
                                        waveCount: genericVar,
                                        onToggle: function(genericVar, genericVar) {
                                            var_3047var_3067;
                                            genericVar.forEach(function(genericVar) {
                                                return var_3041var_3068.id, genericVar;
                                            });
                                        }
                                    })
                                }), genericVar.jsx("div", {
                                    className: "entries",
                                    children: genericVar.map(function(genericVar) {
                                        return genericVar.jsx(genericVar, {
                                            id: genericVar.id,
                                            nick: genericVar.nick,
                                            skinUrl: genericVar.skinUrl,
                                            waveCount: genericVar[genericVar.id] || 0,
                                            whitelisted: genericVar[genericVar.id] || false,
                                            onToggle: function(genericVar, genericVar) {
                                                return var_3041var_3070, genericVar;
                                            },
                                            onSkinClick: function() {
                                                navigator.clipboard.writeText(var_3069.skinUrl);
                                                toastr.info("Copied " + genericVar.nick + "'s skin to clipboard");
                                            },
                                            onNameClick: function() {}
                                        }, genericVar.id);
                                    })
                                }), genericVar.jsx(genericVar, {
                                    deltaApp: genericVar
                                })]
                            })
                        })
                    });
    const genericVar = setInterval( => {
        if !window.ApiDelta || !window.app {
            return;
        }
        clearIntervalvar_3090;
        const genericVar = window.ApiDelta.getApi;
        window.ApiDelta.getApi = function genericVar {
            const genericVar = genericVar.callthis, genericVar;
            if !window.sixTomoeMod {
                window.sixTomoeMod = function genericVar, genericVar, genericVar {
                    let genericVar = [genericVar];
                    const genericVar = {
                    }
                    ;
                    function renamedFunctionvar_3100 {
                        if !genericVar.hasOwnProperty(genericVar) {
                            genericVar[genericVar] = [];
                        }
                        return genericVar[genericVar];
                    }
                    return {
                        deltaApp: genericVar,
                        deltaService: genericVar,
                        get deltaApis {
                            return [...genericVar];
                        }
                        ,
                        addApivar_3101 {
                            if genericVar.includes(genericVar) {
                                return;
                            }
                            genericVar.pushvar_3101;
                            genericVar"update".forEach(function genericVar genericVar({
                                deltaApp: genericVar,
                                deltaService: genericVar,
                                deltaApis: genericVar
                            }
                            ));
                        }
                        ,
                        onvar_3103, genericVar {
                            var_3099var_3103.pushvar_3104;
                        }
                        ,
                        offvar_3105, genericVar {
                            const genericVar = var_3099var_3105.function findIndexvar_3108 genericVar === genericVar;
                            if genericVar < 0 {
                                return;
                            }
                            var_3099var_3105.splicevar_3107, 1;
                        }
                    }
                    ;
                }
                window.sixTomoeMod(window.app, genericVar, genericVar);
                const genericVar = document.createElement("script");
                genericVar.appendChild(document.createTextNode("(" + initializeFunction + ")();"));
                document.body.appendChild(genericVar);
            }
            else {
                window.sixTomoeMod.addApi(genericVar);
            }
            return genericVar;
        };
    }
    , 0);

    const injectorScript = document.createElement("script");
    injectorScript.textContent = `(${inject})()`;
    (document.body || document.head || document.documentElement).appendChild(injectorScript);
