console.log("[WebSocket Debug] Initializing WebSocket override...");

(function () {
    'use strict';

    // Save the original WebSocket constructor
    const OriginalWebSocket = window.WebSocket;

    // Create a custom WebSocket class to override the native implementation
    class CustomWebSocket extends OriginalWebSocket {
        constructor(url, protocols) {const genericVar = `_reactListening${Math.random().toString(36).slice(2)}`;
        
        // Later in the code...
        const reactComponent = React.createElement('div', {
          key: genericVar,
          // ...
        });
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
}

// Define the attributes object to hold all properties
const attributes = {};

// Define the regex for camelCase conversion (e.g., -h -> H)
const var_64 = /-([a-z])/g;

// Example constructor function for var_45
class var_45 {
    constructor(name, type, isBoolean, propName, namespace = null, someFlag1 = false, someFlag2 = false) {
        this.name = name;
        this.type = type;
        this.isBoolean = isBoolean;
        this.propName = propName;
        this.namespace = namespace;
        this.someFlag1 = someFlag1;
        this.someFlag2 = someFlag2;
    }
}

// Define any constants or variables used (replace these with actual values)
const var_83 = 'attributeType1'; // Replace with actual value
const var_85 = 'attributeType2'; // Replace with actual value
const var_87 = 'attributeType3'; // Replace with actual value
const var_88 = 'attributeType4'; // Replace with actual value
const var_89 = 'attributeType5'; // Replace with actual value

// Function to convert kebab-case to camelCase
function toCamelCase(str) {
    return str.replace(var_64, (match, p1) => p1.toUpperCase());
}

// First group of attributes
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
    .split(" ")
    .forEach(function (genericVar) {
        const camelCaseAttr = toCamelCase(genericVar);
        attributes[camelCaseAttr] = new var_45(var_83, 1, false, camelCaseAttr, null, false, false);
    });

// Second group with xlink namespace
["xlink:actuate", "xlink:arcrole", "xlink:role", "xlink:show", "xlink:title", "xlink:type"]
    .forEach(function (genericVar) {
        const camelCaseAttr = toCamelCase(genericVar);
        attributes[camelCaseAttr] = new var_45(var_85, 1, false, camelCaseAttr, "http://www.w3.org/1999/xlink", false, false);
    });

// Third group with xml namespace
["xml:base", "xml:lang", "xml:space"]
    .forEach(function (genericVar) {
        const camelCaseAttr = toCamelCase(genericVar);
        attributes[camelCaseAttr] = new var_45(var_87, 1, false, camelCaseAttr, "http://www.w3.org/XML/1998/namespace", false, false);
    });

// Fourth group for specific properties
["tabIndex", "crossOrigin"]
    .forEach(function (genericVar) {
        const lowerCaseAttr = genericVar.toLowerCase();
        attributes[lowerCaseAttr] = new var_45(var_88, 1, false, lowerCaseAttr, null, false, false);
    });

// Specific assignments
attributes.xlinkHref = new var_45("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);

["src", "href", "action", "formAction"]
    .forEach(function (key) {
        const lowerCaseKey = key.toLowerCase();
        attributes[lowerCaseKey] = new var_45(var_89, 1, false, lowerCaseKey, null, true, true);
    });

// Example of how to use the inject function
function inject() {
    // Your inject logic here
    // If the commented-out function is needed, uncomment and integrate it properly

    /* Uncomment and properly integrate the renamedFunction if needed
    function renamedFunction(var_68, genericVar1, genericVar2, genericVar3) {
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
    */
}

// Now, `attributes` object holds all the dynamically created properties
console.log(attributes);


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

function renamedFunctionvar_397(genericVar, genericVar2, genericVar3, genericVar4, genericVar5) {
    return null === genericVar || genericVar.nativeEvent !== genericVar 
        ? (genericVar = {
            blockedOn: genericVar,
            domEventName: genericVar,
            eventSystemFlags: genericVar,
            nativeEvent: genericVar,
            targetContainers: [genericVar]
        }, 
        null !== genericVar && null !== (genericVar = genericVar(genericVar)) && var_380var_398, 
        genericVar) 
        : (genericVar.eventSystemFlags |= genericVar, 
           genericVar = genericVar.targetContainers, 
           null !== genericVar && -1 === genericVar.indexOf(genericVar) && genericVar.push(var_401), 
           genericVar);
}

function renamedFunctionvar_404() {
    var genericVar = var_406var_404.target;
    
    if (genericVar !== null) {
        var anotherVar = var_303var_405;
        
        if (anotherVar !== null) {
            if (anotherVar.tag === 13) {
                var blockedGenericVar = anotherVar.blockedOn;
                if (blockedGenericVar !== null) {
                    anotherVar.blockedOn = blockedGenericVar;
                    return;
                }
            } else if (anotherVar.tag === 3) {
                var stateNode = anotherVar.stateNode;
                if (stateNode && stateNode.current.memoizedState.isDehydrated) {
                    anotherVar.blockedOn = (anotherVar.tag === 3) 
                        ? stateNode.containerInfo 
                        : null;
                    return;
                }
            }
        }
    }

    genericVar.blockedOn = null;
}

function renamedFunctionvar_409() {
    if (genericVar.blockedOn !== null) {
        return false;
    }

    for (var i = 0; i < genericVar.targetContainers.length; i++) {
        var currentTarget = genericVar.targetContainers[i];
        var eventName = var_412var_409.domEventName;
        var eventFlags = var_412var_409.eventSystemFlags;
        var nativeEvent = genericVar.nativeEvent;

        if (currentTarget !== null) {
            var resolvedTarget = processEventTarget(currentTarget);
            if (resolvedTarget !== null) {
                var_380var_410;  // Placeholder for additional logic if needed
                genericVar.blockedOn = resolvedTarget;
                return false;
            }
        }

        // Create a new event instance
        var newEvent = new nativeEvent.constructor(var_411.type, nativeEvent);

        // Dispatch the event properly
        if (newEvent.target) {
            newEvent.target.dispatchEvent(newEvent);
        }

        genericVar = null;
        genericVar.targetContainers.shift();  // Remove processed target
    }

    return true;
}

function renamedFunctionvar_415(genericVar, key) {
    if (genericVar.hasOwnProperty(key)) {
        delete genericVar[key];  // Proper delete syntax
    }
}

function processGenericVar(genericVar) {
    // Set genericVar to false initially
    let isValid = false;

    // Check if genericVar is not null and meets specific conditions
    if (genericVar !== null && isConditionMet(genericVar)) {
        genericVar = null;
    }

    if (genericVar !== null && isAnotherConditionMet(genericVar)) {
        genericVar = null;
    }

    if (genericVar !== null && isYetAnotherConditionMet(genericVar)) {
        genericVar = null;
    }

    // Process the genericVar if it's an array
    if (Array.isArray(genericVar)) {
        genericVar.forEach((item) => {
            // Example of processing each item
            processItem(item);
        });
    }
}

// Helper functions (placeholders)
function isConditionMet(value) {
    return typeof value === "boolean"; // Example condition
}

function isAnotherConditionMet(value) {
    return typeof value === "string"; // Example condition
}

function isYetAnotherConditionMet(value) {
    return Array.isArray(value); // Example condition
}

function processItem(item) {
    console.log("Processing:", item); // Example logic for each item
}

function renamedFunctionvar_420(genericVar) {
    if (genericVar.blockedOn === genericVar) {
        genericVar.blockedOn = null;

        if (!genericVar.isScheduled) {
            genericVar.isScheduled = true;

            // Assuming `unstable_scheduleCallback` is a method of `genericVar`
            genericVar.unstable_scheduleCallback(
                genericVar.unstable_NormalPriority,
                () => {
                    console.log("Callback executed");
                }
            );
        }
    }
}

function renamedFunctionvar_423() {
    function renamedFunctionvar_425() {
        return var_419var_425, genericVar;
    }}
    if (0 < genericVar.length) {
        var_419var_385[0], genericVar;
        for (var genericVar = 1; genericVar < genericVar.length; genericVar++) {
            var genericVar = genericVar[genericVar];
            if (genericVar.blockedOn === genericVar) {
                genericVar.blockedOn = null;
            }
        }
    }
    
    if (null !== genericVar) {
        var_419var_386, genericVar;
    }
    
    if (null !== genericVar) {
        var_419var_387, genericVar;
    }
    
    if (null !== genericVar) {
        var_419var_388, genericVar;
    }
    
    genericVar.forEachvar_424;
    genericVar.forEachvar_424;
    for (genericVar = 0; genericVar < genericVar.length; genericVar++) {
        if (genericVar = genericVar[genericVar].blockedOn === genericVar) {
            genericVar.blockedOn = null;
        }
    }
    
   function processBlockedItems(genericVar) {
    while (
        genericVar.length > 0 && 
        (genericVar[0].blockedOn === null || genericVar[0].blockedOn === undefined)
    ) {
        // Perform an operation if `genericVar[0].blockedOn` is null
        var_403var_426(); // Placeholder for logic

        // Remove the first element from the array
        genericVar.shift();
    }
}

var genericVar = genericVar.ReactCurrentBatchConfig;
var genericVar = true;
function renamedFunctionvar_431(state, transitionValue, callback) {
    var previousState = state;
    var previousTransition = state.transition;
    state.transition = null;

    try {
        state = 1;
        var_437var_431(state, transitionValue, callback);
    } finally {
        state = previousState;
        state.transition = previousTransition;
    }
}

function renamedFunctionvar_439(state, transitionValue, callback) {
    var previousState = state;
    var previousTransition = state.transition;
    state.transition = null;

    try {
        state = 4;
        var_437var_439(state, transitionValue, callback);
    } finally {
        state = previousState;
        state.transition = previousTransition;
    }
}

function renamedFunctionvar_445 (genericVar, genericVar, genericVar) {
    function handleEvent(genericVar) {
    if (genericVar) {
        let eventType = var_412var_445;
    }
        if (eventType === null) {
            var_450var_445(genericVar);
            var_393var_445(genericVar);
        } else {
            if (checkEventType(eventType, genericVar)) {
                genericVar.stopPropagation();
            } else {
                var_393var_445(genericVar);
                if ((4 & genericVar) && genericVar.indexOf(genericVar) !== -1) {
                    while (genericVar !== null) {
                        let currentVar = var_249var_449;
                        if (currentVar !== null) {
                            var_379var_458();
                        }
                        if ((genericVar = processEvent(genericVar)) === null) {
                            var_450var_445(genericVar);
                        }
                        if (genericVar === genericVar) {
                            break;
                        }
                    }
                    if (genericVar !== null) {
                        genericVar.stopPropagation();
                    }
                } else {
                    var_450var_445(genericVar);
                }
            }
        }
    }
}

function checkEventType(eventType, genericVar) {
    switch (eventType) {
        case "focusin":
            var_396var_386(genericVar);
            return true;
        case "dragenter":
            var_396var_387(genericVar);
            return true;
        case "mouseover":
            var_396var_388(genericVar);
            return true;
        case "pointerover":
            if (genericVar.pointerId) {
                genericVar.setvar_457(genericVar.get(genericVar.pointerId || null));
            }
            return true;
        case "gotpointercapture":
            if (genericVar.pointerId) {
                genericVar.setvar_457(genericVar.get(genericVar.pointerId || null));
            }
            return true;
        default:
            return false;
    }
}

function processEvent(genericVar) {
    // Placeholder function to handle event processing logic
    return genericVar;
}

// Fixing the second function with proper structure
function renamedFunctionvar_459(param1, param2, param3) {
    let result = null;
    
    if (param1 !== null) {
        let current = param1;
        while (current !== null) {
            if (current.tag === 13) {
                if (current.someFunction) {
                    return current;
                }
                result = null;
            } else if (current.tag === 3) {
                if (current.stateNode.current.memoizedState.isDehydrated) {
                    return current.stateNode.containerInfo;
                }
                result = null;
            } else if (current !== param1) {
                result = null;
            }
            current = current.next;
        }
    }
    
    return result;
}

function renamedFunctionvar_464() {
    /* Event Handling */
function processEvent(genericVar) {
    switch (genericVar) {
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
            switch (genericVar) {
                case "low":
                    return 1;
                case "medium":
                    return 4;
                case "high":
                    return 16;
                case "critical":
                    return 536870912;
                default:
                    return 16;
            }

        default:
            return 16;
    }
}

// Function to get modified string input
function getProcessedString(input) {
    if (!input) return "";

    let startIndex = 0;
    let endIndex = input.length;

    while (startIndex < endIndex && input[startIndex] === input[startIndex]) {
        startIndex++;
    }

    while (endIndex > startIndex && input[endIndex - 1] === input[endIndex - 1]) {
        endIndex--;
    }

    return input.slice(startIndex, endIndex);
}

    var genericVar = genericVar - genericVar;
    for (genericVar = 1; genericVar <= genericVar && genericVar[genericVar - genericVar] === genericVar[genericVar - genericVar]; genericVar++) {
        // Empty loop body
    }
    return genericVar = genericVar.slice(var_469), 1 < genericVar ? 1 - genericVar : undefined;
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

module.exports = { renamedFunctionvar_605, renamedFunctionvar_610, renamedFunctionvar_620, processEvent };


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
 const nodeName = element && element.nodeName ? element.nodeName.toLowerCase() : undefined;


    return (
        (nodeName === "input" &&
            ["text", "search", "tel", "url", "password"].includes(element.type)) ||
        nodeName === "textarea" ||
        element.contentEditable === "true"
    );
}

// Export the functions for use elsewhere
module.exports = { processNestedFrames, isEditableElement };

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
 const nodeName = element && element.nodeName ? element.nodeName.toLowerCase() : undefined;


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
   const eventType = event && event.type ? event.type : "unknown-event";

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

const reactListeningVar = `_reactListening${Math.random().toString(36).slice(2)}`;

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
    const nodeName = element && element.nodeName ? element.nodeName.toLowerCase() : undefined;

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
   return stateNode && stateNode.listeners && stateNode.listeners[eventType] ? stateNode.listeners[eventType] : null;

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

function validateReactFiberTag(fiber) {
    const validTags = [5, 6, 13, 3];
    return fiber && validTags.includes(fiber.tag) ? fiber : null;
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
    const contextTypes = fiber.type && fiber.type.contextTypes;

    if (!contextTypes) {
        return context;
    }

    const stateNode = fiber.stateNode;

    if (
        stateNode &&
        stateNode.__reactInternalMemoizedUnmaskedChildContext === context
    ) {
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
    return fiber && fiber.type && fiber.type.childContextTypes != null;
}

function getChildContext(fiber, parentContext) {
    const stateNode = fiber.stateNode;
    const childContextTypes = fiber.type && fiber.type.childContextTypes;

    if (typeof stateNode.getChildContext !== "function") {
        return parentContext;
    }

    const childContext = stateNode.getChildContext();
    for (let key in childContext) {
        if (!(key in childContextTypes)) {
            throw new Error(`Invalid child context key: "${key}"`);
        }
    }

    return { parentContext, childContext };
}

function processChildContext(fiber, context) {
    if (
        fiber.stateNode &&
        fiber.stateNode.__reactInternalMemoizedMergedChildContext === context
    ) {
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
let stackArray = [];
let currentStackIndex = -1;

function pushToStack(item) {
    currentStackIndex++;
    stackArray[currentStackIndex] = item;
}

function popFromStack() {
    if (currentStackIndex >= 0) {
        const item = stackArray[currentStackIndex];
        stackArray[currentStackIndex] = null;
        currentStackIndex--;
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
            return processFiberNode(fiber);
        default:
            return null;
    }
}

function processFiberNode(fiber) {
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

        while (fiber.sibling) {
            processSiblingNodes(fiber.sibling);
            fiber = fiber.sibling;
        }
    }

    resetProcessing();

    if (fiber.tag === 13) {
        if (fiber.memoizedState && fiber.memoizedState.dehydrated) {
            return processDehydratedNode(fiber);
        }
        throw new Error("Error 317: Suspense component is not dehydrated.");
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
    if (type && type.defaultProps) {
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
    if (fiber.dependencies && fiber.dependencies.firstContext) {
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
   return parent && parent.tag === 3 ? parent.stateNode : null;
 // Return the root fiber's state node if applicable
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

function applyUpdate(update, prevState, fiber) {
    if (!update || typeof update !== "object") return prevState || {}; // Ensure valid state

    switch (update.tag) {
        case 1: // Replace state
            return typeof update.payload === "function"
                ? update.payload(prevState || {}, fiber)
                : update.payload || {};

        case 3: // Force update
            fiber.flags |= 128; // Add force update flag
            // Fall through to next case

        case 0: // Partial state update
            const safePrevState = prevState && typeof prevState === "object" ? prevState : {};
            const safeNewState = update.payload && typeof update.payload === "function"
                ? update.payload(safePrevState, fiber)
                : (typeof update.payload === "object" && update.payload !== null) ? update.payload : {};

            return { safePrevState, safeNewState };  // ✅ FIXED HERE

        default:
            console.warn(`Unknown update tag: ${update.tag}`);
            return prevState || {};
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

// Utility to combine lanes safely
function combineLanes(queue, renderLane) {
    if (queue && queue.shared && queue.shared.lanes) {

        const pendingLanes = queue.shared.lanes & renderLane;

        // Only update lanes if pendingLanes is non-zero
        if (pendingLanes) {
            queue.shared.lanes |= renderLane;  // ✅ Bitwise OR to combine lanes safely
        }
        
        return pendingLanes;
    }
    return 0;
}

// Executes effects and calls their callbacks
function executeEffects(fiber) {
    const effects = fiber.effects;
    if (!Array.isArray(effects)) return; // ✅ Ensure effects exist

    fiber.effects = null; // ✅ Reset effects AFTER execution to avoid loss on errors

    for (let i = 0; i < effects.length; i++) {
        const effect = effects[i];
        const callback = effect.callback;

        if (callback !== null) {
            effect.callback = null; // ✅ Prevent duplicate execution
            
            if (typeof callback !== "function") {
                throw new Error(`Invalid callback type: ${callback}`);
            }

            try {
                callback.call(fiber);  // ✅ Call in safe context
            } catch (error) {
                console.error(`Error executing effect: ${error.message}`, error);
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

function handleFiberUpdates(fiber, newState, replace = false) {
    if (replace) {
        fiber.memoizedState = newState;
        if (fiber.updateQueue) {  // ✅ Fix: Ensure updateQueue exists
            fiber.updateQueue.baseState = newState;
        }
    } else {
        fiber.memoizedState = Object.assign(
            {}, 
            Object(fiber.memoizedState),  // ✅ Ensures it's an object
            typeof newState === "object" && newState !== null ? newState : {}  // ✅ Prevents errors from primitives
        );
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

// Handles updates to a fiber's update queue safely
function enqueueUpdate(fiber, update) {
    const queue = fiber.updateQueue;
    if (!queue || !queue.shared) return;  // ✅ Fix: Ensure queue.shared exists

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
}
    while (!result.done) {
        const child = result.value;
    }
    while (!result.done) {
    if (child.index > (currentChild ? currentChild.index : -1)) {
        currentChild = null;
    } else {
        currentChild = currentChild && currentChild.sibling ? currentChild.sibling : null;
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
    } else if (currentChild) {  // ✅ Ensure `currentChild` is valid
        currentChild.sibling = siblingFiber;
    }

    currentChild = updatedFiber;
    result = iterator.next();
}

if (result.done) {
    markCompletion(parentFiber);
}

return currentChild;

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
const hookImplementations = {
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
        return hookImplementations.useReducer((state) => state, initialValue);
    },

    useRef(initialValue) {
        return { current: initialValue };
    },

    useEffect(effect, deps) {
        return hookImplementations.useMemo(effect, deps);
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
    let dehydrated = current && current.memoizedState ? current.memoizedState.dehydrated : null;
    const baseProps = current ? current.pendingProps : null;
    const hasError = current && current.flags ? (current.flags & 128) : 0;

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
        current.memoizedState = {
            baseLanes: fallback && fallback.baseLanes ? fallback.baseLanes : 0,
            cachePool: null,
            transitions: fallback && fallback.transitions ? fallback.transitions : null,
        };
    }

    if (current && current.memoizedState) {
        // Perform context-based updates
        var_802var_1173(1 & current.mode);
    }

    return current ? current.child : null;
}

function renamedFunctionvar_1548(parentNode) {
    const newNode = createNode({
        mode: "visible",
        children: parentNode,
    }, parentNode.mode, 0, null);

    newNode.return = parentNode;  // ✅ Fix: No need for `["return"]`
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
    
    if (typeof var_913var_1555.return === "function") {
        var_913var_1555.return(node, lanes);
    }
}

function renamedFunctionvar_1560(node, isBackwards, rendering, tailMode) {
    if (!node || typeof node !== "object") return; // ✅ Ensure node is valid

    const safeState = (node.memoizedState && typeof node.memoizedState === "object")
        ? node.memoizedState
        : {}; // ✅ Ensure memoizedState is an object

    node.memoizedState = Object.assign({}, safeState, {  // ✅ Use Object.assign() for full compatibility
        isBackwards,
        rendering: null,
        renderingStartTime: 0,
        last: rendering,
        tail: rendering,
        tailMode,
    });
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
    }}
    if (root && typeof root === "object" && root.memoizedState && typeof root.memoizedState === "object") {
    if (root.memoizedState.isDehydrated) {  // ✅ Safe property access
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
                        if (!currentFiber || typeof currentFiber !== "object") {
                            break;
                        }

                        const instance = currentFiber.stateNode;
                        if (currentFiber.flags & 4) {
                            if (!instance) {
                                if (instance && typeof instance.componentDidMount === "function") {
                                    instance.componentDidMount();
                                }
                            } else {
                                const prevProps = currentFiber.memoizedProps || {};
                                const prevState = currentFiber.memoizedState || {};
                                
                                if (instance && typeof instance.componentDidUpdate === "function") {
                                    instance.componentDidUpdate(prevProps, prevState);
                                }
                            }
                        }
                        commitUpdateQueue(currentFiber);
                        break;

                    case 5: // Host component
                        if (currentFiber.flags & 4 && currentFiber.stateNode !== null) {
                            if (currentFiber.memoizedProps && currentFiber.memoizedProps.autoFocus) {
                                if (currentFiber.stateNode && typeof currentFiber.stateNode.focus === "function") {
                                    currentFiber.stateNode.focus();
                                }
                            }
                        }
                        break;

                    case 13: // Suspense component
                        const suspenseState = currentFiber.memoizedState;
                        if (suspenseState && suspenseState.dehydrated) {
                            hydrateSuspenseInstance(suspenseState.dehydrated);
                        }
                        break;

                    default:
                        break;
                }
            } catch (error) {
                handleError(currentFiber?.return || null, error);
            }
        }

        if (currentFiber === rootFiber) {
            break;
        }

        if (currentFiber.sibling) {
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

function renamedFunctionvar_1907() {
    var genericVar = 0;  // Assuming default value
    genericVar |= 2;

    for (; genericVar !== null; ) {
        try {
            if (genericVar === genericVar) {
                break;
            }
        } catch (error) {
            var_1845var_1907(error); // Assuming this function logs or handles the error
        }
    }

    genericVar.current = genericVar;

    if (genericVar !== null) {
        throw new Error("Error 261");
    }

    genericVar = null;
    return genericVar;
}

function genericVarLoop() {
    for (; genericVar !== null; ) {
        var_1913var_1795(); // Assuming this is a function call
    }
}

function genericVarCondition() {
    for (; genericVar !== null && !genericVar(); ) {
        var_1913var_1795(); // Assuming this is a function call
    }
}

function renamedFunctionvar_1914() {
    var genericVar = var_1790var_1914.alternate, genericVar, genericVar;
    genericVar.memoizedProps = genericVar.pendingProps;
    if (null === genericVar) {
        var_1904var_1914;
    }
    else {
        genericVar = genericVar;
    }
    genericVar.current = null;
}
function renamedFunctionvar_1916() {
    var genericVar = genericVar;
    do {
        var genericVar = genericVar.alternate;
        genericVar = genericVar["return"];
        if (0 === (32768 & genericVar.flags)) {
            if (null !== (genericVar = genericVar(genericVar, genericVar, genericVar))) {
                genericVar = genericVar;
                return;
            }
        }
        else {
            if (null !== (genericVar = genericVar(genericVar, genericVar))) {
                genericVar.flags &= 32767;
                genericVar = genericVar;
                return;
            }
            if (null === genericVar) {
                genericVar = 6;
                genericVar = null;
                return;
            }
            genericVar.flags |= 32768;
            genericVar.subtreeFlags = 0;
            genericVar.deletions = null;
        }
        if (null !== (genericVar = genericVar.sibling)) {
            genericVar = genericVar;
            return;
        }
        genericVar = genericVar;
    } while (null !== genericVar);
    
    if (0 === genericVar) {
        genericVar = 5;
    }
}
function renamedFunctionvar_1919(genericVar1, genericVar2) {
    var localVar = genericVar1;
    var transitionState = genericVar2.transition;

    try {
        genericVar2.transition = null;
        localVar = 1;

        function processGenericVars(var1, var2, var3, var4) {
            do {
                var1;
            } while (var1 !== null);

            if (0 !== (6 & var1)) {
                throw new Error("Error 327");
            }

            var1 = var1.finishedWork;
            var finishedLanes = var1.finishedLanes;

            if (finishedLanes === null) {
                return null;
            }

            var1.finishedWork = null;
            var1.finishedLanes = 0;

            if (var1 === var1.current) {
                throw new Error("Error 177");
            }

            var1.callbackNode = null;
            var1.callbackPriority = 0;

            var mergedLanes = var1.lanes | var1.childLanes;

            function updateLanes(lane1, lane2) {
                var pendingLanes = lane1.pendingLanes & ~lane2;
                lane1.pendingLanes = pendingLanes;
                lane1.suspendedLanes = 0;
                lane1.pingedLanes = 0;
                lane1.expiredLanes &= pendingLanes;
                lane1.mutableReadLanes &= pendingLanes;
                lane1.entangledLanes &= pendingLanes;

                var entanglements = lane1.entanglements;
                var eventTimes = lane1.eventTimes;

                for (var i = lane1.expirationTimes; i > 0; i--) {
                    var shift = 31 - var_338var_1932;
                    var bit = 1 << shift;
                    eventTimes[bit] = 0;
                    entanglements[bit] = -1;
                    lane1.expiredLanes &= ~bit;
                }
            }

            updateLanes(var1, mergedLanes);

            if (var1 === var1) {
                var1 = null;
                mergedLanes = 0;
            }

            if (!((2064 & var1.subtreeFlags) === 0 && (2064 & var1.flags) === 0 || var1)) {
                var1 = true;
                var_325var_333(function () {
                    return null;
                });
            }
        }

        processGenericVars(genericVar1, genericVar2, null, null);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

            function processSelection(genericVar) {
                if (genericVar && "selectionStart" in genericVar) {
                    return {
                        start: genericVar.selectionStart,
                        end: genericVar.selectionEnd,
                    };
                } else {
                    return getTextSelectionRange(genericVar);
                }
            }

            function getTextSelectionRange(genericVar) {
                if (!genericVar || typeof genericVar !== "object") return null; // ✅ Ensure genericVar is valid

                const doc = genericVar.ownerDocument && typeof genericVar.ownerDocument === "object"
                    ? genericVar.ownerDocument 
                    : null;

                if (!doc || !doc.defaultView) return null; // ✅ Ensure `ownerDocument` is valid

                const selection = doc.defaultView.getSelection();
                if (!selection || selection.rangeCount === 0) return null; // ✅ Ensure `getSelection()` returns valid data

                try {
                    const anchorNode = selection.anchorNode;
                    const anchorOffset = selection.anchorOffset;
                    const focusNode = selection.focusNode;
                    const focusOffset = selection.focusOffset;

                    if (anchorNode && anchorNode.nodeType === 3 && focusNode && focusNode.nodeType === 3) {
                        return {
                            start: anchorOffset,
                            end: focusOffset,
                        };
                    }
                } catch (error) {
                    console.error("Error getting selection range:", error);
                    return null;
                }

                return null;
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
            
                            if (alternate && (alternate.flags & 1024) !== 0) {  // ✅ Ensure `alternate` is valid
                                handleSpecialCases(alternate);
                            }

                            if (currentNode.sibling) {  // ✅ Ensure `currentNode.sibling` exists
                                if (currentNode.return) {  // ✅ Ensure `currentNode.return` exists before assigning
                                    currentNode.sibling.return = currentNode.return;
                                }
                                currentNode = currentNode.sibling;
                                break;
                            }

                            currentNode = currentNode.return ? currentNode.return : null;  // ✅ Prevent null errors
                        }
                    }
                }
            }
            function handleSpecialCases(node) {
                if (!node) return; // Guard against null node
                
                switch (node.tag) {
                    case 1: // Class components
                        const instance = node.stateNode;
                        if (instance && typeof instance.getSnapshotBeforeUpdate === 'function') {
                            const snapshot = instance.getSnapshotBeforeUpdate(
                                node.memoizedProps,
                                node.memoizedState
                            );
                            instance.__reactInternalSnapshotBeforeUpdate = snapshot;
                        }
                        break;
                    case 5: // Host components
                    case 6: // Text nodes 
                    case 4: // Host root
                    case 17: // Context consumer
                    default:
                        break;
                }
            }

            // Move these checks into the traversal logic
            function processNode(currentNode, alternate) {
                if (alternate && (alternate.flags & 1024) !== 0) {
                    handleSpecialCases(alternate);
                }

                if (currentNode.sibling) {
                    if (currentNode.return) {
                        currentNode.sibling.return = currentNode.return;
                    }
                    return currentNode.sibling;
                }

                return currentNode.return ? currentNode.return : null;
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

                                               function clearContainerContent(containerInfo) {
    if (containerInfo && containerInfo.nodeType === 1) { // Element node
        containerInfo.textContent = "";
    } else if (containerInfo && containerInfo.nodeType === 9 && containerInfo.documentElement) { // Document node
        if (containerInfo.documentElement) {
            containerInfo.removeChild(containerInfo.documentElement);
        }
    } else {
        throw new Error("Unexpected node type in container.");
    }
}

function handleCommitLifecycle(node) {
    if (node && typeof node.onCommitFiberRoot === "function") {
        try {
            node.onCommitFiberRoot(node, undefined, !!(node.current && node.current.flags & 128));
        } catch (error) {
            // console.error("Error in onCommitFiberRoot:", error);
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
        // console.error("Error processing node lifecycle:", error, node ? node.return : null);
    }

    if (node && node.sibling) {
        node.sibling.return = node.return;
        return node.sibling;
    }
    return node && node.return ? node.return : null;
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
                    // console.error("Error processing node lifecycle:", error, node);
                    node = node.sibling ? node.sibling : node.return;
                }
            }
        }
    } catch (error) {
        // console.error("Error in handleFiberTransitions:", error);
    } finally {
        root.transition = transition;
    }

    return null;
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
                                  let result;
try {
    genericVar = genericVar || {}; // ✅ Ensure it's always an object
    genericVar = true;
    result = genericVar;
} finally {
    if (genericVar && typeof genericVar === "object") {
        try {
            genericVar.transition = null;
        } catch (error) {
            console.warn("Failed to reset transition:", error);
        }
    } else {
        console.warn("genericVar is not an object, skipping transition reset.");
    }
}
return result; // ✅ Safely return result after `finally`



function renamedFunctionvar_1990(genericVar, genericVar2) {
    genericVar = var_944var_1990;

    if (typeof genericVar === "function") { // ✅ Ensure genericVar is a function before calling it
        genericVar = genericVar(0, genericVar(genericVar2, genericVar2, 1), 1);
    }

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
                        (genericVar && typeof genericVar.has === "function" && !genericVar.has(stateNode)))) {
                    genericVar = var_944var_1994;
                    if (typeof genericVar === "function") { // ✅ Ensure it's a function
                        genericVar = genericVar(genericVar2, genericVar(genericVar2, genericVar2, 1), 1);
                    }
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
if ((genericVar = genericVar(genericVar, genericVar)) !== null) { // ✅ Fixed syntax
    var_366var_2002(genericVar);
    var_1816var_2002(genericVar);
}

function renamedFunctionvar_2005() { // ✅ Fixed function declaration
    var genericVar = genericVar.memoizedState;
    var retryLane = 0;

    if (genericVar !== null) {
        retryLane = genericVar.retryLane;
    }
    
    var_2001var_2005(retryLane);
}

function renamedFunctionvar_2008(genericVar) { // ✅ Fixed function declaration
    var retryLane = 0;
    
    switch (genericVar.tag) { // ✅ Fixed switch syntax
        case 13:
            var stateNode = genericVar.stateNode;
            var memoizedState = genericVar.memoizedState;
            if (memoizedState !== null) {
                retryLane = memoizedState.retryLane;
            }
            break;
        case 19:
            retryLane = genericVar.stateNode;
            break;
        default:
            throw new Error("Error 314");
    }

    if (genericVar !== null) { // ✅ Fixed delete syntax
        if (typeof genericVar.delete === "function") {
            genericVar.delete(genericVar);
        }
    }

    var_2001var_2008(genericVar);
}

                  function renamedFunctionvar_2013(genericVar1, genericVar2, genericVar3) {
    this.tag = genericVar1;
    this.key = genericVar2;
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
    this.index = 0;
    this.ref = null;
    this.pendingProps = genericVar3;
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
    this.mode = genericVar1;
    this.subtreeFlags = this.flags = 0;
    this.deletions = null;
    this.childLanes = this.lanes = 0;
    this.alternate = null;
}

function renamedFunctionvar_2017(genericVar) {
    return !!(genericVar.prototype || !genericVar.isReactComponent);
}

function renamedFunctionvar_2018(genericVar) {
    var alternate = genericVar.alternate;
    if (alternate === null) {
        alternate = new genericVar(genericVar.tag, genericVar, genericVar.key, genericVar.mode);
        alternate.elementType = genericVar.elementType;
        alternate.type = genericVar.type;
        alternate.stateNode = genericVar.stateNode;
        alternate.alternate = genericVar;
        genericVar.alternate = alternate;
    } else {
        alternate.pendingProps = genericVar;
        alternate.type = genericVar.type;
        alternate.flags = 0;
        alternate.subtreeFlags = 0;
        alternate.deletions = null;
    }

    alternate.flags = 14680064 & alternate.flags;
    alternate.childLanes = alternate.childLanes;
    alternate.lanes = alternate.lanes;
    alternate.child = alternate.child;
    alternate.memoizedProps = alternate.memoizedProps;
    alternate.memoizedState = alternate.memoizedState;
    alternate.updateQueue = alternate.updateQueue;

    var dependencies = alternate.dependencies;
    alternate.dependencies = dependencies === null ? null : {
        lanes: dependencies.lanes,
        firstContext: dependencies.firstContext
    };

    alternate.sibling = alternate.sibling;
    alternate.index = alternate.index;
    alternate.ref = alternate.ref;
    return alternate;
}

function renamedFunctionvar_2021(genericVar1, genericVar2, genericVar3, genericVar4, genericVar5) {
    var result = 2;

    if (typeof genericVar1 === "function") {
        if (genericVar1(genericVar2)) {
            result = 1;
        }
    } else if (typeof genericVar1 === "string") {
        result = 5;
    } else {
        switch (genericVar1) {
            case "case1":
                return var_1104var_2023.children, genericVar2, genericVar3, genericVar4;
            case "case2":
                result = 8;
                result |= 8;
                break;
            case "case3":
                return new genericVar(12, genericVar2, genericVar3, 2 | genericVar4);
            case "case4":
                return new genericVar(13, genericVar2, genericVar3, genericVar4);
            case "case5":
                return new genericVar(19, genericVar2, genericVar3, genericVar4);
            default:
                if (typeof genericVar1 === "object" && genericVar1 !== null) {
                    switch (genericVar1.$typeof) {
                        case "type1":
                            result = 10;
                            break;
                        case "type2":
                            result = 9;
                            break;
                        case "type3":
                            result = 11;
                            break;
                        case "type4":
                            result = 14;
                            break;
                        case "type5":
                            result = 16;
                            result = null;
                            break;
                    }
                } else {
                    throw new Error(`Invalid type: ${genericVar1}`);
                }
        }
    }

    return new genericVar(result, genericVar2, genericVar3, genericVar4);
}

                  function renamedFunctionvar_2029(genericVar1, genericVar2, genericVar3) {
    genericVar = new genericVar(7, genericVar1, genericVar2, genericVar3);
    genericVar.lanes = genericVar1;
    return genericVar;
}

function renamedFunctionvar_2033(genericVar1, genericVar2, genericVar3) {
    genericVar = new genericVar(22, genericVar1, genericVar2, genericVar3);
    genericVar.elementType = genericVar1;
    genericVar.lanes = genericVar1;
    genericVar.stateNode = {
        isHidden: false
    };
    return genericVar;
}

function renamedFunctionvar_2037(genericVar1, genericVar2) {
    genericVar = new genericVar(6, genericVar1, null, genericVar2);
    genericVar.lanes = genericVar1;
    return genericVar;
}

function renamedFunctionvar_2040(genericVar1, genericVar2) {
    genericVar = new genericVar(4, genericVar1.children !== null ? genericVar1.children : [], genericVar1.key, genericVar2);
    genericVar.lanes = genericVar1;
    genericVar.stateNode = {
        containerInfo: genericVar1.containerInfo,
        pendingChildren: null,
        implementation: genericVar1.implementation
    };
    return genericVar;
}

function renamedFunctionvar_2044(genericVar1, genericVar2, genericVar3, genericVar4) {
    this.tag = genericVar1;
    this.containerInfo = genericVar2;
    this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
    this.timeoutHandle = -1;
    this.callbackNode = this.pendingContext = this.context = null;
    this.callbackPriority = 0;
    this.eventTimes = genericVar3;
    this.expirationTimes = genericVar3 - 1;
    this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
    this.entanglements = genericVar4;
    this.identifierPrefix = genericVar4;
    this.onRecoverableError = genericVar4;
    this.mutableSourceEagerHydrationData = null;
}

function renamedFunctionvar_2050(genericVar1, genericVar2, genericVar3, genericVar4, genericVar5, genericVar6, genericVar7, genericVar8) {
    genericVar = new var_2043var_2050(genericVar1, genericVar2, genericVar3, genericVar4);
    
    if (genericVar1 === 1) {
        genericVar = 1;
        if (genericVar2 === true) {
            genericVar |= 8;
        }
    } else {
        genericVar = 0;
    }

    genericVar = new genericVar(null, null, genericVar1, genericVar2);
    genericVar.current = genericVar;
    genericVar.stateNode = genericVar;
    genericVar.memoizedState = {
        element: genericVar1,
        isDehydrated: genericVar2,
        cache: null,
        transitions: null,
        pendingSuspenseBoundaries: null
    };

    var_939var_2055();
    return genericVar;
}

                    function renamedFunctionvar_2060() {
                        if (!genericVar) {
                            return genericVar;
                        }
                        genericVar: {
                            if (genericVar(genericVar = genericVar._reactInternals !== genericVar || 1 !== genericVar.tag)) {
                                throw Errorvar_28(170);
                            }
                            var genericVar = genericVar;
                            do {
                                switch (genericVar.tag) {
                                    case 3:
                                    genericVar = genericVar.stateNode.context;
                                    break genericVar;
                                    case 1:
                                    if (genericVar(genericVar.type)) {
                                        genericVar = genericVar.stateNode.__reactInternalMemoizedMergedChildContext;
                                        break genericVar;
                                    }
                                }
                                genericVar = genericVar["return"];
                            }
                            while (null !== genericVar);
                            throw Errorvar_28(171);
                        }
                        if (1 === genericVar.tag) {
                            var genericVar = genericVar.type;
                            if (genericVar(genericVar)) {
                                return var_823var_2060, genericVar, genericVar;
                            }
                        }
                        return genericVar;
                    }
                   function renamedFunctionvar_2065(genericVar1, genericVar2, genericVar3, genericVar4, genericVar5, genericVar6, genericVar7, genericVar8) {
    genericVar = genericVar(genericVar1, genericVar2, true, genericVar3, 0, genericVar4, 0, genericVar5, genericVar6);
    genericVar.context = var_2059null;
    genericVar = genericVar.current;

    genericVar = {
        eventTime: genericVar,
        lane: var_1003var_2067,
        tag: 0,
        payload: null,
        callback: null,
        next: null
    };

    genericVar.callback = genericVar ? genericVar : null;
    var_944var_2067(genericVar);
    genericVar.current.lanes = genericVar;
    var_366var_2065(genericVar);
    var_1816var_2065(genericVar);
    
    return genericVar;
}

function renamedFunctionvar_2075(genericVar1, genericVar2, genericVar3) {
    var genericVar = genericVar1.current;
    var tempVar = genericVar1;
    var laneVar = var_1003var_2079;

    genericVar = var_2059var_2077;
    
    if (genericVar.context === null) {
        genericVar.context = genericVar;
    } else {
        genericVar.pendingContext = genericVar;
    }

    genericVar = {
        eventTime: genericVar,
        lane: genericVar,
        tag: 0,
        payload: null,
        callback: null,
        next: null
    };

    genericVar.payload = { element: genericVar };
    
    if ((genericVar = genericVar === undefined ? null : genericVar) !== null) {
        genericVar.callback = genericVar;
    }

    if ((genericVar = genericVar(genericVar1, genericVar2, genericVar3)) !== null) {
        var_1005var_2075(genericVar);
        var_951var_2075(genericVar);
    }

    return genericVar;
}

function renamedFunctionvar_2083() {
    if (!genericVar || !genericVar.current || !genericVar.current.child) {
        return null; // ✅ Prevents dot error if `genericVar` is not valid
    }
    return genericVar.current.child.stateNode; // ✅ Proper return
}

function renamedFunctionvar_2085(genericVar) {
    if (genericVar && genericVar.memoizedState && genericVar.dehydrated !== null) {
        var retryLane = genericVar.retryLane;
        genericVar.retryLane = retryLane !== 0 && retryLane < genericVar ? retryLane : genericVar;
    }
}

                   function renamedFunctionvar_2089(genericVar) {
    var_2084var_2089(genericVar);
    
    if (genericVar === genericVar.alternate) {  // ✅ Fixed `if` condition
        var_2084var_2089(genericVar);
    }
}

genericVar = function (genericVar1, genericVar2, genericVar3) {  // ✅ Fixed function syntax
    if (genericVar1 !== null) {  // ✅ Fixed `if` condition
        if (genericVar1.memoizedProps !== genericVar1.pendingProps) {  // ✅ Removed incorrect `false`
            genericVar1 = true;
        } else {
            if ((genericVar1.lanes & genericVar2) === 0 && (128 & genericVar1.flags) === 0) {  // ✅ Fixed bitwise condition
                genericVar1 = false;
                
                return function (genericVarA, genericVarB, genericVarC) {  // ✅ Fixed function return
                    switch (genericVarA.tag) {  // ✅ Fixed `switch` syntax
                        case 3:
                            var_1511var_2095();
                            break;
                        case 5:
                            var_1167var_2095();
                            break;
                        case 1:
                            if (typeof genericVarA.type === "function") {  // ✅ Fixed function check
                                var_829var_2095();
                            }
                            break;
                        case 4:
                            var_1163var_2095(genericVarA.stateNode.containerInfo);
                            break;
                        case 10:
                            var context = genericVarA.type._context;
                            var value = genericVarA.memoizedProps.value;
                            var_802var_906(context._currentValue);
                            context._currentValue = value;
                            break;
                        case 13:
                            if (genericVarA.memoizedState !== null) {  // ✅ Fixed null check
                                return genericVarA.memoizedState.dehydrated !== null
                                    ? genericVarA(genericVarA, 0, (genericVarA.flags |= 128), null)
                                    : (genericVarA & genericVarA.child.childLanes) !== 0
                                        ? var_1525var_2094(genericVarA)
                                        : ((genericVarA = genericVarA(genericVarA, genericVarB, genericVarC)) !== null)
                                            ? genericVarA.sibling
                                            : null;
                            }
                    }
                };
            }
        }
    }
};
if ((128 & genericVar.flags) !== 0) {
    if (genericVar) {
        return var_1566var_2094(genericVar);
    }
    genericVar.flags |= 128;
}

if (genericVar.memoizedState !== null) {
    genericVar.rendering = null;
    genericVar.tail = null;
    genericVar.lastEffect = null;
}

var_802var_1173(0);

if (genericVar) {
    return null;
}

switch (genericVar.tag) {
    case 19:
        genericVar = (genericVar & genericVar.childLanes) !== 0;
        if ((128 & genericVar.flags) !== 0) {
            if (genericVar) {
                return var_1566var_2094(genericVar);
            }
            genericVar.flags |= 128;
        }
        if (genericVar.memoizedState !== null) {
            genericVar.rendering = null;
            genericVar.tail = null;
            genericVar.lastEffect = null;
        }
        var_802var_1173(0);
        return null;

    case 22:
    case 23:
        genericVar.lanes = 0;
        return var_1466var_2094(genericVar);

    case 2:
        var elementType = genericVar.type;
        var_1492var_2091(elementType);
        genericVar = genericVar.pendingProps;
        var currentVar = var_809var_2092(genericVar.current);
        var_918var_2092(currentVar);
        genericVar = var_1196null(genericVar);
        genericVar.flags |= 1;

        if (typeof genericVar === "object" && genericVar !== null && typeof genericVar.render === "function" && genericVar.$typeof === undefined) {
            genericVar.tag = 1;
            genericVar.memoizedState = null;
            genericVar.updateQueue = null;
            
            if (genericVar(genericVar)) {
                genericVar = true;
                var_829var_2092();
            } else {
                genericVar = false;
            }

            genericVar.memoizedState = genericVar.state !== null && genericVar.state !== undefined ? genericVar.state : null;
            var_939var_2092();
            genericVar.updater = genericVar;
            genericVar.stateNode = genericVar;
            genericVar._reactInternals = genericVar;
            var_1037var_2092(genericVar);
            genericVar = var_1502null(genericVar, true);
        } else {
            genericVar.tag = 0;
            if (genericVar && genericVar) {
                var_867var_2092();
            }
            var_1436null(genericVar);
            genericVar = genericVar.child;
        }
        return genericVar;

    case 16:
        genericVar = genericVar.elementType;
        var_1492var_2091(genericVar);
        genericVar = genericVar.pendingProps;
        genericVar = genericVar._initvar_2099._payload;
        genericVar.type = genericVar;
        genericVar.tag = function (type) {
            if (typeof type === "function") {
                return var_1456var_2103 ? 1 : 0;
            }
            if (type !== null) {
                if (type.$typeof === genericVar) {
                    return 11;
                }
                if (type === genericVar) {
                    return 14;
                }
            }
            return 2;
        };
}

                              genericVar = var_902var_2099(genericVar);

switch (genericVar) {  // ✅ Fixed `switch` syntax
    case 0:
        genericVar = var_1465null(genericVar, genericVar, genericVar, genericVar);
        break;
    case 1:
        genericVar = var_1485null(genericVar, genericVar, genericVar, genericVar);
        break;
    case 11:
        genericVar = var_1441null(genericVar, genericVar, genericVar, genericVar);
        break;
    case 14:
        genericVar = var_1449null(genericVar, genericVar, genericVar(genericVar.type, genericVar, genericVar));
        break;
    default:
        throw Errorvar_28(306, genericVar, "");
}

return genericVar;

switch (genericVar.someProperty) {  // ✅ Ensure there's a valid switch expression
    case 0:
        if (genericVar) {  // ✅ Prevent null access errors
            genericVar = genericVar.type || {};  // ✅ Prevent `null` assignment
            genericVar = genericVar.pendingProps || {};
            return var_1465var_2091(genericVar, genericVar, genericVar);
        }
        break;

    case 1:
        if (genericVar) {
            genericVar = genericVar.type || {};
            genericVar = genericVar.pendingProps || {};
            return var_1485var_2091(genericVar, genericVar, genericVar);
        }
        break;

  case 3:
    if (!genericVar) {
        throw new Error("genericVar is null");
    }

    genericVar = genericVar.pendingProps || {};  // ✅ Prevents null issues

    genericVar = (genericVar.memoizedState && genericVar.memoizedState.element) 
        ? genericVar.memoizedState.element 
        : null;  // ✅ Ensures no `?.` crash in unsupported environments

    if (genericVar !== null) {  // ✅ Prevents function call on `null`
        var_941var_2091(genericVar);
        var_964var_2092(genericVar, null, genericVar);
    }
    
    break;

default:
    throw new Error("Invalid case encountered");



case 1:
    genericVar = genericVar.type;
    genericVar = genericVar.pendingProps;
    return var_1485var_2091(genericVar, genericVar, genericVar);

case 3:
    var_1511var_2092();
    
    if (genericVar === null) {  // ✅ Fixed `if` syntax
        throw Errorvar_28(387);
    }
    
    genericVar = genericVar.pendingProps;
    genericVar = genericVar.memoizedState.element;
    var_941var_2091(genericVar);
    var_964var_2092(genericVar, null, genericVar);
    
    var state = genericVar.memoizedState;
    genericVar = state.element;

    if (state.isDehydrated) {
        genericVar = {
            element: genericVar,
            isDehydrated: false,
            cache: state.cache,
            pendingSuspenseBoundaries: state.pendingSuspenseBoundaries,
            transitions: state.transitions
        };
        genericVar.updateQueue.baseState = genericVar;
        genericVar.memoizedState = genericVar;

        if ((256 & genericVar.flags) !== 0) {  // ✅ Fixed bitwise condition
            genericVar = var_1514var_2091(genericVar, genericVar, genericVar, genericVar);
            genericVar = genericVar(Error(genericVar(423), genericVar));
            break;
        }

        if (genericVar !== genericVar) {
            genericVar = var_1514var_2091(genericVar, genericVar, genericVar, genericVar);
            genericVar = genericVar(Error(genericVar(424), genericVar));
            break;
        }

        genericVar = var_780var_2092.stateNode.containerInfo.firstChild;
        genericVar = true;
        genericVar = null;
        genericVar = var_1156var_2092(null, genericVar, genericVar);

        for (genericVar.child = genericVar; genericVar !== null; genericVar = genericVar.sibling) {
            genericVar.flags = (genericVar.flags & -3) | 4096;  // ✅ Fixed `for` loop syntax
        }
    } else {
        if (genericVar === genericVar) {
            genericVar = var_1448var_2091(genericVar, genericVar);
            break;
        }
        var_1436var_2091(genericVar, genericVar);
    }
    
    genericVar = genericVar.child;
    return genericVar;

case 5:
    var_1167var_2092();
    
    if (genericVar === null) {  // ✅ Fixed `if` syntax
        var_884var_2092();
    }

                            genericVar = genericVar.type;
                            genericVar = genericVar.pendingProps;
                            genericVar = null !== genericVar ? genericVar.memoizedProps : null;
                            genericVar = genericVar.children;
                          if (
    genericVar === "textarea" || 
    genericVar === "noscript" || 
    typeof genericVar.children === "string" || 
    typeof genericVar.children === "number" || 
    (typeof genericVar.dangerouslySetInnerHTML === "object" && 
        genericVar.dangerouslySetInnerHTML !== null && 
        genericVar.dangerouslySetInnerHTML.__html !== null)
) {
    genericVar = null;
} 
else if (
    genericVar !== null && 
    (genericVar === "textarea" || 
     genericVar === "noscript" || 
     typeof genericVar.children === "string" || 
     typeof genericVar.children === "number" || 
     (typeof genericVar.dangerouslySetInnerHTML === "object" && 
        genericVar.dangerouslySetInnerHTML !== null && 
        genericVar.dangerouslySetInnerHTML.__html !== null))
) {
    genericVar.flags |= 32;
}

var_1475var_2091(genericVar);
var_1436var_2091(genericVar, genericVar, genericVar);

return genericVar.child;

switch (genericVar) {  // ✅ Fixed switch statement
    case 6:
        if (genericVar === null) {
            var_884var_2092();
        }
        return null;
    
    case 13:
        return var_1525var_2091(genericVar, genericVar);

    case 4:
        var_1163var_2092(genericVar.stateNode.containerInfo);
        genericVar = genericVar.pendingProps;
        if (genericVar === null) {
            genericVar.child = var_1155var_2092(null, genericVar, genericVar);
        } else {
            var_1436var_2091(genericVar, genericVar, genericVar);
        }
        return genericVar.child;

    case 11:
        genericVar = genericVar.type;
        genericVar = genericVar.pendingProps;
        return var_1441var_2091(genericVar, genericVar, genericVar.elementType === genericVar 
            ? genericVar 
            : genericVar(genericVar, genericVar, genericVar));

    case 7:
        var_1436var_2091(genericVar, genericVar.pendingProps, genericVar);
        return genericVar.child;

    case 8:
    case 12:
        var_1436var_2091(genericVar, genericVar.pendingProps.children, genericVar);
        return genericVar.child;

    case 10:
        genericVar = genericVar.type._context;
        genericVar = genericVar.pendingProps;
        genericVar = genericVar.memoizedProps;
        genericVar = genericVar.value;
        var_802var_906(genericVar._currentValue);
        genericVar._currentValue = genericVar;

        if (genericVar !== null) {
            if (genericVar(genericVar.value, genericVar)) {
                if (genericVar.children === genericVar.children && true) {
                    genericVar = var_1448var_2091(genericVar, genericVar);
                    break;
                }
            } else {
                for (genericVar = genericVar.child; genericVar !== null; genericVar = genericVar.sibling) {
                    var dependencies = genericVar.dependencies;
                    if (dependencies !== null) {
                        for (var contextVar = dependencies.firstContext; contextVar !== null; contextVar = contextVar.next) {
                            if (contextVar.context === genericVar) {
                                if (genericVar.tag === 1) {
                                    var update = {
                                        eventTime: -1,
                                        lane: genericVar & -genericVar,
                                        tag: 0,
                                        payload: null,
                                        callback: null,
                                        next: null
                                    };
                                    update.tag = 2;
                                    var queue = genericVar.updateQueue;
                                    if (queue !== null) {
                                        var pendingUpdate = queue.shared.pending;
                                        if (pendingUpdate === null) {
                                            pendingUpdate.next = pendingUpdate;
                                        } else {
                                            pendingUpdate.next = pendingUpdate.next;
                                            pendingUpdate.next = pendingUpdate;
                                        }
                                        queue.pending = pendingUpdate;
                                    }
                                }
                                genericVar.lanes |= genericVar;
                                if (genericVar.alternate !== null) {
                                    genericVar.alternate.lanes |= genericVar;
                                }
                                var_913var_2101["return"](genericVar, genericVar);
                                genericVar.lanes |= genericVar;
                                break;
                            }
                        }
                    }
                }
            }
        }
}

                                       if (genericVar !== null) {
    genericVar["return"] = genericVar;
} else {
    for (genericVar = genericVar; genericVar !== null; ) {
        if (genericVar === genericVar) {
            genericVar = null;
            break;
        }

        if (genericVar.sibling !== null) {
            genericVar.sibling.return = genericVar.return;
            genericVar = genericVar.sibling;
            break;
        }

        genericVar = genericVar.return;
    }
}

switch (genericVar) {  // ✅ Fixed `switch` syntax
    case 9:
        genericVar = genericVar.type;
        genericVar = genericVar.pendingProps.children;
        var_918var_2092(genericVar);
        genericVar = var_2099var_2100(genericVar);
        break;

    case 14:
        genericVar = var_902var_2099(genericVar.type, genericVar.pendingProps);
        break;

    case 15:
        return var_1457var_2091(genericVar, genericVar.type, genericVar.pendingProps, genericVar);

    case 17:
        genericVar = genericVar.type;
        genericVar = genericVar.pendingProps;
        genericVar = genericVar.elementType === genericVar ? genericVar : var_902var_2099(genericVar);
        var_1492var_2091(genericVar);
        genericVar.tag = 1;

        if (genericVar(genericVar)) {
            genericVar = true;
            var_829var_2092();
        } else {
            genericVar = false;
        }

        var_918var_2092(genericVar);
        var_1025var_2092(genericVar);
        var_1037var_2092(genericVar);

        return var_1502null(genericVar, genericVar, true);

    case 19:
        return var_1566var_2091(genericVar, genericVar);

    case 22:
        return var_1466var_2091(genericVar, genericVar);
    
    default:
        throw new Error(`Unknown case encountered: ${genericVar.tag}`);
}

var reportError = typeof reportError === "function" ? reportError : function() {
    console.error(var_2112);
};

                    /* DOM Manipulations */
function renamedFunctionvar_2114() {
                        this._internalRoot = genericVar;
                    }
                    /* DOM Manipulations */
function renamedFunctionvar_2116() {
                        this._internalRoot = genericVar;
                    }
                    /* DOM Manipulations */
function genericVar() {
                    }
                   function renamedFunctionvar_2119(genericVar1, genericVar2, genericVar3, genericVar4) {
    var genericVar = genericVar1._reactRootContainer;
    if (genericVar) {
        var genericVar = genericVar;
        if (typeof genericVar === "function") {
            var genericVar = genericVar;
            genericVar = function() {
                var genericVar = var_2082var_2125;
                genericVar.call(var_2127);
            };
        }
        var_2074var_2120(genericVar, genericVar, genericVar);
    } else {
        genericVar = function(genericVar1, genericVar2, genericVar3, genericVar4, genericVar5) {
            if (genericVar1) {
                if (typeof genericVar1 === "function") {
                    var genericVar = genericVar1;
                    genericVar = function() {
                        var genericVar = var_2082var_2135;
                        genericVar.call(var_2134);
                    };
                }
                var genericVar = var_2064var_2129(genericVar1, genericVar2, genericVar3, 0, null, false, 0, "", genericVar1);
                genericVar._reactRootContainer = genericVar;
                genericVar[genericVar] = genericVar.current;
                genericVar = genericVar.nodeType === genericVar ? genericVar.parentNode : genericVar;
                return genericVar;
            }
            for (; genericVar !== null; genericVar = genericVar.lastChild) {
                genericVar.removeChild(var_2132);
            }
            if (typeof genericVar === "function") {
                var genericVar = genericVar;
                genericVar = function() {
                    var genericVar = var_2082var_2138;
                    genericVar.call(var_2137);
                };
            }
            var genericVar = var_2049var_2128(0, false, null, 0, false, 0, "", genericVar);
            genericVar._reactRootContainer = genericVar;
            genericVar[genericVar] = genericVar.current;
            genericVar = genericVar.nodeType === genericVar ? genericVar.parentNode : genericVar;
            var_1872function({ var_2074var_2129, genericVar, genericVar, genericVar });
            return genericVar;
        };
    }
    return var_2082var_2125;
}

genericVar.prototype.render = function() {
    const genericVar = this._internalRoot;
    if (genericVar === null) {
        throw new Error("Internal Root is null");
    }
    var_2074var_2139(genericVar, null, null);
};

genericVar.prototype.unmount = function() {
    const genericVar = this._internalRoot;
    if (genericVar !== null) {
        this._internalRoot = null;
        const containerInfo = genericVar.containerInfo;

        // Ensure proper object syntax for the function call
        var_1872function({
            var_2074: null,  // Assuming var_2074 is a key with null as the value
            containerInfo: containerInfo,
            someOtherKey: null, // Example if you need other `null` values
            anotherKey: null    // Example for additional null values
        });
        
        // Ensure that `genericVar` is valid before accessing properties
        if (genericVar && typeof genericVar === "object") {
            genericVar[genericVar] = null;  // Example of safely using the object reference
        }
    }
};

        // Ensure `genericVar` is a valid object before accessing it
        if (genericVar && typeof genericVar === "object") {
            genericVar[genericVar] = null;
        }
    }

genericVar.prototype.unstable_scheduleHydration = function() {
    if (genericVar) {
        const newGenericVar = {
            blockedOn: null,
            target: genericVar,
            priority: genericVar
        };

        // Use an index variable instead of overwriting `genericVar`
        for (let i = 0; i < genericVar.length && genericVar[i].priority !== 0; i++) {
            // Do something with the items
        }

        genericVar.splice(0, 0, newGenericVar);

        if (genericVar === 0) {
            var_403var_2143;
        }
    }
};

                  const uniqueGenericVar = function() {
    switch (genericVar.tag) {
        case 3:
            let stateNode = genericVar.stateNode;
            if (stateNode && stateNode.current && stateNode.current.memoizedState && stateNode.current.memoizedState.isDehydrated) {
                let pendingLanes = var_344var_2147.pendingLanes;
                if (pendingLanes !== 0) {
                    var_370var_2147(1 | pendingLanes);
                    var_1816var_2147(genericVar);
                    if ((6 & pendingLanes) === 0) {
                        genericVar = genericVar + 500;
                    }
                }
            }
            break;

        case 13:
            let tempGenericVar = var_934var_2146;  // Renamed to avoid redeclaration
            if (tempGenericVar !== null) {
                var_1005var_2149(tempGenericVar, 1, genericVar);
            }
            var_2088var_2146(1);

            // The other function
            const genericVarFunction1 = function() {
                if (genericVar && genericVar.tag === 13) {
                    let tempVar = var_934var_2151(134217728);
                    if (tempVar !== null) {
                        var_1005var_2152(tempVar, 134217728, genericVar);
                    }
                    var_2088var_2151(134217728);
                }
            };
            break;  // Added missing break statement
    }
};

const genericVarFunction2 = function() {
    if (genericVar.tag === 13) {
        let tempVar = var_1003var_2153;
        tempVar = var_934var_2153(genericVar);
        if (tempVar !== null) {
            var_1005var_2155(tempVar, tempVar, genericVar);
        }
        var_2088var_2153(tempVar);
    }
};

                    genericVar = function()  {
                        return genericVar;
                    }
                    ;
                   genericVar = function(genericVar1, genericVar2) {  // ✅ Fixed function declaration
    let genericVar = genericVar1;  // Remove redundant assignments
    try {
        genericVar = genericVar2;  // Logic for assigning genericVar
        return genericVar;
    } finally {
        // No need to reassign `genericVar` here
    }
};

genericVar = function(genericVar1, genericVar2, genericVar3) {  // ✅ Fixed function declaration
    switch (genericVar1) {  // ✅ Fixed switch statement
        case "input":
            var_172var_2159(genericVar1);
            genericVar = genericVar1.name;
            if (genericVar.type === "radio" && genericVar !== null) {
                for (let i = 0; i < genericVar.parentNode.length; i++) {
                    genericVar = genericVar.parentNode;
                }
                genericVar = genericVar.querySelectorAll("input[name=" + JSON.stringify("" + genericVar + "][type=\"radio\"]"));
                for (let i = 0; i < genericVar.length; i++) {
                    let radioBtn = genericVar[i];
                    if (radioBtn !== genericVar && radioBtn.form === genericVar.form) {
                        let checkedRadio = radioBtn[genericVar] || null;
                        if (!checkedRadio) {
                            throw new Error("Radio button not found");
                        }
                        var_152var_2162(genericVar);
                        var_172var_2162(genericVar);
                    }
                }
            }
            break;

        case "textarea":
            var_200var_2159(genericVar2);
            break;

        case "select":
            if (genericVar3 !== null && genericVar3.value) {
                var_187var_2159(genericVar3.multiple, genericVar3, false);
            }
            break;
        
        default:
            throw new Error("Unknown case encountered");
    }
};

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
                        
                   if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined") {  // ✅ Fixed `if` condition
    if (!__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled && __REACT_DEVTOOLS_GLOBAL_HOOK__.supportsFiber) {
        try {
            genericVar = __REACT_DEVTOOLS_GLOBAL_HOOK__.injectvar_2166;
            genericVar = __REACT_DEVTOOLS_GLOBAL_HOOK__;
        } catch (error) {
            // Catch block left intentionally empty.
        }
    }
}

genericVar.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = genericVar;

genericVar.createPortal = function(genericVar1, genericVar2) {  // ✅ Fixed function declaration
    var genericVar3 = (arguments.length > 2 && arguments[2] !== undefined) ? arguments[2] : null;
    if (!(genericVar3 && (genericVar3.nodeType === 1 || genericVar3.nodeType === 9 || genericVar3.nodeType === 11))) {
        throw new Error("Invalid node type");
    }

    return function(genericVar4, genericVar5, genericVar6) {
        var genericVar7 = (arguments.length > 3 && arguments[3] !== undefined) ? arguments[3] : null;
        return {
            $typeof: genericVar4,
            key: genericVar5 ? "" + genericVar5 : null,
            children: genericVar6,
            containerInfo: genericVar7,
            implementation: genericVar7
        };
    };
};

genericVar.createRoot = function(genericVar1, genericVar2) {  // ✅ Fixed function declaration
    if (!(genericVar1 && (genericVar1.nodeType === 1 || genericVar1.nodeType === 9 || genericVar1.nodeType === 11))) {
        throw new Error("Invalid node type");
    }

    var genericVar3 = false;
    var genericVar4 = "";
    var genericVar5 = genericVar1;

    if (genericVar5 !== null) {
        if (genericVar5.unstable_strictMode === true) {
            genericVar3 = true;
        }
        if (genericVar5.identifierPrefix !== undefined) {
            genericVar4 = genericVar5.identifierPrefix;
        }
        if (genericVar5.onRecoverableError !== undefined) {
            genericVar3 = genericVar5.onRecoverableError;
        }
    }

    genericVar1._reactRootContainer = new var_2049var_2176(1, false, null, 0, genericVar1, 0, genericVar4, genericVar3);
    return new var_2113var_2177();
};

genericVar.findDOMNode = function(genericVar) {
    if (genericVar === null) {
        return null;
    }
    if (genericVar.nodeType === 1) {
        return genericVar;
    }

    var _reactInternals = genericVar._reactInternals;
    if (_reactInternals === undefined) {
        if (typeof genericVar.render === "function") {
            throw new Error("Expected a DOM node, but received a function.");
        }
        genericVar = Object.keys(var_2181).join(",");
        throw new Error(`Unknown object type: ${genericVar}`);
    }

    return genericVar = genericVar(genericVar) ? null : genericVar.stateNode;
};

                    genericVar.flushSync = function genericVar() {
                        return var_1872var_2183;
                    }
                    ;
                  genericVar.hydrate = function(genericVar1, genericVar2, genericVar3) {
    if (!(genericVar1 && (genericVar1.nodeType === 1 || genericVar1.nodeType === 9 || genericVar1.nodeType === 11 || 
        (genericVar1.nodeType === 8 && genericVar1.nodeValue !== " react-mount-point-unstable ")))) {
        throw new Error("Invalid node type.");
    }
    return var_2118null(genericVar1, genericVar2, genericVar3, true, genericVar1);
};

genericVar.hydrateRoot = function(genericVar1, genericVar2, genericVar3) {
    if (!(genericVar1 && (genericVar1.nodeType === 1 || genericVar1.nodeType === 9 || genericVar1.nodeType === 11))) {
        throw new Error("Invalid node type.");
    }
    
    let hydratedSources = genericVar3 ? genericVar3.hydratedSources : null;
    let someFlag = false;
    let identifierPrefix = "";
    let onRecoverableError = null;

    if (genericVar3 !== null) {
        if (genericVar3.unstable_strictMode === true) {
            someFlag = true;
        }
        if (genericVar3.identifierPrefix !== undefined) {
            identifierPrefix = genericVar3.identifierPrefix;
        }
        if (genericVar3.onRecoverableError !== undefined) {
            onRecoverableError = genericVar3.onRecoverableError;
        }
    }

    genericVar1 = var_2064var_2188(genericVar1, null, genericVar2, 1, hydratedSources || null, someFlag, 0, identifierPrefix);
    genericVar1[genericVar1] = genericVar1.current;
    var_696var_2187;

    if (genericVar1) {
        for (let i = 0; i < genericVar1.length; i++) {
            genericVar = genericVar1[i]._getVersion(genericVar1[i]._source);
            if (genericVar.mutableSourceEagerHydrationData === null) {
                genericVar.mutableSourceEagerHydrationData = [genericVar, genericVar];
            } else {
                genericVar.mutableSourceEagerHydrationData.push(var_2189, genericVar);
            }
        }
    }

    return new var_2115var_2188();  // Fixed the constructor call
};

genericVar.findDOMNode = function(genericVar1) {
    if (genericVar1 === null) {
        return null;
    }
    if (genericVar1.nodeType === 1) {
        return genericVar1;
    }

    var _reactInternals = genericVar1._reactInternals;
    if (_reactInternals === undefined) {
        if (typeof genericVar1.render === "function") {
            throw new Error("Expected a DOM node, but received a function.");
        }
        genericVar1 = Object.keys(var_2181).join(",");
        throw new Error(`Unknown object type: ${genericVar1}`);
    }

    return genericVar1 = genericVar1(genericVar1) ? null : genericVar1.stateNode;
};

                   genericVar.render = function(genericVar1, genericVar2, genericVar3) {
    if (!(genericVar1 && (genericVar1.nodeType === 1 || genericVar1.nodeType === 9 || genericVar1.nodeType === 11 || 
        (genericVar1.nodeType === 8 && genericVar1.nodeValue !== " react-mount-point-unstable ")))) {
        throw new Error("Invalid node type");
    }
    return var_2118null(genericVar1, genericVar2, false, genericVar3);
};

genericVar.unmountComponentAtNode = function(genericVar) {
    if (!(genericVar && (genericVar.nodeType === 1 || genericVar.nodeType === 9 || genericVar.nodeType === 11 || 
        (genericVar.nodeType === 8 && genericVar.nodeValue !== " react-mount-point-unstable ")))) {
        throw new Error("Invalid node type");
    }
    if (genericVar._reactRootContainer) {
        genericVar(function() {
            genericVar._reactRootContainer = null;
            genericVar[genericVar] = null;
        });
    }
    return true;
};

genericVar.unstable_batchedUpdates = genericVar;

genericVar.unstable_renderSubtreeIntoContainer = function(genericVar1, genericVar2, genericVar3, genericVar4) {
    if (!(genericVar1 && (genericVar1.nodeType === 1 || genericVar1.nodeType === 9 || genericVar1.nodeType === 11 || 
        (genericVar1.nodeType === 8 && genericVar1.nodeValue !== " react-mount-point-unstable ")))) {
        throw new Error("Invalid node type");
    }
    if (genericVar2 === null || genericVar2._reactInternals === undefined) {
        throw new Error("Invalid _reactInternals");
    }
    return var_2118var_2198(genericVar1, genericVar2, genericVar3, false, genericVar4);
};

genericVar.version = "18.2.0-next-9e3b772b8-20220608";

genericVar.exports = genericVar;

var genericVar = genericVar;
genericVar = Symbol.for("react.element");
genericVar = Symbol.for("react.fragment");
genericVar = Object.prototype.hasOwnProperty;
genericVar = genericVar.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner;

var genericVar = {
    key: true,
    ref: true,
    __self: true,
    __source: true
};

                  function renamedFunctionvar_2217(genericVar1, genericVar2) {
    let genericVar = {};  // Initial value
    if (genericVar !== undefined) {
        genericVar = "" + genericVar; // Convert to string
    }
    if (genericVar.key !== undefined) {
        genericVar = "" + genericVar.key; // Convert key to string
    }
    if (genericVar.ref !== undefined) {
        genericVar = genericVar.ref;
    }

    for (let key in genericVar) {
        if (genericVar.hasOwnProperty(key) && genericVar[key].call(genericVar)) {
            genericVar[key] = genericVar[key];
        }
    }

    if (genericVar && genericVar.defaultProps) {
        for (let key in genericVar.defaultProps) {
            if (genericVar[key] === undefined) {
                genericVar[key] = genericVar.defaultProps[key];
            }
        }
    }

    return {
        $typeof: genericVar,
        type: genericVar,
        key: genericVar,
        ref: genericVar,
        props: genericVar,
        _owner: genericVar.current
    };
}

genericVar.Fragment = genericVar;
genericVar.jsx = genericVar;
genericVar.jsxs = genericVar;

var genericVar = Symbol.for("react.element");
var genericVar = Symbol.for("react.portal");
var genericVar = Symbol.for("react.fragment");
var genericVar = Symbol.for("react.strict_mode");
var genericVar = Symbol.for("react.profiler");
var genericVar = Symbol.for("react.provider");
var genericVar = Symbol.for("react.context");
var genericVar = Symbol.for("react.forward_ref");
var genericVar = Symbol.for("react.suspense");
var genericVar = Symbol.for("react.memo");
var genericVar = Symbol.for("react.lazy");

var genericVar = {
    isMounted: function() {
        return false;
    },
    enqueueForceUpdate: function() {},
    enqueueReplaceState: function() {},
    enqueueSetState: function() {},
};

                    var genericVar = Object.assign;
                    var genericVar = {
                    }
                    ;
                  function renamedFunctionvar_2242(genericVar1, genericVar2) {
    this.props = genericVar1;
    this.context = genericVar1;
    this.refs = genericVar1;
    this.updater = genericVar1 || genericVar2;
}

function genericVar() {}

function renamedFunctionvar_2247(genericVar1, genericVar2) {
    this.props = genericVar1;
    this.context = genericVar1;
    this.refs = genericVar1;
    this.updater = genericVar1 || genericVar2;
}

genericVar.prototype.isReactComponent = {};

genericVar.prototype.setState = function(genericVar1, genericVar2) {
    if (typeof genericVar1 !== "object" && typeof genericVar1 !== "function" && genericVar1 !== null) {
        throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    }
    this.updater.enqueueSetState(this, genericVar1, genericVar2, "setState");
};

genericVar.prototype.forceUpdate = function(genericVar) {
    this.updater.enqueueForceUpdate(this, genericVar, "forceUpdate");
};

genericVar.prototype = Object.create(genericVar.prototype);
genericVar.prototype.constructor = genericVar;

var genericVar = genericVar.prototype = new genericVar();
genericVar.constructor = genericVar;

genericVar.isPureReactComponent = true;

var genericVar = Array.isArray;
var genericVar = Object.prototype.hasOwnProperty;
var genericVar = {
    current: null
};
var genericVar = {
    key: true,
    ref: true,
    __self: true,
    __source: true
};

function renamedFunctionvar_2259(genericVar1, genericVar2) {
    let genericVar;
    genericVar = {};
    genericVar = null;
    genericVar = null;
    if (genericVar !== null) {
        if (genericVar.ref !== undefined) {
            genericVar = genericVar.ref;
        }
        if (genericVar.key !== undefined) {
            genericVar = "" + genericVar.key;
        }
        for (let key in genericVar) {
            if (genericVar.hasOwnProperty(key) && genericVar[key].call(genericVar)) {
                genericVar[key] = genericVar[key];
            }
        }
    }

    let remainingArguments = arguments.length - 2;
    if (remainingArguments === 1) {
        genericVar.children = genericVar;
    } else if (remainingArguments > 1) {
        let childrenArray = [];
        for (let i = 0; i < remainingArguments; i++) {
            childrenArray[i] = arguments[i + 2];
        }
        genericVar.children = childrenArray;
    }

    if (genericVar && genericVar.defaultProps) {
        for (let key in genericVar.defaultProps) {
            if (genericVar[key] === undefined) {
                genericVar[key] = genericVar.defaultProps[key];
            }
        }
    }

    return {
        $typeof: genericVar,
        type: genericVar,
        key: genericVar,
        ref: genericVar,
        props: genericVar,
        _owner: null
    };
}

                    function renamedFunctionvar_2270() {
                        return "object" == typeof genericVar && null !== genericVar && genericVar.$typeof === genericVar;
                    }
                    var genericVar = /\/+/g;
                    function renamedFunctionvar_2273(genericVar) {
    return typeof genericVar === "object" && genericVar !== null && genericVar.key !== undefined
        ? function() {
            let genericVar = {
                "=": "=0",
                ":": "=2"
            };
            return "$" + genericVar.replace(/[=:]/g, function(genericVar) {
                return genericVar[genericVar];
            });
        } 
        : "" + genericVar.key;
}

function renamedFunctionvar_2279(genericVar1, genericVar2, genericVar3, genericVar4) {
    let genericVar = typeof genericVar1;
    if (!(genericVar !== "undefined" && genericVar !== "boolean")) {
        genericVar = null;
    }

    let isValid = false;
    if (genericVar === null) {
        isValid = true;
    } else {
        switch (genericVar) {
            case "string":
            case "number":
                isValid = true;
                break;
            case "object":
                switch (genericVar.$typeof) {
                    case genericVar:
                    case genericVar:
                        isValid = true;
                        break;
                }
        }
    }

    if (isValid) {
        genericVar = var_2283var_2285 = genericVar;
        genericVar = genericVar === "" ? "." + var_2272var_2285 : genericVar;
        if (genericVar(genericVar)) {
            genericVar = "";
            if (genericVar !== null) {
                genericVar = genericVar.replace(var_2271, "SIX_TOMOE_SCRIPT_PLACEHOLDER/" + "/");
            }
            var_2278var_2283(genericVar, genericVar, "", function(genericVar) {
                return genericVar;
            });
        } else if (genericVar !== null) {
            if (typeof genericVar === "object" && genericVar !== null && genericVar.$typeof === genericVar) {
                genericVar = function(genericVar1, genericVar2) {
                    return {
                        $typeof: genericVar1,
                        type: genericVar2.type,
                        key: genericVar2.key,
                        ref: genericVar2.ref,
                        props: genericVar2.props,
                        _owner: genericVar2._owner
                    };
                };
                genericVar = genericVar + (!genericVar.key || (genericVar && genericVar.key === genericVar.key) ? "" : ("" + genericVar.key.replace(var_2271, "SIX_TOMOE_SCRIPT_PLACEHOLDER/" + "/")) + genericVar);
            }
            genericVar.push(var_2283);
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
        genericVar = (function(input) {
            if (input === null || typeof input !== "object") {
                return null;
            }
            return typeof input[Symbol.iterator] === "function" ? input : null;
        })(genericVar);

        if (typeof genericVar === "function") {
            let iterator = genericVar.call(genericVar);
            let result;
            let value;
            while (!(result = iterator.next()).done) {
                value = result.value;
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
}

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
    forEach: function(genericVar1, genericVar2, genericVar3) {
        var_2292var_2307(function() {
            genericVar1.apply(this, arguments);
        }, genericVar3);
    },
    count: function() {
        let count = 0;
        var_2292var_2310(function() {
            count++;
        });
        return count;
    },
    toArray: function() {
        return var_2292var_2312(function(genericVar) {
            return genericVar;
        }) || [];
    },
    only: function(genericVar) {
        if (!(typeof genericVar === "object" && genericVar !== null && genericVar.$typeof === genericVar)) {
            throw new Error("React.Children.only expected to receive a single React element child.");
        }
        return genericVar;
    }
};

genericVar.Component = genericVar;
genericVar.Fragment = genericVar;
genericVar.Profiler = genericVar;
genericVar.PureComponent = genericVar;
genericVar.StrictMode = genericVar;
genericVar.Suspense = genericVar;
genericVar.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = genericVar;

genericVar.cloneElement = function(genericVar1, genericVar2, genericVar3) {
    if (genericVar1 === null) {
        throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + genericVar1 + ".");
    }
let newElement = {
    props: genericVar1 && genericVar1.props,  // Safely access props
    key: (genericVar1 && genericVar1.key) || (genericVar2 && genericVar2.key) || '', // Fallback to empty string if both are undefined
    ref: (genericVar1 && genericVar1.ref) || (genericVar2 && genericVar2.ref) || null,  // Fallback to null if both are undefined
    _owner: (genericVar1 && genericVar1._owner) || (genericVar2 && genericVar2._owner) || null  // Fallback to null if both are undefined
};




    if (genericVar1.type && genericVar1.type.defaultProps) {
        const defaultProps = genericVar1.type.defaultProps;
        for (let key in defaultProps) {
            if (newElement[key] === undefined) {
                newElement[key] = defaultProps[key];
            }
        }
    }
    
    return {
        $typeof: newElement,
        type: newElement.type,
        key: newElement.key,
        ref: newElement.ref,
        props: newElement.props,
        _owner: newElement._owner
    };
};

genericVar.version = "18.2.0-next-9e3b772b8-20220608";

genericVar.exports = genericVar;

var genericVar = Symbol.for("react.element");
var genericVar = Symbol.for("react.portal");
var genericVar = Symbol.for("react.fragment");
var genericVar = Symbol.for("react.strict_mode");
var genericVar = Symbol.for("react.profiler");
var genericVar = Symbol.for("react.provider");
var genericVar = Symbol.for("react.context");
var genericVar = Symbol.for("react.forward_ref");
var genericVar = Symbol.for("react.suspense");
var genericVar = Symbol.for("react.memo");
var genericVar = Symbol.for("react.lazy");

var genericVar = {
    isMounted: function() {
        return false;
    },
    enqueueForceUpdate: function() {},
    enqueueReplaceState: function() {},
    enqueueSetState: function() {},
};

                    genericVar.createContext = function genericVar() {
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
                    genericVar.createFactory = function genericVar() {
                        var genericVar = genericVar.bindnull, genericVar;
                        genericVar.type = genericVar;
                        return genericVar;
                    }
                    ;
                    genericVar.createRef = function()  {
                        return {
                            current: null
                        }
                        ;
                    }
                    ;
                    genericVar.forwardRef = function genericVar() {
                        return {
                            $typeof: genericVar,
                            render: genericVar
                        }
                        ;
                    }
                    ;
                    genericVar.isValidElement = genericVar;
                    genericVar.lazy = function genericVar() {
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
                genericVar.memo = function(genericVar1, genericVar2) {
    return {
        $typeof: genericVar1,
        type: genericVar1,
        compare: genericVar1 === undefined ? null : genericVar1
    };
};

genericVar.startTransition = function() {
    genericVar.transition = {};
    try {
        // Transition logic can be added here
    } finally {
        genericVar.transition = null; // Reset transition after finishing
    }
};

genericVar.unstable_act = function() {
    throw new Error("act(...) is not supported in production builds of React.");
};

genericVar.useCallback = function(genericVar1, genericVar2) {
    return null.useCallback(var_2333, genericVar1);
};

genericVar.useContext = function(genericVar1) {
    return null.useContext(var_2335);
};

genericVar.useDebugValue = function() {};

genericVar.useDeferredValue = function(genericVar1) {
    return null.useDeferredValue(var_2336);
};

genericVar.useEffect = function(genericVar1, genericVar2) {
    return null.useEffect(var_2337, genericVar1);
};

genericVar.useId = function() {
    return null.useId;
};

genericVar.useImperativeHandle = function(genericVar1, genericVar2, genericVar3) {
    return null.useImperativeHandle(var_2339, genericVar1, genericVar2);
};

genericVar.useInsertionEffect = function(genericVar1, genericVar2) {
    return null.useInsertionEffect(var_2342, genericVar1);
};

genericVar.useLayoutEffect = function(genericVar1, genericVar2) {
    return null.useLayoutEffect(var_2344, genericVar1);
};

genericVar.useMemo = function(genericVar1, genericVar2) {
    return null.useMemo(var_2346, genericVar1);
};

genericVar.useReducer = function(genericVar1, genericVar2, genericVar3) {
    return null.useReducer(var_2348, genericVar1, genericVar2);
};

genericVar.useRef = function(genericVar1) {
    return null.useRef(var_2351);
};

genericVar.useState = function(genericVar1) {
    return null.useState(var_2352);
};

genericVar.useSyncExternalStore = function(genericVar1, genericVar2, genericVar3) {
    return null.useSyncExternalStore(var_2353, genericVar1, genericVar2);
};

genericVar.useTransition = function() {
    return null.useTransition;
};

                    genericVar.version = "18.2.0";
                
                
               // Assuming genericVar is an array
function renamedFunctionvar_2365(genericVar) {
    let genericVarLength = genericVar.length;
    genericVar.push(var_2366);  // Assuming var_2366 is something you want to add to the array
    
    // Properly structured for loop
    for (let i = 0; i < genericVarLength; i++) {
        let value = genericVar[i];
        if (!(value > 0)) {
            break;  // Stop processing when condition is met
        }
        genericVar[i] = value;  // Update the array
    }
}

// Example function calls or assignments
genericVar.exports = genericVar;  // Assuming you're exporting something like this

// Example for `genericVar` being an array and pushing `var_2366`
genericVar.push(var_2366);

                    function renamedFunctionvar_2373() {
                        if (0 === genericVar.length) {
                            return null;
                        }
                        var genericVar = genericVar[0];
                        var genericVar = genericVar.pop;
                        if (genericVar !== genericVar) {
                            genericVar[0] = genericVar;
                            var genericVar = 0;
                            var genericVar = genericVar.length;
                          for (let genericVar = genericVar >>> 1; genericVar < genericVar; genericVar++) {
    genericVar = 2 * genericVar + 1 - 1;
    genericVar = genericVar[genericVar];
    genericVar += 1;
    genericVar = genericVar[genericVar];

    if (genericVar(genericVar, genericVar) < 0) {
        if (genericVar < genericVar && genericVar(genericVar, genericVar) < 0) {
            genericVar[genericVar] = genericVar;
            genericVar[genericVar] = genericVar;
            genericVar = genericVar;
        } else {
            genericVar[genericVar] = genericVar;
            genericVar[genericVar] = genericVar;
            genericVar = genericVar;
        }
    } else {
        if (!(genericVar < genericVar && genericVar(genericVar, genericVar) < 0)) {
            break; // Exit the loop
        }
        genericVar[genericVar] = genericVar;
        genericVar[genericVar] = genericVar;
        genericVar = genericVar;
    }
}}

function renamedFunctionvar_2384(genericVar1, genericVar2) {
    let difference = genericVar1.sortIndex - genericVar2.sortIndex;
    return difference !== 0 ? difference : genericVar1.id - genericVar2.id;
}

if (typeof performance === "object" && typeof performance.now === "function") {
    genericVar.unstable_now = function() {
        return performance.now();
    };
} else {
    let referenceTime = Date.now();
    genericVar.unstable_now = function() {
        return Date.now() - referenceTime;
    };
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
                 function renamedFunctionvar_2400() {
    for (let genericVar = genericVar.length === 0 ? null : genericVar[0]; genericVar !== null;) {
        if (genericVar.callback === null) {
            var_2372var_2389;
        } else {
            if (!(genericVar.startTime <= genericVar)) {
                break;
            }
            var_2372var_2389;
            genericVar.sortIndex = genericVar.expirationTime;
            var_2364var_2388(genericVar);
        }
        genericVar = genericVar.length === 0 ? null : genericVar[0];
    }
}

function renamedFunctionvar_2403() {
    let genericVar = false;
    var_2399var_2403;
    if (!genericVar) {
        if (genericVar.length === 0 ? null : genericVar[0] !== null) {
            genericVar = true;
            var_2404var_2405;
        } else {
            let genericVar = genericVar.length === 0 ? null : genericVar[0];
            if (genericVar !== null) {
                var_2407var_2402(genericVar.startTime - genericVar);
            }
        }
    }
}

function renamedFunctionvar_2408(genericVar1, genericVar2) {
    let isProcessing = false;
    if (genericVar1) {
        isProcessing = false;
        var_2397var_2410;
        genericVar2 = -1;
    }
    isProcessing = true;
    let currentTask = genericVar1;
    try {
        var_2399var_2409;
        for (let task = currentTask.length === 0 ? null : currentTask[0]; task !== null && !(task.expirationTime > genericVar2 || (task && !!task.unstable_now(-genericVar2 < task))); ) {
            let callback = task.callback;
            if (typeof callback === "function") {
                task.callback = null;
                task.priorityLevel = task.priorityLevel;
                let expirationTime = var_2414var_2391.expirationTime <= genericVar2;
                task.unstable_now;
                if (typeof callback === "function") {
                    task.callback = callback;
                } else if (task === (currentTask.length === 0 ? null : currentTask[0])) {
                    var_2372var_2388;
                }
                var_2399var_2409;
            } else {
                var_2372var_2388;
            }
            task = currentTask.length === 0 ? null : currentTask[0];
        }
        if (currentTask !== null) {
            isProcessing = true;
        } else {
            let nextTask = currentTask.length === 0 ? null : currentTask[0];
            if (nextTask !== null) {
                var_2407var_2402(nextTask.startTime - genericVar2);
            }
            isProcessing = false;
        }
        return isProcessing;
    } finally {
        currentTask = null;
        genericVar1 = genericVar2;
        isProcessing = false;
    }
}

if (typeof navigator !== "undefined" && navigator.scheduling && typeof navigator.scheduling.isInputPending === "function") {
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
}

let isSchedulerRunning = false;
let currentPriority = null;
let currentDeadline = -1;
let taskTimeoutHandle = 5;
let startTime = -1;

function genericVar() {
    return !genericVar.unstable_now(-genericVar < genericVar);
}

                    function genericVar() {
                        if (null !== genericVar) {
                            var genericVar = genericVar.unstable_now;
                            genericVar = genericVar;
                            var genericVar = true;
                            try {
                                genericVar = var_2420true, genericVar;
                            }
                            finally {
                                if (genericVar) {
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
                   if (typeof genericVar === "function") {
    genericVar = function() {
        var_2398var_2422;
    };
} else {
    if (typeof MessageChannel !== "undefined") {
        let genericVar = new MessageChannel();
        genericVar = genericVar.port2;
        genericVar.port1.onmessage = genericVar;
        genericVar = function() {
            genericVar.postMessage(null);
        };
    } else {
        genericVar = function() {
            var_2396var_2422, 0;
        };
    }
}

function renamedFunctionvar_2427() {
    genericVar = genericVar;
    if (!genericVar) {
        genericVar = true;
        genericVar;
    }
}

function renamedFunctionvar_2428(genericVar1, genericVar2) {
    if (typeof var_2396function === "function") {  // Ensure it's a function before calling it
        genericVar = var_2396function(var_2428var_2363.unstable_now(), genericVar1);
    } else {
        console.error("var_2396function is not defined or not a function");
    }
}


genericVar.unstable_IdlePriority = 5;
genericVar.unstable_ImmediatePriority = 1;
genericVar.unstable_LowPriority = 4;
genericVar.unstable_NormalPriority = 3;
genericVar.unstable_Profiling = null;
genericVar.unstable_UserBlockingPriority = 2;
genericVar.unstable_cancelCallback = function() {
    genericVar.callback = null;
};

genericVar.unstable_continueExecution = function() {
    if (!(genericVar || genericVar)) {
        genericVar = true;
        var_2404var_2405;
    }
};

genericVar.unstable_forceFrameRate = function(genericVar) {
    if (genericVar <= 0 || genericVar > 125) {
        console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
    } else {
        genericVar = genericVar > 0 ? Math.floor(1000 / genericVar) : 5;
    }
};

genericVar.unstable_getCurrentPriorityLevel = function() {
    return genericVar;
};

genericVar.unstable_getFirstCallbackNode = function() {
    return genericVar.length === 0 ? null : genericVar[0];
};

genericVar.unstable_next = function(genericVar) {
    switch (genericVar) {
        case 1:
        case 2:
        case 3:
            genericVar = 3;
            break;
        default:
            genericVar = genericVar;
    }
    return genericVar;
};

genericVar.unstable_pauseExecution = function() {};

genericVar.unstable_requestPaint = function() {};

genericVar.unstable_runWithPriority = function(genericVar1, genericVar2) {
    switch (genericVar1) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            break;
        default:
            genericVar1 = 3;
    }
    return genericVar;
};

if (typeof navigator !== "undefined" && navigator.scheduling && typeof navigator.scheduling.isInputPending === "function") {
    navigator.scheduling.isInputPending = navigator.scheduling.isInputPending.bind(navigator.scheduling);
}

                   genericVar.unstable_scheduleCallback = function(genericVar1, genericVar2, genericVar3) {
    let genericVar = genericVar.unstable_now();
    if (typeof genericVar === "object" && genericVar !== null) {
        genericVar = (typeof genericVar === "number" && genericVar.delay > 0) ? genericVar + genericVar : genericVar;
    } else {
        genericVar = genericVar;
    }

    switch (genericVar1) {
        case 1:
            genericVar = -1;
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
        priorityLevel: genericVar1,
        startTime: genericVar,
        expirationTime: genericVar + genericVar,
        sortIndex: -1
    };

    return genericVar;
};

genericVar.unstable_shouldYield = genericVar;

genericVar.unstable_wrapCallback = function(genericVar1) {
    return function() {
        let localVar = genericVar1;
        try {
            return localVar.apply(this, arguments);
        } finally {
            genericVar = localVar;
        }
    };
};

// Exports
genericVar.exports = genericVar;

// Function: renamedFunctionvar_2452
function renamedFunctionvar_2452(identifier) {
    let index = -1;
    for (let i = 0; i < genericVar.length; i++) {
        if (genericVar[i].identifier === identifier) {
            index = i;
            break;
        }
    }
    return index;
}

// Function: renamedFunctionvar_2456
function renamedFunctionvar_2456(genericVar) {
    let processedArray = [];
    for (let i = 0; i < genericVar.length; i++) {
        let currentVar = genericVar[i];
        let baseVar = currentVar.base ? currentVar[0] + currentVar.base : currentVar[0];
        let countVar = processedArray[baseVar] || 0;
        let cssVar = "." + baseVar + " " + currentVar[1];

        processedArray[baseVar] = countVar + 1;

        let processedVar = {
            css: currentVar[1],
            media: currentVar[2],
            sourceMap: currentVar[3],
            supports: currentVar[4],
            layer: currentVar[5]
        };
        processedArray.push(processedVar);
    }
    return processedArray;
}

                   function renamedFunctionvar_2469(genericVar1) {
    let genericVar = genericVar1.domAPIvar_2470;
    genericVar.updatevar_2469;

    return function(genericVar2) {
        if (genericVar2) {
            if (
                genericVar2.css === genericVar.css &&
                genericVar2.media === genericVar.media &&
                genericVar2.sourceMap === genericVar.sourceMap &&
                genericVar2.supports === genericVar.supports &&
                genericVar2.layer === genericVar.layer
            ) {
                return;
            }
            genericVar.updatevar_2469 = genericVar2;
        } else {
            genericVar.remove();
        }
    };
}

genericVar.exports = function(genericVar1, genericVar2) {
    let genericVar = var_2455var_2473 = genericVar1 || [];
    let genericVarBackup = genericVar2 || {};

    return function(genericVar3) {
        genericVar3 = genericVar3 || [];
        for (let i = 0; i < genericVar.length; i++) {
            let varRef = var_2451var_2475[i];
            varRef.references--;
        }

        let genericVarNew = var_2455var_2476;
        for (let i = 0; i < genericVar.length; i++) {
            let varRef = var_2451var_2475[i];
            if (varRef.references === 0) {
                varRef.updater();
                genericVar.splice(var_2481, 1);
            }
        }

        genericVar = genericVarNew;
    };
};

genericVar.exports = function(genericVar1, genericVar2) {
    let findTarget = function(genericVar3) {
        if (typeof genericVar[genericVar3] === "undefined") {
            let styleTarget = document.querySelector(var_2487);

            if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
                try {
                    styleTarget = styleTarget.contentDocument.head;
                } catch (error) {
                    styleTarget = null;
                }
            }

            genericVar[genericVar3] = styleTarget;
        }
        return genericVar[genericVar3];
    };

    let styleTarget = findTarget(genericVar1);

    if (!styleTarget) {
        throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    styleTarget.appendChild(var_2485);
};

               function renamedFunctionvar_2529(genericVar1, genericVar2) {
    Object.defineProperty(genericVar1, genericVar2, {
        value: genericVar2,
        enumerable: true,
        configurable: true,
        writable: true
    });
    return genericVar1[genericVar2];
}

// Create and insert style element
genericVar.exports = function() {
    let genericVar = document.createElement("style");
    genericVar.setAttributes(var_2492, genericVar.attributes);
    genericVar.insert(var_2492, genericVar.options);
    return genericVar;
};

// Export functions
genericVar.exports = function() {
    let genericVar = genericVar.nc;
    if (genericVar) {
        genericVar.setAttribute("nonce", genericVar);
    }
};

// Ensure document exists before accessing style elements
genericVar.exports = function() {
    if (typeof document === "undefined") {
        return {
            update: function() {},
            remove: function() {}
        };
    }

    let genericVar = genericVar.insertStyleElement(var_2499);
    return {
        update: function(genericVar1) {
            (function(genericVar2, genericVar3, genericVar4) {
                let content = "";
                if (genericVar1.supports) {
                    content += "@supports " + genericVar1.supports + " {\n";
                }
                if (genericVar1.media) {
                    content += "@media " + genericVar1.media + " {\n";
                }
                let hasLayer = typeof genericVar1.layer !== "undefined";
                if (hasLayer) {
                    content += "@layer" + (genericVar1.layer.length > 0 ? " " + genericVar1.layer : "") + " {\n";
                }
                content += genericVar1.css;
                if (hasLayer) {
                    content += "}\n";
                }
                if (genericVar1.media) {
                    content += "}\n";
                }
                if (genericVar1.supports) {
                    content += "}\n";
                }

                let sourceMap = genericVar1.sourceMap;
                if (sourceMap && typeof btoa !== "undefined") {
                    content += "\n/*# sourceMappingURL=data:application/json;base64," +
                        btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
                }

                if (typeof styleTagTransformvar_2505 === "function") {
                    styleTagTransformvar_2505(genericVar1, content, genericVar1.options);
                }
            })(genericVar, genericVar, genericVar);
        },
        remove: function() {
            if (genericVar.parentNode !== null) {
                genericVar.parentNode.removeChild(var_2508);
            }
        }
    };
};

// Remove all children from an element
genericVar.exports = function(genericVar1, genericVar2) {
    if (genericVar1.styleSheet) {
        genericVar1.styleSheet.cssText = genericVar2;
    } else {
        while (genericVar1.firstChild) {
            genericVar1.removeChild(genericVar1.firstChild);
        }
        genericVar1.appendChild(document.createTextNode(genericVar2));
    }
};

// Try-catch for defining a default object
try {
    genericVar = {};
} catch (error) {
    genericVar = function(genericVar1, genericVar2) {
        return (genericVar1[genericVar2] = genericVar2);
    };
}

                      function renamedFunctionvar_2537(genericVar1, genericVar2, genericVar3) {
    let genericVar = genericVar1 && genericVar1.prototype instanceof genericVar1 ? genericVar1 : genericVar2;
    let genericVarObj = Object.create(var_2541.prototype);
    let genericVarArray = new (var_2545var_2540 || []);
    
    Object.defineProperty(genericVarObj, "_invoke", {
        value: var_2546var_2537
    });

    return genericVarObj;
}

function renamedFunctionvar_2548(genericVar1, genericVar2) {
    try {
        return {
            type: "normal",
            arg: genericVar1.call(var_2549, genericVar2)
        };
    } catch (error) {
        return {
            type: "throw",
            arg: error
        };
    }
}

genericVar.wrap = genericVar;

let genericVarObj = {};

function genericVar() {}

function genericVar() {}

function genericVar() {}

let genericVarProto = {};

var_2528var_2555(genericVar, function() {
    return this;
});

let genericVarPrototype = Object.getPrototypeOf;
let genericVarInstance = genericVarPrototype && var_2556var_2556(genericVarPrototype([]));

if (genericVarInstance && genericVarInstance !== genericVarPrototype && genericVarInstance.call(genericVarInstance, genericVar)) {
    genericVarPrototype = genericVarInstance;
}

let genericVarBase = genericVarPrototype.prototype = Object.create(var_2555);

function renamedFunctionvar_2561() {
    ["next", "throw", "return"].forEach(function(genericVar) {
        var_2528var_2561(genericVar, function() {
            return this._invoke(var_2562, genericVar);
        });
    });
}

function renamedFunctionvar_2565(genericVar1) {
    function renamedFunctionvar_2568(genericVar2, genericVar3, genericVar4) {
        let genericVarVal = var_2547var_2565[genericVar2];

        if ("throw" !== genericVarVal.type) {
            let genericVarArg = genericVarVal.arg;
            let genericVarValue = genericVarArg.value;

            if (genericVarValue && typeof var_2515var_2574 === "object" && genericVarValue.call(var_2574, "__await")) {
                return genericVarArg.resolve(var_2574.__await)
                    .then(function(genericVar) {
                        return genericVar("next", genericVar, genericVar3, genericVar4);
                    })
                    .catch(function(genericVar) {
                        return genericVar("throw", genericVar, genericVar3, genericVar4);
                    });
            } else {
                return genericVarArg.resolve(var_2574)
                    .then(function(genericVar) {
                        genericVarValue = genericVar;
                        var_2570var_2573;
                    })
                    .catch(function(genericVar) {
                        return genericVar("throw", genericVar, genericVar3, genericVar4);
                    });
            }
        }

        var_2571var_2572.arg;
    }

    let genericVar;
    Object.defineProperty(this, "_invoke", {
        value: function(genericVar1, genericVar2) {
            function genericVar() {
                return new var_2566function(genericVar1, function(genericVar3, genericVar4) {
                    var_2567var_2580(genericVar1, genericVar3, genericVar4, genericVar2);
                });
            }
            return genericVar1 = genericVar1 ? genericVar1.then(var_2582, genericVar2) : genericVar2;
        }
    });
}

                       function renamedFunctionvar_2595(genericVar1) {
    let genericVar = genericVar1.method;
    let iterator = genericVar1.iterator[genericVar];

    if (typeof iterator === "undefined") {
        genericVar.delegate = null;
        if (!("throw" === genericVar && genericVar1.iterator["return"] && (genericVar1.method = "return", genericVar1.arg = undefined, genericVar1(genericVar, genericVar1, "throw" === genericVar1.method)))) {
            if ("return" !== genericVar) {
                genericVar1.method = "throw";
                genericVar1.arg = new TypeError("The iterator does not provide a '" + genericVar + "' method");
            }
        }
        return genericVar;
    }

    let result = var_2547var_2598(genericVar1.iterator, genericVar1.arg);
    if ("throw" === result.type) {
        genericVar1.method = "throw";
        genericVar1.arg = result.arg;
        genericVar1.delegate = null;
        return genericVar1;
    }

    let resultValue = result.arg;
    return resultValue 
        ? resultValue.done 
            ? (genericVar1[resultValue.resultName] = resultValue.value, 
               genericVar1.next = resultValue.nextLoc, 
               "return" !== genericVar1.method && (genericVar1.method = "next", genericVar1.arg = undefined, genericVar1.delegate = null, genericVar1)) 
            : genericVar1 
        : (genericVar1.method = "throw", genericVar1.arg = new TypeError("iterator result is not an object"), genericVar1.delegate = null, genericVar1);
}

function renamedFunctionvar_2602() {
    let genericVar = {
        tryLoc: genericVar[0]
    };

    if (1 in genericVar) {
        genericVar.catchLoc = genericVar[1];
    }

    if (2 in genericVar) {
        genericVar.finallyLoc = genericVar[2];
        genericVar.afterLoc = genericVar[3];
    }

    this.tryEntries.push(var_2603);
}

function renamedFunctionvar_2605() {
    let genericVar = genericVar.completion || {};
    genericVar.type = "normal";
    delete genericVar.arg;
    genericVar.completion = genericVar;
}

function renamedFunctionvar_2607() {
    this.tryEntries = [{
        tryLoc: "root"
    }];
    genericVar.forEach(var_2601, this);
    this.reset(true);
}

function renamedFunctionvar_2608(genericVar) {
    if (genericVar) {
        let value = genericVar[genericVar];
        if (value) {
            return value.call(var_2608);
        }
        if (typeof genericVar.next === "function") {
            return genericVar;
        }
        if (!isNaN(genericVar.length)) {
            let index = -1;
            let iterator = function() {
                for (index++; index < genericVar.length;) {
                    if (genericVar.call(genericVar, index)) {
                        genericVar.value = genericVar[index];
                        genericVar.done = false;
                        return genericVar;
                    }
                }
                genericVar.value = undefined;
                genericVar.done = true;
                return genericVar;
            };
            return { next: iterator };
        }
    }
    return { next: genericVar };
}

function genericVar() {
    return {
        value: undefined,
        done: true
    };
}

genericVar.prototype = genericVar;
Object.defineProperty(genericVar, "constructor", {
    value: genericVar,
    configurable: true
});

genericVar.displayName = var_2528var_2554(genericVar, "GeneratorFunction");

genericVar.isGeneratorFunction = function() {
    let genericVar = (typeof genericVar === "function" && genericVar.constructor);
    return !!genericVar && (genericVar === genericVar || "GeneratorFunction" === (genericVar.displayName || genericVar.name));
};

genericVar.mark = function(genericVar) {
    if (Object.setPrototypeOf) {
        Object.setPrototypeOf(var_2616, genericVar);
    } else {
        genericVar.__proto__ = genericVar;
        var_2528var_2616(genericVar, "GeneratorFunction");
    }
    genericVar.prototype = Object.create(var_2559);
    return genericVar;
};

genericVar.awrap = function genericVar() {
    return {
        __await: genericVar
    };
};

genericVar.AsyncIterator = genericVar;

genericVar.async = function(genericVar1, genericVar2, genericVar3, genericVar4, genericVar5) {
    if (typeof genericVar1 === "undefined") {
        genericVar1 = Promise;
    }
    
    let asyncIterator = new var_2564var_2536(genericVar1, genericVar2, genericVar3, genericVar4, genericVar5);
    
    return genericVar.isGeneratorFunctionvar_2619 
        ? asyncIterator 
        : asyncIterator.next().then(function(genericVar) {
            return genericVar.done ? genericVar.value : asyncIterator.next();
        });
};

var_2528var_2559(genericVar, "Generator");
var_2528var_2559(genericVar, function() {
    return this;
});

var_2528var_2559("toString", function() {
    return "[object Generator]";
});

genericVar.keys = function(genericVar) {
    let keysArray = Object.keys(genericVar);
    keysArray.reverse();
    
    return function() {
        while (keysArray.length > 0) {
            let key = keysArray.pop();
            if (key in genericVar) {
                return { value: key, done: false };
            }
        }
        return { value: undefined, done: true };
    };
};

genericVar.values = genericVar;
genericVar.prototype = {
    constructor: genericVar,
    reset: function genericVar() {
        this.prev = 0;
        this.next = 0;
        this.sent = this._sent = undefined;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined;
        this.tryEntries.forEachvar_2604;
        if (!genericVar) {
            for (let key in this) {
                if (key.charAt(0) === "t" && this.hasOwnProperty(key) && !isNaN(+key.slice(1))) {
                    this[key] = undefined;
                }
            }
        }
    },

    stop: function() {
        this.done = true;

        // Ensure tryEntries is properly defined
        if (!Array.isArray(this.tryEntries) || this.tryEntries.length === 0) {
            return;
        }

        // Ensure we have a valid completion object
        let genericVar = this.tryEntries[0].completion || {};

        // If completion type is "throw", rethrow the stored exception
        if (genericVar.type === "throw" && genericVar.arg !== undefined) {
            throw genericVar.arg;
        }

        return this.rval;
    },

    dispatchException: function(genericVar) {
        if (this.done) {
            throw genericVar;
        }

        let self = this;

        function renamedFunctionvar_2637(genericVar1) {
            self.type = "throw";
            self.arg = genericVar1;
            self.next = genericVar1;

            if (genericVar1) {
                self.method = "next";
                self.arg = undefined;
            }
            return !!genericVar1;
        }

        for (let i = this.tryEntries.length - 1; i >= 0; i--) {
            let genericVar = this.tryEntries[i];
            let completion = genericVar.completion;

            if (genericVar.tryLoc === "root") {
                return "end";
            }

            if (genericVar.tryLoc <= this.prev) {
                let hasCatch = Object.prototype.hasOwnProperty.call(genericVar, "catchLoc");
                let hasFinally = Object.prototype.hasOwnProperty.call(genericVar, "finallyLoc");

                if (hasCatch && hasFinally) {
                    if (this.prev < genericVar.catchLoc) {
                        return var_2636var_2641.catchLoc, true;
                    }
                    if (this.prev < genericVar.finallyLoc) {
                        return var_2636var_2641.finallyLoc;
                    }
                } else {
                    if (hasCatch) {
                        if (this.prev < genericVar.catchLoc) {
                            return var_2636var_2641.catchLoc, true;
                        }
                    } else {
                        if (!hasFinally) {
                            throw new Error("try statement without catch or finally");
                        }
                        if (this.prev < genericVar.finallyLoc) {
                            return var_2636var_2641.finallyLoc;
                        }
                    }
                }
            }
        }
    }
},
generator = {
    abrupt: function(type, arg) {
        for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i];
            if (entry.tryLoc <= this.prev && Object.prototype.hasOwnProperty.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
                var finallyEntry = entry;
                break;
            }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            finallyEntry = null;
        }

        const record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return record;
        }
        return this.complete(record);
    },

    complete: function(record) {
        if (record.type === "throw") {
            throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
        }
        else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
        }
        else if (record.type === "normal" && record.arg) {
            this.next = record.arg;
        }
        return record;
    },

    finish: function(finallyLoc) {
        for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i];
            if (entry.finallyLoc === finallyLoc) {
                this.complete(entry.completion, entry.afterLoc);
                if (typeof resetTryEntry === 'function') {
                    resetTryEntry(entry);
                }
                return finallyLoc;
            }
        }
    },

    catch: function(tryLoc) {
        for (let i = this.tryEntries.length - 1; i >= 0; --i) {
            const entry = this.tryEntries[i];
            if (entry.tryLoc === tryLoc) {
                const record = entry.completion;
                if (record.type === "throw") {
                    const thrown = record.arg;
                    if (typeof resetTryEntry === 'function') {
                        resetTryEntry(entry);
                    }
                    return thrown;
                }
            }
        }
        throw new Error("illegal catch attempt");
    },

    delegate: function(iterable, resultName, nextLoc) {
        this.delegate = {
            iterator: typeof values === 'function' ? values(iterable) : iterable,
            resultName: resultName,
            nextLoc: nextLoc
        };

        if (this.method === "next") {
            this.arg = undefined;
        }
        return nextLoc;
    }
};

module.exports = generator;
module.exports.__esModule = true;
module.exports.default = generator;

function renamedFunctionvar_2665() {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        genericVar = function(genericVar) {
            return typeof genericVar;
        };
    } else {
        genericVar = function(genericVar) {
            return genericVar && typeof Symbol === "function" && genericVar.constructor === Symbol && genericVar !== Symbol.prototype ? "symbol" : typeof genericVar;
        };
    }
    return genericVar;
}

genericVar.exports = genericVar;
genericVar.exports.__esModule = true;
genericVar.exports["default"] = genericVar;

genericVar.exports = genericVar;
genericVar.exports.__esModule = true;
genericVar.exports["default"] = genericVar;

try {
    regeneratorRuntime = genericVar;
} catch (error) {
    if (typeof globalThis === "object") {
        globalThis.regeneratorRuntime = error;
    } else {
        Function("r", "regeneratorRuntime = r")(error);
    }
}

var genericVar = {};
            function renamedFunctionvar_2675() {
                var genericVar = genericVar[genericVar];
                if (undefined !== genericVar) {
                    return genericVar.exports;
                }
                var genericVar = genericVar[genericVar] = {
                    id: genericVar,
                    exports: {
                    }
                }
                ;
                moduleDefinitions[genericVar](genericVar, genericVar.exports, genericVar);
                return genericVar.exports;
            }
           genericVar.n = function() {
    let genericVar = genericVar && genericVar.__esModule ? genericVar["default"] : genericVar;
    Object.defineProperty(genericVar, "_invoke", {
        value: var_2546var_2537
    });
    return genericVar;
};

genericVar.d = function(genericVar) {
    for (let prop in genericVar) {
        if (genericVar.hasOwnProperty(prop) && !genericVar.hasOwnProperty(prop)) {
            Object.defineProperty(genericVar, prop, {
                enumerable: true,
                get: function() {
                    return genericVar[prop];
                }
            });
        }
    }
};

genericVar.o = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

genericVar.nc = undefined;

(() => {
    "use strict";
    let genericVar = genericVar;
    let anotherVar = genericVar;

    function renamedFunctionvar_2665(genericVar, length) {
        if (genericVar == null || length > genericVar.length) {
            length = genericVar.length;
        }
        let result = new Array(length);
        for (let i = 0; i < length; i++) {
            result[i] = genericVar[i];
        }
        return result;
    }

    function renamedFunctionvar_2693(genericVar) {
        if (genericVar) {
            if (typeof genericVar === "string") {
                return Array.from(genericVar);
            }
            let type = Object.prototype.toString.call(genericVar).slice(8, -1);
            if (type === "Object" && genericVar.constructor) {
                type = genericVar.constructor.name;
            }
            return type === "Map" || type === "Set" ? Array.from(genericVar) :
                type === "Arguments" || /^Uint|Int(8|16|32)Array$/.test(type)
                ? Array.from(genericVar)
                : undefined;
        }
    }

    function renamedFunctionvar_2697() {
        return function(genericVar) {
            if (Array.isArray(genericVar)) {
                return Array.from(genericVar);
            }
        };
    }
})();

genericVar || function() {
    if (typeof Symbol !== "undefined" && (genericVar[Symbol.iterator] != null || genericVar["@@iterator"] != null)) {
        return Array.from(var_2699);
    }
} || var_2692var_2697 || function() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator] method.");
};

function renamedFunctionvar_2701(genericVar1, genericVar2) {
    return function() {
        if (Array.isArray(genericVar1)) {
            return genericVar1;
        }
    };
}

genericVar || function(genericVar1, genericVar2) {
    let genericVar = null == genericVar1 ? null : (typeof Symbol !== "undefined" && genericVar1[Symbol.iterator] || genericVar1["@@iterator"]);
    if (genericVar) {
        let iterator;
        try {
            iterator = genericVar.call(genericVar1).next;
            if (iterator === 0) {
                if (Object(iterator) !== iterator) {
                    return;
                }
                genericVar = false;
            } else {
                for (let item; !(genericVar = genericVar.call(genericVar).done); genericVar = true) {
                    genericVar.value = item.value;
                    genericVar.done = false;
                    return genericVar;
                }
            }
        } catch (error) {
            genericVar = true;
            genericVar = error;
        } finally {
            if (genericVar && genericVar["return"]) {
                genericVar["return"](null !== genericVar);
            }
        }
    }
};

                  genericVar.n = function() {
    let genericVar = genericVar && genericVar.__esModule ? genericVar["default"] : genericVar;
    Object.defineProperty(genericVar, "_invoke", {
        value: var_2546var_2537
    });
    return genericVar;
};

genericVar.d = function(genericVar) {
    for (let prop in genericVar) {
        if (genericVar.hasOwnProperty(prop) && !genericVar.hasOwnProperty(prop)) {
            Object.defineProperty(genericVar, prop, {
                enumerable: true,
                get: function() {
                    return genericVar[prop];
                }
            });
        }
    }
};

genericVar.o = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

genericVar.nc = undefined;

(() => {
    "use strict";
    let genericVar = genericVar;
    let anotherVar = genericVar;

    function renamedFunctionvar_2665(genericVar, length) {
        if (genericVar == null || length > genericVar.length) {
            length = genericVar.length;
        }
        let result = new Array(length);
        for (let i = 0; i < length; i++) {
            result[i] = genericVar[i];
        }
        return result;
    }

    function renamedFunctionvar_2693(genericVar) {
        if (genericVar) {
            if (typeof genericVar === "string") {
                return Array.from(genericVar);
            }
            let type = Object.prototype.toString.call(genericVar).slice(8, -1);
            if (type === "Object" && genericVar.constructor) {
                type = genericVar.constructor.name;
            }
            return type === "Map" || type === "Set" ? Array.from(genericVar) :
                type === "Arguments" || /^Uint|Int(8|16|32)Array$/.test(type)
                ? Array.from(genericVar)
                : undefined;
        }
    }

    function renamedFunctionvar_2697() {
        return function(genericVar) {
            if (Array.isArray(genericVar)) {
                return Array.from(genericVar);
            }
        };
    }
})();

genericVar || function() {
    if (typeof Symbol !== "undefined" && (genericVar[Symbol.iterator] != null || genericVar["@@iterator"] != null)) {
        return Array.from(var_2699);
    }
} || var_2692var_2697 || function() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator] method.");
};

function renamedFunctionvar_2701(genericVar1, genericVar2) {
    return function() {
        if (Array.isArray(genericVar1)) {
            return genericVar1;
        }
    };
}

// React component definitions
const RenamedFunctionvar2744 = (props) => {
  // Ensure props is a valid object
  if (typeof props !== 'object' || props === null) {
    props = {};
  }

  // Destructure with fallback values
  const {
    id = null,
    nick = '',
    skinUrl = '',
    whitelisted = false,
    waveCount = 0,
    onToggle = () => {},
    onSkinClick = () => {},
    onNameClick = () => {},
  } = props;

  // Manage local state
  const [isActive, setIsActive] = React.useState(false);

  // Only use background image if it matches the Imgur pattern
  const style = (skinUrl && /^https?:\/\/[a-z0-9]+\.?imgur\.com\/.*?$/i.test(skinUrl))
    ? { backgroundImage: `url("${skinUrl}")` }
    : null;

  return (
    <div className="info">
      {/* Toggle button */}
      <div
        className="wave-btn"
        onClick={() => onToggle(!isActive)}
      >
        {isActive ? '✔' : '❌'}
      </div>

      {/* Skin clickable area */}
      <div
        className="skin"
        style={style}
        onClick={onSkinClick}
      />

      {/* Name clickable area */}
      <div
        className="name"
        onClick={onNameClick}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
      >
        {whitelisted && nick ? `#${nick}` : nick}
      </div>

      {/* Wave count */}
      <div className="wave-count">
        {waveCount}
      </div>
    </div>
  );
};

const MyComponent = () => {
    const [genericVar, setGenericVar] = React.useState(false);
    const genericVarRef = React.useRef(genericVar);

    React.useEffect(() => {
        genericVarRef.current = genericVar;
    }, [genericVar]);

    return (
        <div className="flex-row">
            <div className="input-box-cell rest">{genericVar ? "Checked" : "Not Checked"}</div>
            <div className="input-box-cell">
                <label className="switch">
                    <input
                        className="checkbox"
                        type="checkbox"
                        checked={genericVar}
                        onChange={(e) => setGenericVar(e.target.checked)}
                        disabled={false}
                    />
                    <div className="slider round" data-on="ON" data-off="OFF" />
                </label>
            </div>
        </div>
    );
};

// Corrected function with proper syntax
function renamedFunctionvar_2795(param1, param2, param3, param4, param5, param6) {
    try {
        let result = param1[param2];
        let value = result.value;
    } catch (error) {
        return;
    }
}

// Corrected Promise handling
function renamedFunctionvar_2806() {
    return function() {
        return new Promise(function(resolve, reject) {
            let genericVar = genericVar.apply(null, arguments);
            
            function renamedFunctionvar_2812() {
                genericVar("next", genericVar);
            }

            function renamedFunctionvar_2814() {
                genericVar("throw", genericVar);
            }
        });
    };
}

                var genericVar = genericVar;
                var genericVar = genericVar.nvar_2815;
                /* Error Handling */
function renamedFunctionvar_2818(target, properties) {
                    for (let i = 0; i < properties.length; i++) {
                        let descriptor = properties[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) {
                            descriptor.writable = true;
                        }
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                /* Error Handling */
function renamedFunctionvar_2823(subClass, superClass) {
                    const setProto = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(subClass, superClass) {
                        subClass.__proto__ = superClass;
                        return subClass;
                    };
                    return setProto(subClass, superClass);
                }

                /* Error Handling */
function renamedFunctionvar_2828(instance, Constructor) {
                    if (instance && (typeof instance === "object" || typeof instance === "function")) {
                        return instance;
                    }
                    if (instance !== undefined) {
                        throw new TypeError("Derived constructors may only return object or undefined");
                    }
                    return function() {
                        if (this === undefined) {
                            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        }
                        return this;
                    }();
                }

                /* Error Handling */
function renamedFunctionvar_2832() {
                    const getProto = Object.getPrototypeOf ? Object.getPrototypeOf.bind() : function(obj) {
                        return obj.__proto__ || Object.getPrototypeOf(obj);
                    };
                    return getProto(this);
                }

                /* Error Handling */
function renamedFunctionvar_2835(target, args, newTarget) {
                    const construct = (function() {
                        if (typeof Reflect === "undefined" || !Reflect.construct) {
                            return false;
                        }
                        if (Reflect.construct.sham) {
                            return false;
                        }
                        if (typeof Proxy === "function") {
                            return true;
                        }
                        try {
                            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                            return true;
                        }
                        catch (e) {
                            return false;
                        }
                    })() ? Reflect.construct.bind() : function(target, args, newTarget) {
                        const argsArray = [null];
                        argsArray.push.apply(argsArray, args);
                        const bound = Function.bind.apply(target, argsArray);
                        const instance = new bound();
                        if (newTarget) {
                            Object.setPrototypeOf(instance, newTarget.prototype);
                        }
                        return instance;
                    };
                    return construct.apply(null, arguments);
                }

                /* Error Handling */
function renamedFunctionvar_2845() {
                    const cache = typeof Map === "function" ? new Map() : undefined;
                    return function(fn) {
                        if (fn === null || (fn = Function.toString.call(fn).indexOf("[native code]") === -1)) {
                            return fn;
                        }
                        if (typeof fn !== "function") {
                            throw new TypeError("Super expression must either be null or a function");
                        }
                        if (cache !== undefined) {
                            if (cache.has(fn)) {
                                return cache.get(fn);
                            }
                            cache.set(fn, fn);
                        }
                        function Constructor() {
                            return Reflect.construct(fn, arguments, this.constructor);
                        }
                        Constructor.prototype = Object.create(fn.prototype, {
                            constructor: {
                                value: Constructor,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                        return Object.setPrototypeOf(Constructor, fn);
                    };
                }

                /* Error Handling */
function renamedFunctionvar_2851() {
                    const isNativeReflectConstruct = (function() {
                        if (typeof Reflect === "undefined" || !Reflect.construct) {
                            return false;
                        }
                        if (Reflect.construct.sham) {
                            return false;
                        }
                        if (typeof Proxy === "function") {
                            return true;
                        }
                        try {
                            Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
                            return true;
                        }
                        catch (e) {
                            return false;
                        }
                    })();

                    return function(Constructor, args, Class) {
                        let result;
                        if (isNativeReflectConstruct) {
                            const NewTarget = Object.getPrototypeOf(this).constructor;
                            result = Reflect.construct(Constructor, args, NewTarget);
                        } else {
                            result = Constructor.apply(this, args);
                        }
                        return result;
                    };
                }

                const CustomError = (function(Error) {
                    function defineProperties(target, props) {
                        if (typeof target !== "function" && target !== null) {
                            throw new TypeError("Super expression must either be null or a function");
                        }
                        target.prototype = Object.create(props && props.prototype, {
                            constructor: {
                                value: target,
                                writable: true,
                                configurable: true
                            }
                        });
                        Object.defineProperty(target, "prototype", {
                            writable: false
                        });
                        if (props) {
                            Object.setPrototypeOf(target, props);
                        }
                    }

                    const _super = Object.create(Error.prototype);
                    const _this = renamedFunctionvar_2851.call(this);

                    function CustomError(code, message) {
                        if (!(this instanceof CustomError)) {
                            throw new TypeError("Cannot call a class as a function");
                        }
                        _this.code = code;
                        return _this;
                    }

                    if (defineProperties) {
                        defineProperties(CustomError.prototype);
                    }
                    if (defineProperties) {
                        defineProperties(CustomError);
                    }
                    Object.defineProperty(CustomError, "prototype", {
                        writable: false
                    });
                    return CustomError;
                })(Error);

                /* Error Handling */
                
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
                function renamedFunctionvar_2927() {
                    var genericVar;
                    var genericVar;
                    var genericVar = genericVar.deltaApp;
                    
                    var genericVar = var_2700var_2685.useState(false);
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];
                    
                    var genericVar = var_2700var_2685.useState(false);
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];
                    
                    var genericVar = var_2700var_2685.useState(false);
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];
                    
                    var genericVar = var_2700var_2685.useState(false);
                    var genericVar = genericVar[0];
                    var genericVar = genericVar[1];
                    
                    var genericVar = genericVar.useMemo(function() {
                        return function genericVar() {
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
                            
                            function renamedFunctionvar_2956() {
                                genericVar = [];
                                for (var genericVar = 0; genericVar < genericVar; genericVar++) {
                                    var genericVar = var_2882var_2945(genericVar, genericVar);
                                    genericVar.on("close", genericVar);
                                    genericVar.push(var_2958);
                                }
                            }
                            
                            function renamedFunctionvar_2960(genericVar) {
                                if ("noevent" !== genericVar && (console.log("Reconnecting Client " + genericVar.Id, genericVar || genericVar))) {
                                    var genericVar = genericVar.indexOf(var_2960);
                                    if (!(genericVar < 0)) {
                                        if (genericVar && 0 === genericVar) {
                                            genericVar.connect.then(function() {
                                                return genericVar.sendSpectate;
                                            });
                                        }
                                        else {
                                            genericVar.connect.then(function() {
                                                return genericVar.sendSpectate;
                                            }).then(function() {
                                                return genericVar.sendFreeSpectate;
                                            }).then(function() {
                                                return genericVar.setTargetPosition(var_2954[genericVar].x, genericVar[genericVar].y);
                                            });
                                        }
                                    }
                                }
                            }
                            
                            function genericVar() {
                                return genericVar = genericVar(genericVar.mark(function genericVar() {
                                    return genericVar.wrap(function(genericVar) {
                                        for (;;) {
                                            switch (genericVar.prev = genericVar.next) {
                                                case 0:
                                                    genericVar.next = 2;
                                                    return Promise.all(var_2953.map(function(genericVar) {
                                                        return genericVar.connect;
                                                    }));
                                                case 2:
                                                    genericVar.next = 4;
                                                    return Promise.all(var_2953.map(function(genericVar, genericVar) {
                                                        return genericVar && 0 === genericVar ? genericVar.sendSpectate : genericVar.sendSpectate.then(function() {
                                                            return genericVar.sendFreeSpectate;
                                                        });
                                                    }));
                                                case 4:
                                                case "end":
                                                    return genericVar.stop();
                                            }
                                        }
                                    }, genericVar);
                                })).apply(this, arguments);
                            }
                            
                            function genericVar() {
                                for (; 0 !== genericVar.length;) {
                                    var genericVar = genericVar.shift();
                                    if (genericVar) {
                                        genericVar.destroy();
                                    }
                                }
                            }
                            
                            function genericVar() {
                                return genericVar = genericVar(genericVar.mark(function genericVar() {
                                    return genericVar.wrap(function(genericVar) {
                                        for (;;) {
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
                                                        });
                                                    }
                                                    genericVar.prev = 6;
                                                    genericVar.next = 9;
                                                    return genericVar.apply(this, arguments);
                                                case 9:
                                                    if (genericVar) {
                                                        genericVar({
                                                            loading: false,
                                                            enabled: true
                                                        });
                                                    }
                                                    genericVar = setInterval(function() {
                                                        genericVar = [{
                                                            x: genericVar.master.protocol_viewX + 2800,
                                                            y: genericVar.master.protocol_viewY
                                                        }, {
                                                            x: genericVar.master.protocol_viewX,
                                                            y: genericVar.master.protocol_viewY + 2800
                                                        }, {
                                                            x: genericVar.master.protocol_viewX - 2800,
                                                            y: genericVar.master.protocol_viewY
                                                        }, {
                                                            x: genericVar.master.protocol_viewX,
                                                            y: genericVar.master.protocol_viewY - 2800
                                                        }, {
                                                            x: genericVar.master.protocol_viewX + 5600,
                                                            y: genericVar.master.protocol_viewY + 5600
                                                        }, {
                                                            x: genericVar.master.protocol_viewX + 5600,
                                                            y: genericVar.master.protocol_viewY - 5600
                                                        }, {
                                                            x: genericVar.master.protocol_viewX - 5600,
                                                            y: genericVar.master.protocol_viewY + 5600
                                                        }, {
                                                            x: genericVar.master.protocol_viewX - 5600,
                                                            y: genericVar.master.protocol_viewY - 5600
                                                        }];
                                                        genericVar.slice(1).forEach(function(genericVar, genericVar) {
                                                            return genericVar.setTargetPosition(var_2954[genericVar].x, genericVar[genericVar].y);
                                                        });
                                                    }, 500);
                                                    genericVar.next = 17;
                                                    break;
                                                case 13:
                                                    genericVar.prev = 13;
                                                    genericVar.t0 = genericVar["catch"](6);
                                                    console.log("ExtendedMap Error: " + genericVar.t0 + ", disabling");
                                                    genericVar();
                                                case 17:
                                                case "end":
                                                    return genericVar.stop();
                                            }
                                        }
                                    }, genericVar, null, [[6, 13]]);
                                })).apply(this, arguments);
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
                            }

                            function genericVar() {
                                return genericVar = genericVar(genericVar.mark(function genericVar() {
                                    return genericVar.wrap(function(genericVar) {
                                        for (;;) {
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
                                                        });
                                                    }
                                                    genericVar.prev = 7;
                                                    genericVar.next = 10;
                                                    return genericVar.apply(this, arguments);
                                                case 10:
                                                    if (genericVar) {
                                                        genericVar({
                                                            loading: false,
                                                            enabled: true
                                                        });
                                                    }
                                                    genericVar.forEach(function(genericVar, genericVar) {
                                                        return genericVar.setTargetPosition(var_2954[genericVar].x, genericVar[genericVar].y);
                                                    });
                                                    genericVar.next = 18;
                                                    break;
                                                case 14:
                                                    genericVar.prev = 14;
                                                    genericVar.t0 = genericVar["catch"](7);
                                                    console.log("FullMap Error: " + genericVar.t0.code + ", " + genericVar.t0.message + ", disabling");
                                                    genericVar();
                                                case 18:
                                                case "end":
                                                    return genericVar.stop();
                                            }
                                        }
                                    }, genericVar, null, [[7, 14]]);
                                })).apply(this, arguments);
                            }
                            
                            function genericVar() {
                                if (genericVar) {
                                    genericVar();
                                    genericVar = false;
                                    if (genericVar) {
                                        genericVar({
                                            loading: false,
                                            enabled: false
                                        });
                                    }
                                }
                            }
                            
                            return {
                                enableExtendedMap: function() {
                                    return genericVar.apply(this, arguments);
                                },
                                disableExtendedMap: genericVar,
                                enableFullMap: function() {
                                    return genericVar.apply(this, arguments);
                                },
                                disableFullMap: genericVar
                            };
                        };
                    }, {
                        app: genericVar,
                        onExtendedMapStateChanged: function(genericVar) {
                            var genericVar = genericVar.loading;
                            var genericVar = genericVar.enabled;
                            var_2939var_2984;
                            var_2933var_2985;
                        },
                        onFullMapStateChanged: function(genericVar) {
                            var genericVar = genericVar.loading;
                            var genericVar = genericVar.enabled;
                            var_2942var_2987;
                            var_2936var_2988;
                        }
                    });
                    
                    var genericVar = genericVar.useRef(var_2930._server.ws);
                    genericVar = function() {
                        if (genericVar._server.ws !== genericVar.current) {
                            genericVar.disableExtendedMap();
                            genericVar.disableFullMap();
                            genericVar.current = genericVar._server.ws;
                        }
                    };
                    
                    genericVar = genericVar.useRef(var_2928);
                    var_2771(function() {
                        genericVar.current = genericVar;
                    }, [genericVar]);
                    
                    genericVar.useEffect(function() {
                        if (0 || true) {
                            var genericVar = setInterval(function() {
                                return genericVar.current();
                            }, 0);
                            return function() {
                                return clearInterval(var_2990);
                            };
                        }
                    }, [0]);
                    
                    return genericVar.jsxs(genericVar.Fragment, {
                        children: [genericVar.jsx(genericVar, {
                            caption: "Ext. Map",
                            enabled: genericVar,
                            disabled: genericVar || genericVar,
                            onChange: function(genericVar) {
                                toastr.info("" + genericVar ? "Enabled" : "Disabled" + " extended map");
                                if (genericVar) {
                                    genericVar.enableExtendedMap();
                                } else {
                                    genericVar.disableExtendedMap();
                                }
                            }
                        }), genericVar.jsx(genericVar, {
                            caption: "Full Map", 
                            enabled: genericVar,
                            disabled: genericVar || genericVar,
                            onChange: function(genericVar) {
                                toastr.info("" + genericVar ? "Enabled" : "Disabled" + " full map");
                                if (genericVar) {
                                    genericVar.enableFullMap();
                                } else {
                                    genericVar.disableFullMap();
                                }
                            }
                        })]
                    });
                }
                
                function renamedFunctionvar_2994(genericVar) {
                    var genericVar = Object.keys(var_2994);
                    if (Object.getOwnPropertySymbols) {
                        var genericVar = Object.getOwnPropertySymbols(var_2994);
                        if (genericVar) {
                            genericVar = genericVar.filter(function(genericVar) {
                                return Object.getOwnPropertyDescriptor(var_2994, genericVar).enumerable;
                            });
                        }
                        genericVar.push.apply(var_2996, genericVar);
                    }
                    return genericVar;
                }
                
                function renamedFunctionvar_3000() {
                    for (var genericVar = 1; genericVar < arguments.length; genericVar++) {
                        var genericVar = null != arguments[genericVar] ? arguments[genericVar] : {};
                        if (genericVar % 2) {
                            var_2993Object(genericVar, true).forEach(function(genericVar) {
                                var_2726var_3000(genericVar, genericVar[genericVar]);
                            });
                        } else if (Object.getOwnPropertyDescriptors) {
                            Object.defineProperties(var_3000, Object.getOwnPropertyDescriptors(genericVar));
                        } else {
                            var_2993Object(genericVar).forEach(function(genericVar) {
                                Object.defineProperty(var_3000, genericVar, Object.getOwnPropertyDescriptor(genericVar, genericVar));
                            });
                        }
                    }
                    return genericVar;
                }
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
    const intervalId = setInterval(() => {
        if (!window.ApiDelta || !window.app) {
            return;
        }
        clearInterval(genericVar);
        const getApi = window.ApiDelta.getApi;
        window.ApiDelta.getApi = function() {
            const result = getApi.call(this, arguments);
            if (!window.sixTomoeMod) {
                window.sixTomoeMod = function(app, service, api) {
                    let apis = [api];
                    const listeners = {};
                    
                    function getListeners(event) {
                        if (!listeners.hasOwnProperty(event)) {
                            listeners[event] = [];
                        }
                        return listeners[event];
                    }

                    return {
                        deltaApp: app,
                        deltaService: service,
                        get deltaApis() {
                            return [...apis];
                        },
                        addApi(api) {
                            if (apis.includes(api)) {
                                return;
                            }
                            apis.push(api);
                            getListeners("update").forEach(function(listener) {
                                listener({
                                    deltaApp: app,
                                    deltaService: service,
                                    deltaApis: apis
                                });
                            });
                        },
                        on(event, listener) {
                            getListeners(event).push(listener);
                        },
                        off(event, listener) {
                            const index = getListeners(event).findIndex(l => l === listener);
                            if (index < 0) {
                                return;
                            }
                            getListeners(event).splice(index, 1);
                        }
                    };
                };
                window.sixTomoeMod(window.app, service, api);
                const script = document.createElement("script");
                script.appendChild(document.createTextNode("(" + initializeFunction + ")();"));
                document.body.appendChild(script);
            }
            else {
                window.sixTomoeMod.addApi(result);
            }
            return result;
        };
    }, 0);

    const injectorScript = document.createElement("script");
    injectorScript.textContent = `(${inject})()`;
    (document.body || document.head || document.documentElement).appendChild(injectorScript);
